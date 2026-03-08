"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { packages } from "../models/objAll/packages";

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_META = {
  international: { label: "International", emoji: "✈️",  accent: "#3b82f6" },
  family:        { label: "Family",        emoji: "👨‍👩‍👧‍👦", accent: "#f97316" },
  religion:      { label: "Religious",     emoji: "🕌",  accent: "#d97706" },
  domestic:      { label: "Domestic",      emoji: "🇮🇳", accent: "#16a34a" },
};

const TYPE_META = {
  Cultural:   { emoji: "🏛️", accent: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  Urban:      { emoji: "🏙️", accent: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Beach:      { emoji: "🏖️", accent: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  Heritage:   { emoji: "🏰", accent: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Nature:     { emoji: "🌿", accent: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  Adventure:  { emoji: "🧗", accent: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  Luxury:     { emoji: "💎", accent: "#a21caf", bg: "#fdf4ff", border: "#f0abfc" },
  Romantic:   { emoji: "💑", accent: "#db2777", bg: "#fdf2f8", border: "#fbcfe8" },
  Religious:  { emoji: "🙏", accent: "#b45309", bg: "#fefce8", border: "#fef08a" },
  Historical: { emoji: "🗿", accent: "#57534e", bg: "#fafaf9", border: "#d6d3d1" },
  Shopping:   { emoji: "🛍️", accent: "#0d9488", bg: "#f0fdfa", border: "#99f6e4" },
  Nightlife:  { emoji: "🎆", accent: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  Wildlife:   { emoji: "🦁", accent: "#15803d", bg: "#f0fdf4", border: "#86efac" },
};

function typeStyle(t) {
  return TYPE_META[t] ?? { accent: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };
}

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP
// ─────────────────────────────────────────────────────────────────────────────
function openWhatsApp(pkg) {
  const msg = [
    `✈️ *Package Enquiry — WanderLux*`,
    ``,
    `📦 *Package:* ${pkg.title}`,
    `📍 *Destination:* ${pkg.city}, ${pkg.country}`,
    `⏱ *Duration:* ${pkg.duration}`,
    `⭐ *Rating:* ${pkg.rating}/5`,
    `🗓 *Best Time:* ${pkg.bestTime ?? "Flexible"}`,
    ``,
    `Please share pricing and availability!`,
  ].join("\n");
  window.open(`https://wa.me/918700750589?text=${encodeURIComponent(msg)}`, "_blank");
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGE CARD
// ─────────────────────────────────────────────────────────────────────────────
function PackageCard({ pkg, accent }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        border:     `1px solid ${hovered ? accent + "50" : "#f0f0f0"}`,
        boxShadow:  hovered
          ? `0 20px 48px ${accent}14, 0 4px 16px rgba(0,0,0,0.07)`
          : "0 2px 12px rgba(0,0,0,0.05)",
        transform:  hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image
          src={pkg.image} alt={pkg.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1.02)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-700">
            {pkg.duration}
          </span>
          {pkg.popular && (
            <span className="text-[9px] font-black tracking-wide uppercase px-2.5 py-1 rounded-full text-white"
              style={{ background: accent }}>
              ★ Popular
            </span>
          )}
        </div>

        {/* City overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white/50 text-[9px] font-bold tracking-[3px] uppercase">{pkg.country}</p>
          <h3 className="font-serif text-xl font-black text-white leading-tight">{pkg.city}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h4 className="font-bold text-sm text-gray-800 mb-2 line-clamp-1 transition-colors duration-200"
          style={{ color: hovered ? accent : "#1f2937" }}>
          {pkg.title}
        </h4>

        {/* Rating + best time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="w-3 h-3" fill={s <= Math.round(pkg.rating ?? 0) ? "#f59e0b" : "#e5e7eb"} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-400 text-[11px] font-semibold">{pkg.rating}</span>
          </div>
          {pkg.bestTime && (
            <span className="text-[10px] text-gray-400">🗓 {pkg.bestTime.split(",")[0]}</span>
          )}
        </div>

        {/* Type chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(pkg.tourism_type ?? []).slice(0, 3).map((t) => {
            const s = typeStyle(t);
            return (
              <span key={t} className="text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                style={{ background: s.bg, color: s.accent, border: `1px solid ${s.border}` }}>
                {t}
              </span>
            );
          })}
        </div>

        {/* Highlights */}
        {(pkg.highlights ?? []).length > 0 && (
          <div className="flex flex-col gap-1 mb-4">
            {pkg.highlights.slice(0, 2).map((h) => (
              <div key={h} className="flex items-start gap-2">
                <span className="w-1 h-1 mt-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                <span className="text-gray-400 text-[11px] line-clamp-1">{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link href={`/packages/${pkg.id}`}
            className="flex-1 text-center text-[10px] font-black tracking-widest uppercase py-2.5 rounded-xl transition-all duration-300"
            style={{
              background:  hovered ? accent : `${accent}10`,
              color:       hovered ? "white" : accent,
              border:      `1px solid ${accent}40`,
            }}>
            View Details
          </Link>
          <button onClick={() => openWhatsApp(pkg)}
            className="flex-1 text-[10px] font-black tracking-widest uppercase py-2.5 rounded-xl"
            style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
            📲 Enquire
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INNER — reads ?category=xxx OR ?type=xxx from URL
// ─────────────────────────────────────────────────────────────────────────────
function PackagesInner() {
  const searchParams = useSearchParams();
  const category     = searchParams.get("category"); // e.g. "family"
  const type         = searchParams.get("type");     // e.g. "Adventure"

  // Determine filter mode
  const isCat  = category && category in CATEGORY_META;
  const isType = type     && type     in TYPE_META;

  // Active meta info for UI theming
  const meta = isCat
    ? { label: CATEGORY_META[category].label, emoji: CATEGORY_META[category].emoji, accent: CATEGORY_META[category].accent }
    : isType
    ? { label: type, emoji: TYPE_META[type].emoji, accent: TYPE_META[type].accent }
    : { label: "All Packages", emoji: "🌍", accent: "#0f6477" };

  // Filter packages
  const filtered = useMemo(() => {
    if (isCat)  return packages.filter((p) => (p.category     ?? []).includes(category));
    if (isType) return packages.filter((p) => (p.tourism_type ?? []).includes(type));
    return packages; // no filter = show all
  }, [isCat, isType, category, type]);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <div className="relative pt-28 pb-14 px-4 overflow-hidden bg-white border-b border-gray-100">
        {/* Ambient blob */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full blur-[100px] opacity-[0.07] pointer-events-none"
          style={{ background: meta.accent }}
        />

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-4">
              <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/packages" className="hover:text-gray-600 transition-colors">Packages</Link>
              {(isCat || isType) && (
                <>
                  <span>/</span>
                  <span style={{ color: meta.accent }} className="font-bold">{meta.label}</span>
                </>
              )}
            </div>

            {/* Badge */}
            <span
              className="inline-flex items-center gap-2 text-[10px] font-black tracking-[4px] uppercase px-4 py-2 rounded-full border mb-4"
              style={{ color: meta.accent, borderColor: `${meta.accent}35`, background: `${meta.accent}0a` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: meta.accent }} />
              {isCat ? "Trip Category" : isType ? "Travel Style" : "All Packages"}
            </span>

            {/* Title */}
            <h1 className="font-serif text-5xl sm:text-6xl font-black text-gray-900 leading-none">
              <span className="text-4xl sm:text-5xl mr-3">{meta.emoji}</span>
              <span style={{ color: meta.accent }}>{meta.label}</span>
              <br />
              <span className="text-gray-800 text-3xl sm:text-4xl font-black italic">Packages</span>
            </h1>
          </div>

          {/* Count pill + back link */}
          <div className="flex flex-col items-start sm:items-end gap-3">
            <div
              className="text-3xl font-black font-serif tabular-nums"
              style={{ color: meta.accent }}
            >
              {filtered.length}
              <span className="text-base font-sans font-normal text-gray-400 ml-2">packages</span>
            </div>
            {(isCat || isType) && (
              <Link href="/packages"
                className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                View all packages
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── PACKAGES GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl mb-4">{meta.emoji}</p>
            <p className="font-serif text-2xl text-gray-300 mb-2">No packages found.</p>
            <Link href="/packages"
              className="mt-6 inline-block text-[11px] font-black tracking-widest uppercase px-6 py-3 rounded-full border transition-all hover:opacity-70"
              style={{ color: meta.accent, borderColor: `${meta.accent}40` }}>
              Browse All Packages
            </Link>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {filtered.map((pkg, i) => (
              <div key={pkg.id} className="break-inside-avoid mb-5">
                <PackageCard pkg={pkg} accent={meta.accent} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <section className="py-20" style={{ background: "#0f6477" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-[10px] font-black tracking-[4px] uppercase text-white/40 mb-3">Custom Packages</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-white mb-4">
            Can't Find Your Dream Trip?
          </h2>
          <p className="text-white/50 text-base mb-8">
            Let our experts craft a custom itinerary just for you.
          </p>
          <Link href="/contact"
            className="inline-flex items-center gap-3 bg-white font-black tracking-widest uppercase text-[11px] px-8 py-4 rounded-full hover:bg-gray-50 transition-all shadow-xl"
            style={{ color: "#0f6477" }}>
            Talk to an Expert
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#0f6477] border-t-transparent animate-spin" />
      </div>
    }>
      <PackagesInner />
    </Suspense>
  );
}