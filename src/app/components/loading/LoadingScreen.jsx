"use client";
import { useState, useEffect, useRef } from "react";

const TOTAL_DURATION = 5000;

export default function LoadingScreen({ onComplete }) {
const [progress, setProgress] = useState(0);
const [visible, setVisible] = useState(true);
const [fadeOut, setFadeOut] = useState(false);

const rafRef = useRef(null);
const startTimeRef = useRef(null);
const lastProgressRef = useRef(0);

useEffect(() => {
// 🔒 SCROLL LOCK
document.body.style.overflow = "hidden";

```
const animate = (time) => {
  if (!startTimeRef.current) startTimeRef.current = time;

  const elapsed = time - startTimeRef.current;
  const percent = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

  // ✅ Throttle updates (reduce re-renders)
  if (Math.abs(percent - lastProgressRef.current) > 0.3) {
    lastProgressRef.current = percent;
    setProgress(percent);
  }

  if (percent < 100) {
    rafRef.current = requestAnimationFrame(animate);
  } else {
    setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => {
        setVisible(false);

        // 🔓 SCROLL UNLOCK
        document.body.style.overflow = "";

        if (onComplete) onComplete();
      }, 800);
    }, 200);
  }
};

rafRef.current = requestAnimationFrame(animate);

return () => {
  cancelAnimationFrame(rafRef.current);
  document.body.style.overflow = "";
};
```

}, [onComplete]);

if (!visible) return null;

return ( <div className="overflow-hidden">
<div
className="fixed inset-0 scroll z-50 flex items-center justify-center h-screen w-screen"
style={{
opacity: fadeOut ? 0 : 1,
transition: "opacity 0.8s ease",
fontFamily: "'Georgia', serif",
}}
>
{/* === BACKGROUND === */}
<div
className="absolute inset-0"
style={{
background: "#0f6477",
}}
/>

```
    {/* === CONTENT === */}
    <div
      className="relative z-10 flex flex-col items-center px-8 text-center"
      style={{ marginBottom: "80px" }}
    >
      {/* Badges */}
      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        {["Paris ✦", "Bali ✦", "Dubai ✦", "Maldives"].map((dest, i) => (
          <span
            key={i}
            className="text-xs px-3 py-1 rounded-full border"
            style={{
              color: "rgba(255,240,180,0.85)",
              borderColor: "rgba(255,200,80,0.3)",
              background: "rgba(255,150,50,0.1)",
              backdropFilter: "blur(4px)",
              animation: `fadeInUp 0.6s ease forwards ${i * 0.15}s`,
              opacity: 0,
              letterSpacing: "0.08em",
              fontSize: "11px",
            }}
          >
            {dest}
          </span>
        ))}
      </div>

      {/* Title */}
      <div className="relative z-100 mb-5">
        <h1
          className="reey-font text-white"
          style={{
            fontSize: "clamp(52px, 12vw, 96px)",
            fontWeight: "700",
            filter: "drop-shadow(0 2px 20px rgba(245,200,66,0.4))",
            animation: "titleReveal 1s ease forwards",
          }}
        >
          NavSafar
        </h1>

        <div className="flex items-center gap-3 mt-5 justify-center">
          <div
            style={{
              flex: 1,
              maxWidth: "80px",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(245,200,66,0.6))",
            }}
          />
          <span
            style={{
              color: "rgba(245,200,66,0.8)",
              fontSize: "14px",
            }}
          >
            ✦
          </span>
          <div
            style={{
              flex: 1,
              maxWidth: "80px",
              height: "1px",
              background:
                "linear-gradient(to left, transparent, rgba(245,200,66,0.6))",
            }}
          />
        </div>
      </div>

      <p
        style={{
          color: "rgba(255,230,160,0.8)",
          fontSize: "13px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: "40px",
          fontFamily: "'Georgia', serif",
          animation: "fadeInUp 0.8s ease forwards 0.5s",
          opacity: 0,
        }}
      >
        Your Journey Begins Here
      </p>

      {/* Flight Path */}
      <div
        className="relative w-full max-w-sm mx-auto mb-4"
        style={{ height: "56px" }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "repeating-linear-gradient(to right, rgba(255,220,150,0.25), rgba(255,220,150,0.25) 6px, transparent 6px, transparent 14px)",
            transform: "translateY(-50%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${progress}%`,
            height: "2px",
            background:
              "linear-gradient(to right, rgba(245,200,66,0.3), rgba(245,200,66,0.9))",
            transform: "translateY(-50%)",
            transition: "width 0.1s linear",
            boxShadow: "0 0 8px rgba(245,200,66,0.6)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${progress}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "28px",
            willChange: "transform",
            filter:
              "drop-shadow(0 0 12px rgba(245,200,66,0.8)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
            animation: "floatPlane 2.5s ease-in-out infinite",
            zIndex: 10,
          }}
        >
          ✈
        </div>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <span
          style={{
            color: "rgba(255,220,150,0.6)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Preparing Your Journey
        </span>
        <span
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#f5c842",
            minWidth: "48px",
            textAlign: "right",
          }}
        >
          {Math.floor(progress)}%
        </span>
      </div>
    </div>

    <style>{`
      @keyframes floatPlane {
        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
        50% { transform: translate(-50%, -65%) rotate(-3deg); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes titleReveal {
        from { opacity: 0; transform: scale(0.92) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  </div>
</div>
);
}
