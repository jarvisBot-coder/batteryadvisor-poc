import type { Metadata } from "next";
import Link from "next/link";
import { TOPLISTS } from "@/lib/toplists";

export const metadata: Metadata = {
  title: "Toplistes : les meilleurs classements de batteries domestiques",
  description:
    "Nos classements de batteries domestiques plug-in pour la Belgique : meilleures 2026, meilleur rapport qualité-prix, backup, puissance, balcon et grande capacité.",
};

export default function ToplistesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Toplistes</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-text-mid)]">
          Nos classements par usage et par critère, mis à jour au fil de nos tests.
        </p>
      </header>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {TOPLISTS.map((t) => (
          <Link key={t.slug} href={`/toplistes/${t.slug}`} className="card group p-6 transition-shadow hover:shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">{t.eyebrow}</span>
            <h2 className="mt-1 font-display text-lg font-semibold group-hover:text-[var(--color-primary)]">{t.h1}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-mid)]">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
