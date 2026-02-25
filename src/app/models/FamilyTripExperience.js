// Family Trip Experience Model
export class FamilyTripExperience {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = 'family-trips';
    this.price = data.price || 0;
    this.duration = data.duration || '';
    this.location = data.location || '';
    this.image = data.image || '';
    this.rating = data.rating || 0;
    this.reviews = data.reviews || 0;
    this.discount = data.discount || 0;
    this.inclusions = data.inclusions || [];
    this.exclusions = data.exclusions || [];
    this.familyFeatures = data.familyFeatures || [];
    this.kidFriendlyActivities = data.kidFriendlyActivities || [];
    this.adultActivities = data.adultActivities || [];
    this.accommodationType = data.accommodationType || ''; // family resort, hotel, villa, camping
    this.mealPlan = data.mealPlan || '';
    this.transportation = data.transportation || {};
    this.ageGroups = data.ageGroups || { infants: false, toddlers: false, kids: true, teens: true, adults: true, seniors: true };
    this.groupSize = data.groupSize || { min: 2, max: 8 };
    this.safetyMeasures = data.safetyMeasures || [];
    this.kidFacilities = data.kidFacilities || [];
    this.entertainmentOptions = data.entertainmentOptions || [];
    this.educationalActivities = data.educationalActivities || [];
    this.bondingActivities = data.bondingActivities || [];
    this.weatherConsiderations = data.weatherConsiderations || [];
    this.packingTips = data.packingTips || [];
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
    
    if (!['family resort', 'hotel', 'villa', 'camping', 'heritage property'].includes(this.accommodationType)) {
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
      'family resort': 'text-green-600 bg-green-100',
      'hotel': 'text-blue-600 bg-blue-100',
      'villa': 'text-purple-600 bg-purple-100',
      'camping': 'text-orange-600 bg-orange-100',
      'heritage property': 'text-red-600 bg-red-100'
    };
    return colors[this.accommodationType] || colors['family resort'];
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

  // Get age groups text
  getAgeGroupsText() {
    const groups = [];
    if (this.ageGroups.infants) groups.push('Infants');
    if (this.ageGroups.toddlers) groups.push('Toddlers');
    if (this.ageGroups.kids) groups.push('Kids');
    if (this.ageGroups.teens) groups.push('Teens');
    if (this.ageGroups.adults) groups.push('Adults');
    if (this.ageGroups.seniors) groups.push('Seniors');
    return groups.join(', ');
  }

  // Get kid-friendly activities count
  getKidFriendlyActivitiesCount() {
    return this.kidFriendlyActivities.length;
  }

