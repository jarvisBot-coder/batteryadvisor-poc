import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import { TOPLISTS, getToplist } from "@/lib/toplists";
import ScoreCircle from "@/components/ScoreCircle";
import CapabilityBadges, { pricePerKwh } from "@/components/CapabilityBadges";
import FAQSection from "@/components/FAQSection";
import AuthorBox from "@/components/AuthorBox";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://batteryadvisor.be";

export function generateStaticParams() {
  return TOPLISTS.map((t) => ({ slug: t.slug }));
}

async function loadBatteries(): Promise<Battery[]> {
  try {
    const res = await getBatteries();
    if (res.data.length) return res.data;
  } catch {
    /* fallback */
  }
  return mockBatteries;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getToplist(slug);
  if (!t) return { title: "Classement introuvable" };
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `${SITE_URL}/toplistes/${t.slug}` },
    openGraph: { title: t.title, description: t.description, type: "article" },
  };
}

export default async function ToplistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getToplist(slug);
  if (!t) notFound();

  const batteries = await loadBatteries();
  const ranked = t.select(batteries);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: t.title,
        itemListElement: ranked.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/batteries/${b.slug}`,
          name: `${b.brand?.name ?? ""} ${b.name}`.trim(),
        })),
      },
      ...(t.faq.length
        ? [{
            "@type": "FAQPage",
            mainEntity: t.faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }]
        : []),
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/toplistes" className="hover:text-[var(--color-primary)]">Toplistes</Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--color-text-mid)]">{t.h1}</span>
      </nav>

      <header>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-primary)]">{t.eyebrow}</span>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight sm:text-4xl">{t.h1}</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-text-mid)]">{t.intro}</p>
      </header>

      {/* Ranked list */}
      <ol className="mt-10 space-y-5">
        {ranked.map((b, i) => {
          const ppk = pricePerKwh(b);
          return (
            <li key={b.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] font-display text-lg font-bold text-white">
                  {i + 1}
                </div>
                <ScoreCircle score={b.scoreOverall} size={56} />
              </div>

              <div className="flex-1">
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{b.brand?.name}</span>
                <h2 className="font-display text-lg font-semibold">
                  <Link href={`/batteries/${b.slug}`} className="hover:text-[var(--color-primary)]">{b.name}</Link>
                </h2>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--color-text-mid)]">
                  <span className="pill bg-[var(--color-ground)] px-2 py-0.5">{b.capacityKwh} kWh</span>
                  <span className="pill bg-[var(--color-ground)] px-2 py-0.5">{b.powerKw} kW</span>
                  {ppk && <span className="pill bg-[var(--color-ground)] px-2 py-0.5">{ppk} €/kWh</span>}
                </div>
                <div className="mt-2"><CapabilityBadges battery={b} /></div>
                {b.pros && b.pros.length > 0 && (
                  <p className="mt-2 text-sm text-[var(--color-text-mid)]">✓ {b.pros[0]}</p>
                )}
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">{t.metricLabel}</div>
                  <div className="font-display text-xl font-bold text-[var(--color-primary)]">{t.metric(b)}</div>
                </div>
                <Link
                  href={`/batteries/${b.slug}`}
                  className="pill bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Voir le test
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      {/* FAQ */}
      {t.faq.length > 0 && (
        <div className="card mt-10">
          <FAQSection items={t.faq} />
        </div>
      )}

      <div className="mt-8">
        <AuthorBox />
      </div>

      <p className="mt-6 text-xs text-[var(--color-text-muted)]">
        Classement établi selon notre méthodologie indépendante. Certains liens sont des liens affiliés.
      </p>
    </div>
  );
}
