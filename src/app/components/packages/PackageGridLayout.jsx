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

// ─── Dynamic layouts — a new one is picked on every mount ───────────
const LAYOUT_IDS = ["masonry", "grid", "featured", "mosaic", "list"];

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

// ─── Image block (shared by every layout) ──────────────────────────
function CardImage({ pkg, gradientCss, isHovered, isTouch, aspectClass, onView, fillHeight }) {
  return (
    <div className={`relative ${fillHeight ? "h-56 sm:h-full min-h-[14rem]" : aspectClass} overflow-hidden`}>
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
          <span className="px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg" style={{ background: gradientCss }}>
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

      {/* View Details — bottom on touch, centered on hover */}
      {isTouch ? (
        <div className="absolute bottom-3 left-3 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onView(); }}
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
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="px-5 py-2.5 text-white text-sm font-bold rounded-2xl shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer"
            style={{ background: gradientCss }}
          >
            View Details →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Content block (shared by every layout) ────────────────────────
function CardBody({ pkg, accent, gradientCss, isHovered, btns, onBtn, onView }) {
  return (
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-bold text-base leading-snug mb-1 transition-all duration-300"
        style={{ color: isHovered ? accent.from : "#38bdf8" }}>
        {pkg.title}
      </h3>

      {pkg.tagline && <p className="text-xs font-semibold mb-1.5 text-[#999]">{pkg.tagline}</p>}
      {pkg.rating && <div className="mb-2"><StarMini rating={pkg.rating} /></div>}
      {pkg.description && (
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{pkg.description}</p>
      )}

      {pkg.price && (
        <div className="mb-4 flex items-baseline gap-1">
          <span className="text-2xl font-black"
            style={{ background: gradientCss, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {pkg.price}
          </span>
          {pkg.priceNote && <span className="text-slate-500 text-xs">{pkg.priceNote}</span>}
        </div>
      )}

      {/* Action buttons pinned to bottom for equal-height grids */}
      <div className="flex flex-col gap-2 mt-auto">
        {btns.length > 0 ? (
          btns.map((btn, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); onBtn(btn, pkg); }}
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
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="w-full py-2.5 px-4 text-sm font-semibold rounded-2xl text-white transition-all duration-200 hover:scale-[1.02]"
            style={{ background: gradientCss, boxShadow: `0 4px 20px ${accent.from}40` }}
          >
            Read More →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── One package card — vertical or horizontal (list) ──────────────
function PackageCard({
  pkg, index, isTouch, hoveredId, setHoveredId,
  btns, onBtn, onView, horizontal = false, aspectClass = "aspect-[4/3]",
}) {
  const accent = ACCENTS[index % ACCENTS.length];
  const gradientCss = `linear-gradient(135deg, ${accent.from}, ${accent.to})`;
  const isHovered = hoveredId === pkg.id;

  return (
    <div
      className="cursor-pointer h-full"
      onMouseEnter={() => !isTouch && setHoveredId(pkg.id)}
      onMouseLeave={() => !isTouch && setHoveredId(null)}
    >
      <div
        className="relative rounded-3xl overflow-hidden transition-all duration-500 h-full"
        style={{
          background: "linear-gradient(135deg, #0f1c2e, #1a2840)",
          border: isHovered ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: isHovered ? "0 24px 60px rgba(0,0,0,0.6)" : "0 8px 30px rgba(0,0,0,0.4)",
          transform: isHovered ? "translateY(-4px)" : "none",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 z-20" style={{ background: gradientCss }} />

        {horizontal ? (
          <div className="flex flex-col sm:flex-row h-full">
            <div className="relative sm:w-2/5 lg:w-1/3">
              <CardImage pkg={pkg} gradientCss={gradientCss} isHovered={isHovered} isTouch={isTouch} onView={onView} fillHeight />
            </div>
            <CardBody pkg={pkg} accent={accent} gradientCss={gradientCss} isHovered={isHovered} btns={btns} onBtn={onBtn} onView={onView} />
          </div>
        ) : (
          <>
            <CardImage pkg={pkg} gradientCss={gradientCss} isHovered={isHovered} isTouch={isTouch} aspectClass={aspectClass} onView={onView} />
            <CardBody pkg={pkg} accent={accent} gradientCss={gradientCss} isHovered={isHovered} btns={btns} onBtn={onBtn} onView={onView} />
          </>
        )}
      </div>
    </div>
  );
}

const PackageGridLayout = ({ packages = [], btns = [], layout }) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  // Layout is chosen client-side on mount, so it's fresh on every page
  // render/visit and never causes a hydration mismatch.
  const [chosen, setChosen] = useState(null);

  const shuffled = useMemo(() => shuffleArray(packages), [packages]);

  useEffect(() => {
    setMounted(true);
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    // An explicit `layout` prop overrides the randomisation when provided.
    setChosen(LAYOUT_IDS.includes(layout) ? layout : LAYOUT_IDS[Math.floor(Math.random() * LAYOUT_IDS.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        window.location.href = `tel:${btn.number || "+918882128640"}`;
        break;
      default:
        setSelectedItem(pkg);
    }
  };

  if (!mounted || !chosen) return null;

  // shared props for every card
  const card = (pkg, i, extra = {}) => (
    <PackageCard
      key={pkg.id}
      pkg={pkg}
      index={i}
      isTouch={isTouch}
      hoveredId={hoveredId}
      setHoveredId={setHoveredId}
      btns={btns}
      onBtn={handleBtnClick}
      onView={() => setSelectedItem(pkg)}
      {...extra}
    />
  );

  const LAYOUTS = {
    // 1 · Pinterest-style masonry (original)
    masonry: (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        {shuffled.map((pkg, i) => (
          <div key={pkg.id} className="break-inside-avoid mb-5">
            {card(pkg, i, { aspectClass: ASPECT_CLASSES[i % ASPECT_CLASSES.length] })}
          </div>
        ))}
      </div>
    ),

    // 2 · Uniform equal-height grid
    grid: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shuffled.map((pkg, i) => card(pkg, i, { aspectClass: "aspect-[4/3]" }))}
      </div>
    ),

    // 3 · Hero-first: the top pick spans two columns
    featured: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shuffled.map((pkg, i) => (
          <div key={pkg.id} className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
            {card(pkg, i, { aspectClass: i === 0 ? "aspect-[16/9]" : "aspect-[4/3]" })}
          </div>
        ))}
      </div>
    ),

    // 4 · Mosaic: some cards go wide
    mosaic: (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {shuffled.map((pkg, i) => {
          const wide = i % 6 === 0;
          return (
            <div key={pkg.id} className={wide ? "col-span-2" : ""}>
              {card(pkg, i, { aspectClass: wide ? "aspect-[16/9]" : "aspect-square" })}
            </div>
          );
        })}
      </div>
    ),

    // 5 · Editorial list: horizontal rows
    list: (
      <div className="flex flex-col gap-5 max-w-4xl mx-auto">
        {shuffled.map((pkg, i) => card(pkg, i, { horizontal: true }))}
      </div>
    ),
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Ambient blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(139,92,246,0.08)" }} />
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(244,63,94,0.08)" }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(20,184,166,0.07)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {LAYOUTS[chosen] || LAYOUTS.masonry}
        </div>
      </div>

      {selectedItem && (
        <PopUpFeature selectedPackage={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
};

export default PackageGridLayout;
