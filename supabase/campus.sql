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
-- Accounts and password-setup links are created by the edge function campus-admin (admin only).

-- Called only by the Edge Function's service role. Locking the edition row makes the
-- enrolment and seat change atomic, so public availability cannot be oversold.
create or replace function public.confirm_campus_enrollment(
  p_session_id text,
  p_user_id uuid,
  p_full_name text,
  p_email text,
  p_access_until date
) returns public.campus_enrollments
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_session public.course_sessions%rowtype;
  v_enrollment public.campus_enrollments%rowtype;
begin
  select * into v_session from public.course_sessions where id = p_session_id for update;
  if not found then
    raise exception 'session_not_found';
  end if;

  select * into v_enrollment from public.campus_enrollments
  where session_id = p_session_id and user_id = p_user_id;

  if found then
    update public.campus_enrollments
    set full_name = p_full_name, email = p_email, access_until = p_access_until
    where id = v_enrollment.id
    returning * into v_enrollment;
    return v_enrollment;
  end if;

  if v_session.seats_left <= 0 then
    raise exception 'no_seats_left';
  end if;

  insert into public.campus_enrollments (session_id, user_id, full_name, email, access_until)
  values (p_session_id, p_user_id, p_full_name, p_email, p_access_until)
  returning * into v_enrollment;

  update public.course_sessions
  set seats_left = seats_left - 1, updated_at = now()
  where id = p_session_id;

  return v_enrollment;
end;
$$;

revoke all on function public.confirm_campus_enrollment(text, uuid, text, text, date) from public, anon, authenticated;
grant execute on function public.confirm_campus_enrollment(text, uuid, text, text, date) to service_role;

create or replace function public.remove_campus_enrollment(p_enrollment_id uuid)
returns boolean
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_enrollment public.campus_enrollments%rowtype;
begin
  select * into v_enrollment from public.campus_enrollments where id = p_enrollment_id;
  if not found then
    raise exception 'enrollment_not_found';
  end if;

  perform 1 from public.course_sessions where id = v_enrollment.session_id for update;
  delete from public.campus_enrollments where id = p_enrollment_id returning * into v_enrollment;
  if not found then
    raise exception 'enrollment_not_found';
  end if;
  update public.course_sessions
  set seats_left = least(seats_left + 1, seats_total), updated_at = now()
  where id = v_enrollment.session_id;
  return true;
end;
$$;

revoke all on function public.remove_campus_enrollment(uuid) from public, anon, authenticated;
grant execute on function public.remove_campus_enrollment(uuid) to service_role;
