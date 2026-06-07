"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "converter-prefs";

interface ConverterPrefs {
  from: string;
  targets: string[]; // target currency codes (full converter)
  to: string;        // single target (homepage converter)
  amount: number;
}

const DEFAULTS: ConverterPrefs = {
  from: "USD",
  targets: ["EUR"],
  to: "EUR",
  amount: 1000,
};

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  return (document.cookie.match(`(?:^|; )${name}=([^;]*)`) || [])[1] ?? "";
}

/**
 * Geo-seeded defaults: before the user has saved anything, fall back to the
 * IP-based geo cookies (set by middleware) and the cross-widget user choice
 * cookie (`smc-geo-pref`) so the converter opens on the user's own corridor
 * instead of a hardcoded USD→EUR. Mirrors useGeoSelection's resolution order:
 * user choice (smc-geo-pref) > IP geo (geo-*) > DEFAULTS.
 */
function geoSeededDefaults(): ConverterPrefs {
  let from = DEFAULTS.from;
  let to = DEFAULTS.to;
  // 1. Cross-widget saved choice wins.
  try {
    const pref = readCookie("smc-geo-pref");
    if (pref) {
      const p = JSON.parse(decodeURIComponent(pref));
      if (typeof p?.from === "string") from = p.from;
      if (typeof p?.to === "string") to = p.to;
      return { ...DEFAULTS, from, to, targets: [to] };
    }
  } catch { /* malformed */ }
  // 2. IP geo cookies.
  const gFrom = readCookie("geo-currency");
  const gTo = readCookie("geo-default-to");
  if (gFrom) from = gFrom;
  if (gTo) to = gTo;
  return { ...DEFAULTS, from, to, targets: gTo ? [gTo] : DEFAULTS.targets };
}

function readPrefs(): ConverterPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // No saved converter pref yet → seed from geo so first view matches the user.
    if (!raw) return geoSeededDefaults();
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return geoSeededDefaults();
  }
}

function writePrefs(partial: Partial<ConverterPrefs>) {
  if (typeof window === "undefined") return;
  try {
    const current = readPrefs();
    const next = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // Mirror the from/to choice to the cross-widget cookie so the rates hero,
    // comparison widget, etc. all reflect the same last-chosen corridor.
    if (partial.from || partial.to) {
      const single = next.to || next.targets?.[0] || DEFAULTS.to;
      const cookieVal = encodeURIComponent(JSON.stringify({ from: next.from, to: single, amount: next.amount }));
      const secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `smc-geo-pref=${cookieVal}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax${secure}`;
    }
  } catch { /* quota exceeded or private browsing */ }
}

/** Hook for the full currency converter page */
export function useConverterPagePrefs() {
  const [loaded, setLoaded] = useState(false);
  const [from, setFrom] = useState(DEFAULTS.from);
  const [targets, setTargets] = useState<string[]>(DEFAULTS.targets);
  const [amount, setAmount] = useState(DEFAULTS.amount);

  // Load from localStorage on mount
  useEffect(() => {
    const prefs = readPrefs();
    setFrom(prefs.from);
    setTargets(prefs.targets.length > 0 ? prefs.targets : DEFAULTS.targets);
    setAmount(prefs.amount > 0 ? prefs.amount : DEFAULTS.amount);
    setLoaded(true);
  }, []);

  // Save when values change (skip initial load)
  useEffect(() => {
    if (!loaded) return;
    writePrefs({ from, targets, amount });
  }, [from, targets, amount, loaded]);

  return { from, setFrom, targets, setTargets, amount, setAmount, loaded };
}

/** Hook for the homepage converter widget */
export function useHomepageConverterPrefs() {
  const [loaded, setLoaded] = useState(false);
  const [from, setFrom] = useState(DEFAULTS.from);
  const [to, setTo] = useState(DEFAULTS.to);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    const prefs = readPrefs();
    setFrom(prefs.from);
    setTo(prefs.to);
    setLoaded(true);
  }, []);

  const saveFrom = useCallback((code: string) => {
    setFrom(code);
    writePrefs({ from: code });
  }, []);

  const saveTo = useCallback((code: string) => {
    setTo(code);
    writePrefs({ to: code });
  }, []);

  return { from, setFrom: saveFrom, to, setTo: saveTo, amount, setAmount, loaded };
}
