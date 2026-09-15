/**
 * Seed Tesla Powerwall 3 data via Strapi REST API
 * Usage: STRAPI_ADMIN_EMAIL=xxx STRAPI_ADMIN_PASSWORD=xxx node seed-api.mjs
 */

const STRAPI_URL = 'http://localhost:1337';

async function getAdminToken() {
  // Try env vars first
  let email = process.env.STRAPI_ADMIN_EMAIL;
  let password = process.env.STRAPI_ADMIN_PASSWORD;
  
  if (!email || !password) {
    // Prompt
    const readline = await import('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise(r => rl.question(q, r));
    email = await ask('Admin email: ');
    password = await ask('Admin password: ');
    rl.close();
  }

  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.data.token;
}

async function apiCall(token, method, path, body) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${text}`);
  return JSON.parse(text);
}

async function main() {
  console.log('🔐 Logging in to Strapi admin...');
  const token = await getAdminToken();
  console.log('✅ Logged in');

  // Create brand
  console.log('🏭 Creating brand Tesla...');
  let brandDocId;
  try {
    const brandRes = await apiCall(token, 'POST', '/content-manager/collection-types/api::brand.brand', {
      name: 'Tesla',
      slug: 'tesla',
      country: 'États-Unis',
      website: 'https://www.tesla.com'
    });
    brandDocId = brandRes.data?.documentId || brandRes.documentId || brandRes.id;
    console.log('✅ Brand created:', brandDocId);
  } catch (e) {
    console.log('⚠️  Brand may already exist, trying to find it...');
    const brands = await apiCall(token, 'GET', '/content-manager/collection-types/api::brand.brand');
    const tesla = (brands.results || brands.data || []).find(b => b.slug === 'tesla' || b.name === 'Tesla');
    if (tesla) {
      brandDocId = tesla.documentId || tesla.id;
      console.log('✅ Found existing brand:', brandDocId);
    } else {
      console.log('❌ Could not create or find Tesla brand');
      brandDocId = null;
    }
  }

  // Create battery
  console.log('🔋 Creating Tesla Powerwall 3...');
  const batteryData = {
    name: 'Tesla Powerwall 3',
    slug: 'tesla-powerwall-3',
    brand: brandDocId,
    capacity_kwh: 13.5,
    power_watts: 11500,
    type: 'plug-in',
    score_overall: 8.7,
    score_performance: 9.0,
    score_app: 9.0,
    score_value: 7.0,
    score_installation: 7.5,
    score_quality: 8.0,
    score_design: 8.5,
    score_warranty: 7.0,
    price_from: 9500,
    warranty_years: 10,
    weight_kg: 130,
    chemistry: 'LFP (Lithium Fer Phosphate)',
    cycles: 6000,
    belgium_approved: true,
    badge: 'coup-de-coeur',
    depth_of_discharge: 100,
    efficiency_pct: 97.5,
    dimensions: '1098 x 555 x 220 mm',
    ip_rating: 'IP67',
    connectivity: 'Wi-Fi, Ethernet, Cellular',
    inverter_type: 'Hybride intégré',
    peak_power_watts: 22000,
    reading_time_min: 8,
    alternative_pick: 'BYD HVS 12.8',
    pros: [
      "Capacité de 13,5 kWh parmi les plus élevées du marché",
      "Onduleur hybride intégré simplifiant l'installation",
      "Design compact et élégant",
      "Application Tesla excellente avec suivi en temps réel",
      "Compatible avec le réseau Tesla et les mises à jour OTA",
      "Garantie de 10 ans extensible"
    ],
    cons: [
      "Prix élevé par rapport à la concurrence",
      "Disponibilité limitée en Belgique",
      "Installation par installateur certifié Tesla uniquement",
      "Pas de modularité (impossible d'ajouter des modules)",
      "Dépendance à l'écosystème Tesla",
      "Délais de livraison parfois longs"
    ],
    ideal_for: [
      "Propriétaires avec panneaux solaires cherchant l'autoconsommation maximale",
      "Utilisateurs Tesla (voiture/solaire) souhaitant un écosystème unifié",
      "Maisons avec consommation élevée (> 5000 kWh/an)",
      "Ceux qui veulent une solution clé-en-main haut de gamme"
    ],
    not_for: [
      "Petits budgets (< 6000€)",
      "Ceux qui veulent une installation DIY",
      "Maisons avec faible consommation électrique",
      "Ceux qui préfèrent un système modulaire/extensible"
    ],
    verdict: "Le Tesla Powerwall 3 s'impose comme la référence du stockage résidentiel haut de gamme. Son onduleur intégré, sa puissance exceptionnelle et l'écosystème Tesla en font un choix premium pour les propriétaires exigeants, malgré un prix élevé.",
    quick_take: "La batterie domestique la plus aboutie du marché, avec un onduleur hybride intégré et l'écosystème Tesla en bonus. Un choix premium qui se justifie pour les grandes installations.",
    review_body: `## Un concentré de technologie

Le Tesla Powerwall 3 représente une évolution majeure dans le monde du stockage résidentiel. Avec son onduleur hybride intégré, Tesla simplifie considérablement l'installation et réduit le nombre de composants nécessaires.

## Performance et capacité

Avec 13,5 kWh de capacité utilisable et une puissance continue de 11,5 kW, le Powerwall 3 est l'une des batteries les plus puissantes du marché résidentiel. Le pic de puissance atteint même 22 kW, suffisant pour alimenter tous les appareils d'une maison simultanément.

## L'application Tesla

L'application Tesla reste un point fort majeur. Le suivi en temps réel de la production solaire, de la consommation et des flux d'énergie est exemplaire. Les mises à jour OTA apportent régulièrement de nouvelles fonctionnalités.

## Installation et garantie

L'installation doit être réalisée par un installateur certifié Tesla. Si cela limite le choix, cela garantit une qualité d'installation constante. La garantie de 10 ans couvre 70% de la capacité initiale.

## Rapport qualité-prix

À environ 9 500€ installation comprise, le Powerwall 3 se positionne dans le haut de gamme. Le prix se justifie par l'onduleur intégré et la qualité logicielle, mais reste un investissement conséquent pour le marché belge.`,
    faq: [
      { question: "Le Tesla Powerwall 3 est-il disponible en Belgique ?", answer: "Oui, le Powerwall 3 est disponible en Belgique via le réseau d'installateurs certifiés Tesla. Les délais peuvent varier selon la demande." },
      { question: "Quelle est la différence entre le Powerwall 2 et le Powerwall 3 ?", answer: "Le Powerwall 3 intègre un onduleur hybride, offre une puissance de 11,5 kW (contre 5 kW) et un design plus compact. L'efficacité passe à 97,5%." },
      { question: "Peut-on installer plusieurs Powerwall 3 ?", answer: "Oui, jusqu'à 4 Powerwall 3 peuvent être installés en parallèle pour atteindre 54 kWh de stockage et 46 kW de puissance." },
      { question: "Le Powerwall 3 fonctionne-t-il en cas de coupure de courant ?", answer: "Oui, le Powerwall 3 assure une alimentation de secours automatique en cas de coupure, avec un temps de basculement quasi instantané." },
      { question: "Quelle est la durée de vie du Powerwall 3 ?", answer: "Tesla garantit 70% de capacité résiduelle après 10 ans. Avec 6000 cycles, la durée de vie estimée est de 15 à 20 ans." },
      { question: "Le Powerwall 3 est-il compatible avec des panneaux non-Tesla ?", answer: "Oui, grâce à son onduleur hybride intégré, il est compatible avec la plupart des installations solaires existantes." }
    ],
    competitors: [
      { name: "BYD HVS 12.8", score: 8.2, price_from: 7500, capacity_kwh: 12.8 },
      { name: "Huawei LUNA2000-10", score: 8.0, price_from: 6500, capacity_kwh: 10.0 },
      { name: "Enphase IQ Battery 5P", score: 7.8, price_from: 8000, capacity_kwh: 15.0 },
      { name: "SolarEdge Home Battery", score: 7.5, price_from: 7000, capacity_kwh: 9.7 }
    ]
  };

  try {
    const batteryRes = await apiCall(token, 'POST', '/content-manager/collection-types/api::battery.battery', batteryData);
    const docId = batteryRes.data?.documentId || batteryRes.documentId;
    console.log('✅ Battery created:', docId);

    // Publish it
    if (docId) {
      console.log('📢 Publishing battery...');
      try {
        await apiCall(token, 'POST', `/content-manager/collection-types/api::battery.battery/${docId}/actions/publish`);
        console.log('✅ Battery published!');
      } catch (e) {
        console.log('⚠️  Could not auto-publish:', e.message);
        console.log('   → Go to Strapi admin and publish manually');
      }
    }
  } catch (e) {
    console.error('❌ Failed to create battery:', e.message);
  }

  // Also publish brand
  if (brandDocId) {
    console.log('📢 Publishing brand...');
    try {
      await apiCall(token, 'POST', `/content-manager/collection-types/api::brand.brand/${brandDocId}/actions/publish`);
      console.log('✅ Brand published!');
    } catch (e) {
      console.log('⚠️  Brand publish:', e.message);
    }
  }

  // Set public API permissions
  console.log('🔓 Setting public API permissions...');
  try {
    const roles = await apiCall(token, 'GET', '/admin/roles');
    const publicRole = (roles.data || []).find(r => r.code === 'strapi-super-admin' || r.type === 'public');
    
    // Get users-permissions roles
    const upRoles = await apiCall(token, 'GET', '/users-permissions/roles');
    const upPublic = (upRoles.roles || []).find(r => r.type === 'public');
    
    if (upPublic) {
      // Update public role permissions
      const roleDetail = await apiCall(token, 'GET', `/users-permissions/roles/${upPublic.id}`);
      const perms = roleDetail.role?.permissions || {};
      
      // Enable battery and brand find/findOne
      if (perms['api::battery']) {
        if (perms['api::battery'].controllers?.battery) {
          perms['api::battery'].controllers.battery.find = { enabled: true };
          perms['api::battery'].controllers.battery.findOne = { enabled: true };
        }
      }
      if (perms['api::brand']) {
        if (perms['api::brand'].controllers?.brand) {
          perms['api::brand'].controllers.brand.find = { enabled: true };
          perms['api::brand'].controllers.brand.findOne = { enabled: true };
        }
      }
      
      await apiCall(token, 'PUT', `/users-permissions/roles/${upPublic.id}`, {
        ...roleDetail.role,
        permissions: perms
      });
      console.log('✅ Public API permissions set');
    }
  } catch (e) {
    console.log('⚠️  Permissions:', e.message);
    console.log('   → Set permissions manually in admin: Settings > Roles > Public');
  }

  console.log('\n🎉 Done! Visit http://localhost:3000/batteries/tesla-powerwall-3');
}

main().catch(console.error);
