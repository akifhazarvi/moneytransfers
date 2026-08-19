/**
 * Amount-aware fee and markup estimation — server-only (reads the scraped set).
 *
 * The quote engine used to take the fee scraped at the nearest amount bucket and
 * apply it verbatim at whatever amount the user asked for, on the stated
 * assumption that transfer fees are flat. Measured against our own archive that
 * assumption holds for only ~45% of provider+corridor pairs. TapTap Send, LemFi,
 * Paysend and Ria really are flat; Wise, OFX, Western Union, Remitly, Instarem
 * and Xoom charge a percentage. Wise USD->IDR runs
 *
 *     $100:$1.66   $1,000:$6.40   $5,000:$18.30
 *
 * so reusing the $100 fee at $50,000 understated Wise's cost by ~100x and handed
 * it a "cheapest" badge it had not earned. Across all 1,955 corridor x amount
 * combinations, 52% of winners were priced from a bucket >=5x away from the
 * requested amount — the winner was substantially decided by whose data happened
 * to be stale rather than by who was actually cheapest.
 *
 * This module replaces that guess with an estimate derived from each provider's
 * own observed pricing, and reports how well-supported the estimate is so the
 * engine can decline to show a number it cannot stand behind.
 */
import { quotesByCorridor, type NormalizedQuote } from "@/lib/unified-quotes";

export interface PricePoint {
  amount: number;
  fee: number;
  markup: number; // percentage
  sourcePriority: number;
  deliveryEstimate: string | null;
  promoNote?: string;
}

/** How a provider's transfer fee behaves as the send amount grows. */
export type FeeModel = "flat" | "proportional" | "unknown";

/**
 * How well the estimate is supported by real observations:
 *  - "observed"      exact amount was scraped; no estimation at all
 *  - "interpolated"  target sits between two observations (most reliable estimate)
 *  - "extrapolated"  target is outside the observed range but close enough to trust
 *  - "unsupported"   nearest observation is so far away the number would be fiction
 */
export type Confidence = "observed" | "interpolated" | "extrapolated" | "unsupported";

/**
 * Beyond this ratio between target and the nearest observed amount we refuse to
 * guess at all. It is set deliberately wide because the estimate is now
 * MODEL-based rather than a naive carry-over: for a proportional provider we
 * apply its own observed rate-of-fee (Wise ~0.37%), and for a flat provider we
 * keep the flat fee — both of which are how those providers genuinely price, so
 * projecting them is defensible in a way that reusing a $100 fee at $50,000
 * never was. Markup is clamped rather than projected (see estimatePricing).
 *
 * A tighter bound (20) was tried first and was wrong: most corridors top out at
 * $1,000-$5,000 of scraped data, so it emptied 737 corridors at the $50,000
 * preset — including GBP->USD, which holds 43 quotes. Showing nothing is not
 * more accurate than showing a well-founded estimate, it is just less useful.
 */
const UNSUPPORTED_RATIO = 100;
/** A fee above this share of the send amount is treated as a runaway extrapolation. */
const MAX_FEE_SHARE = 0.1;

/**
 * Collapse a corridor's quotes into one price point per (provider, amount),
 * keeping the best-quality source at each amount.
 */
export function buildPricePoints(quotes: NormalizedQuote[]): Map<string, PricePoint[]> {
  const byProvider = new Map<string, Map<number, PricePoint>>();
  for (const q of quotes) {
    let amounts = byProvider.get(q.providerSlug);
    if (!amounts) {
      amounts = new Map();
      byProvider.set(q.providerSlug, amounts);
    }
    const existing = amounts.get(q.sendAmount);
    if (!existing || q.sourcePriority < existing.sourcePriority) {
      amounts.set(q.sendAmount, {
        amount: q.sendAmount,
        fee: q.fee,
        markup: q.markup,
        sourcePriority: q.sourcePriority,
        deliveryEstimate: q.deliveryEstimate,
        ...(q.promoNote ? { promoNote: q.promoNote } : {}),
      });
    }
  }
  const out = new Map<string, PricePoint[]>();
  for (const [slug, amounts] of byProvider) {
    out.set(slug, [...amounts.values()].sort((a, b) => a.amount - b.amount));
  }
  return out;
}

/**
 * Classify each provider's fee model from its behaviour across EVERY corridor.
 * A single corridor rarely has enough spread to be conclusive, but a provider's
 * pricing structure is a property of the provider, so pooling corridors gives a
 * far larger sample — this is what lets us price a provider correctly in a
 * corridor where we only ever scraped one amount.
 */
