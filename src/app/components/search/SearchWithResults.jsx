"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Package, Loader2 } from "lucide-react";

const QUICK_SEARCHES = [
  { label: "Goa Packages", query: "goa", type: "packages" },
  { label: "Manali Tours", query: "manali", type: "packages" },
  { label: "Kerala Backwaters", query: "kerala", type: "destinations" },
  { label: "Honeymoon", query: "honeymoon", type: "all" },
  { label: "Family Packages", query: "family", type: "all" },
  { label: "International", query: "international", type: "packages" },
];

export default function SearchWithResults() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
          const json = await res.json();
          if (json.success) {
            setResults(json.data);
            setHasSearched(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults(null);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
    }
  };

  const handleQuickSearch = (quickQuery, type) => {
    setQuery(quickQuery);
    setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(quickQuery)}&type=${type}`);
      setShowResults(false);
    }, 100);
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setHasSearched(false);
  };

  const totalResults = results ? (results.packages?.length || 0) + (results.destinations?.length || 0) : 0;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            placeholder="Search destinations, packages, hotels..."
            className="w-full pl-12 pr-12 py-4 bg-white border-2 border-neutral-200 rounded-2xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-lg"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (query.length >= 2 || hasSearched) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 max-h-96 overflow-y-auto z-50"
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary-500" size={24} />
                <span className="ml-3 text-neutral-600">Searching...</span>
              </div>
            ) : totalResults > 0 ? (
              <>
                {/* Packages Results */}
                {results.packages?.length > 0 && (
                  <div className="p-4 border-b border-neutral-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 mb-3">
                      <Package size={16} />
                      <span>Packages ({results.packages.length})</span>
                    </div>
                    <div className="space-y-2">
                      {results.packages.slice(0, 4).map((pkg) => (
                        <a
                          key={pkg.id}
                          href={pkg.href}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                        >
                          {pkg.image && (
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-neutral-900 group-hover:text-primary-600 truncate">
                              {pkg.title}
                            </div>
                            <div className="text-sm text-neutral-500 truncate">
                              {pkg.subtitle} • {pkg.description}
                            </div>
                            {pkg.price && (
                              <div className="text-sm font-semibold text-primary-600 mt-1">
                                {pkg.price}
                              </div>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Destinations Results */}
                {results.destinations?.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 mb-3">
                      <MapPin size={16} />
                      <span>Destinations ({results.destinations.length})</span>
                    </div>
                    <div className="space-y-2">
                      {results.destinations.slice(0, 4).map((dest) => (
                        <a
                          key={dest.id}
                          href={dest.href}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                        >
                          {dest.image && (
                            <img
                              src={dest.image}
                              alt={dest.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-neutral-900 group-hover:text-primary-600 truncate">
                              {dest.title}
                            </div>
                            <div className="text-sm text-neutral-500 truncate">
                              {dest.subtitle}
                            </div>
                            <div className="text-sm text-neutral-600 truncate mt-1">
                              {dest.description}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* View All Link */}
                <div className="p-3 border-t border-neutral-100 bg-neutral-50">
                  <a
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                  >
                    <span>View all {totalResults} results</span>
                    <Search size={16} />
                  </a>
                </div>
              </>
            ) : query.length >= 2 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold text-neutral-900 mb-1">No results found</h3>
                <p className="text-sm text-neutral-500">
                  Try searching for "Goa", "Manali", "Kerala", "Honeymoon"
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Searches (shown when not searching) */}
      {!showResults && query.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 p-4 z-40">
          <p className="text-sm text-neutral-500 mb-3 font-medium">Popular Searches:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SEARCHES.map((quick, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickSearch(quick.query, quick.type)}
                className="px-4 py-2 bg-neutral-100 hover:bg-primary-50 text-neutral-700 hover:text-primary-600 rounded-full text-sm font-medium transition-colors"
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
