import { requestAnalyticsAllowed } from "@/lib/consent";
/** Server GA4 respects the same explicit analytics choice as the browser. */

import { forGa4 } from "@/lib/ga4-params";

const MEASUREMENT_ID = "G-HJH07QEJ30";
const ENDPOINT = `https://www.google-analytics.com/mp/collect`;

/**
 * Send a GA4 server-side event.
 * Use the user's pseudonymous ID from cookies when available (client_id) so the
 * server event correlates with client sessions in GA4 reports. Otherwise GA4
 * treats it as a separate anonymous user.
 */
export type GeoHints = {
  country?: string; // ISO 3166-1 alpha-2 (e.g. "US"), from x-vercel-ip-country
  region?: string;  // subdivision from x-vercel-ip-country-region ("CA"); prefixed with the country below
  city?: string;    // from x-vercel-ip-city (URL-encoded by Vercel — decode before passing)
};

export async function gaServerEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {},
  clientId?: string,
  geo?: GeoHints,
  request?: Request,
): Promise<void> {
  if (!requestAnalyticsAllowed(request)) return;
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
          // Vercel's x-vercel-ip-country-region is only the subdivision part
          // ("CA"); GA4 wants the full ISO 3166-2 code ("US-CA").
          region_id: geo.region && geo.country && !geo.region.includes("-") ? `${geo.country}-${geo.region}` : geo.region,
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
    // `source` → `cta_source`, as the browser sink does, so it neither
    // re-attributes the session nor goes unreported (ga4-params.ts).
    events: [{ name: eventName, params: { ...forGa4(params), ...geoParams } }],
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
