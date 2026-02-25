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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden skyBg">

      {/* ☁️ Moving Clouds */}
      <div className="cloud cloud1" />
      <div className="cloud cloud2" />

      {/* ✈️ Center Content */}
      <div className="relative z-10 text-center px-6">

        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white tracking-wide">
          NavSafar
        </h1>

        <p className="text-white/80 mb-10 text-lg">
          Your Journey Begins Here
        </p>

        {/* ✈️ Flight Path */}
        <div className="relative w-80 max-w-full mx-auto mb-8 h-16">

          <div className="pathLine" />

          <div
            className="plane"
            style={{ left: `${progress}%` }}
          >
            ✈️
          </div>

        </div>

        {/* 🌍 Progress */}
        <div className="text-white tracking-wider">
          Preparing Your Journey... {Math.floor(progress)}%
        </div>

      </div>

      <style jsx>{`

        /* 🌅 Sky Background */
        .skyBg {
          background: linear-gradient(to top, #ff9966, #ff5e62, #2193b0);
        }

        /* ☁️ Clouds */
        .cloud {
          position: absolute;
          width: 200px;
          height: 60px;
          background: rgba(255,255,255,0.8);
          border-radius: 100px;
          filter: blur(10px);
          animation: moveClouds 30s linear infinite;
        }

        .cloud1 {
          top: 20%;
          left: -200px;
        }

        .cloud2 {
          top: 60%;
          left: -250px;
          animation-duration: 45s;
        }

        @keyframes moveClouds {
          from { transform: translateX(0); }
          to { transform: translateX(120vw); }
        }

        /* ✈️ Path Line */
        .pathLine {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: repeating-linear-gradient(
            to right,
            white,
            white 6px,
            transparent 6px,
            transparent 12px
          );
          opacity: 0.6;
        }

        /* ✈️ Plane */
        .plane {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 28px;
          transition: left 0.2s ease;
        }

      `}</style>
    </div>
  );
}
