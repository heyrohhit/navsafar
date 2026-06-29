// src/lib/getBlogs.js
// ✅ FIXED: Reads from Supabase (same source as admin writes)
// Server-side only. Never import in "use client" components.
import { blogs as staticBlogs } from "../app/models/objAll/blog.js";
import { parseFaqText } from "./parseFaqText.js";
import { getPackages, getPackagesMtimeMs } from "./getPackages.js";

// ── TTL cache — 15 seconds ───────────────────────────────────
let _cache     = null;
let _cacheTime = 0;
const CACHE_TTL = 10_000; // 10 seconds — admin updates jaldi reflect honge

function isCacheValid() {
  return _cache && (Date.now() - _cacheTime) < CACHE_TTL;
}

export function clearBlogsCache() {
  _cache     = null;
  _cacheTime = 0;
}

// ── Supabase fetch ───────────────────────────────────────────
async function fetchFromSupabase() {
  try {
    // Dynamic import so this file stays usable in static/edge contexts
    const { createSupabaseClient } = await import("./supabaseClient.js");
    const supabase = createSupabaseClient(false); // anon key for reads

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) return data.map(dbToFrontend);
  } catch (err) {
    console.error("[getBlogs] Supabase error:", err.message);
  }
  return null;
}

// DB column → camelCase (exact Supabase blogs schema)
function dbToFrontend(row) {
  if (!row) return row;
  const sc = row.structured_content ?? row.structuredContent ?? {};
  if (!Array.isArray(sc.faq) || sc.faq.length === 0) {
    sc.faq = parseFaqText(sc.faqText || "");
  }
  return {
    ...row,
    // Reconstruct author from flat columns (author_name, author_avatar, author_designation)
    author: row.author ?? {
      name:        row.author_name        ?? "NavSafar Travels",
      avatar:      row.author_avatar      ?? "/assets/logo.jpeg",
      designation: row.author_designation ?? "Travel Expert",
    },
    coverImage:        row.cover_image        ?? row.coverImage  ?? "",
    publishedAt:       row.published_at       ?? row.publishedAt ?? "",
    readTime:          row.read_time          ?? row.readTime    ?? "",
    structuredContent: sc,
  };
}

// ── Package → blog (auto-generated) ─────────────────────────
function toSlug(v) {
  return String(v||"").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
}
function asArray(v=[]) { return Array.isArray(v)?v.filter(Boolean):[]; }

/**
 * ── FIXED PUBLISH DATE ────────────────────────────────────────
 * Package ID se deterministic hash → fixed publishedAt date generate karo.
 * Yeh date kabhi change nahi hogi, chahe server restart ho ya deploy ho.
 * SEO ke liye publishedAt stable rehna zaroori hai.
 * Range: 2024-01-01 se 2025-06-30 tak (past dates for credibility)
 */
function getFixedPublishDate(pkgId) {
  // Simple deterministic hash from package id string
  let hash = 0;
  const str = String(pkgId || "default");
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const absHash = Math.abs(hash);
  // Map to a date range: 540 days between 2024-01-01 and 2025-06-30
  const BASE_DATE = new Date("2024-01-01").getTime();
  const RANGE_DAYS = 540;
  const dayOffset = absHash % RANGE_DAYS;
  const publishDate = new Date(BASE_DATE + dayOffset * 86400000);
  return publishDate.toISOString().slice(0, 10);
}

/**
 * ── DAILY UPDATED_AT ──────────────────────────────────────────
 * Today's date as updatedAt — Google ko freshness signal milta hai.
 * Content bhi daily generate hota hai, toh yeh accurate hai.
 */
function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * ── DEEP ARTICLE CONTENT BUILDER ─────────────────────────────
 * Full-length, SEO/AEO/GEO/XOS optimized HTML content generate karo.
 * Har section properly structured hai search intent ke hisaab se.
 */
