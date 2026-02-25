// Weekend Getaway Experience Model
export class WeekendGetawayExperience {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = 'weekend-getaways';
    this.price = data.price || 0;
    this.duration = data.duration || '';
    this.location = data.location || '';
    this.image = data.image || '';
    this.rating = data.rating || 0;
    this.reviews = data.reviews || 0;
    this.discount = data.discount || 0;
    this.inclusions = data.inclusions || [];
    this.exclusions = data.exclusions || [];
    this.getawayType = data.getawayType || ''; // beach, mountain, city, heritage, nature, adventure
    this.travelTime = data.travelTime || ''; // short, medium, long
    this.accessibility = data.accessibility || ''; // easy, moderate, difficult
    this.bestSeason = data.bestSeason || '';
    this.climate = data.climate || '';
    this.activities = data.activities || [];
    this.relaxationSpots = data.relaxationSpots || [];
    this.sightseeing = data.sightseeing || [];
    this.foodSpecialties = data.foodSpecialties || [];
    this.shopping = data.shopping || [];
    this.nightlife = data.nightlife || [];
    this.photographySpots = data.photographySpots || [];
    this.familyFriendly = data.familyFriendly || false;
    this.coupleFriendly = data.coupleFriendly || false;
    this.soloFriendly = data.soloFriendly || false;
    this.groupFriendly = data.groupFriendly || false;
    this.accommodationType = data.accommodationType || ''; // hotel, resort, homestay, camping, villa
    this.mealPlan = data.mealPlan || '';
    this.transportation = data.transportation || {};
    this.budgetLevel = data.budgetLevel || ''; // budget, moderate, premium, luxury
    this.packages = data.packages || [];
    this.specialOffers = data.specialOffers || [];
    this.facilities = data.facilities || [];
    this.nearbyAttractions = data.nearbyAttractions || [];
    this.localExperiences = data.localExperiences || [];
    this.adventureLevel = data.adventureLevel || 'low'; // low, medium, high
    this.relaxationLevel = data.relaxationLevel || 'high'; // low, medium, high
    this.culturalLevel = data.culturalLevel || 'medium'; // low, medium, high
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
    
