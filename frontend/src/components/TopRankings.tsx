"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Battery } from "@/lib/types";

interface Props {
  batteries: Battery[];
}

interface Ranking {
  key: string;
  tab: string;
  title: string;
  winner: string;
  formula: string;
  unit: string;
  dir: "asc" | "desc";
  value: (b: Battery) => number | null;
  format: (v: number) => string;
}

const RANKINGS: Ranking[] = [
  {
    key: "ppk", tab: "€/kWh", title: "Le moins cher par kWh", winner: "Le moins cher/kWh",
    formula: "Prix de départ ÷ capacité (kWh).", unit: "€/kWh", dir: "asc",
    value: (b) => (b.priceEur && b.capacityKwh ? b.priceEur / b.capacityKwh : null),
    format: (v) => `${Math.round(v)} €/kWh`,
  },
  {
    key: "lifetime", tab: "Coût à l'usage", title: "Le moins cher sur la durée de vie", winner: "Le plus économique à l'usage",
    formula: "Prix ÷ (cycles × capacité), en centimes par kWh stocké sur toute la durée de vie.", unit: "ct/kWh", dir: "asc",
    value: (b) => (b.priceEur && b.cycles && b.capacityKwh ? (b.priceEur / (b.cycles * b.capacityKwh)) * 100 : null),
    format: (v) => `${v.toFixed(1)} ct/kWh stocké`,
  },
  {
    key: "cheapest", tab: "Prix total", title: "Le moins cher (prix total)", winner: "Le moins cher",
    formula: "Prix de départ le plus bas, toutes capacités confondues.", unit: "€", dir: "asc",
    value: (b) => b.priceEur ?? null,
    format: (v) => `${v.toLocaleString("fr-BE")} €`,
  },
  {
    key: "power", tab: "Puissance", title: "Le plus puissant", winner: "Le plus puissant",
    formula: "Puissance de sortie continue la plus élevée (kW).", unit: "kW", dir: "desc",
    value: (b) => b.powerKw || null,
    format: (v) => `${v} kW`,
  },
  {
    key: "powerPerEuro", tab: "Puissance/€", title: "Le plus de puissance par euro", winner: "Le meilleur €/kW",
    formula: "Prix ÷ puissance (kW) : coût par kW de puissance.", unit: "€/kW", dir: "asc",
    value: (b) => (b.priceEur && b.powerKw ? b.priceEur / b.powerKw : null),
    format: (v) => `${Math.round(v)} €/kW`,
  },
  {
    key: "capacity", tab: "Capacité", title: "La plus grande capacité", winner: "Le plus grand",
    formula: "Capacité de stockage la plus élevée (kWh).", unit: "kWh", dir: "desc",
    value: (b) => b.capacityKwh || null,
    format: (v) => `${v} kWh`,
  },
  {
    key: "weight", tab: "Poids/kWh", title: "Le plus léger par kWh", winner: "Le plus léger/kWh",
    formula: "Poids ÷ capacité (kg par kWh).", unit: "kg/kWh", dir: "asc",
    value: (b) => (b.weightKg && b.capacityKwh ? b.weightKg / b.capacityKwh : null),
    format: (v) => `${v.toFixed(1)} kg/kWh`,
  },
];

export default function TopRankings({ batteries }: Props) {
  const [active, setActive] = useState("ppk");
  const r = RANKINGS.find((x) => x.key === active)!;

  const ranked = useMemo(() => {
    const withVal = batteries
      .map((b) => ({ b, v: r.value(b) }))
      .filter((x): x is { b: Battery; v: number } => x.v != null);
    withVal.sort((a, b) => (r.dir === "asc" ? a.v - b.v : b.v - a.v));
    return withVal;
  }, [batteries, r]);

  return (
    <div className="mt-8">
      {/* Ranking selector */}
      <div className="flex flex-wrap gap-2">
        {RANKINGS.map((x) => (
          <button
            key={x.key}
            onClick={() => setActive(x.key)}
            className={`pill border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active === x.key
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-[var(--color-border)] text-[var(--color-text-mid)] hover:border-[var(--color-primary)]"
            }`}
          >
            {x.tab}
          </button>
        ))}
      </div>

      <h2 className="mt-8 font-display text-2xl font-bold">{r.title}</h2>

      <ol className="mt-5 space-y-2">
        {ranked.map(({ b, v }, i) => (
          <li key={b.id} className="card flex items-center gap-4 p-4">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-base font-bold ${
              i === 0 ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-ground)] text-[var(--color-text-mid)]"
            }`}>
              {i + 1}
            </div>
            <div className="flex-1">
              <Link href={`/batteries/${b.slug}`} className="font-medium hover:text-[var(--color-primary)]">
                <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">{b.brand?.name} </span>
                {b.name}
              </Link>
              <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                {b.capacityKwh} kWh · {b.powerKw} kW{b.efficiencyPct ? ` · RTE ${b.efficiencyPct}%` : ""}{b.cycles ? ` · ${b.cycles.toLocaleString("fr-BE")} cycles` : ""}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-lg font-bold tabular-nums text-[var(--color-primary)]">{r.format(v)}</div>
              {i === 0 && (
                <span className="mt-0.5 inline-block rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
                  🏆 {r.winner}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-lg bg-[var(--color-ground)] p-4 text-sm text-[var(--color-text-mid)]">
        <span className="font-semibold text-[var(--color-text)]">Comment on calcule :</span> {r.formula} Les chiffres décident, sans note subjective. Prix indicatifs, susceptibles de varier.
      </p>
    </div>
  );
}
