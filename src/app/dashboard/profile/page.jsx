"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, CheckCircle2 } from "lucide-react";
import { createClient } from "../../../lib/supabase/browser";

export default function ProfilePage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [email, setEmail]     = useState("");
  const [fullName, setName]   = useState("");
  const [phone, setPhone]     = useState("");
  const [city, setCity]       = useState("");
  const [avatar, setAvatar]   = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/dashboard/profile");
        return;
      }
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setName(profile.full_name || user.user_metadata?.full_name || "");
        setPhone(profile.phone || "");
        setCity(profile.city || "");
        setAvatar(profile.avatar || "");
      } else {
        setName(user.user_metadata?.full_name || "");
      }
      setLoading(false);
    })();
  }, [supabase, router]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Upsert (row shayad trigger se bana ho, warna insert)
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      phone,
      city,
      avatar,
      updated_at: new Date().toISOString(),
    });

    // Auth metadata bhi sync karo taaki header/dashboard me naam update ho
    await supabase.auth.updateUser({ data: { full_name: fullName, phone } });

    setSaving(false);

    if (error) {
      setError(error.message || "Profile update nahi hua.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[#0f6477]" size={32} />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#0f6477]">
          <ArrowLeft size={16} /> Dashboard
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-1 font-['Playfair_Display'] text-3xl font-bold text-[#0B1C2D]">Edit Profile</h1>
          <p className="mb-6 text-sm text-gray-600">Apni details update karein</p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          {saved && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 size={16} /> Profile save ho gaya!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email" value={email} disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-400">Email change nahi ho sakta</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text" value={fullName} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
                placeholder="Rahul Sharma"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mobile Number</label>
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">City</label>
              <input
                type="text" value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
                placeholder="Delhi"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Avatar URL</label>
              <input
                type="url" value={avatar} onChange={(e) => setAvatar(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-[#0f6477] focus:ring-2 focus:ring-[#0f6477]/20"
                placeholder="https://…/photo.jpg"
              />
            </div>

            <button
              type="submit" disabled={saving}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#0f6477] px-6 py-3 font-semibold text-white hover:bg-[#0d7a8a] disabled:opacity-60"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
