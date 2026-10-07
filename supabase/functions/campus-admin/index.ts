import { createClient } from 'jsr:@supabase/supabase-js@2';

const allowedOrigins = new Set([
  'https://www.teach4future.eu',
  'https://teach4future.eu',
  'https://teach4-future.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
]);

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'https://www.teach4future.eu',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
});

const json = (body: unknown, status: number, origin: string | null) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' },
});

const clean = (value: unknown, max: number) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
};

const randomFrom = (alphabet: string, length: number) => {
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join('');
};

// Readable temporary password with upper, lower, digit and symbol, e.g. "Kmrt-7qwe-Hz4p!"
const temporaryPassword = () => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const mixed = upper + lower + digits;
  return `${randomFrom(upper, 1)}${randomFrom(lower, 3)}-${randomFrom(digits, 1)}${randomFrom(mixed, 3)}-${randomFrom(mixed, 4)}${randomFrom('!?#*', 1)}`;
};

const campusPasswordRedirect = () => Deno.env.get('CAMPUS_PASSWORD_REDIRECT') ?? 'https://www.teach4future.eu/reset-password';

const addMonths = (isoDate: string, months: number) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, day));
  return date.toISOString().slice(0, 10);
};

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, origin);

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'unauthorized' }, 401, origin);
  const { data: caller, error: callerError } = await admin.auth.getUser(token);
  if (callerError || !caller.user) return json({ error: 'unauthorized' }, 401, origin);
  const { data: adminRow } = await admin.from('admin_users').select('id').eq('id', caller.user.id).maybeSingle();
  if (!adminRow) return json({ error: 'forbidden' }, 403, origin);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400, origin);
  }

  const action = clean(body.action, 40);

  if (action === 'enroll') {
    const sessionId = clean(body.sessionId, 120);
    const fullName = clean(body.fullName, 160);
    const email = clean(body.email, 254)?.toLowerCase() ?? null;
    if (!sessionId || !fullName || fullName.length < 2 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'invalid_input' }, 400, origin);
    }

    const { data: session } = await admin.from('course_sessions').select('id, end_date').eq('id', sessionId).maybeSingle();
    if (!session) return json({ error: 'session_not_found' }, 404, origin);

    // Look for an existing account with this e-mail (small user base: scan pages).
    let userId: string | null = null;
    for (let page = 1; page <= 20 && !userId; page += 1) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) return json({ error: 'lookup_failed' }, 500, origin);
      const match = data.users.find((user) => user.email?.toLowerCase() === email);
      if (match) userId = match.id;
      if (data.users.length < 200) break;
    }

    let tempPassword: string | null = null;
    let createdUserId: string | null = null;
    if (!userId) {
      tempPassword = temporaryPassword();
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: 'participant' },
      });
      if (createError || !created.user) return json({ error: 'create_failed', detail: createError?.message }, 500, origin);
      userId = created.user.id;
      createdUserId = created.user.id;
    }

    // The SQL function locks the edition row and decrements seats_left only for a new enrolment.
    // This avoids overbooking when two administrators add participants at the same time.
    const { data: enrollment, error: enrollError } = await admin.rpc('confirm_campus_enrollment', {
      p_session_id: sessionId,
      p_user_id: userId,
      p_full_name: fullName,
      p_email: email,
      p_access_until: addMonths(session.end_date, 12),
    }).single();
    if (enrollError) {
      if (createdUserId) await admin.auth.admin.deleteUser(createdUserId);
      const code = enrollError.message.includes('no_seats_left') ? 'no_seats_left' : 'enroll_failed';
      return json({ error: code }, code === 'no_seats_left' ? 409 : 500, origin);
    }

    let emailSent = false;
    if (createdUserId) {
      const { error: emailError } = await admin.auth.resetPasswordForEmail(email, { redirectTo: campusPasswordRedirect() });
      // A temporary password is only a delivery fallback, shown once to the administrator.
      emailSent = !emailError;
    }

    return json({ enrollment, tempPassword: emailSent ? null : tempPassword, emailSent, existingAccount: !createdUserId }, 200, origin);
  }

  if (action === 'reset_password') {
    const userId = clean(body.userId, 64);
    if (!userId) return json({ error: 'invalid_input' }, 400, origin);
    const { data: isAdminTarget } = await admin.from('admin_users').select('id').eq('id', userId).maybeSingle();
    if (isAdminTarget) return json({ error: 'forbidden' }, 403, origin);
    const { data: enrolled } = await admin.from('campus_enrollments').select('id, email').eq('user_id', userId).limit(1).maybeSingle();
    if (!enrolled) return json({ error: 'not_participant' }, 404, origin);
    const { error } = await admin.auth.resetPasswordForEmail(enrolled.email, { redirectTo: campusPasswordRedirect() });
    if (error) return json({ error: 'reset_failed' }, 500, origin);
    return json({ emailSent: true }, 200, origin);
  }

  if (action === 'remove_enrollment') {
    const enrollmentId = clean(body.enrollmentId, 64);
    if (!enrollmentId) return json({ error: 'invalid_input' }, 400, origin);
    const { error } = await admin.rpc('remove_campus_enrollment', { p_enrollment_id: enrollmentId });
    if (error) return json({ error: 'remove_failed' }, 500, origin);
    return json({ removed: true }, 200, origin);
  }

  return json({ error: 'unknown_action' }, 400, origin);
});
