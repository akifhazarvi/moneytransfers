"use client";

import dynamic from "next/dynamic";

// Lazy-load the bot to keep initial page weight low.
// Bot is a client-only interactive widget; no SSR needed.
const SendMoneyBot = dynamic(() => import("@/components/SendMoneyBot"), {
  ssr: false,
});

export default function LazySendMoneyBot() {
  return <SendMoneyBot />;
}
