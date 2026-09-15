"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("system");

  /* Hydrate from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as ThemeMode | null;
      if (stored && ["system", "light", "dark"].includes(stored)) {
        setMode(stored);
        applyTheme(stored);
      }
    } catch {
      /* localStorage unavailable – keep system default */
    }
  }, []);

  const cycle = useCallback(() => {
    const order: ThemeMode[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* noop */
    }
  }, [mode]);

  return { mode, cycle };
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}
