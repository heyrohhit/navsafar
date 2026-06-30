// src/lib/localBusinessConfig.js
// ─────────────────────────────────────────────────────────────
// 🇮🇳 SINGLE SOURCE OF TRUTH — Business / NAP / Local SEO data
// Used by GlobalSEO.jsx to generate Organization, LocalBusiness,
// TravelAgency & WebSite structured data for every page.
//
// 👉 If your address / phone / social links change, update ONLY
//    this file — every page will update automatically.
// ─────────────────────────────────────────────────────────────

import { PRIMARY_DOMAIN } from "./domainConfig.js";

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

  // Update with real profile URLs for stronger entity/Knowledge-Graph signals
  sameAs: [
    // "https://www.facebook.com/navsafartravels",
    // "https://www.instagram.com/navsafartravels",
    // "https://twitter.com/navsafartravels",
    // "https://www.linkedin.com/company/navsafartravels",
    // "https://www.youtube.com/@navsafartravels",
  ],

  // Languages content is served in (for inLanguage / hreflang signals)
  languages: ["en-IN", "hi-IN"],
};

export const SITE_URL = PRIMARY_DOMAIN;
export const LOGO_URL = `${PRIMARY_DOMAIN}/assets/logo.png`;
export const DEFAULT_OG_IMAGE = `${PRIMARY_DOMAIN}/assets/bg.jpg`;
