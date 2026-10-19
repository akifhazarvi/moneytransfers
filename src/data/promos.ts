export interface PromoInfo {
  providerSlug: string;
  signUpOffer: string | null;
  /**
   * The sending currencies the sign-up offer is open to, when the provider
   * limits it (Western Union's is US-only). Absent: not limited, or not stated.
   */
  offerSendCurrencies?: string[];
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
    // wise.com/gb/large-amounts + /gb/legal/first-large-transfer-promotion-2026, and
    // wise.com/campaign/universal-invite + help article 2487043, checked 2026-10-18.
    // The old "fee-free first transfer up to £500" is only an invitee's choice, not
    // a general offer; referrer amounts sit behind the logged-in invite page.
    signUpOffer: "Fees from 0.12% on a first transfer over $70,000, £50,000 or €60,000, for new personal customers who sign up until February 19, 2027 (selected routes)",
    offerSendCurrencies: ["USD", "GBP", "EUR"],
    signUpBadge: "Large first transfer",
    promoCode: null,
    referralProgram: {
      referrerReward: "A reward for every 3 friends who qualify (amount set by region, shown in your account)",
      refereeReward: "A free card or a discount on their first transfer, used within 6 months of signing up",
      conditions: "Each friend must make an international transfer of at least 200 GBP or the equivalent. Rewards can be claimed within a year of qualifying.",
    },
    referralBadge: "Reward per 3 friends",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "remitly",
    // remitly.com/us/en/{mexico,philippines,india}, /gb/en/india and
    // /us/en/home/referral-offer-program, checked 2026-10-18. No "$25 off" is
    // published any more; referral rewards are not stated as amounts.
    signUpOffer: "A special exchange rate and no fees on your first transfer, for new customers. The special rate covers a capped amount that varies by route, such as the first USD 1,000 to Mexico",
    signUpBadge: "First-transfer rate",
    promoCode: null,
    referralProgram: {
      referrerReward: "A reward on your next transfer (such as a discount, bonus or fee-free transfer), for up to 20 referrals",
      refereeReward: "A reward once they complete their first transfer",
      conditions: "Friends must be new Remitly users and additional send requirements may apply. Rewards for up to 20 successful referrals.",
    },
    referralBadge: "Rewards for both",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "ofx",
    // ofx.com/en-us/personal and /en-us/introductory-rate-faqs, checked 2026-10-18.
    signUpOffer: "An introductory rate on your first personal transfer booked online, in USD, CAD, AUD, NZD, GBP, EUR or SGD. No minimum amount",
    offerSendCurrencies: ["USD", "CAD", "AUD", "NZD", "GBP", "EUR", "SGD"],
    signUpBadge: "Better intro rate",
    promoCode: null,
    referralProgram: null,
    referralBadge: null,
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "xe",
    // help.xe.com articles 360020025678 and 18191731524625, checked 2026-10-18.
    // UK, EU and AU/NZ amounts differ between Xe's help centre and its terms
    // pages, so only the US and Canadian figures (which agree) are given.
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    referralProgram: {
      referrerReward: "A gift card each for you and your friend: USD 50 in the US, CAD 25 in Canada; other regions vary",
      refereeReward: "The same gift card once their transfers reach USD 5,000 (US) or CAD 1,000 (Canada)",
      conditions: "The friend enters the referral code on their first transfer and can reach the total over several transfers. Not for business customers.",
    },
    referralBadge: "Earn $50 (US)",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "western-union",
    // westernunion.com/us/en/promotions, /refer-a-friend, /rewards/home, checked
    // 2026-10-18. Other countries run their own versions, not checked.
    signUpOffer: "0 USD transfer fee on your first online transfer from the US. Not for Quick Collect, transfers within the US, credit cards or Google Play",
    offerSendCurrencies: ["USD"],
    signUpBadge: "Free first transfer",
    promoCode: null,
    referralProgram: {
      referrerReward: "A reward per qualifying referral, set by campaign (shown in your account)",
      refereeReward: "0 USD transfer fee on their first international digital transfer",
      conditions: "Rewards can take up to 15 business days and expire 6 months after processing. The referral limit is shown in your account.",
    },
    referralBadge: "Referral reward",
    loyaltyProgram: "Western Union Rewards (US): 100 points per online transfer; 500 points take up to $2 off a transfer fee",
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "worldremit",
    // worldremit.com/en-us, /en-gb and /en/faq/refer-a-friend, checked 2026-10-18.
    // 3FREE survives only on an unlinked 2023 landing page, so it is not listed.
    signUpOffer: "An enhanced exchange rate on your first transfer, for new customers, on selected routes and delivery methods. Fees still apply",
    signUpBadge: "First-transfer rate",
    promoCode: null,
    referralProgram: {
      referrerReward: "A voucher set by route: GBP 20 from the UK to most countries, USD 20–35 from the US, AUD 35 from Australia",
      refereeReward: "A voucher set by route: GBP 10 from the UK, USD 5–15 from the US, AUD 25 from Australia",
      conditions: "You need one completed transfer to get a referral code. Both vouchers arrive once the friend sends the route's minimum amount; each can be used once before it expires.",
    },
    referralBadge: "Vouchers for both",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "revolut",
    // revolut.com/en-GB/legal/referrals-terms, /en-US/legal/referrals-terms and
    // /en-GB/our-pricing-plans, checked 2026-10-18. No public personal sign-up
    // bonus; Business welcome bonuses are country-specific invitation links.
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    referralProgram: {
      referrerReward: "The reward set out in your invitation (UK: a prize draw from GBP 10 to GBP 200)",
      refereeReward: "Set out in the invitation where applicable; none in the US",
      conditions: "Invitation-only. The friend opens an account, tops up, orders a physical card and makes the card purchases the invitation sets.",
    },
    referralBadge: "By invitation",
    loyaltyProgram: "Tiered subscription plans (Standard, Plus, Premium, Metal, Ultra) with increasing benefits",
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "paypal",
    // paypal.com/{us,uk,ca}/campaign/invite/terms, checked 2026-10-18. The invite
    // reward needs a checkout payment; sending money does not qualify, so it is
    // not a transfer offer. The UK programme ended on 30 June 2026.
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    referralProgram: {
      referrerReward: "1,000 PayPal Rewards points per friend in the US, CAD 10 in Canada, for up to 10 friends a year",
      refereeReward: "The same reward after a PayPal checkout payment of $5 or more within 30 days of signing up",
      conditions: "Sending money does not count as the qualifying payment.",
    },
    referralBadge: "Checkout reward",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "moneygram",
    // moneygram.com/us/en/services/invite-friends and
    // /refer-a-friend-program-information, checked 2026-10-18. The Plus Rewards
    // discounts appear only in an old PDF and the programme page is gone.
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    referralProgram: {
      referrerReward: "A reward when an invited friend sends their first transfer, for up to 10 friends (US online customers)",
      refereeReward: "A discount on their first qualifying international transfer",
      conditions: "Amounts, minimums and eligible transfer types vary by country and are shown in your account. The referrer's discount expires after 60 days.",
    },
    referralBadge: "Discount for both",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "xoom",
    // xoom.com/legal/xoom-new-user-promo (from August 8, 2026), checked 2026-10-18.
    // The fee-free first transfer was a 2022 campaign; the referral page is gone.
    signUpOffer: "A promotional rate on your first transfer to China, Colombia (mobile wallets), Guatemala, India or Mexico, for US residents new to Xoom or inactive for 12 months",
    offerSendCurrencies: ["USD"],
    signUpBadge: "First-transfer rate",
    promoCode: null,
    referralProgram: null,
    referralBadge: null,
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "torfx",
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    // torfx.com/refer-a-friend, checked 2026-10-18 (terms effective 2024-12-01).
    referralProgram: {
      referrerReward: "GBP 50 account credit per referral (EUR for EU customers)",
      refereeReward: "GBP 50 account credit once they transfer £2,000 or more",
      conditions: "UK and EU customers only. The friend must be new to TorFX and transfer £2,000 or the equivalent (one or several payments); credit arrives within 30 days. No limit on referrals.",
    },
    referralBadge: "Earn £50",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "instarem",
    // instarem.com/help-personal/instapoints and /referral-bonus, checked 2026-10-18.
    // Instarem prices InstaPoints only in SGD, so no USD value is given.
    signUpOffer: "25 InstaPoints on sign-up, plus 100 more if you verify within 36 hours",
    signUpBadge: "Up to 125 InstaPoints",
    promoCode: null,
    referralProgram: {
      referrerReward: "Cash bonus set by country (USD 50, GBP 40, EUR 40, CAD 70, AUD 70) plus 200 InstaPoints, for up to 10 referrals",
      refereeReward: "200 InstaPoints plus a discounted fee or special rate on the first transfer",
      conditions: "Valid until November 30, 2026. The friend's first transfer must meet a minimum (USD 300, GBP 100, EUR 100); the referrer's bonus needs the friend to send more (USD 2,000, GBP 1,000, EUR 1,000). Not for business accounts.",
    },
    referralBadge: "Earn up to $50",
    loyaltyProgram: "InstaPoints: earned on transfers of USD 500 or more, redeemed 100–400 points per transfer as a discount",
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "taptap-send",
    // help.taptapsend.com (bonus-and-referrals) and taptapsend.com/referrals-terms,
    // checked 2026-10-18. No standing sign-up bonus is published; referral amounts
    // vary by route and are shown only in the app, so none is stated here.
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    referralProgram: {
      referrerReward: "Bonus set by route, shown in the app",
      refereeReward: "Bonus on the first transfer, set by route, shown in the app",
      conditions: "Both receive the bonus when the friend completes a first transfer. Up to 20 referrals per rolling 30 days; a minimum transfer may apply; rewards expire after 90 days.",
    },
    referralBadge: "Bonus for both",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
  {
    providerSlug: "ace-money-transfer",
    // acemoneytransfer.com/terms-and-conditions-wallet ("Invite a Friend", effective
    // 2025-11-20), checked 2026-10-18. The fee-free first transfer appears only in
    // 2021 and 2024 blog posts, not in current terms, so it is not listed.
    signUpOffer: null,
    signUpBadge: null,
    promoCode: null,
    referralProgram: {
      referrerReward: "£10 (or local equivalent) wallet credit per referral, plus monthly prizes for the top three referrers",
      refereeReward: "£10 (or local equivalent) wallet credit",
      conditions: "The friend's first paid transfer must be at least £100 or €100 (local minimums vary). Credits can cover up to half of a later transfer. Monthly prizes need 12+ referrals. Transfers to Nigeria follow different rules.",
    },
    referralBadge: "Earn £10",
    loyaltyProgram: null,
    lastVerified: "2026-10-18",
  },
];

export function getPromo(slug: string): PromoInfo | undefined {
  return promos.find((p) => p.providerSlug === slug);
}
