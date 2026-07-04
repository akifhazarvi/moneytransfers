"use client";

import { trackWhatsappFollow } from "@/lib/analytics";
import { WHATSAPP_CHANNEL_URL } from "@/lib/whatsapp";

// Persistent "Follow on WhatsApp" button — always visible, quiet, on-theme.
// Ink pill matching the site's Send buttons, gold WhatsApp glyph. No popup
// bubble, no pulse, no glow — it just sits there and expands its label on
// hover/focus. Bottom-left on mobile (clear of the MobileScrollNav pill at
// bottom-right and the StickyBestCTA bar); bottom-right on desktop.
export default function WhatsAppChannelButton() {
  return (
    <div className="fixed bottom-32 left-3 right-auto sm:bottom-6 sm:left-auto sm:right-6 z-40">
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappFollow("float_button")}
        aria-label="Follow SendMoneyCompare on WhatsApp"
        className="group flex h-14 items-center rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] shadow-[var(--shadow-md)] transition-colors hover:bg-[var(--color-cta-hover)]"
      >
        {/* Icon — fixed 56px square, always centred */}
        <span className="flex h-14 w-14 shrink-0 items-center justify-center">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.34c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.48-.01c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
          </svg>
        </span>
        {/* Label — expands to the side on hover/focus */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-200 group-hover:max-w-[150px] group-hover:pr-5 group-hover:opacity-100 group-focus-visible:max-w-[150px] group-focus-visible:pr-5 group-focus-visible:opacity-100">
          Follow us
        </span>
      </a>
    </div>
  );
}
