"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { packages } from "../models/objAll/packages";

const WHATSAPP_NUMBER = "918700750589";
const ACCENT_COLORS = ["#F59E0B", "#34D399", "#60A5FA", "#F472B6", "#A78BFA", "#FB923C", "#34D399", "#F59E0B"];

/* ── Star Rating ── */
function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-xs ${s <= Math.round(rating) ? "text-amber-400" : "text-white/20"}`}>★</span>
            ))}
            <span className="text-xs text-white/60 ml-1">{rating}</span>
        </div>
    );
}

/* ── Package Card ── */
function PackageCard({ pkg, accentColor, index }) {
    const [hovered, setHovered] = useState(false);

    const handleWhatsApp = (e) => {
        e.stopPropagation();
        const text = encodeURIComponent(
            `Namaste! Mujhe yeh package book karni hai:\n\n📦 *${pkg.title}*\n📍 Location: ${Array.isArray(pkg.location) ? pkg.location.join(", ") : pkg.location}\n⏱ Duration: ${pkg.duration}\n⭐ Rating: ${pkg.rating}\n🏷 Discount: ${pkg.discount}\n\nPlease details share karein!`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 backdrop-blur-sm"
            style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${hovered ? accentColor + "44" : "rgba(255,255,255,0.1)"}`,
                boxShadow: hovered ? `0 8px 40px ${accentColor}22` : "0 2px 12px rgba(0,0,0,0.3)",
            }}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <motion.img
                    src={pkg.image}
                    alt={pkg.title}
                    animate={{ scale: hovered ? 1.06 : 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-cover block"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600"; }}
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {pkg.popular && (
                        <span className="text-black text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide font-sans" style={{ background: accentColor }}>
                            🔥 POPULAR
                        </span>
                    )}
                    <span className="text-white text-[10px] font-semibold px-2.5 py-1 rounded-full font-sans backdrop-blur-md" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        {pkg.category}
                    </span>
                </div>

                {/* Discount */}
                {pkg.discount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full font-sans">
                        {pkg.discount}
                    </div>
                )}

                {/* Duration */}
                <div className="absolute bottom-3 left-3">
                    <span className="text-white/85 text-xs font-sans flex items-center gap-1">⏱ {pkg.duration}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-2.5">
                    <h3 className="text-[17px] font-bold text-white m-0 mb-1 font-serif leading-snug">{pkg.title}</h3>
                    <p className="text-xs m-0 font-sans flex items-center gap-1" style={{ color: accentColor }}>
                        📍 {Array.isArray(pkg.location) ? pkg.location.join(", ") : pkg.location}
                    </p>
                </div>

                <StarRating rating={pkg.rating} />

                <p className="text-xs text-white/60 font-sans leading-relaxed my-2.5">{pkg.description}</p>

                {/* Inclusions */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.inclusions.slice(0, 3).map((inc) => (
                        <span key={inc} className="text-white/70 text-[11px] px-2.5 py-1 rounded-full font-sans" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            ✓ {inc}
                        </span>
                    ))}
                    {pkg.inclusions.length > 3 && (
                        <span className="text-white/50 text-[11px] px-2.5 py-1 rounded-full font-sans" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            +{pkg.inclusions.length - 3} more
                        </span>
                    )}
                </div>

                {/* Book Button */}
                <motion.button
                    onClick={handleWhatsApp}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-black font-sans flex items-center justify-center gap-2 border-0 cursor-pointer transition-all duration-300"
                    style={{ background: accentColor, boxShadow: `0 4px 16px ${accentColor}44` }}
                >
                    📲 Book on WhatsApp
                </motion.button>
            </div>
        </motion.div>
    );
}

/* ── No Results Popup ── */
function NoResultsPopup({ query, date, travelers, onClose }) {
    const handleWhatsApp = () => {
        const text = encodeURIComponent(
            `Namaste! Mujhe ek custom trip plan karni hai.\n\n📍 Destination: ${query}\n📅 Date: ${date || "Flexible"}\n👥 Travelers: ${travelers}\n\nKoi package available nahi tha. Please help me plan a custom trip!`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5 backdrop-blur-lg"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-3xl p-8 md:p-10 text-center"
                style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
                }}
            >
                <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-6xl mb-5 block"
                >🗺️</motion.div>

                <h2 className="text-2xl font-extrabold text-white mb-2.5 font-serif">Koi Package Nahi Mila!</h2>

                <p className="text-white/60 text-sm font-sans leading-relaxed mb-2">
                    "<span className="text-amber-400 font-semibold">{query}</span>" ke liye abhi koi package available nahi hai.
                </p>
                <p className="text-white/40 text-xs font-sans mb-7">
                    Lekin hamara travel agent aapke liye ek custom trip bana sakta hai! 🎯
                </p>

                {/* Details chip */}
                <div className="flex justify-center gap-5 flex-wrap p-3 rounded-xl mb-6 font-sans text-xs text-white/70" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span>📍 {query}</span>
                    {date && <span>📅 {date}</span>}
                    <span>👥 {travelers} Traveler{travelers > 1 ? "s" : ""}</span>
                </div>

                {/* WhatsApp Button */}
                <motion.button
                    onClick={handleWhatsApp}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-xl text-white text-base font-bold font-sans flex items-center justify-center gap-2.5 mb-3 border-0 cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", boxShadow: "0 6px 24px rgba(37,211,102,0.35)" }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Travel Agent Se Connect Karein
                </motion.button>

                <button
                    onClick={onClose}
                    className="bg-transparent text-white/40 text-sm font-sans px-2 py-1 cursor-pointer border-0 hover:text-white/70 transition-colors"
                >
                    Wapas Jaayein
                </button>
            </motion.div>
        </motion.div>
    );
}

