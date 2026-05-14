"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

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
function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRun = useRef(true);
  // Track the previous URL so we can pass page_referrer on each SPA navigation.
  // Without this, GA4 sees soft-nav page_views with no referrer and re-attributes
  // them to (not set) instead of inheriting the session's original source/medium.
  const previousUrl = useRef<string>("");

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      previousUrl.current = window.location.href;
      return;
    }
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    const qs = searchParams?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;

    // Carry AI-search attribution (set in sessionStorage by the inline gtag
     // bootstrap in [locale]/layout.tsx) onto every soft-nav page_view too —
     // otherwise mid-session pageviews land with empty source/medium and GA4
     // re-buckets them into (not set) rather than the original referral.
    let aiSrc: string | null = null;
    try { aiSrc = sessionStorage.getItem("first_ai_src"); } catch { /* sessionStorage may be unavailable */ }

    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: url,
      page_title: document.title,
      page_referrer: previousUrl.current || document.referrer || "",
      ...(aiSrc
        ? { campaign_source: aiSrc, campaign_medium: "referral", campaign_name: "ai_search" }
        : {}),
    });

    previousUrl.current = window.location.href;
  }, [pathname, searchParams]);

  return null;
}

// useSearchParams forces dynamic rendering; wrap in Suspense so the layout
// can still statically render the rest of the tree.
export default function GA4PageviewTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
