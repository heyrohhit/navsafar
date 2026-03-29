// lib/seoConfig.js
// ─────────────────────────────────────────────────────────────────
//  Production SEO config for NavSafar
//  100+ destinations — equal India + International mix
//  Zero duplicate keywords guaranteed
// ─────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════
//  INDIA DESTINATIONS
// ══════════════════════════════════════════

const INDIA_HILL_STATIONS = [
  "manali", "shimla", "mussoorie", "darjeeling", "ooty",
  "munnar", "coorg", "nainital", "kasauli", "lansdowne",
  "dalhousie", "mcleod ganj", "chikmagalur", "kodaikanal",
  "yercaud", "mahabaleshwar", "lonavala", "pachmarhi",
];

const INDIA_BEACHES = [
  "goa", "andaman", "lakshadweep", "pondicherry", "varkala",
  "gokarna", "tarkarli", "diu", "puri", "vizag beach",
  "kovalam", "marari beach", "radhanagar beach", "havelock island",
];

const INDIA_RELIGIOUS = [
  "kedarnath", "varanasi", "amritsar", "tirupati", "shirdi",
  "mathura vrindavan", "haridwar rishikesh", "char dham yatra",
  "somnath", "dwarka", "puri jagannath", "rameswaram",
  "badrinath", "gangotri", "yamunotri", "kashi vishwanath",
];

const INDIA_HERITAGE = [
  "rajasthan", "jaipur", "udaipur", "jodhpur", "agra",
  "hampi", "khajuraho", "mysore", "ajanta ellora", "konark",
  "mahabalipuram", "fatehpur sikri", "chittorgarh", "mehrangarh",
  "bidar", "mandu", "orchha",
];

const INDIA_ADVENTURE = [
  "kashmir", "leh ladakh", "spiti valley", "rishikesh",
  "auli", "chopta", "zanskar", "tawang", "dzukou valley",
  "valley of flowers", "roopkund trek", "sandakphu trek",
  "chadar trek", "markha valley",
];

const INDIA_WILDLIFE = [
  "ranthambore", "jim corbett", "kaziranga", "bandhavgarh",
  "sundarbans", "nagarhole", "periyar", "bandipur",
  "tadoba", "panna national park", "satpura",
];

const INDIA_NORTHEAST = [
  "shillong", "cherrapunji", "majuli", "ziro valley",
  "kohima", "imphal", "aizawl", "gangtok",
];

const INDIA_OFFBEAT = [
  "hampta pass", "chandratal lake", "dhankar monastery",
  "tirthan valley", "binsar", "munsiyari", "kalpetta",
  "coorg homestay", "araku valley", "lambasingi",
];

// ══════════════════════════════════════════
//  INTERNATIONAL DESTINATIONS
// ══════════════════════════════════════════

const INTL_ASIA = [
  "bali", "singapore", "thailand", "malaysia", "vietnam",
  "cambodia", "indonesia", "philippines", "myanmar",
  "sri lanka", "nepal", "bhutan", "maldives",
  "hong kong", "japan", "south korea", "taiwan",
  "laos", "brunei",
];

const INTL_MIDDLE_EAST = [
  "dubai", "abu dhabi", "oman", "qatar", "bahrain",
  "jordan", "israel", "saudi arabia",
];

const INTL_EUROPE = [
  "paris", "switzerland", "italy", "spain", "greece",
  "turkey", "portugal", "amsterdam", "prague", "vienna",
  "budapest", "croatia", "norway", "scotland", "ireland",
  "iceland", "finland", "denmark", "poland",
];

const INTL_AFRICA_ISLANDS = [
  "mauritius", "seychelles", "zanzibar", "kenya safari",
  "south africa", "egypt", "morocco", "madagascar",
];

const INTL_AMERICAS = [
  "new york", "canada", "peru", "brazil", "mexico",
  "costa rica", "cuba", "argentina",
];

const INTL_OCEANIA = [
  "australia", "new zealand", "fiji",
];

// ══════════════════════════════════════════
//  DESTINATION CATEGORIES
// ══════════════════════════════════════════

