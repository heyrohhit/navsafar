-- ============================================================================
-- NavSafar Supabase Migration Script
-- Run this in Supabase SQL Editor to create all required tables
-- ============================================================================

-- 1️⃣ PACKAGES TABLE
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  rating FLOAT DEFAULT 0,
  best_time TEXT DEFAULT '',
  popular BOOLEAN DEFAULT FALSE,
  
  -- JSON Arrays stored as JSONB
  tourism_type JSONB DEFAULT '[]',
  famous_attractions JSONB DEFAULT '[]',
  category JSONB DEFAULT '[]',
  highlights JSONB DEFAULT '[]',
  activities JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  
  -- Pricing
  price FLOAT DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for packages
CREATE INDEX idx_packages_city ON packages(city);
CREATE INDEX idx_packages_country ON packages(country);
CREATE INDEX idx_packages_popular ON packages(popular);
CREATE INDEX idx_packages_created_at ON packages(created_at DESC);

-- 2️⃣ BLOGS TABLE
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  category TEXT DEFAULT '',
  content TEXT DEFAULT '',
  
  -- Structured content
  structured_content JSONB DEFAULT '{}',
  
  -- Author info
  author_name TEXT DEFAULT 'Navsafar Travels',
  author_avatar TEXT DEFAULT '/assets/logo.jpeg',
  author_designation TEXT DEFAULT 'Travel Writer',
  
  -- Tags
  tags JSONB DEFAULT '[]',
  
  -- Status & Publishing
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  featured BOOLEAN DEFAULT FALSE,
  published_at DATE DEFAULT NULL,
  read_time TEXT DEFAULT '5 min read',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for blogs
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_featured ON blogs(featured);
CREATE INDEX idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX idx_blogs_created_at ON blogs(created_at DESC);

-- 3️⃣ TESTIMONIALS TABLE (Already exists, ensure it has all fields)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  trip TEXT NOT NULL,
  location TEXT DEFAULT '',
  travel_date TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for testimonials
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);

-- 4️⃣ CONTACTS TABLE (AES-256-GCM Encrypted)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name_enc TEXT NOT NULL,           -- Encrypted
  email_enc TEXT NOT NULL,          -- Encrypted
  phone_enc TEXT DEFAULT '',        -- Encrypted
  subject TEXT NOT NULL,
  message_enc TEXT NOT NULL,        -- Encrypted
  package_interest TEXT DEFAULT '',
  
  status TEXT DEFAULT 'pending',    -- 'pending', 'contacted', 'resolved', 'closed'
  priority TEXT DEFAULT 'normal',   -- 'low', 'normal', 'high'
  
  -- Plaintext fields (for searching, not sensitive)
  date_submitted TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for contacts (encrypted fields can't be searched)
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_priority ON contacts(priority);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- 5️⃣ SEARCH LEADS TABLE (For newsletter/waitlist)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS search_leads (
  id TEXT PRIMARY KEY,
  email_enc TEXT NOT NULL,          -- Encrypted
  destination TEXT DEFAULT '',
  travel_date TEXT DEFAULT '',
  budget_range TEXT DEFAULT '',
  trip_type TEXT DEFAULT '',        -- 'solo', 'couple', 'family', 'group'
  interested_activities JSONB DEFAULT '[]',
  
  source TEXT DEFAULT 'website',    -- 'website', 'email', 'phone', etc.
  status TEXT DEFAULT 'new',        -- 'new', 'contacted', 'converted'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for search leads
CREATE INDEX idx_search_leads_status ON search_leads(status);
CREATE INDEX idx_search_leads_created_at ON search_leads(created_at DESC);

-- 6️⃣ AUDIT LOGS TABLE (For admin actions tracking)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,             -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN_FAILED'
  resource TEXT NOT NULL,           -- 'package', 'blog', 'testimonial', 'contact'
  resource_id TEXT DEFAULT '',
  changes JSONB DEFAULT '{}',       -- { before: {...}, after: {...} }
  ip_address TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for audit logs
CREATE INDEX idx_audit_logs_admin_email ON audit_logs(admin_email);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 7️⃣ Enable Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────────────────────

-- Packages: Public read, admin write
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Packages are readable by everyone" ON packages
  FOR SELECT USING (true);

CREATE POLICY "Service role can modify packages" ON packages
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Blogs: Public read, admin write
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blogs are readable by everyone" ON blogs
  FOR SELECT USING (status = 'published' OR auth.role() = 'service_role');

CREATE POLICY "Service role can modify blogs" ON blogs
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Testimonials: Public read, admin write
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved testimonials are readable by everyone" ON testimonials
  FOR SELECT USING (is_approved = true OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Contacts: Admin only
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage contacts" ON contacts
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Search Leads: Admin only
ALTER TABLE search_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage search leads" ON search_leads
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Audit Logs: Admin only
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can access audit logs" ON audit_logs
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- ✅ MIGRATION COMPLETE
-- All tables created with proper indexes and RLS policies
-- ============================================================================
