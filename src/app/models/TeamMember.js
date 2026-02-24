// Team Member Model
export class TeamMember {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.role = data.role || '';
    this.image = data.image || '';
    this.description = data.description || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.experience = data.experience || '';
    this.specialization = data.specialization || '';
    this.social = {
      linkedin: data.social?.linkedin || '',
      twitter: data.social?.twitter || '',
      instagram: data.social?.instagram || ''
    };
  }

  // Validation
  validate() {
    const errors = [];
    
    if (!this.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!this.role.trim()) {
      errors.push('Role is required');
    }
    
    if (!this.description.trim()) {
      errors.push('Description is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get full name with title
  getFullName() {
    return this.name.trim();
  }

  // Get formatted role
  getFormattedRole() {
    return this.role.replace(/\b\w/g, l => l.toUpperCase());
  }

  // Get image with fallback
  getImageUrl() {
    return this.image || '/images/default-avatar.png';
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      image: this.image,
      description: this.description,
      email: this.email,
      phone: this.phone,
      experience: this.experience,
      specialization: this.specialization,
      social: this.social
    };
  }
}

// Static method to create from API response
TeamMember.fromAPI = (apiData) => {
  return new TeamMember({
    id: apiData.id,
    name: apiData.name,
    role: apiData.role,
    image: apiData.image,
    description: apiData.description,
    email: apiData.email,
    phone: apiData.phone,
    experience: apiData.experience,
    specialization: apiData.specialization,
    social: apiData.social
  });
};

export default TeamMember;
