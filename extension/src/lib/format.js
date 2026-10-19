// Numbers, money and times for the popup and the service worker. Intl only, in
// the reader's own locale, so 1,000.50 and 1.000,50 both read naturally.

const formats = new Map();

function cachedFormat(key, make) {
  let f = formats.get(key);
  if (!f) {
    f = make();
    formats.set(key, f);
  }
  return f;
}

export function number(value, decimals = 2) {
  return cachedFormat(`n|${decimals}`, () =>
    new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals }),
  ).format(value);
}

/** "₹94,882.33" — the currency's own decimals unless told otherwise. */
export function money(value, code, decimals) {
  const f = cachedFormat(`m|${code}|${decimals ?? ""}`, () => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        ...(decimals != null ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : {}),
      });
    } catch {
      return { format: (v) => `${number(v, decimals ?? 2)} ${code}` };
    }
  });
  return f.format(value);
}

/** A sent amount as typed: "£2,500", "$1,250.50". */
export function amount(value, code) {
  return money(value, code, Number.isInteger(value) ? 0 : undefined);
}

/** Whole units for big figures (₹94,882), the currency's decimals otherwise. */
export function moneyShort(value, code) {
  return Math.abs(value) >= 10000 ? money(Math.round(value), code, 0) : money(value, code);
}

/** An exchange rate at a precision that shows movement: 95.0534, 1,503.22, 0.010520. */
export function rate(value) {
  if (!Number.isFinite(value)) return "—";
  const opts =
    value >= 1000
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : value >= 1
        ? { minimumFractionDigits: 4, maximumFractionDigits: 4 }
        : { minimumSignificantDigits: 5, maximumSignificantDigits: 5 };
  return cachedFormat(`r|${JSON.stringify(opts)}`, () => new Intl.NumberFormat(undefined, opts)).format(value);
}

export function pct(value, { signed = false, decimals = 2 } = {}) {
  const sign = signed && value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${number(Math.abs(value), decimals)}%`;
}

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

/** "12 minutes ago", "yesterday". */
export function ago(iso) {
  const t = typeof iso === "number" ? iso : Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const s = Math.round((t - Date.now()) / 1000);
  const a = Math.abs(s);
  if (a < 60) return "just now";
  if (a < 3600) return rtf.format(Math.round(s / 60), "minute");
  if (a < 86400) return rtf.format(Math.round(s / 3600), "hour");
  return rtf.format(Math.round(s / 86400), "day");
}

export function day(iso, withYear = true) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

/** At most four characters for the toolbar badge: 95.1, 278, 16k, .012. */
export function badge(value) {
  if (!Number.isFinite(value) || value <= 0) return "";
  if (value >= 10000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  if (value >= 100) return String(Math.round(value));
  if (value >= 10) return value.toFixed(1);
  if (value >= 1) return value.toFixed(2);
  if (value >= 0.1) return value.toFixed(2);
  return value.toFixed(3).slice(1);
}

/**
 * Read a typed amount in either convention: "1,000.50", "1.000,50", "1 000",
 * "2.5k". Returns null for anything that is not a positive number. Rounded to
 * `decimals` (money: 2; a rate needs more).
 */
export function parseAmount(text, decimals = 2) {
  let s = String(text ?? "").trim().toLowerCase().replace(/[\s\u00a0\u202f']/g, "");
  let scale = 1;
  if (/[km]$/.test(s)) {
    scale = s.endsWith("k") ? 1e3 : 1e6;
    s = s.slice(0, -1);
  }
  s = s.replace(/[^\d.,]/g, "");
  if (!s) return null;
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  if (lastDot >= 0 && lastComma >= 0) {
    const dec = lastDot > lastComma ? "." : ",";
    const group = dec === "." ? "," : ".";
    s = s.split(group).join("").replace(dec, ".");
  } else if (lastComma >= 0) {
    // "1,000" and "1,000,000" are grouping; "12,5" is a decimal comma.
    const parts = s.split(",");
    s = /^\d{1,3}(,\d{3})+$/.test(s) ? parts.join("") : parts.length === 2 ? parts.join(".") : parts.join("");
  } else if (lastDot >= 0 && s.split(".").length > 2) {
    s = s.split(".").join("");
  }
  const n = Number(s) * scale;
  const f = 10 ** decimals;
  return Number.isFinite(n) && n > 0 ? Math.round(n * f) / f : null;
}
