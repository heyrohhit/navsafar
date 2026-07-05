"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Search, Star, MapPin, Globe, Sparkles,
  X, ChevronRight, Compass, SlidersHorizontal,
} from "lucide-react";
import { usePackages } from "../../hooks/usePackages";
import PackageGridLayout from "../../components/packages/PackageGridLayout";
import packagesData from "../../../data/packagesData.json";

// ── Category presentation meta ─────────────────────────────────────
const CATEGORY_INFO = {
  international: { label: "International",       emoji: "✈️", gradient: ["#38bdf8", "#6366f1"], blurb: "Handpicked overseas escapes — visa help, INR pricing and 24/7 support, tailored for Indian travellers." },
  domestic:     { label: "Domestic India",     emoji: "🇮🇳", gradient: ["#10b981", "#14b8a6"], blurb: "Discover incredible India — from Himalayan hills to southern beaches, planned around your pace." },
  family:       { label: "Family Getaways",    emoji: "👨‍👩‍👧‍👦", gradient: ["#fb923c", "#f59e0b"], blurb: "Kid-friendly stays, easy transfers and flexible sightseeing for the whole family." },
  religion:     { label: "Religious Journeys", emoji: "🕌", gradient: ["#fbbf24", "#f59e0b"], blurb: "Peaceful pilgrimages and spiritual retreats, thoughtfully arranged end to end." },
  cultural:     { label: "Cultural Trips",     emoji: "🎭", gradient: ["#c084fc", "#8b5cf6"], blurb: "Immerse in local traditions, art, food and living heritage across the world." },
  historical:   { label: "Heritage & History",emoji: "🏰", gradient: ["#fb923c", "#f97316"], blurb: "Walk through palaces, ruins and old towns with expert-guided storytelling." },
  beach:        { label: "Beach Escapes",      emoji: "🏖️", gradient: ["#22d3ee", "#38bdf8"], blurb: "Sun, sand and turquoise water — the perfect reset by the coast." },
  adventure:    { label: "Adventure",          emoji: "🏔️", gradient: ["#f97316", "#ef4444"], blurb: "Trekking, diving, rafting and adrenaline — for travellers who chase the thrill." },
  luxury:       { label: "Luxury",             emoji: "💎", gradient: ["#e879f9", "#d946ef"], blurb: "Five-star stays, private transfers and curated fine experiences." },
  wildlife:     { label: "Wildlife & Safari",  emoji: "🦁", gradient: ["#a3e635", "#65a30d"], blurb: "Get up close with nature on guided safaris and national-park adventures." },
  romantic:     { label: "Romantic",           emoji: "💑", gradient: ["#f472b6", "#ec4899"], blurb: "Honeymoons and couple escapes designed for unforgettable moments." },
  urban:        { label: "Urban & City",       emoji: "🏙️", gradient: ["#60a5fa", "#3b82f6"], blurb: "Skyline views, shopping, nightlife and the pulse of the world's great cities." },
};

const RELATED_SLUGS = [
  "international", "domestic", "family", "religion", "cultural",
  "historical", "beach", "adventure", "luxury", "wildlife", "romantic", "urban",
];

