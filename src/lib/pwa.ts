/**
 * Installed-app (PWA) state shared by the install prompt, the header button
 * and the install dialog. Client-only: every function reads `window`.
 *
 * There is no single install API. Chromium browsers fire `beforeinstallprompt`
 * (captured at parse time by PWA_INLINE in inline-scripts.ts) and let us open
 * their dialog; Safari has no API at all, so iOS and macOS visitors get the
 * steps instead. `detectInstallPlatform()` names which path applies, and every
 * surface reads it rather than sniffing the user agent on its own.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __smcInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export type InstallPlatform =
  /** Running inside the installed app. */
  | "standalone"
  /** Installed on this device, but this is a browser tab. */
  | "installed"
  /** Chromium with a captured prompt — we can open the browser's dialog. */
  | "prompt"
  /** Safari on iPhone/iPad: Share → Add to Home Screen. */
  | "ios-safari"
  /** Chrome, Edge or Firefox on iOS 16.4+: same Share sheet route. */
  | "ios-other"
  /** Safari 17+ on macOS: File → Add to Dock. */
  | "mac-safari"
  /** Android browser with no prompt (Firefox, or Chrome before it fires). */
  | "android"
  /** Desktop Chrome with no prompt: address-bar icon or menu. */
  | "desktop-chrome"
  /** Desktop Edge with no prompt: Apps menu. */
  | "desktop-edge"
  /** Firefox desktop, Safari before 17: cannot install web apps. */
  | "unsupported";

/** Platforms where we offer the install prompt without being asked. */
export const PROMPTABLE: ReadonlySet<InstallPlatform> = new Set(["prompt", "ios-safari", "ios-other", "mac-safari"]);

/** Platforms where an "Install app" button has nothing to do. */
export const NOTHING_TO_INSTALL: ReadonlySet<InstallPlatform> = new Set(["standalone", "installed", "unsupported"]);

const INSTALLED_KEY = "smc_pwa_installed";
const DISMISSED_KEY = "smc_pwa_dismissed_at";
const VIEWS_KEY = "smc_pwa_views";
const SHOWN_KEY = "smc_pwa_prompt_shows";
const SESSION_SHOWN_KEY = "smc_pwa_prompted";
const LAUNCH_KEY = "smc_pwa_launch";

/** A dismissal keeps the prompt away this long. */
export const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;
/** Offer on the second page view, not the landing one. */
export const MIN_VIEWS_BEFORE_PROMPT = 2;
/** Ignored this many times (no install, no dismiss) counts as a dismissal. */
export const MAX_IGNORED_SHOWS = 3;

export const OPEN_INSTALL_EVENT = "smc:open-install";

function read(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(storage: "local" | "session", key: string, value: string) {
  try {
    (storage === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    // Private mode or blocked storage: the prompt simply re-offers later.
  }
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
  return typeof window === "undefined" ? null : window.__smcInstallPrompt ?? null;
}

export function detectInstallPlatform(): InstallPlatform {
  if (typeof window === "undefined") return "unsupported";
  if (isStandalone()) return "standalone";
  if (getDeferredPrompt()) {
    // Chromium only offers a prompt when the app is NOT installed, so a prompt
    // means an earlier install was removed. (Only Chromium sets the flag.)
    try {
      localStorage.removeItem(INSTALLED_KEY);
    } catch {}
    return "prompt";
  }
  if (read("local", INSTALLED_KEY) === "1") return "installed";

  const ua = navigator.userAgent;
  // iPadOS 13+ reports a desktop Mac user agent; touch support gives it away.
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS) return /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) ? "ios-other" : "ios-safari";

  if (/Android/i.test(ua)) return "android";

  const isEdge = /Edg\//.test(ua);
  const isChromium = /Chrome\/|Chromium\//.test(ua);
  const isFirefox = /Firefox\//.test(ua);
  if (/Macintosh/.test(ua) && /Safari\//.test(ua) && !isChromium && !isFirefox) {
    const version = Number(ua.match(/Version\/(\d+)/)?.[1] ?? 0);
    return version >= 17 ? "mac-safari" : "unsupported";
  }
  if (isEdge) return "desktop-edge";
  if (isChromium) return "desktop-chrome";
  return "unsupported";
}

/** Re-run `cb` whenever installability changes (prompt captured, app installed). */
export function onInstallabilityChange(cb: () => void): () => void {
  window.addEventListener("smc:installable", cb);
  window.addEventListener("smc:installed", cb);
  return () => {
    window.removeEventListener("smc:installable", cb);
    window.removeEventListener("smc:installed", cb);
  };
}

/**
 * Open the browser's install dialog. A captured prompt can be used once, so it
 * is cleared either way; Chromium fires a fresh one on the next page load.
 */
export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const deferred = getDeferredPrompt();
  if (!deferred) return "unavailable";
  window.__smcInstallPrompt = null;
  await deferred.prompt();
  const { outcome } = await deferred.userChoice;
  window.dispatchEvent(new Event("smc:installable"));
  return outcome;
}

/**
 * Ask for an install from any surface. PwaManager answers: the browser's own
 * dialog when a prompt was captured, otherwise the step-by-step dialog.
 */
export function requestInstall(surface: string) {
  window.dispatchEvent(new CustomEvent(OPEN_INSTALL_EVENT, { detail: { surface } }));
}

export function snoozePrompt() {
  write("local", DISMISSED_KEY, String(Date.now()));
}

export function promptSnoozed(now = Date.now()): boolean {
  const at = Number(read("local", DISMISSED_KEY) ?? 0);
  return at > 0 && now - at < SNOOZE_MS;
}

/** Count one page view toward the engagement threshold; returns the new total. */
export function countPageView(): number {
  const views = Number(read("local", VIEWS_KEY) ?? 0) + 1;
  write("local", VIEWS_KEY, String(views));
  return views;
}

/** The prompt shows at most once per session and is snoozed after it is ignored repeatedly. */
export function promptAlreadyShownThisSession(): boolean {
  return read("session", SESSION_SHOWN_KEY) === "1";
}

export function recordPromptShown() {
  write("session", SESSION_SHOWN_KEY, "1");
  const shows = Number(read("local", SHOWN_KEY) ?? 0) + 1;
  write("local", SHOWN_KEY, String(shows));
  if (shows >= MAX_IGNORED_SHOWS) {
    write("local", SHOWN_KEY, "0");
    snoozePrompt();
  }
}

/** True once per session, the first time it is asked inside the installed app. */
export function claimLaunch(): boolean {
  if (read("session", LAUNCH_KEY) === "1") return false;
  write("session", LAUNCH_KEY, "1");
  return true;
}

/** EU/UK visitors see the cookie banner first; never stack two prompts. */
export function consentSettled(): boolean {
  return /(?:^|; )smc_consent=/.test(document.cookie);
}
