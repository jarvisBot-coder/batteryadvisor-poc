"use client";

import { useState } from "react";
import type { Battery } from "@/lib/types";
import ScoreCircle from "@/components/ScoreCircle";

interface Props {
  batteries: Battery[];
}

const MAX_COMPARE = 3;

export default function ComparateurClient({ batteries }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

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

  const rows: { label: string; key: (b: Battery) => string }[] = [
    { label: "Capacité", key: (b) => `${b.capacityKwh} kWh` },
    { label: "Puissance", key: (b) => `${b.powerKw} kW` },
    { label: "Chimie", key: (b) => b.chemistry },
    { label: "Garantie", key: (b) => `${b.cycleWarrantyYears} ans` },
    {
      label: "Prix",
      key: (b) => (b.priceEur ? `${b.priceEur.toLocaleString("fr-BE")} €` : "—"),
    },
  ];

  return (
    <>
      {/* Battery picker */}
      <div className="mt-8 flex flex-wrap gap-3">
        {batteries.map((b) => {
          const active = selected.includes(b.id);
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              className={`pill border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-text-mid)] hover:border-[var(--color-primary)]"
              }`}
            >
              {b.brand?.name} {b.name}
            </button>
          );
        })}
      </div>

      {/* Comparison table */}
      {compared.length > 0 ? (
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="p-4 text-left text-[var(--color-text-muted)]" />
                {compared.map((b) => (
                  <th key={b.id} className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ScoreCircle score={b.scoreOverall} size={56} />
                      <span className="font-display font-semibold">
                        {b.brand?.name} {b.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="p-4 font-medium text-[var(--color-text-mid)]">
                    {row.label}
                  </td>
                  {compared.map((b) => (
                    <td key={b.id} className="p-4 text-center">
                      {row.key(b)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Score rows */}
              {(
                [
                  ["Performance", "scorePerformance"],
                  ["Valeur", "scoreValue"],
                  ["Garantie", "scoreWarranty"],
                  ["Facilité", "scoreEaseOfUse"],
                ] as const
              ).map(([label, key]) => (
                <tr key={key}>
                  <td className="p-4 font-medium text-[var(--color-text-mid)]">
                    {label}
                  </td>
                  {compared.map((b) => (
                    <td key={b.id} className="p-4 text-center font-semibold">
                      {b[key]}/100
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-12 text-center text-[var(--color-text-muted)]">
          Sélectionnez au moins une batterie ci-dessus pour commencer la
          comparaison.
        </div>
      )}
    </>
  );
}
