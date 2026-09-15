import type { StrapiMedia } from "@/lib/types";

interface ImagePlaceholderProps {
  media?: StrapiMedia;
  alt: string;
  caption?: string;
  className?: string;
}

/**
 * Renders a Strapi media image with a graceful placeholder fallback.
 * Used in review sections for inline images, installation photos, etc.
 */
export default function ImagePlaceholder({
  media,
  alt,
  caption,
  className = "",
}: ImagePlaceholderProps) {
  if (!media) {
    return (
      <figure className={`my-4 ${className}`}>
        <div className="grid h-44 place-items-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-ground)] text-xs text-[var(--color-text-muted)]">
          📸 {alt}
        </div>
        {caption && (
          <figcaption className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={`my-4 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.url}
        alt={media.alternativeText || alt}
        width={media.width}
        height={media.height}
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
