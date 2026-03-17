import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import RatingBadge from "@/components/RatingBadge";
import { getGoUrl } from "@/lib/affiliate";
import CrossLinks from "@/components/CrossLinks";
import CircleFlag from "@/components/CircleFlag";
import {
  providers,
  generateQuotes,
  getProviderName,
  getExchangeRate,
  currencies,
  popularCorridors,
} from "@/data/providers";
import { getBankRates, hasBankRates, getBankRatesSourceUrl } from "@/lib/bank-rates";
import { allCorridors, getCorridor, getCorridorSlug } from "@/data/corridors";
import { getCountryDetails } from "@/data/corridor-details";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ corridor: string; locale: string }>;
}

const corridorEditorialNotes: Record<
  string,
  {
    title: string;
    summary: string;
    bullets: string[];
    warningTitle: string;
    warningBody: string;
  }
> = {
  "uk-to-india": {
    title: "What matters on the UK to India corridor",
    summary:
      "GBP to INR is one of the most competitive remittance routes in Europe, but the cheapest option still changes based on how you fund the transfer, how quickly the money needs to arrive, and which payout rail the provider uses in India.",
    bullets: [
      "Bank transfer funding is usually the cheapest option from the UK. Debit card funding can be faster, but the extra card fee often wipes out the speed benefit on smaller transfers.",
      "For urgent transfers, providers connected to IMPS or UPI-linked bank rails can deliver within minutes. Traditional bank SWIFT wires rarely compete on either cost or speed.",
      "If you send regularly for family support, tuition, or property costs, the exchange-rate markup matters more than the advertised transfer fee. A 1% worse rate on GBP 1,000 can cost more than a GBP 5 fee difference.",
      "Recipients in India often prefer direct bank deposit to SBI, HDFC, ICICI, Axis, or Kotak accounts. Cash pickup matters less on this corridor than in markets where banking access is lower.",
    ],
    warningTitle: "Common mistake UK senders make",
    warningBody:
      "Comparing only the upfront fee misses the real cost. On UK to India transfers, the provider with the lowest fee is often not the provider that delivers the most INR once FX markup is included.",
  },
  "usa-to-india": {
    title: "What matters on the USA to India corridor",
    summary:
      "USD to INR is the most competitive remittance corridor from the United States, with over a dozen providers fighting for market share. The sheer competition means savings vary significantly depending on transfer size, funding method, and how your recipient receives the money in India.",
    bullets: [
      "Providers using IMPS or UPI-linked rails can deliver INR to Indian bank accounts within minutes. If your recipient banks with HDFC, SBI, or ICICI, most major providers support instant credit — always confirm the delivery method before sending.",
      "Exchange rate markup is where providers make their real margin. A provider advertising zero fees but marking up the mid-market rate by 1.5% costs more on a $1,000 transfer than one charging a $5 fee with a 0.3% markup. Always compare the total INR received, not just the fee.",
      "Regular senders supporting family or paying tuition should compare subscription or loyalty pricing. Some providers like Remitly offer better rates for repeat transfers, which adds up over 12+ transfers per year.",
      "ACH bank funding is almost always the cheapest option from the US. Debit and credit card funding adds $3–$10 in card processing fees that rarely justify the marginal speed improvement on this corridor.",
    ],
    warningTitle: "Watch out for first-transfer promotions",
    warningBody:
      "Many providers offer an inflated exchange rate or zero fees on your first transfer to win your business. Always check what the second transfer costs — the ongoing rate is what matters for regular senders.",
  },
  "usa-to-pakistan": {
    title: "What matters on the USA to Pakistan corridor",
    summary:
      "Sending USD to Pakistan involves navigating State Bank of Pakistan (SBP) regulations and a currency that can move sharply. Cash pickup remains important here because a significant portion of recipients prefer collecting money in person rather than through bank transfers.",
    bullets: [
      "JazzCash and Easypaisa mobile wallets have become major payout options in Pakistan. If your recipient uses either service, you can often get same-day delivery at lower cost than traditional bank deposit or cash pickup.",
      "PKR has experienced significant volatility in recent years. If you are sending a large amount, consider locking in the rate at the time of transfer rather than using providers that quote indicative rates and settle later.",
      "Cash pickup through Western Union, MoneyGram, or Ria remains critical for recipients in smaller cities and rural areas where bank access is limited. Compare cash pickup fees separately — they are often higher than bank deposit fees.",
      "SBP requires all inbound remittances to be converted at the official interbank rate. However, providers still differ in the margin they add on top, so the amount your recipient gets in PKR can vary by 2–3% across providers.",
    ],
    warningTitle: "Understand PKR conversion rules",
    warningBody:
      "Pakistan requires remittances to be paid out in PKR at the official rate. Some providers advertise attractive USD/PKR rates that include hidden margins. Always compare the final PKR amount your recipient will receive, not just the quoted exchange rate.",
  },
  "usa-to-mexico": {
    title: "What matters on the USA to Mexico corridor",
    summary:
      "The USA to Mexico corridor is the largest remittance route in the world by volume, which means fierce competition and generally low fees. The key differentiator is delivery method — Mexico's SPEI instant payment network has transformed how quickly recipients can access funds.",
    bullets: [
      "SPEI (Mexico's real-time payment system) enables instant bank deposits to any Mexican bank account. Providers connected to SPEI can deliver pesos within minutes, making it the fastest and usually cheapest delivery option available.",
      "Oxxo cash pickup is uniquely important on this corridor. With over 20,000 Oxxo convenience stores across Mexico, this option serves recipients who prefer cash or lack a bank account. Not all providers offer Oxxo — check availability if your recipient needs it.",
      "The MXN/USD rate can swing 5–10% over a few months. If you send regularly, consider setting rate alerts and transferring when the peso weakens, as timing can save more than switching providers on this high-volume corridor.",
      "ACH funding from a US bank account keeps costs lowest. Some providers charge $0 fees on this corridor when funded by ACH, making the exchange rate markup the only real cost to compare.",
    ],
    warningTitle: "Don't overlook SPEI delivery speed",
    warningBody:
      "Some providers still route Mexican bank deposits through slower SWIFT networks, taking 1–3 days. Always confirm your provider uses SPEI for bank deposits — the speed difference is dramatic and SPEI transfers are usually cheaper too.",
  },
  "usa-to-philippines": {
    title: "What matters on the USA to Philippines corridor",
    summary:
      "The Philippines is one of the top remittance destinations globally, and Filipino recipients have more payout options than almost any other corridor. Mobile wallets, bank deposits, and an extensive cash pickup network mean you should choose your provider based on how your recipient prefers to collect money.",
    bullets: [
      "GCash and Maya (formerly PayMaya) mobile wallets are widely used in the Philippines and many providers now support direct wallet top-up. This is often the fastest delivery method — funds can arrive in minutes at lower fees than bank deposit.",
      "For bank deposits, BPI and BDO are the most commonly supported banks. Some providers also support UnionBank, Metrobank, and Landbank. Confirm your recipient's bank is supported before initiating the transfer.",
      "Cash pickup remains essential in the Philippines. Cebuana Lhuillier and M Lhuillier have thousands of branches nationwide, including in provincial areas. Western Union and MoneyGram also have extensive networks through partner locations.",
      "Competition on this corridor is strong — Remitly, Wise, WorldRemit, and Xoom all compete aggressively. Rates can differ by 2–4% on a $500 transfer, so comparing before every send is worthwhile.",
    ],
    warningTitle: "Check payout network before choosing a provider",
    warningBody:
      "The cheapest provider is only useful if your recipient can actually collect the money. Verify that the provider supports your recipient's preferred bank, mobile wallet, or cash pickup location — especially outside Metro Manila.",
  },
  "uk-to-europe": {
    title: "What matters on the UK to Europe corridor",
    summary:
      "Sending GBP to EUR is one of the most straightforward cross-border transfers thanks to the SEPA payment network, but post-Brexit changes mean costs vary more than you might expect. Digital-first providers like Wise and Revolut dominate this corridor on price.",
    bullets: [
      "SEPA (Single Euro Payments Area) transfers within Europe settle in hours and cost a fraction of SWIFT wires. Any provider routing your transfer via SEPA rather than SWIFT will be significantly cheaper and faster for EUR deliveries.",
      "Post-Brexit, UK banks are no longer part of SEPA directly, but most specialist providers maintain SEPA access through European banking partners. This means you can still get SEPA-speed delivery without paying traditional international wire fees.",
      "Wise and Revolut consistently offer the tightest GBP/EUR spreads on this corridor, often within 0.3–0.5% of the mid-market rate. Traditional banks typically charge 2–4% in hidden FX markup on top of their wire fees.",
      "For regular payments like rent, mortgage, or salary splitting across the UK and Europe, consider providers offering recurring transfers or multi-currency accounts. The convenience savings on monthly payments add up quickly.",
    ],
    warningTitle: "Your UK bank is probably the most expensive option",
    warningBody:
      "UK high-street banks charge an average of 3–4% in combined fees and FX markup for GBP to EUR transfers. On a £1,000 transfer, that could mean £30–£40 in unnecessary costs compared to specialist providers.",
  },
  "canada-to-india": {
    title: "What matters on the Canada to India corridor",
    summary:
      "CAD to INR is a growing corridor with increasing competition, though it has fewer provider options than the equivalent USA to India route. The good news is that Canadian-specific funding methods like Interac e-Transfer can reduce costs and speed up the process.",
    bullets: [
      "Interac e-Transfer funding is available with several providers and is usually faster than traditional bank wire from Canada. It also avoids the $15–$30 outgoing wire fee that Canadian banks typically charge for international transfers.",
      "IMPS delivery to Indian bank accounts works the same regardless of sending country — your recipient at HDFC, SBI, ICICI, or any major Indian bank should receive funds within minutes once the provider processes your transfer.",
      "The CAD to INR corridor has fewer providers than USD to INR, which means slightly less competition. However, Wise, Remitly, and WorldRemit all serve this route with competitive rates — comparing all three before each transfer is worth the extra minute.",
      "If you previously sent via the USA corridor (perhaps through a USD account), compare directly. Some providers offer better CAD/INR rates than converting CAD to USD first and then sending USD to INR.",
    ],
    warningTitle: "Avoid the double-conversion trap",
    warningBody:
      "Some providers convert CAD to USD first, then USD to INR, taking a margin on each conversion. Look for providers that offer a direct CAD/INR rate — you will almost always receive more rupees with a single conversion.",
  },
  "australia-to-india": {
    title: "What matters on the Australia to India corridor",
    summary:
      "AUD to INR is well-served by both global and Asia-Pacific specialist providers. Australian payment methods like POLi and PayID can make funding faster and cheaper, and the corridor benefits from strong competition between Instarem, Remitly, and Wise.",
    bullets: [
      "POLi and PayID funding options are available with several providers and offer near-instant bank transfers without the fees associated with credit or debit card payments. PayID in particular is fast and free at most Australian banks.",
      "Instarem has a strong presence on this corridor as an Asia-Pacific specialist, often matching or beating Wise on the AUD/INR rate. Always include Instarem in your comparison — it is sometimes overlooked by senders who only check global brands.",
      "Delivery to Indian banks via IMPS is standard on this corridor. Whether your recipient banks with SBI, HDFC, ICICI, Axis, or a smaller bank, most providers can credit their account within minutes of processing.",
      "Transfer times from Australia can be affected by AEST/IST timezone differences. Transfers initiated during Australian business hours may process faster, as provider operations and banking cut-off times align better.",
    ],
    warningTitle: "Don't ignore Asia-Pacific specialists",
    warningBody:
      "Global providers are not always the cheapest on AUD corridors. Asia-Pacific specialists like Instarem and InstaReM often negotiate better AUD/INR rates due to regional banking relationships. Comparing at least one regional provider alongside global names can save 1–2%.",
  },
  "usa-to-nigeria": {
    title: "What matters on the USA to Nigeria corridor",
    summary:
      "Sending USD to Nigeria requires understanding the NGN exchange rate landscape, which has undergone significant changes as the Central Bank of Nigeria (CBN) has reformed currency policies. The gap between official and parallel rates has narrowed, but provider rates can still vary significantly.",
    bullets: [
      "The CBN's currency reforms mean the official NGN rate is now closer to market rates than in previous years. However, providers still differ in the rate they offer — comparing the actual NGN your recipient receives is more important than ever on this corridor.",
      "Bank deposit to Nigerian banks like GTBank, Access Bank, Zenith, and First Bank is the most common delivery method. Ensure your recipient's account number and bank are correct, as corrections after sending can be slow and costly.",
      "Mobile money options are growing in Nigeria but are less established than in East Africa. Some providers support transfers to Paga or Opay wallets, which can be useful for recipients without traditional bank accounts.",
      "This corridor has seen rapid growth and new providers entering the market. Smaller fintech providers sometimes offer significantly better rates than established names — but verify they are licensed and regulated before sending large amounts.",
    ],
    warningTitle: "Verify the NGN rate carefully",
    warningBody:
      "Nigeria's currency market has been volatile, and some providers update their NGN rates less frequently than others. Always check the rate at the moment of transfer, not the rate quoted hours earlier. A stale rate quote can mean your recipient receives significantly less than expected.",
  },
  "uk-to-pakistan": {
    title: "What matters on the UK to Pakistan corridor",
    summary:
      "GBP to PKR is a major remittance corridor driven by one of the largest Pakistani diaspora communities in the world. The corridor shares many characteristics with USA to Pakistan, but UK-specific funding methods and regulatory considerations create important differences.",
    bullets: [
      "UK bank transfer (Faster Payments) funding is the cheapest way to initiate a transfer. Most providers accept Faster Payments, which settles within hours and avoids the card processing fees that add £2–£5 to each transfer.",
      "JazzCash and Easypaisa mobile wallet delivery is available from UK providers and is growing rapidly. For recipients in urban Pakistan, mobile wallet top-up is often faster than bank deposit and avoids the need for a traditional bank account.",
      "Cash pickup remains vital for recipients outside major cities. Western Union and MoneyGram have the widest agent networks in Pakistan, but Ria and smaller providers sometimes offer better GBP/PKR rates for cash collection.",
      "The UK's FCA regulation means all providers on this corridor must be registered and meet strict compliance standards. This provides an extra layer of consumer protection compared to some other sending countries — always verify FCA registration before using a new provider.",
    ],
    warningTitle: "Factor in PKR volatility when timing transfers",
    warningBody:
      "The Pakistani rupee has been subject to significant swings. If you send regularly, tracking the GBP/PKR rate over a few days before transferring can help you catch better rates. Some providers offer rate alerts that notify you when GBP/PKR reaches a target level.",
  },
};

