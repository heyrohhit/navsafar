"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const TOTAL_DURATION = 2800;
const HERO_IMAGES = ["/assets/bg.jpg", "/assets/kd.jpg", "/assets/mt.jpg"];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function preloadImages(urls) {
  urls.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(true);
  const [fadeOut, setFadeOut]   = useState(false);

  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const doneRef  = useRef(false);

  const handleComplete = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    setTimeout(() => {
      setFadeOut(true);

      // ✅ KEY FIX: call onComplete HERE — when fade STARTS (not 600ms later)
      // Wrapper instantly shows children while loader fades out → perfect crossfade
      // No white screen, no gap.
      if (onComplete) onComplete();

      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 650);

    }, 300);
  }, [onComplete]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    preloadImages(HERO_IMAGES);

    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const raw     = Math.min((timestamp - startRef.current) / TOTAL_DURATION, 1);
      const percent = easeOutCubic(raw) * 100;
      setProgress(percent);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        handleComplete();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = "";
    };
  }, [handleComplete]);

  if (!visible) return null;

  const phase =
    progress < 30 ? "✦  Booking Your Dreams  ✦"
    : progress < 60 ? "✦  Charting The Course  ✦"
    : progress < 90 ? "✦  Packing Memories  ✦"
    : "✦  Ready For Takeoff  ✦";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "100vw", height: "100vh",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.65s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "'Georgia', serif",
        background: "#0f6477",
        willChange: "opacity",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 32px", textAlign: "center", marginBottom: "80px" }}>

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", justifyContent: "center" }}>
          {["Paris ✦", "Bali ✦", "Dubai ✦", "Maldives"].map((dest, i) => (
            <span key={i} style={{ color: "rgba(255,240,180,0.85)", border: "1px solid rgba(255,200,80,0.3)", background: "rgba(255,150,50,0.1)", backdropFilter: "blur(4px)", animation: `fadeInUp 0.5s ease forwards ${i * 0.1}s`, opacity: 0, letterSpacing: "0.08em", fontSize: "11px", padding: "4px 12px", borderRadius: "9999px" }}>
              {dest}
            </span>
          ))}
        </div>

        <div style={{ position: "relative", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "clamp(52px,12vw,96px)", fontWeight: 700, color: "#fff", margin: 0, filter: "drop-shadow(0 2px 20px rgba(245,200,66,0.4))", animation: "titleReveal 0.8s ease forwards" }}>
            NavSafar
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px", justifyContent: "center" }}>
            <div style={{ flex: 1, maxWidth: "80px", height: "1px", background: "linear-gradient(to right, transparent, rgba(245,200,66,0.6))" }} />
            <span style={{ color: "rgba(245,200,66,0.8)", fontSize: "14px" }}>✦</span>
            <div style={{ flex: 1, maxWidth: "80px", height: "1px", background: "linear-gradient(to left, transparent, rgba(245,200,66,0.6))" }} />
          </div>
        </div>

        <p style={{ color: "rgba(255,230,160,0.8)", fontSize: "13px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "40px", fontFamily: "'Georgia', serif", animation: "fadeInUp 0.6s ease forwards 0.3s", opacity: 0 }}>
          Your Journey Begins Here
        </p>

        <div style={{ position: "relative", width: "100%", maxWidth: "340px", margin: "0 auto 16px", height: "56px" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "repeating-linear-gradient(to right,rgba(255,220,150,.25),rgba(255,220,150,.25) 6px,transparent 6px,transparent 14px)", transform: "translateY(-50%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, width: `${progress}%`, height: "2px", background: "linear-gradient(to right,rgba(245,200,66,.3),rgba(245,200,66,.9))", transform: "translateY(-50%)", boxShadow: "0 0 8px rgba(245,200,66,.6)", willChange: "width" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, transform: "translate(-50%,-50%)", width: "8px", height: "8px", background: "rgba(245,200,66,.6)", borderRadius: "50%", border: "1px solid rgba(245,200,66,.9)" }} />
          <div style={{ position: "absolute", top: "50%", right: 0, transform: "translate(50%,-50%)", width: "8px", height: "8px", background: progress >= 99 ? "rgba(245,200,66,.9)" : "rgba(255,255,255,.2)", borderRadius: "50%", border: "1px solid rgba(255,255,255,.4)", transition: "background 0.4s" }} />
          <div style={{ color: "#fff", position: "absolute", top: "50%", left: `${progress}%`, transform: "translate(-50%,-50%)", fontSize: "28px", filter: "drop-shadow(0 0 10px rgba(245,200,66,.8))", animation: "floatPlane 2s ease-in-out infinite", willChange: "left", zIndex: 10 }}>✈</div>
          {progress > 5 && [0,1,2].map((i) => (
            <div key={i} style={{ position: "absolute", top: "50%", left: `${Math.max(0, progress - 4 - i * 3)}%`, transform: "translate(-50%,-50%)", width: `${4-i}px`, height: `${4-i}px`, background: "rgba(255,220,150,.4)", borderRadius: "50%", filter: "blur(1px)", opacity: 0.6 - i * 0.15 }} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
          <span style={{ color: "rgba(255,220,150,.6)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Georgia',serif" }}>Preparing Your Journey</span>
          <span style={{ fontSize: "20px", fontFamily: "'Palatino Linotype',serif", fontWeight: 700, color: "#f5c842", textShadow: "0 0 20px rgba(245,200,66,.5)", minWidth: "48px", textAlign: "right" }}>{Math.floor(progress)}%</span>
        </div>

        <div style={{ color: "rgba(255,200,100,.5)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", animation: "textPulse 2s ease-in-out infinite" }}>{phase}</div>
      </div>

      <style>{`
        @keyframes floatPlane { 0%,100%{transform:translate(-50%,-50%) rotate(0deg)} 50%{transform:translate(-50%,-60%) rotate(-3deg)} }
        @keyframes fadeInUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes titleReveal{ from{opacity:0;transform:scale(.94) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes textPulse  { 0%,100%{opacity:.4} 50%{opacity:.85} }
      `}</style>
    </div>
  );
}
