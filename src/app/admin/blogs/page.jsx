"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { parseFaqText } from "../../../lib/parseFaqText";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  Image as ImageIcon,
  Eye,
} from "lucide-react";

const getToken = () => (typeof window !== "undefined" ? sessionStorage.getItem("ns_admin_token") : "");

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

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "Travel",
  tags: "",
  coverImage: "",
  authorName: "Navsafar Travels",
  authorAvatar: "/assets/logo.jpeg",
  authorDesignation: "Senior Travel Writer",
  publishedAt: new Date().toISOString().slice(0, 10),
  readTime: "6 min read",
  featured: false,
  status: "published",
  excerpt: "",
  intro: "",
  highlights: "",
  tips: "",
  itinerary: "",
  faqText: "Q: What is included in this tour?\nA: Hotels, transfers, sightseeing, activities and 24/7 support can be customised as per your package.\n\nQ: Can I customise the itinerary?\nA: Yes, NavSafar tailors the itinerary according to your dates, budget, group size and travel preferences.",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function parseLines(value) {
  return String(value || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseItinerary(value) {
  const text = String(value || "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  function parsePipeLine(line) {
    if (!line.includes("|")) return null;
    const [rawDay = "", rawTitle = "", ...rawDescription] = line.split("|");
    const day = rawDay.trim().replace(/^Day\s*/i, "");
    const title = rawTitle.trim();
    const description = rawDescription.join("|").trim();

    if (!title && !description) return null;
    return {
      day,
      title: title || (day ? `Day ${day}` : "Itinerary"),
      description,
    };
  }

  function parseHeading(line) {
    const match = line.match(/^(Day\s*\d+(?:\s*[-–]\s*\d+)?|\d+(?:\s*[-–]\s*\d+)?)\s*[:\-–]\s*(.*)$/i);
    if (!match || !match[2].trim()) return null;

    return {
      day: match[1].trim(),
      title: match[2].trim(),
      description: "",
    };
  }

  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const items = [];
  let currentItem = null;

  lines.forEach((line) => {
    const pipeItem = parsePipeLine(line);
    const headingItem = parseHeading(line);
    const parsedItem = pipeItem || headingItem;

    if (parsedItem) {
      if (currentItem) items.push(currentItem);
      currentItem = parsedItem;
      return;
    }

    if (currentItem) {
      currentItem.description = [currentItem.description, line].filter(Boolean).join(" ");
    } else {
      const title = line.replace(/^[-*•]\s*/, "").trim();
      if (title) items.push({ day: "", title, description: "" });
    }
  });

  if (currentItem) items.push(currentItem);
  return items.filter((item) => item.title);
}

function buildStructuredContent(formData) {
  return {
    intro: formData.intro?.trim() || formData.excerpt?.trim() || "",
    highlights: parseLines(formData.highlights),
    tips: parseLines(formData.tips),
    itinerary: parseItinerary(formData.itinerary),
    faq: parseFaqText(formData.faqText),
    itineraryText: formData.itinerary || "",
    faqText: formData.faqText || "",
  };
}

function ImagePreview({ src, title }) {
  if (!src) return null;
  return (
    <div className="md:col-span-2 flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
        <Image src={src} alt={title || "Blog cover preview"} fill className="object-cover" unoptimized />
      </div>
      <span className="text-sm text-slate-400 truncate flex-1">{src}</span>
      <a href={src} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
        <ExternalLink size={16} />
      </a>
    </div>
  );
}

function BlogForm({ blog, onSave, onClose }) {
  const [formData, setFormData] = useState(blog || EMPTY_FORM);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

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
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex justify-between items-center z-10">
            <div>
              <h3 className="text-xl font-bold text-white">{blog ? "Edit Blog" : "Add New Blog"}</h3>
              <p className="text-slate-400 text-sm">Store is src/data/blogsData.json — no database required.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Blog Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Best Places to Visit in Manali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(event) => handleChange("slug", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="best-places-to-visit-in-manali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(event) => handleChange("category", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Travel, Tips, India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Published At</label>
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(event) => handleChange("publishedAt", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Read Time</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(event) => handleChange("readTime", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="6 min read"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(event) => handleChange("featured", event.target.checked)}
                    className="w-5 h-5 rounded focus:ring-amber-500 text-amber-600"
                  />
                  <span className="text-slate-300 font-medium">Featured</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(event) => handleChange("tags", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Manali, Himalaya, Family Trip"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(event) => handleChange("coverImage", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="https://example.com/cover.jpg"
                />
                <ImagePreview src={formData.coverImage} title={formData.title} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Author Name</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(event) => handleChange("authorName", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Author Designation</label>
                <input
                  type="text"
                  value={formData.authorDesignation}
                  onChange={(event) => handleChange("authorDesignation", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Author Avatar URL</label>
                <input
                  type="text"
                  value={formData.authorAvatar}
                  onChange={(event) => handleChange("authorAvatar", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.excerpt}
                  onChange={(event) => handleChange("excerpt", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Short summary for blog cards and SEO description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Intro / Opening Paragraph *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.intro}
                  onChange={(event) => handleChange("intro", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Write a compelling non-HTML opening paragraph for this blog."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Key Highlights (one per line)</label>
                <textarea
                  rows={4}
                  value={formData.highlights}
                  onChange={(event) => handleChange("highlights", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Top attraction&#10;Local experience&#10;Best photo spot"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Traveller Tips (one per line)</label>
                <textarea
                  rows={4}
                  value={formData.tips}
                  onChange={(event) => handleChange("tips", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Carry comfortable walking shoes&#10;Book popular stays early&#10;Keep buffer time between sightseeing stops"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Itinerary (optional, one per line)</label>
                <textarea
                  rows={6}
                  value={formData.itinerary}
                  onChange={(event) => handleChange("itinerary", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                  placeholder="1 | Arrival and city walk | Meet the driver and enjoy a relaxed evening.&#10;2 | Top sightseeing | Visit major attractions with a local guide."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">FAQs (Q/A format)</label>
                <textarea
                  rows={8}
                  required
                  value={formData.faqText}
                  onChange={(event) => handleChange("faqText", event.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                  placeholder="Q: What is included in this tour?&#10;A: Hotels, transfers, sightseeing and support can be customised.&#10;&#10;Q: Can I customise the itinerary?&#10;A: Yes, the itinerary can be tailored to your dates and budget."
                />
                <p className="text-slate-500 text-xs mt-2">
                  No HTML is needed. Use plain text, one highlight/tip per line and FAQs in Q:/A: format.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
              <button type="button" onClick={onClose} className="px-6 py-3 text-slate-300 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg"
              >
                {blog ? "Update Blog" : "Create Blog"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminBlogs() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!message.text) return undefined;
    const timer = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/blogs");
      if (res.success) setBlogs(res.data);
      else setMessage({ type: "error", text: res.message || "Failed to fetch blogs" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch blogs" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("ns_admin_token");
        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch("/api/admin/blogs", {
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
        console.error("[AdminBlogs] Auth check failed:", err);
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (authenticated) fetchBlogs();
  }, [authenticated, fetchBlogs]);

  const processArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim()) return value.split(",").map((item) => item.trim()).filter(Boolean);
    return [];
  };

  const handleSave = useCallback(
    async (formData) => {
      try {
        const isEdit = Boolean(formData.id);
        const payload = {
          ...(isEdit && { id: formData.id }),
          title: formData.title?.trim() || "",
          slug: formData.slug?.trim() || "",
          category: formData.category?.trim() || "Travel",
          tags: processArray(formData.tags),
          coverImage: formData.coverImage?.trim() || "",
          author: {
            name: formData.authorName?.trim() || "Navsafar Travels",
            avatar: formData.authorAvatar?.trim() || "/assets/logo.jpeg",
            designation: formData.authorDesignation?.trim() || "Senior Travel Writer",
          },
          publishedAt: formData.publishedAt || new Date().toISOString().slice(0, 10),
          readTime: formData.readTime?.trim() || "6 min read",
          featured: formData.featured === true,
          status: formData.status || "published",
          excerpt: formData.excerpt?.trim() || "",
          intro: formData.intro?.trim() || "",
          highlights: formData.highlights || "",
          tips: formData.tips || "",
          itinerary: formData.itinerary || "",
          faqText: formData.faqText || "",
          structuredContent: buildStructuredContent(formData),
          content: "",
        };

        const res = await fetch("/api/admin/blogs", {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (json.success) {
          setMessage({ type: "success", text: isEdit ? "Blog updated successfully!" : "Blog created successfully!" });
          setShowForm(false);
          setEditingBlog(null);
          fetchBlogs();
        } else {
          setMessage({ type: "error", text: json.message || "Save failed" });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to save blog" });
        console.error(err);
      }
    },
    [fetchBlogs]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        const json = await apiFetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
        if (json.success) {
          setMessage({ type: "success", text: "Blog deleted successfully!" });
          fetchBlogs();
        } else {
          setMessage({ type: "error", text: json.message || "Delete failed" });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to delete blog" });
        console.error(err);
      } finally {
        setDeleteConfirm(null);
      }
    },
    [fetchBlogs]
  );

  const openEditForm = useCallback((blog) => {
    setEditingBlog({
      id: blog.id,
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || "Travel",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      coverImage: blog.coverImage || "",
      authorName: blog.author?.name || "Navsafar Travels",
      authorAvatar: blog.author?.avatar || "/assets/logo.jpeg",
      authorDesignation: blog.author?.designation || "Senior Travel Writer",
      publishedAt: (blog.publishedAt || "").slice(0, 10),
      readTime: blog.readTime || "6 min read",
      featured: blog.featured === true,
      status: blog.status || "published",
      excerpt: blog.excerpt || "",
      intro: blog.structuredContent?.intro || "",
      highlights: Array.isArray(blog.structuredContent?.highlights)
        ? blog.structuredContent.highlights.join("\n")
        : blog.structuredContent?.highlightsText || "",
      tips: Array.isArray(blog.structuredContent?.tips)
        ? blog.structuredContent.tips.join("\n")
        : blog.structuredContent?.tipsText || "",
      itinerary: blog.structuredContent?.itineraryText || (Array.isArray(blog.structuredContent?.itinerary)
        ? blog.structuredContent.itinerary.map((item) => `${item.day || ""} | ${item.title || ""} | ${item.description || ""}`).join("\n")
        : ""),
      faqText: blog.structuredContent?.faqText || (Array.isArray(blog.structuredContent?.faq)
        ? blog.structuredContent.faq.map((item) => `Q: ${item.q}\nA: ${item.a}`).join("\n\n")
        : ""),
      content: blog.content || "",
    });
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingBlog(null);
  }, []);

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

  const filteredBlogs = blogs.filter((blog) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [
      blog.title,
      blog.category,
      blog.excerpt,
      blog.status,
      ...(Array.isArray(blog.tags) ? blog.tags : []),
    ].join(" ").toLowerCase().includes(q);
  });

  const stats = {
    total: blogs.length,
    published: blogs.filter((blog) => blog.status === "published").length,
    featured: blogs.filter((blog) => blog.featured).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blogs</h1>
          <p className="text-slate-400 text-sm">Create, update, delete and publish travel stories without a database.</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg"
        >
          <Plus size={20} />
          Add Blog
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "from-blue-500 to-blue-600" },
          { label: "Published", value: stats.published, color: "from-emerald-500 to-emerald-600" },
          { label: "Featured", value: stats.featured, color: "from-amber-500 to-orange-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-2`}>
              <FileText size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search blogs by title, category, tag or status..."
          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

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

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw size={32} className="animate-spin mx-auto text-amber-500 mb-4" />
          <p className="text-slate-400">Loading blogs...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl">
          <FileText size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 mb-2">No blogs found</p>
          <p className="text-slate-500 text-sm">{searchQuery ? "Try adjusting your search" : "Add your first blog to get started"}</p>
        </div>
      ) : (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  {["Blog", "Category", "Status", "Updated", "Actions"].map((header) => (
                    <th key={header} className={`px-6 py-4 text-xs font-medium text-slate-400 uppercase ${header === "Actions" ? "text-right" : "text-left"}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {blog.coverImage ? (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-white">{blog.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-md">{blog.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-md ${blog.status === "published" ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-600 text-slate-300"}`}>
                          {blog.status}
                        </span>
                        {blog.featured && <span className="px-2 py-1 text-xs bg-amber-500/10 text-amber-300 rounded-md">Featured</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{formatDate(blog.updatedAt || blog.publishedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                          title="View on site"
                        >
                          <Eye size={18} />
                        </Link>
                        <button onClick={() => openEditForm(blog)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => setDeleteConfirm(blog.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
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

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-2">Delete Blog?</h3>
              <p className="text-slate-400 mb-6">This action cannot be undone. Are you sure you want to delete this blog?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2 text-slate-300 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && <BlogForm blog={editingBlog} onSave={handleSave} onClose={closeForm} />}
    </div>
  );
}
