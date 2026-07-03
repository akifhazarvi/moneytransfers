/**
 * Crypto / Stablecoin Rail Index
 *
 * The crypto rail is a fundamentally different product from an affiliate
 * money-transfer provider: it has no "Send with X" affiliate link, its cost
 * can be negative (recipient beats mid-market), and it's a multi-step path
 * (fiat on-ramp → blockchain → local off-ramp) rather than a single service.
 *
 * We therefore keep it OUT of the main affiliate comparison ranking and surface
 * it in its own clearly-labelled section with a step-by-step "how it works"
 * breakdown. This preserves `provider_clicked` (our north-star affiliate event)
 * as the dominant CTA while still showing we're more complete than a
 * bank-only comparison.
 *
 * Data source: src/data/scraped/remitroutes-crypto.json (RemitRoutes bridge —
 * itself sourced from CCXT exchanges, exchange REST APIs, and P2P feeds).
 * This is a bridge until we run our own CCXT off-ramp feed.
 */
import cryptoData from "@/data/scraped/remitroutes-crypto.json";

export interface CryptoRailChain {
  name: string;
  token: string;
  networkFee: number | null;
  deliveryTime: string | null;
}

export interface CryptoRail {
  provider: string;
  providerSlug: string;
  railType: "crypto";
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  feePercent: number;
  feeAmount: number;
  exchangeRate: number;
  midMarketRate: number;
  receiveAmount: number;
  deliveryTime: string | null;
  deliveryHours: number | null;
  onRamp: string | null;
  chainName: string | null;
  token: string | null;
  offRamp: string | null;
  networkFee: number | null;
  steps: string[];
  chains: CryptoRailChain[];
  dataSource: string | null;
  dateCollected: string;
  source: string;
}

const rails = cryptoData as CryptoRail[];

// Index by corridor and corridor+amount for fast lookup.
const railsByCorridor: Record<string, CryptoRail[]> = {};
const railsByCorridorAmount: Record<string, CryptoRail[]> = {};
const railAmountsByCorridor: Record<string, number[]> = {};

for (const r of rails) {
  if (!r.sendCurrency || !r.receiveCurrency) continue;
  const corridor = `${r.sendCurrency}_${r.receiveCurrency}`;
  (railsByCorridor[corridor] ||= []).push(r);
  const amountKey = `${corridor}_${r.sendAmount}`;
  (railsByCorridorAmount[amountKey] ||= []).push(r);
  const amts = (railAmountsByCorridor[corridor] ||= []);
  if (!amts.includes(r.sendAmount)) amts.push(r.sendAmount);
}
for (const c of Object.keys(railAmountsByCorridor)) {
  railAmountsByCorridor[c].sort((a, b) => a - b);
}

function nearestAmount(corridor: string, target: number): number | null {
  const pool = railAmountsByCorridor[corridor];
  if (!pool || pool.length === 0) return null;
  return pool.reduce((best, amt) =>
    Math.abs(amt - target) < Math.abs(best - target) ? amt : best
  );
}

/**
 * Returns the crypto rails available for a corridor, ranked cheapest-first
 * (lowest all-in fee %). Snaps `amount` to the nearest scraped bucket for the
 * corridor. Dedupes to the single best chain per off-ramp provider.
 *
 * @param from ISO send currency (e.g. "USD")
 * @param to   ISO receive currency (e.g. "PHP")
 * @param amount send amount; snapped to nearest available bucket
 */
export function getCryptoRails(from: string, to: string, amount = 1000): CryptoRail[] {
  const corridor = `${from}_${to}`;
  const amt = nearestAmount(corridor, amount);
  if (amt == null) return [];
  const list = railsByCorridorAmount[`${corridor}_${amt}`] || [];

  // One row per provider (best/cheapest chain already chosen upstream).
  const byProvider = new Map<string, CryptoRail>();
  for (const r of list) {
    const existing = byProvider.get(r.providerSlug);
    if (!existing || r.feePercent < existing.feePercent) {
      byProvider.set(r.providerSlug, r);
    }
  }
  return [...byProvider.values()].sort((a, b) => a.feePercent - b.feePercent);
}

