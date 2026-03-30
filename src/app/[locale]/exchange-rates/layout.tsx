import { Instrument_Serif, Share_Tech_Mono } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: "400",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-display",
  weight: "400",
});

export default function ExchangeRatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${instrumentSerif.variable} ${shareTechMono.variable}`}>
      {children}
    </div>
  );
}
