"use client";

import { useState } from "react";

interface FilterPillsProps {
  options: string[];
  label: string;
  onChange?: (selected: string[]) => void;
}

export default function FilterPills({
  options,
  label,
  onChange,
}: FilterPillsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(value: string) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(next);
    onChange?.(next);
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-[var(--color-text-mid)]">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`pill border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-text-mid)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
