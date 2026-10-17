"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { startPresence } from "@/lib/live-activity-beacon";

// Fires a GA4 page_view on every Next.js App Router soft navigation.
//
// gtag's auto page_view only triggers on full document loads. When a user
// clicks an internal <Link>, Next.js swaps the route client-side and gtag
// doesn't know. Without this tracker, every internal nav after the landing
// is missed — inflating single-page-session bounce metrics and hiding the
// real depth of engaged traffic.
//
// The initial landing pageview is still fired by the gtag config
// (send_page_view:true), so we skip the first effect run to avoid
// double-counting.
//
// THIS IS THE ONLY SOFT-NAVIGATION PAGE_VIEW. The stream's enhanced
// measurement option "Page changes based on browser history events" must stay
// OFF in GA4 Admin: with it on (it was, until 2026-10-11), every soft
// navigation counted twice — /guides showed 151 views from 27 people on one URL.
//
// Keyed on the pathname, not the query: a query-only change is the same page
// rewriting its own URL (/compare's history.replaceState on load and on every
// provider pick, which Next 16 surfaces through useSearchParams), not a visit.
function Tracker() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);
  // Track the previous URL so we can pass page_referrer on each SPA navigation.
  // Without this, GA4 sees soft-nav page_views with no referrer and re-attributes
  // them to (not set) instead of inheriting the session's original source/medium.
  const previousUrl = useRef<string>("");

  useEffect(() => {
    // The live activity strip's "here now" and "last 6 hours" counts — not
    // GA4, so it runs whether or not gtag has loaded or been consented to.
    startPresence();
    if (isFirstRun.current) {
      isFirstRun.current = false;
      previousUrl.current = window.location.href;
      return;
    }
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    // No campaign_* params: GA4 sets a session's source once, at its start, and
    // classifies AI assistants itself (the AI Assistant channel). Stamping
    // campaign_source "chatgpt" / medium "referral" on every page view, as this
    // did until 2026-10-11, filed ChatGPT and Copilot visits under Referral.
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
      page_referrer: previousUrl.current || document.referrer || "",
    });

    previousUrl.current = window.location.href;
  }, [pathname]);

  return null;
}

export default function GA4PageviewTracker() {
  return <Tracker />;
}
