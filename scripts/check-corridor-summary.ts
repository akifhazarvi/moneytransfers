/** Regression checks for financial claims derived from the comparison table. */
import assert from "node:assert/strict";
import type { TransferQuote } from "../src/data/providers";
import { corridorComparisonSummary } from "../src/lib/corridor-comparison-summary";

function quote(providerSlug: string, receiveAmount: number, extra: Partial<TransferQuote> = {}): TransferQuote {
  return { providerSlug, receiveAmount, sendAmount: 1000, sendCurrency: "USD", receiveCurrency: "INR", exchangeRate: receiveAmount / 1000, fee: 0, transferSpeed: "Provider estimate", rating: 4, ratingLabel: "Good", ...extra };
}
const summarize = (quotes: TransferQuote[]) => corridorComparisonSummary(quotes, 1000, "USD", "INR", (slug) => slug);

// An indicative broker used to inflate provider count and become the "worst"
// comparator simply because the engine appends it after measured estimates.
const rows = [quote("ranked-first", 999.5), quote("highest-payout", 1000), quote("lowest", 900), quote("broker", 1500, { isIndicative: true })];
const result = summarize(rows);
assert.equal(result.compared.length, 3);
assert.equal(result.lowest?.providerSlug, "lowest");
assert.equal(result.difference, 99.5);
assert.match(result.answer, /highest-payout has a higher estimated payout by 0.5 INR/);
assert.doesNotMatch(result.answer, /broker|cheapest|today/);
assert.equal(rows[0].providerSlug, "ranked-first", "Summarizing must not reorder the table");

// Merit ordering within a band means the final measured row need not be the
// lowest payout either. Locate the actual minimum, not the last array element.
assert.equal(summarize([quote("first", 1000), quote("lowest", 900), quote("last", 900.5)]).difference, 100);
assert.match(summarize([quote("only", 1000)]).answer, /not enough to establish the cheapest/);
assert.equal(summarize([quote("broker", 1500, { isIndicative: true })]).best, undefined);
assert.match(summarize([]).answer, /do not currently have a comparable provider estimate/);
assert.equal(summarize([quote("wrong-currency", 1000, { receiveCurrency: "PKR" }), quote("wrong-amount", 2000, { sendAmount: 2000 }), quote("invalid", NaN)]).compared.length, 0);
console.log("check:corridor-summary — indicative, near-tie, minimum payout, single-provider and missing-data cases passed");
