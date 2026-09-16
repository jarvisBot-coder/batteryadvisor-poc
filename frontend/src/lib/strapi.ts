import { draftMode } from "next/headers";
import type {
  Battery,
  Brand,
  Article,
  ScoringMethodology,
  StrapiResponse,
  StrapiListResponse,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/* ── Generic fetcher (draft-mode aware) ── */

async function strapiFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`/api${path}`, BASE_URL);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  // When Next.js draft mode is on (Strapi "Open preview"), request drafts.
  let isDraftMode = false;
  try {
    const draft = await draftMode();
    isDraftMode = draft.isEnabled;
  } catch {
    // draftMode() throws outside a request context (e.g. sitemap) — ignore.
  }
  if (isDraftMode) {
    url.searchParams.set("status", "draft");
  }

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
    next: isDraftMode ? { revalidate: 0 } : { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi error ${res.status}: ${res.statusText} – ${path}`);
  }

  return res.json() as Promise<T>;
}

/* ── Strapi → Frontend field mapping ──
   Strapi: snake_case, scores 0–10, power in watts.
   Frontend: camelCase, scores 0–100, power in kW. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformBattery(raw: any): Battery {
  return {
    id: raw.id,
    documentId: raw.documentId,
    slug: raw.slug,
    name: raw.name,
    brand: raw.brand,
    capacityKwh: raw.capacity_kwh ?? 0,
    powerKw: raw.power_watts ? raw.power_watts / 1000 : 0,
    chemistry: raw.chemistry ?? "",
    badge: raw.badge,
    cycleWarrantyYears: raw.warranty_years ?? 0,
    priceEur: raw.price_from,
    // Scores: Strapi stores 0–10, frontend displays 0–100.
    scoreOverall: raw.score_overall != null ? Math.round(raw.score_overall * 10) : 0,
    scoreValue: raw.score_value != null ? Math.round(raw.score_value * 10) : 0,
    scorePerformance: raw.score_performance != null ? Math.round(raw.score_performance * 10) : 0,
    scoreWarranty: raw.score_warranty != null ? Math.round(raw.score_warranty * 10) : 0,
    scoreEaseOfUse: raw.score_installation != null ? Math.round(raw.score_installation * 10) : 0,
    scoreDesign: raw.score_design != null ? Math.round(raw.score_design * 10) : undefined,
    scoreApp: raw.score_app != null ? Math.round(raw.score_app * 10) : undefined,
    // Review content
    reviewBody: raw.review_body,
    quickTake: raw.quick_take,
    pros: raw.pros,
    cons: raw.cons,
    verdict: raw.verdict,
    idealFor: raw.ideal_for,
    notFor: raw.not_for,
    alternativePick: raw.alternative_pick,
    faq: raw.faq,
    competitors: raw.competitors,
    shops: raw.shops,
    readingTimeMin: raw.reading_time_min,
    // Extended specs
    depthOfDischarge: raw.depth_of_discharge,
    efficiencyPct: raw.efficiency_pct,
    dimensions: raw.dimensions,
    weightKg: raw.weight_kg,
    ipRating: raw.ip_rating,
    connectivity: raw.connectivity,
    inverterType: raw.inverter_type,
    peakPowerWatts: raw.peak_power_watts,
    cycles: raw.cycles,
    backupPower: raw.backup_power ?? false,
    mppt: raw.mppt ?? false,
    dynamicTariff: raw.dynamic_tariff ?? false,
    expandable: raw.expandable ?? false,
    phase: raw.phase,
    belgiumApproved: raw.belgium_approved ?? false,
    pricePerKwh:
      raw.price_from && raw.capacity_kwh
        ? Math.round(raw.price_from / raw.capacity_kwh)
        : undefined,
    shopCount: Array.isArray(raw.shops) ? raw.shops.length : undefined,
    // Media
    image: raw.image,
    gallery: raw.gallery,
    // Relations & timestamps
    category: raw.category,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    publishedAt: raw.publishedAt ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformArticle(raw: any): Article {
  return {
    id: raw.id,
    documentId: raw.documentId,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    content: raw.body,
    readTimeMin: raw.read_time_min,
    badgeLabel: raw.badge_label,
    image: raw.cover,
    category: raw.category,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    publishedAt: raw.publishedAt ?? "",
  };
}

/* ── Batteries ── */

export async function getBatteries() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await strapiFetch<StrapiListResponse<any>>("/batteries", {
    "populate[brand]": "true",
    "populate[image]": "true",
    "sort[0]": "score_overall:desc",
    "pagination[pageSize]": "50",
  });
  return {
    data: res.data.map(transformBattery),
    meta: res.meta,
  };
}

export async function getBattery(slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await strapiFetch<StrapiListResponse<any>>("/batteries", {
    "filters[slug][$eq]": slug,
    "populate[brand]": "true",
    "populate[image]": "true",
    "populate[gallery]": "true",
  });
  return res.data[0] ? transformBattery(res.data[0]) : null;
}

/* ── Brands ── */

export async function getBrands() {
  return strapiFetch<StrapiListResponse<Brand>>("/brands", {
    "populate[logo]": "true",
    "sort[0]": "name:asc",
  });
}

/* ── Articles ── */

export async function getArticles() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await strapiFetch<StrapiListResponse<any>>("/articles", {
    "populate[cover]": "true",
    "populate[category]": "true",
    "sort[0]": "publishedAt:desc",
    "pagination[pageSize]": "25",
  });
  return { data: res.data.map(transformArticle), meta: res.meta };
}

export async function getArticle(slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await strapiFetch<StrapiListResponse<any>>("/articles", {
    "filters[slug][$eq]": slug,
    "populate[cover]": "true",
    "populate[category]": "true",
  });
  return res.data[0] ? transformArticle(res.data[0]) : null;
}

/* ── Methodology ── */

export async function getMethodology() {
  return strapiFetch<StrapiResponse<ScoringMethodology>>("/methodology");
}
