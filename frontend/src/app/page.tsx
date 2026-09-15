import type { Metadata } from "next";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import BatteryCard from "@/components/BatteryCard";
import ScoreCircle from "@/components/ScoreCircle";

export const metadata: Metadata = {
  title: "BatteryAdvisor.be — Comparatif batteries domestiques Belgique",
};

/* ── Mock data for development without Strapi ── */
const mockBatteries: Battery[] = [
  {
    id: 1,
    documentId: "1",
    slug: "tesla-powerwall-3",
    name: "Powerwall 3",
    brand: { id: 1, documentId: "1", name: "Tesla", slug: "tesla" },
    capacityKwh: 13.5,
    powerKw: 11.5,
    chemistry: "LFP",
    cycleWarrantyYears: 10,
    priceEur: 8900,
    scoreOverall: 87,
    scoreValue: 78,
    scorePerformance: 92,
    scoreWarranty: 85,
    scoreEaseOfUse: 90,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
  {
    id: 2,
    documentId: "2",
    slug: "byd-battbox-premium-hvs",
    name: "BattBox Premium HVS",
    brand: { id: 2, documentId: "2", name: "BYD", slug: "byd" },
    capacityKwh: 10.2,
    powerKw: 10.2,
    chemistry: "LFP",
    cycleWarrantyYears: 10,
    priceEur: 6500,
    scoreOverall: 84,
    scoreValue: 88,
    scorePerformance: 82,
    scoreWarranty: 82,
    scoreEaseOfUse: 78,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
  {
    id: 3,
    documentId: "3",
    slug: "huawei-luna2000",
    name: "LUNA2000-10-S0",
    brand: { id: 3, documentId: "3", name: "Huawei", slug: "huawei" },
    capacityKwh: 10,
    powerKw: 5,
    chemistry: "LFP",
    cycleWarrantyYears: 10,
    priceEur: 5200,
    scoreOverall: 81,
    scoreValue: 90,
    scorePerformance: 75,
    scoreWarranty: 80,
    scoreEaseOfUse: 76,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
  {
    id: 4,
    documentId: "4",
    slug: "enphase-iq-battery-5p",
    name: "IQ Battery 5P",
    brand: { id: 4, documentId: "4", name: "Enphase", slug: "enphase" },
    capacityKwh: 5,
    powerKw: 3.84,
    chemistry: "LFP",
    cycleWarrantyYears: 15,
    priceEur: 5900,
    scoreOverall: 79,
    scoreValue: 72,
    scorePerformance: 78,
    scoreWarranty: 92,
    scoreEaseOfUse: 85,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
];

const stats = [
  { value: "24+", label: "Batteries testées" },
  { value: "8", label: "Marques comparées" },
  { value: "5", label: "Critères de score" },
  { value: "100%", label: "Indépendant" },
];

const useCases = [
  {
    icon: "☀️",
    title: "Autoconsommation solaire",
    description:
      "Stockez l'énergie de vos panneaux et consommez-la le soir. Réduisez votre facture jusqu'à 70%.",
  },
  {
    icon: "⚡",
    title: "Tarif dynamique",
    description:
      "Chargez quand l'électricité est bon marché, déchargez aux heures de pointe. Idéal avec un contrat Belpex.",
  },
  {
    icon: "🏠",
    title: "Backup / secours",
    description:
      "Gardez vos appareils essentiels alimentés en cas de coupure de courant.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            La référence belge pour les{" "}
            <span className="text-[var(--color-primary)]">
              batteries domestiques
            </span>
          </h1>
          <p className="mt-5 text-lg text-[var(--color-text-mid)]">
            Comparatifs indépendants, scores détaillés et conseils pour
            choisir la batterie qui correspond à votre installation en
            Belgique.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/batteries"
              className="pill bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              Voir les batteries
            </Link>
            <Link
              href="/comparateur"
              className="pill border border-[var(--color-border)] px-6 py-3 font-medium text-[var(--color-text-mid)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Comparer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-[var(--color-primary)]">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-[var(--color-text-muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Quel usage pour votre batterie ?
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {useCases.map((uc) => (
            <div key={uc.title} className="card p-6">
              <div className="text-3xl">{uc.icon}</div>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {uc.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-mid)]">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top picks ── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Meilleures batteries 2025
          </h2>
          <Link
            href="/batteries"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockBatteries.map((b) => (
            <BatteryCard key={b.id} battery={b} />
          ))}
        </div>
      </section>

      {/* ── Methodology teaser ── */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 sm:flex-row sm:px-6">
          <div className="flex gap-3">
            <ScoreCircle score={87} size={72} label="Global" />
            <ScoreCircle score={92} size={72} label="Perf." />
            <ScoreCircle score={78} size={72} label="Valeur" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">
              Méthodologie transparente
            </h2>
            <p className="mt-2 text-[var(--color-text-mid)]">
              Chaque batterie est évaluée sur 5 critères pondérés :
              performance, rapport qualité/prix, garantie, facilité
              d&apos;installation et compatibilité. Nos scores sont inspirés
              de la méthodologie RTINGS.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
