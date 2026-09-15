"use client";

interface SectionNavProps {
  sections: { id: string; label: string }[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  return (
    <nav className="scrollbar-none flex gap-0 overflow-x-auto border-b border-[var(--color-border)]">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
