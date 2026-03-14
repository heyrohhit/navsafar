"use client";
import { useState, useEffect } from "react";

const TOTAL_DURATION = 5000;

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {

    // 🔒 SCROLL LOCK
    document.body.style.overflow = "hidden";

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setVisible(false);

            // 🔓 SCROLL UNLOCK
            document.body.style.overflow = "";

            onComplete?.();
          }, 800);
        }, 400);
      }
    }, 16);

    return () => {
      clearInterval(interval);

      // cleanup
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
   <div className="overflow-hidden">
     <div
      className="fixed inset-0 scroll z-50 flex items-center justify-center h-screen w-screen"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.8s ease",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* === LAYERED SKY BACKGROUND === */}
      <div className="absolute inset-0" style={{
        background: "#0f6477"
      }} />

   


      {/* === MAIN CONTENT === */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center" style={{ marginBottom: "80px" }}>

        {/* Destination badges */}
        <div className="flex gap-3 mb-6 flex-wrap justify-center">
          {["Paris ✦", "Bali ✦", "Dubai ✦", "Maldives"].map((dest, i) => (
            <span key={i} className="text-xs px-3 py-1 rounded-full border"
              style={{
                color: "rgba(255,240,180,0.85)",
                borderColor: "rgba(255,200,80,0.3)",
                background: "rgba(255,150,50,0.1)",
                backdropFilter: "blur(4px)",
                animation: `fadeInUp 0.6s ease forwards ${i * 0.15}s`,
                opacity: 0,
                letterSpacing: "0.08em",
                fontSize: "11px"
              }}>
              {dest}
            </span>
          ))}
        </div>

        {/* Brand name */}
        <div className="relative z-100 mb-5">
          <h1
            className="reey-font"
            style={{
              fontSize: "clamp(52px, 12vw, 96px)",
              fontWeight: "700",
             
              filter: "drop-shadow(0 2px 20px rgba(245,200,66,0.4))",
              animation: "titleReveal 1s ease forwards"
            }}>
            NavSafar
          </h1>
          {/* Decorative line under name */}
          <div className="flex items-center gap-3 mt-5 justify-center">
            <div style={{ flex: 1, maxWidth: "80px", height: "1px", background: "linear-gradient(to right, transparent, rgba(245,200,66,0.6))" }} />
            <span style={{ color: "rgba(245,200,66,0.8)", fontSize: "14px" }}>✦</span>
            <div style={{ flex: 1, maxWidth: "80px", height: "1px", background: "linear-gradient(to left, transparent, rgba(245,200,66,0.6))" }} />
          </div>
        </div>

        <p style={{
          color: "rgba(255,230,160,0.8)",
          fontSize: "13px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: "40px",
          fontFamily: "'Georgia', serif",
          animation: "fadeInUp 0.8s ease forwards 0.5s",
          opacity: 0
        }}>
          Your Journey Begins Here
        </p>

        {/* === FLIGHT PATH === */}
        <div className="relative w-full max-w-sm mx-auto mb-4" style={{ height: "56px" }}>

          {/* Track dashes */}
          <div style={{
            position: "absolute",
            top: "50%", left: 0, right: 0,
            height: "1px",
            background: "repeating-linear-gradient(to right, rgba(255,220,150,0.25), rgba(255,220,150,0.25) 6px, transparent 6px, transparent 14px)",
            transform: "translateY(-50%)"
          }} />

          {/* Progress line glow */}
          <div style={{
            position: "absolute",
            top: "50%", left: 0,
            width: `${progress}%`,
            height: "2px",
            background: "linear-gradient(to right, rgba(245,200,66,0.3), rgba(245,200,66,0.9))",
            transform: "translateY(-50%)",
            transition: "width 0.15s ease",
            boxShadow: "0 0 8px rgba(245,200,66,0.6)"
          }} />

          {/* Start dot */}
          <div style={{
            position: "absolute", top: "50%", left: 0,
            transform: "translate(-50%, -50%)",
            width: "8px", height: "8px",
            background: "rgba(245,200,66,0.6)",
            borderRadius: "50%",
            border: "1px solid rgba(245,200,66,0.9)"
          }} />

          {/* End dot */}
          <div style={{
            position: "absolute", top: "50%", right: 0,
            transform: "translate(50%, -50%)",
            width: "8px", height: "8px",
            background: progress >= 100 ? "rgba(245,200,66,0.9)" : "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.4)",
            transition: "background 0.5s"
          }} />

          {/* Airplane */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: `${progress}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "28px",
            filter: "drop-shadow(0 0 12px rgba(245,200,66,0.8)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
            animation: "floatPlane 2.5s ease-in-out infinite",
            transition: "left 0.15s ease",
            zIndex: 10
          }}>
            ✈
          </div>

          {/* Contrail particles */}
          {progress > 5 && [0, 1, 2].map(i => (
            <div key={i} style={{
              position: "absolute",
              top: "50%",
              left: `${Math.max(0, progress - 4 - i * 3)}%`,
              transform: "translate(-50%, -50%)",
              width: `${4 - i}px`,
              height: `${4 - i}px`,
              background: "rgba(255,220,150,0.4)",
              borderRadius: "50%",
              filter: "blur(1px)",
              opacity: 0.6 - i * 0.15
            }} />
          ))}
        </div>

        {/* Progress info row */}
        <div className="flex items-center gap-4 mb-2">
          <span style={{
            color: "rgba(255,220,150,0.6)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "'Georgia', serif"
          }}>
            Preparing Your Journey
          </span>
          <span style={{
            fontSize: "20px",
            fontFamily: "'Palatino Linotype', serif",
            fontWeight: "700",
            color: "#f5c842",
            textShadow: "0 0 20px rgba(245,200,66,0.5)",
            minWidth: "48px",
            textAlign: "right"
          }}>
            {Math.floor(progress)}%
          </span>
        </div>

        {/* Animated loading text */}
        <div style={{
          color: "rgba(255,200,100,0.5)",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          animation: "textPulse 2s ease-in-out infinite"
        }}>
          {progress < 30 ? "✦  Booking Your Dreams  ✦" :
            progress < 60 ? "✦  Charting The Course  ✦" :
              progress < 90 ? "✦  Packing Memories  ✦" :
                "✦  Ready For Takeoff  ✦"}
        </div>
      </div>

      {/* === CSS ANIMATIONS === */}
      <style>{`
        @keyframes cloudMove1 {
          from { transform: translateX(0); }
          to { transform: translateX(calc(100vw + 400px)); }
        }
        @keyframes cloudMove2 {
          from { transform: translateX(-50px); }
          to { transform: translateX(calc(100vw + 500px)); }
        }
        @keyframes cloudMove3 {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100vw - 400px)); }
        }
        @keyframes floatPlane {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -65%) rotate(-3deg); }
        }
        @keyframes birdFly {
          0% { transform: translateX(0) translateY(0); opacity: 0; }
          5% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 200px)) translateY(-30px); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 60px 30px rgba(245,200,66,0.4), 0 0 120px 60px rgba(232,132,58,0.2); }
          50% { box-shadow: 0 0 80px 40px rgba(245,200,66,0.55), 0 0 150px 80px rgba(232,132,58,0.3); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes titleReveal {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(0.8); }
          to { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
    </div>
  );
}