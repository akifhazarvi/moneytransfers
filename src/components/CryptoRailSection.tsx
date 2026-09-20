import CryptoRailSectionView from "@/components/CryptoRailSectionView";
import { getCryptoRailSectionData } from "@/lib/crypto-rail-section";

export default function CryptoRailSection({ from, to, amount = 1000 }: {
  from: string;
  to: string;
  amount?: number;
}) {
  return <CryptoRailSectionView {...getCryptoRailSectionData(from, to, amount)} />;
}
