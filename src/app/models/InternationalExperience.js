// International Experience Model
export class InternationalExperience {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = 'international';
    this.price = data.price || 0;
    this.duration = data.duration || '';
    this.location = data.location || '';
    this.country = data.country || '';
    this.continent = data.continent || '';
    this.image = data.image || '';
    this.rating = data.rating || 0;
    this.reviews = data.reviews || 0;
    this.discount = data.discount || 0;
    this.inclusions = data.inclusions || [];
    this.exclusions = data.exclusions || [];
    this.visaRequired = data.visaRequired || false;
    this.visaAssistance = data.visaAssistance || false;
    this.currency = data.currency || 'USD';
    this.language = data.language || '';
    this.timeZone = data.timeZone || '';
    this.bestSeason = data.bestSeason || '';
    this.climate = data.climate || '';
    this.culturalHighlights = data.culturalHighlights || [];
    this.landmarks = data.landmarks || [];
    this.localCuisine = data.localCuisine || [];
    this.shoppingHighlights = data.shoppingHighlights || [];
    this.nightlife = data.nightlife || [];
    this.transportation = data.transportation || {};
    this.accommodationType = data.accommodationType || ''; // luxury hotel, boutique hotel, apartment, hostel
    this.mealPlan = data.mealPlan || '';
    this.activities = data.activities || [];
    this.adventureActivities = data.adventureActivities || [];
    this.culturalActivities = data.culturalActivities || [];
    this.relaxationActivities = data.relaxationActivities || [];
    this.familyActivities = data.familyActivities || [];
    this.soloActivities = data.soloActivities || [];
    this.groupSize = data.groupSize || { min: 1, max: 20 };
    this.difficulty = data.difficulty || 'easy'; // easy, moderate, hard
    this.fitnessLevel = data.fitnessLevel || 'low';
    this.safetyRating = data.safetyRating || 5; // 1-5 scale
    this.travelInsurance = data.travelInsurance || false;
    this.emergencySupport = data.emergencySupport || false;
    this.localGuide = data.localGuide || false;
    this.englishSpeaking = data.englishSpeaking || false;
    this.wifiAvailable = data.wifiAvailable || false;
    this.packingTips = data.packingTips || [];
    this.healthRequirements = data.healthRequirements || [];
    this.customsRegulations = data.customsRegulations || [];
    this.localLaws = data.localLaws || [];
    this.tips = data.tips || [];
    this.benefits = data.benefits || [];
    this.itinerary = data.itinerary || [];
    this.bookingInfo = data.bookingInfo || {};
    this.cancellationPolicy = data.cancellationPolicy || '';
    this.specialOffers = data.specialOffers || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isActive = data.isActive !== false;
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name.trim()) {
      errors.push('Experience name is required');
    }
    
    if (!this.description.trim()) {
      errors.push('Description is required');
    }
    
    if (!this.location.trim()) {
      errors.push('Location is required');
    }
    
    if (!this.country.trim()) {
      errors.push('Country is required');
    }
    
    if (this.price <= 0) {
      errors.push('Price must be greater than 0');
    }
    
    if (!this.duration.trim()) {
      errors.push('Duration is required');
    }
    
    if (!['luxury hotel', 'boutique hotel', 'apartment', 'hostel', 'resort'].includes(this.accommodationType)) {
      errors.push('Invalid accommodation type');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get formatted price in local currency
  getFormattedPrice() {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(this.price);
  }

  // Get discount price
  getDiscountedPrice() {
    if (this.discount > 0) {
      return this.price * (1 - this.discount / 100);
    }
    return this.price;
  }

  // Get formatted discount price
  getFormattedDiscountedPrice() {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(this.getDiscountedPrice());
  }

  // Get price in local currency
  getLocalCurrencyPrice() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(this.price);
  }

  // Get accommodation type color
  getAccommodationColor() {
    const colors = {
      'luxury hotel': 'text-purple-600 bg-purple-100',
      'boutique hotel': 'text-blue-600 bg-blue-100',
      'apartment': 'text-green-600 bg-green-100',
      'hostel': 'text-orange-600 bg-orange-100',
      'resort': 'text-red-600 bg-red-100'
    };
    return colors[this.accommodationType] || colors['luxury hotel'];
  }

  // Get difficulty color
  getDifficultyColor() {
    const colors = {
      easy: 'text-green-600 bg-green-100',
      moderate: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100'
    };
    return colors[this.difficulty] || colors.easy;
  }

  // Get safety rating color
  getSafetyRatingColor() {
    if (this.safetyRating >= 4) return 'text-green-600 bg-green-100';
    if (this.safetyRating >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  // Get rating stars
  getRatingStars() {
    const fullStars = Math.floor(this.rating);
    const hasHalfStar = this.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    
    if (hasHalfStar) {
      stars += '⭐';
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars += '☆';
    }
    
    return stars;
  }

  // Get safety rating stars
  getSafetyRatingStars() {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < this.safetyRating) {
        stars += '🛡️';
      } else {
        stars += '⭕';
      }
    }
    return stars;
  }

  // Check if visa is required
  isVisaRequired() {
    return this.visaRequired;
  }

  // Get visa assistance text
  getVisaAssistanceText() {
    if (this.visaRequired) {
      return this.visaAssistance ? 'Visa Required - Assistance Available' : 'Visa Required - Self-Apply';
    }
    return 'No Visa Required';
  }

  // Get activities count
  getActivitiesCount() {
    return this.activities.length;
  }

  // Get cultural highlights count
  getCulturalHighlightsCount() {
    return this.culturalHighlights.length;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      price: this.price,
      duration: this.duration,
      location: this.location,
      country: this.country,
      continent: this.continent,
      image: this.image,
      rating: this.rating,
      reviews: this.reviews,
      discount: this.discount,
      inclusions: this.inclusions,
      exclusions: this.exclusions,
      visaRequired: this.visaRequired,
      visaAssistance: this.visaAssistance,
      currency: this.currency,
      language: this.language,
      timeZone: this.timeZone,
      bestSeason: this.bestSeason,
      climate: this.climate,
      culturalHighlights: this.culturalHighlights,
      landmarks: this.landmarks,
      localCuisine: this.localCuisine,
      shoppingHighlights: this.shoppingHighlights,
      nightlife: this.nightlife,
      transportation: this.transportation,
      accommodationType: this.accommodationType,
      mealPlan: this.mealPlan,
      activities: this.activities,
      adventureActivities: this.adventureActivities,
      culturalActivities: this.culturalActivities,
      relaxationActivities: this.relaxationActivities,
      familyActivities: this.familyActivities,
      soloActivities: this.soloActivities,
      groupSize: this.groupSize,
      difficulty: this.difficulty,
      fitnessLevel: this.fitnessLevel,
      safetyRating: this.safetyRating,
      travelInsurance: this.travelInsurance,
      emergencySupport: this.emergencySupport,
      localGuide: this.localGuide,
      englishSpeaking: this.englishSpeaking,
      wifiAvailable: this.wifiAvailable,
      packingTips: this.packingTips,
      healthRequirements: this.healthRequirements,
      customsRegulations: this.customsRegulations,
      localLaws: this.localLaws,
      tips: this.tips,
      benefits: this.benefits,
      itinerary: this.itinerary,
      bookingInfo: this.bookingInfo,
      cancellationPolicy: this.cancellationPolicy,
      specialOffers: this.specialOffers,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive
    };
  }
}

