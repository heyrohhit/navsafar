"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Image from "next/image";

export function PremiumLoader() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const dots = 3; // Static dots count instead of animated

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0B1C2D] via-[#1a3a52] to-[#0B1C2D]">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            isClient ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  y: [-20, 0, 20]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent"
                style={{
                  left: `${(i * 5)}%`,
                  top: `${(i * 5)}%`,
                  transform: `rotate(${45 + i * 10}deg)`
                }}
              />
            ) : (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent opacity-30"
                style={{
                  left: `${(i * 5)}%`,
                  top: `${(i * 5)}%`,
                  transform: `rotate(${45 + i * 10}deg)`
                }}
              />
            )
          ))}
        </div>
      </div>

      {/* Main Loader Content */}
      <div className="relative z-10 text-center">
        {/* Luxury Logo Animation */}
        {isClient ? (
          <motion.div
            initial={{ scale: 0,x:5 }}
            animate={{ 
              scale: [0.8, 1, 0.8],
              x:10
            }}
            transition={{
              duration: 1,
            }}
            className="mx-auto"
          >
            <div className="w-20 h-20 flex items-center justify-center ">
              <div className="text-white font-bold text-2xl font-['Playfair_Display']">
                <Image src="/logo.png" alt="Logo" width={100} height={100} />
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mb-8 mx-auto opacity-100">
            <div className="w-20 h-20  flex items-center justify-center">
             <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </div>
          </div>
        )}

        {/* Premium Loading Text */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-4"
          >
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-[#C9A24D] via-[#d4b05e] to-[#C9A24D] bg-clip-text text-transparent">
                Navsafar
              </span>
            </h1>
            <p className="font-['Cormorant_Garamond'] text-xl text-white/90 max-w-md mx-auto">
              Crafting extraordinary travel experiences
            </p>
          </motion.div>
        ) : (
          <div className="mb-4 opacity-100">
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-[#C9A24D] via-[#d4b05e] to-[#C9A24D] bg-clip-text text-transparent">
                Navsafar
              </span>
            </h1>
            <p className="font-['Cormorant_Garamond'] text-xl text-white/90 max-w-md mx-auto">
              Crafting extraordinary travel experiences
            </p>
          </div>
        )}

        {/* Elegant Loading Dots */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center justify-center gap-3"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#d4b05e]"
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center gap-3 opacity-100">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#d4b05e]"
              />
            ))}
          </div>
        )}

        {/* Luxury Tagline */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-6"
          >
            <p className="font-['Inter'] text-sm text-white/70 uppercase tracking-widest">
              Premium Travel Experiences
            </p>
          </motion.div>
        ) : (
          <div className="mt-6 opacity-100">
            <p className="font-['Inter'] text-sm text-white/70 uppercase tracking-widest">
              Premium Travel Experiences
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {isClient ? (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="mt-8 h-1 bg-gradient-to-r from-[#C9A24D]/20 via-[#C9A24D] to-[#C9A24D]/20 rounded-full overflow-hidden"
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full w-1/3 bg-gradient-to-r from-[#d4b05e] to-[#C9A24D]"
            />
          </motion.div>
        ) : (
          <div className="mt-8 h-1 bg-gradient-to-r from-[#C9A24D]/20 via-[#C9A24D] to-[#C9A24D]/20 rounded-full overflow-hidden opacity-100">
            <div className="h-full w-1/3 bg-gradient-to-r from-[#d4b05e] to-[#C9A24D]" />
          </div>
        )}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          isClient ? (
            <motion.div
              key={`float-${i}`}
              initial={{ 
                opacity: 0,
                scale: 0,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
                x: [null, Math.random() * 100 - 50, null],
                y: [null, Math.random() * 100 - 50, null]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 rounded-full bg-[#C9A24D]/30 blur-sm"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 15)}%`
              }}
            />
          ) : (
            <div
              key={`float-${i}`}
              className="absolute w-2 h-2 rounded-full bg-[#C9A24D]/30 blur-sm opacity-30"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 15)}%`
              }}
            />
          )
        ))}
      </div>
    </div>
  );
}

export default PremiumLoader;
