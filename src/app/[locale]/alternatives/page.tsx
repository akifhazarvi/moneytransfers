/**
 * /alternatives — the hub that indexes its own children.
 *
 * Exists because of the standing rule that every submitted URL needs at least
 * one internal link: a URL reachable only from sitemap.xml gives a crawler no
 * path to it and no signal of where it sits. This block is scoped by the same
 * predicate the sitemap uses (ALTERNATIVES_RENDERED_SLUGS), so the two cannot
 * drift apart.
 */
import type { Metadata } from "next";
import { robotsFor } from "@/lib/seo-indexing";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import { seoDescription } from "@/lib/seo-title";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { formatLocalDate } from "@/lib/format-date";
import { providerLogo } from "@/lib/provider-logo";
import { PROVIDER_ALTERNATIVES, MIN_SHARED_CORRIDORS } from "@/lib/provider-alternatives";
import { INDEX_AMOUNT } from "@/lib/remittance-cost-index";

const SITE_URL = "https://sendmoneycompare.com";
const TITLE = "Money Transfer Alternatives, Measured on Shared Routes";
const entries = [...PROVIDER_ALTERNATIVES.values()];
const asOf = entries[0]?.dataAsOf ?? new Date().toISOString().slice(0, 10);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = `For each major provider, the services measured cheaper on the corridors both actually quote at $${INDEX_AMOUNT.toLocaleString("en-US")} — median true cost, not site-wide averages.`;
  return {
    title: TITLE,
    description: seoDescription(description),
    alternates: getAlternates("alternatives", locale),
    // 2026-09-20: indexability is measured — robotsFor() consults the
    // duplication-derived allowlist. See scripts/build-indexable-routes.ts.
    robots: robotsFor("/alternatives"),
    openGraph: {
      title: TITLE,
      description: seoDescription(description),
      url: `${SITE_URL}/alternatives`,
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function AlternativesHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-dim)] pt-14 pb-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
              Measured from live quotes · <time dateTime={asOf}>{formatLocalDate(asOf)}</time>
            </span>
            <h1 className="text-3xl sm:text-h2-plus md:text-5xl font-bold text-[var(--color-on-surface)] leading-[1.15] tracking-[-0.5px]">
              Compare remittance providers against the one you use
            </h1>
            <p className="text-base md:text-lg text-[var(--color-on-surface-variant)] mt-5 leading-relaxed">
              Most &ldquo;best provider&rdquo; rankings compare site-wide averages, which compares corridor mixes rather
              than prices. Each page below instead prices one provider against every service quoting the{" "}
              <strong>same corridors</strong> at ${INDEX_AMOUNT.toLocaleString("en-US")}, and reports the median — so a
              provider is never credited for routes it does not serve, and never listed at all unless it shares at least{" "}
              {MIN_SHARED_CORRIDORS} corridors with the one you are comparing.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-4xl mx-auto grid gap-4 sm:grid-cols-2">
            {entries.map((e) => {
              const cheaper = e.cheaper.filter((r) => r.kind === "specialist");
              return (
                <Link
                  key={e.slug}
                  href={`/alternatives/${e.slug}`}
                  className="block rounded-2xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-5 hover:shadow-[var(--shadow-sm)] transition-shadow"
                >
                  <span className="flex items-center gap-3 mb-3">
                    <Image
                      src={providerLogo(e.slug, e.logo)}
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded object-contain bg-white"
                    />
                    <span className="font-semibold text-[var(--color-on-surface)]">Alternatives to {e.name}</span>
                  </span>
                  <span className="block text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {e.name} costs a median <strong>{e.costPct.toFixed(2)}%</strong> across {e.corridors} corridors.{" "}
                    {cheaper.length > 0
                      ? `${cheaper.length} specialist${cheaper.length === 1 ? " is" : "s are"} cheaper on shared routes.`
                      : "No provider sharing enough corridors is measurably cheaper."}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/remittance-cost-index" className="text-[var(--color-primary)] hover:underline">
              Remittance Cost Index
            </Link>
            <Link href="/compare" className="text-[var(--color-primary)] hover:underline">
              Head-to-head comparisons
            </Link>
            <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
              Compare live on your corridor
            </Link>
            <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">
              Methodology
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