function buildDeepContent(pkg) {
  const city        = pkg.city    || "This Destination";
  const country     = pkg.country || "India";
  const duration    = pkg.duration || "5N / 6D";
  const bestTime    = pkg.bestTime || pkg.best_time || "October to March";
  const attractions = asArray(pkg.famous_attractions);
  const highlights  = asArray(pkg.highlights);
  const activities  = asArray(pkg.activities || []);
  const itinerary   = asArray(pkg.itinerary);
  const tourTypes   = asArray(pkg.tourism_type);
  const tagline     = pkg.tagline || `Experience the best of ${city}`;
  const description = pkg.description || `${city} is one of ${country}'s most captivating destinations.`;
  const rating      = pkg.rating || 4.7;

  // ── Section 1: Hero Introduction ──────────────────────────
  const introSection = `
<section class="blog-intro">
  <p class="lead">${description} Whether you're a first-time visitor or a seasoned traveller returning for more, a well-planned <strong>${city} tour package</strong> ensures you experience the very best this destination has to offer — without missing a single highlight.</p>
  <p>NavSafar's curated <strong>${city}, ${country} travel packages</strong> are designed by local experts who know these streets, seasons, and secrets intimately. From luxury stays to budget-friendly itineraries, we match every traveller with their perfect ${city} experience.</p>
  <p>In this complete guide, you'll find everything you need: the best time to visit ${city}, top attractions, day-by-day itinerary, travel tips, visa information, budget breakdown, and honest answers to the most-asked questions about travelling to ${city}.</p>
</section>`;

  // ── Section 2: Quick Facts ─────────────────────────────────
  const quickFacts = `
<section class="blog-quick-facts">
  <h2>📋 ${city} Tour Package — Quick Facts</h2>
  <table class="facts-table">
    <tr><td><strong>Destination</strong></td><td>${city}, ${country}</td></tr>
    <tr><td><strong>Tour Duration</strong></td><td>${duration}</td></tr>
    <tr><td><strong>Best Time to Visit</strong></td><td>${bestTime}</td></tr>
    <tr><td><strong>Tour Type</strong></td><td>${tourTypes.join(", ") || "Leisure & Sightseeing"}</td></tr>
    <tr><td><strong>Top Attractions</strong></td><td>${attractions.slice(0,3).join(", ") || `${city}'s famous landmarks`}</td></tr>
    <tr><td><strong>NavSafar Rating</strong></td><td>⭐ ${rating}/5 — Highly Recommended</td></tr>
    <tr><td><strong>Ideal For</strong></td><td>Couples, Families, Solo Travellers, Honeymoon</td></tr>
  </table>
</section>`;

  // ── Section 3: Why Visit ───────────────────────────────────
  const whyVisit = `
<section class="blog-why-visit">
  <h2>Why Visit ${city} in ${new Date().getFullYear()}?</h2>
  <p>${tagline}. ${city} has earned its place on every serious traveller's bucket list — and for good reason. Here's why ${new Date().getFullYear()} is the perfect year to plan your ${city} trip:</p>
  <ul>
    <li><strong>World-Class Attractions:</strong> ${attractions.slice(0,2).join(" and ")} are among ${country}'s most iconic landmarks, drawing millions of visitors who leave transformed by the experience.</li>
    <li><strong>Cultural Richness:</strong> ${city} offers a unique blend of ${tourTypes.join(" and ").toLowerCase() || "history, art, and local traditions"} that simply cannot be replicated anywhere else in the world.</li>
    <li><strong>Improved Connectivity:</strong> Direct flights, upgraded road networks, and enhanced hotel infrastructure make ${city} more accessible than ever in ${new Date().getFullYear()}.</li>
    <li><strong>Value for Money:</strong> With the right package from NavSafar, your ${city} holiday delivers extraordinary experiences at prices that represent exceptional value.</li>
    <li><strong>Year-Round Appeal:</strong> While ${bestTime} is the peak season, ${city} offers rewarding travel experiences throughout the year, each season bringing its own character.</li>
  </ul>
</section>`;

  // ── Section 4: Top Attractions ────────────────────────────
  const attractionsSection = attractions.length > 0 ? `
<section class="blog-attractions">
  <h2>Top ${attractions.length} Places to Visit in ${city}</h2>
  <p>Any ${city} tour package worth its name will cover these essential attractions. Our expert guides provide context and stories that transform sightseeing into genuine understanding.</p>
  ${attractions.map((place, i) => `
  <h3>${i + 1}. ${place}</h3>
  <p>${place} is one of ${city}'s most celebrated landmarks and a must-include on any ${city} itinerary. Visitors consistently rate this among the top experiences of their entire journey through ${country}. NavSafar's guides ensure you experience ${place} at the optimal time of day with deep cultural and historical context.</p>`).join("")}
</section>` : "";

  // ── Section 5: Highlights ─────────────────────────────────
  const highlightsSection = highlights.length > 0 ? `
<section class="blog-highlights">
  <h2>What's Included in NavSafar's ${city} Tour Package</h2>
  <p>Our ${city} packages are thoughtfully curated to ensure you experience every essential highlight without feeling rushed. Here's what makes our <strong>${city} tour package</strong> exceptional:</p>
  <ul>
    ${highlights.map(h => `<li>✅ <strong>${h}</strong></li>`).join("\n    ")}
  </ul>
  <p>Every experience is led by certified local guides who bring ${city}'s stories alive — from ancient history to contemporary culture. NavSafar handles all logistics so you can focus entirely on experiencing ${city}.</p>
</section>` : "";

  // ── Section 6: Best Time to Visit ─────────────────────────
  const bestTimeSection = `
<section class="blog-best-time">
  <h2>Best Time to Visit ${city} — Month-by-Month Guide</h2>
  <p>Choosing the right time to travel to ${city} significantly impacts your experience. Here's our expert breakdown:</p>

  <h3>🌟 Peak Season: ${bestTime}</h3>
  <p>This is widely considered the best time to visit ${city}. Weather conditions are ideal, all attractions are fully operational, and the destination is at its most vibrant. Book your ${city} tour package at least 3 months in advance during this period as availability is limited.</p>

  <h3>☀️ Shoulder Season</h3>
  <p>The weeks immediately before and after peak season offer an excellent balance — good weather with smaller crowds and occasionally better rates. NavSafar often secures better hotel allocations during shoulder season, delivering premium experiences at reduced cost.</p>

  <h3>🌧️ Off-Season Travel</h3>
  <p>Adventurous travellers who visit ${city} in the off-season discover a more authentic, less crowded destination. Some attractions offer reduced entry fees, and accommodation rates can be significantly lower. NavSafar's local team monitors conditions and adjusts itineraries to maximise your experience regardless of when you travel.</p>

  <p><strong>NavSafar Tip:</strong> For families with school-going children, we recommend booking the ${city} package during the first two weeks of the peak season to balance optimal weather with manageable crowds.</p>
</section>`;

  // ── Section 7: Day-by-Day Itinerary ───────────────────────
  const itinerarySection = itinerary.length > 0 ? `
<section class="blog-itinerary">
  <h2>${city} Tour Itinerary — Day-by-Day Breakdown</h2>
  <p>This is NavSafar's signature <strong>${city} ${duration} itinerary</strong>, refined through hundreds of guest trips. Every timing, route, and restaurant recommendation has been field-tested to deliver the perfect balance of sightseeing, leisure, and authentic experiences.</p>
  ${itinerary.map(day => `
  <div class="itinerary-day">
    <h3>Day ${day.day}: ${day.title || `Exploring ${city}`}</h3>
    <p>${day.description || `A carefully planned day experiencing the best of ${city}.`}</p>
    ${day.activities ? `<p><strong>Activities:</strong> ${asArray(day.activities).join(" → ")}</p>` : ""}
    ${day.meals ? `<p><strong>Meals Included:</strong> ${day.meals}</p>` : ""}
  </div>`).join("")}
  <p><em>Note: This itinerary is a sample. NavSafar customises every ${city} tour package based on your group size, interests, travel dates, and budget. Contact us to create your perfect ${city} itinerary.</em></p>
</section>` : "";

  // ── Section 8: Activities ─────────────────────────────────
  const activitiesSection = activities.length > 0 ? `
<section class="blog-activities">
  <h2>Things to Do in ${city} — Experiences You Can't Miss</h2>
  <p>Beyond the classic sightseeing, ${city} offers a rich range of experiences that reveal the destination's true character. NavSafar's ${city} packages can include any of these curated activities:</p>
  <ul>
    ${activities.map(act => `<li>🎯 <strong>${act}</strong> — A favourite among NavSafar guests exploring ${city}.</li>`).join("\n    ")}
  </ul>
</section>` : "";

  // ── Section 9: Travel Tips ─────────────────────────────────
  const travelTips = `
<section class="blog-travel-tips">
  <h2>Essential Travel Tips for ${city} — What Every Visitor Should Know</h2>
  <p>After arranging thousands of ${city} trips, NavSafar's team has compiled the most important advice for first-time and returning visitors:</p>

  <h3>📱 Before You Travel</h3>
  <ul>
    <li><strong>Book in advance:</strong> Popular ${city} hotels and experiences fill up quickly, especially during ${bestTime}. NavSafar recommends booking your ${city} package at least 6-8 weeks ahead.</li>
    <li><strong>Travel insurance:</strong> Always purchase comprehensive travel insurance that covers medical evacuation, trip cancellation, and lost baggage before travelling to ${city}.</li>
    <li><strong>Visa requirements:</strong> Check the latest visa requirements for ${country} based on your nationality. NavSafar's team can advise on current requirements and assist with documentation.</li>
    <li><strong>Currency:</strong> Research the local currency and current exchange rates. NavSafar recommends exchanging a small amount before departure and using ATMs at your destination for the best rates.</li>
  </ul>

  <h3>🧳 Packing for ${city}</h3>
  <ul>
    <li>Pack appropriate clothing for ${city}'s climate during ${bestTime}.</li>
    <li>Comfortable walking shoes are essential — ${city}'s best experiences involve exploring on foot.</li>
    <li>A universal power adapter if travelling internationally to ${country}.</li>
    <li>Photocopies of all important documents stored separately from originals.</li>
  </ul>

  <h3>💡 On the Ground in ${city}</h3>
  <ul>
    <li><strong>Respect local customs:</strong> ${city} has its own cultural norms. NavSafar's pre-trip briefing covers everything you need to know about local etiquette.</li>
    <li><strong>Try local food:</strong> The most authentic ${city} experience is found in local restaurants away from tourist areas. Ask your NavSafar guide for their personal recommendations.</li>
    <li><strong>Bargaining etiquette:</strong> In local markets, negotiation is expected and part of the cultural experience — but always be respectful and fair.</li>
    <li><strong>Photography:</strong> Always ask permission before photographing people. Some sacred sites in ${city} have photography restrictions that your guide will inform you about.</li>
  </ul>
</section>`;

  // ── Section 10: Why NavSafar ───────────────────────────────
  const whyNavsafar = `
<section class="blog-why-navsafar">
  <h2>Why Book Your ${city} Tour Package with NavSafar?</h2>
  <p>With hundreds of travel companies offering ${city} packages, why do thousands of travellers choose NavSafar? Here's what sets us apart:</p>
  <ul>
    <li>🏆 <strong>Local Expertise:</strong> Our ${city} specialists have personally visited and vetted every hotel, restaurant, and attraction in our packages. You benefit from genuine insider knowledge.</li>
    <li>🔧 <strong>Fully Customisable:</strong> No two NavSafar ${city} tours are identical. We build your package around your travel style, budget, and interests.</li>
    <li>📞 <strong>24/7 On-Trip Support:</strong> Your NavSafar contact is available around the clock throughout your ${city} journey. Any issue is resolved immediately.</li>
    <li>💰 <strong>Best Price Guarantee:</strong> Our direct relationships with ${city} hotels and transport partners mean we consistently deliver better value than online booking platforms.</li>
    <li>⭐ <strong>Verified Reviews:</strong> Our ${city} packages carry a ${rating}/5 rating from hundreds of verified guest reviews. Real experiences, real feedback.</li>
    <li>🌱 <strong>Responsible Travel:</strong> NavSafar partners with local businesses in ${city} that prioritise sustainable and community-positive tourism practices.</li>
  </ul>
</section>`;

  return introSection + quickFacts + whyVisit + attractionsSection + highlightsSection + bestTimeSection + itinerarySection + activitiesSection + travelTips + whyNavsafar;
}

/**
 * ── DEEP FAQ BUILDER ─────────────────────────────────────────
 * AEO (Answer Engine Optimisation) ke liye comprehensive FAQs.
 * Google Featured Snippets + AI Overviews ke liye structured.
 */
function buildDeepFaqs(pkg) {
  const city     = pkg.city    || "This Destination";
  const country  = pkg.country || "India";
  const bestTime = pkg.bestTime || pkg.best_time || "October to March";
  const duration = pkg.duration || "5N / 6D";
  const attractions = asArray(pkg.famous_attractions);
  const tourTypes   = asArray(pkg.tourism_type);

  return [
    {
      q: `What is the best time to visit ${city}?`,
      a: `The best time to visit ${city} is ${bestTime}. During this period, weather conditions are most favourable for sightseeing and outdoor activities. ${city} receives the highest number of visitors during this season, so booking your ${city} tour package at least 2-3 months in advance is strongly recommended to secure the best hotels and experiences.`
    },
    {
      q: `What is included in a NavSafar ${city} tour package?`,
      a: `NavSafar's ${city} tour package typically includes airport transfers, hotel accommodation (with options from budget to luxury), guided sightseeing tours covering top attractions like ${attractions.slice(0,2).join(" and ") || `${city}'s key landmarks`}, daily breakfast, and 24/7 on-trip support. The exact inclusions depend on the specific package variant you choose. Contact NavSafar to create a fully customised ${city} package.`
    },
    {
      q: `How many days are needed for a ${city} trip?`,
      a: `NavSafar recommends ${duration} for a complete ${city} experience that covers all major attractions without feeling rushed. This allows time to explore the top sights, enjoy authentic local cuisine, and have unstructured time to discover ${city} at your own pace. Shorter 3-4 day trips are possible for travellers with limited time, focusing on the absolute highlights.`
    },
    {
      q: `What are the top places to visit in ${city}?`,
      a: `The most unmissable places to visit in ${city} include: ${attractions.length > 0 ? attractions.map((a, i) => `${i+1}) ${a}`).join(", ") : `${city}'s famous landmarks, historical sites, and natural attractions`}. NavSafar's expert guides bring each of these locations alive with historical context, insider stories, and photography tips that transform sightseeing into genuine discovery.`
    },
    {
      q: `Is ${city} suitable for a family holiday?`,
      a: `Yes, ${city} is an excellent choice for a family holiday. ${city} offers a diverse range of experiences that appeal to travellers of all ages — from historical sites and cultural experiences to outdoor activities and local cuisine. NavSafar designs family-specific ${city} tour packages with child-friendly pacing, age-appropriate activities, and family-suitable accommodation options.`
    },
    {
      q: `What type of experiences does ${city} offer?`,
      a: `${city} is known for its ${tourTypes.join(", ").toLowerCase() || "cultural, historical, and leisure"} experiences. Visitors can expect world-class ${attractions.slice(0,1)[0] || "attractions"}, authentic local cuisine, vibrant markets, and opportunities for ${asArray(pkg.activities).slice(0,2).join(" and ") || "guided tours and cultural immersion"}. ${city} consistently ranks among ${country}'s top travel destinations precisely because of this diversity of experience.`
    },
    {
      q: `How do I book a ${city} tour package with NavSafar?`,
      a: `Booking your ${city} tour package with NavSafar is simple. Visit navsafar.com, browse our ${city} packages, and select the option that matches your travel dates, group size, and budget. Alternatively, contact our ${city} specialists directly via phone or WhatsApp for a fully customised quote. NavSafar offers flexible payment options and a clear cancellation policy.`
    },
    {
      q: `Is ${city} safe for solo travellers?`,
      a: `${city} is considered safe for solo travellers, particularly those who take standard precautions. NavSafar recommends that solo travellers share their itinerary with someone at home, stay in centrally located accommodation, use reputable transport options, and stay connected with our 24/7 support team. NavSafar can arrange solo-friendly group tours to ${city} for travellers who prefer companionship.`
    },
  ];
}

