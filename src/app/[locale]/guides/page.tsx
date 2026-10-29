import type { ReactNode } from "react";
import { seoDescription } from "@/lib/seo-title";
import Link from "@/components/EligibleLink";
import { ArrowRight, ArrowUpRight, BookOpen, ShieldCheck } from "lucide-react";
import Container from "@/components/Container";
import GuidesClientPage from "@/components/GuidesClientPage";
import PartnerFeatureBlock from "@/components/PartnerFeatureBlock";
import ProviderCrossSell from "@/components/ProviderCrossSell";
import { blogPosts, blogCategories } from "@/data/blog-posts";
import { guideIsIndexable } from "@/lib/guide-status";
import { computeBankVsAppIndex } from "@/lib/bank-vs-app-index";
import { pppIndex } from "@/lib/ppp-index";
import { weekendMarkup } from "@/lib/weekend-markup";
import { readerSavings, periodLabel } from "@/lib/reader-savings";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { COVERAGE } from "@/lib/site-stats";
import { renderDataTokens } from "@/lib/ratings-tokens";
import { PageByline } from "@/components/PageByline";
import { EDITORIAL_AUTHOR_SLUG, pageUpdated } from "@/lib/content-dates";

/** Directory link text: the title without its "(2026)" / "in 2026" suffix,
 *  which the guide's own heading already carries (2026-09-25). */
function hubLabel(title: string): string {
  // Directory label: the title's main clause, without a year anywhere in it.
  // The full title is the guide's own heading; repeating it here (and in the
  // same order as other guides' related lists) made this page 38% duplicate.
  const noYear = title.replace(/\s*\((?:in\s+)?20\d\d\)/gi, "").replace(/\s+(?:in\s+)?20\d\d\b/gi, "").trim();
  const main = noYear.split(/\s+[—–]\s+|:\s+/)[0].trim();
  return main.split(/\s+/).length >= 3 ? main : noYear;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guides" });
  return {
    title: t("metaTitle"),
    description: seoDescription(t("metaDescription")),
    alternates: getAlternates("guides", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/guides",
      images: DEFAULT_OG_IMAGES,
    },
    keywords: t("metaKeywords"),
  };
}

const SITE_URL = "https://sendmoneycompare.com";

/** Round-4 brief §0.3: the hub names its topic (the H1 was the slogan "Know more. Send smarter."). */
const H1 = "Money transfer guides: fees, exchange rates and how to send money abroad";

/**
 * "Start here" (round-4 brief worksheet 04): the guides a first-time sender
 * needs before any route-specific one. Descriptions are written for this list
 * — not the guides' meta descriptions, which the card grid already prints.
 */
const START_HERE: readonly { slug: string; label: string; note: string }[] = [
  { slug: "how-to-send-money-abroad", label: "How to send money abroad", note: "The ways to move money across borders, from a bank wire to cash pickup, and when each one makes sense." },
  { slug: "exchange-rate-markup-explained", label: "Exchange rate markups", note: "How a quoted rate hides a margin above the mid-market rate, and how to work out what it costs you." },
  { slug: "is-my-exchange-rate-good", label: "Is my exchange rate good?", note: "Check a rate you have been offered against the mid-market rate and against months of our own quotes." },
  { slug: "money-transfer-safety-guide", label: "Money transfer safety", note: "Licences, safeguarded funds and the register checks to run before you hand a provider your money." },
  { slug: "iban-numbers-explained", label: "IBAN numbers", note: "What an IBAN is, why its length changes from country to country, and how to read one." },
  { slug: "swift-codes-explained", label: "SWIFT and BIC codes", note: "What a SWIFT code identifies, and where to find the right one for the receiving bank." },
  { slug: "fastest-way-to-send-money-internationally", label: "Transfer speed", note: "What providers promise for speed, set against transfers we sent and timed ourselves." },
];

/** One line per topic in the directory below. */
const TOPIC_NOTES: Record<string, string> = {
  Guides: "Step-by-step help with a transfer: methods, limits, documents and the details the receiving bank needs.",
  Education: "How the money behind a transfer works: rates, markups, bank codes and the payment systems that carry it.",
  Reviews: "Single providers examined on their fees, rates, coverage and the fine print.",
  Corridors: "Sending to one destination country: who quotes the route, local rules and how recipients get paid.",
  Business: "Paying suppliers, staff and clients abroad as a company rather than as a person.",
  Research: "Studies built on our own quote archive and reader data, with the method and downloads.",
};

