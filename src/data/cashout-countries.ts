/**
 * Cash-out country configuration.
 *
 * SEO GUARDRAIL: these are NOT programmatic/templated pages. Each entry carries
 * hand-authored, country-specific editorial (which exchanges people actually
 * use, the local cash-out method, KYC/regulatory reality, common pitfalls) that
 * cannot be machine-stamped. A country only earns a page if it has (a) real
 * live crypto-rail data in remitroutes-crypto.json AND (b) enough distinct
 * substance below to clear E-E-A-T. The pilot set is deliberately small
 * (6 major remittance destinations) — expand only when a country has both live
 * data and genuinely unique context, never to hit a page count.
 *
 * Live numbers (cheapest exchange, all-in cost, receive amount) come from the
 * crypto-rails layer at render time; this file is the durable editorial spine.
 */

export interface CashoutCountry {
  slug: string;            // URL slug, e.g. "india"
  country: string;         // "India"
  currency: string;        // ISO receive currency, "INR"
  demonym: string;         // "Indian"
  flag: string;            // emoji
  /** Local cash-out method — how stablecoin actually becomes spendable money. */
  cashoutMethod: string;
  /** The exchanges locals genuinely use (for editorial; live data confirms cost). */
  localExchanges: string[];
  /** Regulatory reality — specific, sourced-in-spirit, not generic. */
  regulatoryNote: string;
  /** Who does this and why — the human context that makes the page unique. */
  whoAndWhy: string;
  /** A country-specific gotcha the reader needs to know. */
  watchOut: string;
  /** Primary send corridors into this country (source currencies). */
  topSourceCurrencies: string[];
}

