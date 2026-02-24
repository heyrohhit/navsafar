// Contact Form Model
export class ContactForm {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.subject = data.subject || '';
    this.message = data.message || '';
    this.packageInterest = data.packageInterest || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.status = data.status || 'pending'; // pending, responded, closed
    this.priority = data.priority || 'normal'; // low, normal, high, urgent
  }

  // Validation
  validate() {
    const errors = [];
    
    // Name validation
    if (!this.name.trim()) {
      errors.push('Name is required');
    } else if (this.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (this.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }
    
    // Email validation
    if (!this.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Subject validation
    if (!this.subject.trim()) {
      errors.push('Subject is required');
    } else if (this.subject.length < 5) {
      errors.push('Subject must be at least 5 characters');
    } else if (this.subject.length > 200) {
      errors.push('Subject must be less than 200 characters');
    }
    
    // Message validation
    if (!this.message.trim()) {
      errors.push('Message is required');
    } else if (this.message.length < 10) {
      errors.push('Message must be at least 10 characters');
    } else if (this.message.length > 2000) {
      errors.push('Message must be less than 2000 characters');
    }
    
    // Phone validation (optional)
    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('Please enter a valid phone number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation helper
  isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  // Get formatted data for API
  getAPIData() {
    return {
      id: this.id,
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      phone: this.phone ? this.phone.replace(/\D/g, '') : '',
      subject: this.subject.trim(),
      message: this.message.trim(),
      packageInterest: this.packageInterest,
      createdAt: this.createdAt,
      status: this.status,
      priority: this.priority
    };
  }

  // Get formatted phone number
  getFormattedPhone() {
    if (!this.phone) return '';
    
    const cleaned = this.phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return this.phone;
  }

  // Get priority color
  getPriorityColor() {
    const colors = {
      low: 'text-gray-600',
      normal: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[this.priority] || colors.normal;
  }

  // Get status badge
  getStatusBadge() {
    const badges = {
      pending: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      responded: { text: 'Responded', class: 'bg-green-100 text-green-800' },
      closed: { text: 'Closed', class: 'bg-gray-100 text-gray-800' }
    };
    return badges[this.status] || badges.pending;
  }

  // Convert to JSON
  toJSON() {
    return this.getAPIData();
  }

  // Static method to create from form data
  static fromFormData(formData) {
    return new ContactForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      packageInterest: formData.packageInterest
    });
  }

  // Static method to create from API response
  static fromAPI(apiData) {
    return new ContactForm({
      id: apiData.id,
      name: apiData.name,
      email: apiData.email,
      phone: apiData.phone,
      subject: apiData.subject,
      message: apiData.message,
      packageInterest: apiData.packageInterest,
      createdAt: apiData.createdAt,
      status: apiData.status,
      priority: apiData.priority
    });
  }
}

export default ContactForm;
