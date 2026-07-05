"use client";
// src/app/components/common/NotFoundRedirect.jsx
// ─────────────────────────────────────────────────────────────
// Client-side "take the visitor back" behaviour for the not-found page.
//
// SEO NOTE: this redirect runs ONLY in the browser (JS). Crawlers still get
// the real 404 + noindex from not-found.jsx, so dead URLs are correctly
// dropped from the index — no soft-404 / SEO harm. Humans get a friendly
// "updating soon" screen that returns them to where they came from.
//
// Target order: in-app history (previous page) → same-origin referrer → home.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundRedirect({ seconds = 6 }) {
  const router = useRouter();
  const [left, setLeft] = useState(seconds);

  const goBack = useCallback(() => {
    if (typeof window === "undefined") return;

    let sameOriginRef = false;
    try {
      sameOriginRef =
        !!document.referrer &&
        new URL(document.referrer).origin === window.location.origin;
    } catch {
      sameOriginRef = false;
    }

    if (window.history.length > 1) {
      router.back(); // previous page in this session
    } else if (sameOriginRef) {
      window.location.href = document.referrer;
    } else {
      router.push("/"); // landed here cold (e.g. from search) → home
    }
  }, [router]);

  useEffect(() => {
    if (left <= 0) {
      goBack();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, goBack]);

  return (
    <div className="mt-8 flex flex-col items-center gap-5">
      <p className="text-sm text-neutral-500" aria-live="polite">
        Aapko wapas le ja rahe hain in{" "}
        <span className="font-bold text-primary-600 tabular-nums">{left}</span>{" "}
        second{left === 1 ? "" : "s"}…
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <ArrowLeft size={18} /> Go back now
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-primary-300 hover:text-primary-600"
        >
          <Home size={18} /> Homepage
        </button>
      </div>
    </div>
  );
}
