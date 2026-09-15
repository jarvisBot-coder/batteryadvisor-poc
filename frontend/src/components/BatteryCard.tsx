import Link from "next/link";
import type { Battery } from "@/lib/types";
import ScoreCircle from "./ScoreCircle";

interface BatteryCardProps {
  battery: Battery;
}

export default function BatteryCard({ battery }: BatteryCardProps) {
  return (
    <Link
      href={`/batteries/${battery.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      {/* Image placeholder */}
      <div className="flex h-48 items-center justify-center bg-[var(--color-ground)] text-4xl text-[var(--color-text-muted)]">
        🔋
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Brand + name */}
        <div>
          {battery.brand && (
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
              {battery.brand.name}
            </span>
          )}
          <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-[var(--color-primary)] transition-colors">
            {battery.name}
          </h3>
        </div>

        {/* Key specs */}
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-mid)]">
          <span className="pill bg-[var(--color-ground)] px-2.5 py-1">
            {battery.capacityKwh} kWh
          </span>
          <span className="pill bg-[var(--color-ground)] px-2.5 py-1">
            {battery.powerKw} kW
          </span>
          <span className="pill bg-[var(--color-ground)] px-2.5 py-1">
            {battery.chemistry}
          </span>
        </div>

        {/* Score + price row */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <ScoreCircle score={battery.scoreOverall} size={52} />
          {battery.priceEur && (
            <span className="text-lg font-bold text-[var(--color-text)]">
              {battery.priceEur.toLocaleString("fr-BE")}&nbsp;€
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
