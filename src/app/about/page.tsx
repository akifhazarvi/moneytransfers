import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Who We Are & Why We Built SendMoneyCompare",
  description:
    "SendMoneyCompare is an independent comparison platform that helps people find the cheapest way to send money internationally. Learn about our mission, team, and values.",
  alternates: { canonical: "https://sendmoneycompare.com/about" },
  openGraph: {
    title: "About SendMoneyCompare — Independent Money Transfer Comparison",
    description:
      "We compare 60+ money transfer services so you can find the cheapest way to send money internationally.",
    url: "https://sendmoneycompare.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              About SendMoneyCompare
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              We&apos;re an independent comparison platform on a simple mission: help
              people stop overpaying on international money transfers.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── OUR STORY ─── */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Our story
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare was born out of a personal frustration. Sending money to
                  family overseas, we discovered that banks were quietly adding 3–5% markups
                  on exchange rates — on top of flat wire fees. A $1,000 transfer could cost
                  $50+ in hidden charges, and there was no easy way to compare alternatives
                  side by side.
                </p>
                <p>
                  We built the comparison tool we wished existed: one that pulls real-time
                  exchange rates and fees from 60+ providers, calculates exactly how much
                  your recipient receives, and ranks providers by who delivers the most
                  money. No sponsored placements, no hidden agendas — just transparent data.
                </p>
                <p>
                  Today, SendMoneyCompare covers 64 currency corridors, publishes in-depth
                  provider reviews, and updates quote data every 6 hours. Millions of
                  people use comparison sites like ours to make smarter decisions about
                  international transfers every year.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                What we believe
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Transparency first",
                    desc: "Every ranking on our site is based on who gives your recipient the most money. No provider can pay for a higher position.",
                  },
                  {
                    title: "Real data, not estimates",
                    desc: "We collect live quotes from provider APIs and websites every 6 hours. You see the same rates you'd get going directly to the provider.",
                  },
                  {
                    title: "Regulated providers only",
                    desc: "Every provider we list is licensed by at least one major financial authority — FCA, FinCEN, ASIC, or equivalent.",
                  },
                  {
                    title: "Free for consumers",
                    desc: "Our comparison tools are completely free. We earn revenue through affiliate partnerships, which never influence our rankings.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-[var(--color-surface-dim)] rounded-xl p-5"
                  >
                    <h3 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                How we make money
              </h2>
              <div className="space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare is free for consumers. We earn revenue when you click
                  through to a provider and complete a transfer — this is called an
                  affiliate commission. Some providers pay us a referral fee; others
                  don&apos;t.
                </p>
                <p>
                  Crucially, affiliate relationships never affect our rankings. Providers
                  are always sorted by who gives your recipient the most money for a given
                  transfer. A provider that pays us zero commission will still rank #1 if
                  it delivers the best deal. You can read the full details in our{" "}
                  <Link
                    href="/editorial-policy"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Editorial Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Get in touch
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                Have a question, suggestion, or correction? We&apos;d love to hear from
                you. Visit our{" "}
                <Link
                  href="/contact"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Contact page
                </Link>{" "}
                to reach the team.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
