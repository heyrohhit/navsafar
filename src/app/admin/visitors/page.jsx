// src/app/admin/visitors/page.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  RotateCcw,
  Globe,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  Wifi,
  ExternalLink,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — apna Google Sheet ID yahan daalo (sheet "Anyone with link can view"
// hona chahiye, tabhi yeh CSV endpoint kaam karega)
// ─────────────────────────────────────────────────────────────────────────────
const CSV_URL = "/api/visitors";

// Column order as per the sheet (A → O)
const COLUMNS = [
  "datetime",     // A - Date & Time (IST)
  "page",         // B - Page Visited
  "referrer",     // C - Referrer
  "ip",           // D - IP Address
  "country",      // E - Country
  "state",        // F - State / Region
  "city",         // G - City
  "isp",          // H - ISP / Network
  "device",       // I - Device Type
  "browser",      // J - Browser
  "os",           // K - Operating System
  "resolution",   // L - Screen Resolution
  "language",     // M - Language
  "timezone",     // N - Timezone
  "sessionId",    // O - Session ID
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// Simple RFC4180-ish CSV parser (handles quoted fields with commas/newlines)
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        field = "";
        if (row.some((f) => f !== "")) rows.push(row);
        row = [];
      } else {
        field += c;
      }
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((f) => f !== "")) rows.push(row);
  }
  return rows;
}

// "18/03/2026, 10:02:59 am" -> Date object
function parseDateTime(str) {
  if (!str) return null;
  const m = str.match(
    /(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)/i
  );
  if (!m) return null;
  let [, dd, mm, yyyy, hh, min, ss, ap] = m;
  hh = parseInt(hh, 10);
  if (/pm/i.test(ap) && hh !== 12) hh += 12;
  if (/am/i.test(ap) && hh === 12) hh = 0;
  return new Date(+yyyy, +mm - 1, +dd, hh, +min, +ss);
}

