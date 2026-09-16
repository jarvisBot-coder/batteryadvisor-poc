import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossaire des batteries domestiques",
  description:
    "Tous les termes des batteries domestiques expliqués simplement : kWh, kWc, DoD, rendement, cycles, autoconsommation, autarcie, tarif capacitaire, LFP, MPPT et plus.",
};

const TERMS: { term: string; def: string }[] = [
  { term: "kWh (kilowattheure)", def: "Unité d'énergie stockée. La capacité d'une batterie s'exprime en kWh : c'est la quantité d'électricité qu'elle peut restituer." },
  { term: "kWc (kilowatt-crête)", def: "Puissance maximale d'une installation solaire dans des conditions standard. Sert à dimensionner la production annuelle (≈ 950 kWh/kWc/an en Belgique)." },
  { term: "kW (kilowatt)", def: "Puissance instantanée. Pour une batterie, c'est le débit de charge/décharge : combien d'appareils elle peut alimenter en même temps." },
  { term: "Capacité utile vs nominale", def: "La capacité nominale est la taille totale ; la capacité utile (un peu plus faible) est ce que vous pouvez réellement utiliser, une réserve protégeant la batterie." },
  { term: "Profondeur de décharge (DoD)", def: "Part de la capacité réellement exploitable à chaque cycle. Un DoD de 100% signifie que toute la capacité utile est disponible." },
  { term: "Rendement aller-retour (RTE)", def: "Part de l'énergie récupérée par rapport à celle stockée. Un RTE de 95% signifie 5% de pertes à chaque cycle. Plus il est élevé, plus l'arbitrage est rentable." },
  { term: "Cycle", def: "Une charge complète suivie d'une décharge complète. La garantie s'exprime souvent en nombre de cycles (ex. 6 000), soit 15 à 20 ans d'usage quotidien." },
  { term: "Autoconsommation", def: "Part de votre production solaire que vous consommez vous-même plutôt que de l'injecter. Une batterie l'augmente fortement (souvent de ~30% à 60-80%)." },
  { term: "Autarcie", def: "Part de votre consommation totale couverte par votre solaire + batterie. Plus elle est haute, moins vous achetez au réseau." },
  { term: "Tarif capacitaire", def: "En Flandre, part de la facture réseau basée sur votre pic de puissance mensuel. Une batterie qui lisse les pics réduit ce poste." },
  { term: "Tarif d'injection", def: "Prix (faible) auquel votre surplus solaire injecté est rémunéré. Bien inférieur au prix d'achat, d'où l'intérêt d'autoconsommer." },
  { term: "Tarif dynamique", def: "Contrat dont le prix suit le marché (Belpex), heure par heure. Une batterie permet l'arbitrage : charger quand c'est bon marché, consommer quand c'est cher." },
  { term: "Compteur numérique", def: "Compteur qui mesure séparément injection et prélèvement. Son déploiement a mis fin au compteur qui tourne à l'envers." },
  { term: "Plug-in / plug-and-play", def: "Batterie qui se branche sans installateur, souvent limitée à 800 W. Idéale pour appartements, locataires et solaire de balcon." },
  { term: "Backup (secours)", def: "Fonction qui alimente automatiquement la maison (ou un circuit) lors d'une coupure de courant." },
  { term: "LFP (lithium fer phosphate)", def: "Chimie de référence du résidentiel : très sûre, longue durée de vie, tolérante à la chaleur." },
  { term: "NMC (nickel manganèse cobalt)", def: "Chimie plus dense mais plus sensible thermiquement et à durée de vie souvent plus courte. Moins courante à domicile." },
  { term: "Onduleur hybride", def: "Onduleur gérant à la fois les panneaux solaires et la batterie. Certaines batteries l'intègrent, d'autres nécessitent un onduleur compatible externe." },
  { term: "MPPT", def: "Entrée solaire directe sur certaines batteries plug-in, permettant de brancher des panneaux sans onduleur séparé." },
  { term: "Système modulaire / extensible", def: "Batterie dont on peut augmenter la capacité en ajoutant des modules, pour suivre l'évolution des besoins." },
  { term: "Prix par kWh (€/kWh)", def: "Prix total ÷ capacité. La meilleure façon de comparer le coût réel de batteries de tailles différentes." },
];

export default function GlossairePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glossaire des batteries domestiques",
    hasDefinedTerm: TERMS.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.def })),
  };
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Glossaire</h1>
        <p className="mt-2 text-[var(--color-text-mid)]">Les termes des batteries domestiques, expliqués simplement.</p>
      </header>
      <dl className="mt-8 space-y-4">
        {TERMS.map((t) => (
          <div key={t.term} className="card p-5">
            <dt className="font-display text-lg font-semibold">{t.term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-[var(--color-text-mid)]">{t.def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
