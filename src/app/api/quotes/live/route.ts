import { NextResponse } from "next/server";
import { fetchComparison, type WiseComparisonQuote } from "@/lib/wise-comparison";

/**
 * Live competitor quotes for one corridor, fetched per request.
 *
 * WHY THIS EXISTS
 * Everything else on the site serves quotes embedded at build time: the
 * scrapers commit JSON, a deploy bakes it in, and `/api/quotes` reads that same
 * bundle. So a client fetching `/api/quotes` gets exactly the numbers the
 * server already rendered — fresher only in the sense that the page might be
 * older than the deploy. This route is the one place that actually goes
 * upstream at request time.
 *
 * WHY IT IS SAFE TO ADD
 * Pages stay prerendered. The server renders the embedded quotes, so a crawler
 * gets a complete page with real numbers; this route only ever *upgrades* what
 * a hydrated browser shows. Nothing here makes a page dynamic, which matters:
 * the no-store regression that broke Google indexing in May came from exactly
 * that kind of change.
 *
 * CACHING
 * 60 seconds at the CDN with a 5-minute stale window. Wise's endpoint answers
 * in ~350ms and returns 8-17 competing providers in one call, so a short TTL
 * keeps the view genuinely live without turning every pageview into an upstream
 * request. Measured against our own archive, 89% of provider-corridor-days show
 * no intraday change at all — so this is about the minority of corridors that
 * do move, and about the moment just before someone sends.
 */

// Never prerender: the entire point is to go upstream on request.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Send-country hint Wise wants alongside the currency. */
const COUNTRY_FOR: Record<string, string> = {
  USD: "US", GBP: "GB", EUR: "DE", CAD: "CA", AUD: "AU", NZD: "NZ",
  SGD: "SG", AED: "AE", CHF: "CH", SEK: "SE", NOK: "NO", DKK: "DK",
  JPY: "JP", HKD: "HK", ZAR: "ZA", PLN: "PL",
};

const MAX_AMOUNT = 1_000_000;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = (searchParams.get("from") || "").toUpperCase();
  const to = (searchParams.get("to") || "").toUpperCase();
  const amount = Number(searchParams.get("amount"));

  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || from === to) {
    return NextResponse.json({ error: "Invalid 'from' or 'to'" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return NextResponse.json({ error: "Invalid 'amount'" }, { status: 400 });
  }

  try {
    const quotes: WiseComparisonQuote[] = await fetchComparison(
      from,
      to,
      COUNTRY_FOR[from] ?? "US",
      amount,
    );

    // The upstream stamps each quote; report the newest so the UI can show when
    // these numbers were actually collected rather than asserting "live".
    const collectedAt =
      quotes.reduce<string>((newest, q) => (q.dateCollected > newest ? q.dateCollected : newest), "") ||
      new Date().toISOString();

    return NextResponse.json(
      { quotes: quotes.sort((a, b) => b.receiveAmount - a.receiveAmount), collectedAt },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    // Fail soft and say so. The client keeps the server-rendered numbers rather
    // than blanking them — a stale real number beats an empty state.
    return NextResponse.json(
      { error: "upstream unavailable", detail: err instanceof Error ? err.message : String(err) },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
