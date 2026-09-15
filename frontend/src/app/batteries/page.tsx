import type { Metadata } from "next";
import type { Battery } from "@/lib/types";
import BatteryCard from "@/components/BatteryCard";
import BatteriesFilter from "./BatteriesFilter";

export const metadata: Metadata = {
  title: "Toutes les batteries domestiques",
  description:
    "Comparez toutes les batteries domestiques disponibles en Belgique. Filtrez par marque, capacité, chimie et prix.",
};

/* Mock data – replaced by Strapi fetch in production */
const mockBatteries: Battery[] = [
  {
    id: 1, documentId: "1", slug: "tesla-powerwall-3", name: "Powerwall 3",
    brand: { id: 1, documentId: "1", name: "Tesla", slug: "tesla" },
    capacityKwh: 13.5, powerKw: 11.5, chemistry: "LFP",
    cycleWarrantyYears: 10, priceEur: 8900,
    scoreOverall: 87, scoreValue: 78, scorePerformance: 92,
    scoreWarranty: 85, scoreEaseOfUse: 90,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
  {
    id: 2, documentId: "2", slug: "byd-battbox-premium-hvs", name: "BattBox Premium HVS",
    brand: { id: 2, documentId: "2", name: "BYD", slug: "byd" },
    capacityKwh: 10.2, powerKw: 10.2, chemistry: "LFP",
    cycleWarrantyYears: 10, priceEur: 6500,
    scoreOverall: 84, scoreValue: 88, scorePerformance: 82,
    scoreWarranty: 82, scoreEaseOfUse: 78,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
  {
    id: 3, documentId: "3", slug: "huawei-luna2000", name: "LUNA2000-10-S0",
    brand: { id: 3, documentId: "3", name: "Huawei", slug: "huawei" },
    capacityKwh: 10, powerKw: 5, chemistry: "LFP",
    cycleWarrantyYears: 10, priceEur: 5200,
    scoreOverall: 81, scoreValue: 90, scorePerformance: 75,
    scoreWarranty: 80, scoreEaseOfUse: 76,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
  {
    id: 4, documentId: "4", slug: "enphase-iq-battery-5p", name: "IQ Battery 5P",
    brand: { id: 4, documentId: "4", name: "Enphase", slug: "enphase" },
    capacityKwh: 5, powerKw: 3.84, chemistry: "LFP",
    cycleWarrantyYears: 15, priceEur: 5900,
    scoreOverall: 79, scoreValue: 72, scorePerformance: 78,
    scoreWarranty: 92, scoreEaseOfUse: 85,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
  {
    id: 5, documentId: "5", slug: "sonnen-batterie-10", name: "sonnenBatterie 10",
    brand: { id: 5, documentId: "5", name: "Sonnen", slug: "sonnen" },
    capacityKwh: 11, powerKw: 4.6, chemistry: "LFP",
    cycleWarrantyYears: 10, priceEur: 9800,
    scoreOverall: 76, scoreValue: 65, scorePerformance: 74,
    scoreWarranty: 80, scoreEaseOfUse: 88,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
  {
    id: 6, documentId: "6", slug: "sma-sunny-boy-storage", name: "Sunny Boy Storage 6.0",
    brand: { id: 6, documentId: "6", name: "SMA", slug: "sma" },
    capacityKwh: 6.5, powerKw: 2.5, chemistry: "NMC",
    cycleWarrantyYears: 10, priceEur: 4800,
    scoreOverall: 73, scoreValue: 80, scorePerformance: 68,
    scoreWarranty: 75, scoreEaseOfUse: 70,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
];

export default function BatteriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Batteries domestiques
      </h1>
      <p className="mt-2 text-[var(--color-text-mid)]">
        {mockBatteries.length} batteries testées et notées selon notre
        méthodologie indépendante.
      </p>
      <BatteriesFilter batteries={mockBatteries} />
    </div>
  );
}
