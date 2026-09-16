import type { Battery } from "@/lib/types";
import BatteryImage from "./BatteryImage";
import ScoreCircle from "./ScoreCircle";
import AffiliateShops from "./AffiliateShops";
import { pricePerKwh } from "./CapabilityBadges";

const BADGE_LABEL: Record<string, string> = {
  "coup-de-coeur": "❤️ Coup de cœur",
  "meilleur-budget": "💰 Meilleur budget",
  "meilleure-puissance": "⚡ Meilleure puissance",
};

/** Sticky purchase box for the review page sidebar. */
export default function StickyBuyBox({ battery }: { battery: Battery }) {
  const ppk = pricePerKwh(battery);
  const badge = battery.badge && battery.badge !== "none" ? BADGE_LABEL[battery.badge] : null;

  const specs = [
    { label: "Capacité", value: `${battery.capacityKwh} kWh` },
    { label: "Puissance", value: `${battery.powerKw} kW` },
    ppk ? { label: "Prix / kWh", value: `${ppk} €` } : null,
    { label: "Chimie", value: battery.chemistry.split(" ")[0] },
    { label: "Garantie", value: `${battery.cycleWarrantyYears} ans` },
    battery.efficiencyPct ? { label: "Rendement", value: `${battery.efficiencyPct}%` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="relative h-44">
          <BatteryImage battery={battery} />
          {badge && (
            <span className="absolute left-3 top-3 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold text-white">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 p-4">
          <ScoreCircle score={battery.scoreOverall} size={52} />
          <div>
            <div className="text-xs text-[var(--color-text-muted)]">Score global</div>
            <div className="font-display text-sm font-semibold">
              {battery.brand?.name} {battery.name}
            </div>
          </div>
        </div>
        <dl className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          {specs.map((s) => (
            <div key={s.label} className="flex justify-between px-4 py-2 text-sm">
              <dt className="text-[var(--color-text-mid)]">{s.label}</dt>
              <dd className="font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {battery.shops && battery.shops.length > 0 && (
        <AffiliateShops shops={battery.shops} productName={battery.name} capacityKwh={battery.capacityKwh} />
      )}
    </div>
  );
}
