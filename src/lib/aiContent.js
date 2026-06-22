// lib/aiContent.js
// ─────────────────────────────────────────────────────────────────
//  AI Content Generator for NavSafar (Production Ready)
//  - Text API: Groq (Llama 3)
//  - Image API: Pexels
//  - Caching: Next.js unstable_cache (Vercel CDN Ready)
// ─────────────────────────────────────────────────────────────────

import { unstable_cache } from "next/cache";

// ══════════════════════════════════════════════════════════════
//  1. IMAGE FETCHING FUNCTION (PEXELS API)
// ══════════════════════════════════════════════════════════════

/**
 * Ye function Pexels API se high-quality landscape images fetch karta hai.
 * @param {string} keyword - Destination ka naam (e.g., "Manali", "Goa")
 * @param {number} count - Kitni images chahiye (default 4)
 * @returns {Array} - Images ka array jisme url, alt text aur credits hain
 */
async function fetchImages(keyword, count = 4) {
  const key = process.env.PEXELS_API_KEY;

  // Agar API key nahi hai, toh turant placeholder images return kar do
  if (!key) {
    console.warn("[aiContent] PEXELS_API_KEY missing — using placeholders");
    return getPlaceholderImages(keyword, count);
  }

  try {
    // Pexels API call: "keyword + travel" search karte hain taaki travel related photos aayein
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        keyword + " travel destination"
      )}&per_page=${count}&orientation=landscape`,
      {
        headers: { Authorization: key },
        signal: AbortSignal.timeout(8000), // 8 seconds timeout taaki Vercel hang na ho
      }
    );

    if (res.ok) {
      const data = await res.json();
      
      // API se aane wale data ko apne frontend format mein map (convert) kar rahe hain
      const imgs = (data.photos || []).map((p) => ({
        url: p.src?.large2x || p.src?.large,     // High-res image
        thumb: p.src?.medium,                    // Low-res thumbnail
        alt: p.alt || `${keyword} travel tour`,  // SEO alt text
        credit: p.photographer || "Pexels",
        creditLink: p.photographer_url || "https://www.pexels.com",
      }));
      
      if (imgs.length > 0) return imgs;
    }
  } catch (err) {
    console.warn("[aiContent] Pexels API request failed:", err.message);
  }

  // Agar API fail ho jaye kisi bhi wajah se, toh site break nahi honi chahiye
  return getPlaceholderImages(keyword, count);
}

/**
 * Fallback Function: Agar Pexels fail ho jaye toh ye dummy images dega
 */
function getPlaceholderImages(keyword, count) {
  return Array.from({ length: count }, (_, i) => ({
    url: `https://picsum.photos/seed/${encodeURIComponent(keyword)}_${i}/1280/720`,
    thumb: `https://picsum.photos/seed/${encodeURIComponent(keyword)}_${i}/400/300`,
    alt: `Beautiful view of ${keyword}`,
    credit: "Lorem Picsum",
    creditLink: "https://picsum.photos",
  }));
}


// ══════════════════════════════════════════════════════════════
//  2. AI TEXT GENERATION FUNCTION (GROQ API - LLAMA 3)
// ══════════════════════════════════════════════════════════════

/**
 * Ye function Groq API ko prompt bhej kar ek structured SEO article likhwata hai.
 * Output hamesha JSON format mein hoga taaki React/Next.js components easily render kar sakein.
 * @param {string} keyword - Destination ka naam
 */
async function generateAIContent(keyword) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("[aiContent] GROQ_API_KEY missing — using static fallback");
    return staticFallback(keyword);
  }

  // 🔥 PROMPT UPGRADE: Ab AI ek proper "Article" likhega with bullet points & FAQs
  const prompt = `You are an expert travel blogger and SEO content writer for NavSafar (an Indian travel agency).
Write a rich, engaging, and highly structured travel article for the destination: "${keyword}".

IMPORTANT: Return ONLY a valid JSON object. Do not include markdown blocks, explanations, or extra text.
Follow this exact JSON schema:
{
  "title": "Catchy SEO optimized title for a ${keyword} trip",
  "intro": "2-3 engaging paragraphs introducing ${keyword}, its culture, vibes, and why it is a must-visit.",
  "keyHighlights": [
    "Write 4 to 6 short bullet points highlighting the best experiences, top places, or NavSafar perks for ${keyword}"
  ],
  "detailedGuide": "A comprehensive 3-4 paragraph guide covering the best time to visit, local food to try, how to reach, and practical travel tips.",
  "quickFacts": {
    "bestTimeToVisit": "E.g., October to March",
    "budgetRange": "E.g., ₹15,000 – ₹35,000 per person",
    "idealDuration": "E.g., 4–6 Days"
  },
  "faqs": [
    { "q": "What is the best time to visit ${keyword}?", "a": "Provide a detailed answer." },
    { "q": "Is ${keyword} a good destination for families?", "a": "Provide practical advice." },
    { "q": "How much does a trip to ${keyword} cost?", "a": "Give a realistic INR estimate and mention NavSafar packages." },
    { "q": "What are the top 3 places to visit in ${keyword}?", "a": "Name the places and briefly describe them." }
  ]
}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(9000), // 9s timeout (Vercel ke 10s limit se bachne ke liye)
      body: JSON.stringify({
        model: "llama3-8b-8192", // Fast & capable model
        max_tokens: 2000,
        temperature: 0.7, // 0.7 means creative but factual
        messages: [
          {
            role: "system",
            content: "You are a travel content JSON generator. Output strictly valid JSON without any markdown formatting like ```json.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) throw new Error(`Groq API Status: ${res.status}`);

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    
    // Cleanup: AI kabhi-kabhi ```json aur ``` laga deta hai, hum usko hata rahe hain
    const cleanedContent = rawContent.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanedContent); // String ko wapas JSON object bana rahe hain

  } catch (err) {
    console.error("[aiContent] Groq generation failed:", err.message);
    return staticFallback(keyword); // Error aane par site nahi tutegi, static content dikhega
  }
}


