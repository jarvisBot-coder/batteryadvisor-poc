import type { Metadata } from "next";
import Link from "next/link";

const mockArticle = {
  title: "Batteries domestiques en 2025 : le guide complet pour la Belgique",
  slug: "guide-batteries-domestiques-belgique-2025",
  category: { name: "Guides", slug: "guides" },
  publishedAt: "2025-01-15",
  content: `
## Pourquoi investir dans une batterie domestique ?

Avec l'essor des panneaux solaires et l'évolution des tarifs d'électricité en Belgique, la batterie domestique devient un investissement de plus en plus pertinent. En 2025, plusieurs facteurs renforcent cette tendance :

- **Tarif capacitaire en Flandre** : depuis janvier 2023, le tarif capacitaire pénalise les pics de consommation. Une batterie permet de les lisser.
- **Tarifs dynamiques** : les contrats à prix variable (Belpex) permettent de charger quand l'électricité est bon marché.
- **Autoconsommation** : stocker l'énergie solaire produite en journée pour la consommer le soir augmente significativement la rentabilité de vos panneaux.

## Quel budget prévoir ?

En Belgique, le prix d'une batterie domestique varie entre **4 000 € et 12 000 €** selon la capacité et la marque. Le coût moyen par kWh installé se situe autour de **600 à 900 €/kWh**.

### Primes disponibles

- **Flandre** : pas de prime spécifique pour les batteries en 2025
- **Wallonie** : prime de 0 à 1 750 € selon les revenus (vérifiez les conditions actuelles)
- **Bruxelles** : consultez Bruxelles Environnement pour les aides en vigueur

## Comment choisir sa batterie ?

Les critères essentiels à considérer :

1. **Capacité (kWh)** : adaptée à votre consommation nocturne. Généralement 5 à 15 kWh pour un ménage belge.
2. **Puissance (kW)** : détermine la vitesse de charge/décharge. Minimum 3 kW recommandé.
3. **Chimie** : LFP (plus sûr, plus durable) vs NMC (plus compact).
4. **Garantie** : minimum 10 ans / 6 000 cycles.
5. **Compatibilité** : avec votre onduleur et vos panneaux existants.

## Notre recommandation

Consultez nos [comparatifs détaillés](/batteries) pour trouver la batterie adaptée à votre situation. Chaque modèle est évalué selon notre méthodologie indépendante inspirée de RTINGS.
  `.trim(),
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: mockArticle.title,
    description: mockArticle.content.slice(0, 160),
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = mockArticle;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/blog" className="hover:text-[var(--color-primary)]">
          Blog
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--color-text-mid)]">
          {article.category.name}
        </span>
      </nav>

      <header>
        <span className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
          {article.category.name}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {article.title}
        </h1>
        <time className="mt-3 block text-sm text-[var(--color-text-muted)]">
          {new Date(article.publishedAt).toLocaleDateString("fr-BE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      {/* Article body */}
      <div className="prose mt-10 max-w-none">
        {article.content.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="mt-10 font-display text-2xl font-bold first:mt-0"
              >
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="mt-8 font-display text-xl font-semibold"
              >
                {block.replace("### ", "")}
              </h3>
            );
          }
          if (block.startsWith("- ") || block.startsWith("1. ")) {
            const items = block.split("\n");
            const isOrdered = block.startsWith("1.");
            const Tag = isOrdered ? "ol" : "ul";
            return (
              <Tag
                key={i}
                className={`mt-4 space-y-2 text-[var(--color-text-mid)] ${
                  isOrdered ? "list-decimal" : "list-disc"
                } pl-6`}
              >
                {items.map((item, j) => (
                  <li key={j}>{item.replace(/^[-\d]+\.\s?/, "")}</li>
                ))}
              </Tag>
            );
          }
          return (
            <p key={i} className="mt-4 leading-relaxed text-[var(--color-text-mid)]">
              {block}
            </p>
          );
        })}
      </div>
    </article>
  );
}
