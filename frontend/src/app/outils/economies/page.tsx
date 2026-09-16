import type { Metadata } from "next";
import EconomiesClient from "./EconomiesClient";

export const metadata: Metadata = {
  title: "Calculateur d'économies batterie domestique",
  description:
    "Estimez l'économie annuelle et le temps de retour sur investissement d'une batterie domestique selon votre consommation, vos tarifs et votre installation.",
};

export default function EconomiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Calculateur d&apos;économies</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-text-mid)]">
          Estimez combien une batterie domestique peut vous faire économiser par an et en combien de temps
          elle se rentabilise.
        </p>
      </header>
      <EconomiesClient />
    </div>
  );
}
