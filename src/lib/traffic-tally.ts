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
 * (and scripts/report-extension.mjs for ext:v1, below).
 */
const KEEP_SECONDS = 90 * 86400;

async function command(url: string, token: string, args: (string | number)[]): Promise<unknown> {
  const response = await fetch(url, {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(args), cache: "no-store",
  });
  return response.ok ? ((await response.json()) as { result?: unknown }).result : undefined;
}

async function increment(prefix: string, field: string): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;
  const key = `${prefix}:${new Date().toISOString().slice(0, 10)}`;
  try {
    const count = await command(url, token, ["HINCRBY", key, field, 1]);
    if (count === 1) await command(url, token, ["EXPIRE", key, KEEP_SECONDS]);
  } catch { /* a count must never fail the request */ }
}

export async function tallyPageView(country: string | null, landing: boolean): Promise<void> {
  const cc = country && /^[A-Z]{2}$/.test(country) ? country : "XX";
  await increment("tally:v1", landing ? `${cc}:land` : cc);
}

export const EXTENSION_TALLIES = ["shown", "click", "confirmed", "visit", "uninstall"] as const;
export type ExtensionTally = (typeof EXTENSION_TALLIES)[number];

/**
 * The browser extension's funnel, the same way: ext:v1:<UTC day> is one hash
 * of "<kind>:<label>" → count. shown / click / confirmed are labelled by the
 * site surface (header, footer, comparison-end, go_review …), visit and
 * uninstall by the browser (chrome, edge). See src/lib/browser-extension.ts.
 * A count from China, Singapore or Hong Kong gets a ":cnsg" suffix, so reads
 * can leave out the browser-spoofing bots that hit /go from there (CLAUDE.md,
 * GA4 measurement), as report-consent-metrics.mjs does for page views.
 */
const BOT_COUNTRIES = new Set(["CN", "SG", "HK"]);

export async function tallyExtension(kind: ExtensionTally, label: string, country: string | null): Promise<void> {
  const clean = /^[a-z0-9_-]{1,32}$/.test(label) ? label : "other";
  await increment("ext:v1", `${kind}:${clean}${country && BOT_COUNTRIES.has(country) ? ":cnsg" : ""}`);
}
