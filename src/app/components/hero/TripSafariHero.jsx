"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { image: "/assets/bg.jpg",  eyebrow: "Begin Your Story",    title: "Start Your Next", accent: "Adventure",   subtitle: "Where every journey becomes a masterpiece",  color: "#F59E0B", colorClass: "text-amber-400",  borderClass: "border-amber-400",  shadowClass: "shadow-amber-400/30"  },
  { image: "/assets/kd.jpg",  eyebrow: "Off the Beaten Path", title: "Discover",        accent: "The Truth",   subtitle: "Hidden wonders await the curious traveler",  color: "#34D399", colorClass: "text-emerald-400", borderClass: "border-emerald-400", shadowClass: "shadow-emerald-400/30"},
  { image: "/assets/mt.jpg",  eyebrow: "Reconnect & Breathe", title: "Journey",         accent: "Into nature", subtitle: "Find stillness in the world's wild places",  color: "#60A5FA", colorClass: "text-blue-400",   borderClass: "border-blue-400",   shadowClass: "shadow-blue-400/30"   },
  { image: "/assets/bg.jpg",  eyebrow: "Break Free",          title: "Escape",          accent: "Your Worlds", subtitle: "Live the trip you've always dreamed of",     color: "#F472B6", colorClass: "text-pink-400",   borderClass: "border-pink-400",   shadowClass: "shadow-pink-400/30"   },
  { image: "/assets/kd.jpg",  eyebrow: "No Limits",           title: "Travel",          accent: "The World",   subtitle: "Make memories on every continent",           color: "#A78BFA", colorClass: "text-violet-400", borderClass: "border-violet-400", shadowClass: "shadow-violet-400/30" },
];

const badges = [
  { icon: "🌍", label: "50+ Destinations", path: "/destinations"            },
  { icon: "🏨", label: "Premium Hotels",   path: "/tour-packages"           },
  { icon: "🎯", label: "Expert Guidance",  path: "https://wa.me/+918882128640" },
  { icon: "💎", label: "Best Prices",      path: "https://wa.me/+918882128640" },
  { icon: "🕐", label: "24/7 Support",     path: "tel:+918882128640"        },
];

/* ── Variants defined outside component → never re-created on re-render ── */
const bgVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.55, ease: "easeIn" } },
};
const eyebrowVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,   transition: { duration: 0.4, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.25, ease: "easeIn"  } },
};
const titleVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0,  opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { y: -28, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};
const accentVariants = {
  initial: { scale: 0.88, opacity: 0 },
  animate: { scale: 1,    opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { scale: 1.08, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};
const subtitleVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.4, delay: 0.08, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2,  ease: "easeIn"  } },
};

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const slide = useMemo(() => slides[index], [index]);

  /* preload next image ahead of time */
  useEffect(() => {
    const next = slides[(index + 1) % slides.length].image;
    const img = new window.Image();
    img.src = next;
  }, [index]);

  /* auto-advance */
  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const goTo = useCallback((i) => setIndex(i), []);

  return (
    /* ─────────────────────────────────────────────────────────────
       NO mount animation — component is already rendered behind
       the LoadingScreen. It appears instantly when loader fades.
    ───────────────────────────────────────────────────────────── */
    <section
      className="relative w-full overflow-hidden text-white pt-8 pb-5"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap');
        .reey-font {
          font-family: 'reey','Playfair Display',Georgia,serif !important;
          font-style: italic !important;
          font-weight: 900 !important;
          line-height: 1.2 !important;
          display: block;
          overflow: visible;
        }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(.5); cursor: pointer; }
        input::placeholder { color: rgba(255,255,255,.4); }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.image + index}
            variants={bgVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full h-[120vh] -z-10"
            style={{ willChange: "opacity" }}
          >
            <Image
              src={slide.image}
              alt="Hero background"
              fill
              priority
              quality={80}
              sizes="100vw"
              style={{ objectFit: "cover", transform: "scale(1.04)" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/75 to-black/65 z-10" />
      <div className="absolute inset-0 z-20" style={{ background: `radial-gradient(ellipse 70% 60% at 30% 40%, ${slide.color}, transparent)`, opacity: 0.07, transition: "background 0.5s ease" }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent z-30" />

      {/* Content */}
      <div className="relative z-40 w-full mx-auto flex flex-col justify-between gap-6" style={{ maxWidth: "1280px", padding: "clamp(24px,5vw,80px) clamp(16px,4vw,48px)" }}>
        <div className="flex flex-wrap justify-between items-start gap-8 flex-1">

          {/* Text */}
          <div className="max-w-xl flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.p key={"ey" + index} variants={eyebrowVariants} initial="initial" animate="animate" exit="exit"
                className={`flex items-center gap-3 uppercase tracking-widest text-xs font-sans mb-4 mt-[5%] ${slide.colorClass}`}>
                <span className="inline-block h-px w-8 flex-shrink-0" style={{ background: `linear-gradient(90deg,transparent,${slide.color})`, boxShadow: `0 0 8px ${slide.color}` }} />
                {slide.eyebrow}
              </motion.p>
            </AnimatePresence>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1 key={"h1" + index} variants={titleVariants} initial="initial" animate="animate" exit="exit"
                  className="block font-black tracking-tight leading-none text-white p-3" style={{ fontSize: "clamp(30px,5vw,75px)" }}>
                  {slide.title}
                </motion.h1>
              </AnimatePresence>
            </div>

            <div>
              <AnimatePresence mode="wait">
                <motion.h2 key={"h2" + index} variants={accentVariants} initial="initial" animate="animate" exit="exit"
                  className={`reey-font ${slide.colorClass} m-4 w-full`} style={{ fontSize: "clamp(40px,7vw,96px)", willChange: "transform,opacity" }}>
                  {slide.accent}
                </motion.h2>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.p key={"sub" + index} variants={subtitleVariants} initial="initial" animate="animate" exit="exit"
                className="text-right text-white/70 font-sans max-w-lg m-0" style={{ fontSize: "clamp(14px,1.6vw,18px)" }}>
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Badges */}
          <div className="hidden sm:flex flex-col gap-2.5 items-start mt-5">
            {badges.map((b) => (
              <Link href={b.path} key={b.label}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-sans text-white whitespace-nowrap backdrop-blur-xl transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <span className="text-base inline-block">{b.icon}</span>
                {b.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex gap-2 justify-center pb-2">
          {slides.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`h-1 rounded-full cursor-pointer border-0 p-0 transition-all duration-300 ${i === index ? "w-7" : "w-3"}`}
              style={{ background: i === index ? s.color : "rgba(255,255,255,0.3)" }}
              aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}