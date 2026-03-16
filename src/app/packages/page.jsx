// src/app/packages/page.jsx
"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePackages } from "../hooks/usePackages";

// ─── META ─────────────────────────────────────────────────────────────────────
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
  Wildlife:   { emoji: "🦁", accent: "#15803d", bg: "#f0fdf4", border: "#86efac" },
};

function typeStyle(t) {
  return TYPE_META[t] ?? { accent: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };
}

function openWhatsApp(pkg) {
  const msg = [
    `✈️ *Package Enquiry — NavSafar*`,
    ``,
    `📦 *Package:* ${pkg.title}`,
    `📍 *Destination:* ${pkg.city}, ${pkg.country}`,
    `⏱ *Duration:* ${pkg.duration}`,
    `⭐ *Rating:* ${pkg.rating}/5`,
    `🗓 *Best Time:* ${pkg.bestTime ?? "Flexible"}`,
    ``,
    `Please share pricing and availability!`,
  ].join("\n");
  window.open(`https://wa.me/918882128640?text=${encodeURIComponent(msg)}`, "_blank");
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function PackageCard({ pkg, accent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="bg-white rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${hovered ? accent + "40" : "#f1f5f9"}`, boxShadow: hovered ? `0 12px 40px ${accent}18` : "0 1px 8px #0000000a", transition: "all .3s", transform: hovered ? "translateY(-4px)" : "none" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {pkg.image && (
          <Image src={pkg.image} alt={pkg.title} fill sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {(pkg.popular === true || pkg.popular === "true") && (
          <span className="absolute top-3 left-3 bg-amber-400 text-black text-[10px] font-black px-2 py-1 rounded-full">⭐ Popular</span>
        )}
        {pkg.rating && (
          <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-bold px-2 py-1 rounded-full">
            ★ {pkg.rating}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
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

        <h4 className="font-black text-sm leading-tight mb-1" style={{ color: accent }}>{pkg.title}</h4>
        {pkg.tagline && <p className="text-xs text-gray-500 mb-2 line-clamp-1">{pkg.tagline}</p>}
        {pkg.duration && (
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
            <span>⏱ {pkg.duration}</span>
            {pkg.bestTime && <span>🗓 {pkg.bestTime.split(",")[0]}</span>}
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/packages/${pkg.id}`}
            className="flex-1 text-center text-[10px] font-black tracking-widest uppercase py-2.5 rounded-xl transition-all duration-300"
            style={{ background: hovered ? accent : `${accent}10`, color: hovered ? "white" : accent, border: `1px solid ${accent}40` }}>
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

// ─── INNER ────────────────────────────────────────────────────────────────────
function PackagesInner() {
  const searchParams = useSearchParams();
  const category     = searchParams.get("category");
  const type         = searchParams.get("type");

  const { packages, loading } = usePackages();

  const isCat  = category && category in CATEGORY_META;
  const isType = type     && type     in TYPE_META;

  const meta = isCat
    ? { label: CATEGORY_META[category].label, emoji: CATEGORY_META[category].emoji, accent: CATEGORY_META[category].accent }
    : isType
    ? { label: type, emoji: TYPE_META[type].emoji, accent: TYPE_META[type].accent }
    : { label: "All Packages", emoji: "🌍", accent: "#0f6477" };

  const filtered = useMemo(() => {
    if (!packages.length) return [];
    if (isCat)  return packages.filter((p) => (p.category     ?? []).includes(category));
    if (isType) return packages.filter((p) => (p.tourism_type ?? []).includes(type));
    return packages;
  }, [packages, isCat, isType, category, type]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative pt-28 pb-14 px-4 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full blur-[100px] opacity-[0.07] pointer-events-none"
          style={{ background: meta.accent }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-4">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-gray-600">Packages</Link>
            {(isCat || isType) && (
              <><span>/</span><span style={{ color: meta.accent }} className="font-bold">{meta.label}</span></>
            )}
          </div>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{meta.emoji}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900">{meta.label}</h1>
          </div>
          <p className="text-gray-500 text-lg">
            {loading ? "Loading…" : `${filtered.length} package${filtered.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && <div className="text-center py-24 text-gray-400">Loading packages…</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No packages found</h3>
            <Link href="/packages" className="px-6 py-3 bg-sky-500 text-white rounded-xl text-sm font-semibold">
              View All Packages
            </Link>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <PackageCard key={p.id} pkg={p} accent={meta.accent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>}>
      <PackagesInner />
    </Suspense>
  );
}