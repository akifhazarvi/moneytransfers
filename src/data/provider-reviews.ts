/**
 * In-depth editorial review articles for specific providers.
 * These overlay the auto-generated company pages with richer content.
 */

export interface ProviderReview {
  slug: string;
  title: string;
  metaDescription: string;
  updatedAt: string;
  readTime: string;
  editorRating: number; // out of 10
  editorVerdict: string;
  sections: { id: string; heading: string; content: string }[];
  whoShouldUse: { heading: string; items: string[] }[];
  alternatives: { slug: string; reason: string }[];
  faqs: { q: string; a: string }[];
}

export const providerReviews: ProviderReview[] = [
  {
    slug: "wise",
    title: "Wise Review 2026: Fees, Exchange Rates, Speed & Is It Worth It?",
    metaDescription:
      "In-depth Wise review covering fees, exchange rates, transfer speed, supported countries, payment methods, pros and cons. Based on real transfer data and 280,000+ Trustpilot reviews.",
    updatedAt: "2026-03-14",
    readTime: "12 min read",
    editorRating: 9.2,
    editorVerdict:
      "Wise is the gold standard for transparent, low-cost international transfers. Its use of the mid-market exchange rate with zero markup sets it apart from virtually every competitor. The multi-currency account and debit card add genuine everyday utility. The main limitations are the lack of cash pickup options and slightly slower delivery compared to express-focused competitors like Remitly. For anyone who values knowing exactly what they're paying — and paying as little as possible — Wise is our top recommendation.",

    sections: [
      {
        id: "overview",
        heading: "Overview",
        content: `<p>Wise (formerly TransferWise) was founded in 2011 by Kristo Käärmann and Taavet Hinrikus, two Estonian entrepreneurs frustrated by the hidden costs of international banking. Their core insight — that banks add a significant markup to the exchange rate on top of their transfer fee — became the foundation of a company now serving over 16 million customers.</p>

<p>Wise is publicly traded on the London Stock Exchange and is regulated by financial authorities in every market it operates in, including the FCA (UK), FinCEN (US), ASIC (Australia), and MAS (Singapore). It holds customer funds in segregated accounts, meaning your money is protected even if Wise itself ran into financial difficulty.</p>

<p><strong>What makes Wise different:</strong> Unlike most transfer services that make money from exchange rate markups, Wise uses the actual mid-market rate — the same rate you see on Google or Reuters — and charges a transparent, upfront fee. This means the fee you see is the total cost. There is no hidden spread.</p>

<p>Beyond transfers, Wise offers a multi-currency account that holds 40+ currencies with local bank details in the US, UK, EU, Australia, and several other countries. This makes it popular with freelancers, digital nomads, and businesses that operate internationally.</p>`,
      },
      {
        id: "fees",
        heading: "Transfer fees",
        content: `<p>Wise charges a variable fee that depends on three factors: the currency pair, the payment method, and the transfer amount. There is no flat fee — the cost scales with the transfer size, though the percentage often <em>decreases</em> for larger amounts.</p>

<p><strong>Typical fee ranges by corridor:</strong></p>

<table>
<tr><th>Corridor</th><th>Typical fee</th><th>Example on $1,000</th></tr>
<tr><td>USD → EUR</td><td>0.43%–0.56%</td><td>$4.30–$5.60</td></tr>
<tr><td>USD → GBP</td><td>0.41%–0.56%</td><td>$4.10–$5.60</td></tr>
<tr><td>USD → INR</td><td>0.56%–0.71%</td><td>$5.60–$7.10</td></tr>
<tr><td>GBP → EUR</td><td>0.33%–0.43%</td><td>£3.30–£4.30</td></tr>
<tr><td>GBP → INR</td><td>0.56%–0.71%</td><td>£5.60–£7.10</td></tr>
<tr><td>AUD → INR</td><td>0.56%–0.86%</td><td>A$5.60–A$8.60</td></tr>
</table>

<p><strong>Payment method surcharges:</strong></p>
<ul>
<li><strong>Bank transfer / ACH:</strong> No surcharge — this is the cheapest option</li>
<li><strong>Debit card:</strong> Small surcharge (typically 0.2–0.3%)</li>
<li><strong>Credit card:</strong> Significant surcharge (~1.5%) — avoid if possible</li>
<li><strong>Apple Pay:</strong> Same as debit card</li>
<li><strong>Wise balance:</strong> No surcharge</li>
</ul>

<p><strong>Important:</strong> The fee shown on Wise's transfer page is the complete cost. Because Wise uses the mid-market rate with zero markup, there are no hidden exchange rate charges. This makes Wise one of the only transfer services where the advertised fee equals the actual cost.</p>

<p>For very large transfers ($50,000+), Wise's percentage fee becomes highly competitive — often under 0.4%. This makes it one of the cheapest options available for high-value transfers.</p>`,
      },
      {
        id: "exchange-rates",
        heading: "Exchange rates",
        content: `<p><strong>Wise uses the mid-market exchange rate — period.</strong> This is the defining feature that separates Wise from most competitors.</p>

<p>The mid-market rate (also called the interbank rate) is the midpoint between the buy and sell prices for a currency on global markets. It's the rate you see on Google, XE, Reuters, and Bloomberg. It's the fairest rate available — and until Wise, it was a rate that consumers almost never received.</p>

<p><strong>How this compares to other providers:</strong></p>

<table>
<tr><th>Provider</th><th>Exchange rate approach</th><th>Typical markup</th></tr>
<tr><td>Wise</td><td>Mid-market rate</td><td>0%</td></tr>
<tr><td>Remitly</td><td>Marked up</td><td>0.5%–2%</td></tr>
<tr><td>OFX</td><td>Marked up</td><td>0.2%–1.5%</td></tr>
<tr><td>XE</td><td>Marked up</td><td>0.5%–1.5%</td></tr>
<tr><td>Western Union</td><td>Marked up</td><td>1%–4%</td></tr>
<tr><td>Banks (average)</td><td>Marked up</td><td>3%–5%</td></tr>
</table>

<p>On a $1,000 transfer, a 3% bank markup costs $30 in hidden charges — on top of the bank's wire fee. Wise's 0% markup means you receive the full mid-market value minus only the transparent fee (typically $4–$7).</p>

<p><strong>Rate lock:</strong> When you initiate a transfer on Wise, the exchange rate is locked in for a limited time (usually 24–48 hours). If you fund the transfer within that window, you get the quoted rate. If the rate moves unfavorably beyond a threshold, Wise may requote.</p>`,
      },
      {
        id: "countries",
        heading: "Supported countries and currencies",
        content: `<p>Wise supports transfers to <strong>80+ countries</strong> in <strong>50+ currencies</strong>. This covers the vast majority of popular remittance corridors and international payment routes.</p>

<p><strong>Where Wise is strongest:</strong></p>
<ul>
<li>Major currency pairs (USD, GBP, EUR, AUD, CAD) — excellent coverage and speed</li>
<li>Asian corridors (INR, PHP, JPY, SGD, MYR, THB) — well supported</li>
<li>European currencies (CHF, SEK, NOK, DKK, PLN, CZK, HUF) — comprehensive</li>
</ul>

<p><strong>Where Wise has gaps:</strong></p>
<ul>
<li>Some African currencies (limited coverage compared to specialists like WorldRemit)</li>
<li>Cash pickup destinations — Wise only supports bank deposits</li>
<li>Some Middle Eastern corridors have restrictions</li>
</ul>

<p>Wise also offers local account details in several countries, meaning you can receive payments as if you had a local bank account:</p>
<ul>
<li><strong>US:</strong> ACH routing number and account number</li>
<li><strong>UK:</strong> Sort code and account number</li>
<li><strong>EU:</strong> IBAN (Belgian)</li>
<li><strong>Australia:</strong> BSB and account number</li>
<li><strong>Singapore:</strong> Local account number</li>
<li><strong>And several more...</strong></li>
</ul>`,
      },
      {
        id: "speed",
        heading: "Delivery speed",
        content: `<p>Wise transfers typically arrive within <strong>1–2 business days</strong>, though timing varies significantly by corridor and payment method.</p>

<p><strong>Speed by corridor:</strong></p>

<table>
<tr><th>Route</th><th>Typical speed</th><th>Fastest reported</th></tr>
<tr><td>USD → EUR</td><td>1 business day</td><td>Same day</td></tr>
<tr><td>USD → GBP</td><td>1 business day</td><td>Within hours</td></tr>
<tr><td>USD → INR</td><td>1–2 business days</td><td>Same day (IMPS)</td></tr>
<tr><td>GBP → EUR</td><td>Within hours</td><td>Within hours (SEPA)</td></tr>
<tr><td>AUD → INR</td><td>1–2 business days</td><td>1 business day</td></tr>
<tr><td>CAD → INR</td><td>1–2 business days</td><td>1 business day</td></tr>
</table>

<p><strong>Factors that affect speed:</strong></p>
<ul>
<li><strong>Funding method:</strong> Bank transfers (ACH) take 1–3 days to clear before Wise can send. Debit card and Apple Pay are instant, so the transfer starts immediately.</li>
<li><strong>Verification:</strong> First-time transfers may require identity verification, adding 1–2 days.</li>
<li><strong>Receiving country:</strong> Some countries process incoming transfers faster than others. India (IMPS) and UK (Faster Payments) are among the quickest.</li>
<li><strong>Time of day:</strong> Transfers initiated during business hours in the receiving country are generally faster.</li>
</ul>

<p><strong>How this compares:</strong> Wise is faster than banks (3–5 days typically) but slower than Remitly's Express option (minutes). For most users, 1–2 day delivery is fast enough — and the cost savings over "instant" services more than compensates.</p>`,
      },
      {
        id: "payment-methods",
        heading: "Payment methods",
        content: `<p>Wise offers several ways to fund your transfer, with costs varying by method.</p>

<p><strong>Sending (funding) methods:</strong></p>

<table>
<tr><th>Method</th><th>Available in</th><th>Extra cost</th><th>Speed to fund</th></tr>
<tr><td>Bank transfer (ACH/Faster Payments)</td><td>US, UK, EU, AU, CA</td><td>Free</td><td>1–3 business days (US), instant (UK)</td></tr>
<tr><td>Debit card</td><td>Most countries</td><td>~0.2–0.3%</td><td>Instant</td></tr>
<tr><td>Credit card</td><td>Most countries</td><td>~1.5%</td><td>Instant</td></tr>
<tr><td>Apple Pay</td><td>US, UK, EU</td><td>Same as debit</td><td>Instant</td></tr>
<tr><td>Google Pay</td><td>Select markets</td><td>Same as debit</td><td>Instant</td></tr>
<tr><td>Wise balance</td><td>All</td><td>Free</td><td>Instant</td></tr>
</table>

<p><strong>Receiving (delivery) methods:</strong></p>
<ul>
<li><strong>Bank deposit:</strong> Available for all corridors — the standard delivery method</li>
<li><strong>Wise account:</strong> If the recipient has a Wise account, delivery is nearly instant and free</li>
</ul>

<p><strong>What Wise doesn't offer:</strong></p>
<ul>
<li>Cash pickup — not available</li>
<li>Mobile money (M-Pesa, GCash, etc.) — not available</li>
<li>Home delivery — not available</li>
</ul>

<p>This is Wise's biggest limitation for remittances to developing countries where recipients may not have bank accounts. If your recipient needs cash pickup or mobile money, consider Remitly, WorldRemit, or Western Union instead.</p>`,
      },
      {
        id: "reviews",
        heading: "Customer reviews summary",
        content: `<p>Wise has one of the strongest customer review profiles in the money transfer industry.</p>

<p><strong>Trustpilot:</strong> 4.3/5 based on 280,000+ reviews — rated "Great". This makes Wise one of the highest-rated transfer services on the platform by volume. Most positive reviews cite transparency, competitive rates, and ease of use.</p>

<p><strong>Common praise:</strong></p>
<ul>
<li>"The exchange rate is exactly what I see on Google" — the mid-market rate is consistently cited as the top reason users choose Wise</li>
<li>"No surprises — the fee shown is the fee I pay" — transparency is a recurring theme</li>
<li>"The multi-currency account is incredibly useful" — freelancers and expats especially value this</li>
<li>"Fast transfers to the UK and Europe" — GBP and EUR transfers are frequently praised for speed</li>
</ul>

<p><strong>Common complaints:</strong></p>
<ul>
<li>"Verification took longer than expected" — first-time users occasionally report delays for identity checks</li>
<li>"ACH funding is slow" — US bank transfer funding takes 1–3 days, which delays the overall transfer</li>
<li>"No cash pickup option" — users sending to recipients without bank accounts are frustrated</li>
<li>"Account frozen pending review" — a small number of users report compliance-related account holds</li>
</ul>

<p><strong>Our assessment:</strong> Wise's review profile is genuinely strong. The complaint patterns are consistent with standard regulatory compliance processes and US banking infrastructure limitations — not with Wise-specific issues. The ratio of positive to negative reviews is among the best in the industry.</p>`,
      },
    ],

    whoShouldUse: [
      {
        heading: "Wise is ideal for",
        items: [
          "Anyone who wants the best exchange rate — Wise's mid-market rate is unbeatable",
          "Large transfers ($1,000+) where percentage savings add up significantly",
          "Regular senders who value transparent, predictable pricing",
          "Freelancers and remote workers who receive payments in multiple currencies",
          "Expats managing finances across countries",
          "Small businesses making international payments or paying overseas contractors",
          "Anyone frustrated with bank exchange rates and wire fees",
        ],
      },
      {
        heading: "Wise may not be the best choice for",
        items: [
          "Sending to recipients without bank accounts (no cash pickup or mobile money)",
          "Urgent transfers that need to arrive in minutes (Remitly Express is faster)",
          "Very small transfers under $100 where the percentage fee may feel high",
          "Corridors with limited coverage (some African and Middle Eastern routes)",
        ],
      },
    ],

    alternatives: [
      { slug: "remitly", reason: "Better for small remittances, cash pickup, mobile money, and express delivery" },
      { slug: "ofx", reason: "Strong alternative for large transfers ($10,000+) with no fees and competitive rates" },
      { slug: "xe", reason: "Similar mid-market rate approach with broader currency coverage" },
      { slug: "revolut", reason: "Good multi-currency alternative for European users with weekend rate limitations" },
      { slug: "western-union", reason: "Unmatched cash pickup network if recipient needs physical cash" },
      { slug: "worldremit", reason: "More delivery options (cash, mobile money) for developing countries" },
    ],

    faqs: [
      {
        q: "Is Wise safe and legitimate?",
        a: "Yes. Wise is a publicly traded company on the London Stock Exchange (LSE: WISE), regulated by the FCA (UK), FinCEN (US), ASIC (Australia), and financial authorities in every market it operates. Customer funds are held in segregated accounts. Wise has over 16 million customers and has transferred over $150 billion since launch.",
      },
      {
        q: "Does Wise use the real exchange rate?",
        a: "Yes. Wise uses the mid-market exchange rate — the same rate you see on Google, XE, or Reuters. There is zero markup on the exchange rate. Wise's fee is the only cost. This is verified by our automated comparison system which checks Wise's rates against XE mid-market rates every 6 hours.",
      },
      {
        q: "How much does Wise charge?",
        a: "Wise charges a variable fee typically ranging from 0.33% to 1.5% of the transfer amount, depending on the currency pair and payment method. Bank transfer funding is cheapest; credit cards add approximately 1.5%. The exact fee is always shown before you confirm the transfer.",
      },
      {
        q: "How fast is Wise?",
        a: "Most Wise transfers arrive within 1–2 business days. Some routes (like GBP to EUR) arrive within hours. Funding with a debit card or Apple Pay speeds things up compared to ACH bank transfer, which takes 1–3 days to clear before Wise can send the money.",
      },
      {
        q: "Is Wise cheaper than my bank?",
        a: "Almost certainly yes. Banks typically charge $25–$50 per wire transfer plus a 3–5% exchange rate markup. On a $1,000 transfer, a bank might cost $55–$95 in total fees and markup. Wise typically costs $4–$8 total. That's a saving of $50–$90 per transfer.",
      },
      {
        q: "Can I use Wise for business transfers?",
        a: "Yes. Wise Business offers batch payments, API access, multi-user accounts, and integration with accounting software like Xero and QuickBooks. Business accounts have the same exchange rate (mid-market) with slightly different fee structures for high-volume senders.",
      },
      {
        q: "Does Wise offer a debit card?",
        a: "Yes. The Wise card is a debit card linked to your multi-currency account. You can spend in any of the 40+ currencies in your account at the mid-market rate, with a small conversion fee only when you spend in a currency you don't hold a balance in.",
      },
      {
        q: "What is the Wise multi-currency account?",
        a: "The Wise multi-currency account lets you hold and convert 40+ currencies. You get local bank details in several countries (US, UK, EU, Australia, Singapore, and more), meaning you can receive payments as if you had a local account. This is especially popular with freelancers and businesses.",
      },
    ],
  },
];

export function getProviderReview(slug: string): ProviderReview | undefined {
  return providerReviews.find((r) => r.slug === slug);
}
