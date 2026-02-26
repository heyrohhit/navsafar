"use client";
import { useState, useEffect } from "react";

const TripSafariHero = ({ isMenuOpen }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    budget: 25000,
    travelers: 2
  });
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("packages");

  // Dynamic hero content from admin
  const [heroContent, setHeroContent] = useState({
    title: "Start Your Next Adventure",
    subtitle: "YOUR GATEWAY TO THE WORLD",
    backgroundImage: "/assets/bg.jpg",
    videoUrl: "",
    features: [
      { icon: "🌍", title: "Worldwide Destinations", description: "Explore 150+ destinations" },
      { icon: "🏨", title: "Premium Hotels", description: "Best accommodation guaranteed" },
      { icon: "🎯", title: "Expert Guidance", description: "Professional travel experts" },
      { icon: "💰", title: "Best Prices", description: "Affordable packages" }
    ],
    ctaButtons: [
      { text: "Explore Packages", type: "primary", action: "explore" },
      { text: "Custom Trip", type: "secondary", action: "custom" }
    ]
  });

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setIsLoaded(true), 100);
    
    // Load hero content from admin or localStorage
    if (typeof window !== 'undefined') {
      const savedHeroContent = localStorage.getItem("adminHeroContent");
      if (savedHeroContent) {
        setHeroContent(JSON.parse(savedHeroContent));
      }
    }
    
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

  const handleCtaClick = (action) => {
    switch(action) {
      case "explore":
        document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "custom":
        handleExplorePackages();
        break;
      default:
        console.log("CTA clicked:", action);
    }
  };

  return (
    <section className="relative min-h-screen pt-8 overflow-hidden" id="feature">
      {/* Background with Video/Image Support */}
      <div className="absolute inset-0">
        {heroContent.videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={heroContent.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url('${heroContent.backgroundImage}')` }}
          />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-2xl animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 
              className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{
                transform: isClient ? `translateY(${-scrollY * 0.3}px)` : 'none',
              }}
            >
              <span className="block">{heroContent.title.split(' ').slice(0, -1).join(' ')}</span>
              <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                {heroContent.title.split(' ').slice(-1)[0]}
              </span>
            </h1>
            
            {/* Subtext */}
            <p 
              className={`text-xl md:text-2xl lg:text-3xl text-orange-100 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{
                transform: isClient ? `translateY(${-scrollY * 0.2}px)` : 'none',
              }}
            >
              {heroContent.subtitle}
            </p>
          </div>

          {/* Feature Pills */}
          <div 
            className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {heroContent.features.map((feature, index) => (
              <div 
                key={index}
                className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <span className="text-2xl">{feature.icon}</span>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">{feature.title}</p>
                  <p className="text-white/70 text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search Section with Tabs */}
          <div 
            className={`max-w-5xl mx-auto transition-all duration-1000 delay-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{
              transform: isClient ? `translateY(${-scrollY * 0.15}px)` : 'none',
            }}
          >
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
                {['packages', 'destinations', 'custom'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Destination Search */}
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium">Destination</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Where do you want to go?"
                        className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                        value={searchData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                      />
                      <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium">Travel Date</label>
                    <input 
                      type="date"
                      value={searchData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-orange-400 focus:bg-white/30 transition-all duration-300"
                    />
                  </div>

                  {/* Budget Slider */}
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium">
                      Budget: ₹{searchData.budget.toLocaleString()}
                    </label>
                    <div className="relative">
                      <input 
                        type="range"
                        min="5000"
                        max="100000"
                        step="5000"
                        value={searchData.budget}
                        onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                        className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>₹5K</span>
                        <span>₹1L</span>
                      </div>
                    </div>
                  </div>

                  {/* Travelers Count */}
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium">Travelers</label>
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
                        className="w-16 px-3 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-center focus:outline-none focus:border-orange-400 focus:bg-white/30 transition-all duration-300"
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {heroContent.ctaButtons.map((button, index) => (
                    <button 
                      key={index}
                      type={button.action === "explore" ? "button" : "button"}
                      onClick={() => handleCtaClick(button.action)}
                      className={`px-8 py-4 font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer ${
                        button.type === "primary" 
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-orange-500/25"
                          : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                      }`}
                    >
                      {button.text}
                    </button>
                  ))}
                  
                  <button 
                    type="reset"
                    onClick={handleResetForm}
                    className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-sm uppercase tracking-wider">Scroll to Explore</span>
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
          background: linear-gradient(to right, #FB923C, #F97316);
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(to right, #FB923C, #F97316);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
};

export default TripSafariHero;
