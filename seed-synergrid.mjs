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

const BODY = "## Certification Synergrid : de quoi parle-t-on ?

Si vous envisagez d'installer une batterie domestique en Belgique, vous croiserez vite le mot « Synergrid » et les codes « C10/11 » et « C10/26 ». Derrière ce jargon se cache une exigence simple : pour être raccordé au réseau électrique belge en toute légalité et en toute sécurité, votre matériel doit être **homologué**. Ce guide explique ce qu'est la certification Synergrid, quels équipements sont concernés, comment vérifier qu'une batterie est bien approuvée, et quelles démarches suivre pour une installation conforme.

## Qu'est-ce que Synergrid ?

Synergrid est la fédération des gestionnaires de réseaux d'électricité et de gaz en Belgique. Parmi ses missions figure l'**homologation** du matériel destiné à être raccordé au réseau de distribution : onduleurs solaires, systèmes de stockage (batteries), bornes de recharge bidirectionnelles, cogénérations, etc.

Concrètement, Synergrid tient à jour les prescriptions techniques que le matériel doit respecter, et publie la liste des équipements reconnus conformes. Cette homologation est **gratuite** pour les fabricants et s'effectue sur base des documents transmis (rapports d'essais, spécifications techniques) — sans échantillon physique.

## C10/11 et C10/26 : quelle différence ?

C'est le point clé à comprendre, car les deux codes sont souvent confondus.

- **C10/11** est la **prescription technique**. Elle définit les conditions que doit remplir toute installation qui produit ou stocke de l'électricité en parallèle avec le réseau de distribution : sécurité, stabilité du réseau, découplage automatique en cas de coupure, comportement en fréquence et en tension, etc. La version en vigueur est régulièrement mise à jour (édition 2.4 fin 2025) — vérifiez toujours la dernière édition sur le site de Synergrid.
- **C10/26** est la **liste** du matériel reconnu comme conforme à la C10/11. C'est le registre officiel des onduleurs et systèmes de stockage homologués. Avant tout raccordement, l'installation doit s'appuyer sur un équipement présent sur cette liste.

En résumé : **la C10/11 fixe les règles, la C10/26 est la liste de ce qui les respecte.**

![C10/11 (les règles techniques) vs C10/26 (la liste du matériel homologué)](/images/synergrid-c1011-vs-c1026.png)

## Pourquoi la certification est-elle obligatoire ?

Une batterie et son onduleur peuvent, en cas de dysfonctionnement, injecter de l'électricité sur le réseau à un moment inopportun — par exemple pendant une coupure, ce qui met en danger les techniciens qui interviennent sur la ligne. La certification garantit notamment que l'appareil se **découple automatiquement** du réseau quand il le faut, qu'il respecte les limites de tension et de fréquence, et qu'il n'introduit pas de perturbations.

Sans matériel homologué, le gestionnaire de réseau peut **refuser le raccordement** de votre installation, et vous vous exposez à des problèmes d'assurance et de sécurité. C'est donc une étape incontournable, pas une simple formalité.

## Quels équipements doivent être certifiés ?

