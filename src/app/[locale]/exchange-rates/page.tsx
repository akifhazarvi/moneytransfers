import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import LiveRatesBoard from "./LiveRatesBoard";
import TodayRates from "./TodayRates";
import LazyHistoricalRateWidget from "@/components/LazyHistoricalRateWidget";
import LiveTimestamp from "@/components/LiveTimestamp";
import SendVerdictHero, { type VerdictData } from "@/components/SendVerdictHero";
import { fetchExchangeRates } from "@/lib/exchange-rates";
import { getAlternates } from "@/lib/i18n-metadata";
import { getPairRate, formatRate, getSendVerdict, RATES_AS_OF } from "@/lib/exchange-rates-today";

// Revalidate hourly so "today's rate" + the as-of date stay fresh while the
// page stays fully prerendered (no per-request no-store — the May deindex
// root cause). The mid-market history dataset only changes daily.
export const revalidate = 3600;

const AS_OF = RATES_AS_OF
  ? new Date(RATES_AS_OF + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
  : "today";

// Curated corridor picker — popular send currencies → top diaspora destinations
// (kept short on purpose; the full list lives in the rate table below).
const HERO_CORRIDORS = [
  // USD — 62 destinations
  { from: "USD", to: "INR", label: "USD → INR" },
  { from: "USD", to: "PHP", label: "USD → PHP" },
  { from: "USD", to: "MXN", label: "USD → MXN" },
  { from: "USD", to: "PKR", label: "USD → PKR" },
  { from: "USD", to: "NGN", label: "USD → NGN" },
  { from: "USD", to: "EUR", label: "USD → EUR" },
  { from: "USD", to: "GBP", label: "USD → GBP" },
  { from: "USD", to: "CAD", label: "USD → CAD" },
  { from: "USD", to: "AUD", label: "USD → AUD" },
  { from: "USD", to: "AED", label: "USD → AED" },
  { from: "USD", to: "BDT", label: "USD → BDT" },
  { from: "USD", to: "CNY", label: "USD → CNY" },
  { from: "USD", to: "EGP", label: "USD → EGP" },
  { from: "USD", to: "GHS", label: "USD → GHS" },
  { from: "USD", to: "IDR", label: "USD → IDR" },
  { from: "USD", to: "JPY", label: "USD → JPY" },
  { from: "USD", to: "KES", label: "USD → KES" },
  { from: "USD", to: "KRW", label: "USD → KRW" },
  { from: "USD", to: "LKR", label: "USD → LKR" },
  { from: "USD", to: "MAD", label: "USD → MAD" },
  { from: "USD", to: "MYR", label: "USD → MYR" },
  { from: "USD", to: "NPR", label: "USD → NPR" },
  { from: "USD", to: "PEN", label: "USD → PEN" },
  { from: "USD", to: "PLN", label: "USD → PLN" },
  { from: "USD", to: "RON", label: "USD → RON" },
  { from: "USD", to: "THB", label: "USD → THB" },
  { from: "USD", to: "TRY", label: "USD → TRY" },
  { from: "USD", to: "TWD", label: "USD → TWD" },
  { from: "USD", to: "UAH", label: "USD → UAH" },
  { from: "USD", to: "VND", label: "USD → VND" },
  { from: "USD", to: "ZAR", label: "USD → ZAR" },
  { from: "USD", to: "BRL", label: "USD → BRL" },
  { from: "USD", to: "COP", label: "USD → COP" },
  { from: "USD", to: "HUF", label: "USD → HUF" },
  { from: "USD", to: "ILS", label: "USD → ILS" },
  { from: "USD", to: "CZK", label: "USD → CZK" },
  { from: "USD", to: "UZS", label: "USD → UZS" },
  { from: "USD", to: "XAF", label: "USD → XAF" },
  { from: "USD", to: "XOF", label: "USD → XOF" },
  { from: "USD", to: "ZMW", label: "USD → ZMW" },
  { from: "USD", to: "TZS", label: "USD → TZS" },
  { from: "USD", to: "UGX", label: "USD → UGX" },
  { from: "USD", to: "RWF", label: "USD → RWF" },
  { from: "USD", to: "KZT", label: "USD → KZT" },
  { from: "USD", to: "GEL", label: "USD → GEL" },
  { from: "USD", to: "MGA", label: "USD → MGA" },
  { from: "USD", to: "MZN", label: "USD → MZN" },
  { from: "USD", to: "GMD", label: "USD → GMD" },
  { from: "USD", to: "GNF", label: "USD → GNF" },
  { from: "USD", to: "DOP", label: "USD → DOP" },
  { from: "USD", to: "ARS", label: "USD → ARS" },
  { from: "USD", to: "BOB", label: "USD → BOB" },
  { from: "USD", to: "ETB", label: "USD → ETB" },
  { from: "USD", to: "FJD", label: "USD → FJD" },
  { from: "USD", to: "GTQ", label: "USD → GTQ" },
  { from: "USD", to: "HNL", label: "USD → HNL" },
  { from: "USD", to: "HTG", label: "USD → HTG" },
  { from: "USD", to: "JMD", label: "USD → JMD" },
  { from: "USD", to: "JOD", label: "USD → JOD" },
  { from: "USD", to: "KGS", label: "USD → KGS" },
  { from: "USD", to: "GHS", label: "USD → GHS" },
  { from: "USD", to: "EGP", label: "USD → EGP" },
  // GBP — 55 destinations
  { from: "GBP", to: "INR", label: "GBP → INR" },
  { from: "GBP", to: "PKR", label: "GBP → PKR" },
  { from: "GBP", to: "EUR", label: "GBP → EUR" },
  { from: "GBP", to: "NGN", label: "GBP → NGN" },
  { from: "GBP", to: "USD", label: "GBP → USD" },
  { from: "GBP", to: "AUD", label: "GBP → AUD" },
  { from: "GBP", to: "CAD", label: "GBP → CAD" },
  { from: "GBP", to: "AED", label: "GBP → AED" },
  { from: "GBP", to: "BDT", label: "GBP → BDT" },
  { from: "GBP", to: "CNY", label: "GBP → CNY" },
  { from: "GBP", to: "EGP", label: "GBP → EGP" },
  { from: "GBP", to: "GHS", label: "GBP → GHS" },
  { from: "GBP", to: "IDR", label: "GBP → IDR" },
  { from: "GBP", to: "KES", label: "GBP → KES" },
  { from: "GBP", to: "KRW", label: "GBP → KRW" },
  { from: "GBP", to: "LKR", label: "GBP → LKR" },
  { from: "GBP", to: "MAD", label: "GBP → MAD" },
  { from: "GBP", to: "MXN", label: "GBP → MXN" },
  { from: "GBP", to: "MYR", label: "GBP → MYR" },
  { from: "GBP", to: "NPR", label: "GBP → NPR" },
  { from: "GBP", to: "NZD", label: "GBP → NZD" },
  { from: "GBP", to: "PHP", label: "GBP → PHP" },
  { from: "GBP", to: "PLN", label: "GBP → PLN" },
  { from: "GBP", to: "RON", label: "GBP → RON" },
  { from: "GBP", to: "THB", label: "GBP → THB" },
  { from: "GBP", to: "TRY", label: "GBP → TRY" },
  { from: "GBP", to: "UAH", label: "GBP → UAH" },
  { from: "GBP", to: "VND", label: "GBP → VND" },
  { from: "GBP", to: "ZAR", label: "GBP → ZAR" },
  { from: "GBP", to: "BRL", label: "GBP → BRL" },
  { from: "GBP", to: "COP", label: "GBP → COP" },
  { from: "GBP", to: "ARS", label: "GBP → ARS" },
  { from: "GBP", to: "BOB", label: "GBP → BOB" },
  { from: "GBP", to: "ETB", label: "GBP → ETB" },
  { from: "GBP", to: "FJD", label: "GBP → FJD" },
  { from: "GBP", to: "GEL", label: "GBP → GEL" },
  { from: "GBP", to: "GMD", label: "GBP → GMD" },
  { from: "GBP", to: "GNF", label: "GBP → GNF" },
  { from: "GBP", to: "GTQ", label: "GBP → GTQ" },
  { from: "GBP", to: "HNL", label: "GBP → HNL" },
  { from: "GBP", to: "HTG", label: "GBP → HTG" },
  { from: "GBP", to: "JMD", label: "GBP → JMD" },
  { from: "GBP", to: "JOD", label: "GBP → JOD" },
  { from: "GBP", to: "KGS", label: "GBP → KGS" },
  { from: "GBP", to: "KZT", label: "GBP → KZT" },
  { from: "GBP", to: "MGA", label: "GBP → MGA" },
  { from: "GBP", to: "MZN", label: "GBP → MZN" },
  { from: "GBP", to: "PEN", label: "GBP → PEN" },
  { from: "GBP", to: "RWF", label: "GBP → RWF" },
  { from: "GBP", to: "TZS", label: "GBP → TZS" },
  { from: "GBP", to: "UAH", label: "GBP → UAH" },
  { from: "GBP", to: "UGX", label: "GBP → UGX" },
  { from: "GBP", to: "UZS", label: "GBP → UZS" },
  { from: "GBP", to: "XAF", label: "GBP → XAF" },
  { from: "GBP", to: "XOF", label: "GBP → XOF" },
  { from: "GBP", to: "ZMW", label: "GBP → ZMW" },
  { from: "GBP", to: "DOP", label: "GBP → DOP" },
  // EUR — 52 destinations
  { from: "EUR", to: "INR", label: "EUR → INR" },
  { from: "EUR", to: "USD", label: "EUR → USD" },
  { from: "EUR", to: "GBP", label: "EUR → GBP" },
  { from: "EUR", to: "PHP", label: "EUR → PHP" },
  { from: "EUR", to: "PKR", label: "EUR → PKR" },
  { from: "EUR", to: "NGN", label: "EUR → NGN" },
  { from: "EUR", to: "BDT", label: "EUR → BDT" },
  { from: "EUR", to: "CNY", label: "EUR → CNY" },
  { from: "EUR", to: "EGP", label: "EUR → EGP" },
  { from: "EUR", to: "GHS", label: "EUR → GHS" },
  { from: "EUR", to: "IDR", label: "EUR → IDR" },
  { from: "EUR", to: "KES", label: "EUR → KES" },
  { from: "EUR", to: "KRW", label: "EUR → KRW" },
  { from: "EUR", to: "LKR", label: "EUR → LKR" },
  { from: "EUR", to: "MAD", label: "EUR → MAD" },
  { from: "EUR", to: "MXN", label: "EUR → MXN" },
  { from: "EUR", to: "MYR", label: "EUR → MYR" },
  { from: "EUR", to: "NPR", label: "EUR → NPR" },
  { from: "EUR", to: "PLN", label: "EUR → PLN" },
  { from: "EUR", to: "THB", label: "EUR → THB" },
  { from: "EUR", to: "TRY", label: "EUR → TRY" },
  { from: "EUR", to: "UAH", label: "EUR → UAH" },
  { from: "EUR", to: "VND", label: "EUR → VND" },
  { from: "EUR", to: "ZAR", label: "EUR → ZAR" },
  { from: "EUR", to: "AUD", label: "EUR → AUD" },
  { from: "EUR", to: "BRL", label: "EUR → BRL" },
  { from: "EUR", to: "COP", label: "EUR → COP" },
  { from: "EUR", to: "ARS", label: "EUR → ARS" },
  { from: "EUR", to: "BOB", label: "EUR → BOB" },
  { from: "EUR", to: "ETB", label: "EUR → ETB" },
  { from: "EUR", to: "FJD", label: "EUR → FJD" },
  { from: "EUR", to: "GEL", label: "EUR → GEL" },
  { from: "EUR", to: "GMD", label: "EUR → GMD" },
  { from: "EUR", to: "GNF", label: "EUR → GNF" },
  { from: "EUR", to: "GTQ", label: "EUR → GTQ" },
  { from: "EUR", to: "HNL", label: "EUR → HNL" },
  { from: "EUR", to: "HTG", label: "EUR → HTG" },
  { from: "EUR", to: "JMD", label: "EUR → JMD" },
  { from: "EUR", to: "JOD", label: "EUR → JOD" },
  { from: "EUR", to: "KGS", label: "EUR → KGS" },
  { from: "EUR", to: "KZT", label: "EUR → KZT" },
  { from: "EUR", to: "MGA", label: "EUR → MGA" },
  { from: "EUR", to: "MZN", label: "EUR → MZN" },
  { from: "EUR", to: "PEN", label: "EUR → PEN" },
  { from: "EUR", to: "RWF", label: "EUR → RWF" },
  { from: "EUR", to: "TZS", label: "EUR → TZS" },
  { from: "EUR", to: "UGX", label: "EUR → UGX" },
  { from: "EUR", to: "UZS", label: "EUR → UZS" },
  { from: "EUR", to: "XAF", label: "EUR → XAF" },
  { from: "EUR", to: "XOF", label: "EUR → XOF" },
  { from: "EUR", to: "ZMW", label: "EUR → ZMW" },
  { from: "EUR", to: "DOP", label: "EUR → DOP" },
  // CAD — 52 destinations
  { from: "CAD", to: "INR", label: "CAD → INR" },
  { from: "CAD", to: "PHP", label: "CAD → PHP" },
  { from: "CAD", to: "PKR", label: "CAD → PKR" },
  { from: "CAD", to: "NGN", label: "CAD → NGN" },
  { from: "CAD", to: "USD", label: "CAD → USD" },
  { from: "CAD", to: "EUR", label: "CAD → EUR" },
  { from: "CAD", to: "GBP", label: "CAD → GBP" },
  { from: "CAD", to: "AUD", label: "CAD → AUD" },
  { from: "CAD", to: "BDT", label: "CAD → BDT" },
  { from: "CAD", to: "CNY", label: "CAD → CNY" },
  { from: "CAD", to: "EGP", label: "CAD → EGP" },
  { from: "CAD", to: "GHS", label: "CAD → GHS" },
  { from: "CAD", to: "IDR", label: "CAD → IDR" },
  { from: "CAD", to: "KES", label: "CAD → KES" },
  { from: "CAD", to: "KRW", label: "CAD → KRW" },
  { from: "CAD", to: "LKR", label: "CAD → LKR" },
  { from: "CAD", to: "MAD", label: "CAD → MAD" },
  { from: "CAD", to: "MXN", label: "CAD → MXN" },
  { from: "CAD", to: "MYR", label: "CAD → MYR" },
  { from: "CAD", to: "NPR", label: "CAD → NPR" },
  { from: "CAD", to: "THB", label: "CAD → THB" },
  { from: "CAD", to: "TRY", label: "CAD → TRY" },
  { from: "CAD", to: "UAH", label: "CAD → UAH" },
  { from: "CAD", to: "VND", label: "CAD → VND" },
  { from: "CAD", to: "ZAR", label: "CAD → ZAR" },
  { from: "CAD", to: "BRL", label: "CAD → BRL" },
  { from: "CAD", to: "COP", label: "CAD → COP" },
  { from: "CAD", to: "ARS", label: "CAD → ARS" },
  { from: "CAD", to: "BOB", label: "CAD → BOB" },
  { from: "CAD", to: "ETB", label: "CAD → ETB" },
  { from: "CAD", to: "FJD", label: "CAD → FJD" },
  { from: "CAD", to: "GEL", label: "CAD → GEL" },
  { from: "CAD", to: "GMD", label: "CAD → GMD" },
  { from: "CAD", to: "GNF", label: "CAD → GNF" },
  { from: "CAD", to: "GTQ", label: "CAD → GTQ" },
  { from: "CAD", to: "HNL", label: "CAD → HNL" },
  { from: "CAD", to: "HTG", label: "CAD → HTG" },
  { from: "CAD", to: "JMD", label: "CAD → JMD" },
  { from: "CAD", to: "JOD", label: "CAD → JOD" },
  { from: "CAD", to: "KGS", label: "CAD → KGS" },
  { from: "CAD", to: "KZT", label: "CAD → KZT" },
  { from: "CAD", to: "MGA", label: "CAD → MGA" },
  { from: "CAD", to: "MZN", label: "CAD → MZN" },
  { from: "CAD", to: "PEN", label: "CAD → PEN" },
  { from: "CAD", to: "RWF", label: "CAD → RWF" },
  { from: "CAD", to: "TZS", label: "CAD → TZS" },
  { from: "CAD", to: "UGX", label: "CAD → UGX" },
  { from: "CAD", to: "UZS", label: "CAD → UZS" },
  { from: "CAD", to: "XAF", label: "CAD → XAF" },
  { from: "CAD", to: "XOF", label: "CAD → XOF" },
  { from: "CAD", to: "ZMW", label: "CAD → ZMW" },
  { from: "CAD", to: "DOP", label: "CAD → DOP" },
  // AUD — 53 destinations
  { from: "AUD", to: "INR", label: "AUD → INR" },
  { from: "AUD", to: "PHP", label: "AUD → PHP" },
  { from: "AUD", to: "PKR", label: "AUD → PKR" },
  { from: "AUD", to: "NGN", label: "AUD → NGN" },
  { from: "AUD", to: "USD", label: "AUD → USD" },
  { from: "AUD", to: "EUR", label: "AUD → EUR" },
  { from: "AUD", to: "GBP", label: "AUD → GBP" },
  { from: "AUD", to: "CAD", label: "AUD → CAD" },
  { from: "AUD", to: "NZD", label: "AUD → NZD" },
  { from: "AUD", to: "BDT", label: "AUD → BDT" },
  { from: "AUD", to: "CNY", label: "AUD → CNY" },
  { from: "AUD", to: "EGP", label: "AUD → EGP" },
  { from: "AUD", to: "GHS", label: "AUD → GHS" },
  { from: "AUD", to: "IDR", label: "AUD → IDR" },
  { from: "AUD", to: "KES", label: "AUD → KES" },
  { from: "AUD", to: "KRW", label: "AUD → KRW" },
  { from: "AUD", to: "LKR", label: "AUD → LKR" },
  { from: "AUD", to: "MAD", label: "AUD → MAD" },
  { from: "AUD", to: "MXN", label: "AUD → MXN" },
  { from: "AUD", to: "MYR", label: "AUD → MYR" },
  { from: "AUD", to: "NPR", label: "AUD → NPR" },
  { from: "AUD", to: "THB", label: "AUD → THB" },
  { from: "AUD", to: "TRY", label: "AUD → TRY" },
  { from: "AUD", to: "UAH", label: "AUD → UAH" },
  { from: "AUD", to: "VND", label: "AUD → VND" },
  { from: "AUD", to: "ZAR", label: "AUD → ZAR" },
  { from: "AUD", to: "BRL", label: "AUD → BRL" },
  { from: "AUD", to: "COP", label: "AUD → COP" },
  { from: "AUD", to: "ARS", label: "AUD → ARS" },
  { from: "AUD", to: "BOB", label: "AUD → BOB" },
  { from: "AUD", to: "ETB", label: "AUD → ETB" },
  { from: "AUD", to: "FJD", label: "AUD → FJD" },
  { from: "AUD", to: "GEL", label: "AUD → GEL" },
  { from: "AUD", to: "GMD", label: "AUD → GMD" },
  { from: "AUD", to: "GNF", label: "AUD → GNF" },
  { from: "AUD", to: "GTQ", label: "AUD → GTQ" },
  { from: "AUD", to: "HNL", label: "AUD → HNL" },
  { from: "AUD", to: "HTG", label: "AUD → HTG" },
  { from: "AUD", to: "JMD", label: "AUD → JMD" },
  { from: "AUD", to: "JOD", label: "AUD → JOD" },
  { from: "AUD", to: "KGS", label: "AUD → KGS" },
  { from: "AUD", to: "KZT", label: "AUD → KZT" },
  { from: "AUD", to: "MGA", label: "AUD → MGA" },
  { from: "AUD", to: "MZN", label: "AUD → MZN" },
  { from: "AUD", to: "PEN", label: "AUD → PEN" },
  { from: "AUD", to: "RWF", label: "AUD → RWF" },
  { from: "AUD", to: "TZS", label: "AUD → TZS" },
  { from: "AUD", to: "UGX", label: "AUD → UGX" },
  { from: "AUD", to: "UZS", label: "AUD → UZS" },
  { from: "AUD", to: "XAF", label: "AUD → XAF" },
  { from: "AUD", to: "XOF", label: "AUD → XOF" },
  { from: "AUD", to: "ZMW", label: "AUD → ZMW" },
  { from: "AUD", to: "DOP", label: "AUD → DOP" },
  // AED — 52 destinations
  { from: "AED", to: "INR", label: "AED → INR" },
  { from: "AED", to: "PKR", label: "AED → PKR" },
  { from: "AED", to: "PHP", label: "AED → PHP" },
  { from: "AED", to: "NGN", label: "AED → NGN" },
  { from: "AED", to: "USD", label: "AED → USD" },
  { from: "AED", to: "EUR", label: "AED → EUR" },
  { from: "AED", to: "GBP", label: "AED → GBP" },
  { from: "AED", to: "AUD", label: "AED → AUD" },
  { from: "AED", to: "BDT", label: "AED → BDT" },
  { from: "AED", to: "CNY", label: "AED → CNY" },
  { from: "AED", to: "EGP", label: "AED → EGP" },
  { from: "AED", to: "GHS", label: "AED → GHS" },
  { from: "AED", to: "IDR", label: "AED → IDR" },
  { from: "AED", to: "KES", label: "AED → KES" },
  { from: "AED", to: "KRW", label: "AED → KRW" },
  { from: "AED", to: "LKR", label: "AED → LKR" },
  { from: "AED", to: "MAD", label: "AED → MAD" },
  { from: "AED", to: "MXN", label: "AED → MXN" },
  { from: "AED", to: "MYR", label: "AED → MYR" },
  { from: "AED", to: "NPR", label: "AED → NPR" },
  { from: "AED", to: "THB", label: "AED → THB" },
  { from: "AED", to: "TRY", label: "AED → TRY" },
  { from: "AED", to: "VND", label: "AED → VND" },
  { from: "AED", to: "ZAR", label: "AED → ZAR" },
  { from: "AED", to: "BRL", label: "AED → BRL" },
  { from: "AED", to: "COP", label: "AED → COP" },
  { from: "AED", to: "ARS", label: "AED → ARS" },
  { from: "AED", to: "BOB", label: "AED → BOB" },
  { from: "AED", to: "ETB", label: "AED → ETB" },
  { from: "AED", to: "FJD", label: "AED → FJD" },
  { from: "AED", to: "GEL", label: "AED → GEL" },
  { from: "AED", to: "GMD", label: "AED → GMD" },
  { from: "AED", to: "GNF", label: "AED → GNF" },
  { from: "AED", to: "GTQ", label: "AED → GTQ" },
  { from: "AED", to: "HNL", label: "AED → HNL" },
  { from: "AED", to: "HTG", label: "AED → HTG" },
  { from: "AED", to: "JMD", label: "AED → JMD" },
  { from: "AED", to: "JOD", label: "AED → JOD" },
  { from: "AED", to: "KGS", label: "AED → KGS" },
  { from: "AED", to: "KZT", label: "AED → KZT" },
  { from: "AED", to: "MGA", label: "AED → MGA" },
  { from: "AED", to: "MZN", label: "AED → MZN" },
  { from: "AED", to: "PEN", label: "AED → PEN" },
  { from: "AED", to: "RWF", label: "AED → RWF" },
  { from: "AED", to: "TZS", label: "AED → TZS" },
  { from: "AED", to: "UAH", label: "AED → UAH" },
  { from: "AED", to: "UGX", label: "AED → UGX" },
  { from: "AED", to: "UZS", label: "AED → UZS" },
  { from: "AED", to: "XAF", label: "AED → XAF" },
  { from: "AED", to: "XOF", label: "AED → XOF" },
  { from: "AED", to: "ZMW", label: "AED → ZMW" },
  { from: "AED", to: "DOP", label: "AED → DOP" },
  // SAR — 8 destinations
  { from: "SAR", to: "INR", label: "SAR → INR" },
  { from: "SAR", to: "PKR", label: "SAR → PKR" },
  { from: "SAR", to: "PHP", label: "SAR → PHP" },
  { from: "SAR", to: "NGN", label: "SAR → NGN" },
  { from: "SAR", to: "BDT", label: "SAR → BDT" },
  { from: "SAR", to: "EGP", label: "SAR → EGP" },
  { from: "SAR", to: "IDR", label: "SAR → IDR" },
  { from: "SAR", to: "NPR", label: "SAR → NPR" },
  // INR — 7 destinations
  { from: "INR", to: "USD", label: "INR → USD" },
  { from: "INR", to: "GBP", label: "INR → GBP" },
  { from: "INR", to: "EUR", label: "INR → EUR" },
  { from: "INR", to: "AED", label: "INR → AED" },
  { from: "INR", to: "AUD", label: "INR → AUD" },
  { from: "INR", to: "CAD", label: "INR → CAD" },
  { from: "INR", to: "SGD", label: "INR → SGD" },
  // SGD — 6 destinations
  { from: "SGD", to: "INR", label: "SGD → INR" },
  { from: "SGD", to: "PHP", label: "SGD → PHP" },
  { from: "SGD", to: "BDT", label: "SGD → BDT" },
  { from: "SGD", to: "CNY", label: "SGD → CNY" },
  { from: "SGD", to: "IDR", label: "SGD → IDR" },
  { from: "SGD", to: "MYR", label: "SGD → MYR" },
  // NZD — 5 destinations
  { from: "NZD", to: "INR", label: "NZD → INR" },
  { from: "NZD", to: "PHP", label: "NZD → PHP" },
  { from: "NZD", to: "GBP", label: "NZD → GBP" },
  { from: "NZD", to: "AUD", label: "NZD → AUD" },
  { from: "NZD", to: "FJD", label: "NZD → FJD" },
  // ZAR — 3 destinations
  { from: "ZAR", to: "GBP", label: "ZAR → GBP" },
  { from: "ZAR", to: "KES", label: "ZAR → KES" },
  { from: "ZAR", to: "NGN", label: "ZAR → NGN" },
  // MYR — 3 destinations
  { from: "MYR", to: "INR", label: "MYR → INR" },
  { from: "MYR", to: "PHP", label: "MYR → PHP" },
  { from: "MYR", to: "IDR", label: "MYR → IDR" },
  // JPY — 3 destinations
  { from: "JPY", to: "USD", label: "JPY → USD" },
  { from: "JPY", to: "INR", label: "JPY → INR" },
  { from: "JPY", to: "PHP", label: "JPY → PHP" },
  // KRW — 3 destinations
  { from: "KRW", to: "INR", label: "KRW → INR" },
  { from: "KRW", to: "PHP", label: "KRW → PHP" },
  { from: "KRW", to: "VND", label: "KRW → VND" },
];

const leadVerdict = getSendVerdict("USD", "INR", 1000);
const leadRate = getPairRate("USD", "INR");

const popularCorridors = [
  { slug: "usa-to-india", from: "USD", to: "INR", label: "USA to India", flag: "\u{1F1EE}\u{1F1F3}" },
  { slug: "usa-to-pakistan", from: "USD", to: "PKR", label: "USA to Pakistan", flag: "\u{1F1F5}\u{1F1F0}" },
  { slug: "usa-to-philippines", from: "USD", to: "PHP", label: "USA to Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { slug: "usa-to-mexico", from: "USD", to: "MXN", label: "USA to Mexico", flag: "\u{1F1F2}\u{1F1FD}" },
  { slug: "usa-to-nigeria", from: "USD", to: "NGN", label: "USA to Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { slug: "uk-to-india", from: "GBP", to: "INR", label: "UK to India", flag: "\u{1F1EE}\u{1F1F3}" },
  { slug: "uk-to-europe", from: "GBP", to: "EUR", label: "UK to Europe", flag: "\u{1F1EA}\u{1F1FA}" },
  { slug: "canada-to-india", from: "CAD", to: "INR", label: "Canada to India", flag: "\u{1F1EE}\u{1F1F3}" },
];

// All targets below are in SITEMAP_RATE_PAIR_SLUGS (index:yes + sitemap:yes),
// so these links point only at consistent, indexable pages.
const topRatePairs = [
  { slug: "usd-to-inr", from: "USD", to: "INR", label: "USD to INR" },
  { slug: "gbp-to-inr", from: "GBP", to: "INR", label: "GBP to INR" },
  { slug: "usd-to-php", from: "USD", to: "PHP", label: "USD to PHP" },
  { slug: "usd-to-mxn", from: "USD", to: "MXN", label: "USD to MXN" },
  { slug: "usd-to-pkr", from: "USD", to: "PKR", label: "USD to PKR" },
  { slug: "usd-to-brl", from: "USD", to: "BRL", label: "USD to BRL" },
  { slug: "gbp-to-eur", from: "GBP", to: "EUR", label: "GBP to EUR" },
  { slug: "eur-to-usd", from: "EUR", to: "USD", label: "EUR to USD" },
  { slug: "usd-to-cad", from: "USD", to: "CAD", label: "USD to CAD" },
  { slug: "usd-to-jpy", from: "USD", to: "JPY", label: "USD to JPY" },
  { slug: "cad-to-inr", from: "CAD", to: "INR", label: "CAD to INR" },
  { slug: "usd-to-ngn", from: "USD", to: "NGN", label: "USD to NGN" },
  // Completing the set: every slug in SITEMAP_RATE_PAIR_SLUGS is submitted to
  // search engines, so every one needs a crawlable link from this hub. These
  // eight had none anywhere on the site — usd-to-aud and usd-to-cny were
  // sitemap-only orphans with zero incoming internal links, which is the
  // "pages have only one incoming internal link" notice in the Sep 2 audit.
  { slug: "gbp-to-usd", from: "GBP", to: "USD", label: "GBP to USD" },
  { slug: "gbp-to-pkr", from: "GBP", to: "PKR", label: "GBP to PKR" },
  { slug: "eur-to-gbp", from: "EUR", to: "GBP", label: "EUR to GBP" },
  { slug: "aud-to-inr", from: "AUD", to: "INR", label: "AUD to INR" },
  { slug: "usd-to-gbp", from: "USD", to: "GBP", label: "USD to GBP" },
  { slug: "usd-to-eur", from: "USD", to: "EUR", label: "USD to EUR" },
  { slug: "usd-to-aud", from: "USD", to: "AUD", label: "USD to AUD" },
  { slug: "usd-to-cny", from: "USD", to: "CNY", label: "USD to CNY" },
];

const faqs = [
  {
    question: "Is now a good time to send money abroad?",
    answer:
      leadVerdict
        ? `It depends on the corridor. Right now ${leadVerdict.from}→${leadVerdict.to} rates are ${leadVerdict.level} — today's best rate beats ${leadVerdict.levelPct}% of the last ${leadVerdict.daysTracked} days we've tracked. Use the tool at the top of this page to check your own corridor: it shows whether today is a good or weak day to send and how much your recipient receives.`
        : "Use the tool at the top of this page: it compares today's rate against the last 2–3 months we've tracked for your corridor and tells you whether it's a good or weak day to send.",
  },
  {
    question: "What is today's exchange rate?",
    answer:
      `As of ${AS_OF}, ` + (leadRate ? `1 USD = ${formatRate(leadRate.rate)} INR. ` : "") +
      "These are mid-market (interbank) rates — the fairest reference rate, before any provider adds a markup. The rate your bank or transfer service offers will be slightly lower. See the full table on this page for 60+ currencies.",
  },
  {
    question: "What is the mid-market exchange rate?",
    answer:
      "The mid-market rate (also called the interbank rate) is the midpoint between the buy and sell prices of two currencies on the global market. It's the fairest exchange rate available and the one you'll see on Google or Reuters. Banks and money transfer services typically add a markup on top of this rate — that markup is their profit.",
  },
  {
    question: "Why is my bank's exchange rate different from the mid-market rate?",
    answer:
      "Banks and transfer services add a margin (markup) to the mid-market rate. This is one of the main ways they make money on international transfers. The markup ranges from 0.5% to 5% or more depending on the provider and corridor. Use the tool above to find the provider offering the rate closest to mid-market for your route.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Exchange Rates Today — Is Now a Good Time to Send?",
  description: "Check whether today is a good time to send money abroad: today's mid-market rate vs the last 3 months, the best provider, and live trend charts for 60+ currencies.",
  url: "https://sendmoneycompare.com/exchange-rates",
  dateModified: RATES_AS_OF || undefined,
  isPartOf: { "@type": "WebSite", "@id": "https://sendmoneycompare.com/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendmoneycompare.com" },
      { "@type": "ListItem", position: 2, name: "Exchange Rates", item: "https://sendmoneycompare.com/exchange-rates" },
    ],
  },
};

const rateSpecSchema = leadRate ? {
  "@context": "https://schema.org",
  "@type": "ExchangeRateSpecification",
  currency: "USD",
  currentExchangeRate: {
    "@type": "UnitPriceSpecification",
    price: formatRate(leadRate.rate),
    priceCurrency: "INR",
    unitText: `1 USD = ${formatRate(leadRate.rate)} INR`,
  },
} : null;

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Live mid-market exchange rates with send-timing insight",
  description: "Daily mid-market exchange rates for 60+ currencies with 12-month history and a 'good time to send' score per corridor, aggregated from independent sources.",
  url: "https://sendmoneycompare.com/exchange-rates",
  temporalCoverage: RATES_AS_OF ? `2025-06-08/${RATES_AS_OF}` : undefined,
  dateModified: RATES_AS_OF || undefined,
  creator: { "@type": "Organization", name: "SendMoneyCompare", url: "https://sendmoneycompare.com" },
  variableMeasured: "Mid-market exchange rate",
  isAccessibleForFree: true,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "exchangeRates" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
    alternates: getAlternates("exchange-rates", locale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "https://sendmoneycompare.com/exchange-rates",
      type: "website",
      images: [{ url: "https://sendmoneycompare.com/opengraph-image", width: 1200, height: 630, alt: "Exchange Rates Today — SendMoneyCompare" }],
    },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function ExchangeRatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const rates = await fetchExchangeRates();

  const initialVerdict: VerdictData | null = leadVerdict
    ? {
        from: leadVerdict.from, to: leadVerdict.to, amount: leadVerdict.amount,
        level: leadVerdict.level, levelPct: leadVerdict.levelPct, daysTracked: leadVerdict.daysTracked,
        bestProviderSlug: leadVerdict.bestProviderSlug, bestRate: leadVerdict.bestRate,
        receiveNow: leadVerdict.receiveNow, receiveBest: leadVerdict.receiveBest, receiveWorst: leadVerdict.receiveWorst,
        rangePos: leadVerdict.rangePos,
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {rateSpecSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rateSpecSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <div className="bg-[var(--color-surface)]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── Hero ── */}
          <header className="mb-6 max-w-[760px]">
            <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-on-surface-muted)] mb-3">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-[var(--color-on-surface-variant)]">Exchange Rates</span>
            </nav>
            <h1 className="text-3xl sm:text-[2.6rem] font-bold text-[var(--color-on-surface)] tracking-tight leading-[1.1]">
              Is now a good time to send?
            </h1>
            <p className="mt-3 text-[15px] sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
              We track exchange rates daily across 800+ corridors. Pick yours and we&apos;ll tell you if today beats
              the last few months — and exactly how much your recipient gets.
            </p>
          </header>

          {/* ── Merged: verdict + trend chart, side by side (stack on mobile) ── */}
          {initialVerdict ? (
            <div className="rounded-3xl border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
              {/* Left: the verdict (its own border removed so the wrapper owns it) */}
              <div className="lg:border-r border-[var(--color-outline)]">
                <SendVerdictHero initial={initialVerdict} corridors={HERO_CORRIDORS} embedded />
              </div>
              {/* Right: the trend chart */}
              <div className="p-5 sm:p-6 border-t lg:border-t-0 border-[var(--color-outline)] flex flex-col">
                <h2 id="trends-heading" className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">
                  12-month trend
                </h2>
                <div className="flex-1">
                  <LazyHistoricalRateWidget defaultCorridor="USD-INR" />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--color-outline)] p-6 text-center text-[var(--color-on-surface-variant)]">
              Live rate insight is warming up — check the rates below.
            </div>
          )}

          <p className="text-center text-xs text-[var(--color-on-surface-muted)] mt-3">
            <LiveTimestamp iso={`${RATES_AS_OF}T00:00:00Z`} prefix="Updated" /> · mid-market, median of 4 sources
          </p>

          {/* ── Compact rates ── */}
          <section className="mt-12 max-w-[760px]" aria-labelledby="rates-heading">
            <h2 id="rates-heading" className="text-xl font-semibold text-[var(--color-on-surface)] mb-1">
              Today&apos;s rates
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              Mid-market rates as of {AS_OF}. Tap a corridor to compare providers.
            </p>
            <TodayRates />
          </section>

          {/* ── Everything else: progressive disclosure ── */}
          <section className="mt-12 space-y-3 max-w-[760px]">
            {/* Popular corridors */}
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                Compare popular corridors
                <Chevron />
              </summary>
              <div className="px-5 pb-5 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {popularCorridors.map((c) => (
                  <Link key={c.slug} href={`/send-money/${c.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-outline)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all group/c">
                    <span className="text-xl">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--color-on-surface)] group-hover/c:text-[var(--color-primary)]">{c.label}</div>
                      <div className="text-xs text-[var(--color-on-surface-variant)]">{c.from} &rarr; {c.to}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </details>

            {/* Popular rate pairs */}
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                Currency pair deep-dives
                <Chevron />
              </summary>
              <div className="px-5 pb-5 pt-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {topRatePairs.map((pair) => {
                  const r = getPairRate(pair.from, pair.to);
                  return (
                    <Link key={pair.slug} href={`/exchange-rates/${pair.slug}`}
                      className="flex flex-col gap-0.5 px-3.5 py-3 rounded-xl border border-[var(--color-outline)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all group/p">
                      <span className="text-sm font-medium text-[var(--color-on-surface)] group-hover/p:text-[var(--color-primary)]">{pair.label}</span>
                      {r && <span className="text-xs text-[var(--color-on-surface-variant)] tabular-nums">{formatRate(r.rate)}</span>}
                    </Link>
                  );
                })}
              </div>
              <div className="px-5 pb-5">
                <Link href="/exchange-rates/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline">
                  See rate history for 90+ corridors
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </details>

            {/* How it works / understanding */}
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                How mid-market rates work
                <Chevron />
              </summary>
              <div className="px-5 pb-5 pt-1 space-y-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
                <p>
                  <strong className="text-[var(--color-on-surface)]">Mid-market rate vs. transfer rate.</strong> The mid-market
                  rate is the &ldquo;real&rdquo; rate — the midpoint of global currency markets. Providers add a markup on top; that
                  markup is their profit and varies widely. Always compare a provider&apos;s rate against mid-market.
                </p>
                <p>
                  <strong className="text-[var(--color-on-surface)]">How we calculate this.</strong> Headline rates and charts use a
                  daily mid-market history for 60+ currencies. The &ldquo;good time to send&rdquo; score compares today&apos;s best
                  provider rate against every day we&apos;ve tracked for that corridor. The live ticker takes the median of 4
                  independent feeds to remove outliers.
                </p>
                <p>
                  Sending money on this pair?{" "}
                  <Link href="/send-money" className="text-[var(--color-primary)] hover:underline font-medium">Compare every provider</Link>{" "}
                  to find the best real rate.
                </p>
              </div>
            </details>

            {/* FAQ */}
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[15px] font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-dim)] transition-colors">
                  {faq.question}
                  <Chevron />
                </summary>
                <div className="px-5 pb-4 text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">{faq.answer}</div>
              </details>
            ))}

            {/* Retro forex board */}
            <details className="group rounded-2xl border border-[var(--color-outline)] overflow-hidden bg-[var(--color-surface-dim)]">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 select-none">
                <div>
                  <span className="text-[15px] font-medium text-[var(--color-on-surface)]">Live forex trading board</span>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-0.5">Retro airport-style ticker — TT/CHQ/Note rates, refreshing every 60s.</p>
                </div>
                <Chevron />
              </summary>
              <div className="border-t border-[var(--color-outline)]">
                <LiveRatesBoard initialRates={rates} />
              </div>
            </details>
          </section>

          {/* ── Disclaimer ── */}
          <p className="text-[12px] text-[var(--color-on-surface-muted)] mt-8 leading-relaxed max-w-[760px]">
            Rates shown are mid-market rates aggregated from independent sources for informational purposes only. Provider
            payouts are indicative and based on recent tracking — confirm the live quote before sending. Not financial advice.
          </p>
        </div>
      </div>
    </>
  );
}

function Chevron() {
  return (
    <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] shrink-0 ml-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
