import type { MetadataRoute } from "next";
import { getBatteries } from "@/lib/strapi";
import { TOPLISTS } from "@/lib/toplists";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://batteryadvisor.be";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/batteries`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/comparateur`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/toplistes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/outils`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/guide`, changeFrequency: "monthly", priority: 0.6 },
    ...TOPLISTS.map((t) => ({ url: `${SITE_URL}/toplistes/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
  ];

  let batteryRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await getBatteries();
    batteryRoutes = res.data.map((b) => ({
      url: `${SITE_URL}/batteries/${b.slug}`,
      lastModified: b.updatedAt || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // Strapi unreachable at build time — ship the static routes only.
  }

  return [...staticRoutes, ...batteryRoutes];
}
