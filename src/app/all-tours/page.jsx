"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Star, MapPin, Calendar, Users, ArrowRight, Search, Filter } from "lucide-react";
import { TourDetailsModal } from "../components/tour-details-modal";
import { PremiumLoader } from "../components/premium-loader";
import { portfolioItems, tourCategories } from "../../allAPIs/tours";

export default function AllTours() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTours, setFilteredTours] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading

    return () => clearTimeout(timer);
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let tours = [...portfolioItems];

    // Apply search filter
    if (debouncedSearchTerm) {
      tours = tours.filter(tour =>
        tour.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        tour.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Apply sorting
    tours.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
        case "price-high":
          return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
        case "rating":
          return b.rating - a.rating;
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    setFilteredTours(tours);
  }, [debouncedSearchTerm, sortBy]);

  // Define filteredItems for use in render
  const filteredItems = filteredTours;

  const openTourDetails = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
  };

  const handleEnquireNow = (journey) => {
    if (isClient) {
      // Store selected journey in localStorage for booking page
      localStorage.setItem('selectedJourney', JSON.stringify(journey));
      // Redirect to booking page
      window.location.href = '/booking';
    }
  };

  return (
    <>
      {/* Premium Loader */}

      {isLoading && <PremiumLoader />}
      {/* Main Content */}
      {!isLoading && (
        <div className="min-h-screen bg-[#F5F7FA] text-black">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {isClient ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
                All <span className="text-[#C9A24D]">Journeys</span>
              </h1>
              <p className="font-['Cormorant_Garamond'] text-xl text-gray-300 max-w-2xl mx-auto">
                Explore our complete collection of extraordinary travel experiences
              </p>
            </motion.div>
          ) : (
            <div className="text-center">
              <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
                All <span className="text-[#C9A24D]">Journeys</span>
              </h1>
              <p className="font-['Cormorant_Garamond'] text-xl text-gray-300 max-w-2xl mx-auto">
                Explore our complete collection of extraordinary travel experiences
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search destinations, experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border text-black border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent font-['Inter']"
              />
            </div>
            
            {/* Filter Button */}
            <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl font-['Inter'] font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search destinations, experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border text-black border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent font-['Inter']"
              />
            </div>
            
            {/* Filter Button */}
            <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl font-['Inter'] font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </button>
          </div>
        )}

        {/* Category Filter */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {tourCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-['Inter'] font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#C9A24D] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {tourCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-['Inter'] font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#C9A24D] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            isClient ? (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A24D]/20"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Featured Badge */}
                {item.featured && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-4 left-4 z-10 bg-[#C9A24D] text-white px-3 py-1 rounded-full text-xs font-['Inter'] font-semibold"
                  >
                    FEATURED
                  </motion.div>
                )}

                {/* Main Card */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay with Quick Actions */}
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
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-3 font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] group-hover:text-[#C9A24D] transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span className="text-sm">{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span className="text-sm">{item.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="font-['Inter'] text-lg font-bold text-[#C9A24D]">
                        {item.price}
                      </p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3 mt-4">
                    <motion.button
                      onClick={() => openTourDetails(item)}
                      className="flex-1 bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-3 rounded-lg font-['Inter'] font-semibold transition-all duration-300 hover:from-[#1a3a52] hover:to-[#0B1C2D]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleEnquireNow(item)}
                      className="bg-[#C9A24D] text-white px-4 py-3 rounded-lg font-['Inter'] font-semibold transition-all duration-300 hover:bg-[#d4b05e]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div
                key={item.id}
                className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A24D]/20 opacity-100"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-4 left-4 z-10 bg-[#C9A24D] text-white px-3 py-1 rounded-full text-xs font-['Inter'] font-semibold">
                    FEATURED
                  </div>
                )}

                {/* Main Card */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-3 font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] group-hover:text-[#C9A24D] transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span className="text-sm">{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span className="text-sm">{item.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="font-['Inter'] text-lg font-bold text-[#C9A24D]">
                        {item.price}
                      </p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openTourDetails(item)}
                      className="flex-1 bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-3 rounded-lg font-['Inter'] font-semibold transition-all duration-300 hover:from-[#1a3a52] hover:to-[#0B1C2D]"
                    >
                      View Details
                    </button>
                    
                    <button
                      onClick={() => handleEnquireNow(item)}
                      className="bg-[#C9A24D] text-white px-4 py-3 rounded-lg font-['Inter'] font-semibold transition-all duration-300 hover:bg-[#d4b05e]"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          isClient ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">No tours found</h3>
              <p className="font-['Inter'] text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">No tours found</h3>
              <p className="font-['Inter'] text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )
        )}
      </div>

      {/* Tour Details Modal */}
      <TourDetailsModal
        tour={selectedTour}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
         </div>
      )
         }
    </>
      )

}
