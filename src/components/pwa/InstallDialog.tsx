"use client";

import { useEffect, useRef } from "react";
import type { InstallPlatform } from "@/lib/pwa";

// Inline glyphs for the browser controls the steps refer to, so a visitor can
// match the instruction to what is on their screen.
function ShareIcon() {
  return (
    <svg className="inline-block w-[18px] h-[18px] -mt-1 mx-0.5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v12m0-12L8 7m4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
    </svg>
  );
}

function InstallIcon() {
  return (
    <svg className="inline-block w-[18px] h-[18px] -mt-1 mx-0.5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 7.5v6m0 0-2.5-2.5M12 13.5l2.5-2.5M8 20h8" />
    </svg>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-[var(--color-on-surface)]">{children}</strong>;
}

interface Guide {
  title: string;
  steps: React.ReactNode[];
  note?: string;
}

function guideFor(platform: InstallPlatform): Guide {
  switch (platform) {
    case "ios-safari":
      return {
        title: "Add SendMoneyCompare to your Home Screen",
        steps: [
          <>Tap <Kbd>Share</Kbd> <ShareIcon /> in Safari. On recent iPhones it sits under the <Kbd>⋯</Kbd> button beside the address bar.</>,
          <>Scroll down and tap <Kbd>Add to Home Screen</Kbd>.</>,
          <>Leave <Kbd>Open as Web App</Kbd> on if you see it, then tap <Kbd>Add</Kbd>.</>,
        ],
      };
    case "ios-other":
      return {
        title: "Add SendMoneyCompare to your Home Screen",
        steps: [
          <>Tap <Kbd>Share</Kbd> <ShareIcon /> in your browser&rsquo;s address bar or menu.</>,
          <>Choose <Kbd>Add to Home Screen</Kbd>.</>,
          <>Tap <Kbd>Add</Kbd>.</>,
        ],
        note: "If Add to Home Screen is missing, open this page in Safari and add it from there.",
      };
    case "mac-safari":
      return {
        title: "Add SendMoneyCompare to your Dock",
        steps: [
          <>In the menu bar, choose <Kbd>File</Kbd> → <Kbd>Add to Dock…</Kbd> (or click <Kbd>Share</Kbd> <ShareIcon /> → <Kbd>Add to Dock</Kbd>).</>,
          <>Click <Kbd>Add</Kbd>. The app opens from the Dock or Launchpad in its own window.</>,
        ],
      };
    case "android":
      return {
        title: "Install SendMoneyCompare on your phone",
        steps: [
          <>Open your browser menu (<Kbd>⋮</Kbd>).</>,
          <>Tap <Kbd>Install app</Kbd> or <Kbd>Add to Home screen</Kbd>.</>,
          <>Confirm with <Kbd>Install</Kbd>.</>,
        ],
      };
    case "desktop-edge":
      return {
        title: "Install SendMoneyCompare",
        steps: [
          <>Click the install icon <InstallIcon /> at the right of the address bar, or open the <Kbd>…</Kbd> menu → <Kbd>Apps</Kbd> → <Kbd>Install this site as an app</Kbd>.</>,
          <>Click <Kbd>Install</Kbd>.</>,
        ],
      };
    case "desktop-chrome":
    case "prompt":
      return {
        title: "Install SendMoneyCompare",
        steps: [
          <>Click the install icon <InstallIcon /> at the right of the address bar, or open the <Kbd>⋮</Kbd> menu → <Kbd>Cast, save and share</Kbd> → <Kbd>Install page as app…</Kbd>.</>,
          <>Click <Kbd>Install</Kbd>.</>,
        ],
      };
    case "installed":
    case "standalone":
      return {
        title: "SendMoneyCompare is installed",
        steps: [<>Open it from your home screen, Dock, Start menu or app launcher.</>],
      };
    case "unsupported":
    default:
      return {
        title: "Install SendMoneyCompare",
        steps: [<>This browser can&rsquo;t install web apps. Open sendmoneycompare.com in Chrome, Edge or Safari to install it.</>],
      };
  }
}

export default function InstallDialog({
  platform,
  onInstall,
  onClose,
}: {
  platform: InstallPlatform;
  /** Present when the browser's own install dialog can be opened. */
  onInstall?: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const guide = guideFor(platform);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="pwa-install-title"
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (e.target === ref.current) ref.current?.close();
      }}
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-2xl bg-[var(--color-surface)] text-[var(--color-on-surface)] p-0 shadow-[var(--shadow-lg)] backdrop:bg-black/50"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- 44px static icon; the optimizer adds nothing */}
          <img src="/icon-192x192.png" alt="" width={44} height={44} className="rounded-xl shrink-0" />
          <p id="pwa-install-title" className="flex-1 text-lg font-semibold leading-snug pt-1">
            {guide.title}
          </p>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="w-9 h-9 -mr-2 -mt-1 flex items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-dim)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ol className="mt-5 space-y-3 text-[15px] leading-relaxed text-[var(--color-on-surface-variant)]">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--color-surface-dim)] text-[var(--color-on-surface)] text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        {guide.note && <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">{guide.note}</p>}

        <ul className="mt-5 pt-4 border-t border-[var(--color-outline)] space-y-1.5 text-sm text-[var(--color-on-surface-variant)]">
          <li>Opens in its own window, one tap from your home screen or Dock.</li>
          <li>Free, and there is no app store download.</li>
          <li>Pages you have opened stay readable offline, with the figures from when you last loaded them.</li>
        </ul>

        {onInstall && (
          <button
            type="button"
            onClick={onInstall}
            className="mt-5 w-full h-11 rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] font-semibold hover:bg-[var(--color-cta-hover)] transition-colors"
          >
            Install app
          </button>
        )}
      </div>
    </dialog>
  );
}
