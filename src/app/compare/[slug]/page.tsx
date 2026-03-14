import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { providers, generateQuotes } from "@/data/providers";
import { getGoUrl } from "@/lib/affiliate";
import { getComparisonArticle } from "@/data/comparison-articles";
import Container from "@/components/Container";
import Card from "@/components/Card";
import ProsConsList from "@/components/ProsConsList";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonTable from "@/components/ComparisonTable";
import RatingBadge from "@/components/RatingBadge";
import ComparisonWidget from "@/components/ComparisonWidget";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

function parseSlug(slug: string) {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const a = providers.find((p) => p.slug === parts[0]);
  const b = providers.find((p) => p.slug === parts[1]);
  if (!a || !b) return null;
  return { a, b };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let i = 0; i < providers.length; i++) {
    for (let j = i + 1; j < providers.length; j++) {
      params.push({ slug: `${providers[i].slug}-vs-${providers[j].slug}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getComparisonArticle(slug);
  if (article) {
    return {
      title: `${article.title} | MoneyTransfers`,
      description: article.metaDescription,
      openGraph: {
        title: article.title,
        description: article.metaDescription,
        type: "article",
        modifiedTime: article.updatedAt,
      },
      alternates: {
        canonical: `https://moneytransfers.com/compare/${slug}`,
      },
    };
  }

  const pair = parseSlug(slug);
  if (!pair) return {};
  return {
    title: `${pair.a.name} vs ${pair.b.name}: Fees, Rates & Features Compared | MoneyTransfers`,
    description: `Compare ${pair.a.name} and ${pair.b.name} side by side. See which offers better exchange rates, lower fees, and faster transfers.`,
    alternates: {
      canonical: `https://moneytransfers.com/compare/${slug}`,
    },
    openGraph: {
      title: `${pair.a.name} vs ${pair.b.name} — Fees, Rates & Features Compared`,
      description: `Compare ${pair.a.name} and ${pair.b.name} side by side. See which offers better exchange rates, lower fees, and faster transfers.`,
      url: `https://moneytransfers.com/compare/${slug}`,
    },
  };
}

// ── Article-rich comparison page ──

