import { track as vercelServerTrack } from "@vercel/analytics/server";
import { gaServerEvent, type GeoHints } from "@/lib/ga4-server";

/**
 * Dual server-side sink for the provider-exit events (/go, /out).
 *
 * Server redirects carry no client GA/Vercel script, so both sinks must be
 * fed via their server APIs:
 *   - GA4 via Measurement Protocol (gaServerEvent)
 *   - Vercel Analytics via @vercel/analytics/server (now that we're on Pro,
 *     custom events actually record — on Hobby they were silently dropped).
 *
 * Firing both from one call keeps GA4 and Vercel at parity on the events that
 * matter most (affiliate_redirect, provider_clicked_server) and stops the two
 * from drifting apart over time.
 *
 * Both calls are fire-and-forget and individually guarded: a failure in one
 * sink never blocks the redirect or the other sink.
 *
 * A self-identifying crawler (`is_bot`) whose hit was not forwarded to a
 * provider is kept out of both sinks. Measurement Protocol events carry no
 * session, and a cookieless crawler gets a fresh client id per hit, so each one
 * became a new GA4 user: 20,188 of 62,494 "total users" in the 28 days to
 * 2026-10-02, none of them active. On Vercel they would be most of the metered
 * event volume (13,884 on 2026-10-01 alone). Any hit that reached a provider
 * (`outcome: "redirect"`, e.g. a false-positived human who pressed Continue)
 * still goes to both.
 *
 * Vercel gets one event per redirect: provider_clicked_server repeats
 * affiliate_redirect's params, so it goes to GA4 only.
 *
 * Until 2026-10-06 Vercel recorded none of these. The SDK throws "No session
 * context found" without the request's headers (caught and logged inside it),
 * and it posts to VERCEL_URL — the deployment's own *.vercel.app host, which
 * answers 401 "Protected deployment" behind Vercel Authentication. Callers now
 * pass the request, and production posts to the custom domain, which is outside
 * that protection. Previews keep the default and stay unrecorded.
 */
const VERCEL_GA4_ONLY = new Set(["provider_clicked_server"]);

if (process.env.VERCEL_ENV === "production" && !process.env.VERCEL_WEB_ANALYTICS_ENDPOINT) {
  process.env.VERCEL_WEB_ANALYTICS_ENDPOINT = "https://sendmoneycompare.com/_vercel/insights/event";
}

export async function serverTrack(
  eventName: string,
  params: Record<string, string | number | boolean> = {},
  clientId?: string,
  geo?: GeoHints,
  request?: Request,
): Promise<void> {
  const unforwardedCrawler = params.is_bot === true && params.outcome !== "redirect";
  if (unforwardedCrawler) return;

  // GA4 (Measurement Protocol) — already handles its own try/catch + env guard.
  void gaServerEvent(eventName, params, clientId, geo);

  if (VERCEL_GA4_ONLY.has(eventName) || !request) return;
  // Vercel Analytics (server). Its server track accepts only string/number/
  // boolean values, same as ours. Swallow any error so analytics never breaks
  // the request path.
  try {
    await vercelServerTrack(eventName, params, { request });
  } catch {
    // never let analytics failure affect the redirect
  }
}
