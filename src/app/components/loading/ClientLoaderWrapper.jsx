"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import("./LoadingScreen"), { ssr: false });

export default function ClientLoaderWrapper({ children }) {
  const [showLoader, setShowLoader] = useState(true);

  // Session mein sirf ek baar dikhao
  useEffect(() => {
    if (sessionStorage.getItem("ns_loaded")) {
      setShowLoader(false);
    }
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem("ns_loaded", "1");
    setTimeout(() => setShowLoader(false), 700);
  }, []);

  return (
    <>
      {/* ✅ FIX: Content ab HAMESHA visible hai (opacity:1) — pehle opacity:0 se
          gate hota tha jisse loader khatam hone tak poori site invisible thi
          (slow feel + high bounce). Ab real content turant paint hota hai aur
          loader sirf ek fixed overlay hai jo upar se fade-out hota hai. */}
      <div>{children}</div>

      {showLoader && <LoadingScreen onComplete={handleComplete} />}
    </>
  );
}
