// src/app/api/stats/route.js
// ✅ FIXED: destinations table nahi hai → packages count use karo
import { NextResponse } from "next/server";
import { createSupabaseClient } from "../../lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createSupabaseClient(true);

    const [testimonialsRes, packagesRes, blogsRes, leadsRes] = await Promise.all([
      supabase.from("testimonials").select("rating", { count: "exact" }).eq("is_approved", true),
      supabase.from("packages").select("id,popular", { count: "exact" }),
      supabase.from("blogs").select("id,status", { count: "exact" }),
      supabase.from("search_leads").select("id,status", { count: "exact" }),
    ]);

    const testimonials = testimonialsRes.data ?? [];
    const packages     = packagesRes.data     ?? [];
    const blogs        = blogsRes.data        ?? [];
    const leads        = leadsRes.data        ?? [];

    const avgRating = testimonials.length
      ? (testimonials.reduce((s, t) => s + (t.rating || 0), 0) / testimonials.length).toFixed(1)
      : "0.0";

    return NextResponse.json({
      success: true,
      data: {
        testimonials: {
          total:     testimonialsRes.count ?? 0,
          avgRating: parseFloat(avgRating),
        },
        packages: {
          total:    packagesRes.count ?? 0,
          featured: packages.filter((p) => p.popular).length,
        },
        blogs: {
          total:     blogsRes.count ?? 0,
          published: blogs.filter((b) => b.status === "published").length,
        },
        leads: {
          total:  leadsRes.count ?? 0,
          newLeads: leads.filter((l) => l.status === "new").length,
        },
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[GET /api/stats]", err);
    return NextResponse.json({ success: false, message: "Failed to fetch stats" }, { status: 500 });
  }
}
