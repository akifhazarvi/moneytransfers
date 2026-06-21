/**
 * Bank-vs-App Transfer Cost Index — the data spine for the flagship data-story
 * at /guides/bank-vs-app-transfer-cost-2026 and the CSV at
 * /api/data/bank-vs-app-cost.
 *
 * WHY THIS EXISTS
 * This is the site's editorial moat: a high-frequency, names-named, sender-side
 * measure of how much MORE a traditional bank costs vs a specialist app on the
 * same corridor and amount. World Bank RPW is quarterly and never names banks;
 * Wise's reporting is self-interested. We compute it LIVE from the same
 * wise-comparison scrape that refreshes every 6 hours, so the published numbers
 * are always defensible against the data file rather than a stale snapshot.
 *
 * METHODOLOGY (kept deliberately simple so a journalist can reproduce it)
 *   true total cost % = (midMarketReceive − actualReceive) / midMarketReceive × 100
 * where midMarketReceive = sendAmount × midRate(send→receive), and midRate is
 * derived from the latest day in midmarket-history.json (USD-based cross rate:
 * rate[to] / rate[from]). This captures BOTH the FX markup and the upfront fee
 * in one figure, because actualReceive is what the recipient gets after both.
 *
 * Sane bounds (−2%..40%) drop obvious scrape artifacts (a provider quoting
 * above mid-market, or a corridor with a broken rate) without cherry-picking.
 */
import quotes from "@/data/scraped/wise-comparison-quotes.json";
import midmarket from "@/data/scraped/midmarket-history.json";

interface ComparisonQuote {
  provider: string;
  providerSlug: string;
  providerType: string; // "bank" | "moneyTransferProvider"
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  receiveAmount: number;
}

interface MidmarketDay {
  date: string;
  rates: Record<string, number>;
}

const allQuotes = quotes as ComparisonQuote[];
const mmDays = (midmarket as { days: MidmarketDay[] }).days;
const latestDay = mmDays[mmDays.length - 1];
const rates = latestDay.rates;

/** The reporting amount the headline figures are computed on. */
export const HEADLINE_AMOUNT = 1000;

/** Date of the mid-market baseline used for every cost % on the page. */
export const DATA_AS_OF = latestDay.date;

function midRate(from: string, to: string): number | null {
  if (!rates[from] || !rates[to]) return null;
  return rates[to] / rates[from];
}

/** True total cost % for one quote, or null if out of sane bounds / no rate. */
function costPct(q: ComparisonQuote): number | null {
  const mid = midRate(q.sendCurrency, q.receiveCurrency);
  if (!mid) return null;
  const midReceive = q.sendAmount * mid;
  if (midReceive <= 0) return null;
  const pct = ((midReceive - q.receiveAmount) / midReceive) * 100;
  if (!isFinite(pct) || pct < -2 || pct >= 40) return null;
  return pct;
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}
function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}
const round2 = (n: number) => Math.round(n * 100) / 100;

export interface BankRow {
  name: string;
  slug: string;
  avgCostPct: number;
  corridorCount: number;
}

export interface BankVsAppIndex {
  dataAsOf: string;
  amount: number;
  // Headline aggregate cost % at the reporting amount
  bankAvgCostPct: number;
  appAvgCostPct: number;
  bankMedianCostPct: number;
  appMedianCostPct: number;
  /** How many times more banks cost than apps (mean basis), e.g. 1.45 */
  bankVsAppMultiple: number;
  // "vs cheapest provider on the same corridor" — the most concrete sender loss
  bankVsCheapestMeanPct: number;
  bankVsCheapestMedianPct: number;
  // Coverage (for the methodology box — honesty about sample size)
  bankQuoteCount: number;
  appQuoteCount: number;
  corridorCount: number;
  providerCount: number;
  bankCount: number;
  // Named leaderboard of worst-value banks (>=3 corridors), worst first
  worstBanks: BankRow[];
}

/**
 * Compute the full index live. Pure function over the imported data — runs at
 * build time on the static page and per-request (cached) in the CSV route.
 */
