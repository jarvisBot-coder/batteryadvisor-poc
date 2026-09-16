/**
 * Seed blog categories + buyer-guide articles via Strapi content-manager API.
 * Idempotent (upsert by slug), then publishes.
 * Usage: STRAPI_ADMIN_EMAIL=... STRAPI_ADMIN_PASSWORD=... node seed-articles.mjs
 */
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

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
async function api(method, path, body) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}
async function upsert(ct, slug, data) {
  const list = await api("GET", `/${ct}?filters[slug][$eq]=${slug}&pagination[pageSize]=1`);
  const existing = (list.results || list.data || [])[0];
  let doc;
  if (existing) { doc = await api("PUT", `/${ct}/${existing.documentId}`, data); console.log(`  ↻ ${slug}`); }
  else { doc = await api("POST", `/${ct}`, data); console.log(`  + ${slug}`); }
  const id = doc.data?.documentId || doc.documentId || existing?.documentId;
  try { await api("POST", `/${ct}/${id}/actions/publish`); } catch (e) { console.log(`  ⚠ publish ${slug}: ${e.message.slice(0,60)}`); }
  return id;
}
const CT_ARTICLE = "content-manager/collection-types/api::article.article";
const CT_CATEGORY = "content-manager/collection-types/api::category.category";

const CATEGORIES = {
  guides: { name: "Guides", slug: "guides" },
  technologie: { name: "Technologie", slug: "technologie" },
  belgique: { name: "Belgique", slug: "belgique" },
};

