"use client";
import { useState, useEffect } from "react";
import {categories} from "../models/objAll/experienc";
import Link from "next/link";

const ExperienceCategories = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [queryData, setQueryData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: "",
    budget: "",
    travelers: "",
    message: ""
  });

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 400);
  }, []);

 

  const handleCategoryHover = (id) => {
    setHoveredCategory(id);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  const handleGetRecommendations = () => {
    setShowQueryForm(true);
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    
    const whatsappNumber = "+918700750589";
    const message = `Travel Recommendation Request:\n\nName: ${queryData.name}\nEmail: ${queryData.email}\nPhone: ${queryData.phone}\n\nTravel Details:\nDestination: ${queryData.destination}\nTravel Date: ${queryData.travelDate}\nBudget: ${queryData.budget}\nTravelers: ${queryData.travelers}\n\nMessage: ${queryData.message}\n\nPlease provide personalized recommendations!`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setQueryData({
      name: "",
      email: "",
      phone: "",
      destination: "",
      travelDate: "",
      budget: "",
      travelers: "",
      message: ""
    });
    setShowQueryForm(false);
  };

  const handleInputChange = (field, value) => {
    setQueryData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full border border-orange-200 mb-6 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-orange-700 text-sm font-medium">Experience Categories</span>
          </div>
          
          <h2 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Choose Your
            <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Travel Style
            </span>
          </h2>
          
          <p 
            className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Find the perfect experience that matches your travel preferences and interests
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="w-full  flex flex-col flex-wrap gap-8 p-3">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              href={`/experiences/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`group flex flex-wrap max-[660px]:h-45 relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl w-full h-[100px] max-[990px]:h-[150px]  relative p-4 gap-5 max-[660px]:gap-3 cursor-pointer`}
              
            >
              {/* Image Background */}
              <div className={`max-[660px]:w-full w-[25%] bg-gradient-to-br ${category.gradient} overflow-hidden rounded-2xl`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 left-6 w-12 h-12 bg-white/5 rounded-full animate-bounce"></div>
                  <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-white/5 rounded-full animate-ping"></div>
                </div>
                
                {/* Content */}
                <div className="h-full flex flex-wrap items-center justify-center p-2">
                  <div className="text-2xl transform transition-transform duration-500 group-hover:scale-110">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center">{category.name}</h3>
                  <p className=" text-white/90 text-center text-sm w-full">{category.description}</p>
                </div>
              </div>

              {/* Features List */}
                <div 
                  className={`max-[660px]:w-full w-[70%]  to-transparent transition-all duration-500 relative`}
                >
                  <h4 className="text-gray-600 font-semibold mb-3">What's Included:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-500 text-xs">
                        <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                  {/* Package Count Badge */}
                <div className="absolute top-0 right-4">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-bold rounded-full shadow-lg">
                    {category.packageCount}+ Packages
                  </span>
                </div>
                </div>
              
              {/* Hover Glow Effect */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl transition-opacity duration-500 ${
                  hoveredCategory === category.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '1200ms' }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-200 shadow-lg">
            <span className="text-orange-700 font-medium text-lg">Can't decide your perfect trip?</span>
            <button 
              onClick={handleGetRecommendations}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
            >
              Get Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Query Form Modal */}
      {showQueryForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-3xl relative">
              <h3 className="text-2xl font-bold text-white">Get Personalized Recommendations</h3>
              <p className="text-white/80 mt-2">Tell us about your dream trip and we'll suggest the best options!</p>
              <button 
                onClick={() => setShowQueryForm(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={queryData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={queryData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={queryData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Preferred Destination</label>
                    <input
                      type="text"
                      value={queryData.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="Goa, Kerala, International..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Travel Date</label>
                    <input
                      type="date"
                      value={queryData.travelDate}
                      onChange={(e) => handleInputChange('travelDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Budget Range</label>
                    <select
                      value={queryData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Budget</option>
                      <option value="Under ₹10,000">Under ₹10,000</option>
                      <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                      <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                      <option value="Above ₹1,00,000">Above ₹1,00,000</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Number of Travelers</label>
                    <select
                      value={queryData.travelers}
                      onChange={(e) => handleInputChange('travelers', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Travelers</option>
                      <option value="1">Solo Traveler</option>
                      <option value="2">Couple</option>
                      <option value="3-4">Small Group (3-4)</option>
                      <option value="5-8">Medium Group (5-8)</option>
                      <option value="9+">Large Group (9+)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Additional Message</label>
                  <textarea
                    value={queryData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us more about your preferences..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Get Query
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQueryForm(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExperienceCategories;
