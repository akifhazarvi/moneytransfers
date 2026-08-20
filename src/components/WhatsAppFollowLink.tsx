"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  trackWhatsappFollow,
  trackWhatsappQrShown,
} from "@/lib/analytics";
import { WHATSAPP_CHANNEL_URL } from "@/lib/whatsapp";
import { WhatsAppGlyph, WhatsAppTile } from "./WhatsAppMark";

// One follow link, shared by every WhatsApp surface — and the fix for the
// biggest hole in this funnel.
//
// whatsapp.com/channel/<id> behaves completely differently by device:
//   • phone   → universal link, opens the WhatsApp app on the channel's Follow
//               button. One tap. This path was always fine.
//   • desktop → a whatsapp.com marketing page dominated by "Download WhatsApp"
//               (27 occurrences in the live HTML). Unless the visitor already
//               has WhatsApp Web logged in, there is no Follow button to press.
//               Every desktop click was landing in a dead end.
// Since this site skews desktop (Bing + AI-assistant referrals), that dead end
// plausibly explains more of the 4-follower plateau than any copy choice.
//
// So: phones keep the direct link; desktop gets a scan-to-follow QR, with an
// explicit escape hatch for people who do have WhatsApp on the machine.

export default function WhatsAppFollowLink({
  source,
  className = "",
  children,
  ariaLabel,
  onNavigate,
}: {
  source: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  onNavigate?: () => void;
}) {
  const [qrOpen, setQrOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setQrOpen(false), []);

  // Esc to dismiss. Only attaches while the dialog is actually open, and never
  // calls setState from the effect body (the repo lints against that).
  useEffect(() => {
    if (!qrOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [qrOpen, close]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Never hijack a deliberate new-tab/window click.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    // A fine pointer means a mouse, i.e. a desktop where the channel link is a
    // download page rather than a Follow button. Checked at click time, not
    // render time, so the markup stays hydration-safe.
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    if (isDesktop) {
      e.preventDefault();
      trackWhatsappFollow(source, "qr_scan_prompt");
      trackWhatsappQrShown(source);
      setQrOpen(true);
      return;
    }

    trackWhatsappFollow(source, "direct");
    onNavigate?.();
  };

  return (
    <>
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </a>

      {qrOpen &&
        typeof document !== "undefined" &&
        createPortal(
          // Portalled to <body> on purpose: the float pill's entrance animation
          // leaves a transform on its wrapper, which would otherwise become the
          // containing block for a position:fixed child and trap this dialog.
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-qr-title"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-sm"
            />

            <div className="relative w-full max-w-[22rem] rounded-2xl bg-[var(--color-surface)] p-6 text-center shadow-[var(--shadow-xl)]">
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <WhatsAppTile className="mx-auto h-11 w-11 rounded-[13px]" glyphClassName="h-6 w-6" />

              <h2
                id="wa-qr-title"
                className="mt-3 text-lg font-bold text-[var(--color-on-surface)]"
              >
                Scan to follow on your phone
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                Rate alerts land in WhatsApp on your phone, so point your camera
                at this code — the channel opens straight in the app.
              </p>

              {/* White plate regardless of theme: a QR needs its quiet zone to scan. */}
              <div className="mx-auto mt-4 w-[186px] rounded-xl bg-white p-3 shadow-[var(--shadow-sm)]">
                <Image
                  src="/whatsapp-channel-qr.svg"
                  alt="QR code linking to the SendMoneyCompare WhatsApp channel"
                  width={162}
                  height={162}
                  unoptimized
                  className="h-[162px] w-[162px]"
                />
              </div>

              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsappFollow(source, "desktop_web");
                  close();
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--wa-teal)] underline decoration-[var(--wa-teal)]/35 underline-offset-2 hover:decoration-[var(--wa-teal)]"
              >
                <WhatsAppGlyph className="h-4 w-4" />
                Already have WhatsApp here? Open the channel
              </a>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