function infoFor(slug) {
  const key = (slug || "").toLowerCase();
  return (
    CATEGORY_INFO[key] || {
      label: (slug || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      emoji: "🌍",
      gradient: ["#0f6477", "#38bdf8"],
      blurb: "Curated travel experiences, tailored for Indian travellers with best prices in INR.",
    }
  );
}

// ── Category matching ──────────────────────────────────────────────
function getPackagesForCategory(slug, packages) {
  if (!slug) return [];
  const normalizedSlug = slug.toLowerCase().replace(/-/g, " ");
  return packages.filter((p) => {
    const inCategory = p.category?.some((c) => c.toLowerCase() === normalizedSlug);
    const inType = p.tourism_type?.some((t) => t.toLowerCase() === normalizedSlug);
    return inCategory || inType;
  });
}

// ── Small UI atoms ─────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur">
      <Icon size={18} className="text-sky-300" />
      <div className="leading-none">
        <div className="text-base font-black text-white">{value}</div>
        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">{label}</div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="mx-auto max-w-7xl columns-1 gap-5 sm:columns-2 lg:columns-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mb-5 break-inside-avoid">
          <div className="animate-pulse overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03]">
            <div className={i % 2 ? "aspect-[3/4]" : "aspect-[4/3]"} style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="space-y-3 p-5">
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-white/[0.07]" />
              <div className="h-9 w-full rounded-2xl bg-white/[0.06]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function ExperienceClient({ slug }) {
  const { packages, loading } = usePackages();
  const info = infoFor(slug);
  const [g1, g2] = info.gradient;
  const gradientCss = `linear-gradient(135deg, ${g1}, ${g2})`;

  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [popularOnly, setPopularOnly] = useState(false);

  const allPackages = packages?.length ? packages : packagesData;

  // packages that belong to this category (before in-page filtering)
  const categoryPackages = useMemo(
    () => getPackagesForCategory(slug, allPackages),
    [slug, allPackages]
  );

  // hero + stats derived from the full category set
  const countries = useMemo(() => {
    const set = new Set(categoryPackages.map((p) => p.country).filter(Boolean));
    return [...set].sort();
  }, [categoryPackages]);

  const avgRating = useMemo(() => {
    const rated = categoryPackages.filter((p) => p.rating);
    if (!rated.length) return null;
    return (rated.reduce((s, p) => s + p.rating, 0) / rated.length).toFixed(1);
  }, [categoryPackages]);

  const heroImage = categoryPackages[0]?.image;

  // apply in-page filters
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categoryPackages.filter((p) => {
      if (country !== "all" && p.country !== country) return false;
      if (popularOnly && !p.popular) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.city} ${p.country} ${p.tagline ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [categoryPackages, query, country, popularOnly]);

  const hasFilters = query.trim() || country !== "all" || popularOnly;
  const clearFilters = () => { setQuery(""); setCountry("all"); setPopularOnly(false); };

  const related = RELATED_SLUGS.filter((s) => s !== (slug || "").toLowerCase()).slice(0, 8);
  const isBusy = loading && categoryPackages.length === 0;

  return (
    <div className="min-h-screen bg-[#060f11] text-white">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0">
            <Image src={heroImage} alt={info.label} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060f11 8%, rgba(6,15,17,0.72) 55%, rgba(6,15,17,0.55) 100%)" }} />
            <div className="absolute inset-0 opacity-25" style={{ background: gradientCss, mixBlendMode: "overlay" }} />
          </div>
        )}
        {/* ambient glow */}
        <div aria-hidden className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full blur-3xl" style={{ background: `${g1}22` }} />

        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pt-32">
          {/* breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-white/45">
            <Link href="/" className="transition-colors text-white">Home</Link>
            <ChevronRight size={13} />
            <Link href="/experiences" className="transition-colors text-white">Experiences</Link>
            <ChevronRight size={13} />
            <span className="font-semibold text-white/80">{info.label}</span>
          </nav>

          <Link
            href="/experiences"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur transition-colors hover:border-white/25 hover:text-white"
          >
            <ArrowLeft size={14} /> All Experiences
          </Link>

          {/* eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.22em]"
            style={{ borderColor: `${g1}44`, color: g1, background: `${g1}12` }}>
            <Sparkles size={12} /> Travel Experience
          </div>

          <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
            <span className="text-5xl drop-shadow-lg sm:text-6xl" aria-hidden>{info.emoji}</span>
            <h1 className="text-4xl font-black leading-none tracking-tight sm:text-6xl">
              <span style={{ background: gradientCss, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {info.label}
              </span>{" "}
              <span className="text-white">Packages</span>
            </h1>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">{info.blurb}</p>

          {/* stats */}
          <div className="mt-8 flex flex-wrap gap-3">
            <StatPill icon={Compass} value={categoryPackages.length} label="Packages" />
            {countries.length > 0 && <StatPill icon={Globe} value={countries.length} label="Destinations" />}
            {avgRating && <StatPill icon={Star} value={`${avgRating}★`} label="Avg Rating" />}
          </div>
        </div>
      </section>

      {/* ─── FILTER TOOLBAR ───────────────────────────────────── */}
      {!isBusy && categoryPackages.length > 0 && (
        <section className="relative z-20 border-y border-white/[0.07] bg-[#0a1518]/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8">
            <div className="flex flex-col gap-3">
              {/* Row 1 — search + popular toggle + result count */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* search */}
                <div className="relative w-full sm:max-w-xs">
                  <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${info.label.toLowerCase()} trips…`}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-9 text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-sky-400/50"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* popular toggle + count */}
                <div className="flex items-center justify-between gap-3 sm:ml-auto">
                  <button
                    onClick={() => setPopularOnly((v) => !v)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${popularOnly ? "bg-amber-400 text-slate-900" : "border border-white/12 bg-white/[0.04] text-white/65 hover:text-white"}`}
                  >
                    <SlidersHorizontal size={14} /> Popular only
                  </button>
                  <span className="whitespace-nowrap text-xs font-semibold text-white/45">
                    {visible.length} result{visible.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Row 2 — country chips (own full-width horizontal scroll strip) */}
              {countries.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <MapPin size={15} className="sticky left-0 z-10 shrink-0 text-white/40" />
                  <button
                    onClick={() => setCountry("all")}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${country === "all" ? "text-white" : "border border-white/12 bg-white/[0.04] text-white/60 hover:text-white"}`}
                    style={country === "all" ? { background: gradientCss } : undefined}
                  >
                    All
                  </button>
                  {countries.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCountry(c)}
                      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${country === c ? "text-white" : "border border-white/12 bg-white/[0.04] text-white/60 hover:text-white"}`}
                      style={country === c ? { background: gradientCss } : undefined}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── RESULTS ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {isBusy ? (
          <SkeletonGrid />
        ) : visible.length > 0 ? (
          <PackageGridLayout
            packages={visible}
            btns={[
              { label: "View Details", type: "viewDetails" },
              { label: "Get Query", type: "getQuery" },
            ]}
          />
        ) : (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl text-3xl" style={{ background: `${g1}18` }}>
              {hasFilters ? "🔍" : info.emoji}
            </div>
            <h3 className="text-xl font-black text-white">
              {hasFilters ? "No matching trips" : `No ${info.label} packages yet`}
            </h3>
            <p className="mt-2 text-sm text-white/45">
              {hasFilters
                ? "Try clearing filters or exploring another experience."
                : "We're curating new packages here. Meanwhile, explore other experiences."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {hasFilters && (
                <button onClick={clearFilters} className="rounded-xl px-5 py-2.5 text-sm font-bold text-white" style={{ background: gradientCss }}>
                  Clear filters
                </button>
              )}
              <Link href="/experiences" className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-white/80 transition-colors hover:text-white">
                Browse experiences
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ─── RELATED EXPERIENCES ──────────────────────────────── */}
      <section className="border-t border-white/[0.07] bg-[#080f12]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-5 w-1 rounded-full" style={{ background: gradientCss }} />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/55">Explore other experiences</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
            {related.map((s) => {
              const ri = infoFor(s);
              return (
                <Link
                  key={s}
                  href={`/experiences/${s}`}
                  className="group flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-white/25"
                >
                  <span className="text-2xl" aria-hidden>{ri.emoji}</span>
                  <span className="whitespace-nowrap text-sm font-bold text-white/75 group-hover:text-white">{ri.label}</span>
                  <ChevronRight size={15} className="text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/60" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/[0.07]">
        <div className="absolute inset-0 opacity-90" style={{ background: gradientCss }} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-14 text-center sm:px-8 md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Can&apos;t find the perfect {info.label.toLowerCase()} trip?</h2>
            <p className="mt-2 max-w-xl text-sm text-white/80">Tell us your dates, budget and vibe — we&apos;ll craft a custom itinerary just for you.</p>
          </div>
          <a
            href="https://wa.me/918882128640?text=Hi%20NavSafar%2C%20I%27d%20like%20a%20custom%20travel%20package."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-slate-900 shadow-xl transition-transform hover:scale-105"
          >
            💬 Plan on WhatsApp <ChevronRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
