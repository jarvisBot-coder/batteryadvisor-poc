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
import QuickTake from "@/components/QuickTake";
import SectionNav from "@/components/SectionNav";
import ReviewSection from "@/components/ReviewSection";
import PullQuote from "@/components/PullQuote";
import SpecHighlight from "@/components/SpecHighlight";
import SpecsTable from "@/components/SpecsTable";
import VerdictBox from "@/components/VerdictBox";
import BatteryImage from "@/components/BatteryImage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://batteryadvisor.be";

/** Model name without a redundant leading brand (data sometimes bakes the brand into the name). */
function modelName(b: Battery): string {
  const brand = b.brand?.name ?? "";
  if (brand && b.name.toLowerCase().startsWith(brand.toLowerCase())) {
    return b.name.slice(brand.length).trim();
  }
  return b.name;
}
/** Brand + model, de-duplicated. */
function fullName(b: Battery): string {
  const brand = b.brand?.name ?? "";
  return brand ? `${brand} ${modelName(b)}` : modelName(b);
}

async function loadBattery(slug: string): Promise<Battery | null> {
  try {
    const b = await getBattery(slug);
    if (b) return b;
  } catch {
    /* Strapi down — fall back to mock */
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

  const title = `${fullName(battery)} — Test & avis (${battery.scoreOverall}/100)`;
  const description =
    battery.quickTake ??
    `Test complet de la ${fullName(battery)}. ${battery.capacityKwh} kWh, ${battery.chemistry}. Score ${battery.scoreOverall}/100.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/batteries/${battery.slug}` },
    openGraph: { title, description, type: "article", url: `${SITE_URL}/batteries/${battery.slug}` },
  };
}

/* Parse the markdown review body into titled sections. */
const SECTION_ICONS = ["🔋", "⚡", "📱", "🔧", "💰", "🛡️", "📊", "🌍"];
function parseReview(markdown?: string): { title: string; paragraphs: string[] }[] {
  if (!markdown) return [];
  const sections: { title: string; paragraphs: string[] }[] = [];
  let current: { title: string; paragraphs: string[] } | null = null;
  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      current = { title: line.slice(3), paragraphs: [] };
      sections.push(current);
    } else if (line.startsWith("### ")) {
      current = { title: line.slice(4), paragraphs: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { title: "L'analyse", paragraphs: [] };
        sections.push(current);
      }
      current.paragraphs.push(line);
    }
  }
  return sections;
}

function buildHeroSpecs(b: Battery) {
  const items = [
    { label: "Capacité", value: `${b.capacityKwh} kWh` },
    { label: "Puissance", value: `${b.powerKw} kW` },
    { label: "Garantie", value: `${b.cycleWarrantyYears} ans` },
    b.cycles
      ? { label: "Cycles", value: `${(b.cycles / 1000).toFixed(0)}k` }
      : b.efficiencyPct
        ? { label: "Rendement", value: `${b.efficiencyPct}%` }
        : { label: "Chimie", value: b.chemistry },
  ];
  return items;
}