  // Get family features count
  getFamilyFeaturesCount() {
    return this.familyFeatures.length;
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
      familyFeatures: this.familyFeatures,
      kidFriendlyActivities: this.kidFriendlyActivities,
      adultActivities: this.adultActivities,
      accommodationType: this.accommodationType,
      mealPlan: this.mealPlan,
      transportation: this.transportation,
      ageGroups: this.ageGroups,
      groupSize: this.groupSize,
      safetyMeasures: this.safetyMeasures,
      kidFacilities: this.kidFacilities,
      entertainmentOptions: this.entertainmentOptions,
      educationalActivities: this.educationalActivities,
      bondingActivities: this.bondingActivities,
      weatherConsiderations: this.weatherConsiderations,
      packingTips: this.packingTips,
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
FamilyTripExperience.fromAPI = (apiData) => {
  return new FamilyTripExperience({
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
    familyFeatures: apiData.familyFeatures,
    kidFriendlyActivities: apiData.kidFriendlyActivities,
    adultActivities: apiData.adultActivities,
    accommodationType: apiData.accommodationType,
    mealPlan: apiData.mealPlan,
    transportation: apiData.transportation,
    ageGroups: apiData.ageGroups,
    groupSize: apiData.groupSize,
    safetyMeasures: apiData.safetyMeasures,
    kidFacilities: apiData.kidFacilities,
    entertainmentOptions: apiData.entertainmentOptions,
    educationalActivities: apiData.educationalActivities,
    bondingActivities: apiData.bondingActivities,
    weatherConsiderations: apiData.weatherConsiderations,
    packingTips: apiData.packingTips,
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

// Sample family trip experiences
export const sampleFamilyTripExperiences = [
  new FamilyTripExperience({
    id: 'fam-001',
    name: 'Goa Beach Family Fun',
    description: 'Perfect family beach vacation with water sports, cultural experiences, and kid-friendly activities in sunny Goa.',
    price: 45000,
    duration: '5 Days / 4 Nights',
    location: 'Goa',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 342,
    discount: 10,
    accommodationType: 'family resort',
    mealPlan: 'half board',
    ageGroups: { infants: false, toddlers: true, kids: true, teens: true, adults: true, seniors: true },
    inclusions: ['Family Room', 'Breakfast & Dinner', 'Airport Transfer', 'Kids Club', 'Pool Access'],
    exclusions: ['International Flights', 'Lunch', 'Personal Expenses'],
    familyFeatures: ['Kids Club', 'Family Rooms', 'Swimming Pool', 'Play Area', 'Babysitting Service'],
    kidFriendlyActivities: ['Beach Building', 'Swimming', 'Water Sports', 'Treasure Hunt', 'Craft Workshop'],
    adultActivities: ['Water Skiing', 'Parasailing', 'Beach Volleyball', 'Nightlife', 'Spa'],
    safetyMeasures: ['Lifeguard on Duty', 'First Aid Kit', '24/7 Security', 'Child Safety Gates'],
    kidFacilities: ['Kids Pool', 'Playground', 'Game Room', 'Kids Menu', 'Babysitting'],
    entertainmentOptions: ['Live Music', 'Cultural Shows', 'Magic Show', 'Movie Nights'],
    educationalActivities: ['Marine Life Education', 'Goan Culture Workshop', 'Nature Walk', 'Cooking Class'],
    bondingActivities: ['Family Beach Games', 'Bonfire Night', 'Photo Session', 'Group Activities'],
    bestSeason: 'October to March',
    specialOffers: ['Free Kids Stay', 'Complimentary Airport Transfer', 'Free Room Upgrade'],
    benefits: ['Kids Eat Free', 'Family Discounts', 'Flexible Cancellation', 'Free Activities']
  }),
  new FamilyTripExperience({
    id: 'fam-002',
    name: 'Jim Corbett Wildlife Safari',
    description: 'Exciting wildlife adventure in Jim Corbett National Park with jungle safaris and nature education.',
    price: 35000,
    duration: '4 Days / 3 Nights',
    location: 'Jim Corbett, Uttarakhand',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e2f6?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 256,
    accommodationType: 'heritage property',
    mealPlan: 'full board',
    ageGroups: { infants: false, toddlers: false, kids: true, teens: true, adults: true, seniors: true },
    inclusions: ['Family Cottage', 'All Meals', 'Jungle Safari', 'Nature Guide', 'Activities'],
    exclusions: ['International Flights', 'Personal Expenses', 'Tips'],
    familyFeatures: ['Family Cottages', 'Nature Programs', 'Wildlife Education', 'Guided Tours'],
    kidFriendlyActivities: ['Jungle Safari', 'Bird Watching', 'Nature Walk', 'Wildlife Photography', 'Educational Programs'],
    adultActivities: ['Jeep Safari', 'Elephant Safari', 'Nature Photography', 'Bird Watching'],
    safetyMeasures: ['Experienced Guides', 'First Aid', 'Emergency Evacuation', 'Safe Safari Vehicles'],
    kidFacilities: ['Kids Activity Center', 'Educational Materials', 'Nature Library', 'Safe Play Area'],
    entertainmentOptions: ['Wildlife Documentary', 'Campfire Stories', 'Nature Quiz', 'Photography Workshop'],
    educationalActivities: ['Wildlife Conservation', 'Nature Education', 'Bird Identification', 'Forest Ecology'],
    bondingActivities: ['Family Safari', 'Nature Walks', 'Photography Sessions', 'Campfire Nights'],
    bestSeason: 'November to June',
    specialOffers: ['Free Kids Safari', 'Complimentary Nature Guide', 'Free Photography Workshop'],
    benefits: ['Educational Experience', 'Wildlife Conservation', 'Family Bonding', 'Nature Learning']
  }),
  new FamilyTripExperience({
    id: 'fam-003',
    name: 'Rajasthan Heritage Family Tour',
    description: 'Royal Rajasthan experience with palaces, forts, cultural shows, and camel safaris for the whole family.',
    price: 55000,
    duration: '6 Days / 5 Nights',
    location: 'Jaipur, Udaipur, Jodhpur',
    image: 'https://images.unsplash.com/photo-1524492412937-8f3f5b4aff15?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 189,
    discount: 15,
    accommodationType: 'heritage property',
    mealPlan: 'breakfast only',
    ageGroups: { infants: true, toddlers: true, kids: true, teens: true, adults: true, seniors: true },
    inclusions: ['Heritage Hotel', 'Daily Breakfast', 'Sightseeing', 'Guide', 'Transportation'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    familyFeatures: ['Family Suites', 'Cultural Programs', 'Heritage Education', 'Guided Tours'],
    kidFriendlyActivities: ['Puppet Shows', 'Camel Safari', 'Fort Exploration', 'Craft Workshops', 'Traditional Games'],
    adultActivities: ['Palace Tours', 'Cultural Shows', 'Shopping', 'Photography', 'Fine Dining'],
    safetyMeasures: ['Child-Friendly Guides', 'First Aid', 'Safe Transportation', '24/7 Support'],
    kidFacilities: ['Kids Activity Areas', 'Educational Materials', 'Cultural Workshops', 'Safe Play Zones'],
    entertainmentOptions: ['Cultural Shows', 'Puppet Shows', 'Folk Dances', 'Magic Shows'],
    educationalActivities: ['History Education', 'Cultural Workshops', 'Art Classes', 'Architecture Tours'],
    bondingActivities: ['Family Fort Tours', 'Cultural Experiences', 'Photography Sessions', 'Traditional Activities'],
    bestSeason: 'October to March',
    specialOffers: ['Free Kids Activities', 'Complimentary Cultural Shows', 'Free Camel Safari for Kids'],
    benefits: ['Cultural Education', 'Historical Learning', 'Family Experiences', 'Royal Treatment']
  }),
  new FamilyTripExperience({
    id: 'fam-004',
    name: 'Andaman Islands Family Adventure',
    description: 'Tropical paradise experience with beaches, water sports, and marine life education in the Andaman Islands.',
    price: 75000,
    duration: '7 Days / 6 Nights',
    location: 'Port Blair, Havelock Island',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 428,
    accommodationType: 'hotel',
    mealPlan: 'breakfast only',
    ageGroups: { infants: false, toddlers: true, kids: true, teens: true, adults: true, seniors: true },
    inclusions: ['Beach Resort', 'Daily Breakfast', 'Island Hopping', 'Water Sports', 'Snorkeling'],
    exclusions: ['International Flights', 'Lunch & Dinner', 'Personal Expenses'],
    familyFeatures: ['Beach Access', 'Water Sports', 'Marine Education', 'Island Tours'],
    kidFriendlyActivities: ['Beach Building', 'Swimming', 'Snorkeling', 'Glass Bottom Boat', 'Marine Life Education'],
    adultActivities: ['Scuba Diving', 'Jet Ski', 'Banana Boat', 'Parasailing', 'Beach Relaxation'],
    safetyMeasures: ['Life Jackets', 'Professional Instructors', 'First Aid', 'Rescue Team'],
    kidFacilities: ['Kids Pool', 'Play Area', 'Marine Education Center', 'Safe Swimming Areas'],
    entertainmentOptions: ['Beach Games', 'Cultural Shows', 'Movie Nights', 'Music Entertainment'],
    educationalActivities: ['Marine Biology', 'Island Ecology', 'Conservation Education', 'Ocean Awareness'],
    bondingActivities: ['Family Beach Time', 'Island Exploration', 'Water Sports', 'Marine Life Watching'],
    bestSeason: 'November to May',
    specialOffers: ['Free Kids Water Sports', 'Complimentary Marine Education', 'Free Island Tours'],
    benefits: ['Beach Paradise', 'Marine Education', 'Water Activities', 'Family Bonding']
  })
];

export default FamilyTripExperience;
