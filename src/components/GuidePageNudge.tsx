"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getProviderName, providers, type TransferQuote } from "@/data/providers";
import { fetchQuotes } from "@/lib/fetch-quotes";
import { getGoUrl } from "@/lib/affiliate";
import { trackProviderClicked, trackStickyCtaShown, trackStickyCtaClicked, trackStickyCtaDismissed } from "@/lib/analytics";

interface Props {
  from: string;
  to: string;
  amount: number;
  slug: string;
}

const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹", PKR: "Rs", MXN: "MX$", PHP: "₱", EUR: "€", GBP: "£",
  NGN: "₦", BDT: "৳", IDR: "Rp", VND: "₫", EGP: "E£", MAD: "MAD",
  TRY: "₺", KES: "KSh", ZMW: "ZK", USD: "$", CAD: "C$", AUD: "A$",
  NZD: "NZ$", SGD: "S$", AED: "د.إ", SAR: "﷼",
};

export default function GuidePageNudge({ from, to, amount, slug }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const corridor = `${from}-${to}`;

  // Quotes fetched from /api/quotes rather than computed via generateQuotes(),
  // which would statically bundle the multi-megabyte scraped dataset into every
  // guide/news page. The nudge stays hidden until they arrive (return null
  // below when !best), so there's no skeleton to show.
  const [quotes, setQuotes] = useState<TransferQuote[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetchQuotes(amount, from, to, controller.signal).then((q) => {
      if (!controller.signal.aborted) setQuotes(q);
    });
    return () => controller.abort();
  }, [amount, from, to]);
  const best = quotes[0];
  const worst = quotes[quotes.length - 1];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `guide_nudge_dismissed_${slug}`;
    if (sessionStorage.getItem(key) === "1") {
      setDismissed(true);
      return;
    }

    let scrollTriggered = false;
    let timeTriggered = false;

    const maybeShow = () => {
      if ((scrollTriggered || timeTriggered) && !dismissed) {
        setVisible(true);
      }
    };

    // Trigger after 30 seconds
    timerRef.current = setTimeout(() => {
      timeTriggered = true;
      maybeShow();
    }, 30_000);

    // Trigger at 50% scroll depth
    const onScroll = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct >= 0.5 && !scrollTriggered) {
        scrollTriggered = true;
        maybeShow();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Fire analytics once
  useEffect(() => {
    if (visible && !hasShown && best) {
      trackStickyCtaShown(best.providerSlug, corridor);
      setHasShown(true);
    }
  }, [visible, hasShown, best, corridor]);

  if (dismissed || !best) return null;

  const provider = providers.find((p) => p.slug === best.providerSlug);
  const logo = provider?.logo || `/logos/${best.providerSlug}.png`;
  const name = getProviderName(best.providerSlug);
  const recvSymbol = CURRENCY_SYMBOL[to] || to;
  const sendSymbol = CURRENCY_SYMBOL[from] || from;
  const savings = worst ? best.receiveAmount - worst.receiveAmount : 0;
  const sendUrl = getGoUrl(best.providerSlug, {
    sourceCurrency: from,
    targetCurrency: to,
    sourceAmount: amount,
    clickref: `guide_nudge_${slug}`,
  });

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
    trackStickyCtaDismissed(corridor);
    try { sessionStorage.setItem(`guide_nudge_dismissed_${slug}`, "1"); } catch {}
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-[720px] px-3 sm:px-6 pb-4 pr-3 sm:pr-6">
        <div className="relative bg-[var(--color-surface)] border border-[var(--color-success-dark)]/30 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden">
          {/* Green accent bar */}
          <div className="h-1 bg-gradient-to-r from-[var(--color-success-dark)] to-[var(--color-success)]" />

          <div className="flex items-center gap-3 p-3 sm:p-4">
            {/* Logo */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[var(--color-surface-dim)] border border-[var(--color-outline)]/50 flex items-center justify-center shrink-0">
              <Image
                src={logo}
                alt={`${name} logo`}
                width={48}
                height={48}
                className="w-full h-full object-contain p-1"
                unoptimized={logo.endsWith(".svg")}
              />
            </div>

            {/* Copy */}
            <div className="flex-1 min-w-0">
              <p className="text-2xs font-bold uppercase tracking-wide text-[var(--color-success-dark)]">
                Best rate right now · {from} → {to}
              </p>
              <p className="text-sm font-bold text-[var(--color-on-surface)] mt-0.5 leading-tight">
                {name} — {recvSymbol}{best.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                {best.fee === 0 && <span className="ml-1.5 text-[var(--color-success-dark)] font-semibold text-xs">· Free</span>}
              </p>
              {savings > 0 && (
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 hidden sm:block">
                  <span className="text-[var(--color-success-dark)] font-semibold">+{recvSymbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} more</span> than the worst option for {sendSymbol}{amount.toLocaleString()} {from}
                </p>
              )}
            </div>

            {/* CTA */}
            <a
              href={sendUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackProviderClicked(best.providerSlug, corridor, 1, `guide_nudge`);
                trackStickyCtaClicked(best.providerSlug, corridor, savings > 0 ? savings : undefined);
              }}
              className="shrink-0 inline-flex items-center gap-1.5 h-11 px-4 sm:px-5 rounded-full bg-[var(--color-success-dark)] hover:bg-[var(--color-success-hover)] text-white text-sm font-bold transition-all active:scale-95 shadow-[0_2px_10px_rgba(5,150,105,0.4)] whitespace-nowrap"
            >
              <span className="hidden sm:inline">Send with {name}</span>
              <span className="sm:hidden">Send →</span>
              <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="w-7 h-7 shrink-0 rounded-full hover:bg-[var(--color-surface-dim)] text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors flex items-center justify-center text-xl leading-none ml-1"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
