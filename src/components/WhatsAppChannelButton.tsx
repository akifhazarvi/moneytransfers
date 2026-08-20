"use client";

import { useEffect, useState } from "react";
import { trackWhatsappDismiss, trackWhatsappImpression } from "@/lib/analytics";
import { WhatsAppGlyph } from "./WhatsAppMark";
import WhatsAppFollowLink from "./WhatsAppFollowLink";

// Persistent "follow the channel" pill.
//
// What was wrong with the previous version, and why it converted at ~nothing:
//   • The glyph was tinted gold on an ink circle, so it read as a generic chat
//     bubble rather than WhatsApp. No recognition, no click.
//   • The label only expanded on `group-hover`. On touch devices there is no
//     hover — mobile visitors saw an unlabelled black circle and had no idea
//     what it did. That is most of our traffic.
//   • There was no impression event, so a 4-follower channel gave us no way to
//     tell whether the problem was reach or copy.
//
// Now: WhatsApp's own green, the real mark, a label that is always readable,
// a dismiss affordance (so being visible isn't hostile), and both halves of
// the funnel instrumented.

const STORAGE_KEY = "smc_wa_pill";
const DISMISS_DAYS = 30;
const FOLLOWED_DAYS = 120;

function suppressedUntil(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

function suppressFor(days: number) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() + days * 24 * 60 * 60 * 1000),
    );
  } catch {
    // Private mode / storage disabled — the pill simply returns next visit.
  }
}

export default function WhatsAppChannelButton() {
  const [state, setState] = useState<"hidden" | "shown">("hidden");

  useEffect(() => {
    if (Date.now() < suppressedUntil()) return;

    // Hold off until the visitor has engaged a little. Landing straight into a
    // floating CTA is what trains people to dismiss on sight.
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scroll", onScroll);
      setState("shown");
      trackWhatsappImpression("float_pill");
    };
    const onScroll = () => {
      if (window.scrollY > 300) reveal();
    };

    const timer = window.setTimeout(reveal, 8000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (state === "hidden") return null;

  return (
    <div
      // Must clear all three other bottom-fixed elements. Mobile: bottom-32 sits
      // above StickyBestCTA and left of MobileScrollNav's bottom-right pill.
      // Desktop: StickyBestCTA's card runs to right-6, so bottom-6 put this pill
      // directly on top of the Send button — bottom-28 lifts it clear. Never
      // overlap the affiliate bar; provider_clicked is the north-star event.
      className="animate-wa-rise fixed bottom-32 left-3 right-auto z-40 sm:bottom-28 sm:left-auto sm:right-6"
    >
      <div className="relative">
        <WhatsAppFollowLink
          source="float_pill"
          ariaLabel="Follow SendMoneyCompare on WhatsApp for rate alerts"
          // Only fires on the phone path, where the tap really does land on the
          // channel's Follow button. A desktop click opens the QR instead, and
          // that isn't a follow yet, so it must not suppress the pill.
          onNavigate={() => suppressFor(FOLLOWED_DAYS)}
          className="flex h-12 items-center gap-2 rounded-full bg-[var(--wa-green)] pl-3.5 pr-4 text-[var(--wa-on-green)] shadow-[var(--shadow-md)] transition-colors hover:bg-[var(--wa-green-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wa-teal)]"
        >
          <WhatsAppGlyph className="h-[22px] w-[22px] shrink-0" />
          <span className="whitespace-nowrap text-sm font-bold leading-tight">
            Rate alerts
          </span>
        </WhatsAppFollowLink>

        {/* Dismiss — small, outside the tap target of the main action */}
        <button
          type="button"
          onClick={() => {
            suppressFor(DISMISS_DAYS);
            trackWhatsappDismiss("float_pill");
            setState("hidden");
          }}
          aria-label="Hide the WhatsApp follow button"
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] shadow-sm transition-colors hover:text-[var(--color-on-surface)]"
        >
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
