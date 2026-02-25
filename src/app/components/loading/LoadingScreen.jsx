"use client";
import { useState, useEffect } from "react";

const TOTAL_DURATION = 6000;
const destinations = ["Goa", "Dubai", "Paris", "Bali"];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [destinationIndex, setDestinationIndex] = useState(0);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(percent);

      const dest = Math.floor((percent / 100) * destinations.length);
      setDestinationIndex(dest >= destinations.length ? destinations.length - 1 : dest);

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

      <div className="relative z-10 text-center px-6 w-full max-w-xl">

        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white tracking-wide">
          NavSafar
        </h1>

        <p className="text-white/80 mb-6 text-lg">
          Flying to {destinations[destinationIndex]}...
        </p>

        {/* ✈️ Curved Flight Path */}
        <div className="relative w-full h-40 mb-8">

          <svg viewBox="0 0 500 150" className="absolute w-full h-full">
            <path
              d="M20 120 Q250 10 480 120"
              fill="transparent"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeDasharray="6 8"
            />

            <path
              d="M20 120 Q250 10 480 120"
              fill="transparent"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (progress / 100) * 1000}
              style={{ transition: "stroke-dashoffset 0.2s ease" }}
            />
          </svg>

          {/* ✈️ Plane */}
          <div
            className="plane"
            style={{
              left: `${progress}%`,
              top: `${120 - (Math.sin(progress / 100 * Math.PI) * 110)}px`
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M2 16l20-4-20-4v3l15 1-15 1v3z" />
            </svg>
          </div>

        </div>

        <div className="text-white tracking-wider">
          Preparing Your Journey... {Math.floor(progress)}%
        </div>

      </div>

      <style jsx>{`

        .skyBg {
          background: linear-gradient(to top, #1e3c72, #2a5298);
        }

        .plane {
          position: absolute;
          transform: translate(-50%, -50%) rotate(15deg);
          transition: left 0.2s linear, top 0.2s linear;
          animation: floatPlane 2s ease-in-out infinite;
        }

        @keyframes floatPlane {
          0%,100% { transform: translate(-50%, -50%) rotate(15deg); }
          50% { transform: translate(-50%, -55%) rotate(15deg); }
        }

      `}</style>
    </div>
  );
}
