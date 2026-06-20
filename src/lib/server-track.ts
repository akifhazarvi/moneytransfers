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
 */
export async function serverTrack(
  eventName: string,
  params: Record<string, string | number | boolean> = {},
  clientId?: string,
  geo?: GeoHints,
): Promise<void> {
  // GA4 (Measurement Protocol) — already handles its own try/catch + env guard.
  void gaServerEvent(eventName, params, clientId, geo);

  // Vercel Analytics (server). Its server track accepts only string/number/
  // boolean values, same as ours. Swallow any error so analytics never breaks
  // the request path.
  try {
    await vercelServerTrack(eventName, params);
  } catch {
    // never let analytics failure affect the redirect
  }
}
