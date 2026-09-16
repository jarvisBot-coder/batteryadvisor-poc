import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Battery } from "@/lib/types";
import { getBattery } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import ScoreCircle from "@/components/ScoreCircle";
import ScoreBar from "@/components/ScoreBar";
import ProConGrid from "@/components/ProConGrid";
import AffiliateShops from "@/components/AffiliateShops";
import FAQSection from "@/components/FAQSection";
import ComparisonTable from "@/components/ComparisonTable";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://batteryadvisor.be";

/** Fetch from Strapi, fall back to mock data when the backend is unreachable. */
async function loadBattery(slug: string): Promise<Battery | null> {
  try {
    const b = await getBattery(slug);
    if (b) return b;
  } catch {
    // Strapi down — fall through to mock.
  }
  return mockBatteries.find((b) => b.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const battery = await loadBattery(slug);
  if (!battery) return { title: "Batterie introuvable" };

  const title = `${battery.brand?.name ?? ""} ${battery.name} — Test & avis (${battery.scoreOverall}/100)`.trim();
  const description =
    battery.quickTake ??
    `Test complet de la ${battery.brand?.name ?? ""} ${battery.name}. ${battery.capacityKwh} kWh, ${battery.chemistry}. Score ${battery.scoreOverall}/100.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/batteries/${battery.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/batteries/${battery.slug}`,
    },
  };
}

