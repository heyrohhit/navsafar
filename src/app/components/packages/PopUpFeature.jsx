"use client";
import { useState, useEffect } from "react";
import { handleGetQuery } from "./PackageUtils";

/* ─────────────────────────────────────────────────────────────
   Design: Luxury Editorial Modal
   • Cinematic full-bleed image left (desktop) / top (mobile)
   • Gold accent system matching TourPackages aesthetic
   • Cormorant Garamond title + DM Sans body
   • Smooth slide-up entrance animation
   • Tabbed sections: Overview / Inclusions / Activities
   • Sticky CTA bar at bottom
   • Keyboard ESC to close
   ───────────────────────────────────────────────────────────── */

const PopUpFeature = ({ selectedPackage, onClose, buttons = [] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = "hidden";

    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!isMounted) return null;

  /* ── Empty state ── */
  if (!selectedPackage || Object.keys(selectedPackage).length === 0) {
    return (
      <div className="pf-overlay" onClick={onClose}>
        <div className="pf-empty" onClick={(e) => e.stopPropagation()}>
          <span style={{ fontSize: "3rem" }}>🗺️</span>
          <h3>No details available</h3>
          <button className="pf-btn-close-empty" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const pkg = selectedPackage;

  /* Tabs that have content */
  const tabs = [
    { key: "overview", label: "Overview", show: true },
    { key: "inclusions", label: "Inclusions", show: pkg.inclusions?.length > 0 },
    { key: "activities", label: "Activities", show: pkg.activities?.length > 0 || pkg.highlights?.length > 0 },
  ].filter((t) => t.show);

  const excludedKeys = [
    "id", "image", "tags", "rating", "duration", "category", "discount", "popular",
    "inclusions", "title", "name", "description", "location", "highlights",
    "activities", "tagline", "price", "originalPrice",
  ];

  /* Savings calc */
  const savingsPct = (() => {
    if (!pkg.price || !pkg.originalPrice) return null;
    const curr = parseInt(pkg.price.replace(/[₹,]/g, ""));
    const orig = parseInt(pkg.originalPrice.replace(/[₹,]/g, ""));
    return orig > curr ? Math.round(((orig - curr) / orig) * 100) : null;
  })();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* Overlay */
        .pf-overlay {
          position: fixed; inset: 0;
          background: rgba(8, 13, 24, 0.75);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: pfOverlayIn 0.3s ease;
        }
        @keyframes pfOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Modal shell */
        .pf-modal {
          background: #fff;
          width: 100%; max-width: 1020px;
          max-height: 90vh;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          box-shadow:
            0 32px 80px rgba(8,13,24,0.4),
            0 0 0 1px rgba(201,168,92,0.15);
          animation: pfModalIn 0.4s cubic-bezier(0.22,1,0.36,1);
          position: relative;
        }
        @keyframes pfModalIn {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        /* Image column */
        .pf-img-col {
          flex: 0 0 42%;
          position: relative;
          overflow: hidden;
          background: #0b1120;
        }
        .pf-img-col img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 8s ease, opacity 0.5s;
          transform: scale(1.04);
        }
        .pf-img-col img.loaded { opacity: 1; }
        .pf-img-col img:not(.loaded) { opacity: 0; }
        .pf-img-col:hover img { transform: scale(1.08); }

        /* Image gradient */
        .pf-img-gradient {
          position: absolute; inset: 0;
          background:
            linear-gradient(to top, rgba(8,13,24,0.8) 0%, transparent 50%),
            linear-gradient(to right, rgba(8,13,24,0.2) 0%, transparent 40%);
          pointer-events: none;
        }

        /* Close btn */
        .pf-close {
          position: absolute; top: 14px; left: 14px; z-index: 10;
          width: 36px; height: 36px;
          background: rgba(8,13,24,0.55);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          color: #fff;
          font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'DM Sans', sans-serif;
        }
        .pf-close:hover {
          background: rgba(224,112,96,0.8);
          border-color: transparent;
          transform: rotate(90deg);
        }

        /* Image bottom info */
        .pf-img-bottom {
          position: absolute; bottom: 18px; left: 18px; right: 18px;
          z-index: 2;
          display: flex; flex-direction: column; gap: 6px;
        }
        .pf-img-location {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          display: flex; align-items: center; gap: 4px;
        }

        /* Badges */
        .pf-badge {
          position: absolute;
          padding: 4px 12px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          backdrop-filter: blur(8px);
        }
        .pf-badge-discount {
          top: 14px; right: 14px;
          background: linear-gradient(135deg, #e07060, #c0392b);
          color: #fff;
        }
        .pf-badge-popular {
          top: 58px; right: 14px;
          background: linear-gradient(135deg, #c9a85c, #b8893a);
          color: #fff;
        }

        /* Price on image */
        .pf-price-block {
          display: flex; align-items: baseline; gap: 8px;
          flex-wrap: wrap;
        }
        .pf-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }
        .pf-orig-price {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          text-decoration: line-through;
        }
        .pf-save-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(201,168,92,0.25);
          border: 1px solid rgba(201,168,92,0.5);
          color: #e8cc8a;
          padding: 2px 8px;
          border-radius: 100px;
        }

        /* Rating row on image */
        .pf-rating-row {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(8,13,24,0.5);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 4px 12px;
          width: fit-content;
        }
        .pf-stars { display: flex; gap: 2px; }
        .pf-star { font-size: 0.75rem; }
        .pf-star.filled { color: #ffd700; }
        .pf-star.empty  { color: rgba(255,255,255,0.25); }
        .pf-rating-val {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        /* Content column */
        .pf-content-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
        }

        /* Scrollable area */
        .pf-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 28px 28px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(201,168,92,0.3) transparent;
        }
        .pf-scroll::-webkit-scrollbar { width: 4px; }
        .pf-scroll::-webkit-scrollbar-track { background: transparent; }
        .pf-scroll::-webkit-scrollbar-thumb { background: rgba(201,168,92,0.3); border-radius: 4px; }

        /* Header */
        .pf-header { margin-bottom: 16px; }

        .pf-meta-row {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }
        .pf-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .pf-chip-cat {
          background: rgba(58,143,168,0.1);
          border: 1px solid rgba(58,143,168,0.3);
          color: #2a7a8f;
        }
        .pf-chip-dur {
          background: rgba(201,168,92,0.1);
          border: 1px solid rgba(201,168,92,0.3);
          color: #8a6820;
        }

        .pf-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          font-weight: 700;
          color: #0f1c2e;
          line-height: 1.15;
          margin-bottom: 4px;
        }
        .pf-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          color: #3a8fa8;
          font-weight: 400;
          font-style: italic;
        }

        /* Divider */
        .pf-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,92,0.25), transparent);
          margin: 16px 0;
        }

        /* Tabs */
        .pf-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid rgba(201,168,92,0.15);
          margin-bottom: 18px;
        }
        .pf-tab {
          padding: 9px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #9ca3af;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.22s;
          margin-bottom: -1px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .pf-tab:hover { color: #0f1c2e; }
        .pf-tab.active {
          color: #8a6820;
          border-bottom-color: #c9a85c;
        }

        /* Tab content */
        .pf-tab-content { animation: tabFadeIn 0.25s ease; }
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Description */
        .pf-description {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          color: #4b5563;
          line-height: 1.75;
          margin-bottom: 16px;
        }

        /* Inclusion / Activity items */
        .pf-items-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }
        @media (max-width: 480px) { .pf-items-grid { grid-template-columns: 1fr; } }

        .pf-item {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 8px 10px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #f3f4f6;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: #374151;
          transition: background 0.2s;
        }
        .pf-item:hover { background: #f0fdf4; border-color: #bbf7d0; }
        .pf-item-icon { flex-shrink: 0; margin-top: 1px; }

        .pf-item-act {
          background: #fafaf9;
          border-color: #f0eee8;
        }
        .pf-item-act:hover { background: #fffbeb; border-color: #fde68a; }

        /* Extra dynamic fields */
        .pf-extra-field { margin-bottom: 12px; }
        .pf-extra-key {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .pf-extra-val {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #374151;
          line-height: 1.6;
        }

        /* Sticky CTA bar */
        .pf-cta-bar {
          padding: 16px 28px;
          background: #fff;
          border-top: 1px solid rgba(201,168,92,0.15);
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          flex-shrink: 0;
        }

        .pf-btn-primary {
          flex: 1; min-width: 130px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #0f2035 0%, #1a3050 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.02em;
        }
        .pf-btn-primary:hover {
          background: linear-gradient(135deg, #c9a85c, #b8893a);
          color: #0f1c2e;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201,168,92,0.35);
        }

        .pf-btn-query {
          flex: 1; min-width: 130px;
          padding: 11px 20px;
          background: transparent;
          color: #e07060;
          border: 1.5px solid #e07060;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .pf-btn-query:hover {
          background: #e07060;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(224,112,96,0.3);
        }

        .pf-btn-secondary {
          padding: 11px 20px;
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .pf-btn-secondary:hover { background: #e5e7eb; color: #374151; }

        /* Empty state */
        .pf-empty {
          background: #fff;
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          max-width: 380px; width: 100%;
          box-shadow: 0 24px 60px rgba(8,13,24,0.3);
          font-family: 'DM Sans', sans-serif;
        }
        .pf-empty h3 { font-size: 1.2rem; color: #0f1c2e; }
        .pf-btn-close-empty {
          padding: 10px 28px;
          background: #f3f4f6;
          color: #374151;
          border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; cursor: pointer;
          transition: background 0.2s;
        }
        .pf-btn-close-empty:hover { background: #e5e7eb; }

        /* Mobile stacking */
        @media (max-width: 700px) {
          .pf-modal { flex-direction: column; max-height: 95vh; border-radius: 20px; }
          .pf-img-col { flex: 0 0 220px; }
          .pf-scroll { padding: 20px 20px 0; }
          .pf-cta-bar { padding: 14px 20px; }
        }
      `}</style>

      {/* Overlay — click outside to close */}
      <div className="pf-overlay" onClick={onClose}>
        <div className="pf-modal" onClick={(e) => e.stopPropagation()}>

          {/* ── LEFT: Image column ── */}
          {pkg.image && (
            <div className="pf-img-col">
              <img
                src={pkg.image}
                alt={pkg.title || "Package"}
                className={imgLoaded ? "loaded" : ""}
                onLoad={() => setImgLoaded(true)}
              />
              <div className="pf-img-gradient" />

              {/* Close */}
              <button className="pf-close" onClick={onClose} aria-label="Close">✕</button>

              {/* Badges */}
              {pkg.discount && <span className="pf-badge pf-badge-discount">🏷 {pkg.discount}</span>}
              {pkg.popular && <span className="pf-badge pf-badge-popular">⭐ Popular</span>}

              {/* Bottom info */}
              <div className="pf-img-bottom">
                {/* Rating */}
                {pkg.rating && (
                  <div className="pf-rating-row">
                    <div className="pf-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`pf-star ${s <= Math.floor(pkg.rating) ? "filled" : "empty"}`}>★</span>
                      ))}
                    </div>
                    <span className="pf-rating-val">{pkg.rating} / 5</span>
                  </div>
                )}

                {/* Price */}
                {pkg.price && (
                  <div className="pf-price-block">
                    <span className="pf-price">{pkg.price}</span>
                    {pkg.originalPrice && <span className="pf-orig-price">{pkg.originalPrice}</span>}
                    {savingsPct && <span className="pf-save-tag">Save {savingsPct}%</span>}
                  </div>
                )}

                {/* Location */}
                {pkg.location && (
                  <span className="pf-img-location">📍 {pkg.location}</span>
                )}
              </div>
            </div>
          )}

          {/* ── RIGHT: Content column ── */}
          <div className="pf-content-col">
            <div className="pf-scroll">
              {/* Header */}
              <div className="pf-header">
                <div className="pf-meta-row">
                  {pkg.category && <span className="pf-chip pf-chip-cat">✦ {pkg.category}</span>}
                  {pkg.duration && <span className="pf-chip pf-chip-dur">⏱ {pkg.duration}</span>}
                </div>
                <h2 className="pf-title">{pkg.title || pkg.name || "Untitled"}</h2>
                {pkg.tagline && <p className="pf-tagline">"{pkg.tagline}"</p>}
              </div>

              <div className="pf-divider" />

              {/* Tabs */}
              {tabs.length > 1 && (
                <div className="pf-tabs">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      className={`pf-tab ${activeTab === t.key ? "active" : ""}`}
                      onClick={() => setActiveTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Tab: Overview ── */}
              {activeTab === "overview" && (
                <div className="pf-tab-content">
                  {pkg.description && (
                    <p className="pf-description">{pkg.description}</p>
                  )}

                  {/* Dynamic extra fields */}
                  {Object.entries(pkg)
                    .filter(([k, v]) => !excludedKeys.includes(k) && v != null)
                    .map(([k, v], i) => (
                      <div key={i} className="pf-extra-field">
                        <p className="pf-extra-key">{k.replace(/_/g, " ")}</p>
                        {Array.isArray(v) ? (
                          <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                            {v.map((item, j) => (
                              <li key={j} className="pf-extra-val">{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="pf-extra-val">{v}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* ── Tab: Inclusions ── */}
              {activeTab === "inclusions" && pkg.inclusions?.length > 0 && (
                <div className="pf-tab-content">
                  <div className="pf-items-grid">
                    {pkg.inclusions.map((item, i) => (
                      <div key={i} className="pf-item">
                        <span className="pf-item-icon" style={{ color: "#22c55e" }}>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tab: Activities / Highlights ── */}
              {activeTab === "activities" && (
                <div className="pf-tab-content">
                  {pkg.highlights?.length > 0 && (
                    <>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "10px" }}>
                        Highlights
                      </p>
                      <div className="pf-items-grid" style={{ marginBottom: "18px" }}>
                        {pkg.highlights.map((item, i) => (
                          <div key={i} className="pf-item pf-item-act">
                            <span className="pf-item-icon" style={{ color: "#3a8fa8" }}>✦</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {pkg.activities?.length > 0 && (
                    <>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "10px" }}>
                        Activities
                      </p>
                      <div className="pf-items-grid">
                        {pkg.activities.map((item, i) => (
                          <div key={i} className="pf-item pf-item-act">
                            <span className="pf-item-icon" style={{ color: "#c9a85c" }}>◈</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bottom padding for scroll */}
              <div style={{ height: "20px" }} />
            </div>

            {/* ── Sticky CTA bar ── */}
            <div className="pf-cta-bar">
              {buttons.length > 0 ? (
                buttons.map((btn, i) => (
                  <button
                    key={i}
                    className={btn.type === "getQuery" ? "pf-btn-query" : "pf-btn-primary"}
                    onClick={() => {
                      if (btn.onClick) btn.onClick(pkg);
                      else if (btn.type === "getQuery") handleGetQuery(pkg);
                      else if (btn.type === "callMe") window.location.href = `tel:${btn.number || "1234567890"}`;
                    }}
                  >
                    {btn.label || "Action"}
                  </button>
                ))
              ) : (
                <>
                  <button className="pf-btn-primary" onClick={() => handleGetQuery(pkg)}>
                    💬 Get a Quote
                  </button>
                  <button
                    className="pf-btn-query"
                    onClick={() => {
                      const wa = `https://wa.me/918700750589?text=${encodeURIComponent(`Hi! I'm interested in: ${pkg.title}\nLocation: ${pkg.location}\nDuration: ${pkg.duration}\nPrice: ${pkg.price}`)}`;
                      window.open(wa, "_blank");
                    }}
                  >
                    📲 WhatsApp
                  </button>
                  <button className="pf-btn-secondary" onClick={onClose}>Close</button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PopUpFeature;