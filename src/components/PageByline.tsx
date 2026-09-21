import Link from "next/link";
import { authors } from "@/data/authors";

/**
 * Author, review date and sources line for template-generated pages.
 *
 * WHY
 * The Sep 2026 content brief asks for this twice, for two different reasons:
 * §10-A step 6 ("Add a visible last-updated date and author; add data sources")
 * as part of de-duplicating templated pages, and §5.4 ("Add author details ...
 * to at least your category pages") as an E-E-A-T signal on YMYL finance
 * content. /compare/* already carried this block inline; /companies/*, /iban/*
 * and the corridor pages carried a bare "Updated" date with no named human
 * behind it, which is the half that E-E-A-T actually reads.
 *
 * Kept as one component so the markup, the author link and the methodology link
 * cannot drift apart across the four templates that render it.
 */
export function PageByline({
  authorSlug = "awais-imran",
  reviewerSlug,
  updated,
  cadence = "Data updated every 6 hours",
  sourcesHref = "/methodology",
  sourcesLabel = "Our methodology",
}: {
  authorSlug?: string;
  reviewerSlug?: string;
  /** ISO yyyy-mm-dd. */
  updated: string;
  cadence?: string | null;
  sourcesHref?: string;
  sourcesLabel?: string;
}) {
  const author = authors.find((a) => a.slug === authorSlug);
  const reviewer = reviewerSlug ? authors.find((a) => a.slug === reviewerSlug) : undefined;
  const dot = <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />;

  return (
    <div className="flex flex-wrap items-center gap-4 text-2sm text-[var(--color-on-surface-variant)]">
      <span>
        {author ? (
          <>
            By{" "}
            <Link href={`/about/${author.slug}`} className="text-[var(--color-primary)] hover:underline">
              {author.name}
            </Link>
          </>
        ) : (
          "SendMoneyCompare Editorial"
        )}
        {reviewer && (
          <>
            {" · Reviewed by "}
            <Link href={`/about/${reviewer.slug}`} className="text-[var(--color-primary)] hover:underline">
              {reviewer.name}
            </Link>
          </>
        )}
      </span>
      {dot}
      <time dateTime={updated}>
        Updated{" "}
        {new Date(updated + "T00:00:00").toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </time>
      {cadence && (
        <>
          {dot}
          <span>{cadence}</span>
        </>
      )}
      {dot}
      <Link href={sourcesHref} className="text-[var(--color-primary)] hover:underline">
        {sourcesLabel}
      </Link>
    </div>
  );
}
