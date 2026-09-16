"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "ba-consent"; // "all" | "essential"

export function getConsent(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch { /* private mode */ }
  }, []);

  function choose(v: "all" | "essential") {
    try { localStorage.setItem(KEY, v); } catch { /* */ }
    try { window.dispatchEvent(new CustomEvent("ba-consent-change", { detail: v })); } catch { /* */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--color-border)] bg-[var(--color-card)]/98 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="dialog"
      aria-label="Consentement aux cookies"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-[var(--color-text-mid)]">
          Nous utilisons des cookies essentiels au fonctionnement du site et, avec votre accord, des cookies de
          mesure d&apos;audience. Voir notre{" "}
          <Link href="/cookies" className="text-[var(--color-primary)] hover:underline">politique cookies</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => choose("essential")} className="pill border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:border-[var(--color-primary)]">
            Refuser
          </button>
          <button onClick={() => choose("all")} className="pill bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
