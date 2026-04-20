/**
 * Server-side GA4 tracking via Measurement Protocol.
 *
 * Fires events from the server (API routes, middleware) that always arrive
 * regardless of whether the client has gtag loaded, ad blockers, or consent
 * toggled on. Critical for tracking affiliate redirects which otherwise
 * disappear entirely for ad-block users (~25% of all clicks industry-wide).
 *
 * Setup:
 *   1. In GA4 Admin → Data Streams → your web stream → Measurement Protocol API secrets
 *   2. Create a secret and add to Vercel env as GA4_API_SECRET
 *   3. The measurement ID is already hard-coded below (same as the client gtag ID)
 *
 * Without GA4_API_SECRET, events are silently skipped — no errors thrown.
 */

const MEASUREMENT_ID = "G-HJH07QEJ30";
const ENDPOINT = `https://www.google-analytics.com/mp/collect`;

/**
 * Send a GA4 server-side event.
 * Use the user's anonymized ID from cookies when available (client_id) so the
 * server event correlates with client sessions in GA4 reports. Otherwise GA4
 * treats it as a separate anonymous user.
 */
export type GeoHints = {
  country?: string; // ISO 3166-1 alpha-2 (e.g. "US"), from x-vercel-ip-country
  region?: string;  // ISO 3166-2 subdivision (e.g. "US-CA"), from x-vercel-ip-country-region
  city?: string;    // from x-vercel-ip-city (URL-encoded by Vercel — decode before passing)
};

export async function gaServerEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {},
  clientId?: string,
  geo?: GeoHints,
): Promise<void> {
  const apiSecret = process.env.GA4_API_SECRET;
  if (!apiSecret) return; // env not configured — skip silently

  // Without a user_location block, GA4 geolocates from the POSTer's IP — i.e.
  // Vercel's data center — and reports country as "(not set)". Passing Vercel's
  // edge geo headers populates the native Country/City dimensions. The same
  // values are also mirrored as event params so they survive as custom
  // dimensions if Google ever stops honoring user_location.
  const geoParams: Record<string, string> = {};
  if (geo?.country) geoParams.country = geo.country;
  if (geo?.city) geoParams.city = geo.city;

  const userLocation =
    geo?.country || geo?.region || geo?.city
      ? {
          country_id: geo.country,
          region_id: geo.region,
          city: geo.city,
        }
      : undefined;

  const url = `${ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${apiSecret}`;
  const body = {
    // client_id links this event to a browser session. Use a stable value per
    // user when we have one (e.g. from a cookie), else a random per-event id.
    client_id: clientId || `server.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`,
    non_personalized_ads: true,
    ...(userLocation ? { user_location: userLocation } : {}),
    events: [{ name: eventName, params: { ...params, ...geoParams } }],
  };

  try {
    // fetch with keepalive so the redirect response isn't delayed by network latency.
    // GA accepts the hit fire-and-forget — we never need the response.
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Never let analytics failure break the request path.
  }
}

/**
 * Derive a stable-ish client_id from the GA4 `_ga` cookie if present.
 * The _ga cookie is set by the client gtag script; format: GA1.<domain>.<client_id>
 * Returns undefined if not parseable — server event will use a random id.
 */
export function clientIdFromCookie(gaCookie: string | undefined | null): string | undefined {
  if (!gaCookie) return undefined;
  const parts = gaCookie.split(".");
  if (parts.length < 4) return undefined;
  return `${parts[2]}.${parts[3]}`;
}
