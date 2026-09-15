interface ScoreBarProps {
  label: string;
  score: number; /* 0-100 */
}

function barColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export default function ScoreBar({ label, score }: ScoreBarProps) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-[var(--color-text-mid)]">
        {label}
      </span>
      <div className="relative h-2 flex-1 rounded-full bg-[var(--color-border)]">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: barColor(pct) }}
        />
      </div>
      <span className="w-8 text-right text-sm font-semibold" style={{ color: barColor(pct) }}>
        {pct}
      </span>
    </div>
  );
}
