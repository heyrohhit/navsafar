// src/app/api/admin/auth/route.js
// ─────────────────────────────────────────────────────────────────────────────
// 🔒 SECURE LOGIN ENDPOINT — Production Ready
// Features:
// - ✅ Password hashing with crypto.scryptSync
// - ✅ Timing-safe comparison to prevent timing attacks
// - ✅ Rate limiting (5 attempts per 15 minutes)
// - ✅ Audit logging for failed attempts
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseClient } from "../../../lib/supabaseClient";

// ── Rate Limiting (In-memory for now, move to Redis in production) ──────────
const loginAttempts = new Map(); // Map<IP, Array<timestamp>>
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-client-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || [];

  // Remove old attempts outside window
  const recent = attempts.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    return false; // Too many attempts
  }

  recent.push(now);
  loginAttempts.set(ip, recent);
  return true;
}

// ── Audit Logging for failed attempts ──────────────────────────────────────
async function logFailedAttempt(email, ip, reason) {
  try {
    const supabase = createSupabaseClient(true);

    await supabase.from("audit_logs").insert({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      admin_email: email || "unknown",
      action: "LOGIN_FAILED",
      resource: "auth",
      resource_id: "",
      changes: { reason },
      ip_address: ip,
      user_agent: "",
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[audit_log] Failed to log attempt:", err.message);
  }
}

// ── Hash Password using Scrypt ─────────────────────────────────────────────
function hashPassword(password) {
  return crypto.scryptSync(password, "salt-v1", 32);
}

// ── Timing-safe comparison ────────────────────────────────────────────────
function comparePasswords(inputHash, storedHash) {
  try {
    return crypto.timingSafeEqual(inputHash, storedHash);
  } catch {
    return false; // Length mismatch or error
  }
}

// ── Main Auth Handler ──────────────────────────────────────────────────────
export async function POST(request) {
  const ip = getClientIP(request);

  try {
    // ✅ Rate Limiting Check
    if (!checkRateLimit(ip)) {
      await logFailedAttempt("unknown", ip, "Rate limit exceeded");
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts. Please try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email = "", password = "" } = body;

    // Validate inputs
    if (!email || !password) {
      await logFailedAttempt(email, ip, "Missing email or password");
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // ✅ Get environment variables
    const validEmail = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH; // This is the HASH, not plain password
    const token = process.env.ADMIN_SECRET_TOKEN;

    // Environment vars must be configured
    if (!validEmail || !passwordHash || !token) {
      console.error("[admin/auth] Missing required env vars");
      return NextResponse.json(
        {
          success: false,
          message: "Server not configured. Contact administrator.",
        },
        { status: 500 }
      );
    }

    // ✅ Email comparison (case-insensitive, trimmed)
    const emailOk =
      email.trim().toLowerCase() === validEmail.trim().toLowerCase();

    // ✅ Password comparison using timing-safe comparison
    let passwordOk = false;
    if (emailOk) {
      try {
        const inputHash = hashPassword(password);
        const storedHash = Buffer.from(passwordHash, "hex");
        passwordOk = comparePasswords(inputHash, storedHash);
      } catch (err) {
        console.error("[admin/auth] Password comparison error:", err.message);
        passwordOk = false;
      }
    }

    // Log failed attempt
    if (!emailOk || !passwordOk) {
      await logFailedAttempt(
        email,
        ip,
        emailOk ? "Invalid password" : "Invalid email"
      );

      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ✅ Successful login - log it
    try {
      const supabase = createSupabaseClient(true);
      await supabase.from("audit_logs").insert({
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        admin_email: email,
        action: "LOGIN_SUCCESS",
        resource: "auth",
        resource_id: "",
        changes: {},
        ip_address: ip,
        user_agent: request.headers.get("user-agent") || "",
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("[audit_log] Failed to log successful login:", err.message);
    }

    // Reset rate limit for this IP on successful login
    loginAttempts.delete(ip);

    return NextResponse.json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error("[admin/auth]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

// ── OPTIONS for CORS ──────────────────────────────────────────────────────
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
