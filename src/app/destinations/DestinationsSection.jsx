"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, X, Star, Clock, Globe,
  ChevronDown, Compass, Layers, List,
} from "lucide-react";

// ─── Package Data ──────────────────────────────────────────────────────────────
// Adjust this import path to match your project structure
import ALL_PACKAGES_RAW from "../../data/packagesData.json";

// ─── Normalize JSON → component shape ────────────────────────────────────────
const ALL_PACKAGES = ALL_PACKAGES_RAW.map((pkg) => ({
  id:           pkg.id,
  city:         pkg.city,
  country:      pkg.country,
  image:        pkg.image,
  title:        pkg.title,
  tagline:      pkg.tagline || "",
  duration:     pkg.duration,
  rating:       pkg.rating,
  popular:      pkg.popular,
  tourism_type: pkg.tourism_type || [],
}));

// ─── Regions (NO "All" entry) ─────────────────────────────────────────────────
const REGIONS = [
  { id: "europe",     label: "Europe",   emoji: "🏰" },
  { id: "asia",       label: "Asia",     emoji: "🏯" },
  { id: "middleeast", label: "Mid East", emoji: "🕌" },
  { id: "americas",   label: "Americas", emoji: "🗽" },
  { id: "africa",     label: "Africa",   emoji: "🦁" },
  { id: "oceania",    label: "Oceania",  emoji: "🦘" },
  { id: "india",      label: "India",    emoji: "🇮🇳" },
];

const COUNTRY_REGION = {
  France: "europe", UK: "europe", Italy: "europe", Spain: "europe",
  Netherlands: "europe", "Czech Republic": "europe", Austria: "europe",
  Greece: "europe", Switzerland: "europe",
  UAE: "middleeast", Turkey: "middleeast", Israel: "middleeast",
  Thailand: "asia", Singapore: "asia", Japan: "asia", "South Korea": "asia",
  China: "asia", Malaysia: "asia", Indonesia: "asia", Nepal: "asia",
  USA: "americas", Canada: "americas", Mexico: "americas", Brazil: "americas",
  Argentina: "americas", Peru: "americas",
  "South Africa": "africa", Morocco: "africa", Egypt: "africa",
  Kenya: "africa", Zimbabwe: "africa",
  Australia: "oceania", "New Zealand": "oceania",
  India: "india",
};

function buildGroups(pkgs) {
  const map = {};
  pkgs.forEach((pkg) => {
    const region = COUNTRY_REGION[pkg.country] || "europe";
    if (!map[pkg.country]) {
      map[pkg.country] = {
        country: pkg.country, region,
        image: pkg.image, packages: [],
        topRating: 0, hasPopular: false,
      };
    }
    const g = map[pkg.country];
    g.packages.push(pkg);
    if (pkg.rating > g.topRating) { g.topRating = pkg.rating; g.image = pkg.image; }
    if (pkg.popular) g.hasPopular = true;
  });
  return Object.values(map).sort((a, b) => b.packages.length - a.packages.length);
}

