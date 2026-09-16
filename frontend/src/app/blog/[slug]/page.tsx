import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article } from "@/lib/types";
import { getArticle } from "@/lib/strapi";
import { mockArticles } from "@/lib/mock-articles";
import { mediaUrl } from "@/lib/media";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://batteryadvisor.be";

async function loadArticle(slug: string): Promise<Article | null> {
  try {
    const a = await getArticle(slug);
    if (a) return a;
  } catch {
    /* fallback */
  }
  return mockArticles.find((a) => a.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return { title: "Article introuvable" };
  const description = article.excerpt ?? article.content?.slice(0, 160) ?? "";
  return {
    title: article.title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${article.slug}` },
    openGraph: { title: article.title, description, type: "article" },
  };
}

/* Lightweight markdown renderer for article bodies. */
function ArticleBody({ markdown }: { markdown: string }) {
  const blocks = markdown.split(/\n\n+/);
  return (
    <>
      {blocks.map((block, i) => {
        const b = block.trim();
        if (b.startsWith("## "))
          return <h2 key={i} className="mt-10 font-display text-2xl font-bold first:mt-0">{b.slice(3)}</h2>;
        if (b.startsWith("### "))
          return <h3 key={i} className="mt-8 font-display text-xl font-semibold">{b.slice(4)}</h3>;
        if (/^(-|\d+\.)\s/.test(b)) {
          const isOrdered = /^\d+\.\s/.test(b);
          const items = b.split("\n");
          const Tag = isOrdered ? "ol" : "ul";
          return (
            <Tag key={i} className={`mt-4 space-y-2 pl-6 text-[var(--color-text-mid)] ${isOrdered ? "list-decimal" : "list-disc"}`}>
              {items.map((item, j) => (
                <li key={j}>{item.replace(/^(-|\d+\.)\s?/, "")}</li>
              ))}
            </Tag>
          );
        }
        return <p key={i} className="mt-4 leading-relaxed text-[var(--color-text-mid)]">{b}</p>;
      })}
    </>
  );
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt || undefined,
    author: { "@type": "Organization", name: "BatteryAdvisor.be" },
    publisher: { "@type": "Organization", name: "BatteryAdvisor.be" },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/blog" className="hover:text-[var(--color-primary)]">Blog</Link>
        {article.category && (
          <>
            <span className="mx-2">›</span>
            <span className="text-[var(--color-text-mid)]">{article.category.name}</span>
          </>
        )}
      </nav>

      <header>
        {article.category && (
          <span className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
            {article.category.name}
          </span>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {article.title}
        </h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          {article.publishedAt && (
            <time>
              {new Date(article.publishedAt).toLocaleDateString("fr-BE", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          )}
          {article.readTimeMin ? <span>· {article.readTimeMin} min de lecture</span> : null}
        </div>
      </header>

      {mediaUrl(article.image?.url) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl(article.image?.url)}
          alt={article.title}
          className="mt-8 aspect-[1200/630] w-full rounded-xl object-cover"
          loading="lazy"
        />
      )}

      <div className="mt-10 max-w-none">
        {article.content ? <ArticleBody markdown={article.content} /> : (
          <p className="text-[var(--color-text-mid)]">Contenu à venir.</p>
        )}
      </div>

      <div className="mt-12 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-6 text-center">
        <p className="font-display text-lg font-semibold">Prêt à choisir votre batterie ?</p>
        <p className="mt-1 text-sm text-[var(--color-text-mid)]">
          Comparez les modèles ou laissez notre guide vous recommander la meilleure option.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/batteries" className="pill bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Voir les batteries
          </Link>
          <Link href="/guide" className="pill border border-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white">
            Trouver ma batterie
          </Link>
        </div>
      </div>
    </article>
  );
}
