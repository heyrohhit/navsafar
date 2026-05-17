// src/app/tour-packages/page.jsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { usePackages } from "../hooks/usePackages";
import ModernFilterSection, { applyFilters } from "../components/packages/ModernFilterSection";
import PackageGridLayout from "../components/packages/PackageGridLayout";
import Link from "next/link";

export const metadata = {
  title: "Tour Packages | Domestic & International - NavSafar",
  description: "Browse 50+ tour packages across domestic and international destinations. Best price guarantee, custom itineraries, flights, hotels included.",
  alternates: {
    canonical: "https://navsafar.com/tour-packages",
  },
  openGraph: {
    title: "Tour Packages | Domestic & International - NavSafar",
    description: "Browse 50+ tour packages across domestic and international destinations.",
    url: "https://navsafar.com/tour-packages",
    type: "website",
  },
};

const TourPackages = () => {
  const [isLoaded,            setIsLoaded]            = useState(false);
  const [selectedCategory,    setSelectedCategory]    = useState("all");
  const [selectedTourismType, setSelectedTourismType] = useState("all");
  const [sortBy,              setSortBy]              = useState("default");

  // ← API se fetch, static fallback automatic
  const { packages, loading } = usePackages();

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  const filteredPackages = useMemo(
    () => applyFilters(packages, { category: selectedCategory, tourismType: selectedTourismType, sortBy }),
    [packages, selectedCategory, selectedTourismType, sortBy]
  );

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedTourismType("all");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-[#fff]">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(56,189,248,0.07)" }} />
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(139,92,246,0.07)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 transition-all duration-700"
              style={{ background: "rgba(14,165,233,0.08)", borderColor: "rgba(14,165,233,0.25)", opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(16px)" }}>
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-sky-400 text-xs font-bold tracking-widest uppercase">50+ Destinations</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-800 mb-4 transition-all duration-700"
              style={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(16px)", transitionDelay: "100ms" }}>
              Tour Packages
            </h1>

            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto mb-8 transition-all duration-700"
              style={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(16px)", transitionDelay: "200ms" }}>
              Handpicked travel experiences across 50 destinations — price customised to your budget after a quick conversation.
            </p>

            <div className="flex flex-wrap justify-center gap-10 mt-12 transition-all duration-700"
              style={{ transitionDelay: "300ms", opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(16px)" }}>
              {[
                { num: `${packages.length}+`, label: "Packages",         color: "#38bdf8" },
                { num: "5",                   label: "Travel Categories", color: "#818cf8" },
                { num: "100%",                label: "Custom Pricing",    color: "#f472b6" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black" style={{ color: s.color }}>{s.num}</div>
                  <div className="text-slate-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 transition-all duration-700"
          style={{ transitionDelay: "400ms", opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(16px)" }}>
          <ModernFilterSection
            selectedCategory={selectedCategory}    setSelectedCategory={setSelectedCategory}
            selectedTourismType={selectedTourismType} setSelectedTourismType={setSelectedTourismType}
            sortBy={sortBy}                        setSortBy={setSortBy}
            filteredCount={filteredPackages.length} onResetFilters={handleResetFilters}
          />
        </div>

        {loading && (
          <div className="text-center py-24 text-slate-400 text-lg">Loading packages…</div>
        )}

        {!loading && filteredPackages.length === 0 && (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🗺️</p>
            <h3 className="text-slate-700 text-xl font-bold mb-2">No packages found</h3>
            <p className="text-slate-500 text-sm mb-6">Try changing the filters to explore more destinations.</p>
            <button onClick={handleResetFilters}
              className="px-6 py-3 bg-sky-500 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition">
              Reset Filters
            </button>
          </div>
        )}

        {!loading && filteredPackages.length > 0 && (
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
};

export default TourPackages;