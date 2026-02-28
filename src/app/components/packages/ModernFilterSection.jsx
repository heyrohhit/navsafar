"use client";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Design: Refined Luxury — dark navy base, champagne gold accents
   Matches TourPackages + PackageGridLayout aesthetic system
   Features:
   • Animated category pills with icon glow
   • Horizontal price + duration sliders as segmented controls
   • Live results counter with animated number
   • Active filter tags with individual remove
   • Subtle background noise texture + gold separator lines
   ───────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { value: "all", label: "All", icon: "🌍" },
  { value: "domestic", label: "Domestic", icon: "🇮🇳" },
  { value: "international", label: "International", icon: "✈️" },
  { value: "religious", label: "Religious", icon: "🕉️" },
  { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "adventure", label: "Adventure", icon: "🏔️" },
];

const PRICE_OPTIONS = [
  { value: "all", label: "Any Budget" },
  { value: "budget", label: "Under ₹20k" },
  { value: "moderate", label: "₹20k–50k" },
  { value: "premium", label: "₹50k–1L" },
  { value: "luxury", label: "₹1L+" },
];

const DURATION_OPTIONS = [
  { value: "all", label: "Any Length" },
  { value: "short", label: "1–3 Days" },
  { value: "medium", label: "4–6 Days" },
  { value: "long", label: "7+ Days" },
];

const ModernFilterSection = ({
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setPriceRange,
  selectedDuration,
  setDuration,
  filteredCount,
  onResetFilters,
}) => {
  const activeFilters = [
    selectedCategory !== "all" && { key: "category", label: CATEGORIES.find(c => c.value === selectedCategory)?.label, icon: CATEGORIES.find(c => c.value === selectedCategory)?.icon, clear: () => setSelectedCategory("all") },
    selectedPriceRange !== "all" && { key: "price", label: PRICE_OPTIONS.find(p => p.value === selectedPriceRange)?.label, icon: "💰", clear: () => setPriceRange("all") },
    selectedDuration !== "all" && { key: "duration", label: DURATION_OPTIONS.find(d => d.value === selectedDuration)?.label, icon: "🗓", clear: () => setDuration("all") },
  ].filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        .mf-root {
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Row label ── */
        .mf-row-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mf-row-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(201,168,92,0.25), transparent);
        }

        /* ── Category pills ── */
        .mf-cat-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .mf-cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 100px;
          border: 1.5px solid rgba(201,168,92,0.18);
          background: rgba(255,255,255,0.5);
          color: #4b5563;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }
        .mf-cat-pill::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(201,168,92,0.12), rgba(201,168,92,0.04));
          opacity: 0;
          transition: opacity 0.25s;
        }
        .mf-cat-pill:hover::before { opacity: 1; }
        .mf-cat-pill:hover {
          border-color: rgba(201,168,92,0.5);
          color: #0f1c2e;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201,168,92,0.18);
        }
        .mf-cat-pill.active {
          background: linear-gradient(135deg, #0f2035 0%, #1a3050 100%);
          border-color: rgba(201,168,92,0.6);
          color: #fff;
          box-shadow:
            0 4px 18px rgba(11,17,32,0.25),
            0 0 0 1px rgba(201,168,92,0.2) inset;
          transform: translateY(-2px);
        }
        .mf-cat-pill.active .pill-icon {
          filter: drop-shadow(0 0 4px rgba(201,168,92,0.6));
        }

        .pill-icon { font-size: 1rem; line-height: 1; }

        /* ── Segmented controls (price, duration) ── */
        .mf-seg {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .mf-seg-btn {
          padding: 8px 16px;
          border-radius: 10px;
          border: 1.5px solid rgba(201,168,92,0.15);
          background: rgba(255,255,255,0.6);
          color: #6b7280;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
          font-family: 'DM Sans', sans-serif;
        }
        .mf-seg-btn:hover {
          border-color: rgba(201,168,92,0.4);
          color: #0f1c2e;
          background: rgba(255,255,255,0.9);
          transform: translateY(-1px);
        }
        .mf-seg-btn.active {
          background: linear-gradient(135deg, #c9a85c, #b8893a);
          border-color: transparent;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(201,168,92,0.35);
          transform: translateY(-1px);
        }

        /* ── Divider ── */
        .mf-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,92,0.2), transparent);
          margin: 0;
        }

        /* ── Results counter ── */
        .mf-results-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .mf-count-box {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .mf-count-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 600;
          color: #0f1c2e;
          line-height: 1;
        }
        .mf-count-label {
          font-size: 0.78rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ── Reset button ── */
        .mf-reset {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: 10px;
          border: 1.5px solid rgba(224,112,96,0.35);
          background: transparent;
          color: #e07060;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .mf-reset:hover {
          background: #e07060;
          color: #fff;
          border-color: transparent;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(224,112,96,0.3);
        }

        /* ── Active filter tags ── */
        .mf-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .mf-tag-label {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin-right: 2px;
        }
        .mf-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 100px;
          background: rgba(201,168,92,0.1);
          border: 1px solid rgba(201,168,92,0.3);
          color: #8a6820;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: default;
          animation: tagIn 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes tagIn {
          from { opacity: 0; transform: scale(0.8) translateY(4px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);   }
        }
        .mf-tag-x {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: rgba(201,168,92,0.25);
          color: #8a6820;
          font-size: 0.7rem;
          line-height: 1;
          cursor: pointer;
          transition: background 0.2s;
          border: none;
          padding: 0;
          font-family: inherit;
        }
        .mf-tag-x:hover { background: rgba(224,112,96,0.3); color: #e07060; }
      `}</style>

      <div className="mf-root" style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

        {/* ── Row 1: Categories ── */}
        <div>
          <p className="mf-row-label">✦ Destination Type</p>
          <div className="mf-cat-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`mf-cat-pill ${selectedCategory === cat.value ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                <span className="pill-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mf-divider" />

        {/* ── Row 2: Price + Duration side by side ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Price */}
          <div>
            <p className="mf-row-label">💰 Budget Range</p>
            <div className="mf-seg">
              {PRICE_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  className={`mf-seg-btn ${selectedPriceRange === p.value ? "active" : ""}`}
                  onClick={() => setPriceRange(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="mf-row-label">🗓 Trip Duration</p>
            <div className="mf-seg">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  className={`mf-seg-btn ${selectedDuration === d.value ? "active" : ""}`}
                  onClick={() => setDuration(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 3: @mobile stack ── */}
        <style>{`
          @media (max-width: 640px) {
            .mf-price-dur-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        <div className="mf-divider" />

        {/* ── Row 4: Results + Reset + Active Tags ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="mf-results-wrap">
            {/* Count */}
            <div className="mf-count-box">
              <span className="mf-count-num">{filteredCount}</span>
              <span className="mf-count-label">Packages Found</span>
            </div>

            {/* Reset */}
            {activeFilters.length > 0 && (
              <button className="mf-reset" onClick={onResetFilters}>
                ✕ Reset All
              </button>
            )}
          </div>

          {/* Active filter tags */}
          {activeFilters.length > 0 && (
            <div className="mf-tags">
              <span className="mf-tag-label">Active:</span>
              {activeFilters.map((f) => (
                <span key={f.key} className="mf-tag">
                  {f.icon} {f.label}
                  <button className="mf-tag-x" onClick={f.clear}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default ModernFilterSection;