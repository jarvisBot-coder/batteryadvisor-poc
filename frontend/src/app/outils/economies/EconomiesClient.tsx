"use client";

import { useState, useMemo } from "react";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[var(--color-text-mid)]">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
}

const num = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm";

export default function EconomiesClient() {
  const [capacity, setCapacity] = useState(10);
  const [price, setPrice] = useState(7000);
  const [prime, setPrime] = useState(0);
  const [tariff, setTariff] = useState(0.30);
  const [injection, setInjection] = useState(0.05);
  const [cyclesYear, setCyclesYear] = useState(300);
  const [efficiency, setEfficiency] = useState(90);

  const r = useMemo(() => {
    const throughput = capacity * cyclesYear * (efficiency / 100); // kWh/an réellement restitués
    const valuePerKwh = Math.max(tariff - injection, 0);
    const annual = throughput * valuePerKwh;
    const net = Math.max(price - prime, 0);
    const payback = annual > 0 ? net / annual : Infinity;
    const cumul15 = annual * 15 - net;
    return { throughput, annual, payback, cumul15, net };
  }, [capacity, price, prime, tariff, injection, cyclesYear, efficiency]);

  const eur = (n: number) => n.toLocaleString("fr-BE", { maximumFractionDigits: 0 });

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="card space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Votre situation</h2>
        <Field label="Capacité de la batterie (kWh)">
          <input type="number" min={1} step={0.5} value={capacity} onChange={(e) => setCapacity(+e.target.value)} className={num} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prix batterie (€)">
            <input type="number" min={0} step={100} value={price} onChange={(e) => setPrice(+e.target.value)} className={num} />
          </Field>
          <Field label="Prime / aide (€)">
            <input type="number" min={0} step={50} value={prime} onChange={(e) => setPrime(+e.target.value)} className={num} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tarif électricité (€/kWh)">
            <input type="number" min={0} step={0.01} value={tariff} onChange={(e) => setTariff(+e.target.value)} className={num} />
          </Field>
          <Field label="Tarif injection (€/kWh)">
            <input type="number" min={0} step={0.01} value={injection} onChange={(e) => setInjection(+e.target.value)} className={num} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cycles / an" hint="~300 par défaut">
            <input type="number" min={50} step={10} value={cyclesYear} onChange={(e) => setCyclesYear(+e.target.value)} className={num} />
          </Field>
          <Field label="Rendement (%)">
            <input type="number" min={70} max={100} step={1} value={efficiency} onChange={(e) => setEfficiency(+e.target.value)} className={num} />
          </Field>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="card p-6">
          <div className="text-sm text-[var(--color-text-muted)]">Économie annuelle estimée</div>
          <div className="font-display text-4xl font-bold text-[var(--color-primary)]">{eur(r.annual)} €</div>
          <div className="mt-1 text-xs text-[var(--color-text-muted)]">
            ≈ {eur(r.throughput)} kWh restitués/an × {(tariff - injection).toFixed(2)} €/kWh évités
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="text-sm text-[var(--color-text-muted)]">Retour sur investissement</div>
            <div className="font-display text-2xl font-bold">
              {isFinite(r.payback) ? `${r.payback.toFixed(1)} ans` : "—"}
            </div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-[var(--color-text-muted)]">Gain net sur 15 ans</div>
            <div className={`font-display text-2xl font-bold ${r.cumul15 >= 0 ? "text-[var(--color-primary)]" : "text-red-500"}`}>
              {eur(r.cumul15)} €
            </div>
          </div>
        </div>
        <p className="rounded-lg bg-[var(--color-ground)] p-4 text-xs text-[var(--color-text-muted)]">
          Estimation indicative basée sur un modèle simplifié (throughput = capacité × cycles/an × rendement,
          valeur = tarif − injection). La rentabilité réelle dépend de votre profil de consommation, de votre
          production solaire et de l&apos;évolution des tarifs. Ne constitue pas un conseil financier.
        </p>
      </div>
    </div>
  );
}
