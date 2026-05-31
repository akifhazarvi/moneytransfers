import Link from "next/link";
import Image from "next/image";
import { providers } from "@/data/providers";
import Container from "@/components/Container";
import CompareShowdown from "@/components/CompareShowdown";
import { getAlternates } from "@/lib/i18n-metadata";
import { getCompareCanonicalSlug } from "@/lib/compare-canonical";
import { SITEMAP_COMPARISON_SLUGS } from "@/lib/sitemap-allowlists";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { statSync } from "fs";
import { join } from "path";

// Revalidate every 6 hours — matches scraper cadence (parity with /compare/[slug]).
export const revalidate = 21600;

/** Most recent mtime of scraped quote files as an ISO date — E-E-A-T freshness signal. */
function getDataFreshnessDate(): string {
  const scrapedDir = join(process.cwd(), "src/data/scraped");
  const quoteFiles = ["provider-quotes.json", "mid-market-rates.json", "exchange-rates.json"];
  let latest = new Date(0);
  for (const file of quoteFiles) {
    try {
      const mtime = statSync(join(scrapedDir, file)).mtime;
      if (mtime > latest) latest = mtime;
    } catch { /* file may not exist */ }
  }
  return latest.getTime() > 0 ? latest.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
}

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

interface Matchup {
  slug: string;
  nameA: string;
  nameB: string;
  logoA: string;
  logoB: string;
}

/**
 * Matchups are drawn ONLY from SITEMAP_COMPARISON_SLUGS — the Bing/GSC-validated,
 * indexed comparison pages. The old top-8-alphabetical loop generated 28 pairs,
 * most of them noindexed thin auto-pages (see project_thin_compare_noindex_may22),
 * so chips pointed at pages Google was told to drop. Linking only to allowlisted
 * pairs concentrates internal-link equity on URLs that actually rank.
 * Bing-winning pairs (moneygram-vs-western-union 68i, remitly-vs-western-union 10i,
 * paypal-vs-revolut 11i) surface first; Remitly is the #1 Bing brand (6,101i).
 */
const BING_PRIORITY_PAIRS = [
  "wise-vs-remitly",
  "moneygram-vs-western-union",
  "remitly-vs-western-union",
  "wise-vs-revolut",
  "paypal-vs-revolut",
  "wise-vs-paypal",
  "remitly-vs-moneygram",
  "paypal-vs-xoom",
];

function buildMatchups(): Matchup[] {
  const ordered = [
    ...BING_PRIORITY_PAIRS.filter((s) => SITEMAP_COMPARISON_SLUGS.has(s)),
    ...[...SITEMAP_COMPARISON_SLUGS].filter((s) => !BING_PRIORITY_PAIRS.includes(s)),
  ];
  const matchups: Matchup[] = [];
  const seen = new Set<string>();
  for (const raw of ordered) {
    const canonical = getCompareCanonicalSlug(raw);
    if (seen.has(canonical)) continue;
    const [slugA, slugB] = raw.split("-vs-");
    const a = providers.find((p) => p.slug === slugA);
    const b = providers.find((p) => p.slug === slugB);
    if (!a || !b) continue; // bank-vs-bank pairs (lloyds-vs-nationwide) aren't in providers[]
    seen.add(canonical);
    matchups.push({ slug: canonical, nameA: a.name, nameB: b.name, logoA: a.logo, logoB: b.logo });
  }
  return matchups;
}

/** Compare-tool FAQ — question-format phrasing that wins on Bing (e.g. "exchange
 *  rate mark up" 66.7% CTR, "does revolut charge fees abroad" 75% CTR). Kept generic
 *  to the comparison TOOL so it does not cannibalise the pair-specific FAQs on the
 *  /compare/[slug] articles (anti-cannibalisation rule, feedback_corridor_depth_template). */
