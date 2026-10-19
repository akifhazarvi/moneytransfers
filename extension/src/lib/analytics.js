// Opt-in usage events (server side: src/lib/extension-events.ts).
//
// Nothing is sent unless the person turned on "Share anonymous usage" (asked
// once on the welcome page, changeable in Settings). Opting in creates a random
// id for this browser; opting out deletes it. Events go to sendmoneycompare.com,
// which forwards them to Google Analytics, so no analytics key ships in here.

import { API } from "../config.js";

/** "chrome" | "edge", from the store that installed us, else the browser's brand. */
export const BROWSER = (() => {
  const updateUrl = chrome.runtime.getManifest().update_url || "";
  if (updateUrl.includes("edge.microsoft.com")) return "edge";
  if (updateUrl.includes("google.com")) return "chrome";
  return navigator.userAgentData?.brands?.some((b) => /Edge/i.test(b.brand)) ? "edge" : "chrome";
})();

const SESSION_GAP_MS = 30 * 60_000;
let queue = [];
let timer = null;
let lastAt = Date.now();
let identity = null;

/**
 * Resolve (and cache) who may be counted. Call once at start-up so a flush on
 * pagehide can send synchronously.
 */
export async function analyticsReady() {
  const { analytics } = await chrome.storage.sync.get({ analytics: null });
  if (analytics !== true) {
    identity = null;
    return false;
  }
  let { aid, session } = await chrome.storage.local.get(["aid", "session"]);
  if (!aid) {
    aid = crypto.randomUUID();
    await chrome.storage.local.set({ aid });
  }
  const now = Date.now();
  if (!session || now - session.last > SESSION_GAP_MS) session = { id: String(Math.floor(now / 1000)), last: now };
  session.last = now;
  await chrome.storage.local.set({ session });
  identity = { cid: aid, sid: session.id };
  return true;
}

export async function setAnalytics(on) {
  await chrome.storage.sync.set({ analytics: on });
  if (!on) {
    queue = [];
    await chrome.storage.local.remove(["aid", "session"]);
  }
  await analyticsReady();
}

/** Queue an event; `now` sends at once (a click that is about to close the popup). */
export function track(name, params = {}, { now = false } = {}) {
  if (!identity) return;
  const at = Date.now();
  queue.push({ name, params, ms: Math.max(1, Math.min(at - lastAt, 600_000)) });
  lastAt = at;
  clearTimeout(timer);
  if (now || queue.length >= 10) flush();
  else timer = setTimeout(flush, 1500);
}

export function flush() {
  clearTimeout(timer);
  if (!identity || !queue.length) return;
  const events = queue.splice(0, 10);
  fetch(`${API}/api/ext/v1/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit",
    keepalive: true,
    body: JSON.stringify({ ...identity, version: chrome.runtime.getManifest().version, browser: BROWSER, events }),
  }).catch(() => {});
  if (queue.length) flush();
}
