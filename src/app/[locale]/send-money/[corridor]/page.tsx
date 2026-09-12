import Link from "next/link";
import { corridorComparisonSummary } from "@/lib/corridor-comparison-summary";
import { quoteFreshness } from "@/lib/quote-freshness";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  PiggyBank,
  Zap,
  Store,
  Landmark,
  Smartphone,
  Banknote,
  Home,
  Radio,
  Send,
  ClipboardList,
  UserPlus,
  Rocket,
  BadgeCheck,
  BarChart3,
  FileText,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/Container";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import ComparisonWidget from "@/components/ComparisonWidget";
import CorridorHero from "@/components/CorridorHero";
import RatingBadge from "@/components/RatingBadge";
import { getGoUrl } from "@/lib/affiliate";
import ProviderLink from "@/components/ProviderLink";
import CrossLinks from "@/components/CrossLinks";
import WhatsAppInlineCTA from "@/components/WhatsAppInlineCTA";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import MobileDetailsRail from "@/components/MobileDetailsRail";

// Revalidate every 6 hours — matches scraper cadence
export const revalidate = 21600;
import CircleFlag from "@/components/CircleFlag";
import {
  providers,
  getProviderName,
  getExchangeRate,
  currencies,
  popularCorridors,
} from "@/data/providers";
import { generateQuotes } from "@/lib/quotes-engine";
import { tiedAboveLargerPayout } from "@/lib/rank-quotes";
import TiedNote from "@/components/TiedNote";
import { getBankRates, hasBankRates, getBankRatesSourceUrl } from "@/lib/bank-rates";
import { allCorridors, getCorridor, getCorridorSlug } from "@/data/corridors";
import { SITEMAP_CORRIDOR_SLUGS } from "@/lib/sitemap-allowlists";
import { swedishCorridorBlocks } from "@/data/sweden-content";
import { corridorDeepBlocks } from "@/data/corridor-deep-content";
import { getCountryDetails } from "@/data/corridor-details";
import { getAlternates, DEFAULT_OG_IMAGES } from "@/lib/i18n-metadata";
import type { Metadata } from "next";
import { fitTitle, seoDescription } from "@/lib/seo-title";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRateInsight, getProviderInsight } from "@/lib/rate-history";
import type { ProviderBadge } from "@/lib/rate-history";
import { ProviderBadgeTag, Sparkline, RateHistorySection, ProviderRateInsightLine } from "@/components/RateInsight";
import SendScoreCard from "@/components/SendScoreCard";
import StickyBestCTA from "@/components/StickyBestCTA";
import { providerLogo } from "@/lib/provider-logo";
import CryptoRailSection from "@/components/CryptoRailSection";

interface Props {
  params: Promise<{ corridor: string; locale: string }>;
}

import { corridorEditorialNotes } from "@/data/corridor-editorial-notes";

import { shouldNoindex, getCorridorTier } from "@/lib/corridor-tiers";
import { RANKING_CORRIDOR_SLUGS } from "@/lib/ranking-corridors";
import { corridorPageRenders, companyPageRenders, rateHistoryHref } from "@/lib/route-map";
import { GONE_CORRIDOR_SLUGS } from "@/lib/gone-corridors";
import { HEAD_CORRIDOR_SLUGS } from "@/lib/head-corridors";
import { SITE_STATS } from "@/lib/site-stats";
import { formatLocalDate } from "@/lib/format-date";

// ── Static generation ──
// Only pre-render corridors with real data (Tier 1 & 2).
// Tier 3 (zero quotes, non-editorial) returns 404 at runtime.

// dynamicParams=false: any slug outside generateStaticParams (i.e. every Tier-3
// corridor) is a real 404 rather than being rendered on demand.
//
// This route had no setting, so it defaulted to true and the entire Tier-3 tail —
// 7,346 corridors of the 8,574 defined — could be materialised by any crawler
// hitting the URL. The June 2026 pruning set the guardrail explicitly: "new
// combinatorial routes must be allowlisted not on-demand-ISR". /compare/[slug] and
// /guides/[slug] both honour it; this route was the last one that did not, and it
// is the largest combinatorial space on the site.
//
// Tier 1 and 2 are still built and served (Tier 2 noindexed unless allowlisted),
// so nothing with real comparison data 404s — only the 0-1 provider shells.
export const dynamicParams = false;

export function generateStaticParams() {
  return allCorridors
    .filter((c) => !GONE_CORRIDOR_SLUGS.has(c.slug))
    .filter(
      (c) =>
        getCorridorTier(c.slug, c.fromCurrency, c.toCurrency, c.isCountryPage) <= 2 ||
        // Corridors rescued on Sep 1 because they RANK (positions 3.0-8.8) are
        // Tier 3 by provider count, so this filter excluded them — and with
        // dynamicParams=false that meant no prerender at all. They shipped a
        // content-free 200 shell ("Loading..." + chrome, no <h1>): a soft 404 at
        // position 3, which is worse than the hard 404 the rescue replaced.
        RANKING_CORRIDOR_SLUGS.has(c.slug),
    )
    .map((c) => ({ corridor: c.slug }));
}

// Corridor → most relevant news article. Drives the "In the news" callout
// shown under the editorial note. Keep this list short and timely.
const corridorRelatedNews: Record<string, { slug: string; label: string }> = {
  "uk-to-pakistan": {
    slug: "pakistan-record-41-billion-remittance-2026",
    label: "Pakistan hits record $41B remittance year — cheapest way to send GBP to PKR",
  },
  "usa-to-pakistan": {
    slug: "pakistan-record-41-billion-remittance-2026",
    label: "Pakistan hits record $41B remittance year (Apr 2026)",
  },
  "uk-to-india": {
    slug: "inr-weakest-year-send-money-india-april-2026",
    label: "April 2026 analysis: INR at 92.98/USD and transfer timing",
  },
  "usa-to-india": {
    slug: "inr-weakest-year-send-money-india-april-2026",
    label: "April 2026 analysis: INR at 92.98/USD and transfer timing",
  },
  "canada-to-india": {
    slug: "inr-weakest-year-send-money-india-april-2026",
    label: "INR weakest in a year — decision framework for USD/GBP/CAD → INR",
  },
  "australia-to-india": {
    slug: "inr-weakest-year-send-money-india-april-2026",
    label: "INR weakest in a year — decision framework for AUD → INR",
  },
  "uk-to-nigeria": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
  "uk-to-kenya": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
  "uk-to-ghana": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
  "usa-to-nigeria": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
  "usa-to-kenya": {
    slug: "revolut-africa-14-corridors-airtel-mtn-orange-money-2026",
    label: "Revolut adds 14 new Africa corridors — Airtel, MTN, Orange Money",
  },
};

