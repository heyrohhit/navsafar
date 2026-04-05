"use client";
import { useState, useEffect } from "react";

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    packageInterest: "",
  });

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "", packageInterest: "" });
  };

  const contactInfo = [
    {
      icon: "📞",
      label: "Call Us",
      value: "+91 8882128640",
      href: "tel:+918882128640",
      description: "Mon–Sat: 9:00 AM – 7:00 PM",
    },
    {
      icon: "✉️",
      label: "Email Us",
      value: "info@navsafar.com",
      href: "mailto:info@navsafar.com",
      description: "24/7 Email Support",
    },
    {
      icon: "📍",
      label: "Visit Us",
      value: "WZ-447, First Floor, Left Side Nangal Raya, Delhi – 110046",
      href: "https://maps.google.com/",
      description: "Get Directions →",
    },
    {
      icon: "💬",
      label: "WhatsApp",
      value: "+91 8882128640",
      href: "https://wa.me/918882128640",
      description: "Chat Instantly",
    },
  ];

  const faqs = [
    {
      question: "How do I book a travel package?",
      answer: "You can browse our packages online and click 'Get Query' or contact us directly via phone or email. Our team will assist you with the booking process.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, bank transfers, and EMI options for selected packages.",
    },
    {
      question: "Can I customize my travel package?",
      answer: "Yes! We offer customizable packages. Contact us with your requirements and we'll create a personalized itinerary for you.",
    },
    {
      question: "Do you provide travel insurance?",
      answer: "Yes, we offer comprehensive travel insurance options for all our domestic and international packages.",
    },
  ];

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f6477]/40 focus:border-[#0f6477] hover:border-[#0f6477]/50 transition-all duration-300 text-sm";

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">

      {/* ── HERO ── */}
      <section className={`relative overflow-hidden bg-[#0f6477] text-white py-24 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-40px] w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        {/* grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        {/* floating emojis */}
        {["✈️","🌍","🏖️","📞","💌"].map((e, i) => (
          <div key={i} className="absolute text-2xl opacity-15 select-none pointer-events-none"
            style={{ top: `${15 + (i * 16) % 65}%`, left: `${8 + (i * 18) % 80}%`, animation: `float ${5 + i}s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }}>
            {e}
          </div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white/90 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-7">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
            We're Here to Help
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-5">
            Contact{" "}
            <span className="text-transparent bg-clip-text reey-font" style={{ backgroundImage: "linear-gradient(90deg, #fbbf24, #f59e0b)" }}>
              Navsafar
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Get in touch with us and let's plan your{" "}
            <span className="text-white font-semibold underline decoration-amber-400 underline-offset-4">dream vacation</span> together.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-14 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
            <span className="text-[#0f6477] font-bold uppercase tracking-widest text-xs">Reach Out</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f6477] to-[#04b586]">Touch</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <a
                key={i}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : "_self"}
                rel={info.href.startsWith("http") ? "noopener noreferrer" : ""}
                className={`group relative flex flex-col items-center text-center bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-[#0f6477]/30 transition-all duration-500 hover:-translate-y-2 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                {/* icon circle */}
                <div className="w-16 h-16 rounded-2xl bg-[#0f6477]/10 group-hover:bg-[#0f6477] flex items-center justify-center text-3xl mb-5 transition-all duration-300 shadow-md group-hover:shadow-[#0f6477]/30">
                  <span className="group-hover:scale-110 transition-transform duration-300 inline-block">{info.icon}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0f6477] transition-colors duration-300 mb-1">{info.label}</h3>
                <p className="text-[#0f6477] font-semibold text-sm mb-2 break-all">{info.value}</p>
                <p className="text-gray-400 text-xs">{info.description}</p>
                {/* bottom accent */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-1 rounded-full bg-gradient-to-r from-[#0f6477] to-[#04b586] transition-all duration-500" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#0f6477]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#04b586]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "500ms" }}>
            <span className="text-[#0f6477] font-bold uppercase tracking-widest text-xs">Drop a Line</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Send us a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f6477] to-[#04b586]">Message</span>
            </h2>
            <p className="text-gray-500 mt-3 text-base">Fill out the form below and we'll get back to you shortly.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* form header strip */}
            <div className="h-2 bg-gradient-to-r from-[#0f6477] via-[#0d7a8a] to-[#04b586]" />
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Full Name *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">👤</span>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" className={inputClass} />
                    </div>
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">✉️</span>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className={inputClass} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">📞</span>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className={inputClass} />
                    </div>
                  </div>
                  {/* Package */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Package Interest</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🎒</span>
                      <select name="packageInterest" value={formData.packageInterest} onChange={handleInputChange} className={`${inputClass} appearance-none`}>
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

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Subject *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">📝</span>
                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required placeholder="How can we help you?" className={inputClass} />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Message *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-4 text-lg">💬</span>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={5} placeholder="Tell us about your travel plans..." className={`${inputClass} pl-11 resize-none`} />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0f6477] hover:bg-[#0d5567] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#0f6477]/30 hover:shadow-[#0f6477]/50 transition-all duration-300 hover:scale-105 text-sm">
                    <span className="text-lg">📤</span> Send Message
                  </button>
                  <button type="button" onClick={() => window.location.href = "https://wa.me/918700750589"}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 text-sm">
                    <span className="text-lg">💬</span> WhatsApp Us
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className={`text-center mb-14 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "600ms" }}>
            <span className="text-[#0f6477] font-bold uppercase tracking-widest text-xs">Quick Answers</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f6477] to-[#04b586]">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i ? "border-[#0f6477]/40 shadow-lg shadow-[#0f6477]/10" : "border-gray-100 shadow-sm"} ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${700 + i * 100}ms` }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-gray-900 text-sm pr-4">{faq.question}</span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#0f6477]/10 flex items-center justify-center text-[#0f6477] font-bold transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 bg-[#0f6477]/3">
                    <div className="w-8 h-0.5 rounded-full bg-amber-400 mb-3" />
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 overflow-hidden bg-[#0f6477]">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#04b586]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <div className="text-5xl mb-6">🌴</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Ready for Your{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #fbbf24, #f59e0b)" }}>
              Adventure?
            </span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Don't wait any longer — your dream journey is just one click away.
          </p>
          <a
            href="/tour-packages"
            className="inline-flex items-center gap-2 px-10 py-4 bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-amber-400/50 transition-all duration-300 hover:scale-105 text-base"
          >
            ✈️ Explore Our Packages
          </a>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
};

export default Contact;