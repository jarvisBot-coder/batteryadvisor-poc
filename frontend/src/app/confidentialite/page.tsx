import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment BatteryAdvisor.be traite vos données personnelles (RGPD).",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Politique de confidentialité</h1>
      <div className="mt-3 rounded-lg bg-[var(--color-ground)] p-4 text-sm text-[var(--color-text-muted)]">
        Modèle conforme à l&apos;esprit du RGPD, à compléter avec vos informations réelles et à faire valider par un professionnel.
      </div>
      <div className="mt-8 space-y-5 leading-relaxed text-[var(--color-text-mid)]">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Responsable du traitement</h2>
          <p>[Nom de l&apos;éditeur], contact@batteryadvisor.be.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Données collectées</h2>
          <p>Ce site ne requiert pas de création de compte. Peuvent être traités : les données de mesure d&apos;audience (si vous y consentez), et les informations que vous saisissez volontairement dans nos outils (consommation, budget) — ces dernières sont traitées dans votre navigateur et ne sont pas conservées par nos serveurs.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Base légale &amp; finalités</h2>
          <p>Mesure d&apos;audience : votre consentement. Fonctionnement du site : intérêt légitime. Les liens affiliés peuvent déposer des cookies tiers lors de vos clics.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Durée de conservation</h2>
          <p>Les données de mesure d&apos;audience sont conservées [durée à préciser] ; les préférences de consentement sont stockées localement dans votre navigateur.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Vos droits</h2>
          <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation et d&apos;opposition. Pour l&apos;exercer : contact@batteryadvisor.be. Vous pouvez introduire une réclamation auprès de l&apos;Autorité de protection des données (APD, Belgique).</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Cookies</h2>
          <p>Voir notre <Link href="/cookies" className="text-[var(--color-primary)] hover:underline">politique cookies</Link>.</p>
        </div>
      </div>
    </div>
  );
}