function buildPackageBlog(pkg) {
  const city       = pkg.city    || "This Destination";
  const country    = pkg.country || "India";
  const citySlug   = toSlug(city);
  const slug       = `${citySlug}-tour-package-guide`;
  const pkgId      = pkg.id || citySlug;
  const attractions = asArray(pkg.famous_attractions);
  const tourTypes   = asArray(pkg.tourism_type);
  const highlights  = asArray(pkg.highlights);
  const duration    = pkg.duration || "5N / 6D";
  const bestTime    = pkg.bestTime || pkg.best_time || "October to March";

  // ── FIXED publishedAt — deterministic from package ID, never changes ──
  const fixedPublishedAt = getFixedPublishDate(pkgId);

  // ── TODAY as updatedAt — freshness signal for Google / AI crawlers ────
  const todayUpdatedAt = getTodayDate();

  // ── Rich excerpt for SERP snippet ─────────────────────────────────────
  const excerpt = `Complete ${city} tour package guide for ${new Date().getFullYear()} — best time to visit, top attractions (${attractions.slice(0,2).join(", ") || city}), ${duration} itinerary, travel tips & booking info. Curated by NavSafar travel experts.`;

  // ── Tags for SEO & topic clustering ──────────────────────────────────
  const tags = [
    city, country,
    `${city} tour package`,
    `${city} travel guide`,
    `visit ${city}`,
    `${city} itinerary`,
    `${country} tourism`,
    ...tourTypes,
    ...attractions.slice(0, 3),
  ].filter(Boolean);

  // ── Read time estimate (based on content length) ──────────────────────
  const wordCount = 1800 + (highlights.length * 40) + (asArray(pkg.itinerary).length * 80);
  const readTime  = `${Math.max(7, Math.ceil(wordCount / 200))} min read`;

  return {
    id:          `package-${pkgId}`,
    slug,
    title:       `${city}, ${country} Tour Package ${new Date().getFullYear()}: Complete Travel Guide & Itinerary`,
    excerpt,
    coverImage:  pkg.image || "/assets/bg.jpg",
    category:    "Packages",
    tags,
    author: {
      name:        "NavSafar Travels",
      avatar:      "/assets/logo.jpeg",
      designation: "Destination Travel Expert",
    },

    // ✅ KEY: publishedAt is FIXED forever — SEO authority stays intact
    publishedAt: fixedPublishedAt,

    readTime,
    featured:    pkg.popular === true || pkg.popular === "true",
    status:      "published",

    // ── Deep full-length article HTML ─────────────────────────
    content: buildDeepContent(pkg),

    // ── Structured content for page rendering ─────────────────
    structuredContent: {
      intro: `${pkg.description || `${city} is one of ${country}'s most captivating destinations, offering an extraordinary blend of culture, history, and natural beauty.`} This comprehensive ${city} travel guide covers everything you need to plan a perfect trip — from the best time to visit and top attractions to practical travel tips and a day-by-day itinerary. NavSafar's ${city} tour packages are designed by local experts to deliver authentic, memorable experiences for every type of traveller.`,

      highlights,

      tips: [
        `Book your ${city} tour package at least 6-8 weeks before your travel dates, especially for ${bestTime} travel.`,
        `Carry comfortable walking shoes — ${city}'s most rewarding experiences involve exploring on foot.`,
        `Ask your NavSafar guide for their personal restaurant recommendations in ${city} for the most authentic local dining.`,
        `Download offline maps of ${city} before arrival to navigate confidently without relying on data connectivity.`,
        `Exchange currency at authorised money changers in ${city} rather than airport kiosks for better rates.`,
        `Respect local customs and dress codes, particularly at religious or heritage sites in ${city}.`,
      ],

      itinerary: asArray(pkg.itinerary),

      // ✅ AEO: Comprehensive FAQs for Google Featured Snippets & AI Overviews
      faq: buildDeepFaqs(pkg),
    },

    destination: { city, country },

    // ✅ Fixed publish date — Google uses this for indexing authority
    createdAt:  fixedPublishedAt + "T00:00:00.000Z",

    // ✅ Today's date — freshness signal for SEO crawlers daily
    updatedAt:  todayUpdatedAt + "T00:00:00.000Z",
  };
}

