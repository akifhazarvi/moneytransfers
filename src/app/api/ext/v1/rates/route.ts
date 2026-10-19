import { buildExtensionRates, extJson } from "@/lib/extension-api";

// Five minutes at the CDN; the upstream feed is asked no more often than its
// plan updates (LIVE_REVALIDATE_SECONDS in src/lib/extension-api.ts).
export const revalidate = 300;

/**
 * GET /api/ext/v1/rates
 *
 * USD-based mid-market rates for every currency we hold, from the licensed live
 * feed or the 6-hourly XE collection, whichever is fresher, with the time the
 * source set them and the closes 1, 7, 15 and 30 days earlier. One request
 * serves the extension's converter, its watchlist, its toolbar rate and every
 * alert it checks.
 */
export async function GET() {
  return extJson(await buildExtensionRates(), 300);
}
