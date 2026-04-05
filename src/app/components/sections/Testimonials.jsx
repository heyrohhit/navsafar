"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Calendar, ChevronRight, Quote } from "lucide-react";
import { getTestimonials } from "../../lib/getTestimonials";

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
        {rating}.0
      </span>
    </div>
  );
};

// Single Testimonial Card
const TestimonialCard = ({ testimonial, isFeatured = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${
        isFeatured
          ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-800 shadow-lg scale-105"
          : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md hover:shadow-xl"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <Quote size={48} className="text-amber-500" />
      </div>

      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          ⭐ Featured Review
        </div>
      )}

      {/* Header: Avatar + Name + Rating */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-600 flex-shrink-0">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ${
                testimonial.avatar ? "hidden" : "flex"
              }`}
            >
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg truncate">
            {testimonial.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <StarRating rating={testimonial.rating} />
          </div>
          {testimonial.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <MapPin size={12} />
              <span>{testimonial.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Trip Badge */}
      <div className="mb-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          ✈️ {testimonial.trip}
        </span>
      </div>

      {/* Review Text */}
      <div className="flex-1 mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed italic">
          "{testimonial.review}"
        </p>
      </div>

      {/* Footer: Date + Created At */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{testimonial.travelDate || "Visit date not specified"}</span>
        </div>
        <div className="text-[10px] opacity-60">
          {new Date(testimonial.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Hover Effect for Featured */}
      {isHovered && isFeatured && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none"
        />
      )}
    </motion.div>
  );
};

// Main Testimonials Section
export default function Testimonials({
  title = "What Our Travelers Say",
  subtitle = "Real experiences from real travelers who explored the world with NavSafar",
  featuredOnly = false,
  limit = 6,
  showControls = true,
  backgroundColor = "bg-gray-50 dark:bg-slate-900",
}) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch testimonials
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true);
        const data = await getTestimonials({
          featured: featuredOnly,
          limit: limit * 2,
        });
        setTestimonials(data); // Could be empty array — that's fine
      } catch (err) {
        console.error("Failed to load testimonials:", err);
        setTestimonials([]); // Hide section on error
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, [featuredOnly, limit]);

  // Load more
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + (isMobile ? 2 : 3), testimonials.length));
  }, [isMobile, testimonials.length]);

  const getGridCols = () => {
    if (isMobile) return "grid-cols-1";
    if (testimonials.length <= 3) return "grid-cols-1 md:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  // ✅ Loading state — show skeleton
  if (loading) {
    return (
      <section className={`py-16 px-4 ${backgroundColor}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-xl w-72 mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-lg w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-slate-700 rounded-2xl h-64" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ✅ No data — hide section completely (return null)
  if (testimonials.length === 0) {
    return null;
  }

  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  return (
    <section className={`py-16 px-4 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
            {subtitle}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full">
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {testimonials.length}+ Reviews
            </span>
            <span className="text-gray-500 dark:text-gray-400">|</span>
            <span className="text-amber-600 dark:text-amber-400">
              From verified travelers
            </span>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className={`grid ${getGridCols()} gap-6`}>
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id || testimonial.id}
                testimonial={testimonial}
                isFeatured={testimonial.isFeatured}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {showControls && hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>Load More Reviews</span>
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
        >
          {[
            { label: "Total Reviews",   value: testimonials.length, icon: "📝" },
            {
              label: "Average Rating",
              value: (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1),
              icon: "⭐",
            },
            { label: "5-Star Reviews",  value: testimonials.filter((t) => t.rating === 5).length, icon: "🌟" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md"
            >
              <div className="text-2xl md:text-3xl mb-1">{stat.icon}</div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}