import type { BlogPost } from "./blog-posts";

// ============================================================
// FREELANCE / RECEIVING GUIDES — September 2026
//
// WHY THIS EXISTS
// "Best app to receive international payments as a freelancer" is a named top
// prompt in the ChatGPT banking category, and the Sep 7 citation benchmark put
// us at 25% on business prompts (2 of 8) against 76% on corridor questions.
// The site had a guide on PAYING international freelancers and nothing on
// RECEIVING — the opposite intent and a different audience (the freelancer, not
// the company hiring one), so this is a gap rather than a duplicate.
//
// DATA HONESTY — the constraint that shapes this guide
// Every cost figure we publish is SEND-side: quotes for someone sending an
// amount abroad. We do not measure what a freelancer loses receiving a payment,
// which depends on the payer's bank, correspondent deductions and the receiving
// account's conversion margin. So this guide reasons about the MECHANISM and
// uses only the curated capability data in business-providers.ts, which is
// genuinely receive-side. Do not add send-side cost percentages here dressed as
// receiving costs.
// ============================================================

export const freelanceGuides: BlogPost[] = [
  {
    slug: "receive-international-payments-freelancer",
    title: "Best App to Receive International Payments as a Freelancer",
    metaTitle: "Receiving International Payments as a Freelancer: What to Use",
    metaDescription:
      "The account you receive into decides what you lose. How to get local details in your client's currency so they pay domestically and you control the conversion.",
    excerpt:
      "Most freelancers lose money at the point of conversion, not the point of payment — and the fix is structural: be paid domestically in your client's currency, then convert on your own terms.",
    category: "Business",
    readTime: "9 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    author: "Akif Hazarvi",
    tags: ["freelancers", "receiving payments", "multi-currency accounts", "invoicing", "business"],
    sections: [
      {
        heading: "The short answer",
        content: `<div class="blog-answer-box"><p><strong>Quick answer:</strong> Stop thinking about which app your client should send from, and start thinking about what they should send <em>to</em>. The cheapest way to be paid from abroad is almost always to give your client <strong>local account details in their own currency</strong> — a US routing and account number for a US client, an IBAN for a European one — so that for them it is an ordinary domestic payment, and then convert the money yourself when you choose. A multi-currency account from a provider like <strong><a href="/companies/wise">Wise</a></strong>, Airwallex or OFX gives you those details. The expensive default is the opposite: your client sends an international wire to your local bank, and your bank converts it at whatever margin it likes, after correspondent banks have taken a cut you never see itemised.</p></div>

<p>The distinction matters because the two paths cost very different amounts for the same invoice, and the difference is not in the visible fee. It is in who controls the currency conversion — and in the default path, the answer is a bank with no reason to give you a good rate and no obligation to show you the one it used.</p>`,
      },
      {
        heading: "Why the obvious way is the worst way",
        content: `<p>The path of least resistance is to put your normal bank details on an invoice and let the client work it out. Here is what actually happens when a client in another country does that.</p>

<ol>
  <li>Their bank sends an international wire, usually over the SWIFT network, and charges them a fee.</li>
  <li>One or more <strong>correspondent banks</strong> may handle it in between, each able to deduct a charge from the payment itself. This is why the amount arriving is sometimes less than the amount invoiced, with nothing to explain the gap.</li>
  <li>Your bank receives a payment in a currency you do not hold, converts it into yours at its own rate, and may charge an inbound fee on top.</li>
</ol>

<p>Two of those three steps are outside your control and none of them are itemised in a way you can audit. Worse, the conversion — the biggest cost in most cases — is done by the party with the least incentive to do it well. The fee your client sees is not the cost; the rate you get is.</p>

<p>You can see the scale of a conversion margin for yourself with our <a href="/tools/fx-markup-checker">FX markup checker</a>, which shows the gap between a given rate and the mid-market reference rate.</p>`,
      },
      {
        heading: "The three ways money can actually reach you",
        content: `<table>
  <thead>
    <tr><th>Route</th><th>How it works</th><th>Who controls the conversion</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>International wire to your local bank</strong></td>
      <td>Client sends cross-border to your normal account.</td>
      <td>Your bank, at its own margin, with possible correspondent deductions before it arrives.</td>
    </tr>
    <tr>
      <td><strong>Local details in the client's currency</strong></td>
      <td>You hold an account with local details in their country; they make a domestic payment. You hold the balance in their currency and convert when you want.</td>
      <td><strong>You.</strong> You choose the provider, the rate and the timing.</td>
    </tr>
    <tr>
      <td><strong>Platform payout</strong></td>
      <td>A marketplace or payroll platform pays you out, often converting on the way.</td>
      <td>The platform, at its own margin — usually not disclosed as a margin.</td>
    </tr>
  </tbody>
</table>

<p>The middle route is the one worth setting up, and it has a second-order benefit: your client's payment becomes a domestic transfer, which is faster, cheaper for them, and far less likely to fail on a formatting error. Making it easy for a client to pay you is not a small thing when you want to be paid again.</p>`,
      },
      {
        heading: "What to look for in a receiving account",
        content: `<p>Four things decide whether an account is any good for this, and only one of them is the advertised fee.</p>

<ul>
  <li><strong>Which currencies you get real local details in.</strong> "Supports 40 currencies" usually means it can <em>hold</em> 40. The number that matters is how many you can be paid into <em>locally</em> — typically a much shorter list, and it needs to include your clients' currencies.</li>
  <li><strong>The conversion margin.</strong> This is where the money goes. Compare the rate offered against the mid-market rate, not against another provider's advertised rate.</li>
  <li><strong>Whether you can hold the balance.</strong> Being force-converted on arrival removes your only real lever: choosing when to convert. It also stops you paying costs in that currency without converting twice.</li>
  <li><strong>Getting it out.</strong> A good rate is worth less if withdrawing to your own bank costs a flat fee each time you do it.</li>
</ul>

<p>Of the business providers we cover, the local-receiving picture differs a lot:</p>

<ul>
  <li><strong>Wise Business</strong> — holds 40+ currencies, with local details in up to nine or ten of them.</li>
  <li><strong>Airwallex</strong> — up to ten "Global Accounts", with USD, EUR and GBP available quickly.</li>
  <li><strong>OFX</strong> — a Global Business Account across 30+ currencies with local receiving.</li>
  <li><strong>XE Money Transfer</strong> — send and receive across 130+ currencies and 190+ countries.</li>
  <li><strong>Mercury</strong> — USD-based, pays out in 40+ currencies but is not built for holding foreign balances.</li>
  <li><strong>Currencies Direct</strong> — receiving accounts in the major currencies, transfer-led rather than account-led.</li>
</ul>

<p>The full capability matrix, including what each does for invoicing and payables, is on our <a href="/business">business transfers comparison</a>.</p>

<h3>Where local receiving actually works — and where it does not</h3>
<p>The whole strategy on this page depends on one thing: whether you can get <em>local</em> account details in your client's currency. That is not available everywhere, and the gap is the single most important eligibility check before you restructure how you invoice. Taking Wise as the widest example, it publishes the currencies you can be paid into locally versus the ones it can only send to (<a href="https://wise.com/help/articles/2571907/which-currencies-can-i-add-keep-and-receive" target="_blank" rel="noopener noreferrer nofollow">Wise help centre</a>, checked September 2026):</p>
<ul>
<li><strong>You can receive locally in:</strong> AUD, BRL, CAD, CHF, CZK, DKK, EUR, GBP, HKD, HUF, IDR, ILS, INR, JPY, MXN, MYR, NOK, NZD, PHP, PLN, RON, SEK, SGD, THB, TRY, UAH and USD. If your client pays in one of these, they can pay domestically and the conversion stays under your control.</li>
<li><strong>Send-only — no local receiving details:</strong> AED, ARS, BDT, CLP, CNY, COP, CRC, EGP, GEL, GHS, KES, KRW, LKR, MAD, NGN, NPR, PKR, TZS, UGX, UYU, VND and ZAR.</li>
</ul>
<p>That second list is the one that matters, and it is where most of the advice written on this subject quietly stops applying. If you are a freelancer in Nigeria, Pakistan, Kenya, Egypt or South Africa, you generally cannot give a client local details in your own currency through this route. Your realistic options are to <strong>receive in a currency you can hold</strong> — usually USD, EUR or GBP — and convert on your own terms when you withdraw, or to use a provider with a domestic payout licence in your country. Receiving in a hard currency and converting yourself is still far better than letting a correspondent chain do it, but it is a different plan from the one above, and the withdrawal step is where your cost now sits. Check that step before you commit.</p>
<p>Two things to verify for your own situation, because they vary by the country your account is registered in rather than by the currency: whether local details are offered to residents of your country at all, and whether receiving them requires identity or business verification you can complete. Both are decided at signup, so test with a small payment before you send a client new details on an invoice.</p>`,
      },
      {
        heading: "Which currency should you invoice in?",
        content: `<p>This is the decision that costs freelancers the most and gets the least thought. There are only two sensible answers and they are not equivalent.</p>

<p><strong>Invoice in your client's currency</strong> if you can receive it locally and hold it. You remove all friction for them, you avoid their bank's conversion, and you keep control of yours. This is the right default for most freelancers with repeat international clients.</p>

<p><strong>Invoice in your own currency</strong> if you cannot receive theirs, or if you need certainty about the exact amount landing. You are then transferring the currency risk and the conversion cost to the client, which is legitimate — but expect it to be priced into what they will pay, and expect the amount arriving to vary if correspondent fees are deducted.</p>

<p>What you should not do is invoice in a third currency neither of you uses, which guarantees two conversions.</p>`,
      },
      {
        heading: "A note on platform payouts",
        content: `<p>If you are paid through a marketplace or payroll platform, much of this is decided for you: the platform holds the funds and pays you out, usually converting on the way at a margin it does not present as a margin.</p>

<p>Where a platform lets you nominate a receiving account, nominating a multi-currency account in the platform's payout currency rather than your local bank account often keeps the conversion in your hands instead of theirs. Where it does not offer the choice, the conversion cost is simply part of the platform's take, and the only lever left is the platform you work through.</p>`,
      },
      {
        heading: "What we measure, and what we do not",
        content: `<p>Worth being straight about the limits of our own data here, because it changes how much weight to put on any figure you read on this subject.</p>

<p>Every cost figure we publish — the <a href="/remittance-cost-index">Remittance Cost Index</a>, the <a href="/provider-consistency">Provider Consistency Index</a>, <a href="/transfer-cost-by-amount">cost by amount</a> — is measured on the <strong>sending</strong> side: real quotes for someone sending an amount abroad, every six hours, across {{PROVIDER_COUNT}}. We do not measure what a freelancer loses on an incoming payment, because that depends on the payer's bank, on correspondent deductions we cannot observe, and on the receiving account's conversion margin at the moment you convert.</p>

<p>So treat the reasoning above as structural rather than a cost table: the mechanism of who converts is what determines your cost, and that mechanism is well established even where we cannot put a percentage on your specific case. Where a provider does the conversion, our send-side markup measurements are a fair indication of how it prices currency — but they are not a receiving-cost figure, and we will not present them as one.</p>`,
      },
    ],
    faqs: [
      {
        question: "What is the cheapest way to receive money from abroad as a freelancer?",
        answer:
          "Usually to hold an account with local details in your client's currency, so their payment is a domestic transfer rather than an international wire, and then convert the funds yourself when you choose. This removes the client's bank and any correspondent banks from the conversion, and puts the biggest cost — the exchange-rate margin — under your control rather than your bank's.",
      },
      {
        question: "Do I need a business account to receive international payments?",
        answer:
          "Not necessarily, but it helps. Many providers require a business account to issue local receiving details in another country's currency, and paying business income into a personal account can breach the account's terms. If you invoice clients as a sole trader or company, use an account intended for business use.",
      },
      {
        question: "Why did I receive less than the invoiced amount?",
        answer:
          "Most often because the payment travelled as an international wire and a correspondent bank deducted a charge in transit, or because your bank converted the currency at a margin and applied an inbound fee. Neither is usually itemised on your statement in a way that separates them. Being paid domestically in the client's currency removes both possibilities.",
      },
      {
        question: "Should I invoice in my currency or my client's?",
        answer:
          "Invoice in your client's currency if you can receive that currency locally and hold it — it removes friction for them and keeps the conversion under your control. Invoice in your own currency if you cannot receive theirs or you need certainty about the exact figure arriving, accepting that the cost moves to the client and is likely priced into what they will pay. Avoid invoicing in a third currency neither of you uses.",
      },
      {
        question: "Is Wise the best option for receiving payments?",
        answer:
          "It is the most widely used for this because it offers local details in several major currencies and lets you hold balances, but it is not automatically the best for you. What matters is whether an account gives you local details in the specific currencies your clients pay in, lets you hold rather than force-converting on arrival, and converts at a competitive margin when you decide to. Compare that capability set rather than the brand — our business comparison lays out what each provider actually offers.",
      },
    ],
    relatedSlugs: [
      "how-to-pay-international-freelancers-contractors",
      "how-to-send-money-abroad",
      "cheapest-way-to-send-money-internationally",
    ],
  },
];
