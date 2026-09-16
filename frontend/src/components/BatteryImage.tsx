import type { Battery } from "@/lib/types";
import { mediaUrl } from "@/lib/media";

interface Props {
  battery: Battery;
  className?: string;
  rounded?: boolean;
}

/**
 * Product image with a branded, on-theme fallback when no photo is set in
 * Strapi yet. As soon as a battery's `image` is uploaded, the real photo shows.
 */
export default function BatteryImage({ battery, className = "", rounded = false }: Props) {
  const src = mediaUrl(battery.image?.url);
  const radius = rounded ? "rounded-xl" : "";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={battery.image?.alternativeText || `${battery.brand?.name ?? ""} ${battery.name}`}
        className={`h-full w-full object-cover ${radius} ${className}`}
        loading="lazy"
      />
    );
  }

  // Branded placeholder
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${radius} ${className}`}
      style={{
        background:
          "linear-gradient(135deg, var(--color-ground) 0%, color-mix(in srgb, var(--color-primary) 12%, var(--color-ground)) 100%)",
      }}
      aria-label={`${battery.brand?.name ?? ""} ${battery.name}`}
    >
      <svg viewBox="0 0 120 120" className="h-24 w-24 opacity-70" fill="none" aria-hidden>
        <rect x="30" y="22" width="60" height="76" rx="10"
          stroke="var(--color-primary)" strokeWidth="4" />
        <rect x="48" y="14" width="24" height="10" rx="3" fill="var(--color-primary)" />
        <path d="M62 40 L50 66 H60 L57 84 L72 56 H61 Z"
          fill="var(--color-primary)" />
      </svg>
      {battery.brand?.name && (
        <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          {battery.brand.name}
        </span>
      )}
    </div>
  );
}
