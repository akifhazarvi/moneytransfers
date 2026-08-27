import { sendCurrencies, currencies } from "@/data/transfer-currencies";
import { isValidProviderSlug } from "@/lib/affiliate";
import type { AlertKind } from "@/lib/alert-store";

/**
 * Validation for alert create/update payloads, shared by the collection route
 * and the single-alert route.
 *
 * Currency validation goes through data/transfer-currencies.ts rather than the
 * quote engine on purpose: that module is plain data with no imports, so
 * validating a corridor costs nothing. Importing quotes-engine here would drag
 * the whole multi-megabyte scraped dataset into an endpoint that only needs to
 * know whether three letters are a currency.
 */

const SEND_CODES = new Set(sendCurrencies.map((c) => c.code));
const RECEIVE_CODES = new Set(currencies.map((c) => c.code));

/** Most alerts a single device may hold. Unbounded alerts is unbounded cron work. */
export const MAX_ALERTS_PER_DEVICE = 20;

const KINDS = new Set<AlertKind>(["rate_above", "beats_provider", "daily_best"]);

/** Send amounts outside this are not real remittances and skew the fee model. */
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1_000_000;

export type AlertInput = {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  kind: AlertKind;
  threshold: number | null;
  baselineProvider: string | null;
  cooldownHours: number;
  quietStart: number | null;
  quietEnd: number | null;
};

/** Partial form for PATCH — every field optional, undefined meaning "leave alone". */
export type AlertPatch = Partial<Omit<AlertInput, "fromCurrency" | "toCurrency" | "kind">>;

function asCurrency(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : null;
}

function asInt(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isInteger(n) ? n : null;
}

function asNumber(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

function asHour(value: unknown): number | null {
  const n = asInt(value);
  return n !== null && n >= 0 && n <= 23 ? n : null;
}

/** A uuid, checked before it reaches Postgres — an invalid cast would 500. */
export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/**
 * Validate a full alert payload. Returns either the normalised alert or the
 * first problem found, as a message safe to hand back to the client.
 */
export function parseAlert(input: Record<string, unknown>): { ok: true; value: AlertInput } | { ok: false; error: string } {
  const fromCurrency = asCurrency(input.fromCurrency);
  if (!fromCurrency) return { ok: false, error: "fromCurrency must be a 3-letter code" };
  if (!SEND_CODES.has(fromCurrency)) {
    return { ok: false, error: `${fromCurrency} is not a supported send currency` };
  }

  const toCurrency = asCurrency(input.toCurrency);
  if (!toCurrency) return { ok: false, error: "toCurrency must be a 3-letter code" };
  if (!RECEIVE_CODES.has(toCurrency)) {
    return { ok: false, error: `${toCurrency} is not a supported receive currency` };
  }
  if (fromCurrency === toCurrency) {
    return { ok: false, error: "fromCurrency and toCurrency must differ" };
  }

  const amount = asInt(input.amount);
  if (amount === null || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    return { ok: false, error: `amount must be an integer between ${MIN_AMOUNT} and ${MAX_AMOUNT}` };
  }

  const kind = typeof input.kind === "string" ? (input.kind as AlertKind) : null;
  if (!kind || !KINDS.has(kind)) {
    return { ok: false, error: "kind must be rate_above, beats_provider or daily_best" };
  }

  // Each kind needs its own companion field, and an alert missing it would sit
  // in the evaluator forever without ever being able to fire.
  let threshold: number | null = null;
  if (kind === "rate_above") {
    threshold = asNumber(input.threshold);
    if (threshold === null || threshold <= 0) {
      return { ok: false, error: "rate_above requires a positive threshold" };
    }
  }

  let baselineProvider: string | null = null;
  if (kind === "beats_provider") {
    const slug = typeof input.baselineProvider === "string" ? input.baselineProvider.trim() : "";
    if (!slug || !isValidProviderSlug(slug)) {
      return { ok: false, error: "beats_provider requires a valid baselineProvider slug" };
    }
    baselineProvider = slug;
  }

  const cooldown = input.cooldownHours === undefined ? 24 : asInt(input.cooldownHours);
  if (cooldown === null || cooldown < 1 || cooldown > 168) {
    return { ok: false, error: "cooldownHours must be between 1 and 168" };
  }

  // Quiet hours are all-or-nothing: one bound alone cannot describe a window.
  const hasQuiet = input.quietStart !== undefined || input.quietEnd !== undefined;
  let quietStart: number | null = null;
  let quietEnd: number | null = null;
  if (hasQuiet) {
    quietStart = asHour(input.quietStart);
    quietEnd = asHour(input.quietEnd);
    if (quietStart === null || quietEnd === null) {
      return { ok: false, error: "quietStart and quietEnd must both be hours 0-23" };
    }
  }

  return {
    ok: true,
    value: { fromCurrency, toCurrency, amount, kind, threshold, baselineProvider, cooldownHours: cooldown, quietStart, quietEnd },
  };
}

/**
 * Validate a PATCH payload. The corridor and kind are immutable — changing
 * either makes it a different alert, and the UNIQUE constraint is defined over
 * exactly those columns, so allowing edits there invites a confusing 409.
 * Delete and recreate instead.
 */
export function parseAlertPatch(
  input: Record<string, unknown>,
): { ok: true; value: AlertPatch } | { ok: false; error: string } {
  const patch: AlertPatch = {};

  if (input.fromCurrency !== undefined || input.toCurrency !== undefined || input.kind !== undefined) {
    return { ok: false, error: "corridor and kind are immutable — delete and recreate instead" };
  }

  if (input.threshold !== undefined) {
    const t = asNumber(input.threshold);
    if (t === null || t <= 0) return { ok: false, error: "threshold must be positive" };
    patch.threshold = t;
  }

  if (input.amount !== undefined) {
    const a = asInt(input.amount);
    if (a === null || a < MIN_AMOUNT || a > MAX_AMOUNT) {
      return { ok: false, error: `amount must be an integer between ${MIN_AMOUNT} and ${MAX_AMOUNT}` };
    }
    patch.amount = a;
  }

  if (input.cooldownHours !== undefined) {
    const c = asInt(input.cooldownHours);
    if (c === null || c < 1 || c > 168) return { ok: false, error: "cooldownHours must be between 1 and 168" };
    patch.cooldownHours = c;
  }

  if (input.quietStart !== undefined || input.quietEnd !== undefined) {
    const s = asHour(input.quietStart);
    const e = asHour(input.quietEnd);
    if (s === null || e === null) return { ok: false, error: "quietStart and quietEnd must both be hours 0-23" };
    patch.quietStart = s;
    patch.quietEnd = e;
  }

  if (Object.keys(patch).length === 0 && input.active === undefined) {
    return { ok: false, error: "Nothing to update" };
  }

  return { ok: true, value: patch };
}
