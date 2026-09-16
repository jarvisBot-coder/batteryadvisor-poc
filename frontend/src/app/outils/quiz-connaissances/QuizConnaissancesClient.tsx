"use client";

import { useState } from "react";
import Link from "next/link";

interface Q {
  question: string;
  options: string[];
  correct: number;
  explain: string;
}

const QUESTIONS: Q[] = [
  {
    question: "Que signifie « plug-in » pour une batterie domestique ?",
    options: [
      "Elle se branche sur une prise sans électricien",
      "Elle fonctionne uniquement la nuit",
      "Elle ne stocke que l'énergie solaire",
    ],
    correct: 0,
    explain: "Une batterie plug-in se branche simplement, sans installation lourde par un électricien — idéale pour les locataires et le solaire de balcon.",
  },
  {
    question: "Quelle chimie est aujourd'hui la référence pour la sécurité et la durée de vie ?",
    options: ["NMC", "LFP (lithium fer phosphate)", "Plomb-acide"],
    correct: 1,
    explain: "Le LFP tolère mieux la chaleur, offre plus de cycles (souvent 6000+) et un risque d'emballement thermique très faible.",
  },
  {
    question: "Qu'est-ce que le rendement aller-retour (RTE) d'une batterie ?",
    options: [
      "La vitesse de charge",
      "La part d'énergie récupérée par rapport à l'énergie stockée",
      "Le nombre de cycles garantis",
    ],
    correct: 1,
    explain: "Le RTE mesure les pertes : une batterie à 95% restitue 95% de l'énergie qu'on y a mise. Plus il est élevé, plus l'arbitrage de prix est rentable.",
  },
  {
    question: "À quoi sert un tarif dynamique (Belpex) avec une batterie ?",
    options: [
      "À charger quand l'électricité est bon marché et l'utiliser quand elle est chère",
      "À revendre son électricité au voisin",
      "À couper le réseau automatiquement",
    ],
    correct: 0,
    explain: "C'est l'arbitrage : on stocke aux heures creuses (parfois prix négatifs) pour consommer aux heures pleines.",
  },
  {
    question: "Que veut dire le prix par kWh (€/kWh) d'une batterie ?",
    options: [
      "Le prix de l'électricité",
      "Le coût de la batterie divisé par sa capacité",
      "La consommation annuelle",
    ],
    correct: 1,
    explain: "Le €/kWh normalise le prix pour comparer des batteries de tailles différentes : prix total ÷ capacité en kWh.",
  },
  {
    question: "Qu'apporte la fonction « backup » (secours) ?",
    options: [
      "Une garantie plus longue",
      "L'alimentation des appareils essentiels lors d'une coupure de courant",
      "Une recharge plus rapide",
    ],
    correct: 1,
    explain: "Avec le backup, la batterie bascule automatiquement pour alimenter la maison (ou un circuit) en cas de coupure réseau.",
  },
];

export default function QuizConnaissancesClient() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setScore((s) => s + 1);
  }
  function next() {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      setPicked(null);
    } else setDone(true);
  }
  function restart() {
    setStep(0); setPicked(null); setScore(0); setDone(false);
  }

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const msg = pct >= 80 ? "Expert 🔋" : pct >= 50 ? "Bien joué 👍" : "À creuser 📚";
    return (
      <div className="mt-8 text-center">
        <div className="card mx-auto max-w-md p-8">
          <div className="text-sm text-[var(--color-text-muted)]">Votre score</div>
          <div className="font-display text-5xl font-bold text-[var(--color-primary)]">{score}/{QUESTIONS.length}</div>
          <div className="mt-2 font-display text-lg font-semibold">{msg}</div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="pill border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold hover:border-[var(--color-primary)]">
              Recommencer
            </button>
            <Link href="/guide" className="pill bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
              Trouver ma batterie
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>Question {step + 1} / {QUESTIONS.length}</span>
          <span>Score : {score}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <h2 className="font-display text-xl font-bold sm:text-2xl">{q.question}</h2>

      <div className="mt-6 space-y-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const chosen = picked === i;
          let cls = "border-[var(--color-border)] hover:border-[var(--color-primary)]";
          if (picked !== null) {
            if (isCorrect) cls = "border-green-500 bg-green-500/10";
            else if (chosen) cls = "border-red-500 bg-red-500/10";
            else cls = "border-[var(--color-border)] opacity-60";
          }
          return (
            <button key={i} onClick={() => pick(i)} disabled={picked !== null}
              className={`card flex w-full items-center justify-between border p-4 text-left transition-all ${cls}`}>
              <span>{opt}</span>
              {picked !== null && isCorrect && <span className="text-green-600">✓</span>}
              {picked !== null && chosen && !isCorrect && <span className="text-red-500">✗</span>}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-5 rounded-lg bg-[var(--color-ground)] p-4 text-sm text-[var(--color-text-mid)]">
          {q.explain}
          <div className="mt-4 text-right">
            <button onClick={next} className="pill bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
              {step < QUESTIONS.length - 1 ? "Question suivante →" : "Voir mon score"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
