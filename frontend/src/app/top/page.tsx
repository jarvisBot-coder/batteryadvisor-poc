import type { Metadata } from "next";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import TopRankings from "@/components/TopRankings";

export const metadata: Metadata = {
  title: "Classements chiffrés des batteries domestiques",
  description:
    "Les chiffres décident : classements objectifs des batteries domestiques par prix/kWh, coût à l'usage, puissance, capacité et poids. Formules transparentes.",
};

async function loadBatteries(): Promise<Battery[]> {
  try { const res = await getBatteries(); if (res.data.length) return res.data; } catch { /* */ }
  return mockBatteries;
}

export default async function TopPage() {
  const batteries = await loadBatteries();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-primary)]">Les chiffres décident</span>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Classements chiffrés</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-text-mid)]">
          Choisissez une métrique : chaque classement trie toutes les batteries sur un seul critère mesurable,
          avec la formule affichée. Aucune note subjective, uniquement les chiffres.
        </p>
      </header>
      <TopRankings batteries={batteries} />
    </div>
  );
}
