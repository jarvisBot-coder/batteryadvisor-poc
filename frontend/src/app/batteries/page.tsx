import type { Metadata } from "next";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import BatteriesFilter from "./BatteriesFilter";

export const metadata: Metadata = {
  title: "Toutes les batteries domestiques",
  description:
    "Comparez toutes les batteries domestiques disponibles en Belgique. Filtrez par marque, capacité, chimie et prix.",
};

async function loadBatteries(): Promise<Battery[]> {
  try {
    const res = await getBatteries();
    if (res.data.length) return res.data;
  } catch {
    // Strapi down — fall back to mock.
  }
  return mockBatteries;
}

export default async function BatteriesPage() {
  const batteries = await loadBatteries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Batteries domestiques
      </h1>
      <p className="mt-2 text-[var(--color-text-mid)]">
        {batteries.length} batterie{batteries.length > 1 ? "s" : ""} testée
        {batteries.length > 1 ? "s" : ""} et notée
        {batteries.length > 1 ? "s" : ""} selon notre méthodologie
        indépendante.
      </p>
      <BatteriesFilter batteries={batteries} />
    </div>
  );
}
