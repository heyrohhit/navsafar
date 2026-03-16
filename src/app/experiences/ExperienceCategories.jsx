// src/app/experiences/ExperienceCategories.jsx
// Uses usePackages hook — cards built dynamically from live package data
"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePackages } from "../hooks/usePackages";

// ── Category meta ─────────────────────────────────────────────────
const CAT_META = {
  international: { label: "International",  emoji: "✈️",  accent: "#38bdf8", slug: "international" },
  domestic:      { label: "Domestic India",  emoji: "🇮🇳", accent: "#4ade80", slug: "domestic" },
  family:        { label: "Family",         emoji: "👨‍👩‍👧‍👦", accent: "#fb923c", slug: "family" },
  religion:      { label: "Religious",      emoji: "🕌",  accent: "#fbbf24", slug: "religion" },
};

const TYPE_META = {
  Cultural:   { emoji: "🎭", accent: "#c084fc", slug: "cultural"   },
  Heritage:   { emoji: "🏰", accent: "#fb923c", slug: "historical" },
  Beach:      { emoji: "🏖️", accent: "#22d3ee", slug: "beach"      },
  Adventure:  { emoji: "🏔️", accent: "#f97316", slug: "adventure"  },
  Luxury:     { emoji: "💎", accent: "#e879f9", slug: "luxury"     },
  Wildlife:   { emoji: "🦁", accent: "#a3e635", slug: "wildlife"   },
  Romantic:   { emoji: "💑", accent: "#f472b6", slug: "romantic"   },
  Historical: { emoji: "🗿", accent: "#94a3b8", slug: "historical" },
  Urban:      { emoji: "🏙️", accent: "#60a5fa", slug: "urban"      },
};

function buildCategoryCards(packages) {
  const map = {};
  packages.forEach((pkg) => {
    (pkg.category ?? []).forEach((cat) => {
      if (!CAT_META[cat]) return;
      if (!map[cat]) map[cat] = { id: cat, images: [], cities: [], count: 0 };
      map[cat].count++;
      if (map[cat].images.length < 5) map[cat].images.push(pkg.image);
      if (map[cat].cities.length < 6) map[cat].cities.push(pkg.city);
    });
  });
  return Object.entries(map)
    .filter(([key]) => CAT_META[key])
    .map(([key, data]) => ({ ...data, ...CAT_META[key], id: key }));
}

function buildTypeCards(packages) {
  const map = {};
  packages.forEach((pkg) => {
    (pkg.tourism_type ?? []).forEach((t) => {
      if (!TYPE_META[t]) return;
      if (!map[t]) map[t] = { id: t, images: [], cities: [], count: 0 };
      map[t].count++;
      if (map[t].images.length < 5) map[t].images.push(pkg.image);
      if (map[t].cities.length < 5) map[t].cities.push(pkg.city);
    });
  });
  return Object.entries(map)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([key, data]) => ({ ...data, label: key, ...TYPE_META[key], id: key }));
}

// ── Slider card ───────────────────────────────────────────────────
function SliderCard({ item, cardW, cardH }) {
  const [imgIdx,  setImgIdx]  = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (item.images.length < 2) return;
    const id = setInterval(() => setImgIdx((p) => (p + 1) % item.images.length), 3000 + Math.random() * 1000);
    return () => clearInterval(id);
  }, [item.images.length]);

  const href = `/experiences/${item.slug}`;

  return (
    <Link href={href} style={{ display: "block", textDecoration: "none" }}>
      <div
        style={{
          position: "relative", width: cardW, height: cardH, borderRadius: 18,
          overflow: "hidden", flexShrink: 0,
          border: `1px solid ${hovered ? item.accent + "55" : "rgba(255,255,255,0.06)"}`,
          transform: hovered ? "translateY(-5px) scale(1.01)" : "none",
          boxShadow: hovered ? `0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px ${item.accent}20` : "0 4px 20px rgba(0,0,0,0.3)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          cursor: "pointer", scrollSnapAlign: "start",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>

        {/* Images */}
        {item.images.map((src, i) => (
          <div key={src} style={{ position: "absolute", inset: 0, opacity: i === imgIdx ? 1 : 0, transition: "opacity 1.3s ease" }}>
            <Image src={src} alt={item.label} fill sizes={`${cardW}px`} className="object-cover"
              style={{ transform: hovered && i === imgIdx ? "scale(1.04)" : "scale(1)", transition: "transform 8s ease" }} />
          </div>
        ))}

        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)` }} />

        {/* Content */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 14px" }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{item.emoji}</div>
          <div style={{ fontWeight: 900, fontSize: 14, color: "#fff", marginBottom: 2 }}>{item.label}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
            {item.count} package{item.count !== 1 ? "s" : ""}
          </div>
          {item.cities?.length > 0 && (
            <div style={{ fontSize: 10, color: item.accent, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.cities.slice(0, 3).join(" · ")}
            </div>
          )}
        </div>

        {/* Hover glow */}
        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 80%, ${item.accent}18, transparent 70%)`, pointerEvents: "none" }} />
        )}
      </div>
    </Link>
  );
}

