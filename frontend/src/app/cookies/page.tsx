import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique cookies",
  description: "Les cookies utilisés par BatteryAdvisor.be et comment les gérer.",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Politique cookies</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-[var(--color-text-mid)]">
        <p>Un cookie est un petit fichier déposé sur votre appareil. Nous distinguons deux catégories :</p>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Cookies essentiels</h2>
          <p>Nécessaires au fonctionnement du site (mémorisation de vos préférences d&apos;affichage, de consentement et de comparaison). Ils ne requièrent pas votre consentement et sont stockés localement dans votre navigateur.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Cookies de mesure d&apos;audience</h2>
          <p>Déposés uniquement si vous y consentez, ils nous aident à comprendre l&apos;usage du site de façon agrégée. Vous pouvez refuser sans dégrader votre navigation.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Liens affiliés</h2>
          <p>Lorsque vous cliquez vers un marchand, celui-ci peut déposer ses propres cookies pour attribuer une éventuelle commission. Ces cookies relèvent de la politique du marchand.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Gérer votre choix</h2>
          <p>Vous pouvez modifier votre consentement à tout moment en effaçant les données de site de votre navigateur ; la bannière réapparaîtra à votre prochaine visite.</p>
        </div>
      </div>
    </div>
  );
}
