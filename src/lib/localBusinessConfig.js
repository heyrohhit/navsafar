// src/lib/localBusinessConfig.js
// ─────────────────────────────────────────────────────────────
// 🇮🇳 SINGLE SOURCE OF TRUTH — Business / NAP / Local SEO data
// Used by GlobalSEO.jsx, Footer.jsx, sitemap.js etc.
// Update this ONE file — every page updates automatically.
// ─────────────────────────────────────────────────────────────

import { PRIMARY_DOMAIN } from "./domainConfig.js";

export const BUSINESS = {
  legalName: "NavSafar Travel Solutions",
  brandName: "NavSafar",

  description:
    "NavSafar Travel Solutions is a trusted travel agency in India offering domestic & international tour packages, flights, hotels, visa assistance and customised holiday planning for Indian travellers.",

  // ── NAP (Name / Address / Phone) ──────────────────────────
  phone: "+91-8882128640",
  phoneDisplay: "+91 8882128640",
  whatsapp: "918882128640",
  email: "info@navsafartravels.com",

  address: {
    streetAddress: "WZ-447, First Floor, Left Side, Nangal Raya",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110046",
    addressCountry: "IN",
  },

  // Approx. coordinates — Nangal Raya, New Delhi
  geo: {
    latitude: 28.609,
    longitude: 77.1075,
  },

  googleMapsUrl:
    "https://maps.google.com/?q=28.609,77.1075",

  // ── India geo signals ─────────────────────────────────────
  geoRegion: "IN-DL",
  geoPlacename: "New Delhi, India",

  areaServed: [
    { "@type": "Country", name: "India" },
  ],

  // ── Business attributes ───────────────────────────────────
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking, NEFT",

  openingHours: {
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    opens: "09:30",
    closes: "19:30",
  },

  languages: ["en-IN", "hi-IN"],

  // ── Social / Off-Page SEO — UPDATE these with real profile URLs ──
  // These feed into schema.org sameAs (Knowledge Graph signals)
  // AND the Footer social links
  socials: {
    facebook:  "https://www.facebook.com/navsafartravels",
    instagram: "https://www.instagram.com/navsafartravels",
    twitter:   "https://twitter.com/navsafartravels",
    linkedin:  "https://www.linkedin.com/company/navsafartravels",
    youtube:   "https://www.youtube.com/@navsafartravels",
    whatsapp:  "https://wa.me/918882128640",
  },

  // schema.org sameAs — auto-built from socials above + GBP
  get sameAs() {
    return [
      ...Object.values(this.socials),
      // Add Google Business Profile URL once claimed:
      // "https://g.page/navsafartravels",
    ];
  },

  // ── Services list (for schema + Local SEO) ────────────────
  services: [
    "Domestic Tour Packages",
    "International Tour Packages",
    "Honeymoon Packages",
    "Family Holiday Packages",
    "Adventure Tours",
    "Religious & Pilgrimage Tours",
    "Corporate Travel Management",
    "MICE Services",
    "Hotel Booking",
    "Flight Booking",
    "Visa Assistance",
    "Travel Insurance",
  ],
};

export const SITE_URL      = PRIMARY_DOMAIN;
export const LOGO_URL      = `${PRIMARY_DOMAIN}/assets/logo.png`;
export const DEFAULT_OG_IMAGE = `${PRIMARY_DOMAIN}/assets/bg.jpg`;