const COMPARE_FAQS: { q: string; a: string }[] = [
  {
    q: "How do you decide which provider is cheaper?",
    a: "By the amount the recipient actually receives — never the advertised fee. The true cost of a transfer is the stated fee plus the exchange-rate markup (markup % × amount sent), and the markup scales with transfer size while a flat fee does not. Our tool takes each provider's live rate (refreshed every 6 hours from provider APIs and calculators), nets out both the fee and the markup, and shows you the single number that matters: what lands in the recipient's account. This is the same all-in logic the World Bank uses in its Remittance Prices Worldwide survey.",
  },
  {
    q: "What is an exchange rate markup?",
    a: "It's the gap between the mid-market rate (the real interbank midpoint you can check on Google, the midpoint of the buy and sell prices) and the weaker rate a provider gives you. You calculate it as ((mid-market rate − your quoted rate) ÷ mid-market rate) × 100. If the mid-market is 1.30 and you're quoted 1.26, that's a 3.08% markup. It's the provider's margin on the conversion and it's almost never shown as a line item — it's baked into the rate itself, which is exactly why it's easy to miss.",
  },
  {
    q: "Why do 'zero fee' transfers sometimes cost more?",
    a: "Because the cost moves from a visible fee into the hidden exchange-rate markup. On a $1,000 transfer, a provider charging a $0 fee with a 3% markup costs you $30 — worse than a rival charging a visible $10 fee on a near-mid-market rate ($15 total). The markup also scales: 3% on a $10,000 transfer is $300. That's why we rank on the receive amount, which already nets out both.",
  },
  {
    q: "How do markups compare across provider types?",
    a: "They vary widely. Wise advertises the mid-market rate with no markup, charging an explicit upfront fee instead (often from roughly 0.4–0.6% of the amount). Remittance apps like Remitly typically apply around 1–3% above mid-market. High-street banks run roughly 2–4.5%. Cash-pickup networks like Western Union are commonly 2–4%, and PayPal/Xoom sit at the higher end (PayPal publishes a 3.5–4% conversion fee). The World Bank's global average all-in cost is about 6.4% of the amount sent — so the spread between cheapest and most expensive is large.",
  },
  {
    q: "Is the comparison data live?",
    a: "Yes. Rates and fees are scraped from provider APIs and calculators every 6 hours and merged by source priority (direct API first, then aggregators, then fallback). The receive-amount figures update with each refresh, so the verdict reflects current pricing rather than a static table. We also flag any provider where we don't have fresh data for your chosen currency pair.",
  },
  {
    q: "Are these affiliate links?",
    a: "Some are. When you click “Send with” we may earn a commission at no cost to you. It never changes which provider the tool shows as cheaper — the winner is decided purely by the live receive amount. See our methodology for exactly how we rank.",
  },
];

