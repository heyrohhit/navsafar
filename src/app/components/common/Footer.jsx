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
  Globe,
  Heart,
  ArrowUp,
  Shield,
  Award,
  Users
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
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      // { name: "Cookie Policy", href: "/cookies" },
      { name: "Refund Policy", href: "/refund" },
      { name: "Travel Insurance", href: "/insurance" }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ]

  const paymentMethods = [
    "Visa", "Mastercard", "American Express", "PayPal", "UPI", "NetBanking"
  ]

  const trustBadges = [
    { icon: Shield, text: "Secure Booking" },
    { icon: Award, text: "Award Winning" },
    { icon: Users, text: "50K+ Happy Customers" }
  ]

  return (
    <footer className="bg-[#fff] text-white overflow-x-hidden">
      {/* Newsletter Section */}
      <section className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Stay Updated with Travel Deals
              </span>
            </h3>
            <p className="text-gray-400 mb-8">
              Subscribe to our newsletter and get exclusive offers and travel tips delivered to your inbox
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#0F6177] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isSubscribed ? (
                  <>
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 " />
                    <span>Subscribe</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 bg-[#0F6177]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-50 h-12 to-orange-500 rounded-full flex items-center justify-center">
                 <img src="/assets/logo.png" alt="/assets/logo.png" className="object-fill"/>
              </div>
              <div>
                {/* <h4 className="text-2xl font-bold">Navsafar</h4>
                <p className="text-amber-400 text-sm">Premium Travel Solutions</p> */}
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for unforgettable travel experiences. We curate the world's most amazing destinations and create memories that last a lifetime.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>+91 8882129640</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-amber-400" />
                <span>info@navsafartravels.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>WZ-447, FIRST FLOOR,<br/>LEFT SIDE NANGAL RAYA DELHI <br/>110046</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-400 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-6 capitalize">
                {category === "company" ? "Company" : category === "explore" ? "Explore" : category === "support" ? "Support" : ""}
              </h4>
              <ul className={`${category === "legal" ? "w-screen flex-wrap h-aut flex justify-around items-center pr-5 " : ""}`}>
                {links.map((link) => (
                  <li key={link.name} className={`space-y-3 ${category === "legal" ? "w-[18%] h-auto flex justify-center items-center" : ""}`}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-gray-400 hover:text-amber-400 transition-all duration-300 inline-block"
                    >
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8 border-t border-gray-800"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.text}
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <badge.icon className="w-8 h-8 text-amber-400" />
              <span className="font-medium">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-800"
        >
          <h4 className="text-lg font-semibold mb-4">We Accept</h4>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm"
              >
                {method}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 bg-[#0F6177]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Navsafar. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>in India</span>
            </div>

            {/* Scroll to Top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
