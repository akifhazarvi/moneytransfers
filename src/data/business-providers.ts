/**
 * Business / B2B provider intelligence — the editorial data spine for the
 * comparison tool at /business/compare.
 *
 * WHY THIS EXISTS
 * Businesses don't choose an FX provider on headline rate alone. They choose on
 * operational fit: can it pay 1,000 suppliers in one upload, route them through
 * an approval chain, give the bookkeeper view-only access, sync to Xero, lock a
 * rate for a future invoice — and can *my* business even open an account? This
 * file captures that, researched per provider against primary sources (provider
 * docs + 2026 reviews), so the tool answers the real B2B question.
 *
 * SOURCES (verified June 2026 — re-check on refresh, features change fast):
 *   Wise Business     — wise.com/pricing/business, wise.com/business/payouts,
 *                       help.wise.com (batch/approvals/MUA). NB: Wise stopped
 *                       issuing US business cards in 2023; can't onboard NV/US
 *                       territories.
 *   OFX               — ofx.com/business (batch-payments, fx-solutions,
 *                       global-business-account). Min $200/transfer or $1k/yr.
 *   Airwallex         — airwallex.com/docs (batch transfers, approval flows),
 *                       statrys/research 2026 reviews. FX ~0.4–0.6% over interbank.
 *   Mercury           — mercury.com/business-payments, /bill-pay, support.mercury.com
 *                       (eligibility, FDIC). Needs a US entity; USD wires free,
 *                       40+ currencies at flat 1%.
 *   XE                — xe.com/business (payments-api, mass-payments, enterprise).
 *                       Senders must be in EU/UK/US/CA/AU/NZ. 145+ currencies.
 *   Currencies Direct — currenciesdirect.com/business, help.currenciesdirect.com.
 *                       Zero fees; min ~£100 online to third parties.
 *
 * Support levels:
 *   "full"    — first-class, documented feature
 *   "partial" — available but limited, plan-gated, or via a workaround
 *   "none"    — not offered
 */

export type Support = "full" | "partial" | "none";

export interface BusinessFeature {
  key: string;
  label: string;
  /** Why a business cares — shown on expand. */
  why: string;
}

/** The dimensions a business actually decides on, in rough priority order. */
export const BUSINESS_FEATURES: BusinessFeature[] = [
  { key: "bulkPayments", label: "Bulk / batch payments", why: "Pay many suppliers, contractors or staff from one file upload or API call instead of one transfer at a time." },
  { key: "approvals", label: "Payment approval workflow", why: "Require a second person to sign off payments above a threshold — the core financial control for any team handling money. The strongest setups also enforce separation of duties (a creator can't approve their own payment)." },
  { key: "multiUser", label: "Multi-user roles & permissions", why: "Give a bookkeeper view-only access, a clerk payment-prep rights and an owner final approval — without sharing one login." },
  { key: "multiCurrencyAccount", label: "Multi-currency account", why: "Hold and receive balances in several currencies with local account details, so you aren't force-converted on every payment and can net off receivables against payables." },
  { key: "forwardContracts", label: "Forward contracts / hedging", why: "Lock today's exchange rate for a future invoice, protecting margin on payments you already know are coming." },
  { key: "dedicatedDealer", label: "Dedicated dealer / account manager", why: "A named human for large or complex transfers — matters most above ~$10k and for risk-managed FX." },
  { key: "api", label: "Payments API", why: "Trigger payouts straight from your own software, ERP or platform — essential for automating at volume or embedding payments in a product." },
  { key: "accounting", label: "Accounting integration", why: "Two-way sync with Xero / QuickBooks / NetSuite so payments reconcile themselves instead of manual entry." },
  { key: "cards", label: "Corporate / expense cards", why: "Issue spend cards with limits and receipt capture, consolidating travel and SaaS spend alongside your FX." },
];

export interface BusinessProvider {
  slug: string; // matches providers.ts where one exists
  name: string;
  tagline: string;
  /** Who it suits best, in one sentence. */
  bestFor: string;
  /** Typical FX cost note (sourced). */
  fxNote: string;
  /** Nitty-gritty quick facts shown as a spec list. */
  facts: {
    pricing: string;
    speed: string;
    reach: string;
    minimum: string;
    eligibility: string;
    batchLimit: string;
  };
  /** Compliance, KYC, limits and fraud/security — the questions a finance/ops
   * team asks before onboarding. Sourced per provider. */
  trust: {
    regulators: string;
    kyc: string;
    limits: string;
    fraud: string;
    fundsProtection: string;
  };
  /** Common B2B use cases this provider is genuinely used for. */
  useCases: string[];
  /** Industries that lean on this provider. */
  industries: string[];
  pros: string[];
  cons: string[];
  /** Feature support keyed by BUSINESS_FEATURES.key. */
  features: Record<string, { level: Support; note?: string }>;
  /** Whether we hold an editorial review for the company-page link. */
  hasReview: boolean;
}

