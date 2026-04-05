"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { features } from "./featureModel";

// ─── Theme accent map aligned to #0f6477 brand ───────────────────────────────
const accentMap = {
  blue: {
    bg:     "rgba(15,100,119,0.10)",
    border: "rgba(15,100,119,0.30)",
    icon:   "linear-gradient(135deg,#0f6477,#1a8fa6)",
    glow:   "rgba(15,100,119,0.35)",
    tag:    "rgba(15,100,119,0.15)",
    tagTxt: "#7ecad8",
  },
  purple: {
    bg:     "rgba(124,58,237,0.10)",
    border: "rgba(124,58,237,0.28)",
    icon:   "linear-gradient(135deg,#7c3aed,#a78bfa)",
    glow:   "rgba(124,58,237,0.32)",
    tag:    "rgba(124,58,237,0.12)",
    tagTxt: "#c4b5fd",
  },
  green: {
    bg:     "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.28)",
    icon:   "linear-gradient(135deg,#059669,#34d399)",
    glow:   "rgba(16,185,129,0.30)",
    tag:    "rgba(16,185,129,0.12)",
    tagTxt: "#6ee7b7",
  },
  orange: {
    bg:     "rgba(234,88,12,0.10)",
    border: "rgba(234,88,12,0.25)",
    icon:   "linear-gradient(135deg,#ea580c,#fb923c)",
    glow:   "rgba(234,88,12,0.28)",
    tag:    "rgba(234,88,12,0.12)",
    tagTxt: "#fdba74",
  },
  cyan: {
    bg:     "rgba(6,182,212,0.10)",
    border: "rgba(6,182,212,0.25)",
    icon:   "linear-gradient(135deg,#0891b2,#22d3ee)",
    glow:   "rgba(6,182,212,0.28)",
    tag:    "rgba(6,182,212,0.12)",
    tagTxt: "#67e8f9",
  },
  indigo: {
    bg:     "rgba(99,102,241,0.10)",
    border: "rgba(99,102,241,0.25)",
    icon:   "linear-gradient(135deg,#4f46e5,#818cf8)",
    glow:   "rgba(99,102,241,0.28)",
    tag:    "rgba(99,102,241,0.12)",
    tagTxt: "#a5b4fc",
  },
};

