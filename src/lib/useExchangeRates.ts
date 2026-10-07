"use client";

import { useState, useEffect, useCallback, useRef, createContext, createElement, useContext, type ReactNode } from "react";
import { exchangeRates as staticRates } from "@/data/providers";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface RatesResponse {
  rates: Record<string, number>;
  timestamp: number;
}

/** One request schedule shared by the site strip and page-level converters. */
function useRatesSource(enabled: boolean) {
  const [rates, setRates] = useState<Record<string, number>>(staticRates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null);

  const [refreshing, setRefreshing] = useState(true);
  const [failed, setFailed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const inFlight = useRef(false);
  const refresh = useCallback(() => {
    if (!inFlight.current) setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!enabled) return;
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
  }, [refreshKey, enabled]);

  return { rates, lastUpdated, isLive, nextRefresh, refreshing, failed, refresh };
}

const RatesContext = createContext<ReturnType<typeof useRatesSource> | null>(null);

export function ExchangeRatesProvider({ children }: { children: ReactNode }) {
  const value = useRatesSource(true);
  return createElement(RatesContext.Provider, { value }, children);
}

/** Per-second updates stay opt-in, so result lists do not rerender on ticks. */
export function useExchangeRates({ countdown = false }: { countdown?: boolean } = {}) {
  const shared = useContext(RatesContext);
  const local = useRatesSource(shared === null);
  const value = shared ?? local;
  const { nextRefresh } = value;
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState<number | null>(null);
  useEffect(() => {
    if (!countdown || !nextRefresh) return;
    const tick = () => setSecondsUntilRefresh(Math.max(0, Math.ceil((nextRefresh.getTime() - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [countdown, nextRefresh]);
  return { ...value, secondsUntilRefresh };
}
