"use client";
import { useState, useEffect } from "react";


const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    packageInterest: ''
  });

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add API call or email functionality here
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      packageInterest: ''
    });
  };

  const contactInfo = [
    {
      icon: "📞",
      label: "Call Us",
      value: "+91 87007 50589",
      href: "tel:+918700750589",
      description: "Mon-Sat: 9:00 AM - 7:00 PM",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: "✉️",
      label: "Email Us",
      value: "info@navsafar.com",
      href: "mailto:info@navsafar.com",
      description: "24/7 Email Support",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: "📍",
      label: "Visit Us",
      value: "123 Travel Street, Mumbai",
      href: "https://maps.google.com/?q=123+Travel+Street+Mumbai",
      description: "Get Directions →",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: "💬",
      label: "WhatsApp",
      value: "+91 87007 50589",
      href: "https://wa.me/918700750589",
      description: "Chat Instantly",
      color: "from-green-600 to-green-500"
    }
  ];

  const faqs = [
    {
      question: "How do I book a travel package?",
      answer: "You can browse our packages online and click 'Get Query' or contact us directly via phone or email. Our team will assist you with the booking process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, bank transfers, and EMI options for selected packages."
    },
    {
      question: "Can I customize my travel package?",
      answer: "Yes! We offer customizable packages. Contact us with your requirements and we'll create a personalized itinerary for you."
    },
    {
      question: "Do you provide travel insurance?",
      answer: "Yes, we offer comprehensive travel insurance options for all our domestic and international packages."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-500 text-white py-20 transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact <span className="text-yellow-400">Safar</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get in touch with us for your dream vacation
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Get in <span className="text-blue-600">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you plan your perfect journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className={`h-32 bg-gradient-to-br ${info.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0">
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full animate-bounce"></div>
                  </div>
                  <div className="text-4xl mb-2 transform transition-transform duration-300 group-hover:scale-110 z-10">
                    {info.icon}
                  </div>
                </div>
                
                <div className="p-6 bg-white">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {info.label}
                  </h3>
                  {info.href ? (
                    <a 
                      href={info.href}
                      className="text-blue-600 hover:text-blue-700 transition-colors duration-300 font-semibold"
                      target={info.href.includes('http') ? '_blank' : '_self'}
                      rel={info.href.includes('http') ? 'noopener noreferrer' : ''}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 font-semibold">
                      {info.value}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                    {info.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-100 rounded-full opacity-50 animate-bounce"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Send us a <span className="text-blue-600">Message</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below and we'll get back to you soon
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-full opacity-50"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📞</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="packageInterest" className="block text-sm font-medium text-gray-700 mb-2">
                    Package Interest
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🎒</span>
                    <select
                      id="packageInterest"
                      name="packageInterest"
                      value={formData.packageInterest}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 appearance-none bg-white"
                    >
                      <option value="">Select a package type</option>
                      <option value="domestic">Domestic Packages</option>
                      <option value="international">International Packages</option>
                      <option value="religious">Religious Tours</option>
                      <option value="family">Family Packages</option>
                      <option value="adventure">Adventure Tours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📝</span>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">💬</span>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 resize-none"
                    placeholder="Tell us about your travel plans..."
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = 'https://wa.me/918700750589'}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  WhatsApp Us
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`bg-gray-50 rounded-xl p-6 transition-all duration-700 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${1400 + index * 150}ms` }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            className={`transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '2000ms' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready for Your <span className="text-yellow-400">Adventure?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Don't wait any longer to start your dream journey
            </p>
            <a 
              href="/tour-packages"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Our Packages
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
