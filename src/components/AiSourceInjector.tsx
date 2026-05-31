"use client";

import { useEffect } from "react";

// Intercepts all /go/ link clicks and appends two query params so the
// server-side redirect route can attribute the affiliate click correctly:
//
//   - ai_src=<platform>  when the session originated from an AI assistant
//     (ChatGPT, Copilot, Perplexity, …). Stored in sessionStorage as
//     `first_ai_src` by the GTAG_INLINE bootstrap in layout.tsx.
//
//   - cid=<ga4_client_id>  the live GA4 client_id for this browser session.
//     The site is cookieless (no _ga cookie), so the /go/ route otherwise
//     fabricates a throwaway client_id per click — every server event lands
//     in GA4's "Unassigned" channel with no traffic source, scattering
//     affiliate conversions away from the channel that actually drove them
//     (notably AI assistants). Forwarding the real client_id lets GA4 stitch
//     provider_clicked_server back onto the originating session.
export default function AiSourceInjector() {
  useEffect(() => {
    // Resolve the GA4 client_id once on mount and cache it. gtag('get') is
    // async (callback-based); we kick it off early so it's ready by click time.
    let clientId: string | null = null;
    try {
      const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof g === "function") {
        g("get", "G-HJH07QEJ30", "client_id", (id: string) => {
          if (id) clientId = id;
        });
      }
    } catch { /* gtag unavailable */ }

    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || !href.includes("/go/")) return;

      let aiSrc: string | null = null;
      try { aiSrc = sessionStorage.getItem("first_ai_src"); } catch { /* unavailable */ }

      // Nothing to add — let the navigation proceed untouched.
      if (!aiSrc && !clientId) return;

      const extra = new URLSearchParams();
      if (aiSrc) extra.set("ai_src", aiSrc);
      if (clientId) extra.set("cid", clientId);

      e.preventDefault();
      const sep = href.includes("?") ? "&" : "?";
      window.location.href = `${href}${sep}${extra.toString()}`;
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
