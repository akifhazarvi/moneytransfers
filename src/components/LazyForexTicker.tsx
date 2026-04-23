"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ForexTicker = dynamic(() => import("@/components/ForexTicker"), {
  ssr: false,
  loading: () => null,
});

// The ticker is a persistent piece of chrome that adds noise to any page whose job
// isn't "show me live rates right now". We render it only on exchange-rate surfaces
// (the dedicated pair page and its history) — everywhere else it was fighting the
// comparison widget, the chat bubble, and the cookie banner for attention.
export default function LazyForexTicker() {
  const pathname = usePathname() || "";
  const stripped = pathname.replace(/^\/(en|es|fr|pt)(?=\/|$)/, "");
  const show = stripped.startsWith("/exchange-rates") || stripped.startsWith("/currency-converter");
  if (!show) return null;
  return <ForexTicker />;
}
