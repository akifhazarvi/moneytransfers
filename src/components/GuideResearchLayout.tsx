import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import Container from "@/components/Container";
import GuideContents, { type GuideSection } from "@/components/GuideContents";
import GuideReadingProgress from "@/components/GuideReadingProgress";
import GuideSidebarCTA from "@/components/GuideSidebarCTA";
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

  return (
    <Container className="guide-research-layout">
      <GuideReadingProgress />
      <div className="guide-reading-grid" id="guide-top">
        <article id="guide-article" className="guide-research-article">
          {content.slice(0, firstSection < 0 ? content.length : firstSection)}
          <GuideContents sections={sections} mobile />
          {firstSection >= 0 && content.slice(firstSection)}
        </article>
        <aside className="guide-article-sidebar" aria-label="Guide navigation and tools">
          <div className="guide-sidebar-sticky">
            <GuideContents sections={sections} />
            <GuideSidebarCTA slug={slug} />
            <Link href="/guides" className="guide-back-top"><ArrowLeft size={14} aria-hidden="true" />Explore all guides</Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
