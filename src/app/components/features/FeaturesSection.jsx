"use client";
import { useState, useEffect } from "react";
import { features } from "./featureModel";
import DetailsFeature from "./detailsFeature"

const FeaturesSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
 const [index, setIndex] = useState(0);
  const length = features.length;


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, 1000); // 1 second auto slide

    return () => clearInterval(interval);
  }, [length]);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
  }, []);

 

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fff]">
      <div className="w-full mx-auto ">
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
            className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Experience travel like never before with our comprehensive services and modern technology
          </p>
        </div>
        
        {/* Features Grid */}
       <DetailsFeature features={features}/>

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
