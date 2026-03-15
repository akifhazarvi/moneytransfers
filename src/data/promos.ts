export interface PromoInfo {
  providerSlug: string;
  signUpOffer: string | null;
  signUpBadge: string | null;
  promoCode: string | null;
  referralProgram: {
    referrerReward: string;
    refereeReward: string;
    conditions: string;
  } | null;
  referralBadge: string | null;
  loyaltyProgram: string | null;
  lastVerified: string;
}

export const promos: PromoInfo[] = [
  {
    providerSlug: "wise",
    signUpOffer: "Fee-free first transfer up to ~$800 (GBP 500 equivalent)",
    signUpBadge: "Free first transfer",
    promoCode: null,
    referralProgram: {
      referrerReward: "Up to $115 for every 3 friends who transfer $300+",
      refereeReward: "Fee-free first transfer (up to ~GBP 500)",
      conditions: "Friend must sign up via referral link and send $300+. Invite link expires after 6 months if unused.",
    },
    referralBadge: "Earn $38+",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "remitly",
    signUpOffer: "$25 off first transfer of $100+ with zero fees and special exchange rate",
    signUpBadge: "$25 off",
    promoCode: null,
    referralProgram: {
      referrerReward: "$25 per referral",
      refereeReward: "$25 off first transfer + zero fees + promo rate",
      conditions: "Friend must complete first transfer of $100+. No limit on referrals.",
    },
    referralBadge: "Earn $25",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "ofx",
    signUpOffer: "Better introductory exchange rate on first transfer across 7 major currencies (USD, CAD, AUD, NZD, GBP, EUR, SGD)",
    signUpBadge: "Better intro rate",
    promoCode: null,
    referralProgram: null,
    referralBadge: null,
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "xe",
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    referralProgram: {
      referrerReward: "$25–$50 gift card depending on friend's transfer amount",
      refereeReward: "$25 gift card (transfer $1,000+) or $50 gift card (transfer $5,000+)",
      conditions: "Friend must enter referral code on first transfer. Gift cards emailed within 14 working days.",
    },
    referralBadge: "Earn $50",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "western-union",
    signUpOffer: "First international transfer fee-free",
    signUpBadge: "Free first transfer",
    promoCode: null,
    referralProgram: {
      referrerReward: "$15 Amazon e-gift code per referral (up to 20 friends)",
      refereeReward: "$10 Amazon e-gift code after first qualifying transfer",
      conditions: "Friend must complete first qualifying transfer. Max 20 referrals.",
    },
    referralBadge: "Earn $15",
    loyaltyProgram: "My WU Rewards — earn points on qualifying transfers (currently paused, new program coming soon)",
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "worldremit",
    signUpOffer: "First 3 transfers fee-free",
    signUpBadge: "3 free transfers",
    promoCode: "3FREE",
    referralProgram: {
      referrerReward: "$20 voucher per referral",
      refereeReward: "$20 voucher after first transfer of ~$130+",
      conditions: "Friend must sign up and send minimum amount (~GBP 100 equivalent).",
    },
    referralBadge: "Earn $20",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "revolut",
    signUpOffer: "Variable sign-up bonus depending on region and campaign (up to GBP 100 for Business)",
    signUpBadge: "Up to £100",
    promoCode: null,
    referralProgram: {
      referrerReward: "Up to GBP 60 per referral",
      refereeReward: "GBP 10–200 depending on campaign",
      conditions: "Friend must sign up via link, order physical card, and make 3 purchases of GBP 5+.",
    },
    referralBadge: "Earn £60",
    loyaltyProgram: "Tiered subscription plans (Standard, Plus, Premium, Metal, Ultra) with increasing benefits",
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "paypal",
    signUpOffer: "$10 when signing up via a referral link",
    signUpBadge: "$10 bonus",
    promoCode: null,
    referralProgram: {
      referrerReward: "$10 per referral (up to 5 friends, $50 max)",
      refereeReward: "$10 after signing up and spending/sending $5+",
      conditions: "Friend must link bank/card and spend or send $5+. Max 5 referrals.",
    },
    referralBadge: "Earn $10",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "moneygram",
    signUpOffer: "20% off fee on second transfer when joining MoneyGram Plus Rewards",
    signUpBadge: "20% off 2nd fee",
    promoCode: null,
    referralProgram: {
      referrerReward: "Zero-fee transfer after friend completes first transaction",
      refereeReward: "Zero-fee first transfer",
      conditions: "Friend must complete first transaction within 30 days.",
    },
    referralBadge: "Free transfer",
    loyaltyProgram: "MoneyGram Plus Rewards — free to join, earn points on transfers. Premier status after 5 transfers: 40% off every 5th transfer.",
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "xoom",
    signUpOffer: "First transfer with no fees",
    signUpBadge: "Free first transfer",
    promoCode: null,
    referralProgram: {
      referrerReward: "$20 e-gift card per referral",
      refereeReward: "Fee-free first transfer",
      conditions: "Friend must complete first international transfer.",
    },
    referralBadge: "Earn $20",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "torfx",
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    referralProgram: {
      referrerReward: "GBP 50 per referral",
      refereeReward: "GBP 50 on first transfer",
      conditions: "Friend must transfer GBP 2,000+ (or currency equivalent). No limit on referrals.",
    },
    referralBadge: "Earn £50",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "instarem",
    signUpOffer: "125 InstaPoints (~$1.25) on sign-up",
    signUpBadge: "125 points free",
    promoCode: null,
    referralProgram: {
      referrerReward: "200 InstaPoints (~$2.50) per referral",
      refereeReward: "200 InstaPoints (~$2.50) on first transfer",
      conditions: "Valid until March 31, 2026. Points redeemable at checkout (400 points = $10).",
    },
    referralBadge: "Earn $2.50",
    loyaltyProgram: "InstaPoints — earn points on transfers over $500, redeem at checkout (400 points = $10 discount)",
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "taptap-send",
    signUpOffer: "$20/GBP 20/EUR 20 bonus on first transfer with promo code",
    signUpBadge: "$20 bonus",
    promoCode: null,
    referralProgram: {
      referrerReward: "$5/GBP 5/EUR 5 per referral",
      refereeReward: "$5/GBP 5/EUR 5 on first transfer",
      conditions: "Friend must be a new customer and complete first transfer. No limit on referrals.",
    },
    referralBadge: "Earn $5",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
  {
    providerSlug: "ace-money-transfer",
    signUpOffer: "First transfer fee-free",
    signUpBadge: "Free first transfer",
    promoCode: null,
    referralProgram: {
      referrerReward: "EUR 15 wallet credit per referral + monthly prizes (iPhone, Apple Watch, AirPods)",
      refereeReward: "EUR 15 wallet credit on first transfer",
      conditions: "Top 3 referrers each month (min 12 referrals) win prizes. Wallet credits redeemable on next transfer.",
    },
    referralBadge: "Earn €15",
    loyaltyProgram: null,
    lastVerified: "2026-03-14",
  },
];

export function getPromo(slug: string): PromoInfo | undefined {
  return promos.find((p) => p.providerSlug === slug);
}
