"use client";
import { useState, useEffect } from "react";

const HeroContentManager = () => {
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

  const [showForm, setShowForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [editingButton, setEditingButton] = useState(null);

  useEffect(() => {
    // Load hero content from localStorage
    if (typeof window !== 'undefined') {
      const savedHeroContent = localStorage.getItem("adminHeroContent");
      if (savedHeroContent) {
        setHeroContent(JSON.parse(savedHeroContent));
      }
    }
  }, []);

  const saveHeroContent = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("adminHeroContent", JSON.stringify(heroContent));
      alert("Hero content saved successfully!");
    }
  };

  const handleContentChange = (field, value) => {
    setHeroContent(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...heroContent.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setHeroContent(prev => ({ ...prev, features: updatedFeatures }));
  };

  const handleButtonChange = (index, field, value) => {
    const updatedButtons = [...heroContent.ctaButtons];
    updatedButtons[index] = { ...updatedButtons[index], [field]: value };
    setHeroContent(prev => ({ ...prev, ctaButtons: updatedButtons }));
  };

  const addFeature = () => {
    const newFeature = {
      icon: "🌟",
      title: "",
      description: ""
    };
    setHeroContent(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
  };

  const deleteFeature = (index) => {
    const updatedFeatures = heroContent.features.filter((_, i) => i !== index);
    setHeroContent(prev => ({ ...prev, features: updatedFeatures }));
  };

  const addButton = () => {
    const newButton = {
      text: "",
      type: "primary",
      action: "explore"
    };
    setHeroContent(prev => ({
      ...prev,
      ctaButtons: [...prev.ctaButtons, newButton]
    }));
  };

  const deleteButton = (index) => {
    const updatedButtons = heroContent.ctaButtons.filter((_, i) => i !== index);
    setHeroContent(prev => ({ ...prev, ctaButtons: updatedButtons }));
  };

  const resetToDefault = () => {
    const defaultContent = {
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
    };
    setHeroContent(defaultContent);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hero Content Manager</h2>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Reset to Default
          </button>
          <button
            onClick={saveHeroContent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={heroContent.title}
              onChange={(e) => handleContentChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter main title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={heroContent.subtitle}
              onChange={(e) => handleContentChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image URL
            </label>
            <input
              type="text"
              value={heroContent.backgroundImage}
              onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter background image URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Video URL (Optional)
            </label>
            <input
              type="text"
              value={heroContent.videoUrl}
              onChange={(e) => handleContentChange('videoUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter video URL (MP4)"
            />
          </div>
        </div>

        {/* Features Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-reey">Feature Pills</h3>
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add Feature
            </button>
          </div>

          <div className="space-y-3">
            {heroContent.features.map((feature, index) => (
              <div key={index} className="flex gap-3 items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Icon (emoji)"
                  />
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Feature title"
                  />
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Feature description"
                  />
                </div>
                <button
                  onClick={() => deleteFeature(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">CTA Buttons</h3>
            <button
              onClick={addButton}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add Button
            </button>
          </div>

          <div className="space-y-3">
            {heroContent.ctaButtons.map((button, index) => (
              <div key={index} className="flex gap-3 items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={button.text}
                    onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Button text"
                  />
                  <select
                    value={button.type}
                    onChange={(e) => handleButtonChange(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                  </select>
                  <select
                    value={button.action}
                    onChange={(e) => handleButtonChange(index, 'action', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="explore">Explore Packages</option>
                    <option value="custom">Custom Trip</option>
                  </select>
                </div>
                <button
                  onClick={() => deleteButton(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="p-6 bg-linear-to-br from-blue-900 to-purple-900 rounded-lg text-white">
            <h4 className="text-3xl font-bold mb-2">{heroContent.title}</h4>
            <p className="text-xl mb-4 text-blue-100">{heroContent.subtitle}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {heroContent.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                  <span>{feature.icon}</span>
                  <span className="text-sm">{feature.title}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              {heroContent.ctaButtons.map((button, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    button.type === 'primary'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-white/20 hover:bg-white/30'
                  } transition`}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroContentManager;