// Ordered by remittance-market importance. Each has distinct editorial.
export const CASHOUT_COUNTRIES: CashoutCountry[] = [
  {
    slug: "india",
    country: "India",
    currency: "INR",
    demonym: "Indian",
    flag: "🇮🇳",
    cashoutMethod:
      "Sell USDT/USDC on a rupee exchange (CoinDCX, WazirX, CoinDCX-listed pairs) and withdraw to the recipient's bank account by IMPS/UPI — usually within minutes once KYC is cleared.",
    localExchanges: ["CoinDCX", "Coinbase (INR off-ramp)", "WazirX"],
    regulatoryNote:
      "Crypto is legal to hold and trade in India but heavily taxed: a flat 30% tax on gains plus 1% TDS on each sale above the threshold. The recipient — not the sender — bears this on the cash-out, so it materially changes the real receive amount for larger transfers. Exchanges must be FIU-registered.",
    whoAndWhy:
      "India is the world's largest remittance recipient (~$120B/yr). Tech-comfortable NRIs in the US, UK and Gulf increasingly route larger transfers over stablecoins to dodge the 2–4% bank FX markup on USD→INR — the single most-quoted corridor on this site.",
    watchOut:
      "The 1% TDS + 30% gains tax on the recipient side can wipe out the FX saving on small amounts. Crypto only wins clearly on larger, less-frequent transfers where the mid-market gain outweighs the tax.",
    topSourceCurrencies: ["USD", "GBP", "AED", "SGD", "CAD"],
  },
  {
    slug: "philippines",
    country: "Philippines",
    currency: "PHP",
    demonym: "Filipino",
    flag: "🇵🇭",
    cashoutMethod:
      "Sell to PHP on Coins.ph or PDAX and cash out instantly to GCash/Maya e-wallets or a local bank — Coins.ph settles to GCash in seconds, which is why it dominates OFW crypto remittances.",
    localExchanges: ["Coins.ph", "PDAX", "Binance P2P (PHP)"],
    regulatoryNote:
      "The Bangko Sentral ng Pilipinas (BSP) licenses Virtual Asset Service Providers; Coins.ph and PDAX are both BSP-registered, so cash-out is fully legal and e-wallet integrated. No punitive crypto tax on individuals as of 2026.",
    whoAndWhy:
      "OFWs (overseas Filipino workers) send ~$40B/yr home, much of it small and frequent. The GCash + Coins.ph loop makes stablecoin cash-out genuinely one-tap for the recipient — closer to a real product than in most corridors.",
    watchOut:
      "P2P sell rates on Binance can look better than Coins.ph but require the recipient to manage the trade and counterparty risk. For a parent receiving money, the Coins.ph→GCash route is worth a slightly higher spread.",
    topSourceCurrencies: ["USD", "AED", "SGD", "GBP", "HKD"],
  },
  {
    slug: "nigeria",
    country: "Nigeria",
    currency: "NGN",
    demonym: "Nigerian",
    flag: "🇳🇬",
    cashoutMethod:
      "Sell USDT (the dominant stablecoin in Nigeria) on Quidax or via P2P and withdraw to a Nigerian bank account. USDT is effectively a parallel dollar for Nigerians hedging the naira.",
    localExchanges: ["Quidax", "Luno", "Binance P2P (historically)"],
    regulatoryNote:
      "Nigeria's stance has swung hard: the CBN lifted its banking ban on crypto in late 2023 but the SEC now licenses exchanges tightly, and P2P dollar trading has faced scrutiny amid naira-defence measures. Use a locally-licensed exchange (Quidax) rather than grey-market P2P.",
    whoAndWhy:
      "With the naira's steep devaluation, Nigerians in the diaspora and at home treat USDT as a dollar store-of-value. Crypto rails frequently beat the official bank rate by a wide margin — and sometimes beat mid-market outright.",
    watchOut:
      "The gap between the official and parallel USD/NGN rate is the whole story here. 'Beats mid-market' figures reflect the parallel-market reality; a bank transfer at the official rate is a different (worse) product.",
    topSourceCurrencies: ["USD", "GBP", "EUR", "CAD"],
  },
  {
    slug: "mexico",
    country: "Mexico",
    currency: "MXN",
    demonym: "Mexican",
    flag: "🇲🇽",
    cashoutMethod:
      "Sell USDC/USDT on Bitso — Mexico's largest exchange — and withdraw to a CLABE bank account via SPEI, which clears in minutes. Bitso also powers institutional US→MX crypto remittance flows behind the scenes.",
    localExchanges: ["Bitso", "Binance P2P (MXN)"],
    regulatoryNote:
      "Bitso operates under Mexico's Fintech Law and is a regulated exchange; SPEI settlement makes bank withdrawal fast and cheap. Crypto gains are taxable but there is no per-transaction withholding like India's TDS.",
    whoAndWhy:
      "US→Mexico is the world's largest single remittance corridor (~$60B/yr). Bitso has publicly built rails for exactly this flow, so the stablecoin route is unusually mature — real infrastructure, not a workaround.",
    watchOut:
      "Traditional US→MXN providers (Xoom, Remitly) are extremely competitive on this corridor precisely because it's so large, so the crypto edge is thinner here than on India or Nigeria. Compare the live numbers before assuming crypto wins.",
    topSourceCurrencies: ["USD", "CAD"],
  },
  {
    slug: "kenya",
    country: "Kenya",
    currency: "KES",
    demonym: "Kenyan",
    flag: "🇰🇪",
    cashoutMethod:
      "Sell USDT on Luno or via P2P and cash out to M-Pesa — the mobile-money rail nearly every Kenyan uses. The USDT→M-Pesa loop is what makes crypto remittance practical here.",
    localExchanges: ["Luno", "Binance P2P (KES)"],
    regulatoryNote:
      "Kenya has moved toward regulating and taxing digital assets (a Digital Asset Tax applies to transfers). The Central Bank has been cautious, but M-Pesa integration via licensed intermediaries keeps the cash-out route usable.",
    whoAndWhy:
      "Kenya's M-Pesa penetration makes it one of the few markets where crypto cash-out reaches a genuinely unbanked recipient instantly. Diaspora senders in the US/UK use it to beat both bank fees and traditional MTO markups.",
    watchOut:
      "The Digital Asset Tax and M-Pesa cash-out fees eat into the saving on small amounts. As with most corridors, crypto's edge grows with transfer size.",
    topSourceCurrencies: ["USD", "GBP", "EUR"],
  },
  {
    slug: "brazil",
    country: "Brazil",
    currency: "BRL",
    demonym: "Brazilian",
    flag: "🇧🇷",
    cashoutMethod:
      "Sell USDC/USDT on Mercado Bitcoin (Latin America's largest exchange) or OKX and withdraw to a bank account via PIX — Brazil's instant-payment system that settles 24/7 in seconds.",
    localExchanges: ["Mercado Bitcoin", "OKX (BRL)"],
    regulatoryNote:
      "Brazil passed a comprehensive crypto legal framework in 2023 with the Central Bank as regulator; exchanges are licensed and PIX withdrawal is instant and near-free. Crypto gains are taxable but the rails are legitimate and mainstream.",
    whoAndWhy:
      "PIX makes Brazil one of the best cash-out experiences anywhere — stablecoin to spendable reais in seconds, any hour. Combined with a frequently favourable USD/BRL crypto rate, it's a strong corridor for the tech-comfortable sender.",
    watchOut:
      "BRL is volatile; the mid-market rate you're compared against can move meaningfully between quote and settlement. The speed of PIX cash-out helps limit that exposure.",
    topSourceCurrencies: ["USD", "EUR", "GBP"],
  },
];

export function getCashoutCountry(slug: string): CashoutCountry | undefined {
  return CASHOUT_COUNTRIES.find((c) => c.slug === slug);
}

/** Map a receive currency (from a corridor page) to its cash-out country slug. */
export function cashoutSlugForCurrency(currency: string): string | undefined {
  return CASHOUT_COUNTRIES.find((c) => c.currency === currency)?.slug;
}