const noindexCorridors = new Set(["gbp-to-fjd"]);

// ── Static generation ──

export function generateStaticParams() {
  return allCorridors.map((c) => ({ corridor: c.slug }));
}

const corridorSeoOverrides: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; keywords: string }> = {
  "usa-to-pakistan": {
    title: "Send Money USA to Pakistan — USD to PKR Rates",
    description:
      "Compare the cheapest ways to send money from USA to Pakistan in 2026. See real-time USD to PKR exchange rates, fees, and delivery times from Wise, Remitly, Western Union, and 10+ more providers.",
    ogTitle: "Send Money USA to Pakistan — Best USD to PKR Rates",
    ogDescription:
      "Compare real-time USD to PKR rates from 15+ providers. Find the cheapest and fastest way to send money from USA to Pakistan.",
    keywords:
      "send money USA to Pakistan, USD to PKR, cheapest way to send money to Pakistan, money transfer Pakistan, remittance to Pakistan, USD PKR exchange rate",
  },
  "usa-to-india": {
    title: "Send Money USA to India — USD to INR Rates",
    description:
      "Compare the cheapest ways to send money from USA to India in 2026. See real-time USD to INR exchange rates, fees, and delivery times from Wise, Remitly, Western Union, and 10+ more providers.",
    ogTitle: "Send Money USA to India — Best USD to INR Rates",
    ogDescription:
      "Compare real-time USD to INR rates from 15+ providers. Find the cheapest and fastest way to send money from USA to India.",
    keywords:
      "send money USA to India, USD to INR, cheapest way to send money to India, money transfer India, remittance to India, USD INR exchange rate",
  },
  "usa-to-mexico": {
    title: "Send Money USA to Mexico — USD to MXN Rates",
    description:
      "Find the cheapest way to send money from USA to Mexico in 2026. Compare real-time USD to MXN exchange rates, fees, and delivery speeds from Wise, Remitly, Xoom, Western Union, and more. SPEI instant deposits available.",
    ogTitle: "Send Money USA to Mexico — Best USD to MXN Rates",
    ogDescription:
      "Compare USD to MXN rates from 15+ providers. Find the cheapest way to send money from USA to Mexico with SPEI instant delivery.",
    keywords:
      "send money USA to Mexico, USD to MXN, cheapest way to send money to Mexico, money transfer Mexico, remittance to Mexico, USD MXN exchange rate, SPEI transfer, Oxxo cash pickup",
  },
  "usa-to-philippines": {
    title: "Send Money USA to Philippines — USD to PHP Rates",
    description:
      "Compare the cheapest ways to send money from USA to Philippines in 2026. Real-time USD to PHP rates, fees, and delivery options including GCash, bank deposit, and cash pickup from 15+ providers.",
    ogTitle: "Send Money USA to Philippines — Best USD to PHP Rates",
    ogDescription:
      "Compare real-time USD to PHP rates from 15+ providers. Find the cheapest way to send money from USA to Philippines via GCash, bank, or cash pickup.",
    keywords:
      "send money USA to Philippines, USD to PHP, cheapest way to send money to Philippines, money transfer Philippines, remittance to Philippines, GCash transfer, USD PHP exchange rate",
  },
  "uk-to-europe": {
    title: "Send Money UK to Europe — GBP to EUR Rates",
    description:
      "Compare the cheapest ways to send money from UK to Europe in 2026. Real-time GBP to EUR exchange rates, SEPA transfer fees, and delivery times from Wise, Revolut, and 10+ more providers.",
    ogTitle: "Send Money UK to Europe — Best GBP to EUR Rates",
    ogDescription:
      "Compare GBP to EUR rates from 15+ providers. Find the cheapest SEPA transfer from UK to Europe with the lowest fees.",
    keywords:
      "send money UK to Europe, GBP to EUR, cheapest way to send money to Europe, SEPA transfer from UK, money transfer Europe, GBP EUR exchange rate, post-Brexit transfers",
  },
  "uk-to-india": {
    title:
      "Send Money UK to India — Best GBP to INR Rates (2026)",
    description:
      "Compare the cheapest ways to send money from UK to India. Real-time GBP to INR rates from Wise, Remitly, OFX & 10+ providers. IMPS instant delivery. Save £40–£70 per transfer vs banks.",
    ogTitle:
      "Send Money from UK to India — Cheapest GBP to INR Rates 2026",
    ogDescription:
      "Compare real-time GBP to INR rates from 15+ providers. Find the cheapest, fastest way to transfer money from UK to India.",
    keywords:
      "send money UK to India, send money from UK to India, money transfer UK to India, money to India from UK, best money transfer to India from UK, cheapest way to send money to India from UK, transfer money from UK to India, wire transfer from UK to India, GBP to INR, sending money from UK to India, how to send money from UK to India, best way to transfer money from UK to India, online money transfer from UK to India",
  },
  "canada-to-india": {
    title: "Send Money Canada to India — CAD to INR Rates",
    description:
      "Compare the cheapest ways to send money from Canada to India in 2026. Real-time CAD to INR exchange rates, fees, and delivery times from Wise, Remitly, WorldRemit, and more. Fund via Interac e-Transfer.",
    ogTitle: "Send Money Canada to India — Best CAD to INR Rates",
    ogDescription:
      "Compare CAD to INR rates from 10+ providers. Find the cheapest way to send money from Canada to India with Interac funding.",
    keywords:
      "send money Canada to India, CAD to INR, cheapest way to send money to India from Canada, money transfer India, remittance to India, CAD INR exchange rate, Interac e-Transfer",
  },
  "australia-to-india": {
    title: "Send Money Australia to India — AUD to INR Rates",
    description:
      "Compare the cheapest ways to send money from Australia to India in 2026. Real-time AUD to INR exchange rates, fees, and delivery times from Wise, Instarem, Remitly, and 10+ more providers.",
    ogTitle: "Send Money Australia to India — Best AUD to INR Rates",
    ogDescription:
      "Compare AUD to INR rates from 10+ providers. Find the cheapest way to send money from Australia to India with PayID funding.",
    keywords:
      "send money Australia to India, AUD to INR, cheapest way to send money to India from Australia, money transfer India, remittance to India, AUD INR exchange rate, POLi transfer, PayID",
  },
  "usa-to-nigeria": {
    title: "Send Money USA to Nigeria — USD to NGN Rates",
    description:
      "Compare the cheapest ways to send money from USA to Nigeria in 2026. Real-time USD to NGN exchange rates, fees, and delivery options from Wise, Remitly, WorldRemit, Western Union, and more.",
    ogTitle: "Send Money USA to Nigeria — Best USD to NGN Rates",
    ogDescription:
      "Compare real-time USD to NGN rates from 10+ providers. Find the cheapest and fastest way to send money from USA to Nigeria.",
    keywords:
      "send money USA to Nigeria, USD to NGN, cheapest way to send money to Nigeria, money transfer Nigeria, remittance to Nigeria, USD NGN exchange rate, naira transfer",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { corridor: slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "corridor" });
  const corridor = getCorridor(slug);
  if (!corridor) return {};

  const override = corridorSeoOverrides[slug];
  const isCurr = corridor.isCurrencyCorridor;

  const isCountryPg = corridor.isCountryPage;
  const title = override?.title ?? (isCurr
    ? `${corridor.fromCurrency} to ${corridor.toCurrency} — Best Exchange Rates & Low Fees`
    : isCountryPg
    ? `Send Money to ${corridor.toCountry} — Best ${corridor.toCurrency} Rates & Cheapest Providers`
    : `Send Money from ${corridor.fromCountry} to ${corridor.toCountry} — Best Rates & Lowest Fees`);
  const description = override?.description ?? (isCurr
    ? `Compare real-time ${corridor.fromCurrency} to ${corridor.toCurrency} exchange rates from 15+ providers. Find the cheapest way to convert ${corridor.fromCurrency} to ${corridor.toCurrency} with the lowest fees.`
    : isCountryPg
    ? `Everything you need to know about sending money to ${corridor.toCountry}. Compare live ${corridor.toCurrency} exchange rates, fees, delivery times, recipient requirements, and find the cheapest provider today.`
    : `Compare the best ways to send money from ${corridor.fromCountry} to ${corridor.toCountry} (${corridor.fromCurrency} to ${corridor.toCurrency}). ${corridor.intro.slice(0, 120)}`);
  const ogTitle = override?.ogTitle ?? (isCurr
    ? `${corridor.fromCurrency} to ${corridor.toCurrency} — Best Exchange Rates`
    : isCountryPg
    ? `Send Money to ${corridor.toCountry} — Best ${corridor.toCurrency} Rates`
    : `Send Money from ${corridor.fromCountry} to ${corridor.toCountry} — Best Rates`);
  const ogDescription = override?.ogDescription ?? description;
  const keywords = override?.keywords ?? (isCurr
    ? `${corridor.fromCurrency} to ${corridor.toCurrency}, ${corridor.fromCurrency} ${corridor.toCurrency} exchange rate, convert ${corridor.fromCurrency} to ${corridor.toCurrency}, best ${corridor.fromCurrency} to ${corridor.toCurrency} rate`
    : isCountryPg
    ? `send money to ${corridor.toCountry}, cheapest way to send money to ${corridor.toCountry}, how to send money to ${corridor.toCountry}, ${corridor.toCurrency} exchange rate, best remittance to ${corridor.toCountry}, international money transfer ${corridor.toCountry}, ${corridor.toCountry} bank transfer, ${corridor.toCurrency} rate today, money transfer to ${corridor.toCountry} online`
    : `send money ${corridor.fromCountry} to ${corridor.toCountry}, ${corridor.fromCurrency} to ${corridor.toCurrency}, cheapest way to send money to ${corridor.toCountry}, money transfer ${corridor.toCountry}, how to send money to ${corridor.toCountry}, ${corridor.toCountry} bank transfer, ${corridor.toCurrency} exchange rate, remittance to ${corridor.toCountry}`);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
    },
    alternates: {
      canonical: `https://sendmoneycompare.com/send-money/${slug}`,
    },
    robots: noindexCorridors.has(slug) ? { index: false, follow: true } : undefined,
  };
}

