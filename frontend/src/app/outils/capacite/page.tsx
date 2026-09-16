import type { Metadata } from "next";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import { getBatteries } from "@/lib/strapi";
import { mockBatteries } from "@/lib/mock";
import CapaciteClient from "./CapaciteClient";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Calculateur de capacité de batterie domestique",
  description:
    "Quelle capacité de batterie domestique vous faut-il ? Estimez les kWh recommandés selon votre consommation, votre installation solaire et votre raccordement.",
};

async function loadBatteries(): Promise<Battery[]> {
  try { const res = await getBatteries(); if (res.data.length) return res.data; } catch { /* */ }
  return mockBatteries;
}

const SCENARIOS = [
  { profile: "Appartement", persons: "1–2 personnes", annual: "~1 800 kWh/an", night: "~2,5 kWh le soir", reco: "2–3 kWh", note: "Systèmes compacts plug-and-play." },
  { profile: "Maison mitoyenne", persons: "2–3 personnes", annual: "~2 500 kWh/an", night: "~3,5 kWh le soir", reco: "3–5 kWh", note: "Le « sweet spot » des batteries plug-in." },
  { profile: "Famille", persons: "4 personnes", annual: "~3 500 kWh/an", night: "~5 kWh la nuit", reco: "4–6 kWh", note: "Bon compromis autoconsommation." },
  { profile: "Grande maison / PAC", persons: "5+ ou pompe à chaleur", annual: "5 500+ kWh/an", night: "élevée", reco: "6–10 kWh", note: "Circuit dédié recommandé." },
];

const TIPS = [
  { icon: "🎯", title: "Visez votre conso soir/nuit", text: "La bonne capacité couvre grosso modo ce que vous consommez quand vos panneaux ne produisent plus — pas votre consommation totale." },
  { icon: "⚖️", title: "Ne surdimensionnez pas", text: "Les kWh au-delà de votre besoin quotidien se rechargent et se déchargent rarement : ils se rentabilisent mal. Les premiers kWh sont les plus rentables." },
  { icon: "➕", title: "Pensez évolutif", text: "Si vos besoins peuvent grandir (VE, pompe à chaleur), un système modulaire permet d'ajouter de la capacité plus tard." },
  { icon: "🔌", title: "Vérifiez le raccordement", text: "Une prise plug-in (800 W) limite la recharge à ~3,2 kWh/jour : au-delà d'une petite capacité, un circuit dédié devient nécessaire." },
];

const FAQ = [
  { question: "Quelle capacité pour un appartement ?", answer: "En général 2 à 3 kWh suffisent pour un appartement de 1 à 2 personnes, avec une batterie plug-and-play compacte." },
  { question: "Faut-il surdimensionner sa batterie « au cas où » ?", answer: "Non. Une capacité trop grande reste partiellement inutilisée au quotidien et allonge le temps de retour. Mieux vaut dimensionner au plus juste et, si besoin, choisir un modèle extensible." },
  { question: "Une pompe à chaleur change-t-elle le calcul ?", answer: "Oui : elle augmente la consommation, notamment le soir et l'hiver. On vise alors une capacité plus élevée (souvent 6–10 kWh) et un circuit dédié plutôt qu'une simple prise." },
  { question: "Une batterie plug-in suffit-elle ?", answer: "Pour de petites et moyennes capacités et sans besoin de backup complet, oui. Pour de fortes puissances, du secours maison entière ou de grandes capacités, un raccordement fixe est préférable." },
];

export default async function CapacitePage() {
  const batteries = await loadBatteries();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Calculateur de capacité</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-text-mid)]">
          Trouvez la capacité de batterie adaptée à votre consommation, et les modèles qui correspondent.
        </p>
      </header>

      <CapaciteClient batteries={batteries} />

      {/* Reference scenarios */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">Exemples selon votre foyer</h2>
        <p className="mt-2 text-sm text-[var(--color-text-mid)]">Des repères rapides pour situer votre besoin.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SCENARIOS.map((sc) => (
            <div key={sc.profile} className="card p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg font-semibold">{sc.profile}</h3>
                <span className="font-display text-lg font-bold text-[var(--color-primary)]">{sc.reco}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{sc.persons} · {sc.annual} · {sc.night}</p>
              <p className="mt-2 text-sm text-[var(--color-text-mid)]">{sc.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advice */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Bien dimensionner : nos conseils</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TIPS.map((t) => (
            <div key={t.title} className="card p-5">
              <div className="text-2xl">{t.icon}</div>
              <h3 className="mt-2 font-display text-base font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-[var(--color-text-mid)]">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <div className="card">
          <FAQSection items={FAQ} />
        </div>
      </section>

      {/* Related tools */}
      <section className="mt-10 flex flex-wrap gap-3">
        <Link href="/outils/economies" className="pill border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:border-[var(--color-primary)]">💶 Calculateur d&apos;économies</Link>
        <Link href="/guide" className="pill border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:border-[var(--color-primary)]">🧭 Guide personnalisé</Link>
        <Link href="/top" className="pill border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:border-[var(--color-primary)]">📊 Classements chiffrés</Link>
        <Link href="/batteries" className="pill border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:border-[var(--color-primary)]">🔋 Toutes les batteries</Link>
      </section>
    </div>
  );
}
