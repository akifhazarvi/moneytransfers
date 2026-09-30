import Link from "next/link";
import { ArrowUpRight, Building2, Landmark, BookOpen } from "lucide-react";

export default function HomeTransferPaths() {
  return <section className="home-paths" aria-labelledby="home-paths-title">
    <div className="home-section-heading"><p className="home-eyebrow">Every transfer has a purpose</p><h2 id="home-paths-title">Sending for something bigger?</h2></div>
    <div className="home-path-grid">
      {[
        { href: "/guides/best-money-transfer-apps-large-transfers", title: "Moving a larger amount", body: "Plan a property purchase or a high-value transfer.", action: "Plan a high-value transfer", icon: Landmark },
        { href: "/business", title: "Paying for your business", body: "Compare supplier payments and bulk payouts.", action: "Explore business payments", icon: Building2 },
        { href: "/guides/bank-vs-app-transfer-cost-2026", title: "Understanding the real cost", body: "Understand fees, exchange rates and the total cost.", action: "Read the cost comparison", icon: BookOpen },
      ].map(({ href, title, body, action, icon: Icon }) => <Link key={href} href={href} className="home-path-card">
        <div className="home-path-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><ArrowUpRight size={20} aria-hidden="true" /></div>
        <h3>{title}</h3><p>{body}</p><span>{action} <span aria-hidden="true">→</span></span>
      </Link>)}
    </div>
  </section>;
}
