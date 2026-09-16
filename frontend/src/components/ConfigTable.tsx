import type { Configuration } from "@/lib/types";

export default function ConfigTable({ configs }: { configs: Configuration[] }) {
  if (!configs || configs.length === 0) return null;
  const rows = [...configs].sort((a, b) => a.capacity_kwh - b.capacity_kwh);
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-ground)] text-[var(--color-text-mid)]">
            <th className="p-3 text-left font-semibold">Configuration</th>
            <th className="p-3 text-center font-semibold">Prix indicatif</th>
            <th className="p-3 text-center font-semibold">Prix / kWh</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {rows.map((c) => (
            <tr key={c.capacity_kwh}>
              <td className="p-3 font-medium">{c.capacity_kwh} kWh</td>
              <td className="p-3 text-center tabular-nums">{c.price.toLocaleString("fr-BE")} €</td>
              <td className="p-3 text-center tabular-nums text-[var(--color-text-mid)]">{Math.round(c.price / c.capacity_kwh)} €/kWh</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
