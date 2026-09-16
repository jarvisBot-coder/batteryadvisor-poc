/**
 * Seed the full BatteryAdvisor catalog via Strapi's content-manager API.
 * Idempotent: upserts each brand + battery by slug, then publishes.
 *
 * Usage:
 *   STRAPI_ADMIN_EMAIL=you@x.be STRAPI_ADMIN_PASSWORD='***' node seed-catalog.mjs
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

/* ── auth ── */
async function getToken() {
  let email = process.env.STRAPI_ADMIN_EMAIL;
  let password = process.env.STRAPI_ADMIN_PASSWORD;
  if (!email || !password) {
    const rl = (await import("readline")).createInterface({
      input: process.stdin, output: process.stdout,
    });
    const ask = (q) => new Promise((r) => rl.question(q, r));
    email = await ask("Admin email: ");
    password = await ask("Admin password: ");
    rl.close();
  }
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  return (await res.json()).data.token;
}

let TOKEN;
async function api(method, path, body) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

const CT_BATTERY = "content-manager/collection-types/api::battery.battery";
const CT_BRAND = "content-manager/collection-types/api::brand.brand";

async function upsert(ct, slug, data) {
  const list = await api("GET", `/${ct}?filters[slug][$eq]=${slug}&pagination[pageSize]=1`);
  const existing = (list.results || list.data || [])[0];
  let doc;
  if (existing) {
    doc = await api("PUT", `/${ct}/${existing.documentId}`, data);
    console.log(`  ↻ updated ${slug}`);
  } else {
    doc = await api("POST", `/${ct}`, data);
    console.log(`  + created ${slug}`);
  }
  const documentId = doc.data?.documentId || doc.documentId || existing?.documentId;
  // publish
  try {
    await api("POST", `/${ct}/${documentId}/actions/publish`);
  } catch (e) {
    console.log(`  ⚠ publish ${slug}: ${e.message.slice(0, 80)}`);
  }
  return documentId;
}

/* ── brands ── */
const BRANDS = {
  tesla:   { name: "Tesla",   slug: "tesla",   country: "États-Unis", website: "https://www.tesla.com" },
  byd:     { name: "BYD",     slug: "byd",     country: "Chine",      website: "https://www.byd.com" },
  huawei:  { name: "Huawei",  slug: "huawei",  country: "Chine",      website: "https://solar.huawei.com" },
  enphase: { name: "Enphase", slug: "enphase", country: "États-Unis", website: "https://enphase.com" },
  zendure: { name: "Zendure", slug: "zendure", country: "Chine",      website: "https://zendure.com" },
  sungrow: { name: "Sungrow", slug: "sungrow", country: "Chine",      website: "https://www.sungrowpower.com" },
};

/* ── shop helper (placeholder affiliate URLs — replace with real ones) ── */
const shop = (merchant, price, opts = {}) => ({
  merchant, price,
  url: opts.url || `https://example-affiliate.be/go/${encodeURIComponent(merchant.toLowerCase())}?p=${price}`,
  inStock: opts.inStock ?? true,
  shipping: opts.shipping,
  highlight: opts.highlight ?? false,
});

