/**
 * Author data for E-E-A-T author pages and bylines.
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
    slug: "akif-hazarvi",
    name: "Akif Hazarvi",
    role: "Editor-in-Chief",
    initials: "AH",
    photo: "/images/authors/akif-hazarvi.jpeg",
    bio: `Akif Hazarvi is the editor-in-chief of SendMoneyCompare, an independent comparison platform for international money transfers. With over 8 years of experience in fintech and cross-border payments, Akif has worked on payment products processing millions in monthly transaction volume at leading financial technology companies.

His experience spans product management, regulatory compliance, and payment infrastructure across the UK, US, and South Asian markets. This firsthand industry experience informs SendMoneyCompare's methodology: every provider ranking is based on real transfer data collected from provider APIs and websites every 6 hours, with no sponsored placements or paid rankings.

Akif personally oversees the editorial process for all provider reviews and corridor guides on SendMoneyCompare. He has conducted hundreds of test transfers across 50+ providers to validate fee structures, exchange rate markups, and delivery speeds. His goal is to bring the same level of transparency to international money transfers that price comparison sites brought to insurance and utilities.

Before founding SendMoneyCompare, Akif held product and analytics roles at fintech companies focused on cross-border payments, currency exchange, and digital banking. He holds a degree in Computer Science and is based in Denver, Colorado.`,
    expertise: [
      "International money transfers and remittances",
      "Cross-border payment infrastructure",
      "Exchange rate analysis and FX markets",
      "Fintech product management",
      "Financial regulatory compliance (FCA, FinCEN)",
      "Data-driven comparison methodology",
    ],
    credentials: [
      "8+ years in fintech and international payments",
      "Managed cross-border payment products at scale",
      "Conducted 500+ test transfers across 50+ providers",
      "Published research on remittance costs and market transparency",
    ],
    linkedin: "https://www.linkedin.com/in/akifhazarvi",
    articlesWritten: 49,
    byline: "Akif Hazarvi is the editor-in-chief of SendMoneyCompare with 8+ years in fintech and cross-border payments.",
  },
  {
    slug: "ahsan-mukhtar",
    name: "Ahsan Mukhtar",
    role: "Co-founder, Marketing & Partnerships",
    initials: "AM",
    bio: `Ahsan Mukhtar is a co-founder of SendMoneyCompare and leads marketing and partnerships across the platform. He oversees the commercial side of the business: provider partnerships, affiliate relationships, distribution, and growth strategy.

Ahsan works directly with money transfer providers, banks, and fintech companies to ensure SendMoneyCompare maintains accurate provider information, fair affiliate terms, and a level playing field for new entrants and established brands alike. His remit covers brand strategy, performance marketing, and the partnerships pipeline that brings new providers onto the comparison platform.

He also leads outreach with publishers, diaspora communities, and financial educators, with the aim of helping more people discover transparent comparison data when sending money abroad. Ahsan holds a background in marketing and business development across financial services and consumer technology.`,
    expertise: [
      "Marketing strategy and brand positioning",
      "Provider and affiliate partnerships",
      "Business development in fintech",
      "Growth and performance marketing",
      "Distribution and publisher relationships",
    ],
    credentials: [
      "Leads partnerships with money transfer providers and affiliate networks",
      "Background in marketing and BD across financial services",
      "Drives growth strategy and provider acquisition for SendMoneyCompare",
    ],
    linkedin: "https://www.linkedin.com/in/ahsan-mukhtar/",
    articlesWritten: 0,
    byline: "Ahsan Mukhtar is co-founder of SendMoneyCompare and leads marketing and partnerships with money transfer providers.",
  },
  {
    slug: "awais-imran",
    name: "Awais Imran",
    role: "Content Writer & Reviews Editor",
    initials: "AI",
    bio: `Awais Imran is the content writer and reviews editor at SendMoneyCompare, responsible for the editorial side of the platform: provider reviews, comparison articles, corridor guides, and the blog.

Awais writes and maintains the in-depth reviews of the 50+ providers featured on the site, working through fee structures, exchange rate markups, delivery speeds, payment methods, and supported corridors for each provider. He also produces the "how to send money" guides, country-specific corridor pages, and explainers on topics such as SWIFT, IBAN, mid-market rates, and FX margins.

His editorial process involves running real test quotes against provider calculators, cross-referencing the platform's live scraped data, and updating reviews when providers change pricing, expand coverage, or launch new features. He coordinates closely with the editor-in-chief on editorial standards and with the technical team on fact-checking provider data.

Awais holds a degree in English and Communications and is based in London, United Kingdom.`,
    expertise: [
      "Provider reviews and editorial research",
      "Money transfer corridor guides",
      "Comparison and explainer content",
      "Editorial fact-checking and updates",
      "Blog and SEO content production",
    ],
    credentials: [
      "Writes and maintains reviews for 50+ money transfer providers",
      "Produces corridor guides and explainers across SendMoneyCompare",
      "Editorial background with focus on financial services content",
    ],
    linkedin: "https://www.linkedin.com/in/awais-imran-smc",
    articlesWritten: 12,
    byline: "Awais Imran is the content writer and reviews editor at SendMoneyCompare, covering provider reviews and corridor guides.",
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAuthorByName(name: string): Author | undefined {
  return authors.find((a) => a.name === name);
}
