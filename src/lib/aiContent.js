// lib/aiContent.js
// ─────────────────────────────────────────────────────────────────
//  100% FREE — No credit card needed
//  AI Content  : Groq API (free) — Llama 3 model
//  Images      : Pexels API (free) — 200 req/hour
//  Caching     : File system /cache/travel/ — refreshed every 24h
// ─────────────────────────────────────────────────────────────────
//  .env.local:
//    GROQ_API_KEY=gsk_...
//    PEXELS_API_KEY=...
// ─────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "cache", "travel");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ══════════════════════════════════════════
//  CACHE HELPERS
// ══════════════════════════════════════════

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function cacheKey(keyword) {
  return keyword
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
}

function readCache(keyword) {
  ensureCacheDir();
  const file = path.join(CACHE_DIR, `${cacheKey(keyword)}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return Date.now() - (data._cachedAt || 0) < CACHE_TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(keyword, data) {
  ensureCacheDir();
  const file = path.join(CACHE_DIR, `${cacheKey(keyword)}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify({ ...data, _cachedAt: Date.now() }, null, 2)
  );
}

export function deleteCache(keyword) {
  const file = path.join(CACHE_DIR, `${cacheKey(keyword)}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

// ══════════════════════════════════════════
//  PEXELS IMAGE FETCH (FREE)
// ══════════════════════════════════════════

async function fetchImages(keyword, count = 4) {
  const key = process.env.PEXELS_API_KEY;

  if (key) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          keyword + " travel"
        )}&per_page=${count}&orientation=landscape`,
        { headers: { Authorization: key } }
      );
      if (res.ok) {
        const data = await res.json();
        const imgs = (data.photos || []).map((p) => ({
          url: p.src?.large2x || p.src?.large,
          thumb: p.src?.medium,
          alt: p.alt || keyword,
          credit: p.photographer || "Pexels",
          creditLink: p.photographer_url || "https://www.pexels.com",
        }));
        if (imgs.length > 0) return imgs;
      }
    } catch {
      // fall through to placeholder
    }
  }

  // Placeholder fallback — works without any API key
  console.warn("[aiContent] PEXELS_API_KEY not set — using placeholder images");
  return Array.from({ length: count }, (_, i) => ({
    url: `https://picsum.photos/seed/${encodeURIComponent(keyword)}_${i}/1280/720`,
    thumb: `https://picsum.photos/seed/${encodeURIComponent(keyword)}_${i}/400/300`,
    alt: `${keyword} travel`,
    credit: "Lorem Picsum",
    creditLink: "https://picsum.photos",
  }));
}

// ══════════════════════════════════════════
//  GROQ AI CONTENT (FREE)
// ══════════════════════════════════════════