// ── Scrollable row ────────────────────────────────────────────────
function CardRow({ label, items, cardW, cardH }) {
  const trackRef   = useRef(null);
  const [current,  setCurrent]  = useState(0);
  const dragStart  = useRef(0);
  const scrollStart = useRef(0);
  const [dragging, setDragging] = useState(false);

  const onScroll = () => {
    if (!trackRef.current) return;
    const w = cardW + 16;
    setCurrent(Math.round(trackRef.current.scrollLeft / w));
  };

  function scrollTo(i) {
    const max = Math.max(items.length - 1, 0);
    const idx = Math.max(0, Math.min(max, i));
    trackRef.current?.scrollTo({ left: idx * (cardW + 16), behavior: "smooth" });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 3, height: 22, borderRadius: 4, background: items[current]?.accent ?? "#38bdf8" }} />
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            {label}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ d: "M15 19l-7-7 7-7", fn: () => scrollTo(current - 1) },
            { d: "M9 5l7 7-7 7",    fn: () => scrollTo(current + 1) }].map(({ d, fn }, i) => (
            <button key={i} onClick={fn} style={{
              width: 32, height: 32, borderRadius: "50%", border: `1px solid rgba(255,255,255,0.15)`,
              background: "rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={d} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div ref={trackRef} onScroll={onScroll}
        onMouseDown={(e) => { setDragging(true); dragStart.current = e.clientX; scrollStart.current = trackRef.current.scrollLeft; }}
        onMouseMove={(e) => { if (!dragging || !trackRef.current) return; trackRef.current.scrollLeft = scrollStart.current - (e.clientX - dragStart.current); }}
        onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
        style={{ display: "flex", gap: 16, overflowX: "auto", scrollbarWidth: "none", cursor: dragging ? "grabbing" : "grab", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", paddingBottom: 4, userSelect: "none" }}>
        {items.map((item) => (
          <SliderCard key={item.id} item={item} cardW={cardW} cardH={cardH} />
        ))}
        <div style={{ width: 20, flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function ExperienceCategories() {
  const { packages } = usePackages();

  const catCards  = useMemo(() => buildCategoryCards(packages), [packages]);
  const typeCards = useMemo(() => buildTypeCards(packages),     [packages]);

  return (
    <section style={{ background: "#060f11", padding: "72px 0 80px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", color: "#4db8cc", border: "1px solid #4db8cc30", background: "#4db8cc0f", padding: "8px 20px", borderRadius: 40, marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4db8cc", animation: "pulse 2s infinite" }} />
            Explore by Category
          </span>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 14 }}>
            What Kind of Trip<br /><span style={{ color: "#4db8cc" }}>Are You Planning?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
            Hover over a card to preview destinations. Click to explore packages.
          </p>
        </div>

        {/* Destination type row */}
        {catCards.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <CardRow label="Destination Type" items={catCards} cardW={200} cardH={260} />
          </div>
        )}

        {/* Tourism type row */}
        {typeCards.length > 0 && (
          <CardRow label="Travel Style" items={typeCards} cardW={170} cardH={220} />
        )}
      </div>
    </section>
  );
}