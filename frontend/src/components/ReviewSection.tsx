interface ReviewSectionProps {
  id: string;
  icon: string;
  title: string;
  score?: number;
  children: React.ReactNode;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export default function ReviewSection({
  id,
  icon,
  title,
  score,
  children,
}: ReviewSectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-[var(--color-border)] px-4 py-7 sm:px-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--color-primary)]/10 text-base">
          {icon}
        </div>
        <h2 className="flex-1 font-display text-lg font-bold">{title}</h2>
        {score != null && (
          <span
            className="font-display text-xl font-bold"
            style={{ color: scoreColor(score) }}
          >
            {(score / 10).toFixed(1)}
          </span>
        )}
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-[var(--color-text-mid)]">
        {children}
      </div>
    </section>
  );
}
