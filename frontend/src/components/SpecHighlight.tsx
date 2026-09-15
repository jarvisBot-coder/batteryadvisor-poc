interface SpecItem {
  label: string;
  value: string;
}

interface SpecHighlightProps {
  items: SpecItem[];
}

export default function SpecHighlight({ items }: SpecHighlightProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg bg-[var(--color-ground)] px-4 py-3.5 text-center"
        >
          <div className="font-display text-xl font-bold text-[var(--color-primary)]">
            {item.value}
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
