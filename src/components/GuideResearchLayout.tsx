import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import Container from "@/components/Container";
import GuideContents, { type GuideSection } from "@/components/GuideContents";
import GuideReadingProgress from "@/components/GuideReadingProgress";
import GuideSidebarCTA from "@/components/GuideSidebarCTA";
import ProviderCrossSell from "@/components/ProviderCrossSell";
import PartnerFeatureBlock from "@/components/PartnerFeatureBlock";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function headingText(node: ReactNode): string {
  return Children.toArray(node).map((child): string => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    if (isValidElement<{ children?: ReactNode }>(child)) return headingText(child.props.children);
    return "";
  }).join("").replace(/\s+/g, " ").trim();
}

/** Derive navigation on the server from the research page's actual headings.
 * Existing fragment links are preserved; no article content is sent as client props.
 */
export default function GuideResearchLayout({ children, slug }: { children: ReactNode; slug: string }) {
  const sections: GuideSection[] = [];
  const usedIds = new Set<string>();
  const content = Children.toArray(children).map((child) => {
    if (!isValidElement<{ children?: ReactNode; id?: string }>(child) || child.type !== "h2") return child;
    const title = headingText(child.props.children);
    const base = child.props.id ?? (title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section");
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    sections.push({ id, title });
    return cloneElement(child, { id });
  });
  const firstSection = content.findIndex((child) => isValidElement(child) && child.type === "h2");
  // No page drops the partner from this card. The gbp-forecast-2026 exception
  // that used to live here was removed 2026-09-18 on an explicit call: the
  // partnership is worth more than the topical tidiness of keeping a
  // remittance app off a currency-outlook page, and the card's own copy makes
  // no corridor claim. See [[project_taptap_earned_highlight_sep11]].

  return (
    <Container className="guide-research-layout">
      <GuideReadingProgress />
      <div className="guide-reading-grid" id="guide-top">
        <article id="guide-article" className="guide-research-article">
          {content.slice(0, firstSection < 0 ? content.length : firstSection)}
          <ProviderCrossSell source={`guide:${slug}`} placement="inline" />
          <GuideContents sections={sections} mobile />
          {firstSection >= 0 && content.slice(firstSection)}
          {/* Partner spotlight — after every comparison on the page, never
              inside one. See [[project_taptap_earned_highlight_sep11]]. No
              linkContext: these research pages don't carry one reliable
              corridor the way a templated guide's inlineQuoteCorridor does. */}
          <PartnerFeatureBlock source={`taptap_spotlight:guide:${slug}`} variant="inline" />
        </article>
        <aside className="guide-article-sidebar" aria-label="Guide navigation and tools">
          <div className="guide-sidebar-sticky">
            <GuideSidebarCTA slug={slug} />
            <GuideContents sections={sections} />
            <Link href="/guides" className="guide-back-top"><ArrowLeft size={14} aria-hidden="true" />Explore all guides</Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
