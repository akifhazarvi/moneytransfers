// Turning loose text — a selection on a page, what someone typed after "smc" in
// the address bar — into an amount and currencies.

import { parseAmount } from "./format.js";

const SYMBOLS = [
  ["US$", "USD"], ["CA$", "CAD"], ["C$", "CAD"], ["AU$", "AUD"], ["A$", "AUD"], ["NZ$", "NZD"],
  ["S$", "SGD"], ["HK$", "HKD"], ["MX$", "MXN"], ["R$", "BRL"], ["$", "USD"], ["£", "GBP"],
  ["€", "EUR"], ["₹", "INR"], ["¥", "JPY"], ["₱", "PHP"], ["₦", "NGN"], ["₩", "KRW"],
  ["₺", "TRY"], ["₫", "VND"], ["฿", "THB"], ["৳", "BDT"], ["₵", "GHS"], ["₴", "UAH"],
  ["zł", "PLN"], ["Kč", "CZK"],
];

const NUMBER = /(\d[\d.,\s\u00a0\u202f']*\d|\d)(\s?[kKmM]\b)?/;

function symbolIn(text) {
  for (const [symbol, code] of SYMBOLS) {
    if (text.includes(symbol)) return code;
  }
  return null;
}

function codeIn(text, codes) {
  for (const m of text.toUpperCase().matchAll(/\b[A-Z]{3}\b/g)) {
    if (codes.has(m[0])) return m[0];
  }
  return null;
}

/**
 * "$1,250.00", "1.250 EUR", "INR 50000", "2.5k gbp" → { amount, currency }.
 * The currency written next to the number wins over one elsewhere in the text
 * ("₹5,000 (about 60 USD)" is rupees).
 */
export function parseMoney(text, codes) {
  const s = String(text ?? "").slice(0, 120);
  const num = NUMBER.exec(s);
  const amount = num ? parseAmount(num[0]) : null;
  let currency = null;
  if (num) {
    const before = s.slice(Math.max(0, num.index - 4), num.index);
    const after = s.slice(num.index + num[0].length, num.index + num[0].length + 5);
    currency = symbolIn(before) ?? codeIn(before, codes) ?? codeIn(after, codes);
  }
  currency ??= codeIn(s, codes) ?? symbolIn(s);
  return amount || currency ? { amount, currency } : null;
}

/** "1000 usd inr", "usd to inr", "£500 to pkr" → { amount, from, to }. */
export function parseQuery(text, codes) {
  const money = parseMoney(text, codes);
  const found = [];
  for (const m of String(text ?? "").toUpperCase().matchAll(/\b[A-Z]{3}\b/g)) {
    if (codes.has(m[0]) && !found.includes(m[0])) found.push(m[0]);
  }
  // Codes are read in order ("usd inr 250"); a symbol on the amount names the
  // sending currency ("£500 to pkr").
  const num = NUMBER.exec(String(text ?? ""));
  const symbol = num ? symbolIn(String(text).slice(Math.max(0, num.index - 4), num.index)) : null;
  const from = symbol ?? found[0] ?? null;
  const to = found.find((c) => c !== from) ?? null;
  return { amount: money?.amount ?? null, from, to };
}
