"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { trackGoReviewContinue, trackGoReviewShown } from "@/lib/analytics";

/**
 * The review page's way on to the provider the visitor chose: back through the
 * /go (or /out) route with ?continue=1, which forwards.
 *
 * data-pc keeps ProviderClickDelegate from logging a second provider_clicked —
 * the click that brought them here was the choice; this one confirms it. The
 * confirmation is counted twice over instead: `go_review_continue` client-side
 * and `interstitial_continue` via a server beacon, which survives ad blockers,
 * declined consent and a Continue tap that navigates before gtag.js has loaded
 * (it loads on the first interaction here) — so the beacon is the count to
 * trust, and the one to flag as the GA4 key event. The view is counted the
 * same two ways: `go_review_shown` and the server's `interstitial_impression`.
 *
 * A view counts on the first human signal — a pointer move or press, a touch,
 * a wheel or a key — not on render. Rendered-and-left visits are the China /
 * Singapore browser-spoofing bots that hit /go directly: 91% of the 1,043
 * go_review_shown in Oct 5–10 2026, at 0.1s engagement, and they do scroll
 * (programmatically), so `scroll` is not on the list. GTAG_INLINE applies the
 * same rule to loading GA on this page.
 */
const HUMAN_SIGNALS = ["pointerdown", "pointermove", "keydown", "touchstart", "wheel"] as const;
export default function ReviewContinue({
  href,
  provider,
  corridor,
  partner,
  origin,
  beacon,
  className,
  children,
}: {
  href: string;
  provider: string;
  corridor: string;
  partner: "quote" | "card" | "none";
  origin: "on_site" | "external";
  /** Query for /api/track/continue: provider, corridor, src, ai_src, cid. */
  beacon: string;
  className?: string;
  children: ReactNode;
}) {
  const shown = useRef(false);
  const countView = useCallback(() => {
    if (shown.current) return;
    shown.current = true;
    trackGoReviewShown(provider, corridor, partner, origin);
    try {
      navigator.sendBeacon(`/api/track/continue?event=impression&partner=${partner}&origin=${origin}&${beacon}`);
    } catch {
      // Best-effort: go_review_shown still counts it client-side.
    }
  }, [provider, corridor, partner, origin, beacon]);

  useEffect(() => {
    if (shown.current) return;
    const onSignal = () => {
      countView();
      HUMAN_SIGNALS.forEach((e) => removeEventListener(e, onSignal, true));
    };
    HUMAN_SIGNALS.forEach((e) => addEventListener(e, onSignal, { capture: true, passive: true }));
    return () => HUMAN_SIGNALS.forEach((e) => removeEventListener(e, onSignal, true));
  }, [countView]);

  return (
    <a
      href={href}
      rel="nofollow sponsored"
      data-pc="1"
      className={className}
      onClick={() => {
        // A click with no signal before it (a scripted one) still counts the
        // view first, so continues can never outnumber views.
        countView();
        trackGoReviewContinue(provider, corridor, origin);
        try {
          navigator.sendBeacon(`/api/track/continue?partner=${partner}&origin=${origin}&${beacon}`);
        } catch {
          // Best-effort: the route still records the forward itself.
        }
      }}
    >
      {children}
    </a>
  );
}
