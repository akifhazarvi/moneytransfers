/** Versioned, explicit choices. Legacy grants included automatic geo grants. */
export const CONSENT_COOKIE = "smc_consent";
export const CONSENT_EVENT = "smc:consent-changed";
export const CONSENT_OPEN_EVENT = "smc:consent-open";
export const CONSENT_DAYS = 180;
export type ConsentChoice = { analytics: boolean; replay: boolean };

export function readConsent(cookie: string): ConsentChoice | null {
  const value = cookie.match(/(?:^|;\s*)smc_consent=([^;]*)/)?.[1];
  if (value === "denied") return { analytics: false, replay: false };
  const match = value?.match(/^v2\.(granted|denied)\.(granted|denied)$/);
  return match ? { analytics: match[1] === "granted", replay: match[2] === "granted" } : null;
}

export function privacySignal(): boolean {
  return typeof navigator !== "undefined" &&
    ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true || navigator.doNotTrack === "1");
}

export function analyticsAllowed(): boolean {
  return typeof document !== "undefined" && !privacySignal() && readConsent(document.cookie)?.analytics === true;
}

export function requestAnalyticsAllowed(request?: Request): boolean {
  return !!request && request.headers.get("sec-gpc") !== "1" && request.headers.get("dnt") !== "1" &&
    readConsent(request.headers.get("cookie") || "")?.analytics === true;
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
  const effective = privacySignal() ? { analytics: false, replay: false } : choice;
  const value = `v2.${effective.analytics ? "granted" : "denied"}.${effective.replay ? "granted" : "denied"}`;
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_DAYS * 86400}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
