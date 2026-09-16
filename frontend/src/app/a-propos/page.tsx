import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos de BatteryAdvisor.be",
  description:
    "BatteryAdvisor.be : comparatifs indépendants de batteries domestiques plug-in pour le marché belge. Notre mission et notre modèle.",
};

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">À propos</h1>
      </header>

      <div className="mt-8 space-y-5 leading-relaxed text-[var(--color-text-mid)]">
        <p>
          BatteryAdvisor.be aide les particuliers en Belgique à choisir la batterie domestique plug-in adaptée à
          leur installation, leur consommation et leur budget. Nous comparons les modèles disponibles sur le
          marché belge selon une méthodologie unique et transparente.
        </p>
        <p>
          Notre objectif : rendre un marché technique et en évolution rapide plus lisible, avec des comparatifs
          clairs, des scores cohérents et des outils concrets (calculateur d&apos;économies, de capacité, guide
          de recommandation).
        </p>

        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Notre indépendance</h2>
          <p className="mt-2 text-sm">
            Nous ne vendons pas de batteries. Le site se finance via des liens affiliés, sans surcoût pour vous et
            sans influence sur nos classements.{" "}
            <Link href="/methodologie" className="text-[var(--color-primary)] hover:underline">Voir la méthodologie</Link>.
          </p>
        </div>

        <p className="text-sm text-[var(--color-text-muted)]">
          Une question, une correction, une suggestion de modèle à tester ? Écrivez-nous à
          {" "}<span className="font-medium text-[var(--color-text-mid)]">contact@batteryadvisor.be</span>.
        </p>
      </div>
    </div>
  );
}
