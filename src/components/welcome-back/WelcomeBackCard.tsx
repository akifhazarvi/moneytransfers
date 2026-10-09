"use client";

import Link from "@/components/EligibleLink";
import { useEffect, useId, useRef, useState } from "react";
import CircleFlag from "@/components/CircleFlag";
import { getProviderName, type TransferQuote } from "@/data/providers";
import { fetchQuotes } from "@/lib/fetch-quotes";
import {
  APPLY_SEARCH_EVENT,
  closeLastSearch,
  destinationCountry,
  recordOffer,
  searchHref,
  type LastSearch,
} from "@/lib/last-search";
import { trackWelcomeBackClicked, trackWelcomeBackDismissed, trackWelcomeBackShown } from "@/lib/analytics";

/** Show without a quote rather than keep a returning visitor waiting on one. */
const QUOTE_TIMEOUT_MS = 3500;
/** A top payout within this share of the last one is "about the same". */
const SAME_SHARE = 0.0005;

const count = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const money = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: n < 100 ? 2 : 0 }).format(n);

function since(at: number, now: number): string {
  const day = (t: number) => {
    const d = new Date(t);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  };
  const days = Math.round((day(now) - day(at)) / 86_400_000);
  if (days <= 0) return "earlier today";
  if (days === 1) return "yesterday";
  return `on ${new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

/**
 * Live mid-market rates, as /send-money forwards them, so the payout offered
 * here is the one the visitor lands on — and is on the same basis as the top
 * payout /send-money recorded, which is what makes the two comparable.
 */
async function liveRates(signal: AbortSignal): Promise<Record<string, number> | undefined> {
  try {
    const res = await fetch("/api/rates", { signal });
    return res.ok ? ((await res.json()).rates as Record<string, number>) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The offer itself: the visitor's last comparison, today's top quote for it,
 * and how that payout compares with the one they saw. Fixed under the header
 * (the bottom edge belongs to StickyBestCTA), so it never moves the page.
 */
export default function WelcomeBackCard({
  search,
  onSendMoney,
  onDone,
}: {
  search: LastSearch;
  /** On /send-money the offer fills in the form instead of navigating. */
  onSendMoney: boolean;
  onDone: () => void;
}) {
  const [quotes, setQuotes] = useState<TransferQuote[] | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const { from, to, amount } = search;

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => setQuotes((q) => q ?? []), QUOTE_TIMEOUT_MS);
    liveRates(controller.signal)
      .then((rates) => fetchQuotes(amount, from, to, controller.signal, rates))
      .then((q) => {
        // Once the card is up without a quote, a late one would make it jump.
        if (!controller.signal.aborted) setQuotes((current) => current ?? q.filter((x) => !x.isIndicative));
      });
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [amount, from, to]);

  const ready = quotes !== null;
  const top = quotes?.[0];
  const delta = top && search.top && top.sendAmount === amount ? top.receiveAmount - search.top.receive : null;
  const change: "up" | "down" | "same" | "none" =
    delta === null ? "none" : Math.abs(delta) < search.top!.receive * SAME_SHARE ? "same" : delta > 0 ? "up" : "down";

  // Counted once it is on screen: an offer that never rendered was not refused.
  const shown = useRef(false);
  useEffect(() => {
    if (!ready || shown.current) return;
    shown.current = true;
    recordOffer();
    trackWelcomeBackShown(from, to, search.kind, Math.floor((Date.now() - search.at) / 86_400_000), change);
  }, [ready, from, to, search.kind, search.at, change]);

  // Reading on is an answer too: the offer leaves once the reader scrolls half
  // a screen, so it never sits over the page they chose instead.
  useEffect(() => {
    if (!ready) return;
    const start = window.scrollY;
    const onScroll = () => {
      if (cardRef.current?.contains(document.activeElement)) return;
      if (Math.abs(window.scrollY - start) > window.innerHeight / 2) onDone();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready, onDone]);

  function dismiss() {
    closeLastSearch();
    trackWelcomeBackDismissed(from, to);
    onDone();
  }

  useEffect(() => {
    if (!ready) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || document.querySelector("dialog[open]")) return;
      const focus = document.activeElement;
      if (focus && focus !== document.body && !cardRef.current?.contains(focus)) return;
      dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (quotes === null) return null;

  const country = destinationCountry(to);
  const title = country ? `Still sending money to ${country}?` : `Still comparing ${from} to ${to}?`;
  const href = searchHref(search);

  return (
    <aside ref={cardRef} data-welcome-back="" aria-labelledby={titleId} className="welcome-back animate-pwa-drop">
      <button type="button" onClick={dismiss} className="welcome-back-close" aria-label="Dismiss saved comparison">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <p className="welcome-back-eyebrow">Welcome back</p>
      <h2 id={titleId} className="welcome-back-title">{title}</h2>

      <div className="welcome-back-quote">
        <p className="welcome-back-pair">
          <CircleFlag code={from} size={20} />
          <span>{count.format(amount)} {from}</span>
          <span aria-hidden="true" className="welcome-back-arrow">→</span>
          <span className="sr-only">to</span>
          <CircleFlag code={to} size={20} />
          <span>{top ? `${money(top.receiveAmount)} ${to}` : to}</span>
        </p>
        {top && (
          <p className="welcome-back-meta">
            {quotes.length > 1 ? "Top quote today" : "Today’s quote"}: {getProviderName(top.providerSlug)}
          </p>
        )}
        {delta !== null && change !== "same" && (
          <p className={`welcome-back-change welcome-back-change--${change}`}>
            <span aria-hidden="true">{change === "up" ? "▲" : "▼"}</span>{" "}
            {money(Math.abs(delta))} {to} {change === "up" ? "more" : "less"} than {since(search.at, Date.now())}
          </p>
        )}
        {change === "same" && <p className="welcome-back-change">About the same as {since(search.at, Date.now())}</p>}
      </div>

      <div className="welcome-back-actions">
        <a
          href={href}
          className="conversion-button conversion-button--accent"
          onClick={(e) => {
            trackWelcomeBackClicked(from, to, "compare");
            if (!onSendMoney) return;
            e.preventDefault();
            window.dispatchEvent(new CustomEvent(APPLY_SEARCH_EVENT, { detail: { from, to, amount } }));
            onDone();
          }}
        >
          Compare again<span aria-hidden="true">→</span>
        </a>
        <Link
          href="/send-money"
          className="welcome-back-secondary"
          onClick={(e) => {
            closeLastSearch();
            trackWelcomeBackClicked(from, to, "new_search");
            if (!onSendMoney) return;
            e.preventDefault();
            onDone();
            const field = document.getElementById("transfer-amount") as HTMLInputElement | null;
            field?.focus();
            field?.select();
          }}
        >
          New search
        </Link>
      </div>
    </aside>
  );
}
