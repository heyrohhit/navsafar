// src/app/components/packages/FeaturedPackages.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Uses usePackages() hook — fetches from /api/packages (which reads
// packagesData.json first, then falls back to static packages.js).
// Admin changes → packagesData.json → API → hook → this component ✅
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePackages } from "../../hooks/usePackages";
import PackageGridLayout from "./PackageGridLayout";

const FeaturedPackages = () => {
  const [showAll, setShowAll] = useState(false);
  const { packages, loading } = usePackages();

  const display = showAll
    ? packages
    : packages.filter((p) => p.popular === true || p.popular === "true").slice(0, 5);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-5xl font-bold text-[#04acac]">
          {showAll ? "All Travel Packages" : "Featured Packages"}
        </h2>
        <span className="text-gray-400 text-xl">
          Discover Our Signature Travel Packages.
        </span>
      </div>

      {loading ? (
        <div className="text-center text-gray-300 py-16">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#04acac] rounded-full animate-spin mb-4" />
          <p className="text-base">Loading packages…</p>
        </div>
      ) : display.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-5xl mb-4">🎒</p>
          <p className="text-lg">No featured packages yet.</p>
        </div>
      ) : (
        <PackageGridLayout
          packages={display}
          btns={[
            { label: "View Details", type: "viewDetails" },
            { label: "Get Query",    type: "getQuery"    },
          ]}
        />
      )}

      <div className="text-center mt-12">
        <Link
          href="/packages"
          className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-600 transition-all"
        >
          View All Packages
        </Link>
      </div>
    </section>
  );
};

export default FeaturedPackages;