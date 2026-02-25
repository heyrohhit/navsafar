"use client";
import { useState, useEffect } from "react";

const TOTAL_DURATION = 4500;

const LoadingScreen = ({ onComplete }) => {
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
          onComplete();
        }, 600);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-950">

      {/* Animated Sky Gradient */}
      <div className="absolute inset-0 animate-skyMove bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />

      {/* Moving Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="cloud cloud1" />
        <div className="cloud cloud2" />
        <div className="cloud cloud3" />
      </div>

      {/* Center Content */}
      <div className="relative z-10 text-center px-6">

        {/* Brand Name */}
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-wider">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-textShine">
            NavSafar
          </span>
        </h1>

        <p className="text-blue-200 mb-12 text-lg tracking-wide animate-fadeIn">
          Your Gateway to Limitiess Jurneys
        </p>

        {/* Airplane Section */}
        <div className="relative h-24 mb-14 overflow-hidden">

          <div className="plane animate-planeFly">

            {/* <svg
              className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 16l20-4-20-4v4h14-14v4z"
              />
            </svg> */}

            {/* Jet Glow Trail */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-60 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent blur-md opacity-70" />
          </div>

        </div>

        {/* Premium Glass Progress */}
        <div className="w-80 mx-auto">
          <div className="h-3 rounded-full bg-white/10 backdrop-blur-md overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-75 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 blur-md bg-gradient-to-r from-cyan-300 to-purple-400 opacity-60" />
            </div>
          </div>

          <div className="mt-3 text-blue-200 text-sm tracking-wider">
            {Math.floor(progress)}% Loading...
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`

        @keyframes planeFly {
          0% {
            transform: translate(-120%, -50%) rotate(-8deg) scale(0.9);
          }
          50% {
            transform: translate(50vw, -50%) rotate(2deg) scale(1);
          }
          100% {
            transform: translate(120vw, -50%) rotate(6deg) scale(1.05);
          }
        }

        .plane {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          animation: planeFly ${TOTAL_DURATION}ms cubic-bezier(.65,.05,.36,1) forwards;
        }

        @keyframes skyMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .animate-skyMove {
          animation: skyMove 20s linear infinite alternate;
        }

        @keyframes textShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .animate-textShine {
          background-size: 200% auto;
          animation: textShine 4s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 1.2s ease forwards;
        }

        .cloud {
          position: absolute;
          width: 200px;
          height: 60px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          filter: blur(20px);
          animation: cloudMove 30s linear infinite;
        }

        .cloud1 { top: 20%; left: -200px; animation-duration: 35s; }
        .cloud2 { top: 50%; left: -250px; animation-duration: 45s; }
        .cloud3 { top: 70%; left: -300px; animation-duration: 50s; }

        @keyframes cloudMove {
          from { transform: translateX(0); }
          to { transform: translateX(150vw); }
        }

      `}</style>
    </div>
  );
};

export default LoadingScreen;