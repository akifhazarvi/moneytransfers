"use client";

import { useEffect } from "react";

// Intercepts all /go/ link clicks and appends ?ai_src=<platform> when the
// session originated from an AI assistant (ChatGPT, Copilot, Perplexity, etc).
// The source is already stored in sessionStorage as `first_ai_src` by the
// GTAG_INLINE bootstrap in layout.tsx — this just forwards it to the server
// route so provider_clicked_server can log it in GA4.
export default function AiSourceInjector() {
  useEffect(() => {
    let aiSrc: string | null = null;
    try { aiSrc = sessionStorage.getItem("first_ai_src"); } catch { /* unavailable */ }

    if (!aiSrc) return;

    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || !href.includes("/go/")) return;

      let aiSrcNow: string | null = null;
      try { aiSrcNow = sessionStorage.getItem("first_ai_src"); } catch { /* unavailable */ }
      if (!aiSrcNow) return;

      e.preventDefault();
      const sep = href.includes("?") ? "&" : "?";
      window.location.href = `${href}${sep}ai_src=${encodeURIComponent(aiSrcNow)}`;
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
