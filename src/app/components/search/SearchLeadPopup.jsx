// src/app/components/search/SearchLeadPopup.jsx
// ✅ FIXED:
//   - Field component moved OUTSIDE — no more remount on keypress
//   - Input focus loss bug eliminated
"use client";
import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Mail, Phone, MapPin, Calendar, Users,
  Loader2, CheckCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// ✅ KEY FIX: Field is defined OUTSIDE the parent component
// so React never unmounts it on re-render → no focus loss
// ─────────────────────────────────────────────────────────────
const Field = memo(function Field({
  icon: Icon, label, name, type = "text",
  placeholder, required, value, error, onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f6477]/50 pointer-events-none" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={
            name === "mobile" ? "tel" :
            name === "email"  ? "email" :
            name === "firstName" ? "given-name" :
            name === "lastName"  ? "family-name" : "off"
          }
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2
            ${error
              ? "border-red-400 bg-red-50 focus:ring-red-200"
              : "border-gray-200 bg-gray-50 focus:border-[#0f6477] focus:bg-white focus:ring-[#0f6477]/20"
            }`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// Main Popup
// ─────────────────────────────────────────────────────────────
export default function SearchLeadPopup({ searchData, onClose, onSuccess }) {
  const [form, setForm]     = useState({ firstName: "", lastName: "", email: "", mobile: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleChange(name) {
    return (e) => {
      setForm((f) => ({ ...f, [name]: e.target.value }));
      setErrors((er) => ({ ...er, [name]: "" }));
    };
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim())
      e.firstName = "First name is required";
    if (!form.mobile.trim())
      e.mobile = "Mobile number is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.mobile.trim()))
      e.mobile = "Enter a valid mobile number";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        from:        searchData?.from        || "",
        destination: searchData?.destination || searchData?.q || "",
        travelDate:  searchData?.date        || "",
        persons:     Number(searchData?.travellers) || 1,
      };

      const res  = await fetch("/api/search-lead", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        setDone(true);
        setTimeout(() => onSuccess?.(), 2200);
      } else {
        setErrors({ submit: json.message || "Something went wrong. Please try again." });
      }
    } catch {
      setErrors({ submit: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  const travellerCount = Number(searchData?.travellers) || 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0f6477] to-[#0a8fa8] px-6 py-5 text-white">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-xl font-bold mb-1">Almost There! 🎉</h2>
          <p className="text-white/80 text-sm">
            Share your details and we&apos;ll send you the best packages.
          </p>

          {/* Search context chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {searchData?.destination && (
              <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {searchData.destination}
              </span>
            )}
            {searchData?.date && (
              <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                {(() => {
                  try {
                    return new Date(searchData.date).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    });
                  } catch { return searchData.date; }
                })()}
              </span>
            )}
            {travellerCount > 0 && (
              <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                <Users className="w-3 h-3 flex-shrink-0" />
                {travellerCount} Traveller{travellerCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <div className="px-6 py-5">
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Request Received! 🙌</h3>
              <p className="text-gray-500 text-sm">
                Our travel expert will call you within 24 hours with the best packages.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  icon={User} label="First Name" name="firstName"
                  placeholder="Rahul" required
                  value={form.firstName} error={errors.firstName}
                  onChange={handleChange("firstName")}
                />
                <Field
                  icon={User} label="Last Name" name="lastName"
                  placeholder="Sharma"
                  value={form.lastName} error={errors.lastName}
                  onChange={handleChange("lastName")}
                />
              </div>

              <Field
                icon={Phone} label="Mobile Number" name="mobile" type="tel"
                placeholder="+91 98765 43210" required
                value={form.mobile} error={errors.mobile}
                onChange={handleChange("mobile")}
              />

              <Field
                icon={Mail} label="Email Address" name="email" type="email"
                placeholder="rahul@example.com"
                value={form.email} error={errors.email}
                onChange={handleChange("email")}
              />

              {errors.submit && (
                <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {errors.submit}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#0f6477] to-[#0a8fa8] hover:from-[#0d5567] hover:to-[#0f6477] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#0f6477]/25"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  : "Get Best Packages →"
                }
              </button>

              <p className="text-center text-gray-400 text-xs">
                🔒 Your data is 100% secure. No spam, ever.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