const corridorSeoOverrides: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; keywords: string }> = {
  "usa-to-pakistan": {
    title: "Cheapest Way to Send Money USA to Pakistan — USD→PKR Rates (2026)",
    description:
      "Compare USD to PKR provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    ogTitle: "USA→Pakistan: Who Gives the Best USD→PKR Rate?",
    ogDescription:
      "Compare USD to PKR provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    keywords:
      "send money USA to Pakistan, USD to PKR, cheapest way to send money to Pakistan, money transfer Pakistan, remittance to Pakistan, USD PKR exchange rate",
  },
  "usa-to-india": {
    title: "Cheapest Way to Send Money USA to India — USD→INR Rates (2026)",
    description:
      "Compare USD to INR provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    ogTitle: "USA→India: Who Gives the Best USD→INR Rate?",
    ogDescription:
      "Compare USD to INR provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    keywords:
      "send money USA to India, USD to INR, cheapest way to send money to India, money transfer India, remittance to India, USD INR exchange rate",
  },
  "usa-to-mexico": {
    title: "Cheapest Way to Send Money USA to Mexico — USD→MXN Rates (2026)",
    description:
      "USD to MXN rates from Wise, Remitly, Xoom & more — SPEI instant deposits available. Compare fees and total cost from 15+ providers.",
    ogTitle: "USA→Mexico: Who Gives the Best USD→MXN Rate?",
    ogDescription:
      "Compare USD to MXN rates from 15+ providers. Find the cheapest way to send money from USA to Mexico with SPEI instant delivery.",
    keywords:
      "send money USA to Mexico, USD to MXN, cheapest way to send money to Mexico, money transfer Mexico, remittance to Mexico, USD MXN exchange rate, SPEI transfer, Oxxo cash pickup",
  },
  "usa-to-philippines": {
    title: "Cheapest Way to Send Money USA to Philippines — USD→PHP Rates (2026)",
    description:
      "Compare USD to PHP provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    ogTitle: "USA→Philippines: Who Gives the Best USD→PHP Rate?",
    ogDescription:
      "Compare USD to PHP provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    keywords:
      "send money USA to Philippines, USD to PHP, cheapest way to send money to Philippines, money transfer Philippines, remittance to Philippines, GCash transfer, USD PHP exchange rate",
  },
  "uk-to-europe": {
    title: "Cheapest Way to Send Money UK to Europe — GBP→EUR Rates (2026)",
    description:
      "GBP to EUR rates from Wise, Revolut & 10+ providers. SEPA transfers with fees from 0%. Compare real-time rates — updated every 6 hours.",
    ogTitle: "UK→Europe: Who Gives the Best GBP→EUR Rate?",
    ogDescription:
      "Compare GBP to EUR rates from 15+ providers. Find the cheapest SEPA transfer from UK to Europe with the lowest fees.",
    keywords:
      "send money UK to Europe, GBP to EUR, cheapest way to send money to Europe, SEPA transfer from UK, money transfer Europe, GBP EUR exchange rate, post-Brexit transfers",
  },
  "uk-to-india": {
    title: "Cheapest Way to Send Money UK to India — GBP→INR Rates (2026)",
    description:
      "Compare GBP to INR provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    ogTitle: "UK→India: Who Gives the Best GBP→INR Rate?",
    ogDescription:
      "Compare GBP to INR provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    keywords:
      "send money UK to India, send money from UK to India, money transfer UK to India, money to India from UK, best money transfer to India from UK, cheapest way to send money to India from UK, transfer money from UK to India, wire transfer from UK to India, GBP to INR, sending money from UK to India, how to send money from UK to India, best way to transfer money from UK to India, online money transfer from UK to India",
  },
  "canada-to-india": {
    title: "Cheapest Way to Send Money Canada to India — CAD→INR Rates (2026)",
    description:
      "CAD to INR rates from Wise, Remitly, WorldRemit & more. Fund via Interac e-Transfer, IMPS delivery. See who gives the most rupees.",
    ogTitle: "Canada→India: Who Gives the Best CAD→INR Rate?",
    ogDescription:
      "Compare CAD to INR rates from 10+ providers. Find the cheapest way to send money from Canada to India with Interac funding.",
    keywords:
      "send money Canada to India, CAD to INR, cheapest way to send money to India from Canada, money transfer India, remittance to India, CAD INR exchange rate, Interac e-Transfer",
  },
  "australia-to-india": {
    title: "Cheapest Way to Send Money Australia to India — AUD→INR Rates (2026)",
    description:
      "AUD to INR rates from Wise, Instarem, Remitly & 10+ providers. PayID funding, IMPS instant delivery. Compare fees and total cost.",
    ogTitle: "Australia→India: Who Gives the Best AUD→INR Rate?",
    ogDescription:
      "Compare AUD to INR rates from 10+ providers. Find the cheapest way to send money from Australia to India with PayID funding.",
    keywords:
      "send money Australia to India, AUD to INR, cheapest way to send money to India from Australia, money transfer India, remittance to India, AUD INR exchange rate, POLi transfer, PayID",
  },
  "usa-to-nigeria": {
    title: "Cheapest Way to Send Money USA to Nigeria — USD→NGN Rates (2026)",
    description:
      "USD to NGN rates from Wise, Remitly, Lemfi & more. NGN rates vary 10%+ between providers — compare before you send. Updated every 6 hrs.",
    ogTitle: "USA→Nigeria: Who Gives the Best USD→NGN Rate?",
    ogDescription:
      "Compare real-time USD to NGN rates from 10+ providers. NGN rates vary by 10%+ — find the most naira for your dollar today.",
    keywords:
      "send money USA to Nigeria, USD to NGN, cheapest way to send money to Nigeria, money transfer Nigeria, remittance to Nigeria, USD NGN exchange rate, naira transfer, Lemfi Nigeria",
  },
  "usa-to-bangladesh": {
    title: "Cheapest Way to Send Money USA to Bangladesh — USD→BDT Rates (2026)",
    description:
      "USD to BDT rates from Remitly, Wise, ACE & 10+ providers. Direct bKash transfers — funds arrive in minutes. Compare fees and total cost.",
    ogTitle: "USA→Bangladesh: Who Gives the Best USD→BDT Rate?",
    ogDescription:
      "Compare USD to BDT rates from 10+ providers. Send directly to bKash in minutes. Find the most taka for your dollar today.",
    keywords:
      "send money USA to Bangladesh, USD to BDT, cheapest way to send money to Bangladesh, money transfer Bangladesh, remittance Bangladesh, bKash transfer from USA, USD BDT exchange rate, ACE Money Transfer Bangladesh",
  },
  "usa-to-europe": {
    title: "Cheapest Way to Send Money USA to Europe — USD→EUR Rates (2026)",
    description:
      "USD to EUR rates from Wise, OFX, XE & 10+ providers. SEPA delivery in 1 day. Save $40–$70 per transfer vs US bank wires.",
    ogTitle: "USA→Europe: Who Gives the Best USD→EUR Rate?",
    ogDescription:
      "Compare USD to EUR rates from 10+ providers. SEPA delivery in 1 business day. Save 80% versus bank wire transfers.",
    keywords:
      "send money USA to Europe, USD to EUR, cheapest way to send money to Europe, SEPA transfer from USA, money transfer Europe, USD EUR exchange rate, wire money to Europe, best way to send money to Europe from USA",
  },
  "uk-to-pakistan": {
    title: "Cheapest Way to Send Money UK to Pakistan — GBP→PKR Rates (2026)",
    description:
      "GBP to PKR rates from ACE, Wise, WorldRemit & Remitly. Direct JazzCash and Easypaisa delivery. Compare 10+ FCA-regulated providers.",
    ogTitle: "UK→Pakistan: Who Gives the Best GBP→PKR Rate?",
    ogDescription:
      "Compare GBP to PKR rates from 10+ providers. Send to JazzCash or Easypaisa in minutes. Find the most rupees per pound today.",
    keywords:
      "send money UK to Pakistan, GBP to PKR, cheapest way to send money to Pakistan from UK, money transfer Pakistan, JazzCash from UK, Easypaisa from UK, GBP PKR exchange rate, ACE Money Transfer Pakistan",
  },
  "uk-to-nigeria": {
    title: "Cheapest Way to Send Money UK to Nigeria — GBP→NGN Rates (2026)",
    description:
      "Compare GBP to NGN provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    ogTitle: "UK→Nigeria: Who Gives the Best GBP→NGN Rate?",
    ogDescription:
      "Compare GBP to NGN provider estimates, fees and recipient requirements. Check delivery options and final quotes for your transfer.",
    keywords:
      "send money UK to Nigeria, GBP to NGN, cheapest way to send money to Nigeria from UK, Lemfi UK Nigeria, money transfer Nigeria, GBP NGN exchange rate, naira exchange rate UK, remittance to Nigeria from UK",
  },
  "australia-to-philippines": {
    title: "Cheapest Way to Send Money Australia to Philippines — AUD→PHP Rates (2026)",
    description:
      "AUD to PHP rates from Instarem, Wise, Remitly & more. Direct GCash transfers available. Save A$50–A$80 per A$1,000 vs banks.",
    ogTitle: "Australia→Philippines: Who Gives the Best AUD→PHP Rate?",
    ogDescription:
      "Compare AUD to PHP rates from 10+ providers. Send to GCash in minutes. Instarem often beats global brands on this corridor.",
    keywords:
      "send money Australia to Philippines, AUD to PHP, cheapest way to send money to Philippines from Australia, GCash from Australia, Instarem AUD PHP, money transfer Philippines, AUD PHP exchange rate",
  },
  "usa-to-brazil": {
    title: "Cheapest Way to Send Money USA to Brazil — USD→BRL Rates (2026)",
    description:
      "USD to BRL rates from Wise, Remitly, Western Union & 10+ providers. PIX instant delivery. BRL volatile — compare before every send.",
    ogTitle: "USA→Brazil: Who Gives the Best USD→BRL Rate?",
    ogDescription:
      "Compare USD to BRL rates from 10+ providers. PIX delivery in seconds. Find the most reais per dollar today.",
    keywords:
      "send money USA to Brazil, USD to BRL, cheapest way to send money to Brazil, PIX transfer from USA, money transfer Brazil, USD BRL exchange rate, remittance to Brazil, reais transfer",
  },
  "usa-to-kenya": {
    title: "Cheapest Way to Send Money USA to Kenya — USD→KES Rates (2026)",
    description:
      "USD to KES rates from Sendwave, WorldRemit, Remitly & Wise. Direct M-Pesa in minutes. Sendwave charges zero fees for M-Pesa delivery.",
    ogTitle: "USA→Kenya: Who Gives the Best USD→KES Rate?",
    ogDescription:
      "Compare USD to KES rates from 10+ providers. Send to M-Pesa in minutes. Sendwave offers zero-fee M-Pesa transfers to Kenya.",
    keywords:
      "send money USA to Kenya, USD to KES, cheapest way to send money to Kenya, M-Pesa transfer from USA, Sendwave Kenya, WorldRemit Kenya, money transfer Kenya, USD KES exchange rate",
  },
  "canada-to-philippines": {
    title: "Cheapest Way to Send Money Canada to Philippines — CAD→PHP Rates (2026)",
    description:
      "CAD to PHP rates from Remitly, Wise, Instarem & more. GCash delivery via Interac e-Transfer. Save C$60–C$100 vs Canadian banks.",
    ogTitle: "Canada→Philippines: Who Gives the Best CAD→PHP Rate?",
    ogDescription:
      "Compare CAD to PHP rates from 10+ providers. Fund via Interac e-Transfer, send to GCash in minutes. Find the best rate today.",
    keywords:
      "send money Canada to Philippines, CAD to PHP, cheapest way to send money to Philippines from Canada, GCash from Canada, Interac transfer Philippines, Instarem CAD PHP, money transfer Philippines, CAD PHP exchange rate",
  },
  "uk-to-bangladesh": {
    title: "Cheapest Way to Send Money UK to Bangladesh — GBP→BDT Rates (2026)",
    description:
      "GBP to BDT rates from ACE, WorldRemit, Wise & Remitly. Direct bKash in minutes. Bangladesh 2.5% remittance incentive applies.",
    ogTitle: "UK→Bangladesh: Who Gives the Best GBP→BDT Rate?",
    ogDescription:
      "Compare GBP to BDT rates from 10+ providers. Send directly to bKash in minutes. Get Bangladesh's 2.5% remittance cash incentive.",
    keywords:
      "send money UK to Bangladesh, GBP to BDT, cheapest way to send money to Bangladesh from UK, bKash from UK, ACE Money Transfer Bangladesh, money transfer Bangladesh, GBP BDT exchange rate",
  },
  "uae-to-india": {
    title: "Cheapest Way to Send Money UAE to India — AED→INR Rates (2026)",
    description:
      "AED to INR rates from Wise, Remitly, Al Ansari & 10+ providers. IMPS instant delivery. Competition intense — compare before every send.",
    ogTitle: "UAE→India: Who Gives the Best AED→INR Rate?",
    ogDescription:
      "Compare AED to INR rates from 10+ providers. IMPS instant delivery to Indian banks. Find the most rupees per dirham today.",
    keywords:
      "send money UAE to India, AED to INR, cheapest way to send money from UAE to India, Al Ansari Exchange, money transfer India from UAE, AED INR exchange rate, IMPS transfer, remittance India UAE",
  },
  "uae-to-pakistan": {
    title: "Cheapest Way to Send Money UAE to Pakistan — AED→PKR Rates (2026)",
    description:
      "AED to PKR rates from ACE, Wise, Remitly & Al Ansari. JazzCash and Easypaisa delivery. PKR volatile — compare every time.",
    ogTitle: "UAE→Pakistan: Who Gives the Best AED→PKR Rate?",
    ogDescription:
      "Compare AED to PKR rates from 10+ providers. Send to JazzCash and Easypaisa. Find the most rupees per dirham today.",
    keywords:
      "send money UAE to Pakistan, AED to PKR, cheapest way to send money from UAE to Pakistan, ACE Money Transfer UAE Pakistan, JazzCash from UAE, Easypaisa from UAE, AED PKR exchange rate",
  },
  "uae-to-philippines": {
    title: "Cheapest Way to Send Money UAE to Philippines — AED→PHP Rates (2026)",
    description:
      "AED to PHP rates from Remitly, LuLu Exchange, Al Ansari & more. Direct GCash and Maya delivery. Compare fees from 10+ providers.",
    ogTitle: "UAE→Philippines: Who Gives the Best AED→PHP Rate?",
    ogDescription:
      "Compare AED to PHP rates from 10+ providers. Send to GCash in minutes from the UAE. Find the most pesos per dirham today.",
    keywords:
      "send money UAE to Philippines, AED to PHP, cheapest way to send money from UAE to Philippines, GCash from UAE, LuLu Exchange Philippines, money transfer Philippines UAE, AED PHP exchange rate",
  },
  "saudi-arabia-to-india": {
    title: "Cheapest Way to Send Money Saudi Arabia to India — SAR→INR Rates (2026)",
    description:
      "SAR to INR rates from Lulu Exchange, Al Rajhi, Wise & more. IMPS instant delivery. SAR pegged to USD — compare margins carefully.",
    ogTitle: "Saudi Arabia→India: Who Gives the Best SAR→INR Rate?",
    ogDescription:
      "Compare SAR to INR rates from 10+ providers. IMPS delivery to all Indian banks. Find the most rupees per riyal today.",
    keywords:
      "send money Saudi Arabia to India, SAR to INR, cheapest way to send money from Saudi Arabia to India, Lulu Exchange Saudi India, Al Rajhi remittance India, money transfer India Saudi, SAR INR exchange rate",
  },
  "saudi-arabia-to-pakistan": {
    title: "Cheapest Way to Send Money Saudi Arabia to Pakistan — SAR→PKR Rates (2026)",
    description:
      "SAR to PKR rates from Al Rajhi, ACE, Wise & more. JazzCash and Easypaisa delivery. PKR volatile — compare at time of sending.",
    ogTitle: "Saudi Arabia→Pakistan: Who Gives the Best SAR→PKR Rate?",
    ogDescription:
      "Compare SAR to PKR rates from 10+ providers. Send to JazzCash and Easypaisa. Find the most rupees per riyal today.",
    keywords:
      "send money Saudi Arabia to Pakistan, SAR to PKR, cheapest way to send money from Saudi Arabia to Pakistan, Al Rajhi Pakistan, ACE Money Transfer Saudi Pakistan, JazzCash from Saudi, SAR PKR exchange rate",
  },
  "usa-to-uk": {
    title: "Cheapest Way to Send Money USA to UK — USD→GBP Rates (2026)",
    description:
      "USD to GBP rates from Wise, OFX, Remitly & 10+ providers. Faster Payments delivery in minutes. See who gives the most pounds.",
    ogTitle: "USA→UK: Who Gives the Best USD→GBP Rate?",
    ogDescription:
      "Compare USD to GBP rates from 15+ providers. Faster Payments delivery to UK banks. Find the most pounds per dollar today.",
    keywords:
      "send money USA to UK, USD to GBP, cheapest way to send money from USA to UK, Wise USA UK, OFX USD GBP, money transfer USA UK, USD GBP exchange rate, Faster Payments from USA",
  },
  "saudi-arabia-to-bangladesh": {
    title: "Cheapest Way to Send Money Saudi Arabia to Bangladesh — SAR→BDT Rates (2026)",
    description:
      "SAR to BDT rates from Al Rajhi, ACE, Wise. Direct bKash delivery. Recipients get Bangladesh's 2.5% government remittance bonus.",
    ogTitle: "Saudi Arabia→Bangladesh: Who Gives the Best SAR→BDT Rate?",
    ogDescription:
      "Compare SAR to BDT rates. Send to bKash from Saudi Arabia. Recipients earn 2.5% government incentive on formal remittances.",
    keywords:
      "send money Saudi Arabia to Bangladesh, SAR to BDT, cheapest way to send money Saudi Bangladesh, bKash from Saudi, Al Rajhi Bangladesh, SAR BDT exchange rate, Bangladesh remittance incentive",
  },
  "saudi-arabia-to-egypt": {
    title: "Cheapest Way to Send Money Saudi Arabia to Egypt — SAR→EGP Rates (2026)",
    description:
      "SAR to EGP rates from Lulu Exchange, Al Rajhi, Wise. InstaPay instant delivery. EGP floating rate — compare carefully.",
    ogTitle: "Saudi Arabia→Egypt: Who Gives the Best SAR→EGP Rate?",
    ogDescription:
      "Compare SAR to EGP rates from multiple providers. InstaPay delivery to Egyptian banks. Find the most pounds per riyal today.",
    keywords:
      "send money Saudi Arabia to Egypt, SAR to EGP, cheapest way to send money Saudi Egypt, InstaPay Egypt, Al Rajhi Egypt, SAR EGP exchange rate, Egypt remittance",
  },
  "singapore-to-india": {
    title: "Cheapest Way to Send Money Singapore to India — SGD→INR Rates (2026)",
    description:
      "SGD to INR rates from Instarem, Wise, Remitly. IMPS instant delivery. PayNow funding supported. Compare fees from 10+ providers.",
    ogTitle: "Singapore→India: Who Gives the Best SGD→INR Rate?",
    ogDescription:
      "Compare SGD to INR rates from 10+ providers. IMPS instant delivery to Indian banks. Find the most rupees per Singapore dollar today.",
    keywords:
      "send money Singapore to India, SGD to INR, cheapest way to send money Singapore India, Instarem Singapore India, Wise SGD INR, IMPS delivery, PayNow transfer India",
  },
  "singapore-to-philippines": {
    title: "Cheapest Way to Send Money Singapore to Philippines — SGD→PHP Rates (2026)",
    description:
      "Compare the cheapest ways to send money from Singapore to the Philippines in 2026. SGD to PHP rates from Instarem, Remitly, Wise. Direct GCash delivery. PayNow funding accepted.",
    ogTitle: "Singapore→Philippines: Who Gives the Best SGD→PHP Rate?",
    ogDescription:
      "Compare SGD to PHP rates from 10+ providers. Send to GCash in minutes from Singapore. Find the most pesos per Singapore dollar.",
    keywords:
      "send money Singapore to Philippines, SGD to PHP, cheapest way to send money Singapore Philippines, GCash from Singapore, Instarem Philippines, SGD PHP exchange rate",
  },
  "singapore-to-indonesia": {
    title: "Cheapest Way to Send Money Singapore to Indonesia — SGD→IDR Rates (2026)",
    description:
      "SGD to IDR rates from Instarem, Wise, Remitly. Deposit to BCA, BRI, Mandiri. BI-FAST instant settlement. Compare fees today.",
    ogTitle: "Singapore→Indonesia: Who Gives the Best SGD→IDR Rate?",
    ogDescription:
      "Compare SGD to IDR rates from multiple providers. Fast delivery to BCA and BRI. Find the most rupiah per Singapore dollar today.",
    keywords:
      "send money Singapore to Indonesia, SGD to IDR, cheapest way to send money Singapore Indonesia, Instarem Indonesia, BCA transfer, SGD IDR exchange rate, BI-FAST",
  },
  "new-zealand-to-india": {
    title: "Cheapest Way to Send Money New Zealand to India — NZD→INR Rates (2026)",
    description:
      "Compare the cheapest ways to send money from New Zealand to India in 2026. NZD to INR rates from Wise, Instarem, Remitly. IMPS instant delivery to Indian banks.",
    ogTitle: "New Zealand→India: Who Gives the Best NZD→INR Rate?",
    ogDescription:
      "Compare NZD to INR rates from multiple providers. IMPS delivery to all Indian banks. Find the most rupees per NZ dollar today.",
    keywords:
      "send money New Zealand to India, NZD to INR, cheapest way to send money NZ India, Wise NZD INR, Instarem New Zealand, money transfer NZ India",
  },
  "new-zealand-to-philippines": {
    title: "Cheapest Way to Send Money New Zealand to Philippines — NZD→PHP Rates (2026)",
    description:
      "Compare the cheapest ways to send money from New Zealand to the Philippines in 2026. NZD to PHP rates from Wise, Remitly, WorldRemit. GCash delivery supported.",
    ogTitle: "New Zealand→Philippines: Who Gives the Best NZD→PHP Rate?",
    ogDescription:
      "Compare NZD to PHP rates from multiple providers. Send to GCash from New Zealand. Find the most pesos per NZ dollar.",
    keywords:
      "send money New Zealand to Philippines, NZD to PHP, cheapest way to send money NZ Philippines, GCash from NZ, Wise NZD PHP, money transfer NZ Philippines",
  },
  "new-zealand-to-fiji": {
    title: "Cheapest Way to Send Money New Zealand to Fiji — NZD→FJD Rates (2026)",
    description:
      "Compare the cheapest ways to send money from New Zealand to Fiji in 2026. NZD to FJD rates from Wise, Western Union, and specialist providers. Bank deposit and cash pickup options.",
    ogTitle: "New Zealand→Fiji: Who Gives the Best NZD→FJD Rate?",
    ogDescription:
      "Compare NZD to FJD rates. Send to Fijian bank accounts or cash pickup locations. Find the cheapest NZ to Fiji transfer.",
    keywords:
      "send money New Zealand to Fiji, NZD to FJD, cheapest way to send money NZ Fiji, Wise NZD FJD, Western Union Fiji, money transfer NZ Fiji, Pacific remittance",
  },
  "uk-to-philippines": {
    title: "Cheapest Way to Send Money UK to Philippines — GBP→PHP Rates (2026)",
    description:
      "GBP to PHP rates from Wise, Remitly, WorldRemit. Direct GCash and Maya delivery. Faster Payments funding. Compare 19+ providers.",
    ogTitle: "UK→Philippines: Who Gives the Best GBP→PHP Rate?",
    ogDescription:
      "Compare GBP to PHP rates from 19+ providers. Send to GCash in minutes from the UK. Find the most pesos per pound today.",
    keywords:
      "send money UK to Philippines, GBP to PHP, cheapest way to send money UK Philippines, GCash from UK, Wise GBP PHP, Remitly UK Philippines, Faster Payments Philippines",
  },
  "europe-to-india": {
    title: "Cheapest Way to Send Money Europe to India — EUR→INR Rates (2026)",
    description:
      "EUR to INR rates from Wise, Remitly, Instarem & 18+ providers. SEPA funding, IMPS instant delivery. Compare fees and total cost.",
    ogTitle: "Europe→India: Who Gives the Best EUR→INR Rate?",
    ogDescription:
      "Compare EUR to INR rates from 18+ providers. SEPA funding and IMPS delivery. Find the most rupees per euro today.",
    keywords:
      "send money Europe to India, EUR to INR, cheapest way to send money Europe India, SEPA transfer India, Wise EUR INR, Instarem Europe, money transfer Europe India",
  },
  "europe-to-philippines": {
    title: "Cheapest Way to Send Money Europe to Philippines — EUR→PHP Rates (2026)",
    description:
      "EUR to PHP rates from Wise, Remitly, WorldRemit. SEPA funding, direct GCash delivery. Compare 16+ providers — updated every 6 hrs.",
    ogTitle: "Europe→Philippines: Who Gives the Best EUR→PHP Rate?",
    ogDescription:
      "Compare EUR to PHP rates from 16+ providers. Send to GCash from Europe via SEPA. Find the most pesos per euro today.",
    keywords:
      "send money Europe to Philippines, EUR to PHP, cheapest way to send money Europe Philippines, GCash from Europe, SEPA Philippines transfer, Wise EUR PHP, OFW remittance Europe",
  },
  "europe-to-nigeria": {
    title: "Cheapest Way to Send Money Europe to Nigeria — EUR→NGN Rates (2026)",
    description:
      "EUR to NGN rates from Lemfi, Wise, WorldRemit. SEPA funding. Naira volatile — compare live rates from 11+ providers.",
    ogTitle: "Europe→Nigeria: Who Gives the Best EUR→NGN Rate?",
    ogDescription:
      "Compare EUR to NGN rates from 11+ providers. SEPA funding, bank deposit delivery. Navigate naira volatility with real-time comparison.",
    keywords:
      "send money Europe to Nigeria, EUR to NGN, cheapest way to send money Europe Nigeria, Lemfi Europe Nigeria, Wise EUR NGN, SEPA Nigeria transfer, naira exchange rate",
  },
  "europe-to-pakistan": {
    title: "Cheapest Way to Send Money Europe to Pakistan — EUR→PKR Rates (2026)",
    description:
      "EUR to PKR rates from ACE, Wise, Remitly. SEPA funding, JazzCash and Easypaisa delivery. Compare 10+ providers today.",
    ogTitle: "Europe→Pakistan: Who Gives the Best EUR→PKR Rate?",
    ogDescription:
      "Compare EUR to PKR rates from 10+ providers. Send to JazzCash and Easypaisa via SEPA. Find the most rupees per euro today.",
    keywords:
      "send money Europe to Pakistan, EUR to PKR, cheapest way to send money Europe Pakistan, JazzCash from Europe, ACE Money Transfer Europe, SEPA Pakistan, EUR PKR exchange rate",
  },
  "usa-to-ghana": {
    title: "Cheapest Way to Send Money USA to Ghana — USD→GHS Rates (2026)",
    description:
      "USD to GHS rates from Sendwave, Wise, Remitly & WorldRemit. Direct MTN MoMo delivery. Zero-fee options available.",
    ogTitle: "USA→Ghana: Who Gives the Best USD→GHS Rate?",
    ogDescription:
      "Compare USD to GHS rates from 14+ providers. Send to MTN MoMo instantly. Zero-fee transfer options from the US to Ghana.",
    keywords:
      "send money USA to Ghana, USD to GHS, cheapest way to send money US Ghana, MTN MoMo from USA, Sendwave Ghana, Wise USD GHS, money transfer USA Ghana, cedi exchange rate",
  },
  "usa-to-colombia": {
    title: "Cheapest Way to Send Money USA to Colombia — USD→COP Rates (2026)",
    description:
      "USD to COP rates from Wise, Remitly, Xoom. Direct Nequi and Daviplata delivery. Transfiya instant settlement. Compare today.",
    ogTitle: "USA→Colombia: Who Gives the Best USD→COP Rate?",
    ogDescription:
      "Compare USD to COP rates from 12+ providers. Send to Nequi and Daviplata in minutes. Find the most pesos per dollar today.",
    keywords:
      "send money USA to Colombia, USD to COP, cheapest way to send money US Colombia, Nequi from USA, Daviplata transfer, Wise USD COP, Remitly Colombia, COP exchange rate",
  },
  "uae-to-bangladesh": {
    title: "Cheapest Way to Send Money UAE to Bangladesh — AED→BDT Rates (2026)",
    description:
      "AED to BDT rates from Al Ansari, ACE, Wise. bKash delivery from UAE. Recipients get Bangladesh's 2.5% government remittance bonus.",
    ogTitle: "UAE→Bangladesh: Who Gives the Best AED→BDT Rate?",
    ogDescription:
      "Compare AED to BDT rates. Send to bKash from UAE. Recipients earn Bangladesh's 2.5% remittance incentive through legal channels.",
    keywords:
      "send money UAE to Bangladesh, AED to BDT, cheapest way to send money UAE Bangladesh, bKash from UAE, Al Ansari Bangladesh, AED BDT exchange rate, Bangladesh remittance incentive",
  },
  "canada-to-pakistan": {
    title: "Cheapest Way to Send Money Canada to Pakistan — CAD→PKR Rates (2026)",
    description:
      "CAD to PKR rates from Wise, Remitly, ACE. Interac funding, JazzCash and Easypaisa delivery. Compare fees from multiple providers.",
    ogTitle: "Canada→Pakistan: Who Gives the Best CAD→PKR Rate?",
    ogDescription:
      "Compare CAD to PKR rates from multiple providers. Fund via Interac, deliver to JazzCash. Find the most rupees per Canadian dollar.",
    keywords:
      "send money Canada to Pakistan, CAD to PKR, cheapest way to send money Canada Pakistan, JazzCash from Canada, Interac Pakistan transfer, Wise CAD PKR, ACE Money Transfer Canada",
  },
  "australia-to-pakistan": {
    title: "Cheapest Way to Send Money Australia to Pakistan — AUD→PKR Rates (2026)",
    description:
      "AUD to PKR rates from Wise, Remitly, WorldRemit. PayID funding, JazzCash and Easypaisa delivery. Compare fees today.",
    ogTitle: "Australia→Pakistan: Who Gives the Best AUD→PKR Rate?",
    ogDescription:
      "Compare AUD to PKR rates from multiple providers. PayID funding, JazzCash delivery. Find the most rupees per Australian dollar.",
    keywords:
      "send money Australia to Pakistan, AUD to PKR, cheapest way to send money Australia Pakistan, JazzCash from Australia, PayID Pakistan, Wise AUD PKR, AUSTRAC remittance",
  },
  "uae-to-egypt": {
    title: "Cheapest Way to Send Money UAE to Egypt — AED→EGP Rates (2026)",
    description:
      "AED to EGP rates from Al Ansari, Wise, Remitly. InstaPay instant delivery. EGP floating rate — compare live rates today.",
    ogTitle: "UAE→Egypt: Who Gives the Best AED→EGP Rate?",
    ogDescription:
      "Compare AED to EGP rates from multiple providers. InstaPay delivery to Egyptian banks. Navigate EGP volatility with real-time comparison.",
    keywords:
      "send money UAE to Egypt, AED to EGP, cheapest way to send money UAE Egypt, InstaPay Egypt, Al Ansari Egypt, AED EGP exchange rate, Egypt remittance UAE",
  },
  "saudi-arabia-to-philippines": {
    title: "Cheapest Way to Send Money Saudi Arabia to Philippines — SAR→PHP Rates (2026)",
    description:
      "SAR to PHP rates from Al Rajhi, Wise, Remitly. Direct GCash delivery. Over 1M Filipino OFWs in Saudi — compare fees today.",
    ogTitle: "Saudi Arabia→Philippines: Who Gives the Best SAR→PHP Rate?",
    ogDescription:
      "Compare SAR to PHP rates. Send to GCash from Saudi Arabia. Find the most pesos per riyal for Filipino OFWs.",
    keywords:
      "send money Saudi Arabia to Philippines, SAR to PHP, cheapest way to send money Saudi Philippines, GCash from Saudi, Al Rajhi Philippines, OFW remittance Saudi, SAR PHP exchange rate",
  },
  "uk-to-ghana": {
    title: "Cheapest Way to Send Money UK to Ghana — GBP→GHS Rates (2026)",
    description:
      "GBP to GHS rates from Sendwave, WorldRemit, Wise. Direct MTN MoMo delivery. FCA-regulated providers. Compare fees today.",
    ogTitle: "UK→Ghana: Who Gives the Best GBP→GHS Rate?",
    ogDescription:
      "Compare GBP to GHS rates from multiple providers. Send to MTN MoMo instantly from the UK. FCA-regulated providers.",
    keywords:
      "send money UK to Ghana, GBP to GHS, cheapest way to send money UK Ghana, MTN MoMo from UK, Sendwave Ghana, WorldRemit GHS, cedi exchange rate, FCA money transfer",
  },
  "canada-to-nigeria": {
    title: "Cheapest Way to Send Money Canada to Nigeria — CAD→NGN Rates (2026)",
    description:
      "CAD to NGN rates from Lemfi, Wise, WorldRemit. Interac funding. Naira volatile — compare live rates before every transfer.",
    ogTitle: "Canada→Nigeria: Who Gives the Best CAD→NGN Rate?",
    ogDescription:
      "Compare CAD to NGN rates from multiple providers. Interac funding, bank deposit delivery. Navigate naira volatility with real-time comparison.",
    keywords:
      "send money Canada to Nigeria, CAD to NGN, cheapest way to send money Canada Nigeria, Lemfi Canada Nigeria, Wise CAD NGN, Interac Nigeria transfer, naira exchange rate Canada",
  },
  "australia-to-uk": {
    title: "Cheapest Way to Send Money Australia to UK — AUD→GBP Rates (2026)",
    description:
      "AUD to GBP rates from OFX, Wise, Revolut. PayID funding, Faster Payments delivery to UK banks. Compare fees today.",
    ogTitle: "Australia→UK: Who Gives the Best AUD→GBP Rate?",
    ogDescription:
      "Compare AUD to GBP rates from multiple providers. PayID funding, Faster Payments delivery. Find the most pounds per Australian dollar.",
    keywords:
      "send money Australia to UK, AUD to GBP, cheapest way to send money Australia UK, OFX AUD GBP, Wise Australia UK, PayID UK transfer, Faster Payments from Australia",
  },
  "singapore-to-bangladesh": {
    title: "Cheapest Way to Send Money Singapore to Bangladesh — SGD→BDT Rates (2026)",
    description:
      "SGD to BDT rates from Instarem, Wise, Remitly. bKash delivery. Recipients get Bangladesh's 2.5% government remittance bonus.",
    ogTitle: "Singapore→Bangladesh: Who Gives the Best SGD→BDT Rate?",
    ogDescription:
      "Compare SGD to BDT rates. Send to bKash from Singapore. Recipients earn Bangladesh's 2.5% remittance incentive.",
    keywords:
      "send money Singapore to Bangladesh, SGD to BDT, cheapest way to send money Singapore Bangladesh, bKash from Singapore, Instarem Bangladesh, SGD BDT exchange rate, MAS licensed",
  },
  "send-money-to-morocco": {
    title: "Best Way to Send Money to Morocco (2026) — Fees, Rates & Cash Pickup",
    description:
      "Live MAD rates from Wise, Remitly, Western Union & more. Bank deposit vs cash pickup options. Compare provider fees — updated every 6 hrs.",
    ogTitle: "Send Money to Morocco: Who Gives the Best MAD Rate?",
    ogDescription:
      "Compare live MAD rates from 10+ providers. Bank deposit vs cash pickup options. Find the cheapest way to send money to Morocco.",
    keywords:
      "send money to Morocco, cheapest way to send money to Morocco, money transfer Morocco, MAD exchange rate, cash pickup Morocco, Western Union Morocco, Remitly Morocco, bank transfer Morocco",
  },
  // --- Country page overrides targeting generic "send money to X" queries ---
  "send-money-to-pakistan": {
    title: "Cheapest Way to Send Money to Pakistan (2026) — Compare 15+ Providers",
    description:
      "Compare the cheapest ways to send money to Pakistan. Live PKR rates from Wise, ACE, Remitly & WorldRemit — JazzCash and Easypaisa delivery. Updated every 6 hrs.",
    ogTitle: "Send Money to Pakistan — Who Gives the Most PKR?",
    ogDescription:
      "Live PKR rates from 15+ providers. JazzCash, Easypaisa, and bank deposit options compared. Find the cheapest way to send money to Pakistan.",
    keywords:
      "send money to Pakistan, cheapest way to send money to Pakistan, cheap money transfer to Pakistan, best way to send money to Pakistan, money transfer Pakistan, PKR exchange rate, JazzCash transfer, Easypaisa transfer",
  },
  "send-money-to-india": {
    title: "Cheapest Way to Send Money to India (2026) — Compare INR Rates",
    description:
      "Compare the cheapest and fastest ways to send money to India. Live INR rates from 15+ providers — UPI, IMPS, bank deposit. Updated every 6 hrs.",
    ogTitle: "Send Money to India — Who Gives the Most INR?",
    ogDescription:
      "Live INR rates from 15+ providers. UPI and IMPS instant delivery. Find the cheapest way to send money to India today.",
    keywords:
      "send money to India, cheapest way to send money to India, fastest way to send money to India, best way to send money to India, money transfer India, INR exchange rate, UPI transfer, IMPS delivery",
  },
  "send-money-to-philippines": {
    title: "Cheapest Way to Send Money to the Philippines (2026) — GCash & Bank",
    description:
      "Compare the cheapest ways to send money to the Philippines with no fees. Live PHP rates from 10+ providers — GCash, bank deposit, cash pickup. Updated every 6 hrs.",
    ogTitle: "Send Money to Philippines — Who's Cheapest Right Now?",
    ogDescription:
      "Live PHP rates from 10+ providers. GCash delivery in minutes. Find the cheapest way to send money to the Philippines.",
    keywords:
      "send money to Philippines, cheapest way to send money to Philippines, best ways to send money to Philippines, money transfer Philippines, PHP exchange rate, GCash transfer, cash pickup Philippines",
  },
  "send-money-to-nigeria": {
    title: "Cheapest Way to Send Money to Nigeria (2026) — NGN Rates Compared",
    description:
      "Compare the cheapest ways to send money to Nigeria. Live NGN rates vary 10%+ between providers — Lemfi, Wise, WorldRemit, Remitly compared. Updated every 6 hrs.",
    ogTitle: "Send Money to Nigeria — Who Gives the Most Naira?",
    ogDescription:
      "NGN rates vary 10%+ between providers. Compare live rates from 10+ providers. Find the cheapest way to send money to Nigeria.",
    keywords:
      "send money to Nigeria, cheapest way to send money to Nigeria, best money transfer to Nigeria, money transfer Nigeria, NGN exchange rate, naira rate, Lemfi Nigeria",
  },
  "send-money-to-mexico": {
    title: "Cheapest Way to Send Money to Mexico (2026) — SPEI & Cash Pickup",
    description:
      "Compare the cheapest online money transfers to Mexico. Live MXN rates from 15+ providers — SPEI instant delivery, OXXO cash pickup. Updated every 6 hrs.",
    ogTitle: "Send Money to Mexico — Who's Cheapest Right Now?",
    ogDescription:
      "Live MXN rates from 15+ providers. SPEI instant deposits and OXXO cash pickup. Find the cheapest way to send money to Mexico.",
    keywords:
      "cheapest online money transfer to Mexico, cheapest way to send money to Mexico, best way to send money to Mexico, send money to Mexico, money transfer Mexico, MXN exchange rate, SPEI transfer, OXXO cash pickup",
  },
  "send-money-to-kenya": {
    title: "Cheapest Way to Send Money to Kenya (2026) — M-Pesa & Bank",
    description:
      "Compare the cheapest ways to send money to Kenya. Live KES rates from 10+ providers — direct M-Pesa delivery in minutes. Sendwave offers zero fees.",
    ogTitle: "Send Money to Kenya — Who Gives the Best KES Rate?",
    ogDescription:
      "Live KES rates from 10+ providers. M-Pesa delivery in minutes. Find the cheapest way to send money to Kenya.",
    keywords:
      "send money to Kenya, cheapest way to send money to Kenya, how to send money to Kenya, best way to send money to Kenya, money transfer Kenya, KES exchange rate, M-Pesa transfer, Sendwave Kenya",
  },
  "send-money-to-romania": {
    title: "Cheapest Way to Send Money to Romania (2026) — SEPA, EUR & RON Rates",
    description:
      "Compare the cheapest ways to send money to Romania. SEPA instant transfers available. EUR and RON rates from 10+ providers — updated every 6 hrs.",
    ogTitle: "Send Money to Romania — SEPA Instant Available",
    ogDescription:
      "SEPA instant transfers to Romania. Compare EUR and RON rates from 10+ providers. Find the cheapest and fastest way to send.",
    keywords:
      "send money to Romania, cheapest way to send money to Romania, best way to send money to Romania, fastest way to send money to Romania, money transfer Romania, RON exchange rate, SEPA transfer Romania",
  },
  "send-money-to-colombia": {
    title: "Cheapest Way to Send Money to Colombia (2026) — COP Rates Compared",
    description:
      "Compare the cheapest ways to send money to Colombia. Live COP rates from 10+ providers — bank deposit, Nequi, and cash pickup options. Updated every 6 hrs.",
    ogTitle: "Send Money to Colombia — Who Gives the Most COP?",
    ogDescription:
      "Live COP rates from 10+ providers. Bank deposit and cash pickup. Find the cheapest way to send money to Colombia.",
    keywords:
      "send money to Colombia, cheapest way to send money to Colombia, best way to send money to Colombia, best company to send money to Colombia, money transfer Colombia, COP exchange rate",
  },
  "send-money-to-poland": {
    title: "Cheapest Way to Send Money to Poland (2026) — SEPA & PLN Rates",
    description:
      "Compare the cheapest ways to send money to Poland. SEPA instant transfers, PLN rates from 10+ providers. Save 80% vs bank wire. Updated every 6 hrs.",
    ogTitle: "Send Money to Poland — SEPA Instant Available",
    ogDescription:
      "SEPA instant transfers to Poland. Compare PLN rates from 10+ providers. Find the cheapest way to send money to Poland.",
    keywords:
      "send money to Poland, cheap money transfer to Poland, cheapest way to send money to Poland, best way to send money to Poland, money transfer Poland, PLN exchange rate, SEPA transfer Poland",
  },
  "send-money-to-south-africa": {
    title: "Cheapest Way to Send Money to South Africa (2026) — ZAR Rates Compared",
    description:
      "Compare the cheapest ways to send money to South Africa. Live ZAR rates from 10+ providers — FNB, Capitec, Standard Bank deposit & eWallet options.",
    ogTitle: "Send Money to South Africa — Who Gives the Best ZAR Rate?",
    ogDescription:
      "Live ZAR rates from 10+ providers. FNB eWallet and bank deposit options. Find the cheapest way to send money to South Africa.",
    keywords:
      "send money to South Africa, cheapest way to send money to South Africa, best way to transfer money to South Africa, money transfer South Africa, ZAR exchange rate, FNB eWallet",
  },
  "send-money-to-peru": {
    title: "Cheapest Way to Send Money to Peru (2026) — PEN Rates Compared",
    description:
      "Compare the cheapest ways to send money to Peru. Live PEN rates from 10+ providers — bank deposit to BCP, Interbank, BBVA. Updated every 6 hrs.",
    ogTitle: "Send Money to Peru — Who Gives the Most Soles?",
    ogDescription:
      "Live PEN rates from 10+ providers. Bank deposit to Peruvian banks. Find the cheapest way to send money to Peru.",
    keywords:
      "send money to Peru, cheapest way to send money to Peru, best way to send money to Peru, best money transfer services to Peru, money transfer Peru, PEN exchange rate",
  },
  "send-money-to-vietnam": {
    title: "Cheapest Way to Send Money to Vietnam (2026) — VND Rates Compared",
    description:
      "Compare the cheapest ways to send money to Vietnam. Live VND rates from 10+ providers — Vietcombank, BIDV, Agribank delivery. Updated every 6 hrs.",
    ogTitle: "Send Money to Vietnam — Who Gives the Best VND Rate?",
    ogDescription:
      "Live VND rates from 10+ providers. Bank deposit to Vietcombank, BIDV. Find the cheapest way to send money to Vietnam.",
    keywords:
      "send money to Vietnam, best way to send money to Vietnam, cheapest way to send money to Vietnam, money transfer Vietnam, VND exchange rate, Vietcombank transfer",
  },
  "send-money-to-bangladesh": {
    title: "Cheapest Way to Send Money to Bangladesh (2026) — bKash & Bank",
    description:
      "Compare the cheapest ways to send money to Bangladesh. Live BDT rates — direct bKash delivery in minutes. Recipients get 2.5% government bonus.",
    ogTitle: "Send Money to Bangladesh — bKash in Minutes",
    ogDescription:
      "Live BDT rates from 10+ providers. bKash delivery in minutes. Recipients earn Bangladesh's 2.5% remittance incentive.",
    keywords:
      "send money to Bangladesh, cheapest way to send money to Bangladesh, cheap money transfer to Bangladesh, best rate to send money to Bangladesh, money transfer Bangladesh, BDT exchange rate, bKash transfer",
  },
  // --- Specific corridor overrides for pages ranking on page 1-2 ---
  "italy-to-peru": {
    title: "Best Money Transfer Italy to Peru (2026) — EUR→PEN Rates Compared",
    description:
      "Compare the best money transfer services from Italy to Peru. Live EUR to PEN rates from 10+ providers — bank deposit to BCP, Interbank, BBVA. Updated every 6 hrs.",
    ogTitle: "Italy→Peru: Who Gives the Best EUR→PEN Rate?",
    ogDescription:
      "Compare EUR to PEN rates from 10+ providers. Find the cheapest way to send money from Italy to Peru.",
    keywords:
      "best money transfer Italy to Peru, send money Italy to Peru, best way to send money from Italy to Peru, EUR to PEN, money transfer Italy Peru, cheapest way to send money to Peru from Italy",
  },
  "spain-to-brazil": {
    title: "Cheapest Way to Send Money Spain to Brazil (2026) — EUR→BRL via PIX",
    description:
      "Compare the cheapest ways to send money from Spain to Brazil. EUR to BRL rates from 10+ providers — PIX instant delivery. Updated every 6 hrs.",
    ogTitle: "Spain→Brazil: Who Gives the Best EUR→BRL Rate?",
    ogDescription:
      "Compare EUR to BRL rates. PIX instant delivery to Brazilian banks. Find the cheapest way to send money from Spain to Brazil.",
    keywords:
      "cheapest way to send money from Spain to Brazil, send money Spain to Brazil, EUR to BRL, money transfer Spain Brazil, PIX transfer from Spain",
  },
  "sweden-to-romania": {
    title: "Cheapest Way to Send Money Sweden to Romania (2026) — SEK→RON Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Romania. SEK to RON rates from 10+ providers — SEPA instant delivery available. Updated every 6 hrs.",
    ogTitle: "Sweden→Romania: Who Gives the Best SEK→RON Rate?",
    ogDescription:
      "Compare SEK to RON rates from 10+ providers. SEPA instant delivery. Find the cheapest way to send money from Sweden to Romania.",
    keywords:
      "send money Sweden to Romania, bästa sättet att skicka pengar till rumänien, SEK to RON, cheapest way to send money Sweden Romania, SEPA transfer Romania",
  },
  "sweden-to-morocco": {
    title: "Cheapest Way to Send Money Sweden to Morocco (2026) — SEK→MAD Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Morocco. SEK to MAD rates from 10+ providers — bank deposit and cash pickup. Updated every 6 hrs.",
    ogTitle: "Sweden→Morocco: Who Gives the Best SEK→MAD Rate?",
    ogDescription:
      "Compare SEK to MAD rates. Find the cheapest way to send money from Sweden to Morocco with bank or cash pickup delivery.",
    keywords:
      "send money Sweden to Morocco, bästa sättet att skicka pengar till marocko, SEK to MAD, cheapest way to send money Sweden Morocco",
  },
  "usa-to-poland": {
    title: "Cheapest Way to Send Money USA to Poland (2026) — USD→PLN Rates",
    description:
      "Compare the cheapest ways to send money from USA to Poland. USD to PLN rates from 10+ providers — SEPA delivery in 1 day. Updated every 6 hrs.",
    ogTitle: "USA→Poland: Who Gives the Best USD→PLN Rate?",
    ogDescription:
      "Compare USD to PLN rates from 10+ providers. SEPA delivery. Find the cheapest way to send money from USA to Poland.",
    keywords:
      "send money USA to Poland, cheap money transfer to Poland, USD to PLN, cheapest way to send money to Poland from USA, money transfer Poland",
  },
  "usa-to-romania": {
    title: "Cheapest Way to Send Money USA to Romania (2026) — USD→RON Rates",
    description:
      "Compare the cheapest ways to send money from USA to Romania. USD to RON rates — SEPA delivery, EUR or RON options. Updated every 6 hrs.",
    ogTitle: "USA→Romania: Who Gives the Best USD→RON Rate?",
    ogDescription:
      "Compare USD to RON rates. SEPA delivery to Romanian banks. Find the cheapest and fastest way to send money from USA to Romania.",
    keywords:
      "send money USA to Romania, fastest way to send money to Romania, USD to RON, cheapest way to send money to Romania from USA, SEPA transfer Romania",
  },
  "sweden-to-colombia": {
    title: "Cheapest Way to Send Money Sweden to Colombia (2026) — SEK→COP Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Colombia. SEK to COP rates from 10+ providers — bank deposit and cash pickup. Updated every 6 hrs.",
    ogTitle: "Sweden→Colombia: Who Gives the Best SEK→COP Rate?",
    ogDescription:
      "Compare SEK to COP rates. Find the cheapest way to send money from Sweden to Colombia.",
    keywords:
      "send money Sweden to Colombia, bästa sättet att skicka pengar till colombia, SEK to COP, cheapest way to send money Sweden Colombia",
  },
  "sweden-to-brazil": {
    title: "Cheapest Way to Send Money Sweden to Brazil (2026) — SEK→BRL Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Brazil. SEK to BRL rates from 10+ providers — PIX instant delivery. Updated every 6 hrs.",
    ogTitle: "Sweden→Brazil: Who Gives the Best SEK→BRL Rate?",
    ogDescription:
      "Compare SEK to BRL rates. PIX instant delivery. Find the cheapest way to send money from Sweden to Brazil.",
    keywords:
      "send money Sweden to Brazil, bästa sättet att skicka pengar till brasilien, SEK to BRL, cheapest way to send money Sweden Brazil, PIX transfer",
  },
  "sweden-to-mexico": {
    title: "Cheapest Way to Send Money Sweden to Mexico (2026) — SEK→MXN Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Mexico. SEK to MXN rates from 10+ providers — SPEI instant delivery + Oxxo cash pickup. Updated every 6 hrs.",
    ogTitle: "Sweden→Mexico: Who Gives the Best SEK→MXN Rate?",
    ogDescription:
      "Compare SEK to MXN rates. SPEI instant delivery to Mexican banks, Oxxo cash pickup. Find the cheapest way to send money from Sweden to Mexico.",
    keywords:
      "send money Sweden to Mexico, bästa sättet att skicka pengar till mexiko, SEK to MXN, cheapest way to send money Sweden Mexico, SPEI transfer Mexico",
  },
  "sweden-to-philippines": {
    title: "Cheapest Way to Send Money Sweden to Philippines (2026) — SEK→PHP Rates",
    description:
      "Compare the cheapest ways to send money from Sweden to Philippines. SEK to PHP rates from 10+ providers — GCash, Maya wallet + bank deposit. Updated every 6 hrs.",
    ogTitle: "Sweden→Philippines: Who Gives the Best SEK→PHP Rate?",
    ogDescription:
      "Compare SEK to PHP rates. GCash and Maya delivery + bank deposit. Find the cheapest way to send money from Sweden to the Philippines.",
    keywords:
      "send money Sweden to Philippines, bästa sättet att skicka pengar till filippinerna, SEK to PHP, cheapest way to send money Sweden Philippines, GCash from Sweden",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { corridor: slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "corridor" });
  const corridor = getCorridor(slug);
  // Unknown slug — emit a self-canonical + noindex rather than returning empty
  // metadata (which falls through to the layout's homepage canonical, leaving
  // a soft-404 page that claims the homepage as canonical).
  if (!corridor) {
    return {
      alternates: getAlternates(`send-money/${slug}`, locale),
      robots: { index: false, follow: false },
    };
  }

  // Tier 3 corridors still emit a self-canonical + noindex (was: returned empty
  // metadata, which inherited the layout's homepage canonical — soft 404 risk).
  //
  // The RANKING_CORRIDOR_SLUGS carve-out has to be honoured here, not just in
  // shouldNoindex(): this early return fired first, so three corridors rescued
  // on Sep 1 for ranking at positions 3.0-8.8 were listed in the sitemap (which
  // does consult shouldNoindex) while serving `noindex` to the crawler that
  // arrived. Semrush's Sep 2 audit surfaced them as pages blocked from crawling.
  // shouldNoindex is the single source of truth for this decision.
  if (
    getCorridorTier(slug, corridor.fromCurrency, corridor.toCurrency, corridor.isCountryPage) === 3 &&
    shouldNoindex(slug, corridor.fromCurrency, corridor.toCurrency, corridor.isCountryPage)
  ) {
    return {
      alternates: getAlternates(`send-money/${slug}`, locale),
      robots: { index: false, follow: true },
    };
  }

  const override = locale === "en" ? corridorSeoOverrides[slug] : undefined;
  const isCurr = corridor.isCurrencyCorridor;

  const isCountryPg = corridor.isCountryPage;
  const year = new Date().getFullYear();
  const tplParams = {
    from: corridor.fromCurrency,
    to: corridor.toCurrency,
    fromCountry: corridor.fromCountry,
    toCountry: corridor.toCountry,
    toCurrency: corridor.toCurrency,
    year,
  };
  const variant = isCurr ? "Currency" : isCountryPg ? "Country" : "Corridor";

  // Degradation ladder rather than one template: long country names pushed the
  // full pattern past 70 chars on 27 corridors ("Cheapest Way to Send Money
  // United Kingdom to New Zealand — GBP→NZD (2026)" = 73), so search engines
  // truncated the currency pair the title existed to carry. fitTitle keeps the
  // richest variant that actually renders, including hand-written overrides.
  const title = fitTitle([
    override?.title,
    t(`fallbackTitle${variant}`, tplParams),
    variant === "Corridor"
      ? t("fallbackTitleCorridorShort", tplParams)
      : variant === "Country"
        ? t("fallbackTitleCountryShort", tplParams)
        : undefined,
    variant === "Corridor" ? t("fallbackTitleCorridorMin", tplParams) : undefined,
  ]);
  // seoDescription caps the hand-written overrides too — one of them
  // (singapore-to-philippines) ran to 177 characters.
  const description = seoDescription(override?.description ?? t(`fallbackDescription${variant}`, tplParams));
  const ogTitle = override?.ogTitle ?? t(`fallbackOgTitle${variant}`, tplParams);
  const ogDescription = override?.ogDescription ?? description;
  const keywords = override?.keywords ?? t(`fallbackKeywords${variant}`, tplParams);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
    alternates: getAlternates(`send-money/${slug}`, locale),
    robots: shouldNoindex(slug, corridor.fromCurrency, corridor.toCurrency, corridor.isCountryPage) ? { index: false, follow: true } : undefined,
  };
}