function ArticleComparison({
  slug,
  a,
  b,
}: {
  slug: string;
  a: (typeof providers)[number];
  b: (typeof providers)[number];
}) {
  const article = getComparisonArticle(slug)!;

  // Generate sample quotes across multiple corridors
  const sampleCorridors = [
    { from: "USD", to: "INR", label: "USD → INR", amount: 1000, symbol: "₹" },
    { from: "GBP", to: "EUR", label: "GBP → EUR", amount: 1000, symbol: "€" },
    { from: "USD", to: "PHP", label: "USD → PHP", amount: 500, symbol: "₱" },
    { from: "USD", to: "MXN", label: "USD → MXN", amount: 1000, symbol: "MX$" },
  ];

  const corridorQuotes = sampleCorridors.map((c) => {
    const quotes = generateQuotes(c.amount, c.from, c.to);
    return {
      ...c,
      quoteA: quotes.find((q) => q.providerSlug === a.slug),
      quoteB: quotes.find((q) => q.providerSlug === b.slug),
    };
  });

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.metaDescription,
            dateModified: article.updatedAt,
            author: { "@type": "Organization", name: "MoneyTransfers" },
            publisher: { "@type": "Organization", name: "MoneyTransfers" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://moneytransfers.com" },
              { "@type": "ListItem", position: 2, name: "Compare", item: "https://moneytransfers.com/compare" },
              { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: `https://moneytransfers.com/compare/${slug}` },
            ],
          }),
        }}
      />

      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
          <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
          {" / "}
          <Link href="/compare" className="hover:text-[var(--color-primary)]">Compare</Link>
          {" / "}
          <span className="text-[var(--color-on-surface)]">{a.name} vs {b.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8">
              <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2.5 py-1 rounded-full">
                Comparison
              </span>
              <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mt-4 mb-3 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-[var(--color-on-surface-variant)]">
                <span>MoneyTransfers Editorial</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                <time dateTime={article.updatedAt}>
                  Updated{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span className="w-1 h-1 rounded-full bg-[var(--color-outline)]" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Provider summary cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[a, b].map((provider) => (
                <Card key={provider.slug}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <Image src={provider.logo} alt={provider.name} width={56} height={56} className="object-cover" />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-medium text-[var(--color-on-surface)]">{provider.name}</h2>
                      <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                    </div>
                  </div>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">{provider.description}</p>
                  <div className="flex gap-4 text-[12px] text-[var(--color-on-surface-variant)]">
                    <span>{provider.supportedCountries}+ countries</span>
                    <span>{provider.supportedCurrencies}+ currencies</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Introduction */}
            <p className="text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
              {article.intro}
            </p>

            {/* Table of Contents */}
            <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 mb-8">
              <h2 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-3">In this article</h2>
              <ol className="space-y-1.5">
                {article.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-[13px] text-[var(--color-primary)] hover:underline">
                      {section.heading}
                    </a>
                  </li>
                ))}
                <li><a href="#summary-table" className="text-[13px] text-[var(--color-primary)] hover:underline">Summary table</a></li>
                <li><a href="#verdict" className="text-[13px] text-[var(--color-primary)] hover:underline">Verdict</a></li>
                <li><a href="#faqs" className="text-[13px] text-[var(--color-primary)] hover:underline">Frequently asked questions</a></li>
              </ol>
            </div>

            {/* Live quote comparison across corridors */}
            <div className="bg-[var(--color-primary-surface)] rounded-xl p-6 mb-8">
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">
                Live comparison: {a.name} vs {b.name} across popular corridors
              </h3>
              <div className="bg-white rounded-lg overflow-hidden border border-[var(--color-outline)]">
                <table className="w-full text-[13px]">
                  <thead className="bg-[var(--color-surface-dim)] border-b border-[var(--color-outline)]">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">Corridor</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">{a.name}</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">{b.name}</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline)]">
                    {corridorQuotes.map((c) => {
                      const amtA = c.quoteA?.receiveAmount;
                      const amtB = c.quoteB?.receiveAmount;
                      const winner =
                        amtA && amtB ? (amtA > amtB ? a.name : amtB > amtA ? b.name : "Tie") : "N/A";
                      const winnerColor =
                        winner === a.name ? "text-[#137333]" : winner === b.name ? "text-[#137333]" : "text-[var(--color-on-surface-variant)]";

                      return (
                        <tr key={c.label}>
                          <td className="px-4 py-2.5 text-[var(--color-on-surface)]">
                            {c.label}
                            <span className="text-[11px] text-[var(--color-on-surface-variant)] ml-1">
                              ({c.from === "GBP" ? "£" : "$"}{c.amount.toLocaleString()})
                            </span>
                          </td>
                          <td className={`px-4 py-2.5 text-right tabular-nums ${amtA && amtB && amtA >= amtB ? "font-medium text-[#137333]" : "text-[var(--color-on-surface)]"}`}>
                            {amtA ? `${c.symbol}${amtA.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                          </td>
                          <td className={`px-4 py-2.5 text-right tabular-nums ${amtA && amtB && amtB > amtA ? "font-medium text-[#137333]" : "text-[var(--color-on-surface)]"}`}>
                            {amtB ? `${c.symbol}${amtB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                          </td>
                          <td className={`px-4 py-2.5 text-right font-medium ${winnerColor}`}>
                            {winner}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-2">
                Amounts shown are what the recipient receives. Based on current scraped data, updated every 6 hours.
              </p>
            </div>

            {/* Article sections */}
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-10">
                <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                  {section.heading}
                </h2>
                <div
                  className="prose-custom text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}

            {/* Summary Table */}
            <section id="summary-table" className="mb-10">
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                {a.name} vs {b.name}: Summary table
              </h2>
              <ComparisonTable headers={["Feature", a.name, b.name]}>
                {[
                  { label: "Overall rating", va: `${a.rating.toFixed(1)}/5 (${a.ratingLabel})`, vb: `${b.rating.toFixed(1)}/5 (${b.ratingLabel})`, w: a.rating > b.rating ? "a" : a.rating < b.rating ? "b" : "tie" },
                  { label: "Fee structure", va: a.feeStructure, vb: b.feeStructure, w: "tie" },
                  { label: "Exchange rate markup", va: a.exchangeRateMarkup, vb: b.exchangeRateMarkup, w: a.exchangeRateMarkup.includes("0%") ? "a" : "tie" },
                  { label: "Transfer speed", va: a.transferSpeed, vb: b.transferSpeed, w: "tie" },
                  { label: "Supported countries", va: `${a.supportedCountries}+`, vb: `${b.supportedCountries}+`, w: a.supportedCountries > b.supportedCountries ? "a" : b.supportedCountries > a.supportedCountries ? "b" : "tie" },
                  { label: "Supported currencies", va: `${a.supportedCurrencies}+`, vb: `${b.supportedCurrencies}+`, w: a.supportedCurrencies > b.supportedCurrencies ? "a" : b.supportedCurrencies > a.supportedCurrencies ? "b" : "tie" },
                  { label: "Max transfer", va: a.maxTransfer ? `$${(a.maxTransfer).toLocaleString()}` : "No limit", vb: b.maxTransfer ? `$${(b.maxTransfer).toLocaleString()}` : "No limit", w: (a.maxTransfer || Infinity) > (b.maxTransfer || Infinity) ? "a" : (b.maxTransfer || Infinity) > (a.maxTransfer || Infinity) ? "b" : "tie" },
                  { label: "Payment methods", va: a.paymentMethods.join(", "), vb: b.paymentMethods.join(", "), w: a.paymentMethods.length > b.paymentMethods.length ? "a" : b.paymentMethods.length > a.paymentMethods.length ? "b" : "tie" },
                  { label: "Delivery methods", va: a.deliveryMethods.join(", "), vb: b.deliveryMethods.join(", "), w: a.deliveryMethods.length > b.deliveryMethods.length ? "a" : b.deliveryMethods.length > a.deliveryMethods.length ? "b" : "tie" },
                  { label: "Regulators", va: a.regulators.join(", "), vb: b.regulators.join(", "), w: "tie" },
                  { label: "Founded", va: String(a.founded), vb: String(b.founded), w: "tie" },
                  { label: "Best for", va: "Large transfers, transparency, business", vb: "Small remittances, speed, cash pickup", w: "tie" },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)] font-medium">{row.label}</td>
                    <td className={`px-4 py-3 text-[14px] ${row.w === "a" ? "font-medium text-[#137333]" : "text-[var(--color-on-surface)]"}`}>
                      {row.va}
                    </td>
                    <td className={`px-4 py-3 text-[14px] ${row.w === "b" ? "font-medium text-[#137333]" : "text-[var(--color-on-surface)]"}`}>
                      {row.vb}
                    </td>
                  </tr>
                ))}
              </ComparisonTable>
            </section>

            {/* Pros / Cons */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[a, b].map((provider) => (
                <div key={provider.slug} className="space-y-4">
                  <h3 className="text-[16px] font-medium text-[var(--color-on-surface)]">{provider.name}</h3>
                  <ProsConsList type="pros" items={provider.pros} />
                  <ProsConsList type="cons" items={provider.cons} />
                </div>
              ))}
            </div>

            {/* Verdict */}
            <section id="verdict" className="mb-10">
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Verdict: {a.name} or {b.name}?
              </h2>
              <div className="space-y-4 mb-6">
                <div className="bg-[#e6f4ea] border border-[#137333]/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={providers.find((p) => p.slug === article.verdict.largeTransfers.winner)?.logo || "/logos/placeholder.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-[15px] font-medium text-[#137333]">
                      Best for large transfers: {providers.find((p) => p.slug === article.verdict.largeTransfers.winner)?.name}
                    </h3>
                  </div>
                  <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                    {article.verdict.largeTransfers.explanation}
                  </p>
                </div>
                <div className="bg-[#e8f0fe] border border-[#1a73e8]/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={providers.find((p) => p.slug === article.verdict.smallTransfers.winner)?.logo || "/logos/placeholder.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-[15px] font-medium text-[#1a73e8]">
                      Best for small remittances: {providers.find((p) => p.slug === article.verdict.smallTransfers.winner)?.name}
                    </h3>
                  </div>
                  <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                    {article.verdict.smallTransfers.explanation}
                  </p>
                </div>
              </div>
              <p className="text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed">
                {article.verdict.overall}
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-10">
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-6">
                Frequently asked questions
              </h2>
              <div className="divide-y divide-[var(--color-outline)]">
                {article.faqs.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-[15px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                      {faq.q}
                      <svg
                        className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
              <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare rates for your transfer</h3>
              <ComparisonWidget compact />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[300px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Quick links */}
              {[a, b].map((provider) => (
                <Card key={provider.slug} className="!p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <Image src={provider.logo} alt={provider.name} width={56} height={56} className="object-cover" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{provider.name}</p>
                      <RatingBadge rating={provider.rating} label={provider.ratingLabel} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/companies/${provider.slug}`}
                      className="text-[12px] text-[var(--color-primary)] font-medium hover:underline"
                    >
                      Full review
                    </Link>
                    <span className="text-[var(--color-outline)]">|</span>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-[12px] text-[var(--color-primary)] font-medium hover:underline"
                    >
                      Visit site
                    </a>
                  </div>
                </Card>
              ))}

              {/* CTA */}
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#3a5ba6] rounded-xl p-5 text-white">
                <h3 className="text-[15px] font-medium mb-2">Compare All Providers</h3>
                <p className="text-[13px] text-white/80 mb-4">
                  See how {a.name} and {b.name} stack up against 60+ other providers.
                </p>
                <Link
                  href="/send-money"
                  className="block text-center bg-white text-[var(--color-primary)] px-4 py-2.5 rounded-full text-[13px] font-medium hover:bg-[var(--color-primary-surface)] transition-colors"
                >
                  Compare Rates
                </Link>
              </div>

              {/* Explore more */}
              <Card className="!p-4">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-3">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/send-money/usa-to-india" className="text-[13px] text-[var(--color-primary)] hover:underline">USA to India transfers</Link></li>
                  <li><Link href="/send-money/usa-to-pakistan" className="text-[13px] text-[var(--color-primary)] hover:underline">USA to Pakistan transfers</Link></li>
                  <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-[13px] text-[var(--color-primary)] hover:underline">Cheapest way to send money</Link></li>
                  <li><Link href="/guides" className="text-[13px] text-[var(--color-primary)] hover:underline">All guides</Link></li>
                </ul>
              </Card>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

// ── Default (auto-generated) comparison page ──

function DefaultComparison({
  a,
  b,
}: {
  a: (typeof providers)[number];
  b: (typeof providers)[number];
}) {
  const quotesA = generateQuotes(1000, "USD", "INR").find((q) => q.providerSlug === a.slug);
  const quotesB = generateQuotes(1000, "USD", "INR").find((q) => q.providerSlug === b.slug);

  const comparisonRows = [
    { label: "Rating", valueA: `${a.rating.toFixed(1)}/5 (${a.ratingLabel})`, valueB: `${b.rating.toFixed(1)}/5 (${b.ratingLabel})`, winner: a.rating > b.rating ? "a" : a.rating < b.rating ? "b" : "tie" },
    { label: "Fee Structure", valueA: a.feeStructure, valueB: b.feeStructure, winner: "tie" as const },
    { label: "Exchange Rate Markup", valueA: a.exchangeRateMarkup, valueB: b.exchangeRateMarkup, winner: "tie" as const },
    { label: "Transfer Speed", valueA: a.transferSpeed, valueB: b.transferSpeed, winner: "tie" as const },
    { label: "Countries", valueA: `${a.supportedCountries}+`, valueB: `${b.supportedCountries}+`, winner: a.supportedCountries > b.supportedCountries ? "a" : a.supportedCountries < b.supportedCountries ? "b" : "tie" },
    { label: "Currencies", valueA: `${a.supportedCurrencies}+`, valueB: `${b.supportedCurrencies}+`, winner: a.supportedCurrencies > b.supportedCurrencies ? "a" : a.supportedCurrencies < b.supportedCurrencies ? "b" : "tie" },
    { label: "Regulated", valueA: a.regulated ? "Yes" : "No", valueB: b.regulated ? "Yes" : "No", winner: "tie" as const },
    { label: "Founded", valueA: String(a.founded), valueB: String(b.founded), winner: "tie" as const },
    { label: "Payment Methods", valueA: a.paymentMethods.join(", "), valueB: b.paymentMethods.join(", "), winner: a.paymentMethods.length > b.paymentMethods.length ? "a" : a.paymentMethods.length < b.paymentMethods.length ? "b" : "tie" },
    { label: "Delivery Methods", valueA: a.deliveryMethods.join(", "), valueB: b.deliveryMethods.join(", "), winner: a.deliveryMethods.length > b.deliveryMethods.length ? "a" : a.deliveryMethods.length < b.deliveryMethods.length ? "b" : "tie" },
  ];

  return (
    <>
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://moneytransfers.com" },
              { "@type": "ListItem", position: 2, name: "Compare", item: "https://moneytransfers.com/compare" },
              { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: `https://moneytransfers.com/compare/${a.slug}-vs-${b.slug}` },
            ],
          }),
        }}
      />
    <Container className="py-8">
      <nav className="text-[13px] text-[var(--color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        {" / "}
        <Link href="/compare" className="hover:text-[var(--color-primary)]">Compare</Link>
        {" / "}
        <span className="text-[var(--color-on-surface)]">{a.name} vs {b.name}</span>
      </nav>

      <h1 className="text-[28px] md:text-[36px] font-normal text-[var(--color-on-surface)] mb-2">
        {a.name} vs {b.name}
      </h1>
      <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8">
        A detailed comparison of {a.name} and {b.name} — fees, exchange rates, speed, and features side by side.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[a, b].map((provider) => (
          <Card key={provider.slug}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image src={provider.logo} alt={provider.name} width={56} height={56} className="object-cover" />
              </div>
              <div>
                <h2 className="text-[16px] font-medium text-[var(--color-on-surface)]">{provider.name}</h2>
                <RatingBadge rating={provider.rating} label={provider.ratingLabel} size="md" />
              </div>
            </div>
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-4">{provider.description}</p>
            <div className="flex gap-3">
              <Link href={`/companies/${provider.slug}`} className="text-[13px] text-[var(--color-primary)] font-medium hover:underline">
                Full Review
              </Link>
              <PrimaryButton href={provider.website} external size="sm">Visit Site</PrimaryButton>
            </div>
          </Card>
        ))}
      </div>

      {quotesA && quotesB && (
        <div className="bg-[var(--color-primary-surface)] rounded-xl p-6 mb-8">
          <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-3">Sample Transfer: $1,000 USD → INR</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { provider: a, quote: quotesA },
              { provider: b, quote: quotesB },
            ].map(({ provider, quote }) => (
              <div key={provider.slug} className="bg-white rounded-lg p-4">
                <p className="text-[13px] text-[var(--color-on-surface-variant)]">{provider.name}</p>
                <p className="text-[18px] font-medium text-[var(--color-success)]">₹{quote.receiveAmount.toLocaleString()}</p>
                <p className="text-[12px] text-[var(--color-on-surface-variant)]">Fee: ${quote.fee.toFixed(2)} | Rate: {quote.exchangeRate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <ComparisonTable headers={["Feature", a.name, b.name]}>
          {comparisonRows.map((row) => (
            <tr key={row.label}>
              <td className="px-4 py-3 text-[14px] text-[var(--color-on-surface-variant)]">{row.label}</td>
              <td className={`px-4 py-3 text-[14px] ${row.winner === "a" ? "font-medium text-[var(--color-success)]" : "text-[var(--color-on-surface)]"}`}>
                {row.valueA} {row.winner === "a" && "✓"}
              </td>
              <td className={`px-4 py-3 text-[14px] ${row.winner === "b" ? "font-medium text-[var(--color-success)]" : "text-[var(--color-on-surface)]"}`}>
                {row.valueB} {row.winner === "b" && "✓"}
              </td>
            </tr>
          ))}
        </ComparisonTable>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[a, b].map((provider) => (
          <div key={provider.slug} className="space-y-4">
            <h3 className="text-[16px] font-medium text-[var(--color-on-surface)]">{provider.name}</h3>
            <ProsConsList type="pros" items={provider.pros} />
            <ProsConsList type="cons" items={provider.cons} />
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface-dim)] rounded-xl p-6 mb-8">
        <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-4">Compare rates for your transfer</h3>
        <ComparisonWidget compact />
      </div>

      {/* Cross-links */}
      <div className="pt-8 border-t border-[var(--color-outline)]">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Popular corridors</h3>
            <ul className="space-y-2">
              <li><Link href="/send-money/usa-to-india" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to India</Link></li>
              <li><Link href="/send-money/usa-to-pakistan" className="text-[14px] text-[var(--color-primary)] hover:underline">USA to Pakistan</Link></li>
              <li><Link href="/send-money/uk-to-europe" className="text-[14px] text-[var(--color-primary)] hover:underline">UK to Europe</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">More comparisons</h3>
            <ul className="space-y-2">
              <li><Link href="/compare" className="text-[14px] text-[var(--color-primary)] hover:underline">All comparisons</Link></li>
              <li><Link href="/companies" className="text-[14px] text-[var(--color-primary)] hover:underline">Provider reviews</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">Guides</h3>
            <ul className="space-y-2">
              <li><Link href="/guides/cheapest-way-to-send-money-internationally" className="text-[14px] text-[var(--color-primary)] hover:underline">Cheapest way to send money</Link></li>
              <li><Link href="/guides/exchange-rate-markup-explained" className="text-[14px] text-[var(--color-primary)] hover:underline">Exchange rates explained</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
    </>
  );
}

// ── Page component ──

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const pair = parseSlug(slug);
  if (!pair) notFound();

  const { a, b } = pair;
  const article = getComparisonArticle(slug);

  if (article) {
    return <ArticleComparison slug={slug} a={a} b={b} />;
  }

  return <DefaultComparison a={a} b={b} />;
}
