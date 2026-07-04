"use client";

import { useEffect, useRef, useState } from "react";
import { trackWhatsappFollow } from "@/lib/analytics";
import { WHATSAPP_CHANNEL_URL } from "@/lib/whatsapp";

// Persistent "Follow on WhatsApp" FAB — always visible on every page for
// maximum channel reach (no dismiss). Positioned to clear the ForexTicker
// (thin bottom bar) and, on mobile, the MobileScrollNav pill which lives at
// bottom-right: this FAB sits bottom-LEFT on mobile, bottom-RIGHT on desktop.
//
// ENGAGEMENT MODEL
// The icon alone gives a browsing user no reason to follow. So after a short
// dwell (they've engaged with the page, not bounced) a value-prop bubble slides
// out and ROTATES through concrete reasons to follow — rate alerts, best-provider
// tips, currency-move heads-ups. It appears once, cycles a few messages, then
// settles; the user can still hover/tap the button any time. Uses WhatsApp's own
// brand green so it reads instantly as "WhatsApp", not a generic gold button.
//
// Respects prefers-reduced-motion: no auto-cycling, shows a single static value
// message instead.

// Concrete, benefit-led reasons — each answers "why follow?". Kept short so the
// bubble stays one line on mobile.
const VALUE_PROPS = [
  "📉 Get alerts when your currency hits a good rate",
  "💸 We flag the cheapest provider before you send",
  "🇬🇧 Heads-up on GBP swings from UK political news",
  "⚡ New corridor deals & fee drops, first",
];

// How long the user must linger before the bubble invites them (ms).
const DWELL_MS = 8000;
// How long each rotating message stays up (ms).
const ROTATE_MS = 3800;
// After this many full messages, stop auto-rotating and leave the button quiet.
const MAX_CYCLES = VALUE_PROPS.length;

export default function WhatsAppChannelButton() {
  const [open, setOpen] = useState(false); // bubble visible
  const [idx, setIdx] = useState(0); // which value prop
  // Lazy init from the media query so we never setState in an effect body.
  const [reduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  const cyclesRef = useRef(0);

  useEffect(() => {
    // Invite after dwell — the user has engaged with the page, not bounced.
    const openTimer = setTimeout(() => setOpen(true), DWELL_MS);
    return () => clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (!open || reduced) return; // reduced-motion users get a single static message
    const rotate = setInterval(() => {
      cyclesRef.current += 1;
      if (cyclesRef.current >= MAX_CYCLES) {
        // Completed a full pass — settle on the strongest message and stop.
        clearInterval(rotate);
        return;
      }
      setIdx((i) => (i + 1) % VALUE_PROPS.length);
    }, ROTATE_MS);
    return () => clearInterval(rotate);
  }, [open, reduced]);

  return (
    <div className="fixed bottom-32 left-3 right-auto sm:bottom-6 sm:left-auto sm:right-6 z-40 flex items-center gap-2 sm:flex-row-reverse">
      {/* The button itself — WhatsApp brand green, icon always centred in a
          fixed 56px square so padding stays symmetric. */}
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappFollow(open ? `float_button_bubble_${idx}` : "float_button")}
        aria-label="Follow SendMoneyCompare on WhatsApp for rate alerts and cheapest-provider tips"
        className="group relative flex h-14 shrink-0 items-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-md)] transition-[box-shadow,background-color] duration-200 hover:bg-[#1eb457] hover:shadow-[var(--shadow-lg)]"
      >
        {/* Attention pulse ring — fires once when the bubble first opens. */}
        {open && !reduced && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#25D366] motion-safe:animate-ping"
            style={{ animationIterationCount: 3 }}
            aria-hidden="true"
          />
        )}
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.34c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.48-.01c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
          </svg>
        </span>
        {/* Hover/focus label — always available regardless of the timed bubble. */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[150px] group-hover:pr-5 group-hover:opacity-100 group-focus-visible:max-w-[150px] group-focus-visible:pr-5 group-focus-visible:opacity-100">
          Follow us
        </span>
      </a>

      {/* Rotating value-prop bubble — the "why follow?" nudge. Speech-bubble
          styling, points at the button. Clicking it also opens the channel. */}
      {open && (
        <a
          href={WHATSAPP_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsappFollow(`float_bubble_${idx}`)}
          className="relative max-w-[15rem] rounded-2xl rounded-br-sm bg-[var(--color-surface)] px-4 py-2.5 text-2sm font-medium leading-snug text-[var(--color-on-surface)] shadow-[var(--shadow-lg)] ring-1 ring-[var(--color-outline)] motion-safe:animate-[wsbubble_.35s_ease-out] sm:rounded-br-2xl sm:rounded-bl-sm"
          aria-live="polite"
        >
          <span className="block text-2xs font-bold uppercase tracking-wider text-[#128C7E]">
            Free WhatsApp channel
          </span>
          <span className="mt-0.5 block" key={idx}>
            {VALUE_PROPS[idx]}
          </span>
        </a>
      )}

      <style>{`
        @keyframes wsbubble {
          from { opacity: 0; transform: translateY(6px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
