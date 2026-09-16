/**
 * Upload the generated cover images (seed-assets/) to Strapi and link them to
 * each battery (image) and article (cover), then publish.
 *
 * Run AFTER seed-catalog.mjs and seed-articles.mjs, with Strapi running:
 *   STRAPI_ADMIN_EMAIL=... STRAPI_ADMIN_PASSWORD=... node seed-media.mjs
 *
 * Note: re-running uploads fresh copies into the media library (harmless dupes).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const ASSETS = path.join(path.dirname(fileURLToPath(import.meta.url)), "seed-assets");

async function getToken() {
  let email = process.env.STRAPI_ADMIN_EMAIL, password = process.env.STRAPI_ADMIN_PASSWORD;
  if (!email || !password) {
    const rl = (await import("readline")).createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise((r) => rl.question(q, r));
    email = await ask("Admin email: "); password = await ask("Admin password: "); rl.close();
  }
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  return (await res.json()).data.token;
}

let TOKEN;
async function api(method, p, body) {
  const res = await fetch(`${STRAPI_URL}${p}`, {
    method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

async function uploadFile(filename) {
  const buf = await readFile(path.join(ASSETS, filename));
  const fd = new FormData();
  fd.append("files", new Blob([buf], { type: "image/png" }), filename);
  // The Media Library admin route the panel itself uses.
  const res = await fetch(`${STRAPI_URL}/upload`, {
    method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: fd,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`upload ${filename} -> ${res.status} ${text}`);
  const json = JSON.parse(text);
  const file = Array.isArray(json) ? json[0] : (json.data ? json.data[0] : json);
  return file.id;
}

async function link(ct, slug, field, filename) {
  const list = await api("GET", `/content-manager/collection-types/${ct}?filters[slug][$eq]=${slug}&pagination[pageSize]=1`);
  const entry = (list.results || list.data || [])[0];
  if (!entry) { console.log(`  ⚠ ${slug} introuvable — lance d'abord seed-catalog/seed-articles`); return; }
  const fileId = await uploadFile(filename);
  await api("PUT", `/content-manager/collection-types/${ct}/${entry.documentId}`, { [field]: fileId });
  try { await api("POST", `/content-manager/collection-types/${ct}/${entry.documentId}/actions/publish`); } catch {}
  console.log(`  ✓ ${slug} ← ${filename}`);
}

const BATTERIES = [
  "tesla-powerwall-3", "byd-battery-box-premium-hvs", "huawei-luna2000-10",
  "enphase-iq-battery-5p", "zendure-solarflow-ab2000", "sungrow-sbr-hv",
];
const ARTICLES = [
  "guide-batteries-domestiques-belgique-2026", "batterie-tarif-dynamique-belpex",
  "lfp-vs-nmc-chimie-batterie", "primes-rentabilite-batterie-belgique",
];

async function main() {
  console.log("🔐 Login…"); TOKEN = await getToken(); console.log("✅\n");
  console.log("🖼  Batteries (image)");
  for (const slug of BATTERIES)
    await link("api::battery.battery", slug, "image", `battery-${slug}.png`);
  console.log("\n🖼  Articles (cover)");
  for (const slug of ARTICLES)
    await link("api::article.article", slug, "cover", `article-${slug}.png`);
  console.log("\n🎉 Images uploadées et reliées. Rafraîchis le site.");
}
main().catch((e) => { console.error("❌", e); process.exit(1); });
