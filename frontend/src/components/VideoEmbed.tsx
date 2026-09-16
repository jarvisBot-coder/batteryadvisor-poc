function toEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) { const id = u.searchParams.get("v"); return id ? `https://www.youtube.com/embed/${id}` : null; }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${u.pathname.split("/").filter(Boolean)[0]}`;
  } catch { /* */ }
  return null;
}

export default function VideoEmbed({ url, title }: { url?: string; title: string }) {
  if (!url) return null;
  const embed = toEmbed(url);
  if (!embed) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <iframe src={embed} title={`Vidéo — ${title}`} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
      </div>
    </div>
  );
}
