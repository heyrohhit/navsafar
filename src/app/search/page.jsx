"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, Package, ArrowRight, Loader2 } from "lucide-react";

function SearchResultsInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const typeFilter = searchParams.get("type") || "all";

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = `/api/search?q=${encodeURIComponent(query)}&limit=20${typeFilter ? `&type=${typeFilter}` : ""}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, typeFilter]);

  const activeTab = typeFilter === "all" ? "all" : typeFilter;
  const totalResults = results ? (results.packages?.length || 0) + (results.destinations?.length || 0) : 0;

  const tabs = [
    { key: "all", label: "All", count: totalResults },
    { key: "packages", label: "Packages", count: results?.packages?.length || 0 },
    { key: "destinations", label: "Destinations", count: results?.destinations?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Search Results</h1>
          <p className="text-xl text-white/90 mb-6">
            {query ? (
              <>Showing results for "<strong>{query}</strong>"</>
            ) : (
              "Enter a search term to find packages and destinations"
            )}
          </p>

          {/* Tabs */}
          <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-xl p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  const url = new URL(window.location);
                  if (tab.key === "all") {
                    url.searchParams.delete("type");
                  } else {
                    url.searchParams.set("type", tab.key);
                  }
                  window.location.href = url.toString();
                }}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-primary-600 shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
            <p className="text-neutral-600">Searching...</p>
          </div>
        ) : !query ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Start Your Search</h2>
            <p className="text-neutral-600">Enter a destination, package name, or keyword above</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-neutral-200">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">No Results Found</h2>
            <p className="text-neutral-600 mb-6">
              We couldn't find anything matching "{query}". Try different keywords.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Goa", "Manali", "Kerala", "Rajasthan", "Honeymoon", "Family"].map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/search?q=${suggestion}`}
                  className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full font-medium hover:bg-primary-100"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-neutral-600">
                Found <span className="font-bold text-neutral-900">{totalResults}</span> results for "{query}"
              </p>
            </div>

            {/* Packages Results */}
            {(typeFilter === "all" || typeFilter === "packages") && results.packages?.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="text-primary-500" size={24} />
                  <h2 className="text-2xl font-bold text-neutral-900">Tour Packages</h2>
                  <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {results.packages.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.packages.map((pkg) => (
                    <motion.div
                      key={`${pkg.type}-${pkg.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200 hover:shadow-xl transition-all group"
                    >
                      <div className="relative h-56 overflow-hidden">
                        {pkg.image ? (
                          <Image
                            src={pkg.image}
                            alt={pkg.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                            <Package size={48} className="text-primary-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {pkg.rating && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            ★ {pkg.rating}
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {pkg.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-3 flex items-center gap-2">
                          <MapPin size={14} />
                          {pkg.subtitle}
                        </p>
                        <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                          {pkg.description}
                        </p>
                        <div className="flex items-center justify-between">
                          {pkg.price && (
                            <div className="text-xl font-bold text-primary-600">
                              {pkg.price}
                            </div>
                          )}
                          <Link
                            href={pkg.href}
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                          >
                            View Details <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Destinations Results */}
            {(typeFilter === "all" || typeFilter === "destinations") && results.destinations?.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="text-primary-500" size={24} />
                  <h2 className="text-2xl font-bold text-neutral-900">Destinations</h2>
                  <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {results.destinations.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.destinations.map((dest) => (
                    <motion.div
                      key={`${dest.type}-${dest.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="relative h-64">
                        {dest.image ? (
                          <Image
                            src={dest.image}
                            alt={dest.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-1">{dest.title}</h3>
                          <p className="text-white/80 mb-3 flex items-center gap-2">
                            <MapPin size={16} />
                            {dest.subtitle}
                          </p>
                          <p className="text-sm text-white/70 line-clamp-2 mb-4">
                            {dest.description}
                          </p>
                          <Link
                            href={dest.href}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                          >
                            Explore <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    }>
      <SearchResultsInner />
    </Suspense>
  );
}
