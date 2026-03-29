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

function readPrefs(): ConverterPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function writePrefs(partial: Partial<ConverterPrefs>) {
  if (typeof window === "undefined") return;
  try {
    const current = readPrefs();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
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
