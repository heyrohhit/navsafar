"use client";
import { useState, useEffect } from "react";
import { getPackageGradient } from "../../components/packages/PackageUtils";

const Gallery = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const galleryCategories = [
    { value: "all", label: "All Photos", icon: "📸" },
    { value: "domestic", label: "Domestic", icon: "🇮🇳" },
    { value: "international", label: "International", icon: "✈️" },
    { value: "adventure", label: "Adventure", icon: "🏔️" },
    { value: "cultural", label: "Cultural", icon: "🏛️" },
    { value: "nature", label: "Nature", icon: "🌿" }
  ];

  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      title: "Mountain Trekking Adventure",
      category: "adventure",
      location: "Himalayas, India",
      description: "Challenging trek through the majestic Himalayan peaks"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop",
      title: "Varanasi Ghat Ceremony",
      category: "cultural",
      location: "Varanasi, India",
      description: "Spiritual evening ceremony on the banks of Ganges"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1540206395-636089a77e2f?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1540206395-636089a77e2f?w=400&h=300&fit=crop",
      title: "Taj Mahal Sunrise",
      category: "domestic",
      location: "Agra, India",
      description: "Iconic monument bathed in golden morning light"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop",
      title: "Swiss Alps Paradise",
      category: "international",
      location: "Switzerland",
      description: "Breathtaking views of the Swiss mountain ranges"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      title: "Kerala Backwaters",
      category: "nature",
      location: "Kerala, India",
      description: "Serene houseboat journey through tranquil waters"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
      title: "Forest Trail Adventure",
      category: "adventure",
      location: "Western Ghats, India",
      description: "Exploring dense forests and hidden waterfalls"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      title: "Desert Safari Experience",
      category: "adventure",
      location: "Rajasthan, India",
      description: "Thrilling camel ride through golden sand dunes"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1512453979792-1ea58a24b6a5?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1512453979792-1ea58a24b6a5?w=400&h=300&fit=crop",
      title: "Paris City of Lights",
      category: "international",
      location: "Paris, France",
      description: "Romantic evening in the beautiful French capital"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      title: "Tropical Paradise Beach",
      category: "nature",
      location: "Maldives",
      description: "Crystal clear waters and pristine white sand beaches"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
      title: "Ancient Temple Architecture",
      category: "cultural",
      location: "Khajuraho, India",
      description: "Intricate carvings depicting ancient Indian culture"
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      title: "Mountain Lake Reflection",
      category: "nature",
      location: "Ladakh, India",
      description: "Pristine mountain lake reflecting snow-capped peaks"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1524492412937-8f3f5b4aff15?w=800&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1524492412937-8f3f5b4aff15?w=400&h=300&fit=crop",
      title: "Northern Lights Magic",
      category: "international",
      location: "Iceland",
      description: "Spectacular aurora borealis dancing in the night sky"
    }
  ];

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const getCategoryTitle = () => {
    const category = galleryCategories.find(cat => cat.value === selectedCategory);
    return category ? category.label : "All Photos";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Travel <span className="text-yellow-400">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Visual memories from journeys around the world
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {galleryCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                <span className="text-lg mr-2">{category.icon}</span>
                <span className="font-semibold">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {getCategoryTitle()} <span className="text-blue-600">({filteredImages.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div 
                key={image.id}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${200 + index * 50}ms` }}
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.thumbnail}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[60vh] object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-blue-600 font-medium">
                    📍 {selectedImage.location}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPackageGradient(selectedImage.category)}`}>
                    {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{selectedImage.description}</p>
                
                <div className="flex gap-3">
                  <a 
                    href="/tour-packages"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Book Similar Trip
                  </a>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
