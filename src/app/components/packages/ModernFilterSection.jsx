"use client";
import { useState } from "react";

// ─── Theme Token ─────────────────────────────────────────────────────────────
// Primary  : #0f6477   (deep teal)
// On-primary: #ffffff
// Surface  : #0a1e24   (dark teal-black)
// Surface2 : #0d2830
// Border   : rgba(15,100,119,0.35)
// Accent   : rgba(15,100,119,0.12)

// ─── Filter Options ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "all",           label: "All",           icon: "🌍" },
  { value: "domestic",      label: "Domestic",      icon: "🇮🇳" },
  { value: "international", label: "International", icon: "✈️"  },
  { value: "religion",      label: "Religious",     icon: "🕉️"  },
  { value: "family",        label: "Family",        icon: "👨‍👩‍👧‍👦" },
];

const TOURISM_TYPES = [
  { value: "all",            label: "All Types",  icon: "🗺️" },
  { value: "Cultural",       label: "Cultural",   icon: "🎭" },
  { value: "Heritage",       label: "Heritage",   icon: "🏛️" },
  { value: "Beach",          label: "Beach",      icon: "🏖️" },
  { value: "Adventure",      label: "Adventure",  icon: "🏔️" },
  { value: "Nature",         label: "Nature",     icon: "🌿" },
  { value: "Luxury",         label: "Luxury",     icon: "💎" },
  { value: "Wildlife",       label: "Wildlife",   icon: "🦁" },
  { value: "Romantic",       label: "Romantic",   icon: "💕" },
  { value: "Religious",      label: "Religious",  icon: "🕌" },
  { value: "Historical",     label: "Historical", icon: "📜" },
  { value: "Urban",          label: "Urban",      icon: "🏙️" },
  { value: "Modern Culture", label: "Modern",     icon: "🎌" },
];

const SORT_OPTIONS = [
  { value: "default", label: "✦ Featured"      },
  { value: "rating",  label: "⭐ Top Rated"     },
  { value: "popular", label: "🔥 Popular First" },
];

