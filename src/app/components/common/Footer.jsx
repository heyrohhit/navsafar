"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  ArrowUp,
  Shield,
  Award,
  Users,
  CheckCircle
} from "lucide-react"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    setIsSubscribed(true)
    setTimeout(() => {
      setIsSubscribed(false)
      setEmail("")
    }, 3000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" }
    ],
    explore: [
      { name: "Destinations", href: "/destinations" },
      { name: "Travel Packages", href: "/packages" },
      { name: "Special Offers", href: "/offers" },
      { name: "Travel Blog", href: "/blog" },
      { name: "Gallery", href: "/gallery" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "FAQs", href: "/faq" },
      { name: "Booking Guide", href: "/guide" },
      { name: "Cancellation Policy", href: "/cancellation" }
    ],
    legal: [
      { name: "Terms of Service", href: "/policies/terms" },
      { name: "Privacy Policy", href: "/policies/privacy" },
      { name: "Refund Policy", href: "/policies/refund" },
      // { name: "Travel Insurance", href: "/insurance" }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: Youtube, href: "#", label: "Youtube", color: "hover:bg-red-600" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" }
  ]

  const paymentMethods = ["Visa", "Mastercard", "American Express", "PayPal", "UPI", "NetBanking"]

  const trustBadges = [
    { icon: Shield, text: "100% Secure Booking", sub: "SSL Encrypted" },
    // { icon: Award, text: "Award Winning", sub: "Best Travel Agency 2024" },
    // { icon: Users, text: "50K+ Happy Customers", sub: "And counting..." }
  ]

  return (
    <footer className="overflow-x-hidden font-sans relative z-[2]">

      {/* ── NEWSLETTER STRIP ── */}
      <section className="bg-gradient-to-r from-[#0d5567] via-[#0f6477] to-[#0d7a8a] relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-white/20">
              ✉️ Newsletter
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
              Get Exclusive Travel Deals
            </h3>
            <p className="text-white/70 mb-10 max-w-lg mx-auto text-base">
              Subscribe and receive handpicked offers, travel tips, and destination guides straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/20 transition-all text-sm"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 text-sm whitespace-nowrap"
              >
                {isSubscribed ? (
                  <><CheckCircle className="w-4 h-4" /><span>Subscribed!</span></>
                ) : (
                  <><Send className="w-4 h-4" /><span>Subscribe</span></>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN FOOTER ── */}
      <div className="bg-[#0f6477]">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

          {/* top grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-white/10">

            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="mb-5">
                <img src="/assets/logo.png" alt="Navsafar" className="h-12 object-contain" />
              </div>

              <p className="text-white/60 mb-7 leading-relaxed text-sm">
                Your trusted partner for unforgettable travel experiences. We curate the world's most amazing destinations and create memories that last a lifetime.
              </p>

              {/* Contact */}
              <ul className="space-y-3 mb-8">
                {[
                  { icon: Phone, text: "+91 8882128640" },
                  { icon: Mail, text: "info@navsafartravels.com" },
                  { icon: MapPin, text: "WZ-447, First Floor, Left Side\nNangal Raya, Delhi 110046" }
                ].map(({ icon: Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </span>
                    <span className="whitespace-pre-line">{text}</span>
                  </li>
                ))}
              </ul>

              {/* Social */}
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white ${s.color} hover:border-transparent transition-all duration-300`}
                  >
                    <s.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links — Company, Explore, Support */}
            {["company", "explore", "support"].map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="w-4 h-0.5 rounded-full bg-amber-400 inline-block" />
                  {cat === "company" ? "Company" : cat === "explore" ? "Explore" : "Support"}
                </h4>
                <ul className="space-y-3">
                  {footerLinks[cat].map((link) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 4 }}
                        className="text-white/55 hover:text-amber-400 transition-colors duration-300 text-sm inline-flex items-center gap-1.5 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-400/0 group-hover:bg-amber-400 transition-all duration-300 inline-block flex-shrink-0" />
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 py-10 border-b border-white/10"
          >
            {trustBadges.map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 rounded-2xl p-4 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400/15 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{badge.text}</div>
                  <div className="text-white/45 text-xs mt-0.5">{badge.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-8 border-b border-white/10"
          >
            <h4 className="text-white/50 text-xs uppercase tracking-widest font-bold mb-4">We Accept</h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((m) => (
                <span
                  key={m}
                  className="px-4 py-1.5 bg-white/8 border border-white/15 rounded-lg text-white/65 text-xs font-medium hover:bg-white/15 hover:text-white hover:border-amber-400/40 transition-all duration-200 cursor-default"
                >
                  {m}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Legal Links */}
          <div className="pt-6 pb-2 border-b border-white/10">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/40 hover:text-amber-400 text-xs transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="bg-[#0d5567]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/45 text-sm">
            © {new Date().getFullYear()} <span className="text-white/70 font-semibold">Navsafar</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5 text-white/45 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>in India</span>
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-gray-900" />
          </motion.button>
        </div>
      </div>

    </footer>
  )
}

export default Footer