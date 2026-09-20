"use client";

import { useEffect, useState } from "react";
import CryptoRailSectionView from "@/components/CryptoRailSectionView";
import type { CryptoRailSectionData } from "@/lib/crypto-rail-section";

export default function CryptoRailSectionClient({ from, to, amount, initialData }: {
  from: string;
  to: string;
  amount: number;
  initialData: CryptoRailSectionData;
}) {
  const [result, setResult] = useState<CryptoRailSectionData | null>(null);
  const isInitial = from === initialData.from && to === initialData.to && amount === initialData.amount;

  useEffect(() => {
    if (isInitial) return;
    const controller = new AbortController();
    // Wait for amount edits to settle and cancel requests for old selections.
    const timer = setTimeout(async () => {
      try {
        const query = new URLSearchParams({ from, to, amount: String(amount) });
        const response = await fetch(`/api/crypto-rails?${query}`, { signal: controller.signal });
        if (!response.ok) return;
        const data: CryptoRailSectionData = await response.json();
        if (!controller.signal.aborted) setResult(data);
      } catch {
        // Optional secondary comparison; the main provider results stay usable.
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [from, to, amount, isInitial]);

  const data = isInitial ? initialData : result;
  // Never display a quote for a previous currency pair or send amount.
  if (!data || data.from !== from || data.to !== to || data.amount !== amount) return null;
  return <CryptoRailSectionView {...data} />;
}
