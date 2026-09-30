/*
 * SendMoneyCompare service worker — makes the site installable and readable
 * offline. Hand-written and deliberately small; registered by
 * src/components/pwa/PwaManager.tsx in production only.
 *
 * WHAT IT DOES, BY REQUEST
 *   Page navigations   NETWORK FIRST. The live page always wins; a saved copy
 *                      is served only when the network fails (offline, DNS,
 *                      dropped connection) — never because it is faster.
 *                      Quotes change every scrape, and a stale table shown to
 *                      someone who is online is a wrong figure, not a cache
 *                      hit. A saved copy is served with a "saved on this
 *                      device <when>" banner written into its HTML, so the
 *                      label holds even if the page's JS never runs.
 *   /_next/static/*    CACHE FIRST. Content-hashed and immutable.
 *   Same-origin images STALE-WHILE-REVALIDATE (logos, flags, /_next/image).
 *   Everything else    NOT INTERCEPTED — the browser handles it as if no
 *                      worker existed. That includes every cross-origin
 *                      request (GA4, Clarity, AdSense, rate APIs), every
 *                      non-GET, RSC payloads, and the paths in BYPASS.
 *
 * NEVER CACHED: /go/* and /out/* (affiliate redirects — provider_clicked is
 * the north-star event), /api/* (live data, beacons), /_vercel/*. A /go or
 * /out NAVIGATION is still answered, with the navigation-preload response
 * as-is: preload has already sent that request, and letting the browser fall
 * back to the network could send it a second time — two redirect hits, two
 * counted clicks, for one tap. Pass-through keeps it at exactly one.
 *
 * UPDATING
 *   - Editing this file ships a new worker: browsers re-check it on navigation
 *     (updateViaCache: "none", and next.config.ts serves it no-cache). It
 *     takes over immediately (skipWaiting + clients.claim).
 *   - Editing public/offline.html needs OFFLINE_REVISION updated to its hash,
 *     or returning visitors keep the old one. check:pwa fails the build until
 *     it matches: node -e "…" is printed in its error.
 *   - Bump a cache name (e.g. pages-v1 → pages-v2) only when stored entries
 *     become unusable; it discards every visitor's saved pages.
 *
 * KILL SWITCH: set NEXT_PUBLIC_DISABLE_SW=1 and redeploy — PwaManager then
 * unregisters the worker and deletes its caches on the next page view.
 */

const OFFLINE_REVISION = "b92438c8";
const OFFLINE_URL = "/offline.html";

const PRECACHE = `smc-precache-${OFFLINE_REVISION}`;
const PAGES = "smc-pages-v1";
const STATIC = "smc-static-v1";
const MEDIA = "smc-media-v1";
const CURRENT = new Set([PRECACHE, PAGES, STATIC, MEDIA]);

const PRECACHE_URLS = [OFFLINE_URL, "/icon-192x192.png"];

// Entry caps. Pages are the heavy ones (a corridor page can run to hundreds
// of KB), so keep only the most recent visits.
const MAX_PAGES = 30;
const MAX_STATIC = 300;
const MAX_MEDIA = 150;

const BYPASS = /^\/(?:go|out|api|_vercel)(?:\/|$)|^\/(?:sw\.js|manifest\.webmanifest|robots\.txt|sitemap[^/]*\.xml)$/;

// Tracking parameters that do not change a page — stripped from cache keys so
// one page is stored once, not once per campaign link.
const TRACKING_PARAM = /^(?:utm_|gclid$|fbclid$|msclkid$|_gl$)/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      await cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" })));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Start the page request while the worker boots, so a navigation never
      // waits on worker startup (what keeps TTFB and LCP where they were).
      if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
      for (const key of await caches.keys()) {
        if (key.startsWith("smc-") && !CURRENT.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || request.headers.has("range")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(BYPASS.test(url.pathname) ? passThrough(event) : handleNavigation(event));
    return;
  }
  if (BYPASS.test(url.pathname)) return;
  // Client-side route changes fetch RSC payloads; leave them to the network.
  // If one fails offline, Next falls back to a full navigation, handled above.
  if (request.headers.has("rsc") || url.searchParams.has("_rsc")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(event, STATIC, MAX_STATIC));
    return;
  }
  if (request.destination === "image" || url.pathname.startsWith("/_next/image")) {
    event.respondWith(staleWhileRevalidate(event, MEDIA, MAX_MEDIA));
  }
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  // The page that registered the worker loaded before it existed, so neither
  // it nor its scripts and styles went through the cache. PwaManager sends
  // both once, on first install, so that first page also works offline.
  if (data.type === "smc:save-pages" && Array.isArray(data.urls)) {
    const assets = Array.isArray(data.assets) ? data.assets : [];
    // Assets first: a page only appears in the cache once what it needs to
    // render is already there, so "saved" always means "opens offline".
    event.waitUntil(saveAssets(assets).then(() => Promise.all(data.urls.map(savePage))));
  }
});

