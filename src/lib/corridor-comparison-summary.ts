import type { TransferQuote } from "@/data/providers";

/** Explain the displayed ranking without treating indicative entries as quotes. */
export function corridorComparisonSummary(
  quotes: readonly TransferQuote[],
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  providerName: (slug: string) => string,
) {
  const compared = quotes.filter((quote) =>
    !quote.isIndicative && quote.sendAmount === amount &&
    quote.sendCurrency === fromCurrency && quote.receiveCurrency === toCurrency &&
    Number.isFinite(quote.receiveAmount) && quote.receiveAmount > 0,
  );
  const best = compared[0];
  const byPayout = [...compared].sort((a, b) => b.receiveAmount - a.receiveAmount);
  const highest = byPayout[0];
  const lowest = byPayout.at(-1);
  const difference = best && lowest ? best.receiveAmount - lowest.receiveAmount : 0;
  const format = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  let answer: string;
  if (!best) {
    answer = `We do not currently have a comparable provider estimate for ${format(amount)} ${fromCurrency} to ${toCurrency}. Request a quote directly from a provider before choosing.`;
  } else if (compared.length === 1) {
    // Worded around the figures: the fixed frames here rendered on every
    // corridor page and were counted as duplicate text (SiteLiner 2026-09-26).
    // The one-estimate caveat stays — content brief round 2, §2.1.
    answer = `${providerName(best.providerSlug)} is the only estimate we hold for ${format(amount)} ${fromCurrency} → ${toCurrency}: ${format(best.receiveAmount)} ${toCurrency}. One estimate cannot establish the cheapest option.`;
  } else {
    answer = `${providerName(best.providerSlug)} ranks first of ${compared.length} for ${format(amount)} ${fromCurrency} → ${toCurrency}: ${format(best.receiveAmount)} ${toCurrency} estimated.`;
    if (highest.receiveAmount > best.receiveAmount) {
      answer += ` Customer ratings order near-ties, so ${providerName(highest.providerSlug)} pays ${format(highest.receiveAmount - best.receiveAmount)} ${toCurrency} more yet ranks below.`;
    }
    if (difference > 0) {
      answer += ` ${format(difference)} ${toCurrency} separates first from last.`;
    }
  }
  return { compared, best, highest, lowest, difference, answer };
}
