"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ProviderLink from "@/components/ProviderLink";
import { getGoUrl } from "@/lib/affiliate";
import { trackCrossSellViewed, trackCrossSellNavigation, trackGuideSidebarCTA } from "@/lib/analytics";
import { crossSellComparisonHref, type CrossSellPartner, type TransferContext, type TransferIntent } from "@/lib/provider-cross-sell";

export interface ProviderCrossSellCardsProps {
  partners: CrossSellPartner[];
  source: string;
  placement: "inline" | "sidebar" | "library" | "page-end";
  intent?: TransferIntent;
  context?: TransferContext;
  title?: string;
}

export default function ProviderCrossSellCards({ partners, source, placement, intent = "personal", context, title }: ProviderCrossSellCardsProps) {
  const ref = useRef<HTMLElement>(null);
  const attribution = `partner_${placement}:${source}`;
  const corridor = context ? `${context.from}-${context.to}` : "";
  const compact = placement === "inline" || placement === "sidebar";
  const providerIds = partners.map((partner) => partner.slug).join(",");

  useEffect(() => {
    const element = ref.current;
    if (!element || !providerIds || typeof IntersectionObserver === "undefined") return;
    // Observe the small section heading, not the entire card grid: a full
    // three-card stack can be taller than a phone's viewport.
    const marker = element.querySelector("[data-partner-heading]");
    if (!marker) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
      trackCrossSellViewed(source, placement, providerIds, corridor);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [source, placement, providerIds, corridor]);

  const compareHref = crossSellComparisonHref(intent, context);
  if (!partners.length) return (
    <aside className={`provider-cross-sell provider-cross-sell--${placement}`} aria-label="Compare transfer options">
      <p className="partner-name">Find a provider for your transfer.</p>
      <p className="partner-description">Choose your destination and compare {intent === "business" ? "business payment services" : "the available options"}.</p>
      <div className="partner-section-footer"><Link href={compareHref} onClick={() => {
        trackCrossSellNavigation("compare", source, placement, "", corridor);
        if (placement === "sidebar" && source.startsWith("guide:")) trackGuideSidebarCTA(source.slice(6));
      }}>Compare providers <ArrowRight size={15} aria-hidden="true" /></Link></div>
    </aside>
  );
  return (
    <aside ref={ref} className={`provider-cross-sell provider-cross-sell--${placement}`} aria-label="Transfer partner options" data-provider-cross-sell={placement}>
      <div className="partner-section-heading" data-partner-heading>
        <p className="partner-eyebrow">{compact ? "Partner spotlight" : "Explore our transfer partners"}</p>
        {!compact && <h2>{title || "Ready for your next transfer?"}</h2>}
        {context && <p className="partner-corridor">For {context.amount.toLocaleString("en-US")} {context.from} → {context.to}</p>}
        {!compact && <p className="partner-intro">Find a service that fits, check your rate, and send when you’re ready.</p>}
      </div>
      <div className={`partner-grid${partners.length === 2 ? " partner-grid--two" : ""}`}>
        {partners.map((partner, index) => (
          <div className={`partner-card${index === 0 ? " partner-card--featured" : ""}`} key={partner.slug} data-partner={partner.slug}>
            <div className="partner-identity">
              <span className="partner-logo"><Image src={partner.logo} alt="" width={44} height={44} unoptimized /></span>
              <div><p className="partner-name">{partner.name}</p><p className="partner-label">{partner.label}</p></div>
            </div>
            <p className="partner-description">{partner.description}</p>
            <div className="partner-actions">
              <ProviderLink
                href={getGoUrl(partner.slug, { sourceCurrency: context?.from, targetCurrency: context?.to, sourceAmount: context?.amount, clickref: attribution })}
                provider={partner.slug} source={attribution} corridor={corridor} className="partner-primary"
              >Check {partner.name} rates <ArrowUpRight size={16} aria-hidden="true" /></ProviderLink>
              <Link className="partner-review" href={`/companies/${partner.slug}`} onClick={() => trackCrossSellNavigation("review", source, placement, partner.slug, corridor)}>
                Read {partner.name} review <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="partner-section-footer">
        <p>Paid partner placement. We may earn a commission. Availability and final rates depend on your transfer.</p>
        <Link href={compareHref} onClick={() => {
          trackCrossSellNavigation("compare", source, placement, "", corridor);
          if (placement === "sidebar" && source.startsWith("guide:")) trackGuideSidebarCTA(source.slice(6));
        }}>Compare {intent === "business" ? "business providers" : "all providers"}<ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
    </aside>
  );
}
