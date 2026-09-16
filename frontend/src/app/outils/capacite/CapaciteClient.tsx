"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import ScoreCircle from "@/components/ScoreCircle";

type Goal = "autoconsommation" | "dynamique" | "backup";
type Connection = "prise" | "dedie" | "fixe";

interface State {
  goal: Goal;
  annual: number;
  heatPump: boolean;
  ev: boolean;
  backupPowerW: number;
  outageHours: number;
  hasSolar: boolean;
  kwp: number;
  connection: Connection;
}

const DEFAULT: State = {
  goal: "autoconsommation",
  annual: 3500,
  heatPump: false,
  ev: false,
  backupPowerW: 800,
  outageHours: 4,
  hasSolar: true,
  kwp: 4,
  connection: "dedie",
};

// Assumptions
const SOLAR_YIELD = 875; // kWh/kWp/an
const SURPLUS = 0.7;
const CONN_CAP: Record<Connection, number> = { prise: 3.2, dedie: 9, fixe: 20 }; // kWh/jour rechargeables

function compute(s: State) {
  const daily = s.annual / 365;
  const nightShare = s.heatPump ? 0.5 : 0.55;
  const night = daily * nightShare + (s.ev ? 3 : 0);
  const solarDay = s.hasSolar ? (s.kwp * SOLAR_YIELD * SURPLUS) / 365 : 0;
  const cap = CONN_CAP[s.connection];

  let target: number;
  let chargeable: number;
  if (s.goal === "backup") {
    target = (s.backupPowerW / 1000) * s.outageHours;
    chargeable = cap;
  } else if (s.goal === "dynamique") {
    chargeable = cap;
    target = Math.min(daily, cap);
  } else {
    chargeable = s.hasSolar ? Math.min(solarDay, cap) : cap;
    target = Math.min(night, s.hasSolar ? solarDay : night, cap);
  }
  target = Math.max(target, 2);
  return {
    daily,
    night,
    solarDay,
    chargeable,
    target,
    min: Math.max(2, target * 0.85),
    max: target * 1.25,
  };
}

const num = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm";

