// src/app/experiences/[slug]/page.jsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePackages } from "../../hooks/usePackages";
import PackageGridLayout from "../../components/packages/PackageGridLayout";

// ── Experience categories config ─────────────────────────────────
const categories = [
  { id: "international", name: "International", emoji: "✈️",  accent: "#3b82f6", desc: "Explore iconic cities and cultures across the globe." },
  { id: "domestic",      name: "Domestic",      emoji: "🇮🇳", accent: "#16a34a", desc: "Discover the incredible diversity of India." },
  { id: "family",        name: "Family",        emoji: "👨‍👩‍👧‍👦", accent: "#f97316", desc: "Memorable holidays for the whole family." },
  { id: "religion",      name: "Religious",     emoji: "🕌",  accent: "#d97706", desc: "Sacred journeys across faiths." },
  { id: "cultural",      name: "Cultural",      emoji: "🎭",  accent: "#7c3aed", desc: "Immerse yourself in art, history and heritage." },
  { id: "adventure",     name: "Adventure",     emoji: "🏔️",  accent: "#ea580c", desc: "Trek, dive and thrill in the great outdoors." },
  { id: "beach",         name: "Beach & Island", emoji: "🏖️", accent: "#0891b2", desc: "Turquoise waters and white-sand paradise." },
  { id: "luxury",        name: "Luxury",        emoji: "💎",  accent: "#a21caf", desc: "Ultra-premium experiences with world-class comfort." },
  { id: "wildlife",      name: "Wildlife",      emoji: "🦁",  accent: "#15803d", desc: "Safaris, sanctuaries and nature escapes." },
  { id: "romantic",      name: "Romantic",      emoji: "💑",  accent: "#db2777", desc: "Perfect getaways for couples." },
  { id: "historical",    name: "Historical",    emoji: "🏛️",  accent: "#57534e", desc: "Wander through the ruins of ancient civilisations." },
  { id: "urban",         name: "City & Urban",  emoji: "🏙️",  accent: "#2563eb", desc: "Vibrant cities, modern art and cosmopolitan energy." },
];

function findCategory(slug) {
  return categories.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug || c.id === slug
  );
}

function getPackagesForCategory(cat, packages) {
  if (!cat) return [];
  const rules = {
    international: (p) => p.category?.includes("international"),
    domestic:      (p) => p.category?.includes("domestic"),
    family:        (p) => p.category?.includes("family"),
    religion:      (p) => p.category?.includes("religion"),
    cultural:      (p) => p.tourism_type?.some((t) => ["Cultural","Modern Culture","Entertainment"].includes(t)),
    adventure:     (p) => p.tourism_type?.some((t) => ["Adventure"].includes(t)),
    beach:         (p) => p.tourism_type?.some((t) => ["Beach"].includes(t)),
    luxury:        (p) => p.tourism_type?.some((t) => ["Luxury"].includes(t)),
    wildlife:      (p) => p.tourism_type?.some((t) => ["Wildlife"].includes(t)),
    romantic:      (p) => p.tourism_type?.some((t) => ["Romantic"].includes(t)),
    historical:    (p) => p.tourism_type?.some((t) => ["Historical","Heritage"].includes(t)),
    urban:         (p) => p.tourism_type?.some((t) => ["Urban","Business","Shopping","Skyline"].includes(t)),
  };
  const rule = rules[cat.id];
  return rule ? packages.filter(rule) : [];
}

export default function ExperienceDetailPage() {
  const { slug }    = useParams();
  const [isLoaded,  setIsLoaded] = useState(false);
  const { packages, loading }   = usePackages();

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const cat              = findCategory(slug);
  const filteredPackages = useMemo(() => getPackagesForCategory(cat, packages), [cat, packages]);

  // 404 state
  if (!loading && !cat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: "#060f11" }}>
        <p className="text-6xl mb-4">🗺️</p>
        <h1 className="text-2xl font-bold text-white mb-2">Experience Not Found</h1>
        <Link href="/" className="text-sky-400 text-sm hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const accent = cat?.accent ?? "#0f6477";

  return (
    <div style={{ background: "#060f11", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section style={{
        background: `linear-gradient(135deg, #060f11 0%, ${accent}18 100%)`,
        padding: "80px 24px 60px", textAlign: "center",
        borderBottom: `1px solid ${accent}30`,
      }}>
        <div style={{
          opacity:   isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity .6s, transform .6s",
        }}>
          <Link href="/experiences"
            style={{ color: `${accent}90`, fontSize: 12, textDecoration: "none", letterSpacing: "2px", textTransform: "uppercase", display: "inline-block", marginBottom: 20 }}>
            ← All Experiences
          </Link>

          {cat && (
            <>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{cat.emoji}</div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
                {cat.name}
              </h1>
              <p style={{ color: `${accent}cc`, fontSize: 16, maxWidth: 480, margin: "0 auto 24px" }}>
                {cat.desc}
              </p>
              <span style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40`, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                {loading ? "Loading…" : `${filteredPackages.length} package${filteredPackages.length !== 1 ? "s" : ""} available`}
              </span>
            </>
          )}
        </div>
      </section>

      {/* ── Packages ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
        {loading && (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: "80px 0" }}>Loading packages…</div>
        )}

        {!loading && filteredPackages.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <span style={{ fontSize: "3rem" }}>📦</span>
            <p style={{ color: "#94a3b8", fontSize: 15, marginTop: 12, marginBottom: 24 }}>
              No packages yet in this category. Contact us for a custom quote!
            </p>
            <a href={`https://wa.me/918882128640?text=${encodeURIComponent(`Hi! I want to enquire about a ${cat?.name} travel package.`)}`}
              target="_blank" rel="noreferrer"
              style={{ background: "#25d366", color: "#000", padding: "12px 24px", borderRadius: 10, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
              💬 WhatsApp Us
            </a>
          </div>
        )}

        {!loading && filteredPackages.length > 0 && (
          <div style={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "none" : "translateY(16px)", transition: "opacity .6s .2s, transform .6s .2s" }}>
            <PackageGridLayout
              packages={filteredPackages}
              btns={[
                { label: "View Details", type: "viewDetails" },
                { label: "📲 Get Query", type: "getQuery"    },
              ]}
            />
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: "center", padding: "40px 24px 80px" }}>
        <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Can't find your perfect {cat?.name?.toLowerCase()} trip?
        </h3>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
          Every package is priced after understanding your budget, group & dates. Let's plan something just for you.
        </p>
        <a href={`https://wa.me/918882128640?text=${encodeURIComponent(`Hi! I'm looking for a ${cat?.name} travel package. Please help.`)}`}
          target="_blank" rel="noreferrer"
          style={{ background: "#25d366", color: "#000", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-block" }}>
          💬 Plan on WhatsApp
        </a>
      </section>
    </div>
  );
}