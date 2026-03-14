import { midMarketRates } from "@/lib/unified-quotes";
import { exchangeRates as staticRates } from "@/data/providers";

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

// In-memory cache — survives across requests in the same server process
let cache: CachedRates | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fetch live exchange rates.
 * Priority: XE mid-market (scraped) → frankfurter.app (live API) → static fallback.
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Return cached rates if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.rates;
  }

  // XE mid-market rates from our scraper are comprehensive (229 currencies)
  // Use them as primary source if available
  const xeHasData = Object.keys(midMarketRates).length > 5;
  if (xeHasData) {
    cache = { rates: midMarketRates, timestamp: Date.now() };
    return midMarketRates;
  }

  // Fallback: fetch from frankfurter.app API
  try {
    const currencyCodes = Object.keys(staticRates).filter((c) => c !== "USD");
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${currencyCodes.join(",")}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`API responded ${res.status}`);

    const data = await res.json();
    const liveRates: Record<string, number> = { USD: 1 };

    for (const code of currencyCodes) {
      liveRates[code] = data.rates?.[code] ?? staticRates[code] ?? 1;
    }

    cache = { rates: liveRates, timestamp: Date.now() };
    return liveRates;
  } catch {
    console.warn("[exchange-rates] API unavailable, using static rates");
    return staticRates;
  }
}

export { getRate } from "@/lib/rates-util";
