import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { getAlternates } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: getAlternates("about", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/about",
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 md:text-h1 font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {t("heading")}
            </h1>
            <p className="text-md md:text-base text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              {t("subheading")}
            </p>
          </div>
        </Container>
      </section>

      {/* ─── OUR STORY ─── */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("ourStoryHeading")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("whatWeBelieveHeading")}
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
                    <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("howWeMakeMoneyHeading")}
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Our team
              </h2>
              <div className="space-y-4 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare is built and maintained by a small team with backgrounds
                  in fintech, product management, and data engineering. Our editorial content
                  is written by people who have personally used the providers we review.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold text-lg">AH</div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">Akif Hazarvi</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">Founder &amp; Editor</p>
                    </div>
                  </div>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Product manager with 8+ years in fintech and international payments.
                    Previously worked on cross-border payment products handling millions in
                    monthly volume. Oversees data methodology, provider reviews, and
                    editorial standards.
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center text-base font-medium text-[var(--color-primary)]">AI</div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">Awais Imran</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">Co-founder &amp; Technical Lead</p>
                    </div>
                  </div>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Software engineer specialising in data pipelines and automation.
                    Designed and maintains the scraping infrastructure that collects live
                    quotes from 60+ providers every 6 hours. Ensures data accuracy and
                    system reliability.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                Company details
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  SendMoneyCompare is operated from Denver, Colorado, United States. We are an
                  independent comparison platform — we are not a money transfer service
                  and do not hold or transmit funds.
                </p>
                <div className="bg-[var(--color-surface-dim)] rounded-xl p-5 mt-3">
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-2sm">
                    <div>
                      <dt className="text-[var(--color-on-surface-variant)]">Location</dt>
                      <dd className="text-[var(--color-on-surface)] font-medium mt-0.5">Denver, CO, United States</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--color-on-surface-variant)]">Founded</dt>
                      <dd className="text-[var(--color-on-surface)] font-medium mt-0.5">2024</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--color-on-surface-variant)]">Type</dt>
                      <dd className="text-[var(--color-on-surface)] font-medium mt-0.5">Independent comparison platform</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--color-on-surface-variant)]">Contact</dt>
                      <dd className="text-[var(--color-on-surface)] font-medium mt-0.5">akif@sendmoneycompare.com</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--color-on-surface-variant)]">Corrections</dt>
                      <dd className="text-[var(--color-on-surface)] font-medium mt-0.5">akif@sendmoneycompare.com</dd>
                    </div>
                  </dl>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)] mt-3">
                  SendMoneyCompare is not a money transfer service and does not hold, transmit, or process funds.
                  We are an information service that compares publicly available data from regulated financial providers.
                  All providers listed on our platform are licensed by at least one major financial authority (FCA, FinCEN, ASIC, or equivalent).
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-4">
                {t("getInTouchHeading")}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
