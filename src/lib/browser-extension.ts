import { analyticsAllowed } from "@/lib/consent";
import { isStandalone } from "@/lib/pwa";
import {
  trackExtensionDetected,
  trackExtensionInstallConfirmed,
  trackExtensionOfferClicked,
  trackExtensionOfferShown,
} from "@/lib/analytics";
// The extension's own host list, so the site names a provider's site only where the price check runs.
import { priceCheckSiteFor } from "../../extension/src/lib/hosts.js";

/**
 * The browser extension as an install offer. Client-only: every function reads
 * `window`.
 *
 * Owner decision 2026-10-20: on desktop Chrome, Edge and the other Chromium
 * browsers the extension is offered before the installed app (PWA). It works
 * where people decide, on the provider's own site, which the app cannot.
 * Every install surface asks `prefersExtension()` and shows the extension when
 * it says so, the app otherwise: the header pill and mobile-menu row
 * (InstallAppButton), the footer, the in-flow offer at <InstallSlot> markers
 * (PwaManager, with all of its rules: second page view, once a session, 30-day
 * snooze shared with the app offer) and the /go review page (StayConnected).
 * Phones, Safari, Firefox and the installed app itself keep the app path.
 *
 * Extension 1.0.1+ answers the site (externally_connectable), so once a reader
 * has it the site offers the app again, tags GA4 with `has_extension`, and a
 * store click followed by an install closes the funnel
 * (`extension_install_confirmed`).
 *
 * Store links carry utm_* so the Chrome Web Store dashboard attributes
 * installs to the surface that sent them. Offers shown, store clicks,
 * confirmed installs, visits the extension sends and uninstalls are also
 * counted without an identifier (/api/tally → ext:v1:<day>,
 * src/lib/traffic-tally.ts), so the funnel reads where analytics consent is
 * not given. Installs, uninstalls and weekly users per store are in the
 * store dashboards; usage inside the extension is its own opt-in GA4 stream
 * (src/lib/extension-events.ts).
 *
 * Someone who removed the extension is not offered it again for 180 days
 * (its uninstall page, /contact?utm_content=uninstall, records that).
 */

export const EXTENSION_ID = "lmlfkphheloiibbbchelmfpmalhpoboi";
/** Microsoft re-signs the package with its own ID; set it once the Edge Add-ons listing is live. */
const EDGE_EXTENSION_ID: string | null = null;
const CHROME_STORE_URL = `https://chromewebstore.google.com/detail/sendmoneycompare-transfer/${EXTENSION_ID}`;

const INSTALLED_KEY = "smc_ext_installed";
const CLICKED_KEY = "smc_ext_clicked";
const REMOVED_KEY = "smc_ext_removed_at";
const DETECTED_SESSION_KEY = "smc_ext_detected";
const LANDED_SESSION_KEY = "smc_ext_landed";
const REMOVED_QUIET_MS = 180 * 86400 * 1000;
export const EXTENSION_STATE_EVENT = "smc:installable";

export type ExtensionBrowser = "chrome" | "edge" | "chromium";

function read(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(storage: Storage | undefined, key: string, value: string | null) {
  try {
    if (value === null) storage?.removeItem(key);
    else storage?.setItem(key, value);
  } catch {
    // Blocked storage: the offer simply re-checks next time.
  }
}

/**
 * The desktop Chromium browser this page runs in, or null where the extension
 * cannot be installed (phones and tablets, Safari, Firefox) or has no toolbar
 * (inside the installed app).
 */
export function extensionBrowser(): ExtensionBrowser | null {
  if (typeof window === "undefined" || isStandalone()) return null;
  const ua = navigator.userAgent;
  const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua) || touchMac) return null;
  if (!/Chrome\/|Chromium\//.test(ua) || /Firefox\//.test(ua)) return null;
  if (/Edg\//.test(ua)) return "edge";
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands ?? [];
  if (brands.some((b) => b.brand === "Google Chrome")) return "chrome";
  // Brave, Arc, Vivaldi, Opera … install from the Chrome Web Store too.
  return brands.length ? "chromium" : "chrome";
}

export function extensionLabel(browser: ExtensionBrowser): string {
  return browser === "edge" ? "Add to Edge" : browser === "chrome" ? "Add to Chrome" : "Add to browser";
}

/** The site has seen the extension answer on this browser (1.0.1+). */
export function extensionInstalled(): boolean {
  return typeof window !== "undefined" && read(localStorage, INSTALLED_KEY) !== null;
}

/** Removed from this browser recently (its uninstall page opened here). */
function recentlyRemoved(now = Date.now()): boolean {
  const at = Number(typeof window === "undefined" ? 0 : read(localStorage, REMOVED_KEY) ?? 0);
  return at > 0 && now - at < REMOVED_QUIET_MS;
}

/** Offer the extension here, rather than the app? */
export function prefersExtension(): boolean {
  return extensionBrowser() !== null && !extensionInstalled() && !recentlyRemoved();
}

/** The provider's site where the price check runs for this quote slug, else null. */
export function priceCheckSite(slug: string): { domain: string; name: string } | null {
  return priceCheckSiteFor(slug) as { domain: string; name: string } | null;
}

export function extensionStoreHref(placement: string, browser: ExtensionBrowser | null = extensionBrowser()): string {
  const url = new URL(
    browser === "edge" && EDGE_EXTENSION_ID ? `https://microsoftedge.microsoft.com/addons/detail/${EDGE_EXTENSION_ID}` : CHROME_STORE_URL,
  );
  url.searchParams.set("utm_source", "sendmoneycompare.com");
  url.searchParams.set("utm_medium", placement);
  url.searchParams.set("utm_campaign", "site_install");
  return url.toString();
}

type TallyKind = "shown" | "click" | "confirmed" | "visit" | "uninstall";

/** A count with no identifier, kept as a daily total (src/lib/traffic-tally.ts). */
function tally(ext: TallyKind, label: string) {
  // No cookies, no referrer, as TrafficTally; keepalive outlives the store tab opening.
  void fetch("/api/tally", { method: "POST", credentials: "omit", referrerPolicy: "no-referrer",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ext, p: label.slice(0, 32) }), keepalive: true }).catch(() => {});
}