export default async function ComparisonIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "compare" });
  const matchups = buildMatchups();
  const dataUpdated = getDataFreshnessDate();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Money Transfer Provider Comparisons",
    description: "Head-to-head comparisons of international money transfer providers. See fees, exchange rates, and features side by side.",
    numberOfItems: matchups.length,
    itemListElement: matchups.slice(0, 10).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.nameA} vs ${c.nameB}`,
      url: `https://sendmoneycompare.com/compare/${c.slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COMPARE_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Money Transfer Provider Comparison Tool",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: "Pick any two money transfer providers and instantly see who delivers more — live exchange rates, fees, and a feature-by-feature comparison.",
    url: "https://sendmoneycompare.com/compare",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ─── HERO + TOOL — the showdown is the product, kept above the fold ─── */}
      <section className="bg-[var(--color-surface)] pt-5 sm:pt-8 pb-10 sm:pb-14 border-b border-[var(--color-outline)]">
        <Container>
          <nav className="text-2sm text-[var(--color-on-surface-variant)] mb-3">
            <Link href="/" className="hover:text-[var(--color-on-surface)] transition-colors">Home</Link>
            {" / "}
            <span className="text-[var(--color-on-surface)]">Compare</span>
          </nav>
          <div className="mb-5 sm:mb-6">
            <h1 className="text-[28px] sm:text-4xl font-semibold text-[var(--color-on-surface)] leading-[1.08] tracking-[-0.03em]">
              {t("heading")}
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] mt-2 whitespace-normal sm:whitespace-nowrap">
              Pick any two providers. See who delivers more — live rates, fees and features, side by side.
            </p>
          </div>
          <div>
            <CompareShowdown />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-[var(--color-on-surface-variant)]">
            <span>
              Live rates updated{" "}
              <time dateTime={dataUpdated}>
                {new Date(dataUpdated + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
            <span>Ranked by amount received, not advertised fee</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
            <Link href="/methodology" className="text-[var(--color-primary)] hover:underline">How we calculate this</Link>
          </div>
        </Container>
      </section>

      {/* ─── How it works — researched, AI-citable passage (owns "exchange rate markup") ─── */}
      <section className="py-10 sm:py-14 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] tracking-[-0.025em] mb-4">
              How the comparison works
            </h2>
            <div className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
              <p>
                Every international transfer has two costs: the <strong className="text-[var(--color-on-surface)]">fee</strong> you can see, and the <strong className="text-[var(--color-on-surface)]">exchange-rate markup</strong> you usually can&apos;t. The markup is the gap between the mid-market rate — the real interbank midpoint you can check on Google — and the weaker rate a provider actually gives you. Work it out as{" "}
                <span className="font-medium text-[var(--color-on-surface)]">((mid-market rate − your quoted rate) ÷ mid-market rate) × 100</span>. If the mid-market is 1.30 and you&apos;re quoted 1.26, that&apos;s a 3.08% markup, and it&apos;s baked into the rate rather than shown as a line item.
            </p>
              <p>
                That&apos;s why a &quot;zero-fee&quot; transfer can cost more than one with a visible fee. On a $1,000 transfer, $0 fee with a 3% markup costs you <strong className="text-[var(--color-on-surface)]">$30</strong> — worse than a $10 fee on a near-mid-market rate, which costs just <strong className="text-[var(--color-on-surface)]">$15</strong>. And because the markup scales with size, 3% on a $10,000 transfer is $300. The only honest comparison is the <strong className="text-[var(--color-on-surface)]">amount the recipient actually receives</strong>, which already nets out both — the same all-in logic the World Bank uses, where the global average transfer still costs around 6.4% of the amount sent.
              </p>
              <p>
                Markups vary sharply by provider type. Specialist apps like Wise pass on the mid-market rate and charge a small transparent fee (often ~0.4–0.6%); remittance apps such as Remitly typically add ~1–3% to the rate but win on instant cash pickup, mobile wallets and first-transfer promotions to corridors like India, the Philippines and Mexico. Banks run ~2–4.5%, and PayPal/Xoom sit higher still. Our tool above runs your exact amount and currency pair through current scraped rates so you don&apos;t have to do the arithmetic.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Head-to-head — tight chip grid, no card chrome ─── */}
      <section className="py-10 sm:py-14 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline)]">
        <Container>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[var(--color-on-surface)] tracking-[-0.025em] mb-2">
            {t("headToHeadHeading")}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-8">In-depth, hand-written breakdowns — fees, rates, speed and our verdict.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {matchups.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
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

      {/* ─── FAQ — question-format (Bing high-CTR pattern), deduped vs [slug] article FAQs ─── */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)] tracking-[-0.025em] mb-6">
              Comparing money transfers: FAQ
            </h2>
            <div className="space-y-3">
              {COMPARE_FAQS.map((faq) => (
                <details key={faq.q} className="group border border-[var(--color-outline)] rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 list-none text-md font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors select-none">
                    {faq.q}
                    <svg className="w-4 h-4 shrink-0 ml-4 text-[var(--color-on-surface-muted)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 pt-1 text-sm text-[var(--color-on-surface-variant)] leading-relaxed border-t border-[var(--color-outline)]">
                    {faq.a}
                  </div>
                </details>
              ))}
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
