-- ╔══════════════════════════════════════════════════════════════╗
-- ║  NavSafar — Supabase complete table setup                   ║
-- ║  Run in: Supabase Dashboard → SQL Editor → Run              ║
-- ║  Tables already exist hain to sirf missing ones create hongi║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── 1. search_leads ──────────────────────────────────────────
create table if not exists search_leads (
  id           uuid default gen_random_uuid() primary key,
  first_name   text not null,
  last_name    text default '',
  email        text default '',
  mobile       text not null default '0000000000',
  from_city    text default '',
  destination  text default '',
  travel_date  date,
  persons      int  default 1,
  status       text default 'new',  -- new | contacted | search_query
  source       text default 'search_popup', -- search_popup | search_bar
  ip           text default '',
  created_at   timestamptz default now()
);

create index if not exists search_leads_status_idx on search_leads (status);
create index if not exists search_leads_created_idx on search_leads (created_at desc);

alter table search_leads enable row level security;
create policy "Service role full access" on search_leads
  for all using (auth.role() = 'service_role');

-- ── 2. visitors ───────────────────────────────────────────────
create table if not exists visitors (
  id         uuid default gen_random_uuid() primary key,
  page       text,
  referrer   text,
  ip         text,
  country    text,
  region     text,
  city       text,
  isp        text,
  device     text,
  browser    text,
  os         text,
  screen     text,
  language   text,
  timezone   text,
  session_id text,
  created_at timestamptz default now()
);

create index if not exists visitors_created_idx on visitors (created_at desc);
create index if not exists visitors_page_idx    on visitors (page);

alter table visitors enable row level security;
create policy "Service role full access" on visitors
  for all using (auth.role() = 'service_role');

-- ── 3. blogs (agar nahi bani already) ────────────────────────
create table if not exists blogs (
  id                 uuid default gen_random_uuid() primary key,
  slug               text not null unique,
  title              text not null,
  excerpt            text default '',
  cover_image        text default '/assets/bg.jpg',
  category           text default 'General',
  tags               text[] default '{}',
  author             jsonb default '{"name":"NavSafar Travels","avatar":"/assets/logo.jpeg","designation":"Travel Expert"}',
  published_at       date default current_date,
  read_time          text default '3 min read',
  featured           boolean default false,
  status             text default 'draft',
  content            text default '',
  structured_content jsonb default '{}',
  destination        jsonb default '{}',
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create index if not exists blogs_slug_idx   on blogs (slug);
create index if not exists blogs_status_idx on blogs (status);
create index if not exists blogs_cat_idx    on blogs (category);

alter table blogs enable row level security;
create policy "Public read published blogs" on blogs
  for select using (status = 'published');
create policy "Service role full access on blogs" on blogs
  for all using (auth.role() = 'service_role');

-- ── 4. Auto updated_at trigger (blogs) ───────────────────────
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists set_updated_at on blogs;
create trigger set_updated_at before update on blogs
  for each row execute function update_updated_at_column();

-- ── 5. contacts — RLS check (already exists) ─────────────────
-- Ensure service role can write (contacts table already created by you)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'contacts' and policyname = 'Service role full access on contacts'
  ) then
    execute 'create policy "Service role full access on contacts" on contacts for all using (auth.role() = ''service_role'')';
  end if;
end $$;

-- ── 6. packages — RLS check ───────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'packages' and policyname = 'Public read packages'
  ) then
    execute 'create policy "Public read packages" on packages for select using (true)';
    execute 'create policy "Service role full access on packages" on packages for all using (auth.role() = ''service_role'')';
  end if;
end $$;
