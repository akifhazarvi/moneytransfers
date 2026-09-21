import { COVERAGE } from "@/lib/site-stats";
/**
 * Author data for E-E-A-T author pages and bylines.
 *
 * ROLE SPLIT — read before reassigning anyone.
 * /editorial-policy states that "our editorial team operates independently from
 * our commercial partnerships". That sentence is only true if the person who
 * owns affiliate and provider relationships does not also sign off the reviews
 * that rank those providers. So: Ahsan (editor-in-chief) and Awais (reviews)
 * hold every byline; Akif holds the commercial and data-platform side and
 * appears on no article, review or corridor page. Moving partnerships back
 * under an editorial name silently falsifies the editorial-policy page.
 *
 * Ordered editorial-first; nothing indexes into this array, but /about and the
 * sitemap render it in order.
 */

export interface Author {
  slug: string;
  name: string;
  role: string;
  initials: string;
  /** Path to author photo in /public, e.g. "/images/authors/daniel-rowe.jpeg" */
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
    role: "Co-founder & Editor-in-Chief",
    initials: "AM",
    bio: `Ahsan Mukhtar is a co-founder and the editor-in-chief of SendMoneyCompare, an independent comparison platform for international money transfers. He owns the editorial standards the site is held to: what gets published, how providers are ranked, and what evidence a claim needs before it appears on a page.

Every provider ranking on SendMoneyCompare is produced from real transfer data collected from provider APIs and websites every 6 hours. No provider can buy a higher ranking, and whether a provider pays us plays no part in the order; where payouts fall within 0.1% of each other the higher-rated provider is listed first, disclosed on every comparison. Ahsan enforces that separation — commercial and affiliate relationships sit with the founder, not with the editorial desk, so the people who decide the order have nothing riding on it.

He fact-checks the provider reviews before publication, checking the fee structures, exchange-rate markups and delivery times in each review against the platform's own scraped quote history rather than against provider marketing. Where a review's figure and the dataset disagree, the dataset wins or the claim comes out.

Ahsan also leads outreach with publishers, diaspora communities and financial educators, with the aim of helping more people find transparent comparison data when sending money abroad. He holds a background in marketing and business development across financial services and consumer technology.`,
    expertise: [
      "Editorial standards for YMYL financial content",
      "Provider ranking methodology and disclosure",
      "Fact-checking against primary transfer data",
      "Remittance market research",
      "Publisher and community outreach",
    ],
    credentials: [
      "Sets editorial policy and ranking methodology for SendMoneyCompare",
      "Fact-checks every provider review against the platform's scraped quote history",
      "Background in marketing and BD across financial services",
    ],
    linkedin: "https://www.linkedin.com/in/ahsan-mukhtar/",
    articlesWritten: 36,
    byline: "Ahsan Mukhtar is co-founder and editor-in-chief of SendMoneyCompare, where he sets editorial standards and fact-checks provider reviews.",
  },
  {
    slug: "awais-imran",
    name: "Awais Imran",
    role: "Senior Writer & Reviews Editor",
    initials: "AI",
    bio: `Awais Imran is the senior writer and reviews editor at SendMoneyCompare, responsible for the editorial side of the platform: provider reviews, comparison articles, corridor guides, and the blog.

Awais writes and maintains the in-depth reviews of the ${COVERAGE.providers} featured on the site, working through fee structures, exchange rate markups, delivery speeds, payment methods, and supported corridors for each provider. He runs the hand-tested transfers behind those reviews — each one documented, with its corridors and dates, in the "how we tested" section of the review it supports — to verify fee structures, exchange rate markups and delivery speeds against what providers advertise. He also produces the "how to send money" guides, country-specific corridor pages, and explainers on topics such as SWIFT, IBAN, mid-market rates, and FX margins.

His editorial process involves running real test quotes against provider calculators, cross-referencing the platform's live scraped data, and updating reviews when providers change pricing, expand coverage, or launch new features. Each review is fact-checked by the editor-in-chief before publication.

Awais holds a degree in English and Communications and is based in London, United Kingdom.`,
    expertise: [
      "Provider reviews and editorial research",
      "Money transfer corridor guides",
      "Comparison and explainer content",
      "Editorial fact-checking and updates",
      "Blog and SEO content production",
    ],
    credentials: [
      // Deliberately hand-typed, not SITE_STATS: authors.ts is imported by
      // about/[author]/opengraph-image, which runs on the edge, and site-stats
      // pulls in unified-quotes. That import is what blew the 2 MB edge bundle
      // cap and failed six production deploys. "50+" is true at 55 curated
      // reviews; check it by hand if that count ever drops.
      "Writes and maintains reviews for 50+ money transfer providers",
      "Hand-tested transfers documented per provider in every review",
      "Produces corridor guides and explainers across SendMoneyCompare",
      "Editorial background with focus on financial services content",
    ],
    linkedin: "https://www.linkedin.com/in/awsimran/",
    articlesWritten: 95,
    byline: "Awais Imran is the senior writer and reviews editor at SendMoneyCompare, covering provider reviews and corridor guides.",
  },
  {
    slug: "akif-hazarvi",
    name: "Akif Hazarvi",
    role: "Founder",
    initials: "AH",
    photo: "/images/authors/akif-hazarvi.jpeg",
    bio: `Akif Hazarvi is the founder of SendMoneyCompare, an independent comparison platform for international money transfers. With over 8 years of experience in fintech and cross-border payments, Akif has worked on payment products processing millions in monthly transaction volume at leading financial technology companies.

He built and runs the data platform behind the site: the scrapers that collect quotes from provider APIs and websites every 6 hours, the pipeline that merges them into a single comparable price, and the checks that keep published figures tied to measured data. His experience spans product management, regulatory compliance, and payment infrastructure across the UK, US, and South Asian markets.

Akif also handles the commercial side of the business — provider relationships, affiliate terms, and distribution. He holds no editorial role. Rankings, reviews and guides are decided by the editorial desk under the editor-in-chief, and no commercial relationship changes the order providers appear in; that separation is set out in full in our editorial policy.

Before founding SendMoneyCompare, Akif held product and analytics roles at fintech companies focused on cross-border payments, currency exchange, and digital banking. He holds a degree in Computer Science and is based in Denver, Colorado.`,
    expertise: [
      "Cross-border payment infrastructure",
      "Transfer pricing data collection and quality",
      "Exchange rate analysis and FX markets",
      "Fintech product management",
      "Financial regulatory compliance (FCA, FinCEN)",
      "Provider and affiliate partnerships",
    ],
    credentials: [
      "8+ years in fintech and international payments",
      "Managed cross-border payment products at scale",
      "Built the quote-collection pipeline behind every comparison on the site",
      "Published research on remittance costs and market transparency",
    ],
    linkedin: "https://www.linkedin.com/in/akifhazarvi",
    articlesWritten: 0,
    byline: "Akif Hazarvi is the founder of SendMoneyCompare and runs its transfer-price data platform. He holds no editorial role.",
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAuthorByName(name: string): Author | undefined {
  return authors.find((a) => a.name === name);
}
