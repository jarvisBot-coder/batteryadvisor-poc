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

/** Affiliate merchant offer (stored in the `shops` JSON field). */
export interface Shop {
  merchant: string;
  price?: number;
  url: string;
  logo?: string;
  inStock?: boolean;
  shipping?: string;
  delivery?: string;
  code?: string;
  highlight?: boolean;
}

/** Modular capacity configuration (stored in `configurations`). */
export interface Configuration {
  capacity_kwh: number;
  price: number;
}

/** User review (stored in `reviews`). */
export interface UserReview {
  author?: string;
  rating?: number;
  date?: string;
  text: string;
}

/** Test setup (stored in `test_setup`). */
export interface TestSetup {
  duration?: string;
  scope?: string[];
  context?: string;
}

/** FAQ entry (stored in the `faq` JSON field). */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Backwards-compat alias used by some components. */
export type FAQItem = FaqItem;

/** Competitor reference (stored in the `competitors` JSON field). */
export interface Competitor {
  name: string;
  score?: number;
  price_from?: number;
  capacity_kwh?: number;
  slug?: string;
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
  badge?: string;
  priceEur?: number;
  scoreOverall: number;
  scoreValue: number;
  scorePerformance: number;
  scoreWarranty: number;
  scoreEaseOfUse: number;
  scoreDesign?: number;
  scoreApp?: number;
  pros?: string[];
  cons?: string[];
  verdict?: string;
  reviewBody?: string;
  quickTake?: string;
  idealFor?: string[];
  notFor?: string[];
  alternativePick?: string;
  faq?: FaqItem[];
  competitors?: Competitor[];
  shops?: Shop[];
  configurations?: Configuration[];
  videoUrl?: string;
  reviews?: UserReview[];
  testSetup?: TestSetup;
  readingTimeMin?: number;
  /* Extended specs */
  depthOfDischarge?: number;
  efficiencyPct?: number;
  dimensions?: string;
  weightKg?: number;
  ipRating?: string;
  connectivity?: string;
  inverterType?: string;
  peakPowerWatts?: number;
  cycles?: number;
  /* Capabilities */
  backupPower?: boolean;
  mppt?: boolean;
  dynamicTariff?: boolean;
  expandable?: boolean;
  phase?: string;
  belgiumApproved?: boolean;
  /* Computed */
  pricePerKwh?: number;
  shopCount?: number;
  /* Media */
  image?: StrapiMedia;
  gallery?: StrapiMedia[];
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
  readTimeMin?: number;
  badgeLabel?: string;
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
