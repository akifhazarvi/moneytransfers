import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Banknote,
  CreditCard,
  Landmark,
  Smartphone,
  Plane,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plug,
  Wallet,
  MapPin,
  Languages,
  Phone,
  Sun,
  Trophy,
} from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Container from "@/components/Container";
import Card from "@/components/Card";
import CircleFlag from "@/components/CircleFlag";
import TravelConverter from "@/components/TravelConverter";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { getTravelGuide, getAllTravelGuideSlugs } from "@/data/travel-guides";
import { getEsimPlans } from "@/data/esim-plans";
import { getAuthor } from "@/data/authors";
import { getAlternates } from "@/lib/i18n-metadata";

export const revalidate = 86400; // 24h — content is editorial, not live

/** Map banknote color descriptor to a bg/foreground/border palette for the visual card. */
function noteColorTone(color: string): { bg: string; fg: string; border: string } {
  const key = color.toLowerCase();
  if (key.includes("green")) return { bg: "linear-gradient(135deg,#d4edd8,#7fbf8a)", fg: "#1b4d2b", border: "#4e9961" };
  if (key.includes("blue")) return { bg: "linear-gradient(135deg,#d6e6f7,#6ea3d6)", fg: "#143a66", border: "#3c6ea0" };
  if (key.includes("red")) return { bg: "linear-gradient(135deg,#f4cbc8,#c96a6a)", fg: "#5a1a1a", border: "#9b3e3e" };
  if (key.includes("purple") || key.includes("violet")) return { bg: "linear-gradient(135deg,#e0d3ef,#9b7ec4)", fg: "#3d1e5f", border: "#6d4999" };
  if (key.includes("brown") || key.includes("grey") || key.includes("gray")) return { bg: "linear-gradient(135deg,#ddd3c4,#9e8a73)", fg: "#3e2f1e", border: "#6e5a45" };
  if (key.includes("orange") || key.includes("yellow")) return { bg: "linear-gradient(135deg,#fde4c2,#e3a760)", fg: "#5a3300", border: "#a06a24" };
  if (key.includes("pink")) return { bg: "linear-gradient(135deg,#f7d4e0,#d174a0)", fg: "#5a1d3a", border: "#9b4871" };
  return { bg: "linear-gradient(135deg,#e8eaed,#b3b6bc)", fg: "#202124", border: "#5f6368" };
}

interface Props {
  params: Promise<{ country: string; locale: string }>;
}

