import type { Article } from "./types";

/** Fallback blog content when Strapi is unreachable. */
export const mockArticles: Article[] = [
  {
    id: 1, documentId: "ma-1",
    title: "Batteries domestiques en Belgique : le guide complet 2026",
    slug: "guide-batteries-domestiques-belgique-2026",
    excerpt: "Tarifs, primes, rentabilité et choix du modèle : tout ce qu'il faut savoir avant d'investir dans une batterie domestique en Belgique.",
    category: { id: 1, documentId: "c1", name: "Guides", slug: "guides" },
    readTimeMin: 8,
    createdAt: "2026-01-15", updatedAt: "2026-01-15", publishedAt: "2026-01-15",
  },
  {
    id: 2, documentId: "ma-2",
    title: "LFP vs NMC : quelle chimie de batterie choisir ?",
    slug: "lfp-vs-nmc-chimie-batterie",
    excerpt: "Sécurité, durée de vie, densité : comparaison des technologies LFP et NMC pour une batterie résidentielle.",
    category: { id: 2, documentId: "c2", name: "Technologie", slug: "technologie" },
    readTimeMin: 5,
    createdAt: "2026-02-08", updatedAt: "2026-02-08", publishedAt: "2026-02-08",
  },
];
