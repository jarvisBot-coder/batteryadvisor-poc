interface VerdictBoxProps {
  score: number;
  verdict: string;
  idealFor?: string[];
  notFor?: string[];
  alternativePick?: string;
  priceRange?: string;
}

function scoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Très bien";
  if (score >= 55) return "Bien";
  if (score >= 40) return "Correct";
  return "Insuffisant";
}

export default function VerdictBox({
  score,
  verdict,
  idealFor,
  notFor,
  alternativePick,
  priceRange,
}: VerdictBoxProps) {
  return (
    <div className="mx-4 my-7 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-6 sm:mx-6">
      <h2 className="font-display text-lg font-bold text-[var(--color-primary)]">
        🏆 Notre verdict
      </h2>
      <p className="mb-3 text-xs text-[var(--color-text-muted)]">
        Score final : {score}/100 — {scoreLabel(score)}
      </p>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-mid)]">
        {verdict}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {idealFor && idealFor.length > 0 && (
          <div className="rounded-lg bg-[var(--color-card)] p-3.5">
            <span className="text-xs font-bold text-[var(--color-text)]">
              ✅ Idéal pour
            </span>
            <p className="mt-1 text-xs text-[var(--color-text-mid)]">
              {idealFor.join(", ")}
            </p>
          </div>
        )}
        {notFor && notFor.length > 0 && (
          <div className="rounded-lg bg-[var(--color-card)] p-3.5">
            <span className="text-xs font-bold text-[var(--color-text)]">
              ⚠️ Moins adapté pour
            </span>
            <p className="mt-1 text-xs text-[var(--color-text-mid)]">
              {notFor.join(", ")}
            </p>
          </div>
        )}
        {alternativePick && (
          <div className="rounded-lg bg-[var(--color-card)] p-3.5">
            <span className="text-xs font-bold text-[var(--color-text)]">
              🔄 Alternative recommandée
            </span>
            <p className="mt-1 text-xs text-[var(--color-text-mid)]">
              {alternativePick}
            </p>
          </div>
        )}
        {priceRange && (
          <div className="rounded-lg bg-[var(--color-card)] p-3.5">
            <span className="text-xs font-bold text-[var(--color-text)]">
              💰 Prix constaté Belgique
            </span>
            <p className="mt-1 text-xs text-[var(--color-text-mid)]">
              {priceRange}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
