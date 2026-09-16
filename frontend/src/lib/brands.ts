import type { Battery } from "./types";

export interface BrandGroup {
  name: string;
  slug: string;
  country?: string;
  website?: string;
  batteries: Battery[];
  avgScore: number;
  fromPrice?: number;
}

/** Group batteries by brand into directory entries. */
export function deriveBrands(batteries: Battery[]): BrandGroup[] {
  const map = new Map<string, BrandGroup>();
  for (const b of batteries) {
    const br = b.brand;
    if (!br?.slug) continue;
    let g = map.get(br.slug);
    if (!g) {
      g = { name: br.name, slug: br.slug, country: br.country, website: br.website, batteries: [], avgScore: 0, fromPrice: undefined };
      map.set(br.slug, g);
    }
    g.batteries.push(b);
    if (b.priceEur != null) g.fromPrice = Math.min(g.fromPrice ?? Infinity, b.priceEur);
  }
  const groups = [...map.values()];
  for (const g of groups) {
    g.batteries.sort((a, b) => b.scoreOverall - a.scoreOverall);
    g.avgScore = Math.round(g.batteries.reduce((s, b) => s + b.scoreOverall, 0) / g.batteries.length);
  }
  return groups.sort((a, b) => a.name.localeCompare(b.name));
}

export function getBrandGroup(batteries: Battery[], slug: string): BrandGroup | undefined {
  return deriveBrands(batteries).find((g) => g.slug === slug);
}
