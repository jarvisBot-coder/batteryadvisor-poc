import Link from "next/link";
import type { Battery } from "@/lib/types";
import ScoreCircle from "./ScoreCircle";
import BatteryImage from "./BatteryImage";
import CapabilityBadges, { pricePerKwh } from "./CapabilityBadges";
import CompareToggle from "./CompareToggle";

interface BatteryCardProps {
  battery: Battery;
}

const BADGE_LABEL: Record<string, string> = {
  "coup-de-coeur": "❤️ Coup de cœur",
  "meilleur-budget": "💰 Meilleur budget",
  "meilleure-puissance": "⚡ Meilleure puissance",
};

export default function BatteryCard({ battery }: BatteryCardProps) {
  const badge = battery.badge && battery.badge !== "none" ? BADGE_LABEL[battery.badge] : null;
  const ppk = pricePerKwh(battery);

  return (
    <Link
      href={`/batteries/${battery.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48">
        <BatteryImage battery={battery} />
        <CompareToggle battery={battery} />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold text-white">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          {battery.brand && (
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
              {battery.brand.name}
            </span>
          )}
          <h3 className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-[var(--color-primary)]">
            {battery.name}
          </h3>
        </div>

        {/* Key specs */}
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-mid)]">
          <span className="pill bg-[var(--color-ground)] px-2.5 py-1">{battery.capacityKwh} kWh</span>
          <span className="pill bg-[var(--color-ground)] px-2.5 py-1">{battery.powerKw} kW</span>
          <span className="pill bg-[var(--color-ground)] px-2.5 py-1">{battery.chemistry}</span>
        </div>

        {/* Capability badges */}
        <CapabilityBadges battery={battery} />

        {/* Score + price row */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <ScoreCircle score={battery.scoreOverall} size={52} />
          {battery.priceEur && (
            <div className="text-right">
              <div className="text-[11px] text-[var(--color-text-muted)]">
                dès{battery.shopCount ? ` · ${battery.shopCount} offre${battery.shopCount > 1 ? "s" : ""}` : ""}
              </div>
              <span className="text-lg font-bold text-[var(--color-text)]">
                {battery.priceEur.toLocaleString("fr-BE")}&nbsp;€
              </span>
              {ppk && (
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  {ppk.toLocaleString("fr-BE")} €/kWh
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
