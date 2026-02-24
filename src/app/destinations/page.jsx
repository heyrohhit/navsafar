"use client";
import { useState, useEffect } from "react";

const DestinationsSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredDestination, setHoveredDestination] = useState(null);

  // Static destinations data instead of import
  const destinations = [
    {
      id: 1,
      name: "Manali",
      tagline: "Valley of Gods",
      gradient: "from-green-500 to-emerald-600",
      price: "₹12,999",
      duration: "5 Days / 4 Nights",
      rating: "4.8",
      image: "",
      highlights: ["Snow Mountains", "Adventure Sports", "Valley Views"],
      discount: "25% OFF",
      packages: 12,
      description: "Experience the breathtaking beauty of Himalayan mountains with snow-capped peaks, adventure sports, and serene valley views.",
      bestTime: "March to June",
      activities: ["Trekking", "Skiing", "Paragliding", "River Rafting"]
    },
    {
      id: 2,
      name: "Goa", 
      tagline: "Beach Paradise",
      gradient: "from-blue-500 to-cyan-600",
      price: "₹15,999",
      duration: "4 Days / 3 Nights",
      rating: "4.9",
      image: "",
      highlights: ["Beaches", "Nightlife", "Water Sports"],
      discount: "30% OFF",
      packages: 18,
      description: "Relax on pristine golden beaches, enjoy vibrant nightlife, and experience thrilling water sports in this coastal paradise.",
      bestTime: "November to February",
      activities: ["Beach Hopping", "Water Sports", "Nightlife", "Seafood"]
    },
    {
      id: 3,
      name: "Kerala",
      tagline: "God's Own Country", 
      gradient: "from-purple-500 to-pink-600",
      price: "₹18,999",
      duration: "6 Days / 5 Nights",
      rating: "4.7",
      image: "",
      highlights: ["Backwaters", "Houseboats", "Ayurveda"],
      discount: "27% OFF",
      packages: 15,
      description: "Cruise through serene backwaters, stay in traditional houseboats, and rejuvenate with authentic Ayurvedic treatments.",
      bestTime: "September to March",
      activities: ["Backwater Cruise", "Houseboat Stay", "Ayurvedic Massage", "Kathakali Show"]
    },
    {
      id: 4,
      name: "Dubai",
      tagline: "City of Gold",
      gradient: "from-amber-500 to-orange-600",
      price: "₹45,999",
      duration: "5 Days / 4 Nights",
      rating: "4.9",
      image: "",
      highlights: ["Burj Khalifa", "Desert Safari", "Shopping"],
      discount: "30% OFF",
      packages: 25,
      description: "Experience luxury in the desert city with world-class shopping, iconic architecture, and thrilling desert adventures.",
      bestTime: "November to March",
      activities: ["Burj Khalifa", "Desert Safari", "Dubai Mall", "Dhow Cruise"]
    },
    {
      id: 5,
      name: "Singapore",
      tagline: "Lion City",
      gradient: "from-red-500 to-pink-600",
      price: "₹38,999",
      duration: "4 Days / 3 Nights",
      rating: "4.9",
      image: "",
      highlights: ["Gardens by the Bay", "Universal Studios", "Marina Bay"],
      discount: "26% OFF",
      packages: 14,
      description: "Explore futuristic gardens, enjoy world-class theme parks, and experience the perfect blend of cultures in this modern city-state.",
      bestTime: "February to April",
      activities: ["Gardens by the Bay", "Universal Studios", "Sentosa Island", "Night Safari"]
    },
    {
      id: 6,
      name: "Bali",
      tagline: "Island of Gods",
      gradient: "from-teal-500 to-green-600",
      price: "₹42,999",
      duration: "6 Days / 5 Nights",
      rating: "4.9",
      image: "",
      highlights: ["Beaches", "Temples", "Rice Terraces"],
      discount: "27% OFF",
      packages: 16,
      description: "Discover tropical paradise with stunning beaches, ancient temples, and lush rice terraces in this Indonesian gem.",
      bestTime: "April to October",
      activities: ["Beach Clubs", "Temple Tours", "Rice Terrace Trek", "Traditional Dance"]
    }
  ];

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 400);
  }, []);

  const handleDestinationHover = (id) => {
    setHoveredDestination(id);
  };

  const handleDestinationLeave = () => {
    setHoveredDestination(null);
  };

  const handleExploreDestination = (destination) => {
    const whatsappNumber = "+918700750589";
    const message = `Destination Query:\n\nDestination: ${destination.name}\nTagline: ${destination.tagline}\nPrice: ${destination.price}\nDuration: ${destination.duration}\nRating: ${destination.rating}\n\nPlease provide more details about ${destination.name} packages!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 backdrop-blur-sm rounded-full border border-cyan-500/20 mb-6 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-cyan-300 text-sm font-medium">Popular Destinations</span>
          </div>
          
          <h2 
            className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Most Loved
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Travel Destinations
            </span>
          </h2>
          
          <p 
            className={`text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Handpicked destinations loved by thousands of travelers worldwide
          </p>
        </div>
        
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div 
              key={destination.id}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-700 transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } ${hoveredDestination === destination.id ? 'scale-105' : ''}`}
              style={{
                transitionDelay: `${(index + 4) * 150}ms`,
              }}
              onMouseEnter={() => handleDestinationHover(destination.id)}
              onMouseLeave={handleDestinationLeave}
            >
              {/* Card Background */}
              <div className={`h-72 bg-gradient-to-br ${destination.gradient} flex items-center justify-center relative overflow-hidden`}>
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
                  <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-ping"></div>
                </div>
                
                {/* Content */}
                <div className="text-white text-center z-10 relative">
                  <div className="text-5xl mb-3 transform transition-transform duration-500 group-hover:scale-110">
                    {destination.image}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-white/80 text-sm">{destination.tagline}</p>
                </div>
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {destination.discount}
                  </span>
                </div>

                {/* Package Count */}
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full shadow-lg">
                    {destination.packages}+ Packages
                  </span>
                </div>
              </div>
              
              {/* Card Bottom */}
              <div className="p-6 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-sm">
                {/* Rating and Duration */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(destination.rating) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/80 text-sm">{destination.rating}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{destination.duration}</span>
                </div>
                
                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.map((highlight, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>
                
                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{destination.description}</p>
                
                {/* Best Time to Visit */}
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-400 text-xs">Best Time: {destination.bestTime}</span>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-white">{destination.price}</span>
                    <span className="text-gray-400 text-xs ml-2">per person</span>
                  </div>
                  <button 
                    onClick={() => handleExploreDestination(destination)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Explore
                  </button>
                </div>

                {/* Activities (shown on hover) */}
                <div 
                  className={`transition-all duration-500 ${
                    hoveredDestination === destination.id ? 'translate-y-0 opacity-100 max-h-20' : 'translate-y-2 opacity-0 max-h-0'
                  } overflow-hidden`}
                >
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-cyan-400 text-xs font-semibold mb-2">Popular Activities:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.activities.map((activity, i) => (
                        <span key={i} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Glow */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '1400ms' }}
        >
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25">
            View All Destinations
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