La C10/11 vise l'appareil qui gère l'interface avec le réseau, c'est-à-dire principalement **l'onduleur** (y compris l'onduleur de la batterie). Sont concernés :

- les onduleurs solaires (PV) ;
- les systèmes de stockage / batteries domestiques (via leur onduleur) ;
- les bornes de recharge **bidirectionnelles** (vehicle-to-grid) ;
- les groupes électrogènes, éoliennes et cogénérations raccordés au réseau.

À l'inverse, une borne de recharge **unidirectionnelle** (qui ne fait que charger la voiture, sans réinjecter) sort du champ de la C10/11 et n'a pas besoin de cette homologation.

Bon à savoir : une limitation de puissance par le firmware n'est pas acceptée comme référence pour la puissance maximale, car elle peut être contournée en changeant le « country code ». La puissance de référence est donc la puissance réelle de l'appareil.

## Comment vérifier qu'une batterie est certifiée Synergrid ?

Trois réflexes :

1. **Consultez la liste C10/26** publiée sur le site de Synergrid : cherchez la marque et le modèle de l'onduleur (ou du système de stockage). La version en ligne fait foi — elle est mise à jour régulièrement, plus récente que toute copie téléchargée.
2. **Vérifiez le modèle exact**, pas seulement la marque : une même gamme peut comporter des références homologuées et d'autres non.
3. **Demandez le document de conformité** : pour chaque équipement approuvé, une déclaration de conformité téléchargeable est disponible ; elle est requise avant le raccordement.

Sur BatteryAdvisor, les modèles que nous signalons comme « approuvés en Belgique » sont ceux dont l'onduleur figure sur la liste — mais vérifiez toujours la référence précise de votre configuration.

## Le cas des batteries plug-and-play

Longtemps, seules les installations fixes étaient couvertes. Depuis peu, les systèmes **plug-and-play** disposent de leur propre cadre :

- depuis le 17 octobre 2024, les fabricants peuvent demander l'homologation C10/26 de leurs appareils plug-and-play ;
- l'installation de ces appareils est autorisée depuis le 17 avril 2025 ;
- ils apparaissent sur une **liste Plug&Play dédiée** de Synergrid, en plus de la liste C10/26 générale ;
- la puissance approuvée en plug-and-play se situe généralement entre **800 W et 2 500 W**.

C'est ce cadre qui permet aujourd'hui à des batteries « à brancher » d'être utilisées légalement, sans installation lourde.

## La règle des 800 W et la déclaration au réseau

La fameuse limite de 800 W n'est pas un plafond de puissance interdit au-delà : c'est surtout un **seuil de déclaration**. En Flandre (Fluvius) :

- compteur numérique **et** puissance inférieure à 800 W : aucune déclaration nécessaire ;
- puissance **égale ou supérieure à 800 W** : déclaration à Fluvius dans les 30 jours ;
- compteur analogique : déclaration systématique (Fluvius installe alors un compteur numérique).

![Faut-il déclarer votre batterie ? La règle des 800 W](/images/synergrid-declaration-800w.png)

Par sécurité, 800 W est aussi la puissance maximale recommandée sur un circuit partagé standard (16 A) ; au-delà, un **circuit dédié** est nécessaire. En Wallonie et à Bruxelles, adressez-vous à votre gestionnaire de réseau (ORES, RESA, Sibelga).

## Faut-il un électricien et un contrôle RGIE/AREI ?

Cela dépend du type d'installation.

Pour une **batterie plug-and-play homologuée** : depuis le 15 octobre 2025, aucun électricien n'est requis pour ces modèles, le pilotage se faisant via un dongle sur le port P1 du compteur numérique. Aucun contrôle RGIE n'est en principe exigé — sauf si vous ajoutez un circuit dédié.

Pour une **installation fixe** raccordée au réseau, la procédure conforme est la suivante :

![Les 6 étapes d'une installation de batterie conforme en Belgique](/images/synergrid-6-etapes.png)

1. **Étude technique** : schéma unifilaire et schéma de situation.
2. **Installation par un professionnel agréé** (obligatoire pour le raccordé-réseau).
3. **Contrôle RGIE/AREI** par un organisme agréé avant mise en service.
4. **Attestation de contrôle positive**.
5. **Déclaration au gestionnaire de réseau** (Fluvius, ORES, RESA, Sibelga) avec le code EAN, les fiches techniques de la batterie et de l'onduleur, et les schémas.
6. **Activation** une fois toutes les approbations obtenues.

## Différences régionales

Le principe de la certification Synergrid est **national**, mais l'interlocuteur pour la déclaration dépend de votre région :

- **Flandre** : Fluvius (avec l'enjeu du tarif capacitaire).
- **Wallonie** : ORES ou RESA selon la commune.
- **Bruxelles** : Sibelga.

Les délais, formulaires et éventuelles primes varient d'une région à l'autre et évoluent régulièrement.

## Que risque-t-on avec du matériel non certifié ?

- **Refus de raccordement** par le gestionnaire de réseau.
- **Problèmes d'assurance** en cas de sinistre lié à une installation non conforme.
- **Risque de sécurité** (pas de découplage automatique fiable).
- **Non-éligibilité** à certains avantages ou tarifs.

Choisir un modèle figurant sur la liste Synergrid dès l'achat vous évite toutes ces déconvenues.

## Checklist avant d'acheter

- L'onduleur (ou le système de stockage) figure-t-il sur la liste C10/26 (ou Plug&Play) de Synergrid ?
- La **référence exacte** correspond-elle à celle de la liste ?
- Le fournisseur peut-il vous remettre la **déclaration de conformité** ?
- Votre projet est-il **fixe** (installateur + RGIE + déclaration) ou **plug-and-play** (déclaration selon la puissance) ?
- Avez-vous identifié votre **gestionnaire de réseau** régional pour la déclaration ?

## Questions fréquentes

### Synergrid, C10/11 et C10/26, c'est la même chose ?

Non. Synergrid est l'organisme qui homologue. La C10/11 est la prescription technique (les règles). La C10/26 est la liste du matériel reconnu conforme.

### Ma batterie doit-elle être sur la liste, ou seulement l'onduleur ?

C'est l'appareil qui gère l'interface réseau — l'onduleur, y compris celui intégré à la batterie — qui doit être homologué et figurer sur la liste.

### Une batterie plug-and-play doit-elle aussi être certifiée ?

Oui : elle doit figurer sur la liste Plug&Play de Synergrid. Ce cadre existe depuis 2024-2025.

### Dois-je déclarer ma batterie plug-and-play ?

Sous 800 W avec un compteur numérique, non. À 800 W ou plus, oui — dans les 30 jours en Flandre. Avec un compteur analogique, la déclaration est systématique.

### Faut-il obligatoirement un électricien ?

Pour une installation fixe raccordée au réseau, oui, avec contrôle RGIE. Pour un modèle plug-and-play homologué, ce n'est plus requis depuis octobre 2025 (sauf ajout d'un circuit dédié).

### Où trouver la liste officielle ?

Sur le site de Synergrid (synergrid.be), section homologation. La version en ligne est la référence à jour.

## En résumé

La certification Synergrid n'est pas un détail administratif : c'est la garantie que votre batterie peut être raccordée au réseau belge en toute sécurité et en toute légalité. Retenez la distinction C10/11 (les règles) / C10/26 (la liste), vérifiez systématiquement la référence exacte de votre onduleur, et adaptez la démarche selon que votre installation est fixe ou plug-and-play.

Pour aller plus loin, découvrez notre [comparatif des batteries domestiques](/batteries), notre [guide du cadre belge](/belgique) et notre [guide personnalisé](/guide) pour trouver le modèle adapté à votre situation.

*Cet article a une vocation informative et générale ; la réglementation évolue. Vérifiez toujours la dernière édition des prescriptions et les conditions de votre gestionnaire de réseau avant d'acheter ou d'installer.*
";

const ARTICLE = {
  slug: "certification-synergrid-belgique",
  title: "Certification Synergrid (C10/11 et C10/26) : le guide complet pour votre batterie en Belgique",
  excerpt: "Synergrid, C10/11, C10/26, liste Plug&Play, déclaration au réseau, contrôle RGIE : tout comprendre sur la certification d'une batterie domestique en Belgique.",
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
  if (!res.ok) { console.log("  ⚠ upload cover:", res.status); return; }
  const json = JSON.parse(await res.text());
  const fileId = (Array.isArray(json) ? json[0] : json).id;
  await api("PUT", `/content-manager/collection-types/api::article.article/${documentId}`, { cover: fileId });
  try { await api("POST", `/content-manager/collection-types/api::article.article/${documentId}/actions/publish`); } catch {}
}

async function main() {
  console.log("🔐 Login…"); TOKEN = await getToken(); console.log("✅");
  const catId = await upsert("content-manager/collection-types/api::category.category", "belgique", { name: "Belgique", slug: "belgique" });
  console.log("🗂  Catégorie Belgique ok");
  const artId = await upsert("content-manager/collection-types/api::article.article", ARTICLE.slug, { ...ARTICLE, category: catId });
  console.log("📝 Article publié:", ARTICLE.slug);
  await uploadCover(artId, "article-certification-synergrid-belgique.png");
  console.log("🖼  Couverture liée");
  // public perms (article + category)
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
  } catch (e) { console.log("  ⚠ perms:", e.message.slice(0,80)); }
  console.log("\n🎉 Terminé. Visite http://localhost:3000/blog/certification-synergrid-belgique");
}
main().catch((e) => { console.error("❌", e); process.exit(1); });
