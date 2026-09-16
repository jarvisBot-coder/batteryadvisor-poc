"use client";

import { useState } from "react";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import { pricePerKwh } from "./CapabilityBadges";

interface Props {
  batteries: Battery[];
}

type Col = {
  key: string;
  label: string;
  get: (b: Battery) => number | string;
  render: (b: Battery) => React.ReactNode;
  numeric: boolean;
  bestHigh?: boolean;
};

const yesNo = (v?: boolean) => (v ? "✓" : "—");

const COLS: Col[] = [
  { key: "score", label: "Score", get: (b) => b.scoreOverall, render: (b) => `${b.scoreOverall}`, numeric: true, bestHigh: true },
  { key: "capacity", label: "Capacité", get: (b) => b.capacityKwh, render: (b) => `${b.capacityKwh} kWh`, numeric: true, bestHigh: true },
  { key: "power", label: "Puissance", get: (b) => b.powerKw, render: (b) => `${b.powerKw} kW`, numeric: true, bestHigh: true },
  { key: "ppk", label: "€/kWh", get: (b) => pricePerKwh(b) ?? Infinity, render: (b) => { const p = pricePerKwh(b); return p ? `${p} €` : "—"; }, numeric: true, bestHigh: false },
  { key: "price", label: "Prix", get: (b) => b.priceEur ?? Infinity, render: (b) => (b.priceEur ? `${b.priceEur.toLocaleString("fr-BE")} €` : "—"), numeric: true, bestHigh: false },
  { key: "warranty", label: "Garantie", get: (b) => b.cycleWarrantyYears, render: (b) => `${b.cycleWarrantyYears} ans`, numeric: true, bestHigh: true },
  { key: "cycles", label: "Cycles", get: (b) => b.cycles ?? 0, render: (b) => (b.cycles ? b.cycles.toLocaleString("fr-BE") : "—"), numeric: true, bestHigh: true },
  { key: "rte", label: "Rendement", get: (b) => b.efficiencyPct ?? 0, render: (b) => (b.efficiencyPct ? `${b.efficiencyPct}%` : "—"), numeric: true, bestHigh: true },
  { key: "backup", label: "Backup", get: (b) => (b.backupPower ? 1 : 0), render: (b) => yesNo(b.backupPower), numeric: true, bestHigh: true },
  { key: "be", label: "BE", get: (b) => (b.belgiumApproved ? 1 : 0), render: (b) => yesNo(b.belgiumApproved), numeric: true, bestHigh: true },
];

export default function CompareTable({ batteries }: Props) {
  const [sortKey, setSortKey] = useState("score");
  const [asc, setAsc] = useState(false);

  const col = COLS.find((c) => c.key === sortKey)!;
  const sorted = [...batteries].sort((a, b) => {
    const av = col.get(a), bv = col.get(b);
    if (typeof av === "number" && typeof bv === "number") return asc ? av - bv : bv - av;
    return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  function toggle(k: string) {
    if (k === sortKey) setAsc(!asc);
    else { setSortKey(k); setAsc(false); }
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="bg-[var(--color-ground)]">
            <th className="sticky left-0 z-10 bg-[var(--color-ground)] p-3 text-left font-semibold text-[var(--color-text-mid)]">
              Batterie
            </th>
            {COLS.map((c) => (
              <th
                key={c.key}
                onClick={() => toggle(c.key)}
                className={`cursor-pointer whitespace-nowrap p-3 text-center font-semibold transition-colors hover:text-[var(--color-primary)] ${
                  sortKey === c.key ? "text-[var(--color-primary)]" : "text-[var(--color-text-mid)]"
                }`}
              >
                {c.label} {sortKey === c.key ? (asc ? "▲" : "▼") : ""}
              </th>
            ))}
            <th className="p-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {sorted.map((b) => (
            <tr key={b.id} className="hover:bg-[var(--color-ground)]/50">
              <td className="sticky left-0 z-10 bg-[var(--color-card)] p-3">
                <Link href={`/batteries/${b.slug}`} className="font-medium hover:text-[var(--color-primary)]">
                  <span className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    {b.brand?.name}
                  </span>
                  {b.name}
                </Link>
              </td>
              {COLS.map((c) => (
                <td key={c.key} className="whitespace-nowrap p-3 text-center tabular-nums text-[var(--color-text-mid)]">
                  {c.render(b)}
                </td>
              ))}
              <td className="p-3 text-center">
                <Link
                  href={`/batteries/${b.slug}`}
                  className="pill inline-block bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  Test
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