/** An in-flow offer or the review-page card came into view (the header pill is always there, so it is not counted). */
export function extensionOfferShown(placement: string, browser: ExtensionBrowser) {
  trackExtensionOfferShown(placement, browser);
  tally("shown", placement);
}

/** Open the store listing from a surface, counting the click. */
export function openExtensionStore(placement: string) {
  const browser = extensionBrowser() ?? "chromium";
  trackExtensionOfferClicked(placement, browser);
  tally("click", placement);
  write(localStorage, CLICKED_KEY, `${placement}|${Date.now()}`);
  window.open(extensionStoreHref(placement, browser), "_blank", "noopener");
}

/**
 * A page the extension opened: its links carry utm_source=<browser>-extension
 * (extension/src/lib/links.js), its uninstall page utm_content=uninstall.
 * Counted once a session (visits) or once (uninstall), with no identifier.
 */
export function noteExtensionLanding() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source") ?? "";
  if (!/^[a-z]{2,12}-extension$/.test(source)) return;
  const browser = source.slice(0, -"-extension".length);
  if (params.get("utm_content") === "uninstall") {
    if (recentlyRemoved()) return;
    write(localStorage, REMOVED_KEY, String(Date.now()));
    write(localStorage, INSTALLED_KEY, null);
    window.dispatchEvent(new Event(EXTENSION_STATE_EVENT));
    tally("uninstall", browser);
    return;
  }
  if (read(sessionStorage, LANDED_SESSION_KEY) !== null) return;
  write(sessionStorage, LANDED_SESSION_KEY, "1");
  tally("visit", browser);
}

type Runtime = {
  sendMessage?: (id: string, message: unknown, reply: (response?: { installed?: boolean; version?: string }) => void) => void;
  lastError?: unknown;
};

/**
 * Ask the extension whether it is installed. Chrome exposes `chrome.runtime`
 * to a page only when an installed extension lists the page in
 * externally_connectable, so its absence is a quick, certain "no" (for 1.0.1+).
 */
function ping(id: string): Promise<string | null> {
  const runtime = (window as Window & { chrome?: { runtime?: Runtime } }).chrome?.runtime;
  if (!runtime?.sendMessage) return Promise.resolve(null);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 1500);
    try {
      runtime.sendMessage!(id, { type: "smc:hello" }, (reply) => {
        clearTimeout(timer);
        // Reading lastError marks it handled (an uninstalled ID would log otherwise).
        resolve(!runtime.lastError && reply?.installed ? String(reply.version ?? "") : null);
      });
    } catch {
      clearTimeout(timer);
      resolve(null);
    }
  });
}

/**
 * Detect the extension once per page load, remember the answer, and let every
 * install surface re-evaluate (they listen for EXTENSION_STATE_EVENT, the
 * same event installability changes fire).
 */
export async function detectExtension(): Promise<void> {
  if (extensionBrowser() === null) return;
  const before = extensionInstalled();
  const ids = [EXTENSION_ID, ...(EDGE_EXTENSION_ID ? [EDGE_EXTENSION_ID] : [])];
  const version = (await Promise.all(ids.map(ping))).find((v) => v !== null) ?? null;
  write(localStorage, INSTALLED_KEY, version === null ? null : version || "1");
  if (version !== null) write(localStorage, REMOVED_KEY, null);
  if (before !== (version !== null)) window.dispatchEvent(new Event(EXTENSION_STATE_EVENT));
  if (version === null) return;

  // Visitors with the extension, as a GA4 user property and once a session.
  if (analyticsAllowed()) {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("set", "user_properties", { has_extension: "yes" });
  }
  if (read(sessionStorage, DETECTED_SESSION_KEY) === null) {
    write(sessionStorage, DETECTED_SESSION_KEY, "1");
    trackExtensionDetected(version || "unknown");
  }
  // A store click from this browser, now installed: the funnel's last step.
  const clicked = read(localStorage, CLICKED_KEY);
  if (clicked) {
    write(localStorage, CLICKED_KEY, null);
    const placement = clicked.split("|")[0] || "unknown";
    trackExtensionInstallConfirmed(placement);
    tally("confirmed", placement);
  }
}
