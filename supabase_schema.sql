-- ========================================================
--  BioVerse Database Schema Migration
--  Target: Supabase PostgreSQL Database
-- ========================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- Drop existing triggers and functions if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.get_user_role(uuid);

-- --------------------------------------------------------
--  1. USERS TABLE
-- --------------------------------------------------------
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null default '',
  email text not null,
  phone text not null default '',
  class text not null default '1st PU',
  subscription_plan text not null default 'free',
  subscription_status text not null default 'inactive',
  role text not null default 'student',
  xp integer not null default 0,
  streak integer not null default 0,
  last_active timestamp with time zone default now(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Helper function to fetch user role securely and avoid RLS recursion
create or replace function public.get_user_role(user_id uuid)
returns text
security definer
set search_path = public
language sql
stable
as $$
  select role from public.users where id = user_id;
$$;

-- Trigger to automatically insert a public.users row when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.users (id, full_name, email, phone, class, subscription_plan, subscription_status, role, xp, streak)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'class', '1st PU'),
    'free',
    'active',
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    0,
    0
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- --------------------------------------------------------
--  2. SYLLABUS LAYERS (UNITS, CHAPTERS, CONCEPTS)
-- --------------------------------------------------------
create table if not exists public.units (
  id text primary key,
  name text not null,
  description text,
  order_number integer not null default 0,
  class_id text not null default 'pu1', -- 'pu1' or 'pu2'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.chapters (
  id text primary key,
  unit_id text references public.units(id) on delete cascade not null,
  chapter_name text not null,
  description text,
  order_number integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.concepts (
  id text primary key,
  chapter_id text references public.chapters(id) on delete cascade not null,
  concept_name text not null,
  description text,
  order_number integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------
--  3. CONTENT TABLES (VIDEOS, NOTES)
-- --------------------------------------------------------
create table if not exists public.videos (
  id text primary key,
  concept_id text references public.concepts(id) on delete cascade not null,
  title text not null,
  youtube_url text not null,
  description text,
  duration integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.notes (
  id text primary key,
  concept_id text references public.concepts(id) on delete cascade not null,
  title text not null,
  pdf_url text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------
--  4. QUESTIONS AND TESTS
-- --------------------------------------------------------
create table if not exists public.questions (
  id text primary key,
  chapter_id text references public.chapters(id) on delete cascade not null,
  concept_id text references public.concepts(id) on delete cascade,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer integer not null,
  explanation text,
  exam_type text check (exam_type in ('PU', 'KCET', 'NEET')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.tests (
  id text primary key,
  chapter_id text references public.chapters(id) on delete cascade,
  title text not null,
  description text,
  time_limit integer not null default 30, -- minutes
  total_questions integer not null default 0,
  class_id text, -- 'pu1' or 'pu2'
  test_type text not null default 'chapter', -- 'chapter', 'unit', 'mock', 'kcet'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id text references public.tests(id) on delete cascade not null,
  question_id text references public.questions(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(test_id, question_id)
);

-- --------------------------------------------------------
--  5. RESULTS AND PROGRESS
-- --------------------------------------------------------
create table if not exists public.results (
  id text primary key,
  student_id uuid references public.users(id) on delete cascade not null,
  test_id text references public.tests(id) on delete cascade not null,
  score integer not null,
  accuracy integer not null,
  time_taken integer not null, -- in seconds
  answers jsonb not null default '{}'::jsonb, -- Store question response mapping
  total_questions integer not null default 0,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  unattempted_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade not null,
  concept_id text references public.concepts(id) on delete cascade not null,
  video_completed boolean not null default false,
  notes_completed boolean not null default false,
  test_completed boolean not null default false,
  progress_percentage numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, concept_id)
);

-- --------------------------------------------------------
--  6. PAYMENTS AND SUBSCRIPTIONS
-- --------------------------------------------------------
create table if not exists public.subscriptions (
  id text primary key,
  student_id uuid references public.users(id) on delete cascade not null,
  plan_name text not null,
  start_date timestamp with time zone not null,
  expiry_date timestamp with time zone not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.payments (
  id text primary key,
  student_id uuid references public.users(id) on delete cascade not null,
  razorpay_payment_id text not null,
  amount numeric not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------
--  7. NOTIFICATIONS
-- --------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --------------------------------------------------------
--  8. COMMUNITY POSTS (PHASE 6 RETENTION FEATURE)
-- --------------------------------------------------------
create table if not exists public.community_posts (
  id text primary key,
  author_id uuid references public.users(id) on delete cascade not null,
  author_name text not null,
  author_role text not null,
  author_badge text,
  category text not null,
  title text not null,
  content text not null,
  upvotes integer not null default 0,
  upvoted_by jsonb default '[]'::jsonb not null,
  comments jsonb default '[]'::jsonb not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
--  ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.units enable row level security;
alter table public.chapters enable row level security;
alter table public.concepts enable row level security;
alter table public.videos enable row level security;
alter table public.notes enable row level security;
alter table public.questions enable row level security;
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.results enable row level security;
alter table public.progress enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.community_posts enable row level security;

-- 1. USERS POLICIES
create policy "Allow select for self or staff" on public.users
  for select using (auth.uid() = id or public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

create policy "Allow insert for auth trigger" on public.users
  for insert with check (true);

create policy "Allow update for self or admins" on public.users
  for update using (auth.uid() = id or public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

create policy "Allow delete for admins" on public.users
  for delete using (public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

-- 2. UNITS, CHAPTERS, CONCEPTS, VIDEOS, NOTES, QUESTIONS, TESTS, TEST_QUESTIONS POLICIES
create policy "Allow read for all authenticated users" on public.units for select using (auth.uid() is not null);
create policy "Allow read for all authenticated users" on public.chapters for select using (auth.uid() is not null);
create policy "Allow read for all authenticated users" on public.concepts for select using (auth.uid() is not null);
create policy "Allow read for all authenticated users" on public.videos for select using (auth.uid() is not null);
create policy "Allow read for all authenticated users" on public.notes for select using (auth.uid() is not null);
create policy "Allow read for all authenticated users" on public.questions for select using (auth.uid() is not null);
create policy "Allow read for all authenticated users" on public.tests for select using (auth.uid() is not null);
create policy "Allow read for all authenticated users" on public.test_questions for select using (auth.uid() is not null);

-- Write/Modify access: Only staff (admin, super_admin, content_manager, teacher)
create policy "Allow modify for staff" on public.units
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

create policy "Allow modify for staff" on public.chapters
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

create policy "Allow modify for staff" on public.concepts
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

create policy "Allow modify for staff" on public.videos
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

create policy "Allow modify for staff" on public.notes
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

create policy "Allow modify for staff" on public.questions
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

create policy "Allow modify for staff" on public.tests
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

create policy "Allow modify for staff" on public.test_questions
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager', 'teacher'));

-- 3. RESULTS POLICIES
create policy "Allow read results for self or staff" on public.results
  for select using (auth.uid() = student_id or public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'teacher'));

create policy "Allow insert results for self" on public.results
  for insert with check (auth.uid() = student_id);

create policy "Allow all actions on results for admins" on public.results
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

-- 4. PROGRESS POLICIES
create policy "Allow read progress for self or staff" on public.progress
  for select using (auth.uid() = student_id or public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'teacher'));

create policy "Allow insert progress for self" on public.progress
  for insert with check (auth.uid() = student_id);

create policy "Allow update progress for self" on public.progress
  for update using (auth.uid() = student_id);

create policy "Allow all actions on progress for admins" on public.progress
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

-- 5. SUBSCRIPTIONS POLICIES
create policy "Allow read subscription for self or admins" on public.subscriptions
  for select using (auth.uid() = student_id or public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

create policy "Allow all actions on subscriptions for admins" on public.subscriptions
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

-- 6. PAYMENTS POLICIES
create policy "Allow read payments for self or admins" on public.payments
  for select using (auth.uid() = student_id or public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

create policy "Allow insert payments for self" on public.payments
  for insert with check (auth.uid() = student_id);

create policy "Allow all actions on payments for admins" on public.payments
  for all using (public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

-- 7. NOTIFICATIONS POLICIES
create policy "Allow read notifications for self or admins" on public.notifications
  for select using (auth.uid() = student_id or public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

create policy "Allow update notifications (mark as read) for self" on public.notifications
  for update using (auth.uid() = student_id);

create policy "Allow insert notifications for staff" on public.notifications
  for insert with check (public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'teacher'));

create policy "Allow delete notifications for admins" on public.notifications
  for delete using (public.get_user_role(auth.uid()) in ('admin', 'super_admin'));

-- 8. COMMUNITY POSTS POLICIES
create policy "Allow read community posts for all authenticated users" on public.community_posts
  for select using (auth.uid() is not null);

create policy "Allow insert community posts for all authenticated users" on public.community_posts
  for insert with check (auth.uid() is not null and auth.uid() = author_id);

create policy "Allow update community posts for author or admins" on public.community_posts
  for update using (auth.uid() = author_id or public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager'));

create policy "Allow delete community posts for author or admins" on public.community_posts
  for delete using (auth.uid() = author_id or public.get_user_role(auth.uid()) in ('admin', 'super_admin', 'content_manager'));