export default function CapaciteClient({ batteries }: { batteries: Battery[] }) {
  const [s, setS] = useState<State>(DEFAULT);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => compute(s), [s]);
  const matches = useMemo(
    () =>
      [...batteries]
        .map((b) => ({ b, d: Math.abs(b.capacityKwh - r.target) }))
        .sort((x, y) => x.d - y.d)
        .slice(0, 3)
        .map((m) => m.b),
    [batteries, r.target],
  );

  const STEPS = ["Objectif", "Consommation", "Solaire", "Raccordement"];

  function Btn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button
        onClick={onClick}
        className={`card w-full p-4 text-left transition-all ${
          active ? "border-2 border-[var(--color-primary)]" : "border border-[var(--color-border)] hover:border-[var(--color-primary)]"
        }`}
      >
        {children}
      </button>
    );
  }

  if (done) {
    return (
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Capacité recommandée</h2>
          <button onClick={() => { setDone(false); setStep(0); }} className="text-sm font-medium text-[var(--color-primary)] hover:underline">↺ Refaire</button>
        </div>

        <div className="card p-6 text-center">
          <div className="text-sm text-[var(--color-text-muted)]">Pour votre situation</div>
          <div className="font-display text-4xl font-bold text-[var(--color-primary)]">{r.min.toFixed(1)} – {r.max.toFixed(1)} kWh</div>
          <div className="mt-1 text-xs text-[var(--color-text-muted)]">cible ≈ {r.target.toFixed(1)} kWh</div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="card p-4">
            <div className="text-xs text-[var(--color-text-muted)]">Conso / jour</div>
            <div className="font-display text-lg font-bold">{r.daily.toFixed(1)} kWh</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-[var(--color-text-muted)]">{s.goal === "backup" ? "Besoin secours" : "Conso soir/nuit"}</div>
            <div className="font-display text-lg font-bold">{s.goal === "backup" ? ((s.backupPowerW/1000)*s.outageHours).toFixed(1) : r.night.toFixed(1)} kWh</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-[var(--color-text-muted)]">Rechargeable / jour</div>
            <div className="font-display text-lg font-bold">{r.chargeable.toFixed(1)} kWh</div>
          </div>
        </div>

        <div className="card mt-4 p-5">
          <h3 className="mb-3 font-display font-semibold">Batteries les plus proches</h3>
          <div className="space-y-2">
            {matches.map((b) => (
              <Link key={b.id} href={`/batteries/${b.slug}`} className="flex items-center justify-between rounded-lg p-2 hover:bg-[var(--color-ground)]">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{b.brand?.name}</span>
                  <div className="font-medium">{b.name} · {b.capacityKwh} kWh</div>
                </div>
                <ScoreCircle score={b.scoreOverall} size={40} />
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/top" className="text-sm font-medium text-[var(--color-primary)] hover:underline">Classements →</Link>
            <Link href="/outils/economies" className="text-sm font-medium text-[var(--color-primary)] hover:underline">Calculer les économies →</Link>
          </div>
        </div>

        <details className="mt-4 rounded-lg bg-[var(--color-ground)] p-4 text-sm text-[var(--color-text-mid)]">
          <summary className="cursor-pointer font-medium text-[var(--color-text)]">Voir les hypothèses de calcul</summary>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Consommation soir/nuit : {s.heatPump ? "50" : "55"}% de la conso journalière{s.ev ? " (+3 kWh pour la recharge VE)" : ""}.</li>
            <li>Production solaire : {SOLAR_YIELD} kWh/kWc/an, dont ~{SURPLUS * 100}% de surplus stockable.</li>
            <li>Recharge limitée par le raccordement : prise 800 W ≈ 3,2 kWh/j, circuit dédié ≈ 9 kWh/j.</li>
            <li>Recommandation = min(surplus solaire/jour, conso soir-nuit) plafonné par le raccordement.</li>
            <li>Non pris en compte : variations saisonnières, dégradation, changement de comportement.</li>
          </ul>
        </details>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>Étape {step + 1} / {STEPS.length} · {STEPS[step]}</span>
          <span>{Math.round((step / STEPS.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold">Quel est votre objectif principal ?</h2>
          <Btn active={s.goal === "autoconsommation"} onClick={() => set("goal", "autoconsommation")}>☀️ Maximiser l&apos;autoconsommation solaire</Btn>
          <Btn active={s.goal === "dynamique"} onClick={() => set("goal", "dynamique")}>⚡ Profiter du tarif dynamique (arbitrage)</Btn>
          <Btn active={s.goal === "backup"} onClick={() => set("goal", "backup")}>🔋 Alimentation de secours (backup)</Btn>
        </div>
      )}

      {step === 1 && s.goal !== "backup" && (
        <div className="space-y-5">
          <h2 className="font-display text-xl font-bold">Votre consommation</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text-mid)]">
              Consommation annuelle : <span className="font-semibold text-[var(--color-text)]">{s.annual.toLocaleString("fr-BE")} kWh</span>
            </label>
            <input type="range" min={1500} max={20000} step={250} value={s.annual} onChange={(e) => set("annual", +e.target.value)} className="w-full accent-[var(--color-primary)]" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={s.heatPump} onChange={(e) => set("heatPump", e.target.checked)} className="accent-[var(--color-primary)]" /> J&apos;ai une pompe à chaleur</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={s.ev} onChange={(e) => set("ev", e.target.checked)} className="accent-[var(--color-primary)]" /> Je recharge une voiture électrique à domicile</label>
        </div>
      )}

      {step === 1 && s.goal === "backup" && (
        <div className="space-y-5">
          <h2 className="font-display text-xl font-bold">Vos besoins en secours</h2>
          <div className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text-mid)]">Niveau de puissance</span>
            <Btn active={s.backupPowerW === 300} onClick={() => set("backupPowerW", 300)}>Essentiel (~300 W) — frigo, box, éclairage</Btn>
            <Btn active={s.backupPowerW === 800} onClick={() => set("backupPowerW", 800)}>Confort (~800 W) — + petits appareils</Btn>
            <Btn active={s.backupPowerW === 2500} onClick={() => set("backupPowerW", 2500)}>Maison entière (~2500 W+)</Btn>
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium text-[var(--color-text-mid)]">Durée d&apos;autonomie souhaitée</span>
            <div className="flex gap-2">
              {[2, 4, 8].map((h) => (
                <button key={h} onClick={() => set("outageHours", h)} className={`pill border px-4 py-2 text-sm ${s.outageHours === h ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : "border-[var(--color-border)] text-[var(--color-text-mid)]"}`}>{h} h</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-display text-xl font-bold">Votre installation solaire</h2>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={s.hasSolar} onChange={(e) => set("hasSolar", e.target.checked)} className="accent-[var(--color-primary)]" /> J&apos;ai (ou j&apos;aurai) des panneaux solaires</label>
          {s.hasSolar && (
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-mid)]">
                Puissance installée : <span className="font-semibold text-[var(--color-text)]">{s.kwp} kWc</span>
              </label>
              <input type="range" min={2} max={20} step={0.5} value={s.kwp} onChange={(e) => set("kwp", +e.target.value)} className="w-full accent-[var(--color-primary)]" />
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">≈ {Math.round(s.kwp * 2.5)} panneaux</p>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold">Type de raccordement</h2>
          <Btn active={s.connection === "prise"} onClick={() => set("connection", "prise")}>🔌 Prise standard (plug-in, limité à 800 W)</Btn>
          <Btn active={s.connection === "dedie"} onClick={() => set("connection", "dedie")}>🔧 Circuit dédié</Btn>
          <Btn active={s.connection === "fixe"} onClick={() => set("connection", "fixe")}>🏠 Raccordement fixe par un installateur</Btn>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => (step > 0 ? setStep(step - 1) : null)} disabled={step === 0} className="text-sm text-[var(--color-text-muted)] enabled:hover:text-[var(--color-primary)] disabled:opacity-40">← Précédent</button>
        <button onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : setDone(true))} className="pill bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
          {step < STEPS.length - 1 ? "Continuer →" : "Voir la recommandation"}
        </button>
      </div>
    </div>
  );
}
