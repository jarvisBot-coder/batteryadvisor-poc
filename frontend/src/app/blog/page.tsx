import type { Metadata } from "next";
import Link from "next/link";
import type { Article } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog & Guides",
  description:
    "Articles, guides et actualités sur les batteries domestiques en Belgique.",
};

const mockArticles: Article[] = [
  {
    id: 1,
    documentId: "1",
    title: "Batteries domestiques en 2025 : le guide complet pour la Belgique",
    slug: "guide-batteries-domestiques-belgique-2025",
    excerpt:
      "Tout ce qu'il faut savoir avant d'investir dans une batterie domestique en Belgique : tarifs, primes, rentabilité et choix du modèle.",
    category: { id: 1, documentId: "1", name: "Guides", slug: "guides" },
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
    publishedAt: "2025-01-15",
  },
  {
    id: 2,
    documentId: "2",
    title: "LFP vs NMC : quelle chimie choisir ?",
    slug: "lfp-vs-nmc-chimie-batterie",
    excerpt:
      "Comparaison détaillée des technologies LFP et NMC pour les batteries résidentielles. Sécurité, durée de vie et performances.",
    category: { id: 2, documentId: "2", name: "Technologie", slug: "technologie" },
    createdAt: "2025-02-08",
    updatedAt: "2025-02-08",
    publishedAt: "2025-02-08",
  },
  {
    id: 3,
    documentId: "3",
    title: "Tarif capacitaire en Flandre : impact sur la rentabilité",
    slug: "tarif-capacitaire-flandre-batteries",
    excerpt:
      "Le tarif capacitaire flamand change la donne pour les propriétaires de batteries. Analyse de l'impact sur votre investissement.",
    category: { id: 3, documentId: "3", name: "Belgique", slug: "belgique" },
    createdAt: "2025-03-20",
    updatedAt: "2025-03-20",
    publishedAt: "2025-03-20",
  },
  {
    id: 4,
    documentId: "4",
    title: "Comment lire nos scores de batteries",
    slug: "methodologie-scores-batteries",
    excerpt:
      "Découvrez notre méthodologie de test inspirée de RTINGS. 5 critères pondérés pour un score objectif et reproductible.",
    category: { id: 1, documentId: "1", name: "Guides", slug: "guides" },
    createdAt: "2025-04-05",
    updatedAt: "2025-04-05",
    publishedAt: "2025-04-05",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Blog & Guides
      </h1>
      <p className="mt-2 text-[var(--color-text-mid)]">
        Articles, guides pratiques et actualités sur les batteries domestiques
        en Belgique.
      </p>

      <div className="mt-10 space-y-6">
        {mockArticles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="card group flex flex-col gap-3 p-6 transition-shadow hover:shadow-lg sm:flex-row sm:gap-6"
          >
            {/* Placeholder thumbnail */}
            <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-lg bg-[var(--color-ground)] text-4xl sm:h-auto sm:w-40">
              📝
            </div>
            <div className="flex flex-col">
              {article.category && (
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
                  {article.category.name}
                </span>
              )}
              <h2 className="mt-1 font-display text-lg font-semibold group-hover:text-[var(--color-primary)] transition-colors">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-mid)]">
                  {article.excerpt}
                </p>
              )}
              <time className="mt-auto pt-3 text-xs text-[var(--color-text-muted)]">
                {new Date(article.publishedAt).toLocaleDateString("fr-BE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
