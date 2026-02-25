"use client";
import { useEffect, useRef, useState } from "react";

export default function InfiniteSlider({ features }) {
  const trackRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const total = features.length;

  // duplicate items
  const extended = [...features, ...features];

  useEffect(() => {
    if (!trackRef.current) return;

    const firstCard = trackRef.current.querySelector(".card");
    if (firstCard) {
      setCardWidth(firstCard.offsetWidth);
    }

    const handleResize = () => {
      if (firstCard) {
        setCardWidth(firstCard.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let position = 0;

    const animate = () => {
      position -= 0.5; // speed control (lower = slower)

      if (Math.abs(position) >= cardWidth * total) {
        position = 0; // seamless reset
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${position}px)`;
      }

      requestAnimationFrame(animate);
    };

    if (cardWidth) {
      requestAnimationFrame(animate);
    }
  }, [cardWidth, total]);

  return (
    <div className="w-full overflow-hidden py-16">
      <div
        ref={trackRef}
        className="flex"
        style={{ willChange: "transform" }}
      >
        {extended.map((feature, i) => (
          <div
            key={i}
            className="card flex-shrink-0  w-[260px] sm:w-[300px] lg:w-[340px]"
          >
            <div className="m-4 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl bg-[#0F6177]">

              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl text-white mb-6">
                {feature.icon}
              </div>

              <h3 className="text-white text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400">
                {feature.description}
              </p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}