import type { Battery } from "./types";
import { pricePerKwh } from "@/components/CapabilityBadges";

export interface Toplist {
  slug: string;
  eyebrow: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  metricLabel: string;
  metric: (b: Battery) => string;
  select: (batteries: Battery[]) => Battery[];
  faq: { question: string; answer: string }[];
}

const byScore = (a: Battery, b: Battery) => b.scoreOverall - a.scoreOverall;

export const TOPLISTS: Toplist[] = [
  {
    slug: "meilleures-batteries-2026",
    eyebrow: "Classement général",
    title: "Meilleures batteries domestiques 2026",
    h1: "Les meilleures batteries domestiques en 2026",
    description:
      "Notre classement des meilleures batteries domestiques plug-in pour la Belgique en 2026, notées selon notre méthodologie indépendante.",
    intro:
      "Voici notre classement général des batteries domestiques les mieux notées, tous usages confondus. Le score global agrège la performance, le rapport qualité/prix, la garantie, l'installation et la qualité de fabrication. Chaque modèle a été évalué selon la même méthodologie.",
    metricLabel: "Score global",
    metric: (b) => `${b.scoreOverall}/100`,
    select: (bats) => [...bats].sort(byScore).slice(0, 6),
    faq: [
      { question: "Comment est calculé le score global ?", answer: "Il agrège cinq critères pondérés : performance, rapport qualité/prix, garantie, facilité d'installation et qualité de fabrication." },
      { question: "Le classement est-il indépendant ?", answer: "Oui. Les commissions d'affiliation ne modifient jamais l'ordre du classement ni les scores." },
    ],
  },
  {
    slug: "meilleur-rapport-qualite-prix",
    eyebrow: "Budget",
    title: "Meilleures batteries rapport qualité-prix 2026",
    h1: "Meilleur rapport qualité-prix",
    description:
      "Les batteries domestiques offrant le meilleur prix par kWh en Belgique, sans sacrifier la qualité.",
    intro:
      "Le prix par kWh (€/kWh) est la meilleure façon de comparer le coût réel de batteries de tailles différentes. Ce classement met en avant les modèles au coût par kWh le plus bas, tout en tenant compte de leur score de qualité.",
    metricLabel: "Prix / kWh",
    metric: (b) => { const p = pricePerKwh(b); return p ? `${p} €/kWh` : "—"; },
    select: (bats) =>
      [...bats].sort((a, b) => (pricePerKwh(a) ?? Infinity) - (pricePerKwh(b) ?? Infinity)).slice(0, 6),
    faq: [
      { question: "Pourquoi comparer en €/kWh ?", answer: "Une batterie chère mais de grande capacité peut coûter moins cher au kWh qu'une petite batterie bon marché. Le €/kWh normalise la comparaison." },
      { question: "Le moins cher est-il le meilleur choix ?", answer: "Pas forcément : vérifiez aussi le rendement, la garantie et les fonctions (backup, extensibilité)." },
    ],
  },
  {
    slug: "meilleure-batterie-backup",
    eyebrow: "Secours",
    title: "Meilleures batteries avec backup (secours) 2026",
    h1: "Meilleures batteries pour le backup",
    description:
      "Les batteries domestiques qui assurent l'alimentation de secours en cas de coupure de courant en Belgique.",
    intro:
      "Pour tenir lors d'une coupure de courant, il faut une batterie avec fonction backup et une puissance de sortie suffisante pour alimenter vos appareils essentiels. Ce classement privilégie les modèles avec secours et forte puissance.",
    metricLabel: "Puissance",
    metric: (b) => `${b.powerKw} kW`,
    select: (bats) =>
      [...bats]
        .sort((a, b) => {
          const ab = a.backupPower ? 1 : 0, bb = b.backupPower ? 1 : 0;
          if (ab !== bb) return bb - ab;
          if (b.powerKw !== a.powerKw) return b.powerKw - a.powerKw;
          return byScore(a, b);
        })
        .slice(0, 6),
    faq: [
      { question: "Toutes les batteries offrent-elles le backup ?", answer: "Non. Le backup dépend du modèle et parfois de l'onduleur. Vérifiez la fiche de chaque batterie." },
      { question: "Quelle puissance pour le secours ?", answer: "Comptez au moins 3 à 5 kW pour alimenter les appareils essentiels ; davantage pour une maison entière." },
    ],
  },
  {
    slug: "meilleure-puissance",
    eyebrow: "Puissance",
    title: "Batteries domestiques les plus puissantes 2026",
    h1: "Les batteries les plus puissantes",
    description:
      "Les batteries domestiques offrant la puissance de sortie la plus élevée pour les grandes maisons énergivores.",
    intro:
      "La puissance (kW) détermine combien d'appareils vous pouvez alimenter simultanément et la vitesse de charge/décharge. Ce classement met en avant les batteries les plus puissantes du marché.",
    metricLabel: "Puissance",
    metric: (b) => `${b.powerKw} kW`,
    select: (bats) => [...bats].sort((a, b) => b.powerKw - a.powerKw).slice(0, 6),
    faq: [
      { question: "Ai-je besoin d'une forte puissance ?", answer: "Utile pour les grandes maisons, les pompes à chaleur ou la recharge de voiture électrique. Pour un usage standard, 3 à 5 kW suffisent." },
    ],
  },
  {
    slug: "meilleure-batterie-balcon",
    eyebrow: "Compact / balcon",
    title: "Meilleures batteries plug-and-play (balcon) 2026",
    h1: "Meilleures petites batteries plug-and-play",
    description:
      "Les batteries plug-and-play compactes, idéales pour les appartements, locataires et le solaire de balcon en Belgique.",
    intro:
      "Compactes, sans travaux et souvent extensibles, ces batteries plug-and-play conviennent aux petits besoins, aux appartements et au solaire de balcon. Classement des modèles de plus petite capacité.",
    metricLabel: "Capacité",
    metric: (b) => `${b.capacityKwh} kWh`,
    select: (bats) => [...bats].sort((a, b) => a.capacityKwh - b.capacityKwh).slice(0, 6),
    faq: [
      { question: "Peut-on installer une batterie plug-and-play soi-même ?", answer: "Les modèles plug-and-play se branchent sans électricien, sur une prise ou un kit compatible. Vérifiez la réglementation locale (limite 800 W)." },
    ],
  },
  {
    slug: "meilleure-grande-capacite",
    eyebrow: "Grande capacité",
    title: "Batteries domestiques grande capacité 2026",
    h1: "Meilleures batteries grande capacité",
    description:
      "Les batteries domestiques de grande capacité pour maximiser l'autoconsommation et l'autonomie en Belgique.",
    intro:
      "Pour les foyers à forte consommation ou qui visent un maximum d'autonomie, la grande capacité (kWh) est reine. Ce classement met en avant les batteries offrant le plus de stockage.",
    metricLabel: "Capacité",
    metric: (b) => `${b.capacityKwh} kWh`,
    select: (bats) => [...bats].sort((a, b) => b.capacityKwh - a.capacityKwh).slice(0, 6),
    faq: [
      { question: "Une grande capacité est-elle toujours rentable ?", answer: "Au-delà de vos besoins nocturnes, le surplus de capacité se rentabilise mal. Dimensionnez avec notre calculateur de capacité." },
    ],
  },
];

export function getToplist(slug: string): Toplist | undefined {
  return TOPLISTS.find((t) => t.slug === slug);
}
