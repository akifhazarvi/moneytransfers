"use client";

import { useEffect, useSyncExternalStore } from "react";

function formatSavedAt(ms: number): string {
  return new Date(ms).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function subscribeToConnectivity(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

const LABEL_ID = "smc-saved-copy";
const noSubscription = () => () => {};
// The worker's label is in the document from the first byte or not at all.
const readSavedAt = () => {
  const label = document.getElementById(LABEL_ID);
  return label ? Number(label.dataset.savedAt) || 0 : null;
};

/**
 * Says so when the figures on screen may not be live — the same "never let a
 * figure outlive its data" rule the rest of the site follows. Two cases:
 *
 *  - A live page whose connection drops. Its quotes were current when it
 *    loaded, but nothing on it will refresh.
 *  - A saved copy the service worker served because the network failed.
 *    public/sw.js labels that HTML itself (<style id="smc-saved-copy">
 *    drawing body::before), so the label shows even if this JS never loads.
 *    When it does load, we switch that CSS label off and say the same thing
 *    here, as an announced status with a Reload once the connection is back.
 */
export default function OfflineNotice() {
  // Server snapshots say "online, live page", matching the prerendered HTML;
  // React then re-renders with the real values without a hydration mismatch.
  const offline = useSyncExternalStore(subscribeToConnectivity, () => !navigator.onLine, () => false);
  const savedAt = useSyncExternalStore(noSubscription, readSavedAt, () => null);

  useEffect(() => {
    const label = document.getElementById(LABEL_ID) as HTMLStyleElement | null;
    if (label) label.disabled = true;
  }, [savedAt]);

  if (!offline && savedAt === null) return null;

  const saved = savedAt !== null ? (savedAt ? `This is a copy saved on ${formatSavedAt(savedAt)}` : "This is a saved copy") : null;
  const message = offline
    ? saved
      ? `You're offline. ${saved}; rates and fees may have changed since.`
      : "You're offline. Connect to refresh quotes and continue to a provider."
    : `You're back online. ${saved}; reload for live rates and fees.`;

  return (
    <div
      role="status"
      data-pwa-offline-notice=""
      className="sticky top-[var(--pwa-header-height,64px)] z-[45] px-3 py-2 bg-[var(--color-surface)]"
    >
      <div className="max-w-[1120px] mx-auto flex items-center gap-3 rounded-2xl bg-[var(--color-on-surface)] text-[var(--color-surface)] px-4 py-2.5 text-sm leading-snug">
        <span className="flex-1">{message}</span>
        {!offline && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="shrink-0 min-h-12 px-4 rounded-full bg-[var(--color-surface)] text-[var(--color-on-surface)] font-semibold"
          >
            Reload
          </button>
        )}
      </div>
    </div>
  );
}