// ── Helpers ──

function getCurrencySymbol(code: string): string {
  return currencies.find((c) => c.code === code)?.symbol || code;
}

const countryToSwiftSlug: Record<string, string> = {
  "India": "india", "Pakistan": "pakistan", "Bangladesh": "bangladesh",
  "Philippines": "philippines", "Nigeria": "nigeria", "Kenya": "kenya",
  "Ghana": "ghana", "Nepal": "nepal", "Sri Lanka": "sri-lanka",
  "Mexico": "mexico", "Brazil": "brazil", "Colombia": "colombia",
  "Peru": "peru", "United States": "united-states", "United Kingdom": "united-kingdom",
  "Canada": "canada", "Australia": "australia", "New Zealand": "new-zealand",
  "Singapore": "singapore", "UAE": "united-arab-emirates", "Germany": "germany",
  "France": "france", "Japan": "japan", "South Korea": "south-korea",
  "Thailand": "thailand", "Indonesia": "indonesia", "Malaysia": "malaysia",
  "Egypt": "egypt", "Morocco": "morocco", "Turkey": "turkiye",
  "South Africa": "south-africa", "China": "china", "Hong Kong": "hong-kong",
};

const countryToIbanSlug: Record<string, string> = {
  "United Kingdom": "uk", "Germany": "germany", "France": "france",
  "Netherlands": "netherlands", "Spain": "spain", "Italy": "italy",
  "Belgium": "belgium", "Austria": "austria", "Ireland": "ireland",
  "Portugal": "portugal", "Sweden": "sweden", "Denmark": "denmark",
  "Norway": "norway", "Switzerland": "switzerland", "Poland": "poland",
  "Pakistan": "pakistan", "Turkey": "turkey", "Romania": "romania",
  "Hungary": "hungary", "Croatia": "croatia", "Greece": "greece",
  "UAE": "united-arab-emirates", "Saudi Arabia": "saudi-arabia",
  "Egypt": "egypt", "Jordan": "jordan", "Brazil": "brazil",
  "Georgia": "georgia", "Ukraine": "ukraine", "Israel": "israel",
};

