import type { Metadata } from "next";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import ScoreCircle from "@/components/ScoreCircle";
import ScoreBar from "@/components/ScoreBar";
import ProConGrid from "@/components/ProConGrid";

/* Mock lookup – replaced by getBattery(slug) */
const mockBattery: Battery = {
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
  pros: [
    "Puissance de sortie élevée (11.5 kW)",
    "Grande capacité de 13.5 kWh",
    "Onduleur intégré simplifie l'installation",
    "Application mobile intuitive",
  ],
  cons: [
    "Prix élevé par rapport à la concurrence",
    "Disponibilité limitée en Belgique",
    "Pas de modularité (capacité fixe)",
  ],
  verdict:
    "Le Tesla Powerwall 3 reste une référence grâce à sa puissance et son intégration logicielle. Son prix élevé est compensé par des performances de premier plan et une garantie solide de 10 ans.",
  createdAt: "",
  updatedAt: "",
  publishedAt: "",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${mockBattery.name} – Avis et score`,
    description: `Test complet de la ${mockBattery.brand?.name} ${mockBattery.name}. Score ${mockBattery.scoreOverall}/100. ${mockBattery.capacityKwh} kWh, ${mockBattery.chemistry}.`,
  };
}

const specs = (b: Battery) => [
  { label: "Capacité", value: `${b.capacityKwh} kWh` },
  { label: "Puissance", value: `${b.powerKw} kW` },
  { label: "Chimie", value: b.chemistry },
  { label: "Garantie", value: `${b.cycleWarrantyYears} ans` },
  { label: "Prix indicatif", value: b.priceEur ? `${b.priceEur.toLocaleString("fr-BE")} €` : "—" },
];

export default async function BatteryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const battery = mockBattery;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/batteries" className="hover:text-[var(--color-primary)]">
          Batteries
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--color-text-mid)]">
          {battery.brand?.name} {battery.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {battery.brand && (
            <span className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
              {battery.brand.name}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {battery.name}
          </h1>
        </div>
        <ScoreCircle score={battery.scoreOverall} size={88} label="Score global" />
      </div>

      {/* Score breakdown */}
      <div className="card mt-8 space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Scores détaillés</h2>
        <ScoreBar label="Performance" score={battery.scorePerformance} />
        <ScoreBar label="Valeur" score={battery.scoreValue} />
        <ScoreBar label="Garantie" score={battery.scoreWarranty} />
        <ScoreBar label="Facilité" score={battery.scoreEaseOfUse} />
      </div>

      {/* Specs table */}
      <div className="card mt-6 overflow-hidden">
        <h2 className="border-b border-[var(--color-border)] p-5 font-display text-lg font-semibold">
          Caractéristiques
        </h2>
        <div className="divide-y divide-[var(--color-border)]">
          {specs(battery).map((s) => (
            <div key={s.label} className="flex justify-between px-5 py-3 text-sm">
              <span className="text-[var(--color-text-mid)]">{s.label}</span>
              <span className="font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pros & cons */}
      {battery.pros && battery.cons && (
        <div className="mt-6">
          <ProConGrid pros={battery.pros} cons={battery.cons} />
        </div>
      )}

      {/* Verdict */}
      {battery.verdict && (
        <div className="card mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">Notre verdict</h2>
          <p className="mt-2 leading-relaxed text-[var(--color-text-mid)]">
            {battery.verdict}
          </p>
        </div>
      )}
    </div>
  );
}
