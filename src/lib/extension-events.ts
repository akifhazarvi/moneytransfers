import { postGa4Event, type GeoHints } from "@/lib/ga4-server";

/**
 * Usage events from the browser extension (extension/src/lib/analytics.js).
 *
 * Sent only by people who turned on "Share usage analytics" in the extension:
 * off until they choose, asked once on its welcome page, changeable in its
 * settings. Opt-in everywhere, stricter than the site (which asks only where
 * the law requires it, consent.ts): Chrome Web Store policy expects consent
 * before usage data tied to an identifier leaves the extension. They
 * reach GA4 through this server so the Measurement Protocol secret never ships
 * inside the extension.
 *
 * The identifier is random, made by the extension when the person opts in and
 * deleted when they opt out; it is never the site's _ga id. Every event carries
 * `source: "extension"` (reported as cta_source), so extension traffic filters
 * cleanly out of, or into, any site report.
 *
 * Whatever arrives is checked before it is sent: known event names only, at
 * most 10 per request, plain short values, no free text from the page.
 */

export const EXTENSION_EVENTS = new Set([
  "ext_installed",
  "ext_opened",
  "ext_tab",
  "ext_quotes_viewed",
  "ext_compare_search",
  "provider_clicked",
  "ext_here_shown",
  "ext_price_check_shown",
  "ext_price_check_opened",
  "ext_price_check_hidden",
  "ext_converted",
  "ext_watch_added",
  "ext_alert_set",
  "ext_alert_fired",
  "ext_link_copied",
  "ext_code_copied",
  "ext_context_menu",
  "ext_omnibox",
  "ext_rate_prompt",
  "ext_setting",
  "ext_welcome",
  "live_activity_clicked",
]);

const KEY = /^[a-z][a-z0-9_]{0,39}$/;
// Set by this server, never by the client.
const RESERVED = new Set(["source", "cta_source", "session_id", "engagement_time_msec", "ext_version", "ext_browser"]);
const ID = /^[A-Za-z0-9-]{8,64}$/;

export interface ExtEvent {
  name: string;
  params: Record<string, string | number | boolean>;
  /** Engagement since the previous event, for GA4's engaged-user metrics. */
  ms: number;
}

export interface ExtEventBatch {
  cid: string;
  sid: string;
  version: string;
  browser: "chrome" | "edge" | "other";
  events: ExtEvent[];
}

function cleanParams(raw: unknown): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>).slice(0, 12)) {
    if (!KEY.test(key) || RESERVED.has(key)) continue;
    if (typeof value === "string") out[key] = value.slice(0, 100);
    else if (typeof value === "number" && Number.isFinite(value)) out[key] = value;
    else if (typeof value === "boolean") out[key] = value;
  }
  return out;
}

/** The batch, validated, or null when anything about it is off. */
export function parseExtensionBatch(text: string): ExtEventBatch | null {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return null;
  }
  const { cid, sid, version, browser, events } = body ?? {};
  if (typeof cid !== "string" || !ID.test(cid) || typeof sid !== "string" || !/^\d{6,13}$/.test(sid)) return null;
  if (typeof version !== "string" || !/^\d+(\.\d+){0,3}$/.test(version)) return null;
  if (!Array.isArray(events) || events.length === 0 || events.length > 10) return null;
  const clean: ExtEvent[] = [];
  for (const e of events as Record<string, unknown>[]) {
    if (!e || typeof e.name !== "string" || !EXTENSION_EVENTS.has(e.name)) continue;
    const ms = typeof e.ms === "number" && Number.isFinite(e.ms) ? Math.max(1, Math.min(Math.round(e.ms), 600_000)) : 1;
    clean.push({ name: e.name, params: cleanParams(e.params), ms });
  }
  if (!clean.length) return null;
  return { cid, sid, version, browser: browser === "chrome" || browser === "edge" ? browser : "other", events: clean };
}

export async function forwardExtensionEvents(batch: ExtEventBatch, geo: GeoHints): Promise<void> {
  await Promise.all(
    batch.events.map((e) =>
      postGa4Event(
        e.name,
        { ...e.params, source: "extension", ext_version: batch.version, ext_browser: batch.browser },
        `ext.${batch.cid}`,
        geo,
        { id: batch.sid, engagementMs: e.ms },
      ),
    ),
  );
}
