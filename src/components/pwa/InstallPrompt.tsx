"use client";

import type { InstallPlatform } from "@/lib/pwa";

const COPY: Partial<Record<InstallPlatform, { title: string; action: string; destination: string }>> = {
  prompt: { title: "Install the SendMoneyCompare app", action: "Install", destination: "Your next comparison, one tap away." },
  "ios-safari": { title: "Add SendMoneyCompare to your Home Screen", action: "Show me how", destination: "Add a shortcut from your browser. No App Store needed." },
  "ios-other": { title: "Add SendMoneyCompare to your Home Screen", action: "Show me how", destination: "Add a shortcut from your browser. No App Store needed." },
  "mac-safari": { title: "Add SendMoneyCompare to your Dock", action: "Show me how", destination: "Open comparisons in their own window from your Dock." },
};

function contextFor(placement: string) {
  if (placement.startsWith("business")) return {
    label: "For your next business payment",
    body: "Keep transfer comparisons and business payment guides within easy reach.",
  };
  if (placement.startsWith("guide")) return {
    label: "From research to your next transfer",
    body: "Return to transfer guides, check exchange rates and compare your next payment.",
  };
  return {
    label: "Ready for the next time you send",
    body: "Open straight into comparisons, check exchange rates and explore your options.",
  };
}

/** One in-flow offer, displayed only after the reader reaches its placement. */
export default function InstallPrompt({ platform, placement = "inline", onAccept, onDismiss }: {
  platform: InstallPlatform;
  placement?: string;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const copy = COPY[platform];
  if (!copy) return null;
  const context = contextFor(placement);
  return (
    <aside aria-label="Install the SendMoneyCompare app" data-pwa-install-prompt="" className="pwa-install-banner">
      <div className="pwa-install-brand" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- small static app icon */}
        <img src="/icon-192x192.png" alt="" width={56} height={56} />
      </div>
      <div className="pwa-install-copy">
        <p className="pwa-install-eyebrow">{context.label}</p>
        <p className="pwa-install-title">{copy.title}</p>
        <p className="pwa-install-description">{context.body}</p>
        <p className="pwa-install-note">Free to install <span aria-hidden="true">·</span> No account needed</p>
      </div>
      <div className="pwa-install-actions">
        <button type="button" onClick={onAccept} className="conversion-button conversion-button--accent">{copy.action}<span aria-hidden="true">→</span></button>
        <button type="button" onClick={onDismiss} className="pwa-install-later">Not now</button>
        <p>{copy.destination}</p>
      </div>
    </aside>
  );
}