// ─── 6 Themes ─────────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "ocean",
    sectionWrap:    "bg-gradient-to-b from-sky-50 via-white to-sky-50/30",
    heading:        "text-slate-900",   sub: "text-slate-500",     accent: "text-sky-600",
    sectionLabel:   "text-sky-500",     textMuted: "text-slate-400",
    filterOn:       "bg-sky-600 text-white shadow-sm shadow-sky-200",
    filterOff:      "bg-white text-slate-600 border border-neutral-200 hover:border-sky-300 hover:text-sky-600",
    countOn:        "bg-sky-800/25 text-white",  countOff: "bg-neutral-100 text-slate-500",
    cardRing:       "ring-2 ring-sky-500 shadow-xl shadow-sky-100",
    cardBadge:      "bg-sky-500 text-white",     cardPill: "bg-white/20 text-white",
    indicator:      "bg-sky-500",
    closeBtn:       "bg-white hover:bg-slate-100 text-slate-600 border border-neutral-200",
    divider:        "border-sky-100",    panelHeading: "text-slate-900",
    pkgCardBg:      "bg-white",          pkgCardBorder: "border-neutral-100 hover:border-sky-200",
    pkgTitle:       "text-slate-800",    pkgSub: "text-slate-500",  pkgAccent: "text-sky-600",
    starColor:      "text-amber-400 fill-amber-400",
    popularBadge:   "bg-sky-500 text-white",
    btn:            "bg-sky-600 hover:bg-sky-700 text-white",
    btnOut:         "border-2 border-sky-500 text-sky-600 hover:bg-sky-50",
    stripPanelOpen: "bg-sky-50 border border-sky-200",
    minimalBg:      "bg-white border border-neutral-200",
    minimalRow:     "hover:bg-sky-50/60 border-b border-neutral-100",
    mosaicOverlay:  "group-hover:bg-sky-500/30",
    accentHex:      "#0284c7",
    modalBg:        "bg-white",  modalHeading: "text-slate-900",  regionLabel: "text-sky-500",
  },
  {
    id: "desert",
    sectionWrap:    "bg-gradient-to-br from-amber-50 via-orange-50/30 to-stone-50",
    heading:        "text-stone-900",   sub: "text-stone-500",     accent: "text-amber-600",
    sectionLabel:   "text-amber-500",   textMuted: "text-stone-400",
    filterOn:       "bg-amber-500 text-white shadow-sm shadow-amber-200",
    filterOff:      "bg-white text-stone-600 border border-stone-200 hover:border-amber-400 hover:text-amber-700",
    countOn:        "bg-amber-900/20 text-white", countOff: "bg-stone-100 text-stone-500",
    cardRing:       "ring-2 ring-amber-400 shadow-xl shadow-amber-100",
    cardBadge:      "bg-amber-500 text-white",    cardPill: "bg-white/20 text-white",
    indicator:      "bg-amber-500",
    closeBtn:       "bg-white hover:bg-stone-100 text-stone-600 border border-stone-200",
    divider:        "border-amber-100",  panelHeading: "text-stone-900",
    pkgCardBg:      "bg-white",          pkgCardBorder: "border-stone-100 hover:border-amber-200",
    pkgTitle:       "text-stone-800",    pkgSub: "text-stone-500",  pkgAccent: "text-amber-600",
    starColor:      "text-amber-400 fill-amber-400",
    popularBadge:   "bg-amber-500 text-white",
    btn:            "bg-amber-500 hover:bg-amber-600 text-white",
    btnOut:         "border-2 border-amber-500 text-amber-600 hover:bg-amber-50",
    stripPanelOpen: "bg-amber-50 border border-amber-200",
    minimalBg:      "bg-white border border-stone-200",
    minimalRow:     "hover:bg-amber-50/60 border-b border-stone-100",
    mosaicOverlay:  "group-hover:bg-amber-500/30",
    accentHex:      "#f59e0b",
    modalBg:        "bg-amber-50", modalHeading: "text-stone-900", regionLabel: "text-amber-500",
  },
  {
    id: "forest",
    sectionWrap:    "bg-gradient-to-b from-emerald-50 via-green-50/20 to-white",
    heading:        "text-zinc-900",    sub: "text-zinc-500",      accent: "text-emerald-600",
    sectionLabel:   "text-emerald-500", textMuted: "text-zinc-400",
    filterOn:       "bg-emerald-600 text-white shadow-sm shadow-emerald-200",
    filterOff:      "bg-white text-zinc-600 border border-zinc-200 hover:border-emerald-400 hover:text-emerald-700",
    countOn:        "bg-emerald-900/20 text-white", countOff: "bg-zinc-100 text-zinc-500",
    cardRing:       "ring-2 ring-emerald-400 shadow-xl shadow-emerald-100",
    cardBadge:      "bg-emerald-500 text-white",   cardPill: "bg-white/20 text-white",
    indicator:      "bg-emerald-500",
    closeBtn:       "bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200",
    divider:        "border-emerald-100", panelHeading: "text-zinc-900",
    pkgCardBg:      "bg-white",           pkgCardBorder: "border-zinc-100 hover:border-emerald-200",
    pkgTitle:       "text-zinc-800",      pkgSub: "text-zinc-500",    pkgAccent: "text-emerald-600",
    starColor:      "text-emerald-500 fill-emerald-500",
    popularBadge:   "bg-emerald-500 text-white",
    btn:            "bg-emerald-600 hover:bg-emerald-700 text-white",
    btnOut:         "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50",
    stripPanelOpen: "bg-emerald-50 border border-emerald-200",
    minimalBg:      "bg-white border border-zinc-200",
    minimalRow:     "hover:bg-emerald-50/60 border-b border-zinc-100",
    mosaicOverlay:  "group-hover:bg-emerald-500/30",
    accentHex:      "#059669",
    modalBg:        "bg-emerald-50", modalHeading: "text-zinc-900", regionLabel: "text-emerald-500",
  },
  {
    id: "midnight",
    sectionWrap:    "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
    heading:        "text-white",       sub: "text-slate-400",     accent: "text-indigo-400",
    sectionLabel:   "text-indigo-400",  textMuted: "text-slate-500",
    filterOn:       "bg-indigo-500 text-white shadow-sm shadow-indigo-900",
    filterOff:      "bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500 hover:text-indigo-300",
    countOn:        "bg-white/15 text-white",  countOff: "bg-slate-700 text-slate-400",
    cardRing:       "ring-2 ring-indigo-500 shadow-xl shadow-indigo-900/40",
    cardBadge:      "bg-indigo-500 text-white", cardPill: "bg-white/15 text-white/80",
    indicator:      "bg-indigo-500",
    closeBtn:       "bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600",
    divider:        "border-slate-700",  panelHeading: "text-white",
    pkgCardBg:      "bg-slate-900",      pkgCardBorder: "border-slate-700 hover:border-indigo-600",
    pkgTitle:       "text-white",        pkgSub: "text-slate-400",  pkgAccent: "text-indigo-400",
    starColor:      "text-indigo-400 fill-indigo-400",
    popularBadge:   "bg-indigo-500 text-white",
    btn:            "bg-indigo-500 hover:bg-indigo-600 text-white",
    btnOut:         "border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-900/30",
    stripPanelOpen: "bg-slate-800 border border-slate-600",
    minimalBg:      "bg-slate-900 border border-slate-700",
    minimalRow:     "hover:bg-slate-800/80 border-b border-slate-800",
    mosaicOverlay:  "group-hover:bg-indigo-500/40",
    accentHex:      "#6366f1",
    modalBg:        "bg-slate-800", modalHeading: "text-white", regionLabel: "text-indigo-400",
  },
  {
    id: "sunset",
    sectionWrap:    "bg-gradient-to-br from-rose-50 via-pink-50/20 to-orange-50/30",
    heading:        "text-rose-950",   sub: "text-rose-400",      accent: "text-rose-600",
    sectionLabel:   "text-rose-500",   textMuted: "text-rose-300",
    filterOn:       "bg-rose-500 text-white shadow-sm shadow-rose-200",
    filterOff:      "bg-white text-rose-700 border border-rose-200 hover:border-rose-400 hover:text-rose-600",
    countOn:        "bg-rose-900/20 text-white", countOff: "bg-rose-100 text-rose-500",
    cardRing:       "ring-2 ring-rose-400 shadow-xl shadow-rose-100",
    cardBadge:      "bg-rose-500 text-white",    cardPill: "bg-white/25 text-white",
    indicator:      "bg-rose-500",
    closeBtn:       "bg-white hover:bg-rose-50 text-rose-600 border border-rose-200",
    divider:        "border-rose-100",  panelHeading: "text-rose-950",
    pkgCardBg:      "bg-white",         pkgCardBorder: "border-rose-100 hover:border-rose-300",
    pkgTitle:       "text-rose-900",    pkgSub: "text-rose-400",   pkgAccent: "text-rose-600",
    starColor:      "text-rose-400 fill-rose-400",
    popularBadge:   "bg-rose-500 text-white",
    btn:            "bg-rose-500 hover:bg-rose-600 text-white",
    btnOut:         "border-2 border-rose-500 text-rose-600 hover:bg-rose-50",
    stripPanelOpen: "bg-rose-50 border border-rose-200",
    minimalBg:      "bg-white border border-rose-100",
    minimalRow:     "hover:bg-rose-50/60 border-b border-rose-100",
    mosaicOverlay:  "group-hover:bg-rose-500/35",
    accentHex:      "#f43f5e",
    modalBg:        "bg-rose-50", modalHeading: "text-rose-950", regionLabel: "text-rose-500",
  },
  {
    id: "cosmic",
    sectionWrap:    "bg-slate-950",
    heading:        "text-white",       sub: "text-violet-300",    accent: "text-violet-400",
    sectionLabel:   "text-violet-400",  textMuted: "text-violet-400",
    filterOn:       "bg-violet-500 text-white shadow-sm shadow-violet-900",
    filterOff:      "bg-violet-950/70 text-violet-300 border border-violet-800 hover:border-violet-500 hover:text-violet-200",
    countOn:        "bg-white/15 text-white",   countOff: "bg-violet-900 text-violet-400",
    cardRing:       "ring-2 ring-violet-400 shadow-xl shadow-violet-900/50",
    cardBadge:      "bg-violet-500 text-white",  cardPill: "bg-white/15 text-white/80",
    indicator:      "bg-violet-500",
    closeBtn:       "bg-violet-900 hover:bg-violet-800 text-violet-300 border border-violet-700",
    divider:        "border-violet-800",  panelHeading: "text-white",
    pkgCardBg:      "bg-violet-900/60",   pkgCardBorder: "border-violet-700 hover:border-violet-500",
    pkgTitle:       "text-white",         pkgSub: "text-violet-300",  pkgAccent: "text-violet-400",
    starColor:      "text-violet-400 fill-violet-400",
    popularBadge:   "bg-violet-500 text-white",
    btn:            "bg-violet-500 hover:bg-violet-600 text-white",
    btnOut:         "border-2 border-violet-400 text-violet-300 hover:bg-violet-900/40",
    stripPanelOpen: "bg-violet-900/60 border border-violet-700",
    minimalBg:      "bg-violet-950 border border-violet-800",
    minimalRow:     "hover:bg-violet-900/40 border-b border-violet-900",
    mosaicOverlay:  "group-hover:bg-violet-500/40",
    accentHex:      "#8b5cf6",
    modalBg:        "bg-violet-950", modalHeading: "text-white", regionLabel: "text-violet-400",
  },
];