const ARTICLES = [
  {
    slug: "guide-batteries-domestiques-belgique-2026", category: "guides",
    title: "Batteries domestiques en Belgique : le guide complet 2026",
    excerpt: "Tarifs, primes, rentabilité et choix du modèle : tout ce qu'il faut savoir avant d'investir dans une batterie domestique en Belgique.",
    read_time_min: 8, badge_label: "Guide",
    body: `## Pourquoi investir dans une batterie domestique en 2026 ?

Avec l'essor du photovoltaïque et l'évolution des tarifs d'électricité, la batterie domestique s'impose comme un complément logique aux panneaux solaires en Belgique. Trois facteurs pèsent particulièrement dans la balance.

Le tarif capacitaire en Flandre facture une partie de la facture réseau sur base du pic de puissance mensuel : une batterie permet de lisser ces pics et de réduire ce poste. Les contrats à tarif dynamique (indexés sur le marché Belpex) récompensent ceux qui chargent quand l'électricité est bon marché et déchargent aux heures chères. Enfin, la fin progressive des compteurs qui tournent à l'envers rend l'autoconsommation bien plus rentable que l'injection.

## Quel budget prévoir ?

En Belgique, une batterie domestique installée coûte généralement entre 4 000 € et 12 000 € selon la capacité, la marque et la complexité de l'installation. Le coût au kWh installé se situe le plus souvent entre 600 et 900 €/kWh, onduleur compris ou non selon les systèmes.

Les modèles tout-en-un avec onduleur hybride intégré (comme le Tesla Powerwall 3) simplifient l'installation mais coûtent plus cher. Les systèmes modulaires (BYD, Huawei, Sungrow) demandent un onduleur compatible mais offrent une meilleure évolutivité.

## Comment dimensionner sa batterie ?

La règle simple : votre batterie doit couvrir votre consommation du soir et de la nuit, quand vos panneaux ne produisent plus.

1. Regardez votre consommation annuelle (kWh) sur votre facture.
2. Estimez la part consommée hors production solaire (souvent 40 à 60 %).
3. Visez une capacité couvrant un à deux jours de cette consommation nocturne.

Pour un ménage belge moyen, cela représente souvent 5 à 10 kWh. Les grandes maisons avec pompe à chaleur ou voiture électrique viseront 10 à 15 kWh.

## Les critères de choix essentiels

- Capacité (kWh) : adaptée à votre consommation, idéalement modulaire.
- Puissance (kW) : au moins 3 à 5 kW pour alimenter plusieurs appareils.
- Chimie : le LFP est aujourd'hui la référence pour la sécurité et la durée de vie.
- Garantie : visez au minimum 10 ans et 6 000 cycles.
- Compatibilité : avec votre onduleur et vos panneaux existants.
- Fonction backup : indispensable si vous voulez tenir lors d'une coupure.

## Primes et fiscalité

Les aides varient fortement selon la région et évoluent chaque année. En 2026, la Flandre ne propose pas de prime batterie généralisée, la Wallonie conditionne ses aides aux revenus, et Bruxelles dispose de son propre cadre. Vérifiez toujours les conditions en vigueur auprès de votre région avant de vous décider.

## Notre recommandation

Comparez les modèles adaptés à votre situation dans nos comparatifs détaillés, ou laissez notre guide personnalisé vous recommander la meilleure option en cinq questions. Chaque batterie est notée selon notre méthodologie indépendante.`,
  },
  {
    slug: "batterie-tarif-dynamique-belpex", category: "guides",
    title: "Quelle batterie pour un tarif dynamique (Belpex) ?",
    excerpt: "Charger quand l'électricité est bon marché, décharger aux heures chères : voici les critères d'une batterie pensée pour l'arbitrage de prix.",
    read_time_min: 6, badge_label: "Guide",
    body: `## Le principe de l'arbitrage de prix

Un contrat à tarif dynamique indexe le prix de votre électricité sur le marché de gros (Belpex, lui-même lié à Nordpool). Les prix varient heure par heure : souvent négatifs ou très bas la nuit et en milieu de journée ensoleillée, élevés en fin d'après-midi. Une batterie permet d'acheter l'énergie quand elle est bon marché et de l'utiliser quand elle est chère : c'est l'arbitrage.

## Les critères qui comptent vraiment

Pour l'arbitrage, deux paramètres priment sur le reste.

D'abord la capacité : plus elle est grande, plus vous stockez d'énergie bon marché à revendre à votre propre consommation chère. Ensuite le rendement aller-retour : chaque cycle perd de l'énergie, et un rendement de 95 % et plus fait une vraie différence sur la rentabilité à long terme.

La puissance de charge élevée est un plus : elle permet de remplir la batterie pendant les quelques heures où les prix sont au plus bas.

## Automatisation

L'arbitrage manuel est impossible : il faut un pilotage automatique qui lit les prix du lendemain et planifie charges et décharges. Certains écosystèmes le font nativement, d'autres passent par des solutions tierces (Home Assistant, EMS dédiés). Vérifiez que votre batterie expose une API ou s'intègre à une solution de pilotage.

## Nos modèles conseillés

Les batteries de grande capacité à haut rendement et forte puissance de charge sont les mieux placées pour l'arbitrage. Consultez le comparateur pour filtrer par capacité et puissance, et privilégiez les modèles au rendement le plus élevé.`,
  },
  {
    slug: "lfp-vs-nmc-chimie-batterie", category: "technologie",
    title: "LFP vs NMC : quelle chimie de batterie choisir ?",
    excerpt: "Sécurité, durée de vie, densité : comparaison des technologies LFP et NMC pour une batterie domestique.",
    read_time_min: 5, badge_label: "Technologie",
    body: `## Deux familles de lithium

La quasi-totalité des batteries domestiques utilise le lithium, mais sous deux chimies principales : le LFP (lithium fer phosphate) et le NMC (nickel manganèse cobalt). Le choix influence la sécurité, la durée de vie et l'encombrement.

## Le LFP : sécurité et longévité

Le LFP est devenu le standard du résidentiel. Il tolère mieux la chaleur, présente un risque d'emballement thermique très faible et encaisse davantage de cycles : souvent 6 000 cycles ou plus, soit 15 à 20 ans d'usage quotidien. Son défaut historique, une densité énergétique plus faible, est peu gênant à domicile où la place n'est pas critique.

## Le NMC : compacité et densité

Le NMC stocke plus d'énergie dans un volume donné, ce qui explique sa présence dans l'automobile. À domicile, cet avantage compte moins, et sa sensibilité thermique ainsi que sa durée de vie généralement plus courte le rendent moins adapté au stockage stationnaire.

## Que choisir ?

Pour une batterie domestique en Belgique, le LFP est aujourd'hui le choix recommandé dans la grande majorité des cas : plus sûr, plus durable, et désormais compétitif en prix. Le NMC ne se justifie que dans de rares contraintes d'espace.

Tous les modèles de notre comparatif privilégient d'ailleurs le LFP.`,
  },
  {
    slug: "primes-rentabilite-batterie-belgique", category: "belgique",
    title: "Primes et rentabilité d'une batterie domestique en Belgique",
    excerpt: "Combien de temps pour rentabiliser une batterie ? Quelles aides selon votre région ? Le point sur la rentabilité en 2026.",
    read_time_min: 7, badge_label: "Belgique",
    body: `## La rentabilité dépend de votre profil

Il n'existe pas de réponse unique : la rentabilité d'une batterie dépend de votre consommation, de votre production solaire, de votre contrat d'électricité et de votre région. Une même batterie peut être très rentable pour un gros consommateur avec tarif dynamique, et marginale pour un petit consommateur sans panneaux.

## Les leviers de rentabilité

Trois mécanismes génèrent des économies. L'autoconsommation solaire évite d'acheter au réseau l'énergie que vos panneaux ont produite. L'arbitrage sur tarif dynamique exploite l'écart de prix entre heures creuses et pleines. Enfin, en Flandre, la réduction du pic de puissance allège le tarif capacitaire.

## Les aides régionales

Les primes évoluent chaque année et diffèrent d'une région à l'autre. En 2026, la situation générale est la suivante, à confirmer auprès des sources officielles avant tout achat :

- Flandre : pas de prime batterie généralisée ; l'intérêt vient surtout du tarif capacitaire et du dynamique.
- Wallonie : aides éventuelles conditionnées aux revenus et à des critères techniques.
- Bruxelles : cadre propre, à vérifier auprès de Bruxelles Environnement.

Ne fondez jamais votre décision sur un montant de prime lu dans un article : ces montants changent, vérifiez toujours l'état actuel.

## Ordre de grandeur du retour sur investissement

Selon les cas, le temps de retour se situe fréquemment entre 8 et 15 ans, à comparer à une garantie de 10 ans et une durée de vie de 15 à 20 ans. La batterie se justifie donc surtout si elle répond aussi à un besoin non purement financier : autonomie, secours en cas de coupure, ou maximisation d'une installation solaire existante.

## Pour aller plus loin

Utilisez notre guide personnalisé pour une recommandation adaptée à votre profil, et comparez les modèles selon leur rapport qualité/prix dans le comparateur.`,
  },
];

