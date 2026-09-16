import type { Competitor } from "@/lib/types";

interface ComparisonTableProps {
  currentName: string;
  currentCapacity: string;
  currentPower: string;
  currentPrice?: number;
  currentScore: number;
  competitors: Competitor[];
}

const fmtPrice = (v?: number) =>
  v != null ? `${v.toLocaleString("fr-BE")} €` : "—";

export default function ComparisonTable({
  currentName,
  currentCapacity,
  currentPower,
  currentPrice,
  currentScore,
  competitors,
}: ComparisonTableProps) {
  return (
    <div className="px-4 py-7 sm:px-6">
      <h2 className="mb-4 font-display text-lg font-bold">
        Comparaison avec les concurrents
      </h2>
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-ground)]">
              <th className="px-4 py-2.5 text-left font-semibold text-[var(--color-text-mid)]">
                Batterie
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-[var(--color-text-mid)]">
                Capacité
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-[var(--color-text-mid)]">
                Prix ≈
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-[var(--color-text-mid)]">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {/* Current battery — highlighted */}
            <tr className="bg-[var(--color-primary)]/5">
              <td className="px-4 py-2.5 font-bold text-[var(--color-text)]">
                {currentName}
              </td>
              <td className="px-4 py-2.5 text-[var(--color-text-mid)]">
                {currentCapacity}
              </td>
              <td className="px-4 py-2.5 text-[var(--color-text-mid)]">
                {fmtPrice(currentPrice)}
              </td>
              <td className="px-4 py-2.5 font-bold text-[var(--color-text)]">
                {currentScore}
              </td>
            </tr>
            {/* Competitors */}
            {competitors.map((c) => (
              <tr key={c.name}>
                <td className="px-4 py-2.5 text-[var(--color-text)]">
                  {c.slug ? (
                    <a
                      href={`/batteries/${c.slug}`}
                      className="hover:text-[var(--color-primary)]"
                    >
                      {c.name}
                    </a>
                  ) : (
                    c.name
                  )}
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-mid)]">
                  {c.capacity_kwh != null ? `${c.capacity_kwh} kWh` : "—"}
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-mid)]">
                  {fmtPrice(c.price_from)}
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-mid)]">
                  {c.score != null ? Math.round(c.score * 10) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
