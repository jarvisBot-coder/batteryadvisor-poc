"use client";

import type { Shop } from "@/lib/types";

interface Props {
  shops?: Shop[];
  productName: string;
}

/**
 * "Où acheter" — affiliate merchant offers.
 * Renders tracked outbound links with rel="sponsored nofollow noopener".
 * Clicks are pushed to the GA4 dataLayer (if present) for revenue attribution.
 */
export default function AffiliateShops({ shops, productName }: Props) {
  if (!shops || shops.length === 0) return null;

  // Cheapest in-stock offer first, then by price, highlighted offers pinned up.
  const sorted = [...shops].sort((a, b) => {
    if (a.highlight && !b.highlight) return -1;
    if (!a.highlight && b.highlight) return 1;
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    return (a.price ?? Infinity) - (b.price ?? Infinity);
  });

  function trackClick(shop: Shop) {
    try {
      // GA4 / GTM dataLayer event for affiliate click attribution.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "affiliate_click",
        merchant: shop.merchant,
        product: productName,
        price: shop.price,
      });
    } catch {
      /* no-op */
    }
  }

  return (
    <section
      className="card overflow-hidden"
      aria-labelledby="ou-acheter-heading"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
        <h2
          id="ou-acheter-heading"
          className="font-display text-lg font-semibold"
        >
          Où acheter
        </h2>
        <span className="text-xs text-[var(--color-text-muted)]">
          {sorted.length} offre{sorted.length > 1 ? "s" : ""}
        </span>
      </div>

      <ul className="divide-y divide-[var(--color-border)]">
        {sorted.map((shop, i) => (
          <li
            key={`${shop.merchant}-${i}`}
            className="flex flex-wrap items-center justify-between gap-4 p-5"
          >
            <div className="flex items-center gap-3">
              {shop.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shop.logo}
                  alt={shop.merchant}
                  className="h-8 w-auto max-w-[96px] object-contain"
                />
              ) : (
                <span className="font-medium">{shop.merchant}</span>
              )}
              <div className="flex flex-col">
                {shop.logo && (
                  <span className="text-sm font-medium">{shop.merchant}</span>
                )}
                <span className="text-xs text-[var(--color-text-muted)]">
                  {shop.inStock === false
                    ? "Rupture de stock"
                    : shop.shipping || "En stock"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {shop.price != null && (
                <span className="font-display text-lg font-bold tabular-nums">
                  {shop.price.toLocaleString("fr-BE")} €
                </span>
              )}
              <a
                href={shop.url}
                target="_blank"
                rel="sponsored nofollow noopener"
                onClick={() => trackClick(shop)}
                className="pill bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Voir l&apos;offre
              </a>
            </div>
          </li>
        ))}
      </ul>

      <p className="border-t border-[var(--color-border)] p-4 text-center text-xs text-[var(--color-text-muted)]">
        Certains liens sont des liens affiliés. Nous pouvons percevoir une
        commission sans surcoût pour vous. Cela n&apos;influence pas nos scores.
      </p>
    </section>
  );
}
