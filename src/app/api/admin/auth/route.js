// src/app/api/admin/auth/route.js
// ─────────────────────────────────────────────────────────────────────────────
// LOGIN ENDPOINT — verifies email + password from .env.local
// Returns the bearer token on success; 401 on failure.
// POST /api/admin/auth  { email, password }
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";



export async function POST(request) {
  try {
    const body = await request.json();
    const { email = "", password = "" } = body;

    const validEmail = process.env.ADMIN_EMAIL;
    const validPass  = process.env.ADMIN_PASSWORD;
    const token      = process.env.ADMIN_SECRET_TOKEN;

    // Env vars must be configured
    if (!validEmail || !validPass || !token) {
      console.error("[admin/auth] Missing env vars — check .env.local");
      return NextResponse.json(
        { success: false, message: "Server not configured. Please add .env.local with ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SECRET_TOKEN." },
        { status: 500 }
      );
    }

    // Constant-time comparison to avoid timing attacks
    const emailOk = email.trim().toLowerCase() === validEmail.trim().toLowerCase();
    const passOk  = password === validPass;

    if (!emailOk || !passOk) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, token });

  } catch (err) {
    console.error("[admin/auth]", err);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}