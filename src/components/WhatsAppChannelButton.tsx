"use client";

import { useEffect, useState } from "react";
import { trackWhatsappFollow } from "@/lib/analytics";
import { WHATSAPP_CHANNEL_URL } from "@/lib/whatsapp";

// Floating "Follow on WhatsApp" pill — persistent on every page for maximum
// channel visibility. Sits bottom-right, clear of the ForexTicker (thin bottom
// bar) and the StickyBestCTA (full-width bottom). Dismissible per-session so it
// never nags a user who has already declined; re-appears next visit.
export default function WhatsAppChannelButton() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid SSR flash
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const isDismissed = sessionStorage.getItem("wa_channel_dismissed") === "1";
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, []);

  // Auto-expand the label once, briefly, ~3s after load to draw the eye,
  // then collapse back to the compact icon so it stays out of the way.
  useEffect(() => {
    if (dismissed) return;
    const inTimer = setTimeout(() => setExpanded(true), 3000);
    const outTimer = setTimeout(() => setExpanded(false), 8000);
    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const onDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem("wa_channel_dismissed", "1");
    } catch {}
  };

  return (
    <div className="fixed bottom-14 right-3 sm:right-5 z-40 flex items-center">
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappFollow("float_button")}
        onMouseEnter={() => setExpanded(true)}
        onFocus={() => setExpanded(true)}
        aria-label="Follow SendMoneyCompare on WhatsApp"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] pl-3 pr-3.5 py-3 text-white shadow-[0_6px_20px_rgba(37,211,102,0.45)] transition-all duration-300 hover:bg-[#1FBE5A] hover:shadow-[0_8px_26px_rgba(37,211,102,0.55)]"
      >
        <svg
          className="w-6 h-6 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.34c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.48-.01c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
        </svg>
        <span
          className={`overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
            expanded ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0 group-hover:max-w-[160px] group-hover:opacity-100"
          }`}
        >
          Follow on WhatsApp
        </span>
      </a>
      <button
        onClick={onDismiss}
        aria-label="Dismiss WhatsApp follow button"
        className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-[var(--color-on-surface)] text-[var(--color-surface)] text-xs leading-none shadow-md hover:opacity-90 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}
