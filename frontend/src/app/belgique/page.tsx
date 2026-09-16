import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Batteries domestiques en Belgique : règles, tarifs et primes",
  description:
    "Compteur qui tourne à l'envers, tarif capacitaire, TVA 6%, primes par région, limite 800 W : tout le cadre belge pour une batterie domestique en 2026.",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-[var(--color-border)] pt-8">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-[var(--color-text-mid)]">{children}</div>
    </section>
  );
}

export default function BelgiquePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Batteries domestiques en Belgique : règles, tarifs et primes",
    author: { "@type": "Organization", name: "BatteryAdvisor.be" },
    publisher: { "@type": "Organization", name: "BatteryAdvisor.be" },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-primary)]">Belgique</span>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Le cadre belge de la batterie domestique</h1>
        <p className="mt-4 text-[var(--color-text-mid)]">
          Fiscalité, tarifs réseau et primes diffèrent fortement d&apos;une région à l&apos;autre et évoluent
          chaque année. Voici les éléments qui déterminent l&apos;intérêt d&apos;une batterie en Belgique.
        </p>
      </header>

      {/* TOC */}
      <nav className="mt-8 flex flex-wrap gap-2 text-sm">
        {[
          ["compteur", "Compteur qui tourne à l'envers"],
          ["capacitaire", "Tarif capacitaire"],
          ["tva", "TVA 6%"],
          ["primes", "Primes par région"],
          ["plug-in", "Limite 800 W"],
          ["rentabilite", "Rentabilité"],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="pill bg-[var(--color-ground)] px-3 py-1.5 text-[var(--color-text-mid)] hover:text-[var(--color-primary)]">{label}</a>
        ))}
      </nav>

      <div className="mt-10 space-y-8">
        <Section id="compteur" title="La fin du compteur qui tourne à l'envers">
          <p>
            Avec le déploiement du compteur numérique, le principe du compteur qui tourne à l&apos;envers
            (compensation totale entre injection et prélèvement) a pris fin pour les nouveaux prosumers. On
            distingue désormais ce que vous <strong>prélevez</strong> du réseau et ce que vous <strong>injectez</strong>,
            valorisé à un tarif d&apos;injection généralement bien plus faible que le prix d&apos;achat.
          </p>
          <p>
            Conséquence directe : chaque kWh solaire consommé sur place vaut bien plus que le même kWh injecté.
            C&apos;est précisément ce que fait une batterie — <strong>maximiser l&apos;autoconsommation</strong> —
            et c&apos;est le premier argument de rentabilité en Belgique aujourd&apos;hui.
          </p>
        </Section>

        <Section id="capacitaire" title="Le tarif capacitaire (Flandre)">
          <p>
            En Flandre, une partie de la facture réseau dépend de votre <strong>pic de puissance mensuel</strong>
            (tarif capacitaire, via Fluvius). Écrêter ces pics réduit ce poste.
          </p>
          <p>
            Une batterie peut lisser les appels de puissance et ainsi diminuer la composante capacitaire — une
            économie annuelle souvent estimée à quelques dizaines à quelques centaines d&apos;euros selon votre
            profil. L&apos;ordre de grandeur du tarif tourne autour d&apos;une cinquantaine d&apos;euros par kW de
            pic et par an ; vérifiez le montant en vigueur auprès de Fluvius.
          </p>
        </Section>

        <Section id="tva" title="La TVA à 6%">
          <p>
            Pour une habitation de <strong>plus de 10 ans</strong> et une installation par un professionnel
            certifié, la batterie bénéficie généralement du taux de <strong>TVA réduit à 6%</strong> (au lieu de
            21%) — soit environ 1 000 € d&apos;économie sur une batterie à 7 000 €. C&apos;est un avantage
            structurel, plus stable que les primes.
          </p>
        </Section>

        <Section id="primes" title="Primes et aides par région">
          <p>Les primes sont politiquement volatiles : elles apparaissent et disparaissent. État général à vérifier avant tout achat :</p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Flandre</strong> : la prime batterie a été définitivement supprimée (fin mars 2023). L&apos;intérêt vient surtout du tarif capacitaire, de l&apos;autoconsommation et de la TVA 6%.</li>
            <li><strong>Wallonie</strong> : pas de prime batterie spécifique en général ; financements verts type Écopack/Rénopack possibles, et compensation liée à une nouvelle installation PV via votre GRD (ORES, RESA).</li>
            <li><strong>Bruxelles</strong> : une prime énergie peut exister via Bruxelles Environnement, souvent sous conditions de revenus ; prêts verts possibles.</li>
          </ul>
          <p className="rounded-lg bg-[var(--color-ground)] p-4 text-sm">
            ⚠️ Les montants et conditions changent régulièrement. Vérifiez toujours l&apos;état actuel auprès de votre
            région (Fluvius/VEKA en Flandre, votre GRD et le SPW en Wallonie, Bruxelles Environnement à Bruxelles).
          </p>
        </Section>

        <Section id="plug-in" title="La limite de 800 W (batteries plug-in)">
          <p>
            Les batteries « plug-in » se branchent sans installateur mais sont limitées côté injection (souvent
            <strong> 800 W</strong>), ce qui borne aussi la quantité d&apos;énergie rechargeable par jour. Au-delà
            d&apos;une petite capacité, un <strong>circuit dédié</strong> ou un raccordement fixe devient nécessaire.
            Vérifiez les règles de votre GRD et la conformité du matériel.
          </p>
        </Section>

        <Section id="rentabilite" title="Alors, est-ce rentable ?">
          <p>
            Cela dépend de votre consommation, de votre production solaire et de votre contrat. Les leviers en
            Belgique : autoconsommation accrue, écrêtage du tarif capacitaire, et arbitrage si vous avez un tarif
            dynamique. Estimez votre cas avec nos outils.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/outils/economies" className="pill bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Calculateur d&apos;économies</Link>
            <Link href="/outils/capacite" className="pill border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:border-[var(--color-primary)]">Calculateur de capacité</Link>
            <Link href="/guide" className="pill border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:border-[var(--color-primary)]">Guide personnalisé</Link>
          </div>
        </Section>
      </div>

      <p className="mt-10 text-xs text-[var(--color-text-muted)]">
        Informations générales à but éducatif, susceptibles d&apos;évoluer. Ne constitue pas un conseil fiscal ou
        juridique — vérifiez toujours les conditions officielles en vigueur.
      </p>
    </div>
  );
}
