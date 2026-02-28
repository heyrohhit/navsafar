"use client"
import { useState, useEffect, useMemo } from "react";
import { handleGetQuery } from "./PackageUtils";
import PopUpFeature from "./PopUpFeature";

// Accent color cycles for cards
const CARD_ACCENTS = [
  "from-rose-400 to-orange-400",
  "from-violet-500 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-yellow-300",
  "from-sky-400 to-cyan-400",
  "from-fuchsia-500 to-pink-400",
];

const WIDTH_CLASSES = [
  "",
  "md:scale-[1.02] md:z-10",
  "",
  "md:scale-[0.98]",
  "",
  "md:scale-[1.03] md:z-10",
];

const aspectClasses = [
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[16/9]",
  "aspect-[4/3]",
  "aspect-[1/1]",
  "aspect-[3/2]",
];

// Fisher-Yates shuffle with a seed-like approach using Math.random
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const PackageGridLayout = ({ packages = [], btns = [] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Shuffle cards on every mount/render
  const shuffledPackages = useMemo(() => shuffleArray(packages), [packages]);

  useEffect(() => {
    setIsMounted(true);
    // Detect touch device
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

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
        window.location.href = `tel:${btn.number || "1234567890"}`;
        break;
      default:
        console.warn("Unknown button type:", btn.type);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <div className="min-h-screen py-16 px-4">
        {/* Decorative blobs */}
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600 opacity-10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-rose-500 opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-teal-500 opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-0">
            {shuffledPackages.map((pkg, index) => {
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              const scaleClass = WIDTH_CLASSES[index % WIDTH_CLASSES.length];
              const aspectClass = aspectClasses[index % aspectClasses.length];
              const isHovered = hoveredCard === pkg.id;

              // On touch devices, always show overlay button; on desktop show on hover
              const showOverlay = isTouchDevice || isHovered;

              return (
                <div
                  key={pkg.id}
                  className={`break-inside-avoid mb-5 relative group cursor-pointer transition-all duration-500 ${scaleClass}`}
                  onMouseEnter={() => !isTouchDevice && setHoveredCard(pkg.id)}
                  onMouseLeave={() => !isTouchDevice && setHoveredCard(null)}
                >
                  {/* Card */}
                  <div
                    className={`relative rounded-3xl overflow-hidden border backdrop-blur-sm transition-all duration-500 ${isHovered
                        ? "border-white/30 shadow-2xl shadow-black/60 -translate-y-1"
                        : "shadow-lg shadow-black/40"
                      }`}
                  >
                    {/* Gradient top accent bar */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent} z-10`}
                    />

                    {/* Image */}
                    <div className={`relative ${aspectClass} overflow-hidden`}>
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"
                          }`}
                      />

                      {/* Dark overlay */}
                      {/* Desktop: show on hover | Mobile: always show subtle overlay */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${isTouchDevice
                            ? "bg-black/30 opacity-100"
                            : `bg-black/40 ${isHovered ? "opacity-100" : "opacity-0"}`
                          }`}
                      />

                      {/* Badges */}
                      {pkg.duration && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-3 py-1 bg-black/60 backdrop-blur text-white text-xs font-semibold rounded-full border border-white/20">
                            ⏱ {pkg.duration}
                          </span>
                        </div>
                      )}

                      {pkg.discount && (
                        <div className="absolute top-3 right-3 z-10">
                          <span
                            className={`px-3 py-1 bg-gradient-to-r ${accent} text-white text-xs font-bold rounded-full shadow-lg`}
                          >
                            {pkg.discount}
                          </span>
                        </div>
                      )}

                      {pkg.popular && (
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="px-3 py-1 bg-amber-400 text-slate-900 text-xs font-black rounded-full shadow-lg tracking-wide">
                            ⭐ POPULAR
                          </span>
                        </div>
                      )}

                      {/* 
                        VIEW DETAILS BUTTON:
                        - Mobile (touch): Always visible at bottom of image
                        - Desktop: Shows on hover (centered overlay)
                      */}
                      {isTouchDevice ? (
                        // Mobile: fixed at bottom of image, always visible
                        <div className="absolute bottom-3 left-3 z-10">
                          <button
                            onClick={() => setSelectedItem(pkg)}
                            className={`px-4 py-2 bg-gradient-to-r ${accent} text-white text-xs font-bold rounded-2xl shadow-xl active:scale-95 transition-transform duration-150`}
                          >
                            View Details →
                          </button>
                        </div>
                      ) : (
                        // Desktop: centered on hover
                        <div
                          className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                            }`}
                        >
                          <button
                            onClick={() => setSelectedItem(pkg)}
                            className={`px-5 py-2.5 bg-gradient-to-r ${accent} text-white text-sm font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200`}
                          >
                            View Details →
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Title */}
                      <h3
                        className={`font-bold text-[#0b88c6] text-base leading-snug mb-1 transition-all duration-300 group-hover:bg-gradient-to-l group-hover:${accent} hover:text-shadow-2xs group-hover:bg-clip-text group-hover:text-transparent`}
                      >
                        {pkg.title}
                      </h3>

                      {/* Tagline */}
                      {(pkg.tagline || pkg.excerpt) && (
                        <p
                          className={`text-xs font-semibold bg-gradient-to-r ${accent} bg-clip-text text-transparent mb-2`}
                        >
                          {pkg.tagline || pkg.excerpt}
                        </p>
                      )}

                      {/* Description */}
                      {pkg.description && (
                        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                          {pkg.description}
                        </p>
                      )}

                      {/* Price */}
                      {pkg.price && (
                        <div className="mb-4 flex items-baseline gap-1">
                          <span
                            className={`text-2xl font-black bg-gradient-to-r ${accent} bg-clip-text text-transparent`}
                          >
                            {pkg.price}
                          </span>
                          {pkg.priceNote && (
                            <span className="text-slate-500 text-xs">
                              {pkg.priceNote}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex flex-col gap-2">
                        {btns.length > 0 ? (
                          btns.map((btn, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleBtnClick(btn, pkg)}
                              className={`w-full py-2.5 px-4 text-sm font-semibold rounded-2xl transition-all duration-200 ${btn.type === "getQuery"
                                  ? `border-2 border-transparent bg-gradient-to-r ${accent} text-white hover:scale-[1.02] hover:shadow-lg`
                                  : `bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40`
                                }`}
                            >
                              {btn.label}
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={() => setSelectedItem(pkg)}
                            className={`w-full py-2.5 px-4 text-sm font-semibold rounded-2xl bg-gradient-to-r ${accent} text-white hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}
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

      {/* PopUp Modal */}
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