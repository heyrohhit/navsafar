// src/lib/seoEngine.js
// ─────────────────────────────────────────────────────────────────
// 🚀 DYNAMIC SEO ENGINE — Daily rotating keywords, meta, JSON-LD
//
// This is the central nerve system for SEO/AEO/GEO/XOS.
// Each day it deterministically generates fresh:
//   • Keyword-optimized page titles & descriptions
//   • FAQPage & other JSON-LD schemas
//   • OpenGraph + Twitter card variations
//   • Content freshness dates
//
// No manual updates needed — just add keywords to the pools below.
// The deterministic seed guarantees same content across ISR caches
// within a day, while changing daily for freshness signals.
// ─────────────────────────────────────────────────────────────────

import { PRIMARY_DOMAIN } from "./domainConfig.js";

// ═══════════════════════════════════════════════════════════════
//  KEYWORD POOLS — 200+ high-volume Indian travel keywords
//  Organized by search intent for better targeting.
//  Add/remove freely — the engine handles everything.
// ═══════════════════════════════════════════════════════════════

const TRIP_KEYWORDS = [
  "best travel agency india", "cheap tour packages india",
  "domestic tour packages india", "international tour packages from india",
  "best holiday packages india", "family vacation packages india",
  "honeymoon trip packages india", "group tour packages india",
  "customized tour packages india", "all inclusive holiday packages",
  "weekend getaways from delhi", "weekend getaways from mumbai",
  "weekend getaways from bangalore", "road trip places in india",
  "best places to visit in india", "travel packages with flight and hotel",
  "all inclusive resort packages", "luxury holiday packages india",
  "budget friendly tour packages", "solo trip packages india",
];

const HONEYMOON_KEYWORDS = [
  "best honeymoon destinations in india", "international honeymoon packages from india",
  "honeymoon places in india", "romantic getaways for couples",
  "best honeymoon packages under 50000", "honeymoon in goa packages",
  "honeymoon in manali packages", "honeymoon in kerala packages",
  "honeymoon in andaman packages", "honeymoon in bali from india",
  "honeymoon in maldives packages", "honeymoon in thailand packages",
  "honeymoon in switzerland packages", "honeymoon in dubai packages",
  "honeymoon in europe packages", "best time for honeymoon in india",
  "honeymoon trip planning", "romantic weekend getaways",
  "couple friendly resorts in india",
];

const FAMILY_KEYWORDS = [
  "family holiday packages india", "kids friendly holiday destinations",
  "family trip places in india", "family package with flight and hotel",
  "best family resorts in india", "family adventure tours india",
  "group travel packages india", "corporate tour packages india",
  "school trip packages india", "family beach holiday packages",
  "family hill station packages", "family wildlife tour packages",
  "multi generation family vacation",
];

const ADVENTURE_KEYWORDS = [
  "adventure tour packages india", "trekking tours in india",
  "best trekking places in india", "river rafting in rishikesh packages",
  "paragliding in himachal packages", "scuba diving in andaman packages",
  "wildlife safari tour packages", "jungle safari in india packages",
  "mountain trekking expeditions india", "camping and trekking packages",
  "biking tours in india", "water sports packages goa", "adventure sports in india",
];

const INTERNATIONAL_KEYWORDS = [
  "international holiday packages from india", "best international tour packages",
  "cheap international tour packages", "asia tour packages from india",
  "europe tour packages from india", "dubai tour packages from india",
  "thailand tour packages from india", "bali tour packages from india",
  "singapore tour packages from india", "maldives tour packages from india",
  "sri lanka tour packages from india", "nepal tour packages from india",
  "bhutan tour packages from india", "vietnam tour packages from india",
  "turkey tour packages from india", "switzerland tour packages from india",
  "paris tour packages from india", "mauritius tour packages from india",
  "visa assistance for international travel", "passport assistance india",
];

const DOMESTIC_KEYWORDS = [
  "goa tour packages from delhi", "manali tour packages from delhi",
  "kerala tour packages from mumbai", "kashmir tour packages from delhi",
  "rajasthan tour packages from delhi", "shimla manali package from delhi",
  "leh ladakh tour packages from delhi", "andaman tour packages from delhi",
  "char dham yatra package from delhi", "vaishno devi yatra package",
  "kedarnath yatra package from delhi", "badrinath yatra package",
  "ayodhya tour package", "varanasi tour package from delhi",
  "amritsar golden temple tour", "rishikesh rafting package",
  "munnar tour package from delhi", "ooty tour package from delhi",
  "coorg tour package from bangalore",
];

