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
              Comparatifs indépendants de batteries domestiques pour la Belgique.
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
                { href: "/toplistes", label: "Toplistes" },
                { href: "/marques", label: "Marques" },
                { href: "/belgique", label: "Belgique" },
                { href: "/glossaire", label: "Glossaire" },
                { href: "/guide", label: "Guide personnalisé" },
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
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/methodologie" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]">
                  Méthodologie
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]">
                  Cookies
                </Link>
              </li>
              <li className="text-[var(--color-text-muted)]">Données mises à jour régulièrement</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} BatteryAdvisor.be — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
