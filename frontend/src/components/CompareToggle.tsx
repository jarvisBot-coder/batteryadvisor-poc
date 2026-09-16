"use client";

import type { Battery } from "@/lib/types";
import { useCompare } from "@/lib/compare";

export default function CompareToggle({ battery }: { battery: Battery }) {
  const { has, toggle, items, max } = useCompare();
  const active = has(battery.slug);
  const full = !active && items.length >= max;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!full) toggle({ slug: battery.slug, name: battery.name, brand: battery.brand?.name });
      }}
      disabled={full}
      aria-pressed={active}
      title={full ? `Maximum ${max} batteries` : active ? "Retirer du comparateur" : "Ajouter au comparateur"}
      className={`absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm transition-colors ${
        active
          ? "bg-[var(--color-primary)] text-white"
          : full
            ? "cursor-not-allowed bg-[var(--color-card)]/80 text-[var(--color-text-muted)]"
            : "bg-[var(--color-card)]/90 text-[var(--color-text-mid)] hover:bg-[var(--color-primary)] hover:text-white"
      }`}
    >
      {active ? "✓ Comparer" : "+ Comparer"}
    </button>
  );
}
