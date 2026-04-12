"use client";

import { useState, useEffect, useRef } from "react";
import DestinationsSection from "./DestinationsSection";

// Layout configurations for dynamic styling
const LAYOUT_CONFIGS = [
  {
    name: "standard",
    countryGridClass: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    packageGridClass: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    cardRotation: 0,
    gap: "gap-4",
    headerClass: "mb-10",
    panelClass: "mt-6",
  },
  {
    name: "compact",
    countryGridClass: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    packageGridClass: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    cardRotation: 2,
    gap: "gap-3",
    headerClass: "mb-8",
    panelClass: "mt-4",
  },
  {
    name: "spacious",
    countryGridClass: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3",
    packageGridClass: "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3",
    cardRotation: -1,
    gap: "gap-6",
    headerClass: "mb-12",
    panelClass: "mt-8",
  },
  {
    name: "highlighted",
    countryGridClass: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    packageGridClass: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
    cardRotation: 0,
    gap: "gap-5",
    headerClass: "mb-10",
    panelClass: "mt-6",
    highlight: true,
  },
  {
    name: "minimal",
    countryGridClass: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3",
    packageGridClass: "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
    cardRotation: 0,
    gap: "gap-2",
    headerClass: "mb-6",
    panelClass: "mt-3",
  },
];

export default function DynamicDestinationsSection() {
  const [layoutConfig, setLayoutConfig] = useState(LAYOUT_CONFIGS[0]);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const mountedRef = useRef(false);

  // Change layout on mount and periodically
  useEffect(() => {
    if (!mountedRef.current) {
      // Initial layout on mount
      mountedRef.current = true;
      setLayoutIndex(Math.floor(Math.random() * LAYOUT_CONFIGS.length));
      setLayoutConfig(LAYOUT_CONFIGS[layoutIndex]);
    } else {
      // Change layout every 5 seconds for demo (remove in production if not wanted)
      const interval = setInterval(() => {
        const nextIndex = (layoutIndex + 1) % LAYOUT_CONFIGS.length;
        setLayoutIndex(nextIndex);
        setLayoutConfig(LAYOUT_CONFIGS[nextIndex]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [layoutIndex]);

  // Alternative: Change layout on every re-round (comment out the interval above if using this)
  // useEffect(() => {
  //   if (mountedRef.current) {
  //     const newIndex = Math.floor(Math.random() * LAYOUT_CONFIGS.length);
  //     setLayoutIndex(newIndex);
  //     setLayoutConfig(LAYOUT_CONFIGS[newIndex]);
  //   }
  // });

  return (
    <div className="relative">
      {/* Add dynamic styling based on layout config */}
      <div
        className={`${layoutConfig.highlight ? "border-2 border-primary-500/20 rounded-xl p-4" : ""}
                   ${layoutConfig.headerClass}
                   transition-all duration-500 ease-in-out`}
        style={{
          transform: `rotate(${layoutConfig.cardRotation}deg)`,
          transition: "transform 0.5s ease, opacity 0.5s ease"
        }}
      >
        {/* Wrap the original DestinationsSection with dynamic class injection */}
        <DestinationsSection
          data-layout={layoutConfig.name}
          className={`dynamic-layout-${layoutConfig.name}`}
        />

        {/* Optional: Add visual indicator for demo purposes */}
        {!process.env.NODE_ENV === "production" && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {layoutConfig.name}
          </div>
        )}
      </div>
    </div>
  );
}