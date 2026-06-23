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
  Clock, // ✅ FIX 1: Clock was missing from imports
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
          {priority === "high" && (
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
          )}
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      )}
    </div>
  );
};

// Contact Detail Modal
// ✅ FIX 2: Component closing bracket was broken — extra `}` removed, proper structure restored
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
          <button onClick={onClose} className="text-slate-400 hover:text-white">
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

export default function AdminContacts() {
  const router = useRouter();

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL HOOKS - UNCONDITIONAL (Rules of Hooks)
  // ═══════════════════════════════════════════════════════════════════════════

  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [searchLeads, setSearchLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("contacts");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedContact, setSelectedContact] = useState(null);

  // ✅ FIX 3: fetchContacts defined with useCallback BEFORE the useEffect that depends on it
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const [contactsRes, leadsRes] = await Promise.all([
        apiFetch("/api/admin/contacts"),
        apiFetch("/api/search-lead"),
      ]);
      if (contactsRes.success) {
        // Split: contacts = non-search_lead entries; searchLeads = search_lead entries
        const all = contactsRes.data || [];
        setContacts(all.filter((c) => c.type !== "search_lead"));
        setSearchLeads(leadsRes.success ? leadsRes.data : all.filter((c) => c.type === "search_lead"));
      } else {
        setMessage({ type: "error", text: contactsRes.message });
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

  // Fetch contacts after auth
  useEffect(() => {
    if (authenticated) {
      fetchContacts();
    }
  }, [fetchContacts, authenticated]);

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
    searchLeads: searchLeads.length,
    newLeads: searchLeads.filter((l) => l.status === "new").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contacts & Leads</h1>
          <p className="text-slate-400 text-sm">
            Manage customer inquiries, search leads and messages
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-0">
        {[
          { key: "contacts", label: "Contact Messages", count: stats.total },
          { key: "leads",    label: "Search Leads",    count: stats.searchLeads, badge: stats.newLeads },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? "border-amber-500 text-amber-400 bg-slate-800/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
            <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">{tab.count}</span>
            {tab.badge > 0 && (
              <span className="bg-amber-500 text-slate-900 text-xs px-1.5 py-0.5 rounded-full font-bold animate-pulse">{tab.badge} new</span>
            )}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(activeTab === "contacts"
          ? [
              { label: "Total",     value: stats.total     },
              { label: "Pending",   value: stats.pending   },
              { label: "Contacted", value: stats.contacted },
              { label: "Resolved",  value: stats.resolved  },
            ]
          : [
              { label: "Total Leads",  value: stats.searchLeads },
              { label: "New Leads",    value: stats.newLeads    },
              { label: "With Email",   value: searchLeads.filter((l) => l.email).length },
              { label: "With Dates",   value: searchLeads.filter((l) => l.travelDate).length },
            ]
        ).map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <p className="text-3xl font-bold text-slate-300 mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters — contacts tab only */}
      {activeTab === "contacts" && <div className="flex flex-col md:flex-row gap-4">
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
      }
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
          <RefreshCw
            size={32}
            className="animate-spin mx-auto text-amber-500 mb-4"
          />
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
        activeTab === "contacts" ? (
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
                  <StatusBadge
                    status={contact.status}
                    priority={contact.priority}
                  />
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
        ) : null
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

      {/* ── SEARCH LEADS TAB ──────────────────────────────────── */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          {searchLeads.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">No search leads yet</p>
              <p className="text-sm mt-1">Leads appear here when users submit the search popup form</p>
            </div>
          ) : (
            <>
              {/* Export CSV button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const headers = ["Name","Email","Mobile","From","Destination","Travel Date","Persons","Date","Status"];
                    const rows = searchLeads.map((l) => [
                      `${l.firstName} ${l.lastName}`.trim(),
                      l.email || "",
                      l.mobile || "",
                      l.from || "",
                      l.destination || "",
                      l.travelDate || "",
                      l.persons || "",
                      l.date || "",
                      l.status || "",
                    ]);
                    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url  = URL.createObjectURL(blob);
                    const a    = document.createElement("a");
                    a.href = url; a.download = `navsafar-leads-${new Date().toISOString().split("T")[0]}.csv`;
                    a.click(); URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 rounded-xl text-sm font-medium transition-all"
                >
                  ↓ Export CSV
                </button>
              </div>

              {/* Leads table */}
              <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <tr>
                      {["Name","Mobile","Email","From","Destination","Travel Date","Persons","Date","Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                      ))}
                      <th className="px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {searchLeads.map((lead, idx) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="bg-slate-800/30 hover:bg-slate-700/40 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(lead.firstName?.[0] || "?").toUpperCase()}
                            </div>
                            {lead.firstName} {lead.lastName}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <a href={`tel:${lead.mobile}`} className="hover:text-amber-400 transition-colors">{lead.mobile}</a>
                        </td>
                        <td className="px-4 py-3 text-slate-400 max-w-[160px] truncate">
                          {lead.email ? (
                            <a href={`mailto:${lead.email}`} className="hover:text-amber-400 transition-colors">{lead.email}</a>
                          ) : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{lead.from || "—"}</td>
                        <td className="px-4 py-3 text-white font-medium">{lead.destination || "—"}</td>
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{lead.travelDate || "—"}</td>
                        <td className="px-4 py-3 text-center text-slate-300">{lead.persons || 1}</td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">{lead.date}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                            lead.status === "new"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                          }`}>
                            {lead.status || "new"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              if (confirm("Delete this lead?")) {
                                apiFetch(`/api/search-lead?id=${lead.id}`, { method: "DELETE" })
                                  .then((res) => { if (res.success) fetchContacts(); });
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}