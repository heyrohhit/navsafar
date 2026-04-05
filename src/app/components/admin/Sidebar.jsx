// src/app/components/admin/Sidebar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Sidebar Navigation — Production Level with Active States
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: Star,
    description: "Customer reviews",
  },
  {
    name: "Packages",
    href: "/admin/packages",
    icon: Package,
    description: "Manage tour packages",
  },
  {
    name: "Contacts",
    href: "/admin/contacts",
    icon: MessageSquare,
    description: "Customer inquiries",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem("ns_admin_token");
      sessionStorage.removeItem("ns_admin_email");
      router.push("/admin/login");
    }
  };

  const NavItem = ({ item }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <motion.a
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          router.push(item.href);
          setMobileMenuOpen(false);
        }}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2
          ${
            isActive
              ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10"
              : "text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent"
          }
        `}
      >
        <Icon size={20} className={isActive ? "text-amber-400" : ""} />
        <div className="flex-1">
          <div className="font-medium text-sm">{item.name}</div>
          <div className="text-xs text-slate-500 hidden lg:block">
            {item.description}
          </div>
        </div>
      </motion.a>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl text-white"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Package size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">NavSafar</h2>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </motion.button>
        </div>
      </div>
    </>
  );
}
