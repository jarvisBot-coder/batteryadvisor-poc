"use client";

import { useState } from "react";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import ScoreCircle from "@/components/ScoreCircle";

interface Props {
  batteries: Battery[];
}

const MAX_COMPARE = 3;

export default function ComparateurClient({ batteries }: Props) {
  const [selected, setSelected] = useState<number[]>(() =>
    batteries.slice(0, 2).map((b) => b.id),
  );

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < MAX_COMPARE
          ? [...prev, id]
          : prev,
    );
  }

  const compared = batteries.filter((b) => selected.includes(b.id));

  // Spec rows with a numeric accessor + which extreme is "best".
  type Row = {
    label: string;
    render: (b: Battery) => string;
    value: (b: Battery) => number;
    best: "max" | "min";
  };
  const specRows: Row[] = [
    { label: "Capacité", render: (b) => `${b.capacityKwh} kWh`, value: (b) => b.capacityKwh, best: "max" },
    { label: "Puissance", render: (b) => `${b.powerKw} kW`, value: (b) => b.powerKw, best: "max" },
    { label: "Garantie", render: (b) => `${b.cycleWarrantyYears} ans`, value: (b) => b.cycleWarrantyYears, best: "max" },
    { label: "Cycles", render: (b) => (b.cycles ? b.cycles.toLocaleString("fr-BE") : "—"), value: (b) => b.cycles ?? 0, best: "max" },
    { label: "Prix", render: (b) => (b.priceEur ? `${b.priceEur.toLocaleString("fr-BE")} €` : "—"), value: (b) => b.priceEur ?? Infinity, best: "min" },
  ];
  const scoreRows: { label: string; key: keyof Battery }[] = [
    { label: "Performance", key: "scorePerformance" },
    { label: "Rapport qualité/prix", key: "scoreValue" },
    { label: "Garantie", key: "scoreWarranty" },
    { label: "Installation", key: "scoreEaseOfUse" },
  ];

  function bestId(accessor: (b: Battery) => number, best: "max" | "min"): number | null {
    if (compared.length < 2) return null;
    let winner = compared[0];
    for (const b of compared) {
      if (best === "max" ? accessor(b) > accessor(winner) : accessor(b) < accessor(winner)) winner = b;
    }
    // No winner if all equal.
    const allEqual = compared.every((b) => accessor(b) === accessor(winner));
    return allEqual ? null : winner.id;
  }

  const winClass = "bg-[var(--color-primary)]/10 font-bold text-[var(--color-primary)]";

  return (
    <>
      {/* Battery picker */}
      <div className="mt-8 flex flex-wrap gap-3">
        {batteries.map((b) => {
          const active = selected.includes(b.id);
          const disabled = !active && selected.length >= MAX_COMPARE;
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              disabled={disabled}
              className={`pill border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : disabled
                    ? "cursor-not-allowed border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50"
                    : "border-[var(--color-border)] text-[var(--color-text-mid)] hover:border-[var(--color-primary)]"
              }`}
            >
              {b.brand?.name} {b.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        {selected.length}/{MAX_COMPARE} sélectionnées · les meilleures valeurs sont surlignées
      </p>

      {compared.length > 0 ? (
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="p-4 text-left text-[var(--color-text-muted)]" />
                {compared.map((b) => (
                  <th key={b.id} className="p-4 text-center align-top">
                    <div className="flex flex-col items-center gap-2">
                      <ScoreCircle score={b.scoreOverall} size={56} />
                      <span className="font-display font-semibold">{b.brand?.name} {b.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {specRows.map((row) => {
                const win = bestId(row.value, row.best);
                return (
                  <tr key={row.label}>
                    <td className="p-4 font-medium text-[var(--color-text-mid)]">{row.label}</td>
                    {compared.map((b) => (
                      <td
                        key={b.id}
                        className={`p-4 text-center ${b.id === win ? winClass : ""}`}
                      >
                        {row.render(b)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {scoreRows.map((row) => {
                const win = bestId((b) => b[row.key] as number, "max");
                return (
                  <tr key={row.label}>
                    <td className="p-4 font-medium text-[var(--color-text-mid)]">{row.label}</td>
                    {compared.map((b) => (
                      <td
                        key={b.id}
                        className={`p-4 text-center font-semibold ${b.id === win ? winClass : ""}`}
                      >
                        {b[row.key] as number}/100
                      </td>
                    ))}
                  </tr>
                );
              })}
              {/* CTA row */}
              <tr>
                <td className="p-4" />
                {compared.map((b) => (
                  <td key={b.id} className="p-4 text-center">
                    <Link
                      href={`/batteries/${b.slug}`}
                      className="pill inline-block bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Voir le test
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-12 text-center text-[var(--color-text-muted)]">
          Sélectionnez au moins une batterie ci-dessus pour commencer la comparaison.
        </div>
      )}
    </>
  );
}
