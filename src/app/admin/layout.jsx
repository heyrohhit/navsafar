// src/app/admin/layout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Panel Layout — Includes Sidebar & Protected Route
// ─────────────────────────────────────────────────────────────────────────────

import "./globalss.css";
import Sidebar from "../components/admin/Sidebar";

export const metadata = {
  title: "NavSafar Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white antialiased admin-body">
      <Sidebar />
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
