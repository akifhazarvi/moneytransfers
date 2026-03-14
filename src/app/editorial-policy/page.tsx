import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy — How We Stay Independent & Unbiased",
  description:
    "Our editorial policy explains how MoneyTransfers maintains independence, how affiliate partnerships work, and why our rankings are never influenced by commercial relationships.",
  alternates: { canonical: "https://moneytransfers.com/editorial-policy" },
  openGraph: {
    title: "Editorial Policy — MoneyTransfers Independence & Transparency",
    description:
      "How MoneyTransfers maintains editorial independence. Rankings are never influenced by affiliate partnerships.",
    url: "https://moneytransfers.com/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              Editorial Policy
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              How we keep our comparisons honest, our reviews independent, and
              our recommendations trustworthy.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Editorial independence
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  Our editorial team operates independently from our commercial
                  partnerships. No provider can pay for a higher ranking, a more
                  favourable review, or preferential placement in our comparison
                  tables. This separation is the foundation of everything we
                  publish.
                </p>
                <p>
                  Rankings on MoneyTransfers are determined by a single metric:
                  which provider delivers the most money to your recipient for a
                  given corridor and amount. This calculation accounts for both
                  the exchange rate markup and the transfer fee — the two
                  components that make up the total cost of a transfer.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                How affiliate partnerships work
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  MoneyTransfers is free for consumers. We earn revenue through
                  affiliate partnerships with some of the providers we list.
                  When you click a link to a provider on our site and complete a
                  transfer, we may receive a referral commission from that
                  provider.
                </p>
                <p>
                  Not all providers we list have an affiliate relationship with
                  us. We include providers regardless of whether they pay us,
                  because our goal is to show you every available option for your
                  transfer. A provider with no commercial relationship will rank
                  above an affiliate partner if it offers a better deal.
                </p>
                <p>
                  Affiliate commissions fund our operations — including data
                  collection, engineering, editorial research, and server costs —
                  so we can continue offering the comparison service for free.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Disclosure standards
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  We believe in full transparency about how we make money. You
                  will find affiliate disclosures:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    At the top of comparison pages, explaining that we may earn
                    a commission when you visit a provider through our links
                  </li>
                  <li>
                    In the footer of every page on the site
                  </li>
                  <li>
                    On this page, where we explain the full details of how our
                    commercial model works
                  </li>
                </ul>
                <p>
                  We never disguise affiliate links as organic content, and we
                  always make it clear when a link will take you to a
                  provider&apos;s website.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Content guidelines
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  All content published on MoneyTransfers follows these
                  principles:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Accuracy:</strong> Claims about fees, exchange
                    rates, transfer speeds, and supported countries are based on
                    data collected directly from provider APIs or websites, not
                    marketing materials.
                  </li>
                  <li>
                    <strong>Fairness:</strong> Reviews present both strengths
                    and weaknesses of every provider. We do not write
                    promotional content disguised as editorial.
                  </li>
                  <li>
                    <strong>Timeliness:</strong> Quote data is refreshed every 6
                    hours. Provider reviews are updated when we detect material
                    changes to a provider&apos;s fees, features, or regulatory status.
                  </li>
                  <li>
                    <strong>Corrections:</strong> If we publish something
                    inaccurate, we correct it promptly and transparently. If you
                    spot an error, please{" "}
                    <Link
                      href="/contact"
                      className="text-[var(--color-primary)] hover:underline"
                    >
                      contact us
                    </Link>
                    .
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                What we don&apos;t do
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    We never accept payment to rank a provider higher than the
                    data supports
                  </li>
                  <li>
                    We never publish sponsored content labelled as editorial
                    reviews
                  </li>
                  <li>
                    We never suppress negative findings about a provider that
                    has an affiliate relationship with us
                  </li>
                  <li>
                    We never recommend a provider solely because it pays us a
                    higher commission
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <strong className="text-[var(--color-on-surface)]">
                  Questions about our editorial standards?
                </strong>{" "}
                We welcome scrutiny. If you have concerns about the accuracy or
                independence of our content, please{" "}
                <Link
                  href="/contact"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  get in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
