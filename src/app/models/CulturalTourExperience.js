// Cultural Tour Experience Model
export class CulturalTourExperience {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = 'cultural-tours';
    this.price = data.price || 0;
    this.duration = data.duration || '';
    this.location = data.location || '';
    this.image = data.image || '';
    this.rating = data.rating || 0;
    this.reviews = data.reviews || 0;
    this.discount = data.discount || 0;
    this.inclusions = data.inclusions || [];
    this.exclusions = data.exclusions || [];
    this.cultureType = data.cultureType || ''; // religious, historical, artistic, traditional, tribal, urban
    this.heritageSites = data.heritageSites || [];
    this.monuments = data.monuments || [];
    this.museums = data.museums || [];
    this.temples = data.temples || [];
    this.festivals = data.festivals || [];
    this.artForms = data.artForms || [];
    this.crafts = data.crafts || [];
    this.cuisine = data.cuisine || [];
    this.traditionalDress = data.traditionalDress || [];
    this.languages = data.languages || [];
    this.religions = data.religions || [];
    this.architecturalStyles = data.architecturalStyles || [];
    this.historicalPeriods = data.historicalPeriods || [];
    this.culturalActivities = data.culturalActivities || [];
    this.interactiveExperiences = data.interactiveExperiences || [];
    this.performingArts = data.performingArts || [];
    this.workshops = data.workshops || [];
    this.localInteractions = data.localInteractions || [];
    this.photographyOpportunities = data.photographyOpportunities || [];
    this.shopping = data.shopping || [];
    this.accommodationType = data.accommodationType || ''; // heritage hotel, boutique hotel, homestay, guesthouse
    this.mealPlan = data.mealPlan || '';
    this.transportation = data.transportation || {};
    this.groupSize = data.groupSize || { min: 2, max: 15 };
    this.difficulty = data.difficulty || 'easy'; // easy, moderate, hard
    this.physicalActivity = data.physicalActivity || 'low'; // low, medium, high
    this.culturalDepth = data.culturalDepth || 'medium'; // basic, medium, deep
    this.bestSeason = data.bestSeason || '';
    this.climate = data.climate || '';
    this.dressCode = data.dressCode || [];
    this.etiquette = data.etiquette || [];
    this.localCustoms = data.localCustoms || [];
    this.learningOpportunities = data.learningOpportunities || [];
    this.spiritualElements = data.spiritualElements || [];
    this.storytelling = data.storytelling || [];
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
    
    if (this.price <= 0) {
      errors.push('Price must be greater than 0');
    }
    
    if (!this.duration.trim()) {
      errors.push('Duration is required');
    }
    