/* ── Minimal markdown renderer for the review body ── */
function ReviewBody({ markdown }: { markdown: string }) {
  const blocks = markdown.split(/\n\n+/);
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="font-display text-lg font-semibold">
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="font-display text-xl font-bold">
              {trimmed.slice(3)}
            </h2>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-[var(--color-text-mid)]">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

function specs(b: Battery) {
  return [
    { label: "Capacité", value: `${b.capacityKwh} kWh` },
    { label: "Puissance", value: `${b.powerKw} kW` },
    b.peakPowerWatts
      ? { label: "Puissance de pointe", value: `${(b.peakPowerWatts / 1000).toFixed(1)} kW` }
      : null,
    { label: "Chimie", value: b.chemistry },
    b.cycles ? { label: "Cycles", value: b.cycles.toLocaleString("fr-BE") } : null,
    { label: "Garantie", value: `${b.cycleWarrantyYears} ans` },
    b.efficiencyPct ? { label: "Rendement", value: `${b.efficiencyPct} %` } : null,
    b.depthOfDischarge ? { label: "Profondeur de décharge", value: `${b.depthOfDischarge} %` } : null,
    b.weightKg ? { label: "Poids", value: `${b.weightKg} kg` } : null,
    b.dimensions ? { label: "Dimensions", value: b.dimensions } : null,
    b.ipRating ? { label: "Indice de protection", value: b.ipRating } : null,
    b.inverterType ? { label: "Onduleur", value: b.inverterType } : null,
    b.connectivity ? { label: "Connectivité", value: b.connectivity } : null,
    { label: "Prix indicatif", value: b.priceEur ? `${b.priceEur.toLocaleString("fr-BE")} €` : "—" },
  ].filter(Boolean) as { label: string; value: string }[];
}

/* ── JSON-LD structured data (Product + Review + FAQ) ── */
function buildJsonLd(b: Battery) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Product",
      name: `${b.brand?.name ?? ""} ${b.name}`.trim(),
      brand: b.brand?.name ? { "@type": "Brand", name: b.brand.name } : undefined,
      category: "Batterie domestique",
      offers: b.priceEur
        ? {
            "@type": "Offer",
            price: b.priceEur,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          }
        : undefined,
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: (b.scoreOverall / 10).toFixed(1),
          bestRating: "10",
        },
        author: { "@type": "Organization", name: "BatteryAdvisor.be" },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (b.scoreOverall / 10).toFixed(1),
        bestRating: "10",
        ratingCount: 1,
      },
    },
  ];

  if (b.faq && b.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: b.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export default async function BatteryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const battery = await loadBattery(slug);
  if (!battery) notFound();

  const jsonLd = buildJsonLd(battery);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/batteries" className="hover:text-[var(--color-primary)]">
          Batteries
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--color-text-mid)]">
          {battery.brand?.name} {battery.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {battery.brand && (
            <span className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
              {battery.brand.name}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {battery.name}
          </h1>
          {battery.readingTimeMin && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Lecture {battery.readingTimeMin} min
            </p>
          )}
        </div>
        <ScoreCircle score={battery.scoreOverall} size={88} label="Score global" />
      </div>

      {/* Quick take */}
      {battery.quickTake && (
        <div className="card mt-8 border-l-4 border-l-[var(--color-primary)] p-6">
          <p className="text-lg leading-relaxed">{battery.quickTake}</p>
        </div>
      )}

      {/* Affiliate offers — the money box, placed high */}
      {battery.shops && battery.shops.length > 0 && (
        <div className="mt-6">
          <AffiliateShops shops={battery.shops} productName={battery.name} />
        </div>
      )}

      {/* Score breakdown */}
      <div className="card mt-6 space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Scores détaillés</h2>
        <ScoreBar label="Performance" score={battery.scorePerformance} />
        <ScoreBar label="Valeur" score={battery.scoreValue} />
        <ScoreBar label="Garantie" score={battery.scoreWarranty} />
        <ScoreBar label="Installation" score={battery.scoreEaseOfUse} />
        {battery.scoreApp != null && (
          <ScoreBar label="Application" score={battery.scoreApp} />
        )}
        {battery.scoreDesign != null && (
          <ScoreBar label="Design" score={battery.scoreDesign} />
        )}
      </div>

      {/* Specs table */}
      <div className="card mt-6 overflow-hidden">
        <h2 className="border-b border-[var(--color-border)] p-5 font-display text-lg font-semibold">
          Caractéristiques
        </h2>
        <div className="divide-y divide-[var(--color-border)]">
          {specs(battery).map((s) => (
            <div key={s.label} className="flex justify-between px-5 py-3 text-sm">
              <span className="text-[var(--color-text-mid)]">{s.label}</span>
              <span className="font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pros & cons */}
      {battery.pros && battery.cons && (
        <div className="mt-6">
          <ProConGrid pros={battery.pros} cons={battery.cons} />
        </div>
      )}

      {/* Full review body */}
      {battery.reviewBody && (
        <div className="card mt-6 p-6">
          <ReviewBody markdown={battery.reviewBody} />
        </div>
      )}

      {/* Competitors comparison */}
      {battery.competitors && battery.competitors.length > 0 && (
        <div className="card mt-6 overflow-hidden">
          <ComparisonTable
            currentName={`${battery.brand?.name ?? ""} ${battery.name}`.trim()}
            currentCapacity={`${battery.capacityKwh} kWh`}
            currentPower={`${battery.powerKw} kW`}
            currentPrice={battery.priceEur}
            currentScore={battery.scoreOverall}
            competitors={battery.competitors}
          />
        </div>
      )}

      {/* FAQ */}
      {battery.faq && battery.faq.length > 0 && (
        <div className="card mt-6 p-6">
          <h2 className="mb-2 font-display text-lg font-semibold">
            Questions fréquentes
          </h2>
          <FAQSection items={battery.faq} />
        </div>
      )}

      {/* Verdict */}
      {battery.verdict && (
        <div className="card mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">Notre verdict</h2>
          <p className="mt-2 leading-relaxed text-[var(--color-text-mid)]">
            {battery.verdict}
          </p>
          {battery.alternativePick && (
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Alternative à considérer : <strong>{battery.alternativePick}</strong>
            </p>
          )}
        </div>
      )}

      {/* Secondary affiliate CTA */}
      {battery.shops && battery.shops.length > 0 && (
        <div className="mt-6">
          <AffiliateShops shops={battery.shops} productName={battery.name} />
        </div>
      )}
    </div>
  );
}
