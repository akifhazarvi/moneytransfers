/**
 * Author data for E-E-A-T author pages and bylines.
 */

export interface Author {
  slug: string;
  name: string;
  role: string;
  initials: string;
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
    role: "Founder & Editor",
    initials: "AH",
    bio: `Akif Hazarvi is the founder and editor of SendMoneyCompare, an independent comparison platform for international money transfers. With over 8 years of experience in fintech and cross-border payments, Akif has worked on payment products processing millions in monthly transaction volume at leading financial technology companies.

His experience spans product management, regulatory compliance, and payment infrastructure across the UK, US, and South Asian markets. This firsthand industry experience informs SendMoneyCompare's methodology: every provider ranking is based on real transfer data collected from provider APIs and websites every 6 hours, with no sponsored placements or paid rankings.

Akif personally oversees the editorial process for all provider reviews and corridor guides on SendMoneyCompare. He has conducted hundreds of test transfers across 60+ providers to validate fee structures, exchange rate markups, and delivery speeds. His goal is to bring the same level of transparency to international money transfers that price comparison sites brought to insurance and utilities.

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
      "Conducted 500+ test transfers across 60+ providers",
      "Published research on remittance costs and market transparency",
    ],
    linkedin: "https://www.linkedin.com/in/akifhazarvi",
    articlesWritten: 49,
    byline: "Akif Hazarvi is the founder of SendMoneyCompare with 8+ years in fintech and cross-border payments.",
  },
  {
    slug: "awais-imran",
    name: "Awais Imran",
    role: "Co-founder & Technical Lead",
    initials: "AI",
    bio: `Awais Imran is the co-founder and technical lead of SendMoneyCompare, responsible for the data infrastructure that powers the platform's real-time provider comparisons. He designed and maintains the scraping system that collects live transfer quotes from 60+ providers every 6 hours.

Awais specialises in data engineering, automation, and building reliable data pipelines for financial services. The SendMoneyCompare data pipeline uses a combination of direct API integrations, browser automation (Playwright), and HTML scraping (Cheerio) to collect exchange rates, fees, and delivery speeds from providers including Wise, Remitly, OFX, XE, Western Union, Revolut, and many others.

The technical infrastructure ensures data accuracy through multiple validation layers: cross-referencing multiple data sources, detecting and flagging anomalous rates, and maintaining a priority system that favours direct API data over indirect sources. When discrepancies arise between data sources, the system defaults to the most reliable source based on a tiered priority model.

Awais also maintains the platform's automated testing, deployment pipelines, and monitoring systems. He holds a degree in Software Engineering and is based in London, United Kingdom.`,
    expertise: [
      "Data engineering and pipeline architecture",
      "Web scraping and browser automation",
      "Financial data collection and validation",
      "API integration and system reliability",
      "Software engineering and DevOps",
    ],
    credentials: [
      "Designed data pipeline collecting quotes from 60+ providers",
      "Built automated scraping infrastructure processing 10,000+ quotes daily",
      "Software engineering background with focus on financial data systems",
    ],
    linkedin: "https://www.linkedin.com/in/awaisimran",
    articlesWritten: 0,
    byline: "Awais Imran is the co-founder and technical lead of SendMoneyCompare, responsible for data infrastructure and provider integrations.",
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAuthorByName(name: string): Author | undefined {
  return authors.find((a) => a.name === name);
}
