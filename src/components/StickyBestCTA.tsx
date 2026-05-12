"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  trackStickyCtaShown,
  trackStickyCtaClicked,
  trackStickyCtaDismissed,
} from "@/lib/analytics";

interface Props {
  providerSlug: string;
  providerName: string;
  providerLogo: string;
  providerUrl: string;
  receiveAmount: number;
  receiveSymbol: string;
  fee: number;
  sendSymbol: string;
  savingsVsWorst?: number;
  fromCurrency: string;
  toCurrency: string;
}

export default function StickyBestCTA({
  providerSlug,
  providerName,
  providerLogo,
  providerUrl,
  receiveAmount,
  receiveSymbol,
  fee,
  sendSymbol,
  savingsVsWorst,
  fromCurrency,
  toCurrency,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hasFiredShown, setHasFiredShown] = useState(false);
  const corridor = `${fromCurrency}-${toCurrency}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("sticky_cta_dismissed") === "1") {
      setDismissed(true);
      return;
    }

    const handler = () => {
      // Show after user scrolls 500px past the hero
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Fire sticky_cta_shown once per session when it first becomes visible
  useEffect(() => {
    if (visible && !hasFiredShown) {
      trackStickyCtaShown(providerSlug, corridor);
      setHasFiredShown(true);
    }
  }, [visible, hasFiredShown, providerSlug, corridor]);

  if (dismissed) return null;

  const onClick = () => {
    trackStickyCtaClicked(providerSlug, corridor, savingsVsWorst);
  };

  const onDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackStickyCtaDismissed(corridor);
    setDismissed(true);
    try { sessionStorage.setItem("sticky_cta_dismissed", "1"); } catch {}
  };

  const formatAmount = (n: number) =>
    n >= 10000
      ? Math.round(n).toLocaleString()
      : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-[1100px] px-3 sm:px-6 pb-20 sm:pb-4 pr-20 sm:pr-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] rounded-2xl flex items-center gap-3 p-3 sm:p-4 backdrop-blur-sm">
          {/* Logo */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/50 flex items-center justify-center shrink-0">
            <Image
              src={providerLogo}
              alt={`${providerName} logo`}
              width={48}
              height={48}
              className="w-full h-full object-contain p-1"
              unoptimized={providerLogo.endsWith(".svg")}
            />
          </div>

          {/* Copy */}
          <div className="flex-1 min-w-0">
            <p className="text-2xs uppercase tracking-wide font-semibold text-[var(--color-success-dark)] hidden sm:block">
              Best deal right now
            </p>
            <p className="text-sm sm:text-base font-semibold text-[var(--color-on-surface)] truncate">
              {providerName}
            </p>
            <p className="text-2xs sm:text-xs text-[var(--color-on-surface-variant)] truncate tabular-nums">
              Recipient gets {receiveSymbol}{formatAmount(receiveAmount)}
              {fee === 0 ? " · No fee" : ` · ${sendSymbol}${fee.toFixed(2)} fee`}
              {savingsVsWorst && savingsVsWorst > 0 && (
                <span className="hidden sm:inline"> · <strong className="text-[var(--color-success-dark)]">+{receiveSymbol}{formatAmount(savingsVsWorst)} more vs worst</strong></span>
              )}
            </p>
          </div>

          {/* CTA */}
          <a
            href={providerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className="inline-flex items-center gap-1.5 bg-[var(--color-success-dark)] hover:bg-[var(--color-success-hover)] text-white text-xs sm:text-sm font-semibold h-10 sm:h-11 px-3 sm:px-5 rounded-full shadow-sm transition-colors shrink-0 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Send with {providerName}</span>
            <span className="sm:hidden">Send →</span>
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="w-7 h-7 shrink-0 rounded-full hover:bg-[var(--color-surface-dim)] text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors flex items-center justify-center text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
