// src/app/search/page.jsx
"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePackages } from "../hooks/usePackages";

const WHATSAPP = "918882128640";

function PackageCard({ pkg, index }) {
  function handleWhatsApp() {
    const text = encodeURIComponent(
      `Namaste! I'm interested in this package:\n\n📦 ${pkg.title}\n📍 ${pkg.city}, ${pkg.country}\n⭐ Rating: ${pkg.rating}\n⏱ Duration: ${pkg.duration}`
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-lg">
      <div className="relative h-48">
        {pkg.image && <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white">{pkg.title}</h3>
        <p className="text-sm text-white/60 mt-1">📍 {pkg.city}, {pkg.country}</p>
        <p className="text-xs text-white/50 mt-1">{pkg.duration} • ⭐ {pkg.rating}</p>
        <p className="text-xs text-white/70 mt-2">{pkg.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(pkg.tourism_type ?? []).map((t, i) => (
            <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded">{t}</span>
          ))}
        </div>
        <motion.button onClick={handleWhatsApp} whileTap={{ scale: .96 }} whileHover={{ scale: 1.04 }}
          className="mt-4 w-full py-2.5 rounded-lg bg-green-500 text-black text-xs font-bold">
          📲 Book on WhatsApp
        </motion.button>
      </div>
    </motion.div>
  );
}

function SearchPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const query        = searchParams.get("q") || "";
  const [newSearch,  setNewSearch] = useState(query);

  const { packages } = usePackages();

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return packages.filter((pkg) => {
      const blob = [
        pkg.city, pkg.country, pkg.title, pkg.tagline,
        ...(pkg.tourism_type        ?? []),
        ...(pkg.category            ?? []),
        ...(pkg.famous_attractions  ?? []),
        ...(pkg.highlights          ?? []),
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [query, packages]);

  function handleSearch(e) {
    e.preventDefault();
    if (newSearch.trim()) router.push(`/search?q=${encodeURIComponent(newSearch.trim())}`);
  }

  return (
    <div className="min-h-screen bg-[#060f11] text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input value={newSearch} onChange={(e) => setNewSearch(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-white/40 outline-none focus:border-sky-400"
            placeholder="Search destinations, experiences…" />
          <button type="submit"
            className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition">
            Search
          </button>
        </form>

        {/* Results heading */}
        {query && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-white/60 text-sm mb-8">
            {results.length > 0
              ? `${results.length} result${results.length > 1 ? "s" : ""} for "${query}"`
              : `No results for "${query}"`}
          </motion.p>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <p className="text-6xl mb-4">🗺️</p>
            <h3 className="text-xl font-bold text-white mb-2">No destinations found</h3>
            <p className="text-white/50 text-sm">Try searching for a city, country, or experience type.</p>
          </motion.div>
        )}

        {/* Results grid */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060f11] flex items-center justify-center text-white/40">Loading…</div>}>
      <SearchPageInner />
    </Suspense>
  );
}