async function main() {
  console.log("🔐 Login…"); TOKEN = await getToken(); console.log("✅\n");
  console.log("🗂  Categories");
  const catIds = {};
  for (const [k, d] of Object.entries(CATEGORIES)) catIds[k] = await upsert(CT_CATEGORY, d.slug, d);
  console.log("\n📝 Articles");
  for (const a of ARTICLES) {
    const { category, ...rest } = a;
    await upsert(CT_ARTICLE, a.slug, { ...rest, category: catIds[category] });
  }
  console.log("\n🔓 Public API permissions (article, category)");
  try {
    const roles = await api("GET", "/users-permissions/roles");
    const pub = (roles.roles || []).find((r) => r.type === "public");
    if (pub) {
      const detail = await api("GET", `/users-permissions/roles/${pub.id}`);
      const perms = detail.role.permissions;
      for (const ct of ["api::article", "api::category"]) {
        const ctrl = ct.split("::")[1];
        if (perms[ct]?.controllers?.[ctrl]) {
          perms[ct].controllers[ctrl].find = { enabled: true };
          perms[ct].controllers[ctrl].findOne = { enabled: true };
        }
      }
      await api("PUT", `/users-permissions/roles/${pub.id}`, { ...detail.role, permissions: perms });
      console.log("  ✅ find/findOne enabled");
    }
  } catch (e) { console.log("  ⚠", e.message.slice(0, 80)); }
  console.log("\n🎉 Articles seeded. Visit http://localhost:3000/blog");
}
main().catch((e) => { console.error("❌", e); process.exit(1); });
