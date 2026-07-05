-- ─────────────────────────────────────────────────────────────────────────────
-- NavSafar — packages / blogs / contacts tables
-- Run this ONCE in Supabase Dashboard → SQL Editor.
--
-- Design: har record ka poora object `data jsonb` me store hota hai (nested
-- shapes — itinerary, structuredContent, author — exactly preserve). Kuch
-- columns queryable/order ke liye alag rakhe gaye hain.
--
-- RLS:
--   packages / blogs  → public READ allowed (anon), writes sirf service role.
--   contacts          → koi public read/write nahi; sab kuch service role se
--                       (admin route + contact-form route service client use karte hain).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── PACKAGES ─────────────────────────────────────────────────────────────────
create table if not exists public.packages (
  id          text primary key,
  city        text,
  country     text,
  popular     boolean default false,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists packages_city_idx    on public.packages (city);
create index if not exists packages_popular_idx  on public.packages (popular);
create index if not exists packages_created_idx  on public.packages (created_at desc);

alter table public.packages enable row level security;

drop policy if exists "packages public read" on public.packages;
create policy "packages public read"
  on public.packages for select
  using (true);

-- ── BLOGS ────────────────────────────────────────────────────────────────────
create table if not exists public.blogs (
  id            text primary key,
  slug          text unique not null,
  category      text,
  status        text default 'published',
  featured      boolean default false,
  published_at  text,
  data          jsonb not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists blogs_slug_idx     on public.blogs (slug);
create index if not exists blogs_status_idx   on public.blogs (status);
create index if not exists blogs_created_idx  on public.blogs (created_at desc);

alter table public.blogs enable row level security;

drop policy if exists "blogs public read" on public.blogs;
create policy "blogs public read"
  on public.blogs for select
  using (true);

-- ── CONTACTS ─────────────────────────────────────────────────────────────────
-- No public policies → anon cannot read/write. Only the service-role key
-- (used server-side by the API routes) can touch this table.
create table if not exists public.contacts (
  id          text primary key,
  status      text default 'pending',
  priority    text default 'normal',
  data        jsonb not null,
  created_at  timestamptz not null default now()
);
create index if not exists contacts_created_idx on public.contacts (created_at desc);
create index if not exists contacts_status_idx  on public.contacts (status);

alter table public.contacts enable row level security;
