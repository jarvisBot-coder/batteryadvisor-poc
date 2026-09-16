"use client";

import { useState, useMemo } from "react";
import type { Battery } from "@/lib/types";
import BatteryCard from "@/components/BatteryCard";
import FilterPills from "@/components/FilterPills";

interface Props {
  batteries: Battery[];
}

type SortKey = "score" | "price-asc" | "capacity" | "power";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Meilleur score" },
  { key: "price-asc", label: "Prix croissant" },
  { key: "capacity", label: "Capacité" },
  { key: "power", label: "Puissance" },
];

export default function BatteriesFilter({ batteries }: Props) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedChemistries, setSelectedChemistries] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(0); // 0 = no limit
  const [sort, setSort] = useState<SortKey>("score");

  const brands = useMemo(
    () => [...new Set(batteries.map((b) => b.brand?.name).filter(Boolean))] as string[],
    [batteries],
  );
  const chemistries = useMemo(
    () => [...new Set(batteries.map((b) => b.chemistry))],
    [batteries],
  );
  const priceCeiling = useMemo(
    () => Math.max(...batteries.map((b) => b.priceEur ?? 0), 0),
    [batteries],
  );

  const filtered = useMemo(() => {
    const rows = batteries.filter((b) => {
      if (selectedBrands.length && !selectedBrands.includes(b.brand?.name ?? "")) return false;
      if (selectedChemistries.length && !selectedChemistries.includes(b.chemistry)) return false;
      if (maxPrice > 0 && (b.priceEur ?? Infinity) > maxPrice) return false;
      return true;
    });
    const sorted = [...rows];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => (a.priceEur ?? Infinity) - (b.priceEur ?? Infinity));
        break;
      case "capacity":
        sorted.sort((a, b) => b.capacityKwh - a.capacityKwh);
        break;
      case "power":
        sorted.sort((a, b) => b.powerKw - a.powerKw);
        break;
      default:
        sorted.sort((a, b) => b.scoreOverall - a.scoreOverall);
    }
    return sorted;
  }, [batteries, selectedBrands, selectedChemistries, maxPrice, sort]);

  return (
    <>
      <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-6">
        <FilterPills label="Marque" options={brands} onChange={setSelectedBrands} />
        <FilterPills label="Chimie" options={chemistries} onChange={setSelectedChemistries} />

        {/* Price slider */}
        {priceCeiling > 0 && (
          <div className="min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-mid)]">
              Prix max&nbsp;:{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {maxPrice > 0 ? `${maxPrice.toLocaleString("fr-BE")} €` : "illimité"}
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={priceCeiling}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </div>
        )}

        {/* Sort */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-text-mid)]">
            Trier par
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="pill border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-sm text-[var(--color-text)]"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-[var(--color-text-muted)]">
        {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <BatteryCard key={b.id} battery={b} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[var(--color-text-muted)]">
          Aucune batterie ne correspond à vos filtres.
        </p>
      )}
    </>
  );
}