function classifyFeeModels(): Record<string, FeeModel> {
  const tally = new Map<string, { flat: number; proportional: number }>();

  for (const quotes of Object.values(quotesByCorridor)) {
    for (const [slug, points] of buildPricePoints(quotes)) {
      if (points.length < 2) continue;
      const lo = points[0];
      const hi = points[points.length - 1];
      // Need a real spread before the comparison means anything.
      if (hi.amount / lo.amount < 3) continue;

      const entry = tally.get(slug) ?? { flat: 0, proportional: 0 };
      if (lo.fee === 0 && hi.fee === 0) {
        // Zero-fee at both ends is flat by definition (cost is in the rate).
        entry.flat++;
      } else if (lo.fee > 0 && hi.fee / lo.fee >= (hi.amount / lo.amount) * 0.5) {
        entry.proportional++;
      } else if (lo.fee > 0 && hi.fee / lo.fee < 1.5) {
        entry.flat++;
      }
      tally.set(slug, entry);
    }
  }

  const models: Record<string, FeeModel> = {};
  for (const [slug, { flat, proportional }] of tally) {
    if (flat === 0 && proportional === 0) continue;
    models[slug] = proportional > flat ? "proportional" : "flat";
  }
  return models;
}

let feeModelCache: Record<string, FeeModel> | null = null;
export function feeModelFor(providerSlug: string): FeeModel {
  if (!feeModelCache) feeModelCache = classifyFeeModels();
  return feeModelCache[providerSlug] ?? "unknown";
}

export interface PriceEstimate {
  fee: number;
  markup: number;
  confidence: Confidence;
  /** The observed amount the estimate leans on most — for debugging/diffs. */
  anchorAmount: number;
  deliveryEstimate: string | null;
  promoNote?: string;
}

/**
 * Estimate fee and markup at `target` from a provider's observed price points.
 *
 * Markup is deliberately clamped rather than extrapolated outside the observed
 * range: it is already a percentage, and provider spreads flatten at the edges
 * instead of continuing to trend, so projecting the slope invents precision.
 * The fee is where the real error was, so that is what we model.
 */
export function estimatePricing(
  points: PricePoint[],
  target: number,
  model: FeeModel,
): PriceEstimate | null {
  if (!points.length) return null;

  const nearest = points.reduce((best, p) =>
    Math.abs(p.amount - target) < Math.abs(best.amount - target) ? p : best,
  );
  const base = {
    deliveryEstimate: nearest.deliveryEstimate,
    anchorAmount: nearest.amount,
    ...(nearest.promoNote ? { promoNote: nearest.promoNote } : {}),
  };

  // Exact hit — nothing to estimate.
  const exact = points.find((p) => p.amount === target);
  if (exact) {
    return { ...base, fee: exact.fee, markup: exact.markup, confidence: "observed", anchorAmount: exact.amount };
  }

  const lo = points[0];
  const hi = points[points.length - 1];

  // Inside the observed range: interpolate both fee and markup between the
  // bracketing observations. This is the most defensible case — the answer is
  // bounded on both sides by something we actually measured.
  if (target > lo.amount && target < hi.amount) {
    let left = lo;
    let right = hi;
    for (const p of points) {
      if (p.amount <= target && p.amount >= left.amount) left = p;
      if (p.amount >= target && p.amount <= right.amount) right = p;
    }
    const span = right.amount - left.amount;
    const t = span > 0 ? (target - left.amount) / span : 0;
    return {
      ...base,
      fee: clampFee(left.fee + (right.fee - left.fee) * t, target),
      markup: left.markup + (right.markup - left.markup) * t,
      confidence: "interpolated",
    };
  }

  // Outside the observed range. Refuse when the gap is so wide that any number
  // would be invention rather than estimation.
  const ratio = target > hi.amount ? target / hi.amount : lo.amount / target;
  if (ratio > UNSUPPORTED_RATIO) return { ...base, fee: NaN, markup: NaN, confidence: "unsupported" };

  const edge = target > hi.amount ? hi : lo;
  const markup = edge.markup; // clamped, per the note above

  // With two or more points, the provider's own local slope is a better guide
  // than any assumption we could impose.
  if (points.length >= 2) {
    const [a, b] = target > hi.amount
      ? [points[points.length - 2], hi]
      : [lo, points[1]];
    const run = b.amount - a.amount;
    const slope = run > 0 ? (b.fee - a.fee) / run : 0;
    const projected = edge.fee + slope * (target - edge.amount);
    return { ...base, fee: clampFee(projected, target), markup, confidence: "extrapolated" };
  }

  // Single observation: fall back to the provider's cross-corridor fee model,
  // anchored on the one fee level we did see in THIS corridor (fee levels vary
  // a lot by corridor, so scaling the local observation beats a global average).
  const fee = model === "proportional" ? edge.fee * (target / edge.amount) : edge.fee;
  return { ...base, fee: clampFee(fee, target), markup, confidence: "extrapolated" };
}

function clampFee(fee: number, target: number): number {
  if (!Number.isFinite(fee) || fee < 0) return 0;
  return Math.min(fee, target * MAX_FEE_SHARE);
}
