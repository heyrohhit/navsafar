"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href="/" 
      className="flex items-center space-x-3 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Logo Circle */}
      <motion.div
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D] via-[#B8934D] to-[#A0803D] shadow-lg"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full  opacity-0 group-hover:opacity-100 blur-md"
          animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />
        
        {/* Letter N with animation */}
        <motion.span
          className="relative font-['Playfair_Display'] text-2xl font-bold text-white z-10"
          animate={{ 
            rotate: isHovered ? [0, -5, 5, 0] : 0,
            scale: isHovered ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </motion.span>

        {/* Subtle rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Company Name with luxury animation */}
      <div className="relative">
        <motion.div
          className="font-['Playfair_Display'] text-2xl font-bold text-white">
          NavSafar
        </motion.div>
        
        {/* Tagline with fade animation */}
         <motion.div
          className="font-['Inter'] text-xs text-[#C9A24D] overflow-hidden"
        >
          <span className="block whitespace-nowrap">Travel Solutions</span>
        </motion.div>
        <motion.div
          className="font-['Inter'] text-xs text-[#C9A24D] overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "auto" : 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="block whitespace-nowrap"></span>
        </motion.div>

        {/* Luxury underline effect */}
        <motion.div
          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#C9A24D] to-transparent"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        />
      </div>
    </Link>
  );
}
