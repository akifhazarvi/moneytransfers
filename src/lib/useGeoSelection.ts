"use client";

/**
 * useGeoSelection — one shared source of truth for the user's chosen
 * send/receive currencies (and amount) across every widget on the site.
 *
 * Resolution order (highest priority first):
 *   1. The user's OWN saved choice  — cookie `smc-geo-pref` (set when they
 *      switch currency in any widget). This WINS even if their IP later
 *      changes country (travel / VPN) — deliberate intent beats geo.
 *   2. Middleware geo cookies        — `geo-currency` / `geo-default-to` /
 *      `geo-default-amount`, seeded from IP on first visit.
 *   3. The caller's hard defaults.
 *
 * Country-change handling: we stamp the saved pref with the geo-country it was
 * made under. If the user has NOT chosen yet and the detected country changes,
 * we follow the new geo default. Once they've chosen, their pref persists.
 *
 * Persistence is a CLIENT-side cookie write (`document.cookie`), never a
 * response Set-Cookie — so it cannot reintroduce the `no-store` header that
 * caused the May 2026 deindex. The cookie is first-party, ~180 days, lax.
 */

import { useState, useEffect, useCallback, useRef } from "react";

const PREF_COOKIE = "smc-geo-pref";
const PREF_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export interface GeoSelection {
  from: string;
  to: string;
  amount: number;
}

interface StoredPref extends GeoSelection {
  /** geo-country this pref was saved under — lets us detect IP country change. */
  country?: string;
}

// ── cookie helpers (client only) ──────────────────────────────
function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  return (document.cookie.match(`(?:^|; )${name}=([^;]*)`) || [])[1] ?? "";
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${PREF_MAX_AGE}; SameSite=Lax${secure}`;
}

function readPref(): StoredPref | null {
  const raw = readCookie(PREF_COOKIE);
  if (!raw) return null;
  try {
    const p = JSON.parse(decodeURIComponent(raw));
    if (p && typeof p.from === "string" && typeof p.to === "string") return p as StoredPref;
  } catch { /* malformed cookie */ }
  return null;
}

/** Current IP-detected country (set by middleware), or "" if unknown. */
export function getGeoCountry(): string {
  return readCookie("geo-country");
}

interface Options {
  /** Hard fallback when neither a saved pref nor a geo cookie exists. */
  defaults: GeoSelection;
  /** Restrict accepted `from` codes (e.g. send currencies only). */
  isValidFrom?: (code: string) => boolean;
  /** Restrict accepted `to` codes. */
  isValidTo?: (code: string) => boolean;
}

/**
 * Returns the resolved selection plus setters that persist the user's choice.
 * `loaded` flips true after the mount-time resolution so callers can avoid a
 * flash / premature write.
 */
export function useGeoSelection({ defaults, isValidFrom, isValidTo }: Options) {
  const [from, setFromState] = useState(defaults.from);
  const [to, setToState] = useState(defaults.to);
  const [amount, setAmountState] = useState(defaults.amount);
  const [loaded, setLoaded] = useState(false);
  // True once the user has made (and we've stored) an explicit choice.
  const hasChosen = useRef(false);

  const okFrom = useCallback((c: string) => (isValidFrom ? isValidFrom(c) : true), [isValidFrom]);
  const okTo = useCallback((c: string) => (isValidTo ? isValidTo(c) : true), [isValidTo]);

  // Resolve once on mount.
  useEffect(() => {
    const pref = readPref();
    if (pref) {
      // The user has chosen before → their choice wins regardless of current IP.
      hasChosen.current = true;
      if (okFrom(pref.from)) setFromState(pref.from);
      if (okTo(pref.to)) setToState(pref.to);
      if (Number.isFinite(pref.amount) && pref.amount > 0) setAmountState(pref.amount);
    } else {
      // No saved choice → seed from middleware geo cookies (IP-based default).
      const gFrom = readCookie("geo-currency");
      const gTo = readCookie("geo-default-to");
      const gAmt = readCookie("geo-default-amount");
      if (gFrom && okFrom(gFrom)) setFromState(gFrom);
      if (gTo && okTo(gTo)) setToState(gTo);
      if (gAmt) {
        const n = Math.round(parseFloat(gAmt));
        if (Number.isFinite(n) && n > 0) setAmountState(n);
      }
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the user's full selection (called by setters below).
  const persist = useCallback((next: Partial<GeoSelection>) => {
    hasChosen.current = true;
    const current = readPref() ?? { from: defaults.from, to: defaults.to, amount: defaults.amount };
    const merged: StoredPref = {
      from: next.from ?? current.from,
      to: next.to ?? current.to,
      amount: next.amount ?? current.amount,
      country: getGeoCountry() || current.country,
    };
    writeCookie(PREF_COOKIE, JSON.stringify(merged));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFrom = useCallback((code: string) => { setFromState(code); persist({ from: code }); }, [persist]);
  const setTo = useCallback((code: string) => { setToState(code); persist({ to: code }); }, [persist]);
  const setAmount = useCallback((n: number) => { setAmountState(n); persist({ amount: n }); }, [persist]);
  /** Set from+to together (e.g. corridor picker / swap) in one persisted write. */
  const setCorridor = useCallback((f: string, t: string) => {
    setFromState(f); setToState(t); persist({ from: f, to: t });
  }, [persist]);

  return { from, to, amount, loaded, setFrom, setTo, setAmount, setCorridor };
}
