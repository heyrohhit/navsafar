// Package data models for different travel categories

export const packageCategories = {
  domestic: {
    name: "Domestic Travel",
    icon: "🇮🇳",
    gradient: "from-blue-500 to-cyan-600",
    description: "Explore the beauty of India's diverse landscapes and cultures",
    packages: [
      {
        id: 1,
        title: "Kashmir Paradise",
        location: "Srinagar, Gulmarg, Pahalgam",
        subcategory: "hill-station",
        duration: "6 Days / 5 Nights",
        price: "₹24,999",
        originalPrice: "₹35,000",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
        discount: "29% OFF",
        popular: true,
        description: "Experience heaven on earth with stunning valleys, pristine lakes, and snow-capped mountains.",
        inclusions: ["Houseboat Stay", "Shikara Ride", "Gulmarg Gondola", "Airport Transfers", "Daily Breakfast & Dinner"],
        highlights: ["Dal Lake", "Gulmarg Gondola", "Mughal Gardens", "Shikara Ride"]
      },
      {
        id: 2,
        title: "Rajasthan Royal Heritage",
        location: "Jaipur, Udaipur, Jodhpur",
        subcategory: "heritage",
        duration: "7 Days / 6 Nights",
        price: "₹28,999",
        originalPrice: "₹40,000",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1524492412937-b8042a7b97c0?w=400&h=300&fit=crop",
        discount: "28% OFF",
        popular: true,
        description: "Explore the royal heritage of Rajasthan with magnificent palaces, forts, and cultural experiences.",
        inclusions: ["Palace Hotels", "Cultural Shows", "Camel Safari", "Monument Entry", "Guide Services"],
        highlights: ["Amber Fort", "City Palace", "Camel Safari", "Cultural Evenings"]
      },
      {
        id: 3,
        title: "Kerala Backwaters",
        location: "Alleppey, Munnar, Thekkady",
        subcategory: "nature",
        duration: "5 Days / 4 Nights",
        price: "₹22,999",
        originalPrice: "₹32,000",
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1609551214959-3a8fa65e5c12?w=400&h=300&fit=crop",
        discount: "28% OFF",
        popular: true,
        description: "Cruise through serene backwaters, stay in houseboats, and experience Kerala's natural beauty.",
        inclusions: ["Houseboat Stay", "Ayurvedic Massage", "Tea Garden Visit", "Kathakali Show", "All Meals"],
        highlights: ["Alleppey Backwaters", "Munnar Tea Gardens", "Thekkady Wildlife", "Kathakali Performance"]
      },
      {
        id: 4,
        title: "Goa Beach Carnival",
        location: "North & South Goa",
        subcategory: "beach",
        duration: "4 Days / 3 Nights",
        price: "₹18,999",
        originalPrice: "₹25,000",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccf65?w=400&h=300&fit=crop",
        discount: "24% OFF",
        popular: false,
        description: "Enjoy sun, sand, and beaches with vibrant nightlife and water sports in Goa.",
        inclusions: ["Beach Resort", "Water Sports", "Nightclub Entry", "Sightseeing", "Breakfast"],
        highlights: ["Baga Beach", "Water Sports", "Nightlife", "Beach Shacks"]
      }
    ]
  },
  international: {
    name: "International Travel",
    icon: "✈️",
    gradient: "from-purple-500 to-pink-600",
    description: "Discover amazing destinations around the world",
    packages: [
      {
        id: 5,
        title: "Dubai Luxury Experience",
        location: "Dubai, Abu Dhabi",
        subcategory: "luxury",
        duration: "5 Days / 4 Nights",
        price: "₹65,999",
        originalPrice: "₹85,000",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1512453973442-8a6bb9b847c2?w=400&h=300&fit=crop",
        discount: "22% OFF",
        popular: true,
        description: "Experience luxury in the desert city with world-class shopping and iconic architecture.",
        inclusions: ["Burj Khalifa", "Desert Safari", "Dubai Mall", "Dhow Cruise", "5-Star Hotel"],
        highlights: ["Burj Khalifa", "Desert Safari", "Gold Souk", "Dubai Marina"]
      },
      {
        id: 6,
        title: "Singapore Adventure",
        location: "Singapore",
        subcategory: "adventure",
        duration: "4 Days / 3 Nights",
        price: "₹38,999",
        originalPrice: "₹55,000",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1549144511-096e5b9d2e09?w=400&h=300&fit=crop",
        discount: "29% OFF",
        popular: true,
        description: "Explore futuristic gardens, theme parks, and the perfect blend of cultures in Singapore.",
        inclusions: ["Universal Studios", "Gardens by the Bay", "Sentosa Island", "Night Safari", "City Tour"],
        highlights: ["Universal Studios", "Gardens by the Bay", "Sentosa Island", "Merlion Park"]
      },
      {
        id: 7,
        title: "Thailand Island Hopping",
        location: "Bangkok, Phuket, Krabi",
        subcategory: "beach",
        duration: "6 Days / 5 Nights",
        price: "₹45,999",
        originalPrice: "₹60,000",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        discount: "23% OFF",
        popular: false,
        description: "Discover tropical paradise with stunning beaches, temples, and vibrant nightlife in Thailand.",
        inclusions: ["Island Tours", "Beach Resorts", "Temple Visits", "Thai Massage", "All Transfers"],
        highlights: ["Phi Phi Islands", "Phuket Beaches", "Bangkok Temples", "Thai Cuisine"]
      },
      {
        id: 8,
        title: "Europe Romantic Tour",
        location: "Paris, Rome, Barcelona",
        subcategory: "romantic",
        duration: "8 Days / 7 Nights",
        price: "₹1,25,999",
        originalPrice: "₹1,60,000",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
        discount: "21% OFF",
        popular: false,
        description: "Experience the romance of Europe with iconic landmarks, art, and culture.",
        inclusions: ["City Tours", "Museum Entry", "River Cruises", "4-Star Hotels", "Flights"],
        highlights: ["Eiffel Tower", "Colosseum", "Sagrada Familia", "Venice Canals"]
      }
    ]
  },
  religious: {
    name: "Religious Travel",
    icon: "🕉️",
    gradient: "from-orange-500 to-red-600",
    description: "Sacred journeys to holy destinations",
    packages: [
      {
        id: 9,
        title: "Char Dham Yatra",
        location: "Badrinath, Kedarnath, Gangotri, Yamunotri",
        subcategory: "pilgrimage",
        duration: "12 Days / 11 Nights",
        price: "₹35,999",
        originalPrice: "₹45,000",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
        discount: "20% OFF",
        popular: true,
        description: "Sacred pilgrimage to the four holy abodes in the Himalayas.",
        inclusions: ["Helicopter Service", "Priest Services", "Accommodation", "All Meals", "Special Puja"],
        highlights: ["Badrinath Temple", "Kedarnath Temple", "Gangotri", "Yamunotri Temple"]
      },
      {
        id: 10,
        title: "Vaishno Devi Darshan",
        location: "Katra, Jammu & Kashmir",
        subcategory: "pilgrimage",
        duration: "3 Days / 2 Nights",
        price: "₹8,999",
        originalPrice: "₹12,000",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1596428303959-383a8f4b1b7c?w=400&h=300&fit=crop",
        discount: "25% OFF",
        popular: false,
        description: "Spiritual journey to the holy shrine of Mata Vaishno Devi.",
        inclusions: ["Helicopter Tickets", "VIP Darshan", "Accommodation", "Meals", "Transfers"],
        highlights: ["Vaishno Devi Temple", "Helicopter Yatra", "Aarti", "Prasad"]
      },
      {
        id: 11,
        title: "Golden Temple Tour",
        location: "Amritsar, Punjab",
        subcategory: "pilgrimage",
        duration: "2 Days / 1 Night",
        price: "₹6,999",
        originalPrice: "₹9,000",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=400&h=300&fit=crop",
        discount: "22% OFF",
        popular: false,
        description: "Visit the holiest shrine of Sikhism and experience divine peace.",
        inclusions: ["Temple Visit", "Langar Experience", "City Tour", "Accommodation", "Meals"],
        highlights: ["Golden Temple", "Langar Hall", "Wagah Border", "Jallianwala Bagh"]
      },
      {
        id: 12,
        title: "Buddhist Circuit Tour",
        location: "Bodh Gaya, Sarnath, Kushinagar",
        subcategory: "pilgrimage",
        duration: "5 Days / 4 Nights",
        price: "₹15,999",
        originalPrice: "₹20,000",
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
        discount: "20% OFF",
        popular: false,
        description: "Follow in the footsteps of Buddha through sacred Buddhist sites.",
        inclusions: ["Monastery Visits", "Meditation Sessions", "Guide Services", "Accommodation", "Meals"],
        highlights: ["Mahabodhi Temple", "Sarnath Stupa", "Bodhi Tree", "Nirvana Stupa"]
      }
    ]
  },
  family: {
    name: "Family Holiday",
    icon: "👨‍👩‍👧‍👦",
    gradient: "from-green-500 to-emerald-600",
    description: "Create unforgettable memories with your loved ones",
    packages: [
      {
        id: 13,
        title: "Disney World Magic",
        location: "Orlando, Florida",
        subcategory: "theme-park",
        duration: "6 Days / 5 Nights",
        price: "₹1,85,999",
        originalPrice: "₹2,30,000",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        discount: "19% OFF",
        popular: true,
        description: "Magical family adventure at the world's most famous theme parks.",
        inclusions: ["Park Tickets", "Character Dining", "Resort Stay", "Airport Transfers", "Breakfast"],
        highlights: ["Magic Kingdom", "Epcot", "Hollywood Studios", "Animal Kingdom"]
      },
      {
        id: 14,
        title: "Swiss Alps Family Fun",
        location: "Zurich, Interlaken, Lucerne",
        subcategory: "adventure",
        duration: "7 Days / 6 Nights",
        price: "₹1,45,999",
        originalPrice: "₹1,80,000",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
        discount: "19% OFF",
        popular: false,
        description: "Alpine adventure with scenic train rides, chocolate factories, and mountain excursions.",
        inclusions: ["Mountain Trains", "Chocolate Factory", "Adventure Parks", "4-Star Hotels", "All Transfers"],
        highlights: ["Jungfraujoch", "Swiss Chocolate", "Lake Lucerne", "Mountain Excursions"]
      },
      {
        id: 15,
        title: "Andaman Family Escape",
        location: "Port Blair, Havelock, Neil Island",
        subcategory: "beach",
        duration: "5 Days / 4 Nights",
        price: "₹32,999",
        originalPrice: "₹42,000",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        discount: "21% OFF",
        popular: false,
        description: "Tropical paradise with pristine beaches, water sports, and marine life.",
        inclusions: ["Beach Resorts", "Scuba Diving", "Island Hopping", "Glass Boat Ride", "All Meals"],
        highlights: ["Havelock Island", "Radhanagar Beach", "Scuba Diving", "Glass Bottom Boat"]
      },
      {
        id: 16,
        title: "Japan Family Discovery",
        location: "Tokyo, Kyoto, Osaka",
        subcategory: "cultural",
        duration: "6 Days / 5 Nights",
        price: "₹95,999",
        originalPrice: "₹1,20,000",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
        discount: "20% OFF",
        popular: false,
        description: "Explore the perfect blend of tradition and technology in family-friendly Japan.",
        inclusions: ["Theme Parks", "Cultural Experiences", "Bullet Train", "4-Star Hotels", "City Tours"],
        highlights: ["Tokyo Disneyland", "Mount Fuji", "Kyoto Temples", "Bullet Train"]
      }
    ]
  },
  adventure: {
    name: "Adventure Travel",
    icon: "🏔️",
    gradient: "from-indigo-500 to-purple-600",
    description: "Thrilling experiences for adventure enthusiasts",
    packages: [
      {
        id: 17,
        title: "Himalayan Trekking Expedition",
        location: "Manali, Spiti Valley",
        subcategory: "trekking",
        duration: "8 Days / 7 Nights",
        price: "₹28,999",
        originalPrice: "₹38,000",
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
        discount: "24% OFF",
        popular: false,
        description: "Challenging trek through remote Himalayan valleys with stunning mountain views.",
        inclusions: ["Trekking Guide", "Camping Equipment", "Meals", "Permits", "First Aid"],
        highlights: ["Hampta Pass", "Chandratal Lake", "Spiti Valley", "Camping"]
      },
      {
        id: 18,
        title: "African Safari Adventure",
        location: "Kenya, Tanzania",
        subcategory: "wildlife",
        duration: "7 Days / 6 Nights",
        price: "₹1,25,999",
        originalPrice: "₹1,60,000",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop",
        discount: "21% OFF",
        popular: false,
        description: "Witness the Big Five in their natural habitat on an unforgettable African safari.",
        inclusions: ["Safari Drives", "Luxury Lodges", "Wildlife Guide", "All Meals", "Park Fees"],
        highlights: ["Big Five Animals", "Safari Drives", "Masai Mara", "Luxury Lodges"]
      },
      {
        id: 19,
        title: "New Zealand Adventure",
        location: "Queenstown, Auckland, Rotorua",
        subcategory: "extreme",
        duration: "9 Days / 8 Nights",
        price: "₹1,55,999",
        originalPrice: "₹1,95,000",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        discount: "20% OFF",
        popular: false,
        description: "Adventure capital with bungee jumping, skydiving, and stunning landscapes.",
        inclusions: ["Adventure Activities", "Scenic Flights", "4-Star Hotels", "All Transfers", "Insurance"],
        highlights: ["Bungee Jumping", "Skydiving", "Milford Sound", "Adventure Sports"]
      },
      {
        id: 20,
        title: "Amazon Rainforest Expedition",
        location: "Peru, Brazil",
        subcategory: "nature",
        duration: "6 Days / 5 Nights",
        price: "₹85,999",
        originalPrice: "₹1,10,000",
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        discount: "22% OFF",
        popular: false,
        description: "Deep jungle expedition with wildlife encounters and indigenous culture.",
        inclusions: ["Jungle Lodge", "Wildlife Tours", "River Cruises", "Naturalist Guide", "All Meals"],
        highlights: ["Amazon Rainforest", "Wildlife Viewing", "River Cruises", "Indigenous Culture"]
      }
    ]
  }
};

// Helper functions
export const getAllPackages = () => {
  const allPackages = [];
  
  Object.values(packageCategories).forEach(category => {
    allPackages.push(...category.packages);
  });
  
  return allPackages;
};

export const getPackagesByCategory = (category) => {
  return packageCategories[category]?.packages || [];
};

export const getCategoryInfo = (category) => {
  return packageCategories[category] || {
    name: "All Packages",
    icon: "🌍",
    gradient: "from-gray-500 to-gray-600",
    description: "Explore all our travel packages",
    packages: []
  };
};
