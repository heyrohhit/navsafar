// src/lib/supabase/middleware.js
// Refreshes the Supabase auth session on every request and returns a response
// whose cookies carry the (possibly rotated) tokens. Called from proxy.js.
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request, response) {
  // Reuse the caller's response (so SEO headers etc. are preserved) or make one.
  const supabaseResponse = response ?? NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() revalidates the token and triggers cookie refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}