    if (!['beach', 'mountain', 'city', 'heritage', 'nature', 'adventure'].includes(this.getawayType)) {
      errors.push('Invalid getaway type');
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

  // Get getaway type color
  getGetawayTypeColor() {
    const colors = {
      'beach': 'text-blue-600 bg-blue-100',
      'mountain': 'text-green-600 bg-green-100',
      'city': 'text-purple-600 bg-purple-100',
      'heritage': 'text-orange-600 bg-orange-100',
      'nature': 'text-teal-600 bg-teal-100',
      'adventure': 'text-red-600 bg-red-100'
    };
    return colors[this.getawayType] || colors.beach;
  }

  // Get budget level color
  getBudgetLevelColor() {
    const colors = {
      'budget': 'text-green-600 bg-green-100',
      'moderate': 'text-yellow-600 bg-yellow-100',
      'premium': 'text-orange-600 bg-orange-100',
      'luxury': 'text-purple-600 bg-purple-100'
    };
    return colors[this.budgetLevel] || colors.moderate;
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

  // Get travel time text
  getTravelTimeText() {
    const times = {
      'short': 'Under 2 hours',
      'medium': '2-4 hours',
      'long': '4+ hours'
    };
    return times[this.travelTime] || times.medium;
  }

  // Get accessibility text
  getAccessibilityText() {
    const access = {
      'easy': 'Easily Accessible',
      'moderate': 'Moderately Accessible',
      'difficult': 'Requires Effort'
    };
    return access[this.accessibility] || access.moderate;
  }

  // Get target audience
  getTargetAudience() {
    const audience = [];
    if (this.familyFriendly) audience.push('Family');
    if (this.coupleFriendly) audience.push('Couples');
    if (this.soloFriendly) audience.push('Solo');
    if (this.groupFriendly) audience.push('Groups');
    return audience.join(', ');
  }

  // Get activities count
  getActivitiesCount() {
    return this.activities.length;
  }

  // Get relaxation spots count
  getRelaxationSpotsCount() {
    return this.relaxationSpots.length;
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
      getawayType: this.getawayType,
      travelTime: this.travelTime,
      accessibility: this.accessibility,
      bestSeason: this.bestSeason,
      climate: this.climate,
      activities: this.activities,
      relaxationSpots: this.relaxationSpots,
      sightseeing: this.sightseeing,
      foodSpecialties: this.foodSpecialties,
      shopping: this.shopping,
      nightlife: this.nightlife,
      photographySpots: this.photographySpots,
      familyFriendly: this.familyFriendly,
      coupleFriendly: this.coupleFriendly,
      soloFriendly: this.soloFriendly,
      groupFriendly: this.groupFriendly,
      accommodationType: this.accommodationType,
      mealPlan: this.mealPlan,
      transportation: this.transportation,
      budgetLevel: this.budgetLevel,
      packages: this.packages,
      specialOffers: this.specialOffers,
      facilities: this.facilities,
      nearbyAttractions: this.nearbyAttractions,
      localExperiences: this.localExperiences,
      adventureLevel: this.adventureLevel,
      relaxationLevel: this.relaxationLevel,
      culturalLevel: this.culturalLevel,
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
WeekendGetawayExperience.fromAPI = (apiData) => {
  return new WeekendGetawayExperience({
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
    getawayType: apiData.getawayType,
    travelTime: apiData.travelTime,
    accessibility: apiData.accessibility,
    bestSeason: apiData.bestSeason,
    climate: apiData.climate,
    activities: apiData.activities,
    relaxationSpots: apiData.relaxationSpots,
    sightseeing: apiData.sightseeing,
    foodSpecialties: apiData.foodSpecialties,
    shopping: apiData.shopping,
    nightlife: apiData.nightlife,
    photographySpots: apiData.photographySpots,
    familyFriendly: apiData.familyFriendly,
    coupleFriendly: apiData.coupleFriendly,
    soloFriendly: apiData.soloFriendly,
    groupFriendly: apiData.groupFriendly,
    accommodationType: apiData.accommodationType,
    mealPlan: apiData.mealPlan,
    transportation: apiData.transportation,
    budgetLevel: apiData.budgetLevel,
    packages: apiData.packages,
    specialOffers: apiData.specialOffers,
    facilities: apiData.facilities,
    nearbyAttractions: apiData.nearbyAttractions,
    localExperiences: apiData.localExperiences,
    adventureLevel: apiData.adventureLevel,
    relaxationLevel: apiData.relaxationLevel,
    culturalLevel: apiData.culturalLevel,
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

// Sample weekend getaway experiences
export const sampleWeekendGetawayExperiences = [
  new WeekendGetawayExperience({
    id: 'wek-001',
    name: 'Goa Beach Weekend',
    description: 'Perfect beach getaway with sun, sand, and sea. Relax on pristine beaches and enjoy vibrant nightlife.',
    price: 12000,
    duration: '2 Days / 1 Night',
    location: 'Goa',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 234,
    discount: 10,
    getawayType: 'beach',
    travelTime: 'short',
    accessibility: 'easy',
    budgetLevel: 'moderate',
    familyFriendly: true,
    coupleFriendly: true,
    soloFriendly: true,
    groupFriendly: true,
    accommodationType: 'resort',
    mealPlan: 'breakfast only',
    inclusions: ['Beach Resort', 'Daily Breakfast', 'Beach Access', 'Pool Access'],
    exclusions: ['Transportation', 'Lunch & Dinner', 'Water Sports'],
    activities: ['Beach Volleyball', 'Swimming', 'Sunbathing', 'Beach Walk'],
    relaxationSpots: ['Beach Shacks', 'Pool Area', 'Sunset Points', 'Beach Cafes'],
    sightseeing: ['Baga Beach', 'Anjuna Beach', 'Old Goa Churches', 'Dona Paula'],
    foodSpecialties: ['Goan Fish Curry', 'Vindaloo', 'Bebinca', 'Seafood'],
    nightlife: ['Beach Parties', 'Clubs', 'Casinos', 'Live Music'],
    photographySpots: ['Sunset Points', 'Beach Landscapes', 'Church Architecture', 'Local Markets'],
    bestSeason: 'November to March',
    climate: 'Tropical',
    adventureLevel: 'low',
    relaxationLevel: 'high',
    culturalLevel: 'medium',
    benefits: ['Quick Getaway', 'Beach Paradise', 'Nightlife', 'Affordable']
  }),
  new WeekendGetawayExperience({
    id: 'wek-002',
    name: 'Lonavala Hill Station Retreat',
    description: 'Escape to the lush green hills of Lonavala for a refreshing weekend amidst nature and misty mountains.',
    price: 8500,
    duration: '2 Days / 1 Night',
    location: 'Lonavala, Maharashtra',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e2f6?w=600&h=400&fit=crop',
    rating: 4.5,
    reviews: 189,
    getawayType: 'mountain',
    travelTime: 'short',
    accessibility: 'easy',
    budgetLevel: 'budget',
    familyFriendly: true,
    coupleFriendly: true,
    soloFriendly: true,
    groupFriendly: true,
    accommodationType: 'hotel',
    mealPlan: 'breakfast only',
    inclusions: ['Hill Station Hotel', 'Daily Breakfast', 'Mountain View', 'Garden Access'],
    exclusions: ['Transportation', 'Lunch & Dinner', 'Adventure Activities'],
    activities: ['Trekking', 'Nature Walk', 'Photography', 'Sightseeing'],
    relaxationSpots: ['View Points', 'Gardens', 'Cafes', 'Hotel Terrace'],
    sightseeing: ['Rajmachi Fort', 'Tiger Point', 'Bhushi Dam', 'Lonavala Lake'],
    foodSpecialties: ['Chikki', 'Fudge', 'Local Maharashtrian Food', 'Tea'],
    nightlife: ['Hotel Restaurants', 'Local Cafes', 'Bonfire', 'Music'],
    photographySpots: ['Sunset Points', 'Mountain Views', 'Forts', 'Lakes'],
    bestSeason: 'June to October',
    climate: 'Highland',
    adventureLevel: 'medium',
    relaxationLevel: 'high',
    culturalLevel: 'low',
    benefits: ['Quick Escape', 'Nature Therapy', 'Weather Relief', 'Budget Friendly']
  }),
  new WeekendGetawayExperience({
    id: 'wek-003',
    name: 'Jaipur Heritage Weekend',
    description: 'Experience the royal heritage of Pink City with palaces, forts, and rich Rajasthani culture.',
    price: 15000,
    duration: '2 Days / 1 Night',
    location: 'Jaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1524492412937-8f3f5b4aff15?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 312,
    discount: 15,
    getawayType: 'heritage',
    travelTime: 'medium',
    accessibility: 'easy',
    budgetLevel: 'moderate',
    familyFriendly: true,
    coupleFriendly: true,
    soloFriendly: true,
    groupFriendly: true,
    accommodationType: 'hotel',
    mealPlan: 'breakfast only',
    inclusions: ['Heritage Hotel', 'Daily Breakfast', 'City Tour', 'Guide'],
    exclusions: ['Transportation', 'Lunch & Dinner', 'Shopping'],
    activities: ['Palace Tours', 'Fort Visits', 'Cultural Shows', 'Shopping'],
    relaxationSpots: ['Palace Gardens', 'Rooftop Restaurants', 'Spa', 'Cafes'],
    sightseeing: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'],
    foodSpecialties: ['Dal Baati Churma', 'Laal Maas', 'Ghewar', 'Kachori'],
    nightlife: ['Rooftop Dining', 'Cultural Shows', 'Local Markets', 'Music'],
    photographySpots: ['Palace Architecture', 'Fort Views', 'Local Markets', 'Street Art'],
    bestSeason: 'October to March',
    climate: 'Desert',
    adventureLevel: 'low',
    relaxationLevel: 'medium',
    culturalLevel: 'high',
    benefits: ['Rich Culture', 'Historical Learning', 'Shopping Paradise', 'Royal Experience']
  }),
  new WeekendGetawayExperience({
    id: 'wek-004',
    name: 'Munnar Tea Gardens Escape',
    description: 'Get lost in the mesmerizing tea gardens and misty mountains of Munnar for a peaceful weekend retreat.',
    price: 11000,
    duration: '2 Days / 1 Night',
    location: 'Munnar, Kerala',
    image: 'https://images.unsplash.com/photo-1540206395-636089a77e2f?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 267,
    getawayType: 'nature',
    travelTime: 'medium',
    accessibility: 'moderate',
    budgetLevel: 'moderate',
    familyFriendly: true,
    coupleFriendly: true,
    soloFriendly: true,
    groupFriendly: true,
    accommodationType: 'resort',
    mealPlan: 'breakfast only',
    inclusions: ['Hill Resort', 'Daily Breakfast', 'Tea Garden Visit', 'Spa Access'],
    exclusions: ['Transportation', 'Lunch & Dinner', 'Adventure Activities'],
    activities: ['Tea Garden Tour', 'Nature Walk', 'Photography', 'Spa Treatment'],
    relaxationSpots: ['Tea Gardens', 'View Points', 'Spa', 'Resort Gardens'],
    sightseeing: ['Eravikulam Park', 'Mattupetty Dam', 'Top Station', 'Echo Point'],
    foodSpecialties: ['Kerala Cuisine', 'Tea', 'Local Snacks', 'Seafood'],
    nightlife: ['Resort Restaurants', 'Local Cafes', 'Bonfire', 'Music'],
    photographySpots: ['Tea Gardens', 'Mountain Views', 'Waterfalls', 'Sunset Points'],
    bestSeason: 'September to May',
    climate: 'Highland',
    adventureLevel: 'low',
    relaxationLevel: 'high',
    culturalLevel: 'medium',
    benefits: ['Nature Therapy', 'Peaceful Environment', 'Tea Experience', 'Cool Weather']
  })
];

export default WeekendGetawayExperience;
