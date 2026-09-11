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
    answer = `We have one provider estimate for ${format(amount)} ${fromCurrency} to ${toCurrency}: ${providerName(best.providerSlug)}, with an estimated payout of ${format(best.receiveAmount)} ${toCurrency}. One estimate is not enough to establish the cheapest option.`;
  } else {
    answer = `For ${format(amount)} ${fromCurrency} to ${toCurrency}, ${providerName(best.providerSlug)} ranks first among ${compared.length} provider estimates, with an estimated payout of ${format(best.receiveAmount)} ${toCurrency}.`;
    if (highest.receiveAmount > best.receiveAmount) {
      answer += ` ${providerName(highest.providerSlug)} has a higher estimated payout by ${format(highest.receiveAmount - best.receiveAmount)} ${toCurrency}; the table uses customer ratings to order closely matched estimates.`;
    }
    if (difference > 0) {
      answer += ` The first-ranked estimate pays ${format(difference)} ${toCurrency} more than the lowest estimate in this comparison.`;
    }
  }
  return { compared, best, highest, lowest, difference, answer };
}
