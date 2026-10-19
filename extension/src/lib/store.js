// What the reader chose, kept in chrome.storage.sync so a watchlist and its
// alerts follow them to every browser they sign in to. Nothing here is sent
// anywhere; sync is Chrome's, between the reader's own browsers.

export const PREF_DEFAULTS = {
  /** Last comparison: { from, to, amount }. */
  route: null,
  /** The converter: { base, amount, list: [codes], selected }. */
  convert: null,
  /** Period for rate changes: "1D" | "1W" | "15D" | "30D". */
  period: "1D",
  tab: "compare",
  /** [{ from, to }] */
  watch: [],
  /** [{ id, from, to, op: "above" | "below", target, active, firedAt?, firedRate? }] */
  alerts: [],
  /** "USD:INR" — the pair the toolbar icon shows — or null. */
  badgePair: null,
  /** Read the amount and currencies on a provider's page when the popup opens there. */
  detect: true,
  /** Show the site's live activity strip at the bottom of the popup. */
  live: true,
  /** Share usage analytics: null until the person chooses, then true or false. */
  analytics: null,
  range: "1M",
};

export async function getPrefs() {
  return chrome.storage.sync.get(PREF_DEFAULTS);
}

export function setPrefs(patch) {
  return chrome.storage.sync.set(patch);
}
