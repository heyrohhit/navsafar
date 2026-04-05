// src/app/admin/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Root — Handles auth check and redirects
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoot() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Auth check - unconditional hook
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("ns_admin_token");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        // Verify token
        const res = await fetch("/api/admin/packages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          sessionStorage.removeItem("ns_admin_token");
          sessionStorage.removeItem("ns_admin_email");
          router.push("/admin/login");
          return;
        }

        setAuthenticated(true);
      } catch (error) {
        console.error("[AdminRoot] Auth check failed:", error);
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Conditional rendering - after all hooks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  // If authenticated, redirect to dashboard
  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-300">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
