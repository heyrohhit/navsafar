"use client";
import { useState, useEffect, useRef } from "react";

// full screen data show
import { createPortal } from "react-dom";

// ─── WhatsApp Query Handler ──────────────────────────────────────────────────
export function handleGetQuery(pkg) {
  const lines = [
    `✈️ *Travel Query — ${pkg.title}*`,
    `📍 *Destination:* ${pkg.city}, ${pkg.country}`,
    `🏷️ *Tagline:* ${pkg.tagline}`,
    `⏱️ *Duration:* ${pkg.duration}`,
    `⭐ *Rating:* ${pkg.rating}/5`,
    `📝 *Description:* ${pkg.description}`,
    `🌤️ *Best Time to Visit:* ${pkg.bestTime}`,
    `✨ *Highlights:*\n${(pkg.highlights || []).map((h) => `  • ${h}`).join("\n")}`,
    `🎯 *Activities:*\n${(pkg.activities || []).map((a) => `  • ${a}`).join("\n")}`,
    `\n_Please share more details & pricing for this package. Thank you!_`,
  ]
    .filter(Boolean)
    .join("\n");

  window.open(`https://wa.me/918882128640?text=${encodeURIComponent(lines)}`, "_blank");
}



// ─── Helpers ─────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: "0.9rem",
            color: i < full ? "#f59e0b" : i === full && half ? "#fbbf24" : "#334155",
          }}
        >
          ★
        </span>
      ))}
      <span style={{ marginLeft: 5, fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>
        {rating}
      </span>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const PopUpFeature = ({ selectedPackage: pkg, onClose }) => {
  const [tab, setTab] = useState("overview");
  const overlayRef   = useRef(null);

  // components mount states
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  // ESC to close
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!pkg) return null;

  const TABS = [
    { key: "overview",   label: "Overview",  icon: "📋" },
    { key: "itinerary",  label: "Itinerary", icon: "🗓️" },
    { key: "highlights", label: "Highlights",icon: "✨" },
    { key: "activities", label: "Activities", icon: "🎯" },
  ];

  // Gradient accent per tab
  const ACCENT = {
    overview:   "linear-gradient(135deg, #0f6477, #1a8fa6)",
    itinerary:  "linear-gradient(135deg, #0f6477, #0e7a5a)",
    highlights: "linear-gradient(135deg, #0f6477, #7c3aed)",
    activities: "linear-gradient(135deg, #0f6477, #0f766e)",
  };

 if (!mounted) return null;

  return createPortal(
  <>
      {/* ── Scoped CSS ─────────────────────────────────────────────── */}
      <style>{`
        .pu-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: flex-end;       /* mobile: sheet from bottom */
          justify-content: center;
          background: rgba(0,0,0,0.82);
          backdrop-filter: blur(10px);
          padding: 0;
        }
        @media (min-width: 640px) {
          .pu-overlay {
            align-items: center;
            
          }
        }

        /* ── Modal shell ── */
        .pu-modal {
          position: relative;
          width: 95%;
          padding-bottom:15%;
          border-radius: 24px 24px 0 0;   /* mobile: bottom sheet */
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(160deg, #071419 0%, #0c2128 100%);
          border: 1px solid rgba(15,100,119,0.3);
          box-shadow: 0 40px 120px rgba(0,0,0,0.8);
          max-height: 105dvh;
          animation: puSlideUp 0.32s cubic-bezier(0.22,1,0.36,1);
        }
        @media (min-width: 640px) {
          .pu-modal {
            border-radius: 24px;
            flex-direction: row;
            max-height: 100vh;
            max-width: 900px;
            padding-bottom:0;
            animation: puFadeIn 0.28s ease;
          }
        }
        @keyframes puSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes puFadeIn {
          from { transform: scale(0.96); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }

        /* ── Drag handle (mobile only) ── */
        .pu-handle {
          display: flex;
          justify-content: center;
          padding: 10px 0 2px;
          flex-shrink: 0;
        }
        .pu-handle-bar {
          width: 40px; height: 4px;
          border-radius: 100px;
          background: rgba(15,100,119,0.5);
        }
        @media (min-width: 640px) { .pu-handle { display: none; } }

        /* ── Left panel: image ─────────────────────────────────────── */
        .pu-left {
          position: relative;
          width: 100%;
          flex-shrink: 0;
        }
        .pu-left-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
        @media (min-width: 640px) {
          .pu-left {
            width: 42%;
            max-width: 380px;
          }
          .pu-left-img {
            height: 100%;
            min-height: 500px;
          }
        }
        .pu-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top,
            rgba(7,20,25,0.97) 0%,
            rgba(7,20,25,0.5)  45%,
            rgba(7,20,25,0.1)  100%);
        }
        .pu-img-info {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 14px;
        }
        .pu-img-title {
          color: #fff;
          font-size: 1rem;
          font-weight: 800;
          line-height: 1.25;
          margin: 0 0 3px;
        }
        @media (min-width: 640px) {
          .pu-img-title { font-size: 1.2rem; }
        }
        .pu-img-tagline {
          color: #7ecad8;
          font-size: 0.75rem;
          margin: 0 0 6px;
          font-weight: 500;
        }
        .pu-badges {
          position: absolute;
          top: 10px; left: 10px;
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .pu-badge-pop {
          padding: 3px 10px;
          border-radius: 100px;
          background: #f59e0b;
          color: #1c1917;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.05em;
        }
        .pu-meta-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 8px;
        }
        .pu-meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 9px;
          border-radius: 8px;
          background: rgba(15,100,119,0.25);
          border: 1px solid rgba(15,100,119,0.4);
          color: #7ecad8;
          font-size: 0.68rem;
          font-weight: 500;
        }

        /* ── Right panel ───────────────────────────────────────────── */
        .pu-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* Header */
        .pu-header {
          padding: 14px 16px 10px;
          border-bottom: 1px solid rgba(15,100,119,0.2);
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .pu-header { padding: 18px 20px 12px; }
        }
        .pu-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .pu-enquire-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #0f6477;
        }
        .pu-enquire-note {
          font-size: 1rem;
          font-weight: 800;
          color: #7ecad8;
          line-height: 1.2;
        }
        @media (min-width: 640px) {
          .pu-enquire-note { font-size: 1.25rem; }
        }
        .pu-close {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(15,100,119,0.35);
          background: rgba(15,100,119,0.1);
          color: #7ecad8;
          font-size: 1rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .pu-close:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
          color: #f87171;
        }

        /* Tab bar */
        .pu-tabs {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
        }
        .pu-tabs::-webkit-scrollbar { display: none; }
        .pu-tab {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: 10px;
          border: 1.5px solid transparent;
          background: transparent;
          color: #4a9aab;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          font-family: inherit;
          flex-shrink: 0;
        }
        .pu-tab:hover {
          color: #fff;
          background: rgba(15,100,119,0.12);
        }
        .pu-tab.pu-tab-active {
          background: #0f6477;
          border-color: #0f6477;
          color: #fff;
          box-shadow: 0 3px 14px rgba(15,100,119,0.45);
        }
        @media (min-width: 640px) {
          .pu-tab { font-size: 0.8rem; padding: 8px 14px; }
        }

        /* Scrollable content */
        .pu-content {
          flex: 1;
          overflow-y: auto;
          padding: 14px 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(15,100,119,0.4) transparent;
        }
        @media (min-width: 640px) {
          .pu-content { padding: 18px 20px; }
        }
        .pu-content::-webkit-scrollbar { width: 4px; }
        .pu-content::-webkit-scrollbar-thumb {
          background: rgba(15,100,119,0.4);
          border-radius: 4px;
        }

        /* Content elements */
        .pu-section-lbl {
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #4a9aab;
          margin-bottom: 8px;
        }
        .pu-desc {
          font-size: 0.82rem;
          color: #94a3b8;
          line-height: 1.7;
          margin: 0 0 16px;
        }
        .pu-chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .pu-chip-teal {
          padding: 5px 12px;
          border-radius: 10px;
          background: rgba(15,100,119,0.14);
          border: 1px solid rgba(15,100,119,0.35);
          color: #7ecad8;
          font-size: 0.73rem;
          font-weight: 600;
        }
        .pu-chip-purple {
          padding: 5px 12px;
          border-radius: 10px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.25);
          color: #c4b5fd;
          font-size: 0.73rem;
          font-weight: 600;
        }

        /* Itinerary day row */
        .pu-day-row {
          display: flex;
          gap: 12px;
          padding: 11px;
          border-radius: 14px;
          background: rgba(15,100,119,0.07);
          border: 1px solid rgba(15,100,119,0.15);
          margin-bottom: 8px;
          transition: background 0.2s;
        }
        .pu-day-row:hover { background: rgba(15,100,119,0.13); }
        .pu-day-badge {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #0f6477;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(15,100,119,0.5);
        }
        .pu-day-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 3px;
        }
        .pu-day-desc {
          font-size: 0.73rem;
          color: #64748b;
          line-height: 1.5;
        }

        /* Highlight row */
        .pu-hl-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(15,100,119,0.07);
          border: 1px solid rgba(15,100,119,0.14);
          margin-bottom: 7px;
        }
        .pu-hl-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #0f6477;
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(15,100,119,0.7);
        }
        .pu-hl-txt { font-size: 0.8rem; color: #cbd5e1; }

        /* Activities grid */
        .pu-act-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }
        @media (min-width: 400px) {
          .pu-act-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .pu-act-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 11px;
          border-radius: 12px;
          background: rgba(15,100,119,0.07);
          border: 1px solid rgba(15,100,119,0.15);
          font-size: 0.75rem;
          color: #cbd5e1;
        }
        .pu-act-dot { color: #0f6477; font-size: 1rem; flex-shrink: 0; }

        /* CTA footer */
        .pu-footer {
          flex-shrink: 0;
          padding: 12px 16px;
          border-top: 1px solid rgba(15,100,119,0.2);
          display: flex;
          gap: 10px;
        }
        @media (min-width: 640px) {
          .pu-footer { padding: 14px 20px; }
        }
        .pu-btn {
          flex: 1;
          padding: 12px 10px;
          border-radius: 14px;
          border: none;
          font-size: 0.82rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        @media (min-width: 640px) {
          .pu-btn { font-size: 0.88rem; padding: 13px 16px; }
        }
        .pu-btn:hover  { transform: translateY(-2px); }
        .pu-btn:active { transform: scale(0.97); }
        .pu-btn-wa {
          background: linear-gradient(135deg, #25d366, #128c7e);
          box-shadow: 0 4px 20px rgba(37,211,102,0.3);
        }
        .pu-btn-call {
          background: linear-gradient(135deg, #0f6477, #0e7a8a);
          box-shadow: 0 4px 20px rgba(15,100,119,0.45);
        }
        .pu-btn-call:hover {
          box-shadow: 0 8px 28px rgba(15,100,119,0.55);
        }
      `}</style>

      {/* ── Overlay ───────────────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        className="pu-overlay"
        onClick={(e) => e.target === overlayRef.current && onClose()}
      >
        <div className="pu-modal">

          {/* Drag handle (mobile) */}
          <div className="pu-handle">
            <div className="pu-handle-bar" />
          </div>

          {/* ── Left: Image ─────────────────────────────────────────── */}
          <div className="pu-left">
            <img src={pkg.image} alt={pkg.title} className="pu-left-img" />
            <div className="pu-img-overlay" />

            {/* Badges */}
            <div className="pu-badges">
              {pkg.popular && <span className="pu-badge-pop">⭐ POPULAR</span>}
            </div>

            {/* Info over image */}
            <div className="pu-img-info">
              <h2 className="pu-img-title">{pkg.title}</h2>
              <p className="pu-img-tagline">{pkg.tagline}</p>
              <Stars rating={pkg.rating} />
              <div className="pu-meta-chips">
                {[
                  { icon: "📍", val: `${pkg.city}, ${pkg.country}` },
                  { icon: "⏱️", val: pkg.duration },
                  { icon: "🌤️", val: pkg.bestTime },
                ].map((m, i) => (
                  <span key={i} className="pu-meta-chip">
                    {m.icon} {m.val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel ─────────────────────────────────────────── */}
          <div className="pu-right">

            {/* Header */}
            <div className="pu-header">
              <div className="pu-header-top">
                <div>
                  <p className="pu-enquire-label">Pricing on Enquiry</p>
                  <p className="pu-enquire-note">Customised to your budget 💬</p>
                </div>
                <button className="pu-close" onClick={onClose} aria-label="Close">✕</button>
              </div>

              {/* Tabs */}
              <div className="pu-tabs" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    className={`pu-tab${tab === t.key ? " pu-tab-active" : ""}`}
                    onClick={() => setTab(t.key)}
                    role="tab"
                    aria-selected={tab === t.key}
                  >
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable content */}
            <div className="pu-content">

              {/* OVERVIEW */}
              {tab === "overview" && (
                <div>
                  <p className="pu-desc">{pkg.description}</p>

                  <p className="pu-section-lbl">🏛️ Famous Attractions</p>
                  <div className="pu-chip-row">
                    {(pkg.famous_attractions || []).map((a, i) => (
                      <span key={i} className="pu-chip-teal">🏛️ {a}</span>
                    ))}
                  </div>

                  <p className="pu-section-lbl">🗺️ Tourism Type</p>
                  <div className="pu-chip-row">
                    {(pkg.tourism_type || []).map((t, i) => (
                      <span key={i} className="pu-chip-purple">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ITINERARY */}
              {tab === "itinerary" && (
                <div>
                  {(pkg.itinerary || []).map((item, i) => (
                    <div key={i} className="pu-day-row">
                      <div className="pu-day-badge">{item.day}</div>
                      <div>
                        <p className="pu-day-title">{item.title}</p>
                        <p className="pu-day-desc">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* HIGHLIGHTS */}
              {tab === "highlights" && (
                <div>
                  {(pkg.highlights || []).map((h, i) => (
                    <div key={i} className="pu-hl-row">
                      <div className="pu-hl-dot" />
                      <span className="pu-hl-txt">{h}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ACTIVITIES */}
              {tab === "activities" && (
                <div className="pu-act-grid">
                  {(pkg.activities || []).map((a, i) => (
                    <div key={i} className="pu-act-item">
                      <span className="pu-act-dot">◆</span>
                      {a}
                    </div>
                  ))}
                </div>
              )}

            </div>{/* end pu-content */}

            {/* CTA Buttons */}
            <div className="pu-footer">
              <button
                className="pu-btn pu-btn-wa"
                onClick={() => handleGetQuery(pkg)}
              >
                📲 WhatsApp Query
              </button>
              <button
                className="pu-btn pu-btn-call"
                onClick={() => window.location.href = "tel:+918882128640"}
              >
                📞 Call Now
              </button>
            </div>

          </div>{/* end pu-right */}
        </div>{/* end pu-modal */}
      </div>{/* end pu-overlay */}
      </>,
  document.body
);
};

export default PopUpFeature;