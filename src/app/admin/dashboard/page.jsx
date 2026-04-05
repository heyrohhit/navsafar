// src/app/admin/dashboard/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Dashboard — Complete Overview with Analytics
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Star,
  Package,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  Activity,
  RefreshCw,
} from "lucide-react";

const getToken = () =>
  typeof window !== "undefined"
    ? sessionStorage.getItem("ns_admin_token")
    : "";

const apiFetch = async (url) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export default function AdminDashboard() {
  const router = useRouter();

  // ═══════════════════════════════════════════════════════════════════════════
  // ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP (Rules of Hooks)
  // ═══════════════════════════════════════════════════════════════════════════

  // Auth state
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Dashboard data state
  const [stats, setStats] = useState({
    testimonials: { total: 0, approved: 0, pending: 0, featured: 0 },
    packages: { total: 0, published: 0 },
    contacts: { total: 0, pending: 0 },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Memoized data fetcher
  const fetchAllData = useCallback(async () => {
    try {
      // Fetch testimonials
      const testimonialsRes = await apiFetch("/api/admin/testimonials?limit=100");
      if (testimonialsRes.success) {
        const t = testimonialsRes.data;
        setStats((prev) => ({
          ...prev,
          testimonials: {
            total: t.length,
            approved: t.filter((x) => x.is_approved).length,
            pending: t.filter((x) => !x.is_approved).length,
            featured: t.filter((x) => x.is_featured).length,
          },
        }));
      }

      // Fetch packages
      const packagesRes = await apiFetch("/api/admin/packages");
      if (packagesRes.success) {
        const p = packagesRes.data;
        setStats((prev) => ({
          ...prev,
          packages: {
            total: p.length,
            published: p.length,
          },
        }));
      }

      // Fetch contacts
      const contactsRes = await apiFetch("/api/admin/contacts");
      if (contactsRes.success) {
        const c = contactsRes.data;
        setStats((prev) => ({
          ...prev,
          contacts: {
            total: c.length,
            pending: c.filter((x) => x.status === "pending").length,
          },
        }));

        // Get recent contacts for activity feed
        const recent = c
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
          )
          .slice(0, 5);
        setRecentActivity(recent);
      }
    } catch (error) {
      console.error("[Dashboard] Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auth check effect
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
        console.error("[AdminDashboard] Auth check failed:", error);
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Data fetch effect (only after authenticated)
  useEffect(() => {
    if (authenticated) {
      fetchAllData();
    }
  }, [fetchAllData, authenticated]);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [fetchAllData]);

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

  // StatCard component (can be defined after hooks, before return)
  const StatCard = ({ icon: Icon, label, value, color, subtext, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-4xl font-bold text-white mb-2">{value}</p>
          {subtext && (
            <p className="text-slate-500 text-xs">{subtext}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-green-400 text-xs font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Main content
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400 text-sm">
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-white rounded-xl transition-all disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </motion.button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Contacts"
          value={stats.contacts.total}
          color="from-blue-500 to-blue-600"
          subtext={`${stats.contacts.pending} pending`}
          trend="+12% this week"
        />
        <StatCard
          icon={Star}
          label="Testimonials"
          value={stats.testimonials.total}
          color="from-amber-500 to-orange-600"
          subtext={`${stats.testimonials.approved} approved, ${stats.testimonials.pending} pending`}
          trend={`${stats.testimonials.featured} featured`}
        />
        <StatCard
          icon={Package}
          label="Tour Packages"
          value={stats.packages.total}
          color="from-teal-500 to-cyan-600"
          subtext={`${stats.packages.published} active`}
        />
        <StatCard
          icon={MessageSquare}
          label="Pending Messages"
          value={stats.contacts.pending}
          color="from-purple-500 to-pink-600"
          subtext="Requires attention"
          trend="Action needed"
        />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare size={22} className="text-blue-400" />
              Recent Contacts
            </h2>
            <a
              href="/admin/contacts"
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              View all →
            </a>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
              <p>No contacts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((contact, idx) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {contact.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white truncate">
                        {contact.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          contact.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 truncate">
                      {contact.subject || contact.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(contact.createdAt || contact.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/testimonials"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group"
            >
              <div className="p-3 rounded-lg bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors">
                <Star size={22} className="text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Add Testimonial</h4>
                <p className="text-sm text-slate-400">
                  Create a new customer review
                </p>
              </div>
            </a>

            <a
              href="/admin/packages"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-teal-500/50 transition-all group"
            >
              <div className="p-3 rounded-lg bg-teal-500/20 group-hover:bg-teal-500/30 transition-colors">
                <Package size={22} className="text-teal-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Add Package</h4>
                <p className="text-sm text-slate-400">
                  Create a new tour package
                </p>
              </div>
            </a>

            <a
              href="/admin/contacts"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group"
            >
              <div className="p-3 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <MessageSquare size={22} className="text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Review Contacts</h4>
                <p className="text-sm text-slate-400">
                  Check pending messages
                </p>
              </div>
            </a>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-800/30">
            <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <Activity size={18} />
              System Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">API</span>
                <span className="text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database</span>
                <span className="text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Clock size={12} />
                  Protected
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-2xl p-6 border border-green-800/30">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500/20">
              <CheckCircle size={28} className="text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Approved Testimonials</p>
              <p className="text-3xl font-bold text-green-400">
                {stats.testimonials.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-800/30">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-yellow-500/20">
              <Clock size={28} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Pending Reviews</p>
              <p className="text-3xl font-bold text-yellow-400">
                {stats.testimonials.pending + stats.contacts.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-800/30">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-purple-500/20">
              <Star size={28} className="text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Featured Content</p>
              <p className="text-3xl font-bold text-purple-400">
                {stats.testimonials.featured}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
