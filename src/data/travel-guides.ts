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

  france: {
    slug: "france",
    countryName: "France",
    countryCode: "fr",
    region: "Western Europe",
    currency: "EUR",
    currencyName: "Euro",
    currencySymbol: "€",
    topSourceCurrencies: ["USD", "GBP", "AUD", "CAD"],
    capital: "Paris",
    languages: ["French"],
    callingCode: "+33",
    plugTypes: ["C", "E"],
    voltage: "230V / 50Hz",
    timezone: "CET (UTC+1, UTC+2 in summer)",

    tldr:
      "France uses the Euro (€, EUR) — as of June 2026, 1 EUR is worth roughly $1.15 USD. Contactless card payment is near-universal, even at bakeries and market stalls, so most visitors barely touch cash. Skip airport bureaux de change entirely: pay by a no-FX-fee card and withdraw small amounts of cash from bank-attached ATMs (never standalone Euronet machines). Restaurant service is included in the bill by law — tipping is a small round-up, not 20%.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "France is the world's most-visited country — around 100 million international arrivals a year — and remarkably easy to travel once you understand a few local systems. Paris gets the headlines, but the country rewards spreading out: the lavender plateaus of Provence, the D-Day beaches of Normandy, wine routes in Burgundy and Bordeaux, and the Alps within three hours of the capital by TGV. A croissant runs €1.30–€1.80, a Paris metro ride about €2.50 with a Navigo Easy card, and an excellent three-course lunch menu (the 'formule') can still be found for €18–€25 outside tourist zones.\n\nThis guide covers the money mechanics — why you should refuse Euronet ATMs, how the fixed airport taxi fares work, what each euro note looks like — plus eSIM options, cultural etiquette (greeting rituals matter here), and what France actually costs per day in 2026. If you're moving larger sums to or from France, our live comparison shows which providers land the most euros in a French account.",
    keyStats: [
      { label: "Currency", value: "Euro (€, EUR)" },
      { label: "Typical daily cost (mid-range)", value: "$120–$200 USD" },
      { label: "Best time to visit", value: "April – June & September – October" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "Schengen visa-free 90/180 days; ETIAS rolling out" },
      { label: "Power", value: "230V / 50Hz, plug types C, E" },
      { label: "Tipping", value: "Service included; round up €1–5 for good service" },
    ],

    culture: {
      overview:
        "French social life runs on politeness rituals. Every interaction — entering a shop, boarding a bus, asking directions — starts with 'Bonjour' (or 'Bonsoir' after ~6pm); skipping it is the single fastest way to get frosty service. Meals are events, not refueling stops: lunch is sacred (12–2pm), dinner starts around 7:30–8pm, and asking for the bill is something you do explicitly ('l'addition, s'il vous plaît') — servers consider it rude to rush you. A little French effort goes a very long way, even just bonjour, merci, au revoir.",
      dos: [
        "Say 'Bonjour Madame/Monsieur' before anything else — in shops, taxis, ticket counters. It's non-negotiable etiquette.",
        "Greet with 'la bise' (cheek kisses) only if a French person initiates; a handshake is always safe.",
        "Keep your hands on the table (not in your lap) at meals, and keep bread on the table or tablecloth, not on the plate.",
        "Validate paper train tickets where machines are present, and keep your ticket until you exit the metro — inspections are common with on-the-spot fines.",
        "Dress a notch smarter than you would at home — athleisure marks you as a tourist in Paris restaurants and shops.",
      ],
      donts: [
        "Don't expect shops and many restaurants to open on Sundays or Monday mornings, especially outside Paris.",
        "Don't ask for menu changes or substitutions — the chef's dish is the dish. Special requests are often politely refused.",
        "Don't speak loudly in restaurants or on trains; ambient volume in France is noticeably lower than in the US.",
        "Don't order a cappuccino after a meal — coffee after dinner means an espresso ('un café'). Milky coffee is a breakfast drink.",
        "Don't assume English first — open in French ('Bonjour, parlez-vous anglais ?') and most people will happily switch.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash is accepted everywhere but needed almost nowhere. Outdoor markets, some bakeries with a €5–10 card minimum, and small village cafés are the main cash use-cases. €50 from an ATM lasts most visitors a week. Many Paris businesses are now happily card-only.",
      cardAcceptance:
        "Visa and Mastercard contactless are accepted virtually everywhere, including bakeries, metro ticket machines, taxis, and market stalls. American Express works at hotels and larger stores but is refused by many independent restaurants. Chip-and-PIN is standard; magnetic stripe is effectively dead.",
      atmAvailability:
        "Bank-attached ATMs (BNP Paribas, Société Générale, Crédit Agricole, LCL) are everywhere and most charge no local fee for foreign cards. Avoid the bright-blue standalone Euronet machines clustered in tourist areas — they push Dynamic Currency Conversion and poor rates worth 5–12% of your withdrawal. Always choose to be charged in EUR, never your home currency.",
      tippingNorms:
        "A 15% service charge ('service compris') is included in every restaurant bill by French law. Locals leave nothing or round up; €1–5 for genuinely good service in a nicer restaurant is generous. Taxi drivers: round up. Hotel porters: €1–2 per bag. Nobody expects American-style 20%.",
      commonScams: [
        "The gold ring trick — someone 'finds' a ring at your feet near the Seine and offers it for a reward. Walk on.",
        "Petition clipboards around the Louvre and Eiffel Tower — signing distracts you while an accomplice picks your pocket, or ends in aggressive cash demands.",
        "Friendship bracelets at Montmartre/Sacré-Cœur — once it's knotted on your wrist, you're pressured to pay. Keep hands in pockets and keep moving.",
        "Cup-and-ball (bonneteau) games on bridges — the 'winners' in the crowd are accomplices. You cannot win.",
        "Unofficial taxis at CDG/Orly — only use the official rank. Paris taxis have fixed airport fares (around €56 Right Bank / €65 Left Bank from CDG); anyone quoting more or 'negotiating' is not a real taxi.",
      ],
    },

    notes: [
      { denomination: "5 EUR", color: "Grey", figure: "Classical architecture — gateway (obverse), bridge (reverse)" },
      { denomination: "10 EUR", color: "Red", figure: "Romanesque architecture — gateway and bridge" },
      { denomination: "20 EUR", color: "Blue", figure: "Gothic architecture — windows and bridge" },
      { denomination: "50 EUR", color: "Orange", figure: "Renaissance architecture — the workhorse note from ATMs" },
      { denomination: "100 EUR", color: "Green", figure: "Baroque and Rococo architecture — small shops may refuse it" },
      { denomination: "200 EUR", color: "Yellow", figure: "Art Nouveau architecture — rarely seen; many shops won't accept it" },
    ],

    exchangeGuide:
      "Don't bring a stack of home currency to exchange — France is a card economy and Paris bureaux de change offer mediocre rates (airport counters are the worst, often 8–12% off mid-market). The cheapest setup is a no-foreign-fee debit card (Wise, Revolut, or a fee-free card from your home bank) used for everything, plus one small ATM withdrawal from a bank-attached machine for market days. French banks generally won't exchange cash for non-customers. For larger transfers — property, tuition, rent deposits — use a specialist like Wise or OFX to send EUR directly into a French IBAN at near mid-market rates instead of a bank wire.",

    sports: {
      overview:
        "Football is the national game — Ligue 1 runs August to May and PSG's Parc des Princes is the marquee ticket — but France's sporting calendar is unusually rich for travelers. The Tour de France takes over the country every July, finishing on the Champs-Élysées; roadside viewing is free and a genuine cultural festival. Rugby is huge in the southwest (Toulouse, the Top 14 league), Roland-Garros brings clay-court tennis to Paris in late May, and on any village square you'll find locals playing pétanque with a glass of pastis.",
      highlights: [
        "Tour de France (July) — free roadside viewing; mountain stages in the Alps and Pyrenees are the most atmospheric.",
        "Roland-Garros / French Open (late May – early June, Paris) — outer-court day passes are reasonably priced if booked early.",
        "Ligue 1 football — PSG at Parc des Princes; Marseille's Stade Vélodrome is arguably the best atmosphere in the country.",
        "Top 14 rugby (Sept–June) — Toulouse, La Rochelle, and Clermont offer big-crowd matchdays well under football prices.",
      ],
    },

    bestTime:
      "April to June and September to October are the sweet spots — mild weather, manageable crowds, and the countryside at its best (lavender in Provence peaks late June to mid-July). July and August are high season: hot, crowded, and expensive on the coast, while Paris partly empties in August as locals take their own holidays — some independent restaurants and shops close for weeks. December is excellent for Christmas markets (Strasbourg, Colmar) and the Alps ski season runs December through March.",
    visa:
      "France is in the Schengen Area: US, UK, Canadian, Australian, and NZ passport holders enter visa-free for up to 90 days in any 180-day period. Since October 2025 the EU's Entry/Exit System (EES) registers biometrics at the border — allow extra time on your first entry. The ETIAS travel authorisation (around €20, valid 3 years) is expected to become mandatory for visa-exempt visitors in late 2026 — check the official EU site before you fly. Stays beyond 90 days require a long-stay visa arranged in advance.",
    safety:
      "France is safe by global standards; the main tourist risk is pickpocketing on the Paris metro (especially line 1), at major sights, and around train stations — keep phones out of back pockets and bags zipped in front of you. Strikes and demonstrations are a regular feature of French life and can disrupt transport with little notice; check SNCF/RATP apps before travel days. The EU-wide emergency number is 112. Tap water is safe everywhere — ask for 'une carafe d'eau' (free) in restaurants.",
    highlights: [
      {
        name: "Paris",
        summary:
          "The Louvre, Musée d'Orsay, Eiffel Tower, Montmartre, and the rebuilt Notre-Dame (reopened December 2024). Budget 4 days minimum. Museum Pass pays off at 3+ sights; many museums are free the first Sunday of the month.",
      },
      {
        name: "Provence & the Luberon",
        summary:
          "Hilltop villages (Gordes, Roussillon), Roman ruins in Arles and the Pont du Gard, and lavender fields late June to mid-July. Rent a car — this is not train country.",
      },
      {
        name: "French Riviera (Côte d'Azur)",
        summary:
          "Nice's old town and Promenade, Èze's clifftop village, Antibes, and day trips to Monaco. The coastal TER train linking the towns costs just a few euros and beats driving.",
      },
      {
        name: "Normandy & Mont-Saint-Michel",
        summary:
          "The D-Day landing beaches and museums around Bayeux, Rouen's cathedral, and the tidal abbey of Mont-Saint-Michel — go early or stay overnight to beat the day-trip crowds.",
      },
      {
        name: "Loire Valley",
        summary:
          "Renaissance châteaux — Chambord, Chenonceau, Villandry's gardens — strung along the river an hour from Paris by TGV. Bikeable between castles on the Loire à Vélo route.",
      },
      {
        name: "Bordeaux & Dordogne",
        summary:
          "Wine capital with a walkable UNESCO center and the Cité du Vin museum; the Dordogne adds medieval towns, river castles, and the prehistoric Lascaux cave art.",
      },
    ],

    budget: {
      backpacker: "$60–$90 USD per day",
      midRange: "$120–$200 USD per day",
      luxury: "$350+ USD per day",
      note:
        "Backpacker assumes hostel dorms, bakery/market meals, and metro travel. Mid-range covers a 3-star double, one restaurant meal a day with a lunchtime formule, and intercity trains booked ahead. Paris runs roughly 25% above the rest of the country; rural France and smaller cities (Lyon excepted) are notably cheaper.",
    },

    faqs: [
      {
        question: "Should I bring cash to France or just use a card?",
        answer:
          "Just use a card. Contactless Visa/Mastercard is accepted virtually everywhere in France, including bakeries, metro machines, and market stalls. Withdraw €50–100 from a bank-attached ATM for the rare cash-only stall and you're covered. Use a no-foreign-fee card (Wise, Revolut, or similar) and always choose to be charged in EUR, never your home currency.",
      },
      {
        question: "How much do you tip in France?",
        answer:
          "Very little. A 15% service charge is legally included in every restaurant bill ('service compris'). Locals round up or leave €1–5 for good service in nicer restaurants. Taxis: round up to the nearest euro. There is no expectation of US-style 20% tipping anywhere in France.",
      },
      {
        question: "What's the cheapest way to get euros in France?",
        answer:
          "Withdraw from a bank-attached ATM (BNP Paribas, Société Générale, Crédit Agricole) with a no-foreign-fee debit card, and decline Dynamic Currency Conversion by choosing to be charged in EUR. Avoid standalone Euronet machines and all airport exchange counters, which cost 5–12% more. For large amounts, send money to a French IBAN via Wise or OFX at near mid-market rates.",
      },
      {
        question: "How much does a taxi from CDG airport to Paris cost?",
        answer:
          "Paris taxis charge a fixed fare from Charles de Gaulle: around €56 to the Right Bank and €65 to the Left Bank (slightly more from Orly rules apply in reverse). Only use the official taxi rank — ignore anyone soliciting inside the terminal. The RER B train (~€11.80) or Roissybus are the budget alternatives; G7 is the main reliable taxi app.",
      },
      {
        question: "Is France expensive to visit in 2026?",
        answer:
          "Mid-range travelers should budget $120–$200 per day including a 3-star hotel, one restaurant meal, and local transport. Paris is roughly 25% pricier than the rest of the country. Big savings: lunch 'formules' (€18–25 for three courses), picnics from markets and bakeries, TGV tickets booked 2–3 months ahead, and free first-Sunday museum entry.",
      },
      {
        question: "Do Americans need a visa for France in 2026?",
        answer:
          "No visa for stays up to 90 days in any 180-day period — this applies to US, UK, Canadian, Australian, and NZ passports. Two changes to know: the EES biometric border system (live since October 2025) adds time on first entry, and the ETIAS authorisation (~€20 online, valid 3 years) is expected to become mandatory in late 2026. Check the official EU ETIAS site before flying.",
      },
      {
        question: "What eSIM should I get for France?",
        answer:
          "An eSIM from Airalo, Holafly, or Ubigi costs roughly $8–$35 depending on data needs and works on Orange/SFR networks. Because France is in the EU, a Europe-wide regional eSIM is often better value than a France-only one if you're visiting multiple countries — EU roaming rules mean one plan covers the whole Schengen area.",
      },
      {
        question: "Is the Paris metro easy for tourists?",
        answer:
          "Yes — it's dense, frequent, and cheap. Buy a Navigo Easy card (€2) and load it with t+ tickets (about €2.50 a ride, cheaper in carnets) or use contactless bank-card tap-in on equipped lines. Keep your ticket until you exit — inspectors issue on-the-spot fines. Watch for pickpockets on line 1 and at major interchanges.",
      },
      {
        question: "Is Paris safe for tourists?",
        answer:
          "Yes, by big-city standards. Violent crime against visitors is rare; the real risks are pickpocketing (metro, Montmartre, around the Eiffel Tower) and the classic street scams — gold rings, petitions, friendship bracelets. Keep bags zipped in front of you, ignore street solicitations, and you'll very likely have zero problems. Emergency number: 112.",
      },
      {
        question: "Can I send money to or from France cheaply?",
        answer:
          "Yes. Specialists like Wise, OFX, and Instarem transfer EUR into or out of a French IBAN at near mid-market rates — typically 2–5% cheaper than a bank's international wire once you account for the exchange-rate markup. SEPA makes euro-zone transfers fast and free domestically; the cost battle is all in the currency conversion, which is where comparison pays.",
      },
    ],

    relatedCorridorSlug: "usa-to-europe",
  },

  spain: {
    slug: "spain",
    countryName: "Spain",
    countryCode: "es",
    region: "Southern Europe",
    currency: "EUR",
    currencyName: "Euro",
    currencySymbol: "€",
    topSourceCurrencies: ["USD", "GBP", "AUD", "CAD"],
    capital: "Madrid",
    languages: ["Spanish", "Catalan", "Basque", "Galician"],
    callingCode: "+34",
    plugTypes: ["C", "F"],
    voltage: "230V / 50Hz",
    timezone: "CET (UTC+1, UTC+2 in summer)",

    tldr:
      "Spain uses the Euro (€, EUR) — as of June 2026, 1 EUR is worth roughly $1.15 USD. Cards are accepted almost everywhere, though small tapas bars and market stalls still appreciate cash. Tipping is minimal — round up or leave a euro or two. The biggest money traps are airport exchange counters, standalone Euronet ATMs, and tourist-strip paella; the biggest practical adjustment is the schedule — lunch at 2pm, dinner after 9pm.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "Spain trades places with France as one of the world's two most-visited countries — over 90 million arrivals a year — and remains one of Western Europe's best-value destinations. A caña of beer is €1.50–€3, a full menú del día (three courses with wine) runs €12–€16 in working neighborhoods, and Spain's high-speed AVE network makes Madrid–Barcelona or Madrid–Seville a 2.5-hour hop. The country packs remarkable variety: Moorish Andalusia, green Atlantic Galicia, Mediterranean beaches, two of Europe's great food cities (San Sebastián, Barcelona), and islands from Mallorca to Tenerife.\n\nThis guide covers money on the ground — where cash still matters, why you should refuse Euronet ATMs and dynamic currency conversion, what each euro note looks like — plus eSIM picks, the cultural rhythm (the late eating schedule is real), and honest daily budgets for 2026. Sending larger amounts to or from a Spanish account? Our live comparison shows which provider delivers the most euros.",
    keyStats: [
      { label: "Currency", value: "Euro (€, EUR)" },
      { label: "Typical daily cost (mid-range)", value: "$100–$170 USD" },
      { label: "Best time to visit", value: "April – June & September – October" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "Schengen visa-free 90/180 days; ETIAS rolling out" },
      { label: "Power", value: "230V / 50Hz, plug types C, F" },
      { label: "Tipping", value: "Not expected; round up or leave €1–2" },
    ],

    culture: {
      overview:
        "Spanish life runs two to three hours later than most of the world: lunch is 2–4pm, dinner rarely before 9pm, and restaurants that open at 7pm are doing so for tourists. The social fabric is built around bars — not for drinking heavily, but as the default living room for coffee, tapas, and conversation at any hour. Spaniards are direct, loud by northern European standards, and warm; service can feel brusque but isn't rude. Regional identity matters deeply: Catalonia, the Basque Country, and Galicia have their own languages, and acknowledging that (a 'bon dia' in Barcelona) lands well.",
      dos: [
        "Adapt to the schedule — lunch at 2pm, dinner at 9:30pm. Kitchens genuinely close mid-afternoon; a 6pm dinner search ends in tourist traps.",
        "Order in rounds at tapas bars and keep the receipt tally going — paying at the end is normal, and standing at the bar is often cheaper than a table.",
        "Greet with 'buenos días / buenas tardes' when entering small shops and bars, and say goodbye when leaving.",
        "Try the menú del día (weekday fixed lunch, €12–16) — it's Spain's best food bargain and how locals actually eat out.",
        "Dress for the occasion — Spaniards dress up to go out; beachwear away from the beach (especially in Barcelona) can draw fines.",
      ],
      donts: [
        "Don't expect dinner before 8:30pm outside tourist zones, and don't expect shops to be open mid-afternoon — many small businesses close roughly 2–5pm.",
        "Don't order sangría and expect local cred — Spaniards drink tinto de verano (red wine with lemon soda). It's also half the price.",
        "Don't confuse regional identities — don't call Catalan or Basque 'dialects of Spanish', and read the room before discussing Catalan independence.",
        "Don't rush meals or wave frantically for the bill — ask 'la cuenta, por favor' once; sobremesa (lingering after a meal) is the culture.",
        "Don't leave valuables visible — bag snatching on Las Ramblas and beach theft are Barcelona's signature crimes.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash is fading but not dead. Small tapas bars, market stalls (Boquería, Mercado Central), some menú del día spots, and rural Spain still run partly on cash, and a few places set €5–10 card minimums. €50–100 in your pocket covers a week of edge cases for most travelers.",
      cardAcceptance:
        "Visa and Mastercard contactless work nearly everywhere — supermarkets, taxis, metro machines, chains, and most independent bars. American Express is patchier outside hotels. Spain moved heavily to contactless post-2020; even €1.50 coffees go on card without comment.",
      atmAvailability:
        "Bank ATMs (Santander, BBVA, CaixaBank, Sabadell) are everywhere. Some Spanish banks charge foreign cards a usage fee of €1.50–€6 — the screen discloses it before you commit, so try another bank if it's high (CaixaBank and Sabadell are often cheapest). Skip the orange/blue standalone Euronet machines in tourist areas, and always choose to be charged in EUR, declining the conversion 'offer'.",
      tippingNorms:
        "Tipping is not expected. Locals leave small change or round up — €1–2 on a nice dinner is plenty, nothing is normal at a bar. No service percentage is added to bills. Taxi: round up. Hotel porters: €1 per bag if you like.",
      commonScams: [
        "Pickpocketing on Las Ramblas, the Barcelona metro, and Madrid's Puerta del Sol — the gold standard of European pickpocket zones. Front pockets, zipped bags, phone away on metro platforms.",
        "The rosemary/flower 'gift' from women outside churches in Seville and Granada — accepting it triggers aggressive palm-reading payment demands.",
        "Tourist-strip paella — pre-cooked, microwaved, €18+. Real paella is lunch food, made to order (expect a 20+ minute wait), and rarely sold from photo menus on the beachfront.",
        "Distraction thefts — the 'bird poop' cleanup, fake petitions, or someone 'helping' at the ATM. Any unsolicited touch or help near money is a setup.",
        "Hire-car break-ins at beach and viewpoint car parks (especially around Barcelona and Cádiz) — leave absolutely nothing visible in the car.",
      ],
    },

    notes: [
      { denomination: "5 EUR", color: "Grey", figure: "Classical architecture — gateway (obverse), bridge (reverse)" },
      { denomination: "10 EUR", color: "Red", figure: "Romanesque architecture — gateway and bridge" },
      { denomination: "20 EUR", color: "Blue", figure: "Gothic architecture — windows and bridge" },
      { denomination: "50 EUR", color: "Orange", figure: "Renaissance architecture — the standard ATM note" },
      { denomination: "100 EUR", color: "Green", figure: "Baroque and Rococo architecture — fine in supermarkets, awkward in bars" },
      { denomination: "200 EUR", color: "Yellow", figure: "Art Nouveau architecture — rarely circulates; many businesses refuse it" },
    ],

    exchangeGuide:
      "Don't exchange cash for Spain — pay by card and pull euros from bank ATMs as needed. Airport counters and city-center 'change' shops run 6–12% off the mid-market rate, and Euronet ATMs layer poor rates on top of fees. A no-foreign-fee debit card (Wise, Revolut, or your bank's equivalent) plus an occasional withdrawal from CaixaBank or Sabadell covers everything; always press 'charge in EUR' when the screen offers your home currency. For bigger moves — buying property on the costas, paying Spanish tuition or rent — a specialist transfer via Wise or OFX into a Spanish IBAN beats a bank wire by several percent.",

    sports: {
      overview:
        "Football isn't a sport in Spain; it's the second religion. La Liga's Real Madrid–Barcelona axis dominates, but matchday at Atlético, Sevilla, or Athletic Bilbao (a club fielding only Basque players) is arguably the purer experience, with tickets from €30–€40. Beyond fútbol, Spain is the world capital of padel — courts in every town, rackets rentable everywhere — and hosts Grand Slam tennis pedigree (Nadal's legacy, the Madrid Open in May). Basketball's Liga ACB is Europe's strongest league. Bullfighting still runs in Madrid and Seville seasons but is banned in Catalonia and declining nationally — it's a contested tradition, not a tourist must-do.",
      highlights: [
        "La Liga football (Aug–May) — Bernabéu and Camp Nou tours daily; non-Clásico tickets are easy to buy on official club sites from ~€30.",
        "Padel — Spain's fastest-growing sport; courts rent for €10–20/hour and most clubs lend rackets. A genuinely local thing to do.",
        "Madrid Open tennis (late April–early May) — clay-court warm-up for Roland-Garros at the Caja Mágica.",
        "La Vuelta a España (late Aug–mid Sept) — Spain's grand tour, free to watch roadside, with summit finishes in Asturias and Andalusia.",
      ],
    },

    bestTime:
      "April to June and September to October are ideal nationwide — warm, lively, and out of peak crowds. July and August are brutal inland (Seville and Córdoba regularly hit 40°C+) and packed on the coasts; it's also when prices peak. Andalusia shines in spring (Semana Santa processions, Seville's Feria in April), the north (Basque Country, Galicia) is best June–September, and the Canary Islands are a legitimate 20°C+ winter escape. Note that Easter week and August coastal Spain book out months ahead.",
    visa:
      "Spain is in the Schengen Area: US, UK, Canadian, Australian, and NZ passports get 90 days visa-free in any 180-day period. The EES biometric border system (live since October 2025) registers fingerprints on first entry, and the ETIAS authorisation (~€20 online, valid 3 years) is expected to become mandatory for visa-exempt travelers in late 2026 — verify on the official EU site before flying. Spain's digital nomad visa remains a popular long-stay route for remote workers.",
    safety:
      "Spain is one of Europe's safest countries for violent crime, but Barcelona is genuinely Europe's pickpocketing capital — Las Ramblas, the metro, and the beach are the hotspots, and phone-snatching is common. Madrid's Sol and major festivals (San Fermín, Las Fallas) demand the same caution. Keep nothing in back pockets, nothing visible in parked cars, and nothing unattended on beaches. Tap water is safe everywhere (Madrid's is famously good). Emergency number: 112.",
    highlights: [
      {
        name: "Barcelona",
        summary:
          "Gaudí's Sagrada Família (book weeks ahead) and Park Güell, the Gothic Quarter, Barceloneta beach, and the Boquería market. 3–4 days. Watch your pockets; skip Las Ramblas restaurants.",
      },
      {
        name: "Madrid",
        summary:
          "The Prado–Reina Sofía–Thyssen art triangle, Retiro Park, the Royal Palace, and Europe's best tapas-bar nightlife in La Latina and Malasaña. Both big museums have free evening hours.",
      },
      {
        name: "Seville & Andalusia",
        summary:
          "The Alcázar and cathedral, flamenco in Triana, plus Córdoba's Mezquita an AVE hop away. Spring or autumn only — summer is punishing. The Feria de Abril is peak Andalusia.",
      },
      {
        name: "Granada",
        summary:
          "The Alhambra — Spain's most-visited monument; book tickets the moment dates open. Free tapas with every drink remains gloriously standard across the city's bars.",
      },
      {
        name: "San Sebastián & the Basque Country",
        summary:
          "La Concha beach, the pintxo bars of the Parte Vieja, and more Michelin stars per capita than almost anywhere on Earth. Bilbao's Guggenheim is an hour west.",
      },
      {
        name: "Valencia",
        summary:
          "The City of Arts and Sciences, Europe's largest urban park in a drained riverbed, the true home of paella, and Las Fallas festival (March) — Spain's most pyrotechnic week.",
      },
    ],

    budget: {
      backpacker: "$50–$80 USD per day",
      midRange: "$100–$170 USD per day",
      luxury: "$300+ USD per day",
      note:
        "Backpacker assumes hostels, menú del día lunches, and metro/bus travel. Mid-range covers a 3-star double, tapas dinners, and AVE trains booked ahead. Barcelona, San Sebastián, and the Balearics in August skew 20–30% above the national baseline; inland cities (Zaragoza, Granada, Valencia) are notably cheaper.",
    },

    faqs: [
      {
        question: "Is Spain cheap to visit in 2026?",
        answer:
          "Spain remains one of Western Europe's best-value destinations. Mid-range travelers spend $100–$170 per day; backpackers manage on $50–$80. The menú del día (three-course weekday lunch with wine, €12–16) is the standout bargain, and a beer still costs €1.50–€3 in normal bars. Barcelona and San Sebastián are the priciest cities; Valencia, Granada, and Seville deliver the same quality for less.",
      },
      {
        question: "Do I need cash in Spain or can I use a card everywhere?",
        answer:
          "Cards work almost everywhere, including for a €1.50 coffee. Keep €50–100 cash for market stalls, small tapas bars with card minimums, and rural areas. Withdraw from bank ATMs (CaixaBank and Sabadell often charge foreign cards the least), avoid Euronet machines, and always choose to be charged in EUR rather than your home currency.",
      },
      {
        question: "How much do you tip in Spain?",
        answer:
          "Little to nothing. Spaniards round up or leave small change; €1–2 after a good restaurant meal is generous, and nothing is expected at bars or cafés. No service charge is added to bills, and no one will chase you for leaving zero. Taxis: round to the nearest euro.",
      },
      {
        question: "What time do Spaniards eat dinner?",
        answer:
          "9pm to 11pm. Lunch — the main meal — runs 2–4pm. Most proper restaurant kitchens close mid-afternoon and reopen around 8–8:30pm; anywhere serving dinner at 6pm is catering to tourists. Bridge the gap like locals do: with a tapa or pintxo and a caña in the early evening.",
      },
      {
        question: "Is Barcelona safe? What about pickpockets?",
        answer:
          "Barcelona is safe from violent crime but is Europe's most notorious pickpocketing city. Las Ramblas, the metro (especially L3), the Gothic Quarter, and Barceloneta beach are the hotspots. Use a front pocket or zipped crossbody bag, never leave a phone on a café table, and take nothing of value to the beach. Madrid requires the same care around Sol.",
      },
      {
        question: "Do Americans need a visa for Spain in 2026?",
        answer:
          "No — US, UK, Canadian, Australian, and NZ passports enter Schengen visa-free for 90 days in any 180. Since October 2025, the EES biometric system registers you at the border on first entry. The ETIAS authorisation (~€20 online, 3-year validity) is expected to become mandatory in late 2026 — check the official EU site before your trip.",
      },
      {
        question: "What's the best eSIM for Spain?",
        answer:
          "Airalo, Holafly, and Ubigi plans run roughly $7–$35 and ride on Movistar/Orange networks. If you're combining Spain with France, Italy, or Portugal, a Europe-region eSIM usually beats single-country plans on price per GB thanks to EU-wide roaming. Activate before departure and you'll have data at the gate.",
      },
      {
        question: "AVE trains or flying within Spain?",
        answer:
          "Take the train. The AVE network links Madrid to Barcelona (2h30), Seville (2h30), Valencia (1h40), and Málaga (2h20) city-center to city-center, with fares from €20–40 if booked weeks ahead. Low-cost operators Ouigo, Iryo, and Avlo compete on the same routes, which keeps prices honest. Flying only wins for the islands.",
      },
      {
        question: "Can I drink the tap water in Spain?",
        answer:
          "Yes, everywhere. Spanish tap water is safe and Madrid's (from the Sierra de Guadarrama) is considered among Europe's best. Restaurants must provide free tap water on request by law — ask for 'agua del grifo'. On the costas it's safe but sometimes mineral-heavy in taste, which is why locals there often buy bottled.",
      },
      {
        question: "What's the cheapest way to send money to or from Spain?",
        answer:
          "Specialists like Wise, OFX, and Instarem move money into or out of a Spanish IBAN at near mid-market rates, typically saving 2–5% versus a bank's international wire once the exchange-rate markup is counted. Within the eurozone, SEPA transfers are free and fast — the cost is all in the currency conversion, so compare providers on the real EUR amount delivered.",
      },
    ],

    relatedCorridorSlug: "usa-to-europe",
  },

  italy: {
    slug: "italy",
    countryName: "Italy",
    countryCode: "it",
    region: "Southern Europe",
    currency: "EUR",
    currencyName: "Euro",
    currencySymbol: "€",
    topSourceCurrencies: ["USD", "GBP", "AUD", "CAD"],
    capital: "Rome",
    languages: ["Italian"],
    callingCode: "+39",
    plugTypes: ["C", "F", "L"],
    voltage: "230V / 50Hz",
    timezone: "CET (UTC+1, UTC+2 in summer)",

    tldr:
      "Italy uses the Euro (€, EUR) — as of June 2026, 1 EUR is worth roughly $1.15 USD. Cards are accepted nearly everywhere by law, but Italy is still more cash-friendly than France or Spain: small trattorias, coffee bars, and southern towns appreciate euros in hand. Expect a €1–3 'coperto' cover charge on restaurant bills — it's legal and normal, not a scam. Tipping beyond that is not expected. Drink your espresso standing at the bar: it's often a third of the table price.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "Italy holds more UNESCO World Heritage sites than any other country, and the distance between them is mercifully short: Rome to Florence is 90 minutes on the high-speed Frecciarossa, Florence to Venice barely two hours. An espresso at the bar still costs €1.20–€1.50, a margherita in Naples — the city that invented it — runs €5–8, and regional trains cross half of Tuscany for under €15. The flip side: Venice now charges day-trippers an access fee on peak dates, rental cars rack up ZTL (limited-traffic-zone) fines by the bundle, and the gap between tourist-menu Italy and real Italy is wide. Knowing a handful of local rules saves real money.\n\nThis guide covers the money layer — where cash still rules, the coperto explained, which ATMs to use and which to refuse — plus eSIM picks, etiquette (coffee has rules here), regional budgets, and the scams that cluster around the Colosseum and Trevi. Moving larger sums to or from an Italian account? Our comparison shows what actually arrives after fees.",
    keyStats: [
      { label: "Currency", value: "Euro (€, EUR)" },
      { label: "Typical daily cost (mid-range)", value: "$110–$190 USD" },
      { label: "Best time to visit", value: "April – June & September – October" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "Schengen visa-free 90/180 days; ETIAS rolling out" },
      { label: "Power", value: "230V / 50Hz, plug types C, F, L" },
      { label: "Tipping", value: "Not expected; coperto €1–3 is already on the bill" },
    ],

    culture: {
      overview:
        "Italian daily life is governed by unwritten rules that locals follow instinctively: coffee has a clock (cappuccino before ~11am, espresso after meals), meals have a structure (antipasto, primo, secondo — though no one orders all of them), and the evening passeggiata (slow social stroll) is a national institution. 'Bella figura' — presenting yourself well — matters; Italians dress with care and notice when others don't. Family and region trump nation: cuisine, dialect, and pride are fiercely local, and suggesting all Italian food is the same is genuine heresy.",
      dos: [
        "Drink coffee at the bar ('al banco') — it's €1.20 standing versus €3–4 seated at a piazza table. Pay the cashier first in busy bars, then take the receipt to the barista.",
        "Cover shoulders and knees for churches — St. Peter's, the Duomo in Milan, and most basilicas enforce it. Carry a scarf in summer.",
        "Validate regional train tickets in the green machines before boarding (high-speed trains with seat reservations don't need it) — fines are issued on board.",
        "Greet shopkeepers with 'buongiorno' or 'buonasera' and let waiters set the pace — Italian service is unhurried by design, and the table is yours for the evening.",
        "Book major sights ahead — the Colosseum, Uffizi, Vatican Museums, and Last Supper sell out days to weeks in advance, and timed entry skips multi-hour lines.",
      ],
      donts: [
        "Don't order a cappuccino after lunch or dinner — milk on a full stomach is considered indigestion in a cup. Espresso ('un caffè') is the after-meal coffee.",
        "Don't ask for parmesan on seafood pasta, ketchup on anything, or 'fettuccine alfredo' — it barely exists in Italy. Trust the menu as written.",
        "Don't drive into ZTL zones — the camera-enforced historic centers of Rome, Florence, Milan, and most towns. Rental companies forward the fines (€80+ each, and they multiply) months later.",
        "Don't buy from street vendors selling 'designer' bags or sunglasses — purchasing counterfeits is itself finable in Italy, with penalties that can reach four figures.",
        "Don't sit on monuments — eating on the Spanish Steps or wading into fountains draws on-the-spot fines from Rome's municipal police (€250+).",
      ],
    },

    money: {
      cashAcceptance:
        "Cash still matters more in Italy than in most of Western Europe, especially south of Rome. Coffee bars, small trattorias, market stalls, beach lidos, and taxis in smaller cities often prefer it, and a few 'forget' the card machine works until you ask twice. Keep €100 or so on hand; small notes make life easier.",
      cardAcceptance:
        "By law, Italian businesses must accept card payments, and compliance is now good — Visa/Mastercard contactless works in supermarkets, restaurants, trains, and most bars. American Express is accepted mainly at hotels and upscale spots. You may still meet the occasional 'macchina rotta' (broken machine) at small venues hoping for cash.",
      atmAvailability:
        "Bank ATMs ('bancomat' — Intesa Sanpaolo, UniCredit, BPER) are everywhere and typically charge no local fee for foreign cards. Avoid the blue-and-yellow Euronet and similar standalone machines around tourist sights — their rates and fees cost 5–12% extra. Always choose to be charged in EUR and decline the on-screen conversion.",
      tippingNorms:
        "Tipping is not expected. The €1–3 per-person 'coperto' (cover charge) on restaurant bills is legal and covers bread and the table; some tourist-area places add 'servizio' (10–15%) instead — check the bill so you don't double-tip. Locals leave coins or round up for excellent service. Taxis: round up.",
      commonScams: [
        "Costumed 'gladiators' at the Colosseum and characters near the Trevi who pose for a photo, then demand €10–20. Photos with strangers in costume are never free.",
        "Taxi games at stations and airports — only board at official ranks, insist on the meter in cities, and know the fixed fares: Rome Fiumicino to the historic center is a flat ~€55, Ciampino ~€40 (posted on the cab door).",
        "The friendship bracelet — knotted onto your wrist near the Duomo in Milan or the Spanish Steps, followed by payment demands. Keep walking, hands in pockets.",
        "Restaurant padding near major sights — unpriced 'specials', fish billed per 100g (per l'etto) that becomes €90, and tourist menus with photos. Check prices on anything recommended verbally.",
        "Fake petitions and 'deaf-mute' clipboard collectors around tourist squares — a distraction for pickpockets working the crowd.",
      ],
    },

    notes: [
      { denomination: "5 EUR", color: "Grey", figure: "Classical architecture — gateway (obverse), bridge (reverse)" },
      { denomination: "10 EUR", color: "Red", figure: "Romanesque architecture — gateway and bridge" },
      { denomination: "20 EUR", color: "Blue", figure: "Gothic architecture — windows and bridge" },
      { denomination: "50 EUR", color: "Orange", figure: "Renaissance architecture — the standard ATM note" },
      { denomination: "100 EUR", color: "Green", figure: "Baroque and Rococo architecture — fine in supermarkets, awkward in small bars" },
      { denomination: "200 EUR", color: "Yellow", figure: "Art Nouveau architecture — rarely circulates; many businesses refuse it" },
    ],

    exchangeGuide:
      "Skip currency exchange entirely — Italy is best handled with a no-foreign-fee card plus bank-ATM withdrawals. The 'cambio' shops around the Trevi Fountain, San Marco, and the Duomo advertise 'no commission' while burying an 8–15% spread in the rate; airport counters are no better. Withdraw from bank bancomats (Intesa Sanpaolo, UniCredit), decline dynamic currency conversion, and you'll pay within 1% of mid-market. For larger transfers — property in Puglia, tuition in Bologna, rent in Milan — Wise or OFX into an Italian IBAN beats a bank wire by several percent.",

    sports: {
      overview:
        "Calcio (football) is Italy's heartbeat — Serie A runs August to May, and the Milan derby at San Siro or Napoli at the Maradona are bucket-list atmospheres, with tickets for ordinary fixtures from €25–40. Beyond football, Italy hosts Formula 1's most storied race at Monza every September (the 'tifosi' in red are a spectacle themselves), the Giro d'Italia cycles the entire country each May, and basketball and volleyball both run top-tier European leagues. In the north, world-class skiing spans the Dolomites and Alps — Cortina co-hosted the 2026 Winter Olympics with Milan in February.",
      highlights: [
        "Serie A football (Aug–May) — San Siro in Milan (AC Milan/Inter), Rome's Stadio Olimpico, and Napoli's Stadio Maradona; buy via official club channels with photo ID.",
        "Italian Grand Prix at Monza (early September) — F1's fastest track and its most passionate crowd; general-admission park tickets are the budget way in.",
        "Giro d'Italia (May) — three weeks of free roadside spectacle; the Dolomite mountain stages are the most dramatic.",
        "Skiing the Dolomites (Dec–Mar) — the Sellaronda circuit and 2026 Olympic venues around Cortina d'Ampezzo.",
      ],
    },

    bestTime:
      "April to June and September to October are ideal almost everywhere — warm, long evenings, and crowds a notch below the summer peak. July and August are hot (Rome and Florence regularly exceed 35°C), crowded, and expensive, and around Ferragosto (August 15) many family-run businesses close while all of Italy heads to the coast. Winter is the quiet bargain season for cities — and the Dolomites ski season runs December to March. Venice is best in shoulder months; on peak spring/summer dates day-trippers must book the city's access fee (€5–10) in advance.",
    visa:
      "Italy is in the Schengen Area: US, UK, Canadian, Australian, and NZ passport holders enter visa-free for up to 90 days in any 180-day period. The EES biometric border system (live since October 2025) registers you on first Schengen entry, and the ETIAS authorisation (~€20 online, valid 3 years) is expected to become mandatory for visa-exempt visitors in late 2026 — verify on the official EU site before flying. Longer stays require a national visa arranged in advance.",
    safety:
      "Italy is safe; the realistic risks are pickpocketing and petty scams, concentrated around Termini station and metro line A in Rome, Naples' Centrale station, and the tourist cores of Florence and Venice. Violent crime against visitors is rare even in Naples, whose reputation outruns reality. Drive defensively in the south, never leave anything visible in a parked car, and treat anyone unusually helpful at a ticket machine as a red flag. Tap water is safe nationwide — Rome's free street fountains ('nasoni') are a feature, not a risk. Emergency number: 112.",
    highlights: [
      {
        name: "Rome",
        summary:
          "The Colosseum and Forum, Pantheon, Trevi, and the Vatican Museums (book everything ahead). Budget 3–4 days. The €55 fixed taxi fare from Fiumicino is posted on the cab door — or take the Leonardo Express train (€14).",
      },
      {
        name: "Florence & Tuscany",
        summary:
          "The Uffizi, Duomo dome climb, and Michelangelo's David, with Siena, San Gimignano, and the Chianti hills an hour out. Tuscany proper deserves a rental car — just never drive into the ZTL.",
      },
      {
        name: "Venice",
        summary:
          "St. Mark's, the Rialto, and the quiet back canals of Cannaregio and Dorsoduro. Stay overnight — the city transforms after day-trippers leave, and overnight guests are exempt from the access fee.",
      },
      {
        name: "Naples & the Amalfi Coast",
        summary:
          "Pizza's birthplace, Pompeii and Vesuvius, then Positano and Ravello along the coast road. Capri and Procida by ferry. Take the train to Naples and use ferries/buses — driving the Amalfi road in summer is gridlock.",
      },
      {
        name: "Milan & the Lakes",
        summary:
          "The Duomo rooftop, The Last Supper (book weeks ahead), and Italy's fashion and aperitivo capital — with Lakes Como and Garda under an hour away by train.",
      },
      {
        name: "Sicily",
        summary:
          "Greek temples at Agrigento, baroque Noto and Ortigia, Mount Etna, and Palermo's street-food markets. Italy at half the price of Tuscany — and arguably twice the intensity.",
      },
    ],

    budget: {
      backpacker: "$55–$85 USD per day",
      midRange: "$110–$190 USD per day",
      luxury: "$350+ USD per day",
      note:
        "Backpacker assumes hostels, bar-counter meals and pizza al taglio, and regional trains. Mid-range covers a 3-star double, one sit-down meal a day, and Frecciarossa trains booked ahead. Venice, Capri, the Amalfi Coast, and Milan run 25–40% above the baseline; the south (Puglia, Sicily, Calabria) runs well below it.",
    },

    faqs: [
      {
        question: "Do I need cash in Italy or can I use a card?",
        answer:
          "Cards are legally required to be accepted and now work almost everywhere, but Italy is still more cash-friendly than France or Spain — small bars, market stalls, beach clubs, and southern towns often prefer euros. Carry €50–100, withdraw from bank ATMs (not Euronet machines), and always choose to be charged in EUR when the screen offers your home currency.",
      },
      {
        question: "What is the coperto on my Italian restaurant bill?",
        answer:
          "The coperto is a legal per-person cover charge of €1–3 that pays for bread, the tablecloth, and your right to occupy the table all evening. It is not a scam and not a tip. Some tourist-area restaurants charge 'servizio' (10–15% service) instead or as well — check the bill, and if servizio is included, there's no reason to tip further.",
      },
      {
        question: "How much do you tip in Italy?",
        answer:
          "Italians generally don't tip. The coperto is already on the bill, service is included in menu prices, and rounding up or leaving a few coins for excellent service is the local maximum. Nobody expects a percentage. Taxi drivers: round up to the nearest euro. Hotel porters: €1–2 per bag.",
      },
      {
        question: "Is Italy expensive to visit in 2026?",
        answer:
          "Mid-range travelers should budget $110–$190 per day. The big variable is geography: Venice, Amalfi, and Milan are 25–40% above average, while Sicily, Puglia, and Naples deliver Italy's best food at the lowest prices. Big levers: coffee at the bar (€1.20 vs €4 seated), pizza al taglio lunches, regional trains, and museum bookings made directly on official sites.",
      },
      {
        question: "What are the fixed taxi fares from Rome's airports?",
        answer:
          "From Fiumicino (FCO) to anywhere inside Rome's Aurelian Walls, licensed white taxis charge a flat fare of about €55, posted on the cab door — it covers luggage and up to four passengers. From Ciampino it's about €40. Only board at the official rank, ignore touts inside the terminal, and the Leonardo Express train (€14, 32 minutes to Termini) is the budget alternative.",
      },
      {
        question: "Do Americans need a visa for Italy in 2026?",
        answer:
          "No — US, UK, Canadian, Australian, and NZ passports get 90 days visa-free in any 180-day Schengen period. The EES biometric system (live since October 2025) registers you at the border on first entry, and the ETIAS authorisation (~€20 online, valid 3 years) is expected to become mandatory in late 2026. Check the official EU site for current status before you travel.",
      },
      {
        question: "What's the best eSIM for Italy?",
        answer:
          "Airalo, Holafly, and Ubigi plans for Italy run roughly $8–$35 on TIM/Vodafone networks. If your trip includes France, Switzerland, or Greece, a Europe-region eSIM usually wins on price per GB since EU roaming rules let one plan cover the continent. Activate before you fly and data works on landing.",
      },
      {
        question: "Do I really need to validate train tickets in Italy?",
        answer:
          "Yes — for regional trains with open (non-reserved) paper tickets, stamp them in the green validation machines on the platform before boarding, or you risk a fine of €50+ on board even with a valid ticket. High-speed Frecciarossa/Italo tickets and digital QR tickets are tied to a specific train and need no validation.",
      },
      {
        question: "What is a ZTL and why does it matter for rental cars?",
        answer:
          "ZTL (Zona a Traffico Limitato) zones are camera-enforced no-drive areas covering the historic centers of Rome, Florence, Milan, Pisa, and most Italian towns. Crossing the line triggers an automatic fine of €80+ per pass — and tourists routinely collect several in one wrong loop, delivered via the rental company months later with an admin fee on top. Park outside the center and walk or train in.",
      },
      {
        question: "Is Venice's tourist entry fee still in effect?",
        answer:
          "Yes — on designated peak dates (mostly spring and summer weekends), day-trippers must book and pay an access fee of €5–10 before entering Venice's historic center, enforced with QR-code checks. Overnight visitors staying in registered accommodation are exempt but must still register. Check Venice's official access-fee calendar when planning your dates.",
      },
      {
        question: "Can I send money to or from Italy at a good rate?",
        answer:
          "Yes. Wise, OFX, Instarem, and similar specialists move money into or out of an Italian IBAN at near mid-market rates — typically 2–5% better than a bank's international wire once the exchange-rate markup is counted. Within the eurozone, SEPA transfers are free; for USD/GBP conversions, compare on the actual EUR amount delivered, not the advertised fee.",
      },
    ],

    relatedCorridorSlug: "usa-to-europe",
  },

  turkey: {
    slug: "turkey",
    countryName: "Turkey",
    countryCode: "tr",
    region: "Eurasia",
    currency: "TRY",
    currencyName: "Turkish Lira",
    currencySymbol: "₺",
    topSourceCurrencies: ["USD", "EUR", "GBP"],
    capital: "Ankara",
    languages: ["Turkish"],
    callingCode: "+90",
    plugTypes: ["C", "F"],
    voltage: "230V / 50Hz",
    timezone: "TRT (UTC+3)",

    tldr:
      "Turkey uses the Turkish Lira (₺, TRY) — as of June 2026, 1 USD is worth roughly 44 TRY, and with the lira's steady depreciation you should always check a live rate before you fly. Exchange cash at city-center döviz offices (not the airport, not hotels) — Istanbul's exchange bureaus offer some of the tightest spreads in the world. Cards work widely in cities, but bazaars, dolmuş minibuses, and small lokantas want cash. High inflation means menu prices change often; think in dollars or euros, not memorized lira prices.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "Turkey straddles two continents and delivers more variety per dollar than almost anywhere in Europe's orbit: Istanbul's imperial mosques and bazaars, the cave hotels and dawn balloon flights of Cappadocia, the turquoise coast around Fethiye, and the travertine terraces of Pamukkale. Years of lira depreciation have kept it firmly in the value category for anyone earning dollars, euros, or pounds — a full kebab meal runs the equivalent of $4–8, a Bosphorus public ferry crossing under a dollar, and a night in a good Cappadocia cave hotel a fraction of European boutique prices. The trade-off is volatility: with inflation still high, prices in lira move constantly, and quoting exact figures has a short shelf life.\n\nThis guide covers the money mechanics that matter here more than almost anywhere — why döviz exchange offices beat banks, which ATMs skim foreign cards, how the lira's denominations work — plus eSIM options, etiquette for mosques and bazaars, and the scams that work Istanbul's tourist districts. Sending money to or from Turkey? Our live comparison shows what actually lands in a Turkish account.",
    keyStats: [
      { label: "Currency", value: "Turkish Lira (₺, TRY)" },
      { label: "Typical daily cost (mid-range)", value: "$60–$110 USD" },
      { label: "Best time to visit", value: "April – June & September – October" },
      { label: "Visa (US/UK/EU, 2026)", value: "Visa-free 90 days for most Western passports" },
      { label: "Power", value: "230V / 50Hz, plug types C, F" },
      { label: "Tipping", value: "5–10% in restaurants; round up taxis" },
    ],

    culture: {
      overview:
        "Turkish culture blends Mediterranean warmth with deep traditions of hospitality — expect to be offered çay (tea) constantly: in shops, during carpet negotiations, by strangers. Accepting it carries no purchase obligation; it's genuine custom. Turkey is a secular republic with a Muslim-majority population, so norms vary enormously between Istanbul's cosmopolitan districts, the religious heartland of Anatolia, and the beach resorts. Bargaining is expected in bazaars (start around half the opening price, stay friendly) but not in shops with marked prices. Respect for Atatürk, the republic's founder, is both heartfelt and legally protected.",
      dos: [
        "Accept tea when offered — refusing outright can seem cold; a polite sip and thanks is enough. 'Teşekkürler' (thanks) and 'merhaba' (hello) earn instant goodwill.",
        "Dress appropriately for mosques: shoulders and knees covered for everyone, headscarves for women (lent at the door of major mosques), shoes off and carried in a bag.",
        "Haggle in bazaars with humor and patience — it's a social ritual, not combat. Walking away politely is a legitimate move that often improves the price.",
        "Carry small banknotes — taxi drivers and small vendors genuinely struggle to change a ₺1,000 note, and 'no change' can become a tip you didn't intend.",
        "Use Istanbulkart for all Istanbul public transport — one card covers trams, ferries, metro, and buses at a fraction of single-ticket prices.",
      ],
      donts: [
        "Don't disrespect Atatürk or national symbols — insulting the republic's founder is a criminal offense, and the reverence is genuine, not performative.",
        "Don't photograph people praying, military installations, or anyone without asking — especially women in conservative areas.",
        "Don't show public affection beyond hand-holding outside cosmopolitan Istanbul districts and beach resorts.",
        "Don't blow your nose at the table, point your finger directly at people, or show the soles of your shoes when sitting — all read as rude.",
        "Don't accept drink invitations from new 'friends' to bars in Taksim/Beyoğlu — the inflated-bill bar scam is Istanbul's most notorious tourist trap, ending in bills of hundreds of dollars.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash remains essential: bazaars, dolmuş shared minibuses, small lokantas, çay gardens, public toilets, and tips all run on lira notes. Cards cover the rest in cities. Because of inflation, carry modest amounts and top up often rather than exchanging a large sum that loses value in your pocket.",
      cardAcceptance:
        "Visa and Mastercard are widely accepted in city restaurants, hotels, supermarkets, and chain stores; contactless is standard. Amex is rare. Some shops quote a discount for cash ('nakit') — a legacy of card commissions. In bazaars, cash gives you real bargaining leverage even where cards are technically accepted.",
      atmAvailability:
        "ATMs are everywhere, but most Turkish banks now charge foreign cards withdrawal fees and some add poor exchange rates on top. Ziraat, Halkbank, and VakıfBank (state banks) have historically charged the least — compare the offered rate on screen, always decline currency conversion (choose TRY), and reject any 'rate guarantee' button. Withdrawing larger amounts less often limits the fee damage; better yet, exchange foreign cash at a döviz office instead.",
      tippingNorms:
        "Tip 5–10% in sit-down restaurants (cash preferred — hand it to the waiter or leave it in the folder; it often can't be added to the card). Round up taxi fares. ₺50–100 for hotel porters and housekeeping per stay, more in luxury hotels. Hamam attendants expect 10–20% of the treatment price.",
      commonScams: [
        "The Beyoğlu bar scam — a friendly stranger invites you for a drink; the bill arrives at $300–500 with intimidating staff. Decline bar invitations from new acquaintances, full stop.",
        "Taxi tricks — 'broken' meters, the long way around, or sleight-of-hand with notes (you paid ₺200, driver shows ₺20). Use the BiTaksi or Uber app so the route and fare are logged, and state note denominations aloud as you hand them over.",
        "The shoe-shine brush drop — a shiner drops his brush ahead of you; when you return it, you get a 'free' shine that ends in aggressive payment demands.",
        "Restaurant bill padding in tourist districts — unordered mezes brought to the table aren't free, and unpriced fish can be astonishing. Confirm prices before accepting anything.",
        "Counterfeit or short-changed currency at informal exchanges — only change money at licensed döviz offices with posted rates, and count notes before leaving the counter.",
      ],
    },

    notes: [
      { denomination: "5 TRY", color: "Brown / Amber", figure: "Atatürk (obverse), historian of science Aydın Sayılı (reverse)" },
      { denomination: "10 TRY", color: "Red", figure: "Atatürk (obverse), mathematician Cahit Arf (reverse)" },
      { denomination: "20 TRY", color: "Green", figure: "Atatürk (obverse), architect Mimar Kemaleddin (reverse)" },
      { denomination: "50 TRY", color: "Orange", figure: "Atatürk (obverse), novelist Fatma Aliye (reverse)" },
      { denomination: "100 TRY", color: "Blue", figure: "Atatürk (obverse), composer Buhurizade Itri (reverse)" },
      { denomination: "200 TRY", color: "Pink / Purple", figure: "Atatürk (obverse), poet Yunus Emre (reverse)" },
    ],

    exchangeGuide:
      "Turkey is one of the few destinations where bringing crisp USD or EUR cash to exchange locally is genuinely the best strategy. Licensed döviz (exchange) offices in Istanbul — clustered around the Grand Bazaar, Eminönü, and every commercial district — run spreads under 1%, dramatically better than airports (5–10% worse), hotels, or home-country banks. Rates are posted on electronic boards; they're competitive enough that shopping between two adjacent offices rarely pays. Exchange modest amounts at a time since the lira loses value steadily. Avoid airport exchange beyond taxi money (~$20 worth). For larger transfers into or out of Turkish banks, Wise and other specialists handle TRY with transparent rates — compare carefully, as TRY corridors carry wider margins than major currencies.",

    sports: {
      overview:
        "Football is Turkey's consuming passion, and the Istanbul derbies between Galatasaray, Fenerbahçe, and Beşiktaş are among the most intense fixtures in world football — the noise at a sold-out derby is genuinely physical. Match tickets for ordinary fixtures are affordable, though derbies require the Passolig fan card system. Beyond football, Turkey's signature spectacle is oil wrestling (yağlı güreş): the Kırkpınar tournament near Edirne, held since 1346, is the world's oldest continuously running sporting competition. Basketball is strong (Anadolu Efes and Fenerbahçe contest the EuroLeague), and the Istanbul Marathon is the world's only race run across two continents.",
      highlights: [
        "Süper Lig football — Galatasaray's RAMS Park and Fenerbahçe's Şükrü Saracoğlu; buy through Passolig/official channels, never touts.",
        "Kırkpınar Oil Wrestling Festival (late June/early July, Edirne) — 670+ years old and a UNESCO-listed cultural event.",
        "EuroLeague basketball (Oct–May) — Anadolu Efes and Fenerbahçe Beko play at a level just below the NBA.",
        "Istanbul Marathon (November) — the only marathon on earth that starts in Asia and finishes in Europe, crossing the Bosphorus bridge.",
      ],
    },

    bestTime:
      "April to June and September to October are ideal across the country — comfortable in Istanbul, warm on the coast, and prime flying weather for Cappadocia's balloons. July and August are hot (Istanbul humid, the southeast scorching) and peak-priced on the coast, though it's high beach season. Cappadocia is magical year-round — including under snow in winter, when hotel prices halve. Note Ramadan's dates (shifting earlier each year) if you want full restaurant access in conservative regions, though tourist areas operate normally.",
    visa:
      "As of 2026, most Western passports — including the US, UK, EU states, and Canada — enter Turkey visa-free for up to 90 days in any 180-day period, after Turkey lifted e-Visa requirements for US and Canadian citizens in late 2023. Australians and some other nationalities still need the e-Visa (about $50, instant online at evisa.gov.tr). Passports need 6 months' validity. Rules change with diplomatic weather — verify at the official e-Visa site before booking.",
    safety:
      "Turkey's tourist regions — Istanbul, Cappadocia, the Aegean and Mediterranean coasts — are statistically safe, with petty scams a far bigger risk than crime. Avoid the immediate Syrian border provinces (Western governments advise against travel there). Earthquakes are a real long-term risk in this seismic country; note your hotel's exits. Demonstrations occasionally flare in Istanbul and Ankara — steer around them. Tap water is technically treated but locals drink bottled, and you should too (a 5L bottle costs pennies). Emergency number: 112.",
    highlights: [
      {
        name: "Istanbul",
        summary:
          "Hagia Sophia, the Blue Mosque, Topkapı Palace, the Grand Bazaar's 4,000 shops, and a public-ferry Bosphorus crossing between continents for under a dollar. 4 days minimum; stay in Sultanahmet for sights or Karaköy/Beyoğlu for food and nightlife.",
      },
      {
        name: "Cappadocia",
        summary:
          "Dawn hot-air balloon flights over fairy-chimney valleys ($150–250, book ahead, weather-dependent), cave hotels in Göreme, and underground cities at Derinkuyu. Worth three nights to allow a balloon weather buffer.",
      },
      {
        name: "Antalya & the Turquoise Coast",
        summary:
          "Roman harbor old town, beaches, and ancient cities (Perge, Aspendos) — then west to Kaş and Fethiye for the Blue Lagoon at Ölüdeniz and the Lycian Way coastal trail.",
      },
      {
        name: "Ephesus & İzmir",
        summary:
          "The best-preserved Roman city in the Mediterranean — the Library of Celsus and terraced houses are extraordinary. Base in Selçuk or coastal Kuşadası; go at opening to beat cruise crowds.",
      },
      {
        name: "Pamukkale",
        summary:
          "Blinding-white travertine terraces with warm spring pools, topped by the Roman spa city of Hierapolis — swim among submerged ancient columns in Cleopatra's Pool.",
      },
      {
        name: "Bodrum & the Aegean",
        summary:
          "Turkey's stylish resort peninsula — the Castle of St. Peter, gulet boat trips, and whitewashed villages. Pricier than the Mediterranean coast but with Greek-island polish.",
      },
    ],

    budget: {
      backpacker: "$30–$50 USD per day",
      midRange: "$60–$110 USD per day",
      luxury: "$200+ USD per day",
      note:
        "Backpacker assumes hostels/pensions, lokanta and street food (döner, simit), and intercity buses. Mid-range covers boutique hotels, restaurant meals, domestic flights, and a balloon-ride splurge spread across the trip. Istanbul and Bodrum are the priciest; Cappadocia hotels span every budget. Lira inflation means USD figures stay roughly stable while lira prices climb.",
    },

    faqs: [
      {
        question: "How much is the Turkish Lira worth in 2026?",
        answer:
          "As of June 2026, 1 USD buys roughly 44 TRY and 1 EUR roughly 50 TRY — but the lira depreciates steadily against major currencies, so check a live rate just before you travel. For sense of scale: a kebab meal runs ₺150–350, an Istanbul tram ride about ₺30, and a Bosphorus public ferry under ₺50. Think in your home currency rather than memorizing lira prices.",
      },
      {
        question: "Where is the best place to exchange money in Turkey?",
        answer:
          "Licensed döviz (currency exchange) offices in city centers — around Istanbul's Grand Bazaar, Eminönü, and Taksim — offer spreads under 1%, among the best in the world. Bring clean USD or EUR notes. Avoid airport counters (5–10% worse) and hotels. Exchange modest amounts at a time: the lira in your pocket loses value week by week.",
      },
      {
        question: "Should I use cash or card in Turkey?",
        answer:
          "Both. Cards work fine in city restaurants, hotels, and shops, but you need lira cash for bazaars, dolmuş minibuses, small eateries, tips, and public toilets. Cash also wins discounts and bargaining power. Use döviz offices rather than ATMs where possible — most Turkish bank ATMs now charge foreign cards fees, with state banks (Ziraat, VakıfBank) typically cheapest.",
      },
      {
        question: "Is Turkey cheap for tourists in 2026?",
        answer:
          "Yes — for anyone earning dollars, euros, or pounds, Turkey is one of the best-value destinations in Europe's orbit. Mid-range travelers live well on $60–$110 a day including boutique hotels and restaurant meals; backpackers manage on $30–$50. The exceptions are imported goods, alcohol (heavily taxed), and headline experiences like Cappadocia balloon flights ($150–250).",
      },
      {
        question: "Do Americans need a visa for Turkey?",
        answer:
          "No — since late 2023, US citizens (along with UK, EU, and Canadian passport holders) enter Turkey visa-free for up to 90 days in any 180-day period. Australians and some other nationalities still need the e-Visa, issued instantly online at the official evisa.gov.tr site for about $50. Ensure 6 months of passport validity, and re-verify rules before booking as they can change.",
      },
      {
        question: "Is Istanbul safe for tourists?",
        answer:
          "Yes — Istanbul's tourist districts are statistically safer than most large European cities for violent crime. The real risks are scams: the notorious Beyoğlu bar scam (a new 'friend' invites you for drinks; the bill is $300+), taxi meter games, and bill padding in tourist restaurants. Use BiTaksi or Uber for taxis, decline drink invitations from strangers, and confirm prices before ordering.",
      },
      {
        question: "How much does a Cappadocia balloon ride cost?",
        answer:
          "Standard dawn flights run $150–250 per person in 2026, depending on basket size and season; premium small-basket flights cost more. Book ahead and build at least one buffer day into your Cappadocia stay — flights are cancelled in wind or poor visibility (it happens regularly), and operators reschedule or refund. Flights are at sunrise only; pickups around 4:30–5am.",
      },
      {
        question: "What's the best eSIM for Turkey?",
        answer:
          "Turkey is NOT covered by EU roaming, so a dedicated Turkey eSIM matters even if you have a Europe plan. Airalo, Holafly, and Nomad offer Turkey packages from roughly $10–$35 riding on Turkcell/Vodafone networks. Local SIMs from Turkcell shops are an alternative but involve passport registration and queues — the eSIM wins on convenience for stays under a month.",
      },
      {
        question: "Do you tip in Turkey?",
        answer:
          "Yes, modestly: 5–10% in sit-down restaurants, ideally in cash since many card machines can't add tips. Round up taxi fares. In hamams, attendants expect 10–20% of the treatment price, and ₺50–100 for hotel staff per stay is appreciated. No tipping at street-food stands, kiosks, or for çay.",
      },
      {
        question: "Can I drink tap water in Turkey?",
        answer:
          "Stick to bottled water, like the locals do. Turkish tap water is chlorinated and technically treated, but quality varies by city and building, and virtually all residents drink bottled or delivered spring water. Bottled water is extremely cheap (a half-liter costs pennies at markets). Brushing teeth with tap water is fine.",
      },
      {
        question: "What's the cheapest way to send money to or from Turkey?",
        answer:
          "Specialist transfer services (Wise, Remitly, and others supporting TRY) beat bank wires substantially — Turkish banks layer wide FX margins onto international transfers. Because TRY is volatile, margins on lira corridors are wider than for EUR or GBP, so comparing on the final TRY amount delivered matters more here than almost anywhere. For receiving money in Turkey, transfers into a Turkish bank account in TRY usually beat USD-denominated accounts for spending purposes.",
      },
    ],
  },

  "united-kingdom": {
    slug: "united-kingdom",
    countryName: "United Kingdom",
    countryCode: "gb",
    region: "Northern Europe",
    currency: "GBP",
    currencyName: "British Pound",
    currencySymbol: "£",
    topSourceCurrencies: ["USD", "EUR", "AUD", "INR"],
    capital: "London",
    languages: ["English", "Welsh", "Scottish Gaelic"],
    callingCode: "+44",
    plugTypes: ["G"],
    voltage: "230V / 50Hz",
    timezone: "GMT (UTC+0, UTC+1 in summer)",

    tldr:
      "The UK uses the British Pound (£, GBP) — as of June 2026, £1 is worth roughly $1.33 USD. Britain is effectively cashless: contactless card or phone tap covers everything from the London Tube (which auto-caps your daily fare) to market stalls and pubs, and many visitors never touch a banknote. Don't buy pounds before you travel — just bring a no-foreign-fee card. One new admin item: visa-exempt visitors (including Americans and Europeans) now need an ETA (£16, online) before boarding their flight.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "The United Kingdom packs four nations into one island group: London's museums and theatre, Edinburgh's castle-topped skyline, the Lake District and Scottish Highlands, and a pub culture that doubles as the national living room. It's an expensive destination by global standards — London hotel prices rival New York — but it's also stacked with world-class free things: the British Museum, National Gallery, Tate Modern, and nearly every major national museum charge nothing for their permanent collections. A pub pint runs £5–7 in London (£4–5 elsewhere), a Tube ride caps at about £8.90 a day with contactless, and advance-booked trains can cross the country for a fraction of walk-up fares.\n\nThis guide covers money on the ground — why the UK is Europe's most card-first economy, what the polymer banknotes look like, how Scottish notes work — plus the ETA entry requirement, eSIM picks, etiquette (queueing is sacred), and realistic daily budgets. Moving larger sums to or from a UK account? Our live comparison shows which provider delivers the most pounds.",
    keyStats: [
      { label: "Currency", value: "British Pound (£, GBP)" },
      { label: "Typical daily cost (mid-range)", value: "$140–$230 USD" },
      { label: "Best time to visit", value: "May – September" },
      { label: "Visa (US/EU/AU, 2026)", value: "Visa-free 6 months + ETA (£16, online)" },
      { label: "Power", value: "230V / 50Hz, plug type G" },
      { label: "Tipping", value: "10–12.5% in restaurants if no service charge; never in pubs" },
    ],

    culture: {
      overview:
        "British social life runs on understatement, politeness, and the queue. Jumping a queue — at a bus stop, bar, or ticket machine — is the closest thing to a national crime, while 'sorry' functions as greeting, apology, and objection alike. The pub is the social institution: order and pay at the bar (no table service for drinks), rounds are bought for the group in turn, and tipping the bartender isn't done. Conversation favors self-deprecation and weather; loud overt confidence reads as boasting. Each home nation — England, Scotland, Wales, Northern Ireland — has its own identity, and calling a Scot or Welsh person 'English' will not go well.",
      dos: [
        "Queue properly, everywhere — and on London escalators, stand on the right, walk on the left. This is enforced by collective glaring.",
        "Order at the bar in pubs: drinks (and usually food) are ordered and paid for at the counter, and buying 'rounds' for your group in turn is the custom.",
        "Book trains in advance on apps like Trainline or operator sites — advance fares can be a third of walk-up prices, and a Railcard (£30/year) cuts a third off most fares if you make multiple trips.",
        "Say please and thank you liberally — transactional bluntness ('Give me a coffee') genuinely lands as rude.",
        "Use contactless or phone tap for all London transport — it automatically calculates daily and weekly fare caps, always beating paper tickets.",
      ],
      donts: [
        "Don't jump queues, ever — even informal ones at bus stops have an understood order.",
        "Don't tip in pubs or for counter service — it's not done, and offering can cause mild embarrassment. 'And one for yourself' (buying the bartender a drink) is the traditional gesture instead.",
        "Don't call Scottish, Welsh, or Northern Irish people 'English', and don't use 'England' to mean the whole UK.",
        "Don't talk loudly on trains — the 'quiet coach' is enforced by passengers, and even regular carriages run hushed by international standards.",
        "Don't block the doors on the Tube or try to board before passengers exit — London commuter etiquette is strict and time-pressed.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash is accepted almost everywhere but actively needed almost nowhere — the UK is Europe's most card-first economy, and some cafés and market stalls are now card-only. £20–40 covers a week of edge cases (the odd village shop, honesty boxes, some barbers). Don't pre-buy pounds at home; rates are poor and you won't need the cash.",
      cardAcceptance:
        "Contactless Visa/Mastercard or Apple/Google Pay works everywhere: pubs, buses, the Tube (with automatic fare capping), market stalls, taxis, churches' donation terminals. Amex acceptance is decent in cities but patchy at independents. The £100 contactless limit rarely bites since phone payments verify biometrically with no cap.",
      atmAvailability:
        "Free-to-use ATMs ('cash machines' or 'cashpoints') from major banks (Barclays, HSBC, Lloyds, NatWest) are widespread; avoid the paid machines in convenience stores (£1.50–2 fee, shown on screen). Link-network bank ATMs charge nothing locally. As everywhere: if the screen offers to charge you in your home currency, decline — choose GBP.",
      tippingNorms:
        "Restaurants: 10–12.5%, but check the bill first — a 'discretionary service charge' of 12.5% is now added by default at most London restaurants, in which case add nothing. Pubs and bars: no tipping. Taxis: round up. Hotel housekeeping: £1–2 a night if you wish. Counter-service coffee: no.",
      commonScams: [
        "Unlicensed minicab touts outside stations and clubs — only use black cabs (hailable, metered), pre-booked minicabs, or Uber/Bolt. Touts soliciting fares are illegal and uninsured.",
        "Paid-entry 'ticket helpers' at Tube machines — staff in uniform never approach machines asking to handle your card. Politely decline anyone who does.",
        "Pickpocketing and phone-snatching in central London — e-bike phone snatching around busy junctions (Oxford Street, Shoreditch) is the era's signature street crime. Keep phones away from the kerb.",
        "Fake charity clipboard collectors and 'found gold ring' games around tourist hotspots — registered collectors carry visible ID and never take cash on the street aggressively.",
        "Dynamic currency conversion at card terminals and ATMs — always pay in GBP, never accept the 'convert to your home currency' offer, which costs 3–6%.",
      ],
    },

    notes: [
      { denomination: "5 GBP", color: "Turquoise / Blue", figure: "King Charles III (obverse), Winston Churchill (reverse)" },
      { denomination: "10 GBP", color: "Orange / Brown", figure: "King Charles III (obverse), Jane Austen (reverse)" },
      { denomination: "20 GBP", color: "Purple", figure: "King Charles III (obverse), J.M.W. Turner (reverse)" },
      { denomination: "50 GBP", color: "Red", figure: "King Charles III (obverse), Alan Turing (reverse) — shops outside London often eye it warily" },
    ],

    exchangeGuide:
      "Don't exchange cash for a UK trip — bring a no-foreign-fee debit card (Wise, Revolut, or your bank's travel card) and tap your way through the country, withdrawing £20–40 from a bank cashpoint only if a specific need arises. Airport bureaux and high-street 'tourist rate' boards run 4–10% off mid-market. All UK notes are polymer (plastic); Scottish and Northern Irish banks issue their own designs, which are valid currency UK-wide, though some English shops hesitate — any bank will swap them for Bank of England notes free. For larger transfers — UK tuition (a major use-case), property, or salaries — Wise, OFX, and similar specialists deliver GBP into UK accounts at near mid-market rates, several percent better than international bank wires.",

    sports: {
      overview:
        "Britain invented or codified most of the world's major sports and treats the sporting calendar as national heritage. Premier League football is the biggest show — tickets are hard but not impossible for non-derby fixtures via official club sites — while a cheaper, arguably more atmospheric alternative is a Championship or Scottish Premiership match. Summer brings Wimbledon (enter the public ballot or queue on the day — the Queue is itself an institution), Test cricket at Lord's, and golf's Open Championship. Six Nations rugby (Feb–Mar) takes over Twickenham, Cardiff, and Edinburgh's Murrayfield in turn.",
      highlights: [
        "Premier League football (Aug–May) — buy only through official club channels or member resale; street and online touts are both illegal and rife.",
        "Wimbledon (late June–early July) — the public ballot opens the previous autumn; same-day Queue tickets for outer courts remain a genuine option.",
        "Test cricket at Lord's or the Oval (summer) — a five-day match explained over beers is the most British initiation available.",
        "Six Nations rugby (Feb–Mar) — international matchdays in Cardiff and Edinburgh transform the entire city into the stadium.",
      ],
    },

    bestTime:
      "May to September offers the longest days and warmest weather — June especially, when Scotland stays light past 10pm. July–August is peak season and peak pricing, with Edinburgh exploding in August for the Fringe (book that city a year out). British weather is changeable year-round: pack a rain layer in any month and treat any forecast over 22°C as a heatwave by local standards. Winter is short-dayed and grey but cheap, with excellent museum weather and Christmas markets; the Highlands under snow are spectacular if you're equipped.",
    visa:
      "US, EU, Canadian, Australian, and NZ passport holders don't need a visa for visits up to 6 months — but since 2025 they DO need an Electronic Travel Authorisation (ETA): £16, applied for via the official UK ETA app or gov.uk, usually approved within days, valid 2 years for unlimited visits. Airlines check it at boarding. Note the UK is NOT in Schengen — time here doesn't count against the EU's 90/180 rule, a useful fact for long European trips.",
    safety:
      "The UK is very safe by global standards; violent crime against tourists is rare. London's realistic risks are phone-snatching by riders on e-bikes (keep phones off the kerbside), pickpockets on the Tube and Oxford Street, and drink spiking in nightlife districts — watch your glass. Outside cities, the main hazard is hill weather: Scottish and Lake District conditions change fast, and mountain rescue callouts are mostly unprepared walkers. Emergency number: 999 (or 112).",
    highlights: [
      {
        name: "London",
        summary:
          "The British Museum, Tower of London, West End theatre, Borough Market, and free national museums everywhere. Budget 4–5 days minimum, use contactless fare capping, and book big sights and shows ahead.",
      },
      {
        name: "Edinburgh",
        summary:
          "The castle on its crag, the medieval Royal Mile, Arthur's Seat hike, and August's Fringe — the world's largest arts festival. Two days minimum; book August accommodation many months out.",
      },
      {
        name: "Scottish Highlands & Isle of Skye",
        summary:
          "Glencoe, Loch Ness, the Fairy Pools, and the Old Man of Storr. Self-drive is the way (single-track-road etiquette: use passing places); midges bite June–August, so carry repellent.",
      },
      {
        name: "Bath & the Cotswolds",
        summary:
          "Roman baths and Georgian crescents in Bath, then honey-stone villages (Bibury, Castle Combe, Bourton) across the Cotswolds. Doable by car or as structured day tours from London.",
      },
      {
        name: "Lake District",
        summary:
          "England's walking heartland — Windermere, Keswick, and fells from gentle to serious. The UK's most popular national park; book summer weekends ahead and pack for four seasons in a day.",
      },
      {
        name: "York",
        summary:
          "The Minster, the medieval Shambles, intact city walls, and the National Railway Museum (free) — England's best-preserved historic city, two hours from London by train.",
      },
    ],

    budget: {
      backpacker: "$70–$100 USD per day",
      midRange: "$140–$230 USD per day",
      luxury: "$400+ USD per day",
      note:
        "Backpacker assumes hostels, supermarket meal deals (£3–4), free museums, and buses/advance trains. Mid-range covers a 3-star double, one restaurant meal plus a pub meal daily, and intercity trains booked ahead. London runs 30%+ above the national baseline — northern England, Wales, and much of Scotland are markedly cheaper.",
    },

    faqs: [
      {
        question: "Do I need cash in the UK?",
        answer:
          "Essentially no. The UK is Europe's most card-first economy — contactless or phone tap covers transport, pubs, market stalls, and even church donation boxes, and some venues are card-only. £20–40 from a bank cashpoint covers rare edge cases. Use a no-foreign-fee card and always choose to be charged in GBP when terminals offer your home currency.",
      },
      {
        question: "What is the UK ETA and do Americans need it?",
        answer:
          "Yes. Since 2025, all visa-exempt visitors — including US, EU, Canadian, and Australian passport holders — need an Electronic Travel Authorisation before traveling to the UK. It costs £16, is applied for through the official UK ETA app or gov.uk in about 10 minutes, is usually approved within 3 working days, and is valid for two years of unlimited visits up to 6 months each. Airlines verify it at check-in.",
      },
      {
        question: "How does paying for the London Tube work?",
        answer:
          "Just tap a contactless card or phone at the gates — no ticket needed. The system charges per ride and automatically caps your spending at the daily rate (about £8.90 for central zones) and weekly rate, so you can never overpay versus a travelcard. Use the same card/device every time so the caps track, and tap in AND out on rail services. Paper single tickets cost dramatically more.",
      },
      {
        question: "How much do you tip in the UK?",
        answer:
          "Restaurants: 10–12.5% — but most London restaurants now add a 'discretionary service charge' of 12.5% automatically, in which case add nothing more. Never tip in pubs (offering can cause mild embarrassment; buy the bartender a drink instead with 'and one for yourself'). Taxis: round up. No tipping for counter service or coffee.",
      },
      {
        question: "Are Scottish banknotes legal in England?",
        answer:
          "Yes — notes issued by Scottish and Northern Irish banks are legitimate sterling and valid throughout the UK, though some English shops hesitate over unfamiliar designs. If you collect Scottish notes and meet resistance, any bank branch will swap them for Bank of England notes for free, or just spend them at larger chains. ATMs in Scotland dispense Scottish notes as standard.",
      },
      {
        question: "Is London expensive to visit in 2026?",
        answer:
          "London is one of Europe's priciest cities for accommodation — but unusually cheap for sights, because the major national museums (British Museum, National Gallery, Tate Modern, Natural History Museum, V&A) are all free for their permanent collections. Mid-range visitors should budget $180–$250 a day in London; the rest of the UK runs 30% or more below that. Supermarket meal deals, pub lunches, and theatre day-seats are the savings levers.",
      },
      {
        question: "What's the cheapest way to travel between UK cities?",
        answer:
          "Book trains in advance — Advance fares released ~12 weeks out can be a third of walk-up prices (London–Edinburgh from ~£30 versus £150+ on the day). A £30 Railcard cuts a third off most fares and pays for itself in one or two trips. Coaches (National Express, Megabus, FlixBus) are slower but cheapest of all. Walk-up train tickets are among the most expensive per mile in Europe — never buy day-of for long routes.",
      },
      {
        question: "What's the best eSIM for the UK?",
        answer:
          "Airalo, Holafly, and Ubigi offer UK eSIMs from roughly $7–$35 riding on EE/O2/Vodafone networks. Note that since Brexit, the UK is NOT included in many EU-region eSIM plans — check coverage lists carefully if you're combining the UK with continental Europe, or buy a plan that explicitly covers 'Europe including UK'.",
      },
      {
        question: "Is the UK safe for tourists?",
        answer:
          "Very. The realistic London risks are phone-snatching by e-bike riders (keep your phone away from the kerb when texting), Tube pickpockets, and unlicensed minicab touts at night — use black cabs, Uber, or pre-booked cars only. Outside cities, the main danger is genuinely the weather on hills: Scottish mountain conditions turn fast. Emergency number: 999 or 112.",
      },
      {
        question: "What's the cheapest way to send money to or from the UK?",
        answer:
          "Specialists like Wise, OFX, Revolut, and Instarem deliver GBP into UK accounts at near mid-market rates — typically 2–5% better than bank international wires once the exchange-rate markup is counted. The UK's Faster Payments system means incoming GBP transfers usually arrive within hours. For recurring needs like UK university tuition or rent, locking a rate with a specialist beats repeated bank wires substantially.",
      },
    ],

    relatedCorridorSlug: "usa-to-uk",
  },

  india: {
    slug: "india",
    countryName: "India",
    countryCode: "in",
    region: "South Asia",
    currency: "INR",
    currencyName: "Indian Rupee",
    currencySymbol: "₹",
    topSourceCurrencies: ["USD", "GBP", "AED", "EUR"],
    capital: "New Delhi",
    languages: ["Hindi", "English", "and 20+ official regional languages"],
    callingCode: "+91",
    plugTypes: ["C", "D", "M"],
    voltage: "230V / 50Hz",
    timezone: "IST (UTC+5:30)",

    tldr:
      "India uses the Indian Rupee (₹, INR) — as of June 2026, 1 USD is worth roughly 89 INR. The rupee is a closed currency: you exchange after arrival, not before. Daily payments run on a three-layer system — UPI QR codes dominate for locals (tourists can join via prepaid UPI wallets issued at major airports), cards work in cities and hotels, and cash remains king for rickshaws, street food, and small towns. Carry small notes: nobody can ever change a ₹500.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "India is less a country than a continent compressed: 1.4 billion people, 22 official languages, and a span from Himalayan passes to tropical backwaters. It's also among the world's cheapest rewarding destinations — a thali lunch runs ₹100–250 ($1–3), an auto-rickshaw hop ₹50–150, and an overnight train across half the country costs less than a city taxi ride at home. The classic first-trip circuit is the Golden Triangle (Delhi, Agra's Taj Mahal, Jaipur), but Kerala's backwaters, Varanasi's ghats, and Goa's beaches are equally canonical. India rewards travelers who arrive with patience: the sensory volume, the bureaucracy, and the friendly chaos are all part of the deal.\n\nThis guide covers money in the world's most fascinating payments market — how tourists can now use UPI, why the rupee can't be exported, which notes look like what after the 2016 redesign — plus the e-Visa process, eSIM picks, cultural ground rules, and honest scam warnings for Delhi and the tourist trail. Sending money to or from India? It's the world's largest remittance corridor, and our comparison shows who delivers the most rupees.",
    keyStats: [
      { label: "Currency", value: "Indian Rupee (₹, INR)" },
      { label: "Typical daily cost (mid-range)", value: "$40–$80 USD" },
      { label: "Best time to visit", value: "October – March" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "e-Visa required — apply online, from ~$25" },
      { label: "Power", value: "230V / 50Hz, plug types C, D, M" },
      { label: "Tipping", value: "5–10% in restaurants; ₹50–100 for porters and drivers" },
    ],

    culture: {
      overview:
        "India's cultural rules vary by region and religion, but a few constants hold: the right hand is for eating and giving (the left is considered unclean), shoes come off at temples and homes, and modest dress earns respect everywhere outside Goa's beaches and upscale urban districts. The famous head wobble means anything from 'yes' to 'I acknowledge you' — context is everything. Hospitality is sincere and sometimes overwhelming ('Atithi Devo Bhava' — the guest is god); invitations to chai or family meals are usually genuine. Personal questions (your salary, marital status) are normal conversation, not rudeness.",
      dos: [
        "Eat and pass items with your right hand — the left hand is reserved for hygiene and using it for food or greetings is genuinely impolite.",
        "Remove shoes at temples, mosques, gurdwaras, and private homes — and cover your head at Sikh gurdwaras (scarves provided). Many temples also ban leather items.",
        "Dress modestly — covered shoulders and knees for everyone outside beach zones; women may want a scarf for temples. Lightweight cotton beats revealing gear on comfort anyway.",
        "Negotiate auto-rickshaw fares before boarding, or insist on the meter where they exist — or skip the negotiation entirely with Uber/Ola, which India runs on.",
        "Drink only bottled or filtered water (check the seal), eat hot, freshly cooked food, and ease into street food via busy stalls with high turnover — they're busy for a reason.",
      ],
      donts: [
        "Don't use your left hand for eating, giving money, or shaking hands.",
        "Don't show physical affection in public — even couples holding hands draws attention outside cosmopolitan areas; same-sex friends holding hands, conversely, is normal and platonic.",
        "Don't point your feet at people, deities, or shrines, and don't touch anyone's head — feet are considered unclean, the head sacred.",
        "Don't photograph people, ceremonies (especially cremations at Varanasi's ghats), or military sites without permission — at the burning ghats, cameras away entirely.",
        "Don't accept tour, hotel, or 'official tourist office' redirections from helpful strangers at stations — the real government tourism offices don't recruit on platforms.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash remains essential — rickshaws, street food, chai stalls, small shops, temples, tips, and most of small-town India run on it. The critical skill is hoarding small notes (₹10, ₹20, ₹50, ₹100): drivers and vendors chronically 'have no change' for ₹500s. Break big notes at supermarkets, chain stores, and fuel stations whenever possible.",
      cardAcceptance:
        "Cards work at hotels, mid-range-and-up restaurants, malls, supermarkets, and chain stores in cities — Visa and Mastercard primarily, Amex at upscale venues only. But India's real payment revolution is UPI: QR codes at every stall and rickshaw. Foreign tourists can access UPI via prepaid wallets (UPI One World) issued against your passport at major airports and some banks — worth doing for a longer trip.",
      atmAvailability:
        "ATMs are abundant in cities and towns (SBI, HDFC, ICICI, Axis); expect a ₹200–500 foreign-card fee per withdrawal plus your bank's fees, and per-transaction caps around ₹10,000–25,000. Use machines attached to bank branches (skimming is rarer), withdraw larger amounts less often, and decline dynamic currency conversion — always choose INR. Carry a backup card; ATMs do run dry during festival weeks.",
      tippingNorms:
        "Tipping ('baksheesh') is customary but modest: 5–10% in restaurants (check whether a service charge is already added), ₹50–100 per bag for porters, ₹100–300/day for drivers, ₹50–100 for hotel housekeeping. Small tips smooth countless interactions, but never feel obligated by demanded baksheesh for unrequested 'help'.",
      commonScams: [
        "'Your hotel is closed / burned down / fully booked' from taxi and rickshaw drivers, who then deliver you to a commission-paying hotel. Your hotel is fine — insist, or call it on speaker.",
        "Fake 'official tourist offices' around Delhi's New Delhi station and Connaught Place that rebook your entire trip at huge markups. Government offices don't have touts recruiting outside.",
        "The Jaipur/Agra gem scam — 'export gems home and resell them for profit, just pay the duty.' The gems are glass; the courtship can take days of friendly hospitality first.",
        "Inflated rickshaw fares and 'the meter is broken' — agree fares before boarding or use Uber/Ola; airport prepaid-taxi counters are the legitimate fixed-price option.",
        "Unofficial 'guides' and queue-jumpers at the Taj Mahal and major forts selling 'skip the line' access that doesn't exist — buy tickets only from official counters or the ASI online portal.",
      ],
    },

    notes: [
      { denomination: "10 INR", color: "Chocolate Brown", figure: "Gandhi (obverse), Konark Sun Temple (reverse)" },
      { denomination: "20 INR", color: "Greenish Yellow", figure: "Gandhi (obverse), Ellora Caves (reverse)" },
      { denomination: "50 INR", color: "Fluorescent Blue", figure: "Gandhi (obverse), Hampi stone chariot (reverse)" },
      { denomination: "100 INR", color: "Lavender", figure: "Gandhi (obverse), Rani ki Vav stepwell (reverse)" },
      { denomination: "200 INR", color: "Bright Yellow", figure: "Gandhi (obverse), Sanchi Stupa (reverse)" },
      { denomination: "500 INR", color: "Stone Grey", figure: "Gandhi (obverse), Red Fort (reverse) — the largest note in practical circulation" },
    ],

    exchangeGuide:
      "The rupee is a closed currency — you can't legally import or export more than ₹25,000, so exchange happens after you land. Airport counters work but run 3–5% worse than city rates; change only arrival money there (₹2,000–3,000). In cities, RBI-licensed money changers (look for the license display) and banks give fair rates — count notes at the counter and keep encashment receipts, which you'll need to convert leftover rupees back on departure. ATMs are often simpler than carrying foreign cash. For real money movement — family support, property, NRI accounts — India is the world's largest remittance market, and specialists (Wise, Remitly, Instarem) deliver INR at rates 2–6% better than banks; compare on the final rupee amount.",

    sports: {
      overview:
        "Cricket isn't India's national sport so much as its second religion — the IPL (March–May) is the world's richest cricket league, and match night in any city means packed streets and roaring TVs. Attending a game at Mumbai's Wankhede or Kolkata's 66,000-seat Eden Gardens is electric and cheap by Western sports standards (tickets from ₹500–1,000). Beyond cricket: kabaddi, the indigenous tag-wrestling hybrid, runs a glossy Pro Kabaddi League; field hockey carries Olympic heritage; and football has growing pockets of fervor in Kolkata, Kerala, and the northeast. Yoga, of course, is India's original export — Rishikesh is its self-styled world capital.",
      highlights: [
        "IPL cricket (March–May) — book via official team apps/BookMyShow; Eden Gardens in Kolkata and Wankhede in Mumbai are the cathedral experiences.",
        "Pro Kabaddi League (varies, typically late year) — fast, gladiatorial, and a uniquely Indian arena night out.",
        "International cricket (Oct–Mar) — Test matches and ODIs across the season; even neutral fixtures fill stadiums.",
        "Yoga at the source — Rishikesh ashrams offer drop-in classes to month-long teacher trainings in the Himalayan foothills.",
      ],
    },

    bestTime:
      "October to March is the golden window for most of India — dry, sunny, and comfortable across the plains, Rajasthan, and the south (December–January can be genuinely cold in Delhi and foggy enough to delay trains and flights). April to June is brutally hot (45°C+ in the northern plains) — this is when you head to the Himalayan hill stations instead (Ladakh's roads open June–September). The southwest monsoon sweeps June to September: Kerala and Goa turn lush and quiet, but transport disruptions are real. Festival timing cuts both ways — Diwali (Oct/Nov) and Holi (March) are spectacular but booked solid.",
    visa:
      "Nearly all visitors — including US, UK, EU, and Australian passport holders — need a visa, and the e-Visa is the standard route: apply at the official indianvisaonline.gov.in (beware lookalike scam sites that charge double), at least 4–7 days before travel. The 30-day double-entry e-Tourist visa runs ~$25, the 1-year multiple-entry ~$40, and the 5-year ~$80. You'll need a passport photo and passport scan; approval comes by email and is verified on arrival at e-Visa-enabled airports. Japan and a handful of countries get visa-on-arrival; check current rules before booking.",
    safety:
      "India's headline risks for visitors are mundane: traffic (cross roads with locals, never assume right of way), food and water hygiene (bottled water with sealed caps, hot fresh food), and scams rather than crime. Violent crime against tourists is rare. Women travelers should take standard precautions amplified — modest dress, pre-booked transport at night (Uber/Ola with shared trip status), women-only train carriages and metro cars where offered. Air quality in Delhi and the northern plains is seriously poor November–January; sensitive travelers should pack masks. Emergency number: 112.",
    highlights: [
      {
        name: "Delhi",
        summary:
          "Mughal Old Delhi (Jama Masjid, Red Fort, Chandni Chowk's food lanes) against imperial New Delhi (Humayun's Tomb, Qutub Minar). Chaotic, fascinating, and the usual landing point — give it 2–3 days and use the excellent metro.",
      },
      {
        name: "Agra & the Taj Mahal",
        summary:
          "The Taj at sunrise justifies every cliché — book the first slot online, then add Agra Fort and (en route to Jaipur) the ghost city of Fatehpur Sikri. Doable as a day trip from Delhi by the Gatimaan Express, better overnight.",
      },
      {
        name: "Rajasthan",
        summary:
          "Jaipur's pink old city and Amber Fort, blue-washed Jodhpur, romantic Udaipur on its lakes, and golden Jaisalmer at the Thar desert's edge — India's most-traveled circuit for good reason. Allow a week minimum.",
      },
      {
        name: "Varanasi",
        summary:
          "Hinduism's holiest city — dawn boat rides past the ghats, the evening Ganga Aarti fire ceremony, and 3,000 years of continuous urban life. Intense, profound, and not a place for cameras at the cremation ghats.",
      },
      {
        name: "Kerala",
        summary:
          "Houseboat nights on the Alleppey backwaters, tea plantations in Munnar, Fort Kochi's colonial lanes, and India at its most relaxed. The gentlest introduction to the country — many seasoned travelers start here.",
      },
      {
        name: "Goa",
        summary:
          "Former Portuguese enclave with India's best beaches — quieter Palolem and Agonda in the south, livelier Anjuna and Vagator north — plus whitewashed churches and a distinct Indo-Portuguese food culture. Season: November–February.",
      },
    ],

    budget: {
      backpacker: "$20–$35 USD per day",
      midRange: "$40–$80 USD per day",
      luxury: "$150+ USD per day",
      note:
        "Backpacker assumes guesthouses, thali meals and street food, sleeper-class trains, and rickshaws. Mid-range covers solid 3-star hotels, restaurant meals, AC train classes or domestic flights, and a private driver day or two. Luxury in India over-delivers — former palaces in Rajasthan cost what chain hotels cost elsewhere. Mumbai, Delhi, and Goa in season run well above the baseline.",
    },

    faqs: [
      {
        question: "How much is the Indian Rupee worth in 2026?",
        answer:
          "As of June 2026, 1 USD buys roughly 89 INR and £1 roughly 118 INR. For scale: a thali lunch costs ₹100–250, an auto-rickshaw hop ₹50–150, a Delhi metro ride ₹20–60, and a mid-range hotel double ₹2,500–5,000. The rupee is a closed currency — you exchange after arrival in India, not at home.",
      },
      {
        question: "Can tourists use UPI in India?",
        answer:
          "Yes — since 2023–24, foreign visitors can get prepaid UPI wallets (the 'UPI One World' scheme) issued against their passport and visa at major international airports and selected bank counters, loadable with cash or card. It lets you scan the QR codes that dominate Indian payments, from rickshaws to chai stalls. For shorter trips, cash plus cards covers everything; for stays over a couple of weeks, UPI access is genuinely game-changing.",
      },
      {
        question: "Do Americans need a visa for India?",
        answer:
          "Yes — virtually all Western passport holders need one, and the e-Visa is the standard route. Apply only at the official indianvisaonline.gov.in site (lookalike sites overcharge): ~$25 for the 30-day double-entry e-Tourist visa, ~$40 for 1 year, ~$80 for 5 years. Apply at least 4–7 days before flying; approval arrives by email and is checked on arrival at e-Visa-enabled airports.",
      },
      {
        question: "Is India cheap to travel in 2026?",
        answer:
          "India is among the cheapest rewarding destinations on earth. Backpackers travel well on $20–$35 a day; mid-range travelers on $40–$80 get good 3-star hotels, restaurant meals, and AC trains. The luxury tier is the world's best value — Rajasthan palace hotels for the price of an airport chain elsewhere. Big cities and Goa in peak season cost meaningfully more than the small-town baseline.",
      },
      {
        question: "How do I avoid getting scammed in Delhi?",
        answer:
          "Three rules cover most of it: never believe 'your hotel is closed/burned down' (it isn't — it's a commission redirect), never follow anyone to an 'official tourist office' (government offices don't recruit at stations), and use Uber/Ola or prepaid taxi counters instead of negotiating with touts. Around the big monuments, buy tickets only at official counters or the ASI online portal.",
      },
      {
        question: "Is the water safe to drink in India?",
        answer:
          "No — drink only bottled water with an intact seal, filtered water from reputable hotels, or use a purifier bottle. Skip ice outside upscale establishments, peel fruit yourself, and ease into street food via the busiest stalls (high turnover means fresh food). Most 'Delhi belly' comes from water, raw items, and ambitious day-one street-food choices.",
      },
      {
        question: "How much cash should I carry in India?",
        answer:
          "₹2,000–4,000 a day in mixed small denominations covers most mid-range travel needs, with cards/UPI handling hotels and bigger restaurants. The crucial habit is hoarding ₹10–100 notes — 'no change' for a ₹500 is a daily occurrence. ATMs charge foreign cards ₹200–500 per withdrawal, so pull out larger sums less often, from machines attached to bank branches.",
      },
      {
        question: "What's the best eSIM for India?",
        answer:
          "Airalo, Holafly, and Nomad offer India eSIMs from roughly $10–$30 riding on Airtel/Jio networks — far simpler than the local-SIM route, which requires passport registration and can take hours. Note that data-only eSIMs don't give you an Indian number, which some services (and UPI apps) want — for long stays, an Airtel/Jio tourist SIM from an official airport counter is worth the paperwork.",
      },
      {
        question: "Is India safe for solo female travelers?",
        answer:
          "Many thousands travel India solo successfully, with precautions dialed up: modest dress, pre-booked transport after dark (Uber/Ola with trip-sharing), women-only metro carriages and train compartments where offered, and accommodations chosen for reviews by other women travelers. Kerala, Himachal Pradesh, and the established Rajasthan circuit are commonly cited as gentler starting points than Delhi. Trust instincts over politeness, always.",
      },
      {
        question: "What's the cheapest way to send money to India?",
        answer:
          "India is the world's largest remittance market — over $100 billion a year — and competition is fierce: Wise, Remitly, Instarem, and others deliver INR at 2–6% better than bank wire rates. Transfers typically land in Indian accounts within minutes to hours via IMPS/UPI rails. Compare on the final INR amount delivered, not the advertised fee — the exchange-rate margin is where the cost hides.",
      },
    ],

    relatedCorridorSlug: "usa-to-india",
  },

  mexico: {
    slug: "mexico",
    countryName: "Mexico",
    countryCode: "mx",
    region: "North America",
    currency: "MXN",
    currencyName: "Mexican Peso",
    currencySymbol: "$",
    topSourceCurrencies: ["USD", "CAD", "EUR", "GBP"],
    capital: "Mexico City",
    languages: ["Spanish"],
    callingCode: "+52",
    plugTypes: ["A", "B"],
    voltage: "127V / 60Hz",
    timezone: "Mostly CST (UTC-6); no DST in most of the country",

    tldr:
      "Mexico uses the Mexican Peso ($, MXN) — as of June 2026, 1 USD is worth roughly 19 MXN. Watch the symbol: prices marked '$' are pesos, not dollars. Cards work in cities and resorts, but markets, street tacos, tips, and small towns run on cash — withdraw from bank ATMs inside branches (BBVA, Banorte, Santander), never standalone machines, and always choose to be charged in MXN. Tipping 10–15% in restaurants is genuinely expected, unlike much of Latin America.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "Mexico is in the global spotlight in 2026: it co-hosts the FIFA World Cup this June and July, with Mexico City's Estadio Azteca becoming the first stadium ever to open three World Cups (1970, 1986, 2026). Beyond the football, this is one of the world's great travel countries — Mexico City's museums and food scene rival any capital on earth, the Yucatán pairs Maya pyramids with Caribbean beaches, and Oaxaca may be the best eating city in the Americas. It's also excellent value: tacos al pastor run 15–25 pesos each, a Mexico City metro ride costs 5 pesos (about $0.25), and a good mid-range hotel room is $50–90.\n\nThis guide covers the money layer — the peso's '$' confusion trap, which ATMs skim tourists, why you should always pay in pesos rather than dollars — plus eSIM picks, tipping culture (it's real here), regional safety honestly addressed, and what Mexico costs per day in 2026. Sending money to or from Mexico? It's the world's second-largest remittance corridor, and our live comparison shows who delivers the most pesos.",
    keyStats: [
      { label: "Currency", value: "Mexican Peso ($, MXN)" },
      { label: "Typical daily cost (mid-range)", value: "$60–$120 USD" },
      { label: "Best time to visit", value: "November – April (dry season)" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "Visa-free up to 180 days" },
      { label: "Power", value: "127V / 60Hz, plug types A, B (US-style)" },
      { label: "Tipping", value: "10–15% in restaurants — expected" },
    ],

    culture: {
      overview:
        "Mexican culture is warm, unhurried, and deeply courteous — greetings matter ('buenos días' before any request), patience is a virtue, and directness without warmth reads as rude. Family is the central institution, lunch ('comida') is the main meal eaten around 2–4pm, and dinner runs late. National pride is strong and historically literate: Mexicans are warmly hospitable to visitors but sensitive to being treated as a backdrop — learn a few Spanish phrases and you'll be met more than halfway. Catholic tradition blends with indigenous heritage everywhere, most visibly in Día de Muertos (November 1–2), which is a family remembrance, not 'Mexican Halloween'.",
      dos: [
        "Open every interaction with a greeting — 'buenos días/tardes' before asking for anything. Transactional bluntness lands poorly.",
        "Tip consistently: 10–15% in restaurants, 10–20 pesos for grocery baggers and gas-station attendants (they often work for tips alone), and small notes for porters and housekeeping.",
        "Eat where the lines are — busy taquerías and market fondas with high turnover are both the best and the safest food in the country.",
        "Use Uber, DiDi, or official 'sitio' taxis in cities, and authorized prepaid taxi counters at airports — it removes both haggling and safety doubt.",
        "Carry small bills — breaking a 500-peso note at a market stall or taco stand is a genuine struggle; hoard 20s, 50s, and coins.",
      ],
      donts: [
        "Don't assume '$' means US dollars — it's the peso sign. A '$250' meal is about $13 USD. Menus in Cancún sometimes price in USD to confuse exactly this; check which currency applies.",
        "Don't pay in US dollars where pesos are accepted — the street-level conversion rate baked into dollar prices is usually 5–15% against you.",
        "Don't drink tap water — locals don't either. Bottled or filtered ('agua purificada') everywhere; ice in established restaurants is commercially made and fine.",
        "Don't flash valuables, leave phones on café tables, or wander unlit streets late at night — standard big-city rules apply with a bit more weight here.",
        "Don't treat Día de Muertos as a costume party or photograph family altars and cemetery vigils without asking — it's an intimate family occasion.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash is essential outside hotels and malls: street food, markets, colectivos, tips, tolls, smaller towns, and many mom-and-pop restaurants are cash-only. Keep a daily float of 500–1,000 pesos in small denominations. Coins matter for buses, baggers, and propinas.",
      cardAcceptance:
        "Visa and Mastercard work in city restaurants, hotels, supermarkets, chains, and resort zones; contactless is now standard. Amex is limited to upscale venues. Card terminals sometimes 'helpfully' offer to charge in USD — always choose MXN. In Cancún and tourist corridors, confirm whether menu prices are MXN or USD before ordering.",
      atmAvailability:
        "Use bank ATMs (BBVA, Banorte, Santander, Banamex) physically attached to branches — skimming risk is real at standalone machines in convenience stores and tourist strips. Fees run 30–100 MXN per withdrawal plus your bank's cut, so withdraw larger amounts less often. Decline the machine's exchange-rate 'offer' (DCC) every time: choosing MXN saves 3–8%.",
      tippingNorms:
        "Tipping ('propina') is a real obligation here: 10–15% in restaurants (15% standard for good service — check the bill, service is occasionally added in resorts), 10–20 pesos for supermarket baggers and gas attendants, 20–50 pesos per bag for porters, 50–100 pesos/day for housekeeping and tour guides more. Taxi drivers aren't tipped unless they help with luggage.",
      commonScams: [
        "Taxi overcharging and unlicensed cabs — use Uber/DiDi (cheap, tracked) or authorized airport prepaid counters; never hail street cabs at night in unfamiliar cities.",
        "The dollar-peso switcheroo — bills or change calculated 'in dollars' at terrible rates, or a $500 peso note you handed over 'becoming' a $50. State denominations aloud and count change.",
        "Card skimming — at standalone ATMs and occasionally restaurants where the card disappears from view. Use branch ATMs and keep cards in sight; contactless avoids most of it.",
        "Timeshare and 'free tour/breakfast' hustles in Cancún and Cabo — the free thing costs you a half-day of high-pressure sales. Just decline the clipboard people at the airport exit.",
        "Inflated 'gringo pricing' at markets and for artisan goods — friendly bargaining is normal at markets (start around 60–70% of the ask); fixed-price shops are fixed.",
      ],
    },

    notes: [
      { denomination: "50 MXN", color: "Purple / Pink", figure: "Axolotl and Xochimilco canals — the polymer note that went viral for its design" },
      { denomination: "100 MXN", color: "Red", figure: "Sor Juana Inés de la Cruz (obverse), monarch butterfly reserve (reverse)" },
      { denomination: "200 MXN", color: "Green", figure: "Independence heroes Hidalgo and Morelos (obverse), El Pinacate desert (reverse)" },
      { denomination: "500 MXN", color: "Blue", figure: "Benito Juárez (obverse), grey whale of the Pacific coast (reverse)" },
      { denomination: "1,000 MXN", color: "Ochre / Brown", figure: "Revolution figures Madero, Galindo and Serdán (obverse), Calakmul jaguar (reverse) — rarely seen in daily use" },
    ],

    exchangeGuide:
      "Skip exchanging cash at home or at airport counters (5–10% off mid-market). The efficient setup is a no-foreign-fee card for hotels and restaurants plus peso withdrawals from branch-attached bank ATMs — that combination lands within 1–2% of the real rate. If you do carry USD cash as backup, exchange at a casa de cambio in town rather than the airport, and always spend pesos, not dollars: dollar acceptance in tourist zones embeds a poor rate. For real transfers — the USA–Mexico corridor is the second-largest remittance flow on earth — Wise, Remitly, and similar specialists deliver MXN at rates 2–6% better than banks or cash-pickup counters; compare on the final peso amount.",

    sports: {
      overview:
        "Fútbol rules Mexico, and in summer 2026 the country co-hosts the FIFA World Cup — matches run in Mexico City (Estadio Azteca, the first stadium to stage three World Cups), Guadalajara, and Monterrey through June and July, with prices and crowds to match in those cities. Year-round, Liga MX fills stadiums (the Clásico Nacional between Chivas and América is the fixture), and a night at Arena México for lucha libre — masked wrestling that's equal parts sport, theatre, and family night out — is the great Mexico City entertainment bargain. Boxing runs deep (Mexico has produced more world champions than almost any nation), baseball thrives in the north and Yucatán, and charrería — competitive horsemanship — is the official national sport.",
      highlights: [
        "FIFA World Cup 2026 (June–July) — Estadio Azteca, Guadalajara's Estadio Akron, and Monterrey's Estadio BBVA host matches; expect peak pricing in host cities.",
        "Lucha libre at Arena México (Tuesdays and Fridays, CDMX) — tickets from a few hundred pesos; buy at the box office, masks sold outside.",
        "Liga MX football (two short seasons, year-round) — Clásico fixtures sell out; ordinary matchdays are cheap and easy via official club sites.",
        "Charrería and baseball — charreadas (rodeo-style competitions) on weekends around Guadalajara; Liga Mexicana baseball summers, winter league in the northwest.",
      ],
    },

    bestTime:
      "November to April is the dry season and the ideal window almost everywhere — warm days, cool highland nights (Mexico City sits at 2,240m; pack a layer), and Caribbean water at its clearest. May to October brings rain (usually afternoon bursts, not washouts) and hurricane risk on both coasts from June through November, peaking August–October. Summer 2026 is a special case: World Cup crowds and prices hit Mexico City, Guadalajara, and Monterrey in June–July. Día de Muertos (November 1–2, biggest in Oaxaca and Pátzcuaro) and Semana Santa are spectacular but book out months ahead.",
    visa:
      "US, UK, EU, Canadian, Australian, and most other Western passport holders need no visa for tourism — entry is granted on arrival for up to 180 days, though immigration officers now routinely stamp shorter periods (30–90 days) based on your stated plans, so have your return ticket and accommodation details ready. The old paper FMM tourist card has been phased out at most airports in favor of a passport stamp or digital record. Land entries from the US technically require the fee-paid permit for stays beyond 7 days. Overstays mean fines at departure.",
    safety:
      "Mexico requires honest nuance: the tourist economy — CDMX's central districts, Oaxaca, the Yucatán corridor, Baja's resorts — functions safely for millions of visitors a year, while specific states carry serious advisories (check your government's current list; the worst-affected areas are mostly far from tourist routes). Practical rules: use Uber/DiDi instead of street taxis, don't drive rural highways at night, keep flash low, and treat late-night solo wandering like you would in any unfamiliar big city. Petty theft outranks violent crime as the realistic tourist risk. Earthquakes are a fact of life in CDMX — note your hotel's evacuation route. Emergency number: 911.",
    highlights: [
      {
        name: "Mexico City",
        summary:
          "The Zócalo and Templo Mayor, Chapultepec's museums (the Anthropology Museum is world-class), Frida Kahlo's Casa Azul (book ahead), Roma/Condesa food streets, and the Teotihuacán pyramids an hour out. 4 days minimum.",
      },
      {
        name: "Oaxaca",
        summary:
          "Mexico's culinary capital — moles, tlayudas, mezcal palenques — plus the Monte Albán ruins, artisan villages, and the country's most intense Día de Muertos. Many travelers' favorite city in the country.",
      },
      {
        name: "Yucatán Peninsula",
        summary:
          "Chichén Itzá and quieter Ek Balam, cenote swimming, colonial Mérida and Valladolid, flamingo lagoons at Celestún — with Tulum and Cancún's beaches as the Caribbean bookend.",
      },
      {
        name: "Guadalajara & Tequila",
        summary:
          "Mexico's second city — mariachi's birthplace, the Hospicio Cabañas murals, and day trips to the blue-agave fields and distilleries of Tequila town (UNESCO-listed landscape). A 2026 World Cup host city.",
      },
      {
        name: "San Miguel de Allende & the Bajío",
        summary:
          "Cobbled colonial streets, the pink Parroquia, and a thriving arts scene — with Guanajuato's tunnels and plazas nearby. Mexico's prettiest highland towns.",
      },
      {
        name: "Baja California Sur",
        summary:
          "Cabo's resorts and marine life, La Paz's whale sharks (Oct–Apr), grey-whale encounters in the lagoons (Jan–Mar), and Todos Santos' surf-and-gallery scene.",
      },
    ],

    budget: {
      backpacker: "$30–$50 USD per day",
      midRange: "$60–$120 USD per day",
      luxury: "$250+ USD per day",
      note:
        "Backpacker assumes hostels, street food and market fondas, and intercity buses (ADO's first-class buses are excellent). Mid-range covers boutique hotels, restaurant meals, domestic flights, and guided day trips. Cancún–Tulum, Los Cabos, and CDMX's top neighborhoods run 30–50% above the national baseline — and World Cup host cities will spike during June–July 2026.",
    },

    faqs: [
      {
        question: "How much is the Mexican Peso worth in 2026?",
        answer:
          "As of June 2026, 1 USD buys roughly 19 MXN. For scale: street tacos run 15–25 pesos each, a Mexico City metro ride is 5 pesos, a nice restaurant meal 250–500 pesos, and a mid-range hotel 1,000–1,800 pesos. Watch the symbol — '$' in Mexico means pesos. Always check whether tourist-zone menus are quoting MXN or USD.",
      },
      {
        question: "Should I pay in pesos or US dollars in Mexico?",
        answer:
          "Always pesos. Dollars are accepted in Cancún and border zones, but the embedded exchange rate is typically 5–15% against you. The same applies at card terminals and ATMs: when offered a choice, always choose to be charged in MXN, never USD — that 'convenience' (dynamic currency conversion) costs 3–8% per transaction.",
      },
      {
        question: "How much do you tip in Mexico?",
        answer:
          "Tipping is genuinely expected: 10–15% in restaurants (15% for good service), 10–20 pesos for supermarket baggers and gas-station attendants — many earn tips only — 20–50 pesos per bag for porters, and 50–100 pesos a day for housekeeping. Taxi drivers aren't tipped for the ride itself. Carry coins and small notes specifically for this.",
      },
      {
        question: "Which ATMs should I use in Mexico?",
        answer:
          "Bank ATMs physically attached to branches — BBVA, Banorte, Santander, Banamex — ideally during business hours. Avoid standalone machines in convenience stores and tourist strips, where skimming and worst-case fees concentrate. Expect 30–100 MXN in machine fees, withdraw larger amounts less often, and always decline the offered conversion by choosing MXN.",
      },
      {
        question: "Is Mexico safe for tourists in 2026?",
        answer:
          "The places tourists actually go — Mexico City's central districts, Oaxaca, the Yucatán, Baja's resorts — host millions of visitors safely each year, while some states carry genuine government advisories; check the current map before routing off the beaten path. The practical rules: Uber/DiDi over street taxis, no rural night driving, low flash, normal big-city awareness at night. Petty theft is the realistic risk, not the headlines. Emergency: 911.",
      },
      {
        question: "Can I drink tap water in Mexico?",
        answer:
          "No — drink bottled or purified water ('agua purificada'), as locals do. Ice in established restaurants and bars is commercially produced from purified water and is fine; street-stall ice is a judgment call. Most hotels provide garrafón (filtered) water. Brushing teeth with tap water is generally fine for most travelers.",
      },
      {
        question: "Is Mexico hosting the 2026 World Cup?",
        answer:
          "Yes — Mexico co-hosts with the USA and Canada in June–July 2026. Matches are played at Mexico City's Estadio Azteca (the first stadium ever to feature in three World Cups, having opened 1970 and 1986), Guadalajara's Estadio Akron, and Monterrey's Estadio BBVA. Expect hotel prices and crowds to spike in the three host cities during the tournament window.",
      },
      {
        question: "What's the best eSIM for Mexico?",
        answer:
          "Airalo, Holafly, and Nomad sell Mexico eSIMs riding on Telcel's network (the best coverage nationally) — but note Mexico is one of the pricier eSIM markets, at roughly $15–35 depending on data. For US visitors, check your home plan first: many US carriers (T-Mobile, and most Verizon/AT&T plans) include Mexico roaming at no extra cost, which beats any eSIM.",
      },
      {
        question: "How do I get around Mexico between cities?",
        answer:
          "First-class buses (ADO, ETN, Primera Plus) are the underrated answer — safe, comfortable, terminal-to-terminal, with assigned seats from roughly 300–800 pesos for major routes. Domestic flights (Aeroméxico, Volaris, VivaAerobus) are cheap if booked ahead and essential for long hops. The new Tren Maya loops the Yucatán's main sites. Avoid self-driving rural highways at night.",
      },
      {
        question: "What's the cheapest way to send money to Mexico?",
        answer:
          "USA-to-Mexico is the world's second-largest remittance corridor (over $60 billion a year), and competition keeps it cheap: Wise, Remitly, and similar specialists deliver MXN at 2–6% better than banks or traditional cash-counter services, typically arriving in minutes to a Mexican account or for cash pickup at OXXO, Elektra, and bank branches. Compare on the final peso amount delivered — the margin hides in the rate, not the fee.",
      },
    ],

    relatedCorridorSlug: "usa-to-mexico",
  },

  japan: {
    slug: "japan",
    countryName: "Japan",
    countryCode: "jp",
    region: "East Asia",
    currency: "JPY",
    currencyName: "Japanese Yen",
    currencySymbol: "¥",
    topSourceCurrencies: ["USD", "EUR", "GBP", "AUD"],
    capital: "Tokyo",
    languages: ["Japanese"],
    callingCode: "+81",
    plugTypes: ["A", "B"],
    voltage: "100V / 50–60Hz",
    timezone: "JST (UTC+9)",

    tldr:
      "Japan uses the Japanese Yen (¥, JPY) — as of June 2026, 1 USD is worth roughly 150 JPY, and the weak yen has made Japan better value than it's been in decades. The old 'cash-only Japan' is fading: cards and tap-to-pay IC cards (Suica/Pasmo, loadable on iPhones) now cover cities, but shrines, ramen ticket machines, and rural areas still want cash — which you pull fee-transparent from 7-Eleven or Japan Post ATMs. One rule above all: don't tip. It's not done, anywhere.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "Japan has been the world's trending destination since reopening — record-breaking visitor numbers year after year — and the weak yen is a big part of why: a bowl of world-class ramen is ¥900–1,300 ($6–9), a 7-Eleven meal that would embarrass most Western cafés is ¥500–800, and immaculate business hotels run $60–100 a night. Layer onto that the Shinkansen network (Tokyo–Kyoto in 2h15), cities that are simultaneously the world's largest and safest, and a culture of hospitality (omotenashi) with no tipping anywhere, and Japan over-delivers at every budget.\n\nThis guide covers the money reality of 2026 Japan — how far cards and Suica actually reach, where cash is still non-negotiable, what the 2024-redesigned banknotes look like, and why the JR Pass is no longer the automatic buy it once was — plus eSIM picks, etiquette that actually matters (trains, onsen, chopsticks), and honest daily budgets. Moving bigger sums to or from a Japanese account? Our comparison shows what actually arrives.",
    keyStats: [
      { label: "Currency", value: "Japanese Yen (¥, JPY)" },
      { label: "Typical daily cost (mid-range)", value: "$90–$160 USD" },
      { label: "Best time to visit", value: "March – May & October – November" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "Visa-free 90 days" },
      { label: "Power", value: "100V / 50–60Hz, plug types A, B" },
      { label: "Tipping", value: "Never — it can cause genuine confusion" },
    ],

    culture: {
      overview:
        "Japanese social life is built around consideration for the group: queues are immaculate, trains are silent, litter is carried home (public bins are rare — a surprise to most visitors), and causing inconvenience ('meiwaku') is the cardinal sin. None of this is hostile to outsiders — allowances are made for visitors constantly — but observing the basics earns real warmth. Politeness is structural: bowing is the default greeting (a nod suffices from foreigners), shoes come off at homes, temples, ryokan, and some restaurants, and money changes hands via the small tray at every register rather than hand-to-hand.",
      dos: [
        "Stay quiet on trains — phones on silent ('manner mode'), no calls, conversations at a murmur. The quiet is collective and sacred.",
        "Carry your rubbish until you find a bin (convenience stores have them) — public bins are rare and streets are spotless anyway.",
        "Take your shoes off where indicated — genkan entryways at homes, ryokan, temples, fitting rooms, and some izakaya. Slip-on shoes make life easier.",
        "Use the cash tray at checkouts — place money on it rather than handing it over; your change arrives the same way, counted in front of you.",
        "Learn onsen rules before bathing: wash thoroughly at the seated stations first, enter the bath naked (no swimsuits), keep the small towel out of the water, and tie up long hair.",
      ],
      donts: [
        "Don't tip — not in restaurants, taxis, or hotels. It's not part of the culture and staff will often chase you down to return 'forgotten' money.",
        "Don't stick chopsticks upright in rice or pass food chopstick-to-chopstick — both mirror funeral rites and genuinely jar.",
        "Don't eat while walking in most contexts — eat at the stall, the konbini bench, or stand to the side. (Festival streets are the exception.)",
        "Don't talk on your phone on trains or blast speakerphone anywhere public.",
        "Don't expect tattoos to pass unnoticed at every onsen — acceptance is growing and many baths now allow them, but check policies or book a private bath ('kashikiri') if heavily inked.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash is no longer king but remains essential backup: shrine and temple offerings and goshuin stamps, ramen ticket-machine shops, older izakaya, market stalls, rural towns, and some taxis run cash-only. ¥10,000–20,000 in your wallet covers several days of gaps. The ¥500 coin (~$3.30) is real money — keep a coin pouch.",
      cardAcceptance:
        "Visa and Mastercard now work across city restaurants, hotels, department stores, chains, and taxis; contactless tap has spread fast since the pandemic. The parallel system is IC transit cards — Suica/Pasmo (and mobile Suica in Apple/Google Wallet, loadable with foreign cards) — which pay for trains, buses, vending machines, and convenience stores with a tap. Between a credit card and mobile Suica, city Japan is functionally cashless.",
      atmAvailability:
        "The reliable foreign-card ATMs are at 7-Eleven (Seven Bank, 24/7, English menus) and Japan Post offices — both accept nearly every international card with modest fees (¥110–220) and fair rates. Many regular Japanese bank ATMs still reject foreign cards entirely, so don't wait until rural Sunday night to find out. Decline any dynamic currency conversion; choose JPY.",
      tippingNorms:
        "Don't tip — anywhere, ever. Service is included in the price and delivered with pride; leaving money behind causes confusion, and staff will chase you to return it. The polite alternative is verbal: 'gochisousama deshita' (thank you for the meal) on the way out. High-end ryokan with private attendants are the one nuanced exception, and even there it's optional, given in an envelope, and never expected.",
      commonScams: [
        "Kabukicho/Roppongi bar touts in Tokyo — street invitations to 'free' or cheap bars that end in astronomical bills, with drink-spiking cases on record. Never follow a tout into a venue; this is Japan's one serious tourist trap.",
        "Fake monks 'selling' golden amulets and demanding donations around tourist sites — real monks don't solicit aggressively.",
        "Dynamic currency conversion at terminals and ATMs — choose yen, always.",
        "Tax-free shopping confusion — the 10% consumption-tax waiver requires your passport at purchase and items technically sealed for export; rules tightened recently, so keep receipts with your passport.",
        "Overpriced 'tourist information' tours near major stations — official tourist information centers are marked with the national 'i' logo and don't hard-sell.",
      ],
    },

    notes: [
      { denomination: "1,000 JPY", color: "Blue", figure: "Kitasato Shibasaburō, pioneer of bacteriology (obverse), Hokusai's Great Wave (reverse) — 2024 series" },
      { denomination: "5,000 JPY", color: "Purple", figure: "Tsuda Umeko, women's-education pioneer (obverse), wisteria blooms (reverse) — 2024 series" },
      { denomination: "10,000 JPY", color: "Brown", figure: "Shibusawa Eiichi, 'father of Japanese capitalism' (obverse), Tokyo Station (reverse) — 2024 series" },
      { denomination: "2,000 JPY", color: "Green", figure: "Shureimon Gate, Okinawa — a rarity in circulation; vending machines often reject it" },
    ],

    exchangeGuide:
      "Don't exchange cash at home — rates for yen outside Japan are consistently poor. The optimal setup: a no-foreign-fee credit/debit card for shops and hotels, mobile Suica for transit and small taps, and yen cash withdrawn from 7-Eleven or Japan Post ATMs as needed (fair rates, ¥110–220 fees, English menus). Airport exchange counters in Japan are actually reasonable by world standards if you want arrival cash, but the ATM in the arrivals hall beats them. Note that older paper-series notes remain fully valid alongside the 2024 redesigns. For larger transfers — tuition, property, salary repatriation — Wise and similar specialists handle JPY at near mid-market rates, several percent better than international bank wires, though Japanese banks' incoming-transfer compliance checks can add a day or two.",

    sports: {
      overview:
        "Baseball, not sumo, is Japan's biggest spectator sport — NPB games are a carnival of coordinated chants, beer vendors with kegs on their backs, and team-specific rituals (Hiroshima and Hanshin fans are legendary), with tickets from ¥2,000. Sumo remains the iconic experience: six 15-day grand tournaments (basho) a year — Tokyo's Ryōgoku Kokugikan in January, May, and September; Osaka in March; Nagoya in July; Fukuoka in November — with same-day upper-deck tickets a viable option if you queue early. The J.League fills football weekends, and Japan's martial-arts traditions (kendo, judo, karate) can be watched or even sampled at local dojos and university practices.",
      highlights: [
        "Sumo basho (Jan/May/Sep in Tokyo, Mar Osaka, Jul Nagoya, Nov Fukuoka) — book via the official Oosumo site the moment sales open, or queue early for same-day seats.",
        "NPB baseball (late March–October) — Hanshin Tigers at Koshien and Hiroshima Carp at home are the bucket-list atmospheres; konbini ticket machines and official sites sell seats.",
        "Sumo morning practice (asageiko) — some stables and tour operators allow respectful visitors to watch training; book ahead and follow the silence rules.",
        "J.League football (Feb–Dec) — Urawa Reds and Yokohama F. Marinos draw the biggest crowds; tickets are cheap and family-friendly.",
      ],
    },

    bestTime:
      "Late March to early April is cherry-blossom season — glorious and priced accordingly (Tokyo/Kyoto hotels can triple; book months out). May, and October–November (autumn foliage), are arguably better all-round: warm, clear, and slightly saner. Avoid Golden Week (April 29–May 5) and Obon (mid-August), when the entire country travels at once and trains/hotels max out. June is rainy season (hydrangeas and discounts), summer is hot and humid (but festival season), and winter means powder snow in Hokkaido and Nagano plus the year's clearest Mt. Fuji views.",
    visa:
      "US, UK, EU, Canadian, Australian, and NZ passport holders enter visa-free for up to 90 days — a stamp on arrival, no application needed as of 2026 (Japan has discussed a future ETA-style system, but it isn't in force; check before travel). Pre-register immigration and customs on the Visit Japan Web service to skip paper forms with a QR code. Passports must be valid for your stay; visa-free entries are for tourism and can't be converted to work status in-country.",
    safety:
      "Japan is one of the safest countries on earth — lost wallets famously return via police boxes (kōban) with cash intact, children commute alone, and violent crime against visitors is vanishingly rare. The actual risks are natural: earthquakes (know your hotel's exits; phones blare official alerts), typhoons August–October, and summer heatstroke. The one human hazard worth naming is the Kabukicho/Roppongi bar-tout scene in Tokyo. Emergency numbers: 110 (police), 119 (fire/ambulance).",
    highlights: [
      {
        name: "Tokyo",
        summary:
          "Shibuya and Shinjuku's neon, Asakusa's Sensō-ji temple, Tsukiji's outer market, teamLab's digital art, and day trips to Kamakura or Nikko. Budget 4–5 days and let the train network do the work.",
      },
      {
        name: "Kyoto",
        summary:
          "Fushimi Inari's torii gates at dawn, Kinkaku-ji, Arashiyama's bamboo grove, and 1,600 temples of varying fame — plus geisha district Gion at dusk. 3 days minimum; start early to beat the crowds everywhere.",
      },
      {
        name: "Osaka & Nara",
        summary:
          "Japan's food capital — Dōtonbori's neon canyon, takoyaki and kushikatsu culture — with Nara's giant Buddha and bowing deer 45 minutes away. The locals are famously the country's most outgoing.",
      },
      {
        name: "Hiroshima & Miyajima",
        summary:
          "The Peace Memorial Park and Museum — sobering and essential — then the floating torii gate of Itsukushima Shrine on Miyajima island, best at high tide and sunset.",
      },
      {
        name: "Hakone & Mt. Fuji",
        summary:
          "Onsen ryokan, the open-air sculpture museum, and Fuji views across Lake Ashi (clearest in winter mornings). The Hakone Free Pass bundles the loop of trains, cable cars, and pirate ships.",
      },
      {
        name: "Hokkaido",
        summary:
          "Sapporo's beer and February Snow Festival, Niseko and Furano's legendary powder skiing, summer lavender fields, and Japan's best seafood — a different Japan, best with a rental car outside winter.",
      },
    ],

    budget: {
      backpacker: "$45–$70 USD per day",
      midRange: "$90–$160 USD per day",
      luxury: "$300+ USD per day",
      note:
        "Backpacker assumes hostels or capsule hotels, konbini and ticket-machine meals (excellent here), and regional trains. Mid-range covers business hotels (¥9,000–15,000), restaurant meals, and Shinkansen hops booked smartly. The weak yen has cut effective costs 20–30% versus a few years ago. Kyoto in cherry-blossom season and ski-season Niseko price like Switzerland; rural Japan is a bargain.",
    },

    faqs: [
      {
        question: "Is Japan expensive to visit in 2026?",
        answer:
          "Less than its reputation — the weak yen (roughly 150 to the US dollar in June 2026) has made Japan cheaper in real terms than it's been in decades. Mid-range travelers do well on $90–$160 a day: business hotels run $60–100, a superb ramen is $6–9, and a 7-Eleven meal under $6. The big-ticket items are Shinkansen rides and peak-season (cherry blossom, Golden Week) hotels.",
      },
      {
        question: "Do I need cash in Japan or do cards work now?",
        answer:
          "Cards and tap-to-pay now cover most of urban Japan — the cash-only stereotype is years out of date — but you still need yen for shrines and temples, ramen ticket machines, market stalls, older izakaya, and rural areas. Carry ¥10,000–20,000 as a buffer and reload from 7-Eleven or Japan Post ATMs, which reliably accept foreign cards with English menus and small fees.",
      },
      {
        question: "Do you tip in Japan?",
        answer:
          "No — never, anywhere. Tipping isn't part of Japanese culture; prices include service delivered with professional pride, and staff will often run after you to return money 'left behind'. Say 'gochisousama deshita' after a meal instead. The only nuanced exception is a high-end ryokan attendant, where an envelope-presented gratuity is acceptable but still never expected.",
      },
      {
        question: "What is a Suica card and do I need one?",
        answer:
          "Suica (and Pasmo) are rechargeable tap-to-pay IC cards that cover virtually all trains, subways, and buses nationwide — plus vending machines, convenience stores, and lockers. The easiest version is mobile: add Suica to Apple Wallet or Google Wallet in seconds and top up with a foreign credit card, no physical card needed. Tourist 'Welcome Suica' physical cards are available at airports. It's the single biggest quality-of-life upgrade for a Japan trip.",
      },
      {
        question: "Is the Japan Rail Pass still worth it?",
        answer:
          "Often not anymore — the JR Pass price rose roughly 70% in late 2023, so the 7-day national pass only pays off with heavy long-distance travel (think Tokyo–Kyoto–Hiroshima–Tokyo within a week). For a classic Tokyo–Kyoto–Osaka trip, individual Shinkansen tickets or regional passes (JR West, JR East area passes) are usually cheaper. Do the arithmetic on a fare calculator before buying.",
      },
      {
        question: "Do Americans need a visa for Japan?",
        answer:
          "No — US, UK, EU, Canadian, Australian, and NZ passports get 90 days visa-free on arrival as of 2026. Pre-register on Visit Japan Web for QR-code immigration and customs to skip the paper forms. Japan has discussed introducing an ETA-style pre-authorisation in the future, so verify requirements close to your travel date.",
      },
      {
        question: "What do the new Japanese banknotes look like?",
        answer:
          "Japan redesigned all notes in July 2024 — the first refresh in 20 years: the blue ¥1,000 (bacteriologist Kitasato Shibasaburō, with Hokusai's Great Wave on the back), purple ¥5,000 (educator Tsuda Umeko), and brown ¥10,000 (industrialist Shibusawa Eiichi, with Tokyo Station). Older notes (Noguchi, Higuchi, Fukuzawa) remain fully valid and circulate side by side. The green ¥2,000 note exists but is rare.",
      },
      {
        question: "What's the best eSIM for Japan?",
        answer:
          "Airalo ('Moshi Moshi' plans), Ubigi (backed by NTT, Japan's main carrier — particularly strong here), and Holafly all work well, from roughly $9 for a week of moderate data to $27+ for unlimited. Japan's networks are excellent nationwide. Activate before you fly; pocket-WiFi rental, the old standby, now mainly makes sense for groups sharing one connection.",
      },
      {
        question: "When is cherry blossom season in Japan?",
        answer:
          "Late March to early April for Tokyo and Kyoto in a typical year, sweeping north to Hokkaido by early May — but exact timing shifts annually with the weather, and full bloom lasts barely a week in each place. Hotels in Kyoto can triple in price and sell out months ahead. The pragmatic alternatives: plum blossoms (February–March) or autumn foliage (October–November), which is arguably Kyoto's most beautiful season anyway.",
      },
      {
        question: "Can I send money to or from Japan at a good rate?",
        answer:
          "Yes — specialists like Wise deliver JPY at near mid-market rates, typically 2–4% better than international bank wires, which matters on big amounts like tuition or rent deposits. One Japan-specific note: incoming international transfers face strict bank compliance checks (expect questions about purpose), and recipient names must match bank records exactly — including the katakana rendering. Compare providers on the final yen amount delivered.",
      },
    ],

    relatedCorridorSlug: "japan-to-usa",
  },

  uae: {
    slug: "uae",
    countryName: "United Arab Emirates",
    countryCode: "ae",
    region: "Middle East",
    currency: "AED",
    currencyName: "UAE Dirham",
    currencySymbol: "د.إ",
    topSourceCurrencies: ["USD", "GBP", "EUR", "INR"],
    capital: "Abu Dhabi",
    languages: ["Arabic", "English (universally spoken)"],
    callingCode: "+971",
    plugTypes: ["G"],
    voltage: "230V / 50Hz",
    timezone: "GST (UTC+4)",

    tldr:
      "The UAE uses the Dirham (د.إ, AED), pegged to the US dollar at exactly 3.6725 AED per USD since 1997 — so for Americans there's zero exchange-rate risk, ever. Dubai and Abu Dhabi are near-cashless: tap a card or phone for everything from the metro to mall food courts, keeping a little cash for souk haggling and tips. The money traps here aren't scams but premiums — alcohol markups, beach-club minimums, and dynamic currency conversion. Always pay in dirhams, never your home currency.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "The UAE compresses superlatives into a country smaller than Scotland: the world's tallest building, busiest international airport, and most multicultural society — nearly 90% of residents are expatriates, which is why English works everywhere and why Dubai doubles as the world's remittance crossroads. It's also two destinations in one: Dubai's vertical spectacle and beach clubs, and Abu Dhabi's statelier circuit of the Sheikh Zayed Grand Mosque, the Louvre Abu Dhabi, and Yas Island's theme parks — with dunes, oases, and serious mountains (Jebel Jais) within day-trip range of both.\n\nThis guide covers money in the Gulf's easiest destination — the dollar peg explained, where cash still matters, what the dirham notes look like, tipping in a service economy built on migrant labor — plus eSIM picks (and the VoIP quirk to know about), cultural ground rules that are stricter than the skyline suggests, and honest daily budgets from hostel to seven-star. Sending money from the UAE? It's one of the world's top remittance-sending nations, and our comparison shows who delivers the most on the other end.",
    keyStats: [
      { label: "Currency", value: "UAE Dirham (د.إ, AED) — pegged at 3.6725/USD" },
      { label: "Typical daily cost (mid-range)", value: "$120–$220 USD" },
      { label: "Best time to visit", value: "November – March" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "Free visa on arrival, 30–90 days" },
      { label: "Power", value: "230V / 50Hz, plug type G (UK-style)" },
      { label: "Tipping", value: "10–15% common; service charge often included" },
    ],

    culture: {
      overview:
        "The UAE runs on a practical compact: a deeply Muslim, traditionally conservative society that hosts a 90%-expat population and millions of tourists, with clear rules about where cosmopolitan norms apply (hotels, beach clubs, licensed venues) and where modesty and decorum are expected (malls, souks, public streets, government buildings, and everywhere in Sharjah). Emiratis themselves — recognizable in white kandura and black abaya — are a small minority and generally formal, courteous, and private. The legal system enforces what other countries leave to etiquette: public profanity, rude gestures, and posting insults online are actual offenses, not faux pas.",
      dos: [
        "Dress modestly in public spaces — shoulders and knees covered in malls and souks (signs say so explicitly); swimwear only at pools and beaches. Sharjah is stricter than Dubai.",
        "Use your right hand for greetings, eating, and handing over items or money; wait for an Emirati woman to extend her hand before offering yours.",
        "Drink only in licensed venues (hotel bars, restaurants, clubs) and take a taxi back — public drinking and visible drunkenness are offenses, and the UAE has zero tolerance for any alcohol before driving.",
        "Be discreet and respectful during Ramadan — eating and drinking in public during fasting hours is now legally tolerated in most of Dubai, but doing it subtly is basic courtesy, and many restaurants screen daytime dining.",
        "Carry your passport copy or Emirates ID equivalent, and ask before photographing people — especially Emirati women and anything government or military.",
      ],
      donts: [
        "Don't show public affection beyond holding hands — kissing in public can genuinely escalate to a police matter.",
        "Don't swear, make rude gestures, or get into traffic-rage theatrics — offensive language and gestures (including emojis in messages) are prosecutable offenses.",
        "Don't carry any drugs — the UAE has among the world's strictest laws, covering trace amounts and several common prescription medicines (codeine, some ADHD and anxiety drugs); check the approved list and carry prescriptions.",
        "Don't photograph government buildings, ports, or military sites, and don't post mocking content about the country or individuals — cybercrime laws cover social media.",
        "Don't assume Dubai's norms apply everywhere — Sharjah (20 minutes away) is dry and conservative; rules and dress expectations tighten outside the tourist bubble.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash is optional in daily life — useful mainly for souk haggling (cash strengthens your position in the Gold and Spice Souks), small tips, and the odd cafeteria or karak tea stand. Keep AED 100–200 in small notes; everything else taps.",
      cardAcceptance:
        "Effectively universal: Visa, Mastercard, Apple/Google Pay work everywhere from the metro and taxis to food courts and corner stores. Amex is widely taken at hotels and malls, less so at independents. The UAE is one of the world's most card-saturated economies — many visitors never touch a banknote.",
      atmAvailability:
        "ATMs are everywhere (Emirates NBD, FAB, ADCB, Mashreq) and most charge no local fee for foreign cards — your home bank's fees are the main cost. The dirham's dollar peg means the rate is essentially fixed; the only way to lose is accepting dynamic currency conversion. Always choose AED on screen.",
      tippingNorms:
        "Tipping is customary in this service economy: 10–15% in restaurants where no service charge is added (many add 5–10% automatically — check the bill), AED 5–10 for valets, baggers, and delivery drivers, AED 10–20 per bag for porters, and rounding up taxi fares. Service staff are overwhelmingly migrant workers for whom tips matter — small notes are kind currency here.",
      commonScams: [
        "Dynamic currency conversion — the one near-universal trap in a low-scam country. At every terminal and ATM, choose AED, never your home currency; the peg means there's no 'rate risk' excuse.",
        "Fake or low-purity gold outside the regulated souk — buy gold only from licensed Gold Souk dealers and ask for the hallmark and weight receipt; the souk itself is strictly regulated and safe.",
        "Inflated bar tabs and 'ladies night' hustles in some hotel-district bars — confirm prices before ordering rounds; alcohol markups of 3–5x retail are legal and standard.",
        "Unofficial 'taxis' touting at malls and tourist spots — use the cream Dubai Taxis, Careem, or Uber; all are metered/app-priced and cheap by Western standards.",
        "Desert-safari undercutting — rock-bottom safari deals cut corners on insurance and vehicle quality; book mid-tier operators with named reviews for anything involving dune driving.",
      ],
    },

    notes: [
      { denomination: "5 AED", color: "Brown", figure: "Sharjah's Central Souk (older series); newer polymer notes circulate alongside" },
      { denomination: "10 AED", color: "Green", figure: "Traditional khanjar dagger (older series)" },
      { denomination: "20 AED", color: "Light Blue", figure: "Dubai Creek Golf & Yacht Club" },
      { denomination: "50 AED", color: "Purple", figure: "Arabian oryx; newer polymer design honors the UAE's founding" },
      { denomination: "100 AED", color: "Red / Pink", figure: "Al Fahidi Fort, Dubai's oldest building" },
      { denomination: "500 AED", color: "Blue", figure: "Jumeirah Mosque — large note; fine in malls, awkward for taxis" },
    ],

    exchangeGuide:
      "The dirham has been pegged at exactly 3.6725 to the US dollar since 1997, which removes all timing anxiety — the rate is the rate. Card payments plus fee-free ATM withdrawals cover virtually everything; if you do want cash exchanged, the UAE's exchange houses (Al Ansari, Al Fardan, Lulu Exchange — they're everywhere, serving the remittance economy) offer tight spreads that embarrass airport counters worldwide. The UAE is one of the planet's largest remittance-sending countries, and that competition is your friend: for sending money out — to India, Pakistan, the Philippines, or home — compare exchange houses against digital providers like Wise on the final amount delivered; rates on the big corridors (AED to INR especially) are among the most competitive anywhere.",

    sports: {
      overview:
        "The UAE's sporting calendar is built for spectacle. The Formula 1 season finale at Abu Dhabi's Yas Marina Circuit (late November/early December) is the marquee event, with the Dubai Tennis Championships, DP World Tour golf, and world-title boxing and UFC cards filling the winter. The traditional side is more interesting than visitors expect: camel racing — with robot jockeys controlled from chase cars — runs October to April at tracks like Al Marmoom (free to watch at dawn), and falconry is so central to Emirati identity that Abu Dhabi runs the world's largest falcon hospital, which welcomes visitors. Horse racing peaks with the Dubai World Cup at Meydan in late March, one of the world's richest race days.",
      highlights: [
        "F1 Abu Dhabi Grand Prix (Yas Marina, late Nov/early Dec) — the season finale; after-race concerts are included with most tickets.",
        "Camel racing at Al Marmoom and Al Wathba (Oct–Apr, early mornings, free) — robot jockeys, owners racing alongside in 4x4s; gloriously surreal.",
        "Dubai World Cup at Meydan (late March) — one of horse racing's richest nights, and entry to the general enclosure is cheap.",
        "Falcon Hospital tour, Abu Dhabi — the world's largest, with hands-on visits; book ahead.",
      ],
    },

    bestTime:
      "November to March is the season: 20–30°C, beach-perfect, with every headline event (F1, Dubai Shopping Festival, World Cup racing) packed into it — and hotel prices at their peak. April and October are shoulder months, hot but workable. June to September is extreme (45°C+ with humidity on the coast) — but the UAE has engineered around it with an entirely indoor summer life, and hotel rates drop 40–60%; a luxury-for-less play if you accept a pool-and-mall rhythm. Ramadan shifts the rhythm of the country (quieter days, festive nights); check dates when planning.",
    visa:
      "Easy for most: US, UK, EU, Australian, Canadian, and many other passports get a free visa on arrival — 30 days for most nationalities (extendable), 90 days within 180 for EU/EEA citizens under the standing arrangement. No pre-application, no fee; passports need 6 months' validity. Indian citizens with valid US visas or green cards also qualify for visa on arrival. Rules are generous but check the official ICP/GDRFA sites pre-travel, as allocations differ by passport.",
    safety:
      "The UAE is one of the safest countries on earth for visitors — street crime is near-nonexistent, solo female travelers consistently rate it among the most comfortable destinations, and lost property tends to come back. The risks are legal and environmental rather than criminal: strict laws cover alcohol outside licensed venues, drugs (including trace amounts and some prescription medicines — carry prescriptions and check the approved list), public behavior, and social-media posts. Summer heat is a genuine hazard — hydrate and treat midday outdoor plans seriously June–September. Emergency number: 999.",
    highlights: [
      {
        name: "Dubai",
        summary:
          "Burj Khalifa's observation decks (book sunset slots ahead), the Dubai Mall and fountains, old Dubai's creek-side souks and abra boat crossings (AED 1), Jumeirah's beaches, and the Museum of the Future. 3–4 days covers the spread.",
      },
      {
        name: "Abu Dhabi",
        summary:
          "The Sheikh Zayed Grand Mosque — one of the world's most beautiful buildings, free entry, dress code enforced — plus the Louvre Abu Dhabi, Qasr Al Watan palace, and the Corniche. An easy day trip from Dubai, better as an overnight.",
      },
      {
        name: "Yas Island",
        summary:
          "Ferrari World (home of the world's fastest rollercoaster), Warner Bros. World, Yas Waterworld, and the F1 circuit — the Gulf's theme-park capital, with multi-park passes the economical play.",
      },
      {
        name: "The desert",
        summary:
          "Dune-bashing safaris, sunrise hot-air ballooning, and overnight Bedouin-style camps in the Dubai Desert Conservation Reserve or Liwa's towering Empty Quarter dunes — the UAE beyond the skyline.",
      },
      {
        name: "Sharjah",
        summary:
          "The UAE's culture capital — UNESCO-recognized heritage area, the Museum of Islamic Civilization, and the Rain Room — 20 minutes from Dubai and a window into the pre-boom Gulf. Conservative dress applies.",
      },
      {
        name: "Jebel Jais & Ras Al Khaimah",
        summary:
          "The UAE's highest mountain, home to the world's longest zipline (1km of cable at 150km/h+), via ferrata routes, and cool-air hiking — proof the Emirates aren't all sand and glass.",
      },
    ],

    budget: {
      backpacker: "$60–$90 USD per day",
      midRange: "$120–$220 USD per day",
      luxury: "$400+ USD per day",
      note:
        "Backpacker is viable (hostels exist in Dubai, the metro is cheap, and cafeteria/food-court meals run AED 15–30) but the city fights it. Mid-range covers a 4-star hotel (UAE hotel stock skews high, so stars come cheaper than in Europe), restaurant meals, and attraction tickets. Alcohol is the budget-killer at 3–5x Western prices. Summer rates drop 40–60% off winter peaks.",
    },

    faqs: [
      {
        question: "What is the UAE Dirham worth against the dollar?",
        answer:
          "Exactly 3.6725 AED per US dollar — the dirham has been hard-pegged to the USD since 1997, so the rate never moves. A quick mental shortcut: divide dirham prices by 3.7 (AED 100 ≈ $27). For other currencies the rate floats with the dollar: as of June 2026, £1 buys roughly 4.9 AED and €1 roughly 4.2 AED.",
      },
      {
        question: "Do I need cash in Dubai?",
        answer:
          "Barely. Cards and phone payments work everywhere — metro, taxis, food courts, corner shops. Keep AED 100–200 in small notes for souk haggling (cash improves your bargaining position), tips for valets and porters, and the AED 1 abra boat across Dubai Creek. ATMs are everywhere and most charge no local fee; just always choose to be charged in AED.",
      },
      {
        question: "How much do you tip in the UAE?",
        answer:
          "10–15% in restaurants where no service charge appears on the bill (many add 5–10% automatically — check). AED 5–10 for valets, baggers, and deliveries; AED 10–20 per bag for porters; round up taxis. Tips matter genuinely here — service staff are largely migrant workers supporting families abroad — so small notes are the kindest currency you'll carry.",
      },
      {
        question: "Can you drink alcohol in Dubai?",
        answer:
          "Yes — in licensed venues: hotel bars, restaurants, clubs, and licensed stores (tourists can buy retail with a passport). Drinking in public places, public drunkenness, and any alcohol before driving (zero tolerance) are offenses. Prices are the real deterrent: expect AED 40–70 for a pint in a hotel bar. Sharjah, next door, is entirely dry.",
      },
      {
        question: "What can't I do in Dubai? What are the rules?",
        answer:
          "The short list: no public affection beyond holding hands, no public swearing or rude gestures (legally enforceable, including online posts), modest dress in malls and public areas (shoulders/knees), no drinking outside licensed venues, no photographing people without consent or government/military sites, and absolute zero tolerance on drugs — including trace amounts and some common prescription medicines, so check the approved list and carry prescriptions.",
      },
      {
        question: "Do Americans need a visa for the UAE?",
        answer:
          "No pre-arranged visa: US passport holders (along with UK, Canadian, Australian, and most European citizens) receive a free visa on arrival — 30 days for most, extendable, while EU/EEA citizens get 90 days in any 180. You need 6 months of passport validity. No fee, no application; you're stamped at the e-gates or counter and away.",
      },
      {
        question: "When is the best (and cheapest) time to visit Dubai?",
        answer:
          "Best: November to March — 20–30°C, beach weather, and the full events calendar (F1 in Abu Dhabi, Dubai Shopping Festival in January). Cheapest: June to September, when 45°C heat cuts hotel rates by 40–60% and life moves indoors — a legitimate luxury-on-a-budget play if you're happy with pools, malls, and indoor attractions through midday.",
      },
      {
        question: "What's the best eSIM for the UAE — and does WhatsApp calling work?",
        answer:
          "Airalo, Holafly, and Nomad sell UAE eSIMs (roughly $14–$35) on Etisalat/du networks — data is pricier here than in Europe or Asia. The crucial quirk: the UAE blocks VoIP calls on WhatsApp, FaceTime, and similar apps on local networks. Messaging works fine; for voice/video calls, use the licensed BOTIM app, your hotel WiFi (often unblocked), or a plan with international roaming rather than a local eSIM.",
      },
      {
        question: "Is Dubai safe for tourists and solo female travelers?",
        answer:
          "Among the safest cities anywhere — street crime is near-zero, taxis and ride-hailing are tightly regulated, and solo female travelers consistently rank the UAE highly for comfort, including on public transport (the metro has women-and-children carriages if preferred). The realistic 'risks' are legal missteps (alcohol, behavior, content posted online) and summer heat rather than anything criminal. Emergency: 999.",
      },
      {
        question: "What's the cheapest way to send money from the UAE?",
        answer:
          "The UAE is one of the world's top remittance-sending countries, and competition is ferocious: exchange houses (Al Ansari, Lulu, Al Fardan) and digital providers (Wise, Remitly, Instarem) fight over the AED–INR, AED–PKR, and AED–PHP corridors with some of the tightest margins on earth. Compare on the final amount delivered — digital providers usually win on rate, exchange houses on same-day cash pickup. Avoid bank wires, which layer fees on both ends.",
      },
    ],

    relatedCorridorSlug: "uae-to-india",
  },

  "saudi-arabia": {
    slug: "saudi-arabia",
    countryName: "Saudi Arabia",
    countryCode: "sa",
    region: "Middle East",
    currency: "SAR",
    currencyName: "Saudi Riyal",
    currencySymbol: "﷼",
    topSourceCurrencies: ["USD", "GBP", "EUR", "INR"],
    capital: "Riyadh",
    languages: ["Arabic", "English (widely spoken in cities)"],
    callingCode: "+966",
    plugTypes: ["G"],
    voltage: "230V / 60Hz",
    timezone: "AST (UTC+3)",

    tldr:
      "Saudi Arabia uses the Saudi Riyal (﷼, SAR), pegged to the US dollar at 3.75 SAR per USD since 1986 — the rate never moves. The kingdom only opened to tourism in 2019, and it's modernizing fast: cards and contactless ('mada') work nearly everywhere, women can travel independently, and tourist dress codes are modest-but-practical (no abaya required). Alcohol remains completely unavailable to visitors. The headline draw is AlUla's Nabataean tombs — Petra's sister city, without Petra's crowds.",
    authorSlug: "akif-hazarvi",
    publishedDate: "2026-06-11",
    updatedDate: "2026-06-11",

    intro:
      "Saudi Arabia is the world's newest major tourist destination — closed to leisure visitors until 2019, now spending historic sums to build a tourism economy by 2030. For travelers, that means a rare window: Hegra's 2,000-year-old Nabataean tombs at AlUla (the kingdom's answer to Petra) with a fraction of the visitors, Jeddah's coral-built old town of Al-Balad, the sandstone canyons of the Edge of the World outside Riyadh, and Red Sea diving that rivals Egypt's — all before the crowds arrive. The country has changed at speed: women drive, travel solo, and attend football matches; cinemas and concerts are back; and the religious-police era has receded.\n\nIt remains a conservative Muslim kingdom with absolute rules — zero alcohol, modest dress, and Mecca closed to non-Muslims — and this guide covers how to navigate it: the dollar-pegged riyal, the eVisa process, what the banknotes show, tipping norms, prayer-time rhythms, and where the genuinely world-class sights are. Sending money in or out? Saudi Arabia is one of the largest remittance-sending countries on earth, and our comparison shows who delivers the most.",
    keyStats: [
      { label: "Currency", value: "Saudi Riyal (﷼, SAR) — pegged at 3.75/USD" },
      { label: "Typical daily cost (mid-range)", value: "$100–$180 USD" },
      { label: "Best time to visit", value: "November – March" },
      { label: "Visa (US/UK/EU/AU, 2026)", value: "eVisa online (~$143, 1 year, multi-entry)" },
      { label: "Power", value: "230V / 60Hz, plug type G (UK-style)" },
      { label: "Tipping", value: "10% appreciated, not obligatory" },
    ],

    culture: {
      overview:
        "Saudi Arabia is the birthplace of Islam and home to its two holiest cities, and religion structures daily life: prayer happens five times a day (many shops still pause briefly, though mandatory closures have relaxed), Friday is the holy day with a late, quiet start, and Ramadan reshapes the entire calendar. Within that frame, the social changes since 2017 have been dramatic — music, cinemas, mixed public events, and women's independence are all normal now in Riyadh and Jeddah. Saudis are strikingly hospitable hosts: expect Arabic coffee (gahwa) and dates offered ritually, genuine curiosity toward the new wave of visitors, and generosity that can be hard to politely refuse.",
      dos: [
        "Dress modestly — for men, long trousers and covered shoulders; for women, loose clothing covering shoulders and knees. The abaya is NOT required for visitors, and headscarves are optional except inside mosques.",
        "Accept gahwa (cardamom coffee) and dates when offered — it's the hospitality ritual; take the cup with your right hand, and a gentle wiggle of the cup signals you're done.",
        "Plan around prayer times — some shops and restaurants still pause for 10–20 minutes, especially outside the big cities; the Salah times are in every weather app.",
        "Use your right hand for greetings, food, and handing over items; wait for a Saudi woman to extend her hand before offering yours.",
        "Download the essential apps: Absher/Tawakkalna ecosystems aside, you mainly need Uber/Careem (the standard for getting around) and offline maps — distances are vast.",
      ],
      donts: [
        "Don't bring or consume alcohol anywhere — Saudi Arabia is completely dry for visitors, with no licensed venues, and penalties are severe. The same absolute line applies to drugs and pork.",
        "Don't attempt to enter Mecca as a non-Muslim — it's strictly prohibited and enforced at highway checkpoints. (Medina's central Haram area has restrictions too, though the city itself is open.)",
        "Don't photograph people without consent — especially women — or government buildings, palaces, and security infrastructure.",
        "Don't show public affection — holding hands is tolerated for married couples, anything more is not; and avoid public criticism of religion or the state, online included.",
        "Don't schedule daytime restaurant plans during Ramadan without checking — eating in public during fasting hours is prohibited for everyone, though hotels serve visitors discreetly.",
      ],
    },

    money: {
      cashAcceptance:
        "Cash is useful for souks (Jeddah's Al-Balad, Riyadh's Souq Al Zal), small tips, bakalas (corner shops), and rural stops, but no longer essential in cities. SAR 200–300 in mixed notes covers several days of incidentals. Bargaining in souks is expected and friendly.",
      cardAcceptance:
        "Excellent and improving fast — Vision 2030 pushed payments hard, and the domestic 'mada' network means contactless Visa/Mastercard works at nearly every business, including small restaurants and taxis. Apple Pay is ubiquitous. Amex is limited to hotels and malls. Card is now the default for locals everywhere.",
      atmAvailability:
        "ATMs are plentiful (Al Rajhi, SNB, Riyad Bank, Alinma) and most charge no local fee to foreign cards. The riyal's dollar peg keeps rates flat; the only loss vector is dynamic currency conversion — always choose SAR on screen. Machines dispense large notes; break them at supermarkets.",
      tippingNorms:
        "Tipping is appreciated but not institutionalized: 10% in restaurants (check whether a service charge is included — common at hotels), SAR 5–10 for porters and valets, round up taxis and deliveries. Guides on AlUla and desert tours expect SAR 20–50 per person per day. No one will chase you over a missing tip, but service workers — largely expatriates — genuinely value them.",
      commonScams: [
        "Scams against tourists are genuinely rare — Saudi Arabia polices commerce strictly. The realistic frictions are overcharging rather than fraud.",
        "Unmetered airport taxis quoting flat 'tourist rates' — use Uber or Careem from every airport instead; they're cheap, tracked, and the local default.",
        "Dynamic currency conversion at terminals and ATMs — choose SAR every time; the dollar peg means any 'conversion offer' is pure margin.",
        "Souvenir markup in tourist souks — oud, dates, and gold are quality-graded; buy dates from proper date shops (ask to taste) and gold from licensed dealers with hallmark receipts.",
        "Unofficial 'guides' at heritage sites — AlUla and Diriyah run on timed official tickets and licensed guides booked through the official platforms (Experience AlUla); freelancers at the gate can't get you in faster.",
      ],
    },

    notes: [
      { denomination: "5 SAR", color: "Violet / Brown", figure: "King Salman (obverse), Shaybah oil field (reverse); newer polymer versions circulate" },
      { denomination: "10 SAR", color: "Green", figure: "King Salman (obverse), Murabba Palace, Riyadh (reverse)" },
      { denomination: "50 SAR", color: "Dark Green", figure: "King Salman (obverse), Al-Aqsa Mosque and Dome of the Rock (reverse)" },
      { denomination: "100 SAR", color: "Red", figure: "King Salman (obverse), the Prophet's Mosque, Medina (reverse)" },
      { denomination: "500 SAR", color: "Blue", figure: "King Abdulaziz (obverse), the Holy Mosque and Kaaba, Mecca (reverse) — large note, break it early" },
    ],

    exchangeGuide:
      "The riyal has been pegged at 3.75 to the US dollar since 1986 — divide any price by 3.75 and you have dollars; there is no timing, no spread anxiety, no 'good day' for the rate. Cards plus fee-free ATM withdrawals handle virtually everything; if you want cash exchanged, licensed exchange houses (Al Rajhi's Tahweel, Enjaz, and others built for the kingdom's enormous expat remittance market) beat airport counters comfortably. That remittance infrastructure is the story here: Saudi Arabia is consistently among the world's top three remittance-sending countries, and the SAR–INR, SAR–PKR, SAR–PHP, and SAR–EGP corridors are fiercely competitive — for sending money out, compare digital providers (Wise, Remitly) against the exchange houses on the final amount delivered; for transfers in, the peg makes USD-side comparisons straightforward.",

    sports: {
      overview:
        "Saudi Arabia has spent the 2020s buying its way to the center of world sport, and visitors feel it: the Saudi Pro League's galaxy of imported stars (the Ronaldo-at-Al-Nassr era transformed it), Formula 1 under lights on the Jeddah Corniche — one of the fastest street circuits ever built — world-title boxing and WWE cards during Riyadh Season, LIV Golf, and the Dakar Rally, which has opened every year in the kingdom since 2020. The traditional layer endures alongside: the King Abdulaziz Camel Festival (with beauty contests carrying multimillion-riyal purses), falconry as living heritage, and horse racing crowned by the Saudi Cup — the world's richest single race.",
      highlights: [
        "Saudi Pro League football (Aug–May) — Al-Nassr and Al-Hilal in Riyadh, Al-Ittihad and Al-Ahli in Jeddah; tickets are cheap and bought via the league's official apps.",
        "F1 Saudi Arabian Grand Prix (Jeddah Corniche Circuit, spring) — night racing at one of the calendar's fastest tracks.",
        "The Saudi Cup (Riyadh, February) — the world's richest horse race, $20M+ in purse, at King Abdulaziz Racetrack.",
        "King Abdulaziz Camel Festival (Jan–Feb, outside Riyadh) — camel racing and the famous beauty pageant; a genuine cultural spectacle, free to wander.",
      ],
    },

    bestTime:
      "November to March is the window: Riyadh and AlUla sit at a perfect 18–28°C by day (desert nights get genuinely cold — pack a jacket), Jeddah is warm and humid but pleasant, and the events calendar (Riyadh Season, AlUla's festivals, the camel festival, the Saudi Cup) is in full swing. April–May and October are hot but workable. June to September is extreme — 45°C+ inland — and only the elevated southwest (Abha and the Asir mountains, the kingdom's summer escape) stays comfortable. Ramadan inverts daily rhythms entirely; visiting then is culturally fascinating but logistically slower.",
    visa:
      "The tourist eVisa (launched 2019) covers some 60+ nationalities including the US, UK, EU, Canada, and Australia: apply online at the official visa.visitsaudi.com, pay roughly SAR 535 (~$143, including mandatory health insurance), and receive a one-year, multiple-entry visa allowing 90 days per visit — most approvals arrive within minutes to days. Eligible nationalities can alternatively get visa on arrival, and holders of valid US, UK, or Schengen visas qualify too. A free 96-hour stopover visa comes with Saudia and flynas tickets. Tourist visas cover Umrah (not Hajj) for Muslim travelers; Mecca remains closed to non-Muslims.",
    safety:
      "Saudi Arabia is statistically one of the safest countries a tourist can visit — violent crime is rare, theft rarer, and solo women travelers, while still a newer phenomenon, consistently report feeling secure; harassment is both socially condemned and legally punished. The risks are environmental and legal rather than criminal: extreme summer heat, vast empty driving distances (don't drive remote routes without water and a full tank; camels on night roads are a real hazard), and the kingdom's absolute red lines — alcohol, drugs, public criticism of religion or state, and Mecca for non-Muslims. Emergency number: 911.",
    highlights: [
      {
        name: "AlUla & Hegra",
        summary:
          "Saudi Arabia's crown jewel — 100+ monumental Nabataean tombs carved into desert monoliths (Hegra was the kingdom's first UNESCO site), Elephant Rock at sunset, and Old Town's mudbrick maze. Book timed tickets via Experience AlUla; 2–3 days minimum.",
      },
      {
        name: "Riyadh & Diriyah",
        summary:
          "The capital's Kingdom Centre Sky Bridge and National Museum, plus At-Turaif in Diriyah — the UNESCO-listed mudbrick birthplace of the Saudi state, restored into the country's flagship heritage district. Riyadh Season (Oct–Mar) adds concerts and events citywide.",
      },
      {
        name: "Jeddah & Al-Balad",
        summary:
          "The Red Sea's historic port — Al-Balad's UNESCO old town of coral-stone tower houses and wooden rawashin balconies, the corniche's sculpture parks, and the gateway airport for AlUla and the coast.",
      },
      {
        name: "Edge of the World",
        summary:
          "Jebel Fihrayn's sheer cliffs over an ancient seabed, 90 minutes from Riyadh — the kingdom's signature day trip. Go with a 4x4 tour for sunset; the final stretch is rough track.",
      },
      {
        name: "The Red Sea coast",
        summary:
          "Pristine reef diving around Yanbu and Umluj ('the Maldives of Saudi') and the new ultra-luxury Red Sea resorts — coral on par with Egypt's, with a fraction of the divers.",
      },
      {
        name: "Abha & the Asir mountains",
        summary:
          "The green, terraced, 2,000m-high southwest — juniper forests, baboons, hanging villages like Rijal Almaa, and 25°C summers while Riyadh bakes. The kingdom's least-expected landscape.",
      },
    ],

    budget: {
      backpacker: "$50–$80 USD per day",
      midRange: "$100–$180 USD per day",
      luxury: "$350+ USD per day",
      note:
        "Backpacker means budget hotels (hostels are scarce), shawarma and kabsa houses (excellent eating for SAR 15–35), and buses/shared rides. Mid-range covers good hotels, restaurant meals, Uber everywhere, and domestic flights (often cheaper than driving the distances). AlUla is the premium pocket — accommodation there runs double the national norm. No alcohol means one classic budget line simply doesn't exist.",
    },

    faqs: [
      {
        question: "What is the Saudi Riyal worth against the dollar?",
        answer:
          "Exactly 3.75 SAR per US dollar — the riyal has been hard-pegged since 1986 and the rate never moves. Divide any riyal price by 3.75 for dollars: a SAR 30 shawarma meal is $8, a SAR 400 hotel room ~$107. Other currencies float with the dollar: as of June 2026, £1 buys roughly 5.0 SAR and €1 roughly 4.3 SAR.",
      },
      {
        question: "How do tourists get a Saudi Arabia visa?",
        answer:
          "Apply for the tourist eVisa at the official visa.visitsaudi.com — open to 60+ nationalities including the US, UK, EU, Canada, and Australia. It costs roughly SAR 535 (~$143) including mandatory health insurance, is usually approved within minutes to a few days, and gives one year of multiple entries with up to 90 days per visit. Visa on arrival and a free 96-hour stopover visa (with Saudia/flynas tickets) are alternatives for eligible passports.",
      },
      {
        question: "Do women have to wear an abaya in Saudi Arabia?",
        answer:
          "No — since 2019, foreign women are not required to wear the abaya or cover their hair. The requirement is modest dress: loose clothing covering shoulders and knees. A headscarf is needed only inside mosques. Women travel independently, drive, stay in hotels alone, and attend events freely — the practical experience has transformed since the kingdom opened to tourism.",
      },
      {
        question: "Can you drink alcohol in Saudi Arabia?",
        answer:
          "No — Saudi Arabia is completely dry for tourists. There are no licensed bars, restaurants, or shops for visitors, importing alcohol (including duty-free in transit) is prohibited, and penalties are severe. Hotels serve elaborate mocktails and excellent coffee culture fills the social gap. If a bar scene matters to your trip, neighboring UAE or Bahrain is the regional answer.",
      },
      {
        question: "Can non-Muslims visit Mecca or Medina?",
        answer:
          "Mecca: no — entry is prohibited for non-Muslims, enforced at highway checkpoints, with no exceptions. Medina: yes, the city itself is open to all visitors, though the central Haram area immediately around the Prophet's Mosque is reserved for Muslims. Muslim travelers on tourist eVisas may perform Umrah (though not Hajj, which requires a dedicated visa).",
      },
      {
        question: "Is Saudi Arabia safe for tourists?",
        answer:
          "Statistically among the safest destinations anywhere — violent crime and theft are rare, streets feel secure at night, and harassment is legally and socially condemned. The real cautions are legal red lines (alcohol, drugs, public criticism of religion or state, Mecca for non-Muslims), extreme summer heat, and long empty driving distances — camels on unlit night roads are a genuine hazard. Emergency number: 911.",
      },
      {
        question: "What should I see in Saudi Arabia first?",
        answer:
          "AlUla — the Nabataean tombs of Hegra are the kingdom's Petra, with a fraction of the visitors, plus Elephant Rock and a restored mudbrick Old Town. Pair it with Jeddah's Al-Balad old town (the natural gateway) and Riyadh's Diriyah for the historical arc, with the Edge of the World cliffs as the capital's signature day trip. Two weeks covers all four comfortably; one week forces a choice between AlUla and the rest.",
      },
      {
        question: "What's the best eSIM for Saudi Arabia?",
        answer:
          "Airalo, Holafly, and Nomad offer Saudi eSIMs from roughly $13–$35 on STC/Mobily networks — coverage is excellent in cities and along highways, patchier in deep desert. Unlike the UAE, VoIP calls (WhatsApp, FaceTime) work normally in Saudi Arabia. Local STC/Mobily tourist SIMs from airport counters are competitive for longer stays but involve passport registration queues.",
      },
      {
        question: "How does Ramadan affect a trip to Saudi Arabia?",
        answer:
          "Significantly — eating, drinking, and smoking in public during daylight fasting hours are prohibited for everyone, most restaurants close until sunset (hotels serve guests discreetly), and business hours compress. The flip side: iftar at sunset is festive and hospitable, nights run late and lively, and experiencing Ramadan in Islam's birthplace is unique. Check the dates (they shift ~11 days earlier each year) and decide deliberately.",
      },
      {
        question: "What's the cheapest way to send money from Saudi Arabia?",
        answer:
          "Saudi Arabia is consistently among the world's top three remittance-sending countries, so the corridors out — SAR to INR, PKR, PHP, EGP, BDT — are intensely competitive. Digital providers (Wise, Remitly, Instarem) usually beat the exchange houses (Tahweel Al Rajhi, Enjaz) on rate, while exchange houses win on instant cash pickup networks. The dollar peg makes comparison easy: check the final amount delivered against the mid-market rate.",
      },
    ],

    relatedCorridorSlug: "saudi-arabia-to-india",
  },
};

export function getTravelGuide(slug: string): TravelGuideContent | undefined {
  return travelGuides[slug];
}

export function getAllTravelGuideSlugs(): string[] {
  return Object.keys(travelGuides);
}
