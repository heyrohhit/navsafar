// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// Public client (for frontend, read-approved only)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin/Service client (bypasses RLS, full access)
export function createSupabaseClient(useServiceRole = false) {
  if (useServiceRole && supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey);
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