// ══════════════════════════════════════════════════════════════
//  3. STATIC FALLBACK (SAFETY NET)
// ══════════════════════════════════════════════════════════════

/**
 * Agar dono API (Groq/Pexels) fail ho jayein, toh ye function ek ready-made article dega.
 * Iska structure wahi hai jo AI generate karta hai.
 */
function staticFallback(keyword) {
  return {
    title: `Explore the Beauty of ${keyword} with NavSafar`,
    intro: `${keyword} is one of the most stunning destinations, offering a perfect blend of natural beauty, rich culture, and thrilling adventures. Whether you are looking for a peaceful retreat or an action-packed holiday, ${keyword} promises an unforgettable experience. NavSafar crafts fully customized packages to ensure your journey is smooth and memorable.`,
    keyHighlights: [
      "Fully customized itineraries tailored to your preferences",
      "Handpicked hotels and resorts with premium amenities",
      "Experienced local guides for an authentic travel experience",
      "24/7 dedicated customer support during your trip",
      "Transparent pricing with zero hidden charges"
    ],
    detailedGuide: `Planning a trip to ${keyword} is exciting. The destination boasts incredible local cuisine, vibrant markets, and breathtaking sights. We recommend booking your stays and flights in advance, especially during the peak tourist season. Don't forget to pack according to the weather and keep local emergency contacts handy. NavSafar's travel experts are always ready to assist you with insider tips and best route planning.`,
    quickFacts: {
      bestTimeToVisit: "Varies by season (Contact us for details)",
      budgetRange: "₹10,000 – ₹40,000 per person",
      idealDuration: "4–7 Days"
    },
    faqs: [
      { q: `Why should I book my ${keyword} trip with NavSafar?`, a: `We offer end-to-end planning, from flights to hotels and sightseeing, all customized to your budget.` },
      { q: `Is ${keyword} safe for solo travelers?`, a: `Yes, it is generally safe. We provide reliable transport and verified stays for extra security.` },
      { q: `Can I customize the itinerary?`, a: `Absolutely! All NavSafar packages are 100% flexible based on your travel style.` },
    ],
  };
}


// ══════════════════════════════════════════════════════════════
//  4. MAIN EXPORT WITH NEXT.JS CACHING
// ══════════════════════════════════════════════════════════════

/**
 * Ye internal helper function dono API (Text aur Image) ko ek sath (parallel) call karta hai.
 * Promise.all use karne se time aadha lagta hai.
 */
const fetchContentData = async (keyword) => {
  const [articleData, images] = await Promise.all([
    generateAIContent(keyword),
    fetchImages(keyword, 4),
  ]);

  return { ...articleData, images };
};

/**
 * MAIN EXPORT FUNCTION: Jo components mein import hoga.
 * Next.js 'unstable_cache' ka use karke ye API responses ko Vercel Edge par save kar leta hai.
 * @param {string} keyword - Destination ka naam
 */
export const generateContent = async (keyword) => {
  // Cache key ko safe format mein convert kar rahe hain (e.g., "New Delhi" -> "new-delhi")
  const safeKey = keyword.toLowerCase().replace(/[^a-z0-9]/g, "-");
  
  const getCachedData = unstable_cache(
    async () => fetchContentData(keyword),  // Data fetch karne wala function
    [`ai-content-${safeKey}`],              // Unique cache key
    {
      revalidate: 86400,                    // 86400 seconds = 24 hours (24 ghante baad cache khud refresh hoga)
      tags: [`ai-content-${safeKey}`],      // Future mein On-Demand Revalidation ke liye tag
    }
  );

  return getCachedData();
};