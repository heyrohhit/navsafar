"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Star, MapPin, Calendar, Users, ArrowLeft, ArrowRight, Filter, Search } from "lucide-react";
import { TourDetailsModal } from "../../components/tour-details-modal";
import { portfolioItems } from "../../../allAPIs/tours";

export default function ServiceCategory() {
  const params = useParams();
  const [isClient, setIsClient] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [filteredTours, setFilteredTours] = useState([]);

  const service = params.service ? decodeURIComponent(params.service).replace(/-/g, ' ') : '';

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let tours = [];
    
    // Filter tours based on service category
    if (service.toLowerCase().includes('domestic')) {
      tours = portfolioItems.filter(tour => 
        tour.location.toLowerCase().includes('india') ||
        tour.title.toLowerCase().includes('domestic') ||
        tour.category.toLowerCase().includes('domestic')
      );
    } else if (service.toLowerCase().includes('international')) {
      tours = portfolioItems.filter(tour => 
        !tour.location.toLowerCase().includes('india') &&
        (tour.category.toLowerCase().includes('international') || 
         tour.title.toLowerCase().includes('international'))
      );
    } else if (service.toLowerCase().includes('corporate')) {
      tours = portfolioItems.filter(tour => 
        tour.category.toLowerCase().includes('corporate') ||
        tour.category.toLowerCase().includes('mice') ||
        tour.title.toLowerCase().includes('corporate')
      );
    } else {
      tours = portfolioItems;
    }

    // Apply search filter
    if (debouncedSearchTerm) {
      tours = tours.filter(tour =>
        tour.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
  }, [service, debouncedSearchTerm, sortBy]);

  const getServiceImage = () => {
    const serviceImages = {
      "Domestic Tours": "https://images.unsplash.com/photo-1636649967597-ee5690e3c1cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fERvbWVzdGljfGVufDB8fDB8fHww",
      "International Tours": "https://images.unsplash.com/photo-1668120084348-efc2ba0ad31d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SW50ZXJuYXRpb25hbHxlbnwwfHwwfHx8MA%3D%3D",
      "Corporate Travel": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q29ycG9yYXRlfGVufDB8fDB8fHww"
    };
    return serviceImages[service] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1080";
  };

  const getServiceDescription = () => {
    const descriptions = {
  "Domestic Tours": "Explore the best domestic tour packages in India, featuring iconic destinations, cultural experiences, family holidays, and adventure travel across the country",
  
  "International Tours": "Book luxury international tour packages to top global destinations with seamless planning, guided experiences, and unforgettable travel moments",
  
  "Corporate Travel": "Professional corporate travel management services including business travel, MICE, conferences, and incentive tours with end-to-end support",
  
  "Religious Tours": "Discover the best religious and pilgrimage tour packages to sacred temples and spiritual destinations, offering peace, devotion, and guided journeys",
  
  "Customized Tours": "Create fully customized tour packages tailored to your travel style, budget, honeymoon plans, family vacations, or adventure holidays"
};

    return descriptions[service] || "Explore our best tour packages, customized holidays, and travel services for memorable journeys";

  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback 
            src={getServiceImage()} 
            alt={service} 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/80" />
        </div>
        
        <div className="relative flex h-full items-center">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              {isClient ? (
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-6 font-['Playfair_Display'] text-4xl font-bold text-white md:text-6xl"
                >
                  {service}
                </motion.h1>
              ) : (
                <h1 className="mb-6 font-['Playfair_Display'] text-4xl font-bold text-white md:text-6xl opacity-100">
                  {service}
                </h1>
              )}
              
              {isClient ? (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg text-white md:text-xl"
                >
                  {getServiceDescription()}
                </motion.p>
              ) : (
                <p className="text-lg text-white md:text-xl opacity-100">
                  {getServiceDescription()}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-[#C9A24D] focus:outline-none"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A24D] focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-[#C9A24D] hover:text-[#B8934D] transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
              Previous Page
            </button>
          </div>

          {filteredTours.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">No tours found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredTours.map((tour, index) => (
                isClient ? (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A24D]/20 group-hover:scale-110"
                    onClick={() => setSelectedTour(tour)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={tour.image}
                        alt={tour.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {tour.featured && (
                        <div className="absolute left-4 top-4 rounded-full bg-[#C9A24D] px-3 py-1 text-xs font-semibold text-white">
                          Featured
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="mb-2 font-['Playfair_Display'] text-xl font-bold text-white">
                          {tour.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span>{tour.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} />
                          <span className="text-sm">{tour.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span className="text-sm">{tour.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span className="text-sm">{tour.groupSize}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="font-['Inter'] text-lg font-bold text-[#C9A24D]">
                            {tour.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[#C9A24D]">
                          <span className="text-sm font-medium">View Details</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div
                    key={tour.id}
                    className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A24D]/20 opacity-100"
                    onClick={() => setSelectedTour(tour)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={tour.image}
                        alt={tour.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {tour.featured && (
                        <div className="absolute left-4 top-4 rounded-full bg-[#C9A24D] px-3 py-1 text-xs font-semibold text-white">
                          Featured
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="mb-2 font-['Playfair_Display'] text-xl font-bold text-white">
                          {tour.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span>{tour.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} />
                          <span className="text-sm">{tour.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span className="text-sm">{tour.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span className="text-sm">{tour.groupSize}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="font-['Inter'] text-lg font-bold text-[#C9A24D]">
                            {tour.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[#C9A24D]">
                          <span className="text-sm font-medium">View Details</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tour Details Modal */}
      {selectedTour && (
        <TourDetailsModal
          tour={selectedTour}
          isOpen={!!selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}
    </div>
  );
}