export function computeBankVsAppIndex(amount: number = HEADLINE_AMOUNT): BankVsAppIndex {
  const atAmount = allQuotes.filter((q) => q.sendAmount === amount);
  const banks = atAmount.filter((q) => q.providerType === "bank");
  const apps = atAmount.filter((q) => q.providerType === "moneyTransferProvider");

  const bankCosts = banks.map(costPct).filter((x): x is number => x !== null);
  const appCosts = apps.map(costPct).filter((x): x is number => x !== null);

  const bankAvg = mean(bankCosts);
  const appAvg = mean(appCosts);

  // Bank vs cheapest provider in the SAME corridor + amount.
  const byCorridor = new Map<string, ComparisonQuote[]>();
  for (const q of atAmount) {
    const k = `${q.sendCurrency}-${q.receiveCurrency}`;
    const arr = byCorridor.get(k) || [];
    arr.push(q);
    byCorridor.set(k, arr);
  }
  const vsCheapest: number[] = [];
  for (const rows of byCorridor.values()) {
    const best = Math.max(...rows.map((r) => r.receiveAmount)); // most money received
    if (!(best > 0)) continue;
    for (const b of rows.filter((r) => r.providerType === "bank")) {
      const lossPct = ((best - b.receiveAmount) / best) * 100;
      if (isFinite(lossPct) && lossPct >= 0 && lossPct < 40) vsCheapest.push(lossPct);
    }
  }

  // Named worst-value bank leaderboard (>=3 corridors for a fair average).
  const byBank = new Map<string, { slug: string; costs: number[] }>();
  for (const q of banks) {
    const c = costPct(q);
    if (c === null) continue;
    const entry = byBank.get(q.provider) || { slug: q.providerSlug, costs: [] };
    entry.costs.push(c);
    byBank.set(q.provider, entry);
  }
  const worstBanks: BankRow[] = [...byBank.entries()]
    .filter(([, v]) => v.costs.length >= 3)
    .map(([name, v]) => ({
      name,
      slug: v.slug,
      avgCostPct: round2(mean(v.costs)),
      corridorCount: v.costs.length,
    }))
    .sort((a, b) => b.avgCostPct - a.avgCostPct);

  return {
    dataAsOf: DATA_AS_OF,
    amount,
    bankAvgCostPct: round2(bankAvg),
    appAvgCostPct: round2(appAvg),
    bankMedianCostPct: round2(median(bankCosts)),
    appMedianCostPct: round2(median(appCosts)),
    bankVsAppMultiple: appAvg > 0 ? round2(bankAvg / appAvg) : 0,
    bankVsCheapestMeanPct: round2(mean(vsCheapest)),
    bankVsCheapestMedianPct: round2(median(vsCheapest)),
    bankQuoteCount: bankCosts.length,
    appQuoteCount: appCosts.length,
    corridorCount: byCorridor.size,
    providerCount: new Set(atAmount.map((q) => q.providerSlug)).size,
    bankCount: byBank.size,
    worstBanks,
  };
}

/** Per-corridor rows for the CSV download (the journalist-grade raw cut). */
export interface CorridorCostRow {
  corridor: string;
  sendCurrency: string;
  receiveCurrency: string;
  amount: number;
  cheapestProvider: string;
  cheapestReceive: number;
  bankProvider: string;
  bankReceive: number;
  bankCostPct: number;
  bankVsCheapestPct: number;
}

export function computeCorridorRows(amount: number = HEADLINE_AMOUNT): CorridorCostRow[] {
  const atAmount = allQuotes.filter((q) => q.sendAmount === amount);
  const byCorridor = new Map<string, ComparisonQuote[]>();
  for (const q of atAmount) {
    const k = `${q.sendCurrency}-${q.receiveCurrency}`;
    const arr = byCorridor.get(k) || [];
    arr.push(q);
    byCorridor.set(k, arr);
  }
  const rows: CorridorCostRow[] = [];
  for (const [corridor, list] of byCorridor.entries()) {
    const best = list.reduce((a, b) => (b.receiveAmount > a.receiveAmount ? b : a));
    for (const bank of list.filter((r) => r.providerType === "bank")) {
      const cp = costPct(bank);
      if (cp === null) continue;
      const vs = best.receiveAmount > 0 ? ((best.receiveAmount - bank.receiveAmount) / best.receiveAmount) * 100 : 0;
      rows.push({
        corridor,
        sendCurrency: bank.sendCurrency,
        receiveCurrency: bank.receiveCurrency,
        amount,
        cheapestProvider: best.provider,
        cheapestReceive: round2(best.receiveAmount),
        bankProvider: bank.provider,
        bankReceive: round2(bank.receiveAmount),
        bankCostPct: round2(cp),
        bankVsCheapestPct: round2(vs),
      });
    }
  }
  return rows.sort((a, b) => b.bankVsCheapestPct - a.bankVsCheapestPct);
}
