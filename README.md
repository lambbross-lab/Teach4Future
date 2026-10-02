# Teach4Future Academy

Bilingual Erasmus+ teacher-training website built with React, TypeScript and Vite.

## Public experience

- English and Spanish interface with an accessible flag selector.
- Course catalogue, detail pages, cities and dates/availability.
- Information-request flow: submitting a form does not claim to reserve or charge for a place.
- Tailor-made Spanish-language training in a European city chosen by the school.

## Live dates and enquiries

Without the Supabase environment variables, the website works in preview mode and shows no invented dates or availability. For live operation with the existing Teach4Future project:

1. Review and run `supabase/setup.sql` in its SQL Editor. It creates or updates the tables, removes public direct inserts, adds server-side rate limiting and schedules deletion of unsuccessful enquiries after 24 months.
2. Create the administrator under Authentication.
3. Add the administrator UUID to `public.admin_users`.
4. Deploy the `submit-enquiry` Edge Function in `supabase/functions/submit-enquiry`.
5. Configure its secrets using `supabase/functions/.env.example`. Resend notifications require a Resend API key and an authorised sender; never put these values in a `VITE_` variable.
6. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to Vercel, using `.env.example` as a guide.
7. Sign in at `/login` and add the first real course sessions in the dashboard.

The public site then reads course sessions from Supabase and refreshes them through Realtime. Public visitors submit enquiries through the Edge Function, which requires acknowledgement of the privacy notice, ignores the honeypot, limits repeated submissions and stores the request with its acknowledgement timestamp. Direct anonymous inserts are disabled. Only an authenticated administrator listed in `admin_users` can edit sessions or read enquiries.

When the Resend secrets are configured, each accepted enquiry sends a notification to `teach4futureacademy@gmail.com`. A notification failure does not discard the stored enquiry, so it remains available to the administrator.

Never expose a Supabase secret or `service_role` key in a `VITE_` environment variable.

## Local validation

```bash
npm install
npm run lint
npm run build
npm run dev
```