// Static method to create from API response
InternationalExperience.fromAPI = (apiData) => {
  return new InternationalExperience({
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    price: apiData.price,
    duration: apiData.duration,
    location: apiData.location,
    country: apiData.country,
    continent: apiData.continent,
    image: apiData.image,
    rating: apiData.rating,
    reviews: apiData.reviews,
    discount: apiData.discount,
    inclusions: apiData.inclusions,
    exclusions: apiData.exclusions,
    visaRequired: apiData.visaRequired,
    visaAssistance: apiData.visaAssistance,
    currency: apiData.currency,
    language: apiData.language,
    timeZone: apiData.timeZone,
    bestSeason: apiData.bestSeason,
    climate: apiData.climate,
    culturalHighlights: apiData.culturalHighlights,
    landmarks: apiData.landmarks,
    localCuisine: apiData.localCuisine,
    shoppingHighlights: apiData.shoppingHighlights,
    nightlife: apiData.nightlife,
    transportation: apiData.transportation,
    accommodationType: apiData.accommodationType,
    mealPlan: apiData.mealPlan,
    activities: apiData.activities,
    adventureActivities: apiData.adventureActivities,
    culturalActivities: apiData.culturalActivities,
    relaxationActivities: apiData.relaxationActivities,
    familyActivities: apiData.familyActivities,
    soloActivities: apiData.soloActivities,
    groupSize: apiData.groupSize,
    difficulty: apiData.difficulty,
    fitnessLevel: apiData.fitnessLevel,
    safetyRating: apiData.safetyRating,
    travelInsurance: apiData.travelInsurance,
    emergencySupport: apiData.emergencySupport,
    localGuide: apiData.localGuide,
    englishSpeaking: apiData.englishSpeaking,
    wifiAvailable: apiData.wifiAvailable,
    packingTips: apiData.packingTips,
    healthRequirements: apiData.healthRequirements,
    customsRegulations: apiData.customsRegulations,
    localLaws: apiData.localLaws,
    tips: apiData.tips,
    benefits: apiData.benefits,
    itinerary: apiData.itinerary,
    bookingInfo: apiData.bookingInfo,
    cancellationPolicy: apiData.cancellationPolicy,
    specialOffers: apiData.specialOffers,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    isActive: apiData.isActive
  });
};

