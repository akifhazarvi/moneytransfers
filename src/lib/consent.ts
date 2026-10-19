/** Versioned, explicit choices. Legacy grants included automatic geo grants. */
export const CONSENT_COOKIE = "smc_consent";
export const CONSENT_EVENT = "smc:consent-changed";
export const CONSENT_OPEN_EVENT = "smc:consent-open";
export const CONSENT_DAYS = 180;
export type ConsentChoice = { analytics: boolean; replay: boolean };

const NONE: ConsentChoice = { analytics: false, replay: false };
const ALL: ConsentChoice = { analytics: true, replay: true };

/**
 * Where optional analytics and replay wait for an explicit choice: the EU and
 * EEA (ePrivacy), the UK (PECR) and Switzerland. Owner decision 2026-10-18,
 * after a worldwide opt-in the same day left GA4 seeing 1 visitor in 1,637:
 * ask only where the law requires it. Everywhere else both run by default, and
 * Cookie settings or Global Privacy Control turn them off. An unknown country
 * asks. GTAG_INLINE and CLARITY_INLINE embed this list.
 */
export const CONSENT_REQUIRED_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
] as const;
const REQUIRED = new Set<string>(CONSENT_REQUIRED_COUNTRIES);

export function readConsent(cookie: string): ConsentChoice | null {
  const value = cookie.match(/(?:^|;\s*)smc_consent=([^;]*)/)?.[1];
  if (value === "denied") return { ...NONE };
  const match = value?.match(/^v2\.(granted|denied)\.(granted|denied)$/);
  return match ? { analytics: match[1] === "granted", replay: match[2] === "granted" } : null;
}

/** The middleware's `geo-country` cookie (Vercel's IP country, kept 30 days). */
export function cookieCountry(cookie: string): string | null {
  return cookie.match(/(?:^|;\s*)geo-country=([A-Z]{2})(?:;|$)/)?.[1] ?? null;
}

export function consentRequired(country: string | null | undefined): boolean {
  return !country || REQUIRED.has(country);
}

/** Global Privacy Control is an opt-out the law honours (California and others); Do Not Track is not. */
export function privacySignal(): boolean {
  return typeof navigator !== "undefined" &&
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** A stored choice wins; without one, everything runs unless the country requires a choice. */
export function effectiveConsent(cookie: string, signal: boolean, country = cookieCountry(cookie)): ConsentChoice {
  if (signal) return { ...NONE };
  return readConsent(cookie) ?? (consentRequired(country) ? { ...NONE } : { ...ALL });
}

/** The banner asks only here: no stored choice, a country that requires one, no GPC. */
export function consentPending(): boolean {
  return typeof document !== "undefined" && !privacySignal() &&
    readConsent(document.cookie) === null && consentRequired(cookieCountry(document.cookie));
}

export function analyticsAllowed(): boolean {
  return typeof document !== "undefined" && effectiveConsent(document.cookie, privacySignal()).analytics;
}

/** The cookie's country first, so the server agrees with what the page decided; the first request has only Vercel's header. */
export function requestAnalyticsAllowed(request?: Request): boolean {
  if (!request) return false;
  const cookie = request.headers.get("cookie") || "";
  const country = cookieCountry(cookie) ?? request.headers.get("x-vercel-ip-country");
  return effectiveConsent(cookie, request.headers.get("sec-gpc") === "1", country).analytics;
}

/** Remove first-party identifiers on all host/domain variants we can access. */
export function clearOptionalStorage() {
  const names = document.cookie.split(";").map(c => c.trim().split("=")[0])
    .filter(n => /^(_ga(?:_|$)|_gid$|_gat|_clck$|_clsk$|smc_vid$)/.test(n));
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.map((_, i) => `; Domain=${parts.slice(i).join(".")}`)];
  for (const name of names) for (const domain of domains) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${domain}`;
  }
  try { sessionStorage.removeItem("first_ai_src"); } catch { /* storage unavailable */ }
}

export function saveConsent(choice: ConsentChoice) {
  const effective = privacySignal() ? NONE : choice;
  const value = `v2.${effective.analytics ? "granted" : "denied"}.${effective.replay ? "granted" : "denied"}`;
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_DAYS * 86400}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