function swiftSlugForCountry(country: string): string | undefined {
  return countryToSwiftSlug[country];
}

function ibanSlugForCountry(country: string): string | undefined {
  return countryToIbanSlug[country];
}

// Map destination country → /guides/<slug> for the country-wide guide.
// Only includes destinations that have a real published guide in src/data.
const countryToGuideSlug: Record<string, { slug: string; label: string }> = {
  "India": { slug: "send-money-to-india-guide", label: "Best ways to send money to India" },
  "Pakistan": { slug: "send-money-to-pakistan-guide", label: "Best ways to send money to Pakistan" },
  "Philippines": { slug: "send-money-to-philippines-guide", label: "Best ways to send money to the Philippines" },
  "Mexico": { slug: "send-money-to-mexico-guide", label: "Cheapest way to send money to Mexico" },
  "Nigeria": { slug: "send-money-to-nigeria-guide", label: "Best ways to send money to Nigeria" },
  "Bangladesh": { slug: "send-money-to-bangladesh-guide", label: "Best ways to send money to Bangladesh" },
  "Brazil": { slug: "send-money-to-brazil-guide", label: "Send money to Brazil — PIX, IOF, real cost" },
  "China": { slug: "send-money-to-china-guide", label: "How to send money to China — Alipay, WeChat, capital controls" },
  "Colombia": { slug: "send-money-to-colombia-guide", label: "Cheapest way to send money to Colombia" },
  "Egypt": { slug: "send-money-to-egypt-guide", label: "Send money to Egypt — USD to EGP, providers compared" },
  "Ethiopia": { slug: "send-money-to-ethiopia-guide", label: "Cheapest way to send money to Ethiopia" },
  "Jamaica": { slug: "send-money-to-jamaica-guide", label: "Cheapest way to send money to Jamaica" },
  "Kenya": { slug: "send-money-to-kenya-guide", label: "Cheapest way to send money to Kenya — M-Pesa & banks" },
  "Morocco": { slug: "send-money-to-morocco-guide", label: "Cheapest way to send money to Morocco" },
  "Nepal": { slug: "send-money-to-nepal-guide", label: "Cheapest way to send money to Nepal" },
  "Poland": { slug: "send-money-to-poland-guide", label: "Cheapest way to send money to Poland — SEPA, PLN" },
  "Romania": { slug: "send-money-to-romania-guide", label: "Cheapest way to send money to Romania" },
  "South Africa": { slug: "send-money-to-south-africa-guide", label: "Cheapest way to send money to South Africa" },
  "South Korea": { slug: "send-money-to-south-korea-guide", label: "Cheapest way to send money to South Korea" },
  "Spain": { slug: "send-money-to-spain-guide", label: "Cheapest way to send money to Spain" },
  "Sri Lanka": { slug: "send-money-to-sri-lanka-guide", label: "Send money to Sri Lanka — cheapest ways" },
  "Turkey": { slug: "send-money-to-turkey-guide", label: "Send money to Turkey — EUR/USD/GBP to TRY" },
  "United Kingdom": { slug: "send-money-to-uk-guide", label: "Cheapest way to send money to the UK" },
  "Vietnam": { slug: "send-money-to-vietnam-guide", label: "Send money to Vietnam — cheapest ways" },
  "Australia": { slug: "send-money-to-australia-guide", label: "Cheapest way to send money to Australia" },
};

