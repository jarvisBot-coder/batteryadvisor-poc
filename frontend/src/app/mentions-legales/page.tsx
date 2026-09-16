import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de BatteryAdvisor.be.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Mentions légales</h1>
      <div className="mt-3 rounded-lg bg-[var(--color-ground)] p-4 text-sm text-[var(--color-text-muted)]">
        Modèle à compléter avec vos informations réelles et à faire valider ; les champs entre crochets sont des espaces réservés.
      </div>
      <div className="mt-8 space-y-5 leading-relaxed text-[var(--color-text-mid)]">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Éditeur du site</h2>
          <p>BatteryAdvisor.be — [Nom de l&apos;éditeur / société]<br />[Adresse]<br />Numéro d&apos;entreprise (BCE) : [n° BCE]<br />Email : contact@batteryadvisor.be</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Responsable de la publication</h2>
          <p>[Nom du responsable]</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Hébergement</h2>
          <p>[Nom et coordonnées de l&apos;hébergeur]</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Propriété intellectuelle</h2>
          <p>L&apos;ensemble des contenus de ce site (textes, scores, visuels) est protégé. Toute reproduction sans autorisation est interdite.</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">Liens affiliés</h2>
          <p>Ce site contient des liens affiliés : un achat via ces liens peut générer une commission, sans surcoût pour vous et sans influence sur nos évaluations.</p>
        </div>
      </div>
    </div>
  );
}
