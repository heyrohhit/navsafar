"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, CheckCircle2, MapPin, Plane, Calendar, Users, Moon, Building2,
  Wallet, MessageSquare, User, Phone, Mail, LogIn, UserPlus, ShieldCheck,
  ArrowRight, ArrowLeft, Sparkles, ClipboardList, Loader2,
} from "lucide-react";
import { useUser } from "../components/auth/useUser";
import { createClient } from "../../lib/supabase/browser";

const serviceOptions = [
  { label: "Hotels",           icon: "🏨" },
  { label: "Flights",          icon: "✈️" },
  { label: "Private Cab",      icon: "🚗" },
  { label: "Sightseeing",      icon: "📸" },
  { label: "Visa Assistance",  icon: "🛂" },
  { label: "Travel Insurance", icon: "🛡️" },
];

const tripCategories  = ["Holiday", "Honeymoon", "Family Vacation", "Group Tour", "Corporate Travel"];
const hotelCategories = ["3 Star", "4 Star", "5 Star", "Resort"];

const EMPTY = {
  fullName: "", phone: "", email: "", departureCity: "",
  tripCategory: "Holiday", travelType: "International",
  destination: "", travelDate: "", nights: "", adults: 1, children: 0,
  hotelCategory: "5 Star", services: [], message: "",
};

