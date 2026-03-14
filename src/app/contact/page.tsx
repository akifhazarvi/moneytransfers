import Container from "@/components/Container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch with MoneyTransfers",
  description:
    "Have a question, correction, or partnership inquiry? Contact the MoneyTransfers team. We typically respond within 1–2 business days.",
  alternates: { canonical: "https://moneytransfers.com/contact" },
  openGraph: {
    title: "Contact MoneyTransfers",
    description:
      "Get in touch with the MoneyTransfers team for questions, data corrections, or partnership inquiries.",
    url: "https://moneytransfers.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[var(--color-surface)] pt-10 pb-8 border-b border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-[32px] md:text-[44px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              Contact Us
            </h1>
            <p className="text-[15px] md:text-[16px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">
              Have a question, spotted an error, or want to work with us?
              We&apos;d love to hear from you.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
                  General inquiries
                </h2>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  Questions about our comparison tools, data, or content.
                </p>
                <a
                  href="mailto:hello@moneytransfers.com"
                  className="text-[14px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  hello@moneytransfers.com
                </a>
              </div>

              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
                  Data corrections
                </h2>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  Found an inaccuracy in our rates, fees, or provider details?
                </p>
                <a
                  href="mailto:corrections@moneytransfers.com"
                  className="text-[14px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  corrections@moneytransfers.com
                </a>
              </div>

              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
                  Partnership inquiries
                </h2>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  Are you a money transfer provider looking to be listed or
                  update your information?
                </p>
                <a
                  href="mailto:partners@moneytransfers.com"
                  className="text-[14px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  partners@moneytransfers.com
                </a>
              </div>

              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" />
                  </svg>
                </div>
                <h2 className="text-[15px] font-medium text-[var(--color-on-surface)] mb-2">
                  Press & media
                </h2>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  Journalist or researcher looking for data or expert comment?
                </p>
                <a
                  href="mailto:press@moneytransfers.com"
                  className="text-[14px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  press@moneytransfers.com
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Response times
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                We aim to respond to all inquiries within 1–2 business days.
                Data correction reports are prioritised and typically addressed
                within 24 hours.
              </p>
            </div>

            <div>
              <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-4">
                Important note
              </h2>
              <div className="bg-[var(--color-surface-dim)] rounded-xl p-6">
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  <strong className="text-[var(--color-on-surface)]">
                    MoneyTransfers is a comparison platform, not a money
                    transfer provider.
                  </strong>{" "}
                  We do not process transfers, hold funds, or have access to
                  your accounts with any provider. If you need help with a
                  specific transfer, please contact your provider directly. You
                  can find contact details on each{" "}
                  <Link
                    href="/companies"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    provider&apos;s review page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
