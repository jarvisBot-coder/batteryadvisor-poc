import Link from "next/link";
import type { TestSetup } from "@/lib/types";

const DEFAULT_SCOPE = [
  "Charge solaire et décharge du soir",
  "Rendement aller-retour",
  "Application et pilotage",
  "Installation et raccordement",
  "Niveau sonore et qualité de fabrication",
];

export default function TestProtocol({ setup }: { setup?: TestSetup }) {
  const scope = setup?.scope?.length ? setup.scope : DEFAULT_SCOPE;
  return (
    <section className="scroll-mt-20 border-b border-[var(--color-border)] px-4 py-7 sm:px-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--color-primary)]/10 text-base">🔬</div>
        <h2 className="font-display text-lg font-bold">Comment nous avons testé</h2>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text-mid)]">
        Nous évaluons chaque batterie selon une grille identique{setup?.duration ? `, sur une ${setup.duration}` : ""}. Points passés en revue :
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {scope.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-[var(--color-text-mid)]"><span className="text-[var(--color-primary)]">✓</span> {it}</li>
        ))}
      </ul>
      {setup?.context && <p className="mt-3 text-xs text-[var(--color-text-muted)]">{setup.context}</p>}
      <p className="mt-3 text-sm">
        <Link href="/methodologie" className="font-medium text-[var(--color-primary)] hover:underline">Voir notre méthodologie complète →</Link>
      </p>
    </section>
  );
}
