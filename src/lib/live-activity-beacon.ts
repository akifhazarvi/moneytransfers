/**
 * Tells /api/live-activity what a reader is doing, for the live activity
 * strip: "seen" while they read, and the comparisons and choices analytics.ts
 * already tracks. Browser-only; no cookie, nothing stored on the device.
 *
 * Only a person counts. Nothing is sent until the page has been on screen for
 * a few seconds AND the reader has scrolled, tapped, clicked or typed —
 * crawlers that run JavaScript render and leave (the Sep 2026 China wave
 * averaged half a second a session). Automated browsers (navigator.webdriver,
 * which our own e2e runs set) never send.
 */

const URL_ = "/api/live-activity";
const ENGAGED_AFTER_MS = 3_000;
const HEARTBEAT_MS = 60_000;
/** Heartbeats stop after ten minutes on one page; the next page starts again. */
const MAX_HEARTBEATS = 10;

type Payload = { t: "seen" } | { t: "compared"; from: string; to: string } | { t: "chose"; provider: string; from?: string; to?: string };

let interacted = false;
let shownSince = 0;
let started = false;
let beats = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
const queue: Payload[] = [];

const engaged = () => interacted && shownSince > 0 && Date.now() - shownSince >= ENGAGED_AFTER_MS;

function send(payload: Payload) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.(URL_, new Blob([body], { type: "application/json" }))) return;
  } catch {
    // fall back to fetch
  }
  fetch(URL_, { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
}

function flush() {
  if (!engaged()) return;
  while (queue.length) send(queue.shift()!);
}

function heartbeat() {
  if (timer) clearTimeout(timer);
  timer = null;
  if (document.visibilityState !== "visible" || !interacted || beats >= MAX_HEARTBEATS) return;
  const wait = shownSince + ENGAGED_AFTER_MS - Date.now();
  if (wait > 0) {
    timer = setTimeout(heartbeat, wait);
    return;
  }
  send({ t: "seen" });
  flush();
  beats += 1;
  timer = setTimeout(heartbeat, HEARTBEAT_MS);
}

/** Start counting this reader. Safe to call on every navigation. */
export function startPresence() {
  if (typeof window === "undefined" || navigator.webdriver) return;
  beats = 0;
  if (started) {
    heartbeat();
    return;
  }
  started = true;
  shownSince = document.visibilityState === "visible" ? Date.now() : 0;
  const onInteract = () => {
    if (interacted) return;
    interacted = true;
    heartbeat();
  };
  for (const type of ["scroll", "pointerdown", "keydown", "touchstart"]) {
    window.addEventListener(type, onInteract, { passive: true, once: true });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (!shownSince) shownSince = Date.now();
      heartbeat();
    }
  });
  heartbeat();
}

/** A comparison or a choice. Held until the reader is engaged, then sent once. */
export function sendActivity(payload: Exclude<Payload, { t: "seen" }>) {
  if (typeof window === "undefined" || navigator.webdriver) return;
  // A click on Send is engagement by definition, and the page is about to go.
  if (payload.t === "chose") {
    interacted = true;
    send(payload);
    return;
  }
  if (queue.length < 5) queue.push(payload);
  flush();
}
