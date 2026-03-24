"use client";

import { useState, useLayoutEffect } from "react";
import LoadingScreen from "./LoadingScreen";

export default function ClientLoaderWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  // Lock scroll while loading
  useLayoutEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  function handleComplete() {
    // remove any extra delay — instant switch after fade
    setLoading(false);
  }

  return (
    <>
      {/* Pre-rendered content (no flash) */}
      <div
        style={{
          visibility: loading ? "hidden" : "visible",
        }}
      >
        {children}
      </div>

      {/* Loader */}
      {loading && <LoadingScreen onComplete={handleComplete} />}
    </>
  );
}