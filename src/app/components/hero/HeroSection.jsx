"use client";
import { useState, useEffect } from "react";

const HeroSection = ({ isMenuOpen }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    budget: 25000,
    travelers: 2
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setIsLoaded(true), 100);
    
    const handleScroll = () => {
      if (!isMenuOpen) {
        setScrollY(window.scrollY);
      }
    };
    
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search data:", searchData);
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleExplorePackages = () => {
    // Send search data to WhatsApp
    const whatsappNumber = "+918700750589";
    const message = `New Package Query:\n\nDestination: ${searchData.destination || "Not specified"}\nDate: ${searchData.date || "Not specified"}\nBudget: ₹${searchData.budget}\nTravelers: ${searchData.travelers}\n\nPlease contact me with best packages!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleResetForm = () => {
    setSearchData({
      destination: "",
      date: "",
      budget: 25000,
      travelers: 1
    });
  };

  return (
    <section className="relative min-h-screen pt-8 overflow-hidden bg-[url('/assets/bg.jpg')] bg-cover bg-no-repeat bg-center" style={{ backgroundColor: '#0E2A47' }} id="feature">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Background Image/Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/100 to-black/60"></div>
        
        {/* Animated Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-ping"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 text-center">
        <div className="space-y-5">
          {/* Main Heading */}
          <h1 
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{
              transform: isClient ? `translateY(${-scrollY * 0.3}px)` : 'none',
            }}
          >
            <span className="block">Start Your Next</span>
            <span className="block bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>
          
          {/* Subtext */}
          <p 
            className={`text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{
              transform: isClient ? `translateY(${-scrollY * 0.2}px)` : 'none',
            }}
          >
            YOUR GATEWAY TO THE WORLD
          </p>

          {/* Smart Search Component */}
          <div 
            className={`max-w-[75Vw] mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{
              transform: isClient ? `translateY(${-scrollY * 0.15}px)` : 'none',
            }}
          >
            <form onSubmit={handleSearch} className="w-full flex justify-around items-center flex-wrap">
              <div className="w-full flex justify-between items-center flex-wrap space-y-5">
                {/* Destination Search Bar */}
                <div className="relative text-left w-full md:w-[45%] lg:w-[25%]">
                  <label className="block text-white/80 text-sm font-medium mb-2">Destination</label>
                  <div className="relative">
                    <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    value={searchData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                  />
                  <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="text-left w-full md:w-[45%] lg:w-[24%]">
                  <label className="block text-white/80 text-sm font-medium mb-2">Travel Date</label>
                  <input 
                    type="date"
                    value={searchData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-sky-400 focus:bg-white/30 transition-all duration-300"
                  />
                </div>

                {/* Budget Slider */}
                <div className="text-left w-full md:w-[45%] lg:w-[22%]">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Budget: ₹{searchData.budget.toLocaleString()}
                  </label>
                  <input 
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={searchData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Travelers Count */}
                <div className="text-left md:w-[45%] lg:w-[20%]">
                  <label className="block text-white/80 text-sm font-medium mb-2">Travelers</label>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => handleInputChange('travelers', Math.max(1, searchData.travelers - 1))}
                      className="w-10 h-10 bg-white/20 border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-300"
                    >
                      -
                    </button>
                    <input 
                      type="text" 
                      inputmode="numeric" 
                      min="1"
                      max="30"
                      value={searchData.travelers}
                      onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                      className="w-16 px-3 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-center focus:outline-none focus:border-sky-400 focus:bg-white/30 transition-all duration-300 overflow-hidden"
                    />
                    <button 
                      type="button"
                      onClick={() => handleInputChange('travelers', Math.min(10, searchData.travelers + 1))}
                      className="w-10 h-10 bg-white/20 border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button 
                  type="button"
                  onClick={handleExplorePackages}
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10">Query Type</span>
                </button>
                
                <button 
                  type="reset"
                  onClick={handleResetForm}
                  className="group relative px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <span className="relative z-10">Reset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-sm uppercase tracking-wider">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(to right, #0EA5E9, #3B82F6);
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(to right, #0EA5E9, #3B82F6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;