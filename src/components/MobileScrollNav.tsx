"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Minimal back-to-top button for mobile.
 * Appears after scrolling ~600px. Sits above the forex ticker.
 * Inspired by iOS scroll-to-top affordance — small, quiet, out of the way.
 */
export default function MobileScrollNav() {
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 600);
          ticking.current = false;
        });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`
        fixed bottom-[48px] right-4 z-50 sm:hidden
        w-9 h-9 rounded-full
        bg-black/70 backdrop-blur-md
        shadow-[0_2px_8px_rgba(0,0,0,0.3)]
        flex items-center justify-center
        active:scale-90 transition-all duration-200
      `}
    >
      <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
