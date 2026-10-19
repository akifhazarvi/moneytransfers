import Container from "@/components/Container";
import PolicyLinks from "@/components/PolicyLinks";
import Link from "@/components/EligibleLink";
import { getAlternates } from "@/lib/i18n-metadata";
import { SITE_STATS } from "@/lib/site-stats";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Corrections & Updates — SendMoneyCompare",
    description:
      "A transparent log of corrections, data updates, and editorial changes made to SendMoneyCompare content. We believe in accountability and accuracy.",
    alternates: getAlternates("corrections", locale),
  };
}

// Newest first. Each entry is backed by the commit that made the change; a
// figure that was wrong is described, not repeated — quoting it would publish
// it again (and check:claims would count it).
const corrections = [
  {
    date: "2026-10-18",
    type: "Correction" as const,
    description:
      "Two guides still named Wise as the leader of our Provider Consistency Index after TapTap Send took the lead on 3 October, and one called TapTap Send's corridor count \"second only to Wise\" while printing a smaller one for Wise. Sentences naming the overall leader, or where a provider ranks, now read the index, so they change when the leader does. Our India guides also said Wise delivers the most rupees above $500, which our data does not show, and these pages stated Wise's no-markup pricing as our own finding; they now attribute it to Wise beside the markup we measure.",
    affectedPages: ["/guides/best-money-transfer-apps", "/guides/wise-vs-remitly-vs-xoom-vs-xe", "/guides/how-to-send-money-to-india-2026", "/guides/send-money-to-india-from-usa-guide"],
  },
  {
    date: "2026-10-18",
    type: "Correction" as const,
    description:
      "An automated content tool published changes to about 40 pages between 15 and 18 October without editorial review. We checked every one against our code, our data and primary sources and reverted or rewrote what was wrong: career details in an author biography and reach claims on our About page that nothing supports, contract and privacy terms we never adopted, a three-day response time for data corrections (ours is 24 hours), inaccurate descriptions of how we collect quotes, measure markups and order providers, and dashes and arrows that displayed as raw character codes.",
    affectedPages: ["/about/ahsan-mukhtar", "/about", "/terms", "/privacy-policy", "/contact", "/methodology", "/how-we-review", "/sendscore"],
  },
  {
    date: "2026-10-18",
    type: "Correction" as const,
    description:
      "HSBC Premier customers do not get the mid-market rate, as three comparison pages said. HSBC applies its own exchange rate, which it says includes a currency conversion charge, on every account tier; Premier waives the £5 international payment fee. Separately, ACE Money Transfer is not regulated by FinCEN: its own company profile names the FCA, the Central Bank of Ireland, AUSTRAC and FINTRAC.",
    affectedPages: ["/compare/hsbc-vs-paypal", "/compare/revolut-vs-hsbc", "/compare/chase-vs-hsbc", "/companies/ace-money-transfer"],
  },
  {
    date: "2026-10-16",
    type: "Correction" as const,
    description:
      "The homepage FAQ quoted bank and transfer-service costs that had been typed by hand, and our own quotes contradicted them. Those answers now read the medians from our bank-versus-app comparison, so they move with the data.",
    affectedPages: ["/"],
  },
  {
    date: "2026-10-09",
    type: "Correction" as const,
    description:
      "6% of the delivery times shown in our comparison were a default of one to three business days that no provider had published. Where a provider publishes no delivery time, the comparison now says so.",
    affectedPages: ["/send-money"],
  },
  {
    date: "2026-10-09",
    type: "Correction" as const,
    description:
      "Corridor pages comparing only two providers called themselves the cheapest or best way to send. A page now needs three priced providers before its title makes that claim.",
    affectedPages: ["/send-money/aud-to-bdt"],
  },
  {
    date: "2026-10-05",
    type: "Correction" as const,
    description:
      "We checked all 31 news items quote by quote and figure by figure against their sources. 25 were corrected, one was merged into another, and seven were withdrawn, including a Western Union story whose quotes did not appear in its source. Withdrawn items now return a 410 (gone) status.",
    affectedPages: ["/news"],
  },
  {
    date: "2026-10-03",
    type: "Correction" as const,
    description:
      "Wise was shown at the mid-market rate with no fee on routes from the UAE, Saudi Arabia, Kuwait, Qatar, Oman and Bahrain, including Saudi Arabia to India. Wise does not accept those currencies as a source, and the rows were placeholders stored when its quote service returned nothing. They were removed, and 45 passages that named Wise or other providers on Gulf routes were rewritten to what each provider's own service accepted.",
    affectedPages: ["/send-money/saudi-arabia-to-india", "/send-money/uae-to-india"],
  },
  {
    date: "2026-09-29",
    type: "Correction" as const,
    description:
      "TapTap Send's flat fees were being read as zero on 38 currency pairs, which overstated its payouts and credited it with leading USD, CAD, GBP and EUR to INR and USD to THB. With the fee included, TapTap leads 47 corridors rather than 52; past figures were restated.",
    affectedPages: ["/send-money/usa-to-india", "/provider-consistency"],
  },
  {
    date: "2026-09-29",
    type: "Correction" as const,
    description:
      "At $200 and $5,000, our Wise quotes came from a gap-filling source that stamps one all-in estimate across every amount, so 257 of 524 Wise prices showed a rate markup Wise does not charge. That source now only fills gaps for providers no better source quotes on the route.",
    affectedPages: ["/send-money"],
  },
  {
    date: "2026-09-29",
    type: "Correction" as const,
    description:
      "About 30 passages said Brexit took the UK out of SEPA. The European Payments Council kept the UK in SEPA's scope in 2019 as a non-EEA member, so a euro payment needs the BIC and the payer's address. The same pass corrected SEPA's size (41 countries and territories, not 36) and the year Croatia joined (2013).",
    affectedPages: ["/guides/*", "/iban/*"],
  },
  {
    date: "2026-09-27",
    type: "Correction" as const,
    description:
      "About 120 SWIFT codes in content written in March could not exist: spliced letters, the wrong country letters, or the wrong length. 44 were replaced with the code our SWIFT directory holds for that bank and the rest removed rather than guessed. Every build now checks codes for these faults.",
    affectedPages: ["/swift-codes/*", "/guides/*"],
  },
  {
    date: "2026-09-27",
    type: "Correction" as const,
    description:
      "Our rate history priced Ria at its first-transfer promotional rate, which made Ria the day's best payout on 46 corridors and put it at the top of our consistency index. Its record of leading USD to INR on 73 of 91 days was that promotion. History now uses the same standard rates and quality checks as the live comparison.",
    affectedPages: ["/provider-consistency", "/research"],
  },
  {
    date: "2026-09-07",
    type: "Correction" as const,
    description:
      "A guide titled as ranked by cost placed SoFi first with a score out of ten, although we had never priced SoFi. All eight scores were removed, since no method on this site produces them, and SoFi's entry now says it is not in our measured data.",
    affectedPages: ["/guides/best-money-transfer-services"],
  },
  {
    date: "2026-09-05",
    type: "Correction" as const,
    description:
      "Our guide to sending money abroad overstated how much cheaper transfer services are than banks and understated what PayPal costs. Its figures were replaced with measurements from 1,518 live quotes across 98 corridors.",
    affectedPages: ["/guides/how-to-send-money-abroad"],
  },
  {
    date: "2026-03-17",
    type: "Data update" as const,
    description:
      "Updated provider reviews for Remitly, OFX, XE, Western Union, and Revolut with current fee ranges, exchange rate data, and delivery speed information. Added 'How we tested' methodology sections to all editorial reviews.",
    affectedPages: ["/companies/remitly", "/companies/ofx", "/companies/xe", "/companies/western-union", "/companies/revolut"],
  },
  {
    date: "2026-03-17",
    type: "Content update" as const,
    description:
      "Expanded FAQ answers on top 6 corridor landing pages (USA→India, USA→Pakistan, USA→Philippines, USA→Mexico, UK→India, UK→Europe) from ~50 words to 134–170 words per answer for improved depth and accuracy.",
    affectedPages: ["/send-money/usa-to-india", "/send-money/usa-to-pakistan", "/send-money/usa-to-philippines", "/send-money/usa-to-mexico", "/send-money/uk-to-india", "/send-money/usa-to-europe"],
  },
  {
    date: "2026-03-17",
    type: "Correction" as const,
    description:
      "Fixed schema.org structured data: changed author type from Organization to Person across all article pages, replaced deprecated Product schema with FinancialService for provider pages, and added missing datePublished fields to Article schemas.",
    affectedPages: ["/companies/*", "/guides/*", "/compare/*"],
  },
  {
    date: "2026-03-14",
    type: "Data update" as const,
    description:
      "Published Wise editorial review based on 12 test transfers across 6 corridors. All fee ranges and exchange rate data verified against live quotes.",
    affectedPages: ["/companies/wise"],
  },
  {
    date: "2026-03-13",
    type: "Content update" as const,
    description:
      "Updated all blog post author attributions from 'SendMoneyCompare Team' to individual author names for improved E-E-A-T compliance.",
    affectedPages: ["/guides/*"],
  },
];

