"use client";

// ⚡ FCP / LCP FIX
// Loading splash screen content ko 1.2s+ tak opacity:0 ke peeche chhupa rahi thi.
// Browser LCP element (hero image) ko paint nahi kar sakta tha tab tak.
// Solution: splash hata do — content seedha render hoga, FCP/LCP instant.
export default function ClientLoaderWrapper({ children }) {
  return <>{children}</>;
}
