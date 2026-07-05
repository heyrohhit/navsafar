-- ╔══════════════════════════════════════════════════════════════╗
-- ║  NavSafar — User accounts, profiles, bookings                 ║
-- ║  + base tables (testimonials, search_leads) ensure/heal       ║
-- ║  Run in: Supabase Dashboard → SQL Editor → Run (idempotent)  ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Shared helper: auto updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ══════════════════════════════════════════════════════════════
-- A. TESTIMONIALS — ensure table exists (warna alter fail hota hai)
-- ══════════════════════════════════════════════════════════════
create table if not exists testimonials (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  avatar      text default null,
  rating      integer not null check (rating >= 1 and rating <= 5),
  review      text not null,
  trip        text not null,
  location    text default '',
  travel_date text default '',
  email       text default '',
  phone       text default '',
  is_approved boolean default false,
  is_featured boolean default false,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- review ko logged-in user se link karo
alter table testimonials
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists testimonials_user_idx     on testimonials (user_id);
create index if not exists testimonials_approved_idx on testimonials (is_approved);
create index if not exists testimonials_created_idx  on testimonials (created_at desc);

alter table testimonials enable row level security;

-- Approved sabko, apne (pending bhi) khud ko, service role ko sab
drop policy if exists "Testimonials read" on testimonials;
create policy "Testimonials read" on testimonials
  for select using (
    is_approved = true
    or auth.uid() = user_id
    or auth.role() = 'service_role'
  );

-- Koi bhi (public form ya logged-in user) pending review submit kar sake
drop policy if exists "Submit pending testimonial" on testimonials;
create policy "Submit pending testimonial" on testimonials
  for insert with check (is_approved = false);

drop policy if exists "Service role manage testimonials" on testimonials;
create policy "Service role manage testimonials" on testimonials
  for all using (auth.role() = 'service_role');

drop trigger if exists testimonials_set_updated_at on testimonials;
create trigger testimonials_set_updated_at before update on testimonials
  for each row execute function set_updated_at();

-- ══════════════════════════════════════════════════════════════
-- B. SEARCH_LEADS — correct schema ensure/heal (API isi ko use karta hai)
--    Purana `email_enc` wala schema ho to bhi missing columns add ho jaayenge
-- ══════════════════════════════════════════════════════════════
create table if not exists search_leads (
  id           uuid default gen_random_uuid() primary key,
  first_name   text not null default '',
  last_name    text default '',
  email        text default '',
  mobile       text not null default '0000000000',
  from_city    text default '',
  destination  text default '',
  travel_date  date,
  persons      int  default 1,
  status       text default 'new',           -- new | contacted | search_query
  source       text default 'search_popup',  -- search_popup | search_bar
  ip           text default '',
  created_at   timestamptz default now()
);

-- Heal an older/partial table by adding any missing columns
alter table search_leads add column if not exists first_name  text not null default '';
alter table search_leads add column if not exists last_name   text default '';
alter table search_leads add column if not exists email       text default '';
alter table search_leads add column if not exists mobile      text not null default '0000000000';
alter table search_leads add column if not exists from_city   text default '';
alter table search_leads add column if not exists destination text default '';
alter table search_leads add column if not exists travel_date date;
alter table search_leads add column if not exists persons     int default 1;
alter table search_leads add column if not exists status      text default 'new';
alter table search_leads add column if not exists source      text default 'search_popup';
alter table search_leads add column if not exists ip          text default '';

create index if not exists search_leads_status_idx  on search_leads (status);
create index if not exists search_leads_created_idx on search_leads (created_at desc);

alter table search_leads enable row level security;
-- API service role se likhti hai (RLS bypass), par policy rakhna safe hai
drop policy if exists "Service role manage search leads" on search_leads;
create policy "Service role manage search leads" on search_leads
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════
-- C. PROFILES — har auth user ka profile (signup pe auto-create)
-- ══════════════════════════════════════════════════════════════
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text default '',
  phone      text default '',
  city       text default '',
  avatar     text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);

drop policy if exists "Users update own profile" on profiles;
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users insert own profile" on profiles;
create policy "Users insert own profile" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Service role full access on profiles" on profiles;
create policy "Service role full access on profiles" on profiles
  for all using (auth.role() = 'service_role');

-- Auto-create profile on signup (metadata se full_name/phone)
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at before update on profiles
  for each row execute function set_updated_at();

-- ══════════════════════════════════════════════════════════════
-- D. BOOKINGS — user ki bookings/enquiries
-- ══════════════════════════════════════════════════════════════
create table if not exists bookings (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  full_name       text default '',
  phone           text default '',
  email           text default '',
  departure_city  text default '',
  destination     text default '',
  trip_category   text default '',
  travel_type     text default '',
  travel_date     date,
  nights          int,
  travellers      int,
  hotel_category  text default '',
  services        jsonb default '[]',
  budget          text default '',
  message         text default '',
  status          text default 'enquiry',  -- enquiry | confirmed | completed | cancelled
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists bookings_user_idx    on bookings (user_id);
create index if not exists bookings_status_idx  on bookings (status);
create index if not exists bookings_created_idx on bookings (created_at desc);

alter table bookings enable row level security;

drop policy if exists "Users read own bookings" on bookings;
create policy "Users read own bookings" on bookings
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own bookings" on bookings;
create policy "Users insert own bookings" on bookings
  for insert with check (auth.uid() = user_id);

drop policy if exists "Service role full access on bookings" on bookings;
create policy "Service role full access on bookings" on bookings
  for all using (auth.role() = 'service_role');

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at before update on bookings
  for each row execute function set_updated_at();

-- ✅ DONE — testimonials, search_leads, profiles, bookings ready.
