import type { Metadata } from "next";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { getArticles } from "@/lib/strapi";
import { mockArticles } from "@/lib/mock-articles";

export const metadata: Metadata = {
  title: "Blog & Guides",
  description:
    "Articles, guides et actualités sur les batteries domestiques en Belgique.",
};

async function loadArticles(): Promise<Article[]> {
  try {
    const res = await getArticles();
    if (res.data.length) return res.data;
  } catch {
    /* fallback */
  }
  return mockArticles;
}

export default async function BlogPage() {
  const articles = await loadArticles();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Blog &amp; Guides</h1>
      <p className="mt-2 text-[var(--color-text-mid)]">
        Articles, guides pratiques et actualités sur les batteries domestiques en Belgique.
      </p>

      <div className="mt-10 space-y-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="card group flex flex-col gap-3 p-6 transition-shadow hover:shadow-lg sm:flex-row sm:gap-6"
          >
            <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-lg bg-[var(--color-ground)] text-4xl sm:h-auto sm:w-40">
              📝
            </div>
            <div className="flex flex-col">
              {article.category && (
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
                  {article.category.name}
                </span>
              )}
              <h2 className="mt-1 font-display text-lg font-semibold transition-colors group-hover:text-[var(--color-primary)]">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-mid)]">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-[var(--color-text-muted)]">
                {article.publishedAt && (
                  <time>
                    {new Date(article.publishedAt).toLocaleDateString("fr-BE", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </time>
                )}
                {article.readTimeMin ? <span>· {article.readTimeMin} min</span> : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
