-- Run once in the Supabase SQL Editor for the Teach4Future project.
-- Then create the administrator in Authentication and add that user's UUID to admin_users.

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.course_sessions (
  id text primary key,
  course_id text not null,
  city_id text not null,
  start_date date not null,
  end_date date not null,
  seats_total integer not null check (seats_total > 0),
  seats_left integer not null check (seats_left between 0 and seats_total),
  status text not null check (status in ('Open', 'Almost Full', 'Waiting List', 'Closed')),
  schedule text not null check (schedule in ('morning', 'afternoon', 'tbc')),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('course', 'europe', 'contact')),
  full_name text not null check (char_length(full_name) between 2 and 160),
  email text not null check (char_length(email) between 5 and 254),
  institution text,
  course_id text,
  session_id text,
  city text,
  topic text,
  preferred_dates text,
  group_size integer check (group_size is null or group_size between 1 and 500),
  country text,
  role text,
  subject text,
  message text check (message is null or char_length(message) <= 4000),
  language text not null default 'en' check (language in ('en', 'es')),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.enquiries add column if not exists privacy_acknowledged_at timestamptz;
alter table public.enquiries add column if not exists source text not null default 'website';
alter table public.enquiries add column if not exists converted_to_service boolean not null default false;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.enquiry_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 1,
  updated_at timestamptz not null default now()
);

create or replace function public.consume_enquiry_rate_limit(
  p_fingerprint text,
  p_limit integer default 5,
  p_window_seconds integer default 900
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if char_length(p_fingerprint) <> 64 or p_limit < 1 or p_window_seconds < 60 then
    return false;
  end if;

  insert into private.enquiry_rate_limits as limits (fingerprint, window_started_at, request_count, updated_at)
  values (p_fingerprint, now(), 1, now())
  on conflict (fingerprint) do update
  set
    window_started_at = case
      when limits.window_started_at < now() - (p_window_seconds * interval '1 second') then now()
      else limits.window_started_at
    end,
    request_count = case
      when limits.window_started_at < now() - (p_window_seconds * interval '1 second') then 1
      else limits.request_count + 1
    end,
    updated_at = now()
  returning request_count into v_count;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.consume_enquiry_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_enquiry_rate_limit(text, integer, integer) to service_role;

create or replace function public.purge_expired_enquiries()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted integer;
begin
  delete from public.enquiries
  where converted_to_service = false
    and created_at < now() - interval '24 months';
  get diagnostics v_deleted = row_count;

  delete from private.enquiry_rate_limits
  where updated_at < now() - interval '1 day';

  return v_deleted;
end;
$$;

revoke all on function public.purge_expired_enquiries() from public, anon, authenticated;
grant execute on function public.purge_expired_enquiries() to service_role;

create extension if not exists pg_cron;
select cron.schedule(
  'teach4future-purge-expired-enquiries',
  '15 3 * * *',
  $$select public.purge_expired_enquiries();$$
);

alter table public.admin_users enable row level security;
alter table public.course_sessions enable row level security;
alter table public.enquiries enable row level security;

revoke all on table public.admin_users, public.course_sessions, public.enquiries from anon, authenticated;
grant select on table public.course_sessions to anon, authenticated;
revoke insert on table public.enquiries from anon, authenticated;
grant select on table public.admin_users to authenticated;
grant insert, update, delete on table public.course_sessions to authenticated;
grant select, update, delete on table public.enquiries to authenticated;

drop policy if exists "Administrators can read their role" on public.admin_users;
drop policy if exists "Course sessions are public" on public.course_sessions;
drop policy if exists "Administrators can insert sessions" on public.course_sessions;
drop policy if exists "Administrators can update sessions" on public.course_sessions;
drop policy if exists "Administrators can delete sessions" on public.course_sessions;
drop policy if exists "Visitors can send enquiries" on public.enquiries;
drop policy if exists "Administrators can read enquiries" on public.enquiries;
drop policy if exists "Administrators can update enquiries" on public.enquiries;
drop policy if exists "Administrators can delete enquiries" on public.enquiries;

create policy "Administrators can read their role"
on public.admin_users for select to authenticated
using ((select auth.uid()) = id);

create policy "Course sessions are public"
on public.course_sessions for select to anon, authenticated
using (true);

create policy "Administrators can insert sessions"
on public.course_sessions for insert to authenticated
with check (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can update sessions"
on public.course_sessions for update to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can delete sessions"
on public.course_sessions for delete to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can read enquiries"
on public.enquiries for select to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can update enquiries"
on public.enquiries for update to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can delete enquiries"
on public.enquiries for delete to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())));

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'course_sessions'
  ) then
    alter publication supabase_realtime add table public.course_sessions;
  end if;
end $$;

-- Live support chat. Visitor access is handled only through the chat-support Edge Function.
create table if not exists public.chat_settings (
  id boolean primary key default true check (id),
  is_available boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.chat_settings (id, is_available)
values (true, false)
on conflict (id) do nothing;

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_token uuid not null unique,
  language text not null default 'en' check (language in ('en', 'es')),
  status text not null default 'open' check (status in ('open', 'closed')),
  last_message_at timestamptz not null default now(),
  last_message_from text not null default 'visitor' check (last_message_from in ('visitor', 'team')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'team')),
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_conversation_created_idx on public.chat_messages(conversation_id, created_at);
create index if not exists chat_conversations_last_message_idx on public.chat_conversations(last_message_at desc);

alter table public.chat_settings enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

revoke all on table public.chat_settings, public.chat_conversations, public.chat_messages from anon, authenticated;
grant select on table public.chat_settings to anon, authenticated;
grant select, update on table public.chat_settings to authenticated;
grant select, update on table public.chat_conversations to authenticated;
grant select, insert on table public.chat_messages to authenticated;

drop policy if exists "Anyone can read chat availability" on public.chat_settings;
drop policy if exists "Administrators can update chat availability" on public.chat_settings;
drop policy if exists "Administrators can read chat conversations" on public.chat_conversations;
drop policy if exists "Administrators can update chat conversations" on public.chat_conversations;
drop policy if exists "Administrators can read chat messages" on public.chat_messages;
drop policy if exists "Administrators can reply in chat" on public.chat_messages;

create policy "Anyone can read chat availability"
on public.chat_settings for select to anon, authenticated
using (true);

create policy "Administrators can update chat availability"
on public.chat_settings for update to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can read chat conversations"
on public.chat_conversations for select to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can update chat conversations"
on public.chat_conversations for update to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can read chat messages"
on public.chat_messages for select to authenticated
using (exists (select 1 from public.admin_users where id = (select auth.uid())));

create policy "Administrators can reply in chat"
on public.chat_messages for insert to authenticated
with check (
  sender = 'team'
  and exists (select 1 from public.admin_users where id = (select auth.uid()))
);
