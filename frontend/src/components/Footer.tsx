import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="font-display text-lg font-bold text-[var(--color-primary)]">
              BatteryAdvisor<span className="text-[var(--color-text-muted)]">.be</span>
            </span>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Comparatifs ind\u00e9pendants de batteries domestiques pour la Belgique.
              Aucun lien commercial avec les fabricants.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-mid)]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/batteries", label: "Toutes les batteries" },
                { href: "/comparateur", label: "Comparateur" },
                { href: "/blog", label: "Blog & guides" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-mid)]">
              Informations
            </h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>Site ind\u00e9pendant</li>
              <li>Tests selon m\u00e9thodologie RTINGS</li>
              <li>Donn\u00e9es mises \u00e0 jour r\u00e9guli\u00e8rement</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-text-muted)]">
          \u00a9 {new Date().getFullYear()} BatteryAdvisor.be \u2014 Tous droits
          r\u00e9serv\u00e9s
        </div>
      </div>
    </footer>
  );
}
