"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import("./LoadingScreen"), { ssr: false });

export default function ClientLoaderWrapper({ children }) {
  const [showLoader, setShowLoader] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // Session mein sirf ek baar dikhao
  useEffect(() => {
    const seen = sessionStorage.getItem("ns_loaded");
    if (seen) {
      setShowLoader(false);
      setContentReady(true);
    }
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem("ns_loaded", "1");
    setContentReady(true);
    setTimeout(() => setShowLoader(false), 700);
  }, []);

  return (
    <>
      {/* ✅ FIX: visibility:hidden hata diya — stacking context issues create karta tha
          opacity:0 use karo — portal (popup) pe koi asar nahi padta */}
      <div
        style={{
          opacity: contentReady ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {children}
      </div>

      {showLoader && <LoadingScreen onComplete={handleComplete} />}
    </>
  );
}