export async function generateStaticParams() {
  return getAllTravelGuideSlugs().map((country) => ({ country }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, locale } = await params;
  const guide = getTravelGuide(country);
  if (!guide) return {};

  const title = `${guide.countryName} Travel Guide 2026: Money, eSIM, Culture & Currency`;
  const description = `Plan a trip to ${guide.countryName}: best ways to exchange ${guide.currency}, cash vs card, eSIM picks, cultural dos and don'ts, what ${guide.currencyName} notes look like, and typical daily budget. Updated ${guide.updatedDate}.`;

  return {
    title,
    description,
    alternates: getAlternates(`travel/${country}`, locale),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: guide.publishedDate,
      modifiedTime: guide.updatedDate,
      authors: [guide.authorSlug],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TravelCountryPage({ params }: Props) {
  const { country, locale } = await params;
  setRequestLocale(locale);

  const guide = getTravelGuide(country);
  if (!guide) notFound();

  const esims = getEsimPlans(country);
  const author = getAuthor(guide.authorSlug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    name: `${guide.countryName} Travel Guide`,
    description: guide.tldr,
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          url: `https://sendmoneycompare.com/authors/${author.slug}`,
        }
      : undefined,
    about: {
      "@type": "Country",
      name: guide.countryName,
    },
    publisher: {
      "@type": "Organization",
      name: "SendMoneyCompare",
      url: "https://sendmoneycompare.com",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Travel", item: "https://sendmoneycompare.com/travel" },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.countryName,
        item: `https://sendmoneycompare.com/travel/${guide.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[var(--color-primary-surface)] to-[var(--color-surface)] pt-10 pb-8">
        <Container>
          <nav aria-label="Breadcrumb" className="text-2sm text-[var(--color-on-surface-variant)] mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/travel" className="hover:underline">Travel</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-on-surface)]">{guide.countryName}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <CircleFlag code={guide.countryCode} size={56} />
            <div>
              <h1 className="text-h1 font-semibold text-[var(--color-on-surface)] leading-tight">
                {guide.countryName} Travel Guide: Money, eSIM & Culture
              </h1>
              <p className="text-2sm text-[var(--color-on-surface-variant)] mt-1">
                Updated {guide.updatedDate}
                {author ? <> · By <Link href={`/authors/${author.slug}`} className="underline hover:text-[var(--color-primary)]">{author.name}</Link>, {author.role}</> : null}
              </p>
            </div>
          </div>

          {/* Answer-first TL;DR — the AI-citable passage */}
          <Card className="max-w-3xl">
            <p className="text-md text-[var(--color-on-surface)] leading-relaxed">
              <strong>Quick answer:</strong> {guide.tldr}
            </p>
          </Card>
        </Container>
      </section>

      {/* ── Key stats strip ─────────────────────────────────────────────── */}
      <section className="py-6 border-y border-[var(--color-outline)] bg-[var(--color-surface-dim)]">
        <Container>
          <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {guide.keyStats.map((s) => (
              <div key={s.label}>
                <dt className="text-2xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
                  {s.label}
                </dt>
                <dd className="text-2sm font-medium text-[var(--color-on-surface)] mt-1">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl prose-like">
            {guide.intro.split("\n\n").map((p, i) => (
              <p key={i} className="text-md text-[var(--color-on-surface)] leading-relaxed mb-4">
                {p}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Converter ────────────────────────────────────────────────────── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-6">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-2">
              Convert to {guide.currencyName} ({guide.currencySymbol} {guide.currency})
            </h2>
            <p className="text-2sm text-[var(--color-on-surface-variant)]">
              Live mid-market rate. Planning a bigger transfer? <Link href={guide.relatedCorridorSlug ? `/send-money/${guide.relatedCorridorSlug}` : "/send-money"} className="text-[var(--color-primary)] underline">Compare money transfer providers for {guide.countryName}</Link>.
            </p>
          </div>
          <TravelConverter
            destinationCurrency={guide.currency}
            corridorHref={guide.relatedCorridorSlug ? `/send-money/${guide.relatedCorridorSlug}` : undefined}
            countryName={guide.countryName}
          />
        </Container>
      </section>

      {/* ── Currency notes ─────────────────────────────────────────────── */}
      <section className="py-10">
        <Container>
          <div className="max-w-5xl">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-2 flex items-center gap-2">
              <Banknote className="w-6 h-6 text-[var(--color-primary)]" /> What {guide.currencyName} notes look like
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] mb-6 max-w-3xl">
              Quick colour reference so you can recognize denominations at a glance. {guide.currencyName} notes are standardized by colour — memorize these before you land and you'll never hand over the wrong note.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {guide.notes.map((n) => {
                const tone = noteColorTone(n.color);
                return (
                  <Card key={n.denomination} className="text-center">
                    <div
                      className="relative aspect-[2/1] w-full mb-3 rounded-md overflow-hidden border"
                      style={{ background: tone.bg, borderColor: tone.border }}
                    >
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        style={{ color: tone.fg }}
                      >
                        <span className="text-xl font-bold tracking-wide drop-shadow-sm">
                          {guide.currencySymbol}{n.denomination.replace(/\D/g, "").replace(/(\d{1,3})(?=(\d{3})+$)/g, "$1,")}
                        </span>
                        <span className="text-2xs uppercase tracking-widest opacity-80">
                          {guide.currency}
                        </span>
                      </div>
                    </div>
                    <p className="font-semibold text-[var(--color-on-surface)]">{n.denomination}</p>
                    <p className="text-2xs text-[var(--color-on-surface-variant)]">{n.color}</p>
                    <p className="text-2xs text-[var(--color-on-surface-variant)] mt-1">{n.figure}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Cash vs Card ───────────────────────────────────────────────── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-6">
              Cash vs card in {guide.countryName}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card>
                <div className="flex items-center gap-2 mb-2">
                  <Banknote className="w-5 h-5 text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-[var(--color-on-surface)]">Cash</h3>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">{guide.money.cashAcceptance}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-[var(--color-on-surface)]">Cards</h3>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">{guide.money.cardAcceptance}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="w-5 h-5 text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-[var(--color-on-surface)]">ATMs</h3>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">{guide.money.atmAvailability}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-[var(--color-on-surface)]">Tipping</h3>
                </div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">{guide.money.tippingNorms}</p>
              </Card>
            </div>

            <Card className="border-l-4 border-[var(--color-error,#d93025)]">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[var(--color-error,#d93025)] shrink-0 mt-0.5" />
                <h3 className="font-semibold text-[var(--color-on-surface)]">Common scams to avoid</h3>
              </div>
              <ul className="space-y-2 mt-3">
                {guide.money.commonScams.map((scam, i) => (
                  <li key={i} className="text-2sm text-[var(--color-on-surface-variant)] flex gap-2">
                    <span className="text-[var(--color-error,#d93025)] shrink-0">•</span>
                    <span>{scam}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="mt-6">
              <h3 className="text-h3 font-semibold text-[var(--color-on-surface)] mb-2">Where to exchange money in {guide.countryName}</h3>
              <p className="text-md text-[var(--color-on-surface)] leading-relaxed">{guide.exchangeGuide}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── eSIM picks ─────────────────────────────────────────────────── */}
      {esims.length > 0 && (
        <section className="py-10">
          <Container>
            <div className="max-w-5xl">
              <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-2 flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-[var(--color-primary)]" /> Best eSIMs for {guide.countryName} (2026)
              </h2>
              <p className="text-md text-[var(--color-on-surface-variant)] mb-4 max-w-3xl">
                An eSIM gives you mobile data the moment your plane lands — no hunting for a SIM booth, no swapping physical cards. Below are the most popular options for {guide.countryName}, with prices checked April 2026.
              </p>
              <AffiliateDisclosure />
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {esims.map((plan) => (
                  <Card key={plan.name}>
                    <p className="text-2xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">{plan.provider}</p>
                    <p className="font-semibold text-[var(--color-on-surface)] mt-1">{plan.name}</p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-h3 font-semibold text-[var(--color-on-surface)]">${plan.priceUsd.toFixed(2)}</span>
                      <span className="text-2xs text-[var(--color-on-surface-variant)]">USD</span>
                    </div>
                    <ul className="text-2sm text-[var(--color-on-surface-variant)] mt-3 space-y-1">
                      <li>{plan.data} data</li>
                      <li>{plan.days} days validity</li>
                      {plan.tag && <li className="text-[var(--color-primary)]">{plan.tag}</li>}
                    </ul>
                    <a
                      href={plan.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="mt-4 inline-flex w-full justify-center items-center px-4 py-2 bg-[var(--color-primary)] text-white text-2sm font-medium rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      Check {plan.provider} &rarr;
                    </a>
                    {plan.placeholder && (
                      <p className="text-2xs text-[var(--color-on-surface-variant)] mt-2 text-center italic">
                        Affiliate pending — link goes direct.
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Culture: Dos & Don'ts ──────────────────────────────────────── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-3">
              Culture & etiquette: dos and don'ts
            </h2>
            <p className="text-md text-[var(--color-on-surface)] leading-relaxed mb-6">{guide.culture.overview}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <h3 className="font-semibold text-[var(--color-on-surface)] mb-3 text-lg">Do</h3>
                <ul className="space-y-3">
                  {guide.culture.dos.map((d, i) => (
                    <li key={i} className="text-2sm text-[var(--color-on-surface-variant)] flex gap-2">
                      <span className="text-green-600 font-bold shrink-0">✓</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h3 className="font-semibold text-[var(--color-on-surface)] mb-3 text-lg">Don't</h3>
                <ul className="space-y-3">
                  {guide.culture.donts.map((d, i) => (
                    <li key={i} className="text-2sm text-[var(--color-on-surface-variant)] flex gap-2">
                      <span className="text-[var(--color-error,#d93025)] font-bold shrink-0">✗</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Sports & pastimes ──────────────────────────────────────────── */}
      <section className="py-10">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[var(--color-primary)]" /> Sports & local pastimes
            </h2>
            <p className="text-md text-[var(--color-on-surface)] leading-relaxed mb-4">{guide.sports.overview}</p>
            <ul className="space-y-2">
              {guide.sports.highlights.map((h, i) => (
                <li key={i} className="text-md text-[var(--color-on-surface)] flex gap-2">
                  <span className="text-[var(--color-primary)] shrink-0">→</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Practical travel info ──────────────────────────────────────── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-6">Practical travel info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <div className="flex items-center gap-2 mb-2"><Sun className="w-5 h-5 text-[var(--color-primary)]" /><h3 className="font-semibold">Best time to visit</h3></div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">{guide.bestTime}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-2"><Plane className="w-5 h-5 text-[var(--color-primary)]" /><h3 className="font-semibold">Visa (2026)</h3></div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">{guide.visa}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" /><h3 className="font-semibold">Safety</h3></div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">{guide.safety}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-2"><Wallet className="w-5 h-5 text-[var(--color-primary)]" /><h3 className="font-semibold">Daily budget (USD)</h3></div>
                <ul className="text-2sm text-[var(--color-on-surface-variant)] space-y-1">
                  <li><strong>Backpacker:</strong> {guide.budget.backpacker}</li>
                  <li><strong>Mid-range:</strong> {guide.budget.midRange}</li>
                  <li><strong>Luxury:</strong> {guide.budget.luxury}</li>
                </ul>
                <p className="text-2xs text-[var(--color-on-surface-variant)] mt-2 italic">{guide.budget.note}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-2"><Plug className="w-5 h-5 text-[var(--color-primary)]" /><h3 className="font-semibold">Plugs & power</h3></div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">Plug types {guide.plugTypes.join(", ")} · {guide.voltage}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-2"><Phone className="w-5 h-5 text-[var(--color-primary)]" /><h3 className="font-semibold">Calling code & language</h3></div>
                <p className="text-2sm text-[var(--color-on-surface-variant)]">{guide.callingCode} · {guide.languages.join(", ")} · {guide.timezone}</p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Highlights ─────────────────────────────────────────────────── */}
      <section className="py-10">
        <Container>
          <div className="max-w-5xl">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[var(--color-primary)]" /> Must-visit places in {guide.countryName}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guide.highlights.map((h) => (
                <Card key={h.name}>
                  <h3 className="font-semibold text-[var(--color-on-surface)] mb-2">{h.name}</h3>
                  <p className="text-2sm text-[var(--color-on-surface-variant)]">{h.summary}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-6">Frequently asked questions</h2>
            <div className="space-y-3">
              {guide.faqs.map((faq, i) => (
                <details key={i} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5 group">
                  <summary className="font-semibold text-[var(--color-on-surface)] cursor-pointer list-none flex justify-between items-center">
                    <span>{faq.question}</span>
                    <span className="text-[var(--color-primary)] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-md text-[var(--color-on-surface-variant)] mt-3 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA: send money ────────────────────────────────────────────── */}
      <section className="py-12 bg-[var(--color-primary-surface)]">
        <Container>
          <div className="max-w-3xl text-center mx-auto">
            <h2 className="text-h2 font-semibold text-[var(--color-on-surface)] mb-3">
              Need to send money to or from {guide.countryName}?
            </h2>
            <p className="text-md text-[var(--color-on-surface-variant)] mb-6">
              Compare live rates across 60+ providers in real time. We show you what {guide.currency} actually lands in the recipient's account — not just the advertised fee.
            </p>
            <Link
              href={guide.relatedCorridorSlug ? `/send-money/${guide.relatedCorridorSlug}` : "/send-money"}
              className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-md font-medium rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Compare money transfers for {guide.countryName} &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Author ─────────────────────────────────────────────────────── */}
      {author && (
        <section className="py-8 border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl flex gap-4 items-start">
              {author.photo && (
                <Image
                  src={author.photo}
                  alt={author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-2xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">About the author</p>
                <p className="font-semibold text-[var(--color-on-surface)] mt-1">
                  <Link href={`/authors/${author.slug}`} className="hover:underline">{author.name}</Link>, {author.role}
                </p>
                <p className="text-2sm text-[var(--color-on-surface-variant)] mt-2">{author.byline}</p>
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