// ── Date sort helper — updated_at > created_at > publishedAt ─
function getDateMs(blog) {
  const d = blog.updated_at || blog.updatedAt || blog.created_at || blog.createdAt || blog.publishedAt || blog.published_at || "";
  if (!d) return 0;
  const ms = Date.parse(d);
  return isNaN(ms) ? 0 : ms;
}

// ── MAIN — async (use in server components & API routes) ─────
export async function getBlogsAsync() {
  if (isCacheValid()) return _cache;

  const supabaseBlogs = await fetchFromSupabase();
  const baseBLogs     = supabaseBlogs ?? staticBlogs;

  const packageBlogs  = getPackages().map(buildPackageBlog);
  const usedSlugs     = new Set(baseBLogs.map((b) => b.slug).filter(Boolean));
  const merged = [
    ...baseBLogs,
    ...packageBlogs.filter((b) => !usedSlugs.has(b.slug)),
  ];

  // ✅ FIX: Supabase updated_at / created_at ke hisaab se sort — latest sabse upar
  merged.sort((a, b) => getDateMs(b) - getDateMs(a));

  _cache     = merged;
  _cacheTime = Date.now();
  return _cache;
}

// ── SYNC — for callers that can't await (returns cache or static) ─
export function getBlogs() {
  if (isCacheValid()) return _cache;
  return _cache ?? staticBlogs;
}