const SEASONAL_KEYWORDS = [
  "summer holiday packages 2026", "winter vacation packages 2026",
  "new year tour packages 2026", "diwali holiday packages",
  "christmas vacation packages", "long weekend getaways 2026",
  "best time to visit goa", "best time to visit manali",
  "best time to visit kerala", "best time to visit kashmir",
  "best time to visit bali", "best time to visit dubai",
  "best time to visit thailand", "best time to visit europe",
];

const PLANNING_KEYWORDS = [
  "travel tips for indian travellers", "travel insurance india",
  "flight booking tips india", "hotel booking tips india",
  "packing tips for international travel", "travel budget calculator india",
  "travel itinerary planner", "visa requirements for indian passport",
  "best travel credit cards india", "travel checklist for indian travellers",
];

// Combined pool — all keywords in priority order
const ALL_KEYWORDS = [
  ...TRIP_KEYWORDS,
  ...HONEYMOON_KEYWORDS,
  ...FAMILY_KEYWORDS,
  ...ADVENTURE_KEYWORDS,
  ...INTERNATIONAL_KEYWORDS,
  ...DOMESTIC_KEYWORDS,
  ...SEASONAL_KEYWORDS,
  ...PLANNING_KEYWORDS,
];

// ═══════════════════════════════════════════════════════════════
//  DYNAMIC TITLE/DESCRIPTION TEMPLATES
//  Each page type gets its own generator that pulls from the
//  daily keyword rotation for maximum freshness.
// ═══════════════════════════════════════════════════════════════

// Templates for home page — daily rotating value props
const HOME_TITLE_TEMPLATES = [
  (k) => `NavSafar | Book ${k} — Best Deals & Packages`,
  (k) => `${k} | NavSafar — India's Trusted Travel Agency`,
  (k) => `NavSafar Travel | ${k} at Best Prices`,
  (k) => `Book ${k} Online | NavSafar Travel Solutions`,
];

const HOME_DESC_TEMPLATES = [
  (k) => `Book ${k} with NavSafar. ✈️ Best prices, customised itineraries, hotel + flight deals & 24/7 support. Trusted by Indian travellers.`,
  (k) => `Looking for ${k}? NavSafar offers budget-friendly packages, customised trips & 24/7 travel support for Indian travellers. Book now!`,
  (k) => `Plan your trip with NavSafar. Get the best ${k} with customised itineraries, verified hotels, flights & 24/7 assistance. ✈️🇮🇳`,
];

const PACKAGES_TITLE_TEMPLATES = [
  (k) => `Best ${k} | Domestic & International Tour Packages — NavSafar`,
  (k) => `${k} | Explore Top Destinations — NavSafar Travel`,
  (k) => `Book ${k} Online | NavSafar — Best Price Guaranteed`,
];

const DESTINATION_TITLE_TEMPLATES = [
  (city) => `${city} Tour Packages | Best Travel Deals — NavSafar`,
  (city) => `Explore ${city} | Tour Packages, Hotels & Activities — NavSafar`,
  (city) => `${city} Travel Guide & Packages | Book Online — NavSafar`,
];

// ═══════════════════════════════════════════════════════════════
//  DETERMINISTIC DAILY ROTATION
// ═══════════════════════════════════════════════════════════════

