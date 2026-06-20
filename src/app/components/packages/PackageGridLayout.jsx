"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import PopUpFeature, { handleGetQuery } from "./PopUpFeature";

// ─── Card accent gradients ─────────────────────────────────────────
const ACCENTS = [
  { from: "#f43f5e", to: "#fb923c" },
  { from: "#8b5cf6", to: "#6366f1" },
  { from: "#10b981", to: "#14b8a6" },
  { from: "#f59e0b", to: "#facc15" },
  { from: "#38bdf8", to: "#22d3ee" },
  { from: "#d946ef", to: "#ec4899" },
];

const ASPECT_CLASSES = [
  "aspect-[4/3]", "aspect-[3/4]", "aspect-[16/9]",
  "aspect-[4/3]", "aspect-[1/1]", "aspect-[3/2]",
];

function shuffleArray(arr) {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function StarMini({ rating }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs">
      {"★".repeat(Math.floor(rating))}
      <span className="text-slate-500 ml-0.5">{rating}</span>
    </span>
  );
}

const PackageGridLayout = ({ packages = [], btns = [] }) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isTouch, setIsTouch] = useState(false);

  const shuffled = useMemo(() => shuffleArray(packages), [packages]);

  useEffect(() => {
    setMounted(true);
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // ✅ FIX: handleBtnClick mein getQuery case add kiya
  const handleBtnClick = (btn, pkg) => {
    switch (btn.type) {
      case "viewDetails":
      case "readMore":
        setSelectedItem(pkg);
        break;
      case "getQuery":
        handleGetQuery(pkg);
        break;
      case "callMe":
        window.location.href = `tel:${btn.number || "+918882128640"}`;
        break;
      default:
        setSelectedItem(pkg); // fallback: popup dikhao
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="min-h-screen">
        {/* Ambient blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "rgba(139,92,246,0.08)" }} />
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-3xl"
            style={{ background: "rgba(244,63,94,0.08)" }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "rgba(20,184,166,0.07)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {shuffled.map((pkg, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              const aspectClass = ASPECT_CLASSES[index % ASPECT_CLASSES.length];
              const isHovered = hoveredId === pkg.id;
              const showOverlay = isTouch || isHovered;
              const gradientCss = `linear-gradient(135deg, ${accent.from}, ${accent.to})`;

              return (
                <div
                  key={pkg.id}
                  className="break-inside-avoid mb-5 cursor-pointer"
                  onMouseEnter={() => !isTouch && setHoveredId(pkg.id)}
                  onMouseLeave={() => !isTouch && setHoveredId(null)}
                >
                  <div
                    className="relative rounded-3xl overflow-hidden transition-all duration-500"
                    style={{
                      background: "linear-gradient(135deg, #0f1c2e, #1a2840)",
                      border: isHovered
                        ? "1px solid rgba(255,255,255,0.18)"
                        : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: isHovered
                        ? "0 24px 60px rgba(0,0,0,0.6)"
                        : "0 8px 30px rgba(0,0,0,0.4)",
                      transform: isHovered ? "translateY(-4px)" : "none",
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 z-10"
                      style={{ background: gradientCss }}
                    />

                    {/* Image */}
                    <div className={`relative ${aspectClass} overflow-hidden`}>
                      <Image
                        src={pkg.image || "/assets/placeholder.jpg"}
                        alt={pkg.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        quality={80}
                        className="object-cover transition-transform duration-700"
                        style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
                      />

                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                          background: "linear-gradient(to top, rgba(15,28,46,0.9) 0%, rgba(15,28,46,0.1) 60%, transparent 100%)",
                          opacity: isTouch ? 1 : isHovered ? 1 : 0.5,
                        }}
                      />

                      {pkg.duration && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-3 py-1 text-white text-xs font-semibold rounded-full"
                            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                            ⏱ {pkg.duration}
                          </span>
                        </div>
                      )}

                      {pkg.discount && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg"
                            style={{ background: gradientCss }}>
                            {pkg.discount}
                          </span>
                        </div>
                      )}

                      {pkg.popular && (
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="px-3 py-1 bg-amber-400 text-slate-900 text-xs font-black rounded-full shadow-lg">
                            ⭐ POPULAR
                          </span>
                        </div>
                      )}

                      {/* ✅ View Details button — seedha setSelectedItem call karo */}
                      {isTouch ? (
                        <div className="absolute bottom-3 left-3 z-10">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(pkg); }}
                            className="px-4 py-2 text-white text-xs font-bold rounded-2xl shadow-xl active:scale-95 transition-transform duration-150 cursor-pointer"
                            style={{ background: gradientCss }}
                          >
                            View Details →
                          </button>
                        </div>
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 cursor-pointer"
                          style={{ opacity: isHovered ? 1 : 0 }}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(pkg); }}
                            className="px-5 py-2.5 text-white text-sm font-bold rounded-2xl shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer"
                            style={{ background: gradientCss }}
                          >
                            View Details →
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-base leading-snug mb-1 transition-all duration-300"
                        style={{ color: isHovered ? accent.from : "#38bdf8" }}>
                        {pkg.title}
                      </h3>

                      {pkg.tagline && (
                        <p className="text-xs font-semibold mb-1.5 text-[#999]">{pkg.tagline}</p>
                      )}

                      {pkg.rating && (
                        <div className="mb-2"><StarMini rating={pkg.rating} /></div>
                      )}

                      {pkg.description && (
                        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                          {pkg.description}
                        </p>
                      )}

                      {pkg.price && (
                        <div className="mb-4 flex items-baseline gap-1">
                          <span className="text-2xl font-black"
                            style={{ background: gradientCss, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {pkg.price}
                          </span>
                          {pkg.priceNote && (
                            <span className="text-slate-500 text-xs">{pkg.priceNote}</span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        {btns.length > 0 ? (
                          btns.map((btn, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); handleBtnClick(btn, pkg); }}
                              className="w-full py-2.5 px-4 text-sm font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                              style={
                                btn.type === "getQuery"
                                  ? { background: gradientCss, color: "#fff", boxShadow: `0 4px 20px ${accent.from}40` }
                                  : { background: "rgba(255,255,255,0.07)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.12)" }
                              }
                            >
                              {btn.label}
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(pkg); }}
                            className="w-full py-2.5 px-4 text-sm font-semibold rounded-2xl text-white transition-all duration-200 hover:scale-[1.02]"
                            style={{ background: gradientCss, boxShadow: `0 4px 20px ${accent.from}40` }}
                          >
                            Read More →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✅ FIX: Popup — selectedItem set hone par seedha render */}
      {selectedItem && (
        <PopUpFeature
          selectedPackage={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};

export default PackageGridLayout;
