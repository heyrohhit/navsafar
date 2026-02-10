"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Star, MapPin, Calendar, Users, ArrowLeft, ArrowRight, Heart, Share2 } from "lucide-react";
import { AnimatedLogo } from "../components/animated-logo";
import Link from "next/link";

const allJourneys = [
  {
    id: 1,
    title: "Swiss Alps Luxury Retreat",
    category: "International Luxury",
    location: "Switzerland",
    duration: "7 Days",
    groupSize: "2-4 People",
    price: "Starting from $4,999",
    image: "https://images.unsplash.com/photo-1559588356-7a9b7c2a6b9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHN8ZW58MHx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    featured: true,
    description: "Experience breathtaking beauty of Swiss Alps with luxury accommodations and personalized service. Enjoy panoramic mountain views, world-class skiing, and exclusive mountain lodge experiences.",
    highlights: ["Luxury Mountain Lodge", "Ski Pass Included", "Panoramic Views", "Personal Chef"],
    itinerary: [
      "Day 1: Arrival in Zurich & Transfer to Alps",
      "Day 2-3: Ski Adventure & Mountain Activities",
      "Day 4: Scenic Train Journey & Local Culture",
      "Day 5-6: Luxury Spa & Wellness",
      "Day 7: Departure"
    ],
    inclusions: ["5-Star Accommodation", "All Meals", "Ski Equipment", "Transfers", "Guide"]
  },
  {
    id: 2,
    title: "Dubai Corporate Excellence",
    category: "Corporate MICE",
    location: "Dubai, UAE",
    duration: "5 Days",
    groupSize: "20-50 People",
    price: "Custom Quote",
    image: "https://images.unsplash.com/photo-1512453973442-8aabe482f1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreXNjcmFwZXJ8ZW58MHx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    featured: true,
    description: "Premium corporate event planning with world-class venues and exceptional service. Perfect for conferences, meetings, and corporate retreats.",
    highlights: ["5-Star Venues", "Tech Support", "Catering Services", "Team Building"],
    itinerary: [
      "Day 1: Welcome Reception & Ice Breaker",
      "Day 2: Conference Sessions & Workshops",
      "Day 3: Team Building Activities",
      "Day 4: Dubai City Tour & Gala Dinner",
      "Day 5: Departure"
    ],
    inclusions: ["Venue Booking", "AV Equipment", "Catering", "Transportation", "Event Management"]
  },
  {
    id: 3,
    title: "Rajasthan Heritage Tour",
    category: "Cultural Luxury",
    location: "Rajasthan, India",
    duration: "10 Days",
    groupSize: "4-8 People",
    price: "Starting from $2,499",
    image: "https://images.unsplash.com/photo-1524492412937-b784a5f9ce44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWphc3RoYW4lMjBwYWxhY2V8ZW58MHx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    featured: false,
    description: "Discover royal heritage of Rajasthan with palace stays and cultural experiences. Immerse yourself in the rich history and vibrant culture of India's desert state.",
    highlights: ["Palace Stays", "Cultural Shows", "Desert Safari", "Local Cuisine"],
    itinerary: [
      "Day 1: Arrival in Jaipur & Palace Check-in",
      "Day 2-3: Jaipur City Tour & Amber Fort",
      "Day 4-5: Jodhpur - The Blue City",
      "Day 6-7: Jaisalmer & Desert Camp",
      "Day 8-9: Udaipur - City of Lakes",
      "Day 10: Departure"
    ],
    inclusions: ["Heritage Hotels", "All Meals", "Guide", "Transport", "Entrance Fees"]
  },
  {
    id: 4,
    title: "Maldives Paradise Escape",
    category: "Honeymoon Special",
    location: "Maldives",
    duration: "6 Days",
    groupSize: "2 People",
    price: "Starting from $3,999",
    image: "https://images.unsplash.com/photo-1573845529935-7b5d4e1a5c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlc3xlbnwwfHx8fDE3Njg5OTYzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5.0,
    featured: true,
    description: "Ultimate romantic getaway with overwater villas and pristine beaches. Perfect for honeymooners seeking privacy and luxury.",
    highlights: ["Overwater Villa", "Private Beach", "Candlelight Dinners", "Spa Package"],
    itinerary: [
      "Day 1: Arrival & Villa Check-in",
      "Day 2: Island Exploration & Water Sports",
      "Day 3: Spa Day & Couple Massage",
      "Day 4: Sunset Cruise & Dolphin Watching",
      "Day 5: Private Beach Picnic",
      "Day 6: Departure"
    ],
    inclusions: ["Overwater Villa", "All Meals", "Airport Transfer", "Activities", "Spa Access"]
  },
  {
    id: 5,
    title: "Tokyo Business & Leisure",
    category: "Corporate Travel",
    location: "Tokyo, Japan",
    duration: "8 Days",
    groupSize: "10-15 People",
    price: "Custom Quote",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHl8ZW58MHx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    featured: false,
    description: "Perfect blend of business meetings and cultural exploration in modern Tokyo. Experience Japan's cutting-edge technology and ancient traditions.",
    highlights: ["Business Centers", "Cultural Tours", "Tech Visits", "Fine Dining"],
    itinerary: [
      "Day 1: Arrival & Hotel Check-in",
      "Day 2-3: Business Meetings & Conferences",
      "Day 4: Tokyo Tech Tour",
      "Day 5: Cultural Day - Temples & Traditions",
      "Day 6: Mount Fuji Day Trip",
      "Day 7: Free Day & Shopping",
      "Day 8: Departure"
    ],
    inclusions: ["4-Star Hotel", "Meeting Rooms", "Transport", "Guide", "Cultural Activities"]
  },
  {
    id: 6,
    title: "Santorini Sunset Experience",
    category: "European Luxury",
    location: "Santorini, Greece",
    duration: "5 Days",
    groupSize: "2-6 People",
    price: "Starting from $2,999",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3Jpbml8ZW58MHx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    featured: false,
    description: "Romantic Greek island experience with stunning sunsets and luxury accommodations. Discover the magic of Santorini's blue-domed churches and dramatic cliffs.",
    highlights: ["Sunset Views", "Wine Tasting", "Private Yacht", "Beach Clubs"],
    itinerary: [
      "Day 1: Arrival & Oia Exploration",
      "Day 2: Caldera Cruise & Hot Springs",
      "Day 3: Winery Tour & Tasting",
      "Day 4: Beach Day & Water Sports",
      "Day 5: Departure"
    ],
    inclusions: ["Boutique Hotel", "Breakfast", "Transfers", "Activities", "Guide"]
  },
  {
    id: 7,
    title: "Bali Spiritual Journey",
    category: "Cultural Luxury",
    location: "Bali, Indonesia",
    duration: "8 Days",
    groupSize: "2-6 People",
    price: "Starting from $1,999",
    image: "https://images.unsplash.com/photo-1537953773346-d66cc70a44aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwdGVtcGxlfGVufDB8fHx8MTc2ODk5NjM2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    featured: false,
    description: "Spiritual and cultural immersion in island of gods with luxury wellness retreats. Experience Bali's unique blend of Hindu culture and natural beauty.",
    highlights: ["Temple Tours", "Yoga Sessions", "Rice Terrace Trek", "Traditional Arts"],
    itinerary: [
      "Day 1: Arrival & Ubud Check-in",
      "Day 2: Temple Tours & Cultural Immersion",
      "Day 3: Yoga & Meditation Retreat",
      "Day 4: Rice Terrace Trek",
      "Day 5: Traditional Arts Workshop",
      "Day 6: Beach Day & Spa",
      "Day 7: Mount Batur Sunrise",
      "Day 8: Departure"
    ],
    inclusions: ["Resort Stay", "All Meals", "Yoga Sessions", "Guide", "Activities"]
  },
  {
    id: 8,
    title: "Paris Romantic Getaway",
    category: "European Luxury",
    location: "Paris, France",
    duration: "5 Days",
    groupSize: "2 People",
    price: "Starting from $3,499",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpc3xlbnwwfHx8fDE3Njg5OTYzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    featured: true,
    description: "Experience city of love with luxury accommodations and exclusive experiences. Romance, art, and gastronomy in the heart of France.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise", "Fine Dining"],
    itinerary: [
      "Day 1: Arrival & Eiffel Tower",
      "Day 2: Louvre Museum & Art Tour",
      "Day 3: Versailles Day Trip",
      "Day 4: Seine River Cruise & Montmartre",
      "Day 5: Departure"
    ],
    inclusions: ["Luxury Hotel", "Breakfast", "Museum Passes", "Cruise", "Guide"]
  },
  {
    id: 9,
    title: "Singapore Corporate Summit",
    category: "Corporate MICE",
    location: "Singapore",
    duration: "4 Days",
    groupSize: "15-30 People",
    price: "Custom Quote",
    image: "https://images.unsplash.com/photo-1529245859427-1a7b6b5f5b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmV8ZW58MHx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    featured: false,
    description: "World-class corporate events in heart of Asia's business hub. Modern facilities and exceptional service for your corporate needs.",
    highlights: ["Marina Bay Venue", "Tech Hub Tours", "Gala Dinner", "Networking"],
    itinerary: [
      "Day 1: Registration & Welcome Reception",
      "Day 2: Conference Sessions & Workshops",
      "Day 3: Business Tours & Networking",
      "Day 4: Gala Dinner & Departure"
    ],
    inclusions: ["Conference Venue", "AV Equipment", "Catering", "Transport", "Networking Events"]
  },
  {
    id: 10,
    title: "Kerala Backwaters Honeymoon",
    category: "Honeymoon Special",
    location: "Kerala, India",
    duration: "7 Days",
    groupSize: "2 People",
    price: "Starting from $1,799",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXJhbGElMjBiYWNrd2F0ZXJ8ZW58MHx8fHwxNzY4OTk2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    featured: false,
    description: "Romantic houseboat experience in the serene backwaters of Kerala. Traditional Kerala houseboat with modern luxury amenities.",
    highlights: ["Houseboat Stay", "Backwater Cruise", "Ayurvedic Spa", "Local Cuisine"],
    itinerary: [
      "Day 1: Arrival & Houseboat Check-in",
      "Day 2: Alleppey Backwaters Cruise",
      "Day 3: Village Visit & Cultural Experience",
      "Day 4: Kumarakom Bird Sanctuary",
      "Day 5: Ayurvedic Spa Day",
      "Day 6: Cochin City Tour",
      "Day 7: Departure"
    ],
    inclusions: ["Luxury Houseboat", "All Meals", "Spa Access", "Guide", "Activities"]
  }
];

