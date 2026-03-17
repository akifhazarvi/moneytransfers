"use client";

import dynamic from "next/dynamic";

const ForexTicker = dynamic(() => import("@/components/ForexTicker"), {
  ssr: false,
});

export default function LazyForexTicker() {
  return <ForexTicker />;
}
