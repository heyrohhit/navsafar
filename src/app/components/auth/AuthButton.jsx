"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { useUser } from "./useUser";
import { createClient } from "../../../lib/supabase/browser";

export default function AuthButton({ compact = false }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-white/20" />;
  }

  if (!user) {
    return (
      <Link href="/login">
        <button className="flex items-center gap-1.5 rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10">
          <LogIn size={16} />
          Login
        </button>
      </Link>
    );
  }

  const label =
    user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Account";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-white/40 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <User size={15} />
        </span>
        {!compact && <span className="max-w-[90px] truncate">{label}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-800">{label}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <LayoutDashboard size={16} /> My Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