const categories = ["All", "International Luxury", "Corporate MICE", "Cultural Luxury", "Honeymoon Special", "European Luxury", "Corporate Travel"];

export default function JourneysPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedJourney, setSelectedJourney] = useState(null);

  const filteredJourneys = selectedCategory === "All" 
    ? allJourneys 
    : allJourneys.filter(journey => journey.category === selectedCategory);

  useEffect(() => {
    // Get journey ID from URL params if coming from portfolio
    const urlParams = new URLSearchParams(window.location.search);
    const journeyId = urlParams.get('id');
    if (journeyId) {
      const journey = allJourneys.find(j => j.id === parseInt(journeyId));
      setSelectedJourney(journey);
    }
  }, []);

  const handleEnquireNow = (journey) => {
    // Store selected journey in localStorage for booking page
    localStorage.setItem('selectedJourney', JSON.stringify(journey));
    // Redirect to booking page
    window.location.href = '/booking';
  };

  if (selectedJourney) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F7FA]">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <AnimatedLogo />
              </Link>
              <Link 
                href="/journeys" 
                className="flex items-center gap-2 text-[#0B1C2D] hover:text-[#C9A24D] transition-colors font-['Inter'] font-medium"
              >
                <ArrowLeft size={20} />
                Back to All Journeys
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Journey Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-96 rounded-2xl overflow-hidden"
              >
                <ImageWithFallback
                  src={selectedJourney.image}
                  alt={selectedJourney.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Star className="text-[#C9A24D]" size={20} fill="#C9A24D" />
                    <span className="font-['Inter'] font-bold text-[#0B1C2D]">{selectedJourney.rating}</span>
                    <span className="font-['Inter'] text-gray-600">({Math.floor(Math.random() * 50) + 100} reviews)</span>
                  </div>
                </div>
              </motion.div>

              {/* Title and Basic Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#0B1C2D] mb-2">
                      {selectedJourney.title}
                    </h1>
                    <p className="font-['Inter'] text-[#C9A24D] font-medium">
                      {selectedJourney.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-['Playfair_Display'] text-2xl font-bold text-[#C9A24D]">
                      {selectedJourney.price}
                    </p>
                  </div>
                </div>

                <p className="font-['Inter'] text-gray-600 leading-relaxed mb-6">
                  {selectedJourney.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-[#C9A24D]" />
                    <span className="font-['Inter'] text-sm">{selectedJourney.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} className="text-[#C9A24D]" />
                    <span className="font-['Inter'] text-sm">{selectedJourney.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} className="text-[#C9A24D]" />
                    <span className="font-['Inter'] text-sm">{selectedJourney.groupSize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-[#C9A24D]" />
                    <span className="font-['Inter'] text-sm font-semibold text-[#C9A24D]">{selectedJourney.rating}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] mb-4">
                    Journey Highlights
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedJourney.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 bg-[#F5F7FA] px-4 py-3 rounded-lg">
                        <div className="w-2 h-2 bg-[#C9A24D] rounded-full"></div>
                        <span className="font-['Inter'] text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] mb-4">
                    Detailed Itinerary
                  </h3>
                  <div className="space-y-4">
                    {selectedJourney.itinerary.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex gap-4 bg-white p-4 rounded-lg border border-gray-100"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-[#C9A24D] text-white rounded-full flex items-center justify-center font-['Inter'] text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="font-['Inter'] text-gray-700">{day}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
              >
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] mb-4">
                  Ready to Book?
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-['Inter'] text-gray-600">Duration</span>
                    <span className="font-['Inter'] font-semibold">{selectedJourney.duration}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-['Inter'] text-gray-600">Group Size</span>
                    <span className="font-['Inter'] font-semibold">{selectedJourney.groupSize}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-['Inter'] text-gray-600">Price</span>
                    <span className="font-['Inter'] font-bold text-[#C9A24D]">{selectedJourney.price}</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleEnquireNow(selectedJourney)}
                  className="w-full bg-gradient-to-r from-[#C9A24D] to-[#B8934D] text-white py-4 rounded-xl font-['Inter'] font-bold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enquire Now
                </motion.button>

                <div className="mt-4 text-center">
                  <p className="font-['Inter'] text-sm text-gray-500 mb-2">
                    Need help? Call our experts
                  </p>
                  <a href="tel:+919560185041" className="font-['Inter'] text-[#C9A24D] font-semibold hover:text-[#B8934D] transition-colors">
                    +91 9560185041
                  </a>
                </div>
              </motion.div>

              {/* Inclusions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] mb-4">
                  What's Included
                </h3>
                <div className="space-y-3">
                  {selectedJourney.inclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#C9A24D] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="font-['Inter'] text-gray-700">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F7FA]">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <AnimatedLogo />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="font-['Inter'] text-gray-600 hover:text-[#C9A24D] transition-colors">
                Home
              </Link>
              <Link href="/journeys" className="font-['Inter'] text-[#C9A24D] font-semibold">
                All Journeys
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#0B1C2D] mb-6">
            All <span className="text-[#C9A24D]">Journeys</span>
          </h1>
          <p className="font-['Cormorant_Garamond'] text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our complete collection of extraordinary travel experiences, 
            each meticulously crafted to exceed your expectations.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-['Inter'] font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#C9A24D] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Journeys Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredJourneys.map((journey, index) => (
            <motion.div
              key={journey.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={journey.image}
                    alt={journey.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay with Quick Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <motion.button
                        onClick={() => setSelectedJourney(journey)}
                        className="w-full bg-[#C9A24D] text-white py-3 rounded-lg font-['Inter'] font-semibold flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details <ArrowRight size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B1C2D] group-hover:text-[#C9A24D] transition-colors duration-300">
                      {journey.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-[#F5F7FA] px-2 py-1 rounded-lg">
                      <Star className="text-[#C9A24D]" size={14} fill="#C9A24D" />
                      <span className="font-['Inter'] text-sm font-semibold">{journey.rating}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <p className="font-['Inter'] text-sm text-[#C9A24D] font-medium mb-3">
                    {journey.category}
                  </p>

                  {/* Description */}
                  <p className="font-['Inter'] text-gray-600 text-sm mb-4 line-clamp-2">
                    {journey.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} className="text-[#C9A24D]" />
                      <span className="font-['Inter'] text-xs">{journey.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} className="text-[#C9A24D]" />
                      <span className="font-['Inter'] text-xs">{journey.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={14} className="text-[#C9A24D]" />
                      <span className="font-['Inter'] text-xs">{journey.groupSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-['Inter'] text-xs font-semibold text-[#C9A24D]">
                        {journey.price}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setSelectedJourney(journey)}
                      className="flex-1 bg-[#F5F7FA] text-[#0B1C2D] py-2 rounded-lg font-['Inter'] font-semibold hover:bg-gray-200 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      onClick={() => handleEnquireNow(journey)}
                      className="flex-1 bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] text-white py-2 rounded-lg font-['Inter'] font-semibold transition-all duration-300 hover:from-[#1a3a52] hover:to-[#0B1C2D]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Enquire Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
