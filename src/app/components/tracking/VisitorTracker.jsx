// src/app/components/tracking/VisitorTracker.jsx
// ─────────────────────────────────────────────────────────────
// Silent client component — fires once per page view, sends data to
// /api/track-visitor which writes a row to Google Sheets.
//
// Add to root layout INSIDE SiteShell (or directly in layout.jsx):
//   import VisitorTracker from "./components/tracking/VisitorTracker";
//   <VisitorTracker />
//
// It renders nothing visible. Zero impact on user experience.
// ─────────────────────────────────────────────────────────────
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
  const pathname = usePathname();

  // ✅ Lazy initialization to avoid Date.now() at top-level
  const enterTime = useRef(0);
  const hasFired  = useRef(false);

  useEffect(() => {
    // Assign enter time inside useEffect — safe for client-side only
    enterTime.current = Date.now();
    hasFired.current  = false;

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
          timeOnPage: "-", // sent on page-leave (optional)
        };

        // Fire-and-forget — don't await, errors ignored
        fetch("/api/track-visitor", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // Silent catch — never crash page
      }
    }, 1500); // 1.5s delay — wait for page content

    return () => clearTimeout(timer);
  }, [pathname]);

  // Render nothing — purely invisible
  return null;
}