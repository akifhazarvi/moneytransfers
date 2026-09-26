import { COVERAGE } from "@/lib/site-stats";
/**
 * Author data for E-E-A-T author pages and bylines.
 *
 * ROLE SPLIT — read before reassigning anyone.
 * /editorial-policy states that "our editorial team operates independently from
 * our commercial partnerships". Ahsan owns the company and the commercial side;
 * Awais owns editorial and holds the reviews. Keep the reviewer and the
 * fact-checker on a review two different people — a review signed off by its
 * own writer is the thing that sentence promises does not happen.
 *
 * Every /about/<slug> here is a live, sitemapped URL generated from this array
 * (sitemap.ts, about/[author]/generateStaticParams). Removing an entry 404s
 * that URL, so pair any removal with a redirect in next.config.ts — as was done
 * for /about/akif-hazarvi.
 */

export interface Author {
  slug: string;
  name: string;
  role: string;
  initials: string;
  /** Path to author photo in /public, e.g. "/images/authors/ahsan-mukhtar.jpeg" */
  photo?: string;
  bio: string;
  expertise: string[];
  credentials: string[];
  linkedin?: string;
  articlesWritten: number;
  /** Short byline shown inline on articles */
  byline: string;
}

export const authors: Author[] = [
  {
    slug: "ahsan-mukhtar",
    name: "Ahsan Mukhtar",
    role: "Founder & CEO",
    initials: "AM",
    photo: "/images/authors/ahsan-mukhtar.jpeg",
    bio: `Ahsan Mukhtar is the founder and CEO of SendMoneyCompare, an independent comparison platform for international money transfers. He set up the company to bring the same price transparency to sending money abroad that comparison sites brought to insurance and utilities.

Every provider ranking on SendMoneyCompare is produced from real transfer data collected from provider APIs and websites every 6 hours, and the order is computed from what a recipient actually receives — not chosen by hand. No provider can buy a higher ranking, and whether a provider pays us plays no part in the order; where payouts fall within 0.1% of each other the higher-rated provider is listed first, disclosed on every comparison.

Ahsan fact-checks the provider reviews before publication, checking the fee structures, exchange-rate markups and delivery times in each review against the platform's own scraped quote history rather than against provider marketing. Where a review's figure and the dataset disagree, the dataset wins or the claim comes out. Day-to-day editorial sits with the editor-in-chief.

He also leads outreach with publishers, diaspora communities and financial educators, with the aim of helping more people find transparent comparison data when sending money abroad. Ahsan holds a background in marketing and business development across financial services and consumer technology.`,
    expertise: [
      "Remittance and money transfer markets",
      "Provider ranking methodology and disclosure",
      "Fact-checking against primary transfer data",
      "Business development in fintech",
      "Publisher and community outreach",
    ],
    credentials: [
      "Founded SendMoneyCompare and owns its ranking methodology",
      "Fact-checks every provider review against the platform's scraped quote history",
      "Background in marketing and BD across financial services",
    ],
    linkedin: "https://www.linkedin.com/in/ahsan-mukhtar/",
    articlesWritten: 36,
    byline: "Ahsan Mukhtar is the founder and CEO of SendMoneyCompare, where he owns the ranking methodology and fact-checks provider reviews.",
  },
  {
    slug: "awais-imran",
    name: "Awais Imran",
    role: "Editor-in-Chief",
    initials: "AI",
    photo: "/images/authors/awais-imran.jpeg",
    bio: `Awais Imran is the editor-in-chief of SendMoneyCompare, responsible for the editorial side of the platform: provider reviews, comparison articles, corridor guides, and the blog.

Awais writes and maintains the site's in-depth provider reviews, working through fee structures, exchange rate markups, delivery speeds, payment methods, and supported corridors for each provider. Where a review rests on test transfers he made, they are documented with their corridors and dates in that review's "how we tested" section, and used to verify fee structures, exchange rate markups and delivery speeds against what providers advertise. He also produces the "how to send money" guides, country-specific corridor pages, and explainers on topics such as SWIFT, IBAN, mid-market rates, and FX margins.

His editorial process involves running real test quotes against provider calculators, cross-referencing the platform's live scraped data, and updating reviews when providers change pricing, expand coverage, or launch new features. Every review is fact-checked against the platform's own data before publication.

Awais holds a degree in English and Communications and is based in London, United Kingdom.`,
    expertise: [
      "Provider reviews and editorial research",
      "Money transfer corridor guides",
      "Comparison and explainer content",
      "Editorial fact-checking and updates",
      "Blog and SEO content production",
    ],
    credentials: [
      // No count here. The round-2 SEO brief (2026-09-24) found four provider
      // counts across the site; this line said "reviews for 50+ providers"
      // while the site holds 55 provider profiles and 17 full editorial
      // reviews. The defined terms live in site-stats.ts (providers with live
      // quotes / provider profiles / full reviews); a credential need not
      // restate one.
      `Writes and maintains the site's full provider reviews and the comparison data behind ${COVERAGE.providers} tracked`,
      "Test transfers documented, with corridors and dates, in the reviews that used them",
      "Produces corridor guides and explainers across SendMoneyCompare",
      "Editorial background with focus on financial services content",
    ],
    linkedin: "https://www.linkedin.com/in/awsimran/",
    articlesWritten: 95,
    byline: "Awais Imran is the editor-in-chief of SendMoneyCompare, covering provider reviews and corridor guides.",
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAuthorByName(name: string): Author | undefined {
  return authors.find((a) => a.name === name);
}
