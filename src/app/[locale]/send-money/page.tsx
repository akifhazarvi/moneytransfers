import { seoDescription, seoTitle } from "@/lib/seo-title";
import type { Metadata } from "next";
import Container from "@/components/Container";
import SendMoneyClient from "@/components/SendMoneyClient";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageByline } from "@/components/PageByline";
import { faqSchema } from "@/lib/structured-data";
import { getAuthor } from "@/data/authors";
import {
  EXAMPLE, HUB_AUTHOR_SLUG, HUB_COPY_REVIEWED, HUB_REVIEWER_SLUG, getHubData, getHubFaqs, getRouteDirectory, money, utcLong,
} from "@/lib/send-money-hub";
import ExampleRouteTable from "@/components/send-money-hub/ExampleRouteTable";
import HubContent, { WorkedExample } from "@/components/send-money-hub/HubContent";
import RouteDirectory from "@/components/send-money-hub/RouteDirectory";

/**
 * /send-money — the comparison hub.
 *
 * Rebuilt for the round-3 freelance brief §4.4 (2026-10-08). Googlebot
 * re-crawled this page alone after the Sep 29 GSC validation and left it
 * "Crawled – currently not indexed": its static HTML showed the comparison as
 * "Loading…", held ~307 words of its own and 196 unique links, most of them to
 * pages noindexed for every engine, under an H1 close to the homepage's.
 *
 * Now, in order: the interactive form (selections stay client-side — never
 * SSR URL parameters, the page stays static and self-canonical); a
 * server-rendered top-5 table for one labelled example route; original text
 * whose figures come from that table's data; links to Google-eligible
 * country and route pages only (src/lib/send-money-hub.ts explains the list).
 *
 * Dates: "Updated" is HUB_COPY_REVIEWED, the last time a person changed or
 * checked the copy — bump it with the text. When the quotes were collected is
 * stated separately from the data, so the page no longer claims a daily edit.
 */

const H1 = "Send money abroad: compare providers by country";
const SITE = "https://sendmoneycompare.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sendMoney" });
  const title = seoTitle(H1, t("indexMetaTitle"));
  const description = seoDescription(t("indexMetaDescription"));
  return {
    title,
    description,
    alternates: getAlternates("send-money", locale),
    openGraph: {
      title,
      description,
      url: `${SITE}/send-money`,
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function SendMoneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = getHubData();
  const faqs = getHubFaqs(data);
  const directory = getRouteDirectory();
  const author = getAuthor(HUB_AUTHOR_SLUG);
  const reviewer = getAuthor(HUB_REVIEWER_SLUG);
  const exampleHeading = `Example route: sending ${data.sendSymbol}${money(EXAMPLE.amount, 0)} from the ${EXAMPLE.fromCountry} to ${EXAMPLE.toCountry}`;

  const person = (a: typeof author) => a && { "@type": "Person", name: a.name, url: `${SITE}/about/${a.slug}` };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/send-money#webpage`,
    url: `${SITE}/send-money`,
    name: H1,
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#organization` },
    author: person(author),
    reviewedBy: person(reviewer),
    lastReviewed: HUB_COPY_REVIEWED,
    dateModified: data.collectedAt,
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Country and route comparison pages",
    itemListElement: directory
      .flatMap((g) => [...(g.countryPage ? [g.countryPage] : []), ...g.routes])
      .map((link, i) => ({ "@type": "ListItem", position: i + 1, name: link.label, url: `${SITE}${link.href}` })),
  };

  return (
    <div className="bg-[var(--color-surface-dim)] min-h-screen pt-2">
      {[webPageSchema, itemListSchema, faqSchema(faqs)].map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <Container>
        <header className="conversion-hero conversion-hero--compare">
          <h1>{H1}</h1>
          <p>
            Pick the currency you pay in and the one your recipient receives. Each provider is priced on the same
            transfer, so the amount that arrives is the number to compare.
          </p>
        </header>
      </Container>

      {/* The interactive comparison stays on top; it answers the reader's own route. */}
      <SendMoneyClient />

      <Container className="py-6 space-y-2">
        <PageByline
          authorSlug={HUB_AUTHOR_SLUG}
          reviewerSlug={HUB_REVIEWER_SLUG}
          updated={HUB_COPY_REVIEWED}
          cadence={null}
        />
        <p className="text-2sm text-[var(--color-on-surface-variant)]">
          Provider quotes last collected{" "}
          <time dateTime={data.collectedAt}>{utcLong(data.collectedAt)}</time>
          {`; new quotes are collected about every ${data.refreshHours} hours.`}
        </p>
      </Container>

      <Container className="mb-12 space-y-6">
        <section aria-labelledby="example-route" className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-outline)] p-4 sm:p-6 md:p-8">
          <h2 id="example-route" className="text-xl font-medium text-[var(--color-on-surface)] mb-2">{exampleHeading}</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-5 max-w-3xl">
            A fixed example, not your search: the providers at the top of our ranking for US dollars sent into Indian
            rupees, the pair the form above opens on. Use the form for your own route and amount.
          </p>
          <ExampleRouteTable data={data} />
          <WorkedExample data={data} />
        </section>

        <HubContent faqs={faqs} />

        <RouteDirectory groups={directory} />
      </Container>
    </div>
  );
}