// ── Helpers ──

function getCurrencySymbol(code: string): string {
  return currencies.find((c) => c.code === code)?.symbol || code;
}

// ── Page ──

export default async function CorridorPage({ params }: Props) {
  const { corridor: slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("corridor");
  const tSendMoney = await getTranslations("sendMoney");
  const corridor = getCorridor(slug);
  if (!corridor) notFound();

  const { fromCurrency, toCurrency, sampleAmount, isCurrencyCorridor, isCountryPage } = corridor;
  const quotes = generateQuotes(sampleAmount, fromCurrency, toCurrency);
  const midRate = getExchangeRate(fromCurrency, toCurrency);
  const sendSymbol = getCurrencySymbol(fromCurrency);
  const receiveSymbol = getCurrencySymbol(toCurrency);

  // Display labels: currency corridors use "USD to INR" style, country corridors use "United States to India"
  const headingFrom = isCurrencyCorridor ? fromCurrency : corridor.fromCountry;
  const headingTo = isCurrencyCorridor ? toCurrency : corridor.toCountry;
  const headingPrefix = isCountryPage ? "Send money to" : isCurrencyCorridor ? "Convert" : "Send money from";
  const headingSuffix = isCountryPage
    ? null
    : isCurrencyCorridor
    ? null
    : `(${fromCurrency} → ${toCurrency})`;

  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const savings = best && worst ? best.receiveAmount - worst.receiveAmount : 0;
  const editorialNote = corridorEditorialNotes[slug];
  const countryDetails = !isCurrencyCorridor ? getCountryDetails(corridor.toCountry, toCurrency) : null;

  // Group by speed for the delivery section
  const fastProviders = quotes.filter(
    (q) => q.transferSpeed.toLowerCase().includes("minute") || q.transferSpeed.toLowerCase().includes("instant")
  );
  const standardProviders = quotes.filter(
    (q) => !q.transferSpeed.toLowerCase().includes("minute") && !q.transferSpeed.toLowerCase().includes("instant")
  );

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-[var(--color-surface)] pt-8 pb-6">
        <Container>
          <div className="flex items-center gap-2 text-[13px] text-[var(--color-on-surface-variant)] mb-4">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <span>/</span>
            <Link href="/send-money" className="hover:text-[var(--color-primary)]">Send Money</Link>
            <span>/</span>
            <span className="text-[var(--color-on-surface)]">
              {isCountryPage ? `Send Money to ${headingTo}` : `${headingFrom} to ${headingTo}`}
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-[28px] md:text-[40px] font-normal text-[var(--color-on-surface)] leading-tight tracking-[-0.5px]">
              {isCountryPage ? `${headingPrefix} ${headingTo}` : `${headingPrefix} ${headingFrom} to ${headingTo}`}
              {headingSuffix && (
                <>
                  {" "}
                  <span className="text-[var(--color-on-surface-variant)] text-[20px] md:text-[28px]">
                    {headingSuffix}
                  </span>
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-6 mt-4 text-[13px] text-[var(--color-on-surface-variant)]">
            <span className="flex items-center gap-1.5">
              <CircleFlag code={corridor.fromCurrency} size={20} />
              {fromCurrency}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="flex items-center gap-1.5">
              <CircleFlag code={corridor.toCurrency} size={20} />
              {toCurrency}
            </span>
            <span className="hidden sm:inline text-[var(--color-outline)]">|</span>
            <span className="hidden sm:inline">
              Mid-market rate: <strong className="text-[var(--color-on-surface)]">{midRate.toFixed(4)}</strong>
            </span>
          </div>
        </Container>
      </section>

      {/* ─── Introduction ─── */}
      <section className="bg-[var(--color-surface)] pb-8">
        <Container>
          <div className="max-w-3xl text-[14px] md:text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-3">
            <p>{corridor.intro}</p>
            {corridor.highlights && corridor.highlights.length > 0 ? (
              <ul className="space-y-2 mt-3">
                {corridor.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[3px] shrink-0 w-4 h-4 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-[10px] font-bold flex items-center justify-center">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{corridor.context}</p>
            )}
          </div>
        </Container>
      </section>

      {/* ─── Quick Compare Widget ─── */}
      <section className="bg-[var(--color-surface-dim)] py-8 border-y border-[var(--color-outline)]">
        <Container>
          <div className="max-w-[860px] mx-auto">
            <ComparisonWidget
              defaultFrom={fromCurrency}
              defaultTo={toCurrency}
              defaultAmount={sampleAmount}
            />
          </div>
        </Container>
      </section>

      {/* ─── Comparison Table ─── */}
      <section className="py-10">
        <Container>
          <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
            Compare providers: {fromCurrency} to {toCurrency}
          </h2>
          <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-2">
            Sending {sendSymbol}{sampleAmount.toLocaleString()} from {headingFrom} to {headingTo}. Sorted by best value — most money received.
          </p>
          <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-on-surface-variant)] mb-6">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            Data updated every 6 hours from live provider quotes
          </p>

          {quotes.length > 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[32px_1fr_90px_80px_110px] sm:grid-cols-[36px_1fr_110px_90px_130px] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-[11px] sm:text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                <span>#</span>
                <span>Provider</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Fee</span>
                <span className="text-right">Recipient gets</span>
              </div>

              {/* Rows */}
              {quotes.map((q, i) => {
                const name = getProviderName(q.providerSlug);
                const provider = providers.find((p) => p.slug === q.providerSlug);
                const logo = provider?.logo || `/logos/${q.providerSlug}.png`;
                const isBest = i === 0;

                // Calculate markup vs mid-market
                const markup = midRate > 0 ? ((midRate - q.exchangeRate) / midRate) * 100 : 0;

                return (
                  <div
                    key={q.providerSlug}
                    className={`grid grid-cols-[32px_1fr_90px_80px_110px] sm:grid-cols-[36px_1fr_110px_90px_130px] gap-2 items-center px-4 sm:px-6 py-3 border-t border-[var(--color-outline)] ${isBest ? "bg-[var(--color-success-surface-dim)]" : ""}`}
                  >
                    {/* Rank */}
                    <span className={`text-[13px] font-medium ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                      {i + 1}
                    </span>

                    {/* Provider */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[11px] font-medium text-[var(--color-on-surface-variant)] relative">
                        <Image src={logo} alt={`${name} logo`} width={32} height={32} className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] sm:text-[14px] font-medium text-[var(--color-on-surface)] truncate">
                          <Link href={`/companies/${q.providerSlug}`} className="hover:text-[var(--color-primary)] hover:underline">{name}</Link>
                          {isBest && (
                            <span className="ml-1.5 text-[10px] text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-1.5 py-0.5 rounded font-medium">
                              Best value
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                          {markup > 0 && markup < 10 && (
                            <span className="text-[10px] text-[var(--color-on-surface-variant)]">
                              {markup.toFixed(2)}% markup
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rate */}
                    <p className="text-[13px] sm:text-[14px] text-[var(--color-on-surface)] text-right tabular-nums">
                      {q.exchangeRate.toFixed(4)}
                    </p>

                    {/* Fee */}
                    <p className="text-[13px] sm:text-[14px] text-[var(--color-on-surface)] text-right tabular-nums">
                      {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                    </p>

                    {/* Amount received */}
                    <p className={`text-[13px] sm:text-[14px] font-medium text-right tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                      {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] text-center py-4">
                No provider quotes available for this corridor yet. Try the{" "}
                <Link href={`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${sampleAmount}`} className="text-[var(--color-primary)] hover:underline">
                  comparison tool
                </Link>{" "}
                for live results.
              </p>
            </Card>
          )}

          {/* Savings callout */}
          {savings > 0 && (
            <div className="mt-4 bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/20 rounded-lg px-5 py-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-success-dark)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-[14px] text-[var(--color-success-dark)]">
                <strong>Potential savings:</strong> Choosing the best provider over the most expensive saves your recipient{" "}
                <strong>
                  {receiveSymbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>{" "}
                on a {sendSymbol}{sampleAmount.toLocaleString()} transfer.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ─── Best Provider Summary ─── */}
      {best && (
        <section className="py-10 bg-[var(--color-surface-dim)]">
          <Container>
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-6">
              Best provider for {fromCurrency} to {toCurrency} right now
            </h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--color-surface-dim)] flex items-center justify-center shrink-0">
                  <Image
                    src={providers.find((p) => p.slug === best.providerSlug)?.logo || `/logos/${best.providerSlug}.png`}
                    alt={getProviderName(best.providerSlug)}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[18px] font-medium text-[var(--color-on-surface)]">
                    {getProviderName(best.providerSlug)}
                  </h3>
                  <RatingBadge rating={best.rating} label={best.ratingLabel} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Exchange rate</p>
                  <p className="text-[16px] font-medium text-[var(--color-on-surface)] mt-1">{best.exchangeRate.toFixed(4)}</p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Fee</p>
                  <p className="text-[16px] font-medium text-[var(--color-on-surface)] mt-1">
                    {best.fee === 0 ? "Free" : `${sendSymbol}${best.fee.toFixed(2)}`}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Recipient gets</p>
                  <p className="text-[16px] font-medium text-[var(--color-success-dark)] mt-1">
                    {receiveSymbol}{best.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide">Speed</p>
                  <p className="text-[16px] font-medium text-[var(--color-on-surface)] mt-1">{best.transferSpeed}</p>
                </div>
              </div>

              {providers.find((p) => p.slug === best.providerSlug) && (
                <div className="flex gap-3">
                  <PrimaryButton href={`/companies/${best.providerSlug}`} size="sm">
                    Read full review
                  </PrimaryButton>
                  <a
                    href={getGoUrl(best.providerSlug)}
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center h-9 px-5 text-[13px] font-medium text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-surface)] transition-colors"
                  >
                    Visit {getProviderName(best.providerSlug)}
                  </a>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {editorialNote && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
              <Card>
                <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-3">
                  {editorialNote.title}
                </h2>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed mb-5">
                  {editorialNote.summary}
                </p>
                <ul className="space-y-3">
                  {editorialNote.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                      <span className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-[var(--color-surface-dim)]">
                <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-3">
                  {editorialNote.warningTitle}
                </h3>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                  {editorialNote.warningBody}
                </p>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  For recurring transfers, it is worth checking live quotes each time rather than relying on one provider by habit. Competition on this corridor is strong enough that rankings can shift meaningfully with market moves.
                </p>
              </Card>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Best Provider For ─── */}
      {quotes.length > 0 && (() => {
        const cheapest = quotes[0]; // already sorted by best value
        const fastest = [...quotes].sort((a, b) => {
          const speedOrder = (s: string) => {
            const lower = s.toLowerCase();
            if (lower.includes("instant") || lower.includes("minute")) return 0;
            if (lower.includes("hour")) return 1;
            if (lower.includes("1") && lower.includes("day")) return 2;
            return 3;
          };
          return speedOrder(a.transferSpeed) - speedOrder(b.transferSpeed);
        })[0];
        const cashPickup = quotes.find((q) => {
          const p = providers.find((pr) => pr.slug === q.providerSlug);
          return p?.deliveryMethods.some((m) => m.toLowerCase().includes("cash"));
        });
        const bankTransfer = quotes.find((q) => {
          const p = providers.find((pr) => pr.slug === q.providerSlug);
          return p?.deliveryMethods.some((m) => m.toLowerCase().includes("bank"));
        });

        const categories = [
          { label: "Cheapest transfer", icon: "💰", provider: cheapest, reason: `Delivers the most ${toCurrency} for your money` },
          { label: "Fastest transfer", icon: "⚡", provider: fastest, reason: fastest ? `Delivers in ${fastest.transferSpeed}` : "" },
          { label: "Cash pickup", icon: "🏪", provider: cashPickup, reason: "Widest cash pickup network" },
          { label: "Bank transfer", icon: "🏦", provider: bankTransfer, reason: `Best rate for bank deposit to ${corridor.isCurrencyCorridor ? toCurrency : corridor.toCountry}` },
        ].filter((c) => c.provider);

        return (
          <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Best provider for each transfer type
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                Different providers excel at different things. Here&apos;s who&apos;s best for each use case on the {headingFrom} to {headingTo} route.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const name = getProviderName(cat.provider!.providerSlug);
                  const provider = providers.find((p) => p.slug === cat.provider!.providerSlug);
                  const logo = provider?.logo || `/logos/${cat.provider!.providerSlug}.png`;
                  return (
                    <div key={cat.label} className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-5">
                      <div className="text-[24px] mb-2">{cat.icon}</div>
                      <p className="text-[12px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide mb-3">{cat.label}</p>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface)] flex items-center justify-center relative">
                          <Image src={logo} alt={name} width={32} height={32} className="object-cover" />
                        </div>
                        <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{name}</p>
                      </div>
                      <p className="text-[12px] text-[var(--color-on-surface-variant)]">{cat.reason}</p>
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── How to Send Money ─── */}
      {countryDetails && (
        <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
          <Container>
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
              How to send money to {corridor.toCountry}
            </h2>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
              Sending money to {corridor.toCountry} is straightforward with the right provider. Here&apos;s how it works in 3 simple steps.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { step: 1, title: "Enter your transfer details", description: `Choose how much ${fromCurrency} you want to send, compare providers above, and pick the one offering the best ${toCurrency} amount for your transfer to ${corridor.toCountry}.`, icon: "📝" },
                { step: 2, title: "Add your recipient", description: `Enter your recipient's details in ${corridor.toCountry}${countryDetails.recipientRequirements[1] ? ` — you'll need their ${countryDetails.recipientRequirements[1].label.toLowerCase()}` : ""}. Most providers verify details instantly.`, icon: "👤" },
                { step: 3, title: "Send & track your transfer", description: `Pay using bank transfer, debit card, or credit card. Track your money in real-time until it arrives${countryDetails.deliveryMethods[0] ? ` — ${countryDetails.deliveryMethods[0].method.toLowerCase()} typically takes ${countryDetails.deliveryMethods[0].speed.toLowerCase()}` : ""}.`, icon: "🚀" },
              ].map((s) => (
                <div key={s.step} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[24px]">{s.icon}</span>
                    <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-medium flex items-center justify-center">{s.step}</span>
                  </div>
                  <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-2">{s.title}</h3>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── What You Need (Recipient Requirements) ─── */}
      {countryDetails && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                What you need to send money to {corridor.toCountry}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                Make sure you have these details from your recipient before starting your transfer.
              </p>
              <div className="space-y-3">
                {countryDetails.recipientRequirements.map((req) => (
                  <div key={req.label} className="flex items-start gap-3 bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${req.required ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-outline)] text-[var(--color-on-surface-variant)]"}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{req.label}</p>
                        {!req.required && (
                          <span className="text-[10px] font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">Optional</span>
                        )}
                      </div>
                      <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-0.5 leading-relaxed">{req.description}</p>
                      {req.example && (
                        <p className="text-[12px] text-[var(--color-primary)] mt-1 font-mono">Example: {req.example}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {countryDetails.requirementsNote && (
                <div className="mt-4 bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20 rounded-lg px-5 py-4">
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                    <strong className="text-[var(--color-on-surface)]">Note:</strong> {countryDetails.requirementsNote}
                  </p>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ─── Transfer Examples ─── */}
      {(() => {
        const exampleAmounts = [500, 1000, 5000];
        const exampleData = exampleAmounts.map((amt) => ({
          amount: amt,
          quotes: generateQuotes(amt, fromCurrency, toCurrency).slice(0, 6),
        }));

        return (
          <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Transfer examples: {fromCurrency} to {toCurrency}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                See how much your recipient would get for common transfer amounts.
              </p>
              <div className="space-y-6">
                {exampleData.map(({ amount, quotes: exQuotes }) => (
                  <div key={amount}>
                    <h3 className="text-[16px] font-medium text-[var(--color-on-surface)] mb-3">
                      Send {sendSymbol}{amount.toLocaleString()}
                    </h3>
                    {exQuotes.length > 0 ? (
                      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                        <div className="grid grid-cols-[1fr_80px_80px_100px_100px] gap-2 px-4 sm:px-5 py-2.5 bg-[var(--color-surface-container)] text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                          <span>Provider</span>
                          <span className="text-right">Fee</span>
                          <span className="text-right">Rate</span>
                          <span className="text-right">Receives</span>
                          <span className="text-right">Speed</span>
                        </div>
                        {exQuotes.map((q, i) => (
                          <div
                            key={q.providerSlug}
                            className={`grid grid-cols-[1fr_80px_80px_100px_100px] gap-2 items-center px-4 sm:px-5 py-2.5 border-t border-[var(--color-outline)] ${i === 0 ? "bg-[var(--color-success-surface-dim)]" : ""}`}
                          >
                            <span className={`text-[13px] font-medium truncate ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                              {getProviderName(q.providerSlug)}
                            </span>
                            <span className="text-[13px] text-[var(--color-on-surface)] text-right tabular-nums">
                              {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                            </span>
                            <span className="text-[13px] text-[var(--color-on-surface)] text-right tabular-nums">
                              {q.exchangeRate.toFixed(2)}
                            </span>
                            <span className={`text-[13px] font-medium text-right tabular-nums ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                              {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-[11px] text-[var(--color-on-surface-variant)] text-right">
                              {q.transferSpeed}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-[var(--color-on-surface-variant)]">No quotes available.</p>
                    )}
                  </div>
                ))}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── Fees Explanation ─── */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-4">
              {isCurrencyCorridor ? `Fees for ${fromCurrency} to ${toCurrency} transfers` : `Fees for sending money from ${corridor.fromCountry} to ${corridor.toCountry}`}
            </h2>
            <div className="text-[14px] md:text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
              <p>{corridor.feesNote}</p>
              <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-5">
                <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-3">Understanding the total cost</h3>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-3">
                  The true cost of a money transfer has two components:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--color-on-surface)]">Transfer fee</p>
                      <p className="text-[12px] text-[var(--color-on-surface-variant)]">
                        The upfront charge — typically {sendSymbol}0–{sendSymbol}10 with specialist providers.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--color-on-surface)]">Exchange rate markup</p>
                      <p className="text-[12px] text-[var(--color-on-surface-variant)]">
                        The hidden cost — the difference between the provider&apos;s rate and the mid-market rate ({midRate.toFixed(4)}).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Ways to Send Money ─── */}
      {countryDetails && (() => {
        // Aggregate payment methods from providers serving this corridor
        const paymentMethodMap = new Map<string, { speed: string; costLevel: "low" | "medium" | "high"; note: string }>();
        const methodDefaults: Record<string, { speed: string; costLevel: "low" | "medium" | "high"; note: string }> = {
          "Bank Transfer": { speed: "1–3 business days", costLevel: "low", note: "Usually the cheapest option — lowest fees and no card processing charges" },
          "Debit Card": { speed: "Minutes to hours", costLevel: "medium", note: "Fast and convenient — small card processing fee applies" },
          "Credit Card": { speed: "Minutes to hours", costLevel: "high", note: "Fastest option but highest fees — card issuer may charge cash advance fee" },
          "Apple Pay": { speed: "Minutes to hours", costLevel: "medium", note: "Convenient mobile payment — linked card fees apply" },
          "Google Pay": { speed: "Minutes to hours", costLevel: "medium", note: "Convenient mobile payment — linked card fees apply" },
          "Cash": { speed: "Varies", costLevel: "medium", note: "Pay cash at an agent location — available at select providers" },
        };
        quotes.forEach((q) => {
          const p = providers.find((pr) => pr.slug === q.providerSlug);
          p?.paymentMethods.forEach((m) => {
            if (!paymentMethodMap.has(m) && methodDefaults[m]) {
              paymentMethodMap.set(m, methodDefaults[m]);
            }
          });
        });
        const paymentMethods = Array.from(paymentMethodMap.entries());
        if (paymentMethods.length === 0) return null;

        const costColors = { low: "text-[var(--color-success-dark)] bg-[var(--color-success-surface)]", medium: "text-[#b45309] bg-[#fef3c7]", high: "text-[#dc2626] bg-[#fef2f2]" };
        const costLabels = { low: "Low cost", medium: "Medium cost", high: "Higher cost" };

        return (
          <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Ways to send money to {corridor.toCountry}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                Choose how you want to pay for your transfer. Each payment method has different costs and speeds.
              </p>
              {countryDetails.receivingNote && (
                <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">{countryDetails.receivingNote}</p>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map(([method, info]) => (
                  <div key={method} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[15px] font-medium text-[var(--color-on-surface)]">{method}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${costColors[info.costLevel]}`}>
                        {costLabels[info.costLevel]}
                      </span>
                    </div>
                    <p className="text-[12px] text-[var(--color-on-surface-variant)] mb-2">
                      <span className="font-medium text-[var(--color-on-surface)]">Speed:</span> {info.speed}
                    </p>
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">{info.note}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── How to Receive Money ─── */}
      {countryDetails && countryDetails.deliveryMethods.length > 0 && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
              How to receive money in {corridor.toCountry}
            </h2>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
              Your recipient in {corridor.toCountry} can receive money through these delivery methods. The best option depends on their location and preferences.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {countryDetails.deliveryMethods.map((dm) => (
                <div key={dm.method} className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[18px]">
                      {dm.method.toLowerCase().includes("bank") ? "🏦" :
                       dm.method.toLowerCase().includes("cash") ? "💵" :
                       dm.method.toLowerCase().includes("wallet") || dm.method.toLowerCase().includes("pesa") || dm.method.toLowerCase().includes("jazz") || dm.method.toLowerCase().includes("gcash") || dm.method.toLowerCase().includes("easy") || dm.method.toLowerCase().includes("dana") || dm.method.toLowerCase().includes("ovo") || dm.method.toLowerCase().includes("pix") || dm.method.toLowerCase().includes("nequi") || dm.method.toLowerCase().includes("alipay") || dm.method.toLowerCase().includes("wechat") ? "📱" :
                       dm.method.toLowerCase().includes("home") || dm.method.toLowerCase().includes("door") ? "🏠" :
                       dm.method.toLowerCase().includes("sepa") ? "🇪🇺" :
                       dm.method.toLowerCase().includes("airtime") ? "📶" :
                       dm.method.toLowerCase().includes("faster") ? "⚡" : "💸"}
                    </span>
                    <h3 className="text-[15px] font-medium text-[var(--color-on-surface)]">{dm.method}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                      {dm.speed}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed mb-3">{dm.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dm.providers.slice(0, 4).map((pSlug) => (
                      <span key={pSlug} className="text-[11px] text-[var(--color-on-surface-variant)] bg-[var(--color-surface)] border border-[var(--color-outline)] px-2 py-0.5 rounded">
                        {getProviderName(pSlug)}
                      </span>
                    ))}
                    {dm.providers.length > 4 && (
                      <span className="text-[11px] text-[var(--color-on-surface-variant)] px-1">
                        +{dm.providers.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── Bank & Broker Rates ─── */}
      {hasBankRates(fromCurrency, toCurrency) && (() => {
        const bankRates = getBankRates(fromCurrency, toCurrency, sampleAmount);
        const sourceUrl = getBankRatesSourceUrl(fromCurrency, toCurrency, sampleAmount);
        if (bankRates.length === 0) return null;

        const bestBank = bankRates[0];
        const worstBank = bankRates[bankRates.length - 1];
        const bankSpread = bestBank.receiveAmount - worstBank.receiveAmount;

        return (
          <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Bank transfer rates: {fromCurrency} to {toCurrency}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                How do traditional banks and brokers compare for a {sendSymbol}{sampleAmount.toLocaleString()} {fromCurrency} to {toCurrency} transfer?
                {best && bestBank && best.receiveAmount > bestBank.receiveAmount && (
                  <> The best specialist provider above delivers <strong className="text-[var(--color-on-surface)]">{receiveSymbol}{(best.receiveAmount - bestBank.receiveAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> more than the top bank rate.</>
                )}
              </p>

              <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                {bankRates.map((br, i) => {
                  const isBestBank = i === 0;
                  return (
                    <div
                      key={br.providerSlug}
                      className={`px-3 sm:px-6 py-3 sm:py-4 ${isBestBank ? "bg-[var(--color-success-surface-dim)] border-b-2 border-[var(--color-success-dark)]/20" : "bg-[var(--color-surface)] border-b border-[var(--color-outline)] last:border-b-0"}`}
                    >
                      {/* Desktop layout */}
                      <div className="hidden sm:flex items-center gap-5">
                        <span className={`text-[13px] font-semibold tabular-nums w-5 text-center shrink-0 ${isBestBank ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {i + 1}
                        </span>

                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[14px] font-semibold text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50">
                          {br.provider.charAt(0)}
                        </div>

                        <div className="min-w-[140px] shrink-0">
                          <p className={`text-[14px] font-medium text-[var(--color-on-surface)] ${isBestBank ? "text-[15px]" : ""}`}>
                            {br.provider}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-semibold tracking-wide uppercase px-1.5 py-px rounded ${br.providerType === "BANK" ? "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)]" : "text-[var(--color-primary)] bg-[var(--color-primary-surface)]"}`}>
                              {br.providerType === "BANK" ? "Bank" : "Broker"}
                            </span>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-6 flex-1 min-w-0">
                          <div className="w-[110px] shrink-0">
                            <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Speed</p>
                            <p className="text-[13px] text-[var(--color-on-surface)] mt-0.5">{br.deliveryEstimate || "1-3 days"}</p>
                          </div>
                          <div className="w-[80px] shrink-0">
                            <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Fee</p>
                            <p className={`text-[13px] mt-0.5 ${br.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                              {br.fee === 0 ? "Free" : `${sendSymbol}${br.fee.toFixed(2)}`}
                            </p>
                          </div>
                          <div className="w-[90px] shrink-0">
                            <p className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Rate</p>
                            <p className="text-[13px] text-[var(--color-on-surface)] mt-0.5 tabular-nums">{br.exchangeRate.toFixed(4)}</p>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0" />

                        <div className="text-right shrink-0">
                          <p className={`tabular-nums font-semibold tracking-tight ${isBestBank ? "text-[22px] sm:text-[24px] text-[var(--color-success-dark)]" : "text-[18px] sm:text-[20px] text-[var(--color-on-surface)]"}`}>
                            {receiveSymbol}{br.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">Recipient gets</p>
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="flex sm:hidden items-start gap-3">
                        <span className={`text-[12px] font-semibold tabular-nums w-4 text-center mt-1 shrink-0 ${isBestBank ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {i + 1}
                        </span>
                        <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-dim)] flex items-center justify-center text-[13px] font-semibold text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50">
                          {br.provider.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[14px] font-medium text-[var(--color-on-surface)] truncate">{br.provider}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-semibold tracking-wide uppercase px-1.5 py-px rounded ${br.providerType === "BANK" ? "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)]" : "text-[var(--color-primary)] bg-[var(--color-primary-surface)]"}`}>
                                  {br.providerType === "BANK" ? "Bank" : "Broker"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`tabular-nums font-semibold tracking-tight ${isBestBank ? "text-[18px] text-[var(--color-success-dark)]" : "text-[16px] text-[var(--color-on-surface)]"}`}>
                                {receiveSymbol}{br.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[var(--color-on-surface-variant)]">
                            <span>{br.deliveryEstimate || "1-3 days"}</span>
                            <span className="w-px h-3 bg-[var(--color-outline)]" />
                            <span className={br.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : ""}>{br.fee === 0 ? "Free" : `${sendSymbol}${br.fee.toFixed(2)}`} fee</span>
                            <span className="w-px h-3 bg-[var(--color-outline)]" />
                            <span className="tabular-nums">{br.exchangeRate.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {bankSpread > 0 && (
                <div className="mt-4 bg-[var(--color-success-surface)] border border-[var(--color-success-dark)]/20 rounded-lg px-5 py-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--color-success-dark)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-[14px] text-[var(--color-success-dark)]">
                    Even among banks, the difference is significant — {bankRates[0].provider} delivers{" "}
                    <strong>
                      {receiveSymbol}{bankSpread.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>{" "}
                    more than {bankRates[bankRates.length - 1].provider} on a {sendSymbol}{sampleAmount.toLocaleString()} transfer.
                  </p>
                </div>
              )}

              {sourceUrl && (
                <p className="mt-4 text-[12px] text-[var(--color-on-surface-variant)]">
                  Bank rates sourced from{" "}
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    ExchangeRates.org.uk
                  </a>
                  . Rates are indicative and updated daily.
                </p>
              )}
            </Container>
          </section>
        );
      })()}

      {/* ─── Transfer Limits & Regulations ─── */}
      {countryDetails && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Transfer limits &amp; regulations for {corridor.toCountry}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                Important rules and requirements to know before sending money to {corridor.toCountry}.
              </p>

              <div className="space-y-5">
                {countryDetails.regulations.regulatoryBody && (
                  <div className="flex items-start gap-3">
                    <span className="text-[18px] mt-0.5">🏛️</span>
                    <div>
                      <p className="text-[14px] font-medium text-[var(--color-on-surface)]">Regulatory body</p>
                      <p className="text-[13px] text-[var(--color-on-surface-variant)]">{countryDetails.regulations.regulatoryBody}</p>
                    </div>
                  </div>
                )}

                {countryDetails.regulations.inboundLimit && (
                  <div className="flex items-start gap-3">
                    <span className="text-[18px] mt-0.5">📊</span>
                    <div>
                      <p className="text-[14px] font-medium text-[var(--color-on-surface)]">Inbound transfer limits</p>
                      <p className="text-[13px] text-[var(--color-on-surface-variant)]">{countryDetails.regulations.inboundLimit}</p>
                    </div>
                  </div>
                )}

                {countryDetails.regulations.documentationNeeded.length > 0 && (
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-[18px] mt-0.5">📋</span>
                      <p className="text-[14px] font-medium text-[var(--color-on-surface)]">Documentation you may need</p>
                    </div>
                    <ul className="space-y-2 pl-9">
                      {countryDetails.regulations.documentationNeeded.map((doc) => (
                        <li key={doc} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {countryDetails.regulations.importantNotes.length > 0 && (
                  <div className="bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20 rounded-xl p-5 mt-4">
                    <h3 className="text-[14px] font-medium text-[var(--color-on-surface)] mb-3">Important things to know</h3>
                    <ul className="space-y-2">
                      {countryDetails.regulations.importantNotes.map((note) => (
                        <li key={note} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 mt-1.5" />
                          <span className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Delivery Times ─── */}
      <section className="py-10 bg-[var(--color-surface-dim)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-4">
              {isCurrencyCorridor ? `How long does a ${fromCurrency} to ${toCurrency} transfer take?` : `How long does it take to send money to ${corridor.toCountry}?`}
            </h2>
            <p className="text-[14px] md:text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
              {corridor.deliveryNote}
            </p>

            {(fastProviders.length > 0 || standardProviders.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {fastProviders.length > 0 && (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] text-[var(--color-success)] border border-[var(--color-success)] rounded px-1.5 py-0 leading-[18px] font-medium">Fast</span>
                      <span className="text-[13px] font-medium text-[var(--color-on-surface)]">Express delivery</span>
                    </div>
                    <ul className="space-y-2">
                      {fastProviders.slice(0, 5).map((q) => (
                        <li key={q.providerSlug} className="flex justify-between text-[13px]">
                          <span className="text-[var(--color-on-surface)]">{getProviderName(q.providerSlug)}</span>
                          <span className="text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {standardProviders.length > 0 && (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[13px] font-medium text-[var(--color-on-surface)]">Standard delivery</span>
                    </div>
                    <ul className="space-y-2">
                      {standardProviders.slice(0, 5).map((q) => (
                        <li key={q.providerSlug} className="flex justify-between text-[13px]">
                          <span className="text-[var(--color-on-surface)]">{getProviderName(q.providerSlug)}</span>
                          <span className="text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ─── Popular Banks ─── */}
      {countryDetails && countryDetails.popularBanks.length > 0 && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Popular banks in {corridor.toCountry}
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                These are the most commonly used banks for receiving international transfers in {corridor.toCountry}.
              </p>
              <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_140px_1fr] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                  <span>Bank</span>
                  <span>SWIFT/BIC</span>
                  <span className="hidden sm:block">Notes</span>
                </div>
                {countryDetails.popularBanks.map((bank) => (
                  <div key={bank.name} className="grid grid-cols-[1fr_140px_1fr] gap-2 items-center px-4 sm:px-6 py-3 border-t border-[var(--color-outline)]">
                    <p className="text-[13px] font-medium text-[var(--color-on-surface)]">{bank.name}</p>
                    <p className="text-[12px] font-mono text-[var(--color-on-surface-variant)]">{bank.swiftCode || "—"}</p>
                    <p className="text-[12px] text-[var(--color-on-surface-variant)] hidden sm:block">{bank.notes || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── FAQ ─── */}
      <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-6">
              Frequently asked questions: {headingFrom} to {headingTo} transfers
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {corridor.faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-[15px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Send from Specific Countries (country pages only) ─── */}
      {isCountryPage && (() => {
        const relatedCorridors = allCorridors
          .filter((c) => !c.isCurrencyCorridor && !c.isCountryPage && c.toCountry === corridor.toCountry)
          .slice(0, 8);
        if (relatedCorridors.length === 0) return null;
        return (
          <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-[22px] md:text-[28px] font-normal text-[var(--color-on-surface)] mb-2">
                Send money to {corridor.toCountry} from these countries
              </h2>
              <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
                Compare providers for your specific sending country to get the most accurate rates and fees.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {relatedCorridors.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/send-money/${c.slug}`}
                    className="flex items-center gap-3 bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-4 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors"
                  >
                    <CircleFlag code={c.fromCurrency} size={24} />
                    <div>
                      <p className="text-[13px] font-medium text-[var(--color-on-surface)]">{c.fromCountry}</p>
                      <p className="text-[11px] text-[var(--color-on-surface-variant)]">{c.fromCurrency} → {toCurrency}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── Country guide banner (shown on corridor pages, links to country hub) ─── */}
      {!isCountryPage && !isCurrencyCorridor && (() => {
        const countrySlug = corridor.toCountry
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        const countryPageSlug = `send-money-to-${countrySlug}`;
        const countryPageExists = allCorridors.some((c) => c.slug === countryPageSlug);
        if (!countryPageExists) return null;
        return (
          <section className="py-6 bg-[var(--color-primary-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl">
                <div>
                  <p className="text-[14px] font-medium text-[var(--color-on-surface)]">
                    Everything about sending money to {corridor.toCountry}
                  </p>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-0.5">
                    Recipient requirements, delivery methods, regulations, popular banks, and more.
                  </p>
                </div>
                <Link
                  href={`/send-money/${countryPageSlug}`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
                >
                  {corridor.toFlag} {corridor.toCountry} guide →
                </Link>
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── Cross-links ─── */}
      <CrossLinks
        background="white"
        sections={[
          {
            title: "Related corridors",
            links: popularCorridors
              .filter((c) => c.from !== fromCurrency || c.to !== toCurrency)
              .slice(0, 5)
              .map((c) => {
                const seoSlug = getCorridorSlug(c.from, c.to);
                return {
                  href: seoSlug ? `/send-money/${seoSlug}` : `/send-money?from=${c.from}&to=${c.to}&amount=1000`,
                  label: c.label,
                };
              }),
          },
          {
            title: "Top provider reviews",
            links: quotes.slice(0, 5).map((q) => ({
              href: `/companies/${q.providerSlug}`,
              label: `${getProviderName(q.providerSlug)} review`,
            })),
          },
          {
            title: "Useful guides",
            links: [
              { href: "/guides/how-to-send-money-abroad", label: "How to send money abroad" },
              { href: "/guides/cheapest-way-to-send-money-internationally", label: "Cheapest way to send money" },
              { href: "/guides/exchange-rate-markup-explained", label: "Exchange rates explained" },
              { href: "/compare", label: "Head-to-head provider comparisons" },
            ],
          },
        ]}
      />

      {/* ─── CTA ─── */}
      <section className="py-12 bg-[var(--color-surface-dim)]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <h2 className="text-[22px] font-normal text-[var(--color-on-surface)] mb-3">
            Compare all providers for {headingFrom} to {headingTo}
          </h2>
          <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-6">
            Enter your exact amount to see personalised quotes from every provider on this route.
          </p>
          <PrimaryButton href={`/send-money?from=${fromCurrency}&to=${toCurrency}&amount=${sampleAmount}`} size="lg">
            Compare providers now
          </PrimaryButton>
        </div>
      </section>

      {/* BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
              { "@type": "ListItem", position: 2, name: "Send Money", item: "https://sendmoneycompare.com/send-money" },
              { "@type": "ListItem", position: 3, name: `${headingFrom} to ${headingTo}`, item: `https://sendmoneycompare.com/send-money/${slug}` },
            ],
          }),
        }}
      />
      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: corridor.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
      {/* ExchangeRateSpecification structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ExchangeRateSpecification",
            currency: fromCurrency,
            currentExchangeRate: {
              "@type": "UnitPriceSpecification",
              price: midRate,
              priceCurrency: toCurrency,
              unitText: `1 ${fromCurrency}`,
            },
            ...(best && {
              exchangeRateSpread: ((midRate - best.exchangeRate) / midRate * 100).toFixed(2) + "%",
            }),
          }),
        }}
      />
      {/* Provider offers structured data */}
      {quotes.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              name: `${fromCurrency} to ${toCurrency} Money Transfer`,
              description: `Compare ${fromCurrency} to ${toCurrency} exchange rates from ${quotes.length} providers. Best rate: ${best?.exchangeRate.toFixed(4)} from ${best ? getProviderName(best.providerSlug) : ""}`,
              url: `https://sendmoneycompare.com/send-money/${slug}`,
              offers: quotes.slice(0, 5).map((q) => ({
                "@type": "Offer",
                name: `${getProviderName(q.providerSlug)} — ${fromCurrency} to ${toCurrency}`,
                offeredBy: {
                  "@type": "Organization",
                  name: getProviderName(q.providerSlug),
                },
                price: q.fee,
                priceCurrency: fromCurrency,
                description: `Exchange rate: ${q.exchangeRate.toFixed(4)}, Recipient gets: ${receiveSymbol}${q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, Speed: ${q.transferSpeed}`,
              })),
            }),
          }}
        />
      )}
      {/* ItemList structured data — ranked provider list for this corridor */}
      {quotes.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `Best Ways to Send Money ${corridor.fromCountry ? `from ${corridor.fromCountry} ` : ""}to ${corridor.toCountry || toCurrency} ${new Date().getFullYear()}`,
              itemListOrder: "https://schema.org/ItemListOrderDescending",
              numberOfItems: Math.min(quotes.length, 10),
              itemListElement: quotes.slice(0, 10).map((q, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: getProviderName(q.providerSlug),
                url: `https://sendmoneycompare.com/companies/${q.providerSlug}`,
              })),
            }),
          }}
        />
      )}
    </>
  );
}
