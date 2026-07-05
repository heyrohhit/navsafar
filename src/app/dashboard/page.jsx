"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plane, Star, Clock, CheckCircle2, MapPin, Calendar, Users,
  Plus, Loader2, Pencil, Ticket,
} from "lucide-react";
import { useUser } from "../components/auth/useUser";
import ReviewForm from "./ReviewForm";

const STATUS_STYLES = {
  enquiry:   "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function TripCard({ b }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#0B1C2D]">
            {b.destination || "Custom Trip"}
            {b.departure_city ? <span className="text-gray-400"> · from {b.departure_city}</span> : null}
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
            {b.trip_category && <span className="flex items-center gap-1"><MapPin size={14} /> {b.trip_category}</span>}
            {b.travel_date && <span className="flex items-center gap-1"><Calendar size={14} /> {b.travel_date}</span>}
            {b.travellers ? <span className="flex items-center gap-1"><Users size={14} /> {b.travellers} traveller{b.travellers > 1 ? "s" : ""}</span> : null}
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}>
          {b.status}
        </span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-[#0B1C2D]">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [busy, setBusy]         = useState(true);
  const [showReview, setShowReview] = useState(false);

  async function loadData() {
    setBusy(true);
    try {
      const [b, r] = await Promise.all([
        fetch("/api/bookings").then((res) => res.json()),
        fetch("/api/user/testimonials").then((res) => res.json()),
      ]);
      if (b.success) setBookings(b.data || []);
      if (r.success) setReviews(r.data || []);
    } catch (e) {
      console.error(e);
    }
    setBusy(false);
  }

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[#0f6477]" size={32} />
      </div>
    );
  }

  const name = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Traveller";
  const approvedCount = reviews.filter((r) => r.is_approved).length;

  // ── Enquiry vs Booking split ─────────────────────────────────────────────────
  // enquiry = abhi admin ne confirm nahi kiya. confirmed/completed = pakki booking.
  const enquiries = bookings.filter((b) => b.status === "enquiry");
  const confirmed = bookings.filter((b) => b.status === "confirmed" || b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <section className="min-h-screen bg-gray-50 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#0B1C2D]">
              Namaste, {name} 👋
            </h1>
            <p className="text-gray-600">Apni bookings aur reviews yahan manage karein</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/profile">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Pencil size={16} /> Edit Profile
              </button>
            </Link>
            <Link href="/booking">
              <button className="flex items-center gap-2 rounded-lg bg-[#0f6477] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0d7a8a]">
                <Plus size={16} /> New Booking
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={<Clock size={22} />} label="Pending Enquiries" value={enquiries.length} tone="bg-amber-100 text-amber-600" />
          <StatCard icon={<Ticket size={22} />} label="Confirmed Bookings" value={confirmed.length} tone="bg-[#0f6477]/10 text-[#0f6477]" />
          <StatCard icon={<CheckCircle2 size={22} />} label="Approved Reviews" value={approvedCount} tone="bg-green-100 text-green-600" />
        </div>

        {busy ? (
          <div className="mb-10 flex justify-center py-10"><Loader2 className="animate-spin text-[#0f6477]" /></div>
        ) : bookings.length === 0 ? (
          <div className="mb-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="mb-3 text-gray-500">Abhi tak koi enquiry ya booking nahi hai.</p>
            <Link href="/booking">
              <button className="rounded-lg bg-[#0f6477] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0d7a8a]">
                Pehli enquiry karein
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* My Enquiries — admin ne abhi confirm nahi kiya */}
            <div className="mb-10">
              <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-[#0B1C2D]">
                <Clock size={20} className="text-amber-500" /> My Enquiries
                <span className="text-sm font-normal text-gray-400">({enquiries.length})</span>
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                Ye enquiries hamari team review kar rahi hai. Confirm hote hi "My Bookings" me aa jayengi.
              </p>

              {enquiries.length === 0 ? (
                <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                  Koi pending enquiry nahi.
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((b) => <TripCard key={b.id} b={b} />)}
                </div>
              )}
            </div>

            {/* My Bookings — admin ne confirm kar diya */}
            <div className="mb-10">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#0B1C2D]">
                <Plane size={20} className="text-[#0f6477]" /> My Bookings
                <span className="text-sm font-normal text-gray-400">({confirmed.length})</span>
              </h2>

              {confirmed.length === 0 ? (
                <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                  Abhi tak koi confirmed booking nahi. Enquiry confirm hone ka intezaar karein.
                </div>
              ) : (
                <div className="space-y-3">
                  {confirmed.map((b) => <TripCard key={b.id} b={b} />)}
                </div>
              )}
            </div>

            {/* Cancelled — alag, muted */}
            {cancelled.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-400">
                  Cancelled <span className="text-sm font-normal">({cancelled.length})</span>
                </h2>
                <div className="space-y-3 opacity-70">
                  {cancelled.map((b) => <TripCard key={b.id} b={b} />)}
                </div>
              </div>
            )}
          </>
        )}

        {/* My Reviews */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#0B1C2D]">
              <Star size={20} className="text-amber-500" /> My Reviews
            </h2>
            <button
              onClick={() => setShowReview((v) => !v)}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              <Plus size={16} /> Add Review
            </button>
          </div>

          {showReview && (
            <div className="mb-4">
              <ReviewForm
                defaultName={user?.user_metadata?.full_name || ""}
                onDone={() => { setShowReview(false); loadData(); }}
              />
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Abhi tak koi review nahi. Apna experience share karein!
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-1 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={15} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                        ))}
                        <span className="ml-2 text-sm font-semibold text-gray-700">{r.trip}</span>
                      </div>
                      <p className="text-sm text-gray-600">{r.review}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${r.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
