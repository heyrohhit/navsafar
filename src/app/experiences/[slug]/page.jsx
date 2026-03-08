"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { packages } from "../../models/objAll/packages";
import PackageGridLayout from "../../components/packages/PackageGridLayout";

// ─── Slug → Category matcher ──────────────────────────────────────────────────
// ExperienceCategories generates slug like: cat.name.toLowerCase().replace(/\s+/g, '-')
// e.g. "Beach & Island" → "beach-&-island", "City & Urban" → "city-&-urban"
function findCategory(slug) {
  return categories.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug
  );
}

// ─── Filter packages from packages.js by category ────────────────────────────
// Maps experienc.js category id → packages.js category[] / tourism_type[]
function getPackagesForCategory(cat) {
  if (!cat) return [];

  // Mapping rules: check packages.js category[] and tourism_type[]
  const idRules = {
    international: (p) => p.category?.includes("international"),
    domestic:      (p) => p.category?.includes("domestic"),
    family:        (p) => p.category?.includes("family"),
    religion:      (p) => p.category?.includes("religion"),
    cultural:      (p) => p.tourism_type?.some((t) => ["Cultural", "Modern Culture", "Entertainment"].includes(t)),
    adventure:     (p) => p.tourism_type?.some((t) => ["Adventure"].includes(t)),
    beach:         (p) => p.tourism_type?.some((t) => ["Beach"].includes(t)),
    luxury:        (p) => p.tourism_type?.some((t) => ["Luxury"].includes(t)),
    wildlife:      (p) => p.tourism_type?.some((t) => ["Wildlife"].includes(t)),
    romantic:      (p) => p.tourism_type?.some((t) => ["Romantic"].includes(t)),
    historical:    (p) => p.tourism_type?.some((t) => ["Historical", "Heritage"].includes(t)),
    urban:         (p) => p.tourism_type?.some((t) => ["Urban", "Business", "Shopping", "Skyline"].includes(t)),
  };

  const rule = idRules[cat.id];
  return rule ? packages.filter(rule) : [];
}

