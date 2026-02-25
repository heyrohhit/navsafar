"use client";
import { useState, useEffect } from "react";

const TOTAL_DURATION = 5000;

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 800);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">

      {/* 🌌 Animated Aurora Background */}
      <div className="absolute inset-0 aurora" />

      {/* ✨ Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <span key={i} />
        ))}
      </div>

      {/* 🔮 Center Content */}
      <div className="relative z-10 text-center px-6">

        {/* Brand */}
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-wider text-white">
          <span className="gradientText">NavSafar</span>
        </h1>

        <p className="text-gray-300 mb-12 text-lg tracking-wide opacity-80">
          Crafting Limitless Journeys
        </p>

        {/* 🌀 3D Rotating Ring */}
        <div className="relative w-40 h-40 mx-auto mb-14">
          <div className="ringOuter" />
          <div className="ringInner" />
          <div className="ringCore" />
        </div>

        {/* 💎 Glass Progress Capsule */}
        <div className="w-80 max-w-full mx-auto">
          <div className="glassBar">
            <div
              className="glassProgress"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-gray-300 tracking-widest text-sm">
            {Math.floor(progress)}% INITIALIZING EXPERIENCE
          </div>
        </div>

      </div>

      {/* Animations */}
      <style jsx>{`

        /* Aurora Background */
        .aurora {
          background: radial-gradient(circle at 20% 20%, #00f5ff22, transparent 40%),
                      radial-gradient(circle at 80% 30%, #8b5cf622, transparent 40%),
                      radial-gradient(circle at 50% 80%, #22d3ee22, transparent 50%);
          animation: auroraMove 10s infinite alternate ease-in-out;
        }

        @keyframes auroraMove {
          0% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1.2) rotate(8deg); }
        }

        /* Gradient Text */
        .gradientText {
          background: linear-gradient(90deg,#00f5ff,#8b5cf6,#22d3ee);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
        }

        @keyframes shine {
          from { background-position: -200% center; }
          to { background-position: 200% center; }
        }

        /* Rings */
        .ringOuter, .ringInner {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
        }

        .ringOuter {
          border-top: 2px solid #00f5ff;
          animation: spin 4s linear infinite;
        }

        .ringInner {
          inset: 20px;
          border-bottom: 2px solid #8b5cf6;
          animation: spinReverse 3s linear infinite;
        }

        .ringCore {
          position: absolute;
          inset: 45px;
          border-radius: 50%;
          background: radial-gradient(circle,#00f5ff55,#8b5cf633);
          filter: blur(10px);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes spinReverse {
          to { transform: rotate(-360deg); }
        }

        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        /* Glass Progress */
        .glassBar {
          height: 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .glassProgress {
          height: 100%;
          background: linear-gradient(90deg,#00f5ff,#8b5cf6);
          transition: width 0.2s ease;
        }

        /* Particles */
        .particles span {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0.6;
          animation: float 10s linear infinite;
        }

        .particles span:nth-child(odd) {
          background: #00f5ff;
        }

        .particles span:nth-child(even) {
          background: #8b5cf6;
        }

        @keyframes float {
          from {
            transform: translateY(100vh) scale(0.5);
            opacity: 0;
          }
          50% { opacity: 1; }
          to {
            transform: translateY(-10vh) scale(1);
            opacity: 0;
          }
        }

      `}</style>
    </div>
  );
}