"use client";

import { useState, useEffect } from "react";
import { exchangeRates as staticRates } from "@/data/providers";

interface RatesResponse {
  rates: Record<string, number>;
  timestamp: number;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<Record<string, number>>(staticRates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);

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
        }
      } catch {
        // Keep static rates as fallback — already set as initial state
      }
    }

    load();

    // Refresh rates every 5 minutes
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { rates, lastUpdated, isLive };
}
