"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { features } from "./featureModel"

const accentMap = {
  blue: { bg: "rgba(14,165,233,0.12)", border: "rgba(14,165,233,0.25)", icon: "linear-gradient(135deg,#0ea5e9,#38bdf8)", glow: "rgba(14,165,233,0.3)" },
  purple: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)", icon: "linear-gradient(135deg,#a855f7,#c084fc)", glow: "rgba(168,85,247,0.3)" },
  green: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.25)", icon: "linear-gradient(135deg,#22c55e,#4ade80)", glow: "rgba(34,197,94,0.3)" },
  orange: { bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)", icon: "linear-gradient(135deg,#f97316,#fb923c)", glow: "rgba(249,115,22,0.3)" },
  cyan: { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.25)", icon: "linear-gradient(135deg,#06b6d4,#22d3ee)", glow: "rgba(6,182,212,0.3)" },
  indigo: { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", icon: "linear-gradient(135deg,#6366f1,#818cf8)", glow: "rgba(99,102,241,0.3)" },
};

export default function InfiniteSlider() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);

  const [cardWidth, setCardWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const GAP = 24;
  const total = features.length;
  const extended = [...features, ...features, ...features];

  /* ── measure ── */
  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.querySelector(".card");
      if (first) setCardWidth(first.offsetWidth + GAP);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* ── clamp to loop ── */
  const clamp = useCallback((pos) => {
    if (!cardWidth) return pos;
    const loop = cardWidth * total;
    while (pos < -2 * loop) pos += loop;
    while (pos > 0) pos -= loop;
    return pos;
  }, [cardWidth, total]);

  /* ── animation tick ── */
  useEffect(() => {
    if (!cardWidth) return;
    const tick = () => {
      if (!paused && !dragging.current) {
        targetRef.current -= 0.55;
        targetRef.current = clamp(targetRef.current);
      }
      posRef.current += (targetRef.current - posRef.current) * 0.12;
      if (trackRef.current)
        trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      const raw = Math.round(Math.abs(posRef.current) / cardWidth) % total;
      setActiveIdx(raw);
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

  /* ── drag handlers ── */
  const onDragStart = (clientX) => {
    dragging.current = true;
    dragStartX.current = clientX;
    dragStartPos.current = targetRef.current;
    setPaused(true);
  };
  const onDragMove = (clientX) => {
    if (!dragging.current) return;
    targetRef.current = clamp(dragStartPos.current + (clientX - dragStartX.current));
  };
  const onDragEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    targetRef.current = clamp(Math.round(targetRef.current / cardWidth) * cardWidth);
    setTimeout(() => setPaused(false), 3000);
  };

  return (
    <div className="w-full select-none">

      {/* ── Track ── */}
      <div
        className="relative overflow-hidden"
        style={{ cursor: dragging.current ? "grabbing" : "grab" }}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={() => { if (dragging.current) onDragEnd(); }}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
      >
        {/* fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
          style={{ background: "linear-gradient(to right, #f0f9fc, transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
          style={{ background: "linear-gradient(to left, #f0f9fc, transparent)" }} />

        <div ref={trackRef} className="flex"
          style={{ willChange: "transform", gap: `${GAP}px`, padding: "20px 0" }}>
          {extended.map((feature, i) => {
            const accent = accentMap[feature.color] || accentMap.blue;
            return (
              <div key={i} className="card flex-shrink-0" style={{ width: "clamp(260px, 28vw, 320px)" }}>
                <div
                  className="relative h-full rounded-2xl p-7 overflow-hidden group"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    border: `1px solid ${accent.border}`,
                    boxShadow: "0 4px 24px rgba(15,97,119,0.07)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!dragging.current) {
                      e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                      e.currentTarget.style.boxShadow = `0 16px 48px ${accent.glow}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(15,97,119,0.07)";
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity"
                    style={{ background: accent.bg }} />
                  <div className="absolute top-3 right-3 opacity-20" style={{
                    width: "48px", height: "48px",
                    backgroundImage: "radial-gradient(circle, #0F6177 1px, transparent 1px)",
                    backgroundSize: "8px 8px"
                  }} />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-5">
                      <div className="rounded-xl flex items-center justify-center text-2xl"
                        style={{ width: "52px", height: "52px", background: accent.icon, boxShadow: `0 4px 16px ${accent.glow}` }}>
                        {feature.icon}
                      </div>
                      <div className="px-3 py-1 rounded-full font-bold"
                        style={{ background: accent.bg, border: `1px solid ${accent.border}`, color: "#0F6177", fontFamily: "'Palatino Linotype', serif", fontSize: "15px" }}>
                        {feature.stats}
                      </div>
                    </div>

                    <h3 className="font-bold mb-2"
                      style={{ fontFamily: "'Palatino Linotype', Palatino, serif", fontSize: "18px", color: "#0a3d4d" }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "#6b7280", lineHeight: "1.65" }}>
                      {feature.description}
                    </p>
                    <div className="mt-5 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-20"
                      style={{ background: accent.icon }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-center gap-5 mt-5">

        {/* Prev */}
        <button
          onClick={() => slideBy(1)}
          aria-label="Previous"
          style={{
            width: "46px", height: "46px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            border: "1.5px solid rgba(15,97,119,0.22)",
            boxShadow: "0 4px 16px rgba(15,97,119,0.1)",
            color: "#0F6177",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s ease",
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0F6177";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.transform = "scale(1.12)";
            e.currentTarget.style.boxShadow = "0 6px 22px rgba(15,97,119,0.32)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.92)";
            e.currentTarget.style.color = "#0F6177";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,97,119,0.1)";
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setPaused(true);
                const cur = Math.round(Math.abs(targetRef.current) / cardWidth) % total;
                targetRef.current = clamp(targetRef.current - (i - cur) * cardWidth);
                setTimeout(() => setPaused(false), 3000);
              }}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: activeIdx === i ? "26px" : "8px",
                height: "8px",
                borderRadius: "9999px",
                background: activeIdx === i ? "#0F6177" : "rgba(15,97,119,0.22)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => slideBy(-1)}
          aria-label="Next"
          style={{
            width: "46px", height: "46px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            border: "1.5px solid rgba(15,97,119,0.22)",
            boxShadow: "0 4px 16px rgba(15,97,119,0.1)",
            color: "#0F6177",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s ease",
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0F6177";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.transform = "scale(1.12)";
            e.currentTarget.style.boxShadow = "0 6px 22px rgba(15,97,119,0.32)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.92)";
            e.currentTarget.style.color = "#0F6177";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,97,119,0.1)";
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* pause hint */}
      <div style={{
        textAlign: "center", marginTop: "10px",
        height: "18px",
        opacity: paused ? 1 : 0,
        transition: "opacity 0.4s ease"
      }}>
        <span style={{ color: "rgba(15,97,119,0.4)", fontSize: "12px", fontFamily: "Georgia, serif", letterSpacing: "0.05em" }}>
          Auto-scroll paused · resumes in 3s
        </span>
      </div>

    </div>
  );
}