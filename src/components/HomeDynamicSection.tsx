"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useHomeSelection } from "@/components/HomeSelectionContext";
import { getProviderName, providers, type TransferQuote } from "@/data/providers";
import { fetchQuotesByCorridor } from "@/lib/fetch-quotes";
import { GEO_CORRIDORS, DEFAULT_GEO_CONFIG } from "@/data/geo-corridors";
import { getGoUrl } from "@/lib/affiliate";
import { trackProviderClicked } from "@/lib/analytics";
import { providerLogo } from "@/lib/provider-logo";
import { COVERAGE } from "@/lib/site-stats";

// Flag emoji (regional-indicator pairs) don't render on Windows/some Android —
// they show as bare letters like "IN"/"EU". Decode the emoji to an ISO code so
// we can render a real flag image that works on every platform.
function flagToISO(flag: string): string | null {
  const A = 0x1f1e6; // regional indicator "A"
  const letters = Array.from(flag)
    .map((ch) => ch.codePointAt(0) ?? 0)
    .filter((cp) => cp >= A && cp <= A + 25)
    .map((cp) => String.fromCharCode(cp - A + 65));
  return letters.length >= 2 ? letters.slice(0, 2).join("").toLowerCase() : null;
}

function CorridorFlag({ flag }: { flag: string }) {
  const iso = flagToISO(flag);
  if (!iso) return <span className="text-sm sm:text-lg">{flag}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/h20/${iso}.png`}
      srcSet={`https://flagcdn.com/h40/${iso}.png 2x`}
      width={20}
      height={15}
      alt=""
      loading="lazy"
      className="h-3.5 sm:h-4 w-auto rounded-[2px] shrink-0 object-cover"
    />
  );
}

