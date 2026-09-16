import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Outils : calculateurs et guides batterie domestique",
  description:
    "Nos outils gratuits pour choisir votre batterie domestique : guide personnalisé, calculateur d'économies, calculateur de capacité et quiz de connaissances.",
};

const TOOLS = [
  { href: "/guide", icon: "🧭", title: "Guide personnalisé", desc: "5 questions pour une recommandation de batterie adaptée à votre profil." },
  { href: "/outils/economies", icon: "💶", title: "Calculateur d'économies", desc: "Estimez l'économie annuelle et le temps de retour sur investissement." },
  { href: "/outils/capacite", icon: "📏", title: "Calculateur de capacité", desc: "Quelle capacité (kWh) vous faut-il ? Et quels modèles correspondent." },
  { href: "/outils/quiz-connaissances", icon: "🎓", title: "Quiz connaissances", desc: "Testez ce que vous savez sur les batteries domestiques en 6 questions." },
];

export default function OutilsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Outils</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-text-mid)]">
          Des outils gratuits pour bien choisir et dimensionner votre batterie domestique.
        </p>
      </header>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className="card group p-6 transition-shadow hover:shadow-lg">
            <div className="text-3xl">{t.icon}</div>
            <h2 className="mt-3 font-display text-lg font-semibold group-hover:text-[var(--color-primary)]">{t.title}</h2>
            <p className="mt-1 text-sm text-[var(--color-text-mid)]">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
