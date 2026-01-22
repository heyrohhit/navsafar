"use client"
import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface StarterLoaderProps {
  onComplete: () => void;
}

export function StarterLoader({
  onComplete,
}: StarterLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const interval = 300;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1000) {
          clearInterval(timer);
          setTimeout(onComplete, 2000);
          return 1000;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold tracking-widest text-white">
            NAVSAFAR
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 text-lg text-gray-400"
        >
          Designing Your Journey...
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto h-1 w-64 overflow-hidden rounded-full bg-gray-800"
        >
          <motion.div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      </div>
    </div>
  );
}