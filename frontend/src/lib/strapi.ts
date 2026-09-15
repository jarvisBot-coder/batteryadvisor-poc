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

/* ── Generic fetcher ── */

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

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi error ${res.status}: ${res.statusText} – ${path}`);
  }

  return res.json() as Promise<T>;
}

/* ── Batteries ── */

export async function getBatteries() {
  return strapiFetch<StrapiListResponse<Battery>>("/batteries", {
    "populate[brand]": "true",
    "populate[image]": "true",
    "populate[category]": "true",
    "sort[0]": "scoreOverall:desc",
    "pagination[pageSize]": "50",
  });
}

export async function getBattery(slug: string) {
  const res = await strapiFetch<StrapiListResponse<Battery>>("/batteries", {
    "filters[slug][$eq]": slug,
    "populate[brand]": "true",
    "populate[image]": "true",
    "populate[category]": "true",
  });
  return res.data[0] ?? null;
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
  return strapiFetch<StrapiListResponse<Article>>("/articles", {
    "populate[image]": "true",
    "populate[category]": "true",
    "sort[0]": "publishedAt:desc",
    "pagination[pageSize]": "25",
  });
}

export async function getArticle(slug: string) {
  const res = await strapiFetch<StrapiListResponse<Article>>("/articles", {
    "filters[slug][$eq]": slug,
    "populate[image]": "true",
    "populate[category]": "true",
  });
  return res.data[0] ?? null;
}

/* ── Methodology ── */

export async function getMethodology() {
  return strapiFetch<StrapiResponse<ScoringMethodology>>("/methodology");
}
