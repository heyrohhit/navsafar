"use client";
import { useState, useEffect, useMemo } from "react";
import { packages } from "../models/objAll/packages";
import ModernFilterSection, { applyFilters } from "../components/packages/ModernFilterSection";
import PackageGridLayout from "../components/packages/PackageGridLayout";
import { Link } from "lucide-react";

const TourPackages = () => {
  const [isLoaded, setIsLoaded]                     = useState(false);

  // ── Filter state (lifted here, passed down to ModernFilterSection) ──
  const [selectedCategory,    setSelectedCategory]    = useState("all");
  const [selectedTourismType, setSelectedTourismType] = useState("all");
  const [sortBy,              setSortBy]              = useState("default");
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  // ── Derived filtered list (recalculates whenever filters change) ──
  const filteredPackages = useMemo(
    () =>
      applyFilters(packages, {
        category:    selectedCategory,
        tourismType: selectedTourismType,
        sortBy,
      }),
    [selectedCategory, selectedTourismType, sortBy]
  );

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedTourismType("all");
    setSortBy("default");
  };

  return (
    <div
      className="min-h-screen bg-[#fff]"
    >
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden">
        {/* Ambient background blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "rgba(56,189,248,0.07)" }}
          />
          <div
            className="absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-3xl"
            style={{ background: "rgba(139,92,246,0.07)" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 transition-all duration-700"
              style={{
                background:   "rgba(14,165,233,0.08)",
                borderColor:  "rgba(14,165,233,0.25)",
                opacity:       isLoaded ? 1 : 0,
                transform:     isLoaded ? "translateY(0)" : "translateY(16px)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#38bdf8" }}
              />
              <span style={{ color: "#7dd3fc", fontSize: "0.85rem", fontWeight: 600 }}>
                ✈️ Premium Travel Packages
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-5xl md:text-7xl font-black text-black mb-6 leading-tight transition-all duration-700"
              style={{
                transitionDelay: "100ms",
                opacity:   isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(16px)",
              }}
            >
              Discover Your
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #f472b6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Dream Destination
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed transition-all duration-700"
              style={{
                transitionDelay: "200ms",
                opacity:   isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(16px)",
              }}
            >
              Handpicked travel experiences across 50 destinations — price customised
              to your budget after a quick conversation.
            </p>

            {/* Stats */}
            <div
              className="flex flex-wrap justify-center gap-10 mt-12 transition-all duration-700"
              style={{
                transitionDelay: "300ms",
                opacity:   isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(16px)",
              }}
            >
              {[
                { num: "50+",  label: "Destinations",       color: "#38bdf8" },
                { num: "5",    label: "Travel Categories",   color: "#818cf8" },
                { num: "100%", label: "Custom Pricing",      color: "#f472b6" },
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

        {/* Filter Section */}
        <div
          className="mb-10 transition-all duration-700"
          style={{
            transitionDelay: "400ms",
            opacity:   isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(16px)",
          }}
        >
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

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🗺️</p>
            <h3 className="text-white text-xl font-bold mb-2">
              No packages found
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Try changing the filters to explore more destinations.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Package Grid */}
        {filteredPackages.length > 0 && (
          <PackageGridLayout
            packages={filteredPackages}
            btns={[
              { label: "View Details",  type: "viewDetails" },
              { label: "📲 Get Query", type: "getQuery"     },
            ]}
          />
        )}

        {/* CTA Banner */}
        {filteredPackages.length > 0 && (
          <div
            className="mt-16 rounded-3xl p-12 text-center transition-all duration-700"
            style={{
              background:    "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(129,140,248,0.15))",
              border:        "1px solid rgba(14,165,233,0.2)",
              transitionDelay: "600ms",
              opacity:   isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <h3 className="text-2xl font-bold text-[#0f6177] mb-3">
              Can't find what you're looking for?
            </h3>
            <p className="text-slate-400 mb-8">
              Let us build a custom package tailored to your exact budget & dates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="tel:+918882128640"
                className="px-8 py-3.5 rounded-2xl font-semibold text-[#0f6177] transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                📞 Call Us
              </Link>
              <Link
                href={`https://wa.me/918882128640?text=${encodeURIComponent("Hi! I need help planning a custom trip.")}`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-2xl font-semibold text-white transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #25d366, #128c7e)",
                  boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                }}
              >
                💬 WhatsApp Us
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      {/* <div
        className="py-16 text-center"
        style={{ background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-white mb-3">
            Ready to Start Your Journey?
          </h3>
          <p className="text-slate-400 mb-8">
            Every price is tailored to you — tell us your budget and we'll make it happen.
          </p>
          <a
            href="tel:+918700750589"
            className="inline-block px-10 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #818cf8)",
              boxShadow: "0 8px 30px rgba(14,165,233,0.35)",
            }}
          >
            🚀 Plan My Trip
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default TourPackages;