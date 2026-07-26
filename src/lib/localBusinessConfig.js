// src/lib/localBusinessConfig.js
// ─────────────────────────────────────────────────────────────
// 🇮🇳 SINGLE SOURCE OF TRUTH — Business / NAP / Local SEO data
//
// ✅ STATIC FALLBACK (default) — always available, no DB needed
// ✅ DYNAMIC OVERRIDE — async loadBusinessConfig() fetches from
//    Supabase site_settings table, merges with static defaults
//
// Used by UniversalSEOEngine.jsx / GlobalSEO.jsx to generate
// Organization, LocalBusiness, TravelAgency & WebSite structured
// data for every page.
//
// 👉 Admin can now edit phone / address / social links / etc.
//    from the admin /settings page — changes go live instantly
//    without redeploying, improving GEO/XOS freshness signals.
// ─────────────────────────────────────────────────────────────

import { PRIMARY_DOMAIN } from "./domainConfig.js";

// ═══════════════════════════════════════════════════════════════
//  STATIC FALLBACK DEFAULTS (hardcoded, no DB needed)
// ═══════════════════════════════════════════════════════════════

export const BUSINESS = {
  legalName: "NavSafar Travel Solutions",
  brandName: "NavSafar",

  // Used in <meta> description fallbacks & schema "description"
  description:
    "NavSafar Travel Solutions is a trusted travel agency in India offering domestic & international tour packages, flights, hotels, visa assistance and customised holiday planning for Indian travellers.",

  // ── Contact (NAP — Name / Address / Phone) ────────────────
  phone: "+91-8882128640",
  email: "info@navsafartravels.com",

  address: {
    streetAddress: "WZ-447, First Floor, Left Side, Nangal Raya",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110046",
    addressCountry: "IN",
  },

  // Approx. coordinates for Nangal Raya, New Delhi
  geo: {
    latitude: 28.6090,
    longitude: 77.1075,
  },

  // ── India-specific business attributes ────────────────────
  areaServed: [
    { "@type": "Country", name: "India" },
  ],

  // 2-letter ISO region used for geo.region meta tag
  geoRegion: "IN-DL",
  geoPlacename: "New Delhi, India",

  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",

  openingHours: {
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:30",
    closes: "19:30",
  },

  // Real social profile URLs for entity/Knowledge-Graph signals (GEO/AEO/XOS)
  // AI engines cross-reference these to verify brand authority
  sameAs: [
    "https://www.facebook.com/navsafartravels",
    "https://www.instagram.com/navsafartravels",
    "https://x.com/navsafartravels",
    "https://www.linkedin.com/company/navsafartravels",
    "https://www.youtube.com/@navsafartravels",
  ],

  // Languages content is served in (for inLanguage / hreflang signals)
  languages: ["en-IN", "hi-IN"],
};

export const SITE_URL = PRIMARY_DOMAIN;
export const LOGO_URL = `${PRIMARY_DOMAIN}/assets/logo.png`;
export const DEFAULT_OG_IMAGE = `${PRIMARY_DOMAIN}/assets/bg.jpg`;

// ═══════════════════════════════════════════════════════════════
//  DYNAMIC CONFIG LOADER — fetches from Supabase, merges with
//  static defaults. Gracefully falls back on any error.
// ═══════════════════════════════════════════════════════════════

/**
 * Deep merge two objects — Supabase values override defaults.
 * Arrays are replaced (not merged) to avoid duplicates.
 */
function deepMerge(defaults, overrides) {
  if (!overrides || typeof overrides !== "object") return defaults;
  if (Array.isArray(defaults) || Array.isArray(overrides)) return overrides;

  const result = { ...defaults };
  for (const key of Object.keys(overrides)) {
    if (overrides[key] === null || overrides[key] === undefined) continue;
    if (
      typeof defaults[key] === "object" &&
      !Array.isArray(defaults[key]) &&
      typeof overrides[key] === "object" &&
      !Array.isArray(overrides[key])
    ) {
      result[key] = deepMerge(defaults[key], overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
}

/**
 * Load the merged business configuration from Supabase.
 *
 * ✅ Returns static defaults if Supabase is unreachable
 * ✅ Returns defaults if Supabase has no settings row yet
 * ✅ Merges DB overrides on top of defaults (partial updates work)
 *
 * Call this in server components / API routes where fresh data
 * matters for SEO (GEO / XOS freshness signals).
 *
 * @param {Object} [opts]
 * @param {boolean} [opts.forceFresh] - Skip cache and fetch fresh
 * @returns {Promise<{
 *   BUSINESS: typeof import("./localBusinessConfig.js").BUSINESS,
 *   SITE_URL: string,
 *   LOGO_URL: string,
 *   DEFAULT_OG_IMAGE: string,
 *   extras: Object
 * }>}
 */
export async function loadBusinessConfig(opts = {}) {
  try {
    // Dynamic import to avoid circular deps at module level
    const { createSupabaseClient } = await import("./supabaseClient.js");

    const client = createSupabaseClient(true); // service role for SSR

    const { data, error } = await client
      .from("site_settings")
      .select("data")
      .eq("id", "business_config")
      .maybeSingle();

    if (error || !data?.data) {
      // No settings row yet — return defaults
      return {
        BUSINESS: { ...BUSINESS },
        SITE_URL,
        LOGO_URL,
        DEFAULT_OG_IMAGE,
        extras: {},
      };
    }

    // Merge DB overrides into static defaults
    const merged = deepMerge(structuredClone(BUSINESS), data.data);

    // Handle derived fields that might come from DB
    const logoUrl = data.data.logoUrl || LOGO_URL;
    const ogImage = data.data.defaultOgImage || DEFAULT_OG_IMAGE;

    // Collect any extra fields not in BUSINESS shape
    const extras = {};
    const businessKeys = new Set([
      "legalName", "brandName", "description", "phone", "email",
      "address", "geo", "areaServed", "geoRegion", "geoPlacename",
      "priceRange", "currenciesAccepted", "paymentAccepted",
      "openingHours", "sameAs", "languages",
    ]);
    for (const key of Object.keys(data.data)) {
      if (!businessKeys.has(key)) {
        extras[key] = data.data[key];
      }
    }

    return {
      BUSINESS: merged,
      SITE_URL,
      LOGO_URL: logoUrl,
      DEFAULT_OG_IMAGE: ogImage,
      extras,
    };
  } catch (err) {
    // Silent fallback — don't crash the page if Supabase fails
    if (process.env.NODE_ENV === "development") {
      console.warn("[localBusinessConfig] Supabase fetch failed, using static defaults:", err.message);
    }
    return {
      BUSINESS: { ...BUSINESS },
      SITE_URL,
      LOGO_URL,
      DEFAULT_OG_IMAGE,
      extras: {},
    };
  }
}