function fullSpecs(b: Battery) {
  return [
    { label: "Capacité utile", value: `${b.capacityKwh} kWh` },
    { label: "Puissance continue", value: `${b.powerKw} kW` },
    b.peakPowerWatts ? { label: "Puissance de pointe", value: `${(b.peakPowerWatts / 1000).toFixed(1)} kW` } : null,
    { label: "Chimie", value: b.chemistry },
    b.cycles ? { label: "Cycles garantis", value: b.cycles.toLocaleString("fr-BE") } : null,
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

function buildJsonLd(b: Battery) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Product",
      name: fullName(b),
      brand: b.brand?.name ? { "@type": "Brand", name: b.brand.name } : undefined,
      category: "Batterie domestique",
      offers: b.priceEur
        ? { "@type": "Offer", price: b.priceEur, priceCurrency: "EUR", availability: "https://schema.org/InStock" }
        : undefined,
      review: {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: (b.scoreOverall / 10).toFixed(1), bestRating: "10" },
        author: { "@type": "Organization", name: "BatteryAdvisor.be" },
      },
      aggregateRating: { "@type": "AggregateRating", ratingValue: (b.scoreOverall / 10).toFixed(1), bestRating: "10", ratingCount: 1 },
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

  const reviewSections = parseReview(battery.reviewBody);
  const hasShops = !!(battery.shops && battery.shops.length > 0);

  // Build the section-nav anchors from what's actually present.
  const nav: { id: string; label: string }[] = [
    { id: "scores", label: "Scores" },
    ...(reviewSections.length ? [{ id: "analyse", label: "Analyse" }] : []),
    ...(battery.pros ? [{ id: "avantages", label: "Points forts" }] : []),
    { id: "specs", label: "Fiche technique" },
    ...(battery.competitors?.length ? [{ id: "comparatif", label: "Comparatif" }] : []),
    ...(battery.faq?.length ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "verdict", label: "Verdict" },
  ];

  // A pull-quote lifted from the review (first section's first sentence) or the quick take.
  const verdictLead = battery.verdict?.split(/(?<=[.!?])\s/)[0];
  const pullText = verdictLead ?? battery.quickTake;

  const jsonLd = buildJsonLd(battery);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/batteries" className="hover:text-[var(--color-primary)]">Batteries</Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--color-text-mid)]">{fullName(battery)}</span>
      </nav>

      {/* ── Editorial hero ── */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          {battery.brand?.name}
          {battery.badge && battery.badge !== "none" && (
            <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-[10px] normal-case tracking-normal">
              {battery.badge === "coup-de-coeur" && "❤️ Coup de cœur"}
              {battery.badge === "meilleur-budget" && "💰 Meilleur budget"}
              {battery.badge === "meilleure-puissance" && "⚡ Meilleure puissance"}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-[2.6rem]">
              {modelName(battery)}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Test indépendant BatteryAdvisor
              {battery.readingTimeMin ? ` · ${battery.readingTimeMin} min de lecture` : ""}
            </p>
          </div>
          <div className="shrink-0">
            <ScoreCircle score={battery.scoreOverall} size={92} label="Score global" />
          </div>
        </div>
      </header>

      {/* Quick take */}
      {battery.quickTake && <QuickTake text={battery.quickTake} />}

      {/* Product image band */}
      <div className="mt-6 h-56 overflow-hidden rounded-xl sm:h-72">
        <BatteryImage battery={battery} rounded />
      </div>

      {/* Hero specs */}
      <div className="mt-6">
        <SpecHighlight items={buildHeroSpecs(battery)} />
      </div>

      {/* Affiliate offers — high placement */}
      {hasShops && (
        <div className="mt-6">
          <AffiliateShops shops={battery.shops} productName={battery.name} />
        </div>
      )}

      {/* Sticky section nav */}
      <div className="sticky top-0 z-10 mt-8 bg-[var(--color-ground)]/90 backdrop-blur">
        <SectionNav sections={nav} />
      </div>

      {/* The magazine body */}
      <article className="card mt-6 overflow-hidden">
        {/* Detailed scores */}
        <ReviewSection id="scores" icon="📊" title="Scores détaillés" score={battery.scoreOverall}>
          <div className="space-y-3">
            <ScoreBar label="Performance" score={battery.scorePerformance} />
            <ScoreBar label="Rapport qualité/prix" score={battery.scoreValue} />
            <ScoreBar label="Garantie" score={battery.scoreWarranty} />
            <ScoreBar label="Installation" score={battery.scoreEaseOfUse} />
            {battery.scoreApp != null && <ScoreBar label="Application" score={battery.scoreApp} />}
            {battery.scoreDesign != null && <ScoreBar label="Design" score={battery.scoreDesign} />}
          </div>
        </ReviewSection>

        {/* Review body split into sections */}
        {reviewSections.map((sec, i) => (
          <ReviewSection
            key={sec.title + i}
            id={i === 0 ? "analyse" : `analyse-${i}`}
            icon={SECTION_ICONS[i % SECTION_ICONS.length]}
            title={sec.title}
          >
            {sec.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {/* Drop a pull-quote after the first analysis section */}
            {i === 0 && pullText && <PullQuote>« {pullText} »</PullQuote>}
          </ReviewSection>
        ))}

        {/* Pros & cons */}
        {battery.pros && battery.cons && (
          <section id="avantages" className="scroll-mt-20 border-b border-[var(--color-border)] px-4 py-7 sm:px-6">
            <h2 className="mb-4 font-display text-lg font-bold">Points forts &amp; points faibles</h2>
            <ProConGrid pros={battery.pros} cons={battery.cons} />
          </section>
        )}

        {/* Full specs table */}
        <section id="specs" className="scroll-mt-20 border-b border-[var(--color-border)] px-4 py-7 sm:px-6">
          <SpecsTable specs={fullSpecs(battery)} />
        </section>

        {/* Competitors */}
        {battery.competitors && battery.competitors.length > 0 && (
          <section id="comparatif" className="scroll-mt-20 border-b border-[var(--color-border)]">
            <ComparisonTable
              currentName={fullName(battery)}
              currentCapacity={`${battery.capacityKwh} kWh`}
              currentPower={`${battery.powerKw} kW`}
              currentPrice={battery.priceEur}
              currentScore={battery.scoreOverall}
              competitors={battery.competitors}
            />
          </section>
        )}

        {/* FAQ */}
        {battery.faq && battery.faq.length > 0 && (
          <section id="faq" className="scroll-mt-20 border-b border-[var(--color-border)]">
            <FAQSection items={battery.faq} />
          </section>
        )}

        {/* Verdict */}
        <div id="verdict" className="scroll-mt-20">
          <VerdictBox
            score={battery.scoreOverall}
            verdict={battery.verdict ?? battery.quickTake ?? ""}
            idealFor={battery.idealFor}
            notFor={battery.notFor}
            alternativePick={battery.alternativePick}
            priceRange={battery.priceEur ? `dès ${battery.priceEur.toLocaleString("fr-BE")} €` : undefined}
          />
        </div>
      </article>

      {/* Closing affiliate CTA */}
      {hasShops && (
        <div className="mt-6">
          <AffiliateShops shops={battery.shops} productName={battery.name} />
        </div>
      )}
    </div>
  );
}
