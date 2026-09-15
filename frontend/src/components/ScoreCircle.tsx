interface ScoreCircleProps {
  score: number; /* 0-100 */
  size?: number; /* px, default 64 */
  label?: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export default function ScoreCircle({
  score,
  size = 64,
  label,
}: ScoreCircleProps) {
  const pct = Math.min(100, Math.max(0, score));
  const color = scoreColor(pct);
  const trackColor = "var(--color-border)";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="score-ring"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${pct * 3.6}deg, ${trackColor} 0deg)`,
        }}
      >
        <span
          className="grid place-items-center rounded-full bg-[var(--color-card)] font-bold"
          style={{
            width: size - 10,
            height: size - 10,
            fontSize: size * 0.3,
            color,
          }}
        >
          {pct}
        </span>
      </div>
      {label && (
        <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      )}
    </div>
  );
}
