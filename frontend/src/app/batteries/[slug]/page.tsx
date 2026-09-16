import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Battery } from "@/lib/types";
import { getBattery, getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import ScoreBar from "@/components/ScoreBar";
import ProConGrid from "@/components/ProConGrid";
import FAQSection from "@/components/FAQSection";
import ComparisonTable from "@/components/ComparisonTable";
import QuickTake from "@/components/QuickTake";
import SectionNav from "@/components/SectionNav";
import ReviewSection from "@/components/ReviewSection";
import PullQuote from "@/components/PullQuote";
import SpecsTable from "@/components/SpecsTable";
import VerdictBox from "@/components/VerdictBox";
import CapabilityBadges, { pricePerKwh } from "@/components/CapabilityBadges";
import AuthorBox from "@/components/AuthorBox";
import StickyBuyBox from "@/components/StickyBuyBox";
import BatteryCard from "@/components/BatteryCard";
import TestProtocol from "@/components/TestProtocol";
import ConfigTable from "@/components/ConfigTable";
import VideoEmbed from "@/components/VideoEmbed";
import ReviewsSection from "@/components/ReviewsSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://batteryadvisor.be";

function modelName(b: Battery): string {
  const brand = b.brand?.name ?? "";
  if (brand && b.name.toLowerCase().startsWith(brand.toLowerCase())) return b.name.slice(brand.length).trim();
  return b.name;
}
function fullName(b: Battery): string {
  const brand = b.brand?.name ?? "";
  return brand ? `${brand} ${modelName(b)}` : modelName(b);
}

async function loadBattery(slug: string): Promise<Battery | null> {
  try {
    const b = await getBattery(slug);
    if (b) return b;
  } catch { /* fall back */ }
  return mockBatteries.find((b) => b.slug === slug) ?? null;
}

async function loadAll(): Promise<Battery[]> {
  try {
    const res = await getBatteries();
    if (res.data.length) return res.data;
  } catch { /* */ }
  return mockBatteries;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const battery = await loadBattery(slug);
  if (!battery) return { title: "Batterie introuvable" };
  const title = `${fullName(battery)} — Test & avis (${battery.scoreOverall}/100)`;
  const description = battery.quickTake ?? `Test complet de la ${fullName(battery)}. ${battery.capacityKwh} kWh, ${battery.chemistry}. Score ${battery.scoreOverall}/100.`;
  return {
    title, description,
    alternates: { canonical: `${SITE_URL}/batteries/${battery.slug}` },
    openGraph: { title, description, type: "article", url: `${SITE_URL}/batteries/${battery.slug}` },
  };
}

const SECTION_ICONS = ["🔋", "⚡", "📱", "🔧", "💰", "🛡️", "📊", "🌍"];
function parseReview(markdown?: string): { title: string; paragraphs: string[] }[] {
  if (!markdown) return [];
  const sections: { title: string; paragraphs: string[] }[] = [];
  let current: { title: string; paragraphs: string[] } | null = null;
  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("## ")) { current = { title: line.slice(3), paragraphs: [] }; sections.push(current); }
    else if (line.startsWith("### ")) { current = { title: line.slice(4), paragraphs: [] }; sections.push(current); }
    else { if (!current) { current = { title: "L'analyse", paragraphs: [] }; sections.push(current); } current.paragraphs.push(line); }
  }
  return sections;
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
    pricePerKwh(b) ? { label: "Prix / kWh", value: `${pricePerKwh(b)!.toLocaleString("fr-BE")} €` } : null,
  ].filter(Boolean) as { label: string; value: string }[];
}

