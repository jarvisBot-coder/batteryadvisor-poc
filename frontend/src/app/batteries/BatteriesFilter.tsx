"use client";

import { useState, useMemo } from "react";
import type { Battery } from "@/lib/types";
import BatteryCard from "@/components/BatteryCard";
import FilterPills from "@/components/FilterPills";

interface Props {
  batteries: Battery[];
}

export default function BatteriesFilter({ batteries }: Props) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedChemistries, setSelectedChemistries] = useState<string[]>([]);

  const brands = useMemo(
    () => [...new Set(batteries.map((b) => b.brand?.name).filter(Boolean))] as string[],
    [batteries],
  );

  const chemistries = useMemo(
    () => [...new Set(batteries.map((b) => b.chemistry))],
    [batteries],
  );

  const filtered = useMemo(() => {
    return batteries.filter((b) => {
      if (selectedBrands.length && !selectedBrands.includes(b.brand?.name ?? ""))
        return false;
      if (selectedChemistries.length && !selectedChemistries.includes(b.chemistry))
        return false;
      return true;
    });
  }, [batteries, selectedBrands, selectedChemistries]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-6">
        <FilterPills
          label="Marque"
          options={brands}
          onChange={setSelectedBrands}
        />
        <FilterPills
          label="Chimie"
          options={chemistries}
          onChange={setSelectedChemistries}
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
