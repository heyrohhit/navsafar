// Honeymoon Experience Model
export class HoneymoonExperience {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = 'honeymoon';
    this.price = data.price || 0;
    this.duration = data.duration || '';
    this.location = data.location || '';
    this.image = data.image || '';
    this.rating = data.rating || 0;
    this.reviews = data.reviews || 0;
    this.discount = data.discount || 0;
    this.inclusions = data.inclusions || [];
    this.exclusions = data.exclusions || [];
    this.romanticFeatures = data.romanticFeatures || [];
    this.accommodationType = data.accommodationType || ''; // beach villa, mountain resort, luxury hotel, houseboat
    this.mealPlan = data.mealPlan || ''; // all inclusive, breakfast only, half board, full board
    this.specialActivities = data.specialActivities || [];
    this.privacyLevel = data.privacyLevel || 'high'; // low, medium, high, exclusive
    this.bestSeason = data.bestSeason || '';
    this.coupleActivities = data.coupleActivities || [];
    this.roomFeatures = data.roomFeatures || [];
    this.diningOptions = data.diningOptions || [];
    this.spaServices = data.spaServices || [];
    this.transportation = data.transportation || {};
    this.photographyPackage = data.photographyPackage || {};
    this.surpriseElements = data.surpriseElements || [];
    this.celebrationPackage = data.celebrationPackage || {};
    this.weatherConsiderations = data.weatherConsiderations || [];
    this.packingTips = data.packingTips || [];
    this.benefits = data.benefits || [];
    this.itinerary = data.itinerary || [];
    this.bookingInfo = data.bookingInfo || {};
    this.cancellationPolicy = data.cancellationPolicy || '';
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
    
    if (this.price <= 0) {
      errors.push('Price must be greater than 0');
    }
    
    if (!this.duration.trim()) {
      errors.push('Duration is required');
    }
    
