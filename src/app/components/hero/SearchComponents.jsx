"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { packages } from "../../models/objAll/packages";

// ── Category filter pills ────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "🏖️ Beach",          link: "/packages?type=Beach"         },
  { label: "🏔️ Mountains",      link: "/packages?type=Nature"        },
  { label: "✈️ International",  link: "/packages?category=international" },
  { label: "💑 Honeymoon",      link: "/packages?type=Romantic"      },
  { label: "👨‍👩‍👧‍👦 Family",        link: "/packages?category=family"   },
  { label: "🧗 Adventure",      link: "/packages?type=Adventure"     },
];

// ── Place suggestions — built ONCE from the packages the site actually offers.
// Pehle `country-state-city` (~1.5 lakh global cities) load hoti thi jisse
// search me duniya bhar ke bemtlab places aate the aur unka koi package hi
// nahi hota tha. Ab sirf real destinations (city + country) suggest hote hain.
const PLACES = (() => {
  const cities = new Map();     // "city|country" → suggestion
  const countries = new Map();  // "country"      → suggestion

  for (const p of packages) {
    const cityKey = `${p.city}|${p.country}`;
    if (!cities.has(cityKey)) {
      cities.set(cityKey, {
        label: `${p.city}, ${p.country}`,
        searchText: `${p.city} ${p.country} ${p.title} ${(p.tourism_type || []).join(" ")}`.toLowerCase(),
      });
    }
    if (!countries.has(p.country)) {
      countries.set(p.country, {
        label: p.country,
        searchText: p.country.toLowerCase(),
      });
    }
  }

  return [...cities.values(), ...countries.values()];
})();

function filterPlaces(query) {
  const q = query.toLowerCase();
  return PLACES.filter((l) => l.searchText.includes(q)).slice(0, 8);
}

