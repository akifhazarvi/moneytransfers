"use client";

import type { InstallPlatform } from "@/lib/pwa";

const COPY: Partial<Record<InstallPlatform, { title: string; body: string; action: string }>> = {
  prompt: {
    title: "Install the SendMoneyCompare app",
    body: "Compare transfer rates in one tap, in a window of its own. Free, no app store.",
    action: "Install",
  },
  "ios-safari": {
    title: "Add SendMoneyCompare to your Home Screen",
    body: "It opens full screen, like an app. Free, no App Store.",
    action: "Show me how",
  },
  "ios-other": {
    title: "Add SendMoneyCompare to your Home Screen",
    body: "It opens full screen, like an app. Free, no App Store.",
    action: "Show me how",
  },
  "mac-safari": {
    title: "Add SendMoneyCompare to your Dock",
    body: "It opens in its own window, like an app.",
    action: "Show me how",
  },
};

/**
 * The install offer. It docks at the TOP, under the sticky header, because the
 * bottom of the viewport belongs to StickyBestCTA, GuidePageNudge and the
 * /send-money compare bar — provider_clicked is the north-star event and no
 * prompt of ours may sit on a Send button. A widget, so it titles itself with
 * a styled <p> and its landmark names it (Strict rule 4).
 */
export default function InstallPrompt({
  platform,
  onAccept,
  onDismiss,
}: {
  platform: InstallPlatform;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const copy = COPY[platform];
  if (!copy) return null;

  return (
    <aside
      aria-label="Install the SendMoneyCompare app"
      data-pwa-install-prompt=""
      className="animate-pwa-drop fixed top-[72px] left-3 right-3 z-[60] sm:left-auto sm:right-6 sm:w-[380px]"
    >
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] p-4">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- 40px static icon; the optimizer adds nothing */}
          <img src="/icon-192x192.png" alt="" width={40} height={40} className="rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold leading-snug text-[var(--color-on-surface)]">{copy.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-on-surface-variant)]">{copy.body}</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="w-8 h-8 -mr-1.5 -mt-1.5 flex items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-dim)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex gap-2 pl-[52px]">
          <button
            type="button"
            onClick={onAccept}
            className="h-9 px-4 text-[13px] font-semibold rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)] transition-colors"
          >
            {copy.action}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="h-9 px-4 text-[13px] font-medium rounded-full border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-dim)] transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </aside>
  );
}
