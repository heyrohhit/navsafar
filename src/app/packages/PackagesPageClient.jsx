"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePackages } from "../hooks/usePackages";

// ─── META ─────────────────────────────────────────────────────────────────────
const CATEGORY_META = {
  international: { label: "International", emoji: "✈️", accent: "#3b82f6" },
  family: { label: "Family", emoji: "👨‍👩‍👧‍👦", accent: "#f97316" },
  religion: { label: "Religious", emoji: "🕌", accent: "#d97706" },
  domestic: { label: "Domestic", emoji: "🇮🇳", accent: "#16a34a" },
};

const TYPE_META = {
  Cultural: { emoji: "🏛️", accent: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  Urban: { emoji: "🏙️", accent: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Beach: { emoji: "🏖️", accent: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  Heritage: { emoji: "🏰", accent: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Nature: { emoji: "🌿", accent: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  Adventure: { emoji: "🧗", accent: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  Luxury: { emoji: "💎", accent: "#a21caf", bg: "#fdf4ff", border: "#f0abfc" },
  Romantic: { emoji: "💑", accent: "#db2777", bg: "#fdf2f8", border: "#fbcfe8" },
  Religious: { emoji: "🙏", accent: "#b45309", bg: "#fefce8", border: "#fef08a" },
  Historical: { emoji: "🗿", accent: "#57534e", bg: "#fafaf9", border: "#d6d3d1" },
  Shopping: { emoji: "🛍️", accent: "#0d9488", bg: "#f0fdfa", border: "#99f6e4" },
  Wildlife: { emoji: "🦁", accent: "#15803d", bg: "#f0fdf4", border: "#86efac" },
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
    <div
      className="bg-white rounded-2xl overflow-hidden card-hover"
      style={{
        border: `1px solid ${hovered ? accent + "40" : "#f1f5f9"}`,
        boxShadow: hovered ? `0 12px 40px ${accent}18` : "0 1px 8px #0000000a",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {pkg.image && (
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className="object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {(pkg.popular === true || pkg.popular === "true") && (
          <span className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            ⭐ Popular
          </span>
        )}
        {pkg.rating && (
          <span className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1.5 rounded-full backdrop-blur-sm">
            ★ {pkg.rating}
          </span>
        )}
        {pkg.discount && (
          <span
            className="absolute bottom-3 left-3 text-white text-xs font-black px-3 py-1.5 rounded-full"
            style={{ background: accent }}
          >
            {pkg.discount}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(pkg.tourism_type ?? []).slice(0, 3).map((t) => {
            const s = typeStyle(t);
            return (
              <span
                key={t}
                className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md"
                style={{ background: s.bg, color: s.accent, border: `1px solid ${s.border}` }}
              >
                {t}
              </span>
            );
          })}
        </div>

        <h4 className="font-bold text-lg leading-tight mb-2 line-clamp-2" style={{ color: accent }}>
          {pkg.title}
        </h4>
        {pkg.tagline && (
          <p className="text-sm text-neutral-500 mb-3 line-clamp-1">{pkg.tagline}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-neutral-400 mb-4">
          <span className="flex items-center gap-1">
            <span>⏱</span>
            <span>{pkg.duration}</span>
          </span>
          {pkg.bestTime && (
            <span className="flex items-center gap-1">
              <span>🗓</span>
              <span>{pkg.bestTime.split(",")[0]}</span>
            </span>
          )}
        </div>

        {(pkg.price || pkg.priceNote) && (
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-black" style={{ color: accent }}>
              {pkg.price || "Contact for Price"}
            </span>
            {pkg.priceNote && <span className="text-xs text-neutral-400">{pkg.priceNote}</span>}
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href={`/packages/${pkg.id}`}
            className="flex-1 text-center text-sm font-bold tracking-wide py-3 rounded-xl transition-all duration-300"
            style={{
              background: hovered ? accent : `${accent}15`,
              color: hovered ? "white" : accent,
              border: `1px solid ${accent}40`,
            }}
          >
            View Details
          </Link>
          <button
            onClick={() => openWhatsApp(pkg)}
            className="flex-1 text-sm font-bold tracking-wide py-3 rounded-xl bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
          >
            📲 Enquire
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── INNER ────────────────────────────────────────────────────────────────────
export default function PackagesPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  const { packages, loading } = usePackages();

  const isCat = category && category in CATEGORY_META;
  const isType = type && type in TYPE_META;

  const meta = isCat
    ? { label: CATEGORY_META[category].label, emoji: CATEGORY_META[category].emoji, accent: CATEGORY_META[category].accent }
    : isType
    ? { label: type, emoji: TYPE_META[type].emoji, accent: TYPE_META[type].accent }
    : { label: "All Packages", emoji: "🌍", accent: "#0f6477" };

  const filtered = useMemo(() => {
    if (!packages.length) return [];
    if (isCat) return packages.filter((p) => (p.category ?? []).includes(category));
    if (isType) return packages.filter((p) => (p.tourism_type ?? []).includes(type));
    return packages;
  }, [packages, isCat, isType, category, type]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Hero */}
      <div className="relative pt-24 pb-16 px-4 overflow-hidden bg-white border-b border-neutral-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full blur-[100px] opacity-[0.08] pointer-events-none"
          style={{ background: meta.accent }} />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-primary-600 transition-colors">Packages</Link>
            {(isCat || isType) && (
              <>
                <span>/</span>
                <span className="font-semibold" style={{ color: meta.accent }}>{meta.label}</span>
              </>
            )}
          </nav>

          <div className="flex items-center gap-5 mb-4">
            <div
              className="text-6xl p-4 rounded-2xl shadow-lg"
              style={{ background: `${meta.accent}15` }}
            >
              {meta.emoji}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
                {meta.label} Packages
              </h1>
              <p className="text-neutral-600 text-lg">
                {loading ? "Loading…" : `${filtered.length} package${filtered.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-500">Loading packages…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-neutral-200">
            <p className="text-6xl mb-4">📦</p>
            <h3 className="text-2xl font-bold text-neutral-700 mb-2">No packages found</h3>
            <p className="text-neutral-500 mb-6">Try adjusting your filters or browse all packages</p>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <span>View All Packages</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing <span className="font-semibold">{filtered.length}</span> packages
              </p>
              {/* Add sorting/filtering UI here if needed */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <PackageCard key={p.id} pkg={p} accent={meta.accent} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
