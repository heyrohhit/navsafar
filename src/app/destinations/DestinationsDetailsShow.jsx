"use client"

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { packages } from "../models/objAll/packages";

// ─────────────────────────────────────────────────────────────────────
// Slug helper  "New York City" → "new-york-city"
// ─────────────────────────────────────────────────────────────────────
function toSlug(city) {
  return city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ─────────────────────────────────────────────────────────────────────
// Build unique destinations deduplicated by city
// Each gets a slug and href pointing to detail page
// ─────────────────────────────────────────────────────────────────────
const destinations = Object.values(
  packages.reduce((acc, pkg) => {
    if (!acc[pkg.city]) {
      acc[pkg.city] = {
        slug:               toSlug(pkg.city),
        city:               pkg.city,
        country:            pkg.country,
        image:              pkg.image,
        tourism_type:       pkg.tourism_type      ?? [],
        famous_attractions: pkg.famous_attractions ?? [],
        bestTime:           pkg.bestTime          ?? null,
        highlights:         (pkg.highlights        ?? []).slice(0, 4),
        rating:             pkg.rating            ?? null,
        href:               `/destinations/${toSlug(pkg.city)}`,
      };
    }
    return acc;
  }, {})
);

const ALL_IMAGES = destinations.map((d) => ({
  src: d.image, city: d.city, country: d.country,
}));

// ─────────────────────────────────────────────────────────────────────
// Regions
// ─────────────────────────────────────────────────────────────────────
const REGION_MAP = {
  Europe:                ["France","UK","Italy","Spain","Netherlands","Czech Republic","Austria","Greece","Switzerland"],
  Asia:                  ["Thailand","Singapore","Japan","South Korea","China","Indonesia","Malaysia","Nepal"],
  "Middle East":         ["UAE","Turkey","Israel"],
  Americas:              ["USA","Canada","Mexico","Brazil","Argentina","Peru"],
  Africa:                ["South Africa","Morocco","Egypt","Kenya","Zimbabwe"],
  "Australia & Pacific": ["Australia","New Zealand"],
  India:                 ["India"],
};
const REGIONS = ["All", ...Object.keys(REGION_MAP)];
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

// ─────────────────────────────────────────────────────────────────────
// Type chip
// ─────────────────────────────────────────────────────────────────────
const TYPE_COLORS = {
  Cultural:"bg-violet-50 text-violet-600 border-violet-200",
  Heritage:"bg-amber-50 text-amber-600 border-amber-200",
  Beach:"bg-cyan-50 text-cyan-600 border-cyan-200",
  Adventure:"bg-orange-50 text-orange-600 border-orange-200",
  Nature:"bg-green-50 text-green-600 border-green-200",
  Luxury:"bg-yellow-50 text-yellow-700 border-yellow-200",
  Religious:"bg-rose-50 text-rose-600 border-rose-200",
  Urban:"bg-blue-50 text-blue-600 border-blue-200",
  Romantic:"bg-pink-50 text-pink-600 border-pink-200",
  Historical:"bg-stone-50 text-stone-600 border-stone-200",
  Nightlife:"bg-purple-50 text-purple-600 border-purple-200",
};
function TypeChip({ label }) {
  const cls = TYPE_COLORS[label] || "bg-gray-50 text-gray-500 border-gray-200";
  return (
    <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Fisher-Yates shuffle
// ─────────────────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────────────────
// Hero Mosaic — 2 rows (2+3), full-screen, auto-rotating
// ─────────────────────────────────────────────────────────────────────
function HeroMosaic() {
  const [slots, setSlots] = useState(() => shuffleArray(ALL_IMAGES).slice(0, 5));
  const [fading, setFading] = useState(null);

  useEffect(() => {
    const pool = shuffleArray(ALL_IMAGES);
    let poolIdx = 5;
    const id = setInterval(() => {
      const s = Math.floor(Math.random() * 5);
      setFading(s);
      setTimeout(() => {
        setSlots((prev) => {
          const next = [...prev];
          next[s] = pool[poolIdx % pool.length];
          poolIdx++;
          return next;
        });
        setFading(null);
      }, 600);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex flex-1">
        {slots.slice(0, 2).map((img, i) => (
          <div key={i} className="relative flex-1 overflow-hidden">
            <Image src={img.src} alt={img.city} fill priority={i === 0} sizes="50vw"
              className={`object-cover transition-opacity duration-[600ms] ${fading === i ? "opacity-0" : "opacity-100"}`} />
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        {slots.slice(2, 5).map((img, i) => (
          <div key={i} className="relative flex-1 overflow-hidden">
            <Image src={img.src} alt={img.city} fill sizes="33vw"
              className={`object-cover transition-opacity duration-[600ms] ${fading === i + 2 ? "opacity-0" : "opacity-100"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Large Card  →  /destinations/[slug]
// ─────────────────────────────────────────────────────────────────────
function LargeDestCard({ dest, tall = false }) {
  return (
    <Link
      href={dest.href}
      className={`group relative ${tall ? "h-[380px] sm:h-[440px]" : "h-[260px] sm:h-[300px]"} rounded-2xl overflow-hidden block border border-gray-200 hover:border-[#0f6477]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#0f6477]/15 hover:-translate-y-1`}
    >
      <Image src={dest.image} alt={`${dest.city}, ${dest.country}`} fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-[#0f6477]/0 group-hover:bg-[#0f6477]/10 transition-colors duration-500" />

      {dest.bestTime && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-600 text-[9px] font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          🗓 Best: {dest.bestTime}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex flex-wrap gap-1.5 mb-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          {dest.tourism_type.slice(0, 2).map((t) => (
            <span key={t} className="text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded-full bg-white/90 text-gray-600 border border-white/50">{t}</span>
          ))}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">{dest.country}</p>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-white leading-none group-hover:text-[#4db8cc] transition-colors duration-300">
              {dest.city}
            </h3>
            {dest.famous_attractions.length > 0 && (
              <p className="text-white/35 text-[11px] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                {dest.famous_attractions.join(" · ")}
              </p>
            )}
          </div>
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 shadow-md">
            <svg className="w-4 h-4 text-[#0f6477]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Compact Card  →  /destinations/[slug]
// ─────────────────────────────────────────────────────────────────────
function CompactDestCard({ dest }) {
  return (
    <Link href={dest.href}
      className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-[#0f6477]/40 hover:shadow-md transition-all duration-300">
      <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <Image src={dest.image} alt={dest.city} fill sizes="80px"
          className="object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-[9px] font-black tracking-widest uppercase mb-0.5">{dest.country}</p>
        <h4 className="font-serif text-base font-bold text-gray-800 group-hover:text-[#0f6477] transition-colors leading-tight mb-1.5">
          {dest.city}
        </h4>
        <div className="flex flex-wrap gap-1">
          {dest.tourism_type.slice(0, 2).map((t) => <TypeChip key={t} label={t} />)}
        </div>
      </div>
      <svg className="w-4 h-4 text-[#0f6477] opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Region Section
// ─────────────────────────────────────────────────────────────────────
function RegionSection({ region, dests, onExploreAll }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-7">
        <span className="text-3xl">{REGION_EMOJI[region] || "🌍"}</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-gray-800">{region}</h2>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-xs">{dests.length} destinations</span>
      </div>
      <div className={`grid gap-4 mb-4 ${
        dests.length === 1 ? "grid-cols-1" : dests.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
      }`}>
        {dests.slice(0, 3).map((d, i) => (
          <LargeDestCard key={d.city} dest={d} tall={i === 0 && dests.length >= 2} />
        ))}
      </div>
      {dests.length > 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {dests.slice(3).map((d) => <CompactDestCard key={d.city} dest={d} />)}
        </div>
      )}
      <div className="flex justify-end mt-5">
        <button onClick={onExploreAll}
          className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#0f6477] hover:text-[#0a4d5e] transition-colors">
          All {region} destinations
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────
export default function DestinationsClient() {
  const [activeRegion, setActiveRegion] = useState("All");
  const [search, setSearch]             = useState("");

  const totalCountries = new Set(destinations.map((d) => d.country)).size;

  const byRegion = useMemo(() => {
    const map = {};
    destinations.forEach((d) => {
      const r = getRegion(d.country);
      if (!map[r]) map[r] = [];
      map[r].push(d);
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    let list = destinations;
    if (activeRegion !== "All") {
      const cs = REGION_MAP[activeRegion] || [];
      list = list.filter((d) => cs.includes(d.country));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) =>
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.famous_attractions.some((a) => a.toLowerCase().includes(q)) ||
        d.tourism_type.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeRegion, search]);

  const showGrouped = activeRegion === "All" && !search.trim();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <HeroMosaic />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/75 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0f6477]/20 to-transparent pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
          <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[5px] uppercase text-white/80 border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4db8cc] animate-pulse" />
            Destinations
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight mb-5 drop-shadow-2xl">
            Where Do You<br /><span className="italic">Want to Go?</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-md mb-10 leading-relaxed drop-shadow">
            {destinations.length} iconic destinations across {totalCountries} countries — discover yours.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 shadow-2xl border border-white/50 focus-within:ring-2 focus-within:ring-[#0f6477]/40 transition-all">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, country or attraction…"
                className="flex-1 bg-transparent text-gray-700 placeholder:text-gray-400 text-sm outline-none" />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 sm:gap-14 mt-12">
            {[
              { n:`${destinations.length}+`, l:"Destinations" },
              { n:`${totalCountries}+`,      l:"Countries"    },
              { n:"50K+",                    l:"Travellers"   },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-serif text-3xl sm:text-4xl font-black text-white drop-shadow">{s.n}</div>
                <div className="text-white/50 text-[10px] tracking-[3px] uppercase mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ STICKY REGION FILTER ═══ */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3.5">
            {REGIONS.map((r) => (
              <button key={r}
                onClick={() => { setActiveRegion(r); setSearch(""); }}
                className={`whitespace-nowrap flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                  activeRegion === r
                    ? "bg-[#0f6477] border-[#0f6477] text-white shadow-md shadow-[#0f6477]/20"
                    : "border-gray-200 text-gray-500 bg-white hover:border-[#0f6477]/50 hover:text-[#0f6477]"
                }`}>
                {REGION_EMOJI[r] && <span>{REGION_EMOJI[r]}</span>}
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Search results */}
        {search.trim() && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="font-serif text-2xl font-bold text-gray-800">
                Results for <span className="text-[#0f6477]">"{search}"</span>
              </h2>
              <span className="text-gray-400 text-sm">— {filtered.length} found</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-6xl mb-5">🔍</p>
                <p className="font-serif text-xl text-gray-400">No destinations match your search.</p>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${filtered.length >= 3 ? "grid-cols-1 sm:grid-cols-3" : filtered.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {filtered.slice(0, 3).map((d) => <LargeDestCard key={d.city} dest={d} />)}
                </div>
                {filtered.length > 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
                    {filtered.slice(3).map((d) => <CompactDestCard key={d.city} dest={d} />)}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Single region */}
        {!search.trim() && activeRegion !== "All" && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl">{REGION_EMOJI[activeRegion]}</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-800">{activeRegion}</h2>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">{filtered.length} cities</span>
            </div>
            {filtered.length > 0 && (
              <>
                <div className={`grid gap-4 mb-4 ${filtered.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {filtered.slice(0, 2).map((d) => <LargeDestCard key={d.city} dest={d} tall />)}
                </div>
                {filtered.length > 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    {filtered.slice(2, 5).map((d) => <LargeDestCard key={d.city} dest={d} />)}
                  </div>
                )}
                {filtered.length > 5 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
                    {filtered.slice(5).map((d) => <CompactDestCard key={d.city} dest={d} />)}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* All grouped */}
        {showGrouped && (
          <div className="space-y-20">
            {Object.entries(byRegion)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([region, dests]) => (
                <RegionSection key={region} region={region} dests={dests}
                  onExploreAll={() => setActiveRegion(region)} />
              ))}
          </div>
        )}
      </div>

      {/* ═══ QUOTE STRIP ═══ */}
      <section className="bg-[#0f6477] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="font-serif text-2xl sm:text-4xl font-black text-white leading-tight mb-4">
            "The world is a book, and those who do not travel read only one page."
          </p>
          <p className="text-white/50 text-xs tracking-[4px] uppercase">— Saint Augustine</p>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-white py-24 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="text-[10px] font-black tracking-[4px] uppercase text-[#0f6477] block mb-4">Plan Your Journey</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-black text-gray-800 mb-5">Found Your Dream Destination?</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed mb-10">
            Browse our handcrafted tour packages or let our travel experts design a custom itinerary just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/packages"
              className="inline-flex items-center gap-3 bg-[#0f6477] hover:bg-[#0a4d5e] text-white font-black tracking-widest uppercase text-[11px] px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-[#0f6477]/25">
              View Tour Packages
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-3 border-2 border-gray-200 hover:border-[#0f6477] text-gray-500 hover:text-[#0f6477] font-bold text-[11px] tracking-widest uppercase px-8 py-4 rounded-full transition-all">
              Custom Trip Planning
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}