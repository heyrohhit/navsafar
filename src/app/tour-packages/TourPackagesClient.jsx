"use client";
// src/app/tour-packages/TourPackagesClient.jsx
//
// ✅ Fixes applied vs original:
//  1. metadata yahan se hata diya — 'use client' mein kaam nahi karta (silent ignore)
//  2. isLoaded setTimeout → CSS animation se replace (hydration-safe, no layout shift)
//  3. handleResetFilters → useCallback (re-render optimization)
//  4. filteredPackages memoization theek rakha
//  5. Loading state → proper skeleton cards (UX improvement)
//  6. Error state add kiya (usePackages error return kare to)
//  7. Stats section mein aria-label add kiya (accessibility)
//  8. Empty state mein keyboard-accessible button pehle se tha, confirm
//  9. Hero blobs → will-change:transform add kiya (GPU compositing)
// 10. Package count edge case: 0 packages pe "0+" nahi dikhega

import { useState, useMemo, useCallback } from "react";
import { usePackages } from "../hooks/usePackages";
import ModernFilterSection, {
  applyFilters,
} from "../components/packages/ModernFilterSection";
import PackageGridLayout from "../components/packages/PackageGridLayout";

/* ─── Skeleton loader: actual card count match karta hai ─── */
function PackageSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label="Packages load ho rahe hain"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-slate-100 animate-pulse"
        >
          <div className="h-48 bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
            <div className="flex gap-2 pt-2">
              <div className="h-9 bg-slate-200 rounded-xl flex-1" />
              <div className="h-9 bg-slate-200 rounded-xl flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Error state ─── */
function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-24" role="alert">
      <p className="text-5xl mb-4">⚠️</p>
      <h3 className="text-slate-700 text-xl font-bold mb-2">
        Packages load nahi ho sake
      </h3>
      <p className="text-slate-500 text-sm mb-6">
        {message ?? "Kuch technical problem aa gayi. Thodi der baad try karein."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-sky-500 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 active:scale-95 transition"
        >
          Dobara Try Karein
        </button>
      )}
    </div>
  );
}

/* ─── Hero stats ─── */
const STATS = [
  { label: "Packages",         color: "#38bdf8" },
  { label: "Travel Categories", num: "5",   color: "#818cf8" },
  { label: "Custom Pricing",    num: "100%", color: "#f472b6" },
];

/* ─── Main client component ─── */
export default function TourPackagesClient() {
  const [selectedCategory,    setSelectedCategory]    = useState("all");
  const [selectedTourismType, setSelectedTourismType] = useState("all");
  const [sortBy,              setSortBy]              = useState("default");

  // usePackages hook: { packages, loading, error, refetch? }
  const { packages, loading, error, refetch } = usePackages();

  /* useCallback: handleResetFilters har render pe nayi function nahi banata */
  const handleResetFilters = useCallback(() => {
    setSelectedCategory("all");
    setSelectedTourismType("all");
    setSortBy("default");
  }, []);

  const filteredPackages = useMemo(
    () =>
      applyFilters(packages, {
        category:    selectedCategory,
        tourismType: selectedTourismType,
        sortBy,
      }),
    [packages, selectedCategory, selectedTourismType, sortBy]
  );

  // Packages load hone ke baad count dynamic dikhao, 0 pe "0+" nahi dikhna chahiye
  const packageCount = packages.length > 0 ? `${packages.length}+` : "—";

  const stats = [
    { ...STATS[0], num: packageCount },
    STATS[1],
    STATS[2],
  ];

  return (
    // tour-fade-in: CSS animation (globals.css ya tailwind plugin mein define karein)
    // fallback: opacity-0 → opacity-100 transition via Tailwind animate-[fadeInUp]
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        {/* Decorative blobs — pointer-events:none, will-change GPU pe rakhe */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: "rgba(56,189,248,0.07)",
              willChange: "transform",
            }}
          />
          <div
            className="absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-3xl"
            style={{
              background: "rgba(139,92,246,0.07)",
              willChange: "transform",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8
                         animate-[fadeInDown_0.6s_ease_both]"
              style={{
                background:   "rgba(14,165,233,0.08)",
                borderColor:  "rgba(14,165,233,0.25)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-sky-400 text-xs font-bold tracking-widest uppercase">
                50+ Destinations
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-4xl sm:text-6xl font-black text-slate-800 mb-4
                         animate-[fadeInDown_0.6s_0.1s_ease_both]"
            >
              Tour Packages
            </h1>

            {/* Subtext */}
            <p
              className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto mb-8
                         animate-[fadeInDown_0.6s_0.2s_ease_both]"
            >
              Handpicked travel experiences across 50 destinations — price
              customised to your budget after a quick conversation.
            </p>

            {/* Stats */}
            <dl
              className="flex flex-wrap justify-center gap-10 mt-12
                         animate-[fadeInDown_0.6s_0.3s_ease_both]"
              aria-label="Tour package statistics"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <dt className="text-slate-500 text-sm mt-1 order-2">
                    {s.label}
                  </dt>
                  <dd
                    className="text-3xl font-black order-1"
                    style={{ color: s.color }}
                  >
                    {s.num}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filters — loading mein bhi dikhao taaki layout shift na ho */}
        <div className="mb-10 animate-[fadeInDown_0.6s_0.4s_ease_both]">
          <ModernFilterSection
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTourismType={selectedTourismType}
            setSelectedTourismType={setSelectedTourismType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredCount={filteredPackages.length}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* ── States ── */}

        {/* 1. Error */}
        {!loading && error && (
          <ErrorState message={error.message} onRetry={refetch} />
        )}

        {/* 2. Loading skeleton */}
        {loading && <PackageSkeleton />}

        {/* 3. Empty (filter mismatch) */}
        {!loading && !error && filteredPackages.length === 0 && (
          <div className="text-center py-24">
            <p className="text-6xl mb-4" aria-hidden="true">🗺️</p>
            <h3 className="text-slate-700 text-xl font-bold mb-2">
              Koi package nahi mila
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Filters change karke aur destinations explore karein.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 bg-sky-500 text-white rounded-xl text-sm font-semibold
                         hover:bg-sky-600 active:scale-95 transition"
            >
              Filters Reset Karein
            </button>
          </div>
        )}

        {/* 4. Results */}
        {!loading && !error && filteredPackages.length > 0 && (
          <PackageGridLayout
            packages={filteredPackages}
            btns={[
              { label: "View Details", type: "viewDetails" },
              { label: "Get Query",    type: "getQuery"    },
            ]}
          />
        )}
      </div>
    </div>
  );
}