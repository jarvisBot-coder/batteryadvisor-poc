import type { Metadata } from "next";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Quelle batterie domestique pour vous ? — Guide personnalisé",
  description:
    "Répondez à 5 questions et obtenez une recommandation de batterie domestique adaptée à votre logement, votre consommation et votre budget en Belgique.",
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

export default async function GuidePage() {
  const batteries = await loadBatteries();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Quelle batterie pour vous ?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--color-text-mid)]">
          Cinq questions pour trouver la batterie domestique adaptée à votre
          installation, votre consommation et votre budget.
        </p>
      </header>

      <QuizClient batteries={batteries} />
    </div>
  );
}
