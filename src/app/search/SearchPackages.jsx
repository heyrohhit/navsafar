"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Package,
  ArrowRight,
  Loader2,
  Sparkles,
  Phone,
  X,
} from "lucide-react";
import SearchLeadPopup from "../components/search/SearchLeadPopup";

// Shared popular suggestions — reused by the custom-package card and the
// no-query empty state so a search is never a dead end.
const POPULAR_SEARCHES = [
  "Goa",
  "Manali",
  "Kerala",
  "Rajasthan",
  "Honeymoon",
  "Family",
  "Dubai",
  "Thailand",
];

function SearchResultsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const typeFilter = searchParams.get("type") || "all";

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState(query);
  const [showLead, setShowLead] = useState(false);

  // Keep the on-page input in sync when the URL query changes.
  useEffect(() => {
    setTerm(query);
  }, [query]);

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
  const totalResults = results
    ? (results.packages?.length || 0) + (results.destinations?.length || 0)
    : 0;

  const tabs = [
    { key: "all", label: "All", count: totalResults },
    { key: "packages", label: "Packages", count: results?.packages?.length || 0 },
    { key: "destinations", label: "Destinations", count: results?.destinations?.length || 0 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = term.trim();
    if (t) router.push(`/search?q=${encodeURIComponent(t)}`);
  };

  const switchTab = (key) => {
    const url = new URL(window.location);
    if (key === "all") url.searchParams.delete("type");
    else url.searchParams.set("type", key);
    router.push(`${url.pathname}${url.search}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-600 to-accent-600 px-4 pt-14 pb-10">
        {/* soft decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-300/20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
            {query ? "Search Results" : "Find Your Perfect Trip"}
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-7">
            {query ? (
              <>
                Showing results for &ldquo;<strong>{query}</strong>&rdquo;
              </>
            ) : (
              "Search packages, destinations & experiences — anywhere you dream of."
            )}
          </p>

          {/* On-page search bar */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                size={20}
              />
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Try “Goa”, “Manali honeymoon”, “Dubai”…"
                aria-label="Search destinations and packages"
                className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white text-neutral-900 placeholder-neutral-400 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              {term && (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  aria-label="Clear"
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary-600 hover:bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Tabs — only meaningful once a query exists */}
          {query && (
            <div className="mt-7 inline-flex bg-white/15 backdrop-blur-sm rounded-xl p-1 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => switchTab(tab.key)}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-white text-primary-600 shadow-md"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <SearchSkeleton />
        ) : !query ? (
          <NoQueryState onPick={(s) => router.push(`/search?q=${encodeURIComponent(s)}`)} />
        ) : totalResults === 0 ? (
          <CustomPackageCard
            query={query}
            onRequest={() => setShowLead(true)}
            onPick={(s) => router.push(`/search?q=${encodeURIComponent(s)}`)}
          />
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-neutral-600">
                Found{" "}
                <span className="font-bold text-neutral-900">{totalResults}</span>{" "}
                results for &ldquo;{query}&rdquo;
              </p>
            </div>

            {/* Packages Results */}
            {(typeFilter === "all" || typeFilter === "packages") &&
              results.packages?.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Package className="text-primary-500" size={24} />
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Tour Packages
                    </h2>
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {results.packages.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.packages.map((pkg, i) => (
                      <motion.div
                        key={`${pkg.type}-${pkg.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.05, 0.4) }}
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
            {(typeFilter === "all" || typeFilter === "destinations") &&
              results.destinations?.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="text-primary-500" size={24} />
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Destinations
                    </h2>
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {results.destinations.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.destinations.map((dest, i) => (
                      <motion.div
                        key={`${dest.type}-${dest.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.05, 0.4) }}
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

            {/* Always-on custom-package banner (even when results exist) */}
            <CustomPackageBanner query={query} onRequest={() => setShowLead(true)} />
          </>
        )}
      </div>

      {/* ── Lead capture modal ──────────────────────────────────── */}
      {showLead && (
        <SearchLeadPopup
          searchData={{ destination: query, q: query }}
          onClose={() => setShowLead(false)}
          onSuccess={() => setShowLead(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Loading skeleton
// ─────────────────────────────────────────────────────────────
function SearchSkeleton() {
  return (
    <div>
      <div className="h-5 w-52 bg-neutral-200 rounded mb-8 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200"
          >
            <div className="h-56 bg-neutral-200 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// No-query landing state
// ─────────────────────────────────────────────────────────────
function NoQueryState({ onPick }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
        Start Your Search
      </h2>
      <p className="text-neutral-600 mb-8">
        Enter a destination, package name, or keyword above.
      </p>
      <p className="text-sm font-medium text-neutral-500 mb-3">
        Popular searches
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
        {POPULAR_SEARCHES.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full font-medium hover:bg-primary-100 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Custom package card — shown INSTEAD of "no results".
// Har search ka result: agar package nahi mila, custom trip offer.
// ─────────────────────────────────────────────────────────────
function CustomPackageCard({ query, onRequest, onPick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-600 to-accent-600 text-white text-center px-6 py-12 sm:px-12 shadow-xl">
        <div className="pointer-events-none absolute -top-20 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent-300/20 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <Sparkles size={16} /> Custom Trip
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            We&apos;ll craft &ldquo;{query}&rdquo; just for you ✨
          </h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8">
            Ye trip abhi hamare ready-made packages mein nahi hai — lekin koi baat
            nahi! Hamari travel team aapke liye ek personalised package banayegi.
            Bas apni details share karein, hamara expert{" "}
            <strong>24 ghante ke andar</strong> aapko call karega.
          </p>

          <button
            onClick={onRequest}
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-neutral-50 transition-all"
          >
            <Phone size={18} /> Request Custom Package
          </button>

          <p className="text-white/70 text-xs mt-4">
            🔒 100% free • No spam • Personalised quote
          </p>
        </div>
      </div>

      {/* Keep exploring — never a dead end */}
      <div className="text-center mt-10">
        <p className="text-sm font-medium text-neutral-500 mb-3">
          Or explore popular trips
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((s) => (
            <button
              key={s}
              onClick={() => onPick(s)}
              className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full font-medium hover:bg-primary-100 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Slim custom-package banner — shown even when results EXIST.
// ─────────────────────────────────────────────────────────────
function CustomPackageBanner({ query, onRequest }) {
  return (
    <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50/60 px-6 py-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div className="mb-4 sm:mb-0">
        <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
          <Sparkles size={18} className="text-primary-600" />
          Perfect match nahi mila?
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          Hum &ldquo;{query}&rdquo; ke liye ek custom package bana denge — aapke
          budget aur dates ke hisaab se.
        </p>
      </div>
      <button
        onClick={onRequest}
        className="inline-flex shrink-0 items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
      >
        <Phone size={16} /> Request Custom Package
      </button>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      }
    >
      <SearchResultsInner />
    </Suspense>
  );
}
