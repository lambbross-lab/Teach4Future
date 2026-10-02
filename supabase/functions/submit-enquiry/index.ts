import { createClient } from 'jsr:@supabase/supabase-js@2';

type EnquiryKind = 'course' | 'europe' | 'contact';

interface EnquiryPayload {
  kind: EnquiryKind;
  fullName: string;
  email: string;
  institution?: string;
  courseId?: string;
  sessionId?: string;
  city?: string;
  topic?: string;
  preferredDates?: string;
  groupSize?: number;
  country?: string;
  role?: string;
  participantsCount?: number;
  subject?: string;
  message?: string;
  notes?: string;
  language: 'en' | 'es';
  privacyAccepted: boolean;
  website?: string;
}

const defaultOrigins = [
  'https://teach4-future.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
];

const allowedOrigins = new Set([
  ...defaultOrigins,
  ...(Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((value) => value.trim()).filter(Boolean),
]);

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : defaultOrigins[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
});

const json = (body: unknown, status: number, origin: string | null) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' },
});

const clean = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
};

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const fingerprint = async (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const salt = Deno.env.get('RATE_LIMIT_SALT') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'teach4future';
  const bytes = new TextEncoder().encode(`${salt}|${forwarded}|${userAgent}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');

  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(origin) });
  }
  if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405, origin);
  if (origin && !allowedOrigins.has(origin)) return json({ error: 'ORIGIN_NOT_ALLOWED' }, 403, origin);

  let payload: EnquiryPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'INVALID_JSON' }, 400, origin);
  }

  // Bots commonly fill every input. Return a neutral success without storing anything.
  if (clean(payload.website, 200)) return json({ success: true }, 200, origin);
  if (payload.privacyAccepted !== true) return json({ error: 'CONSENT_REQUIRED' }, 400, origin);
  if (!['course', 'europe', 'contact'].includes(payload.kind)) return json({ error: 'INVALID_KIND' }, 400, origin);
  if (!['en', 'es'].includes(payload.language)) return json({ error: 'INVALID_LANGUAGE' }, 400, origin);

  const fullName = clean(payload.fullName, 160);
  const email = clean(payload.email, 254)?.toLowerCase() || null;
  if (!fullName || fullName.length < 2 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'INVALID_CONTACT' }, 400, origin);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json({ error: 'SERVER_NOT_CONFIGURED' }, 503, origin);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const requestFingerprint = await fingerprint(request);
  const { data: allowed, error: rateError } = await supabase.rpc('consume_enquiry_rate_limit', {
    p_fingerprint: requestFingerprint,
    p_limit: 5,
    p_window_seconds: 900,
  });
  if (rateError) {
    console.error('Rate limit check failed', rateError.message);
    return json({ error: 'SERVER_ERROR' }, 500, origin);
  }
  if (!allowed) return json({ error: 'RATE_LIMITED' }, 429, origin);

  const groupSize = payload.groupSize ?? payload.participantsCount ?? null;
  if (groupSize !== null && (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 500)) {
    return json({ error: 'INVALID_GROUP_SIZE' }, 400, origin);
  }

  const record = {
    kind: payload.kind,
    full_name: fullName,
    email,
    institution: clean(payload.institution, 200),
    course_id: clean(payload.courseId, 100),
    session_id: clean(payload.sessionId, 100),
    city: clean(payload.city, 160),
    topic: clean(payload.topic, 160),
    preferred_dates: clean(payload.preferredDates, 500),
    group_size: groupSize,
    country: clean(payload.country, 100),
    role: clean(payload.role, 160),
    subject: clean(payload.subject, 160),
    message: clean(payload.message || payload.notes, 4000),
    language: payload.language,
    privacy_acknowledged_at: new Date().toISOString(),
    source: 'website',
  };

  const { data: enquiry, error: insertError } = await supabase
    .from('enquiries')
    .insert(record)
    .select('id, created_at')
    .single();
  if (insertError) {
    console.error('Enquiry insert failed', insertError.message);
    return json({ error: 'SERVER_ERROR' }, 500, origin);
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const notificationTo = Deno.env.get('NOTIFICATION_TO');
  const resendFrom = Deno.env.get('RESEND_FROM');
  let emailSent = false;

  if (resendApiKey && notificationTo && resendFrom) {
    const details = [
      ['Type', payload.kind],
      ['Name / school', fullName],
      ['Email', email],
      ['Institution', record.institution],
      ['Course', record.course_id],
      ['City', record.city],
      ['Topic', record.topic],
      ['Preferred dates', record.preferred_dates],
      ['Group size', groupSize?.toString() || null],
      ['Subject', record.subject],
      ['Message', record.message],
    ].filter((entry): entry is [string, string] => Boolean(entry[1]));

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [notificationTo],
        reply_to: email,
        subject: `New Teach4Future enquiry: ${payload.kind}`,
        html: `<h2>New Teach4Future enquiry</h2><p>Reference: ${escapeHtml(enquiry.id)}</p><table>${details.map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value).replaceAll('\n', '<br>')}</td></tr>`).join('')}</table>`,
      }),
    });
    emailSent = emailResponse.ok;
    if (!emailResponse.ok) console.error('Notification email failed', emailResponse.status);
  }

  return json({ success: true, emailSent }, 201, origin);
});
