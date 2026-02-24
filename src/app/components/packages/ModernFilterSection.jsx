"use client";
import { useState } from "react";

const ModernFilterSection = ({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedPriceRange, 
  setPriceRange, 
  selectedDuration, 
  setDuration,
  filteredCount,
  onResetFilters 
}) => {
  const categories = [
    { value: "all", label: "All Categories", icon: "🌍", color: "gray" },
    { value: "domestic", label: "Domestic Travel", icon: "🇮🇳", color: "blue" },
    { value: "international", label: "International Travel", icon: "✈️", color: "purple" },
    { value: "religious", label: "Religious Travel", icon: "🕉️", color: "orange" },
    { value: "family", label: "Family Holiday", icon: "👨‍👩‍👧‍👦", color: "green" },
    { value: "adventure", label: "Adventure Travel", icon: "🏔️", color: "indigo" }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      gray: "bg-gray-50 border-gray-200 focus:ring-gray-500 focus:border-gray-500",
      blue: "bg-blue-50 border-blue-200 focus:ring-blue-500 focus:border-blue-500",
      purple: "bg-purple-50 border-purple-200 focus:ring-purple-500 focus:border-purple-500",
      green: "bg-green-50 border-green-200 focus:ring-green-500 focus:border-green-500",
      orange: "bg-orange-50 border-orange-200 focus:ring-orange-500 focus:border-orange-500",
      yellow: "bg-yellow-50 border-yellow-200 focus:ring-yellow-500 focus:border-yellow-500",
      indigo: "bg-indigo-50 border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
    };
    return colorMap[color] || colorMap.gray;
  };

  const getBadgeClasses = (color) => {
    const colorMap = {
      gray: "bg-gray-100 text-gray-700",
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      green: "bg-green-100 text-green-700",
      orange: "bg-orange-100 text-orange-700",
      yellow: "bg-yellow-100 text-yellow-700",
      indigo: "bg-indigo-100 text-indigo-700"
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 3.707A1 1 0 003 4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Filter Packages</h2>
        </div>
        
        <button
          onClick={onResetFilters}
          className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Reset All
        </button>
      </div>

      {/* Floating Category Buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
                selectedCategory === cat.value
                  ? `bg-gradient-to-r ${cat.color === 'blue' ? 'from-blue-500 to-blue-600' : 
                                  cat.color === 'purple' ? 'from-purple-500 to-purple-600' :
                                  cat.color === 'green' ? 'from-green-500 to-green-600' :
                                  cat.color === 'orange' ? 'from-orange-500 to-orange-600' :
                                  cat.color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
                                  'from-gray-500 to-gray-600'} text-white shadow-xl`
                  : `bg-white border-2 ${cat.color === 'blue' ? 'border-blue-200 text-blue-700' :
                                   cat.color === 'purple' ? 'border-purple-200 text-purple-700' :
                                   cat.color === 'green' ? 'border-green-200 text-green-700' :
                                   cat.color === 'orange' ? 'border-orange-200 text-orange-700' :
                                   cat.color === 'indigo' ? 'border-indigo-200 text-indigo-700' :
                                   'border-gray-200 text-gray-700'} hover:shadow-xl`
              }`}
            >
              <span className="text-lg mr-2">{cat.icon}</span>
              <span className="font-semibold">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{filteredCount}</div>
          <div className="text-sm text-gray-600 font-medium">Packages Found</div>
          
          {/* Active Filters */}
          {selectedCategory !== "all" && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  Category: <span className="font-semibold text-blue-700">{selectedCategory}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Pills */}
      {selectedCategory !== "all" && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${getBadgeClasses('blue')}`}>
                🇮🇳 {selectedCategory}
              </div>
            </div>
            
            <button
              onClick={onResetFilters}
              className="px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernFilterSection;
