interface ProConGridProps {
  pros: string[];
  cons: string[];
}

export default function ProConGrid({ pros, cons }: ProConGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Pros */}
      <div className="card p-5">
        <h4 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-green-600">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-green-100 text-sm">
            ✓
          </span>
          Points forts
        </h4>
        <ul className="space-y-2">
          {pros.map((p) => (
            <li
              key={p}
              className="flex items-start gap-2 text-sm text-[var(--color-text-mid)]"
            >
              <span className="mt-0.5 text-green-500">+</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="card p-5">
        <h4 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-red-500">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-red-100 text-sm">
            ✗
          </span>
          Points faibles
        </h4>
        <ul className="space-y-2">
          {cons.map((c) => (
            <li
              key={c}
              className="flex items-start gap-2 text-sm text-[var(--color-text-mid)]"
            >
              <span className="mt-0.5 text-red-400">−</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
