"use client";

import { useState, useMemo } from "react";
import type { Battery } from "@/lib/types";
import BatteryCard from "@/components/BatteryCard";
import FilterPills from "@/components/FilterPills";
import CompareTable from "@/components/CompareTable";
import { pricePerKwh } from "@/components/CapabilityBadges";

interface Props {
  batteries: Battery[];
}

type SortKey = "score" | "price-asc" | "ppk-asc" | "capacity" | "power";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Meilleur score" },
  { key: "price-asc", label: "Prix croissant" },
  { key: "ppk-asc", label: "Prix / kWh" },
  { key: "capacity", label: "Capacité" },
  { key: "power", label: "Puissance" },
];

const CAP_FILTERS: { key: keyof Battery; label: string }[] = [
  { key: "backupPower", label: "🔋 Backup" },
  { key: "mppt", label: "☀️ Solaire" },
  { key: "expandable", label: "➕ Extensible" },
  { key: "belgiumApproved", label: "🇧🇪 Approuvé BE" },
];

export default function BatteriesFilter({ batteries }: Props) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedChemistries, setSelectedChemistries] = useState<string[]>([]);
  const [caps, setCaps] = useState<Record<string, boolean>>({});
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>("score");
  const [view, setView] = useState<"grid" | "table">("grid");

  const brands = useMemo(
    () => [...new Set(batteries.map((b) => b.brand?.name).filter(Boolean))] as string[],
    [batteries],
  );
  const chemistries = useMemo(() => [...new Set(batteries.map((b) => b.chemistry))], [batteries]);
  const priceCeiling = useMemo(() => Math.max(...batteries.map((b) => b.priceEur ?? 0), 0), [batteries]);

  const filtered = useMemo(() => {
    const rows = batteries.filter((b) => {
      if (selectedBrands.length && !selectedBrands.includes(b.brand?.name ?? "")) return false;
      if (selectedChemistries.length && !selectedChemistries.includes(b.chemistry)) return false;
      if (maxPrice > 0 && (b.priceEur ?? Infinity) > maxPrice) return false;
      for (const cf of CAP_FILTERS) if (caps[cf.key as string] && !b[cf.key]) return false;
      return true;
    });
    const sorted = [...rows];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => (a.priceEur ?? Infinity) - (b.priceEur ?? Infinity)); break;
      case "ppk-asc": sorted.sort((a, b) => (pricePerKwh(a) ?? Infinity) - (pricePerKwh(b) ?? Infinity)); break;
      case "capacity": sorted.sort((a, b) => b.capacityKwh - a.capacityKwh); break;
      case "power": sorted.sort((a, b) => b.powerKw - a.powerKw); break;
      default: sorted.sort((a, b) => b.scoreOverall - a.scoreOverall);
    }
    return sorted;
  }, [batteries, selectedBrands, selectedChemistries, caps, maxPrice, sort]);

  function toggleCap(k: string) {
    setCaps((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-6">
        <FilterPills label="Marque" options={brands} onChange={setSelectedBrands} />
        <FilterPills label="Chimie" options={chemistries} onChange={setSelectedChemistries} />

        {priceCeiling > 0 && (
          <div className="min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-mid)]">
              Prix max :{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {maxPrice > 0 ? `${maxPrice.toLocaleString("fr-BE")} €` : "illimité"}
              </span>
            </label>
            <input type="range" min={0} max={priceCeiling} step={500} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]" />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-text-mid)]">Trier par</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="pill border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-sm text-[var(--color-text)]">
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Capability filters */}
      <div className="mt-5 flex flex-wrap gap-2">
        {CAP_FILTERS.map((cf) => {
          const active = !!caps[cf.key as string];
          return (
            <button key={cf.key as string} type="button" onClick={() => toggleCap(cf.key as string)}
              className={`pill border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-text-mid)] hover:border-[var(--color-primary)]"
              }`}>
              {cf.label}
            </button>
          );
        })}
      </div>

      {/* Results header + view toggle */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </p>
        <div className="flex gap-1 rounded-full border border-[var(--color-border)] p-1 text-sm">
          <button onClick={() => setView("grid")}
            className={`rounded-full px-3 py-1 ${view === "grid" ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-mid)]"}`}>
            Grille
          </button>
          <button onClick={() => setView("table")}
            className={`rounded-full px-3 py-1 ${view === "table" ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-mid)]"}`}>
            Tableau
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => <BatteryCard key={b.id} battery={b} />)}
        </div>
      ) : (
        <CompareTable batteries={filtered} />
      )}

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[var(--color-text-muted)]">
          Aucune batterie ne correspond à vos filtres.
        </p>
      )}
    </>
  );
}
