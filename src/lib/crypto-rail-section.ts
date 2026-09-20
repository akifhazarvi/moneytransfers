import { getCryptoRails, type CryptoRail } from "@/lib/crypto-rails";
import { cashoutSlugForCurrency, getCashoutCountry } from "@/data/cashout-countries";

export interface CryptoRailSectionData {
  from: string;
  to: string;
  amount: number;
  rails: CryptoRail[];
  cashout: { slug: string; country: string } | null;
}

// Import this lookup only on the server. Client views import its type only.
export function getCryptoRailSectionData(from: string, to: string, amount: number): CryptoRailSectionData {
  const slug = cashoutSlugForCurrency(to);
  const country = slug ? getCashoutCountry(slug) : undefined;
  return {
    from, to, amount,
    rails: getCryptoRails(from, to, amount).slice(0, 5),
    cashout: country ? { slug: country.slug, country: country.country } : null,
  };
}