/* ── Main Search Page ── */
function SearchPageInner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get("q") || "";
    const date = searchParams.get("date") || "";
    const travelers = parseInt(searchParams.get("travelers") || "2");

    const [showPopup, setShowPopup] = useState(false);
    const [newSearch, setNewSearch] = useState(query);

    const results = packages.filter((pkg) => {
        const loc = Array.isArray(pkg.location) ? pkg.location.join(" ") : pkg.location;
        return (
            loc.toLowerCase().includes(query.toLowerCase()) ||
            pkg.title.toLowerCase().includes(query.toLowerCase()) ||
            pkg.category.toLowerCase().includes(query.toLowerCase())
        );
    });

    useEffect(() => {
        if (query && results.length === 0) {
            const timer = setTimeout(() => setShowPopup(true), 600);
            return () => clearTimeout(timer);
        }
    }, [query, results.length]);

    const handleNewSearch = (e) => {
        e.preventDefault();
        if (!newSearch.trim()) return;
        const params = new URLSearchParams({ q: newSearch.trim(), date, travelers: travelers.toString() });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg, #0a0a0f 0%, #0f1520 50%, #0a0a0f 100%)" }}>

            {/* ── Sticky Header ── */}
            <div
                className="sticky top-0 z-50 px-4 md:px-12 py-4 backdrop-blur-2xl"
                style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
                <div className="max-w-screen-xl mx-auto flex items-center gap-3 flex-wrap">
                    <motion.button
                        onClick={() => router.back()}
                        whileHover={{ x: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 text-white text-sm font-sans px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap flex-shrink-0 border-0 transition-colors"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                        ← Back
                    </motion.button>

                    <form onSubmit={handleNewSearch} className="flex gap-2 flex-1 min-w-0">
                        <input
                            type="text"
                            value={newSearch}
                            onChange={(e) => setNewSearch(e.target.value)}
                            placeholder="Search destination..."
                            className="flex-1 min-w-0 text-white text-[15px] font-sans px-4 py-2.5 rounded-xl outline-none"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="bg-amber-400 text-black text-sm font-bold font-sans px-5 py-2.5 rounded-xl cursor-pointer border-0 whitespace-nowrap"
                        >
                            🔍 Search
                        </motion.button>
                    </form>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-screen-xl mx-auto px-4 md:px-12 py-8 md:py-12">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h1 className="text-2xl md:text-4xl font-extrabold m-0 font-serif">
                            {results.length > 0
                                ? <>Results for "<span className="text-amber-400">{query}</span>"</>
                                : <>No results for "<span className="text-red-400">{query}</span>"</>
                            }
                        </h1>
                        {results.length > 0 && (
                            <span className="text-amber-400 text-sm font-semibold font-sans px-3.5 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                                {results.length} Package{results.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {date && <span className="text-white/50 text-sm font-sans">📅 {date}</span>}
                        <span className="text-white/50 text-sm font-sans">👥 {travelers} Traveler{travelers > 1 ? "s" : ""}</span>
                    </div>
                </motion.div>

                {/* Grid */}
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.map((pkg, i) => (
                            <PackageCard key={pkg.id} pkg={pkg} accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]} index={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center py-24"
                    >
                        <div className="text-6xl mb-4">🌏</div>
                        <p className="text-white/50 text-lg font-sans">Yeh destination ka koi package abhi available nahi hai</p>
                        <p className="text-white/30 text-sm font-sans mt-2">Travel agent se connect karein custom trip ke liye</p>
                    </motion.div>
                )}
            </div>

            {/* Popup */}
            <AnimatePresence>
                {showPopup && (
                    <NoResultsPopup query={query} date={date} travelers={travelers} onClose={() => setShowPopup(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-amber-400/20 border-t-amber-400"
                />
            </div>
        }>
            <SearchPageInner />
        </Suspense>
    );
}