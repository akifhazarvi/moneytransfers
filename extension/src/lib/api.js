// The extension's only network traffic: /api/ext/v1/* on sendmoneycompare.com
// (see src/lib/extension-api.ts). Every response is kept in chrome.storage.local
// so the popup paints the last answer instantly and still works offline.

import { API } from "../config.js";

/** How long a saved answer is used before asking again. Quotes move every 6 hours; rates are live. */
const FRESH_MS = {
  compare: 10 * 60_000,
  rates: 60_000,
  history: 6 * 60 * 60_000,
  activity: 20_000,
};

/** Saved answers older than this are deleted. */
const KEEP_MS = 3 * 24 * 60 * 60_000;

function cacheKey(kind, params) {
  return `c:${kind}:${new URLSearchParams(params ?? {}).toString()}`;
}

export async function fetchJson(kind, params) {
  const qs = new URLSearchParams(params ?? {}).toString();
  const res = await fetch(`${API}/api/ext/v1/${kind}${qs ? `?${qs}` : ""}`, {
    headers: { Accept: "application/json" },
    credentials: "omit",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function saved(kind, params) {
  const key = cacheKey(kind, params);
  const hit = (await chrome.storage.local.get(key))[key];
  return hit ?? null;
}

export async function save(kind, params, data) {
  await chrome.storage.local.set({ [cacheKey(kind, params)]: { at: Date.now(), data } });
}

/**
 * The saved answer first (instantly), then the network when that answer is
 * older than its kind's FRESH_MS. `onData(data, { savedAt, offline })` runs
 * once or twice; `savedAt` is null for a fresh answer. Throws only when there
 * is neither a saved answer nor a network.
 */
export async function load(kind, params, onData, { force = false } = {}) {
  const hit = await saved(kind, params);
  if (hit) onData(hit.data, { savedAt: hit.at, offline: false });
  if (hit && !force && Date.now() - hit.at < FRESH_MS[kind]) return;
  try {
    const data = await fetchJson(kind, params);
    await save(kind, params, data);
    onData(data, { savedAt: null, offline: false });
  } catch (err) {
    if (!hit) throw err;
    onData(hit.data, { savedAt: hit.at, offline: true });
  }
}

export async function pruneSaved() {
  const all = await chrome.storage.local.get(null);
  const old = Object.entries(all)
    .filter(([key, value]) => key.startsWith("c:") && Date.now() - (value?.at ?? 0) > KEEP_MS)
    .map(([key]) => key);
  if (old.length) await chrome.storage.local.remove(old);
}

/** Cross rate from a USD-based map. */
export function cross(rates, from, to) {
  const a = rates?.[from];
  const b = rates?.[to];
  return a && b ? b / a : null;
}
