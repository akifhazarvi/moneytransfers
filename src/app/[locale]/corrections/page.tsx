import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Corrections & Updates — SendMoneyCompare",
  description:
    "A transparent log of corrections, data updates, and editorial changes made to SendMoneyCompare content. We believe in accountability and accuracy.",
  alternates: { canonical: "https://sendmoneycompare.com/corrections" },
};

const corrections = [
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
    affectedPages: ["/send-money/usa-to-india", "/send-money/usa-to-pakistan", "/send-money/usa-to-philippines", "/send-money/usa-to-mexico", "/send-money/uk-to-india", "/send-money/uk-to-europe"],
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
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              Corrections & Updates
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              We are committed to accuracy and transparency. This page documents corrections, data updates,
              and significant editorial changes made to our content. If you spot an error, please email{" "}
              <a href="mailto:corrections@sendmoneycompare.com" className="text-[var(--color-primary)] hover:underline">
                corrections@sendmoneycompare.com
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
                    <time className="text-[13px] font-medium text-[var(--color-on-surface)]">{item.date}</time>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${typeColors[item.type] || ""}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.affectedPages.map((page) => (
                      <Link
                        key={page}
                        href={page.includes("*") ? "#" : page}
                        className={`text-[12px] text-[var(--color-on-surface-variant)] bg-[var(--color-surface-dim)] px-2.5 py-1 rounded-full ${page.includes("*") ? "cursor-default" : "hover:text-[var(--color-primary)]"}`}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 bg-[var(--color-surface-dim)] rounded-xl">
              <h2 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-2">Our corrections policy</h2>
              <div className="space-y-2 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  When we identify an error in our content — whether factual, numerical, or contextual — we correct
                  it promptly and document the change here. We do not silently edit published content.
                </p>
                <p>
                  Data corrections (exchange rates, fees, provider details) are logged when they affect the accuracy
                  of our editorial content. Routine data updates from our automated scraping system occur every 6 hours
                  and are not individually logged here.
                </p>
                <p>
                  To report an error or suggest a correction, email{" "}
                  <a href="mailto:corrections@sendmoneycompare.com" className="text-[var(--color-primary)] hover:underline">
                    corrections@sendmoneycompare.com
                  </a>{" "}
                  with the page URL and details of the issue.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
