-- Campus Teach4Future (applied to the live project on 2026-10-07).
-- Participants only see materials of the courses they are enrolled in, until access_until.

create table if not exists public.campus_enrollments (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.course_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 160),
  email text not null check (char_length(email) between 5 and 254),
  access_until date not null,
  created_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create table if not exists public.campus_materials (
  id uuid primary key default gen_random_uuid(),
  course_id text not null,
  day smallint not null default 0 check (day between 0 and 5),
  title text not null,
  description text,
  kind text not null check (kind in ('file','link')),
  url text check (url is null or url ~ '^https://'),
  storage_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check ((kind = 'file' and storage_path is not null) or (kind = 'link' and url is not null))
);

create schema if not exists app_private;
grant usage on schema app_private to authenticated;

create or replace function app_private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users where id = (select auth.uid()));
$$;

create or replace function app_private.campus_course_ids() returns setof text
language sql stable security definer set search_path = '' as $$
  select distinct cs.course_id from public.campus_enrollments e
  join public.course_sessions cs on cs.id = e.session_id
  where e.user_id = (select auth.uid()) and e.access_until >= current_date;
$$;

-- RLS: participants read their own enrollments and their courses' materials; only admins write.
-- Storage bucket "campus" (private, 50 MB per file). Files are stored as <course_id>/<uuid>-<name>.
-- Accounts are created by the edge function campus-admin (admin only) with a temporary password.
