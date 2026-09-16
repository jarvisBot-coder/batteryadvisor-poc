import type { Metadata } from "next";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import { deriveBrands } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Marques de batteries domestiques",
  description:
    "Toutes les marques de batteries domestiques comparées sur BatteryAdvisor.be : Tesla, BYD, Huawei, Enphase, Zendure, Sungrow et plus.",
};

async function loadBatteries(): Promise<Battery[]> {
  try { const res = await getBatteries(); if (res.data.length) return res.data; } catch { /* */ }
  return mockBatteries;
}

export default async function MarquesPage() {
  const brands = deriveBrands(await loadBatteries());
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Marques</h1>
        <p className="mt-2 text-[var(--color-text-mid)]">
          {brands.length} marques de batteries domestiques testées et comparées.
        </p>
      </header>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((br) => (
          <Link key={br.slug} href={`/marques/${br.slug}`} className="card group p-6 transition-shadow hover:shadow-lg">
            <h2 className="font-display text-lg font-semibold group-hover:text-[var(--color-primary)]">{br.name}</h2>
            {br.country && <p className="text-xs text-[var(--color-text-muted)]">{br.country}</p>}
            <p className="mt-3 text-sm text-[var(--color-text-mid)]">
              {br.batteries.length} modèle{br.batteries.length > 1 ? "s" : ""} · score moyen {br.avgScore}/100
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
