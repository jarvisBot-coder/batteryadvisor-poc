const BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/** Prefix a relative Strapi media path with the backend origin. Client-safe. */
export function mediaUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
}
