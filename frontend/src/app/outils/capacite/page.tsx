import type { Metadata } from "next";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import CapaciteClient from "./CapaciteClient";

export const metadata: Metadata = {
  title: "Calculateur de capacité de batterie domestique",
  description:
    "Quelle capacité de batterie domestique vous faut-il ? Estimez les kWh recommandés selon votre consommation et découvrez les modèles adaptés.",
};

async function loadBatteries(): Promise<Battery[]> {
  try {
    const res = await getBatteries();
    if (res.data.length) return res.data;
  } catch {
    /* fallback */
  }
  return mockBatteries;
}

export default async function CapacitePage() {
  const batteries = await loadBatteries();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Calculateur de capacité</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-text-mid)]">
          Trouvez la capacité de batterie adaptée à votre consommation, et les modèles qui correspondent.
        </p>
      </header>
      <CapaciteClient batteries={batteries} />
    </div>
  );
}