// ─── Stat chips ───────────────────────────────────────────────────────────────
function StatChip({ icon, label, value }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, padding: "12px 20px",
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: 16, minWidth: 90, textAlign: "center",
    }}>
      <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ExperienceDetailPage = () => {
  const params             = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const slug = params?.slug ?? "";

  // Match category
  const cat = useMemo(() => findCategory(slug), [slug]);

  // Filter relevant packages
  const filteredPackages = useMemo(() => getPackagesForCategory(cat), [cat]);

  // ── 404 state ─────────────────────────────────────────────────────────────
  if (!slug || !cat) {
    return (
      <>
        <style>{notFoundCSS}</style>
        <div className="nf-wrap">
          <div className="nf-card">
            <span style={{ fontSize: "3.5rem" }}>🗺️</span>
            <h1 className="nf-title">Category Not Found</h1>
            <p className="nf-sub">
              The experience category <strong>"{slug}"</strong> doesn't exist.
            </p>
            <Link href="/experiences" className="nf-btn">
              ← Back to Experiences
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{pageCSS}</style>

      <div className="edp-root ">

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className={`edp-hero bg-gradient-to-br ${cat.gradient}`}>

          {/* Deco blobs */}
          <div className="edp-deco-1" />
          <div className="edp-deco-2" />
          <div className="edp-deco-dots" />

          {/* Back link */}
          <div className="edp-back-wrap">
            <Link href="/experiences" className="edp-back">
              ← All Categories
            </Link>
          </div>

          {/* Main hero content */}
          <div
            className="edp-hero-content"
            style={{
              opacity:   isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {/* Badge */}
            <div className="edp-badge">
              <span style={{ fontSize: "0.9rem" }}>{cat.icon}</span>
              {cat.badge}
            </div>

            <h1 className="edp-hero-title ">{cat.name}</h1>
            <p className="edp-hero-desc">{cat.description}</p>

            {/* Best time pill */}
            <div className="edp-best-time">
              🗓️ Best Time: <strong>{cat.bestTime}</strong>
            </div>

            {/* Stats row */}
            <div className="edp-stats">
              <StatChip icon="✈️" label="Packages" value={filteredPackages.length} />
              <StatChip icon="🌍" label="Destinations" value={cat.topDestinations.length + "+"} />
              <StatChip icon="⭐" label="Avg Rating" value="4.7" />
            </div>
          </div>
        </section>

        {/* ── Tourism Type Chips ───────────────────────────────────────── */}
        <div
          className="edp-type-bar"
          style={{
            opacity:   isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s 0.2s ease, transform 0.5s 0.2s ease",
          }}
        >
          <div className="edp-type-inner">
            <span className="edp-type-label">Tourism Types:</span>
            <div className="edp-type-chips">
              {cat.tourismTypes.map((t, i) => (
                <span key={i} className="edp-type-chip">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Top Destinations Pills ───────────────────────────────────── */}
        <div
          className="edp-dest-bar"
          style={{
            opacity:   isLoaded ? 1 : 0,
            transition: "opacity 0.5s 0.3s ease",
          }}
        >
          <div className="edp-dest-inner">
            <span className="edp-dest-label">✦ Top Picks:</span>
            <div className="edp-dest-chips">
              {cat.topDestinations.map((d, i) => (
                <span key={i} className="edp-dest-chip">📍 {d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Packages Section ─────────────────────────────────────────── */}
        <section className="edp-packages-section p-5">
          <div className="edp-packages-inner">

            {/* Section heading */}
            <div
              className="edp-sec-head"
              style={{
                opacity:   isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 0.55s 0.35s ease, transform 0.55s 0.35s ease",
              }}
            >
              <h2 className="edp-sec-title">
                {cat.name} Packages
                <span className="edp-sec-count">{filteredPackages.length}</span>
              </h2>
              <p className="edp-sec-sub">
                Browse our curated selection — pricing is customised to your budget after a quick discussion.
              </p>
            </div>

            {/* Empty state */}
            {filteredPackages.length === 0 && (
              <div className="edp-empty">
                <span style={{ fontSize: "3rem" }}>📦</span>
                <p className="edp-empty-title">No packages yet in this category</p>
                <p className="edp-empty-sub">
                  We're adding more soon — contact us for a custom quote!
                </p>
                <a
                  href="https://wa.me/918700750589?text=Hi!%20I%20want%20to%20enquire%20about%20a%20custom%20package."
                  target="_blank"
                  rel="noreferrer"
                  className="edp-wa-btn"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            )}

            {/* Packages grid */}
            {filteredPackages.length > 0 && (
              <div
                style={{
                  opacity:   isLoaded ? 1 : 0,
                  transform: isLoaded ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 0.6s 0.45s ease, transform 0.6s 0.45s ease",
                }}
              >
                <PackageGridLayout
                  packages={filteredPackages}
                  btns={[
                    { label: "View Details", type: "viewDetails" },
                    { label: "📲 Get Query", type: "getQuery"    },
                  ]}
                />
              </div>
            )}

          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <section className="edp-cta-section">
          <div className="edp-cta-inner">
            <h3 className="edp-cta-title">
              Can't find your perfect {cat.name.toLowerCase()} trip?
            </h3>
            <p className="edp-cta-sub">
              Every package is priced after understanding your budget, group size & dates.
              Let's plan something just for you.
            </p>
            <div className="edp-cta-btns">
              <a
                href={`https://wa.me/918700750589?text=${encodeURIComponent(
                  `Hi! I'm looking for a ${cat.name} travel package. Can you help me plan a trip?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="edp-btn-wa"
              >
                💬 WhatsApp Query
              </a>
              <a href="tel:+918700750589" className="edp-btn-call">
                📞 Call Now
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default ExperienceDetailPage;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const pageCSS = `
  .edp-root {
    min-height: 100vh;
    width:100vw;
    background: linear-gradient(180deg, #f0fafb 0%, #e8f5f7 100%);
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* ── Hero ── */
  .edp-hero {
    position: relative;
    padding: 80px 16px 60px;
    overflow: hidden;
    text-align: center;
  }
  @media (min-width: 640px) { .edp-hero { padding: 90px 24px 70px; } }

  /* deco blobs */
  .edp-deco-1 {
    position: absolute; border-radius: 50%; pointer-events: none;
    width: 360px; height: 360px;
    background: rgba(255,255,255,0.08);
    top: -120px; right: -80px;
  }
  .edp-deco-2 {
    position: absolute; border-radius: 50%; pointer-events: none;
    width: 220px; height: 220px;
    background: rgba(255,255,255,0.06);
    bottom: -60px; left: -50px;
  }
  .edp-deco-dots {
    position: absolute; top: 16px; left: 16px;
    width: 80px; height: 80px; pointer-events: none; opacity: 0.15;
    background-image: radial-gradient(circle, #fff 1px, transparent 1px);
    background-size: 10px 10px;
  }

  /* Back link */
  .edp-back-wrap {
    position: absolute; top: 20px; left: 16px;
  }
  @media (min-width: 640px) { .edp-back-wrap { left: 28px; } }
  .edp-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.85);
    text-decoration: none; padding: 6px 14px; border-radius: 100px;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
    transition: background 0.2s, color 0.2s;
  }
  .edp-back:hover { background: rgba(255,255,255,0.22); color: #fff; }

  .edp-hero-content {
    position: relative; z-index: 1;
    max-width: 700px; margin: 0 auto;
    display: flex; flex-direction: column; align-items: center; gap: 16px;
  }

  .edp-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 16px; border-radius: 100px;
    background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
    font-size: 0.75rem; font-weight: 800; color: #fff;
    letter-spacing: 0.08em; text-transform: uppercase;
  }

  .edp-hero-title {
    font-size: clamp(2rem, 6vw, 3.2rem);
    font-weight: 900; color: #fff;
    line-height: 1.1; margin: 0;
    text-shadow: 0 2px 20px rgba(0,0,0,0.2);
  }

  .edp-hero-desc {
    font-size: clamp(0.88rem, 2vw, 1rem);
    color: rgba(255,255,255,0.88);
    line-height: 1.7; max-width: 560px; margin: 0;
  }

  .edp-best-time {
    font-size: 0.78rem; font-weight: 600;
    color: rgba(255,255,255,0.9);
    padding: 6px 16px; border-radius: 100px;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
  }

  .edp-stats {
    display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
    margin-top: 8px;
  }

  /* ── Tourism type bar ── */
  .edp-type-bar {
    background: #fff;
    border-bottom: 1px solid rgba(15,100,119,0.1);
    padding: 12px 16px;
  }
  @media (min-width: 640px) { .edp-type-bar { padding: 12px 28px; } }
  .edp-type-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .edp-type-label {
    font-size: 0.68rem; font-weight: 700; color: #0f6477;
    text-transform: uppercase; letter-spacing: 0.1em; flex-shrink: 0;
  }
  .edp-type-chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .edp-type-chip {
    font-size: 0.72rem; font-weight: 600;
    padding: 4px 12px; border-radius: 100px;
    background: rgba(15,100,119,0.08);
    border: 1px solid rgba(15,100,119,0.2);
    color: #0f6477;
  }

  /* ── Top destinations bar ── */
  .edp-dest-bar {
    background: rgba(15,100,119,0.04);
    border-bottom: 1px solid rgba(15,100,119,0.08);
    padding: 10px 16px;
  }
  @media (min-width: 640px) { .edp-dest-bar { padding: 10px 28px; } }
  .edp-dest-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .edp-dest-label {
    font-size: 0.68rem; font-weight: 700; color: #5a7f87;
    text-transform: uppercase; letter-spacing: 0.1em; flex-shrink: 0;
  }
  .edp-dest-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .edp-dest-chip {
    font-size: 0.7rem; font-weight: 500;
    padding: 3px 10px; border-radius: 100px;
    background: #fff;
    border: 1px solid rgba(15,100,119,0.15);
    color: #2d8fa3;
  }

  /* ── Packages section ── */
  .edp-packages-section {
    width:100%;
  }
  @media (min-width: 640px) { .edp-packages-section { padding: 48px 24px 72px; } }
  .edp-packages-inner { max-width: 1200px; margin: 0 auto; }

  /* Section heading */
  .edp-sec-head { margin-bottom: 32px; }
  .edp-sec-title {
    font-size: clamp(1.4rem, 3.5vw, 1.9rem);
    font-weight: 900; color: #0a2d36; margin: 0 0 8px;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .edp-sec-count {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 2px 12px; border-radius: 100px;
    background: rgba(15,100,119,0.1);
    border: 1px solid rgba(15,100,119,0.22);
    color: #0f6477; font-size: 0.88rem; font-weight: 800;
  }
  .edp-sec-sub {
    font-size: 0.88rem; color: #5a7f87; line-height: 1.6; max-width: 560px; margin: 0;
  }

  /* Empty state */
  .edp-empty {
    text-align: center; padding: 60px 24px;
    background: #fff; border-radius: 24px;
    border: 1px solid rgba(15,100,119,0.1);
    box-shadow: 0 4px 24px rgba(15,100,119,0.06);
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .edp-empty-title { font-size: 1.1rem; font-weight: 700; color: #0a2d36; margin: 0; }
  .edp-empty-sub   { font-size: 0.85rem; color: #5a7f87; margin: 0; }
  .edp-wa-btn {
    margin-top: 8px;
    padding: 11px 24px; border-radius: 14px;
    background: linear-gradient(135deg,#25d366,#128c7e);
    color: #fff; font-weight: 700; font-size: 0.88rem;
    text-decoration: none;
    box-shadow: 0 4px 18px rgba(37,211,102,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .edp-wa-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,211,102,0.4); }

  /* ── CTA section ── */
  .edp-cta-section {
    padding: 0 16px 72px;
  }
  @media (min-width: 640px) { .edp-cta-section { padding: 0 24px 80px; } }
  .edp-cta-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 40px 28px;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(15,100,119,0.07), rgba(15,100,119,0.12));
    border: 1px solid rgba(15,100,119,0.2);
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .edp-cta-title {
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    font-weight: 900; color: #0a2d36; margin: 0;
    text-transform: capitalize;
  }
  .edp-cta-sub {
    font-size: 0.88rem; color: #5a7f87;
    max-width: 500px; line-height: 1.7; margin: 0;
  }
  .edp-cta-btns {
    display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
  }
  .edp-btn-wa {
    padding: 12px 24px; border-radius: 14px;
    background: linear-gradient(135deg,#25d366,#128c7e);
    color: #fff; font-weight: 700; font-size: 0.88rem;
    text-decoration: none;
    box-shadow: 0 4px 18px rgba(37,211,102,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .edp-btn-wa:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,211,102,0.4); }
  .edp-btn-call {
    padding: 12px 24px; border-radius: 14px;
    background: linear-gradient(135deg,#0f6477,#1a8fa6);
    color: #fff; font-weight: 700; font-size: 0.88rem;
    text-decoration: none;
    box-shadow: 0 4px 18px rgba(15,100,119,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .edp-btn-call:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(15,100,119,0.45); }
`;

const notFoundCSS = `
  .nf-wrap {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background: linear-gradient(180deg, #f0fafb 0%, #e8f5f7 100%);
    font-family: 'DM Sans', system-ui, sans-serif;
  }
  .nf-card {
    background: #fff;
    border-radius: 24px;
    padding: 48px 36px;
    max-width: 420px; width: 100%;
    text-align: center;
    box-shadow: 0 8px 40px rgba(15,100,119,0.1);
    border: 1px solid rgba(15,100,119,0.12);
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .nf-title {
    font-size: 1.6rem; font-weight: 900; color: #0a2d36; margin: 0;
  }
  .nf-sub {
    font-size: 0.88rem; color: #5a7f87; line-height: 1.6; margin: 0;
  }
  .nf-btn {
    margin-top: 8px;
    display: inline-block;
    padding: 12px 28px; border-radius: 14px;
    background: linear-gradient(135deg, #0f6477, #1a8fa6);
    color: #fff; font-weight: 700; font-size: 0.9rem;
    text-decoration: none;
    box-shadow: 0 4px 18px rgba(15,100,119,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .nf-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(15,100,119,0.45); }
`;