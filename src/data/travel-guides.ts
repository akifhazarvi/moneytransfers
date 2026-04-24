/**
 * Travel hub data — country-level travel + money guides.
 *
 * Built for traditional SEO AND Generative Engine Optimization (GEO).
 * Each field is designed to be directly citable by AI search (ChatGPT,
 * Perplexity, Google AI Overviews): short answer-first passages, specific
 * numeric facts, dated claims, and clearly attributable source material.
 *
 * Schema is deliberately wide — travel search is a dense SERP where depth
 * wins. Thin country pages lose to Lonely Planet / Wikivoyage. Our wedge is
 * the money + connectivity layer (currency notes, FX, eSIM, cash vs card)
 * which sits between travel-guide and fintech content.
 */

export interface TravelFAQ {
  question: string;
  answer: string;
}

export interface CurrencyNote {
  denomination: string;
  color: string;
  figure: string;
  imageUrl?: string;
}

export interface CashVsCard {
  cashAcceptance: string;
  cardAcceptance: string;
  atmAvailability: string;
  tippingNorms: string;
  commonScams: string[];
}

export interface TravelGuideContent {
  /** URL slug, e.g. "thailand" */
  slug: string;
  /** Display name */
  countryName: string;
  /** ISO alpha-2 country code for flag + maps */
  countryCode: string;
  /** Continent / region for breadcrumb */
  region: string;
  /** ISO currency code */
  currency: string;
  currencyName: string;
  currencySymbol: string;
  /** Currency corridors travelers typically convert from */
  topSourceCurrencies: string[];
  /** Capital city */
  capital: string;
  /** Official languages */
  languages: string[];
  /** Calling code, e.g. "+66" */
  callingCode: string;
  /** Plug types (letters), e.g. ["A","B","C"] */
  plugTypes: string[];
  /** Voltage string, e.g. "220V / 50Hz" */
  voltage: string;
  /** Timezone(s) */
  timezone: string;

  /** Short TL;DR (2-3 sentences) — optimized for AI Overview extraction */
  tldr: string;
  /** Author byline slug — must match authors.ts */
  authorSlug: string;
  /** YYYY-MM-DD publish date */
  publishedDate: string;
  /** YYYY-MM-DD last-updated — bump when content changes */
  updatedDate: string;

  /** Hero intro — 2-3 paragraphs, the answer-first passage for "travel to [country]" */
  intro: string;
  /** Key stats block — 4-6 data points for snippet bait */
  keyStats: { label: string; value: string }[];

  /** Culture & etiquette — dos and don'ts */
  culture: {
    overview: string;
    dos: string[];
    donts: string[];
  };

  /** Money & connectivity */
  money: CashVsCard;
  notes: CurrencyNote[];
  /** Short guide: exchanging money */
  exchangeGuide: string;

  /** Local sports / pastimes — short paragraph, cultural color */
  sports: {
    overview: string;
    highlights: string[];
  };

  /** Best time to visit, weather, seasonality */
  bestTime: string;
  /** Visa summary for major source countries (US/UK/EU/Aus) */
  visa: string;
  /** Safety overview */
  safety: string;
  /** Must-visit destinations (cities, regions) */
  highlights: { name: string; summary: string }[];

  /** Typical daily budget in USD for backpacker / mid / luxury */
  budget: {
    backpacker: string;
    midRange: string;
    luxury: string;
    note: string;
  };

  /** 8-12 FAQs — targets real Google PAA queries AND AI prompt patterns */
  faqs: TravelFAQ[];

  /** Send-money corridor slug to cross-link (/send-money/[slug]) */
  relatedCorridorSlug?: string;
}

