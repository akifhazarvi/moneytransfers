import Link from "next/link";
import Image from "next/image";
import { providers } from "@/data/providers";
import Container from "@/components/Container";
import ComparisonTable from "@/components/ComparisonTable";
import RatingBadge from "@/components/RatingBadge";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("compare", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/compare",
    },
    keywords: t("metaKeywords"),
  };
}

function generateComparisons() {
  const comparisons: { slugA: string; slugB: string; nameA: string; nameB: string; logoA: string; logoB: string }[] = [];
  const top = providers.slice(0, 8);
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      comparisons.push({
        slugA: top[i].slug,
        slugB: top[j].slug,
        nameA: top[i].name,
        nameB: top[j].name,
        logoA: top[i].logo,
        logoB: top[j].logo,
      });
    }
  }
  return comparisons;
}

export default async function ComparisonIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("compare");
  const comparisons = generateComparisons();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Money Transfer Provider Comparisons",
    description: "Head-to-head comparisons of international money transfer providers. See fees, exchange rates, and features side by side.",
    numberOfItems: comparisons.length,
    itemListElement: comparisons.slice(0, 10).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.nameA} vs ${c.nameB}`,
      url: `https://sendmoneycompare.com/compare/${c.slugA}-vs-${c.slugB}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* ─── HERO — Apple-quiet, big title, one sentence ─── */}
      <section className="bg-[var(--color-surface)] pt-12 sm:pt-24 pb-10 sm:pb-20 border-b border-[var(--color-outline)]">
        <Container>
          <nav className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
            <Link href="/" className="hover:text-[var(--color-on-surface)] transition-colors">Home</Link>
            {" / "}
            <span className="text-[var(--color-on-surface)]">Compare</span>
          </nav>
          <h1 className="text-[40px] sm:text-6xl font-semibold text-[var(--color-on-surface)] leading-[1.05] tracking-[-0.03em] max-w-3xl">
            {t("heading")}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] mt-3 sm:mt-5 max-w-xl">
            {t("subheading")}
          </p>
        </Container>
      </section>

      {/* ─── Provider table — the actual product ─── */}
      <section className="py-10 sm:py-14">
        <Container>
          <ComparisonTable headers={["Provider", "Rating", "Fees", "Speed", "Countries", "Rate Markup", ""]}>
            {providers.slice(0, 8).map((p) => (
              <tr key={p.slug} className="hover:bg-[var(--color-surface-dim)]">
                <td className="px-4 py-3 text-sm font-medium text-[var(--color-on-surface)]">{p.name}</td>
                <td className="px-4 py-3">
                  <RatingBadge rating={p.rating} label={p.ratingLabel} />
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)]">{p.feeStructure}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)]">{p.transferSpeed}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)]">{p.supportedCountries}+</td>
                <td className="px-4 py-3 text-sm text-[var(--color-on-surface-variant)]">{p.exchangeRateMarkup}</td>
                <td className="px-4 py-3">
                  <Link href={`/companies/${p.slug}`} className="text-2sm text-[var(--color-primary)] font-medium hover:underline">
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </ComparisonTable>
        </Container>
      </section>

      {/* ─── Head-to-head — tight chip grid, no card chrome ─── */}
      <section className="py-10 sm:py-14 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)]">
        <Container>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[var(--color-on-surface)] tracking-[-0.025em] mb-2">
            {t("headToHeadHeading")}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-8">Side-by-side fees, rates and speed.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {comparisons.slice(0, 21).map((c) => (
              <Link
                key={`${c.slugA}-${c.slugB}`}
                href={`/compare/${c.slugA}-vs-${c.slugB}`}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] hover:border-[var(--color-on-surface)]/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex -space-x-1.5 shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[var(--color-surface)] bg-[var(--color-surface-dim)]">
                      <Image src={c.logoA} alt={c.nameA} width={32} height={32} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[var(--color-surface)] bg-[var(--color-surface-dim)]">
                      <Image src={c.logoB} alt={c.nameB} width={32} height={32} className="w-full h-full object-contain p-1" />
                    </div>
                  </div>
                  <span className="text-2sm font-medium text-[var(--color-on-surface)] truncate">{c.nameA} vs {c.nameB}</span>
                </div>
                <span className="text-[var(--color-on-surface-variant)] text-xs shrink-0 group-hover:text-[var(--color-on-surface)] transition-colors">&rarr;</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Editorial — moved to bottom, no Card chrome ─── */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] tracking-[-0.025em] mb-4">
              Why compare providers?
            </h2>
            <div className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
              <p>
                The difference between the cheapest and most expensive provider on the same corridor can be 5–8% — on a $1,000 transfer, that&apos;s $50–$80 more or less reaching your recipient.
              </p>
              <p>
                Costs come from two places: the transfer <strong className="text-[var(--color-on-surface)]">fee</strong> and the exchange rate <strong className="text-[var(--color-on-surface)]">markup</strong>. Many providers advertise &quot;zero fees&quot; but widen the markup to compensate. Our head-to-head comparisons break down both so you see the true total cost.
              </p>
              <p>
                Speed varies too. Some providers deliver in minutes via local rails (UPI in India, SPEI in Mexico); others take 2–3 business days through SWIFT. Pick by total cost <em>and</em> delivery method.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Cross-links — three columns, plain text ─── */}
      <section className="py-10 sm:py-14 border-t border-[var(--color-outline)]">
        <Container>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/send-money" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">Compare rates calculator</Link></li>
                <li><Link href="/currency-converter" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">Currency converter</Link></li>
                <li><Link href="/companies" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">All provider reviews</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">Popular corridors</h3>
              <ul className="space-y-2">
                <li><Link href="/send-money/usa-to-india" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">USA to India</Link></li>
                <li><Link href="/send-money/usa-to-pakistan" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">USA to Pakistan</Link></li>
                <li><Link href="/send-money/usa-to-philippines" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">USA to Philippines</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">Guides</h3>
              <ul className="space-y-2">
                <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">Cheapest way to send money</Link></li>
                <li><Link href="/guides/exchange-rate-markup-explained" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">Exchange rates explained</Link></li>
                <li><Link href="/guides" className="text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]">All guides</Link></li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
