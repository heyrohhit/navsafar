/**
 * FILE:  app/destinations/[slug]/page.jsx
 *
 * Destination detail page — data from packages directly.
 * Import path  ../../models/objAll/packages
 * = goes up from [slug] → destinations → app → finds models/objAll/packages
 *
 * All 50 cities from packages.js are handled including:
 *   São Paulo  → sao-paulo   (unicode normalized)
 *   New York City → new-york-city
 *   Hong Kong  → hong-kong   etc.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { packages } from "../../models/objAll/packages";

// ─────────────────────────────────────────────────────────────────────────────
// SLUG HELPER — unicode-safe (handles São Paulo, Zürich etc.)
// ─────────────────────────────────────────────────────────────────────────────
function toSlug(city) {
  return city
    .toLowerCase()
    .trim()
    .normalize("NFD")                   // decompose: ã → a + combining tilde
    .replace(/[\u0300-\u036f]/g, "")   // strip combining diacritics
    .replace(/\s+/g, "-")              // spaces → hyphens
    .replace(/[^a-z0-9-]/g, "");      // remove anything else
}

// ─────────────────────────────────────────────────────────────────────────────
// REGION DATA
// ─────────────────────────────────────────────────────────────────────────────
const REGION_MAP = {
  Europe:                ["France","UK","Italy","Spain","Netherlands","Czech Republic","Austria","Greece","Switzerland"],
  Asia:                  ["Thailand","Singapore","Japan","South Korea","China","Indonesia","Malaysia","Nepal"],
  "Middle East":         ["UAE","Turkey","Israel"],
  Americas:              ["USA","Canada","Mexico","Brazil","Argentina","Peru"],
  Africa:                ["South Africa","Morocco","Egypt","Kenya","Zimbabwe"],
  "Australia & Pacific": ["Australia","New Zealand"],
  India:                 ["India"],
};
const REGION_EMOJI = {
  Europe:"🏰", Asia:"🏯", "Middle East":"🕌",
  Americas:"🗽", Africa:"🦁", "Australia & Pacific":"🦘", India:"🕍",
};
function getRegion(country) {
  for (const [r, cs] of Object.entries(REGION_MAP)) {
    if (cs.includes(country)) return r;
  }
  return "Other";
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD DESTINATIONS — one per unique city, richest itinerary wins
// ─────────────────────────────────────────────────────────────────────────────
function buildAllDestinations() {
  const map = {};

  for (const pkg of packages) {
    const key = pkg.city;

    if (!map[key]) {
      map[key] = {
        slug:               toSlug(pkg.city),
        city:               pkg.city,
        country:            pkg.country,
        image:              pkg.image,
        tourism_type:       pkg.tourism_type      ?? [],
        famous_attractions: pkg.famous_attractions ?? [],
        bestTime:           pkg.bestTime          ?? null,
        highlights:         pkg.highlights        ?? [],
        activities:         pkg.activities        ?? [],
        description:        pkg.description       ?? "",
        tagline:            pkg.tagline           ?? "",
        rating:             pkg.rating            ?? null,
        duration:           pkg.duration          ?? null,
        itinerary:          pkg.itinerary         ?? [],
      };
    }

    // Longest itinerary wins
    if ((pkg.itinerary?.length ?? 0) > map[key].itinerary.length) {
      map[key].itinerary = pkg.itinerary;
      map[key].duration  = pkg.duration;
    }

    // First non-empty description / tagline wins
    if (!map[key].description && pkg.description) map[key].description = pkg.description;
    if (!map[key].tagline     && pkg.tagline)     map[key].tagline     = pkg.tagline;
  }

  return Object.values(map);
}

const ALL_DESTINATIONS = buildAllDestinations();

function getBySlug(slug) {
  return ALL_DESTINATIONS.find((d) => d.slug === slug) ?? null;
}

// Deterministic "related" — stable across SSR/hydration, no Math.random()
function getRelated(currentSlug, count = 4) {
  return ALL_DESTINATIONS
    .filter((d) => d.slug !== currentSlug)
    .map((d) => ({ d, r: Math.abs(Math.sin(d.city.length * 31 + d.country.length * 17)) }))
    .sort((a, b) => a.r - b.r)
    .map(({ d }) => d)
    .slice(0, count);
}

// ─────────────────────────────────────────────────────────────────────────────
// SSG 
// ─────────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return ALL_DESTINATIONS.map((d) => ({ slug: d.slug }));
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dest = getBySlug(slug);
  if (!dest) return { title: "Destination Not Found | WanderLux" };
  return {
    title:       `${dest.city}, ${dest.country} — Destinations | WanderLux`,
    description: dest.description || `Explore ${dest.city} with WanderLux Travel.`,
    openGraph: {
      title:       `${dest.city} Travel Guide | WanderLux`,
      description: dest.description || `Explore ${dest.city}`,
      images:      [{ url: dest.image, width: 1200, height: 630, alt: dest.city }],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPE CHIP COLOURS — covers every tourism_type in packages.js
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_COLORS = {
  // existing
  Cultural:       "bg-violet-50  text-violet-600  border-violet-200",
  Heritage:       "bg-amber-50   text-amber-600   border-amber-200",
  Beach:          "bg-cyan-50    text-cyan-600    border-cyan-200",
  Adventure:      "bg-orange-50  text-orange-600  border-orange-200",
  Nature:         "bg-green-50   text-green-600   border-green-200",
  Luxury:         "bg-yellow-50  text-yellow-700  border-yellow-200",
  Religious:      "bg-rose-50    text-rose-600    border-rose-200",
  Urban:          "bg-blue-50    text-blue-600    border-blue-200",
  Romantic:       "bg-pink-50    text-pink-600    border-pink-200",
  Historical:     "bg-stone-50   text-stone-600   border-stone-200",
  Nightlife:      "bg-purple-50  text-purple-600  border-purple-200",
  Shopping:       "bg-teal-50    text-teal-600    border-teal-200",
  // packages.js extra types
  "Modern Culture":"bg-indigo-50  text-indigo-600  border-indigo-200",
  Business:       "bg-slate-50   text-slate-600   border-slate-200",
  Entertainment:  "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
  "Film Tourism": "bg-red-50     text-red-600     border-red-200",
  "Theme Parks":  "bg-lime-50    text-lime-600    border-lime-200",
  Wildlife:       "bg-emerald-50 text-emerald-700 border-emerald-200",
  Skyline:        "bg-sky-50     text-sky-600     border-sky-200",
  Culture:        "bg-violet-50  text-violet-600  border-violet-200",
};

// ─────────────────────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function TypeChip({ label }) {
  const cls = TYPE_COLORS[label] ?? "bg-gray-50 text-gray-500 border-gray-200";
  return (
    <span className={`inline-block text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-7">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
        <span className="w-1 h-7 rounded-full bg-[#0f6477] flex-shrink-0" />
        {children}
      </h2>
      {sub && <p className="text-gray-400 text-sm mt-1.5 ml-4">{sub}</p>}
    </div>
  );
}

function HighlightCard({ text, index }) {
  return (
    <div className="flex items-start gap-3.5 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-[#0f6477]/25 transition-all duration-200">
      <span className="w-7 h-7 rounded-full bg-[#0f6477]/10 text-[#0f6477] text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-gray-700 text-sm font-medium leading-relaxed">{text}</span>
    </div>
  );
}

function AttractionItem({ name, index }) {
  return (
    <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm hover:border-[#0f6477]/30 hover:shadow-md transition-all duration-200">
      <div className="w-9 h-9 rounded-xl bg-[#0f6477]/8 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-[#0f6477]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <span className="flex-1 text-gray-700 font-semibold text-sm">{name}</span>
      <span className="text-gray-300 text-xs font-bold">#{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
}

function ActivityBadge({ text }) {
  return (
    <span className="inline-flex items-center gap-2 bg-[#0f6477]/6 border border-[#0f6477]/15 text-[#0f6477] text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#0f6477]/12 transition-colors">
      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </span>
  );
}

function ItineraryDay({ day, isLast }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center flex-shrink-0 w-10">
        <div className="w-10 h-10 rounded-full bg-[#0f6477] text-white text-xs font-black flex items-center justify-center shadow-lg shadow-[#0f6477]/25 z-10">
          {day.day}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-[#0f6477]/40 to-gray-100 mt-1" />
        )}
      </div>
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-9"}`}>
        <span className="text-[9px] font-black tracking-[3px] uppercase text-[#0f6477]">Day {day.day}</span>
        <h4 className="font-serif text-lg font-bold text-gray-800 mt-0.5 mb-2 leading-snug">{day.title}</h4>
        <p className="text-gray-500 text-sm leading-[1.8]">{day.description}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-[#0f6477]/8 flex items-center justify-center text-[#0f6477] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase leading-none mb-0.5">{label}</p>
        <p className="text-gray-700 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function RelatedCard({ dest }) {
  return (
    <Link
      href={`/destinations/${dest.slug}`}
      className="group relative aspect-[4/3] rounded-2xl overflow-hidden block border border-gray-200 hover:border-[#0f6477]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
    >
      <Image src={dest.image} alt={dest.city} fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width:640px) 50vw, 25vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-[#0f6477]/0 group-hover:bg-[#0f6477]/10 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white/45 text-[9px] font-black tracking-[2px] uppercase mb-1">{dest.country}</p>
        <h4 className="font-serif text-lg font-black text-white leading-tight group-hover:text-[#4db8cc] transition-colors">
          {dest.city}
        </h4>
        {dest.tourism_type?.length > 0 && (
          <p className="text-white/35 text-[10px] mt-1 line-clamp-1">
            {dest.tourism_type.slice(0, 2).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Icon = {
  Pin: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Globe: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
    </svg>
  ),
  Calendar: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Star: (
    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Arrow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  ArrowLeft: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
    </svg>
  ),
  Plane: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — Server Component
// ─────────────────────────────────────────────────────────────────────────────
export default async function DestinationDetailPage({ params }) {
  const { slug } = await params;
  const dest = getBySlug(slug);
  if (!dest) notFound();

  const region      = getRegion(dest.country);
  const regionEmoji = REGION_EMOJI[region] ?? "🌍";
  const related     = getRelated(dest.slug, 4);

  const hasHighlights  = dest.highlights.length > 0;
  const hasAttractions = dest.famous_attractions.length > 0;
  const hasActivities  = dest.activities.length > 0;
  const hasItinerary   = dest.itinerary.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ════════════ HERO ════════════ */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src={dest.image}
          alt={`${dest.city}, ${dest.country}`}
          fill priority sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb"
          className="absolute top-0 left-0 right-0 z-20 pt-[88px] sm:pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-widest uppercase">
              <li><Link href="/" className="text-white/40 hover:text-white transition-colors">Home</Link></li>
              <li className="text-white/20">›</li>
              <li><Link href="/destinations" className="text-white/40 hover:text-white transition-colors">Destinations</Link></li>
              <li className="text-white/20">›</li>
              <li className="text-white/60">{regionEmoji} {region}</li>
              <li className="text-white/20">›</li>
              <li className="text-white font-black">{dest.city}</li>
            </ol>
          </div>
        </nav>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 sm:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Type chips */}
            {dest.tourism_type.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {dest.tourism_type.map((t) => (
                  <span key={t}
                    className="text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-sm text-white border border-white/20">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* City + tagline */}
              <div>
                <p className="text-white/45 text-[11px] sm:text-sm font-bold tracking-[3px] uppercase mb-2">
                  {regionEmoji} {dest.country}
                </p>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none drop-shadow-2xl">
                  {dest.city}
                </h1>
                {dest.tagline && (
                  <p className="text-white/50 text-base sm:text-lg mt-3 font-medium italic max-w-lg">
                    "{dest.tagline}"
                  </p>
                )}
              </div>

              {/* Quick-fact pills */}
              <div className="flex flex-row sm:flex-col gap-2.5 flex-wrap sm:items-end">
                {dest.bestTime && (
                  <div className="flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5">
                    <svg className="w-4 h-4 text-[#4db8cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-xs font-semibold whitespace-nowrap">Best: {dest.bestTime}</span>
                  </div>
                )}
                {dest.rating && (
                  <div className="flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5">
                    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-xs font-semibold">{dest.rating} / 5</span>
                  </div>
                )}
                {dest.duration && (
                  <div className="flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5">
                    <svg className="w-4 h-4 text-[#4db8cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white text-xs font-semibold">{dest.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ════════════ MAIN BODY ════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 xl:gap-16 items-start">

          {/* LEFT — content */}
          <main className="space-y-14 min-w-0">

            {dest.description && (
              <section>
                <SectionTitle>About {dest.city}</SectionTitle>
                <p className="text-gray-600 text-base sm:text-[17px] leading-[1.9]">
                  {dest.description}
                </p>
              </section>
            )}

            {hasHighlights && (
              <section>
                <SectionTitle sub="Must-see experiences handpicked by our travel experts.">
                  Top Highlights
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.highlights.map((h, i) => (
                    <HighlightCard key={h} text={h} index={i} />
                  ))}
                </div>
              </section>
            )}

            {hasAttractions && (
              <section>
                <SectionTitle sub="Iconic landmarks and sites you cannot miss.">
                  Famous Attractions
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.famous_attractions.map((attr, i) => (
                    <AttractionItem key={attr} name={attr} index={i} />
                  ))}
                </div>
              </section>
            )}

            {hasActivities && (
              <section>
                <SectionTitle>Things to Do</SectionTitle>
                <div className="flex flex-wrap gap-2.5">
                  {dest.activities.map((a) => (
                    <ActivityBadge key={a} text={a} />
                  ))}
                </div>
              </section>
            )}

            {hasItinerary && (
              <section>
                <SectionTitle sub="A suggested day-by-day plan — fully customisable to your needs.">
                  Sample Itinerary
                </SectionTitle>
                <div>
                  {dest.itinerary.map((day, idx) => (
                    <ItineraryDay
                      key={day.day ?? idx}
                      day={day}
                      isLast={idx === dest.itinerary.length - 1}
                    />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* RIGHT — sticky sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-[100px]">

            {/* Info card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-[10px] font-black tracking-[3px] uppercase text-[#0f6477] mb-1">
                Destination Info
              </p>
              <InfoRow icon={Icon.Pin}      label="Country"            value={dest.country} />
              <InfoRow icon={Icon.Globe}    label="Region"             value={`${regionEmoji}  ${region}`} />
              {dest.bestTime && (
                <InfoRow icon={Icon.Calendar} label="Best Time to Visit" value={dest.bestTime} />
              )}
              {dest.duration && (
                <InfoRow icon={Icon.Clock}  label="Suggested Duration" value={dest.duration} />
              )}
              {dest.rating && (
                <InfoRow icon={Icon.Star}   label="Traveller Rating"   value={`${dest.rating} / 5.0`} />
              )}
              {dest.tourism_type.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-[10px] font-black tracking-[3px] uppercase text-gray-400 mb-3">
                    Travel Style
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dest.tourism_type.map((t) => <TypeChip key={t} label={t} />)}
                  </div>
                </div>
              )}
            </div>

            {/* CTA card */}
            <div className="bg-gradient-to-br from-[#0f6477] to-[#09404f] rounded-2xl p-6 text-center text-white shadow-xl shadow-[#0f6477]/20">
              <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-white/20">
                {Icon.Plane}
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">
                Plan Your {dest.city} Trip
              </h3>
              <p className="text-white/60 text-[13px] leading-relaxed mb-5">
                Get a custom itinerary crafted by our travel experts — tailored just for you.
              </p>
              <Link
                href={`/packages?city=${encodeURIComponent(dest.city)}`}
                className="block w-full bg-white text-[#0f6477] font-black tracking-widest uppercase text-[11px] py-3.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-md mb-3 text-center"
              >
                View Tour Packages
              </Link>
              <Link
                href="/contact"
                className="block w-full border border-white/25 text-white/70 hover:text-white hover:border-white/50 font-bold text-[11px] tracking-widest uppercase py-3 rounded-xl transition-all text-center"
              >
                Custom Trip Planning
              </Link>
            </div>

            {/* Back link */}
            <Link
              href="/destinations"
              className="flex items-center justify-center gap-2 text-[11px] font-black tracking-widest uppercase text-gray-400 hover:text-[#0f6477] transition-colors py-2"
            >
              {Icon.ArrowLeft}
              All Destinations
            </Link>
          </aside>
        </div>
      </div>


      {/* ════════════ RELATED ════════════ */}
      {related.length > 0 && (
        <section className="bg-white border-t border-gray-100 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 whitespace-nowrap">
                You Might Also Love
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
              <Link href="/destinations"
                className="text-[11px] font-black tracking-widest uppercase text-[#0f6477] hover:text-[#09404f] transition-colors whitespace-nowrap">
                All Destinations →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((d) => <RelatedCard key={d.slug} dest={d} />)}
            </div>
          </div>
        </section>
      )}


      {/* ════════════ BOTTOM CTA ════════════ */}
      <section className="bg-[#0f6477] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[10px] font-black tracking-[4px] uppercase text-white/45 mb-3">
            Ready to Go?
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Start Planning Your {dest.city} Adventure
          </h2>
          <p className="text-white/50 text-base mb-8 leading-relaxed max-w-md mx-auto">
            Browse our curated tour packages or talk to an expert for a fully personalised itinerary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/packages?city=${encodeURIComponent(dest.city)}`}
              className="inline-flex items-center gap-3 bg-white text-[#0f6477] font-black tracking-widest uppercase text-[11px] px-8 py-4 rounded-full hover:bg-gray-50 active:scale-95 transition-all shadow-xl shadow-black/10"
            >
              View Packages
              {Icon.Arrow}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-2 border-white/30 hover:border-white/70 text-white/70 hover:text-white font-bold text-[11px] tracking-widest uppercase px-8 py-4 rounded-full transition-all"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}