export default function HomeDynamicSection() {
  const { fromCurrency, toCurrency, amount } = useHomeSelection();

  const geoConfig = GEO_CORRIDORS[fromCurrency] ?? DEFAULT_GEO_CONFIG;

  // Find the symbol for toCurrency — check geo corridors first, then a fallback map
  const CURRENCY_SYMBOL: Record<string, string> = {
    INR: "₹", PKR: "Rs", MXN: "MX$", PHP: "₱", EUR: "€", GBP: "£",
    NGN: "₦", BDT: "৳", IDR: "Rp", VND: "₫", EGP: "E£", MAD: "MAD",
    TRY: "₺", KES: "KSh", ZMW: "ZK", USD: "$", CAD: "C$", AUD: "A$",
    NZD: "NZ$", SGD: "S$", AED: "د.إ", SAR: "﷼", CHF: "CHF",
    HKD: "HK$", JPY: "¥", KRW: "₩", MYR: "RM", ZAR: "R", NPR: "Rs",
    BRL: "R$", THB: "฿", PLN: "zł", RON: "lei", NOK: "kr", SEK: "kr",
    DKK: "kr", CZK: "Kč", HUF: "Ft", ILS: "₪", KWD: "KD", QAR: "QR",
    BHD: "BD", OMR: "RO",
  };

  const toSymbol =
    geoConfig.popularCorridors.find((c) => c.toCurrency === toCurrency)?.symbol ??
    CURRENCY_SYMBOL[toCurrency] ??
    toCurrency;

  // The top-3 corridor list (cards) and the selected corridor (live example)
  // share fromCurrency + amount, so we fetch every corridor we render in one
  // /api/quotes round-trip instead of importing the multi-megabyte dataset.
  const topCorridors = useMemo(() => {
    const base = geoConfig.popularCorridors.slice(0, 5);
    const idx = base.findIndex((c) => c.toCurrency === toCurrency);
    let sorted = base;
    if (idx > 0) {
      sorted = [base[idx], ...base.slice(0, idx), ...base.slice(idx + 1)];
    }
    return sorted.slice(0, 3);
  }, [toCurrency, geoConfig]);

  // Map of `${from}_${to}` -> quotes, populated from the API. null = loading.
  const [quotesByCorridor, setQuotesByCorridor] = useState<Record<
    string,
    TransferQuote[]
  > | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setQuotesByCorridor(null);
    // Every corridor we need: the selected one (live example) + the top-3 cards.
    const tos = Array.from(
      new Set([toCurrency, ...topCorridors.map((c) => c.toCurrency)])
    );
    fetchQuotesByCorridor(amount, fromCurrency, tos, controller.signal).then(
      (map) => {
        if (!controller.signal.aborted) setQuotesByCorridor(map);
      }
    );
    return () => controller.abort();
  }, [fromCurrency, toCurrency, amount, topCorridors]);

  const corridors = useMemo(() => {
    if (!quotesByCorridor) return [];
    return topCorridors
      .map((c) => {
        const best = quotesByCorridor[`${fromCurrency}_${c.toCurrency}`]?.[0];
        const provider = best
          ? providers.find((p) => p.slug === best.providerSlug)
          : null;
        return {
          ...c,
          providerName: best ? getProviderName(best.providerSlug) : null,
          providerSlug: best?.providerSlug || null,
          providerLogo:
            best ? providerLogo(best.providerSlug, provider?.logo) : null,
          receiveAmount: best?.receiveAmount || 0,
          exchangeRate: best?.exchangeRate || 0,
          fee: best?.fee ?? 0,
        };
      })
      .filter((c) => c.providerName);
  }, [quotesByCorridor, topCorridors, fromCurrency]);

  const liveQuotes = useMemo(
    () => (quotesByCorridor?.[`${fromCurrency}_${toCurrency}`] || []).slice(0, 5),
    [quotesByCorridor, fromCurrency, toCurrency]
  );

  const best = liveQuotes[0];
  const worst = liveQuotes[liveQuotes.length - 1];

  // Loading state — keep the section height stable (the lazy wrapper reserves
  // space too) so there's no layout shift while quotes fetch.
  if (quotesByCorridor === null) {
    return (
      <section id="best-routes" className="py-16 sm:py-24 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto h-64 rounded-[20px] bg-[var(--color-surface-dim)] animate-pulse" />
        </div>
      </section>
    );
  }

  if (corridors.length === 0 && liveQuotes.length === 0) return null;

  return (
    <section id="best-routes" className="py-16 sm:py-24 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-on-surface)] leading-[1.1]">
            Best app to send {amount.toLocaleString()} {fromCurrency} to {toCurrency}
          </h2>
          <p className="text-base text-[var(--color-on-surface-variant)] mt-4">
            {liveQuotes.length > 1 && best && worst ? (
              <>
                Save up to{" "}
                <span className="font-semibold text-[var(--color-on-surface)]">
                  {CURRENCY_SYMBOL[toCurrency] || toCurrency}
                  {(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>{" "}
                by choosing the right provider — {liveQuotes.length} compared live.
              </>
            ) : (
              <>Live rates from {liveQuotes.length}+ providers.</>
            )}
          </p>
        </div>

        {/* Top-3 corridor cards — desktop only; on mobile they're redundant after the widget selection */}
        {corridors.length > 0 && (
          <>
          <div className="hidden sm:flex items-center gap-3 max-w-4xl mx-auto mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-muted)]">Popular routes</span>
            <span className="flex-1 h-px bg-[var(--color-outline)]" />
          </div>
          <div className="hidden sm:grid grid-cols-3 gap-5 max-w-4xl mx-auto mb-14">
            {corridors.map((c, idx) => {
              const isSelected = c.toCurrency === toCurrency;
              return (
                <Link
                  key={c.toCurrency}
                  href={`/send-money/${c.corridorSlug}`}
                  className={`group relative flex flex-col p-5 sm:p-6 rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? "bg-[var(--color-surface)] ring-2 ring-[var(--color-accent)] shadow-[var(--shadow-lg)] -translate-y-0.5"
                      : "bg-[var(--color-surface)] ring-1 ring-[var(--color-outline)]/70 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 hover:ring-[var(--color-primary-light)]"
                  }`}
                >
                  {idx === 0 && (
                    <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-white bg-[var(--color-success-dark)] px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <CorridorFlag flag={c.flag} />
                    <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${isSelected ? "text-[var(--color-accent-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                      {fromCurrency} → {c.toCurrency}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2.5 mb-2.5 sm:mb-3">
                    {c.providerLogo && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center border border-[var(--color-outline)]/50">
                        <Image src={c.providerLogo} alt={`${c.providerName} logo`} width={32} height={32} className="w-full h-full object-contain p-1" />
                      </div>
                    )}
                    <p className={`text-2sm sm:text-sm font-bold truncate text-[var(--color-on-surface)] transition-colors`}>
                      {c.providerName}
                    </p>
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-[var(--color-success-dark)] mb-2.5 sm:mb-3">
                    {c.symbol}{c.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    <span className="hidden sm:inline font-normal text-[var(--color-on-surface-variant)]"> for {amount.toLocaleString()} {fromCurrency}</span>
                  </p>
                  {/* CTA — the action users need to see */}
                  <div className={`mt-auto flex items-center justify-center gap-1.5 w-full h-9 sm:h-10 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[var(--color-on-surface)] text-[var(--color-surface)] shadow-[var(--shadow-primary)]"
                      : "bg-[var(--color-surface-dim)] text-[var(--color-on-surface-variant)] group-hover:bg-[var(--color-on-surface)] group-hover:text-[var(--color-surface)]"
                  }`}>
                    Compare rates
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
          </>
        )}

        {/* Live example table — Apple-quiet header. Surface bg, dark text, dot indicator. */}
        {liveQuotes.length > 0 && (
          <div className="max-w-3xl mx-auto bg-[var(--color-surface)] rounded-[20px] shadow-[var(--shadow-lg)] ring-1 ring-[var(--color-outline)]/60 overflow-hidden">
            <div className="px-5 sm:px-7 py-4 border-b border-[var(--color-outline)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-success)]" />
                </span>
                Live · Updated 6h ago
              </div>
              {best && worst && (
                <span className="text-[11px] text-[var(--color-on-surface-variant)] tabular-nums">
                  Up to <span className="font-semibold text-[var(--color-on-surface)]">{CURRENCY_SYMBOL[toCurrency] || toCurrency}{(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span> difference
                </span>
              )}
            </div>
            <div className="p-5 sm:p-7 pt-4 sm:pt-5">

            {/* Inline quotes table */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                {/* Desktop header */}
                <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_90px_80px_120px_auto] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                  <span>Provider</span>
                  <span className="text-right">Rate</span>
                  <span className="text-right">Fee</span>
                  <span className="text-right">You Get</span>
                  <span />
                </div>
                {liveQuotes.map((q, i) => {
                  const name = getProviderName(q.providerSlug);
                  const provider = providers.find((p) => p.slug === q.providerSlug);
                  const logo = providerLogo(q.providerSlug, provider?.logo);
                  const isBest = i === 0;
                  const sendUrl = getGoUrl(q.providerSlug, {
                    sourceCurrency: q.sendCurrency,
                    targetCurrency: q.receiveCurrency,
                    sourceAmount: q.sendAmount,
                    clickref: "home_live_example",
                  });
                  return (
                    <div
                      key={q.providerSlug}
                      className={`border-t border-[var(--color-outline)] ${isBest ? "bg-[var(--color-success-surface)]/40" : ""}`}
                    >
                      {/* Mobile layout */}
                      <div className="sm:hidden px-4 py-3.5">
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center border border-[var(--color-outline)]/50">
                            <Image src={logo} alt={`${name} logo`} width={36} height={36} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate flex items-center gap-1.5">
                              {name}
                              {isBest && <span className="text-[10px] text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Best</span>}
                            </p>
                            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                              {q.fee === 0 ? <span className="text-[var(--color-success-dark)] font-medium">Free</span> : `$${q.fee.toFixed(2)} fee`}
                              {" · "}{q.transferSpeed}
                            </p>
                          </div>
                          <p className={`text-sm font-bold tabular-nums shrink-0 ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                            {toSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <a
                          href={sendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackProviderClicked(q.providerSlug, `${fromCurrency}-${toCurrency}`, i + 1, "home_live_example")}
                          className={`flex items-center justify-center gap-1.5 w-full h-10 text-sm font-bold rounded-full transition-all active:scale-95 ${
                            isBest
                              ? "bg-[var(--color-success-dark)] text-white hover:bg-[var(--color-success-hover)] shadow-[var(--shadow-success)]"
                              : "bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-outline)]"
                          }`}
                        >
                          {isBest ? `Send with ${name}` : `Send →`}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_90px_80px_130px_auto] gap-2 items-center px-4 sm:px-6 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center border border-[var(--color-outline)]/50">
                            <Image src={logo} alt={`${name} logo`} width={32} height={32} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate flex items-center gap-1.5">
                              {name}
                              {isBest && <span className="text-[10px] text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Best</span>}
                            </p>
                            <p className="text-2xs text-[var(--color-on-surface-variant)]">{q.transferSpeed}</p>
                          </div>
                        </div>
                        <p className={`text-sm text-right tabular-nums ${q.isIndicative ? "text-[var(--color-on-surface-variant)]" : "text-[var(--color-on-surface)]"}`}>
                          {q.exchangeRate.toFixed(2)}{q.isIndicative && <span className="ml-0.5 text-2xs italic">est.</span>}
                        </p>
                        <p className={`text-sm text-right tabular-nums ${q.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                          {q.fee === 0 ? "Free" : `$${q.fee.toFixed(2)}`}
                        </p>
                        <p className={`text-sm font-bold text-right tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                          {toSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <a
                          href={sendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackProviderClicked(q.providerSlug, `${fromCurrency}-${toCurrency}`, i + 1, "home_live_example")}
                          className={`inline-flex items-center gap-1.5 h-10 px-4 text-xs font-bold rounded-full transition-all active:scale-95 whitespace-nowrap ${
                            isBest
                              ? "bg-[var(--color-success-dark)] text-white hover:bg-[var(--color-success-hover)] shadow-[var(--shadow-success)]"
                              : "bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-outline)]"
                          }`}
                        >
                          {isBest ? `Send with ${name}` : `Send →`}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Savings line — quiet, single sentence */}
              {liveQuotes.length >= 2 && best && worst && (
                <p className="mt-4 text-2sm text-[var(--color-on-surface-variant)] text-center">
                  <span className="font-medium text-[var(--color-on-surface)]">{getProviderName(best.providerSlug)}</span> saves you{" "}
                  <span className="font-medium tabular-nums text-[var(--color-on-surface)]">
                    {toSymbol}{(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>{" "}
                  vs {getProviderName(worst.providerSlug)}.
                </p>
              )}
            </div>

            <div className="text-center mt-5">
              <Link
                href={`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`}
                className="inline-flex items-center gap-2 h-11 sm:h-12 bg-[var(--color-cta)] text-[var(--color-cta-text)] rounded-full font-bold text-sm sm:text-md px-8 sm:px-10 hover:bg-[var(--color-cta-hover)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] active:shadow-none active:scale-[0.98] transition-all"
              >
                Compare all {COVERAGE.providers}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <p className="text-2xs text-[var(--color-on-surface-muted)] mt-2">Free · No signup required</p>
            </div>
            </div>{/* end p-5 inner */}
          </div>
        )}
      </div>
    </section>
  );
}
