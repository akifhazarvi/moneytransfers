"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useHomeSelection } from "@/components/HomeSelectionContext";
import { getProviderName, providers, type TransferQuote } from "@/data/providers";
import { fetchQuotesByCorridor } from "@/lib/fetch-quotes";
import { GEO_CORRIDORS, DEFAULT_GEO_CONFIG } from "@/data/geo-corridors";
import { getGoUrl } from "@/lib/affiliate";
import { tiedAboveLargerPayout } from "@/lib/rank-quotes";
import TiedNote from "@/components/TiedNote";
import PartnerFeatureBlock from "@/components/PartnerFeatureBlock";
import { trackProviderClicked } from "@/lib/analytics";
import { providerLogo } from "@/lib/provider-logo";

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

  // Map of `${from}_${to}` -> quotes, populated from the API. null = loading.
  const requestKey = `${fromCurrency}_${toCurrency}_${amount}`;
  const [quoteResult, setQuoteResult] = useState<{ key: string; quotes: Record<string, TransferQuote[]> } | null>(null);
  const quotesByCorridor = quoteResult?.key === requestKey ? quoteResult.quotes : null;

  useEffect(() => {
    const controller = new AbortController();
    fetchQuotesByCorridor(amount, fromCurrency, [toCurrency], controller.signal).then((quotes) => {
      if (!controller.signal.aborted) setQuoteResult({ key: requestKey, quotes });
    });
    return () => controller.abort();
  }, [fromCurrency, toCurrency, amount, requestKey]);

  // Every provider quoting this corridor. The headline savings figure and the
  // "compared live" count are both derived from this, NOT from the five rows
  // rendered below.
  //
  // Both used to read off the sliced array, which made the page understate its
  // own product twice over: it claimed "5 compared live" on a corridor where 22
  // providers were quoting, and it computed "save up to X" as the spread across
  // the top five only — ₹451 where the real best-to-worst gap was ₹911. The
  // savings number is the single strongest reason to use the site, and it was
  // being halved.
  const allQuotes = useMemo(
    () => quotesByCorridor?.[`${fromCurrency}_${toCurrency}`] || [],
    [quotesByCorridor, fromCurrency, toCurrency]
  );
  const liveQuotes = useMemo(() => allQuotes.slice(0, 5), [allQuotes]);

  const best = allQuotes[0];
  const worst = allQuotes[allQuotes.length - 1];
  // The sponsored TapTap card, priced on the route the reader picked. Shown
  // above the live table — the paid slot sits outside the ranking, labelled
  // "Sponsored", and the table still opens with the measured best. Skipped when
  // TapTap IS that best row, so one provider is not shown twice in a row.
  const partner = allQuotes.find((q) => q.providerSlug === "taptap-send");
  const showPartner = !!partner && best?.providerSlug !== "taptap-send";
  // Rows the materiality band placed above a visibly larger payout. The order
  // is measured and disclosed; on large-denomination corridors it just needs to
  // say so in the row rather than read as a sort bug.
  const tiedMarks = tiedAboveLargerPayout(liveQuotes);

  // Loading state — keep the section height stable (the lazy wrapper reserves
  // space too) so there's no layout shift while quotes fetch.
  if (quotesByCorridor === null) {
    return (
      <section id="best-routes" className="home-results py-10 sm:py-14 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto h-64 rounded-[20px] bg-[var(--color-surface-dim)] animate-pulse" />
        </div>
      </section>
    );
  }

  if (liveQuotes.length === 0) return null;

  return (
    <section id="best-routes" className="home-results py-10 sm:py-14 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-on-surface)] leading-[1.1]">
            Compare {amount.toLocaleString()} {fromCurrency} to {toCurrency}
          </h2>
          <p className="text-base text-[var(--color-on-surface-variant)] mt-4">
            {allQuotes.length > 1 && best && worst ? (
              <>
                Recipient amounts differ by up to{" "}
                <span className="font-semibold text-[var(--color-on-surface)]">
                  {CURRENCY_SYMBOL[toCurrency] || toCurrency}
                  {(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>{" "}
                across {allQuotes.length} providers for this transfer.
              </>
            ) : (
              <>Live rates for {fromCurrency} → {toCurrency}.</>
            )}
          </p>
        </div>

        {showPartner && partner && (
          <div className="max-w-3xl mx-auto">
            <PartnerFeatureBlock
              source="taptap_spotlight:home"
              variant="card"
              quote={{ fromCurrency, toCurrency, sendAmount: amount, receiveAmount: partner.receiveAmount, exchangeRate: partner.exchangeRate, fee: partner.fee }}
            />
          </div>
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
                Current comparison
              </div>
              {best && worst && (
                <span className="text-[11px] text-[var(--color-on-surface-variant)] tabular-nums">
                  Up to <span className="font-semibold text-[var(--color-on-surface)]">{CURRENCY_SYMBOL[toCurrency] || toCurrency}{(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span> difference
                </span>
              )}
            </div>
            <div className="p-5 sm:p-7 pt-4 sm:pt-5">

            {/* Inline quotes table */}
            <div>
              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                {/* Desktop header */}
                <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_76px_64px_132px_104px] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                  <span>Provider</span>
                  <span className="text-right">Rate</span>
                  <span className="text-right">Fee ({fromCurrency})</span>
                  <span className="text-right">Recipient gets</span>
                  <span />
                </div>
                {liveQuotes.map((q, i) => {
                  const tiedAhead = tiedMarks.has(q.providerSlug);
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
                              {q.fee === 0 ? <span className="text-[var(--color-success-dark)] font-medium">No transfer fee</span> : `${q.fee.toFixed(2)} ${fromCurrency} fee`}
                              {" · "}{q.transferSpeed}
                            </p>
                            {tiedAhead && <TiedNote rating={q.rating} />}
                          </div>
                          <p className={`text-sm font-bold tabular-nums shrink-0 ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                            {toSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <a
                          aria-label={`Continue with ${name}`}
                          href={sendUrl}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          data-pc="1"
                          onClick={() => trackProviderClicked(q.providerSlug, `${fromCurrency}-${toCurrency}`, i + 1, "home_live_example")}
                          className={`flex items-center justify-center gap-1.5 w-full min-h-12 text-sm font-bold rounded-full transition-all active:scale-95 ${
                            isBest
                              ? "bg-[var(--color-success-dark)] text-white hover:bg-[var(--color-success-hover)] shadow-[var(--shadow-success)]"
                              : "bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-outline)]"
                          }`}
                        >
                          Continue with {name}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_76px_64px_132px_104px] gap-2 items-center px-4 sm:px-6 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center border border-[var(--color-outline)]/50">
                            <Image src={logo} alt={`${name} logo`} width={32} height={32} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate flex items-center gap-1.5">
                              {name}
                              {isBest && <span className="text-[10px] text-white bg-[var(--color-success-dark)] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Best</span>}
                            </p>
                            <p className="text-2xs text-[var(--color-on-surface-variant)] truncate">{q.transferSpeed}</p>
                            {tiedAhead && <TiedNote rating={q.rating} />}
                          </div>
                        </div>
                        <p className={`text-sm text-right tabular-nums ${q.isIndicative ? "text-[var(--color-on-surface-variant)]" : "text-[var(--color-on-surface)]"}`}>
                          {q.exchangeRate.toFixed(2)}{q.isIndicative && <span className="ml-0.5 text-2xs italic">est.</span>}
                        </p>
                        <p className={`text-sm text-right tabular-nums ${q.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                          {q.fee.toFixed(2)}
                        </p>
                        <p className={`text-sm font-bold text-right tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                          {toSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <a
                          aria-label={`Continue with ${name}`}
                          href={sendUrl}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          data-pc="1"
                          onClick={() => trackProviderClicked(q.providerSlug, `${fromCurrency}-${toCurrency}`, i + 1, "home_live_example")}
                          className={`inline-flex items-center justify-center gap-1.5 w-full min-h-12 px-3 text-xs font-bold rounded-full transition-all active:scale-95 whitespace-nowrap ${
                            isBest
                              ? "bg-[var(--color-success-dark)] text-white hover:bg-[var(--color-success-hover)] shadow-[var(--shadow-success)]"
                              : "bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-outline)]"
                          }`}
                        >
                          Continue →
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Savings line — quiet, single sentence */}
              {liveQuotes.length >= 2 && best && worst && (
                <p className="mt-4 text-2sm text-[var(--color-on-surface-variant)] text-center">
                  <span className="font-medium text-[var(--color-on-surface)]">{getProviderName(best.providerSlug)}</span> shows{" "}
                  <span className="font-medium tabular-nums text-[var(--color-on-surface)]">
                    {toSymbol}{(best.receiveAmount - worst.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>{" "}
                  more {toCurrency} than {getProviderName(worst.providerSlug)} in this comparison.
                </p>
              )}
            </div>

            <div className="text-center mt-5">
              <a
                href={`/send-money#from=${fromCurrency}&to=${toCurrency}&amount=${amount}`}
                className="inline-flex items-center gap-2 h-11 sm:h-12 bg-[var(--color-cta)] text-[var(--color-cta-text)] rounded-full font-bold text-sm sm:text-md px-8 sm:px-10 hover:bg-[var(--color-cta-hover)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] active:shadow-none active:scale-[0.98] transition-all"
              >
                Compare all {allQuotes.length} options
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <p className="text-2xs text-[var(--color-on-surface-muted)] mt-2">Free · No signup required</p>
            </div>
            </div>{/* end p-5 inner */}
          </div>
        )}
      </div>
    </section>
  );
}
