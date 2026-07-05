// src/app/admin/bookings/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Trash2, MapPin, Calendar, Users, Phone, Plane } from "lucide-react";

const getToken = () =>
  typeof window !== "undefined" ? sessionStorage.getItem("ns_admin_token") || "" : "";

const STATUSES = ["enquiry", "confirmed", "completed", "cancelled"];
const STATUS_STYLE = {
  enquiry:   "bg-yellow-900/30 text-yellow-300",
  confirmed: "bg-blue-900/30 text-blue-300",
  completed: "bg-green-900/30 text-green-300",
  cancelled: "bg-red-900/30 text-red-300",
};

export default function AdminBookings() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [authed, setAuthed]           = useState(false);
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("all");
  const [msg, setMsg]                 = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/admin/bookings" : `/api/admin/bookings?status=${filter}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
      const json = await res.json();
      if (json.success) setBookings(json.data);
      else setMsg(json.message || "Failed to load");
    } catch (e) {
      setMsg("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem("ns_admin_token");
      if (!token) { router.push("/admin/login"); return; }
      const res = await fetch("/api/admin/packages", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { sessionStorage.removeItem("ns_admin_token"); router.push("/admin/login"); return; }
      setAuthed(true);
      setAuthLoading(false);
    })();
  }, [router]);

  useEffect(() => { if (authed) fetchBookings(); }, [authed, fetchBookings]);

  async function changeStatus(id, status) {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ id, status }),
    });
    const json = await res.json();
    if (json.success) { setMsg("Status updated"); fetchBookings(); }
    else setMsg(json.message || "Update failed");
  }

  async function remove(id) {
    if (!confirm("Delete this booking?")) return;
    const res = await fetch(`/api/admin/bookings?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const json = await res.json();
    if (json.success) { setMsg("Deleted"); fetchBookings(); }
    else setMsg(json.message || "Delete failed");
  }

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <RefreshCw className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }
  if (!authed) return null;

  return (
    <div className="min-h-screen space-y-6 bg-slate-950 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold text-white">
            <Plane size={26} className="text-amber-500" /> Bookings Manager
          </h1>
          <p className="text-slate-400">User bookings aur enquiries manage karein</p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 font-medium capitalize transition-all ${
              filter === f ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {msg && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-300">{msg}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/30">
        {loading ? (
          <div className="p-8 text-center text-slate-400">
            <RefreshCw size={28} className="mx-auto mb-3 animate-spin text-amber-500" /> Loading…
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  {["Customer", "Trip", "Details", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{b.full_name || "—"}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Phone size={11} /> {b.phone || "—"}
                      </div>
                      {b.email && <div className="text-xs text-slate-500">{b.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-white">
                        <MapPin size={13} /> {b.destination || "Custom Trip"}
                      </div>
                      {b.departure_city && <div className="text-xs text-slate-400">from {b.departure_city}</div>}
                      {b.trip_category && <div className="text-xs text-slate-500">{b.trip_category}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      {b.travel_date && <div className="flex items-center gap-1"><Calendar size={11} /> {b.travel_date}</div>}
                      {b.travellers ? <div className="flex items-center gap-1"><Users size={11} /> {b.travellers}</div> : null}
                      {b.budget && <div>💰 {b.budget}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[b.status] || "bg-slate-700 text-slate-300"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={b.status}
                          onChange={(e) => changeStatus(b.id, e.target.value)}
                          className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => remove(b.id)}
                          title="Delete"
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
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
    </div>
  );
}
