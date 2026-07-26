-- ============================================================================
-- NavSafar — Site Settings Table (Dynamic Business Config for GEO/XOS)
-- ============================================================================
-- This table stores the dynamic business configuration that was previously
-- hardcoded in src/lib/localBusinessConfig.js. Admin can update these
-- settings from the admin panel, and changes propagate to ALL structured
-- data (JSON-LD), geo meta tags, and social verification tags immediately.
--
-- GEO benefit: Fresh, accurate business info for AI engines (ChatGPT,
--   Perplexity, Google AI Overviews, Gemini, Copilot).
-- XOS benefit: Extended Schema markup stays in sync with real business data.
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id          TEXT PRIMARY KEY DEFAULT 'business_config',
  data        JSONB NOT NULL DEFAULT '{}',
  updated_by  TEXT DEFAULT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for freshness
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at ON site_settings(updated_at DESC);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings (needed for SSR)
CREATE POLICY "Anyone can read site_settings" ON site_settings
  FOR SELECT USING (true);

-- Only service role can modify
CREATE POLICY "Service role can modify site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_site_settings_updated_at();

-- ============================================================================
-- SEED DEFAULT SETTINGS (copied from localBusinessConfig.js)
-- Run once after table creation to populate initial data
-- ============================================================================
INSERT INTO site_settings (id, data)
VALUES (
  'business_config',
  '{
    "legalName": "NavSafar Travel Solutions",
    "brandName": "NavSafar",
    "description": "NavSafar Travel Solutions is a trusted travel agency in India offering domestic & international tour packages, flights, hotels, visa assistance and customised holiday planning for Indian travellers.",
    "phone": "+91-8882128640",
    "email": "info@navsafartravels.com",
    "address": {
      "streetAddress": "WZ-447, First Floor, Left Side, Nangal Raya",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110046",
      "addressCountry": "IN"
    },
    "geo": {
      "latitude": 28.6090,
      "longitude": 77.1075
    },
    "areaServed": [{ "@type": "Country", "name": "India" }],
    "geoRegion": "IN-DL",
    "geoPlacename": "New Delhi, India",
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
    "openingHours": {
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:30",
      "closes": "19:30"
    },
    "sameAs": [
      "https://www.facebook.com/navsafartravels",
      "https://www.instagram.com/navsafartravels",
      "https://x.com/navsafartravels",
      "https://www.linkedin.com/company/navsafartravels",
      "https://www.youtube.com/@navsafartravels"
    ],
    "languages": ["en-IN", "hi-IN"],
    "logoUrl": "https://www.navsafar.com/assets/logo.png",
    "defaultOgImage": "https://www.navsafar.com/assets/bg.jpg",
    "pinterestRichPin": "enabled",
    "rating": "General",
    "revisitAfter": "1 day",
    "themeColor": "#0F6177",
    "appleMobileWebAppTitle": "NavSafar"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
