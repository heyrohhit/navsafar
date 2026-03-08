"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { packages } from "../models/objAll/packages";

// ─────────────────────────────────────────────────────────────────────────────
// ROW 1 — MAIN CATEGORIES META
// ─────────────────────────────────────────────────────────────────────────────
const CAT_META = {
  international: { label: "International", emoji: "✈️",  tagline: "50+ destinations worldwide", accent: "#60a5fa", href: "/packages?category=international" },
  family:        { label: "Family",         emoji: "👨‍👩‍👧‍👦", tagline: "Memories built together",    accent: "#fb923c", href: "/packages?category=family"        },
  religion:      { label: "Religious",      emoji: "🕌",  tagline: "Sacred journeys & pilgrimages", accent: "#fbbf24", href: "/packages?category=religion"      },
  domestic:      { label: "Domestic",       emoji: "🇮🇳", tagline: "Explore incredible India",      accent: "#4ade80", href: "/packages?category=domestic"      },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROW 2 — TOURISM TYPE META (only top ones with good counts)
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_META = {
  Cultural:     { emoji: "🏛️", accent: "#c084fc", href: "/packages?type=Cultural"     },
  Urban:        { emoji: "🏙️", accent: "#60a5fa", href: "/packages?type=Urban"        },
  Beach:        { emoji: "🏖️", accent: "#22d3ee", href: "/packages?type=Beach"        },
  Heritage:     { emoji: "🏰", accent: "#fbbf24", href: "/packages?type=Heritage"     },
  Nature:       { emoji: "🌿", accent: "#4ade80", href: "/packages?type=Nature"       },
  Adventure:    { emoji: "🧗", accent: "#f97316", href: "/packages?type=Adventure"    },
  Luxury:       { emoji: "💎", accent: "#e879f9", href: "/packages?type=Luxury"       },
  Romantic:     { emoji: "💑", accent: "#fb7185", href: "/packages?type=Romantic"     },
  Religious:    { emoji: "🙏", accent: "#fde68a", href: "/packages?type=Religious"    },
  Historical:   { emoji: "🗿", accent: "#a3a3a3", href: "/packages?type=Historical"   },
  Shopping:     { emoji: "🛍️", accent: "#2dd4bf", href: "/packages?type=Shopping"    },
  Nightlife:    { emoji: "🎆", accent: "#a78bfa", href: "/packages?type=Nightlife"    },
  Wildlife:     { emoji: "🦁", accent: "#86efac", href: "/packages?type=Wildlife"     },
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILD DATA
// ─────────────────────────────────────────────────────────────────────────────
function buildCategoryCards() {
  const map = {};
  packages.forEach((pkg) => {
    (pkg.category ?? []).forEach((cat) => {
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

function buildTypeCards() {
  const map = {};
  packages.forEach((pkg) => {
    (pkg.tourism_type ?? []).forEach((t) => {
      if (!TYPE_META[t]) return; // only keep defined types
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

const CAT_CARDS  = buildCategoryCards();
const TYPE_CARDS = buildTypeCards();

// ─────────────────────────────────────────────────────────────────────────────
// CARD COMPONENT — used for both rows (slightly different sizes)
// ─────────────────────────────────────────────────────────────────────────────
function SliderCard({ item, cardW, cardH, showCities = true }) {
  const [imgIdx,  setImgIdx]  = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (item.images.length < 2) return;
    const id = setInterval(() => setImgIdx((p) => (p + 1) % item.images.length), 3000 + Math.random() * 1000);
    return () => clearInterval(id);
  }, [item.images.length]);

  return (
    <div
      style={{
        position:     "relative",
        width:         cardW,
        height:        cardH,
        borderRadius:  18,
        overflow:      "hidden",
        flexShrink:    0,
        border:        `1px solid ${hovered ? item.accent + "55" : "rgba(255,255,255,0.06)"}`,
        transform:     hovered ? "translateY(-5px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow:     hovered ? `0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px ${item.accent}20` : "0 4px 20px rgba(0,0,0,0.3)",
        transition:    "all 0.38s cubic-bezier(0.4,0,0.2,1)",
        cursor:        "pointer",
        scrollSnapAlign: "start",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Crossfade images */}
      {item.images.map((src, i) => (
        <div key={src} style={{ position: "absolute", inset: 0, opacity: i === imgIdx ? 1 : 0, transition: "opacity 1.3s ease" }}>
          <Image src={src} alt={item.label} fill sizes={`${cardW}px`} className="object-cover"
            style={{ transform: hovered && i === imgIdx ? "scale(1.1)" : "scale(1.04)", transition: "transform 6s ease" }}
            priority={i === 0} />
        </div>
      ))}

      {/* Overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.1) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 35%)" }} />

      {/* Top — count + dots */}
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 100, backdropFilter: "blur(8px)",
          background: `${item.accent}22`, border: `1px solid ${item.accent}50`, color: item.accent,
        }}>
          {item.count} Packages
        </span>
        {item.images.length > 1 && (
          <div style={{ display: "flex", gap: 3 }}>
            {item.images.map((_, i) => (
              <div key={i} style={{
                width: i === imgIdx ? 14 : 4, height: 4, borderRadius: 100,
                background: i === imgIdx ? item.accent : "rgba(255,255,255,0.3)",
                transition: "all 0.35s",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: cardH > 260 ? 22 : 18 }}>{item.emoji}</span>
          <h3 style={{
            fontFamily: "Georgia, serif", fontSize: cardH > 260 ? 20 : 16,
            fontWeight: 900, color: hovered ? item.accent : "white",
            lineHeight: 1.1, margin: 0, transition: "color 0.3s",
          }}>
            {item.label}
          </h3>
        </div>

        {item.tagline && (
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginBottom: 8 }}>
            {item.tagline}
          </p>
        )}

        {showCities && item.cities.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
            {item.cities.slice(0, 3).map((city) => (
              <span key={city} style={{
                fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 100,
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)",
              }}>{city}</span>
            ))}
          </div>
        )}

        <Link href={item.href} onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 12px", borderRadius: 10,
            background: hovered ? item.accent : `${item.accent}18`,
            border: `1px solid ${item.accent}40`,
            color: hovered ? "#000" : item.accent,
            fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase",
            textDecoration: "none", transition: "all 0.3s",
            boxShadow: hovered ? `0 6px 20px ${item.accent}40` : "none",
          }}
        >
          Explore
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ transform: hovered ? "translateX(3px)" : "none", transition: "transform 0.3s" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL ROW — reusable for both rows
// ─────────────────────────────────────────────────────────────────────────────
function CarouselRow({ items, cardW, cardH, showCities, label, accent, autoDelay = 4000 }) {
  const trackRef                = useRef(null);
  const autoRef                 = useRef(null);
  const [current, setCurrent]   = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart               = useRef(0);
  const scrollStart             = useRef(0);
  const STEP                    = cardW + 16;

  const scrollTo = useCallback((idx) => {
    const n = ((idx % items.length) + items.length) % items.length;
    setCurrent(n);
    trackRef.current?.scrollTo({ left: n * STEP, behavior: "smooth" });
  }, [items.length, STEP]);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((p) => {
        const n = (p + 1) % items.length;
        trackRef.current?.scrollTo({ left: n * STEP, behavior: "smooth" });
        return n;
      });
    }, autoDelay);
  }, [items.length, STEP, autoDelay]);

  const stopAuto = useCallback(() => { if (autoRef.current) clearInterval(autoRef.current); }, []);

  useEffect(() => { startAuto(); return stopAuto; }, [startAuto, stopAuto]);

  const onScroll = useCallback(() => {
    if (!trackRef.current) return;
    setCurrent(Math.round(trackRef.current.scrollLeft / STEP) % items.length);
  }, [STEP, items.length]);

  const onMouseDown = (e) => { setDragging(true); stopAuto(); dragStart.current = e.clientX; scrollStart.current = trackRef.current?.scrollLeft ?? 0; };
  const onMouseMove = (e) => { if (!dragging || !trackRef.current) return; trackRef.current.scrollLeft = scrollStart.current - (e.clientX - dragStart.current); };
  const onMouseUp   = () => { setDragging(false); onScroll(); startAuto(); };
  const touchStart  = useRef(0);
  const onTouchStart = (e) => { stopAuto(); touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) diff > 0 ? scrollTo(current + 1) : scrollTo(current - 1);
    else startAuto();
  };

  const activeAccent = items[current]?.accent ?? accent;

  return (
    <div>
      {/* Row header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 3, height: 22, borderRadius: 4, background: activeAccent, transition: "background 0.5s" }} />
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            {label}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Dots */}
          <div style={{ display: "flex", gap: 4 }}>
            {items.map((_, i) => (
              <button key={i} onClick={() => { stopAuto(); scrollTo(i); startAuto(); }}
                style={{
                  width: i === current ? 20 : 5, height: 5, borderRadius: 100, border: "none", cursor: "pointer", padding: 0,
                  background: i === current ? activeAccent : "rgba(255,255,255,0.15)",
                  boxShadow: i === current ? `0 0 10px ${activeAccent}60` : "none",
                  transition: "all 0.35s ease",
                }} />
            ))}
          </div>
          {/* Arrows */}
          {[
            { d: "M15 19l-7-7 7-7", fn: () => { stopAuto(); scrollTo(current - 1); startAuto(); } },
            { d: "M9 5l7 7-7 7",    fn: () => { stopAuto(); scrollTo(current + 1); startAuto(); } },
          ].map(({ d, fn }, i) => (
            <button key={i} onClick={fn} style={{
              width: 32, height: 32, borderRadius: "50%", border: `1px solid ${activeAccent}40`,
              background: `${activeAccent}15`, color: activeAccent, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s",
            }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={d} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{
          display: "flex", gap: 16,
          overflowX: "auto", scrollbarWidth: "none",
          cursor: dragging ? "grabbing" : "grab",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 4, userSelect: "none",
        }}
      >
        {items.map((item) => (
          <SliderCard key={item.id} item={item} cardW={cardW} cardH={cardH} showCities={showCities} />
        ))}
        <div style={{ width: 20, flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function ExperienceCategories() {
  return (
    <section style={{ background: "#060f11", padding: "72px 0 80px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Section Header ── */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 10, fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#4db8cc", border: "1px solid rgba(77,184,204,0.3)", background: "rgba(77,184,204,0.08)",
            padding: "6px 18px", borderRadius: 100, marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4db8cc" }} />
            Travel Categories
          </span>
          <h2 style={{
            fontFamily: "Georgia, serif", fontSize: "clamp(2rem,4vw,2.8rem)",
            fontWeight: 900, color: "white", lineHeight: 1.15, margin: "0 0 10px",
          }}>
            Find Your{" "}
            <span style={{ fontStyle: "italic", color: "#4db8cc" }}>Perfect Trip</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: 0 }}>
            {packages.length}+ packages · browse by trip type or travel style
          </p>
        </div>

        {/* ══════════════════════════════════════════════
            ROW 1 — MAIN CATEGORIES
        ══════════════════════════════════════════════ */}
        <div style={{ marginBottom: 44 }}>
          <CarouselRow
            items={CAT_CARDS}
            cardW={290}
            cardH={340}
            showCities={true}
            label="Browse by Trip Type"
            accent="#4db8cc"
            autoDelay={4200}
          />
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 36,
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>
            or explore by travel style
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* ══════════════════════════════════════════════
            ROW 2 — TOURISM TYPES
        ══════════════════════════════════════════════ */}
        <CarouselRow
          items={TYPE_CARDS}
          cardW={220}
          cardH={270}
          showCities={false}
          label="Browse by Travel Style"
          accent="#a78bfa"
          autoDelay={3500}
        />

      </div>
    </section>
  );
}