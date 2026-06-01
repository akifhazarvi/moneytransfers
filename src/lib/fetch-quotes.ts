import type { TransferQuote } from "@/data/providers";

// Client-side door to /api/quotes. Importing generateQuotes directly in a
// client component statically bundles the full scraped-quote dataset (~5 MB)
// into that page's JS; fetching keeps the dataset server-side and ships only
// the few KB of quotes actually rendered.

/**
 * Fetch quotes for a single corridor. Returns [] on any error.
 *
 * `liveRates` (optional) are USD-based mid-market rates. When provided, the
 * from/to pair's rates are forwarded so the server applies the live market
 * rate instead of the build-time static one — used by the main /send-money
 * page which refreshes rates every 5 minutes.
 */
export async function fetchQuotes(
  amount: number,
  from: string,
  to: string,
  signal?: AbortSignal,
  liveRates?: Record<string, number>
): Promise<TransferQuote[]> {
  try {
    let url = `/api/quotes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${amount}`;
    const rFrom = liveRates?.[from];
    const rTo = liveRates?.[to];
    if (rFrom && rTo) url += `&rateFrom=${rFrom}&rateTo=${rTo}`;
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.quotes) ? data.quotes : [];
  } catch {
    return [];
  }
}

/**
 * Fetch quotes for several corridors that share a `from` currency and `amount`
 * in one round-trip. Returns a map keyed by `${from}_${to}`. Empty map on error.
 */
export async function fetchQuotesByCorridor(
  amount: number,
  from: string,
  tos: string[],
  signal?: AbortSignal
): Promise<Record<string, TransferQuote[]>> {
  if (tos.length === 0) return {};
  try {
    const res = await fetch(
      `/api/quotes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(tos.join(","))}&amount=${amount}`,
      { signal }
    );
    if (!res.ok) return {};
    const data = await res.json();
    // Single-corridor responses come back as { quotes }, normalize to the map.
    if (data.byCorridor) return data.byCorridor;
    if (Array.isArray(data.quotes) && tos.length === 1) {
      return { [`${from}_${tos[0]}`]: data.quotes };
    }
    return {};
  } catch {
    return {};
  }
}
