"use client";

import { useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function ClientLoaderWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/*
        ✅ opacity:0 instead of visibility:hidden
           - Browser still paints + loads images behind the loader
           - When setLoading(false) → instant opacity:1, zero flash
           - No transition needed — onComplete fires AS loader fades,
             so both cross-fade simultaneously (see LoadingScreen fix)
      */}
      <div style={{ opacity: loading ? 0 : 1 }}>
        {children}
      </div>

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
    </>
  );
}