/* ── battery catalog ── */
const BATTERIES = [
  {
    slug: "tesla-powerwall-3", brand: "tesla",
    name: "Powerwall 3",
    capacity_kwh: 13.5, power_watts: 11500, peak_power_watts: 22000, type: "plug-in",
    score_overall: 8.7, score_performance: 9.0, score_app: 9.0, score_value: 7.0,
    score_installation: 7.5, score_quality: 8.0, score_design: 8.5, score_warranty: 7.0,
    price_from: 9500, warranty_years: 10, weight_kg: 130, chemistry: "LFP (Lithium Fer Phosphate)",
    cycles: 6000, belgium_approved: true, badge: "coup-de-coeur",
    depth_of_discharge: 100, efficiency_pct: 97.5, dimensions: "1098 x 555 x 220 mm",
    ip_rating: "IP67", connectivity: "Wi-Fi, Ethernet, Cellular", inverter_type: "Hybride intégré",
    reading_time_min: 8, alternative_pick: "BYD Battery-Box Premium HVS",
    quick_take: "La batterie domestique la plus aboutie du marché, avec un onduleur hybride intégré et l'écosystème Tesla en bonus. Un choix premium qui se justifie pour les grandes installations.",
    verdict: "Le Tesla Powerwall 3 s'impose comme la référence du stockage résidentiel haut de gamme. Son onduleur intégré, sa puissance exceptionnelle et l'écosystème Tesla en font un choix premium malgré un prix élevé.",
    pros: ["Capacité de 13,5 kWh parmi les plus élevées","Onduleur hybride intégré","Design compact et élégant","Application Tesla excellente","Mises à jour OTA régulières","Garantie 10 ans"],
    cons: ["Prix élevé","Disponibilité limitée en Belgique","Installateur certifié Tesla obligatoire","Pas de modularité","Dépendance à l'écosystème Tesla","Délais de livraison parfois longs"],
    ideal_for: ["Propriétaires avec panneaux solaires","Utilisateurs Tesla (voiture/solaire)","Maisons à forte consommation (>5000 kWh/an)","Solution clé-en-main haut de gamme"],
    not_for: ["Petits budgets (<6000€)","Installation DIY","Faible consommation électrique","Système modulaire/extensible"],
    review_body: "## Un concentré de technologie\n\nLe Tesla Powerwall 3 représente une évolution majeure dans le stockage résidentiel. Son onduleur hybride intégré simplifie l'installation et réduit le nombre de composants.\n\n## Performance et capacité\n\nAvec 13,5 kWh utilisables et 11,5 kW de puissance continue, c'est l'une des batteries les plus puissantes du marché résidentiel. Le pic atteint 22 kW.\n\n## L'application Tesla\n\nLe suivi en temps réel de la production, de la consommation et des flux d'énergie est exemplaire. Les mises à jour OTA apportent régulièrement de nouvelles fonctions.\n\n## Rapport qualité-prix\n\nÀ environ 9 500 € installé, il se positionne dans le haut de gamme. Le prix se justifie par l'onduleur intégré et la qualité logicielle.",
    faq: [
      {question:"Le Powerwall 3 est-il disponible en Belgique ?",answer:"Oui, via le réseau d'installateurs certifiés Tesla. Les délais varient selon la demande."},
      {question:"Différence entre Powerwall 2 et 3 ?",answer:"Le 3 intègre un onduleur hybride, offre 11,5 kW (contre 5 kW) et un design plus compact. Rendement 97,5%."},
      {question:"Peut-on installer plusieurs Powerwall 3 ?",answer:"Oui, jusqu'à 4 en parallèle pour 54 kWh et 46 kW."},
      {question:"Fonctionne-t-il en cas de coupure ?",answer:"Oui, bascule automatique quasi instantanée en secours."},
    ],
    competitors: [
      {name:"BYD Battery-Box Premium HVS",slug:"byd-battery-box-premium-hvs",score:8.2,price_from:7500,capacity_kwh:12.8},
      {name:"Huawei LUNA2000-10",slug:"huawei-luna2000-10",score:8.0,price_from:6500,capacity_kwh:10.0},
      {name:"Sungrow SBR HV",slug:"sungrow-sbr-hv",score:7.9,price_from:6800,capacity_kwh:12.8},
    ],
    shops: [
      shop("Tesla",9500,{highlight:true,shipping:"Installation incluse"}),
      shop("Solar Shop BE",9800),
      shop("123 Énergie",9990,{inStock:false}),
    ],
  },
  {
    slug: "byd-battery-box-premium-hvs", brand: "byd",
    name: "Battery-Box Premium HVS 12.8",
    capacity_kwh: 12.8, power_watts: 10200, peak_power_watts: 12800, type: "plug-in",
    score_overall: 8.2, score_performance: 8.0, score_app: 7.0, score_value: 8.8,
    score_installation: 7.5, score_quality: 8.5, score_design: 7.5, score_warranty: 8.0,
    price_from: 7500, warranty_years: 10, weight_kg: 100, chemistry: "LFP (Lithium Fer Phosphate)",
    cycles: 6000, belgium_approved: true, badge: "meilleur-budget",
    depth_of_discharge: 100, efficiency_pct: 96, dimensions: "585 x 650 x 298 mm (par module)",
    ip_rating: "IP55", connectivity: "Wi-Fi, RS485", inverter_type: "Externe (compatible multi-marques)",
    reading_time_min: 7, alternative_pick: "Huawei LUNA2000-10",
    quick_take: "Modulaire, fiable et compatible avec la plupart des onduleurs du marché. Le meilleur rapport qualité-prix pour qui veut une capacité évolutive.",
    verdict: "La BYD Battery-Box Premium HVS est un choix rationnel : modularité, compatibilité large et prix contenu. Elle demande un onduleur compatible, mais c'est la valeur sûre du milieu de gamme.",
    pros: ["Excellent rapport qualité-prix","Système modulaire (2,56 kWh par module)","Compatible Fronius, SMA, GoodWe, Sungrow","Chimie LFP sûre","Empreinte au sol réduite","6000 cycles garantis"],
    cons: ["Onduleur non inclus","Application moins aboutie que Tesla","Installation plus complexe (multi-composants)","Support technique variable"],
    ideal_for: ["Budgets maîtrisés","Installations évolutives","Propriétaires ayant déjà un onduleur compatible","Autoconsommation solaire"],
    not_for: ["Solution tout-en-un clé-en-main","Ceux qui veulent une app premium","Installation sans onduleur existant"],
    review_body: "## Modularité avant tout\n\nLa Battery-Box Premium HVS se compose de modules de 2,56 kWh empilables, de 5,1 à 12,8 kWh. On dimensionne exactement selon ses besoins.\n\n## Compatibilité étendue\n\nCompatible avec la majorité des onduleurs hybrides du marché (Fronius, SMA, GoodWe, Sungrow, Kostal). C'est son grand atout face aux systèmes fermés.\n\n## Sécurité et durée de vie\n\nChimie LFP, 6000 cycles garantis, rendement 96%. Un profil rassurant pour un usage quotidien intensif.",
    faq: [
      {question:"Quel onduleur pour la BYD HVS ?",answer:"Fronius Symo GEN24, SMA Sunny Boy Storage, GoodWe ET, Sungrow SH, Kostal Plenticore, entre autres."},
      {question:"Peut-on étendre la capacité plus tard ?",answer:"Oui, en ajoutant des modules de 2,56 kWh jusqu'à 12,8 kWh par tour."},
      {question:"La HVS est-elle sûre ?",answer:"Oui, chimie LFP réputée pour sa stabilité thermique."},
    ],
    competitors: [
      {name:"Tesla Powerwall 3",slug:"tesla-powerwall-3",score:8.7,price_from:9500,capacity_kwh:13.5},
      {name:"Huawei LUNA2000-10",slug:"huawei-luna2000-10",score:8.0,price_from:6500,capacity_kwh:10.0},
    ],
    shops: [
      shop("Solar Shop BE",7500,{highlight:true}),
      shop("Krannich Solar",7690),
      shop("123 Énergie",7850),
    ],
  },
  {
    slug: "huawei-luna2000-10", brand: "huawei",
    name: "LUNA2000-10-S0",
    capacity_kwh: 10, power_watts: 5000, peak_power_watts: 5000, type: "plug-in",
    score_overall: 8.0, score_performance: 7.4, score_app: 8.5, score_value: 8.8,
    score_installation: 7.6, score_quality: 8.0, score_design: 8.0, score_warranty: 7.8,
    price_from: 6500, warranty_years: 10, weight_kg: 34, chemistry: "LFP (Lithium Fer Phosphate)",
    cycles: 5000, belgium_approved: true, badge: "none",
    depth_of_discharge: 100, efficiency_pct: 95, dimensions: "670 x 150 x 600 mm (par module)",
    ip_rating: "IP66", connectivity: "Wi-Fi, FusionSolar", inverter_type: "Huawei SUN2000 requis",
    reading_time_min: 6, alternative_pick: "BYD Battery-Box Premium HVS",
    quick_take: "Modulaire, compacte et parfaitement intégrée à l'écosystème Huawei FusionSolar. Idéale si vous avez déjà un onduleur Huawei.",
    verdict: "La LUNA2000 brille dans un écosystème Huawei complet : app FusionSolar excellente, modularité 5-15 kWh, prix compétitif. Hors écosystème Huawei, l'intérêt baisse.",
    pros: ["Modules de 5 kWh empilables","App FusionSolar très complète","Prix compétitif","Compacte et légère","Optimiseur par module","Bon rendement"],
    cons: ["Nécessite un onduleur Huawei SUN2000","Puissance de sortie limitée (5 kW)","Écosystème fermé","Support parfois lent"],
    ideal_for: ["Propriétaires équipés Huawei","Budgets serrés","Petites et moyennes installations","Ceux qui aiment le suivi détaillé"],
    not_for: ["Onduleur d'une autre marque","Besoin de forte puissance de sortie","Grandes maisons énergivores"],
    review_body: "## Pensée pour l'écosystème Huawei\n\nLa LUNA2000 s'intègre nativement aux onduleurs SUN2000 et à l'app FusionSolar, l'une des meilleures du marché pour le suivi.\n\n## Modularité\n\nDe 5 à 15 kWh par pas de 5 kWh. Chaque module dispose de son propre optimiseur, limitant l'impact d'un module défaillant.\n\n## Limites\n\n5 kW de puissance de sortie et la dépendance à un onduleur Huawei restreignent les cas d'usage.",
    faq: [
      {question:"Faut-il un onduleur Huawei ?",answer:"Oui, la LUNA2000-S0 requiert un onduleur Huawei SUN2000 hybride."},
      {question:"Capacité maximale ?",answer:"15 kWh en empilant trois modules de 5 kWh."},
      {question:"L'app FusionSolar est-elle gratuite ?",answer:"Oui, incluse avec le système."},
    ],
    competitors: [
      {name:"BYD Battery-Box Premium HVS",slug:"byd-battery-box-premium-hvs",score:8.2,price_from:7500,capacity_kwh:12.8},
      {name:"Sungrow SBR HV",slug:"sungrow-sbr-hv",score:7.9,price_from:6800,capacity_kwh:12.8},
    ],
    shops: [
      shop("123 Énergie",6500,{highlight:true}),
      shop("Solar Shop BE",6690),
    ],
  },
  {
    slug: "enphase-iq-battery-5p", brand: "enphase",
    name: "IQ Battery 5P",
    capacity_kwh: 5, power_watts: 3840, peak_power_watts: 7680, type: "plug-in",
    score_overall: 7.8, score_performance: 7.6, score_app: 8.8, score_value: 6.8,
    score_installation: 8.4, score_quality: 8.2, score_design: 7.8, score_warranty: 9.2,
    price_from: 8000, warranty_years: 15, weight_kg: 70, chemistry: "LFP (Lithium Fer Phosphate)",
    cycles: 6000, belgium_approved: true, badge: "none",
    depth_of_discharge: 100, efficiency_pct: 96, dimensions: "384 x 400 x 551 mm",
    ip_rating: "IP55", connectivity: "Wi-Fi, Cellular, Enphase App", inverter_type: "Micro-onduleurs intégrés",
    reading_time_min: 6, alternative_pick: "Huawei LUNA2000-10",
    quick_take: "Architecture micro-onduleurs unique, garantie 15 ans record et app impeccable. Le prix au kWh reste élevé, mais la modularité fine séduit.",
    verdict: "L'IQ Battery 5P mise sur la fiabilité : redondance des micro-onduleurs, 15 ans de garantie, sécurité LFP. Son prix au kWh élevé la réserve aux installations Enphase soignées.",
    pros: ["Garantie 15 ans (record)","Architecture micro-onduleurs redondante","App Enphase excellente","Modularité fine (5 kWh)","Sécurité LFP","Installation simple"],
    cons: ["Prix au kWh élevé","Capacité unitaire faible","Puissance limitée par unité","Écosystème Enphase recommandé"],
    ideal_for: ["Installations Enphase existantes","Ceux qui priorisent la fiabilité","Extension progressive","Toitures complexes"],
    not_for: ["Recherche du prix le plus bas","Besoin de grande capacité en un bloc","Budget serré"],
    review_body: "## Une architecture unique\n\nChaque IQ Battery 5P embarque des micro-onduleurs, offrant redondance et sécurité. Pas de point de défaillance unique.\n\n## Garantie record\n\n15 ans de garantie, la plus longue du marché résidentiel — un argument fort sur la durée.\n\n## Le prix, seul frein\n\nLe prix au kWh reste supérieur à la concurrence, compensé par la fiabilité et l'app.",
    faq: [
      {question:"Pourquoi 15 ans de garantie ?",answer:"Enphase mise sur la fiabilité de son architecture micro-onduleurs distribuée."},
      {question:"Peut-on combiner plusieurs IQ 5P ?",answer:"Oui, la modularité par blocs de 5 kWh permet d'ajuster finement la capacité."},
      {question:"Faut-il un onduleur Enphase ?",answer:"Recommandé pour tirer parti de l'écosystème, mais la batterie gère sa propre conversion."},
    ],
    competitors: [
      {name:"Tesla Powerwall 3",slug:"tesla-powerwall-3",score:8.7,price_from:9500,capacity_kwh:13.5},
      {name:"Zendure AB2000 / SolarFlow",slug:"zendure-solarflow-ab2000",score:7.4,price_from:1500,capacity_kwh:1.92},
    ],
    shops: [
      shop("Enphase Store",8000,{highlight:true}),
      shop("Solar Shop BE",8200),
      shop("123 Énergie",8290,{inStock:false}),
    ],
  },
  {
    slug: "zendure-solarflow-ab2000", brand: "zendure",
    name: "SolarFlow AB2000",
    capacity_kwh: 1.92, power_watts: 1200, peak_power_watts: 1800, type: "plug-in",
    score_overall: 7.4, score_performance: 7.0, score_app: 8.0, score_value: 8.5,
    score_installation: 9.0, score_quality: 7.2, score_design: 8.0, score_warranty: 7.0,
    price_from: 1500, warranty_years: 10, weight_kg: 22, chemistry: "LFP (Lithium Fer Phosphate)",
    cycles: 6000, belgium_approved: true, badge: "none",
    depth_of_discharge: 100, efficiency_pct: 93, dimensions: "398 x 245 x 197 mm",
    ip_rating: "IP65", connectivity: "Wi-Fi, Bluetooth, App Zendure", inverter_type: "Micro-onduleur plug & play",
    reading_time_min: 5, alternative_pick: "Enphase IQ Battery 5P",
    quick_take: "La batterie plug-and-play par excellence : installation sans électricien, modulaire, idéale pour les balcons solaires et les locataires.",
    verdict: "La SolarFlow AB2000 démocratise le stockage : plug-and-play, modulaire (jusqu'à 7,68 kWh), et parfaite pour le solaire de balcon. Capacité et puissance limitées face aux systèmes fixes.",
    pros: ["Installation plug-and-play sans électricien","Modulaire jusqu'à 7,68 kWh","Idéale pour balcons solaires","Compacte et transportable","Prix d'entrée accessible","App Zendure intuitive"],
    cons: ["Capacité unitaire faible","Puissance limitée","Rendement inférieur aux systèmes fixes","Moins adaptée aux grandes maisons"],
    ideal_for: ["Locataires et appartements","Solaire de balcon (plug-in)","Petites installations","Débuter dans le stockage sans gros travaux"],
    not_for: ["Grandes maisons énergivores","Backup de toute la maison","Ceux qui veulent une forte puissance"],
    review_body: "## Le stockage sans travaux\n\nLa SolarFlow AB2000 se branche sans électricien : idéale pour le solaire de balcon et les locataires qui ne peuvent pas modifier l'installation.\n\n## Modularité\n\nEmpilable jusqu'à 7,68 kWh (4 unités), on commence petit et on étend selon le besoin.\n\n## Ses limites\n\nCapacité et puissance restent modestes face aux systèmes fixes — c'est le compromis de la simplicité.",
    faq: [
      {question:"Faut-il un électricien ?",answer:"Non, le système est plug-and-play et se branche sur une prise standard avec un kit solaire compatible."},
      {question:"Compatible avec le solaire de balcon ?",answer:"Oui, c'est son cas d'usage principal en Belgique et en Allemagne."},
      {question:"Capacité maximale ?",answer:"7,68 kWh en empilant 4 modules AB2000."},
    ],
    competitors: [
      {name:"Enphase IQ Battery 5P",slug:"enphase-iq-battery-5p",score:7.8,price_from:8000,capacity_kwh:5.0},
      {name:"Huawei LUNA2000-10",slug:"huawei-luna2000-10",score:8.0,price_from:6500,capacity_kwh:10.0},
    ],
    shops: [
      shop("Zendure",1500,{highlight:true,shipping:"Livraison gratuite"}),
      shop("Amazon.be",1549),
      shop("Coolblue",1599),
    ],
  },
  {
    slug: "sungrow-sbr-hv", brand: "sungrow",
    name: "SBR HV 12.8",
    capacity_kwh: 12.8, power_watts: 9600, peak_power_watts: 12800, type: "plug-in",
    score_overall: 7.9, score_performance: 7.8, score_app: 7.5, score_value: 8.4,
    score_installation: 7.4, score_quality: 8.0, score_design: 7.4, score_warranty: 8.0,
    price_from: 6800, warranty_years: 10, weight_kg: 129, chemistry: "LFP (Lithium Fer Phosphate)",
    cycles: 6000, belgium_approved: true, badge: "none",
    depth_of_discharge: 100, efficiency_pct: 95, dimensions: "600 x 240 x 720 mm (par module)",
    ip_rating: "IP55", connectivity: "Wi-Fi, iSolarCloud", inverter_type: "Sungrow SH hybride requis",
    reading_time_min: 6, alternative_pick: "BYD Battery-Box Premium HVS",
    quick_take: "Modulaire de 9,6 à 25,6 kWh, robuste et bien tarifée. Un excellent choix dans l'écosystème Sungrow SH.",
    verdict: "La Sungrow SBR HV est une valeur montante : modularité large, chimie LFP, prix agressif. Elle exige un onduleur Sungrow SH, mais l'ensemble reste très compétitif.",
    pros: ["Modularité 9,6-25,6 kWh","Prix compétitif","Chimie LFP robuste","Haute tension (moins de pertes)","Bon rendement","Marque solide en croissance"],
    cons: ["Onduleur Sungrow SH obligatoire","App iSolarCloud perfectible","Notoriété inférieure à Tesla/BYD","Poids élevé par module"],
    ideal_for: ["Installations Sungrow SH","Grandes capacités évolutives","Budgets maîtrisés","Autoconsommation intensive"],
    not_for: ["Onduleur d'une autre marque","Recherche d'une app premium","Petites installations simples"],
    review_body: "## Haute tension, moins de pertes\n\nLa SBR HV fonctionne en haute tension, réduisant les pertes de conversion et améliorant le rendement global du système.\n\n## Modularité généreuse\n\nDe 9,6 à 25,6 kWh, elle couvre du foyer moyen à la grande maison énergivore, dans l'écosystème Sungrow SH.\n\n## Rapport qualité-prix\n\nParmi les mieux tarifées de sa catégorie, à condition d'adopter un onduleur Sungrow.",
    faq: [
      {question:"Quel onduleur pour la SBR HV ?",answer:"Un onduleur hybride Sungrow de la gamme SH (SH-RS, SH-RT)."},
      {question:"Capacité maximale ?",answer:"25,6 kWh en empilant huit modules de 3,2 kWh."},
      {question:"La chimie est-elle sûre ?",answer:"Oui, LFP, réputée pour sa stabilité et sa longévité."},
    ],
    competitors: [
      {name:"BYD Battery-Box Premium HVS",slug:"byd-battery-box-premium-hvs",score:8.2,price_from:7500,capacity_kwh:12.8},
      {name:"Tesla Powerwall 3",slug:"tesla-powerwall-3",score:8.7,price_from:9500,capacity_kwh:13.5},
    ],
    shops: [
      shop("Krannich Solar",6800,{highlight:true}),
      shop("Solar Shop BE",6990),
      shop("123 Énergie",7100),
    ],
  },
];

