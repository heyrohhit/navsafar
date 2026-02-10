"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { TourDetailsModal } from "./tour-details-modal";
import { portfolioItems, tourCategories } from "../../allAPIs/tours";

export function PremiumPortfolio({ maxItems = null }) {
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure data is loaded before rendering
  if (!portfolioItems || !tourCategories || portfolioItems.length === 0) {
    return (
      <div className="py-24 bg-gradient-to-b from-white to-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">Loading tours...</p>
        </div>
      </div>
    );
  }

  // Filter items based on selected category
  const getFilteredItems = () => {
    if (selectedCategory === "All") {
      return portfolioItems;
    }
    return portfolioItems.filter(item => item && item.category === selectedCategory);
  };

  const filteredItems = getFilteredItems();

  // Limit items if maxItems prop is provided
  const displayItems = maxItems ? filteredItems.slice(0, maxItems) : filteredItems;

  const openTourDetails = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
  };

  const handleEnquireNow = (item) => {
    if (isClient) {
      localStorage.setItem('selectedJourney', JSON.stringify(item));
      window.location.href = '/booking';
    }
  };

  const handleViewAllJourneys = () => {
    if (isClient) {
      window.location.href = '/all-tours';
    }
  };

  return (
    <>
      <section className="py-24 bg-gradient-to-b from-white to-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#0B1C2D] mb-6">
              Featured <span className="text-[#C9A24D]">Journeys</span>
            </h2>
            <p className="font-['Cormorant_Garamond'] text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our handpicked collection of extraordinary travel experiences, 
              each meticulously crafted to exceed your expectations.
            </p>
          </motion.div>
        ) : (
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#0B1C2D] mb-6">
              Featured <span className="text-[#C9A24D]">Journeys</span>
            </h2>
            <p className="font-['Cormorant_Garamond'] text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our handpicked collection of extraordinary travel experiences, 
              each meticulously crafted to exceed your expectations.
            </p>
          </div>
        )}

        {/* Category Filter */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {tourCategories.map((category, index) => (
              <motion.button
                key={`category-${index}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-['Inter'] font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#C9A24D] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {tourCategories.map((category, index) => (
              <button
                key={`category-${index}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-['Inter'] font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#C9A24D] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, index) => (
            <div key={item.id} className="relative group">
              {isClient ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative group"
                >
                  {item && item.featured && (
                    isClient ? (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 left-4 z-10 bg-[#C9A24D] text-white px-3 py-1 rounded-full text-xs font-['Inter'] font-semibold"
                      >
                        FEATURED
                      </motion.div>
                    ) : (
                      <div className="absolute top-4 left-4 z-10 bg-[#C9A24D] text-white px-3 py-1 rounded-full text-xs font-['Inter'] font-semibold">
                        FEATURED
                      </div>
                    )
                  )}

                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {isClient ? (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                        >
                          <div className="absolute bottom-4 left-4 right-4">
                            <motion.button
                              onClick={() => openTourDetails(item)}
                              className="w-full bg-[#C9A24D] text-white py-3 rounded-lg font-['Inter'] font-semibold flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View Details <ArrowRight size={18} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4">
                            <button
                              onClick={() => openTourDetails(item)}
                              className="w-full bg-[#C9A24D] text-white py-3 rounded-lg font-['Inter'] font-semibold flex items-center justify-center gap-2"
                            >
                              View Details <ArrowRight size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] group-hover:text-[#C9A24D] transition-colors duration-300">
                          {item && item.title ? item.title : 'Untitled Tour'}
                        </h3>
                        <div className="flex items-center gap-1 bg-[#F5F7FA] px-2 py-1 rounded-lg">
                          <Star className="text-[#C9A24D]" size={14} fill="#C9A24D" />
                          <span className="font-['Inter'] text-sm font-semibold">{item && item.rating ? item.rating : 'N/A'}</span>
                        </div>
                      </div>

                      <p className="font-['Inter'] text-sm text-[#C9A24D] font-medium mb-3">
                        {item && item.category ? item.category : 'Uncategorized'}
                      </p>

                      <p className="font-['Inter'] text-gray-600 text-sm mb-4 line-clamp-2">
                        {item && item.description ? item.description : 'No description available'}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={14} className="text-[#C9A24D]" />
                          <span className="font-['Inter'] text-xs">{item && item.location ? item.location : 'Location not available'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-[#C9A24D]" />
                          <span className="font-['Inter'] text-xs">{item && item.duration ? item.duration : 'Duration not available'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users size={14} className="text-[#C9A24D]" />
                          <span className="font-['Inter'] text-xs">{item && item.groupSize ? item.groupSize : 'Group size not available'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-['Inter'] text-xs font-semibold text-[#C9A24D]">
                            {item && item.price ? item.price : 'Price not available'}
                          </span>
                        </div>
                      </div>

                      {isClient ? (
                        <motion.button
                          onClick={() => {
                            localStorage.setItem('selectedJourney', JSON.stringify(item));
                            window.location.href = '/booking';
                          }}
                          className="w-full bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-3 rounded-lg font-['Inter'] font-semibold transition-all duration-300 hover:from-[#1a3a52] hover:to-[#0B1C2D]"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Enquire Now
                        </motion.button>
                      ) : (
                        <button
                          onClick={() => {
                            localStorage.setItem('selectedJourney', JSON.stringify(item));
                            window.location.href = '/booking';
                          }}
                          className="w-full bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-3 rounded-lg font-['Inter'] font-semibold transition-all duration-300 hover:from-[#1a3a52] hover:to-[#0B1C2D]"
                        >
                          Enquire Now
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative group"
                >
                  {item.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-[#C9A24D] text-white px-3 py-1 rounded-full text-xs font-['Inter'] font-semibold">
                      FEATURED
                    </div>
                  )}

                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D]">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1 bg-[#F5F7FA] px-2 py-1 rounded-lg">
                            <Star className="text-[#C9A24D]" size={14} fill="#C9A24D" />
                            <span className="font-['Inter'] text-sm font-semibold">{item.rating}</span>
                          </div>
                        </div>
                        <p className="font-['Inter'] text-sm text-[#C9A24D] font-medium mb-3">
                          {item.category}
                        </p>
                        <p className="font-['Inter'] text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={14} className="text-[#C9A24D]" />
                            <span className="font-['Inter'] text-xs">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} className="text-[#C9A24D]" />
                            <span className="font-['Inter'] text-xs">{item.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users size={14} className="text-[#C9A24D]" />
                            <span className="font-['Inter'] text-xs">{item.groupSize}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-['Inter'] text-xs font-semibold text-[#C9A24D]">
                              {item.price}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            localStorage.setItem('selectedJourney', JSON.stringify(item));
                            window.location.href = '/booking';
                          }}
                          className="w-full bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-3 rounded-lg font-['Inter'] font-semibold"
                        >
                          Enquire Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <motion.button
              onClick={handleViewAllJourneys}
              className="bg-transparent border-2 border-[#C9A24D] text-[#C9A24D] px-10 py-4 rounded-xl font-['Cormorant_Garamond'] font-bold text-lg hover:bg-[#C9A24D] hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Journeys
            </motion.button>
          </motion.div>
        ) : (
          <div className="text-center mt-16">
            <button
              onClick={handleViewAllJourneys}
              className="bg-transparent border-2 border-[#C9A24D] text-[#C9A24D] px-10 py-4 rounded-xl font-['Cormorant_Garamond'] font-bold text-lg hover:bg-[red] hover:text-white transition-all duration-300"
            >
              ViewsAll Journeys
            </button>
          </div>
        )}
      </div>
    </section>


    {/* Tour Details Modal */}
    <TourDetailsModal
      tour={selectedTour}
      isOpen={isModalOpen}
      onClose={closeModal}
    />
    </>
  );
}