// Corridor-specific guides — when one exists for the exact from→to pair, it's a
// stronger ranking signal than the country-wide guide. Map by fromCountry+toCountry.
const corridorSpecificGuide: Record<string, { slug: string; label: string }> = {
  "USA|India": { slug: "send-money-to-india-from-usa-guide", label: "USA to India: complete guide (IFSC, rules, providers)" },
  "UK|India": { slug: "send-money-uk-to-india-guide", label: "UK to India: complete guide" },
  "Canada|India": { slug: "send-money-canada-to-india-guide", label: "Canada to India: complete guide" },
  "UAE|India": { slug: "send-money-uae-to-india-guide", label: "UAE to India (AED to INR): complete guide" },
  "UK|Bangladesh": { slug: "send-money-uk-to-bangladesh-guide", label: "UK to Bangladesh: complete guide" },
  "UK|Nigeria": { slug: "send-money-uk-to-nigeria-guide", label: "UK to Nigeria: complete guide (CBN naira-only rule)" },
  "UAE|Pakistan": { slug: "send-money-uae-to-pakistan-guide", label: "UAE to Pakistan: RAAST, JazzCash, RDA & 15 providers" },
  "USA|Kenya": { slug: "send-money-to-kenya-from-usa-guide", label: "USA to Kenya: 6 cheapest options" },
};

// corridors.ts spells the sending country out ("United States"), the guide map
// above abbreviates it ("USA"), so every USA and UK key silently missed and the
// corridor fell through to the country-wide guide. That stranded five submitted,
// indexable guides — the ones sitemap-allowlists.ts annotates "top stranded" —
// with no link from the corridor they were written for. Normalise before keying.
const guideCountryAlias: Record<string, string> = {
  "United States": "USA",
  "United Kingdom": "UK",
  "United Arab Emirates": "UAE",
};

/**
 * Returns the single best guide link for a corridor, preferring the
 * corridor-specific guide when one exists. This avoids cannibalization
 * between corridor pages and generic country guides — Google sees one
 * clear parent guide per corridor instead of two competing links.
 */
function getBestGuideLink(
  fromCountry: string,
  toCountry: string,
): { href: string; label: string } | null {
  const from = guideCountryAlias[fromCountry] ?? fromCountry;
  const specific = corridorSpecificGuide[`${from}|${toCountry}`];
  if (specific) return { href: `/guides/${specific.slug}`, label: specific.label };
  const country = countryToGuideSlug[toCountry];
  if (country) return { href: `/guides/${country.slug}`, label: country.label };
  return null;
}

// ── Page ──

