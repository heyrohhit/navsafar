// src/app/api/stats/route.js
import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

export async function GET() {
  try {
    // Get testimonials stats
    const [
      testimonialsRes,
      packagesRes,
      destinationsRes,
    ] = await Promise.all([
      supabase.from("testimonials").select("*", { count: "exact" }).eq("is_approved", true),
      supabase.from("packages").select("*", { count: "exact" }), // Assuming packages table exists
      supabase.from("destinations").select("*", { count: "exact" }), // Assuming destinations table
    ]);

    const stats = {
      testimonials: {
        total: testimonialsRes.count || 0,
        avgRating: 0, // Will calculate below if we have data
      },
      packages: {
        total: packagesRes.count || 0,
        featured: 0,
      },
      destinations: {
        total: destinationsRes.count || 0,
      },
      updatedAt: new Date().toISOString(),
    };

    // Calculate average rating if we have testimonials
    if (testimonialsRes.data && testimonialsRes.data.length > 0) {
      const totalRating = testimonialsRes.data.reduce((sum, t) => sum + t.rating, 0);
      stats.testimonials.avgRating = (totalRating / testimonialsRes.data.length).toFixed(1);
    }

    // Get featured packages count
    if (packagesRes.data) {
      stats.packages.featured = packagesRes.data.filter(p => p.popular || p.is_featured).length;
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("[GET /api/stats]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
