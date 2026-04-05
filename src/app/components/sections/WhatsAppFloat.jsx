// src/app/components/ui/WhatsAppFloat.jsx
// Floating WhatsApp button — always visible, bottom-right corner
"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const WA_NUMBER = "918882128640";
const WA_MSG    = encodeURIComponent("Hi! I'd like to enquire about a travel package.");

export default function WhatsAppFloat() {
  const pathname  = usePathname();
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  // Don't show on admin pages
  useEffect(() => {
    setVisible(!pathname.startsWith("/admin"));
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      {/* Tooltip */}
      {tooltip && (
        <div className="fixed bottom-[80%] sm:bottom-24  right-6 z-[9999] bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap">
          Chat on WhatsApp 💬
          <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
        </div>
      )}

      {/* Main button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="fixed top-[80%] min-[990px]:top-[90%] right-6 z-[9998] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #25d366, #128c7e)",
          boxShadow:  "0 8px 32px rgba(37,211,102,0.45)",
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.672 4.61 1.84 6.51L4 29l7.697-1.82A11.94 11.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 21.9a9.91 9.91 0 01-5.05-1.38l-.36-.21-3.73.88.9-3.64-.23-.37A9.92 9.92 0 016.1 15c0-5.47 4.43-9.9 9.9-9.9 5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.49-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/>
        </svg>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: "rgba(37,211,102,0.6)" }} />
      </a>
    </>
  );
}