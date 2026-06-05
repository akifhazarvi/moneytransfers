import { NextResponse } from "next/server";
import { generateQuotes } from "@/lib/quotes-engine";

// Quotes only change when scrapers run (every 6h) and the build embeds a fresh
// dataset, so this is safe to cache aggressively at the CDN. The static import
// of the scraped quote JSON (taptapsend alone is ~4 MB) stays server-side only
// — this route is the single client-facing door to it, replacing the per-page
// multi-megabyte bundle leak that statically importing generateQuotes caused.
export const revalidate = 3600;

// Cap how many corridors one request may ask for, so a crafted query can't fan
// out into hundreds of generateQuotes() calls. The homepage needs at most 4.
const MAX_CORRIDORS = 8;

/**
 * GET /api/quotes?from=USD&to=INR&amount=1000
 *   → { quotes: TransferQuote[] }  (sorted best-first, indicative quotes last)
 *
 * GET /api/quotes?from=USD&amount=1000&to=INR,MXN,PHP
 *   → { byCorridor: { "USD_INR": TransferQuote[], ... } }
 *
 * The `to` list form lets a client fetch every corridor it renders in one
 * round-trip (e.g. the homepage's top-3 cards + live example) instead of
 * importing the whole dataset to compute them in the browser.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = (searchParams.get("from") || "").toUpperCase();
  const toParam = (searchParams.get("to") || "").toUpperCase();
  const amount = Number(searchParams.get("amount"));

  if (!from || !toParam || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Missing or invalid 'from', 'to', or 'amount'" },
      { status: 400 }
    );
  }

  const tos = toParam
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, MAX_CORRIDORS);

  // Optional live mid-market rates (USD-based, same convention as
  // generateQuotes' liveRates param). The single-corridor caller (the main
  // /send-money page) passes the live rate for the pair so quotes reflect the
  // current market rather than the build-time static rate. We rebuild the
  // minimal { [from]: r, [to]: r } map generateQuotes expects; omitting it
  // (the multi-corridor homepage cards) falls back to the static rate.
  const rateFrom = Number(searchParams.get("rateFrom"));
  const rateTo = Number(searchParams.get("rateTo"));
  const liveRates =
    Number.isFinite(rateFrom) && Number.isFinite(rateTo) && rateFrom > 0 && rateTo > 0
      ? { [from]: rateFrom, [tos[0]]: rateTo }
      : undefined;

  // Single-corridor form: return a flat list (the common case).
  if (tos.length === 1) {
    return NextResponse.json({ quotes: generateQuotes(amount, from, tos[0], liveRates) });
  }

  // Multi-corridor form: keyed by corridor so the client can match each one.
  const byCorridor: Record<string, ReturnType<typeof generateQuotes>> = {};
  for (const to of tos) {
    byCorridor[`${from}_${to}`] = generateQuotes(amount, from, to);
  }
  return NextResponse.json({ byCorridor });
}
