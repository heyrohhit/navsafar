"use client";
import { useState, useEffect } from "react";
import { categories } from "../models/objAll/experienc";
import Link from "next/link";

// ─── WhatsApp Query Submit ────────────────────────────────────────────────────
function buildWhatsAppUrl(data) {
  const msg = [
    `✈️ *Travel Recommendation Request*`,
    ``,
    `👤 *Name:* ${data.name}`,
    `📧 *Email:* ${data.email}`,
    `📞 *Phone:* ${data.phone}`,
    ``,
    `🗺️ *Destination:* ${data.destination || "Flexible"}`,
    `📅 *Travel Date:* ${data.travelDate || "Not decided"}`,
    `💰 *Budget:* ${data.budget || "To be discussed"}`,
    `👥 *Travelers:* ${data.travelers || "Not specified"}`,
    `📝 *Message:* ${data.message || "Please suggest best packages"}`,
    ``,
    `_Please provide personalised recommendations!_`,
  ].join("\n");
  return `https://wa.me/918700750589?text=${encodeURIComponent(msg)}`;
}

const EMPTY_FORM = {
  name: "", email: "", phone: "",
  destination: "", travelDate: "",
  budget: "", travelers: "", message: "",
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ExperienceCategories = () => {
  const [isLoaded,       setIsLoaded]       = useState(false);
  const [showForm,       setShowForm]       = useState(false);
  const [formData,       setFormData]       = useState(EMPTY_FORM);
  const [hoveredId,      setHoveredId]      = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 350);
    return () => clearTimeout(t);
  }, []);

  const handleField = (key, val) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(buildWhatsAppUrl(formData), "_blank");
    setFormData(EMPTY_FORM);
    setShowForm(false);
  };

  return (
    <>
      {/* ── Scoped CSS ───────────────────────────────────────────────────── */}
      <style>{`
        /* ── Section ── */
        .ec-section {
          padding: 80px 16px;
          background: linear-gradient(180deg, #f0fafb 0%, #e8f5f7 100%);
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        @media (min-width: 640px)  { .ec-section { padding: 80px 24px; } }
        @media (min-width: 1024px) { .ec-section { padding: 100px 32px; } }

        .ec-inner { max-width: 1200px; margin: 0 auto; }

        /* ── Header ── */
        .ec-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(15,100,119,0.1);
          border: 1px solid rgba(15,100,119,0.25);
          margin-bottom: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #0f6477;
          letter-spacing: 0.04em;
        }
        .ec-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #0f6477;
          animation: ecPulse 2s infinite;
        }
        @keyframes ecPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.3); }
        }
        .ec-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          color: #0a2d36;
          line-height: 1.15;
          margin: 0 0 16px;
        }
        .ec-title-accent {
          display: block;
          background: linear-gradient(135deg, #0f6477 0%, #2db3cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ec-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: #5a7f87;
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── Grid ── */
        .ec-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 52px;
        }

        /* ── Card ── */
        .ec-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 22px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(15,100,119,0.12);
          box-shadow: 0 4px 24px rgba(15,100,119,0.07);
          transition: transform 0.28s ease, box-shadow 0.28s ease;
          text-decoration: none;
          color: inherit;
        }
        .ec-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(15,100,119,0.14);
          border-color: rgba(15,100,119,0.28);
        }
        /* tablet: horizontal layout */
        @media (min-width: 600px) {
          .ec-card {
            flex-direction: row;
            min-height: 148px;
          }
        }

        /* ── Card Left (icon panel) ── */
        .ec-card-left {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
          gap: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }
        /* mobile: full width strip */
        .ec-card-left {
          width: 100%;
          min-height: 110px;
        }
        @media (min-width: 600px) {
          .ec-card-left {
            width: 200px;
            min-height: unset;
          }
        }
        @media (min-width: 900px) {
          .ec-card-left { width: 230px; }
        }

        /* decoration circles */
        .ec-deco-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          pointer-events: none;
        }

        .ec-card-icon {
          font-size: 2.2rem;
          line-height: 1;
          z-index: 1;
          transition: transform 0.3s ease;
        }
        .ec-card:hover .ec-card-icon { transform: scale(1.15) rotate(-4deg); }

        .ec-card-name {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          z-index: 1;
          text-align: center;
          letter-spacing: 0.01em;
        }
        .ec-card-desc {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.85);
          text-align: center;
          z-index: 1;
          line-height: 1.4;
          max-width: 180px;
        }

        /* ── Card Right (content) ── */
        .ec-card-right {
          flex: 1;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          min-width: 0;
        }
        @media (min-width: 600px) {
          .ec-card-right { padding: 16px 24px; }
        }

        /* Top row */
        .ec-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .ec-cat-badge {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          background: rgba(15,100,119,0.1);
          border: 1px solid rgba(15,100,119,0.22);
          color: #0f6477;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ec-pkg-count {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
          background: rgba(15,100,119,0.08);
          border: 1px solid rgba(15,100,119,0.18);
          color: #0f6477;
          white-space: nowrap;
        }

        /* Feature grid */
        .ec-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px 14px;
        }
        @media (min-width: 900px) {
          .ec-features { grid-template-columns: repeat(3, 1fr); }
        }
        .ec-feature-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #4a7a85;
        }
        .ec-check {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: rgba(15,100,119,0.12);
          border: 1.5px solid rgba(15,100,119,0.3);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: 0.55rem;
          color: #0f6477;
          font-weight: 900;
        }

        /* Bottom row: types + best time */
        .ec-card-bottom {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }
        .ec-type-chip {
          font-size: 0.65rem;
          padding: 3px 9px;
          border-radius: 100px;
          background: rgba(15,100,119,0.07);
          border: 1px solid rgba(15,100,119,0.15);
          color: #2d8fa3;
          font-weight: 500;
        }
        .ec-time-chip {
          font-size: 0.65rem;
          padding: 3px 9px;
          border-radius: 100px;
          background: rgba(234,88,12,0.07);
          border: 1px solid rgba(234,88,12,0.2);
          color: #c2410c;
          font-weight: 600;
          display: flex; align-items: center; gap: 4px;
          margin-left: auto;
        }

        /* Arrow icon */
        .ec-arrow {
          position: absolute;
          bottom: 16px; right: 16px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(15,100,119,0.08);
          border: 1.5px solid rgba(15,100,119,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #0f6477;
          font-size: 0.85rem;
          transition: all 0.25s ease;
        }
        .ec-card:hover .ec-arrow {
          background: #0f6477;
          color: #fff;
          border-color: #0f6477;
          transform: translateX(3px);
        }

        /* ── CTA Banner ── */
        .ec-cta {
          margin-top: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px 24px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(15,100,119,0.07) 0%, rgba(15,100,119,0.12) 100%);
          border: 1px solid rgba(15,100,119,0.2);
          text-align: center;
        }
        @media (min-width: 640px) {
          .ec-cta {
            flex-direction: row;
            text-align: left;
            justify-content: space-between;
            gap: 24px;
          }
        }
        .ec-cta-text {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0a2d36;
        }
        .ec-cta-sub {
          font-size: 0.82rem;
          color: #5a7f87;
          margin-top: 4px;
        }
        .ec-cta-btn {
          padding: 13px 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0f6477 0%, #1a8fa6 100%);
          color: #fff;
          font-weight: 800;
          font-size: 0.88rem;
          border: none;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 6px 22px rgba(15,100,119,0.35);
          white-space: nowrap;
          flex-shrink: 0;
          font-family: inherit;
        }
        .ec-cta-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 10px 32px rgba(15,100,119,0.45);
        }

        /* ── Modal Overlay ── */
        .ec-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
          animation: ecFadeIn 0.2s ease;
        }
        @media (min-width: 640px) {
          .ec-overlay {
            align-items: center;
            padding: 16px;
          }
        }
        @keyframes ecFadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── Modal Shell ── */
        .ec-modal {
          width: 100%;
          max-width: 620px;
          border-radius: 24px 24px 0 0;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          max-height: 96dvh;
          display: flex;
          flex-direction: column;
          animation: ecSlideUp 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        @media (min-width: 640px) {
          .ec-modal {
            border-radius: 24px;
            animation: ecPopIn 0.28s ease;
          }
        }
        @keyframes ecSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes ecPopIn {
          from { transform: scale(0.96); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }

        /* Drag handle (mobile) */
        .ec-handle {
          display: flex;
          justify-content: center;
          padding: 10px 0 0;
          background: #fff;
        }
        .ec-handle-bar {
          width: 40px; height: 4px;
          border-radius: 100px;
          background: rgba(15,100,119,0.2);
        }
        @media (min-width: 640px) { .ec-handle { display: none; } }

        /* Modal header */
        .ec-modal-head {
          padding: 20px 24px 16px;
          background: linear-gradient(135deg, #0f6477 0%, #1a8fa6 100%);
          position: relative;
          flex-shrink: 0;
        }
        .ec-modal-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 4px;
        }
        .ec-modal-sub {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }
        .ec-modal-close {
          position: absolute;
          top: 18px; right: 18px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          color: #fff;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          font-family: inherit;
        }
        .ec-modal-close:hover { background: rgba(255,255,255,0.35); }

        /* Form body */
        .ec-form-body {
          overflow-y: auto;
          padding: 20px 24px 24px;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(15,100,119,0.3) transparent;
        }
        .ec-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 480px) {
          .ec-form-grid { grid-template-columns: 1fr 1fr; }
        }
        .ec-form-full { grid-column: 1 / -1; }

        .ec-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #0a2d36;
          margin-bottom: 6px;
          letter-spacing: 0.03em;
        }
        .ec-input, .ec-select, .ec-textarea {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid rgba(15,100,119,0.2);
          background: rgba(15,100,119,0.03);
          font-size: 0.83rem;
          color: #0a2d36;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .ec-input:focus, .ec-select:focus, .ec-textarea:focus {
          border-color: #0f6477;
          box-shadow: 0 0 0 3px rgba(15,100,119,0.12);
        }
        .ec-textarea { resize: none; }

        /* Form buttons */
        .ec-form-btns {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }
        .ec-submit-btn {
          flex: 1;
          padding: 12px 20px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0f6477, #1a8fa6);
          color: #fff;
          font-weight: 800;
          font-size: 0.88rem;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(15,100,119,0.35);
        }
        .ec-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(15,100,119,0.45);
        }
        .ec-cancel-btn {
          padding: 12px 20px;
          border-radius: 14px;
          background: rgba(15,100,119,0.08);
          border: 1.5px solid rgba(15,100,119,0.2);
          color: #0f6477;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .ec-cancel-btn:hover { background: rgba(15,100,119,0.14); }

        /* Fade-in animation for cards */
        .ec-fade {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .ec-fade.ec-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <section className="ec-section">
        <div className="ec-inner">

          {/* ── Header ───────────────────────────────────────────────── */}
          <div style={{ textAlign: "center" }}>
            <div
              className="ec-badge ec-fade"
              style={{
                opacity:   isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <span className="ec-badge-dot" />
              Experience Categories
            </div>

            <h2
              className="ec-title ec-fade"
              style={{
                opacity:   isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease",
              }}
            >
              Choose Your
              <span className="ec-title-accent">Travel Style</span>
            </h2>

            <p
              className="ec-subtitle"
              style={{
                opacity:   isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s 0.2s ease, transform 0.6s 0.2s ease",
              }}
            >
              50 destinations · 12 travel styles · 1 promise — the perfect trip for you
            </p>
          </div>

          {/* ── Categories List ───────────────────────────────────────── */}
          <div className="ec-grid">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/experiences/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="ec-card"
                style={{
                  opacity:   isLoaded ? 1 : 0,
                  transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.55s ${0.05 * idx + 0.25}s ease, transform 0.55s ${0.05 * idx + 0.25}s ease`,
                  textDecoration: "none",
                }}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* ── Left gradient panel ── */}
                <div
                  className={`ec-card-left bg-gradient-to-br ${cat.gradient}`}
                >
                  {/* Deco circles */}
                  <div className="ec-deco-circle" style={{ width:70, height:70, top:-16, right:-16 }} />
                  <div className="ec-deco-circle" style={{ width:44, height:44, bottom:10, left:-12 }} />
                  <div className="ec-deco-circle" style={{ width:28, height:28, top:"35%", left:"20%" }} />

                  <span className="ec-card-icon">{cat.icon}</span>
                  <span className="ec-card-name">{cat.name}</span>
                  <span className="ec-card-desc">{cat.description}</span>
                </div>

                {/* ── Right content panel ── */}
                <div className="ec-card-right">

                  {/* Top row */}
                  <div className="ec-card-top">
                    <span className="ec-cat-badge">{cat.badge}</span>
                    <span className="ec-pkg-count">{cat.packageCount}+ Packages</span>
                  </div>

                  {/* Features grid */}
                  <div className="ec-features">
                    {cat.features.slice(0, 6).map((f, i) => (
                      <div key={i} className="ec-feature-item">
                        <span className="ec-check">✓</span>
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Bottom: types + best time */}
                  <div className="ec-card-bottom">
                    {cat.tourismTypes.slice(0, 3).map((t, i) => (
                      <span key={i} className="ec-type-chip">{t}</span>
                    ))}
                    <span className="ec-time-chip">
                      🗓️ {cat.bestTime}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="ec-arrow">→</div>

                </div>
              </Link>
            ))}
          </div>

          {/* ── CTA Banner ───────────────────────────────────────────── */}
          <div
            className="ec-cta"
            style={{
              opacity:   isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s 1s ease, transform 0.6s 1s ease",
            }}
          >
            <div>
              <p className="ec-cta-text">Can't decide your perfect trip?</p>
              <p className="ec-cta-sub">
                Tell us your budget & preferences — we'll craft a custom package just for you.
              </p>
            </div>
            <button className="ec-cta-btn" onClick={() => setShowForm(true)}>
              💬 Get Recommendations
            </button>
          </div>

        </div>
      </section>

      {/* ── Query Form Modal ─────────────────────────────────────────────── */}
      {showForm && (
        <div className="ec-overlay" onClick={(e) => e.target.classList.contains("ec-overlay") && setShowForm(false)}>
          <div className="ec-modal">

            {/* Drag handle */}
            <div className="ec-handle">
              <div className="ec-handle-bar" />
            </div>

            {/* Header */}
            <div className="ec-modal-head">
              <h3 className="ec-modal-title">Get Personalised Recommendations</h3>
              <p className="ec-modal-sub">
                Share your dream trip details — we'll suggest the best packages!
              </p>
              <button className="ec-modal-close" onClick={() => setShowForm(false)} aria-label="Close">✕</button>
            </div>

            {/* Form */}
            <div className="ec-form-body">
              <form onSubmit={handleSubmit}>
                <div className="ec-form-grid">

                  <div>
                    <label className="ec-label">Your Name *</label>
                    <input
                      type="text" required
                      className="ec-input"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleField("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="ec-label">Email Address *</label>
                    <input
                      type="email" required
                      className="ec-input"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleField("email", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="ec-label">Phone Number *</label>
                    <input
                      type="tel" required
                      className="ec-input"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleField("phone", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="ec-label">Preferred Destination</label>
                    <input
                      type="text"
                      className="ec-input"
                      placeholder="Paris, Bali, Goa…"
                      value={formData.destination}
                      onChange={(e) => handleField("destination", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="ec-label">Travel Date</label>
                    <input
                      type="date"
                      className="ec-input"
                      value={formData.travelDate}
                      onChange={(e) => handleField("travelDate", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="ec-label">Budget Range</label>
                    <select
                      className="ec-select"
                      value={formData.budget}
                      onChange={(e) => handleField("budget", e.target.value)}
                    >
                      <option value="">Select Budget</option>
                      <option>Under ₹50,000</option>
                      <option>₹50,000 – ₹1,00,000</option>
                      <option>₹1,00,000 – ₹1,50,000</option>
                      <option>₹1,50,000+</option>
                      <option>To be discussed</option>
                    </select>
                  </div>

                  <div>
                    <label className="ec-label">Number of Travellers</label>
                    <select
                      className="ec-select"
                      value={formData.travelers}
                      onChange={(e) => handleField("travelers", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="1">Solo Traveller</option>
                      <option value="2">Couple</option>
                      <option value="3-4">Small Group (3–4)</option>
                      <option value="5-8">Medium Group (5–8)</option>
                      <option value="9+">Large Group (9+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="ec-label">Travel Category</label>
                    <select
                      className="ec-select"
                      value={formData.category}
                      onChange={(e) => handleField("category", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="ec-form-full">
                    <label className="ec-label">Additional Message</label>
                    <textarea
                      rows={3}
                      className="ec-textarea"
                      placeholder="Tell us more about your preferences, must-see places, special requirements…"
                      value={formData.message}
                      onChange={(e) => handleField("message", e.target.value)}
                    />
                  </div>

                </div>

                <div className="ec-form-btns">
                  <button type="submit" className="ec-submit-btn">
                    📲 Send via WhatsApp
                  </button>
                  <button
                    type="button"
                    className="ec-cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ExperienceCategories;