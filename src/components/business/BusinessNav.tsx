"use client";
import { Link, usePathname } from "@/i18n/navigation";
export default function BusinessNav() {
  const pathname = usePathname();
  return <nav className="business-nav" aria-label="Business navigation"><div>
    {[{ href: "/business", label: "Overview", active: pathname === "/business" }, { href: "/business/compare", label: "Compare providers", active: pathname === "/business/compare" }, { href: "/business#business-guides", label: "Payment guides", active: pathname.startsWith("/business/") && pathname !== "/business/compare" }].map(link => <Link key={link.href} href={link.href} aria-current={link.active ? "page" : undefined}>{link.label}</Link>)}
  </div></nav>;
}
