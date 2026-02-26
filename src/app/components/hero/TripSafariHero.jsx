"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = ["/assets/bg.jpg", "/assets/kd.jpg", "/assets/mt.jpg"];

const texts = [
  { title: "Adventure", subtitle: "Your Gateway To The World" },
  { title: "Discover", subtitle: "Explore Hidden Places" },
  { title: "Journey", subtitle: "Find Yourself in Nature" },
  { title: "Escape", subtitle: "Live Your Dream Trip" },
  { title: "Travel", subtitle: "Make Memories Everywhere" },
];

// 🔥 Premium Background Animations (NO WHITE FLASH)
const bgVariants = [
  {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0 },
  },
  {
    initial: { opacity: 0, x: "-30%" },
    animate: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "30%" },
  },
  {
    initial: { opacity: 0, y: "30%" },
    animate: { opacity: 1, y: "0%" },
    exit: { opacity: 0, y: "-30%" },
  },
  {
    initial: { opacity: 0, rotate: -2, scale: 1.1 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0 },
  },
  {
    initial: { opacity: 0, filter: "blur(15px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0 },
  },
];

// ✨ Premium Text Animations
const textVariants = [
  { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } },
  { initial: { opacity: 0, scale: 0.7 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 } },
  { initial: { opacity: 0, x: -80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0 } },
  { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 }, exit: { opacity: 0 } },
  { initial: { opacity: 0, letterSpacing: "15px" }, animate: { opacity: 1, letterSpacing: "0px" }, exit: { opacity: 0 } },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [bgAnim, setBgAnim] = useState(bgVariants[0]);
  const [textAnim, setTextAnim] = useState(textVariants[0]);
  const [budget, setBudget] = useState(25000);
  const [travelers, setTravelers] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
      setBgAnim(bgVariants[Math.floor(Math.random() * bgVariants.length)]);
      setTextAnim(textVariants[Math.floor(Math.random() * textVariants.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = images[index % images.length];

  return (
    <section className="relative min-h-screen w-full overflow-hidden text-white">

      {/* 🔥 BACKGROUND LAYER SYSTEM (No White Flash) */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={currentImage}
            variants={bgAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1.6 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentImage})` }}
          />
        </AnimatePresence>
      </div>

      {/* Dark Overlay (Permanent) */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-14">

          {/* Left Text */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Start Your Next
            </h1>

            <AnimatePresence mode="wait">
              <motion.h2
                key={texts[index].title}
                variants={textAnim}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-yellow-400 mt-3 reey-font mx-[20%] m-6 mt-6"
              >
                {texts[index].title}
              </motion.h2>
            </AnimatePresence>

            <p className=" w-full mt-4 text-base sm:text-lg text-gray-200 text-center mx-[10%]">
              {texts[index].subtitle}
            </p>
          </div>

          {/* Animated Premium Badges */}
          <div className="flex-wrap lg:flex-col gap-4 items-start max-[660px]:hidden">
            {[
              "🌍 150+ Destinations",
              "🏨 Premium Hotels",
              "🎯 Expert Guidance",
              "💎 Best Prices",
              "🕐 24/7 Support",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.08 }}
                className={`bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full shadow-xl w-max`}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🔥 PREMIUM FORM (FULLY RESPONSIVE — NOT REMOVED) */}
        <div className="mt-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <input
              type="text"
              placeholder="Destination"
              className="w-full p-4 rounded-xl bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              type="date"
              className="w-full p-4 rounded-xl bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <div>
              <label className="text-sm block mb-2">
                Budget ₹{budget.toLocaleString()}
              </label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full accent-yellow-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setTravelers(travelers > 1 ? travelers - 1 : 1)}
                className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
              >
                -
              </button>
              <span className="text-lg font-semibold">{travelers}</span>
              <button
                onClick={() => setTravelers(travelers + 1)}
                className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition">
              Explore Packages
            </button>
            <button className="w-full sm:w-auto bg-white/20 px-8 py-4 rounded-xl hover:bg-white/30">
              Custom Trip
            </button>
            <button className="w-full sm:w-auto bg-red-500/80 px-8 py-4 rounded-xl hover:bg-red-600">
              Reset
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}