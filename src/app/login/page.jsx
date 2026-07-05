"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";
import { createClient } from "../../lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message?.toLowerCase().includes("invalid")
          ? "Email ya password galat hai. Naya account? Neeche 'Sign up' karein."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-[#0B1C2D] px-4 py-24">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0f6477]/10 text-[#0f6477]">
            <LogIn size={24} />
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#0B1C2D]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Apne account me login karke bookings dekhein
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition-all focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition-all focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f6477] px-6 py-3 font-semibold text-white transition-all hover:bg-[#0d7a8a] disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Account nahi hai?{" "}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-[#0f6477] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