    if (!['religious', 'historical', 'artistic', 'traditional', 'tribal', 'urban'].includes(this.cultureType)) {
      errors.push('Invalid culture type');
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

  // Get culture type color
  getCultureTypeColor() {
    const colors = {
      'religious': 'text-orange-600 bg-orange-100',
      'historical': 'text-blue-600 bg-blue-100',
      'artistic': 'text-purple-600 bg-purple-100',
      'traditional': 'text-green-600 bg-green-100',
      'tribal': 'text-red-600 bg-red-100',
      'urban': 'text-cyan-600 bg-cyan-100'
    };
    return colors[this.cultureType] || colors.historical;
  }

  // Get difficulty color
  getDifficultyColor() {
    const colors = {
      'easy': 'text-green-600 bg-green-100',
      'moderate': 'text-yellow-600 bg-yellow-100',
      'hard': 'text-red-600 bg-red-100'
    };
    return colors[this.difficulty] || colors.easy;
  }

  // Get cultural depth color
  getCulturalDepthColor() {
    const colors = {
      'basic': 'text-blue-600 bg-blue-100',
      'medium': 'text-purple-600 bg-purple-100',
      'deep': 'text-red-600 bg-red-100'
    };
    return colors[this.culturalDepth] || colors.medium;
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

  // Get heritage sites count
  getHeritageSitesCount() {
    return this.heritageSites.length;
  }

  // Get cultural activities count
  getCulturalActivitiesCount() {
    return this.culturalActivities.length;
  }

  // Get workshops count
  getWorkshopsCount() {
    return this.workshops.length;
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
      cultureType: this.cultureType,
      heritageSites: this.heritageSites,
      monuments: this.monuments,
      museums: this.museums,
      temples: this.temples,
      festivals: this.festivals,
      artForms: this.artForms,
      crafts: this.crafts,
      cuisine: this.cuisine,
      traditionalDress: this.traditionalDress,
      languages: this.languages,
      religions: this.religions,
      architecturalStyles: this.architecturalStyles,
      historicalPeriods: this.historicalPeriods,
      culturalActivities: this.culturalActivities,
      interactiveExperiences: this.interactiveExperiences,
      performingArts: this.performingArts,
      workshops: this.workshops,
      localInteractions: this.localInteractions,
      photographyOpportunities: this.photographyOpportunities,
      shopping: this.shopping,
      accommodationType: this.accommodationType,
      mealPlan: this.mealPlan,
      transportation: this.transportation,
      groupSize: this.groupSize,
      difficulty: this.difficulty,
      physicalActivity: this.physicalActivity,
      culturalDepth: this.culturalDepth,
      bestSeason: this.bestSeason,
      climate: this.climate,
      dressCode: this.dressCode,
      etiquette: this.etiquette,
      localCustoms: this.localCustoms,
      learningOpportunities: this.learningOpportunities,
      spiritualElements: this.spiritualElements,
      storytelling: this.storytelling,
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
CulturalTourExperience.fromAPI = (apiData) => {
  return new CulturalTourExperience({
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
    cultureType: apiData.cultureType,
    heritageSites: apiData.heritageSites,
    monuments: apiData.monuments,
    museums: apiData.museums,
    temples: apiData.temples,
    festivals: apiData.festivals,
    artForms: apiData.artForms,
    crafts: apiData.crafts,
    cuisine: apiData.cuisine,
    traditionalDress: apiData.traditionalDress,
    languages: apiData.languages,
    religions: apiData.religions,
    architecturalStyles: apiData.architecturalStyles,
    historicalPeriods: apiData.historicalPeriods,
    culturalActivities: apiData.culturalActivities,
    interactiveExperiences: apiData.interactiveExperiences,
    performingArts: apiData.performingArts,
    workshops: apiData.workshops,
    localInteractions: apiData.localInteractions,
    photographyOpportunities: apiData.photographyOpportunities,
    shopping: apiData.shopping,
    accommodationType: apiData.accommodationType,
    mealPlan: apiData.mealPlan,
    transportation: apiData.transportation,
    groupSize: apiData.groupSize,
    difficulty: apiData.difficulty,
    physicalActivity: apiData.physicalActivity,
    culturalDepth: apiData.culturalDepth,
    bestSeason: apiData.bestSeason,
    climate: apiData.climate,
    dressCode: apiData.dressCode,
    etiquette: apiData.etiquette,
    localCustoms: apiData.localCustoms,
    learningOpportunities: apiData.learningOpportunities,
    spiritualElements: apiData.spiritualElements,
    storytelling: apiData.storytelling,
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

// Sample cultural tour experiences
export const sampleCulturalTourExperiences = [
  new CulturalTourExperience({
    id: 'cul-001',
    name: 'Golden Temple & Sikh Heritage',
    description: 'Experience the spiritual and cultural richness of Sikhism with visits to the Golden Temple and other important Sikh heritage sites.',
    price: 8500,
    duration: '3 Days / 2 Nights',
    location: 'Amritsar, Punjab',
    image: 'https://images.unsplash.com/photo-1580637778322-4d5b5c6c5a5a?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 456,
    discount: 10,
    cultureType: 'religious',
    accommodationType: 'heritage hotel',
    mealPlan: 'all inclusive',
    difficulty: 'easy',
    physicalActivity: 'medium',
    culturalDepth: 'deep',
    inclusions: ['Heritage Hotel', 'All Meals', 'Temple Visits', 'Guide', 'Transportation'],
    exclusions: ['International Flights', 'Personal Expenses', 'Shopping'],
    heritageSites: ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border'],
    temples: ['Golden Temple', 'Durgiana Temple'],
    festivals: ['Baisakhi', 'Guru Purab', 'Diwali'],
    artForms: ['Gurbani Music', 'Phulkari Embroidery', 'Sikh Martial Arts'],
    cuisine: ['Langar Food', 'Punjabi Thali', 'Amritsari Kulcha', 'Lassi'],
    traditionalDress: ['Turban', 'Kurta Pajama', 'Phulkari Dupatta'],
    languages: ['Punjabi', 'Hindi', 'English'],
    religions: ['Sikhism', 'Hinduism'],
    culturalActivities: ['Langar Service', 'Temple Ceremony', 'Community Kitchen'],
    interactiveExperiences: ['Langar Seva', 'Turban Tying', 'Gurbani Kirtan'],
    performingArts: ['Gatka', 'Bhangra', 'Giddha', 'Kirtan'],
    workshops: ['Cooking Class', 'Turbans Tying', 'Phulkari Embroidery'],
    localInteractions: ['Local Families', 'Temple Volunteers', 'Community Leaders'],
    photographyOpportunities: ['Golden Temple', 'Wagah Border', 'Local Markets'],
    shopping: ['Phulkari Items', 'Sikh Religious Items', 'Punjabi Sweets'],
    bestSeason: 'October to March',
    climate: 'Continental',
    dressCode: ['Modest Clothing', 'Head Covering for Temple'],
    etiquette: ['Remove Shoes', 'Cover Head', 'Respectful Behavior'],
    benefits: ['Spiritual Experience', 'Community Service', 'Cultural Learning', 'Free Meals']
  }),
  new CulturalTourExperience({
    id: 'cul-002',
    name: 'Varanasi Spiritual Journey',
    description: 'Immerse yourself in the ancient spiritual traditions of Varanasi, one of the oldest living cities in the world.',
    price: 12000,
    duration: '4 Days / 3 Nights',
    location: 'Varanasi, Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 324,
    cultureType: 'religious',
    accommodationType: 'heritage hotel',
    mealPlan: 'breakfast only',
    difficulty: 'moderate',
    physicalActivity: 'medium',
    culturalDepth: 'deep',
    inclusions: ['Heritage Hotel', 'Daily Breakfast', 'Ghats Tour', 'Boat Ride', 'Guide'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    heritageSites: ['Kashi Vishwanath Temple', 'Sarnath', 'Ramnagar Fort'],
    temples: ['Kashi Vishwanath', 'Durga Temple', 'Tulsi Manas Temple'],
    festivals: ['Dev Diwali', 'Mahashivratri', 'Ganga Dussehra'],
    artForms: ['Classical Music', 'Banarasi Sarees', 'Classical Dance'],
    cuisine: ['Banarasi Chaat', 'Kachori', 'Thandai', 'Malaiyo'],
    traditionalDress: ['Saree', 'Dhoti', 'Kurta', 'Turban'],
    languages: ['Hindi', 'Bhojpuri', 'English'],
    religions: ['Hinduism', 'Buddhism', 'Jainism'],
    architecturalStyles: ['Nagara', 'Indo-Saracenic', 'Mughal'],
    culturalActivities: ['Ganga Aarti', 'Temple Rituals', 'Boat Ceremony'],
    interactiveExperiences: ['Ganga Aarti Participation', 'Temple Rituals', 'Sari Weaving'],
    performingArts: ['Classical Dance', 'Music Concerts', 'Theater'],
    workshops: ['Saree Weaving', 'Cooking Class', 'Music Lessons'],
    localInteractions: ['Pandas', 'Artisans', 'Temple Priests', 'Local Families'],
    photographyOpportunities: ['Ghats', 'Temples', 'Street Life', 'Sunrise Boat'],
    shopping: ['Banarasi Sarees', 'Brass Items', 'Religious Items', 'Local Crafts'],
    bestSeason: 'October to March',
    climate: 'Humid Subtropical',
    dressCode: ['Modest Clothing', 'Traditional Wear Preferred'],
    etiquette: ['Respect Religious Practices', 'No Photography During Rituals'],
    benefits: ['Spiritual Awakening', 'Ancient Wisdom', 'Cultural Immersion', 'Life-Changing Experience']
  }),
  new CulturalTourExperience({
    id: 'cul-003',
    name: 'Rajasthan Royal Heritage',
    description: 'Explore the royal heritage of Rajasthan with magnificent palaces, forts, and rich Rajasthani culture.',
    price: 18000,
    duration: '5 Days / 4 Nights',
    location: 'Jaipur, Udaipur, Jodhpur',
    image: 'https://images.unsplash.com/photo-1524492412937-8f3f5b4aff15?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 289,
    discount: 15,
    cultureType: 'historical',
    accommodationType: 'heritage hotel',
    mealPlan: 'breakfast only',
    difficulty: 'moderate',
    physicalActivity: 'medium',
    culturalDepth: 'medium',
    inclusions: ['Heritage Hotels', 'Daily Breakfast', 'Palace Tours', 'Guide', 'Transportation'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    heritageSites: ['Amber Fort', 'City Palace', 'Mehrangarh Fort', 'Udaipur City Palace'],
    monuments: ['Hawa Mahal', 'Jantar Mantar', 'Lake Palace', 'Jaswant Thada'],
    museums: ['City Palace Museum', 'Mehrangarh Museum', 'Udaipur Museum'],
    festivals: ['Pushkar Fair', 'Desert Festival', 'Marwar Festival'],
    artForms: ['Miniature Paintings', 'Blue Pottery', 'Rajasthani Music'],
    cuisine: ['Dal Baati Churma', 'Laal Maas', 'Ghevar', 'Kachori'],
    traditionalDress: ['Bandhani', 'Lehenga', 'Chola', 'Pagri'],
    languages: ['Rajasthani', 'Hindi', 'English'],
    architecturalStyles: ['Rajputana', 'Mughal', 'Colonial'],
    historicalPeriods: ['Medieval', 'Mughal Era', 'British Raj'],
    culturalActivities: ['Palace Tours', 'Folk Performances', 'Camel Safari'],
    interactiveExperiences: ['Puppet Shows', 'Folk Dance', 'Cooking Demonstration'],
    performingArts: ['Ghoomar', 'Kalbelia', 'Puppet Shows', 'Folk Music'],
    workshops: ['Miniature Painting', 'Blue Pottery', 'Block Printing'],
    localInteractions: ['Royal Families', 'Artisans', 'Folk Artists', 'Local Guides'],
    photographyOpportunities: ['Palaces', 'Forts', 'Desert Landscapes', 'Local Markets'],
    shopping: ['Jewelry', 'Textiles', 'Blue Pottery', 'Miniature Paintings'],
    bestSeason: 'October to March',
    climate: 'Desert',
    dressCode: ['Comfortable Clothing', 'Traditional Wear for Events'],
    etiquette: ['Respect Royal Traditions', 'Photography Rules in Palaces'],
    benefits: ['Royal Experience', 'Historical Learning', 'Rich Culture', 'Architectural Marvels']
  }),
  new CulturalTourExperience({
    id: 'cul-004',
    name: 'South Indian Temple Trail',
    description: 'Discover the magnificent temple architecture and spiritual traditions of South India across multiple states.',
    price: 22000,
    duration: '7 Days / 6 Nights',
    location: 'Tamil Nadu, Karnataka, Kerala',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 198,
    cultureType: 'religious',
    accommodationType: 'guesthouse',
    mealPlan: 'breakfast only',
    difficulty: 'hard',
    physicalActivity: 'high',
    culturalDepth: 'deep',
    inclusions: ['Guesthouses', 'Daily Breakfast', 'Temple Tours', 'Guide', 'Transportation'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    heritageSites: ['Brihadeeswarar Temple', 'Meenakshi Temple', 'Guruvayur Temple'],
    temples: ['Madurai Meenakshi', 'Rameshwaram', 'Tirupati', 'Guruvayur'],
    festivals: ['Pongal', 'Onam', 'Thrissur Pooram', 'Karva Chauth'],
    artForms: ['Bharatanatyam', 'Carnatic Music', 'Kalaripayattu', 'Kathakali'],
    cuisine: ['South Indian Thali', 'Dosa', 'Idli', 'Sambar', 'Coconut Curry'],
    traditionalDress: ['Saree', 'Dhoti', 'Mundu', 'Veshti'],
    languages: ['Tamil', 'Telugu', 'Malayalam', 'Kannada', 'English'],
    religions: ['Hinduism', 'Christianity', 'Islam', 'Jainism'],
    architecturalStyles: ['Dravidian', 'Vijayanagara', 'Chola', 'Chera'],
    culturalActivities: ['Temple Rituals', 'Classical Dance', 'Music Concerts'],
    interactiveExperiences: ['Temple Ceremonies', 'Dance Classes', 'Cooking Classes'],
    performingArts: ['Bharatanatyam', 'Kathakali', 'Mohiniyattam', 'Kuchipudi'],
    workshops: ['Classical Dance', 'Music', 'Cooking', 'Yoga'],
    localInteractions: ['Temple Priests', 'Classical Dancers', 'Musicians', 'Local Families'],
    photographyOpportunities: ['Temple Architecture', 'Classical Dance', 'Temple Rituals', 'Local Life'],
    shopping: ['Silk Sarees', 'Bronze Idols', 'Spices', 'Traditional Jewelry'],
    bestSeason: 'November to February',
    climate: 'Tropical',
    dressCode: ['Modest Clothing', 'Traditional Wear for Temples'],
    etiquette: ['Temple Protocol', 'Respect Religious Customs'],
    benefits: ['Spiritual Experience', 'Classical Arts', 'Architectural Marvels', 'Cultural Diversity']
  })
];

export default CulturalTourExperience;
