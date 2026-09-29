"use client";

import { useState, useEffect } from "react";
import { exchangeRates as staticRates } from "@/data/providers";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface RatesResponse {
  rates: Record<string, number>;
  timestamp: number;
}

/**
 * `countdown` enables the per-second `secondsUntilRefresh` ticker. It is off by
 * default because every tick re-renders the consuming component: on
 * /send-money that was the whole comparison widget, once a second, forever,
 * for a value only the currency converter displays.
 */
export function useExchangeRates({ countdown = false }: { countdown?: boolean } = {}) {
  const [rates, setRates] = useState<Record<string, number>>(staticRates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/rates");
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data: RatesResponse = await res.json();
        if (!cancelled) {
          setRates(data.rates);
          setLastUpdated(new Date(data.timestamp));
          setIsLive(true);
          setNextRefresh(new Date(Date.now() + REFRESH_INTERVAL));
        }
      } catch {
        // Keep static rates as fallback — already set as initial state
      }
    }

    load();

    // Refresh rates every 5 minutes
    const interval = setInterval(load, REFRESH_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (!countdown || !nextRefresh) return;

    function tick() {
      const diff = Math.max(0, Math.round((nextRefresh!.getTime() - Date.now()) / 1000));
      setSecondsUntilRefresh(diff);
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [countdown, nextRefresh]);

  return { rates, lastUpdated, isLive, secondsUntilRefresh };
}