export const travelGuides: Record<string, TravelGuideContent> = {
  thailand: {
    slug: "thailand",
    countryName: "Thailand",
    countryCode: "th",
    region: "Southeast Asia",
    currency: "THB",
    currencyName: "Thai Baht",
    currencySymbol: "฿",
    topSourceCurrencies: ["USD", "GBP", "EUR", "AUD"],
    capital: "Bangkok",
    languages: ["Thai"],
    callingCode: "+66",
    plugTypes: ["A", "B", "C"],
    voltage: "220V / 50Hz",
    timezone: "ICT (UTC+7)",

    tldr:
      "Thailand uses the Thai Baht (฿, THB) — as of April 2026, 1 USD is worth roughly 36 THB. Most major source currencies (USD, GBP, EUR) are easily exchanged at SuperRich and Value Plus booths in Bangkok, which offer the best rates. Cash is king outside tourist zones; cards work in hotels, malls, and upscale restaurants. An eSIM (AIS, dtac, or Airalo) costs $5–15 for 7–15 days of 4G/5G data — far cheaper than roaming.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-04-23",
    updatedDate: "2026-04-23",

    intro:
      "Thailand welcomed over 35 million international visitors in 2024, making it the most-visited country in Southeast Asia. From Bangkok's street food scene to the limestone karsts of Krabi and the temples of Chiang Mai, it draws travelers across every budget band — and the economics still strongly favor the visitor. A sit-down Pad Thai costs 60–80 THB (roughly $1.70–$2.25), a BTS skytrain ride across Bangkok is under 45 THB, and domestic flights between major cities regularly go for 800–1,500 THB.\n\nThis guide covers everything you need to handle money and connectivity on the ground: the Thai Baht in practice, where to exchange at the best rates, what notes and coins actually look like, cultural etiquette that saves you face (literally — it's a concept here), and how an eSIM compares to a local SIM or roaming. We've also linked to our live FX comparison if you need to send money into or out of Thailand at mid-market rates.",
    keyStats: [
      { label: "Currency", value: "Thai Baht (฿, THB)" },
      { label: "Typical daily cost (mid-range)", value: "$40–$80 USD" },
      { label: "Best time to visit", value: "November – February (cool dry season)" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "60-day visa exemption on arrival" },
      { label: "Power", value: "220V / 50Hz, plug types A, B, C" },
      { label: "Tipping", value: "Not expected; round up for good service" },
    ],

    culture: {
      overview:
        "Thai culture places heavy weight on social harmony, respect for the monarchy, and 'saving face' (not causing public embarrassment). Buddhism shapes daily life — around 93% of Thais identify as Theravada Buddhist — and temples (wat) are active places of worship, not museums. A calm, smiling demeanor (the famous 'Land of Smiles') goes a long way; losing your temper in public is genuinely shocking here.",
      dos: [
        "Remove your shoes before entering temples, homes, and many guesthouses. A shoe rack or pile of sandals at the door is the cue.",
        "Dress modestly at temples — shoulders and knees covered. Sarongs are usually available to borrow at major sites.",
        "Return a wai (palms pressed, slight bow) if someone offers you one first. Monks don't wai laypeople, so don't expect one back.",
        "Use your right hand to give or receive money, especially from elders — or both hands for extra respect.",
        "Stand still for the national anthem at 8am and 6pm in public parks and before cinema screenings. Everyone does.",
      ],
      donts: [
        "Never touch anyone's head — it's considered the highest, most sacred part of the body. This includes kids.",
        "Never point your feet at a person, a Buddha image, or anyone else. Feet are the lowest, least clean part of the body.",
        "Never disrespect the monarchy — lèse-majesté laws carry real prison sentences (up to 15 years) and apply to foreigners.",
        "Don't touch a monk if you're a woman. Monks cannot receive anything directly from women; place items on a cloth instead.",
        "Don't climb on Buddha statues for photos. This is not just rude — it has resulted in deportation for tourists.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash is accepted everywhere and is essential outside Bangkok, Chiang Mai, and the main tourist islands. Street food, tuk-tuks, songthaews, small shops, and most temples are cash-only. Carry small notes (20s and 100s) — vendors often can't break a 1,000 THB bill.",
      cardAcceptance:
        "Visa and Mastercard are accepted at international hotel chains, mid-range and upscale restaurants, department stores (Central, Siam Paragon), 7-Eleven (for purchases above ~100 THB), and most tour operators. American Express acceptance is spotty. Contactless (tap) works at most card-accepting venues.",
      atmAvailability:
        "ATMs are everywhere in cities and tourist areas. A 220 THB foreign-card withdrawal fee applies — this is set by Thai banks and cannot be avoided. Withdraw larger amounts less often to amortize the fee. Always choose to be charged in THB, not your home currency (DCC adds a 3–6% markup).",
      tippingNorms:
        "Tipping is not customary or expected. Rounding up a restaurant bill or leaving loose coins is typical; 20–50 THB to housekeeping, porters, or a spa therapist is appreciated. High-end restaurants may add a 10% service charge already.",
      commonScams: [
        "Tuk-tuk drivers offering a 20 THB city tour — they'll take you to gem shops and suit tailors where they earn commission. Politely decline.",
        "'The Grand Palace is closed today' — it's a setup to redirect you to overpriced gem shops. It's open. Check hours on your phone.",
        "Taxi meter scams — insist on the meter ('meter please'). If the driver refuses, get the next one. Grab and Bolt apps remove the negotiation entirely.",
        "DCC (Dynamic Currency Conversion) at ATMs and card terminals — always choose to be charged in THB, never your home currency.",
        "Jet ski damage scams on tourist beaches (notoriously Phuket) — inspect and photograph every jet ski before renting.",
      ],
    },

    notes: [
      {
        denomination: "20 THB",
        color: "Green",
        figure: "King Rama IX (obverse), King Rama II (reverse)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/20_Baht_obverse.jpg/320px-20_Baht_obverse.jpg",
      },
      {
        denomination: "50 THB",
        color: "Blue",
        figure: "King Rama IX (obverse), King Rama III (reverse)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/50_Baht_obverse.jpg/320px-50_Baht_obverse.jpg",
      },
      {
        denomination: "100 THB",
        color: "Red",
        figure: "King Rama IX (obverse), King Rama V (reverse)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/100_Baht_obverse.jpg/320px-100_Baht_obverse.jpg",
      },
      {
        denomination: "500 THB",
        color: "Purple",
        figure: "King Rama IX (obverse), King Rama IV (reverse)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/500_Baht_obverse.jpg/320px-500_Baht_obverse.jpg",
      },
      {
        denomination: "1,000 THB",
        color: "Grey / Brown",
        figure: "King Rama IX (obverse), King Rama IX and development projects (reverse)",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/1000_Baht_obverse.jpg/320px-1000_Baht_obverse.jpg",
      },
    ],

    exchangeGuide:
      "The best THB exchange rates in Thailand come from dedicated booths like SuperRich (orange and green branches), Value Plus, and X-One — these typically beat airport kiosks by 2–4% and beat hotel exchange by 5–8%. Avoid changing money at the airport beyond what you need for a taxi (roughly 500 THB / $15). In Bangkok, SuperRich has branches at Rajdamri, Pratunam, and in most malls. Bring clean, unmarked notes — torn or heavily-written USD/GBP bills are often refused or given a worse rate. For larger transfers (rent, school fees, property), use a specialist like Wise or OFX to send THB directly into a Thai bank account at near-mid-market rates.",

    sports: {
      overview:
        "Muay Thai (Thai boxing) is the national sport and part of the cultural fabric — not a tourist spectacle. Watching a live fight at Rajadamnern or Lumpinee Stadium in Bangkok is a genuine cultural experience, with betting, live music (the piphat), and ceremonial pre-fight dance (wai kru ram muay). Football (soccer) is the most-watched sport; Thai fans are deeply into the English Premier League. Takraw, played with a rattan ball using only feet, head, and chest, is a common sight in public parks.",
      highlights: [
        "Muay Thai fights: Rajadamnern Stadium (Tuesdays, Thursdays, Sundays) and Lumpinee Stadium (Bangkok).",
        "Sepak Takraw — kick-volleyball played in almost every village square.",
        "Royal Bangkok Sports Club and Thailand Open (ATP tennis tour, Bangkok, September).",
        "Thailand Premier League (Thai League 1) — affordable matchday tickets at 100–300 THB.",
      ],
    },

    bestTime:
      "November to February is the cool dry season and the peak tourist window — temperatures in Bangkok sit around 25–30°C with low humidity. March to May is the hot season (35–40°C) when deals are easier to find but outdoor sightseeing becomes draining. June to October is the rainy season — showers are usually short and heavy, rooms are cheapest, and islands like Koh Samui (east coast) actually stay drier than Phuket (west coast) in this window. Songkran (Thai New Year, April 13–15) is a water-fight festival — fun, but expect everything to close and every tourist to be on the road.",
    visa:
      "As of 2026, passport holders from the US, UK, EU, Canada, Australia, and New Zealand can enter Thailand visa-free for up to 60 days under the visa exemption scheme (extended from the previous 30 days in July 2024). This can be extended once by 30 days at an immigration office for 1,900 THB. For stays over 90 days, an SETV (Single Entry Tourist Visa), DTV (Destination Thailand Visa — digital nomads), or Education/Retirement visa applies. Always verify current rules at your nearest Royal Thai Embassy before travel — policies change.",
    safety:
      "Thailand is broadly safe for tourists — violent crime against foreigners is rare. The main risks are road traffic (Thailand has one of the world's highest motorcycle fatality rates; wear a helmet, every time, even on a 2-minute ride), petty theft in tourist zones, and scams (detailed above). Avoid the deep south provinces of Pattani, Yala, and Narathiwat where there is a low-level insurgency — this is the only region with a Western government travel advisory as of 2026. Tap water is not drinkable; bottled water is 7 THB everywhere.",
    highlights: [
      {
        name: "Bangkok",
        summary:
          "Capital, 11M+ people, home to the Grand Palace, Wat Pho (reclining Buddha), Chatuchak weekend market, and the Chao Phraya riverside. Budget 3–4 days to cover the essentials plus rooftop bars and street food.",
      },
      {
        name: "Chiang Mai",
        summary:
          "Walled old city in the northern hills, famous for temples (Wat Phra That Doi Suthep), ethical elephant sanctuaries, and cooking classes. Cooler climate, slower pace than Bangkok.",
      },
      {
        name: "Krabi & Phi Phi Islands",
        summary:
          "Limestone karsts, emerald water, Railay Beach (climbing), and Maya Bay on Phi Phi Leh (reopened with visitor caps in 2022). Base in Ao Nang for easier logistics.",
      },
      {
        name: "Phuket",
        summary:
          "Largest Thai island, airport hub, best for first-timers wanting beach + nightlife (Patong). Quieter beaches: Kata, Karon, Nai Harn. Old Town is genuinely beautiful and under-visited.",
      },
      {
        name: "Koh Samui & Koh Pha Ngan",
        summary:
          "Gulf of Thailand islands, drier in the June–October window than the Andaman coast. Pha Ngan hosts the Full Moon Party; Samui is more family-friendly.",
      },
      {
        name: "Ayutthaya",
        summary:
          "UNESCO World Heritage ruins of Thailand's former capital, 90 minutes north of Bangkok. Doable as a day trip; rent a bike to cover ground between the brick temple complexes.",
      },
    ],

    budget: {
      backpacker: "$25–$40 USD per day",
      midRange: "$40–$80 USD per day",
      luxury: "$150+ USD per day",
      note:
        "Backpacker assumes hostel dorms, street food, public transport. Mid-range assumes 3-star private room, mix of street and restaurant meals, occasional Grab. Luxury covers 4–5 star hotels, nicer restaurants, and private transfers. Bangkok and Phuket skew ~15% more expensive than Chiang Mai or Isaan.",
    },

    faqs: [
      {
        question: "Is Thailand cheap for American tourists in 2026?",
        answer:
          "Yes. As of April 2026, 1 USD ≈ 36 THB, which keeps Thailand among the best value destinations in Asia. A mid-range traveler can live comfortably on $40–$80 per day including 3-star hotels, restaurant meals, and local transport. Backpackers can stretch to $25–$40 per day. Bangkok and Phuket are the most expensive cities; Chiang Mai, Isaan, and smaller islands are meaningfully cheaper.",
      },
      {
        question: "What's the best way to exchange USD/GBP/EUR to Thai Baht?",
        answer:
          "The best rates are at SuperRich, Value Plus, and X-One exchange booths in Bangkok — typically 2–4% better than airport kiosks and 5–8% better than hotels. At Suvarnabhumi airport, change only what you need for a taxi (roughly 500 THB). Bring clean, unmarked bills. For larger amounts, Wise or OFX can transfer at mid-market rates directly into a Thai bank account.",
      },
      {
        question: "Do I need cash in Thailand or do cards work everywhere?",
        answer:
          "You need cash. Cards work at hotels, malls, upscale restaurants, and 7-Eleven (above ~100 THB), but street food, tuk-tuks, taxis, songthaews, markets, and most temples are cash-only. Carry 500–1,000 THB in small notes daily. ATMs charge a 220 THB foreign-card fee, so withdraw in larger amounts less often. Always choose to be charged in THB, not your home currency.",
      },
      {
        question: "What is an eSIM and do I need one for Thailand?",
        answer:
          "An eSIM is a digital SIM profile you install on your phone (no physical card) that gives you mobile data on a local network. For Thailand, an eSIM from Airalo, Holafly, or the Thai carriers AIS and dtac costs $5–$15 for 7–15 days of 4G/5G data — significantly cheaper than roaming with most US/UK carriers. Activate before you fly; you'll have data the moment you land. Your phone must be eSIM-compatible (iPhone XS and newer; most Pixel and Samsung flagships from 2020+).",
      },
      {
        question: "Is Thailand visa-free for US/UK/EU/Australian citizens?",
        answer:
          "Yes, as of 2026. Passport holders from the US, UK, EU, Canada, Australia, and New Zealand receive a 60-day visa-free entry stamp on arrival (extended from 30 days in July 2024). It can be extended once by 30 days at an immigration office for 1,900 THB. Your passport must have at least 6 months validity and one blank page.",
      },
      {
        question: "What's the best time of year to visit Thailand?",
        answer:
          "November to February is the cool dry season and the peak window — 25–30°C in Bangkok, low humidity, minimal rain. March to May is the hot season (up to 40°C). June to October is the rainy season, when rooms are cheapest and the Gulf islands (Koh Samui, Koh Pha Ngan) actually stay drier than the Andaman coast (Phuket, Krabi).",
      },
      {
        question: "How much does Muay Thai cost to watch live in Bangkok?",
        answer:
          "At Rajadamnern Stadium, tickets range from 1,000 THB (third class) to 2,500 THB (ringside). At Lumpinee Stadium, expect 1,500–2,500 THB. Fight nights are typically Tuesdays, Thursdays, and Sundays. Buy at the stadium box office on the day to avoid tout markups of 30–50%. Eight fights per night; main event usually around 9:30pm.",
      },
      {
        question: "Is tap water safe to drink in Thailand?",
        answer:
          "No. Tap water in Thailand is not considered safe for foreign visitors. Drink bottled water (7 THB everywhere) or use a filter bottle. Ice at restaurants and hotels is generally safe — it's made commercially from filtered water in standardized cylindrical or tube shapes. Avoid loose, irregular ice from street vendors.",
      },
      {
        question: "Do I tip in Thailand?",
        answer:
          "Tipping is not customary. Rounding up a restaurant bill or leaving loose coins is normal. 20–50 THB for housekeeping, porters, or a spa therapist is appreciated but not expected. Higher-end restaurants often already include a 10% service charge, so check the bill first.",
      },
      {
        question: "Can I send money from Thailand back home or to Thailand at a good rate?",
        answer:
          "Yes. Services like Wise, OFX, Instarem, and Remitly let you send THB abroad or send USD/GBP/EUR into a Thai bank account at near mid-market rates — typically 3–5% cheaper than bank wire transfers. For real-time comparison of fees and exchange rates, see our USA→Thailand, UK→Thailand, and Australia→Thailand corridor pages.",
      },
      {
        question: "What plug type does Thailand use?",
        answer:
          "Thailand uses plug types A (two flat pins), B (two flat pins plus grounding), and C (two round pins). Voltage is 220V at 50Hz. Most modern US, UK, and EU phone chargers and laptops are dual-voltage (check for '100–240V' on the adapter), so you only need a physical plug adapter, not a voltage converter. Hairdryers and hair straighteners from the US (120V-only) will burn out.",
      },
      {
        question: "Is Thailand safe for solo female travelers?",
        answer:
          "Broadly yes — Thailand ranks as one of the safer Southeast Asian destinations for solo female travelers. Standard precautions apply: dress modestly at temples and in rural areas, be cautious with drinks on the islands (particularly Koh Pha Ngan during Full Moon Party season), and stick to licensed taxis or Grab/Bolt after dark. The deep south (Pattani, Yala, Narathiwat) is not recommended due to ongoing insurgency and has Western travel advisories.",
      },
    ],

    relatedCorridorSlug: "usa-to-thailand",
  },
};

export function getTravelGuide(slug: string): TravelGuideContent | undefined {
  return travelGuides[slug];
}

export function getAllTravelGuideSlugs(): string[] {
  return Object.keys(travelGuides);
}
