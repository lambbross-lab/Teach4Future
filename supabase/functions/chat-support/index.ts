import { createClient } from 'jsr:@supabase/supabase-js@2';

type Action = 'availability' | 'start' | 'messages' | 'send';
type Payload = {
  action: Action;
  visitorToken?: string;
  conversationId?: string;
  message?: string;
  language?: 'en' | 'es';
};

const allowedOrigins = new Set([
  'https://teach4-future.vercel.app',
  'https://teach4future.eu',
  'https://www.teach4future.eu',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  ...(Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((value) => value.trim()).filter(Boolean),
]);

const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'https://teach4-future.vercel.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  Vary: 'Origin',
});

const reply = (body: unknown, status: number, origin: string | null) => new Response(JSON.stringify(body), { status, headers: cors(origin) });
const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const fingerprint = async (request: Request) => {
  const input = [Deno.env.get('RATE_LIMIT_SALT') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'teach4future', request.headers.get('x-forwarded-for') || 'unknown', request.headers.get('user-agent') || 'unknown'].join('|');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors(origin) });
  if (request.method !== 'POST') return reply({ error: 'METHOD_NOT_ALLOWED' }, 405, origin);
  if (origin && !allowedOrigins.has(origin)) return reply({ error: 'ORIGIN_NOT_ALLOWED' }, 403, origin);

  let payload: Payload;
  try { payload = await request.json(); } catch { return reply({ error: 'INVALID_JSON' }, 400, origin); }
  if (!['availability', 'start', 'messages', 'send'].includes(payload.action)) return reply({ error: 'INVALID_ACTION' }, 400, origin);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return reply({ error: 'SERVER_NOT_CONFIGURED' }, 503, origin);
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: settings, error: settingsError } = await supabase.from('chat_settings').select('is_available').eq('id', true).single();
  if (settingsError) return reply({ error: 'SERVER_ERROR' }, 500, origin);
  if (payload.action === 'availability') return reply({ available: settings.is_available }, 200, origin);

  if (!uuid(payload.visitorToken)) return reply({ error: 'INVALID_VISITOR' }, 400, origin);
  const { data: allowed, error: rateError } = await supabase.rpc('consume_enquiry_rate_limit', { p_fingerprint: await fingerprint(request), p_limit: 30, p_window_seconds: 900 });
  if (rateError || !allowed) return reply({ error: rateError ? 'SERVER_ERROR' : 'RATE_LIMITED' }, rateError ? 500 : 429, origin);

  if (payload.action === 'start') {
    if (!settings.is_available) return reply({ error: 'UNAVAILABLE' }, 409, origin);
    const language = payload.language === 'es' ? 'es' : 'en';
    const { data: conversation, error } = await supabase
      .from('chat_conversations')
      .upsert({ visitor_token: payload.visitorToken, language, status: 'open', updated_at: new Date().toISOString() }, { onConflict: 'visitor_token' })
      .select('id')
      .single();
    if (error || !conversation) return reply({ error: 'SERVER_ERROR' }, 500, origin);
    const { data: messages, error: messagesError } = await supabase.from('chat_messages').select('id, sender, content, created_at').eq('conversation_id', conversation.id).order('created_at');
    if (messagesError) return reply({ error: 'SERVER_ERROR' }, 500, origin);
    return reply({ conversationId: conversation.id, messages }, 200, origin);
  }

  if (!uuid(payload.conversationId)) return reply({ error: 'INVALID_CONVERSATION' }, 400, origin);
  const { data: conversation, error: conversationError } = await supabase.from('chat_conversations').select('id, status').eq('id', payload.conversationId).eq('visitor_token', payload.visitorToken).maybeSingle();
  if (conversationError || !conversation) return reply({ error: 'NOT_FOUND' }, 404, origin);

  if (payload.action === 'messages') {
    const { data: messages, error } = await supabase.from('chat_messages').select('id, sender, content, created_at').eq('conversation_id', conversation.id).order('created_at');
    return error ? reply({ error: 'SERVER_ERROR' }, 500, origin) : reply({ messages }, 200, origin);
  }

  const message = typeof payload.message === 'string' ? payload.message.trim().slice(0, 1000) : '';
  if (!settings.is_available || conversation.status !== 'open') return reply({ error: 'UNAVAILABLE' }, 409, origin);
  if (!message) return reply({ error: 'INVALID_MESSAGE' }, 400, origin);
  const now = new Date().toISOString();
  const { data: created, error: createError } = await supabase.from('chat_messages').insert({ conversation_id: conversation.id, sender: 'visitor', content: message }).select('id, sender, content, created_at').single();
  if (createError || !created) return reply({ error: 'SERVER_ERROR' }, 500, origin);
  await supabase.from('chat_conversations').update({ last_message_at: now, last_message_from: 'visitor', updated_at: now }).eq('id', conversation.id);
  return reply({ message: created }, 201, origin);
});
