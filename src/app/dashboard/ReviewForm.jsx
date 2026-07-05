"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";

export default function ReviewForm({ defaultName = "", onDone }) {
  const [name, setName]     = useState(defaultName);
  const [trip, setTrip]     = useState("");
  const [location, setLoc]  = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover]   = useState(0);
  const [review, setReview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/user/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, trip, location, rating, review }),
    }).then((r) => r.json()).catch(() => ({ success: false }));

    setSaving(false);

    if (!res.success) {
      setError(res.message || "Review submit nahi hua. Dobara try karein.");
      return;
    }

    setDone(true);
    setTimeout(() => onDone?.(), 1200);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-green-800">
        ✅ Review submit ho gaya! Admin approval ke baad testimonials section me dikhega.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Your Name *</label>
          <input
            required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
            placeholder="Rahul Sharma"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Trip / Package *</label>
          <input
            required value={trip} onChange={(e) => setTrip(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
            placeholder="Maldives Honeymoon"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Location</label>
        <input
          value={location} onChange={(e) => setLoc(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
          placeholder="Maldives"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Rating *</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const val = i + 1;
            return (
              <button
                key={i} type="button"
                onClick={() => setRating(val)}
                onMouseEnter={() => setHover(val)}
                onMouseLeave={() => setHover(0)}
              >
                <Star size={28} className={val <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Your Review *</label>
        <textarea
          required rows={4} value={review} onChange={(e) => setReview(e.target.value)}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
          placeholder="Apna experience share karein…"
        />
      </div>

      <button
        type="submit" disabled={saving}
        className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Star size={18} />}
        {saving ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
