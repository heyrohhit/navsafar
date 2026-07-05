"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2, MailCheck } from "lucide-react";
import { createClient } from "../../lib/supabase/browser";

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });

    if (error) {
      setError(
        error.message?.toLowerCase().includes("already")
          ? "Is email se account already hai. Login karein."
          : error.message
      );
      setLoading(false);
      return;
    }

    // If email confirmation is ON, there is no active session yet.
    if (!data.session) {
      setNeedsConfirm(true);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  if (needsConfirm) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-[#0B1C2D] px-4 py-24">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <MailCheck size={24} />
          </div>
          <h1 className="mb-2 font-['Playfair_Display'] text-2xl font-bold text-[#0B1C2D]">
            Email verify karein
          </h1>
          <p className="text-sm text-gray-600">
            Humne <span className="font-semibold">{email}</span> pe ek confirmation link bheja hai.
            Verify karne ke baad{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-[#0f6477] hover:underline">
              login
            </Link>{" "}
            karein.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-[#0B1C2D] px-4 py-24">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0f6477]/10 text-[#0f6477]">
            <UserPlus size={24} />
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#0B1C2D]">
            Create account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Bookings aur reviews manage karne ke liye account banayein
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition-all focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
              placeholder="Rahul Sharma"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition-all focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
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
              placeholder="Min 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f6477] px-6 py-3 font-semibold text-white transition-all hover:bg-[#0d7a8a] disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            {loading ? "Creating…" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pehle se account hai?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-[#0f6477] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
