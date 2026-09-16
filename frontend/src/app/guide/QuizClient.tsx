"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import ScoreCircle from "@/components/ScoreCircle";

interface Props {
  batteries: Battery[];
}

type Answers = {
  logement?: "maison" | "appartement";
  solar?: "oui" | "prevu" | "non";
  conso?: "faible" | "moyenne" | "elevee";
  usage?: "autoconsommation" | "dynamique" | "backup" | "balcon";
  budget?: number; // ceiling in €
};

const STEPS: {
  key: keyof Answers;
  question: string;
  options: { value: string | number; label: string; hint?: string }[];
}[] = [
  {
    key: "logement",
    question: "Quel est votre type de logement ?",
    options: [
      { value: "maison", label: "🏠 Maison", hint: "propriétaire" },
      { value: "appartement", label: "🏢 Appartement", hint: "ou locataire" },
    ],
  },
  {
    key: "solar",
    question: "Avez-vous des panneaux solaires ?",
    options: [
      { value: "oui", label: "☀️ Oui, déjà installés" },
      { value: "prevu", label: "🔧 Installation prévue" },
      { value: "non", label: "❌ Non" },
    ],
  },
  {
    key: "conso",
    question: "Quelle est votre consommation électrique annuelle ?",
    options: [
      { value: "faible", label: "Faible", hint: "< 3 000 kWh" },
      { value: "moyenne", label: "Moyenne", hint: "3 000 – 6 000 kWh" },
      { value: "elevee", label: "Élevée", hint: "> 6 000 kWh" },
    ],
  },
  {
    key: "usage",
    question: "Quel est votre usage principal ?",
    options: [
      { value: "autoconsommation", label: "☀️ Autoconsommation solaire" },
      { value: "dynamique", label: "⚡ Tarif dynamique (Belpex)" },
      { value: "backup", label: "🔋 Secours / backup" },
      { value: "balcon", label: "🔌 Solaire de balcon (plug-in)" },
    ],
  },
  {
    key: "budget",
    question: "Quel est votre budget ?",
    options: [
      { value: 3000, label: "Jusqu'à 3 000 €" },
      { value: 7000, label: "3 000 – 7 000 €" },
      { value: 99999, label: "Plus de 7 000 €" },
    ],
  },
];

function scoreBattery(b: Battery, a: Answers): { score: number; reasons: string[] } {
  let score = b.scoreOverall; // 0–100 quality base
  const reasons: string[] = [];

  // Capacity fit vs consumption
  const target = a.conso === "faible" ? 5 : a.conso === "moyenne" ? 10 : 14;
  score -= Math.abs(b.capacityKwh - target) * 2.5;
  if (Math.abs(b.capacityKwh - target) <= 2)
    reasons.push(`Capacité ${b.capacityKwh} kWh adaptée à votre consommation`);

  // Budget
  if (a.budget && b.priceEur) {
    if (b.priceEur > a.budget) {
      score -= 45;
    } else {
      score += 8;
      reasons.push(`Dans votre budget (${b.priceEur.toLocaleString("fr-BE")} €)`);
    }
  }

  // Usage
  switch (a.usage) {
    case "backup":
      score += b.powerKw * 2.5;
      if (b.powerKw >= 8) reasons.push(`Puissance élevée (${b.powerKw} kW) idéale en secours`);
      break;
    case "dynamique":
      score += b.capacityKwh * 1.2;
      if (b.efficiencyPct && b.efficiencyPct >= 96)
        reasons.push(`Rendement ${b.efficiencyPct}% pour l'arbitrage de prix`);
      break;
    case "balcon":
      if (b.capacityKwh < 3) {
        score += 35;
        reasons.push("Plug-and-play, parfaite pour le solaire de balcon");
      } else score -= 20;
      break;
    case "autoconsommation":
      score += b.scoreValue * 0.15;
      reasons.push("Bon rapport qualité/prix en autoconsommation");
      break;
  }

  // Housing
  if (a.logement === "appartement") {
    if (b.capacityKwh < 3) {
      score += 20;
      reasons.push("Sans travaux, adaptée à un appartement");
    } else score -= 12;
  }

  return { score, reasons: reasons.slice(0, 3) };
}

export default function QuizClient({ batteries }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  function choose(key: keyof Answers, value: string | number) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  }

  const results = useMemo(() => {
    if (!done) return [];
    return batteries
      .map((b) => ({ battery: b, ...scoreBattery(b, answers) }))
      .sort((x, y) => y.score - x.score)
      .slice(0, 3);
  }, [done, batteries, answers]);

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  if (done) {
    const [top, ...rest] = results;
    return (
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Nos recommandations</h2>
          <button onClick={restart} className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            ↺ Recommencer
          </button>
        </div>

        {/* Top pick */}
        {top && (
          <div className="card border-2 border-[var(--color-primary)] p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
              🏆 Notre recommandation n°1
            </div>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  {top.battery.brand?.name}
                </span>
                <h3 className="font-display text-2xl font-bold">{top.battery.name}</h3>
              </div>
              <ScoreCircle score={top.battery.scoreOverall} size={64} label="Score" />
            </div>
            <ul className="mt-4 space-y-1.5">
              {top.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-mid)]">
                  <span className="text-[var(--color-primary)]">✓</span> {r}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/batteries/${top.battery.slug}`}
                className="pill bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Voir le test complet
              </Link>
              {top.battery.priceEur && (
                <span className="text-sm text-[var(--color-text-muted)]">
                  dès {top.battery.priceEur.toLocaleString("fr-BE")} €
                </span>
              )}
            </div>
          </div>
        )}

        {/* Runner-ups */}
        {rest.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {rest.map(({ battery, reasons }) => (
              <div key={battery.id} className="card p-5">
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                  {battery.brand?.name}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">{battery.name}</h3>
                  <ScoreCircle score={battery.scoreOverall} size={44} />
                </div>
                {reasons[0] && (
                  <p className="mt-2 text-sm text-[var(--color-text-mid)]">✓ {reasons[0]}</p>
                )}
                <Link
                  href={`/batteries/${battery.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  Voir le test →
                </Link>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          Recommandations indicatives basées sur vos réponses et notre méthodologie de notation.
        </p>
      </div>
    );
  }

  const current = STEPS[step];
  return (
    <div className="mt-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>Question {step + 1} / {STEPS.length}</span>
          <span>{Math.round(((step) / STEPS.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold">{current.question}</h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {current.options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => choose(current.key, opt.value)}
            className="card flex items-center justify-between p-5 text-left transition-all hover:border-[var(--color-primary)] hover:shadow-md"
          >
            <span className="font-medium">{opt.label}</span>
            {opt.hint && (
              <span className="text-xs text-[var(--color-text-muted)]">{opt.hint}</span>
            )}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-6 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
        >
          ← Question précédente
        </button>
      )}
    </div>
  );
}
