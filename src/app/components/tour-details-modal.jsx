"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { X, Star, MapPin, Calendar, Users, ArrowRight, Heart, Share2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TourDetailsModal({ tour, isOpen, onClose }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isOpen || !tour) return null;

  const handleBooking = () => {
    if (isClient) {
      localStorage.setItem('selectedJourney', JSON.stringify(tour));
      window.location.href = '/booking';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      {isClient ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      ) : (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Modal Content */}
      <div className="flex min-h-full items-center justify-center p-4">
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200 shadow-lg"
          >
            <X size={24} className="text-gray-700" />
          </button>

          {/* Hero Image */}
          <div className="relative h-80 md:h-96">
            <ImageWithFallback
              src={tour.image}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Badge */}
            {tour.featured && (
              <div className="absolute top-4 left-4 bg-[#C9A24D] text-white px-4 py-2 rounded-full font-['Inter'] font-semibold">
                FEATURED
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white mb-2">
                {tour.title}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Star className="text-[#C9A24D]" size={20} fill="#C9A24D" />
                  <span className="font-['Inter'] font-semibold">{tour.rating}</span>
                </div>
                <span className="font-['Inter']">•</span>
                <span className="font-['Inter']">{tour.category}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                <MapPin className="text-[#C9A24D] mx-auto mb-2" size={24} />
                <p className="font-['Inter'] text-sm text-gray-600">Location</p>
                <p className="font-['Inter'] font-semibold text-gray-900">{tour.location}</p>
              </div>
              <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                <Calendar className="text-[#C9A24D] mx-auto mb-2" size={24} />
                <p className="font-['Inter'] text-sm text-gray-600">Duration</p>
                <p className="font-['Inter'] font-semibold text-gray-900">{tour.duration}</p>
              </div>
              <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                <Users className="text-[#C9A24D] mx-auto mb-2" size={24} />
                <p className="font-['Inter'] text-sm text-gray-600">Group Size</p>
                <p className="font-['Inter'] font-semibold text-gray-900">{tour.groupSize}</p>
              </div>
              <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                <p className="font-['Inter'] text-sm text-gray-600">Price</p>
                <p className="font-['Inter'] font-semibold text-[#C9A24D]">{tour.price}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#0B1C2D] mb-4">
                About This Journey
              </h2>
              <p className="font-['Inter'] text-gray-700 leading-relaxed text-lg">
                {tour.description}
              </p>
            </div>

            {/* Inclusions */}
            <div className="mb-8">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] mb-4">
                What's Included
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Luxury Accommodations",
                  "Daily Breakfast & Dinner",
                  "Professional Tour Guide",
                  "Airport Transfers",
                  "Sightseeing Entrance Fees",
                  "Travel Insurance"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#C9A24D] rounded-full"></div>
                    <span className="font-['Inter'] text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isClient ? (
                <motion.button
                  onClick={handleBooking}
                  className="flex-1 bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-4 rounded-xl font-['Inter'] font-bold transition-all duration-300 hover:from-[#1a3a52] hover:to-[#0B1C2D] flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Now <ArrowRight size={20} />
                </motion.button>
              ) : (
                <button
                  onClick={handleBooking}
                  className="flex-1 bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-4 rounded-xl font-['Inter'] font-bold transition-all duration-300 hover:from-[#1a3a52] hover:to-[#0B1C2D] flex items-center justify-center gap-2"
                >
                  Book Now <ArrowRight size={20} />
                </button>
              )}
              
              <button className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-['Inter'] font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2">
                <Heart size={20} />
                Save to Wishlist
              </button>
              
              <button className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-['Inter'] font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2">
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>
        </motion.div>
        ) : (
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Static fallback for server-side rendering */}
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200 shadow-lg"
            >
              <X size={24} className="text-gray-700" />
            </button>

            {/* Hero Image */}
            <div className="relative h-80 md:h-96">
              <ImageWithFallback
                src={tour.image}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {tour.featured && (
                <div className="absolute top-4 left-4 bg-[#C9A24D] text-white px-4 py-2 rounded-full font-['Inter'] font-semibold">
                  FEATURED
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white mb-2">
                  {tour.title}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="text-[#C9A24D]" size={20} fill="#C9A24D" />
                    <span className="font-['Inter'] font-semibold">{tour.rating}</span>
                  </div>
                  <span className="font-['Inter']">•</span>
                  <span className="font-['Inter']">{tour.category}</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                  <MapPin className="text-[#C9A24D] mx-auto mb-2" size={24} />
                  <p className="font-['Inter'] text-sm text-gray-600">Location</p>
                  <p className="font-['Inter'] font-semibold text-gray-900">{tour.location}</p>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                  <Calendar className="text-[#C9A24D] mx-auto mb-2" size={24} />
                  <p className="font-['Inter'] text-sm text-gray-600">Duration</p>
                  <p className="font-['Inter'] font-semibold text-gray-900">{tour.duration}</p>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                  <Users className="text-[#C9A24D] mx-auto mb-2" size={24} />
                  <p className="font-['Inter'] text-sm text-gray-600">Group Size</p>
                  <p className="font-['Inter'] font-semibold text-gray-900">{tour.groupSize}</p>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                  <p className="font-['Inter'] text-sm text-gray-600">Price</p>
                  <p className="font-['Inter'] font-semibold text-[#C9A24D]">{tour.price}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#0B1C2D] mb-4">
                  About This Journey
                </h2>
                <p className="font-['Inter'] text-gray-700 leading-relaxed text-lg">
                  {tour.description}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] mb-4">
                  What's Included
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Luxury Accommodations",
                    "Daily Breakfast & Dinner",
                    "Professional Tour Guide",
                    "Airport Transfers",
                    "Sightseeing Entrance Fees",
                    "Travel Insurance"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#C9A24D] rounded-full"></div>
                      <span className="font-['Inter'] text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBooking}
                  className="flex-1 bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-4 rounded-xl font-['Inter'] font-bold transition-all duration-300 hover:from-[#1a3a52] hover:to-[#0B1C2D] flex items-center justify-center gap-2"
                >
                  Book Now <ArrowRight size={20} />
                </button>
                
                <button className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-['Inter'] font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2">
                  <Heart size={20} />
                  Save to Wishlist
                </button>
                
                <button className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-['Inter'] font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
  );
}