// ─── Single Feature Card ──────────────────────────────────────────────────────
function FeatureCard({ feature, isDragging }) {
  const a = accentMap[feature.color] || accentMap.blue;

  return (
    <div
      className="relative h-full rounded-2xl overflow-hidden group"
      style={{
        background: "linear-gradient(160deg,#ffffff 0%,#f0fafb 100%)",
        border: `1px solid ${a.border}`,
        boxShadow: "0 4px 24px rgba(15,100,119,0.07)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        if (isDragging) return;
        e.currentTarget.style.transform = "translateY(-6px) scale(1.015)";
        e.currentTarget.style.boxShadow = `0 20px 56px ${a.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(15,100,119,0.07)";
      }}
    >
      {/* Subtle bg wash */}
      <div
        className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
        style={{ background: a.bg }}
      />
      {/* Dot grid decoration */}
      <div
        className="absolute top-3 right-3 opacity-15 pointer-events-none"
        style={{
          width: 52, height: 52,
          backgroundImage: "radial-gradient(circle, #0f6477 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />

      {/* ── Card Body ── */}
      <div className="relative z-10 p-6 flex flex-col flex-1">

        {/* Top row: icon + highlight stat */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex items-center justify-center text-2xl rounded-2xl flex-shrink-0"
            style={{
              width: 52, height: 52,
              background: a.icon,
              boxShadow: `0 6px 18px ${a.glow}`,
            }}
          >
            {feature.icon}
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: a.tag,
              border: `1px solid ${a.border}`,
              color: "#0f6477",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {feature.highlight}
          </div>
        </div>

        {/* Region + stat */}
        <div className="mb-1 flex items-center gap-2">
          <h3
            className="font-black leading-tight"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: "1.05rem",
              color: "#0a3d4d",
            }}
          >
            {feature.region}
          </h3>
        </div>
        <p
          className="text-xs font-semibold mb-1"
          style={{ color: "#0f6477", letterSpacing: "0.04em" }}
        >
          {feature.stat}
        </p>

        {/* Tagline */}
        <p
          className="text-xs mb-3 font-medium"
          style={{ color: "#64748b", lineHeight: 1.5 }}
        >
          {feature.tagline}
        </p>

        {/* Description */}
        <p
          className="text-xs mb-4 flex-1"
          style={{
            fontFamily: "Georgia, serif",
            color: "#6b7280",
            lineHeight: 1.7,
          }}
        >
          {feature.description}
        </p>

        {/* Top Picks chips */}
        <div className="mb-3">
          <p
            className="text-xs font-bold mb-2 uppercase tracking-widest"
            style={{ color: "#94a3b8", fontSize: "0.6rem" }}
          >
            ✦ Top Picks
          </p>
          <div className="flex flex-wrap gap-1.5">
            {feature.topPicks.slice(0, 4).map((pick, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2 py-1 rounded-lg"
                style={{
                  background: a.tag,
                  border: `1px solid ${a.border}`,
                  color: a.tagTxt,
                  fontSize: "0.68rem",
                }}
              >
                {pick}
              </span>
            ))}
            {feature.topPicks.length > 4 && (
              <span
                className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(15,100,119,0.08)",
                  border: "1px solid rgba(15,100,119,0.2)",
                  color: "#0f6477",
                  fontSize: "0.68rem",
                }}
              >
                +{feature.topPicks.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Tourism types */}
        <div className="mb-4">
          <p
            className="text-xs font-bold mb-2 uppercase tracking-widest"
            style={{ color: "#94a3b8", fontSize: "0.6rem" }}
          >
            🎯 Tourism Types
          </p>
          <div className="flex flex-wrap gap-1.5">
            {feature.tourismTypes.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "rgba(15,100,119,0.07)",
                  border: "1px solid rgba(15,100,119,0.18)",
                  color: "#4a9aab",
                  fontSize: "0.67rem",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Best Time + animated underline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>🗓️</span>
            <span
              className="text-xs font-semibold"
              style={{ color: "#64748b", fontSize: "0.68rem" }}
            >
              Best: {feature.bestTime}
            </span>
          </div>
          {/* Animated underline accent */}
          <div
            className="h-0.5 rounded-full transition-all duration-500 group-hover:w-12"
            style={{ background: a.icon, width: "28px" }}
          />
        </div>

      </div>
    </div>
  );
}

// ─── Infinite Slider ──────────────────────────────────────────────────────────
export default function InfiniteSlider() {
  const trackRef      = useRef(null);
  const animRef       = useRef(null);
  const posRef        = useRef(0);
  const targetRef     = useRef(0);
  const dragging      = useRef(false);
  const dragStartX    = useRef(0);
  const dragStartPos  = useRef(0);

  const [cardWidth, setCardWidth] = useState(0);
  const [paused,    setPaused]    = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const GAP      = 20;
  const total    = features.length;
  const extended = [...features, ...features, ...features];

  /* ── measure card width ── */
  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.querySelector(".sl-card");
      if (first) setCardWidth(first.offsetWidth + GAP);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* ── loop clamp ── */
  const clamp = useCallback((pos) => {
    if (!cardWidth) return pos;
    const loop = cardWidth * total;
    while (pos < -2 * loop) pos += loop;
    while (pos > 0)          pos -= loop;
    return pos;
  }, [cardWidth, total]);

  /* ── animation tick ── */
  useEffect(() => {
    if (!cardWidth) return;
    const tick = () => {
      if (!paused && !dragging.current) {
        targetRef.current -= 0.5;
        targetRef.current = clamp(targetRef.current);
      }
      posRef.current += (targetRef.current - posRef.current) * 0.11;
      if (trackRef.current)
        trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      setActiveIdx(Math.round(Math.abs(posRef.current) / cardWidth) % total);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [cardWidth, paused, clamp, total]);

  /* ── button control ── */
  const slideBy = (dir) => {
    setPaused(true);
    targetRef.current = clamp(targetRef.current + dir * cardWidth);
    setTimeout(() => setPaused(false), 3000);
  };

  /* ── drag ── */
  const onDragStart = (x) => {
    dragging.current   = true;
    dragStartX.current = x;
    dragStartPos.current = targetRef.current;
    setPaused(true);
  };
  const onDragMove = (x) => {
    if (!dragging.current) return;
    targetRef.current = clamp(dragStartPos.current + (x - dragStartX.current));
  };
  const onDragEnd = () => {
    if (!dragging.current) return;
    dragging.current  = false;
    targetRef.current = clamp(Math.round(targetRef.current / cardWidth) * cardWidth);
    setTimeout(() => setPaused(false), 3000);
  };

  return (
    <>
      <style>{`
        .sl-track-wrap {
          overflow: hidden;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          position: relative;
        }
        .sl-track-wrap:active { cursor: grabbing; }

        /* fade edge masks */
        .sl-mask-l, .sl-mask-r {
          pointer-events: none;
          position: absolute;
          top: 0; bottom: 0;
          width: 80px;
          z-index: 10;
        }
        @media (min-width: 768px) {
          .sl-mask-l, .sl-mask-r { width: 120px; }
        }
        .sl-mask-l { left: 0;  background: linear-gradient(to right, #f0fafb, transparent); }
        .sl-mask-r { right: 0; background: linear-gradient(to left,  #f0fafb, transparent); }

        /* card sizing — responsive */
        .sl-card {
          flex-shrink: 0;
          width: clamp(240px, 78vw, 280px);
          align-self: stretch;
        }
        @media (min-width: 480px) {
          .sl-card { width: clamp(260px, 45vw, 300px); }
        }
        @media (min-width: 768px) {
          .sl-card { width: clamp(280px, 28vw, 320px); }
        }

        /* nav button */
        .sl-nav-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          border: 1.5px solid rgba(15,100,119,0.22);
          box-shadow: 0 4px 16px rgba(15,100,119,0.1);
          color: #0f6477;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .sl-nav-btn { width: 46px; height: 46px; }
        }
        .sl-nav-btn:hover {
          background: #0f6477;
          color: #fff;
          transform: scale(1.1);
          box-shadow: 0 6px 22px rgba(15,100,119,0.35);
          border-color: #0f6477;
        }

        /* dot */
        .sl-dot {
          height: 8px;
          border-radius: 9999px;
          background: rgba(15,100,119,0.2);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .sl-dot.active {
          background: #0f6477;
          box-shadow: 0 0 8px rgba(15,100,119,0.5);
        }

        /* pause hint */
        .sl-pause-hint {
          text-align: center;
          margin-top: 8px;
          height: 18px;
          font-size: 11px;
          font-family: Georgia, serif;
          letter-spacing: 0.05em;
          color: rgba(15,100,119,0.45);
          transition: opacity 0.4s ease;
        }
      `}</style>

      <div className="w-full" style={{ userSelect: "none" }}>

        {/* ── Track ── */}
        <div
          className="sl-track-wrap"
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseMove={(e) => onDragMove(e.clientX)}
          onMouseUp={onDragEnd}
          onMouseLeave={() => dragging.current && onDragEnd()}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => { e.preventDefault(); onDragMove(e.touches[0].clientX); }}
          onTouchEnd={onDragEnd}
        >
          {/* Edge fade masks */}
          <div className="sl-mask-l" />
          <div className="sl-mask-r" />

          {/* Track */}
          <div
            ref={trackRef}
            className="flex items-stretch"
            style={{
              willChange: "transform",
              gap: `${GAP}px`,
              padding: "20px 8px",
            }}
          >
            {extended.map((feature, i) => (
              <div key={`${feature.id}-${i}`} className="sl-card">
                <FeatureCard feature={feature} isDragging={dragging.current} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Controls ── */}
        <div
          className="flex items-center justify-center mt-4"
          style={{ gap: "14px" }}
        >
          {/* Prev */}
          <button
            className="sl-nav-btn"
            onClick={() => slideBy(1)}
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center" style={{ gap: 6 }}>
            {features.map((_, i) => (
              <button
                key={i}
                className={`sl-dot${activeIdx === i ? " active" : ""}`}
                style={{ width: activeIdx === i ? 24 : 8 }}
                onClick={() => {
                  setPaused(true);
                  const cur = Math.round(Math.abs(targetRef.current) / cardWidth) % total;
                  targetRef.current = clamp(targetRef.current - (i - cur) * cardWidth);
                  setTimeout(() => setPaused(false), 3000);
                }}
                aria-label={`Go to ${features[i].region}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            className="sl-nav-btn"
            onClick={() => slideBy(-1)}
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Pause hint */}
        <div
          className="sl-pause-hint"
          style={{ opacity: paused ? 1 : 0 }}
        >
          Auto-scroll paused · resumes in 3s
        </div>

      </div>
    </>
  );
}