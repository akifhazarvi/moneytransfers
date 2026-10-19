/**
 * Daily engaged page views per country, counted without analytics consent, so
 * traffic stays readable when consent rules or acceptance change (GA4 and
 * Vercel before and after 2026-10-18 are not comparable; this is).
 *
 * tally:v1:<UTC day> is one hash: "<CC>" = page views that were not a landing,
 * "<CC>:land" = landings (the first page of a visit, arriving from another
 * site or none). Page views = both. No visitor id, page, referrer or user agent
 * is kept, nothing is set on the device, and the hash expires after 90 days.
 *
 * Budget: one command per view, plus an EXPIRE the first time a field appears
 * each day. Upstash Free is 500K commands a month, shared with the live
 * activity store (activity-store.ts).
 *
 * Read: node --env-file=.env.local scripts/report-consent-metrics.mjs
 */
const KEEP_SECONDS = 90 * 86400;

async function command(url: string, token: string, args: (string | number)[]): Promise<unknown> {
  const response = await fetch(url, {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(args), cache: "no-store",
  });
  return response.ok ? ((await response.json()) as { result?: unknown }).result : undefined;
}

export async function tallyPageView(country: string | null, landing: boolean): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;
  const key = `tally:v1:${new Date().toISOString().slice(0, 10)}`;
  const cc = country && /^[A-Z]{2}$/.test(country) ? country : "XX";
  try {
    const count = await command(url, token, ["HINCRBY", key, landing ? `${cc}:land` : cc, 1]);
    if (count === 1) await command(url, token, ["EXPIRE", key, KEEP_SECONDS]);
  } catch { /* a count must never fail the request */ }
}