/** A primary source: followed, opens in a new tab (CLAUDE.md SEO conventions). */
function Source({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener" className="text-[var(--color-primary)] underline underline-offset-2 hover:no-underline">{children}</a>;
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "guides" });

  // Live figures for the featured data-story banner below.
  const bankVsApp = computeBankVsAppIndex();

  const researchCards = [
    { slug: "how-much-can-you-save-comparing-money-transfers", title: `Compare Money Transfer Rates: How Much You Save (${periodLabel()})`, excerpt: `We priced ${readerSavings.totals.pricedDecisions} real provider choices from ${periodLabel()} against that day's quotes, corridor by corridor. See what comparing was worth, and price your own transfer.`, category: "Research", readTime: "", publishedAt: "2026-10-03", updatedAt: readerSavings.generatedAt },
    { slug: "best-apps-to-send-money-from-us-2026", title: "Best Apps to Send Money Internationally from the US (2026)", excerpt: "Independent rankings of money transfer apps by real transfer cost, with provider comparisons for different routes and use cases.", category: "Guides", readTime: "", publishedAt: "2026-06-30", updatedAt: "2026-06-30" },
    { slug: "bank-vs-app-transfer-cost-2026", title: "Banks vs Apps: International Transfer Costs Compared", excerpt: "Compare what banks and specialist apps charge across our tracked corridors. Explore the data, methodology, and full cost breakdown.", category: "Research", readTime: "", publishedAt: "2026-06-21", updatedAt: bankVsApp.dataAsOf.slice(0, 10) },
    { slug: "best-day-to-send-money-abroad", title: "Is It Cheaper to Send Money on a Weekday?", excerpt: "We analysed millions of quotes to see how exchange rate markups change through the week, and which providers charge more at weekends.", category: "Research", readTime: "", publishedAt: "2026-08-14", updatedAt: weekendMarkup.generatedAt.slice(0, 10) },
    { slug: "fx-cost-vs-purchasing-power", title: "Transfer Fees vs Purchasing Power: What Moving Abroad Really Costs", excerpt: "How far your money goes abroad depends on more than an exchange rate. Explore the relationship between transfer costs and local buying power.", category: "Research", readTime: "", publishedAt: "2026-08-15", updatedAt: pppIndex.generatedAt.slice(0, 10) },
    { slug: "gbp-forecast-2026", title: "GBP Forecast 2026: What’s Next for the Pound?", excerpt: "A data-led look at sterling, the forces moving it, and what exchange rate changes mean for your next international transfer.", category: "Education", readTime: "", publishedAt: "2026-07-03", updatedAt: "2026-07-03" },
  ];

  // Project to just the card fields before crossing into the client component.
  // Handing it blogPosts serialised all 115 guides' section HTML and FAQs into
  // the RSC flight payload: 2.49 MB of HTML for 1,251 words of visible text.
  // Submitted guides only — see the "All guides" index below for why.
  const indexableGuides = blogPosts.filter(guideIsIndexable);
  const guidesByCategory = blogCategories
    .map((category) => [category, indexableGuides.filter((p) => p.category === category)] as const)
    .filter(([, posts]) => posts.length > 0);

  const guideCards = blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    // The card shows the meta description, not the excerpt: the excerpt also
    // opens the guide itself, so a hub of excerpts measured 60% duplicate of
    // the pages it lists (2026-09-25). The meta description appears nowhere
    // else in page text.
    excerpt: renderDataTokens(post.metaDescription || post.excerpt),
    category: post.category,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "International Money Transfer Guides",
    description: "Expert guides on sending money internationally — compare providers, understand fees, and find the cheapest transfer route.",
    url: `${SITE_URL}/guides`,
    // One Organization node site-wide, referenced by @id (round-4 brief §2.1).
    publisher: { "@id": `${SITE_URL}/#organization` },
    // Article requires headline + author; `name` alone left ten items failing
    // validation on this page (2026-09-02 audit).
    hasPart: blogPosts.slice(0, 10).map((post) => ({
      "@type": "Article",
      headline: post.title,
      name: post.title,
      url: `${SITE_URL}/guides/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { "@type": "Person", name: post.author },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <Container className="guides-hub">
        <nav aria-label="Breadcrumb" className="guide-breadcrumb">
          <Link href="/">{t("home")}</Link><span aria-hidden="true">/</span><span aria-current="page">Guides & resources</span>
        </nav>
        <header className="guides-hub-header">
          <div>
            <p className="guide-eyebrow"><BookOpen size={15} aria-hidden="true" />Money transfer guides</p>
            <h1>{H1}</h1>
          </div>
          <div className="guides-hub-intro">
            <p>Clear, practical guides to moving money across borders. Understand the fees, explore your options, and make your next transfer with confidence.</p>
            <Link href="/editorial-policy"><ShieldCheck size={17} aria-hidden="true" />Independent research. Real transfer data.<ArrowUpRight size={15} aria-hidden="true" /></Link>
            {/* Round-3 QA item 7: a named editor and the hub's content date
                (its sitemap lastmod). Each guide carries its own. */}
            <div className="mt-4">
              <PageByline authorSlug={EDITORIAL_AUTHOR_SLUG} updated={pageUpdated("/guides")} cadence={null} />
            </div>
          </div>
        </header>

        <section aria-labelledby="guides-how-written" className="guides-hub-written max-w-3xl my-8 text-sm text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
          <h2 id="guides-how-written" className="text-lg font-medium text-[var(--color-on-surface)]">How our money transfer guides are written and checked</h2>
          <p>
            Each guide answers one question people ask before they send money abroad: which method suits the amount, what
            a quoted rate really costs, what details the receiving bank needs, or how one provider compares with another.
            Every guide names its author and shows the date its content last changed, which is not the date its prices
            were refreshed.
          </p>
          <p>
            Figures that our data already knows, such as what a transfer costs, how far a rate sits from the mid-market
            rate or which provider pays out most on a route, are read from our quote data each time the site is built
            rather than typed into the text, so a guide cannot drift from the comparison it links to. Our{" "}
            <Link href="/methodology" className="text-[var(--color-primary)] underline underline-offset-2 hover:no-underline">methodology</Link>{" "}
            explains how those quotes are collected and measured.
          </p>
          <p>
            Rules, limits and fees we do not measure ourselves come from the body that sets them, and the guide links to it:
            in the United States the Consumer Financial Protection Bureau&rsquo;s{" "}
            <Source href="https://www.consumerfinance.gov/rules-policy/regulations/1005/31/">remittance transfer rules</Source>,
            in the United Kingdom the{" "}
            <Source href="https://register.fca.org.uk/s/">FCA register</Source>,
            for the euro the European Central Bank&rsquo;s{" "}
            <Source href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html">reference rates</Source>,
            and for the cost of remittances worldwide the World Bank&rsquo;s{" "}
            <Source href="https://remittanceprices.worldbank.org/">Remittance Prices Worldwide</Source>{" "}
            database. A provider&rsquo;s own claims, such as how fast its transfers arrive, are quoted as its claims with a
            link to where it makes them.
          </p>
          <p>
            Sponsored placements are labelled and sit outside the guides&rsquo; findings; how we earn money and keep it apart
            from rankings is set out in our{" "}
            <Link href="/editorial-policy" className="text-[var(--color-primary)] underline underline-offset-2 hover:no-underline">editorial policy</Link>.
            When something we published turns out to be wrong, we fix it and record the change on our{" "}
            <Link href="/corrections" className="text-[var(--color-primary)] underline underline-offset-2 hover:no-underline">corrections page</Link>.
          </p>
        </section>

        <section aria-labelledby="guides-start-here" className="my-8">
          <h2 id="guides-start-here" className="text-lg font-medium text-[var(--color-on-surface)] mb-1">Start here: the money transfer basics</h2>
          <p className="text-2sm text-[var(--color-on-surface-variant)] mb-4">Seven guides to read before a route-specific one.</p>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {START_HERE.map((g) => (
              <li key={g.slug} className="rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface)] p-4">
                <Link href={`/guides/${g.slug}`} className="text-sm font-medium text-[var(--color-primary)] hover:underline">{g.label}</Link>
                <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">{g.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <GuidesClientPage posts={[...guideCards.filter((post) => !researchCards.some((research) => research.slug === post.slug)), ...researchCards]} categories={blogCategories} featured={
          <section key="featured-guides" className="guide-featured-grid" aria-label="Featured guides and research">
            <Link href="/guides/best-apps-to-send-money-from-us-2026" className="guide-featured-story">
              <div className="guide-featured-topline"><span className="guide-eyebrow">The starting point</span><span>2026 edition</span></div>
              <div className="guide-featured-symbol" aria-hidden="true"><ArrowUpRight strokeWidth={1} /></div>
              <div className="guide-featured-copy">
                <span className="guide-featured-label">Independent provider rankings</span>
                <h2>A better way to<br />send money abroad.</h2>
                <p>Explore the best money transfer apps from the US, ranked by what your recipient actually receives.</p>
                <span className="guide-featured-link">Find the right app for you <ArrowRight size={18} aria-hidden="true" /></span>
              </div>
            </Link>
            <div className="guide-research-desk">
              <div className="guide-research-heading"><span className="guide-eyebrow">From the research desk</span><span className="guide-live-dot" aria-hidden="true" /></div>
              <Link href="/guides/how-much-can-you-save-comparing-money-transfers">
                <span className="guide-research-number">01</span><div><h3>How much does comparing actually save?</h3><p>{periodLabel()}: {readerSavings.totals.pricedDecisions} reader choices priced</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/guides/bank-vs-app-transfer-cost-2026">
                <span className="guide-research-number">02</span><div><h3>Banks vs apps: what does a transfer really cost?</h3><p>Live data across {bankVsApp.corridorCount} corridors</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/guides/best-day-to-send-money-abroad">
                <span className="guide-research-number">03</span><div><h3>Is there a best day to send money?</h3><p>{weekendMarkup.observations.toLocaleString()} quotes analysed</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/guides/fx-cost-vs-purchasing-power">
                <span className="guide-research-number">04</span><div><h3>Transfer fees meet the cost of living</h3><p>Exchange rates & purchasing power</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/guides/gbp-forecast-2026">
                <span className="guide-research-number">05</span><div><h3>What’s next for the pound?</h3><p>A data-led GBP outlook for 2026</p></div><ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </section>
        } />

        <ProviderCrossSell source="guides" exclude="taptap-send" placement="library" title="Put your next transfer in motion." />

      {/*
        Crawlable index of every submitted guide.

        The grid above paginates client-side, so only the first page of cards
        exists in the server HTML — 8 guides had no incoming internal link
        anywhere on the site and 15 more had exactly one, reachable only via
        sitemap.xml (the "pages have only one incoming internal link" notice in
        the 2026-09-02 audit). A hub that submits 75 URLs has to link them.

        Scoped by guideIsIndexable() on purpose — the same predicate the guide
        route uses for robots and sitemap.ts uses for submission, so a guide
        that becomes submitted becomes linked here in the same change. Guides
        outside it serve noindex, and spending crawl budget on links to noindex
        pages is the mistake the June 2026 pruning was cleaning up.
      */}
      <nav aria-label="All guides" className="guide-directory">
        <h2 className="text-lg font-medium text-[var(--color-on-surface)] mb-1">
          All guides
        </h2>
        <p className="text-2sm text-[var(--color-on-surface-variant)] mb-6">
          {indexableGuides.length} guides, by topic.
        </p>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {guidesByCategory.map(([category, posts]) => (
            <section key={category} aria-label={`${category} guides`}>
              <h3 className="guide-directory-summary">{category}<span>{posts.length}</span></h3>
              {TOPIC_NOTES[category] && (
                <p className="text-2sm text-[var(--color-on-surface-variant)] mb-3 leading-relaxed">{TOPIC_NOTES[category]}</p>
              )}
              <ul className="space-y-2">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/guides/${post.slug}`}
                      className="text-sm text-[var(--color-primary)] hover:underline"
                    >
                      {hubLabel(post.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </nav>

      {/* Sponsored: below the guide index (round-4 brief §0.3 — it sat above
          the fold). The "how our guides are written" section near the top
          replaced the two-paragraph introduction that closed this page. */}
      <PartnerFeatureBlock source="taptap_spotlight:guides-hub" variant="card" />

      {/* The "Cross-links" block that closed this page (tools, top provider
          reviews, three popular corridors) was removed 2026-10-08 (round-3
          brief §5.1): /send-money, /compare and /companies are in the header,
          the bank-vs-app index is in the featured grid above, and the two
          reviews are Bing-only pages a link may not point at (rule 14). The
          hub's job is the guide index; it keeps the links to its children. */}
    </Container>
    </>
  );
}
