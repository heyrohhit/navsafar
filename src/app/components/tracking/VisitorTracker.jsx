// src/app/components/tracking/VisitorTracker.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Silent client component — fires once per page view, sends data to
// /api/track-visitor which writes a row to Google Sheets.
//
// Add to root layout INSIDE SiteShell (or directly in layout.jsx):
//   import VisitorTracker from "./components/tracking/VisitorTracker";
//   <VisitorTracker />
//
// It renders nothing visible. Zero impact on user experience.
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useEffect, useRef } from "react";
import { usePathname }       from "next/navigation";

// ── Tiny session-id generator (stays same for browser tab lifetime) ──────────
function getSessionId() {
  if (typeof window === "undefined") return "-";
  const key = "ns_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function VisitorTracker() {
  const pathname    = usePathname();
  const enterTime   = useRef(Date.now());
  const hasFired    = useRef(false);

  useEffect(() => {
    // Reset timer on every route change
    enterTime.current = Date.now();
    hasFired.current  = false;

    // Small delay — let page render first, don't compete with critical resources
    const timer = setTimeout(async () => {
      if (hasFired.current) return;
      hasFired.current = true;

      try {
        const payload = {
          page:       pathname,
          referrer:   document.referrer || "Direct",
          screenW:    window.screen.width,
          screenH:    window.screen.height,
          language:   navigator.language || "-",
          timezone:   Intl.DateTimeFormat().resolvedOptions().timeZone || "-",
          sessionId:  getSessionId(),
          timeOnPage: "-", // sent on page-leave (see below)
        };

        // Fire-and-forget — don't await, don't show errors to user
        fetch("/api/track-visitor", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
          // keepalive: send even if page is unloading
          keepalive: true,
        }).catch(() => {}); // swallow any network errors silently
      } catch {
        // Never throw — tracking must never break the site
      }
    }, 1500); // 1.5s delay — page content loads first

    return () => clearTimeout(timer);
  }, [pathname]);

  // Render nothing — purely invisible
  return null;
}