async function generateAIContent(keyword) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("[aiContent] GROQ_API_KEY not set — using static fallback");
    return staticFallback(keyword);
  }

  const prompt = `You are a professional travel content writer for NavSafar, an Indian travel company.

Generate rich, engaging, SEO-optimized travel content for the destination: "${keyword}"

IMPORTANT: Return ONLY a valid JSON object. No markdown, no backticks, no extra text before or after JSON.

{
  "intro": "3-4 sentence engaging introduction about ${keyword}. Mention geography, culture, and why travellers love it.",
  "why": [
    "Reason 1 with specific detail about NavSafar service for ${keyword}",
    "Reason 2 with specific detail",
    "Reason 3 with specific detail",
    "Reason 4 with specific detail",
    "Reason 5 with specific detail",
    "Reason 6 with specific detail"
  ],
  "guide": "4-5 sentences covering best time to visit, top attractions, local food specialties, and practical travel tips for ${keyword}.",
  "highlights": ["Top Attraction 1", "Top Attraction 2", "Top Attraction 3", "Top Attraction 4"],
  "bestTimeToVisit": "Month range like October to March",
  "budgetRange": "Indian rupee range like ₹12,000 – ₹40,000 per person",
  "duration": "Like 4–6 Days",
  "faq": [
    { "q": "Best time to visit ${keyword}?", "a": "Detailed seasonal answer with weather info." },
    { "q": "How much does a ${keyword} trip cost from India?", "a": "Specific budget breakdown mentioning transport, hotel, food." },
    { "q": "Is ${keyword} suitable for family and kids?", "a": "Practical family travel tips and safety info." },
    { "q": "Top 3 must-visit places in ${keyword}?", "a": "Name and briefly describe 3 specific real attractions." }
  ]
}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Free Groq model
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are a travel content expert. Always respond with valid JSON only. No markdown, no explanation, just raw JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[aiContent] Groq API error:", res.status, errText);
      return staticFallback(keyword);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[aiContent] Groq parse error:", err.message);
    return staticFallback(keyword);
  }
}

// ══════════════════════════════════════════
//  STATIC FALLBACK (no API keys / error)
// ══════════════════════════════════════════

function staticFallback(keyword) {
  return {
    intro: `${keyword} is one of India's most beloved travel destinations, offering a perfect mix of culture, natural beauty, and unforgettable experiences. NavSafar crafts fully customised ${keyword} packages with handpicked stays, smooth transfers, and expert local guides. Whether you're planning a romantic getaway, a family vacation, or a solo adventure, we have the ideal itinerary for you. Book now and get the best deals on your ${keyword} trip.`,
    why: [
      "Best-price guarantee — no hidden charges ever",
      "Fully customised itineraries built around your preferences",
      "24/7 travel support from our dedicated team",
      "Handpicked hotels with verified guest reviews",
      "Experienced local guides for authentic experiences",
      "Easy cancellation and flexible rescheduling policy",
    ],
    guide: `The best time to visit ${keyword} is typically between October and March when the weather is most pleasant. Plan ahead to catch local festivals and book popular stays early. NavSafar's travel experts can suggest the best routes, hidden gems, and local eateries to make your trip truly memorable. Whether you prefer adventure, relaxation, or cultural exploration, ${keyword} has something for everyone.`,
    highlights: [
      "Scenic Landscapes",
      "Local Cuisine",
      "Cultural Heritage",
      "Adventure Activities",
    ],
    bestTimeToVisit: "October to March",
    budgetRange: "₹9,999 – ₹35,000 per person",
    duration: "5–7 Days",
    faq: [
      {
        q: `Best time to visit ${keyword}?`,
        a: `October to March is ideal with pleasant weather. Monsoons offer lush greenery but may limit outdoor activities.`,
      },
      {
        q: `How much does a ${keyword} trip cost from India?`,
        a: `A standard package starts from ₹9,999/person. Costs vary by hotel category, travel mode, and trip duration.`,
      },
      {
        q: `Is ${keyword} suitable for family and kids?`,
        a: `Yes, ${keyword} is very family-friendly. NavSafar ensures all stays and activities are safe and kid-appropriate.`,
      },
      {
        q: `Top 3 must-visit places in ${keyword}?`,
        a: `Our travel experts share a personalised list of top spots, local markets, and hidden gems when you book with us.`,
      },
    ],
  };
}

// ══════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════

/**
 * generateContent(keyword)
 *
 * Returns full travel content object:
 * { intro, why, guide, highlights, bestTimeToVisit,
 *   budgetRange, duration, faq, images }
 *
 * Flow:
 *  1. Check file system cache (24h TTL)
 *  2. On miss → Groq AI + Pexels in parallel
 *  3. Write result to cache
 */
export async function generateContent(keyword) {
  // 1. Serve from cache if fresh
  const cached = readCache(keyword);
  if (cached) return cached;

  // 2. Fetch AI content + images in parallel
  const [aiContent, images] = await Promise.all([
    generateAIContent(keyword),
    fetchImages(keyword, 4),
  ]);

  const result = { ...aiContent, images };

  // 3. Cache the result
  writeCache(keyword, result);

  return result;
}