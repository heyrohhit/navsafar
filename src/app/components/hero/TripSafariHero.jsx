"use client";

import { useState, useEffect } from "react";
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const slides = [
  { image: "/assets/bg.jpg", eyebrow: "Begin Your Story", title: "Start Your Next", accent: "Adventure", subtitle: "Where every journey becomes a masterpiece", color: "#F59E0B", colorClass: "text-amber-400", borderClass: "border-amber-400", shadowClass: "shadow-amber-400/30" },
  { image: "/assets/kd.jpg", eyebrow: "Off the Beaten Path", title: "Discover", accent: "The Truth", subtitle: "Hidden wonders await the curious traveler", color: "#34D399", colorClass: "text-emerald-400", borderClass: "border-emerald-400", shadowClass: "shadow-emerald-400/30" },
  { image: "/assets/mt.jpg", eyebrow: "Reconnect & Breathe", title: "Journey", accent: "Into nature", subtitle: "Find stillness in the world's wild places", color: "#60A5FA", colorClass: "text-blue-400", borderClass: "border-blue-400", shadowClass: "shadow-blue-400/30" },
  { image: "/assets/bg.jpg", eyebrow: "Break Free", title: "Escape", accent: "Your Worlds", subtitle: "Live the trip you've always dreamed of", color: "#F472B6", colorClass: "text-pink-400", borderClass: "border-pink-400", shadowClass: "shadow-pink-400/30" },
  { image: "/assets/kd.jpg", eyebrow: "No Limits", title: "Travel", accent: "The World", subtitle: "Make memories on every continent", color: "#A78BFA", colorClass: "text-violet-400", borderClass: "border-violet-400", shadowClass: "shadow-violet-400/30" },
];

const badges = [
  { icon: "🌍", label: "50+ Destinations",path:"/destinations"},
  { icon: "🏨", label: "Premium Hotels",path:"/tour-packages" },
  { icon: "🎯", label: "Expert Guidance",path:"https://wa.me/+918882128640" },
  { icon: "💎", label: "Best Prices",path:"https://wa.me/+918882128640" },
  { icon: "🕐", label: "24/7 Support",path:"tel:+918882128640" },
];

const curtainVariants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
  visible: { clipPath: "inset(0 0% 0 0)", opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } },
  exit: { clipPath: "inset(0 0% 0 100%)", opacity: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
};

const floatUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, filter: "blur(4px)", transition: { duration: 0.5 } },
};

const badgeAnim = (i) => ({
  hidden: { opacity: 0, x: 60, scale: 0.85 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { delay: 0.35 + i * 0.11, duration: 0.75, ease: [0.34, 1.56, 0.64, 1] } },
});

const pillVariants = {
  inactive: { width: "12px", opacity: 0.4 },
  active: { width: "28px", opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const bgX = useTransform(smoothX, [-1, 1], ["-1.5%", "1.5%"]);
  const bgY = useTransform(smoothY, [-1, 1], ["-1.5%", "1.5%"]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX / width) * 2 - 1);
    mouseY.set((clientY / height) * 2 - 1);
  };

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);



  return (
    <section
      className="relative w-full overflow-hidden text-white"
      style={{ fontFamily: "'Georgia', serif" }}
      onMouseMove={handleMouseMove}
    >
      {/* Reey font + global tweaks */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap');
        .reey-font {
          font-family: 'reey', 'Playfair Display', Georgia, serif !important;
          font-style: italic !important;
          font-weight: 900 !important;
          line-height: 1.2 !important;
          display: block;
          overflow: visible;
        }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.5); cursor: pointer; }
        input::placeholder { color: rgba(255,255,255,0.4); }
      `}</style>

      {/* ── BG ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.image + index}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.04 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bg-cover bg-center"
          style={{ inset: "-3%", backgroundImage: `url(${slide.image})`, x: bgX, y: bgY }}
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/75 to-black/65" style={{ zIndex: 1 }} />
      <AnimatePresence mode="sync">
        <motion.div
          key={"wash" + index}
          initial={{ opacity: 0 }} animate={{ opacity: 0.07 }} exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 70% 60% at 30% 40%, ${slide.color}, transparent)`, zIndex: 2 }}
        />
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" style={{ zIndex: 3 }} />

      {/* ── MAIN CONTENT ── */}
      <div
        className="relative w-full mx-auto flex flex-col justify-between gap-6"
        style={{ zIndex: 10, maxWidth: "1280px", padding: "clamp(24px,5vw,80px) clamp(16px,4vw,48px)" }}
      >

        {/* TEXT + BADGES */}
        <div className="flex flex-wrap justify-between items-start gap-8 flex-1 ">

          {/* Text Block */}
          <div className="max-w-xl flex-1 min-w-0">

            {/* Eyebrow */}
            <AnimatePresence mode="wait">
              <motion.p
                key={"ey" + index}
                variants={floatUp} initial="hidden" animate="visible" exit="exit"
                className={`flex items-center gap-3 uppercase tracking-widest text-xs font-sans mb-4 mt-[5%] ${slide.colorClass}`}
              >
                <motion.span
                  key={"dash" + index}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                  className="inline-block h-px w-8 flex-shrink-0"
                  style={{ background: `linear-gradient(90deg, transparent, ${slide.color})`, boxShadow: `0 0 8px ${slide.color}`, transformOrigin: "left" }}
                />
                {slide.eyebrow}
              </motion.p>
            </AnimatePresence>

            {/* Title */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={"h1" + index}
                  variants={curtainVariants} initial="hidden" animate="visible" exit="exit"
                  className="block font-black tracking-tight leading-none m-0"
                  style={{ fontSize: "clamp(30px,5vw,75px)" }}
                >
                  {slide.title}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Accent — reey font, overflow visible */}
            <div>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={"h2" + index}
                  initial="hidden" animate="visible" exit="exit"
                  className={`reey-font ${slide.colorClass} m-4 w-full`}
                  style={{ fontSize: "clamp(40px,7vw,96px)" }}
                >
                  {slide.accent}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={"sub" + index}
                variants={floatUp} initial="hidden" animate="visible" exit="exit"
                className="text-right text-white/70 font-sans max-w-lg m-0 "
                style={{ fontSize: "clamp(14px,1.6vw,18px)" }}
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Badges */}
          <div className="hidden sm:flex flex-col gap-2.5 items-start">
            {badges.map((b, i) => (
              <Link 
              href={b.path}
              key={b.label}
              >
              <motion.div
                
                variants={badgeAnim(i)} initial="hidden" animate="visible"
                whileHover={{ x: -6, scale: 1.06, transition: { duration: 0.25 } }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-sans text-white whitespace-nowrap cursor-default backdrop-blur-xl"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <motion.span
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ delay: 1.2 + i * 0.18, duration: 0.7 }}
                  className="text-base inline-block"
                >
                  {b.icon}
                </motion.span>
                {b.label}
              </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── INDICATORS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex gap-2 justify-center pb-2"
        >
          {slides.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => setIndex(i)}
              animate={i === index ? "active" : "inactive"}
              variants={pillVariants}
              whileHover={{ opacity: 1, scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              className="h-1 rounded-full cursor-pointer border-0 p-0"
              style={{
                background: i === index ? s.color : "rgba(255,255,255,0.3)",
                boxShadow: i === index ? `0 0 10px ${s.color}88` : "none",
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}