// ─── applyFilters (exported — use in parent page) ─────────────────────────────
export function applyFilters(packages, { category, tourismType, sortBy } = {}) {
  let result = [...packages];

  if (category && category !== "all")
    result = result.filter((p) => p.category?.includes(category));

  if (tourismType && tourismType !== "all")
    result = result.filter((p) =>
      p.tourism_type?.some((t) => t.toLowerCase() === tourismType.toLowerCase())
    );

  switch (sortBy) {
    case "rating":  result.sort((a, b) => (b.rating  || 0) - (a.rating  || 0)); break;
    case "popular": result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)); break;
    default: break;
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────
const ModernFilterSection = ({
  selectedCategory,
  setSelectedCategory,
  selectedTourismType,
  setSelectedTourismType,
  sortBy,
  setSortBy,
  filteredCount,
  onResetFilters,
}) => {
  // Mobile: show/hide full filter panel
  const [panelOpen, setPanelOpen] = useState(false);

  const activeFilters = [
    selectedCategory !== "all" && {
      key: "cat",
      label: CATEGORIES.find((c) => c.value === selectedCategory)?.label,
      icon:  CATEGORIES.find((c) => c.value === selectedCategory)?.icon,
      clear: () => setSelectedCategory("all"),
    },
    selectedTourismType !== "all" && {
      key: "type",
      label: TOURISM_TYPES.find((t) => t.value === selectedTourismType)?.label,
      icon:  TOURISM_TYPES.find((t) => t.value === selectedTourismType)?.icon,
      clear: () => setSelectedTourismType("all"),
    },
    sortBy !== "default" && {
      key: "sort",
      label: SORT_OPTIONS.find((s) => s.value === sortBy)?.label,
      icon: "↕",
      clear: () => setSortBy("default"),
    },
  ].filter(Boolean);

  return (
    <>
      {/* ── Scoped CSS ─────────────────────────────────────────────── */}
      <style>{`
        /* reset */
        .mf * { box-sizing: border-box; }

        /* root card */
        .mf-card {
          background: #0f6177;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* section label */
        .mf-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #4a9aab;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mf-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(15,100,119,0.3), transparent);
        }

        /* thin divider */
        .mf-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(15,100,119,0.3), transparent);
        }

        /* ── Category Pills ─────────────────────────────────────────── */
        .mf-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .mf-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 100px;
          border: 1.5px solid rgba(15,100,119,0.3);
          background: rgba(15,100,119,0.07);
          color: #7ecad8;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          font-family: inherit;
          line-height: 1.3;
        }
        .mf-pill:hover {
          border-color: rgba(15,100,119,0.65);
          background: rgba(15,100,119,0.15);
          color: #ffffff;
          transform: translateY(-2px);
        }
        .mf-pill.mf-active {
          background: #0f6477;
          border-color: #0f6477;
          color: #ffffff;
          font-weight: 700;
          transform: translateY(-2px);
          box-shadow: 0 4px 18px rgba(15,100,119,0.45);
        }

        /* ── Tourism Type Scroll Chips ──────────────────────────────── */
        .mf-chips {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .mf-chips::-webkit-scrollbar { display: none; }

        .mf-chip {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 9px 13px;
          border-radius: 14px;
          border: 1.5px solid #fff;
          background: #0f6177;
          color: #7ecad8;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .mf-chip-icon { font-size: 1.2rem; line-height: 1; }
        .mf-chip:hover {
          border-color: rgba(15,100,119,0.6);
          background: rgba(15,100,119,0.14);
          color: #fff;
          transform: translateY(-2px);
        }
        .mf-chip.mf-active {
          background: #0f6477;
          border-color: #0f6477;
          color: #fff;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(15,100,119,0.4);
          transform: translateY(-2px);
        }

        /* ── Sort Segment ───────────────────────────────────────────── */
        .mf-segs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .mf-seg {
          padding: 7px 16px;
          border-radius: 10px;
          border: 1.5px solid rgba(15,100,119,0.2);
          background: rgba(15,100,119,0.05);
          color: #4a9aab;
          font-size: 0.77rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        .mf-seg:hover {
          border-color: rgba(15,100,119,0.55);
          color: #fff;
          background: rgba(15,100,119,0.12);
        }
        .mf-seg.mf-active {
          background: #0f6477;
          border-color: #0f6477;
          color: #fff;
          font-weight: 700;
          box-shadow: 0 3px 14px rgba(15,100,119,0.4);
        }

        /* ── Bottom Bar ─────────────────────────────────────────────── */
        .mf-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .mf-count-num {
          font-size: 2.4rem;
          font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, #0f6477, #2db3cc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.03em;
        }
        .mf-count-txt {
          font-size: 0.68rem;
          color: #4a9aab;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .mf-reset {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 16px;
          border-radius: 10px;
          border: 1.5px solid rgba(239,68,68,0.35);
          background: transparent;
          color: #f87171;
          font-size: 0.77rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .mf-reset:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.6);
          transform: translateY(-1px);
        }

        /* ── Active Tags ────────────────────────────────────────────── */
        .mf-tags { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; }
        .mf-tag-lbl { font-size: 0.63rem; color: #4a9aab; text-transform: uppercase; letter-spacing: 0.1em; }
        .mf-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          background: rgba(15,100,119,0.18);
          border: 1px solid rgba(15,100,119,0.4);
          color: #7ecad8;
          font-size: 0.72rem;
          font-weight: 600;
          animation: tagPop 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes tagPop { from { opacity:0; transform:scale(0.75); } to { opacity:1; transform:scale(1); } }
        .mf-tag-x {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: rgba(15,100,119,0.3);
          border: none;
          color: #7ecad8;
          font-size: 0.6rem;
          cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0; font-family: inherit; line-height: 1;
          transition: background 0.2s;
        }
        .mf-tag-x:hover { background: rgba(239,68,68,0.4); color: #fca5a5; }

        /* ── Mobile Toggle Button ───────────────────────────────────── */
        .mf-toggle-bar {
          display: none;
        }
        @media (max-width: 767px) {
          .mf-toggle-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 12px 16px;
            border-radius: 14px;
            background: rgba(15,100,119,0.1);
            border: 1.5px solid rgba(15,100,119,0.3);
            cursor: pointer;
            color: #7ecad8;
            font-size: 0.88rem;
            font-weight: 600;
            font-family: inherit;
          }
          .mf-toggle-bar:hover {
            background: rgba(15,100,119,0.18);
          }
          /* on mobile: body hidden unless panelOpen */
          .mf-body-hidden { display: none; }
          .mf-body-visible { display: flex; flex-direction: column; gap: 18px; }
        }
        @media (min-width: 768px) {
          .mf-toggle-bar   { display: none !important; }
          .mf-body-hidden  { display: flex; flex-direction: column; gap: 18px; }
          .mf-body-visible { display: flex; flex-direction: column; gap: 18px; }
        }

        /* ── Responsive chip grid on wider screens ──────────────────── */
        @media (min-width: 640px) {
          .mf-chips {
            flex-wrap: wrap;
            overflow-x: visible;
          }
        }
      `}</style>

      {/* ── Root Card ─────────────────────────────────────────────────── */}
      <div className="mf mf-card">

        {/* Mobile toggle bar */}
        <button
          className="mf-toggle-bar"
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
        >
          <span>
            🔍 &nbsp;Filters
            {activeFilters.length > 0 && (
              <span
                style={{
                  marginLeft: 8,
                  background: "#0f6477",
                  color: "#fff",
                  borderRadius: "100px",
                  padding: "1px 8px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {activeFilters.length}
              </span>
            )}
          </span>
          <span style={{ fontSize: "1.1rem", transition: "transform 0.25s", transform: panelOpen ? "rotate(180deg)" : "none" }}>
            ▾
          </span>
        </button>

        {/* ── Filter Body ───────────────────────────────────────────── */}
        <div className={panelOpen ? "mf-body-visible" : "mf-body-hidden"}>

          {/* Row 1 — Destination Type */}
          <div>
            <p className="mf-label">✦ Destination Type</p>
            <div className="mf-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  className={`mf-pill ${selectedCategory === cat.value ? "mf-active" : ""}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  <span style={{ fontSize: "0.95rem" }}>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mf-divider" />

          {/* Row 2 — Tourism Type */}
          <div>
            <p className="mf-label">🎯 Tourism Type</p>
            <div className="mf-chips">
              {TOURISM_TYPES.map((t) => (
                <button
                  key={t.value}
                  className={`mf-chip ${selectedTourismType === t.value ? "mf-active" : ""}`}
                  onClick={() => setSelectedTourismType(t.value)}
                >
                  <span className="mf-chip-icon">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mf-divider" />

          {/* Row 3 — Sort */}
          <div>
            <p className="mf-label">↕ Sort By</p>
            <div className="mf-segs">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  className={`mf-seg ${sortBy === s.value ? "mf-active" : ""}`}
                  onClick={() => setSortBy(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mf-divider" />

          {/* Row 4 — Count + Reset + Tags */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="mf-bottom">
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span className="mf-count-num">{filteredCount}</span>
                <span className="mf-count-txt">Packages Found</span>
              </div>
              {activeFilters.length > 0 && (
                <button className="mf-reset" onClick={onResetFilters}>
                  ✕ Reset All
                </button>
              )}
            </div>

            {activeFilters.length > 0 && (
              <div className="mf-tags">
                <span className="mf-tag-lbl">Active:</span>
                {activeFilters.map((f) => (
                  <span key={f.key} className="mf-tag">
                    {f.icon} {f.label}
                    <button className="mf-tag-x" onClick={f.clear}>✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>{/* end body */}

        {/* On mobile — always show count + active tags even when collapsed */}
        <style>{`
          @media (max-width: 767px) {
            .mf-mobile-always { display: flex !important; flex-direction: column; gap: 8px; }
          }
          @media (min-width: 768px) {
            .mf-mobile-always { display: none !important; }
          }
        `}</style>
        <div className="mf-mobile-always" style={{ display: "none" }}>
          <div className="mf-bottom">
            {/* <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="mf-count-num">{filteredCount}</span>
              <span className="mf-count-txt">Packages Found</span>
            </div> */}
            {activeFilters.length > 0 && (
              <button className="mf-reset" onClick={onResetFilters}>✕ Reset All</button>
            )}
          </div>
          {activeFilters.length > 0 && (
            <div className="mf-tags">
              <span className="mf-tag-lbl">Active:</span>
              {activeFilters.map((f) => (
                <span key={f.key} className="mf-tag">
                  {f.icon} {f.label}
                  <button className="mf-tag-x" onClick={f.clear}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

      </div>{/* end mf-card */}
    </>
  );
};

export default ModernFilterSection;
export { CATEGORIES, TOURISM_TYPES, SORT_OPTIONS };