function cacheKey(input) {
  const url = new URL(input);
  url.hash = "";
  for (const name of [...url.searchParams.keys()]) {
    if (TRACKING_PARAM.test(name)) url.searchParams.delete(name);
  }
  return url.href;
}

function isSavablePage(response) {
  return (
    response &&
    response.status === 200 &&
    response.type === "basic" &&
    (response.headers.get("content-type") || "").includes("text/html")
  );
}

// Stamp the copy with when it was saved; the Date header can be hours older
// (it is when the CDN rendered the page, not when this visitor fetched it).
async function storePage(key, response) {
  const headers = new Headers(response.headers);
  headers.set("x-smc-saved-at", String(Date.now()));
  const body = await response.blob();
  const cache = await caches.open(PAGES);
  await cache.put(key, new Response(body, { status: response.status, statusText: response.statusText, headers }));
  await trim(cache, MAX_PAGES);
}

async function savePage(url) {
  try {
    const target = new URL(url, self.location.origin);
    if (target.origin !== self.location.origin || BYPASS.test(target.pathname)) return;
    const response = await fetch(target.href, { credentials: "same-origin" });
    if (isSavablePage(response)) await storePage(cacheKey(target.href), response);
  } catch {
    // Offline or failed: nothing to save.
  }
}

async function saveAssets(urls) {
  const cache = await caches.open(STATIC);
  await Promise.all(
    urls.map(async (url) => {
      try {
        const target = new URL(url, self.location.origin);
        if (target.origin !== self.location.origin || !target.pathname.startsWith("/_next/static/")) return;
        if (await cache.match(target.href)) return;
        const response = await fetch(target.href);
        if (response.ok && response.type === "basic") await cache.put(target.href, response);
      } catch {
        // Skip it; the page still reads without one script.
      }
    }),
  );
  await trim(cache, MAX_STATIC);
}

// The label a saved copy carries. It is written into the HTML rather than
// rendered by React, because it must show even when the page's scripts are
// not cached — and it is a <style> drawing body::before, because React
// hydration deletes an unexpected element at the start of <body> (verified:
// an injected <div> vanished with no error) but leaves <head> styles alone.
// When React does run, OfflineNotice reads data-saved-at, switches this off
// and shows the same words as an announced role="status" with a Reload.
async function withSavedLabel(saved) {
  const savedAt = Number(saved.headers.get("x-smc-saved-at")) || 0;
  const when = savedAt
    ? " on " + new Date(savedAt).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "";
  const text = `You\u2019re offline. This is a copy saved${when}; rates and fees may have changed since.`;
  const label =
    `<style id="smc-saved-copy" data-saved-at="${savedAt}">` +
    `body::before{content:${JSON.stringify(text)};display:block;background:#14171C;color:#fff;` +
    `font:500 13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:10px 16px;text-align:center}` +
    `</style>`;
  const html = (await saved.text()).replace(/<\/head>/i, (tag) => label + tag);
  const headers = new Headers(saved.headers);
  headers.delete("content-length");
  return new Response(html, { status: 200, headers });
}

// The one request navigation preload already made, or (preload off) one fetch.
async function passThrough(event) {
  return (await event.preloadResponse) || fetch(event.request);
}

async function handleNavigation(event) {
  const { request } = event;
  const key = cacheKey(request.url);
  try {
    const response = (await event.preloadResponse) || (await fetch(request));
    if (isSavablePage(response)) event.waitUntil(storePage(key, response.clone()));
    return response;
  } catch {
    const saved = await (await caches.open(PAGES)).match(key);
    if (saved) return withSavedLabel(saved);
    return (await caches.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirst(event, cacheName, max) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(event.request);
  if (hit) return hit;
  const response = await fetch(event.request);
  if (response.ok && response.type === "basic") {
    event.waitUntil(cache.put(event.request, response.clone()).then(() => trim(cache, max)));
  }
  return response;
}

async function staleWhileRevalidate(event, cacheName, max) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(event.request);
  const refresh = fetch(event.request)
    .then(async (response) => {
      if (response.ok && response.type === "basic") {
        await cache.put(event.request, response.clone());
        await trim(cache, max);
      }
      return response;
    })
    .catch(() => undefined);
  if (hit) {
    event.waitUntil(refresh);
    return hit;
  }
  return (await refresh) || Response.error();
}

// Cache keys come back oldest-written first; drop from the front.
async function trim(cache, max) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}
