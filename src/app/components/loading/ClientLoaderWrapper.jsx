// src/app/components/loading/ClientLoaderWrapper.jsx
// Fix: children are rendered (hidden) behind the loading screen so the page
// is fully hydrated by the time the loading screen fades out — no blank flash.
"use client";

import { useState, useLayoutEffect } from "react";
import LoadingScreen from "./LoadingScreen";

export default function ClientLoaderWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  // Lock scroll while loading screen is visible
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  function handleComplete() {
    setLoading(false);
    document.body.style.overflow = "";
  }

  return (
    <>
      {/*
        Children render in background while loading — already hydrated
        when loading screen fades out, so no blank screen flash.
        visibility:hidden keeps it out of view but fully rendered in DOM.
      */}
      <div style={{ visibility: loading ? "hidden" : "visible" }}>
        {children}
      </div>

      {/* Loading screen sits on top until bar hits 100% + fade completes */}
      {loading && <LoadingScreen onComplete={handleComplete} />}
    </>
  );
}