async function main() {
  console.log("🔐 Login…");
  TOKEN = await getToken();
  console.log("✅ Logged in\n");

  console.log("🏭 Brands");
  const brandIds = {};
  for (const [key, data] of Object.entries(BRANDS)) {
    brandIds[key] = await upsert(CT_BRAND, data.slug, data);
  }

  console.log("\n🔋 Batteries");
  for (const b of BATTERIES) {
    const { brand, ...rest } = b;
    await upsert(CT_BATTERY, b.slug, { ...rest, brand: brandIds[brand] });
  }

  console.log("\n🔓 Public API permissions");
  try {
    const upRoles = await api("GET", "/users-permissions/roles");
    const pub = (upRoles.roles || []).find((r) => r.type === "public");
    if (pub) {
      const detail = await api("GET", `/users-permissions/roles/${pub.id}`);
      const perms = detail.role.permissions;
      for (const ct of ["api::battery", "api::brand", "api::article", "api::category"]) {
        const ctrl = ct.split("::")[1];
        if (perms[ct]?.controllers?.[ctrl]) {
          perms[ct].controllers[ctrl].find = { enabled: true };
          perms[ct].controllers[ctrl].findOne = { enabled: true };
        }
      }
      await api("PUT", `/users-permissions/roles/${pub.id}`, { ...detail.role, permissions: perms });
      console.log("  ✅ find/findOne enabled for battery, brand, article, category");
    }
  } catch (e) {
    console.log("  ⚠ permissions:", e.message.slice(0, 100));
  }

  console.log("\n🎉 Catalog seeded. Visit http://localhost:3000/batteries");
}

main().catch((e) => { console.error("❌", e); process.exit(1); });
