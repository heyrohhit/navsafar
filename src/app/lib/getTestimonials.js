// src/app/lib/getTestimonials.js
import { supabase } from "./supabaseClient";

/**
 * Fetch testimonials from Supabase
 * @param {Object} options - Filter options
 * @param {boolean} options.featured - Only featured testimonials
 * @param {number} options.limit - Number of testimonials to fetch
 * @param {number} options.skip - Number of testimonials to skip (pagination)
 * @param {boolean} options.approvedOnly - Only approved testimonials (default: true)
 * @returns {Promise<Array>} Array of testimonials
 */
export async function getTestimonials({
  featured = false,
  limit = 6,
  skip = 0,
  approvedOnly = true,
}) {
  try {
    let query = supabase
      .from("testimonials")
      .select("*", { count: "exact" })
      .eq("is_approved", true);

    if (featured) {
      query = query.eq("is_featured", true);
    }

    // Sort: featured first, then recent
    query = query
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(skip, skip + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase error fetching testimonials:", error);
      throw error;
    }

    // Transform to frontend format
    const testimonials = (data || []).map((t) => ({
      id: t.id,
      _id: t.id,
      name: t.name,
      avatar: t.avatar || null,
      rating: t.rating,
      review: t.review,
      trip: t.trip,
      location: t.location,
      travelDate: t.travel_date,
      isFeatured: t.is_featured,
      isApproved: t.is_approved,
      createdAt: t.created_at,
    }));

    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return []; // Empty array — component will hide itself
  }
}

/**
 * Get testimonial statistics
 */
export async function getTestimonialStats() {
  try {
    const [totalRes, approvedRes, featuredRes] = await Promise.all([
      supabase.from("testimonials").select("*", { count: "exact" }),
      supabase.from("testimonials").select("*", { count: "exact" }).eq("is_approved", true),
      supabase
        .from("testimonials")
        .select("*", { count: "exact" })
        .eq("is_approved", true)
        .eq("is_featured", true),
    ]);

    const total = totalRes.count || 0;
    const approved = approvedRes.count || 0;
    const featured = featuredRes.count || 0;

    return {
      total,
      approved,
      featured,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
    };
  } catch (error) {
    console.error("Error fetching testimonial stats:", error);
    return { total: 0, approved: 0, featured: 0, approvalRate: 0 };
  }
}