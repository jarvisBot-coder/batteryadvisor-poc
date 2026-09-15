import type { Metadata } from "next";
import ComparateurClient from "./ComparateurClient";
import type { Battery } from "@/lib/types";

export const metadata: Metadata = {
  title: "Comparateur de batteries",
  description:
    "Comparez c\u00f4te \u00e0 c\u00f4te les batteries domestiques. Capacit\u00e9, puissance, prix et scores d\u00e9taill\u00e9s.",
};

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
];

export default function ComparateurPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Comparateur
      </h1>
      <p className="mt-2 text-[var(--color-text-mid)]">
        S\u00e9lectionnez jusqu&apos;\u00e0 3 batteries pour les comparer c\u00f4te \u00e0 c\u00f4te.
      </p>
      <ComparateurClient batteries={mockBatteries} />
    </div>
  );
}
