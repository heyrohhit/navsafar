// src/app/admin/contacts/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Contacts Manager — Production Level with Full Features
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Search,
  RefreshCw,
  Trash2,
  Check,
  X,
  Eye,
} from "lucide-react";

const getToken = () =>
  typeof window !== "undefined"
    ? sessionStorage.getItem("ns_admin_token")
    : "";

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

// Status Badge Component
const StatusBadge = ({ status, priority }) => {
  const statusStyles = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    contacted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    resolved: "bg-green-500/20 text-green-400 border-green-500/30",
    closed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  const priorityStyles = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    normal: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {status === "pending" && <Clock size={12} />}
        {status === "contacted" && <Mail size={12} />}
        {status === "resolved" && <Check size={12} />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {priority !== "normal" && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border ${
            priorityStyles[priority] || priorityStyles.normal
          }`}
        >
          {priority === "high" && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>}
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      )}
    </div>
  );
};

// Contact Detail Modal
const ContactDetailModal = ({ contact, onClose, onUpdate, onDelete }) => {
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState(contact);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await apiFetch(`/api/admin/contacts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: formData.id, ...formData }),
      });
      if (res.success) {
        onUpdate(res.data);
        onClose();
      } else {
        alert("Failed to update: " + res.message);
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this contact permanently?")) return;
    try {
      const res = await apiFetch(`/api/admin/contacts?id=${contact.id}`, {
        method: "DELETE",
      });
      if (res.success) {
        onDelete(contact.id);
        onClose();
      } else {
        alert("Failed to delete: " + res.message);
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
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
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-700 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Contact Details
              </h3>
              <p className="text-slate-400 text-sm">
                From {contact.name} ({contact.email || "No email"})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Package Interest
                </label>
                <input
                  type="text"
                  value={formData.packageInterest}
                  onChange={(e) => handleChange("packageInterest", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  placeholder="Which package are they interested in?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-slate-400">
                  Submitted:{" "}
                  {new Date(contact.createdAt || contact.date).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };
}

export default function AdminContacts() {
  const router = useRouter();

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL HOOKS - UNCONDITIONAL (Rules of Hooks)
  // ═══════════════════════════════════════════════════════════════════════════

  // Auth state
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedContact, setSelectedContact] = useState(null);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("ns_admin_token");

        if (!token) {
          router.push("/admin/login");
          return;
        }

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
      } catch (error) {
        console.error("[AdminContacts] Auth check failed:", error);
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch contacts effect
  useEffect(() => {
    if (authenticated) {
      fetchContacts();
    }
  }, [fetchContacts, authenticated]);

  // Memoized functions
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/contacts");
      if (res.success) {
        setContacts(res.data);
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch contacts" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdate = useCallback((updated) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }, []);

  const handleDeleteLocal = useCallback((id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // CONDITIONAL RENDERING (after all hooks)
  // ═══════════════════════════════════════════════════════════════════════════

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      !searchQuery.trim() ||
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: contacts.length,
    pending: contacts.filter((c) => c.status === "pending").length,
    contacted: contacts.filter((c) => c.status === "contacted").length,
    resolved: contacts.filter((c) => c.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
          <p className="text-slate-400 text-sm">
            Manage customer inquiries and messages
          </p>
        </div>
        <button
          onClick={fetchContacts}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-white rounded-xl transition-all"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Pending", value: stats.pending },
          { label: "Contacted", value: stats.contacted },
          { label: "Resolved", value: stats.resolved },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <p className={`text-3xl font-bold text-slate-300 mb-1`}>
              {stat.value}
            </p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, email, or subject..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-300"
              : "bg-red-500/10 border border-red-500/30 text-red-300"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw size={32} className="animate-spin mx-auto text-amber-500 mb-4" />
          <p className="text-slate-400">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl">
          <MessageSquare size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 mb-2">No contacts found</p>
          <p className="text-slate-500 text-sm">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "When customers contact you, they'll appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact, idx) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center text-white font-bold">
                      {contact.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {contact.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {contact.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={12} />
                            {contact.email}
                          </span>
                        )}
                        {contact.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {contact.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-white mb-1">
                      {contact.subject || "No subject"}
                    </h5>
                    <p className="text-slate-300 text-sm line-clamp-2">
                      {contact.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(
                        contact.createdAt || contact.date
                      ).toLocaleDateString()}
                    </span>
                    {contact.packageInterest && (
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-slate-300">
                        Interest: {contact.packageInterest}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={contact.status} priority={contact.priority} />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this contact?"
                          )
                        ) {
                          apiFetch(`/api/admin/contacts?id=${contact.id}`, {
                            method: "DELETE",
                          }).then((res) => {
                            if (res.success) {
                              fetchContacts();
                            } else {
                              alert("Failed: " + res.message);
                            }
                          });
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
          <ContactDetailModal
            contact={selectedContact}
            onClose={() => setSelectedContact(null)}
            onUpdate={handleUpdate}
            onDelete={handleDeleteLocal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
