import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notre méthodologie de notation des batteries",
  description:
    "Comment BatteryAdvisor.be évalue et note les batteries domestiques : 5 critères pondérés, indépendance et transparence.",
};

const CRITERIA = [
  { icon: "⚡", title: "Performance", weight: "25%", desc: "Puissance de sortie, puissance de pointe, rendement aller-retour et comportement en charge/décharge." },
  { icon: "💶", title: "Rapport qualité/prix", weight: "25%", desc: "Prix par kWh, positionnement face à la concurrence et coût total sur la durée de vie." },
  { icon: "🛡️", title: "Garantie", weight: "20%", desc: "Durée de garantie, nombre de cycles garantis et capacité résiduelle promise." },
  { icon: "🔧", title: "Installation", weight: "15%", desc: "Facilité de mise en œuvre, compatibilité onduleur, encombrement et prérequis." },
  { icon: "🏗️", title: "Qualité de fabrication", weight: "15%", desc: "Chimie, robustesse, indice de protection, connectivité et qualité de l'application." },
];

export default function MethodologiePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Notre méthodologie</h1>
        <p className="mt-3 text-[var(--color-text-mid)]">
          Chaque batterie reçoit un score global sur 100, construit à partir de cinq critères pondérés. La même
          grille est appliquée à tous les modèles, pour un classement cohérent et comparable.
        </p>
      </header>

      <section className="mt-10 space-y-4">
        {CRITERIA.map((c) => (
          <div key={c.title} className="card flex items-start gap-4 p-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-[var(--color-primary)]/10 text-xl">{c.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-semibold">{c.title}</h2>
                <span className="rounded-full bg-[var(--color-ground)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-mid)]">{c.weight}</span>
              </div>
              <p className="mt-1 text-sm text-[var(--color-text-mid)]">{c.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl font-bold">Indépendance &amp; transparence</h2>
        <p className="leading-relaxed text-[var(--color-text-mid)]">
          BatteryAdvisor.be ne vend pas de batteries. Le site se finance via des liens affiliés : lorsqu&apos;un
          achat est réalisé via un de nos liens, nous percevons une commission, sans surcoût pour vous. Ces
          commissions n&apos;influencent jamais l&apos;ordre de nos classements ni les scores attribués, et nous
          ne masquons aucun défaut pour protéger un partenariat.
        </p>
        <p className="leading-relaxed text-[var(--color-text-mid)]">
          Les prix affichés sont indicatifs et peuvent varier selon les revendeurs et le moment. Les scores sont
          révisés lorsque de nouvelles données ou de nouveaux modèles le justifient.
        </p>
        <div className="pt-2">
          <Link href="/a-propos" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            En savoir plus sur BatteryAdvisor.be →
          </Link>
        </div>
      </section>
    </div>
  );
}
