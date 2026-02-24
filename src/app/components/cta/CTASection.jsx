"use client";
import { useState, useEffect } from "react";

const CTASection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 600);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-full blur-2xl animate-ping"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div 
          className={`mb-12 transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-purple-500/20 mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="text-purple-300 text-sm font-medium">Get Started Today</span>
          </div>
          
          <h2 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{ transitionDelay: '100ms' }}
          >
            Ready for Your
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Next Adventure?
            </span>
          </h2>
          
          <p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
            style={{ transitionDelay: '200ms' }}
          >
            Join thousands of satisfied travelers and start your journey with exclusive deals and personalized experiences
          </p>
        </div>

        {/* Main CTA Content */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          style={{ transitionDelay: '300ms' }}
        >
          {/* Left Side - Contact Info */}
          <div 
            className={`text-left space-y-8 transition-all duration-1000 ${
              isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Get in Touch</h3>
              <p className="text-gray-400 mb-6">
                Our travel experts are here to help you plan the perfect trip. Contact us for personalized recommendations and exclusive deals.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Call Us</div>
                  <div className="text-gray-400">+91 98765 43210</div>
                </div>
              </a>

              <a
                href="mailto:info@navsafar.com"
                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Email Us</div>
                  <div className="text-gray-400">info@navsafar.com</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Business Hours</div>
                  <div className="text-gray-400">Mon - Sat: 9AM - 8PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Newsletter */}
          <div 
            className={`transition-all duration-1000 ${
              isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Get Exclusive Deals</h3>
              <p className="text-gray-400 mb-6">
                Subscribe to our newsletter and be the first to know about new destinations and special offers.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/15 transition-all duration-300"
                  required
                />
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Subscribe Now
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to receive our promotional emails. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div 
          className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Satisfaction Guarantee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Happy Travelers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