    if (!['beach villa', 'mountain resort', 'luxury hotel', 'houseboat', 'heritage property'].includes(this.accommodationType)) {
      errors.push('Invalid accommodation type');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get formatted price
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

  // Get accommodation type color
  getAccommodationColor() {
    const colors = {
      'beach villa': 'text-blue-600 bg-blue-100',
      'mountain resort': 'text-green-600 bg-green-100',
      'luxury hotel': 'text-purple-600 bg-purple-100',
      'houseboat': 'text-cyan-600 bg-cyan-100',
      'heritage property': 'text-orange-600 bg-orange-100'
    };
    return colors[this.accommodationType] || colors['luxury hotel'];
  }

  // Get privacy level color
  getPrivacyLevelColor() {
    const colors = {
      low: 'text-gray-600 bg-gray-100',
      medium: 'text-blue-600 bg-blue-100',
      high: 'text-purple-600 bg-purple-100',
      exclusive: 'text-red-600 bg-red-100'
    };
    return colors[this.privacyLevel] || colors.high;
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

  // Get romantic features count
  getRomanticFeaturesCount() {
    return this.romanticFeatures.length;
  }

  // Get couple activities count
  getCoupleActivitiesCount() {
    return this.coupleActivities.length;
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
      image: this.image,
      rating: this.rating,
      reviews: this.reviews,
      discount: this.discount,
      inclusions: this.inclusions,
      exclusions: this.exclusions,
      romanticFeatures: this.romanticFeatures,
      accommodationType: this.accommodationType,
      mealPlan: this.mealPlan,
      specialActivities: this.specialActivities,
      privacyLevel: this.privacyLevel,
      bestSeason: this.bestSeason,
      coupleActivities: this.coupleActivities,
      roomFeatures: this.roomFeatures,
      diningOptions: this.diningOptions,
      spaServices: this.spaServices,
      transportation: this.transportation,
      photographyPackage: this.photographyPackage,
      surpriseElements: this.surpriseElements,
      celebrationPackage: this.celebrationPackage,
      weatherConsiderations: this.weatherConsiderations,
      packingTips: this.packingTips,
      benefits: this.benefits,
      itinerary: this.itinerary,
      bookingInfo: this.bookingInfo,
      cancellationPolicy: this.cancellationPolicy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive
    };
  }
}

// Static method to create from API response
HoneymoonExperience.fromAPI = (apiData) => {
  return new HoneymoonExperience({
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    price: apiData.price,
    duration: apiData.duration,
    location: apiData.location,
    image: apiData.image,
    rating: apiData.rating,
    reviews: apiData.reviews,
    discount: apiData.discount,
    inclusions: apiData.inclusions,
    exclusions: apiData.exclusions,
    romanticFeatures: apiData.romanticFeatures,
    accommodationType: apiData.accommodationType,
    mealPlan: apiData.mealPlan,
    specialActivities: apiData.specialActivities,
    privacyLevel: apiData.privacyLevel,
    bestSeason: apiData.bestSeason,
    coupleActivities: apiData.coupleActivities,
    roomFeatures: apiData.roomFeatures,
    diningOptions: apiData.diningOptions,
    spaServices: apiData.spaServices,
    transportation: apiData.transportation,
    photographyPackage: apiData.photographyPackage,
    surpriseElements: apiData.surpriseElements,
    celebrationPackage: apiData.celebrationPackage,
    weatherConsiderations: apiData.weatherConsiderations,
    packingTips: apiData.packingTips,
    benefits: apiData.benefits,
    itinerary: apiData.itinerary,
    bookingInfo: apiData.bookingInfo,
    cancellationPolicy: apiData.cancellationPolicy,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    isActive: apiData.isActive
  });
};

// Sample honeymoon experiences
export const sampleHoneymoonExperiences = [
  new HoneymoonExperience({
    id: 'hon-001',
    name: 'Maldives Beach Villa Paradise',
    description: 'Experience ultimate romance in overwater villas with private pools, pristine beaches, and world-class spa treatments.',
    price: 185000,
    duration: '5 Days / 4 Nights',
    location: 'Male, Maldives',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 428,
    discount: 20,
    accommodationType: 'beach villa',
    mealPlan: 'all inclusive',
    privacyLevel: 'exclusive',
    inclusions: ['Overwater Villa', 'Private Pool', 'All Meals', 'Spa Package', 'Airport Transfer', 'Butler Service'],
    exclusions: ['International Flights', 'Travel Insurance', 'Personal Shopping'],
    romanticFeatures: ['Private Beach Dinner', 'Couples Spa', 'Sunset Cruise', 'Romantic Decor'],
    specialActivities: ['Snorkeling', 'Dolphin Watching', 'Island Hopping', 'Cooking Class'],
    coupleActivities: ['Beach Volleyball', 'Kayaking', 'Sunset Photography', 'Stargazing'],
    roomFeatures: ['King Size Bed', 'Jacuzzi', 'Ocean View', 'Mini Bar', 'Smart TV'],
    diningOptions: ['Private Dining', 'Beach BBQ', 'In-Villa Dining', 'Romantic Breakfast'],
    spaServices: ['Couples Massage', 'Aromatherapy', 'Facial Treatment', 'Body Scrub'],
    bestSeason: 'November to April',
    surpriseElements: ['Flower Bed Decoration', 'Champagne on Arrival', 'Cake on Special Occasion'],
    benefits: ['100% Privacy', 'Personalized Service', 'Free Upgrade (Subject to Availability)', 'Late Checkout']
  }),
  new HoneymoonExperience({
    id: 'hon-002',
    name: 'Swiss Alps Mountain Romance',
    description: 'Fall in love amidst snow-capped peaks, cozy chalets, and breathtaking mountain views in Switzerland.',
    price: 225000,
    duration: '7 Days / 6 Nights',
    location: 'Interlaken, Switzerland',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e2f6?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 312,
    accommodationType: 'mountain resort',
    mealPlan: 'half board',
    privacyLevel: 'high',
    inclusions: ['Luxury Suite', 'Mountain View', 'Breakfast & Dinner', 'Train Pass', 'Spa Access'],
    exclusions: ['International Flights', 'Lunch', 'Personal Expenses'],
    romanticFeatures: ['Fireplace Suite', 'Mountain View Dinner', 'Couples Spa', 'Chocolate Tasting'],
    specialActivities: ['Skiing', 'Snowboarding', 'Mountain Hiking', 'Scenic Train Rides'],
    coupleActivities: ['Ice Skating', 'Sledging', 'Thermal Baths', 'Mountain Photography'],
    roomFeatures: ['Fireplace', 'Balcony', 'King Bed', 'Mini Bar', 'Coffee Machine'],
    diningOptions: ['Fine Dining Restaurant', 'Mountain View Restaurant', 'Room Service'],
    spaServices: ['Couples Massage', 'Sauna', 'Steam Room', 'Hot Tub'],
    bestSeason: 'December to March, June to September',
    surpriseElements: ['Welcome Chocolate', 'Rose Petals', 'Swiss Chocolate Box', 'Romantic Music'],
    benefits: ['Free Ski Pass', 'Complimentary Spa Access', 'Room Upgrade', 'Late Checkout']
  }),
  new HoneymoonExperience({
    id: 'hon-003',
    name: 'Kerala Backwaters Houseboat',
    description: 'Drift along serene backwaters in luxury houseboats, experiencing traditional Kerala culture and cuisine.',
    price: 65000,
    duration: '4 Days / 3 Nights',
    location: 'Alleppey, Kerala',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 256,
    discount: 15,
    accommodationType: 'houseboat',
    mealPlan: 'full board',
    privacyLevel: 'high',
    inclusions: ['Luxury Houseboat', 'All Meals', 'Crew Service', 'Sightseeing', 'Airport Transfer'],
    exclusions: ['International Flights', 'Personal Expenses', 'Alcohol'],
    romanticFeatures: ['Private Deck', 'Candlelight Dinner', 'Sunset Cruise', 'Traditional Music'],
    specialActivities: ['Village Visit', 'Temple Tour', 'Spice Plantation', 'Beach Time'],
    coupleActivities: ['Fishing', 'Bird Watching', 'Swimming', 'Cooking Demonstration'],
    roomFeatures: ['Air Conditioning', 'King Bed', 'Private Bathroom', 'Living Area', 'Sun Deck'],
    diningOptions: ['On-Board Dining', 'Local Cuisine', 'Seafood Specialties', 'Vegetarian Options'],
    spaServices: ['Ayurvedic Massage', 'Head Massage', 'Foot Massage'],
    bestSeason: 'October to March',
    surpriseElements: ['Flower Decoration', 'Welcome Drink', 'Fruit Basket', 'Traditional Saree'],
    benefits: ['Private Houseboat', 'Personalized Service', 'Free Sightseeing', 'Cultural Experience']
  }),
  new HoneymoonExperience({
    id: 'hon-004',
    name: 'Bali Luxury Resort Escape',
    description: 'Discover tropical paradise in Bali with luxury resorts, private villas, and exotic cultural experiences.',
    price: 95000,
    duration: '6 Days / 5 Nights',
    location: 'Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1537996194473-e8576adeaaf4?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 189,
    accommodationType: 'luxury hotel',
    mealPlan: 'breakfast only',
    privacyLevel: 'high',
    inclusions: ['Private Villa', 'Private Pool', 'Daily Breakfast', 'Airport Transfer', 'Spa Credit'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    romanticFeatures: ['Private Pool Villa', 'Couples Spa', 'Romantic Dinner', 'Flower Bath'],
    specialActivities: ['Temple Tour', 'Rice Terrace Trek', 'Cooking Class', 'Traditional Dance'],
    coupleActivities: ['Yoga Session', 'Art Class', 'Market Tour', 'Beach Time'],
    roomFeatures: ['Private Pool', 'Outdoor Shower', 'King Bed', 'Day Bed', 'Kitchenette'],
    diningOptions: ['In-Villa Dining', 'Restaurant', 'Beach Club', 'Room Service'],
    spaServices: ['Balinese Massage', 'Flower Bath', 'Body Treatment', 'Facial'],
    bestSeason: 'April to October',
    surpriseElements: ['Flower Petals', 'Fruit Basket', 'Welcome Drink', 'Balinese Cake'],
    benefits: ['Private Villa', 'Spa Credit', 'Free Airport Transfer', 'Room Upgrade']
  })
];

export default HoneymoonExperience;
