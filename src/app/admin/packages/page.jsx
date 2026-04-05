// src/app/admin/packages/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

const getToken = () =>
  typeof window !== "undefined"
    ? sessionStorage.getItem("ns_admin_token")
    : "";

// apiFetch — already parses JSON, returns plain object
const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

// ─────────────────────────────────────────────────────────────────────────────
// PackageForm Modal
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "",
  city: "",
  country: "India",
  duration: "",
  rating: 4.5,
  bestTime: "",
  popular: false,
  category: "",
  tourism_type: "",
  famous_attractions: "",
  image: "",
  tagline: "",
  description: "",
  highlights: "",
  activities: "",
};

const PackageForm = ({ package: pkg, onSave, onClose }) => {
  const [formData, setFormData] = useState(pkg || EMPTY_FORM);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex justify-between items-center z-10">
            <h3 className="text-xl font-bold text-white">
              {pkg ? "Edit Package" : "Add New Package"}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Manali Adventure Package"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Manali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., 5N/6D"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleChange("rating", parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Best Time to Visit</label>
                <input
                  type="text"
                  value={formData.bestTime}
                  onChange={(e) => handleChange("bestTime", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., October to June"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <ImageIcon size={20} className="text-slate-400" />
                    <span className="text-sm text-slate-400 truncate flex-1">{formData.image}</span>
                    <a href={formData.image} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Categories (comma-separated)</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., domestic, family, adventure"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Tourism Type (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tourism_type}
                  onChange={(e) => handleChange("tourism_type", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Beach, Cultural, Adventure"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Famous Attractions (comma-separated)</label>
                <input
                  type="text"
                  value={formData.famous_attractions}
                  onChange={(e) => handleChange("famous_attractions", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Beaches, Temples, Mountains"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Short, catchy description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Detailed package description..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Highlights (comma-separated)</label>
                <textarea
                  rows={2}
                  value={formData.highlights}
                  onChange={(e) => handleChange("highlights", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Hotel stays, meals, sightseeing..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Activities (comma-separated)</label>
                <textarea
                  rows={2}
                  value={formData.activities}
                  onChange={(e) => handleChange("activities", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Trekking, sightseeing, water sports..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => handleChange("popular", e.target.checked)}
                    className="w-5 h-5 rounded focus:ring-amber-500 text-amber-600"
                  />
                  <span className="text-slate-300 font-medium">Mark as Popular</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg"
              >
                {pkg ? "Update Package" : "Create Package"}
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
export default function AdminPackages() {
  const router = useRouter();

  const [authLoading, setAuthLoading]       = useState(true);
  const [authenticated, setAuthenticated]   = useState(false);
  const [packages, setPackages]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchQuery, setSearchQuery]       = useState("");
  const [showForm, setShowForm]             = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [message, setMessage]               = useState({ type: "", text: "" });
  const [deleteConfirm, setDeleteConfirm]   = useState(null);

  // Auto-clear message after 4s
  useEffect(() => {
    if (!message.text) return;
    const t = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    return () => clearTimeout(t);
  }, [message]);

  // ── fetchPackages — defined BEFORE the useEffect that calls it ────
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/packages");
      if (res.success) {
        setPackages(res.data);
      } else {
        setMessage({ type: "error", text: res.message || "Failed to fetch packages" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch packages" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auth check ────────────────────────────────────────────────────
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
        console.error("[AdminPackages] Auth check failed:", err);
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (authenticated) fetchPackages();
  }, [authenticated, fetchPackages]);

  // ── Array helper ──────────────────────────────────────────────────
  const processArray = (val, fallback = []) => {
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === "string" && val.trim())
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    return fallback;
  };

  // ── handleSave ────────────────────────────────────────────────────
  // KEY FIX: PUT requires `id` inside the request body (server checks body.id).
  // Previously `delete payload.id` was called unconditionally, so every PUT
  // returned 400 "Field 'id' is required for update."
  const handleSave = useCallback(
    async (formData) => {
      try {
        const isEdit = Boolean(formData.id);
        const method = isEdit ? "PUT" : "POST";

        const payload = {
          // For PUT: include id so server can find the record
          // For POST: omit id so server generates a fresh one
          ...(isEdit && { id: formData.id }),
          title:              formData.title?.trim() || "",
          city:               formData.city?.trim() || "",
          country:            formData.country?.trim() || "",
          duration:           formData.duration?.trim() || "",
          rating:             parseFloat(formData.rating) || 0,
          bestTime:           formData.bestTime?.trim() || "",
          popular:            formData.popular === true || formData.popular === "true",
          image:              formData.image?.trim() || "",
          tagline:            formData.tagline?.trim() || "",
          description:        formData.description?.trim() || "",
          category:           processArray(formData.category),
          tourism_type:       processArray(formData.tourism_type),
          famous_attractions: processArray(formData.famous_attractions),
          highlights:         processArray(formData.highlights),
          activities:         processArray(formData.activities),
        };

        const res = await fetch("/api/admin/packages", {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (json.success) {
          setMessage({
            type: "success",
            text: isEdit ? "Package updated successfully!" : "Package created successfully!",
          });
          setShowForm(false);
          setEditingPackage(null);
          fetchPackages();
        } else {
          setMessage({ type: "error", text: json.message || "Save failed" });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to save package" });
        console.error(err);
      }
    },
    [fetchPackages]
  );

  // ── handleDelete ──────────────────────────────────────────────────
  // apiFetch already returns parsed JSON — no .json() call needed here.
  const handleDelete = useCallback(
    async (id) => {
      try {
        const json = await apiFetch(`/api/admin/packages?id=${id}`, {
          method: "DELETE",
        });

        if (json.success) {
          setMessage({ type: "success", text: "Package deleted successfully!" });
          fetchPackages();
        } else {
          setMessage({ type: "error", text: json.message || "Delete failed" });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to delete package" });
        console.error(err);
      } finally {
        setDeleteConfirm(null);
      }
    },
    [fetchPackages]
  );

  // ── openEditForm ──────────────────────────────────────────────────
  // KEY FIX: `id` is explicitly preserved so handleSave detects isEdit=true
  // and includes id in the PUT body. Previously id was lost in the spread.
  const openEditForm = useCallback((pkg) => {
    setEditingPackage({
      id:                 pkg.id,            // must survive into handleSave
      title:              pkg.title || "",
      city:               pkg.city || "",
      country:            pkg.country || "",
      duration:           pkg.duration || "",
      rating:             pkg.rating ?? 4.5,
      bestTime:           pkg.bestTime || "",
      popular:            pkg.popular || false,
      image:              pkg.image || "",
      tagline:            pkg.tagline || "",
      description:        pkg.description || "",
      category:           Array.isArray(pkg.category)           ? pkg.category.join(", ")           : pkg.category || "",
      tourism_type:       Array.isArray(pkg.tourism_type)       ? pkg.tourism_type.join(", ")       : pkg.tourism_type || "",
      famous_attractions: Array.isArray(pkg.famous_attractions) ? pkg.famous_attractions.join(", ") : pkg.famous_attractions || "",
      highlights:         Array.isArray(pkg.highlights)         ? pkg.highlights.join(", ")         : pkg.highlights || "",
      activities:         Array.isArray(pkg.activities)         ? pkg.activities.join(", ")         : pkg.activities || "",
    });
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingPackage(null);
  }, []);

  // ── Guards ────────────────────────────────────────────────────────
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

  // ── Derived ───────────────────────────────────────────────────────
  const filteredPackages = packages.filter((pkg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      pkg.title?.toLowerCase().includes(q) ||
      pkg.city?.toLowerCase().includes(q) ||
      pkg.country?.toLowerCase().includes(q) ||
      (Array.isArray(pkg.category) && pkg.category.some((c) => c.toLowerCase().includes(q)))
    );
  });

  const stats = {
    total:   packages.length,
    popular: packages.filter((p) => p.popular).length,
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tour Packages</h1>
          <p className="text-slate-400 text-sm">Manage your tour packages and offerings</p>
        </div>
        <button
          onClick={() => { setEditingPackage(null); setShowForm(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg"
        >
          <Plus size={20} />
          Add Package
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",   value: stats.total,   color: "from-blue-500 to-blue-600" },
          { label: "Popular", value: stats.popular, color: "from-amber-500 to-orange-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-2`}>
              <Package size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search packages by name, city, or country..."
          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
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
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw size={32} className="animate-spin mx-auto text-amber-500 mb-4" />
          <p className="text-slate-400">Loading packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl">
          <Package size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 mb-2">No packages found</p>
          <p className="text-slate-500 text-sm">
            {searchQuery ? "Try adjusting your search" : "Add your first package to get started"}
          </p>
        </div>
      ) : (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  {["Package", "Location", "Rating", "Category", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-medium text-slate-400 uppercase ${h === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {pkg.image ? (
                          <img
                            src={
                              pkg.image.includes("drive.google")
                                ? pkg.image.replace("/file/d/", "https://lh3.googleusercontent.com/d/")
                                : pkg.image
                            }
                            alt={pkg.title}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-700 flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-white">{pkg.title}</h4>
                          {pkg.tagline && <p className="text-xs text-slate-400 line-clamp-1">{pkg.tagline}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{pkg.city || "—"}</p>
                      <p className="text-xs text-slate-400">{pkg.country}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="text-white font-medium">{pkg.rating || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(pkg.category) &&
                          pkg.category.slice(0, 2).map((cat) => (
                            <span key={cat} className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-md">
                              {cat}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {pkg.popular && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-md">
                          Popular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(pkg)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(pkg.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
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
        </div>
      )}

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-2">Delete Package?</h3>
              <p className="text-slate-400 mb-6">
                This action cannot be undone. Are you sure you want to delete this package?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      {showForm && (
        <PackageForm
          package={editingPackage}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}