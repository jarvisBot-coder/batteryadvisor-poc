import type { Battery } from "@/lib/types";

interface Props {
  battery: Battery;
  size?: "sm" | "md";
}

const CAPS: { key: keyof Battery; icon: string; label: string }[] = [
  { key: "backupPower", icon: "🔋", label: "Backup" },
  { key: "mppt", icon: "☀️", label: "Solaire" },
  { key: "dynamicTariff", icon: "⚡", label: "Dynamique" },
  { key: "expandable", icon: "➕", label: "Extensible" },
];

/** Compact capability chips (backup, solar/MPPT, dynamic tariff, expandable). */
export default function CapabilityBadges({ battery, size = "sm" }: Props) {
  const active = CAPS.filter((c) => battery[c.key]);
  if (active.length === 0) return null;
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return (
    <div className="flex flex-wrap gap-1.5">
      {active.map((c) => (
        <span
          key={c.label}
          title={c.label}
          className={`inline-flex items-center gap-1 rounded-full bg-[var(--color-ground)] font-medium text-[var(--color-text-mid)] ${pad}`}
        >
          <span aria-hidden>{c.icon}</span>
          {c.label}
        </span>
      ))}
    </div>
  );
}

/** Price-per-kWh helper usable anywhere. */
export function pricePerKwh(b: Battery): number | undefined {
  if (b.pricePerKwh != null) return b.pricePerKwh;
  if (b.priceEur && b.capacityKwh) return Math.round(b.priceEur / b.capacityKwh);
  return undefined;
}
