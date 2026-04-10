"use client";

import dynamic from "next/dynamic";

const ForexTicker = dynamic(() => import("@/components/ForexTicker"), {
  ssr: false,
  loading: () => <div className="h-10" />,
});

export default function LazyForexTicker() {
  return (
    <div className="min-h-10">
      <ForexTicker />
    </div>
  );
}
