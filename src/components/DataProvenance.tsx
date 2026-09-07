/**
 * Provenance block for the published datasets.
 *
 * WHY THIS EXISTS
 * /provider-consistency, /sendscore and /research shipped with the data half of
 * a citable page — direct answer, table, methodology anchor, dated dataset —
 * and none of the E-E-A-T half. Every page on this site that actually earns AI
 * citations (best-apps-to-send-money-from-us-2026 among them) carries an author
 * with credentials; the data pages carried no attribution at all, on YMYL
 * finance content.
 *
 * Three pages already inline an "About the author" block. This is the shared
 * version, extended with what a dataset needs beyond an article: the date of
 * the data, how the figures were produced, and the primary sources.
 *
 * ON "FACT CHECKED BY"
 * Deliberately absent. `authors.ts` holds three real people, and stamping one
 * as reviewer of a page they have not read would be a fabricated trust signal —
 * the precise failure mode this codebase keeps removing from its own copy. What
 * replaces it is a verifiability claim that is true: the figures are computed
 * by a named script from a named dataset, and the raw table is downloadable, so
 * a reader can check the number rather than trust a name. Add a real reviewer
 * here when a human has actually reviewed the page.
 */
import Image from "next/image";
import Link from "next/link";
import { getAuthor } from "@/data/authors";
import { formatLocalDate } from "@/lib/format-date";

export interface ProvenanceSource {
  label: string;
  href: string;
  /** Set for off-site sources; renders as an external link. */
  external?: boolean;
}

interface Props {
  /** ISO day of the data behind the page. */
  dataAsOf: string;
  /** What the figures are computed from, in a phrase. */
  computedFrom: string;
  /** CSV or raw-data endpoint, when the page publishes one. */
  csvHref?: string;
  sources: ProvenanceSource[];
  authorSlug?: string;
}

export default function DataProvenance({
  dataAsOf,
  computedFrom,
  csvHref,
  sources,
  authorSlug = "akif-hazarvi",
}: Props) {
  const author = getAuthor(authorSlug);

  return (
    <section
      id="provenance"
      className="py-12 bg-[var(--color-surface)] border-t border-[var(--color-outline)]"
    >
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] mb-6">
          Provenance
        </h2>

        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <div>
            <dt className="text-2xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-1">
              Data as of
            </dt>
            <dd className="text-2sm text-[var(--color-on-surface)]">
              <time dateTime={dataAsOf}>{formatLocalDate(dataAsOf)}</time>
            </dd>
          </div>
          <div>
            <dt className="text-2xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-1">
              How the figures are produced
            </dt>
            <dd className="text-2sm text-[var(--color-on-surface)] leading-relaxed">{computedFrom}</dd>
          </div>
        </dl>

        <div className="mb-8">
          <h3 className="text-2xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-2">
            Primary sources
          </h3>
          <ul className="space-y-1.5">
            {sources.map((s) => (
              <li key={s.href} className="text-2sm text-[var(--color-on-surface-variant)]">
                {s.external ? (
                  // Followed, not nofollowed: multilateral bodies, regulators and
                  // central banks are the outbound-citation signal that supports
                  // E-E-A-T on YMYL finance content.
                  <a
                    href={s.href}
                    className="text-[var(--color-primary)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                ) : (
                  <Link href={s.href} className="text-[var(--color-primary)] hover:underline">
                    {s.label}
                  </Link>
                )}
              </li>
            ))}
            {csvHref && (
              <li className="text-2sm text-[var(--color-on-surface-variant)]">
                <a href={csvHref} className="text-[var(--color-primary)] hover:underline">
                  The underlying table, as CSV
                </a>{" "}
                — check any figure on this page against the row that produced it
              </li>
            )}
          </ul>
        </div>

        {/* Author */}
        <div className="flex gap-4 pt-6 border-t border-[var(--color-outline)]">
          {author?.photo && (
            <Image
              src={author.photo}
              alt={author.name}
              width={52}
              height={52}
              className="rounded-full object-cover flex-none self-start"
            />
          )}
          <div>
            <p className="text-2xs font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-1">
              Analysis by
            </p>
            <Link
              href={`/about/${authorSlug}`}
              className="font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] hover:underline"
            >
              {author?.name}
            </Link>
            <p className="text-2xs text-[var(--color-on-surface-variant)] mb-1">{author?.role}</p>
            <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{author?.byline}</p>
          </div>
        </div>

        <p className="mt-6 text-2xs text-[var(--color-on-surface-variant)] leading-relaxed border-t border-[var(--color-outline)] pt-5">
          <strong>Corrections and independence:</strong> figures move with the scrape, so cite the data date above
          rather than the date you read this. Where we have published something wrong and fixed it, it is logged in{" "}
          <Link href="/corrections" className="text-[var(--color-primary)] hover:underline">
            corrections
          </Link>
          . No provider can buy a ranking or a place in these datasets — see our{" "}
          <Link href="/editorial-policy" className="text-[var(--color-primary)] hover:underline">
            editorial policy
          </Link>{" "}
          and{" "}
          <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
            methodology
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
