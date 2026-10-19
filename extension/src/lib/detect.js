/**
 * Runs inside the provider's page (chrome.scripting.executeScript, granted by
 * activeTab only when the reader opens the popup there), so it must be
 * self-contained: no imports, no closures. It reads, never writes, and returns
 * the amount and currencies the page's calculator shows, best effort:
 *
 *   1. the URL's own parameters (sourceAmount=, from=, targetCurrency=, …);
 *   2. visible amount fields in calculator order, each paired with the first
 *      currency code shown in the field's surroundings.
 *
 * `codes` is the list of currency codes we compare; any other three capitals
 * ("USA", "FAQ") are ignored.
 */
export function detectTransfer(codes) {
  const known = new Set(codes);
  const result = { amount: null, from: null, to: null, source: null };

  const params = new URLSearchParams(location.search);
  const param = (names) => {
    for (const [key, value] of params) {
      if (names.includes(key.toLowerCase()) && value) return value;
    }
    return null;
  };
  const code = (value) => {
    const c = String(value || "").trim().toUpperCase();
    return known.has(c) ? c : null;
  };
  const amountOf = (value) => {
    const s = String(value || "").replace(/[\s\u00a0\u202f',]/g, "");
    const n = Number(s.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) && n > 0 && n < 10_000_000 ? n : null;
  };

  result.from = code(param(["sourcecurrency", "sendcurrency", "fromcurrency", "from", "source", "sell", "sendingcurrency", "currencyfrom"]));
  result.to = code(param(["targetcurrency", "receivecurrency", "tocurrency", "to", "target", "buy", "receivingcurrency", "currencyto"]));
  result.amount = amountOf(param(["sourceamount", "sendamount", "amount", "send_amount", "fromamount", "amountfrom", "sendingamount"]));
  if (result.amount && result.from) result.source = "url";

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return false;
    const st = getComputedStyle(el);
    return st.visibility !== "hidden" && st.display !== "none";
  };
  const codeNear = (el) => {
    let node = el;
    for (let depth = 0; depth < 5 && node; depth++) {
      node = node.parentElement;
      if (!node) break;
      const parts = [];
      for (const s of node.querySelectorAll("select")) parts.push(String(s.value).toUpperCase());
      for (const a of node.querySelectorAll("[aria-label]")) parts.push(a.getAttribute("aria-label"));
      parts.push((node.innerText || "").slice(0, 400));
      // Case-sensitive, bounded by non-capitals rather than \b: a label and a
      // currency button often render with no space between ("You sendGBP").
      for (const m of parts.join(" ").matchAll(/(?<![A-Z])[A-Z]{3}(?![A-Z])/g)) {
        if (known.has(m[0])) return m[0];
      }
    }
    return null;
  };

  const fields = [];
  for (const el of document.querySelectorAll("input")) {
    if (!["text", "number", "tel", "search", ""].includes(el.type)) continue;
    const amount = amountOf(el.value);
    if (!amount || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    fields.push({ amount, currency: codeNear(el), top: r.top + scrollY, left: r.left });
    if (fields.length >= 6) break;
  }
  fields.sort((a, b) => a.top - b.top || a.left - b.left);

  const withCode = fields.filter((f) => f.currency);
  if (!result.source && withCode.length) {
    result.amount = withCode[0].amount;
    result.from = withCode[0].currency;
    result.source = "page";
  }
  if (!result.to) {
    const other = withCode.find((f) => f.currency !== result.from);
    if (other) result.to = other.currency;
  }
  return result.amount || result.from ? result : null;
}