/** Date-based seed: YYYYMMDD — same value for all users within a day */
export function getDateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/** FNV-1a 32-bit hash for stable per-keyword/per-path rotation */
function hashString(str = "") {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Deterministic Fisher-Yates shuffle */
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ═══════════════════════════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════════════════════════

/**
 * Get a daily-rotating subset of travel keywords.
 * @param {number} count  How many keywords to return (default 15)
 * @param {string} [category]  Optional category filter
 * @returns {string[]}
 */
export function getDailyKeywords(count = 15, category) {
  let pool = ALL_KEYWORDS;
  if (category) {
    const pools = {
      trip: TRIP_KEYWORDS,
      honeymoon: HONEYMOON_KEYWORDS,
      family: FAMILY_KEYWORDS,
      adventure: ADVENTURE_KEYWORDS,
      international: INTERNATIONAL_KEYWORDS,
      domestic: DOMESTIC_KEYWORDS,
      seasonal: SEASONAL_KEYWORDS,
      planning: PLANNING_KEYWORDS,
    };
    pool = pools[category] || ALL_KEYWORDS;
  }
  return seededShuffle(pool, getDateSeed()).slice(0, Math.min(count, pool.length));
}

/**
 * Generate a daily-rotating keyword-optimized title for the home page.
 * @returns {string}
 */
export function getDailyHomeTitle() {
  const kw = getDailyKeywords(1)[0] || "tour packages";
  const seed = getDateSeed();
  const templateIndex = seed % HOME_TITLE_TEMPLATES.length;
  return HOME_TITLE_TEMPLATES[templateIndex](kw);
}

/**
 * Generate a daily-rotating keyword-optimized description for the home page.
 * @returns {string}
 */
export function getDailyHomeDescription() {
  const kw = getDailyKeywords(1)[0] || "tour packages";
  const seed = getDateSeed() + 7; // offset from title
  const templateIndex = seed % HOME_DESC_TEMPLATES.length;
  return HOME_DESC_TEMPLATES[templateIndex](kw);
}

/**
 * Generate a keyword-optimized title for packages listing page.
 * @returns {string}
 */
export function getDailyPackagesTitle() {
  const kw = getDailyKeywords(1, "trip")[0] || "tour packages";
  const seed = getDateSeed() + 13;
  const templateIndex = seed % PACKAGES_TITLE_TEMPLATES.length;
  return PACKAGES_TITLE_TEMPLATES[templateIndex](kw);
}

/**
 * Generate a keyword-optimized description for packages page.
 * @returns {string}
 */
export function getDailyPackagesDescription() {
  const kw = getDailyKeywords(2, "trip")[0] || "tour packages";
  return `Explore 50+ ${kw} with NavSafar. ✈️ Best price guarantee, customised itineraries, flights & hotels included. Book now and save big on your dream vacation!`;
}

/**
 * Generate a keyword-optimized title for a destination page.
 * @param {string} city
 * @param {string} country
 * @returns {{ title: string, description: string }}
 */
export function getDailyDestinationMeta(city, country) {
  const seed = hashString(city) + getDateSeed();
  const idx = seed % DESTINATION_TITLE_TEMPLATES.length;
  const keyphrase = getDailyKeywords(1, country === "India" ? "domestic" : "international")[0] || `${city} tour package`;
  return {
    title: DESTINATION_TITLE_TEMPLATES[idx](`${city}, ${country}`),
    description: `Book the best ${city}, ${country} tour package with NavSafar. ✈️ Handpicked hotels, sightseeing, transfers & 24/7 support. Customised itineraries at the best price in INR.`,
  };
}

/**
 * Generate daily-rotating meta keywords for any page.
 * Always includes base brand terms + daily fresh keywords.
 * @returns {string[]}
 */
export function getDailyMetaKeywords(extraKeywords = []) {
  const daily = getDailyKeywords(20);
  const base = [
    "navsafar", "travel agency india", "tour packages",
    "holiday packages", "flight booking", "hotel booking",
  ];
  return [...new Set([...base, ...daily, ...extraKeywords])];
}

/**
 * Get today's date string for freshness signals.
 * @returns {string} YYYY-MM-DD
 */
export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Expired: check if a date is older than N days - for cache-busting stale content
 * @param {string} dateStr
 * @param {number} maxAgeDays
 * @returns {boolean}
 */
export function isContentStale(dateStr, maxAgeDays = 7) {
  if (!dateStr) return true;
  const age = (Date.now() - new Date(dateStr).getTime()) / (1000 * 86400);
  return age > maxAgeDays;
}

// getDailyFaqs removed — use getRotatedFaqsForPath from ./aeoFaqData.js directly
// It provides the same functionality with daily rotation.

/**
 * Build a complete JSON-LD structured data block for a page.
 * Includes WebPage, BreadcrumbList, and page-specific schema.
 * @param {Object} options
 * @returns {Object}
 */
export function buildPageJsonLd({ pageType, url, title, description, image, breadcrumbs, faqs }) {
  const schemas = [];

  // WebPage schema with speakable (for AI/voice)
  schemas.push({
    "@context": "https://schema.org",
    "@type": pageType || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    image: image || `${PRIMARY_DOMAIN}/assets/bg.jpg`,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${PRIMARY_DOMAIN}/#website` },
    about: { "@type": "Place", name: "India" },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h1 + p", "[data-speakable]"],
    },
    dateModified: getTodayDate(),
    datePublished: getTodayDate(),
  });

  // BreadcrumbList
  if (breadcrumbs?.length > 1) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url || `${PRIMARY_DOMAIN}${b.path}`,
      })),
    });
  }

  // FAQPage
  if (faqs?.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  // If single schema, return it; else return @graph
  return schemas.length === 1
    ? schemas[0]
    : { "@context": "https://schema.org", "@graph": schemas };
}