function buildJsonLd(b: Battery) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Product",
      name: fullName(b),
      brand: b.brand?.name ? { "@type": "Brand", name: b.brand.name } : undefined,
      category: "Batterie domestique",
      offers: b.priceEur ? { "@type": "Offer", price: b.priceEur, priceCurrency: "EUR", availability: "https://schema.org/InStock" } : undefined,
      review: { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: (b.scoreOverall / 10).toFixed(1), bestRating: "10" }, author: { "@type": "Organization", name: "BatteryAdvisor.be" } },
      aggregateRating: { "@type": "AggregateRating", ratingValue: (b.scoreOverall / 10).toFixed(1), bestRating: "10", ratingCount: 1 },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Batteries", item: `${SITE_URL}/batteries` },
        { "@type": "ListItem", position: 2, name: fullName(b), item: `${SITE_URL}/batteries/${b.slug}` },
      ],
    },
  ];
  if (b.faq && b.faq.length > 0) {
    graph.push({ "@type": "FAQPage", mainEntity: b.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export default async function BatteryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [battery, all] = await Promise.all([loadBattery(slug), loadAll()]);
  if (!battery) notFound();

  const reviewSections = parseReview(battery.reviewBody);

  // Related: same brand first, then closest by capacity — up to 4.
  const others = all.filter((x) => x.slug !== battery.slug);
  const sameBrand = others.filter((x) => x.brand?.slug && x.brand.slug === battery.brand?.slug);
  const rest = others
    .filter((x) => !(x.brand?.slug && x.brand.slug === battery.brand?.slug))
    .sort((a, b) => Math.abs(a.capacityKwh - battery.capacityKwh) - Math.abs(b.capacityKwh - battery.capacityKwh));
  const related = [...sameBrand, ...rest].slice(0, 4);

  const nav: { id: string; label: string }[] = [
    { id: "scores", label: "Scores" },
    ...(reviewSections.length ? [{ id: "analyse", label: "Analyse" }] : []),
    ...(battery.pros ? [{ id: "avantages", label: "Points forts" }] : []),
    { id: "specs", label: "Fiche technique" },
    ...(battery.configurations?.length ? [{ id: "config", label: "Configurations" }] : []),
    ...(battery.competitors?.length ? [{ id: "comparatif", label: "Comparatif" }] : []),
    ...(battery.faq?.length ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "verdict", label: "Verdict" },
    { id: "avis", label: "Avis" },
  ];

  const verdictLead = battery.verdict?.split(/(?<=[.!?])\s/)[0];
  const pullText = verdictLead ?? battery.quickTake;
  const jsonLd = buildJsonLd(battery);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--color-text-muted)]">
        <Link href="/batteries" className="hover:text-[var(--color-primary)]">Batteries</Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--color-text-mid)]">{fullName(battery)}</span>
      </nav>

      {/* Hero (full width, above columns) */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          {battery.brand?.name}
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-[2.6rem]">{modelName(battery)}</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Test indépendant BatteryAdvisor{battery.readingTimeMin ? ` · ${battery.readingTimeMin} min de lecture` : ""}
        </p>
        <div className="mt-4"><CapabilityBadges battery={battery} size="md" /></div>
      </header>

      {/* Two-column: content + sticky buy-box */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
        {/* Sidebar — first in DOM so it appears near the top on mobile */}
        <aside className="mb-8 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
          <StickyBuyBox battery={battery} />
        </aside>

        {/* Main content */}
        <main className="lg:col-start-1 lg:row-start-1">
          <AuthorBox updatedAt={battery.updatedAt} />

          {battery.quickTake && <div className="mt-6"><QuickTake text={battery.quickTake} /></div>}

          {battery.videoUrl && <div className="mt-6"><VideoEmbed url={battery.videoUrl} title={fullName(battery)} /></div>}

          {/* Section nav */}
          <div className="sticky top-0 z-10 mt-8 bg-[var(--color-ground)]/90 backdrop-blur">
            <SectionNav sections={nav} />
          </div>

          <article className="card mt-6 overflow-hidden">
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

            <TestProtocol setup={battery.testSetup} />

            {reviewSections.map((sec, i) => (
              <ReviewSection key={sec.title + i} id={i === 0 ? "analyse" : `analyse-${i}`} icon={SECTION_ICONS[i % SECTION_ICONS.length]} title={sec.title}>
                {sec.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
                {i === 0 && pullText && <PullQuote>« {pullText} »</PullQuote>}
              </ReviewSection>
            ))}

            {battery.pros && battery.cons && (
              <section id="avantages" className="scroll-mt-20 border-b border-[var(--color-border)] px-4 py-7 sm:px-6">
                <h2 className="mb-4 font-display text-lg font-bold">Points forts &amp; points faibles</h2>
                <ProConGrid pros={battery.pros} cons={battery.cons} />
              </section>
            )}

            <section id="specs" className="scroll-mt-20 border-b border-[var(--color-border)] px-4 py-7 sm:px-6">
              <SpecsTable specs={fullSpecs(battery)} />
            </section>

            {battery.configurations && battery.configurations.length > 0 && (
              <section id="config" className="scroll-mt-20 border-b border-[var(--color-border)] px-4 py-7 sm:px-6">
                <h2 className="mb-1 font-display text-lg font-bold">Configurations &amp; extensions</h2>
                <p className="mb-4 text-sm text-[var(--color-text-mid)]">Prix indicatifs par palier de capacité — le coût au kWh baisse quand on étend.</p>
                <ConfigTable configs={battery.configurations} />
              </section>
            )}

            {battery.competitors && battery.competitors.length > 0 && (
              <section id="comparatif" className="scroll-mt-20 border-b border-[var(--color-border)]">
                <ComparisonTable currentName={fullName(battery)} currentCapacity={`${battery.capacityKwh} kWh`} currentPower={`${battery.powerKw} kW`} currentPrice={battery.priceEur} currentScore={battery.scoreOverall} competitors={battery.competitors} />
              </section>
            )}

            {battery.faq && battery.faq.length > 0 && (
              <section id="faq" className="scroll-mt-20 border-b border-[var(--color-border)]">
                <FAQSection items={battery.faq} />
              </section>
            )}

            <div id="verdict" className="scroll-mt-20">
              <VerdictBox score={battery.scoreOverall} verdict={battery.verdict ?? battery.quickTake ?? ""} idealFor={battery.idealFor} notFor={battery.notFor} alternativePick={battery.alternativePick} priceRange={battery.priceEur ? `dès ${battery.priceEur.toLocaleString("fr-BE")} €` : undefined} />
            </div>
          </article>
        </main>
      </div>

      {/* User reviews */}
      <div id="avis" className="scroll-mt-20">
        <ReviewsSection reviews={battery.reviews} />
      </div>

      {/* Related batteries */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Batteries similaires</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((b) => <BatteryCard key={b.id} battery={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}
