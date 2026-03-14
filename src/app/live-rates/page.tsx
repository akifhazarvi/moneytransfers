import type { Metadata } from "next";
import LiveRatesBoard from "./LiveRatesBoard";

export const metadata: Metadata = {
  title: "Live Forex Rates — Real-Time Exchange Rate Board",
  description:
    "Track live foreign exchange rates with our real-time forex board. Compare 20 major currencies updated every 60 seconds.",
  alternates: {
    canonical: "https://moneytransfers.com/live-rates",
  },
};

export default function LiveRatesPage() {
  return <LiveRatesBoard />;
}
