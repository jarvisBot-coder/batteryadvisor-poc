/**
 * Publish the Synergrid certification blog article + its cover.
 * Run with Strapi up:
 *   STRAPI_ADMIN_EMAIL=... STRAPI_ADMIN_PASSWORD=... node seed-synergrid.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const ASSETS = path.join(path.dirname(fileURLToPath(import.meta.url)), "seed-assets");

const BODY = "## Certification Synergrid : de quoi parle-t-on ?\n\nSi vous envisagez d'installer une batterie domestique en Belgique, vous croiserez vite le mot « Synergrid » et les codes « C10/11 » et « C10/26 ». Derrière ce jargon se cache une exigence simple : pour être raccordé au réseau électrique belge en toute légalité et en toute sécurité, votre matériel doit être **homologué**. Ce guide explique ce qu'est la certification Synergrid, quels équipements sont concernés, comment vérifier qu'une batterie est bien approuvée, et quelles démarches suivre pour une installation conforme.\n\n## Qu'est-ce que Synergrid ?\n\nSynergrid est la fédération des gestionnaires de réseaux d'électricité et de gaz en Belgique. Parmi ses missions figure l'**homologation** du matériel destiné à être raccordé au réseau de distribution : onduleurs solaires, systèmes de stockage (batteries), bornes de recharge bidirectionnelles, cogénérations, etc.\n\nConcrètement, Synergrid tient à jour les prescriptions techniques que le matériel doit respecter, et publie la liste des équipements reconnus conformes. Cette homologation est **gratuite** pour les fabricants et s'effectue sur base des documents transmis (rapports d'essais, spécifications techniques) — sans échantillon physique.\n\n## C10/11 et C10/26 : quelle différence ?\n\nC'est le point clé à comprendre, car les deux codes sont souvent confondus.\n\n- **C10/11** est la **prescription technique**. Elle définit les conditions que doit remplir toute installation qui produit ou stocke de l'électricité en parallèle avec le réseau de distribution : sécurité, stabilité du réseau, découplage automatique en cas de coupure, comportement en fréquence et en tension, etc. La version en vigueur est régulièrement mise à jour (édition 2.4 fin 2025) — vérifiez toujours la dernière édition sur le site de Synergrid.\n- **C10/26** est la **liste** du matériel reconnu comme conforme à la C10/11. C'est le registre officiel des onduleurs et systèmes de stockage homologués. Avant tout raccordement, l'installation doit s'appuyer sur un équipement présent sur cette liste.\n\nEn résumé : **la C10/11 fixe les règles, la C10/26 est la liste de ce qui les respecte.**\n\n![C10/11 (les règles techniques) vs C10/26 (la liste du matériel homologué)](/images/synergrid-c1011-vs-c1026.png)\n\n## Pourquoi la certification est-elle obligatoire ?\n\nUne batterie et son onduleur peuvent, en cas de dysfonctionnement, injecter de l'électricité sur le réseau à un moment inopportun — par exemple pendant une coupure, ce qui met en danger les techniciens qui interviennent sur la ligne. La certification garantit notamment que l'appareil se **découple automatiquement** du réseau quand il le faut, qu'il respecte les limites de tension et de fréquence, et qu'il n'introduit pas de perturbations.\n\nSans matériel homologué, le gestionnaire de réseau peut **refuser le raccordement** de votre installation, et vous vous exposez à des problèmes d'assurance et de sécurité. C'est donc une étape incontournable, pas une simple formalité.\n\n## Quels équipements doivent être certifiés ?\n\nLa C10/11 vise l'appareil qui gère l'interface avec le réseau, c'est-à-dire principalement **l'onduleur** (y compris l'onduleur de la batterie). Sont concernés :\n\n- les onduleurs solaires (PV) ;\n- les systèmes de stockage / batteries domestiques (via leur onduleur) ;\n- les bornes de recharge **bidirectionnelles** (vehicle-to-grid) ;\n- les groupes électrogènes, éoliennes et cogénérations raccordés au réseau.\n\nÀ l'inverse, une borne de recharge **unidirectionnelle** (qui ne fait que charger la voiture, sans réinjecter) sort du champ de la C10/11 et n'a pas besoin de cette homologation.\n\nBon à savoir : une limitation de puissance par le firmware n'est pas acceptée comme référence pour la puissance maximale, car elle peut être contournée en changeant le « country code ». La puissance de référence est donc la puissance réelle de l'appareil.\n\n## Comment vérifier qu'une batterie est certifiée Synergrid ?\n\nTrois réflexes :\n\n1. **Consultez la liste C10/26** publiée sur le site de Synergrid : cherchez la marque et le modèle de l'onduleur (ou du système de stockage). La version en ligne fait foi — elle est mise à jour régulièrement, plus récente que toute copie téléchargée.\n2. **Vérifiez le modèle exact**, pas seulement la marque : une même gamme peut comporter des références homologuées et d'autres non.\n3. **Demandez le document de conformité** : pour chaque équipement approuvé, une déclaration de conformité téléchargeable est disponible ; elle est requise avant le raccordement.\n\nSur BatteryAdvisor, les modèles que nous signalons comme « approuvés en Belgique » sont ceux dont l'onduleur figure sur la liste — mais vérifiez toujours la référence précise de votre configuration.\n\n## Le cas des batteries plug-and-play\n\nLongtemps, seules les installations fixes étaient couvertes. Depuis peu, les systèmes **plug-and-play** disposent de leur propre cadre :\n\n- depuis le 17 octobre 2024, les fabricants peuvent demander l'homologation C10/26 de leurs appareils plug-and-play ;\n- l'installation de ces appareils est autorisée depuis le 17 avril 2025 ;\n- ils apparaissent sur une **liste Plug&Play dédiée** de Synergrid, en plus de la liste C10/26 générale ;\n- la puissance approuvée en plug-and-play se situe généralement entre **800 W et 2 500 W**.\n\nC'est ce cadre qui permet aujourd'hui à des batteries « à brancher » d'être utilisées légalement, sans installation lourde.\n\n## La règle des 800 W et la déclaration au réseau\n\nLa fameuse limite de 800 W n'est pas un plafond de puissance interdit au-delà : c'est surtout un **seuil de déclaration**. En Flandre (Fluvius) :\n\n- compteur numérique **et** puissance inférieure à 800 W : aucune déclaration nécessaire ;\n- puissance **égale ou supérieure à 800 W** : déclaration à Fluvius dans les 30 jours ;\n- compteur analogique : déclaration systématique (Fluvius installe alors un compteur numérique).\n\n![Faut-il déclarer votre batterie ? La règle des 800 W](/images/synergrid-declaration-800w.png)\n\nPar sécurité, 800 W est aussi la puissance maximale recommandée sur un circuit partagé standard (16 A) ; au-delà, un **circuit dédié** est nécessaire. En Wallonie et à Bruxelles, adressez-vous à votre gestionnaire de réseau (ORES, RESA, Sibelga).\n\n## Faut-il un électricien et un contrôle RGIE/AREI ?\n\nCela dépend du type d'installation.\n\nPour une **batterie plug-and-play homologuée** : depuis le 15 octobre 2025, aucun électricien n'est requis pour ces modèles, le pilotage se faisant via un dongle sur le port P1 du compteur numérique. Aucun contrôle RGIE n'est en principe exigé — sauf si vous ajoutez un circuit dédié.\n\nPour une **installation fixe** raccordée au réseau, la procédure conforme est la suivante :\n\n![Les 6 étapes d'une installation de batterie conforme en Belgique](/images/synergrid-6-etapes.png)\n\n1. **Étude technique** : schéma unifilaire et schéma de situation.\n2. **Installation par un professionnel agréé** (obligatoire pour le raccordé-réseau).\n3. **Contrôle RGIE/AREI** par un organisme agréé avant mise en service.\n4. **Attestation de contrôle positive**.\n5. **Déclaration au gestionnaire de réseau** (Fluvius, ORES, RESA, Sibelga) avec le code EAN, les fiches techniques de la batterie et de l'onduleur, et les schémas.\n6. **Activation** une fois toutes les approbations obtenues.\n\n## Différences régionales\n\nLe principe de la certification Synergrid est **national**, mais l'interlocuteur pour la déclaration dépend de votre région :\n\n- **Flandre** : Fluvius (avec l'enjeu du tarif capacitaire).\n- **Wallonie** : ORES ou RESA selon la commune.\n- **Bruxelles** : Sibelga.\n\nLes délais, formulaires et éventuelles primes varient d'une région à l'autre et évoluent régulièrement.\n\n## Que risque-t-on avec du matériel non certifié ?\n\n- **Refus de raccordement** par le gestionnaire de réseau.\n- **Problèmes d'assurance** en cas de sinistre lié à une installation non conforme.\n- **Risque de sécurité** (pas de découplage automatique fiable).\n- **Non-éligibilité** à certains avantages ou tarifs.\n\nChoisir un modèle figurant sur la liste Synergrid dès l'achat vous évite toutes ces déconvenues.\n\n## Checklist avant d'acheter\n\n- L'onduleur (ou le système de stockage) figure-t-il sur la liste C10/26 (ou Plug&Play) de Synergrid ?\n- La **référence exacte** correspond-elle à celle de la liste ?\n- Le fournisseur peut-il vous remettre la **déclaration de conformité** ?\n- Votre projet est-il **fixe** (installateur + RGIE + déclaration) ou **plug-and-play** (déclaration selon la puissance) ?\n- Avez-vous identifié votre **gestionnaire de réseau** régional pour la déclaration ?\n\n## Questions fréquentes\n\n### Synergrid, C10/11 et C10/26, c'est la même chose ?\n\nNon. Synergrid est l'organisme qui homologue. La C10/11 est la prescription technique (les règles). La C10/26 est la liste du matériel reconnu conforme.\n\n### Ma batterie doit-elle être sur la liste, ou seulement l'onduleur ?\n\nC'est l'appareil qui gère l'interface réseau — l'onduleur, y compris celui intégré à la batterie — qui doit être homologué et figurer sur la liste.\n\n### Une batterie plug-and-play doit-elle aussi être certifiée ?\n\nOui : elle doit figurer sur la liste Plug&Play de Synergrid. Ce cadre existe depuis 2024-2025.\n\n### Dois-je déclarer ma batterie plug-and-play ?\n\nSous 800 W avec un compteur numérique, non. À 800 W ou plus, oui — dans les 30 jours en Flandre. Avec un compteur analogique, la déclaration est systématique.\n\n### Faut-il obligatoirement un électricien ?\n\nPour une installation fixe raccordée au réseau, oui, avec contrôle RGIE. Pour un modèle plug-and-play homologué, ce n'est plus requis depuis octobre 2025 (sauf ajout d'un circuit dédié).\n\n### Où trouver la liste officielle ?\n\nSur le site de Synergrid (synergrid.be), section homologation. La version en ligne est la référence à jour.\n\n## En résumé\n\nLa certification Synergrid n'est pas un détail administratif : c'est la garantie que votre batterie peut être raccordée au réseau belge en toute sécurité et en toute légalité. Retenez la distinction C10/11 (les règles) / C10/26 (la liste), vérifiez systématiquement la référence exacte de votre onduleur, et adaptez la démarche selon que votre installation est fixe ou plug-and-play.\n\nPour aller plus loin, découvrez notre [comparatif des batteries domestiques](/batteries), notre [guide du cadre belge](/belgique) et notre [guide personnalisé](/guide) pour trouver le modèle adapté à votre situation.\n\n*Cet article a une vocation informative et générale ; la réglementation évolue. Vérifiez toujours la dernière édition des prescriptions et les conditions de votre gestionnaire de réseau avant d'acheter ou d'installer.*\n";

const ARTICLE = {
  slug: "certification-synergrid-belgique",
  title: "Certification Synergrid (C10/11 et C10/26) : le guide complet pour votre batterie en Belgique",
  excerpt: "Synergrid, C10/11, C10/26, liste Plug&Play, d\u00e9claration au r\u00e9seau, contr\u00f4le RGIE : tout comprendre sur la certification d'une batterie domestique en Belgique.",
  read_time_min: 9,
  badge_label: "Belgique",
  body: BODY,
};

async function getToken() {
  let email = process.env.STRAPI_ADMIN_EMAIL, password = process.env.STRAPI_ADMIN_PASSWORD;
  if (!email || !password) {
    const rl = (await import("readline")).createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise((r) => rl.question(q, r));
    email = await ask("Admin email: "); password = await ask("Admin password: "); rl.close();
  }
  const res = await fetch(`${STRAPI_URL}/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  return (await res.json()).data.token;
}
let TOKEN;
async function api(method, p, body) {
  const res = await fetch(`${STRAPI_URL}${p}`, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}
async function upsert(ct, slug, data) {
  const list = await api("GET", `/${ct}?filters[slug][$eq]=${slug}&pagination[pageSize]=1`);
  const existing = (list.results || list.data || [])[0];
  const doc = existing ? await api("PUT", `/${ct}/${existing.documentId}`, data) : await api("POST", `/${ct}`, data);
  const id = doc.data?.documentId || doc.documentId || existing?.documentId;
  try { await api("POST", `/${ct}/${id}/actions/publish`); } catch {}
  return id;
}
async function uploadCover(documentId, filename) {
  const buf = await readFile(path.join(ASSETS, filename));
  const fd = new FormData();
  fd.append("files", new Blob([buf], { type: "image/png" }), filename);
  const res = await fetch(`${STRAPI_URL}/upload`, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: fd });
  if (!res.ok) { console.log("  warn upload cover:", res.status); return; }
  const json = JSON.parse(await res.text());
  const fileId = (Array.isArray(json) ? json[0] : json).id;
  await api("PUT", `/content-manager/collection-types/api::article.article/${documentId}`, { cover: fileId });
  try { await api("POST", `/content-manager/collection-types/api::article.article/${documentId}/actions/publish`); } catch {}
}

async function main() {
  console.log("Login..."); TOKEN = await getToken(); console.log("OK");
  const catId = await upsert("content-manager/collection-types/api::category.category", "belgique", { name: "Belgique", slug: "belgique" });
  console.log("Categorie Belgique ok");
  const artId = await upsert("content-manager/collection-types/api::article.article", ARTICLE.slug, { ...ARTICLE, category: catId });
  console.log("Article publie:", ARTICLE.slug);
  await uploadCover(artId, "article-certification-synergrid-belgique.png");
  console.log("Couverture liee");
  try {
    const roles = await api("GET", "/users-permissions/roles");
    const pub = (roles.roles || []).find((r) => r.type === "public");
    if (pub) {
      const detail = await api("GET", `/users-permissions/roles/${pub.id}`);
      const perms = detail.role.permissions;
      for (const ct of ["api::article", "api::category"]) {
        const c = ct.split("::")[1];
        if (perms[ct]?.controllers?.[c]) { perms[ct].controllers[c].find = { enabled: true }; perms[ct].controllers[c].findOne = { enabled: true }; }
      }
      await api("PUT", `/users-permissions/roles/${pub.id}`, { ...detail.role, permissions: perms });
    }
  } catch (e) { console.log("  warn perms:", e.message.slice(0,80)); }
  console.log("\nTermine. Visite http://localhost:3000/blog/certification-synergrid-belgique");
}
main().catch((e) => { console.error("ERR", e); process.exit(1); });
