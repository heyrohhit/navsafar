"use client";
import { useState, useEffect } from "react";
import { getPackageGradient } from "@/app/components/packages/PackageUtils";

const Services = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const services = [
    {
      id: 1,
      title: "Domestic Tours",
      icon: "🇮🇳",
      description: "Explore the beauty of India with our carefully crafted domestic tour packages",
      features: [
        "Budget-friendly packages",
        "Experienced local guides",
        "Cultural experiences",
        "Comfortable accommodations",
        "Transportation included"
      ],
      image: "https://images.unsplash.com/photo-1524492412937-b8040a2b4ab6?w=600&h=400&fit=crop",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: 2,
      title: "International Tours",
      icon: "✈️",
      description: "Discover amazing destinations around the world with our international packages",
      features: [
        "Visa assistance",
        "International flights",
        "Multi-country tours",
        "Travel insurance",
        "24/7 support"
      ],
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: 3,
      title: "Religious Tours",
      icon: "🕉️",
      description: "Spiritual journeys to sacred destinations across India and beyond",
      features: [
        "Temple visits",
        "Spiritual guidance",
        "Accommodation near sites",
        "Group discounts",
        "Special arrangements"
      ],
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop",
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: 4,
      title: "Adventure Tours",
      icon: "🏔️",
      description: "Thrilling adventures for adrenaline junkies and nature lovers",
      features: [
        "Trekking expeditions",
        "Water sports",
        "Wildlife safaris",
        "Camping experiences",
        "Professional guides"
      ],
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      id: 5,
      title: "Family Packages",
      icon: "👨‍👩‍👧‍👦",
      description: "Perfect family vacations with activities for all age groups",
      features: [
        "Kid-friendly activities",
        "Family accommodations",
        "Educational experiences",
        "Safety measures",
        "Flexible itineraries"
      ],
      image: "https://images.unsplash.com/photo-1476544525523-3f3e5dee6225?w=600&h=400&fit=crop",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 6,
      title: "Custom Tours",
      icon: "🎯",
      description: "Personalized itineraries designed according to your preferences",
      features: [
        "Tailor-made packages",
        "Flexible scheduling",
        "Budget customization",
        "Personal guide",
        "Special requests"
      ],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Choose Your Destination",
      description: "Browse through our wide range of destinations and select your dream location"
    },
    {
      step: 2,
      title: "Customize Your Package",
      description: "Personalize your tour with optional activities and accommodations"
    },
    {
      step: 3,
      title: "Book with Confidence",
      description: "Secure booking with multiple payment options and instant confirmation"
    },
    {
      step: 4,
      title: "Enjoy Your Journey",
      description: "Travel with peace of mind knowing we're here to support you 24/7"
    }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      location: "Delhi",
      rating: 5,
      comment: "Amazing experience! The team at Safar made our Kerala trip unforgettable. Highly recommended!",
      package: "Kerala Backwaters"
    },
    {
      name: "Priya Patel",
      location: "Mumbai",
      rating: 5,
      comment: "Excellent service and great value for money. Our international trip was perfectly organized.",
      package: "Europe Tour"
    },
    {
      name: "Amit Kumar",
      location: "Bangalore",
      rating: 4,
      comment: "Professional guides and comfortable accommodations. Will definitely travel with Safar again.",
      package: "Rajasthan Heritage"
    }
  ];

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
              Our <span className="text-yellow-400">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Comprehensive travel solutions for every type of journey
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What We <span className="text-blue-600">Offer</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our wide range of travel services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
                onClick={() => setSelectedService(service)}
              >
                <div className={`h-48 bg-gradient-to-br ${service.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0">
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full animate-bounce"></div>
                  </div>
                  <div className="text-6xl mb-2 transform transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300">
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to plan your perfect journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div 
                key={step.step}
                className={`text-center transition-all duration-700 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${1200 + index * 150}ms` }}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1800ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our <span className="text-blue-600">Travelers Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from real customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-gray-50 rounded-2xl p-6 transition-all duration-700 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${2000 + index * 150}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.location} • {testimonial.package}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            className={`transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '2600ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your <span className="text-yellow-400">Adventure?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let us help you create memories that last a lifetime
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/tour-packages"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Packages
              </a>
              <a 
                href="/contact"
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Custom Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className={`h-64 bg-gradient-to-br ${selectedService.gradient} flex items-center justify-center relative`}>
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                loading="lazy"
              />
              <div className="text-6xl z-10">
                {selectedService.icon}
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-256px)]">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedService.title}</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedService.description}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Service Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedService.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <a 
                  href="/tour-packages"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  View Packages
                </a>
                <a 
                  href="/contact"
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