// ── Counter helper — component outside render (state-safe, no re-creation) ────
function Counter({ value, onChange, min = 0, max = 10 }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-[#0f6477] text-[#0f6477] font-bold text-lg flex items-center justify-center disabled:opacity-30 hover:bg-[#0f6477] hover:text-white transition-all">
        −
      </button>
      <span className="w-6 text-center font-bold text-white text-base">{value}</span>
      <button type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border border-[#0f6477] text-[#0f6477] font-bold text-lg flex items-center justify-center disabled:opacity-30 hover:bg-[#0f6477] hover:text-white transition-all">
        +
      </button>
    </div>
  );
}

export default function SearchComponents() {
  const router = useRouter();

  // ── From city (departure) ────────────────────────────────────────────────
  const [fromCity,          setFromCity]          = useState("");
  const [fromSuggestions,   setFromSuggestions]   = useState([]);
  const [showFromDrop,      setShowFromDrop]       = useState(false);

  // ── Destination ──────────────────────────────────────────────────────────
  const [destination,       setDestination]       = useState("");
  const [destSuggestions,   setDestSuggestions]   = useState([]);
  const [showDestDrop,      setShowDestDrop]       = useState(false);

  // ── Date ─────────────────────────────────────────────────────────────────
  const [date,              setDate]              = useState("");

  // ── Passenger selector ───────────────────────────────────────────────────
  const [showPassenger,     setShowPassenger]     = useState(false);
  const [adults,            setAdults]            = useState(2);
  const [children,          setChildren]          = useState(0);
  const [infants,           setInfants]           = useState(0);
  const passengerRef = useRef(null);

  // Close passenger dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (passengerRef.current && !passengerRef.current.contains(e.target)) {
        setShowPassenger(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const totalTravellers = adults + children + infants;
  const passengerLabel  = `${adults} Adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}${infants > 0 ? `, ${infants} Infant${infants !== 1 ? "s" : ""}` : ""}`;

  // ── Suggestions — filter the real destinations list (see PLACES above).
  // List chhoti hai (site ke actual packages) isliye debounce/lazy-load ki
  // zaroorat nahi — seedha sync filter.
  function updateSuggestions(query, setSuggestions) {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestions(filterPlaces(query));
  }

  // ── Search ───────────────────────────────────────────────────────────────
  function handleSearch(e) {
    e.preventDefault();
    if (!destination.trim() && !fromCity.trim()) return;
    const params = new URLSearchParams({
      q:          destination.trim() || fromCity.trim(),
      from:       fromCity.trim(),
      date:       date || "",
      travellers: totalTravellers.toString(),
      adults:     adults.toString(),
      children:   children.toString(),
      infants:    infants.toString(),
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:-translate-y-[20%] max-[780px]:translate-y-[-5%]" style={{ zIndex: 50, position: "relative" }}>

      {/* ── Main search card ─────────────────────────────────────────────── */}
      <div className="bg-[#fff] text-[#0f6477] rounded-2xl p-5 shadow-2xl border border-white/10 backdrop-blur-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* 1. City (From) */}
          <div className="relative z-[999]">
            <label className="block text-[#0f6477] text-xs font-semibold uppercase tracking-wider mb-1.5 px-1">
              From (City)
            </label>
            <input
              type="text"
              placeholder="Departure city…"
              value={fromCity}
              onChange={(e) => {
                setFromCity(e.target.value);
                updateSuggestions(e.target.value, setFromSuggestions);
                setShowFromDrop(true);
              }}
              onFocus={() => fromCity && setShowFromDrop(true)}
              onBlur={() => setTimeout(() => setShowFromDrop(false), 200)}
              className="w-full px-4 py-3 rounded-xl border border-[#0f6477] text-[#0f6477] placeholder-[#0f6477] outline-none focus:border-white/60 focus:bg-[#0f6477] transition-all text-sm focus:text-white"
            />
            <AnimatePresence>
              {showFromDrop && fromSuggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute top-full mt-1 w-full bg-[#fff] border border-[#0f6477]/20 rounded-xl z-50 max-h-52 overflow-y-auto shadow-2xl">
                  {fromSuggestions.map((loc, i) => (
                    <div key={i} onMouseDown={() => { setFromCity(loc.label); setShowFromDrop(false); }}
                      className="px-4 py-2.5 text-[#0f6477]/80 hover:bg-white/10 cursor-pointer text-sm border-b border-white/5 last:border-none">
                      📍 {loc.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Destination */}
          <div className="relative">
            <label  className="block text-[#0f6477] text-xs font-semibold uppercase tracking-wider mb-1.5 px-1">
              Destination
            </label>
            <input
              type="text"
              placeholder="Where to go…"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                updateSuggestions(e.target.value, setDestSuggestions);
                setShowDestDrop(true);
              }}
              onFocus={() => destination && setShowDestDrop(true)}
              onBlur={() => setTimeout(() => setShowDestDrop(false), 200)}
              className="w-full px-4 py-3 rounded-xl border border-[#0f6477] text-[#0f6477] placeholder-[#0f6477] outline-none focus:border-white/60 focus:bg-[#0f6477] transition-all text-sm focus:text-white"
            />
            <AnimatePresence>
              {showDestDrop && destSuggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute top-full mt-1 w-full bg-[#fff] border border-[#0f6477]/20 rounded-xl z-50 max-h-52 overflow-y-auto shadow-2xl">
                  {destSuggestions.map((loc, i) => (
                    <div key={i} onMouseDown={() => { setDestination(loc.label); setShowDestDrop(false); }}
                     className="px-4 py-2.5 text-[#0f6477]/80 hover:bg-white/10 cursor-pointer text-sm border-b border-white/5 last:border-none">
                      🌍 {loc.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Travel Date */}
          <div>
            <label  className="block text-[#0f6477] text-xs font-semibold uppercase tracking-wider mb-1.5 px-1">
              Travel Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
             className="w-full px-4 py-3 rounded-xl border border-[#0f6477] text-[#0f6477] placeholder-[#0f6477] outline-none focus:border-white/60 focus:bg-[#0f6477] transition-all text-sm focus:text-white"
              style={{ colorScheme: "dark" }}
            />
          </div>

          {/* 4. Passengers */}
          <div className="relative" ref={passengerRef}>
            <label  className="block text-[#0f6477] text-xs font-semibold uppercase tracking-wider mb-1.5 px-1">
              Travellers
            </label>
            <button type="button"
              onClick={() => setShowPassenger(!showPassenger)}
              className="w-full px-4 py-3 rounded-xl border border-[#0f6477] text-[#0f6477] placeholder-[#0f6477] outline-none focus:border-white/60 focus:bg-[#0f6477] transition-all text-sm focus:text-white">
              <span className="truncate">{passengerLabel}</span>
              <span className={`ml-2 transition-transform duration-200 ${showPassenger ? "rotate-180" : ""}`}>▾</span>
            </button>

            <AnimatePresence>
              {showPassenger && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  className="absolute top-full mt-2 left-0 right-0 bg-[#0a3d4d] border border-white/20 rounded-2xl z-50 shadow-2xl p-4 space-y-4">

                  {/* Adult */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">Adults</p>
                      <p className="text-white/50 text-xs">Age 12+</p>
                    </div>
                    <Counter value={adults} onChange={setAdults} min={1} max={10} />
                  </div>

                  <div className="border-t border-white/10" />

                  {/* Child */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">Children</p>
                      <p className="text-white/50 text-xs">Age 2–11</p>
                    </div>
                    <Counter value={children} onChange={setChildren} min={0} max={8} />
                  </div>

                  <div className="border-t border-white/10" />

                  {/* Infant */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">Infants</p>
                      <p className="text-white/50 text-xs">Under 2</p>
                    </div>
                    <Counter value={infants} onChange={setInfants} min={0} max={4} />
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <p className="text-white/50 text-xs text-center">Total: {totalTravellers} traveller{totalTravellers !== 1 ? "s" : ""}</p>
                    <button type="button" onClick={() => setShowPassenger(false)}
                      className="w-full mt-2 py-2 bg-[#0f6477] text-white font-bold rounded-xl text-sm hover:bg-[#0d7a8a] transition-all">
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Search button ── */}
        <button onClick={handleSearch}
          className="mt-4 w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 text-sm">
          🔍 Search Packages
        </button>
      </div>

      {/* ── Category filter pills ─────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center relative z-[-1]">
        {CATEGORIES.map((cat) => (
          <a key={cat.label} href={cat.link}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-[#0f6471] text-sm font-semibold rounded-full border border-white/25 hover:border-white/50 transition-all duration-200 hover:scale-105 backdrop-blur-sm">
            {cat.label}
          </a>
        ))}
      </div>
    </div>
  );
}