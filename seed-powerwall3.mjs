/**
 * Seed script: populates Tesla Powerwall 3 data in Strapi
 * Usage: 
 *   1. Start Strapi: cd backend && npm run develop
 *   2. Run this script: node seed-powerwall3.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STRAPI_URL = 'http://localhost:1337';

async function waitForStrapi() {
  console.log('⏳ Waiting for Strapi to be ready...');
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/batteries`);
      if (res.ok) { console.log('✅ Strapi is ready!'); return true; }
    } catch {}
    await new Promise(r => setTimeout(r, 2000));
  }
  console.error('❌ Strapi did not start in time');
  return false;
}

async function uploadImage(filePath) {
  const form = new FormData();
  const file = new Blob([fs.readFileSync(filePath)]);
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
  form.append('files', file, path.basename(filePath));
  
  const res = await fetch(`${STRAPI_URL}/api/upload`, { method: 'POST', body: form });
  if (!res.ok) {
    console.warn(`⚠️  Upload failed for ${filePath}: ${res.statusText}`);
    return null;
  }
  const data = await res.json();
  console.log(`📸 Uploaded: ${path.basename(filePath)} → id ${data[0]?.id}`);
  return data[0]?.id;
}

async function findBattery(slug) {
  const res = await fetch(`${STRAPI_URL}/api/batteries?filters[slug][$eq]=${slug}&populate=*`);
  const data = await res.json();
  return data?.data?.[0] || null;
}

async function updateBattery(id, payload) {
  const res = await fetch(`${STRAPI_URL}/api/batteries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Update failed: ${err}`);
    return null;
  }
  return await res.json();
}

async function findOrCreateBrand(name) {
  const res = await fetch(`${STRAPI_URL}/api/brands?filters[name][$eq]=${encodeURIComponent(name)}`);
  const data = await res.json();
  if (data?.data?.[0]) {
    console.log(`✅ Brand found: ${name} (id: ${data.data[0].id})`);
    return data.data[0].id;
  }
  // Create brand
  const createRes = await fetch(`${STRAPI_URL}/api/brands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { name, slug: name.toLowerCase().replace(/\s+/g, "-") } }),
  });
  if (!createRes.ok) {
    console.warn(`⚠️  Could not create brand ${name}`);
    return null;
  }
  const created = await createRes.json();
  console.log(`🆕 Brand created: ${name} (id: ${created.data?.id})`);
  return created.data?.id;
}

async function createBattery(payload) {
  const res = await fetch(`${STRAPI_URL}/api/batteries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Create failed: ${err}`);
    return null;
  }
  return await res.json();
}

async function main() {
  if (!(await waitForStrapi())) process.exit(1);

  // Upload images if they exist
  const imgDir = path.join(__dirname, 'powerwall-images');
  let heroImageId = null;
  let galleryIds = [];
  
  if (fs.existsSync(imgDir)) {
    const imgFiles = fs.readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    for (const imgFile of imgFiles) {
      const id = await uploadImage(path.join(imgDir, imgFile));
      if (id) {
        if (imgFile.includes('hero') || imgFile.includes('main')) {
          heroImageId = id;
        } else {
          galleryIds.push(id);
        }
      }
    }
  }

  // Powerwall 3 data from real reviews and specs
  const powerwallData = {
    name: 'Tesla Powerwall 3',
    slug: 'tesla-powerwall-3',
    // brand will be set dynamically below
    capacity_kwh: 13.5,
    power_watts: 11500,
    price_from: 9500,
    warranty_years: 10,
    score_overall: 8.7,
    score_installation: 7.5,
    score_design: 8.5,
    score_warranty: 7.0,
    score_app: 9.0,
    score_value: 7.0,
    score_performance: 9.0,
    score_quality: 8.0,
    chemistry: 'LFP (Lithium Fer Phosphate)',
    cycles: 6000,
    weight_kg: 130,
    type: 'plug-in',
    belgium_approved: true,
    
    // New detailed specs
    depth_of_discharge: 100,
    efficiency_pct: 97.5,
    dimensions: '1098 × 609 × 193 mm',
    ip_rating: 'IP67',
    connectivity: 'Wi-Fi, Ethernet, Tesla App',
    inverter_type: 'Hybride DC intégré (6 MPPT)',
    peak_power_watts: 22000,
    reading_time_min: 12,

    quick_take: "La Tesla Powerwall 3 est une évolution majeure : batterie et onduleur solaire intégrés dans un seul boîtier, puissance de décharge record de 11,5 kW en continu, et une efficacité de 97,5%. C'est la solution tout-en-un la plus puissante du marché résidentiel, idéale pour les maisons 100% électriques avec pompe à chaleur et borne de recharge EV.",

    review_body: `## Design et installation

La Powerwall 3 adopte un format mural compact malgré ses 130 kg. Le boîtier blanc mat s'intègre discrètement en garage ou en extérieur grâce à sa certification IP67 — elle résiste à la poussière et à une immersion temporaire. Tesla a fait le choix audacieux d'intégrer l'onduleur solaire directement dans la batterie, ce qui élimine un boîtier supplémentaire sur le mur et simplifie considérablement le câblage.

L'installation nécessite un professionnel certifié. En Belgique, la conformité RGIE est impérative. Comptez une demi-journée à une journée complète pour l'installation, selon la complexité de votre tableau électrique. Le Gateway 2, vendu séparément (1 000–1 700 €), est indispensable pour la fonction backup.

## Performances

C'est ici que la Powerwall 3 impressionne le plus. Avec 11,5 kW de puissance continue en décharge, elle surpasse largement la concurrence — la Huawei LUNA 2000 plafonne à 5 kW par module, et la BYD HVS à 5,1 kW. Cette puissance permet d'alimenter simultanément une pompe à chaleur, un chargeur EV et les appareils courants sans jamais décrocher.

La capacité de 13,5 kWh couvre facilement la consommation nocturne d'un ménage belge moyen (8-10 kWh). Le rendement aller-retour de 97,5% est exceptionnel — chaque kWh stocké est presque entièrement restitué. Les cellules LFP (Lithium Fer Phosphate) garantissent plus de 6 000 cycles, soit environ 15-20 ans d'utilisation quotidienne.

En mode backup, la Powerwall 3 peut fournir jusqu'à 22 kW en crête pendant 10 secondes, suffisant pour démarrer un compresseur de pompe à chaleur (185 A LRA). La transition réseau→batterie est quasi-instantanée.

## Application Tesla

L'app Tesla Energy est l'une des meilleures du marché. Le tableau de bord temps réel affiche les flux d'énergie entre panneaux, batterie, maison et réseau avec des animations fluides. Les modes de fonctionnement sont intuitifs :

- **Autoconsommation** : maximise l'utilisation de votre production solaire
- **Time-Based Control** : charge/décharge selon les tarifs horaires (parfait avec un contrat dynamique Engie ou Luminus)
- **Backup** : réserve un pourcentage pour les coupures
- **Storm Watch** : augmente automatiquement la réserve avant une tempête annoncée

L'intégration avec l'écosystème Tesla (véhicule, Powerwall, panneaux solaires) est un vrai plus si vous êtes déjà dans l'univers Tesla.

## Garantie et fiabilité

Tesla offre une garantie de 10 ans avec 70% de capacité résiduelle garantie. C'est correct mais en dessous d'Enphase (15 ans) et de certaines configurations Huawei (jusqu'à 15 ans). Les cycles sont illimités pendant la période de garantie.

La fiabilité terrain de la Powerwall est bien documentée — des centaines de milliers d'unités installées dans le monde, avec un taux de défaillance faible. Le réseau de service Tesla en Europe s'améliore mais reste moins dense que les installateurs Huawei ou BYD certifiés en Belgique.

## Prix et rentabilité

En Belgique, comptez entre 9 000 et 12 000 € TTC installation comprise (batterie ~7 900 €, Gateway ~1 400 €, installation ~3 600 €). C'est un positionnement premium face à la Huawei LUNA 2000 (4 000-8 000 €) ou la BYD HVS (4 500-9 000 €), mais la Powerwall 3 inclut l'onduleur solaire — un équipement qui coûte séparément 1 500-2 500 €.

Avec un tarif prosumer en Wallonie et des panneaux solaires de 6 kWc, le retour sur investissement se situe entre 7 et 10 ans. En Flandre avec le tarif capacitaire, l'écrêtage des pics de consommation accélère la rentabilité. Un contrat à tarif dynamique peut encore améliorer le business case grâce au Time-Based Control.`,

    pros: [
      "Puissance de décharge record (11,5 kW continu)",
      "Onduleur solaire intégré — installation simplifiée",
      "Rendement exceptionnel de 97,5%",
      "Application Tesla exemplaire avec modes intelligents",
      "Certification IP67 — installation intérieure ou extérieure",
      "Cellules LFP durables (+6 000 cycles)"
    ],
    cons: [
      "Prix premium (9 000-12 000 € installé en Belgique)",
      "Gateway 2 requis en supplément pour le backup",
      "Garantie 10 ans seulement (vs 15 ans chez Enphase)",
      "Monophasé uniquement (pas de version triphasée)",
      "Charge AC limitée à 5 kW",
      "Disponibilité encore limitée en Belgique"
    ],

    ideal_for: [
      "Maisons 100% électriques (pompe à chaleur + EV)",
      "Propriétaires de véhicules Tesla",
      "Installations solaires de 5-20 kWc",
      "Recherche de la meilleure puissance de décharge"
    ],
    not_for: [
      "Petits budgets (< 6 000 €)",
      "Installations triphasées",
      "Ceux qui veulent du 100% off-grid",
      "Besoin d'une garantie longue (15+ ans)"
    ],
    alternative_pick: "Huawei LUNA 2000 — Meilleur rapport qualité-prix en Belgique, modulaire de 5 à 30 kWh, à partir de 4 000 €",

    faq: [
      {
        question: "La Powerwall 3 est-elle disponible en Belgique ?",
        answer: "La disponibilité progresse en 2026. Contactez un installateur Tesla certifié ou Energy Village pour vérifier les délais dans votre région. L'installation doit être réalisée par un professionnel certifié RGIE."
      },
      {
        question: "Peut-on installer plusieurs Powerwall 3 ?",
        answer: "Oui, jusqu'à 4 unités en parallèle pour atteindre 54 kWh de stockage et 46 kW de puissance. Chaque unité supplémentaire coûte environ 7 900 € hors installation."
      },
      {
        question: "La Powerwall 3 fonctionne-t-elle sans panneaux solaires ?",
        answer: "Oui, elle peut se charger uniquement depuis le réseau (charge AC à 5 kW). C'est utile pour l'arbitrage tarifaire avec un contrat à prix dynamique, mais la rentabilité est meilleure avec du solaire."
      },
      {
        question: "Quelle est la différence avec la Powerwall 2 ?",
        answer: "La Powerwall 3 intègre un onduleur solaire (la 2 n'en avait pas), offre 11,5 kW vs 5 kW de puissance, un rendement de 97,5% vs 90%, et utilise des cellules LFP plus durables au lieu du NMC."
      },
      {
        question: "La Powerwall 3 est-elle compatible avec mon onduleur existant ?",
        answer: "La Powerwall 3 a son propre onduleur intégré. Si vous avez déjà un onduleur solaire, vous pouvez soit le remplacer par celui de la Powerwall 3 (DC-coupled), soit le garder en parallèle (AC-coupled, moins efficient)."
      },
      {
        question: "Quel est le coût total installé en Belgique ?",
        answer: "Entre 9 000 et 12 000 € TTC, incluant la batterie (~7 900 €), le Gateway 2 (~1 400 €) et l'installation RGIE (~1 500-3 000 €). Des primes régionales peuvent s'appliquer en Wallonie."
      }
    ],

    competitors: [
      {
        name: "Huawei LUNA 2000",
        capacityKwh: "5-30",
        powerKw: "2.5-15",
        priceEur: 6000,
        score: 82
      },
      {
        name: "BYD Battery-Box HVS",
        capacityKwh: "5.1-12.8",
        powerKw: 5.1,
        priceEur: 7000,
        score: 78
      },
      {
        name: "Enphase IQ Battery 5P",
        capacityKwh: "5-40",
        powerKw: 3.84,
        priceEur: 7500,
        score: 80
      },
      {
        name: "Sigenergy SigenStor",
        capacityKwh: "8-54",
        powerKw: "3-25",
        priceEur: 8500,
        score: 81
      }
    ],
  };

  // Add image references if uploaded
  if (heroImageId) {
    powerwallData.image = heroImageId;
  }
  if (galleryIds.length > 0) {
    powerwallData.gallery = galleryIds;
  }

  // Find or create the Tesla brand
  const brandId = await findOrCreateBrand("Tesla");
  if (brandId) {
    powerwallData.brand = brandId;
  }
  // Find existing battery or create new one
  const existing = await findBattery('tesla-powerwall-3');
  
  if (existing) {
    console.log(`📝 Updating existing Powerwall 3 (id: ${existing.id})...`);
    const result = await updateBattery(existing.id, powerwallData);
    if (result) {
      console.log('✅ Tesla Powerwall 3 updated with full review data!');
    }
  } else {
    console.log('🆕 Creating Tesla Powerwall 3 entry...');
    const result = await createBattery(powerwallData);
    if (result) {
      console.log(`✅ Tesla Powerwall 3 created (id: ${result.data?.id})!`);
    }
  }

  console.log('\n🎉 Done! Visit http://localhost:3000/batteries/tesla-powerwall-3 to see the result.');
}

main().catch(console.error);
