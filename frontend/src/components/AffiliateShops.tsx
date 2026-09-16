"use client";

import { useState } from "react";
import type { Shop } from "@/lib/types";

interface Props {
  shops?: Shop[];
  productName: string;
  capacityKwh?: number;
}

/**
 * "Où acheter" — affiliate merchant offers with stock, delivery, copyable promo
 * codes and per-offer €/kWh. Tracked outbound links (rel="sponsored nofollow").
 */
export default function AffiliateShops({ shops, productName, capacityKwh }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!shops || shops.length === 0) return null;

  const sorted = [...shops].sort((a, b) => {
    if (a.highlight !== b.highlight) return a.highlight ? -1 : 1;
    if (a.inStock !== b.inStock) return a.inStock === false ? 1 : -1;
    return (a.price ?? Infinity) - (b.price ?? Infinity);
  });
  const cheapest = sorted
    .filter((s) => s.inStock !== false && s.price != null)
    .reduce<Shop | null>((min, s) => (!min || (s.price ?? Infinity) < (min.price ?? Infinity) ? s : min), null);

  function trackClick(shop: Shop) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: "affiliate_click", merchant: shop.merchant, product: productName, price: shop.price });
    } catch { /* */ }
  }
  async function copy(code: string) {
    try { await navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 1500); } catch { /* */ }
  }

  return (
    <section className="card overflow-hidden" aria-labelledby="ou-acheter-heading">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        <h2 id="ou-acheter-heading" className="font-display text-base font-semibold">Où acheter</h2>
        <span className="text-xs text-[var(--color-text-muted)]">{sorted.length} offre{sorted.length > 1 ? "s" : ""}</span>
      </div>

      <ul className="divide-y divide-[var(--color-border)]">
        {sorted.map((shop, i) => {
          const ppk = capacityKwh && shop.price ? Math.round(shop.price / capacityKwh) : null;
          const isBest = cheapest && shop.merchant === cheapest.merchant && shop.price === cheapest.price;
          return (
            <li key={`${shop.merchant}-${i}`} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{shop.merchant}</span>
                    {isBest && <span className="rounded-full bg-[var(--color-primary)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">Meilleur prix</span>}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[var(--color-text-muted)]">
                    <span className={shop.inStock === false ? "text-amber-500" : "text-[var(--color-primary)]"}>
                      {shop.inStock === false ? "● Rupture" : "● En stock"}
                    </span>
                    {shop.delivery && <span>· {shop.delivery}</span>}
                    {ppk && <span>· {ppk} €/kWh</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {shop.price != null && (
                    <span className="font-display text-lg font-bold tabular-nums">{shop.price.toLocaleString("fr-BE")} €</span>
                  )}
                  <a href={shop.url} target="_blank" rel="sponsored nofollow noopener" onClick={() => trackClick(shop)}
                    className="pill bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    Voir l&apos;offre
                  </a>
                </div>
              </div>
              {shop.code && (
                <button
                  onClick={() => copy(shop.code!)}
                  className="mt-2 inline-flex items-center gap-2 rounded-md border border-dashed border-[var(--color-primary)] bg-[var(--color-primary)]/5 px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]"
                  title="Copier le code"
                >
                  🎟️ Code {shop.code}
                  <span className="text-[10px] text-[var(--color-text-muted)]">{copied === shop.code ? "copié !" : "copier"}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="border-t border-[var(--color-border)] p-3 text-center text-[11px] text-[var(--color-text-muted)]">
        Liens affiliés : nous pouvons percevoir une commission sans surcoût pour vous. Sans influence sur nos scores. Prix indicatifs.
      </p>
    </section>
  );
}