// Sample international experiences
export const sampleInternationalExperiences = [
  new InternationalExperience({
    id: 'int-001',
    name: 'Paris Romance & Culture',
    description: 'Experience the city of love with iconic landmarks, world-class cuisine, and unforgettable cultural experiences.',
    price: 185000,
    duration: '6 Days / 5 Nights',
    location: 'Paris',
    country: 'France',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 542,
    discount: 10,
    visaRequired: true,
    visaAssistance: true,
    currency: 'EUR',
    language: 'French',
    timeZone: 'CET (UTC+1)',
    accommodationType: 'boutique hotel',
    mealPlan: 'breakfast only',
    safetyRating: 5,
    inclusions: ['Luxury Hotel', 'Daily Breakfast', 'City Tour', 'Museum Passes', 'Airport Transfer'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    culturalHighlights: ['Eiffel Tower', 'Louvre Museum', 'Notre Dame', 'Montmartre', 'Champs-Élysées'],
    landmarks: ['Eiffel Tower', 'Arc de Triomphe', 'Sacré-Cœur', 'Pantheon'],
    localCuisine: ['Croissants', 'French Wine', 'Cheese', 'Pastries', 'Coq au Vin'],
    shoppingHighlights: ['Champs-Élysées', 'Galeries Lafayette', 'Le Marais', 'Saint-Germain'],
    nightlife: ['Cabaret Shows', 'Rooftop Bars', 'Jazz Clubs', 'River Seine Cruise'],
    activities: ['City Tour', 'Museum Visits', 'Seine River Cruise', 'Montmartre Walking Tour'],
    culturalActivities: ['Wine Tasting', 'Cooking Class', 'Art Gallery', 'Opera Show'],
    relaxationActivities: ['Spa Treatment', 'Garden Stroll', 'Café Hopping', 'Park Visits'],
    bestSeason: 'April to June, September to October',
    climate: 'Temperate Oceanic',
    englishSpeaking: true,
    wifiAvailable: true,
    emergencySupport: true,
    benefits: ['Visa Assistance', 'Travel Insurance', '24/7 Support', 'Local Guide']
  }),
  new InternationalExperience({
    id: 'int-002',
    name: 'Dubai Luxury & Adventure',
    description: 'Experience the ultimate luxury and adventure in Dubai with world-class shopping, desert safaris, and iconic architecture.',
    price: 165000,
    duration: '5 Days / 4 Nights',
    location: 'Dubai',
    country: 'UAE',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f6?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 428,
    discount: 15,
    visaRequired: true,
    visaAssistance: true,
    currency: 'AED',
    language: 'Arabic',
    timeZone: 'GST (UTC+4)',
    accommodationType: 'luxury hotel',
    mealPlan: 'half board',
    safetyRating: 4,
    inclusions: ['5-Star Hotel', 'Breakfast & Dinner', 'Desert Safari', 'City Tour', 'Airport Transfer'],
    exclusions: ['International Flights', 'Lunch', 'Personal Expenses'],
    culturalHighlights: ['Burj Khalifa', 'Dubai Mall', 'Gold Souk', 'Jumeirah Mosque', 'Dubai Marina'],
    landmarks: ['Burj Khalifa', 'Burj Al Arab', 'Palm Jumeirah', 'Dubai Frame'],
    localCuisine: ['Shawarma', 'Falafel', 'Dates', 'Arabic Coffee', 'Machboos'],
    shoppingHighlights: ['Dubai Mall', 'Gold Souk', 'Spice Souk', 'Global Village'],
    nightlife: ['Rooftop Bars', 'Nightclubs', 'Desert Camp', 'Dubai Fountain Show'],
    activities: ['City Tour', 'Desert Safari', 'Dhow Cruise', 'Aquarium Visit'],
    adventureActivities: ['Skydiving', 'Sandboarding', 'Dune Bashing', 'Hot Air Balloon'],
    relaxationActivities: ['Beach Time', 'Spa Treatment', 'Pool Relaxation', 'Shopping'],
    bestSeason: 'November to March',
    climate: 'Desert',
    englishSpeaking: true,
    wifiAvailable: true,
    emergencySupport: true,
    benefits: ['Visa on Arrival', 'Luxury Experience', 'Adventure Activities', 'Shopping Paradise']
  }),
  new InternationalExperience({
    id: 'int-003',
    name: 'Tokyo Technology & Tradition',
    description: 'Discover the perfect blend of ancient traditions and cutting-edge technology in Japan\'s vibrant capital.',
    price: 145000,
    duration: '7 Days / 6 Nights',
    location: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 312,
    accommodationType: 'hotel',
    mealPlan: 'breakfast only',
    safetyRating: 5,
    inclusions: ['Modern Hotel', 'Daily Breakfast', 'City Tour', 'JR Pass', 'Airport Transfer'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    culturalHighlights: ['Senso-ji Temple', 'Meiji Shrine', 'Tsukiji Market', 'Akihabara', 'Shibuya Crossing'],
    landmarks: ['Tokyo Tower', 'Skytree', 'Imperial Palace', 'Tokyo Station'],
    localCuisine: ['Sushi', 'Ramen', 'Tempura', 'Yakitori', 'Matcha'],
    shoppingHighlights: ['Shibuya', 'Harajuku', 'Akihabara', 'Ginza'],
    nightlife: ['Izakayas', 'Karaoke', 'Rooftop Bars', 'Night Markets'],
    activities: ['City Tour', 'Temple Visit', 'Market Tour', 'Technology Tour'],
    culturalActivities: ['Tea Ceremony', 'Calligraphy Class', 'Kimono Experience', 'Sumo Wrestling'],
    relaxationActivities: ['Onsen', 'Park Visits', 'Garden Stroll', 'Café Time'],
    bestSeason: 'March to May, October to November',
    climate: 'Humid Subtropical',
    englishSpeaking: true,
    wifiAvailable: true,
    emergencySupport: true,
    benefits: ['Safe Country', 'Excellent Transport', 'Rich Culture', 'Modern Technology']
  }),
  new InternationalExperience({
    id: 'int-004',
    name: 'Bali Spiritual Paradise',
    description: 'Experience the spiritual and natural beauty of Bali with ancient temples, rice terraces, and pristine beaches.',
    price: 95000,
    duration: '6 Days / 5 Nights',
    location: 'Ubud, Bali',
    country: 'Indonesia',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194473-e8576adeaaf4?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 256,
    discount: 20,
    visaRequired: false,
    visaAssistance: false,
    currency: 'IDR',
    language: 'Indonesian',
    timeZone: 'WITA (UTC+8)',
    accommodationType: 'resort',
    mealPlan: 'breakfast only',
    safetyRating: 4,
    inclusions: ['Beach Resort', 'Daily Breakfast', 'Temple Tour', 'Rice Terrace Visit', 'Airport Transfer'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    culturalHighlights: ['Tanah Lot Temple', 'Besakih Temple', 'Uluwatu Temple', 'Tirta Empul', 'Goa Gajah'],
    landmarks: ['Mount Batur', 'Tegallalang Rice Terrace', 'Seminyak Beach', 'Nusa Dua'],
    localCuisine: ['Nasi Goreng', 'Satay', 'Babi Guling', 'Gado-gado', 'Sambal'],
    shoppingHighlights: ['Ubud Market', 'Sukawati Market', 'Seminyak Shops', 'Kuta Beach Road'],
    nightlife: ['Beach Clubs', 'Live Music', 'Cultural Shows', 'Beach Bars'],
    activities: ['Temple Tour', 'Rice Terrace Walk', 'Beach Time', 'Volcano Sunrise'],
    adventureActivities: ['Surfing', 'Snorkeling', 'Trekking', 'White Water Rafting'],
    culturalActivities: ['Traditional Dance', 'Batik Workshop', 'Cooking Class', 'Offering Making'],
    relaxationActivities: ['Beach Relaxation', 'Spa Treatment', 'Yoga Class', 'Meditation'],
    bestSeason: 'April to October',
    climate: 'Tropical',
    englishSpeaking: true,
    wifiAvailable: true,
    emergencySupport: true,
    benefits: ['Visa-Free', 'Affordable Paradise', 'Rich Culture', 'Beautiful Beaches']
  })
];

export default InternationalExperience;
