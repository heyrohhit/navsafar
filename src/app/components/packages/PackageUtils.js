// Package utility functions for shared use across components


// Get icon based on package category
export const getPackageIcon = (category) => {
  const icons = {
    'domestic': '🇮🇳',
    'international': '✈️',
    'religious': '🕉️',
    'adventure': '🏔️',
    'family': '👨‍👩‍👧‍👦',
    'luxury': '💎',
    'honeymoon': '💕',
    'wildlife': '🦁',
    'cultural': '🏛️',
    'beach': '🏖️',
    'hill': '⛰️',
    'default': '🎒'
  };
  
  return icons[category] || icons.default;
};

// Handle WhatsApp query generation
export const handleGetQuery = (packageName, price, duration) => {
  const message = `Hi! I'm interested in the ${packageName} package.\n\nDetails:\n• Package: ${packageName}\n• Price: ₹${price}\n• Duration: ${duration}\n\nPlease provide more information about this package. Thank you!`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/918700750589?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

// Format price with Indian currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Get rating stars HTML
export const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '⭐';
  }
  
  // Half star
  if (hasHalfStar) {
    stars += '⭐';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }
  
  return stars;
};

// Get package badge based on features
export const getPackageBadge = (packageData) => {
  if (packageData.isPopular) {
    return { text: 'Popular', class: 'bg-red-500 text-white' };
  }
  if (packageData.isFeatured) {
    return { text: 'Featured', class: 'bg-blue-500 text-white' };
  }
  if (packageData.discount > 0) {
    return { text: `${packageData.discount}% OFF`, class: 'bg-green-500 text-white' };
  }
  return null;
};

// Format duration for display
export const formatDuration = (duration) => {
  if (duration.includes('Nights')) {
    return duration;
  }
  
  const nights = parseInt(duration);
  if (nights === 1) {
    return '1 Night / 2 Days';
  }
  return `${nights} Nights / ${nights + 1} Days`;
};

// Get package highlights
export const getPackageHighlights = (packageData) => {
  const highlights = [];
  
  if (packageData.includes) {
    highlights.push(...packageData.includes);
  }
  
  if (packageData.activities) {
    highlights.push(...packageData.activities.slice(0, 3));
  }
  
  return highlights.slice(0, 4); // Return max 4 highlights
};

// Validate package data
export const validatePackage = (packageData) => {
  const errors = [];
  
  if (!packageData.name || packageData.name.trim() === '') {
    errors.push('Package name is required');
  }
  
  if (!packageData.price || packageData.price <= 0) {
    errors.push('Valid price is required');
  }
  
  if (!packageData.duration || packageData.duration.trim() === '') {
    errors.push('Duration is required');
  }
  
  if (!packageData.category || packageData.category.trim() === '') {
    errors.push('Category is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get search-friendly text
export const getSearchText = (packageData) => {
  const searchableText = [
    packageData.name,
    packageData.category,
    packageData.destination,
    ...(packageData.includes || []),
    ...(packageData.activities || [])
  ].join(' ').toLowerCase();
  
  return searchableText;
};

export default {
  getPackageIcon,
  handleGetQuery,
  formatPrice,
  getRatingStars,
  getPackageBadge,
  formatDuration,
  getPackageHighlights,
  validatePackage,
  getSearchText
};
