"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

  const [refreshing, setRefreshing] = useState(true);
  const [failed, setFailed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const inFlight = useRef(false);
  const refresh = useCallback(() => {
    if (!inFlight.current) setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      if (inFlight.current) return;
      inFlight.current = true;
      setRefreshing(true);
      try {
        if (!navigator.onLine) throw new Error("Offline");
        const res = await fetch("/api/rates", { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data: RatesResponse = await res.json();
        if (!data.rates || !Object.values(data.rates).every((rate) => typeof rate === "number" && Number.isFinite(rate) && rate > 0) || !Object.keys(data.rates).length) throw new Error("Invalid rates");
        if (!cancelled) {
          setFailed(false);
          setRates(data.rates);
          setLastUpdated(new Date(data.timestamp));
          setIsLive(true);
        }
      } catch {
        // Preserve the previous rates and explain that the check failed.
        if (!cancelled) { setFailed(true); setIsLive(false); }
      } finally {
        if (!cancelled) {
          inFlight.current = false;
          setRefreshing(false);
          setNextRefresh(new Date(Date.now() + REFRESH_INTERVAL));
        }
      }
    }

    // Schedule from completion so the displayed countdown matches the request.
    let timer: ReturnType<typeof setTimeout>;
    async function scheduledLoad() {
      await load();
      if (!cancelled) timer = setTimeout(scheduledLoad, REFRESH_INTERVAL);
    }
    void scheduledLoad();
    return () => {
      cancelled = true;
      controller.abort();
      inFlight.current = false;
      clearTimeout(timer);
    };
  }, [refreshKey]);

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

  return { rates, lastUpdated, isLive, secondsUntilRefresh, nextRefresh, refreshing, failed, refresh };
}
