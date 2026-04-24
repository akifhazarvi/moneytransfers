/**
 * eSIM plan data for travel pages.
 *
 * Affiliate URLs are PLACEHOLDERS — they currently route through our /go/
 * redirect with a `noAffiliate` sentinel. Replace with real affiliate IDs
 * once Airalo / Holafly / Ubigi programs are approved.
 *
 * Pricing reflects public retail prices checked April 2026 — refresh
 * quarterly, or wire this up to the provider APIs (Airalo has one).
 */

export interface EsimPlan {
  provider: "Airalo" | "Holafly" | "Ubigi" | "Nomad" | "Local";
  /** Marketing name of the plan, e.g. "Thailand — 7 days, 3GB" */
  name: string;
  country: string;
  data: string;
  days: number;
  priceUsd: number;
  /** Headline feature, e.g. "5G", "Unlimited", "Hotspot allowed" */
  tag?: string;
  affiliateUrl: string;
  /** Whether this is a PLACEHOLDER affiliate link */
  placeholder: boolean;
}

export const esimPlansByCountry: Record<string, EsimPlan[]> = {
  thailand: [
    {
      provider: "Airalo",
      name: "Airalo 'Sawasdee' — 7 days, 3GB",
      country: "thailand",
      data: "3 GB",
      days: 7,
      priceUsd: 8.5,
      tag: "Best value, 50+ app reviews",
      affiliateUrl: "https://www.airalo.com/thailand-esim",
      placeholder: true,
    },
    {
      provider: "Airalo",
      name: "Airalo 'Sawasdee' — 15 days, 5GB",
      country: "thailand",
      data: "5 GB",
      days: 15,
      priceUsd: 13.0,
      tag: "Longer trips",
      affiliateUrl: "https://www.airalo.com/thailand-esim",
      placeholder: true,
    },
    {
      provider: "Holafly",
      name: "Holafly — Unlimited, 7 days",
      country: "thailand",
      data: "Unlimited*",
      days: 7,
      priceUsd: 27.0,
      tag: "Unlimited data, no hotspot",
      affiliateUrl: "https://esim.holafly.com/esim-thailand/",
      placeholder: true,
    },
    {
      provider: "Ubigi",
      name: "Ubigi — 10 GB, 30 days",
      country: "thailand",
      data: "10 GB",
      days: 30,
      priceUsd: 19.0,
      tag: "Best for digital nomads",
      affiliateUrl: "https://cellulardata.ubigi.com/",
      placeholder: true,
    },
  ],
};

export function getEsimPlans(countrySlug: string): EsimPlan[] {
  return esimPlansByCountry[countrySlug] ?? [];
}
