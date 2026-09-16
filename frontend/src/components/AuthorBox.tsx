import Link from "next/link";

interface Props {
  updatedAt?: string;
}

/**
 * E-E-A-T author/credibility box. Content is intentionally editable — replace
 * with the real reviewer identity and testing reality.
 */
export default function AuthorBox({ updatedAt }: Props) {
  const updated = updatedAt
    ? new Date(updatedAt).toLocaleDateString("fr-BE", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="card flex items-start gap-4 p-5">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/15 text-2xl">
        ⚡
      </div>
      <div className="text-sm">
        <div className="font-display font-semibold">Par l&apos;équipe BatteryAdvisor.be</div>
        <p className="mt-1 text-[var(--color-text-mid)]">
          Évaluations indépendantes de batteries domestiques plug-in pour le marché belge. Nos scores ne
          sont jamais influencés par les commissions d&apos;affiliation.{" "}
          <Link href="/methodologie" className="text-[var(--color-primary)] hover:underline">
            Notre méthodologie
          </Link>
          .
        </p>
        {updated && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Dernière mise à jour : {updated}</p>
        )}
      </div>
    </div>
  );
}