export default async function CorridorPage({ params }: Props) {
  const { corridor: slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "corridor" });
  const tSendMoney = await getTranslations({ locale, namespace: "sendMoney" });
  const corridor = getCorridor(slug);
  if (!corridor) notFound();

  const { fromCurrency, toCurrency, sampleAmount, isCurrencyCorridor, isCountryPage } = corridor;
  const quotes = generateQuotes(sampleAmount, fromCurrency, toCurrency);
  // Rows the 0.10% materiality band placed directly above a larger payout. The
  // order is measured and disclosed, but on large-denomination corridors the
  // two figures print side by side and it reads as a sort bug — so the row says
  // why. See tiedAboveLargerPayout.
  const tiedMarks = tiedAboveLargerPayout(quotes);

  // Soft-404 guard. A corridor with zero provider quotes has no comparison table
  // to show — editorial prose alone is exactly the thin shell Google flags as a
  // soft 404 (562 such pages in the 2026-06-25 audit). So: zero quotes → 404.
  //
  // EXCEPTION: pages we deliberately keep indexed (head-terms + sitemap-allowlisted
  // earners) may hit a transient empty-quote window between scrapes; 404ing them
  // would yo-yo a page we're actively trying to get indexed. Those keep rendering
  // the existing "no quotes available yet" empty state.
  const isProtectedCorridor =
    HEAD_CORRIDOR_SLUGS.has(slug) ||
    SITEMAP_CORRIDOR_SLUGS.has(slug) ||
    // Ranking corridors are Tier 3 (0-1 quotes) by definition, so without this
    // they would hit the soft-404 guard below and 404 the very pages the
    // Sep 1 rescue exists to keep alive.
    RANKING_CORRIDOR_SLUGS.has(slug);
  if (quotes.length === 0 && !isProtectedCorridor) {
    notFound();
  }
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

  const comparison = corridorComparisonSummary(quotes, sampleAmount, fromCurrency, toCurrency, getProviderName);
  const { best, lowest: worst, difference: savings } = comparison;
  const resolvedFaqs = corridor.faqs.map((faq) => faq.answerFromComparison
    ? { ...faq, a: `${comparison.answer} ${faq.a}` }
    : faq);
  const editorialNote = corridorEditorialNotes[slug];
  const countryDetails = !isCurrencyCorridor ? getCountryDetails(corridor.toCountry, toCurrency) : null;
  const rateInsight = getRateInsight(fromCurrency, toCurrency);

  // Build a badge lookup for quick access per provider in the quote table
  const badgeByProvider: Record<string, ProviderBadge> = {};
  if (rateInsight) {
    for (const badge of rateInsight.providerBadges) {
      if (!badgeByProvider[badge.providerSlug]) {
        badgeByProvider[badge.providerSlug] = badge;
      }
    }
  }

  // Group by speed for the delivery section
  const fastProviders = quotes.filter(
    (q) => q.transferSpeed.toLowerCase().includes("minute") || q.transferSpeed.toLowerCase().includes("instant")
  );
  const standardProviders = quotes.filter(
    (q) => !q.transferSpeed.toLowerCase().includes("minute") && !q.transferSpeed.toLowerCase().includes("instant")
  );

  const breadcrumbName = isCountryPage ? `Send Money to ${corridor.toCountry}` : `${corridor.fromCountry} to ${corridor.toCountry}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Send Money", item: "https://sendmoneycompare.com/send-money" },
      { "@type": "ListItem", position: 3, name: breadcrumbName, item: `https://sendmoneycompare.com/send-money/${slug}` },
    ],
  };

  const isCurr = corridor.isCurrencyCorridor;
  const isCountryPg = corridor.isCountryPage;
  const pageTitle = isCurr
    ? `${fromCurrency} to ${toCurrency} — Best Exchange Rates & Low Fees`
    : isCountryPg
    ? `Send Money to ${corridor.toCountry} — Best ${toCurrency} Rates & Cheapest Providers`
    : `Send Money from ${corridor.fromCountry} to ${corridor.toCountry} — Best Rates & Lowest Fees`;
  const pageDescription = isCurr
    ? `Compare real-time ${fromCurrency} to ${toCurrency} exchange rates from 15+ providers. Find the cheapest way to convert ${fromCurrency} to ${toCurrency} with the lowest fees.`
    : isCountryPg
    ? `Everything you need to know about sending money to ${corridor.toCountry}. Compare live ${toCurrency} exchange rates, fees, delivery times, recipient requirements, and find the cheapest provider today.`
    : `Compare the best ways to send money from ${corridor.fromCountry} to ${corridor.toCountry} (${fromCurrency} to ${toCurrency}).`;
  const freshness = quoteFreshness(comparison.compared);
  const modifiedDate = [freshness.latest?.slice(0, 10), corridor.editorialUpdatedAt, countryDetails?.editorialUpdatedAt]
    .filter((date): date is string => !!date).sort().at(-1);
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: `https://sendmoneycompare.com/send-money/${slug}`,
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
    isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
    about: [
      { "@type": "Thing", name: "International Money Transfer" },
      { "@type": "Thing", name: `${fromCurrency} to ${toCurrency} Exchange Rate` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {/* ─── Premium Corridor Hero — best-provider-as-hero, editorial below ─── */}
      <CorridorHero
        headingFrom={headingFrom}
        headingTo={headingTo}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        fromCurrencyCode={corridor.fromCurrency}
        toCurrencyCode={corridor.toCurrency}
        sampleAmount={sampleAmount}
        sendSymbol={sendSymbol}
        receiveSymbol={receiveSymbol}
        midRate={midRate}
        best={best}
        worst={worst}
        quotes={comparison.compared}
        dataUpdatedISO={freshness.latest}
        isCountryPage={isCountryPage}
        headingPrefix={headingPrefix}
        headingSuffix={headingSuffix}
        corridorSlug={slug}
      />

      {/* ─── AI-Citable Answer Block ─── */}
      {comparison.compared.length > 0 && (
        <section className="bg-[var(--color-primary-surface)] border-y border-[var(--color-primary-light)]">
          <Container className="py-5">
            <div className="max-w-3xl text-sm text-[var(--color-on-surface)] leading-relaxed">
              <p>
                <strong>Quick answer:</strong>{" "}
                {comparison.answer}
              </p>
              <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
                {freshness.latest ? <>Latest pricing observation: <time dateTime={freshness.latest}>{formatLocalDate(freshness.latest.slice(0, 10))}</time>.
                  {freshness.oldest && freshness.oldest.slice(0, 10) !== freshness.latest.slice(0, 10) && <> Oldest observation used: <time dateTime={freshness.oldest}>{formatLocalDate(freshness.oldest.slice(0, 10))}</time>.</>}
                </> : "Pricing collection dates are unavailable."}
                {freshness.undated > 0 && " Some estimates have no recorded collection date."}
                {" "}Payouts are estimated from collected fees and markups with a mid-market reference. Collection schedules vary by source.{" "}
                {/* Says WHY eligibility needs confirming, rather than only that
                    it does. Quotes are keyed by currency pair and nothing else:
                    a field census over all 19,787 scraped rows found no sending
                    country on any source, so a {fromCurrency}→{toCurrency}
                    observation collected for one country cannot be told apart
                    from another's. 742 of 841 corridor pages (88%) share their
                    pair with at least one other page — twelve share each busy
                    EUR pair. See reports/content-quality-2026-09-11/ELIGIBILITY.md.
                    Do not soften this to imply we verified country coverage
                    until something in the pipeline records it. */}
                Quotes are collected by currency pair, so we cannot confirm that every provider serves {corridor.fromCountry} specifically — check availability, funding method and delivery method with the provider before you commit. <Link href="/methodology" className="hover:underline">How we collect and rank quotes</Link>.
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Quick Compare Widget ─── */}
      <section id="compare-widget" className="bg-[var(--color-surface-dim)] py-8 border-y border-[var(--color-outline)]">
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
      <section id="compare-providers" className="py-10">
        <Container>
          <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
            What is the cheapest way to send {fromCurrency} to {toCurrency}?
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-2">
            Sending {sendSymbol}{sampleAmount.toLocaleString()} from {headingFrom} to {headingTo}. Ranked by estimated payout, with customer ratings used for closely matched results.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-6">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            Source: SendMoneyCompare · Estimated payouts from collected pricing and mid-market rates
          </p>

          {quotes.length > 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
              {/* Desktop header — hidden on mobile */}
              <div className="hidden sm:grid sm:grid-cols-[36px_1fr_110px_90px_130px_112px] gap-2 px-6 py-3 bg-[var(--color-surface-container)] text-xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                <span>#</span>
                <span>Provider</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Fee</span>
                <span className="text-right">Recipient gets</span>
                <span className="sr-only">Send</span>
              </div>

              {/* Rows */}
              {quotes.map((q, i) => {
                const name = getProviderName(q.providerSlug);
                const provider = providers.find((p) => p.slug === q.providerSlug);
                const logo = providerLogo(q.providerSlug, provider?.logo);
                const isBest = i === 0;
                const markup = midRate > 0 ? ((midRate - q.exchangeRate) / midRate) * 100 : 0;
                const tiedAhead = tiedMarks.has(q.providerSlug);

                const rowBg = isBest ? "bg-[var(--color-success-surface-dim)]" : "";
                const borderTop = i === 0 ? "" : "border-t border-[var(--color-outline)]";

                return (
                  <div key={q.providerSlug} className={`${rowBg} ${borderTop} sm:border-t sm:border-[var(--color-outline)] ${isBest ? "sm:border-t-0" : ""}`}>
                    {/* Mobile layout — two rows */}
                    <div className="sm:hidden px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className={`text-2sm font-medium tabular-nums shrink-0 w-5 text-center mt-1.5 ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {i + 1}
                        </span>
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white border border-[var(--color-outline)]/40">
                          <Image src={logo} alt={`${name} logo`} width={36} height={36} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                            {companyPageRenders(q.providerSlug)
                              ? <Link href={`/companies/${q.providerSlug}`} className="hover:text-[var(--color-primary)]">{name}</Link>
                              : name}
                          </p>
                          <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5 truncate">{q.transferSpeed}</p>
                          {tiedAhead && <TiedNote rating={q.rating} />}
                          {isBest && (
                            <span className="inline-block mt-1 text-2xs text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-1.5 py-0.5 rounded font-medium">
                              Best value
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-semibold tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                            {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5">recipient gets</p>
                        </div>
                      </div>
                      <div className="mt-2.5 pl-[68px]">
                        <ProviderLink
                          href={getGoUrl(q.providerSlug, {
                            sourceCurrency: fromCurrency,
                            targetCurrency: toCurrency,
                            sourceAmount: sampleAmount,
                          })}
                          provider={q.providerSlug}
                          corridor={`${fromCurrency}-${toCurrency}`}
                          rank={i + 1}
                          source="corridor_table_mobile"
                          className={`flex items-center justify-center w-full h-12 rounded-full text-sm font-semibold transition-colors ${
                            isBest
                              ? "bg-[var(--color-success-dark)] text-white active:opacity-90"
                              : "border border-[var(--color-success-dark)] text-[var(--color-success-dark)] active:bg-[var(--color-success-surface)]"
                          }`}
                        >
                          Send with {name}
                        </ProviderLink>
                      </div>
                      <div className="flex items-center gap-3 mt-2 pl-[68px] text-2xs text-[var(--color-on-surface-variant)] tabular-nums">
                        <span>Rate <span className="text-[var(--color-on-surface)]">{q.exchangeRate.toFixed(4)}</span></span>
                        <span className="text-[var(--color-outline)]">·</span>
                        <span>Fee <span className="text-[var(--color-on-surface)]">{q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}</span></span>
                        {markup > 0 && markup < 10 && (
                          <>
                            <span className="text-[var(--color-outline)]">·</span>
                            <span>{markup.toFixed(2)}% markup</span>
                          </>
                        )}
                      </div>
                      {badgeByProvider[q.providerSlug] && (
                        <div className="mt-1.5 pl-[68px]">
                          <ProviderBadgeTag badge={badgeByProvider[q.providerSlug]} />
                        </div>
                      )}
                      {(() => {
                        const pi = getProviderInsight(fromCurrency, toCurrency, q.providerSlug);
                        const sp = rateInsight?.sparklines[q.providerSlug];
                        return pi && sp ? (
                          <div className="pl-[68px] mt-1">
                            <ProviderRateInsightLine insight={pi} sparklineData={sp} toCurrency={toCurrency} />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:grid sm:grid-cols-[36px_1fr_110px_90px_130px_112px] gap-2 items-center px-6 py-3">
                      <span className={`text-2sm font-medium ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                        {i + 1}
                      </span>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center text-2xs font-medium text-[var(--color-on-surface-variant)] relative">
                          <Image src={logo} alt={`${name} logo`} width={32} height={32} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                            {companyPageRenders(q.providerSlug)
                              ? <Link href={`/companies/${q.providerSlug}`} className="hover:text-[var(--color-primary)] hover:underline">{name}</Link>
                              : name}
                            {isBest && (
                              <span className="ml-1.5 text-2xs text-[var(--color-success-dark)] bg-[var(--color-success-surface)] px-1.5 py-0.5 rounded font-medium">
                                Best value
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xs text-[var(--color-on-surface-variant)]">{q.transferSpeed}</span>
                            {markup > 0 && markup < 10 && (
                              <span className="text-2xs text-[var(--color-on-surface-variant)]">
                                {markup.toFixed(2)}% markup
                              </span>
                            )}
                          </div>
                          {tiedAhead && <TiedNote rating={q.rating} />}
                          {badgeByProvider[q.providerSlug] && (
                            <div className="mt-0.5">
                              <ProviderBadgeTag badge={badgeByProvider[q.providerSlug]} />
                            </div>
                          )}
                          {(() => {
                            const pi = getProviderInsight(fromCurrency, toCurrency, q.providerSlug);
                            const sp = rateInsight?.sparklines[q.providerSlug];
                            return pi && sp ? (
                              <ProviderRateInsightLine insight={pi} sparklineData={sp} toCurrency={toCurrency} />
                            ) : null;
                          })()}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--color-on-surface)] tabular-nums">
                          {q.exchangeRate.toFixed(4)}
                        </p>
                        {rateInsight?.sparklines[q.providerSlug] && rateInsight.sparklines[q.providerSlug].length >= 2 && (
                          <Sparkline data={rateInsight.sparklines[q.providerSlug]} width={64} height={18} />
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-on-surface)] text-right tabular-nums">
                        {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                      </p>
                      <p className={`text-sm font-medium text-right tabular-nums ${isBest ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                        {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      {/* Every row is actionable. Until now only the #1 provider carried a
                          /go link and rows 2..n linked to our own /companies review, so a
                          reader who preferred row 4 had no way to act without a detour —
                          and that click fired no provider_clicked at all. */}
                      <ProviderLink
                        href={getGoUrl(q.providerSlug, {
                          sourceCurrency: fromCurrency,
                          targetCurrency: toCurrency,
                          sourceAmount: sampleAmount,
                        })}
                        provider={q.providerSlug}
                        corridor={`${fromCurrency}-${toCurrency}`}
                        rank={i + 1}
                        source="corridor_table"
                        className={`inline-flex items-center justify-center h-11 px-4 rounded-full text-2sm font-semibold transition-colors ${
                          isBest
                            ? "bg-[var(--color-success-dark)] text-white hover:opacity-90"
                            : "border border-[var(--color-success-dark)] text-[var(--color-success-dark)] hover:bg-[var(--color-success-surface)]"
                        }`}
                      >
                        Send
                      </ProviderLink>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <p className="text-sm text-[var(--color-on-surface-variant)] text-center py-4">
                No provider quotes available for this corridor yet. Try the{" "}
                <Link href="/send-money" className="text-[var(--color-primary)] hover:underline">
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
              <p className="text-sm text-[var(--color-success-dark)]">
                <strong>Estimated payout difference:</strong> The first-ranked provider pays more than the lowest estimate by{" "}
                <strong>
                  {receiveSymbol}{savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>{" "}
                on a {sendSymbol}{sampleAmount.toLocaleString()} transfer.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ─── Editorial Intro — moved below the comparison table.
           Answer first, context second: the user came to compare; once they
           see the data they're more willing to read the context. */}
      <section className="bg-[var(--color-surface)] py-8 sm:py-10 border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-on-surface-muted)] mb-5">
              <span>By <Link href="/about/akif-hazarvi" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Akif Hazarvi</Link></span>
              <span className="text-[var(--color-outline)]">·</span>
              <span>Pricing collected from provider APIs and comparison sources</span>
            </div>
            <div className="mb-5">
              <AffiliateDisclosure />
            </div>
            <div className="text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
              <p>{corridor.intro}</p>
              {corridor.highlights && corridor.highlights.length > 0 ? (
                <ul className="space-y-2.5 mt-4">
                  {corridor.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{corridor.context}</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Best Provider Summary ─── */}
      {best && (
        <section className="py-10 bg-[var(--color-surface-dim)]">
          <Container>
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Which provider offers the best {fromCurrency} to {toCurrency} rate?
            </h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                  <Image
                    src={providerLogo(best.providerSlug, providers.find((p) => p.slug === best.providerSlug)?.logo)}
                    alt={getProviderName(best.providerSlug)}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-on-surface)]">
                    {getProviderName(best.providerSlug)}
                  </h3>
                  <RatingBadge rating={best.rating} label={best.ratingLabel} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Exchange rate</p>
                  <p className="text-base font-medium text-[var(--color-on-surface)] mt-1">{best.exchangeRate.toFixed(4)}</p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Fee</p>
                  <p className="text-base font-medium text-[var(--color-on-surface)] mt-1">
                    {best.fee === 0 ? "Free" : `${sendSymbol}${best.fee.toFixed(2)}`}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Recipient gets</p>
                  <p className="text-base font-medium text-[var(--color-success-dark)] mt-1">
                    {receiveSymbol}{best.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-dim)] rounded-lg p-3">
                  <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide">Speed</p>
                  <p className="text-base font-medium text-[var(--color-on-surface)] mt-1">{best.transferSpeed}</p>
                </div>
              </div>

              {providers.find((p) => p.slug === best.providerSlug) && (
                <div className="flex gap-3">
                  <PrimaryButton href={companyPageRenders(best.providerSlug) ? `/companies/${best.providerSlug}` : "/companies"} size="sm">
                    Read full review
                  </PrimaryButton>
                  <ProviderLink
                    href={getGoUrl(best.providerSlug, { sourceCurrency: corridor.fromCurrency, targetCurrency: corridor.toCurrency })}
                    provider={best.providerSlug}
                    corridor={`${corridor.fromCurrency}-${corridor.toCurrency}`}
                    source="corridor_best_provider"
                    className="inline-flex items-center h-9 px-5 text-2sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary-surface)] transition-colors"
                  >
                    Visit {getProviderName(best.providerSlug)}
                  </ProviderLink>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ─── Crypto / stablecoin rails — secondary block below the affiliate
           comparison. Renders only when we have rail data for this corridor;
           its CTA is a "how it works" path, not an affiliate link, so it never
           competes with provider_clicked. ─── */}
      <section className="py-2 bg-[var(--color-surface-dim)]">
        <Container>
          <CryptoRailSection from={fromCurrency} to={toCurrency} amount={sampleAmount} />
        </Container>
      </section>

      {/* ─── WhatsApp channel — genuinely post-results now. It used to sit below
           the FAQ and both "more for this corridor" rails, i.e. past everything,
           so almost nobody scrolled to it. Here it follows the affiliate
           comparison and the crypto block but precedes the long-form content,
           and like CryptoRailSection it is not an affiliate link, so it never
           competes with provider_clicked. ─── */}
      <Container className="py-6">
        <WhatsAppInlineCTA
          source="corridor_results_inline"
          from={fromCurrency}
          to={toCurrency}
          corridorSlug={slug}
        />
      </Container>

      {/* ─── Guides, fees & details — collapsed on mobile so live results stay near the fold.
           All content remains in the DOM for AI citation, FAQ schema, and link equity. ─── */}
      <MobileDetailsRail label="Guides, fees & how it works">

      {editorialNote && (
        <section id="editorial-analysis" className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
              <Card>
                <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-3">
                  {editorialNote.title}
                </h2>
                <p className="editorial-note text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-5" data-ai-cite="true">
                  {editorialNote.summary}
                </p>
                <ul className="space-y-3">
                  {editorialNote.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                      <span className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-[var(--color-surface-dim)]">
                <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-3">
                  {editorialNote.warningTitle}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                  {editorialNote.warningBody}
                </p>
                <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                  For recurring transfers, it is worth checking live quotes each time rather than relying on one provider by habit. Competition on this corridor is strong enough that rankings can shift meaningfully with market moves.
                </p>
                {corridorRelatedNews[slug] && (
                  <div className="pt-3 border-t border-[var(--color-outline)]">
                    <p className="text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                      In the news
                    </p>
                    <Link
                      href={`/news/${corridorRelatedNews[slug].slug}`}
                      className="text-2sm text-[var(--color-primary)] hover:underline leading-snug block"
                    >
                      {corridorRelatedNews[slug].label} →
                    </Link>
                  </div>
                )}
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
          { label: "Cheapest transfer", Icon: PiggyBank, provider: cheapest, reason: `Delivers the most ${toCurrency} for your money` },
          { label: "Fastest transfer", Icon: Zap, provider: fastest, reason: fastest ? `Delivers in ${fastest.transferSpeed}` : "" },
          { label: "Cash pickup", Icon: Store, provider: cashPickup, reason: "Widest cash pickup network" },
          { label: "Bank transfer", Icon: Landmark, provider: bankTransfer, reason: `Best rate for bank deposit to ${corridor.isCurrencyCorridor ? toCurrency : corridor.toCountry}` },
        ].filter((c): c is { label: string; Icon: LucideIcon; provider: NonNullable<typeof cheapest>; reason: string } => Boolean(c.provider));

        return (
          <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Which provider is best for each transfer type?
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                Different providers excel at different things. Here&apos;s who&apos;s best for each use case on the {headingFrom} to {headingTo} route.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map(({ label, Icon, provider: quote, reason }) => {
                  const name = getProviderName(quote!.providerSlug);
                  const p = providers.find((pp) => pp.slug === quote!.providerSlug);
                  const logo = providerLogo(quote!.providerSlug, p?.logo);
                  return (
                    <div key={label} className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl p-5">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-outline)]/60 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                      </div>
                      <p className="text-[11px] font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">{label}</p>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface)] flex items-center justify-center relative">
                          <Image src={logo} alt={name} width={32} height={32} className="w-full h-full object-contain p-1" />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-on-surface)]">{name}</p>
                      </div>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{reason}</p>
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* ─── How to Send Money ─── */}
      {countryDetails && (() => {
        const howToSteps: { step: number; Icon: LucideIcon; title: string; description: string }[] = [
          { step: 1, Icon: ClipboardList, title: "Enter your transfer details", description: `Choose how much ${fromCurrency} you want to send, compare providers above, and pick the one offering the best ${toCurrency} amount for your transfer to ${corridor.toCountry}.` },
          { step: 2, Icon: UserPlus, title: "Add your recipient", description: `Enter your recipient's details in ${corridor.toCountry}${countryDetails.recipientRequirements[1] ? ` — you'll need their ${countryDetails.recipientRequirements[1].label.toLowerCase()}` : ""}. Complete the provider’s verification before expecting delivery.` },
          { step: 3, Icon: Rocket, title: "Send & track your transfer", description: "Choose an available funding method, confirm the final payout and arrival estimate, then keep your tracking reference." },
        ];
        return (
        <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
          {/* HowTo structured data — matches the 3 visible steps. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: `How to send money to ${corridor.toCountry}`,
                description: `Send ${fromCurrency} to ${toCurrency} in 3 steps using a regulated money transfer provider.`,
                step: howToSteps.map((s) => ({
                  "@type": "HowToStep",
                  position: s.step,
                  name: s.title,
                  text: s.description,
                })),
              }),
            }}
          />
          <Container>
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
              How to send money to {corridor.toCountry}
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Sending money to {corridor.toCountry} is straightforward with the right provider. Here&apos;s how it works in 3 simple steps.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {howToSteps.map(({ step, Icon, title, description }) => (
                <div key={step} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary-surface)] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--color-on-surface-muted)] uppercase tracking-wider tabular-nums">Step {step}</span>
                  </div>
                  <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-2">{title}</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
        );
      })()}

      {/* ─── What You Need (Recipient Requirements) ─── */}
      {countryDetails && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                What you need to send money to {corridor.toCountry}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
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
                        <p className="text-sm font-medium text-[var(--color-on-surface)]">{req.label}</p>
                        {!req.required && (
                          <span className="text-2xs font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded">Optional</span>
                        )}
                      </div>
                      <p className="text-2sm text-[var(--color-on-surface-variant)] mt-0.5 leading-relaxed">{req.description}</p>
                      {req.example && (
                        <p className="text-xs text-[var(--color-primary)] mt-1 font-mono">Example: {req.example}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {countryDetails.sources && <p className="mt-3 mb-3 text-xs text-[var(--color-on-surface-variant)]">Provider sources for these receiving options: {countryDetails.sources.map((source, index) => <span key={source.url}>{index > 0 && " · "}<a href={source.url} className="underline">{source.label}</a></span>)}</p>}
              {countryDetails.requirementsNote && (
                <div className="mt-4 bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20 rounded-lg px-5 py-4">
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">
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
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Transfer examples: {fromCurrency} to {toCurrency}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                See how much your recipient would get for common transfer amounts.
              </p>
              <div className="space-y-6">
                {exampleData.map(({ amount, quotes: exQuotes }) => (
                  <div key={amount}>
                    <h3 className="text-base font-medium text-[var(--color-on-surface)] mb-3">
                      Send {sendSymbol}{amount.toLocaleString()}
                    </h3>
                    {exQuotes.length > 0 ? (
                      <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                        {/* Mobile — 3-col condensed (Provider / Fee / Receives) */}
                        <div className="sm:hidden">
                          <div className="grid grid-cols-[1fr_70px_100px] gap-2 px-4 py-2.5 bg-[var(--color-surface-container)] text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                            <span>Provider</span>
                            <span className="text-right">Fee</span>
                            <span className="text-right">Receives</span>
                          </div>
                          {exQuotes.map((q, i) => (
                            <div
                              key={q.providerSlug}
                              className={`grid grid-cols-[1fr_70px_100px] gap-2 items-center px-4 py-2.5 border-t border-[var(--color-outline)] ${i === 0 ? "bg-[var(--color-success-surface-dim)]" : ""}`}
                            >
                              <div className="min-w-0">
                                <p className={`text-2sm font-medium truncate ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                                  {getProviderName(q.providerSlug)}
                                </p>
                                <p className="text-2xs text-[var(--color-on-surface-variant)] truncate">
                                  {q.exchangeRate.toFixed(2)} · {q.transferSpeed}
                                </p>
                              </div>
                              <span className="text-2sm text-[var(--color-on-surface)] text-right tabular-nums">
                                {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                              </span>
                              <span className={`text-2sm font-medium text-right tabular-nums ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                                {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Desktop — full 5-col */}
                        <div className="hidden sm:block">
                          <div className="grid grid-cols-[1fr_80px_80px_100px_100px] gap-2 px-5 py-2.5 bg-[var(--color-surface-container)] text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                            <span>Provider</span>
                            <span className="text-right">Fee</span>
                            <span className="text-right">Rate</span>
                            <span className="text-right">Receives</span>
                            <span className="text-right">Speed</span>
                          </div>
                          {exQuotes.map((q, i) => (
                            <div
                              key={q.providerSlug}
                              className={`grid grid-cols-[1fr_80px_80px_100px_100px] gap-2 items-center px-5 py-2.5 border-t border-[var(--color-outline)] ${i === 0 ? "bg-[var(--color-success-surface-dim)]" : ""}`}
                            >
                              <span className={`text-2sm font-medium truncate ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                                {getProviderName(q.providerSlug)}
                              </span>
                              <span className="text-2sm text-[var(--color-on-surface)] text-right tabular-nums">
                                {q.fee === 0 ? "Free" : `${sendSymbol}${q.fee.toFixed(2)}`}
                              </span>
                              <span className="text-2sm text-[var(--color-on-surface)] text-right tabular-nums">
                                {q.exchangeRate.toFixed(2)}
                              </span>
                              <span className={`text-2sm font-medium text-right tabular-nums ${i === 0 ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface)]"}`}>
                                {receiveSymbol}{q.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                              <span className="text-2xs text-[var(--color-on-surface-variant)] text-right">
                                {q.transferSpeed}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-2sm text-[var(--color-on-surface-variant)]">No quotes available.</p>
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
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-4">
              {isCurrencyCorridor ? `How much does it cost to convert ${fromCurrency} to ${toCurrency}?` : `How much does it cost to send money from ${corridor.fromCountry} to ${corridor.toCountry}?`}
            </h2>
            <div className="text-sm md:text-md text-[var(--color-on-surface-variant)] leading-relaxed space-y-4">
              <p>{corridor.feesNote}</p>
              <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl p-5">
                <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">Understanding the total cost</h3>
                <p className="text-2sm text-[var(--color-on-surface-variant)] mb-3">
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
                      <p className="text-2sm font-medium text-[var(--color-on-surface)]">Transfer fee</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">
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
                      <p className="text-2sm font-medium text-[var(--color-on-surface)]">Exchange rate markup</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">
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

        const costColors = { low: "text-[var(--color-success-dark)] bg-[var(--color-success-surface)]", medium: "text-[var(--color-warning-dark)] bg-[var(--color-warning-surface)]", high: "text-[var(--color-danger)] bg-[var(--color-danger-surface)]" };
        const costLabels = { low: "Low cost", medium: "Medium cost", high: "Higher cost" };

        return (
          <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Ways to send money to {corridor.toCountry}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                Choose how you want to pay for your transfer. Each payment method has different costs and speeds.
              </p>
              {countryDetails.receivingNote && (
                <p className="text-2sm text-[var(--color-on-surface-variant)] mb-4 leading-relaxed">{countryDetails.receivingNote}</p>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map(([method, info]) => (
                  <div key={method} className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-medium text-[var(--color-on-surface)]">{method}</h3>
                      <span className={`text-2xs font-medium px-2 py-0.5 rounded-full ${costColors[info.costLevel]}`}>
                        {costLabels[info.costLevel]}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">
                      <span className="font-medium text-[var(--color-on-surface)]">Speed:</span> {info.speed}
                    </p>
                    <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{info.note}</p>
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
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
              How can my recipient receive money in {corridor.toCountry}?
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Check these receiving options with the provider. Availability depends on the sending country, recipient and transfer conditions.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {countryDetails.deliveryMethods.map((dm) => {
                const m = dm.method.toLowerCase();
                const DeliveryIcon: LucideIcon =
                  m.includes("bank") ? Landmark :
                  m.includes("cash") ? Banknote :
                  (m.includes("wallet") || m.includes("pesa") || m.includes("jazz") || m.includes("gcash") || m.includes("easy") || m.includes("dana") || m.includes("ovo") || m.includes("pix") || m.includes("nequi") || m.includes("alipay") || m.includes("wechat")) ? Smartphone :
                  (m.includes("home") || m.includes("door")) ? Home :
                  m.includes("airtime") ? Radio :
                  m.includes("faster") ? Zap :
                  Send;
                return (
                <div key={dm.method} className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <DeliveryIcon className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                    <h3 className="text-base font-medium text-[var(--color-on-surface)]">{dm.method}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-surface)] px-2 py-0.5 rounded-full">
                      {dm.speed}
                    </span>
                  </div>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed mb-3">{dm.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dm.providers.slice(0, 4).map((pSlug) => (
                      <span key={pSlug} className="text-2xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface)] border border-[var(--color-outline)] px-2 py-0.5 rounded">
                        {getProviderName(pSlug)}
                      </span>
                    ))}
                    {dm.providers.length > 4 && (
                      <span className="text-2xs text-[var(--color-on-surface-variant)] px-1">
                        +{dm.providers.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                );
              })}
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
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                How do bank rates compare for {fromCurrency} to {toCurrency}?
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
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
                        <span className={`text-2sm font-semibold tabular-nums w-5 text-center shrink-0 ${isBestBank ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {i + 1}
                        </span>

                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center text-sm font-semibold text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50">
                          {br.provider.charAt(0)}
                        </div>

                        <div className="min-w-[140px] shrink-0">
                          <p className={`text-sm font-medium text-[var(--color-on-surface)] ${isBestBank ? "text-md" : ""}`}>
                            {br.provider}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-2xs font-semibold tracking-wide uppercase px-1.5 py-px rounded ${br.providerType === "BANK" ? "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)]" : "text-[var(--color-primary)] bg-[var(--color-primary-surface)]"}`}>
                              {br.providerType === "BANK" ? "Bank" : "Broker"}
                            </span>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-6 flex-1 min-w-0">
                          <div className="w-[110px] shrink-0">
                            <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Speed</p>
                            <p className="text-2sm text-[var(--color-on-surface)] mt-0.5">{br.deliveryEstimate || "1-3 days"}</p>
                          </div>
                          <div className="w-[80px] shrink-0">
                            <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Fee</p>
                            <p className={`text-2sm mt-0.5 ${br.fee === 0 ? "text-[var(--color-success-dark)] font-medium" : "text-[var(--color-on-surface)]"}`}>
                              {br.fee === 0 ? "Free" : `${sendSymbol}${br.fee.toFixed(2)}`}
                            </p>
                          </div>
                          <div className="w-[90px] shrink-0">
                            <p className="text-2xs text-[var(--color-on-surface-variant)] uppercase tracking-wide font-medium">Rate</p>
                            <p className="text-2sm text-[var(--color-on-surface)] mt-0.5 tabular-nums">{br.exchangeRate.toFixed(4)}</p>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0" />

                        <div className="text-right shrink-0">
                          <p className={`tabular-nums font-semibold tracking-tight ${isBestBank ? "text-h4 sm:text-2xl text-[var(--color-success-dark)]" : "text-lg sm:text-xl text-[var(--color-on-surface)]"}`}>
                            {receiveSymbol}{br.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-2xs text-[var(--color-on-surface-variant)] mt-0.5">Recipient gets</p>
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="flex sm:hidden items-start gap-3">
                        <span className={`text-xs font-semibold tabular-nums w-4 text-center mt-1 shrink-0 ${isBestBank ? "text-[var(--color-success-dark)]" : "text-[var(--color-on-surface-variant)]"}`}>
                          {i + 1}
                        </span>
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center text-2sm font-semibold text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]/50">
                          {br.provider.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">{br.provider}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-2xs font-semibold tracking-wide uppercase px-1.5 py-px rounded ${br.providerType === "BANK" ? "text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)]" : "text-[var(--color-primary)] bg-[var(--color-primary-surface)]"}`}>
                                  {br.providerType === "BANK" ? "Bank" : "Broker"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`tabular-nums font-semibold tracking-tight ${isBestBank ? "text-lg text-[var(--color-success-dark)]" : "text-base text-[var(--color-on-surface)]"}`}>
                                {receiveSymbol}{br.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-2xs text-[var(--color-on-surface-variant)]">
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
                  <p className="text-sm text-[var(--color-success-dark)]">
                    Even among banks, the difference is significant — {bankRates[0].provider} delivers{" "}
                    <strong>
                      {receiveSymbol}{bankSpread.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>{" "}
                    more than {bankRates[bankRates.length - 1].provider} on a {sendSymbol}{sampleAmount.toLocaleString()} transfer.
                  </p>
                </div>
              )}

              {sourceUrl && (
                <p className="mt-4 text-xs text-[var(--color-on-surface-variant)]">
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
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                What are the transfer limits and regulations for {corridor.toCountry}?
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                Important rules and requirements to know before sending money to {corridor.toCountry}.
              </p>

              <div className="space-y-5">
                {countryDetails.regulations.regulatoryBody && (
                  <div className="flex items-start gap-3">
                    <Landmark className="w-5 h-5 mt-0.5 text-[var(--color-primary)] shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">Regulatory body</p>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">{countryDetails.regulations.regulatoryBody}</p>
                    </div>
                  </div>
                )}

                {countryDetails.regulations.inboundLimit && (
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">Inbound transfer limits</p>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">{countryDetails.regulations.inboundLimit}</p>
                    </div>
                  </div>
                )}

                {countryDetails.regulations.documentationNeeded.length > 0 && (
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="w-5 h-5 mt-0.5 text-[var(--color-primary)] shrink-0" strokeWidth={1.75} />
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">Documentation you may need</p>
                    </div>
                    <ul className="space-y-2 pl-9">
                      {countryDetails.regulations.documentationNeeded.map((doc) => (
                        <li key={doc} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {countryDetails.regulations.importantNotes.length > 0 && (
                  <div className="bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/20 rounded-xl p-5 mt-4">
                    <h3 className="text-sm font-medium text-[var(--color-on-surface)] mb-3">Important things to know</h3>
                    <ul className="space-y-2">
                      {countryDetails.regulations.importantNotes.map((note) => (
                        <li key={note} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 mt-1.5" />
                          <span className="text-2sm text-[var(--color-on-surface-variant)] leading-relaxed">{note}</span>
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
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-4">
              {isCurrencyCorridor ? `How long does a ${fromCurrency} to ${toCurrency} transfer take?` : `How long does it take to send money to ${corridor.toCountry}?`}
            </h2>
            <p className="text-sm md:text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
              {corridor.deliveryNote}
            </p>
            {/* Delivery times on this page are ADVERTISED, not measured.
                The 2026-09-06 census found speed data exists across ~4,200
                quotes and six sources, but every one of them is the provider's
                own published estimate — two are single-valued constants — and
                nothing in the pipeline records when a transfer actually landed.
                The prose says things like "GCash transfers arrive within
                minutes" in 29 places, which reads as measured performance.
                Rewriting those individually is editorial work; stating the
                basis once, next to the claim, is accurate now and does not
                invent precision. Do not upgrade this wording to imply we
                verified arrival times until something in the pipeline does. */}
            <p className="text-2xs text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
              Delivery times shown here are published by the providers and payment schemes. We
              do not measure when transfers actually arrive, so treat them as estimates and
              confirm the time with your provider before you send.
            </p>

            {(fastProviders.length > 0 || standardProviders.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {fastProviders.length > 0 && (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-outline)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xs text-[var(--color-success)] border border-[var(--color-success)] rounded px-1.5 py-0 leading-[18px] font-medium">Fast</span>
                      <span className="text-2sm font-medium text-[var(--color-on-surface)]">Express delivery</span>
                    </div>
                    <ul className="space-y-2">
                      {fastProviders.slice(0, 5).map((q) => (
                        <li key={q.providerSlug} className="flex justify-between text-2sm">
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
                      <span className="text-2sm font-medium text-[var(--color-on-surface)]">Standard delivery</span>
                    </div>
                    <ul className="space-y-2">
                      {standardProviders.slice(0, 5).map((q) => (
                        <li key={q.providerSlug} className="flex justify-between text-2sm">
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
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Popular banks in {corridor.toCountry}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
                These are the most commonly used banks for receiving international transfers in {corridor.toCountry}.
              </p>
              <div className="bg-[var(--color-surface-dim)] border border-[var(--color-outline)] rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_140px_1fr] gap-2 px-4 sm:px-6 py-3 bg-[var(--color-surface-container)] text-2xs font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                  <span>Bank</span>
                  <span>SWIFT/BIC</span>
                  <span className="hidden sm:block">Notes</span>
                </div>
                {countryDetails.popularBanks.map((bank) => (
                  <div key={bank.name} className="grid grid-cols-[1fr_140px_1fr] gap-2 items-center px-4 sm:px-6 py-3 border-t border-[var(--color-outline)]">
                    <p className="text-2sm font-medium text-[var(--color-on-surface)]">{bank.name}</p>
                    <p className="text-xs font-mono text-[var(--color-on-surface-variant)]">{bank.swiftCode || "—"}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] hidden sm:block">{bank.notes || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Rate History ─── */}
      {rateInsight && rateInsight.totalDays >= 3 && (
        <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
          <Container>
            {/* SendScore leads the history section: the timing answer first,
                then the chart that evidences it. Null when the corridor has
                under 7 days of history, in which case nothing renders. */}
            {rateInsight.sendScore && (
              <div className="mb-6">
                <SendScoreCard
                  score={rateInsight.sendScore}
                  fromCurrency={fromCurrency}
                  toCurrency={toCurrency}
                  consistency={rateInsight.providerConsistency}
                />
              </div>
            )}
            <RateHistorySection
              insight={rateInsight}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
            />
            {/* /exchange-rates/history/[pair] sets dynamicParams=false and keeps a
                small allowlist, so this link only exists for pairs that render —
                it was unconditional, producing 620 links to 404s. */}
            <div className="mt-4" hidden={!rateHistoryHref(`${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}`)}>
              <Link
                href={rateHistoryHref(`${fromCurrency.toLowerCase()}-to-${toCurrency.toLowerCase()}`) ?? "/exchange-rates/history"}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                See full {fromCurrency}/{toCurrency} rate history and charts
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* ─── English deep-content block for high-impression target corridors ─── */}
      {corridorDeepBlocks[slug] && (
        <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-4">
                {corridorDeepBlocks[slug].h2}
              </h2>
              <p className="text-sm md:text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
                {corridorDeepBlocks[slug].intro}
              </p>
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                Frequently asked questions
              </h3>
              <div className="divide-y divide-[var(--color-outline)]">
                {corridorDeepBlocks[slug].faqs.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm md:text-md font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                      {faq.q}
                      <svg
                        className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Swedish content block (sweden-* corridors only) ─── */}
      {swedishCorridorBlocks[slug] && (
        <section className="py-10 bg-[var(--color-surface-dim)] border-t border-[var(--color-outline)]" lang="sv">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-4">
                {swedishCorridorBlocks[slug].h2}
              </h2>
              <p className="text-sm md:text-md text-[var(--color-on-surface-variant)] leading-relaxed mb-6">
                {swedishCorridorBlocks[slug].intro}
              </p>
              <h3 className="text-md font-medium text-[var(--color-on-surface)] mb-3">
                Vanliga frågor
              </h3>
              <div className="divide-y divide-[var(--color-outline)]">
                {swedishCorridorBlocks[slug].faqs.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm md:text-md font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                      {faq.q}
                      <svg
                        className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      </MobileDetailsRail>

      {/* ─── FAQ — collapsed on mobile; FAQPage schema preserved in DOM ─── */}
      <MobileDetailsRail label="Frequently asked questions">
      <section id="faq" className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-6">
              Common questions about sending money from {headingFrom} to {headingTo}
            </h2>
            <div className="divide-y divide-[var(--color-outline)]">
              {resolvedFaqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-md font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
                    {faq.q}
                    <svg
                      className="w-5 h-5 shrink-0 ml-4 text-[var(--color-on-surface-variant)] group-open:rotate-180 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed pr-8">
                    {faq.a}
                  </p>
                  {faq.sources && (
                    <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
                      Sources: {faq.sources.map((source, index) => (
                        <span key={source.url}>
                          {index > 0 && " · "}
                          <a href={source.url} className="underline hover:text-[var(--color-primary)]">{source.label}</a>
                        </span>
                      ))}
                    </p>
                  )}
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      </MobileDetailsRail>

      {/* ─── Related: country sender list + country guide banner — collapsed on mobile ─── */}
      <MobileDetailsRail label="More for this corridor">

      {/* ─── Send from Specific Countries (country pages only) ─── */}
      {isCountryPage && (() => {
        const relatedCorridors = allCorridors
          .filter((c) => !c.isCurrencyCorridor && !c.isCountryPage && c.toCountry === corridor.toCountry)
          // corridorPageRenders, not just !GONE: Tier 3 corridors are outside
          // generateStaticParams and the route sets dynamicParams=false, so
          // linking one is a link to a 404. This rail alone accounted for a
          // large share of the 2,100 corridor→404 links found on 2026-09-02.
          .filter((c) => corridorPageRenders(c.slug))
          .slice(0, 8);
        if (relatedCorridors.length === 0) return null;
        return (
          <section className="py-10 bg-[var(--color-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <h2 className="text-h4 md:text-h3 font-normal text-[var(--color-on-surface)] mb-2">
                Send money to {corridor.toCountry} from these countries
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
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
                      <p className="text-2sm font-medium text-[var(--color-on-surface)]">{c.fromCountry}</p>
                      <p className="text-2xs text-[var(--color-on-surface-variant)]">{c.fromCurrency} → {toCurrency}</p>
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
        // Defined in the corridor data is not the same as prerendered.
        if (!corridorPageRenders(countryPageSlug)) return null;
        return (
          <section className="py-6 bg-[var(--color-primary-surface)] border-t border-[var(--color-outline)]">
            <Container>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl">
                <div>
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">
                    Everything about sending money to {corridor.toCountry}
                  </p>
                  <p className="text-2sm text-[var(--color-on-surface-variant)] mt-0.5">
                    Recipient requirements, delivery methods, regulations, popular banks, and more.
                  </p>
                </div>
                <Link
                  href={`/send-money/${countryPageSlug}`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-cta)] text-[var(--color-cta-text)] text-2sm font-medium hover:bg-[var(--color-cta-hover)] transition-opacity"
                >
                  {corridor.toFlag} {corridor.toCountry} guide →
                </Link>
              </div>
            </Container>
          </section>
        );
      })()}

      </MobileDetailsRail>

      {/* ─── Cross-links ─── */}
      {/* "More transfers from X" + "Other routes to Y" together form the horizontal
         corridor graph — without them every /send-money/X-to-Y is a leaf node and
         link equity from the hub can't flow laterally. Both axes are sorted to put
         GSC-validated corridors (in SITEMAP_CORRIDOR_SLUGS) first so the link
         targets are pages that have already shown ranking signal. */}
      <CrossLinks
        background="white"
        sections={[
          {
            title: `More transfers from ${corridor.fromCountry}`,
            // Match on fromCountry, not fromCurrency: Germany sender ≠ Belgium
            // sender even though both use EUR. The label would otherwise lie.
            links: allCorridors
              .filter((c) => c.fromCountry === corridor.fromCountry && c.toCountry !== corridor.toCountry && !c.isCurrencyCorridor && !c.isCountryPage && c.slug !== slug)
              .filter((c) => corridorPageRenders(c.slug))
              .sort((a, b) => Number(SITEMAP_CORRIDOR_SLUGS.has(b.slug)) - Number(SITEMAP_CORRIDOR_SLUGS.has(a.slug)))
              .slice(0, 5)
              .map((c) => ({
                href: `/send-money/${c.slug}`,
                label: `${c.fromCountry} to ${c.toCountry}`,
              })),
          },
          {
            title: `Other routes to ${corridor.toCountry}`,
            // Match on toCountry, not toCurrency: "routes to Germany" labelled
            // as "France → Belgium" would be misleading even though both use EUR.
            links: allCorridors
              .filter((c) => c.toCountry === corridor.toCountry && c.fromCountry !== corridor.fromCountry && !c.isCurrencyCorridor && !c.isCountryPage && c.slug !== slug)
              .filter((c) => corridorPageRenders(c.slug))
              .sort((a, b) => Number(SITEMAP_CORRIDOR_SLUGS.has(b.slug)) - Number(SITEMAP_CORRIDOR_SLUGS.has(a.slug)))
              .slice(0, 5)
              .map((c) => ({
                href: `/send-money/${c.slug}`,
                label: `${c.fromCountry} to ${c.toCountry}`,
              })),
          },
          {
            title: "Popular corridors",
            links: popularCorridors
              .filter((c) => c.from !== fromCurrency || c.to !== toCurrency)
              .slice(0, 5)
              .map((c) => {
                const seoSlug = getCorridorSlug(c.from, c.to);
                return {
                  href: seoSlug && corridorPageRenders(seoSlug)
                    ? `/send-money/${seoSlug}`
                    : `/send-money?from=${c.from}&to=${c.to}&amount=1000`,
                  label: c.label,
                };
              }),
          },
          {
            title: "Top provider reviews",
            // Scraped providerSlugs include banks with no review page; the
            // route renders them on demand, which is how 1,340 links pointed at
            // pages for slugs like "z-rcher-kantonalbank".
            links: quotes.filter((q) => companyPageRenders(q.providerSlug)).slice(0, 5).map((q) => ({
              href: `/companies/${q.providerSlug}`,
              label: `${getProviderName(q.providerSlug)} review`,
            })),
          },
          {
            // Prefer the corridor-specific guide (e.g. send-money-uk-to-india-guide)
            // over the country-wide one (send-money-to-india-guide) — Google sees ONE
            // clear parent guide per corridor instead of two competing links.
            // Generic site-wide links (compare, business, wire-transfer) were
            // duplicated across all 110 corridor pages, diluting equity; trimmed
            // to a focused set of 3 topical guides + the corridor's best parent.
            title: "Useful guides",
            links: [
              ...(() => {
                const best = getBestGuideLink(corridor.fromCountry, corridor.toCountry);
                return best ? [best] : [];
              })(),
              { href: "/guides/cheapest-way-to-send-money-internationally", label: "Cheapest way to send money" },
              { href: "/guides/exchange-rate-markup-explained", label: "Exchange rate markup explained" },
              { href: "/guides/money-transfer-safety-guide", label: "Are money transfer companies safe?" },
            ],
          },
          {
            title: "Banking tools",
            links: [
              { href: `/swift-codes/${swiftSlugForCountry(corridor.toCountry)}`, label: `${corridor.toCountry} SWIFT/BIC codes` },
              ...(ibanSlugForCountry(corridor.toCountry) ? [{ href: `/iban/${ibanSlugForCountry(corridor.toCountry)}`, label: `${corridor.toCountry} IBAN format` }] : []),
              { href: "/swift-codes", label: "SWIFT code lookup" },
              { href: "/iban", label: "IBAN number checker" },
              { href: "/guides/swift-codes-explained", label: "SWIFT codes explained" },
              { href: "/guides/iban-numbers-explained", label: "IBAN numbers explained" },
            ].filter((l) => !l.href.includes("undefined")),
          },
          {
            // Bank comparison surface — surfaces relevant pilot banks based on
            // the sending currency. The bank pages exist to capture branded
            // queries (e.g. "wells fargo international transfer fee") while
            // routing equity from corridor pages — a hub-and-spoke design.
            title: "How does your bank compare?",
            links: (() => {
              const banksForCurrency: Record<string, { slug: string; name: string }[]> = {
                USD: [
                  { slug: "wells-fargo", name: "Wells Fargo" },
                  { slug: "chase", name: "Chase" },
                ],
                GBP: [
                  { slug: "hsbc", name: "HSBC" },
                  { slug: "lloyds", name: "Lloyds Bank" },
                  { slug: "barclays", name: "Barclays" },
                ],
              };
              const banks = banksForCurrency[fromCurrency] || [];
              return [
                ...banks.map((b) => ({
                  href: `/banks/${b.slug}`,
                  label: `${b.name} international transfer fees`,
                })),
                { href: "/banks", label: "All bank transfer fees compared" },
              ];
            })(),
          },
        ]}
      />

      {/* ─── CTA ─── */}
      <section className="py-12 bg-[var(--color-surface-dim)]">
        <div className="max-w-lg mx-auto px-6 text-center">
          <h2 className="text-h4 font-normal text-[var(--color-on-surface)] mb-3">
            Compare all providers for {headingFrom} to {headingTo}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
            Enter your exact amount in the comparison tool above to see personalised quotes from every
            provider on this route.
          </p>
          {/* Anchors to the ComparisonWidget already on this page rather than
              navigating to /send-money?from=..&to=.. — a generic copy of the tool
              preloaded with the corridor the reader is already looking at. That
              link was on every corridor page, so it produced ~850 self-
              referential URLs which all canonicalise back to /send-money: crawl
              budget spent to reach a duplicate, on a site Google is barely
              crawling. A fragment is invisible to crawlers and keeps the reader
              in context. */}
          <PrimaryButton href="#compare-widget" size="lg">
            Compare providers now
          </PrimaryButton>

        </div>
      </section>

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              ...resolvedFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
              ...(swedishCorridorBlocks[slug]?.faqs ?? []).map((faq) => ({
                "@type": "Question",
                name: faq.q,
                inLanguage: "sv",
                acceptedAnswer: { "@type": "Answer", text: faq.a, inLanguage: "sv" },
              })),
              ...(corridorDeepBlocks[slug]?.faqs ?? []).map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            ],
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
            // The mid-market instant this rate came from. dataUpdatedISO is
            // day-truncated to midnight, which dressed a date up as a time.
            validFrom: SITE_STATS.midMarketUpdatedAt,
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
              description: comparison.answer,
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
              // Only cite a url for providers that have a review page. A
              // ListItem url pointing at a 404 is a broken structured-data
              // reference, and scraped bank slugs have no page.
              itemListElement: quotes.slice(0, 10).map((q, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: getProviderName(q.providerSlug),
                ...(companyPageRenders(q.providerSlug) && {
                  url: `https://sendmoneycompare.com/companies/${q.providerSlug}`,
                }),
              })),
            }),
          }}
        />
      )}

      {/* Sticky best-provider CTA — appears on scroll. Floating chat bot sits at bottom-right;
          this bar sits above it so the two don't overlap on mobile. */}
      {best && (
        <StickyBestCTA
          providerSlug={best.providerSlug}
          providerName={getProviderName(best.providerSlug)}
          providerLogo={providerLogo(best.providerSlug, providers.find((p) => p.slug === best.providerSlug)?.logo)}
          providerUrl={getGoUrl(best.providerSlug, { sourceCurrency: fromCurrency, targetCurrency: toCurrency, sourceAmount: sampleAmount, clickref: "sticky_cta" })}
          receiveAmount={best.receiveAmount}
          receiveSymbol={receiveSymbol}
          fee={best.fee}
          sendSymbol={sendSymbol}
          savingsVsWorst={savings > 0 ? savings : undefined}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
        />
      )}
    </>
  );
}
