import type { Metadata } from "next";
import ComparateurClient from "./ComparateurClient";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";

export const metadata: Metadata = {
  title: "Comparateur de batteries",
  description:
    "Comparez côte à côte les batteries domestiques. Capacité, puissance, prix et scores détaillés.",
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

export default async function ComparateurPage() {
  const batteries = await loadBatteries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Comparateur
      </h1>
      <p className="mt-2 text-[var(--color-text-mid)]">
        Sélectionnez jusqu&apos;à 3 batteries pour les comparer côte à côte.
      </p>
      <ComparateurClient batteries={batteries} />
    </div>
  );
}
