"use client";

import { useTheme, type ThemeMode } from "@/hooks/useTheme";

const labels: Record<ThemeMode, string> = {
  system: "Auto",
  light: "Clair",
  dark: "Sombre",
};

const icons: Record<ThemeMode, string> = {
  system: "◐",
  light: "☀",
  dark: "☾",
};

export default function ThemeToggle() {
  const { mode, cycle } = useTheme();

  return (
    <button
      onClick={cycle}
      aria-label={`Thème: ${labels[mode]}`}
      title={`Thème: ${labels[mode]}`}
      className="pill flex items-center gap-1.5 border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-mid)] transition-colors hover:text-[var(--color-text)] hover:border-[var(--color-primary)]"
    >
      <span className="text-base leading-none">{icons[mode]}</span>
      <span className="hidden sm:inline">{labels[mode]}</span>
    </button>
  );
}
