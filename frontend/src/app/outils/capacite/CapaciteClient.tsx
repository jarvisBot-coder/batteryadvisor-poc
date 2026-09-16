"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Battery } from "@/lib/types";
import ScoreCircle from "@/components/ScoreCircle";

export default function CapaciteClient({ batteries }: { batteries: Battery[] }) {
  const [annual, setAnnual] = useState(3500);
  const [nightShare, setNightShare] = useState(50);
  const [hasSolar, setHasSolar] = useState(true);

  const r = useMemo(() => {
    const nightDaily = (annual * (nightShare / 100)) / 365; // kWh/jour hors solaire
    // Cible : couvrir ~1 jour de conso hors production, marge +15%.
    let target = nightDaily * 1.15;
    if (!hasSolar) target *= 0.85; // sans solaire, on dimensionne un peu plus petit (arbitrage seul)
    const min = Math.max(2, target * 0.8);
    const max = target * 1.3;
    return { nightDaily, target, min, max };
  }, [annual, nightShare, hasSolar]);

  const matches = useMemo(() => {
    return [...batteries]
      .map((b) => ({ b, dist: Math.abs(b.capacityKwh - r.target) }))
      .sort((x, y) => x.dist - y.dist)
      .slice(0, 3)
      .map((m) => m.b);
  }, [batteries, r.target]);

  const num = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm";

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <div className="card space-y-5 p-6">
        <h2 className="font-display text-lg font-semibold">Votre consommation</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-mid)]">
            Consommation annuelle : <span className="font-semibold text-[var(--color-text)]">{annual.toLocaleString("fr-BE")} kWh</span>
          </label>
          <input type="range" min={1000} max={12000} step={250} value={annual} onChange={(e) => setAnnual(+e.target.value)} className="w-full accent-[var(--color-primary)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-mid)]">
            Part consommée le soir / la nuit : <span className="font-semibold text-[var(--color-text)]">{nightShare}%</span>
          </label>
          <input type="range" min={20} max={80} step={5} value={nightShare} onChange={(e) => setNightShare(+e.target.value)} className="w-full accent-[var(--color-primary)]" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasSolar} onChange={(e) => setHasSolar(e.target.checked)} className="accent-[var(--color-primary)]" />
          J&apos;ai (ou j&apos;aurai) des panneaux solaires
        </label>
      </div>

      <div className="space-y-4">
        <div className="card p-6 text-center">
          <div className="text-sm text-[var(--color-text-muted)]">Capacité recommandée</div>
          <div className="font-display text-4xl font-bold text-[var(--color-primary)]">
            {r.min.toFixed(1)} – {r.max.toFixed(1)} kWh
          </div>
          <div className="mt-1 text-xs text-[var(--color-text-muted)]">
            cible ≈ {r.target.toFixed(1)} kWh · {r.nightDaily.toFixed(1)} kWh consommés/jour hors solaire
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-3 font-display font-semibold">Batteries les plus proches</h3>
          <div className="space-y-3">
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
          <Link href="/batteries" className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline">
            Voir toutes les batteries →
          </Link>
        </div>
        <p className="rounded-lg bg-[var(--color-ground)] p-4 text-xs text-[var(--color-text-muted)]">
          Estimation indicative. Le bon dimensionnement dépend aussi de votre profil horaire, de la taille de
          votre installation solaire et de votre contrat (tarif dynamique, injection).
        </p>
      </div>
    </div>
  );
}