export const DESTINATION_CATEGORIES = [
  { label: "Hill Stations",           emoji: "🏔️", destinations: INDIA_HILL_STATIONS },
  { label: "Beaches",                 emoji: "🏖️", destinations: INDIA_BEACHES },
  { label: "Religious & Spiritual",   emoji: "🛕", destinations: INDIA_RELIGIOUS },
  { label: "Heritage & Culture",      emoji: "🏛️", destinations: INDIA_HERITAGE },
  { label: "Adventure & Trekking",    emoji: "🧗", destinations: INDIA_ADVENTURE },
  { label: "Wildlife & Nature",       emoji: "🐯", destinations: INDIA_WILDLIFE },
  { label: "Northeast India",         emoji: "🌿", destinations: INDIA_NORTHEAST },
  { label: "Offbeat India",           emoji: "🗺️", destinations: INDIA_OFFBEAT },
  { label: "Asia",                    emoji: "🌏", destinations: INTL_ASIA },
  { label: "Middle East",             emoji: "🌆", destinations: INTL_MIDDLE_EAST },
  { label: "Europe",                  emoji: "🏰", destinations: INTL_EUROPE },
  { label: "Africa & Islands",        emoji: "🌍", destinations: INTL_AFRICA_ISLANDS },
  { label: "Americas",                emoji: "🗽", destinations: INTL_AMERICAS },
  { label: "Oceania",                 emoji: "🦘", destinations: INTL_OCEANIA },
];

// ══════════════════════════════════════════
//  ALL DESTINATIONS (flat, deduplicated)
// ══════════════════════════════════════════

export const ALL_DESTINATIONS = [
  ...new Set(DESTINATION_CATEGORIES.flatMap((c) => c.destinations)),
];

// ══════════════════════════════════════════
//  INTENT KEYWORDS
// ══════════════════════════════════════════

// High commercial intent (people ready to book)
const HIGH_INTENT = [
  "tour package",
  "holiday package",
  "travel package",
  "honeymoon package",
  "family package",
];

// Informational intent (researching, good for SEO traffic)
const INFORMATIONAL = [
  "trip cost",
  "travel guide",
  "best time to visit",
  "places to visit",
  "things to do",
  "travel tips",
  "budget trip",
];

// ══════════════════════════════════════════
//  KEYWORD GENERATOR (zero duplicates)
// ══════════════════════════════════════════

/**
 * generateKeywords()
 * Returns deduplicated array of SEO keyword strings.
 * High-intent keywords come first for better ranking signals.
 */
export function generateKeywords() {
  const seen = new Set();
  const keywords = [];
  const intents = [...HIGH_INTENT, ...INFORMATIONAL];

  for (const destination of ALL_DESTINATIONS) {
    for (const intent of intents) {
      const kw = `${destination} ${intent}`;
      if (!seen.has(kw)) {
        seen.add(kw);
        keywords.push(kw);
      }
    }
  }

  return keywords;
}

// ══════════════════════════════════════════
//  UNIQUE DESTINATIONS (for TravelPage grid)
// ══════════════════════════════════════════

/**
 * getUniqueDestinations()
 * One entry per destination — no intent suffix duplicates.
 * Returns: { name, slug, category, emoji }
 */
export function getUniqueDestinations() {
  const seen = new Set();
  const result = [];

  for (const cat of DESTINATION_CATEGORIES) {
    for (const dest of cat.destinations) {
      if (!seen.has(dest)) {
        seen.add(dest);
        result.push({
          name: dest
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          slug: `${dest}-tour-package`.replace(/\s+/g, "-"),
          category: cat.label,
          emoji: cat.emoji,
        });
      }
    }
  }

  return result;
}

// ══════════════════════════════════════════
//  SEO METADATA HELPERS
// ══════════════════════════════════════════

/**
 * getPageTitle(keyword)
 * Format proven to rank in India searches.
 */
export function getPageTitle(keyword) {
  const cap = keyword
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `${cap} | Best Deals & Complete Travel Guide - NavSafar`;
}

/**
 * getPageDescription(keyword)
 * High CTR meta description for Indian search users.
 */
export function getPageDescription(keyword) {
  return `Book ${keyword} with NavSafar. Best price, customised itinerary, hotel + flight deals & 24/7 support. Trusted by 50,000+ Indian travellers. ✈️ Book Now!`;
}

/**
 * getStructuredData(keyword, content)
 * JSON-LD schemas: FAQPage + TouristAttraction
 * Enables Google FAQ rich results (dropdown answers in SERP).
 */
export function getStructuredData(keyword, content) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (content?.faq || []).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const touristSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: keyword
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    description: content?.intro || `Explore ${keyword} with NavSafar.`,
    touristType: ["Family", "Couple", "Solo", "Adventure"],
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: content?.budgetRange?.match(/[\d,]+/)?.[0]?.replace(",", "") || "9999",
      availability: "https://schema.org/InStock",
    },
  };

  return [faqSchema, touristSchema];
}