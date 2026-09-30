import type { ReactNode } from "react";
import BusinessNav from "@/components/business/BusinessNav";
import "./business.css";
export default function BusinessLayout({ children }: { children: ReactNode }) {
  return <div className="business-experience"><BusinessNav />{children}</div>;
}
