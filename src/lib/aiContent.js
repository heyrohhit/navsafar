// lib/aiContent.js
// ─────────────────────────────────────────────────────────────────
//  100% FREE — No credit card needed
//  AI Content  : Groq API (free) — Llama 3 model
//  Images      : Pexels API (free) — 200 req/hour
//  Caching     : /tmp/travel/ — Vercel compatible ✅
// ─────────────────────────────────────────────────────────────────
//  .env.local:
//    GROQ_API_KEY=gsk_...
//    PEXELS_API_KEY=...
// ─────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";

// ✅ FIX 1: /tmp use karo — Vercel pe sirf yahi writable hai
const CACHE_DIR = path.join("/tmp", "travel");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ══════════════════════════════════════════
//  CACHE HELPERS
// ══════════════════════════════════════════

function ensureCacheDir() {
  // ✅ FIX 2: try/catch wrap karo — agar /tmp bhi fail ho to crash na ho
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("[aiContent] Cache dir create failed:", err.message);
  }
}

function cacheKey(keyword) {
  return keyword
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
}

function readCache(keyword) {
  // ✅ FIX 3: Pure try/catch — koi bhi fs error = null return karo, crash nahi
  try {
    ensureCacheDir();
    const file = path.join(CACHE_DIR, `${cacheKey(keyword)}.json`);
    if (!fs.existsSync(file)) return null;
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return Date.now() - (data._cachedAt || 0) < CACHE_TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(keyword, data) {
  // ✅ FIX 4: Cache write fail ho to silently skip — page toh serve hoga
  try {
    ensureCacheDir();
    const file = path.join(CACHE_DIR, `${cacheKey(keyword)}.json`);
    fs.writeFileSync(
      file,
      JSON.stringify({ ...data, _cachedAt: Date.now() }, null, 2)
    );
  } catch (err) {
    console.warn("[aiContent] Cache write failed (non-fatal):", err.message);
  }
}

export function deleteCache(keyword) {
  try {
    const file = path.join(CACHE_DIR, `${cacheKey(keyword)}.json`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } catch (err) {
    console.warn("[aiContent] Cache delete failed:", err.message);
  }
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
        {
          headers: { Authorization: key },
          // ✅ FIX 5: Timeout add karo — slow API pe hang na ho
          signal: AbortSignal.timeout(8000),
        }
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
    } catch (err) {
      console.warn("[aiContent] Pexels fetch failed:", err.message);
    }
  } else {
    console.warn("[aiContent] PEXELS_API_KEY not set — using placeholder images");
  }

  // Placeholder fallback
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
      // ✅ FIX 6: Timeout add karo — Groq slow ho to Vercel 10s limit se pehle fallback lo
      signal: AbortSignal.timeout(9000),
      body: JSON.stringify({
        model: "llama3-8b-8192",
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
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[aiContent] Groq error:", err.message);
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

export async function generateContent(keyword) {
  // 1. Cache check
  const cached = readCache(keyword);
  if (cached) return cached;

  // 2. Fetch AI content + images in parallel
  const [aiContent, images] = await Promise.all([
    generateAIContent(keyword),
    fetchImages(keyword, 4),
  ]);

  const result = { ...aiContent, images };

  // 3. Cache karo (fail hone pe bhi page serve hoga)
  writeCache(keyword, result);

  return result;
}