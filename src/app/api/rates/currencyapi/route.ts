import { NextResponse } from "next/server";

// Proxy for currencyapi.com so the API key stays server-side. The browser
// (LiveRatesBoard) calls this route; this route reads CURRENCY_API_KEY from
// the environment and forwards to the real API. Without this indirection
// the key would ship in the client JS bundle and get scraped within hours.

export const runtime = "edge";
// 30-min revalidate matches the upstream freshness — CurrencyAPI updates
// once per half hour, so re-fetching more often just burns quota.
export const revalidate = 1800;

export async function GET(request: Request) {
  const apiKey = process.env.CURRENCY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "CURRENCY_API_KEY not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("base") || "USD").toUpperCase();
  if (!/^[A-Z]{3}$/.test(base)) {
    return NextResponse.json({ error: "Invalid base currency" }, { status: 400 });
  }

  const upstream = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${base}`;
  const res = await fetch(upstream, { next: { revalidate: 1800 } });
  if (!res.ok) {
    return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
  }
  const json = (await res.json()) as {
    meta?: { last_updated_at?: string };
    data?: Record<string, { code: string; value: number }>;
  };

  const rates: Record<string, number> = {};
  for (const [code, entry] of Object.entries(json.data ?? {})) {
    if (code === base) continue;
    if (typeof entry.value === "number" && entry.value > 0) rates[code] = entry.value;
  }

  return NextResponse.json(
    { rates, lastUpdated: json.meta?.last_updated_at ?? null },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600" } },
  );
}
