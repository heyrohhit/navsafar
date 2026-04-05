-- Supabase Schema for NavSafar
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (optional, but recommended)
-- For now we'll keep it simple - public can read, admin can write

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  trip VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT '',
  travel_date VARCHAR(100) DEFAULT '',
  is_approved BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  email VARCHAR(255) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved testimonials
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = true);

-- Policy: Anyone can insert (for public submissions)
CREATE POLICY "Public can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (true);

-- Policy: Admin can update all (you'll need to set up auth later)
-- For now, you can use service_role key in backend

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for avatar images (optional)
-- Run this in Storage section if you want avatar uploads
-- Create bucket named 'testimonials' with public access
