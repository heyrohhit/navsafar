// src/app/components/search/SearchLeadPopup.jsx
// ✅ Popup form that appears after user clicks "Search Packages"
// Captures: First Name, Last Name, Email, Mobile + search context
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, MapPin, Calendar, Users, Loader2, CheckCircle } from "lucide-react";

export default function SearchLeadPopup({ searchData, onClose, onSuccess }) {
  const [form, setForm]       = useState({ firstName: "", lastName: "", email: "", mobile: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  // Lock body scroll when popup open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function validate() {
    const e = {};
    if (!form.firstName.trim())           e.firstName = "First name is required";
    if (!form.mobile.trim())              e.mobile    = "Mobile number is required";
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.mobile.trim()))
                                           e.mobile    = "Enter a valid mobile number";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
                                           e.email     = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search-lead", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...form,
          from:        searchData?.from        || "",
          destination: searchData?.destination || searchData?.q || "",
          travelDate:  searchData?.date        || "",
          persons:     searchData?.travellers  || 1,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setDone(true);
        setTimeout(() => { onSuccess?.(); }, 2000);
      } else {
        setErrors({ submit: json.message || "Something went wrong." });
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function Field({ icon: Icon, label, name, type = "text", placeholder, required }) {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f6477]/60" />
          <input
            type={type}
            placeholder={placeholder}
            value={form[name]}
            onChange={(e) => {
              setForm((f) => ({ ...f, [name]: e.target.value }));
              setErrors((er) => ({ ...er, [name]: "" }));
            }}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all
              ${errors[name]
                ? "border-red-400 bg-red-50"
                : "border-gray-200 bg-gray-50 focus:border-[#0f6477] focus:bg-white"
              }`}
          />
        </div>
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f6477] to-[#0d7a8a] px-6 py-5 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold mb-1">Almost There! 🎉</h2>
            <p className="text-white/80 text-sm">
              Share your details and we&apos;ll send you the best packages instantly.
            </p>

            {/* Search context chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {searchData?.destination && (
                <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                  <MapPin className="w-3 h-3" /> {searchData.destination}
                </span>
              )}
              {searchData?.date && (
                <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                  <Calendar className="w-3 h-3" /> {new Date(searchData.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              )}
              {searchData?.travellers && (
                <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                  <Users className="w-3 h-3" /> {searchData.travellers} Traveller{searchData.travellers > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Request Received!</h3>
                <p className="text-gray-500 text-sm">
                  Our travel expert will call you within 24 hours with the best packages.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <Field icon={User} label="First Name" name="firstName" placeholder="Rahul" required />
                  <Field icon={User} label="Last Name"  name="lastName"  placeholder="Sharma" />
                </div>

                <Field icon={Phone} label="Mobile Number" name="mobile" type="tel"
                  placeholder="+91 98765 43210" required />

                <Field icon={Mail} label="Email Address" name="email" type="email"
                  placeholder="rahul@example.com" />

                {errors.submit && (
                  <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">
                    {errors.submit}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0f6477] to-[#0d7a8a] hover:from-[#0d5567] hover:to-[#0f6477] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 shadow-lg shadow-[#0f6477]/30"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    "Get Best Packages →"
                  )}
                </button>

                <p className="text-center text-gray-400 text-xs">
                  🔒 Your data is 100% secure. No spam, ever.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