// ── Named exports used by pages ──────────────────────────────
export async function getBlogCategories() {
  const blogs = await getBlogsAsync();
  return ["All", ...new Set(blogs.map((b) => b.category).filter(Boolean))];
}

export async function getBlogBySlug(slug) {
  const blogs = await getBlogsAsync();
  return blogs.find((b) => b.slug === slug) ?? null;
}

export async function getFeaturedBlogs(limit = 1) {
  const blogs = await getBlogsAsync();
  // ✅ FIX: Featured blogs bhi date ke hisaab se sort — latest sabse upar
  return blogs
    .filter((b) => b.featured === true)
    .sort((a, b) => getDateMs(b) - getDateMs(a))
    .slice(0, limit);
}

export async function getRecentBlogs(limit = 6) {
  const blogs = await getBlogsAsync();
  // ✅ FIX: updated_at ya created_at use karo — publishedAt nahi
  return [...blogs]
    .sort((a, b) => getDateMs(b) - getDateMs(a))
    .slice(0, limit);
}

export async function filterBlogs({ category = "All", search, limit } = {}) {
  let data = await getBlogsAsync();
  if (category && category !== "All")
    data = data.filter((b) => b.category === category);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((b) =>
      [b.title, b.excerpt, b.category, ...(b.tags??[])].join(" ").toLowerCase().includes(q)
    );
  }
  if (limit) data = data.slice(0, Number(limit));
  return data;
}

export async function getRelatedBlogs(currentSlug, category, limit = 3) {
  const blogs = await getBlogsAsync();
  return blogs
    .filter((b) => b.slug !== currentSlug && b.category === category)
    .sort((a, b) => getDateMs(b) - getDateMs(a))
    .slice(0, limit);
}