const STEPS = [
  { n: 1, label: "Trip Details",  icon: Plane },
  { n: 2, label: "Preferences",   icon: Sparkles },
  { n: 3, label: "Your Details",  icon: ClipboardList },
];

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, required, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        {Icon && <Icon size={15} className="text-[#0f6477]" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition-all focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20";

export default function BookingPage() {
  const router = useRouter();
  const { user } = useUser();

  const [formData, setFormData] = useState(EMPTY);
  const [step, setStep]         = useState(1);
  const [saving, setSaving]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Prefill from logged-in user (name / email / phone) ──────────────────────
  useEffect(() => {
    if (!user) return;
    (async () => {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles").select("full_name, phone, city").eq("id", user.id).single();

      setFormData((prev) => ({
        ...prev,
        fullName:      prev.fullName      || profile?.full_name || user.user_metadata?.full_name || "",
        email:         prev.email         || user.email || "",
        phone:         prev.phone         || profile?.phone || user.user_metadata?.phone || "",
        departureCity: prev.departureCity || profile?.city || "",
      }));
    })();
  }, [user]);

  // ── Restore an in-progress booking (after login redirect) ───────────────────
  useEffect(() => {
    const pending = localStorage.getItem("pendingBooking");
    if (pending) {
      try { setFormData((prev) => ({ ...prev, ...JSON.parse(pending) })); } catch {}
      localStorage.removeItem("pendingBooking");
    }
  }, []);

  // ── Pre-filled journey (from a package/destination card) ────────────────────
  useEffect(() => {
    const selectedJourney = localStorage.getItem("selectedJourney");
    if (selectedJourney) {
      try {
        const journey = JSON.parse(selectedJourney);
        setFormData((prev) => ({
          ...prev,
          destination:  journey.location,
          tripCategory: journey.category || prev.tripCategory,
          nights:       journey.duration?.includes("Days")  ? journey.duration.split(" ")[0]  : prev.nights,
          adults:       journey.groupSize?.includes("People") ? Number(journey.groupSize.split(" ")[0]) || prev.adults : prev.adults,
          message:      `Interested in: ${journey.title} - ${journey.description?.substring(0, 100) || ""}...`,
        }));
      } catch {}
      localStorage.removeItem("selectedJourney");
    }
  }, []);

  const set = (name, value) => setFormData((f) => ({ ...f, [name]: value }));
  const handleChange = (e) => set(e.target.name, e.target.value);

  const toggleService = (service) =>
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));

  // ── Per-step validation ─────────────────────────────────────────────────────
  function stepValid(s) {
    if (s === 1) return formData.destination.trim() || formData.departureCity.trim();
    if (s === 3) return formData.fullName.trim() && formData.phone.trim();
    return true;
  }

  function next() {
    if (!stepValid(step)) return;
    setStep((s) => Math.min(3, s + 1));
  }
  function back() { setStep((s) => Math.max(1, s - 1)); }

  // ── Submit — account check → DB save + WhatsApp ─────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    if (!stepValid(3)) return;
    setSaving(true);

    const supabase = createClient();
    const { data: { user: current } } = await supabase.auth.getUser();

    if (!current) {
      try { localStorage.setItem("pendingBooking", JSON.stringify(formData)); } catch {}
      router.push("/login?redirect=/booking");
      return;
    }

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error("Booking save failed:", err);
    }

    const servicesText = formData.services.length ? formData.services.join(", ") : "Not specified";
    const message =
      `🌟 *New Travel Enquiry* 🌟%0A%0A` +
      `👤 *Name:* ${formData.fullName}%0A` +
      `📱 *Phone:* ${formData.phone}%0A` +
      `📧 *Email:* ${formData.email || "Not provided"}%0A` +
      `🛫 *Departure City:* ${formData.departureCity || "Not specified"}%0A` +
      `🏷️ *Trip Category:* ${formData.tripCategory}%0A` +
      `✈️ *Travel Type:* ${formData.travelType}%0A` +
      `🌍 *Destination:* ${formData.destination || "Not specified"}%0A` +
      `📅 *Travel Date:* ${formData.travelDate || "Not specified"}%0A` +
      `🌙 *Nights:* ${formData.nights || "Not specified"}%0A` +
      `👥 *Travellers:* ${formData.adults} Adult${formData.adults !== 1 ? "s" : ""}${formData.children > 0 ? `, ${formData.children} Child${formData.children !== 1 ? "ren" : ""}` : ""}%0A` +
      `🏨 *Hotel Category:* ${formData.hotelCategory}%0A` +
      `🎯 *Services Required:* ${servicesText}%0A` +
      `📝 *Additional Requirements:* ${formData.message || "None"}%0A%0A--------------------`;

    window.open(`https://wa.me/918882129640?text=${message}`, "_blank");

    setSubmitted(true);
    setSaving(false);
    setStep(1);
    setTimeout(() => { setFormData(EMPTY); setSubmitted(false); }, 4000);
  }

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0];

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-[#0B1C2D] px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={34} />
          </div>
          <h2 className="mb-2 font-['Playfair_Display'] text-2xl font-bold text-[#0B1C2D]">Enquiry Sent! 🎉</h2>
          <p className="mb-6 text-gray-600">
            Aapki booking save ho gayi aur WhatsApp pe bhej di gayi. Hamari team jald contact karegi.
          </p>
          <Link href="/dashboard">
            <button className="rounded-xl bg-[#0f6477] px-6 py-3 font-semibold text-white hover:bg-[#0d7a8a]">
              View in My Dashboard
            </button>
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-[#0B1C2D] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <h1 className="mb-2 font-['Playfair_Display'] text-4xl font-bold text-[#0B1C2D] md:text-5xl">
            Plan Your Journey
          </h1>
          <p className="text-gray-700 md:text-lg">Kuch details bharein — hum aapke liye perfect trip design karenge</p>
        </motion.div>

        {/* ── Account banner ("add user" option) ──────────────────────────── */}
        <div className="mx-auto mb-8 max-w-3xl">
          {user ? (
            <div className="flex items-center gap-3 rounded-2xl border border-[#0f6477]/20 bg-[#0f6477]/5 px-5 py-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f6477] text-white">
                <User size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0B1C2D]">Booking as {firstName}</p>
                <p className="text-xs text-gray-500">{user.email} · dashboard me track hogi</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <ShieldCheck size={13} /> Signed in
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
                  <UserPlus size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0B1C2D]">Apne account se book karein</p>
                  <p className="text-xs text-gray-600">Bookings track karein, dobara details na bharni pade</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/login?redirect=/booking">
                  <button className="flex items-center gap-1.5 rounded-lg border border-[#0f6477] px-4 py-2 text-sm font-medium text-[#0f6477] hover:bg-[#0f6477] hover:text-white">
                    <LogIn size={15} /> Login
                  </button>
                </Link>
                <Link href="/signup?redirect=/booking">
                  <button className="flex items-center gap-1.5 rounded-lg bg-[#0f6477] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d7a8a]">
                    <UserPlus size={15} /> Sign up
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Form card ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 lg:col-span-2"
          >
            {/* Step indicator */}
            <div className="mb-8 flex items-center justify-between">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = step === s.n;
                const done = step > s.n;
                return (
                  <div key={s.n} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all ${
                        done ? "border-green-500 bg-green-500 text-white"
                        : active ? "border-[#0f6477] bg-[#0f6477] text-white"
                        : "border-gray-300 bg-white text-gray-400"}`}>
                        {done ? <CheckCircle2 size={20} /> : <Icon size={18} />}
                      </div>
                      <span className={`mt-1.5 text-xs font-medium ${active ? "text-[#0f6477]" : "text-gray-400"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`mx-2 h-0.5 flex-1 rounded ${step > s.n ? "bg-green-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* STEP 1 — Trip Details */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="grid gap-5 sm:grid-cols-2">
                    <Field label="Departure City" icon={Plane}>
                      <input name="departureCity" value={formData.departureCity} onChange={handleChange} className={inputCls} placeholder="Delhi, Mumbai…" />
                    </Field>
                    <Field label="Destination" icon={MapPin} required>
                      <input name="destination" value={formData.destination} onChange={handleChange} className={inputCls} placeholder="Maldives, Switzerland…" />
                    </Field>
                    <Field label="Trip Category" icon={Sparkles}>
                      <select name="tripCategory" value={formData.tripCategory} onChange={handleChange} className={inputCls}>
                        {tripCategories.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Travel Type" icon={Plane}>
                      <select name="travelType" value={formData.travelType} onChange={handleChange} className={inputCls}>
                        <option>Domestic</option><option>International</option>
                      </select>
                    </Field>
                    <Field label="Travel Date" icon={Calendar}>
                      <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} className={inputCls} />
                    </Field>
                    <Field label="Nights" icon={Moon}>
                      <input type="number" min="1" name="nights" value={formData.nights} onChange={handleChange} className={inputCls} placeholder="5" />
                    </Field>
                    <Field label="Travellers" icon={Users} className="sm:col-span-2">
                      <div className="grid grid-cols-2 gap-3">
                        <Counter label="Adults"   sub="Age 12+" value={formData.adults}   min={1} onChange={(v) => set("adults", v)} />
                        <Counter label="Children" sub="Age 2–11" value={formData.children} min={0} onChange={(v) => set("children", v)} />
                      </div>
                    </Field>
                  </motion.div>
                )}

                {/* STEP 2 — Preferences */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-5">
                    <Field label="Hotel Category" icon={Building2}>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {hotelCategories.map((h) => (
                          <button key={h} type="button" onClick={() => set("hotelCategory", h)}
                            className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                              formData.hotelCategory === h
                                ? "border-[#0f6477] bg-[#0f6477] text-white"
                                : "border-gray-300 text-gray-600 hover:border-[#0f6477]"}`}>
                            {h}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Services Required" icon={Sparkles}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {serviceOptions.map((s) => {
                          const checked = formData.services.includes(s.label);
                          return (
                            <button key={s.label} type="button" onClick={() => toggleService(s.label)}
                              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                                checked ? "border-[#0f6477] bg-[#0f6477]/5" : "border-gray-200 hover:border-[#0f6477]/50"}`}>
                              <span className="text-xl">{s.icon}</span>
                              <span className="flex-1 text-sm font-medium text-gray-700">{s.label}</span>
                              <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                checked ? "border-[#0f6477] bg-[#0f6477] text-white" : "border-gray-300"}`}>
                                {checked && <CheckCircle2 size={12} />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                  </motion.div>
                )}

                {/* STEP 3 — Your Details */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name" icon={User} required>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} required className={inputCls} placeholder="Your full name" />
                    </Field>
                    <Field label="Mobile Number" icon={Phone} required>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputCls} placeholder="+91 XXXXX XXXXX" />
                    </Field>
                    <Field label="Email Address" icon={Mail} className="sm:col-span-2">
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="your@email.com" />
                    </Field>
                    <Field label="Additional Requirements" icon={MessageSquare} className="sm:col-span-2">
                      <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Any special requests or preferences" />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nav buttons */}
              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button type="button" onClick={back}
                    className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-600 hover:bg-gray-50">
                    <ArrowLeft size={18} /> Back
                  </button>
                ) : <span />}

                {step < 3 ? (
                  <button type="button" onClick={next} disabled={!stepValid(step)}
                    className="flex items-center gap-2 rounded-xl bg-[#0f6477] px-6 py-3 font-semibold text-white transition-all hover:bg-[#0d7a8a] disabled:opacity-50">
                    Next <ArrowRight size={18} />
                  </button>
                ) : (
                  <button type="submit" disabled={saving || !stepValid(3)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-amber-600 hover:to-amber-700 disabled:opacity-60">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {saving ? "Please wait…" : "Confirm & Send"}
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* ── Live summary sidebar ───────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="h-fit rounded-3xl bg-white/95 p-6 shadow-2xl lg:sticky lg:top-24"
          >
            <h3 className="mb-4 flex items-center gap-2 font-['Playfair_Display'] text-lg font-bold text-[#0B1C2D]">
              <ClipboardList size={18} className="text-[#0f6477]" /> Trip Summary
            </h3>

            <div className="space-y-3 text-sm">
              <SummaryRow icon={MapPin}   label="Destination" value={formData.destination || "—"} />
              <SummaryRow icon={Plane}    label="From"        value={formData.departureCity || "—"} />
              <SummaryRow icon={Sparkles} label="Category"    value={formData.tripCategory} />
              <SummaryRow icon={Calendar} label="Date"        value={formData.travelDate || "—"} />
              <SummaryRow icon={Moon}     label="Nights"      value={formData.nights || "—"} />
              <SummaryRow icon={Users}    label="Travellers"
                value={`${formData.adults} Adult${formData.adults !== 1 ? "s" : ""}${formData.children > 0 ? `, ${formData.children} Child${formData.children !== 1 ? "ren" : ""}` : ""}`} />
              <SummaryRow icon={Building2} label="Hotel"      value={formData.hotelCategory} />
              {formData.services.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <Sparkles size={13} /> Services
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.services.map((s) => (
                      <span key={s} className="rounded-full bg-[#0f6477]/10 px-2.5 py-1 text-xs font-medium text-[#0f6477]">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-3 text-center text-xs text-gray-500">
              🔒 Aapki details safe hain. Confirm karne pe WhatsApp pe bhi bhej denge.
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function Counter({ label, sub, value, min = 0, max = 20, onChange }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-300 px-3 py-2.5">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-40 hover:border-[#0f6477] hover:text-[#0f6477]"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-semibold text-gray-800">{value}</span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-40 hover:border-[#0f6477] hover:text-[#0f6477]"
        >
          +
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-gray-500">
        <Icon size={14} /> {label}
      </span>
      <span className="max-w-[55%] truncate text-right font-medium text-gray-800">{value}</span>
    </div>
  );
}