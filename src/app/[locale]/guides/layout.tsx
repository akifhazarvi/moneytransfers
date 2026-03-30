import { Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
  weight: ["400", "700"],
});

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return <div className={sourceSerif.variable}>{children}</div>;
}