/** True if we have any crypto-rail data for this corridor. */
export function hasCryptoRails(from: string, to: string): boolean {
  return (railsByCorridor[`${from}_${to}`]?.length ?? 0) > 0;
}

/** The single cheapest crypto rail for a corridor, or null. */
export function getBestCryptoRail(from: string, to: string, amount = 1000): CryptoRail | null {
  return getCryptoRails(from, to, amount)[0] ?? null;
}

/** Corridors (as "FROM_TO" keys) that have at least one crypto rail. */
export function cryptoRailCorridors(): string[] {
  return Object.keys(railsByCorridor);
}

/** Whether a rail uses the Bitcoin Lightning Network (BTC), for badging. */
export function isBitcoinRail(rail: CryptoRail): boolean {
  return rail.chains.some((c) => c.token === "BTC" || /lightning/i.test(c.name));
}

/**
 * For a cash-out COUNTRY (receive currency), return the distinct off-ramp
 * exchanges seen across all source corridors, each with its best (cheapest)
 * rail — for the /cash-out/[country] pages. Deduped by off-ramp provider.
 */
export function getCountryOfframps(
  receiveCurrency: string,
  amount = 1000
): { offRamp: string; rail: CryptoRail }[] {
  const byOfframp = new Map<string, CryptoRail>();
  for (const r of rails) {
    if (r.receiveCurrency !== receiveCurrency) continue;
    if (r.sendAmount !== nearestAmount(`${r.sendCurrency}_${receiveCurrency}`, amount)) continue;
    const key = r.offRamp || r.provider;
    const existing = byOfframp.get(key);
    if (!existing || r.feePercent < existing.feePercent) byOfframp.set(key, r);
  }
  return [...byOfframp.entries()]
    .map(([offRamp, rail]) => ({ offRamp, rail }))
    .sort((a, b) => a.rail.feePercent - b.rail.feePercent);
}

/**
 * Corridors (send→this country) where a crypto rail BEATS mid-market
 * (negative all-in cost), best-first. Powers the "recipient earns a premium"
 * hook. One row per source currency.
 */
export function getBeatsMidMarket(
  receiveCurrency: string,
  amount = 1000
): CryptoRail[] {
  const bySource = new Map<string, CryptoRail>();
  for (const r of rails) {
    if (r.receiveCurrency !== receiveCurrency || r.feePercent >= 0) continue;
    if (r.sendAmount !== nearestAmount(`${r.sendCurrency}_${receiveCurrency}`, amount)) continue;
    const existing = bySource.get(r.sendCurrency);
    if (!existing || r.feePercent < existing.feePercent) bySource.set(r.sendCurrency, r);
  }
  return [...bySource.values()].sort((a, b) => a.feePercent - b.feePercent);
}

/**
 * Global "recipient earns a premium" league table across ALL countries —
 * the single cheapest crypto rail per corridor where cost is negative,
 * best-first. Powers the cost-index crypto section. One row per corridor.
 */
export function getGlobalBeatsMidMarket(amount = 1000, limit = 15): CryptoRail[] {
  const byCorridor = new Map<string, CryptoRail>();
  for (const r of rails) {
    if (r.feePercent >= 0) continue;
    const corridor = `${r.sendCurrency}_${r.receiveCurrency}`;
    if (r.sendAmount !== nearestAmount(corridor, amount)) continue;
    const existing = byCorridor.get(corridor);
    if (!existing || r.feePercent < existing.feePercent) byCorridor.set(corridor, r);
  }
  return [...byCorridor.values()]
    .sort((a, b) => a.feePercent - b.feePercent)
    .slice(0, limit);
}