const typeColors: Record<string, string> = {
  Correction: "text-[#c5221f] bg-red-50 dark:bg-red-900/20",
  "Data update": "text-[var(--color-primary)] bg-[var(--color-primary-surface)]",
  "Content update": "text-[var(--color-success-dark)] bg-[var(--color-success-surface)]",
};

export default async function CorrectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              Corrections & Updates
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              We are committed to accuracy and transparency. This page documents corrections, data updates,
              and significant editorial changes made to our content. If you spot an error, please email{" "}
              <a href="mailto:info@sendmoneycompare.com" className="text-[var(--color-primary)] hover:underline">
                info@sendmoneycompare.com
              </a>.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {corrections.map((item, i) => (
                <div key={i} className="border border-[var(--color-outline)] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <time className="text-2sm font-medium text-[var(--color-on-surface)]">{item.date}</time>
                    <span className={`text-2xs font-medium px-2 py-0.5 rounded-full ${typeColors[item.type] || ""}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.affectedPages.map((page) =>
                      // A wildcard names a page family, not a page: a label, never a link.
                      page.includes("*") ? (
                        <span
                          key={page}
                          className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] px-2.5 py-1 rounded-full"
                        >
                          {page}
                        </span>
                      ) : (
                        <Link
                          key={page}
                          href={page}
                          className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] px-2.5 py-1 rounded-full hover:text-[var(--color-primary)]"
                        >
                          {page}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 bg-[var(--color-surface-dim)] rounded-xl">
              <h2 className="text-base font-medium text-[var(--color-on-surface)] mb-2">Our corrections policy</h2>
              <div className="space-y-2 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  When we identify an error in our content — whether factual, numerical, or contextual — we correct
                  it promptly and document the change here. We do not silently edit published content.
                </p>
                <p>
                  We distinguish three types of change. A <strong className="text-[var(--color-on-surface)]">Correction</strong> fixes
                  a factual error: a wrong fee, a misattributed provider feature, or an inaccurate claim about a regulation or
                  service. A <strong className="text-[var(--color-on-surface)]">Data update</strong> reflects new information
                  we have gathered — for example, after running fresh test transfers or when a provider announces a fee change.
                  A <strong className="text-[var(--color-on-surface)]">Content update</strong> improves the depth, clarity, or
                  accuracy of editorial text without correcting a specific factual error.
                </p>
                <p>
                  Routine exchange rate and quote data refreshes from our automated scraping system occur every{" "}
                  {SITE_STATS.refreshHours} hours and are not individually logged here — only changes to editorial content and provider reviews appear
                  in this log.
                </p>
                <p>
                  To report an error or suggest a correction, email{" "}
                  <a href="mailto:info@sendmoneycompare.com" className="text-[var(--color-primary)] hover:underline">
                    info@sendmoneycompare.com
                  </a>{" "}
                  with the page URL and details of the issue.
                </p>
              </div>
            </div>
          </div>
          <PolicyLinks current="/corrections" />
        </Container>
      </section>
    </>
  );
}
