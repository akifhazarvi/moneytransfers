/**
 * Multi-source forex rate aggregator.
 * Fetches from 4 free APIs in parallel, merges with median averaging,
 * and provides per-currency confidence + source attribution.
 */

export interface SourceResult {
  name: string;
  shortName: string;
  status: "ok" | "error";
  currencyCount: number;
  rates: Record<string, number>; // code -> rate vs base
  latency: number; // ms
}

export interface AggregatedRate {
  code: string;
  median: number;       // median of all sources
  min: number;          // lowest source
  max: number;          // highest source
  spread: number;       // max - min (real cross-source spread)
  sourceCount: number;  // how many sources had this currency
  perSource: { name: string; rate: number }[];
}

/* ── Source fetchers ──────────────────────────────────────── */

async function fetchOpenErApi(base: string): Promise<SourceResult> {
  const t0 = Date.now();
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rates = data.rates as Record<string, number>;
    delete rates[base];
    return {
      name: "ExchangeRate-API",
      shortName: "ER-API",
      status: "ok",
      currencyCount: Object.keys(rates).length,
      rates,
      latency: Date.now() - t0,
    };
  } catch {
    return { name: "ExchangeRate-API", shortName: "ER-API", status: "error", currencyCount: 0, rates: {}, latency: Date.now() - t0 };
  }
}

async function fetchFawazAhmed(base: string): Promise<SourceResult> {
  const t0 = Date.now();
  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data[base.toLowerCase()] as Record<string, number>;
    // Normalize keys to uppercase, filter out base
    const rates: Record<string, number> = {};
    for (const [k, v] of Object.entries(raw)) {
      const code = k.toUpperCase();
      if (code !== base && typeof v === "number" && v > 0) rates[code] = v;
    }
    return {
      name: "Fawaz Ahmed CDN",
      shortName: "FA-CDN",
      status: "ok",
      currencyCount: Object.keys(rates).length,
      rates,
      latency: Date.now() - t0,
    };
  } catch {
    return { name: "Fawaz Ahmed CDN", shortName: "FA-CDN", status: "error", currencyCount: 0, rates: {}, latency: Date.now() - t0 };
  }
}

async function fetchFloatRates(base: string): Promise<SourceResult> {
  const t0 = Date.now();
  try {
    const res = await fetch(
      `https://www.floatrates.com/daily/${base.toLowerCase()}.json`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rates: Record<string, number> = {};
    for (const val of Object.values(data) as { code: string; rate: number }[]) {
      if (val.code && val.code !== base && typeof val.rate === "number") {
        rates[val.code] = val.rate;
      }
    }
    return {
      name: "FloatRates",
      shortName: "FLOAT",
      status: "ok",
      currencyCount: Object.keys(rates).length,
      rates,
      latency: Date.now() - t0,
    };
  } catch {
    return { name: "FloatRates", shortName: "FLOAT", status: "error", currencyCount: 0, rates: {}, latency: Date.now() - t0 };
  }
}

async function fetchCurrencyApi(base: string): Promise<SourceResult> {
  const t0 = Date.now();
  try {
    // Hits our own /api/rates/currencyapi proxy — the CURRENCY_API_KEY lives
    // on the server, never in the browser bundle.
    const res = await fetch(`/api/rates/currencyapi?base=${base}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { rates: Record<string, number> };
    return {
      name: "CurrencyAPI",
      shortName: "C-API",
      status: "ok",
      currencyCount: Object.keys(data.rates).length,
      rates: data.rates,
      latency: Date.now() - t0,
    };
  } catch {
    return { name: "CurrencyAPI", shortName: "C-API", status: "error", currencyCount: 0, rates: {}, latency: Date.now() - t0 };
  }
}

async function fetchCurrencyApiPages(base: string): Promise<SourceResult> {
  const t0 = Date.now();
  try {
    const res = await fetch(
      `https://latest.currency-api.pages.dev/v1/currencies/${base.toLowerCase()}.json`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data[base.toLowerCase()] as Record<string, number>;
    const rates: Record<string, number> = {};
    for (const [k, v] of Object.entries(raw)) {
      const code = k.toUpperCase();
      if (code !== base && typeof v === "number" && v > 0) rates[code] = v;
    }
    return {
      name: "Currency-API Pages",
      shortName: "CA-PG",
      status: "ok",
      currencyCount: Object.keys(rates).length,
      rates,
      latency: Date.now() - t0,
    };
  } catch {
    return { name: "Currency-API Pages", shortName: "CA-PG", status: "error", currencyCount: 0, rates: {}, latency: Date.now() - t0 };
  }
}

/* ── Aggregator ───────────────────────────────────────────── */

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function aggregateRates(
  sources: SourceResult[],
  codes: string[]
): Map<string, AggregatedRate> {
  const result = new Map<string, AggregatedRate>();
  const okSources = sources.filter((s) => s.status === "ok");

  for (const code of codes) {
    const perSource: { name: string; rate: number }[] = [];
    for (const src of okSources) {
      const rate = src.rates[code];
      if (rate && rate > 0) {
        perSource.push({ name: src.shortName, rate });
      }
    }
    if (perSource.length === 0) continue;

    const values = perSource.map((p) => p.rate);
    const med = median(values);
    const min = Math.min(...values);
    const max = Math.max(...values);

    result.set(code, {
      code,
      median: med,
      min,
      max,
      spread: max - min,
      sourceCount: perSource.length,
      perSource,
    });
  }

  return result;
}

/* ── Public API ───────────────────────────────────────────── */

export async function fetchAllSources(base: string): Promise<{
  sources: SourceResult[];
  aggregated: Map<string, AggregatedRate>;
  codes: string[];
}> {
  // Fire all 5 in parallel
  const sources = await Promise.all([
    fetchOpenErApi(base),
    fetchFawazAhmed(base),
    fetchFloatRates(base),
    fetchCurrencyApiPages(base),
    fetchCurrencyApi(base),
  ]);

  // Collect all currency codes seen across sources
  const codeSet = new Set<string>();
  for (const src of sources) {
    for (const code of Object.keys(src.rates)) codeSet.add(code);
  }
  const codes = Array.from(codeSet).sort();

  const aggregated = aggregateRates(sources, codes);

  return { sources, aggregated, codes };
}
