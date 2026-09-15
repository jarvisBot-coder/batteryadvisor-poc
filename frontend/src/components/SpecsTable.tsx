interface Spec {
  label: string;
  value: string;
}

interface SpecsTableProps {
  specs: Spec[];
}

export default function SpecsTable({ specs }: SpecsTableProps) {
  return (
    <div className="card overflow-hidden">
      <h2 className="border-b border-[var(--color-border)] p-5 font-display text-lg font-semibold">
        Fiche technique complète
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {specs.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col border-b border-[var(--color-border)] px-5 py-3 ${
              i % 2 === 0 ? "sm:border-r" : ""
            }`}
          >
            <span className="text-xs text-[var(--color-text-muted)]">
              {s.label}
            </span>
            <span className="mt-0.5 text-sm font-semibold text-[var(--color-text)]">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