const LAYOUT_IDS  = ["bento", "editorial", "strips", "mosaic", "minimal"];
const LAYOUT_META = {
  bento:     { label: "Explore By Country",  title: "Popular Destinations",     Icon: Layers  },
  editorial: { label: "Curated Picks",       title: "Featured Destinations",    Icon: Compass },
  strips:    { label: "Around the World",    title: "Destinations at a Glance", Icon: Globe   },
  mosaic:    { label: "World Mosaic",        title: "Discover the Globe",       Icon: Globe   },
  minimal:   { label: "Travel Directory",    title: "All Destinations",         Icon: List    },
};

// ─── Package Mini Card ─────────────────────────────────────────────────────────
function PkgCard({ pkg, t, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: idx * 0.04 }}
      className={`group rounded-xl overflow-hidden border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${t.pkgCardBg} ${t.pkgCardBorder}`}
    >
      <Link href={`/destinations/[slug]/${pkg.id}`}>
        <div className="relative h-32 overflow-hidden">
          <img
            src={pkg.image} alt={pkg.city}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          {pkg.popular && (
            <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${t.popularBadge}`}>
              ★ Popular
            </span>
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <Star size={10} className={t.starColor} />
            <span className="text-white text-[11px] font-bold">{pkg.rating}</span>
          </div>
        </div>
        <div className="p-3">
          <h4 className={`font-bold text-xs leading-snug line-clamp-1 mb-1 ${t.pkgTitle}`}>
            {pkg.title}
          </h4>
          <div className={`flex items-center justify-between text-[10px] ${t.pkgSub}`}>
            <span className="flex items-center gap-1"><Clock size={9} />{pkg.duration}</span>
            <span className={`font-semibold flex items-center gap-0.5 ${t.pkgAccent}`}>
              View<ChevronRight size={9} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Centered Modal Popup ──────────────────────────────────────────────────────
function PackageModal({ group, t, onClose }) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = group ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [group]);

  // Escape key closes modal
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const regionObj = group ? REGIONS.find((r) => r.id === group.region) : null;

  return (
    <AnimatePresence>
      {group && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* ── Modal ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 28 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`pointer-events-auto w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${t.modalBg} ${t.divider}`}
            >
              {/* Header */}
              <div className={`flex items-start justify-between p-5 md:p-6 border-b flex-shrink-0 ${t.divider}`}>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${t.regionLabel}`}>
                    {regionObj?.emoji} {regionObj?.label}
                  </p>
                  <h3 className={`text-xl md:text-2xl font-extrabold ${t.modalHeading}`}>
                    {group.country}{" "}
                    <span className={t.accent}>
                      — {group.packages.length} Package{group.packages.length > 1 ? "s" : ""}
                    </span>
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className={`ml-4 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${t.closeBtn}`}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable package grid */}
              <div className="overflow-y-auto flex-1 p-5 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {group.packages.map((pkg, i) => (
                    <PkgCard key={pkg.id} pkg={pkg} t={t} idx={i} />
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className={`flex-shrink-0 p-4 border-t text-center ${t.divider}`}>
                <Link
                  href={`/packages?country=${encodeURIComponent(group.country)}`}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${t.btn}`}
                >
                  All {group.country} Packages <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── LAYOUT 1 · BENTO ─────────────────────────────────────────────────────────
function BentoLayout({ groups, openCountry, onCountryClick, t }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {groups.map((g, idx) => {
        const featured = idx % 5 === 0;
        const isOpen   = openCountry === g.country;
        const types    = [...new Set(g.packages.flatMap((p) => p.tourism_type))];
        return (
          <motion.div
            key={g.country}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: (idx % 8) * 0.05 }}
            onClick={() => onCountryClick(g.country)}
            className={`cursor-pointer relative rounded-2xl overflow-hidden shadow-md transition-all duration-300
              ${featured ? "col-span-2" : ""}
              ${isOpen ? t.cardRing : "hover:shadow-xl hover:-translate-y-1"}`}
          >
            <div className={`relative ${featured ? "h-72" : "h-52"}`}>
              <img
                src={g.image} alt={g.country}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className={`absolute top-3 right-3 text-[10px] font-black px-2 py-1 rounded-full ${t.cardBadge}`}>
                {g.packages.length} pkg{g.packages.length > 1 ? "s" : ""}
              </span>
              {g.hasPopular && (
                <span className="absolute top-3 left-3 text-[9px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full">
                  ✦ HOT
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className={`font-black leading-none mb-2 text-white ${featured ? "text-2xl" : "text-lg"}`}>
                  {g.country}
                </h3>
                <div className="flex items-end justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {types.slice(0, featured ? 3 : 2).map((tp) => (
                      <span key={tp} className={`text-[9px] px-1.5 py-0.5 rounded-full ${t.cardPill}`}>{tp}</span>
                    ))}
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
                  >
                    <ChevronDown size={14} className="text-white" />
                  </motion.div>
                </div>
              </div>
              {isOpen && <div className={`absolute bottom-0 left-0 right-0 h-1 ${t.indicator}`} />}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── LAYOUT 2 · EDITORIAL ─────────────────────────────────────────────────────
function EditorialLayout({ groups, openCountry, onCountryClick, t }) {
  const [hero, ...rest] = groups;
  const heroOpen        = openCountry === hero?.country;
  return (
    <div className="space-y-4">
      {hero && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onClick={() => onCountryClick(hero.country)}
          className={`cursor-pointer relative rounded-3xl overflow-hidden shadow-xl transition-all duration-300 ${heroOpen ? t.cardRing : "hover:shadow-2xl"}`}
        >
          <div className="relative h-80 md:h-[26rem]">
            <img src={hero.image} alt={hero.country} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <span className={`self-start text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${t.cardBadge}`}>
                ✦ Featured Destination
              </span>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2 leading-none">{hero.country}</h3>
              <p className="text-white/70 text-sm mb-5 max-w-md">
                {[...new Set(hero.packages.flatMap((p) => p.tourism_type))].join(" · ")}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-white font-bold text-sm">{hero.packages.length} Packages Available</span>
                <motion.div
                  animate={{ rotate: heroOpen ? 180 : 0 }}
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <ChevronDown size={16} className="text-white" />
                </motion.div>
              </div>
            </div>
          </div>
          {heroOpen && <div className={`h-1 ${t.indicator}`} />}
        </motion.div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {rest.map((g, idx) => {
          const isOpen = openCountry === g.country;
          return (
            <motion.div
              key={g.country}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: (idx % 10) * 0.04 }}
              onClick={() => onCountryClick(g.country)}
              className={`cursor-pointer relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${isOpen ? t.cardRing : "hover:shadow-lg hover:-translate-y-0.5"}`}
            >
              <div className="relative h-44">
                <img
                  src={g.image} alt={g.country}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <span className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full ${t.cardBadge}`}>
                  {g.packages.length}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
                  <h3 className="text-sm font-black text-white leading-tight">{g.country}</h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <ChevronDown size={11} className="text-white" />
                  </motion.div>
                </div>
              </div>
              {isOpen && <div className={`h-0.5 ${t.indicator}`} />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LAYOUT 3 · STRIPS ────────────────────────────────────────────────────────
function StripsLayout({ groups, openCountry, onCountryClick, t }) {
  return (
    <div className="flex flex-col gap-2.5">
      {groups.map((g, idx) => {
        const isOpen    = openCountry === g.country;
        const types     = [...new Set(g.packages.flatMap((p) => p.tourism_type))];
        const regionObj = REGIONS.find((r) => r.id === g.region);
        return (
          <motion.div
            key={g.country}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.28, delay: (idx % 12) * 0.025 }}
            onClick={() => onCountryClick(g.country)}
            className={`cursor-pointer group flex rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${isOpen ? t.cardRing : "hover:shadow-lg"}`}
          >
            <div className="relative w-36 sm:w-48 md:w-56 flex-shrink-0">
              <img
                src={g.image} alt={g.country}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20" />
              {isOpen && <div className={`absolute right-0 top-0 bottom-0 w-1 ${t.indicator}`} />}
            </div>
            <div className={`flex-1 flex items-center justify-between px-4 py-4 sm:px-5 border border-l-0 rounded-r-2xl transition-colors duration-300 ${isOpen ? t.stripPanelOpen : "bg-white border-neutral-100"}`}>
              <div className="min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${t.sectionLabel}`}>
                  {regionObj?.emoji} {regionObj?.label}
                </p>
                <h3 className={`font-black text-lg sm:text-xl mb-2 leading-none ${t.heading}`}>{g.country}</h3>
                <div className="flex flex-wrap gap-1">
                  {types.slice(0, 3).map((tp) => (
                    <span key={tp} className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${isOpen ? t.cardBadge : t.countOff}`}>{tp}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <div className="text-right hidden sm:block">
                  <p className={`text-2xl font-black leading-none ${t.accent}`}>{g.packages.length}</p>
                  <p className={`text-[10px] ${t.textMuted}`}>packages</p>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? t.cardBadge : t.countOff}`}
                >
                  <ChevronRight size={15} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── LAYOUT 4 · MOSAIC ────────────────────────────────────────────────────────
function MosaicLayout({ groups, openCountry, onCountryClick, t }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
      {groups.map((g, idx) => {
        const isOpen = openCountry === g.country;
        const isWide = idx === 0 || idx % 9 === 4;
        const isTall = idx % 7 === 2;
        return (
          <motion.div
            key={g.country}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.22, delay: (idx % 12) * 0.018 }}
            onClick={() => onCountryClick(g.country)}
            className={`cursor-pointer group relative rounded-xl overflow-hidden shadow-sm transition-all duration-300
              ${isWide ? "col-span-2" : ""}
              ${isOpen ? t.cardRing : "hover:shadow-lg"}`}
          >
            <div className={`relative ${isTall ? "aspect-[3/4]" : "aspect-square"}`}>
              <img
                src={g.image} alt={g.country}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-black/20 transition-colors duration-300 ${t.mosaicOverlay}`} />
              <span className={`absolute top-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full ${t.cardBadge}`}>
                {g.packages.length}
              </span>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white font-black text-center text-xs sm:text-sm px-2 leading-tight drop-shadow-lg">
                  {g.country}
                </p>
                {g.hasPopular && <span className="mt-1 text-[9px] text-amber-300 font-bold">★ Popular</span>}
              </div>
              {isOpen && <div className={`absolute bottom-0 left-0 right-0 h-1 ${t.indicator}`} />}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── LAYOUT 5 · MINIMAL ───────────────────────────────────────────────────────
function MinimalLayout({ groups, openCountry, onCountryClick, t }) {
  return (
    <div className={`rounded-2xl overflow-hidden ${t.minimalBg}`}>
      {groups.map((g, idx) => {
        const isOpen    = openCountry === g.country;
        const types     = [...new Set(g.packages.flatMap((p) => p.tourism_type))];
        const regionObj = REGIONS.find((r) => r.id === g.region);
        return (
          <motion.div
            key={g.country}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{ duration: 0.2, delay: (idx % 15) * 0.016 }}
            onClick={() => onCountryClick(g.country)}
            style={{ borderLeft: `3px solid ${isOpen ? t.accentHex : "transparent"}` }}
            className={`cursor-pointer group flex items-center gap-4 px-4 sm:px-6 py-3.5 transition-colors duration-200 ${t.minimalRow}`}
          >
            <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
              <img
                src={g.image} alt={g.country}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className={`font-black text-sm ${t.heading}`}>{g.country}</h3>
                <span className={`text-[11px] ${t.textMuted}`}>{regionObj?.emoji}</span>
                {g.hasPopular && <span className="text-[9px] text-amber-500 font-bold">★</span>}
              </div>
              <div className="flex gap-1 flex-wrap">
                {types.slice(0, 4).map((tp) => (
                  <span key={tp} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${t.countOff}`}>{tp}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <span className={`font-black text-xl leading-none ${t.accent}`}>{g.packages.length}</span>
                <p className={`text-[9px] ${t.textMuted}`}>pkgs</p>
              </div>
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
                <ChevronRight size={14} className={t.accent} />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DestinationsSection() {
  // 🎲 Every mount = random theme + layout (30 unique combos)
  const { t, layout } = useMemo(() => ({
    t:      THEMES[Math.floor(Math.random() * THEMES.length)],
    layout: LAYOUT_IDS[Math.floor(Math.random() * LAYOUT_IDS.length)],
  }), []);

  // Default to first region — NO "All" filter
  const [activeRegion, setActiveRegion] = useState(REGIONS[0].id);
  const [openCountry, setOpenCountry]   = useState(null);

  const allGroups = useMemo(() => buildGroups(ALL_PACKAGES), []);

  const filtered = useMemo(
    () => allGroups.filter((g) => g.region === activeRegion),
    [activeRegion, allGroups],
  );

  const openGroup = openCountry
    ? allGroups.find((g) => g.country === openCountry)
    : null;

  const handleCountry = (country) =>
    setOpenCountry((prev) => (prev === country ? null : country));

  const handleRegion = (id) => {
    setActiveRegion(id);
    setOpenCountry(null);
  };

  const LayoutMap  = { bento: BentoLayout, editorial: EditorialLayout, strips: StripsLayout, mosaic: MosaicLayout, minimal: MinimalLayout };
  const LayoutComp = LayoutMap[layout];
  const meta       = LAYOUT_META[layout];
  const { Icon }   = meta;

  return (
    <section className={`py-16 md:py-24 ${t.sectionWrap}`}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          <p className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-3 ${t.sectionLabel}`}>
            <Icon size={13} />{meta.label}
          </p>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 leading-none ${t.heading}`}>
            {meta.title}
          </h2>
          <p className={`text-sm max-w-md mx-auto ${t.sub}`}>
            Country par click karein — saare packages ek jagah dekhne ke liye
          </p>
        </motion.div>

        {/* Region Filters — "All" hata diya */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {REGIONS.map((r) => {
            const count = allGroups.filter((g) => g.region === r.id).length;
            if (!count) return null;
            const on = activeRegion === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRegion(r.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${on ? t.filterOn : t.filterOff}`}
              >
                <span>{r.emoji}</span>
                <span>{r.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${on ? t.countOn : t.countOff}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Country Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRegion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <LayoutComp
              groups={filtered}
              openCountry={openCountry}
              onCountryClick={handleCountry}
              t={t}
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/destinations"
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${t.btnOut}`}
          >
            Browse All Destinations <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Centered Modal — screen ke beech mein */}
      <PackageModal
        group={openGroup}
        t={t}
        onClose={() => setOpenCountry(null)}
      />
    </section>
  );
}