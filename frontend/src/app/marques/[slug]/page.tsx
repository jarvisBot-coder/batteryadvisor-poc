import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import { getBrandGroup } from "@/lib/brands";
import BatteryCard from "@/components/BatteryCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://batteryadvisor.be";

async function loadBatteries(): Promise<Battery[]> {
  try { const res = await getBatteries(); if (res.data.length) return res.data; } catch { /* */ }
  return mockBatteries;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const br = getBrandGroup(await loadBatteries(), slug);
  if (!br) return { title: "Marque introuvable" };
  const title = `Batteries ${br.name} : avis, tests et comparatif`;
  const description = `Tous les modèles de batteries domestiques ${br.name} testés et notés par BatteryAdvisor.be${br.country ? ` — ${br.country}` : ""}.`;
  return { title, description, alternates: { canonical: `${SITE_URL}/marques/${br.slug}` }, openGraph: { title, description } };
}

export default async function MarquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const br = getBrandGroup(await loadBatteries(), slug);
  if (!br) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Marques", item: `${SITE_URL}/marques` },
          { "@type": "ListItem", position: 2, name: br.name, item: `${SITE_URL}/marques/${br.slug}` },
        ],
      },
      {
        "@type": "Brand",
        name: br.name,
        ...(br.website ? { url: br.website } : {}),
      },
      {
        "@type": "ItemList",
        name: `Batteries ${br.name}`,
        itemListElement: br.batteries.map((b, i) => ({
          "@type": "ListItem", position: i + 1,
          url: `${SITE_URL}/batteries/${b.slug}`, name: b.name,
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/marques" className="hover:text-[var(--color-primary)]">Marques</Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--color-text-mid)]">{br.name}</span>
      </nav>

      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Batteries {br.name}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-muted)]">
          {br.country && <span>Origine : {br.country}</span>}
          <span>{br.batteries.length} modèle{br.batteries.length > 1 ? "s" : ""}</span>
          <span>Score moyen : {br.avgScore}/100</span>
          {br.fromPrice != null && <span>dès {br.fromPrice.toLocaleString("fr-BE")} €</span>}
          {br.website && (
            <a href={br.website} target="_blank" rel="nofollow noopener" className="text-[var(--color-primary)] hover:underline">
              Site officiel ↗
            </a>
          )}
        </div>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {br.batteries.map((b) => <BatteryCard key={b.id} battery={b} />)}
      </div>
    </div>
  );
}
