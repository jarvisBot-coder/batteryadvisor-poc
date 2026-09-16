"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compare";

export default function CompareBar() {
  const { items, remove, clear } = useCompare();
  if (items.length === 0) return null;

  const href = `/comparateur?ids=${items.map((i) => encodeURIComponent(i.slug)).join(",")}`;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <span className="text-sm font-semibold">Comparateur ({items.length})</span>
        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((i) => (
            <span key={i.slug} className="pill flex items-center gap-1.5 bg-[var(--color-ground)] px-2.5 py-1 text-xs">
              {i.name}
              <button onClick={() => remove(i.slug)} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" aria-label="Retirer">×</button>
            </span>
          ))}
        </div>
        <button onClick={clear} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
          Vider
        </button>
        <Link
          href={href}
          className="pill bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Comparer →
        </Link>
      </div>
    </div>
  );
}
