"use client";
import { useState, useEffect } from "react";

const FeaturesSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
  }, []);

  const features = [
    {
      icon: "🌍",
      title: "150+ Destinations",
      description: "Explore breathtaking destinations across the globe with our curated travel experiences",
      color: "blue",
      stats: "150+"
    },
    {
      icon: "📦",
      title: "Premium Packages",
      description: "Handcrafted tour packages designed for every budget and travel preference",
      color: "purple",
      stats: "50+"
    },
    {
      icon: "🛡️",
      title: "Travel Insurance",
      description: "Comprehensive travel insurance coverage for worry-free journeys",
      color: "green",
      stats: "100%"
    },
    {
      icon: "📞",
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your travel needs",
      color: "orange",
      stats: "24/7"
    },
    {
      icon: "✈️",
      title: "Flight Booking",
      description: "Best deals on international and domestic flights with instant confirmation",
      color: "cyan",
      stats: "500+"
    },
    {
      icon: "🏨",
      title: "Hotel Partners",
      description: "Premium hotels and resorts worldwide with exclusive member rates",
      color: "indigo",
      stats: "1000+"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 mb-6 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-blue-300 text-sm font-medium">Why Choose Navsafar</span>
          </div>
          
          <h2 
            className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Everything You Need for
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Perfect Travel
            </span>
          </h2>
          
          <p 
            className={`text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Experience travel like never before with our comprehensive services and modern technology
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className={`relative w-16 h-16 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              
              {/* Stats Badge */}
              <div className="absolute top-6 right-6">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {feature.stats}
                </span>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
              
              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-full border border-blue-500/20">
            <span className="text-blue-300 font-medium">Ready to start your journey?</span>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
