// src/app/admin/testimonials/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  X,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Token helper
// ─────────────────────────────────────────────────────────────────────────────
const getToken = () =>
  typeof window !== "undefined"
    ? sessionStorage.getItem("ns_admin_token") || ""
    : "";

// ─────────────────────────────────────────────────────────────────────────────
// DefaultAvatar
// ─────────────────────────────────────────────────────────────────────────────
const DefaultAvatar = ({ name }) => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
    {name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TestimonialForm
// FIX 1: Removed stray closing </AnimatePresence> and extra }; that caused
//         a JSX parse error. The component now has a clean single return.
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  rating: 5,
  review: "",
  trip: "",
  location: "",
  travelDate: "",
  isFeatured: false,
  isApproved: true,
};

const TestimonialForm = ({ testimonial, onSave, onClose }) => {
  const [formData, setFormData] = useState(testimonial || EMPTY_FORM);

  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
            <h3 className="text-xl font-bold text-white">
              {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Rating (1-5) *</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={formData.rating}
                  onChange={(e) => set("rating", parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Trip / Package Name *</label>
                <input
                  type="text"
                  required
                  value={formData.trip}
                  onChange={(e) => set("trip", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Manali Adventure Package"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Delhi, India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Travel Date</label>
                <input
                  type="text"
                  value={formData.travelDate}
                  onChange={(e) => set("travelDate", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., March 2025"
                />
              </div>

              <div className="md:col-span-2 flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="isApproved"
                    checked={formData.isApproved}
                    onChange={(e) => set("isApproved", e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-300">Approved</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => set("isFeatured", e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-300">Featured</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Review *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.review}
                  onChange={(e) => set("review", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Customer's review..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-md"
              >
                {testimonial ? "Update Testimonial" : "Add Testimonial"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminTestimonials() {
  const router = useRouter();

  const [authLoading, setAuthLoading]             = useState(true);
  const [authenticated, setAuthenticated]         = useState(false);
  const [testimonials, setTestimonials]           = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [filter, setFilter]                       = useState("all");
  const [showForm, setShowForm]                   = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [message, setMessage]                     = useState({ type: "", text: "" });

  // Auto-clear message after 4s
  useEffect(() => {
    if (!message.text) return;
    const t = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    return () => clearTimeout(t);
  }, [message]);

  // ── FIX 2: fetchTestimonials defined BEFORE the useEffect that calls it.
  //    Previously fetchTestimonials was referenced in useEffect before its
  //    useCallback declaration, causing a stale/undefined closure.
  // ─────────────────────────────────────────────────────────────────────────
  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      // Build query — "all" sends no approved param so server returns everything
      const approvedParam =
        filter === "approved" ? "true" :
        filter === "pending"  ? "false" : "";

      const url = approvedParam !== ""
        ? `/api/admin/testimonials?approved=${approvedParam}`
        : "/api/admin/testimonials";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();

      if (json.success) {
        // FIX 3: "featured" filter is client-side — server has no featured param
        const data = filter === "featured"
          ? json.data.filter((t) => t.isFeatured)
          : json.data;
        setTestimonials(data);
      } else {
        setMessage({ type: "error", text: json.message || "Failed to fetch" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch testimonials" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // ── Auth check ────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("ns_admin_token");
        if (!token) { router.push("/admin/login"); return; }

        const response = await fetch("/api/admin/packages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          sessionStorage.removeItem("ns_admin_token");
          sessionStorage.removeItem("ns_admin_email");
          router.push("/admin/login");
          return;
        }

        setAuthenticated(true);
      } catch (err) {
        console.error("[AdminTestimonials] Auth check failed:", err);
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Re-fetch whenever auth succeeds or filter changes
  useEffect(() => {
    if (authenticated) fetchTestimonials();
  }, [authenticated, fetchTestimonials]);

  // ── handleSave (POST & PUT) ───────────────────────────────────────────────
  // FIX 4: PUT uses dynamic URL `/api/admin/testimonials/${id}` with _id in
  //         the path. _id is stripped from the body before sending to avoid
  //         confusion, but the URL correctly targets the right record.
  const handleSave = useCallback(
    async (formData) => {
      try {
        const isEdit = Boolean(formData._id);
        const url    = isEdit
          ? `/api/admin/testimonials/${formData._id}`
          : "/api/admin/testimonials";
        const method = isEdit ? "PUT" : "POST";

        // Strip _id from body for PUT (id is already in the URL)
        const { _id, ...body } = formData;

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(body),
        });

        const json = await res.json();

        if (json.success) {
          setMessage({
            type: "success",
            text: json.message || (isEdit ? "Testimonial updated!" : "Testimonial added!"),
          });
          setShowForm(false);
          setEditingTestimonial(null);
          fetchTestimonials();
        } else {
          setMessage({ type: "error", text: json.message || "Save failed" });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to save testimonial" });
        console.error(err);
      }
    },
    [fetchTestimonials]
  );

  // ── handleDelete ──────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this testimonial?")) return;
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const json = await res.json();

        if (json.success) {
          setMessage({ type: "success", text: "Testimonial deleted successfully" });
          fetchTestimonials();
        } else {
          setMessage({ type: "error", text: json.message || "Delete failed" });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to delete testimonial" });
        console.error(err);
      }
    },
    [fetchTestimonials]
  );

  // ── handleApproveToggle ───────────────────────────────────────────────────
  // FIX 5: Sending only the changed field (isApproved) instead of spreading
  //        the full testimonial object, avoiding accidental field overwrites.
  const handleApproveToggle = useCallback(
    async (testimonial) => {
      try {
        const res = await fetch(`/api/admin/testimonials/${testimonial._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ isApproved: !testimonial.isApproved }),
        });
        const json = await res.json();

        if (json.success) {
          setMessage({
            type: "success",
            text: testimonial.isApproved ? "Testimonial unapproved" : "Testimonial approved",
          });
          fetchTestimonials();
        } else {
          setMessage({ type: "error", text: json.message || "Status update failed" });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to update status" });
        console.error(err);
      }
    },
    [fetchTestimonials]
  );

  // ── openEditForm — _id explicitly preserved ───────────────────────────────
  const openEditForm = useCallback((testimonial) => {
    setEditingTestimonial({ ...testimonial }); // _id is part of the spread
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingTestimonial(null);
  }, []);

  // ── Guards ────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Verifying access...</p>
        </div>
      </div>
    );
  }
  if (!authenticated) return null;

  // ── Derived stats ─────────────────────────────────────────────────────────
  // Stats computed from full unfiltered list is not possible here (we only
  // have the currently-filtered slice), so we fetch all and compute.
  // For accuracy, stats are shown from whatever is in state.
  const stats = {
    total:    testimonials.length,
    approved: testimonials.filter((t) => t.isApproved).length,
    pending:  testimonials.filter((t) => !t.isApproved).length,
    featured: testimonials.filter((t) => t.isFeatured).length,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 bg-slate-950 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Testimonials Manager</h1>
          <p className="text-slate-400">Manage customer reviews and testimonials</p>
        </div>
        <button
          onClick={() => { setEditingTestimonial(null); setShowForm(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",    value: stats.total,    color: "from-blue-500 to-blue-600" },
          { label: "Approved", value: stats.approved, color: "from-green-500 to-green-600" },
          { label: "Pending",  value: stats.pending,  color: "from-yellow-500 to-yellow-600" },
          { label: "Featured", value: stats.featured, color: "from-purple-500 to-purple-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-md border border-slate-700"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white font-bold text-sm mb-2`}>
              {stat.value}
            </div>
            <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all",      label: "All" },
          { key: "approved", label: "Approved" },
          { key: "pending",  label: "Pending Review" },
          { key: "featured", label: "Featured" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === f.key
                ? "bg-amber-500 text-white shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={fetchTestimonials}
          className="ml-auto px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl flex items-center justify-between ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-300"
                : "bg-red-500/10 border border-red-500/30 text-red-300"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: "", text: "" })} className="ml-4 opacity-60 hover:opacity-100">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw size={32} className="animate-spin mx-auto text-amber-500 mb-4" />
            <p className="text-slate-400">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-lg mb-2">No testimonials found</p>
            <p className="text-sm">
              {filter !== "all" ? "Try switching to 'All'" : "Click \"Add Testimonial\" to create one"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  {["Customer", "Review", "Trip", "Rating", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <DefaultAvatar name={t.name || "?"} />
                        <div>
                          <div className="font-medium text-white">{t.name}</div>
                          <div className="text-xs text-slate-400">{t.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300 max-w-xs truncate">{t.review}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">{t.trip}</div>
                      <div className="text-xs text-slate-400">{t.travelDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-white">{t.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            t.isApproved
                              ? "bg-green-900/30 text-green-300"
                              : "bg-yellow-900/30 text-yellow-300"
                          }`}
                        >
                          {t.isApproved ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {t.isApproved ? "Approved" : "Pending"}
                        </span>
                        {t.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveToggle(t)}
                          title={t.isApproved ? "Unapprove" : "Approve"}
                          className={`p-2 rounded-lg transition-colors ${
                            t.isApproved
                              ? "text-green-400 hover:bg-green-900/20"
                              : "text-yellow-400 hover:bg-yellow-900/20"
                          }`}
                        >
                          {t.isApproved ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => openEditForm(t)}
                          title="Edit"
                          className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          title="Delete"
                          className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}