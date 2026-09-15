import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/batteries", label: "Batteries" },
  { href: "/comparateur", label: "Comparateur" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / site name */}
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-[var(--color-primary)]"
        >
          Battery<span className="text-[var(--color-text)]">Advisor</span>
          <span className="text-xs font-normal text-[var(--color-text-muted)]">
            .be
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--color-text-mid)] transition-colors hover:text-[var(--color-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 text-[var(--color-text-mid)]"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
