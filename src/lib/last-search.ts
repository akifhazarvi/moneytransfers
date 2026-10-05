/**
 * The visitor's last comparison, kept in their own browser so a later visit can
 * offer to pick it up: "Welcome back — still sending money to Pakistan?".
 *
 * Nothing here leaves the device. The record is read only by WelcomeBackManager
 * and never sent to analytics beyond the corridor already on every event.
 *
 * What counts as a search:
 *  - "search": the visitor chose the pair or the amount — typed or picked it on
 *    /send-money or the homepage converter, or arrived at /send-money with the
 *    pair in the URL (every widget on the site routes there on submit). Geo
 *    defaults alone are not a choice: a visitor who opened /send-money on its
 *    USD→INR default and left was never sending money to India.
 *  - "page": they read a corridor page. Weaker, so it never replaces a live
 *    "search" — reading usa-to-india after comparing 1,300 USD→PKR does not
 *    make India the transfer they came for.
 *
 * When it is offered: on the first page of a return visit (30 minutes without
 * activity, the GA4 session timeout), at most MAX_OFFERS visits in a row
 * without an answer, never after the visitor closes it, and not once it is
 * MAX_AGE_MS old. A new search resets all of that.
 */

const SEARCH_KEY = "smc_last_search";
const ACTIVE_KEY = "smc_last_active";

/** A gap this long between page views or interactions starts a new visit. */
export const VISIT_GAP_MS = 30 * 60 * 1000;
/** Covers a monthly remitter who skips a month; older intent is not "still". */
export const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;
/** Offered on this many visits with no click or close counts as a no. */
export const MAX_OFFERS = 3;

/** /send-money applies a search in place when the offer is taken there. */
export const APPLY_SEARCH_EVENT = "smc:apply-search";

export interface SearchPick {
  from: string;
  to: string;
  amount: number;
}

export interface LastSearch extends SearchPick {
  /** When it was made (ms since epoch). */
  at: number;
  kind: "search" | "page";
  /**
   * The top quote the visitor was shown. Recorded only by /send-money, whose
   * quotes are priced at the live mid-market rate like the offer's own, so the
   * two can be compared; the homepage converter and corridor pages price at the
   * build-time rate and leave it out.
   */
  top?: { provider: string; receive: number };
  /** Return visits it was offered on without an answer. */
  offers: number;
  /** Closed by the visitor: not offered again. */
  closed?: boolean;
}

const CODE = /^[A-Z]{3}$/;

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    storage()?.setItem(key, value);
  } catch {
    // Private mode or a full quota: the offer simply never appears.
  }
}

export function readLastSearch(): LastSearch | null {
  try {
    const raw = storage()?.getItem(SEARCH_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<LastSearch>;
    if (typeof s.from !== "string" || !CODE.test(s.from)) return null;
    if (typeof s.to !== "string" || !CODE.test(s.to) || s.to === s.from) return null;
    if (typeof s.amount !== "number" || !(s.amount > 0) || typeof s.at !== "number") return null;
    const top = s.top && typeof s.top.provider === "string" && s.top.receive > 0 ? s.top : undefined;
    return {
      from: s.from,
      to: s.to,
      amount: s.amount,
      at: s.at,
      kind: s.kind === "page" ? "page" : "search",
      top,
      offers: typeof s.offers === "number" ? s.offers : 0,
      closed: s.closed === true,
    };
  } catch {
    return null;
  }
}

function save(s: LastSearch) {
  write(SEARCH_KEY, JSON.stringify(s));
}

export function isOfferable(s: LastSearch, now = Date.now()): boolean {
  return !s.closed && s.offers < MAX_OFFERS && now - s.at < MAX_AGE_MS;
}

/**
 * Remember a comparison. A "page" view never replaces a search still worth
 * offering. The same search again within the visit — /send-money re-prices
 * every 5 minutes — is not a new one: it keeps its answer (offers, closed) and
 * the top quote it already had.
 */
export function rememberSearch(pick: SearchPick & { kind: LastSearch["kind"]; top?: LastSearch["top"] }, now = Date.now()) {
  if (!CODE.test(pick.from) || !CODE.test(pick.to) || pick.from === pick.to || !(pick.amount > 0)) return;
  const current = readLastSearch();
  if (pick.kind === "page" && current?.kind === "search" && isOfferable(current, now)) return;
  const same = current !== null && current.from === pick.from && current.to === pick.to &&
    current.amount === pick.amount && now - current.at < VISIT_GAP_MS;
  save({
    from: pick.from,
    to: pick.to,
    amount: pick.amount,
    at: now,
    kind: same && current.kind === "search" ? "search" : pick.kind,
    top: pick.top ?? (same ? current.top : undefined),
    offers: same ? current.offers : 0,
    closed: same ? current.closed : undefined,
  });
}

export function recordOffer() {
  const s = readLastSearch();
  if (s) save({ ...s, offers: s.offers + 1 });
}

export function closeLastSearch() {
  const s = readLastSearch();
  if (s) save({ ...s, closed: true });
}

/** Note activity, so a long read on one page is not mistaken for a return visit. */
export function markActive(now = Date.now()) {
  write(ACTIVE_KEY, String(now));
}

/**
 * Count a page view. True when it opens a return visit: there was earlier
 * activity on this device, and none for VISIT_GAP_MS.
 */
export function beginPageView(now = Date.now()): boolean {
  let last = 0;
  try {
    last = Number(storage()?.getItem(ACTIVE_KEY) ?? 0) || 0;
  } catch {
    // Unreadable storage: treat as a first visit.
  }
  markActive(now);
  return last > 0 && now - last >= VISIT_GAP_MS;
}

export function searchHref(s: SearchPick): string {
  return `/send-money?from=${s.from}&to=${s.to}&amount=${s.amount}`;
}

// Names that read wrongly without an article: "money to Philippines".
const TAKES_THE = /^(United |Philippines$|Netherlands$|Bahamas$|Gambia$|Maldives$|Comoros$|Dominican Republic$|Czech Republic$|Central African Republic$|Marshall Islands$|Solomon Islands$|Cayman Islands$)/;
const LONG_NAME: Record<string, string> = { US: "United States", GB: "United Kingdom" };

/**
 * The country a currency pays out in, for "still sending money to Pakistan?".
 * Null where there is no single country — the euro and the X-codes (CFA
 * francs, East Caribbean dollar) — so the caller names the pair instead.
 * Uses the browser's own region names rather than shipping a country list.
 */
export function destinationCountry(currency: string): string | null {
  if (currency === "EUR" || currency.startsWith("X")) return null;
  const region = currency.slice(0, 2);
  try {
    const name = LONG_NAME[region] ?? new Intl.DisplayNames(["en"], { type: "region", style: "short" }).of(region);
    if (!name || name === region) return null;
    return TAKES_THE.test(name) ? `the ${name}` : name;
  } catch {
    return null;
  }
}
