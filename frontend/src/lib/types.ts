/* ── Strapi v5 response wrappers ── */

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

/** Strapi v5 returns flat objects (no nested data.attributes). */
export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

/* ── Domain types ── */

export interface Brand {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  logo?: StrapiMedia;
  country?: string;
  website?: string;
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string; width: number; height: number }>;
}

export interface Battery {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  brand?: Brand;
  capacityKwh: number;
  powerKw: number;
  chemistry: string;
  cycleWarrantyYears: number;
  priceEur?: number;
  scoreOverall: number;
  scoreValue: number;
  scorePerformance: number;
  scoreWarranty: number;
  scoreEaseOfUse: number;
  pros?: string[];
  cons?: string[];
  verdict?: string;
  image?: StrapiMedia;
  category?: Category;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: StrapiMedia;
  category?: Category;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ScoringMethodology {
  id: number;
  documentId: string;
  title: string;
  content: string;
  updatedAt: string;
}
