// src/app/components/hero/OptimizedHeroImage.jsx
"use client";

import Image from "next/image";
import { useState } from "react";

const OptimizedHeroImage = ({ src, alt, priority = false }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="relative w-full h-full"
      style={{
        minHeight: "500px",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB8n/9k="
        onLoadingComplete={() => setIsLoading(false)}
        style={{
          objectFit: "cover",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default OptimizedHeroImage;