const DeviceIcon = ({ device, size = 14 }) => {
  const d = (device || "").toLowerCase();
  if (d.includes("mobile")) return <Smartphone size={size} />;
  if (d.includes("tablet")) return <Tablet size={size} />;
  return <Monitor size={size} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminVisitors() {
    const router = useRouter();
  const [rawRows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | new | returning
  const [expandedIP, setExpandedIP] = useState(null);

//check auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("ns_admin_token");

        if (!token) {
          router.push("/admin/login");
          return;
        }

      } catch (error) {
        console.error("[AdminDashboard] Auth check failed:", error);
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);


  // ── Fetch + parse sheet ─────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(CSV_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const allRows = parseCSV(text);

      // First row = header, skip it
      const dataRows = allRows.slice(1).map((cols) => {
        const obj = {};
        COLUMNS.forEach((key, i) => (obj[key] = (cols[i] || "").trim()));
        obj.dateObj = parseDateTime(obj.datetime);
        return obj;
      }).filter((r) => r.ip);

      setRawRows(dataRows);
    } catch (err) {
      console.error(err);
      setError(
        "Sheet data load nahi ho payi. Sheet ko 'Anyone with the link can view' set karo, ya apna API endpoint use karo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  // ── Group rows by IP ────────────────────────────────────────────────
  const visitors = useMemo(() => {
    const map = new Map();

    for (const row of rawRows) {
      if (!map.has(row.ip)) {
        map.set(row.ip, {
          ip: row.ip,
          country: row.country,
          state: row.state,
          city: row.city,
          isp: row.isp,
          visits: [],
        });
      }
      const entry = map.get(row.ip);
      entry.visits.push(row);
      // keep latest location info
      entry.country = row.country || entry.country;
      entry.state = row.state || entry.state;
      entry.city = row.city || entry.city;
      entry.isp = row.isp || entry.isp;
    }

    const list = Array.from(map.values()).map((v) => {
      const sorted = [...v.visits].sort(
        (a, b) => (a.dateObj?.getTime() || 0) - (b.dateObj?.getTime() || 0)
      );
      const uniqueSessions = new Set(sorted.map((s) => s.sessionId).filter(Boolean));
      return {
        ...v,
        visits: sorted,
        visitCount: sorted.length,
        sessionCount: uniqueSessions.size || sorted.length,
        firstVisit: sorted[0]?.dateObj || null,
        lastVisit: sorted[sorted.length - 1]?.dateObj || null,
        isReturning: sorted.length > 1,
        repeatVisits: Math.max(sorted.length - 1, 0),
      };
    });

    // newest activity first
    list.sort((a, b) => (b.lastVisit?.getTime() || 0) - (a.lastVisit?.getTime() || 0));
    return list;
  }, [rawRows]);

  // ── Stats ───────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalUnique = visitors.length;
    const newVisitors = visitors.filter((v) => !v.isReturning).length;
    const returningVisitors = visitors.filter((v) => v.isReturning).length;
    const totalRepeatVisits = visitors.reduce((sum, v) => sum + v.repeatVisits, 0);
    const totalPageViews = rawRows.length;

    return {
      totalUnique,
      newVisitors,
      returningVisitors,
      totalRepeatVisits,
      totalPageViews,
    };
  }, [visitors, rawRows]);

  // ── Filter + search ─────────────────────────────────────────────────
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      if (filter === "new" && v.isReturning) return false;
      if (filter === "returning" && !v.isReturning) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.ip.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q) ||
        v.country?.toLowerCase().includes(q) ||
        v.state?.toLowerCase().includes(q) ||
        v.isp?.toLowerCase().includes(q)
      );
    });
  }, [visitors, filter, searchQuery]);

  const fmtDate = (d) =>
    d
      ? d.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Visitor Analytics</h1>
          <p className="text-slate-400 text-sm">
            IP-based unique &amp; returning visitor tracking
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Total Unique Visitors",
            value: stats.totalUnique,
            icon: Users,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "New Visitors",
            value: stats.newVisitors,
            icon: UserPlus,
            color: "from-emerald-500 to-emerald-600",
          },
          {
            label: "Returning Visitors",
            value: stats.returningVisitors,
            icon: RotateCcw,
            color: "from-amber-500 to-orange-600",
          },
          {
            label: "Total Repeat Visits",
            value: stats.totalRepeatVisits,
            icon: RotateCcw,
            color: "from-purple-500 to-purple-600",
          },
          {
            label: "Total Page Views",
            value: stats.totalPageViews,
            icon: Globe,
            color: "from-cyan-500 to-cyan-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-2`}
            >
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
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
            placeholder="Search by IP, city, country, ISP..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: `All (${stats.totalUnique})` },
            { key: "new", label: `New (${stats.newVisitors})` },
            { key: "returning", label: `Returning (${stats.returningVisitors})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f.key
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                  : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw size={32} className="animate-spin mx-auto text-amber-500 mb-4" />
          <p className="text-slate-400">Loading visitor data...</p>
        </div>
      ) : filteredVisitors.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl">
          <Users size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">No visitors found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVisitors.map((v) => (
            <div
              key={v.ip}
              className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden"
            >
              {/* Row header */}
              <button
                onClick={() => setExpandedIP(expandedIP === v.ip ? null : v.ip)}
                className="w-full flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-slate-800/50 transition-colors text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${
                      v.isReturning
                        ? "bg-gradient-to-r from-amber-500 to-orange-600"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                    }`}
                  >
                    <Wifi size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white font-mono text-sm">{v.ip}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                      <MapPin size={12} />
                      {[v.city, v.state, v.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md ${
                      v.isReturning
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {v.isReturning ? "Returning" : "New"}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-slate-700 text-slate-300 rounded-md">
                    {v.visitCount} visit{v.visitCount > 1 ? "s" : ""}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-slate-700 text-slate-300 rounded-md flex items-center gap-1">
                    <Clock size={12} />
                    {fmtDate(v.lastVisit)}
                  </span>
                  {expandedIP === v.ip ? (
                    <ChevronUp size={18} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded activity */}
              <AnimatePresence>
                {expandedIP === v.ip && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-700"
                  >
                    <div className="p-4 space-y-3">
                      {/* meta info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500 text-xs">ISP</p>
                          <p className="text-white">{v.isp || "—"}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">First Visit</p>
                          <p className="text-white">{fmtDate(v.firstVisit)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Last Visit</p>
                          <p className="text-white">{fmtDate(v.lastVisit)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Sessions</p>
                          <p className="text-white">{v.sessionCount}</p>
                        </div>
                      </div>

                      {/* activity timeline */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-slate-500 uppercase">
                              <th className="px-3 py-2">Date &amp; Time</th>
                              <th className="px-3 py-2">Page</th>
                              <th className="px-3 py-2">Referrer</th>
                              <th className="px-3 py-2">Device</th>
                              <th className="px-3 py-2">Browser / OS</th>
                              <th className="px-3 py-2">Session</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {v.visits.map((act, i) => (
                              <tr key={i} className="text-slate-300">
                                <td className="px-3 py-2 whitespace-nowrap">{act.datetime}</td>
                                <td className="px-3 py-2 font-mono text-amber-400">{act.page}</td>
                                <td className="px-3 py-2 max-w-[200px] truncate">
                                  {act.referrer === "Direct" ? (
                                    <span className="text-slate-500">Direct</span>
                                  ) : (
                                    <span className="flex items-center gap-1 truncate">
                                      <ExternalLink size={12} className="flex-shrink-0" />
                                      <span className="truncate">{act.referrer}</span>
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  <span className="flex items-center gap-1">
                                    <DeviceIcon device={act.device} />
                                    {act.device}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {act.browser} / {act.os}
                                </td>
                                <td className="px-3 py-2 font-mono text-xs text-slate-500 truncate">
                                  {act.sessionId}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}