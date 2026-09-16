import type { UserReview } from "@/lib/types";

export default function ReviewsSection({ reviews }: { reviews?: UserReview[] }) {
  const list = reviews ?? [];
  const rated = list.filter((r) => typeof r.rating === "number");
  const avg = rated.length ? rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length : null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Avis des utilisateurs</h2>
        {avg != null && (
          <div className="text-right">
            <div className="font-display text-2xl font-bold text-[var(--color-primary)]">{avg.toFixed(1)}/5</div>
            <div className="text-xs text-[var(--color-text-muted)]">{rated.length} avis</div>
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-[var(--color-text-mid)]">Aucun avis pour le moment.</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Vous possédez ce modèle ? Partagez votre retour à{" "}
            <span className="font-medium text-[var(--color-text-mid)]">contact@batteryadvisor.be</span> pour aider les autres lecteurs.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((r, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.author || "Utilisateur"}</span>
                {typeof r.rating === "number" && <span className="text-sm text-[var(--color-primary)]">{"★".repeat(Math.round(r.rating))}<span className="text-[var(--color-border)]">{"★".repeat(5 - Math.round(r.rating))}</span></span>}
              </div>
              {r.date && <div className="text-xs text-[var(--color-text-muted)]">{r.date}</div>}
              <p className="mt-2 text-sm text-[var(--color-text-mid)]">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