export const BUSINESS_PROVIDERS: BusinessProvider[] = [
  {
    slug: "wise",
    name: "Wise Business",
    tagline: "Transparent low-margin FX with strong self-serve batch and approvals.",
    bestFor: "SMEs and startups paying global teams, contractors and suppliers who want the lowest visible markup and clean self-serve controls.",
    fxNote: "Mid-market rate + a fee from 0.33% (from 0.57% on many currencies). One-time ~$31 account fee, no monthly charge. Reduced rates over $25k/month.",
    facts: {
      pricing: "~$31 one-time setup, no monthly fee. Conversion fee from 0.33%.",
      speed: "Often same/next business day on major routes.",
      reach: "Hold 40+ currencies; pay 160+ countries; local account details in up to 9–10 currencies.",
      minimum: "No minimum transfer.",
      eligibility: "Most countries — but no onboarding in Nevada or US territories, and Wise stopped issuing US business cards in 2023.",
      batchLimit: "Up to 1,000 payments per BatchTransfer.",
    },
    trust: {
      regulators: "FCA (UK), FinCEN MSB (US), ASIC (AU) and other local licences; publicly listed (LSE).",
      kyc: "KYB: business registration/licence, EIN, beneficial-ownership details. AI document scanning; most business accounts verified in 1–3 business days.",
      limits: "No fixed transfer minimum; high per-transfer ceilings vary by currency and verification level.",
      fraud: "2FA, transaction monitoring, in-app payment-approval controls; recipient confirmation on supported routes.",
      fundsProtection: "Customer funds safeguarded in segregated accounts (not FDIC/FSCS bank deposit insurance).",
    },
    useCases: ["Paying overseas contractors and remote staff", "Supplier invoices in multiple currencies", "Collecting from marketplaces/clients via local details", "Subscription/SaaS revenue collection"],
    industries: ["Startups & tech", "Agencies & consultancies", "Freelance-heavy teams", "Small eCommerce"],
    pros: ["Lowest visible markup of the set", "Self-serve batch + approvals, no sales call", "Free, widely-adopted API (Xero, Deel, GoCardless)"],
    cons: ["No forward contracts / hedging", "No dedicated dealer for large transfers", "No US business cards since 2023"],
    hasReview: true,
    features: {
      bulkPayments: { level: "full", note: "BatchTransfer via file upload or API." },
      approvals: { level: "full", note: "Per-payment approval rules; bulk-approve up to 100 at once." },
      multiUser: { level: "full", note: "Viewer / Employee / Preparer / Admin roles." },
      multiCurrencyAccount: { level: "full", note: "Hold 40+ currencies; local details in up to 9–10." },
      forwardContracts: { level: "none" },
      dedicatedDealer: { level: "none" },
      api: { level: "full", note: "Free API; used by Xero, Deel, GoCardless." },
      accounting: { level: "full", note: "Xero & QuickBooks integrations." },
      cards: { level: "partial", note: "Business cards outside the US (none for US businesses since 2023)." },
    },
  },
  {
    slug: "ofx",
    name: "OFX",
    tagline: "Account-managed FX built for larger and recurring business transfers.",
    bestFor: "Businesses sending larger amounts ($10k+) that want a dealer, forward contracts and tight Xero sync, with no transfer fees.",
    fxNote: "No transfer fees; margin built into the rate (tighter on larger amounts). Min $200/transfer or $1,000/year.",
    facts: {
      pricing: "No transfer fees; cost is the rate margin.",
      speed: "Often within 1 business day to major destinations.",
      reach: "30+ currencies, 170+ countries; Global Business Account with local receiving.",
      minimum: "$200 per transfer (or $1,000/year minimum).",
      eligibility: "Broad — operates across US, UK, EU, AU, NZ, CA, HK and more.",
      batchLimit: "Multiple recipients per batch file upload.",
    },
    trust: {
      regulators: "Regulated by ~50 bodies incl. FCA (UK), FINTRAC (CA), AUSTRAC (AU); registered FinCEN MSB in the US.",
      kyc: "KYB on business identity, ownership and source of funds; integrates third-party verification. Onboarding typically a day or two.",
      limits: "Min $200/transfer (or $1,000/year). No published upper cap — built for large transfers.",
      fraud: "2FA, transaction monitoring and approval workflows; dealer-assisted checks on large transfers.",
      fundsProtection: "Client funds held in segregated accounts at major banks per local regulation.",
    },
    useCases: ["Recurring supplier/import payments", "Large one-off settlements (property, equipment)", "Hedging known future FX exposure", "Paying overseas staff and contractors in batches"],
    industries: ["Import/export & wholesale", "Property & real estate", "Manufacturing", "Recruitment & SMEs"],
    pros: ["No transfer fees, dealer support on large amounts", "Forward contracts up to 12 months", "Real-time two-way Xero/QuickBooks sync"],
    cons: ["Rate margin replaces fees — compare totals", "$200/transfer minimum", "No corporate cards"],
    hasReview: true,
    features: {
      bulkPayments: { level: "full", note: "Batch payments via file upload." },
      approvals: { level: "full", note: "Approval workflow with one-click bulk approve." },
      multiUser: { level: "full", note: "Team roles & permissions with spend control." },
      multiCurrencyAccount: { level: "full", note: "Global Business Account, 30+ currencies, local receiving." },
      forwardContracts: { level: "full", note: "Lock rates up to 12 months (subject to approval)." },
      dedicatedDealer: { level: "full", note: "Named dealer for large/complex transfers." },
      api: { level: "full", note: "Business payments API." },
      accounting: { level: "full", note: "Real-time two-way Xero & QuickBooks sync." },
      cards: { level: "none" },
    },
  },
  {
    slug: "airwallex",
    name: "Airwallex",
    tagline: "Multi-currency accounts plus spend management on one platform.",
    bestFor: "Scaling and eCommerce businesses wanting global accounts, batch payouts, cards, approvals and an embeddable API in one stack.",
    fxNote: "FX markup ~0.4–0.6% over interbank; payout fees itemised per transfer. Multi-user/approvals on Grow & Accelerate plans.",
    facts: {
      pricing: "Free/low base tiers; advanced controls on Grow/Accelerate plans. FX ~0.4–0.6%.",
      speed: "Local-rail payouts often same/next day.",
      reach: "Up to 10 Global Accounts; pay 120+ countries; collect like a local in 180+ markets.",
      minimum: "No fixed minimum; geared to ongoing volume.",
      eligibility: "Available across US, UK, EU, AU, HK, SG and more.",
      batchLimit: "Up to 1,000 recipients per batch.",
    },
    trust: {
      regulators: "60+ licences/registrations globally; HKMA MSO + stored-value licence; FinCEN MSB (US) and local EMI/MSB licences.",
      kyc: "Single KYB unlocks all capabilities; gen-AI screening cut false positives ~50%. Accounts can activate in ~48h with complete docs.",
      limits: "No fixed minimum; scales to high volume. Own local rails bypass SWIFT in 120+ countries (≈93% same-day).",
      fraud: "2FA, encryption, advanced fraud detection; granular multi-layer approvals.",
      fundsProtection: "Client funds safeguarded in segregated accounts at Tier-1 institutions.",
    },
    useCases: ["Collecting global revenue in local currencies", "Mass contractor/seller payouts via API", "Embedding payments in a marketplace/platform", "Consolidating card spend + FX"],
    industries: ["eCommerce & DTC brands", "SaaS & subscriptions", "Marketplaces & platforms", "Digital agencies"],
    pros: ["Collect + pay + spend on one platform", "Strong API for marketplaces/embedded finance", "Corporate cards with OCR receipt capture"],
    cons: ["Best controls are on paid plans", "No forward contracts", "Overkill for occasional senders"],
    hasReview: false,
    features: {
      bulkPayments: { level: "full", note: "Batch transfers via dashboard or API." },
      approvals: { level: "full", note: "Multi-layer approval workflows (Grow/Accelerate plans)." },
      multiUser: { level: "full", note: "Multi-user access on paid plans." },
      multiCurrencyAccount: { level: "full", note: "Up to 10 Global Accounts (USD/EUR/GBP spun up in minutes)." },
      forwardContracts: { level: "none" },
      dedicatedDealer: { level: "partial", note: "Enterprise/relationship support at scale." },
      api: { level: "full", note: "Full payments + accounts + embedded-finance API." },
      accounting: { level: "full", note: "Xero / NetSuite integrations." },
      cards: { level: "full", note: "Corporate + employee cards with OCR receipts." },
    },
  },
  {
    slug: "mercury",
    name: "Mercury",
    tagline: "US business banking with strong AP automation and approvals.",
    bestFor: "US-incorporated startups and SMEs wanting banking, bill-pay and global vendor payouts in one account with deep approval controls.",
    fxNote: "USD international wires free; 40+ local currencies at a flat 1% FX fee. Up to $5M FDIC via sweep network.",
    facts: {
      pricing: "$0 monthly. ACH + domestic + USD intl wires free; non-USD 1% FX.",
      speed: "99.6% of 2025 domestic payments arrived in ≤1 business day; USD intl wires 1–3 days.",
      reach: "Pays 40+ currencies across 200+ countries/regions (USD account base).",
      minimum: "No minimum.",
      eligibility: "Requires a US-registered company (founders can be non-US); rejects PO box / registered-agent addresses; some founder countries unsupported.",
      batchLimit: "Mass payments via API; Bill Pay for AP batches.",
    },
    trust: {
      regulators: "Fintech (not itself a bank); banking via partners Choice Financial Group, Column N.A. & Evolve (Members FDIC).",
      kyc: "KYB on US entity: formation docs, EIN, ownership, genuine US business address (no PO box / registered-agent). Some founder countries unsupported.",
      limits: "No minimum; standard wire/ACH ceilings. USD intl wires free; non-USD flat 1%.",
      fraud: "TOTP 2FA, data encryption, fraud monitoring and dark-web scanning; separation-of-duties approval rules.",
      fundsProtection: "Up to $5M FDIC via sweep network (spread across ~20 partner banks).",
    },
    useCases: ["US startup treasury + operating account", "Accounts-payable automation with approvals", "Paying global vendors/contractors in local currency", "Mass payouts via API"],
    industries: ["US tech startups", "Venture-backed SMEs", "eCommerce (US-incorporated)", "Agencies with US entity"],
    pros: ["Free USD wires + ACH; banking + payments combined", "Best-in-class approval rules (incl. separation of duties, approve in Slack)", "Up to $5M FDIC via sweep; read/write API"],
    cons: ["Requires a US entity — not for non-US companies", "Flat 1% FX on non-USD (pricier than specialists at scale)", "No forward contracts / hedging"],
    hasReview: false,
    features: {
      bulkPayments: { level: "full", note: "Mass payments via read/write API + Bill Pay." },
      approvals: { level: "full", note: "Multi-layer $-based rules; approve in Slack/app; separation of duties." },
      multiUser: { level: "full", note: "Granular user-level permissions & roles." },
      multiCurrencyAccount: { level: "partial", note: "USD account base; pays out in 40+ currencies (no FX hold)." },
      forwardContracts: { level: "none" },
      dedicatedDealer: { level: "none" },
      api: { level: "full", note: "Robust read + write API for mass payments." },
      accounting: { level: "full", note: "QuickBooks / Xero / NetSuite sync." },
      cards: { level: "full", note: "Corporate cards with spend controls." },
    },
  },
  {
    slug: "xe",
    name: "XE Money Transfer",
    tagline: "Wide-reach business payments with mass-pay API and long-dated hedging.",
    bestFor: "Businesses needing broad currency coverage (145+) and recurring/scheduled supplier payments with no fees and forward contracts.",
    fxNote: "No transfer fees on business transfers, even large ones; margin in the rate. Credit lines for eligible corporates.",
    facts: {
      pricing: "No transfer fees; cost is the rate margin.",
      speed: "Typically 1–4 business days.",
      reach: "Send to 190+ countries in 145+ currencies; send & receive across 130+.",
      minimum: "No widely-published fixed minimum.",
      eligibility: "Senders must be based in EU, UK, US, CA, AU or NZ.",
      batchLimit: "Up to 250 transfers per Mass Payments request.",
    },
    trust: {
      regulators: "Triple-regulated: FCA (UK), ASIC (AU), FinCEN (US).",
      kyc: "KYC + AML/CTF documentation at signup; documents encrypted and stored per regional rules. Corporate credit checks for credit lines.",
      limits: "No widely-published fixed minimum; no fees even on large transfers.",
      fraud: "2FA, AML/CTF monitoring, encrypted data handling.",
      fundsProtection: "Client funds safeguarded per regulator requirements in each jurisdiction.",
    },
    useCases: ["Recurring overseas supplier payments", "International payroll/contractor runs", "Importers hedging invoice exposure", "eCommerce multi-currency revenue"],
    industries: ["Import/export", "Travel & hospitality", "eCommerce", "Recruitment & professional services"],
    pros: ["No fees even on large transfers", "Forward contracts up to 24 months + credit lines", "Widest currency reach in the set (145+)"],
    cons: ["Senders limited to 6 regions", "Approvals lighter than dedicated AP tools", "Fewer native accounting connectors"],
    hasReview: true,
    features: {
      bulkPayments: { level: "full", note: "Up to 250 transfers in one go (Mass Payments API/platform)." },
      approvals: { level: "partial", note: "Platform controls; lighter than dedicated AP tools." },
      multiUser: { level: "partial", note: "Team access on business accounts." },
      multiCurrencyAccount: { level: "full", note: "Send & receive in 130+ currencies, 190+ countries." },
      forwardContracts: { level: "full", note: "Lock rates up to 24 months; credit lines for corporates." },
      dedicatedDealer: { level: "full", note: "Account management for enterprise/large transfers." },
      api: { level: "full", note: "Payments, Mass Payments & Currency Data APIs." },
      accounting: { level: "partial", note: "Integrates via API; fewer native connectors." },
      cards: { level: "none" },
    },
  },
  {
    slug: "currencies-direct",
    name: "Currencies Direct",
    tagline: "Personal-service FX broker for SMEs that want a human and hedging.",
    bestFor: "SMEs and corporates wanting a dedicated account manager, forward contracts and batch payouts with zero fees on any amount.",
    fxNote: "Zero transfer fees on any amount; margin in the rate. Best value above ~£1,000.",
    facts: {
      pricing: "Zero transfer fees; cost is the rate margin.",
      speed: "Usually 1–2 business days (Europe sometimes <12h; exotic currencies longer).",
      reach: "Major + many exotic currencies; receiving accounts in key currencies.",
      minimum: "~£100 online to third parties (platform min £10; max £300k–£500k).",
      eligibility: "Strong UK/EU focus; serves SMEs and corporates internationally.",
      batchLimit: "Multiple payees per single multi-currency upload.",
    },
    trust: {
      regulators: "FCA-authorised (UK) with equivalent local registrations; established 1996.",
      kyc: "KYB on business + beneficial owners; account-manager-assisted onboarding for corporates.",
      limits: "Online ~£100 min to third parties (platform min £10); max ~£300k–£500k per transfer.",
      fraud: "2FA, AML monitoring; account-manager verification on large/unusual transfers.",
      fundsProtection: "Client funds held in segregated safeguarded accounts, separate from company funds.",
    },
    useCases: ["International payroll for staff in many countries", "Exporter/importer FX risk management", "Royalty, licensing & IP payments", "Batch supplier/contractor payouts"],
    industries: ["Import/export & exporters", "Recruitment & payroll", "IP / licensing / media", "Online sellers"],
    pros: ["Zero fees + a named account manager", "Forward contracts up to 24 months with small deposit", "Batch payments in different currencies in one upload"],
    cons: ["Less suited to sub-£1,000 / same-day transfers", "Lighter self-serve controls (account-managed)", "Fewer native accounting connectors"],
    hasReview: true,
    features: {
      bulkPayments: { level: "full", note: "Batch payments via single multi-currency upload." },
      approvals: { level: "partial", note: "Handled via account manager / platform, not granular self-serve." },
      multiUser: { level: "partial", note: "Account-managed access rather than rich role tiers." },
      multiCurrencyAccount: { level: "partial", note: "Receiving accounts in major currencies; transfer-led." },
      forwardContracts: { level: "full", note: "Lock rates up to 24 months with a small deposit." },
      dedicatedDealer: { level: "full", note: "Named account manager with timing/hedging advice." },
      api: { level: "partial", note: "Integration available for corporate clients." },
      accounting: { level: "partial", note: "Limited native accounting connectors." },
      cards: { level: "none" },
    },
  },
];

export function getBusinessProvider(slug: string): BusinessProvider | undefined {
  return BUSINESS_PROVIDERS.find((p) => p.slug === slug);
}

/** All distinct use cases, for the use-case finder. */
export const ALL_USE_CASES: string[] = [
  ...new Set(BUSINESS_PROVIDERS.flatMap((p) => p.useCases)),
];
