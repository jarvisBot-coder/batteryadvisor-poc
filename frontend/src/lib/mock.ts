import type { Battery } from "./types";

/**
 * Fallback data used only when Strapi is unreachable (e.g. local dev without
 * the backend running). Real content is served from Strapi via lib/strapi.ts.
 */
export const mockBatteries: Battery[] = [
  {
    id: 1, documentId: "mock-1", slug: "tesla-powerwall-3", name: "Powerwall 3",
    brand: { id: 1, documentId: "mock-b1", name: "Tesla", slug: "tesla" },
    capacityKwh: 13.5, powerKw: 11.5, chemistry: "LFP",
    cycleWarrantyYears: 10, priceEur: 9500,
    scoreOverall: 87, scoreValue: 70, scorePerformance: 90,
    scoreWarranty: 70, scoreEaseOfUse: 75,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
  {
    id: 2, documentId: "mock-2", slug: "byd-battery-box-premium-hvs", name: "Battery-Box Premium HVS",
    brand: { id: 2, documentId: "mock-b2", name: "BYD", slug: "byd" },
    capacityKwh: 12.8, powerKw: 10.2, chemistry: "LFP",
    cycleWarrantyYears: 10, priceEur: 7500,
    scoreOverall: 82, scoreValue: 85, scorePerformance: 80,
    scoreWarranty: 78, scoreEaseOfUse: 76,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
  {
    id: 3, documentId: "mock-3", slug: "huawei-luna2000-10", name: "LUNA2000-10",
    brand: { id: 3, documentId: "mock-b3", name: "Huawei", slug: "huawei" },
    capacityKwh: 10, powerKw: 5, chemistry: "LFP",
    cycleWarrantyYears: 10, priceEur: 6500,
    scoreOverall: 80, scoreValue: 88, scorePerformance: 74,
    scoreWarranty: 78, scoreEaseOfUse: 75,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
  {
    id: 4, documentId: "mock-4", slug: "enphase-iq-battery-5p", name: "IQ Battery 5P",
    brand: { id: 4, documentId: "mock-b4", name: "Enphase", slug: "enphase" },
    capacityKwh: 5, powerKw: 3.84, chemistry: "LFP",
    cycleWarrantyYears: 15, priceEur: 8000,
    scoreOverall: 78, scoreValue: 68, scorePerformance: 76,
    scoreWarranty: 92, scoreEaseOfUse: 84,
    createdAt: "", updatedAt: "", publishedAt: "",
  },
];
