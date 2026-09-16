# Guide : Voir la page Powerwall 3 avec de vraies données

## Étapes rapides

### 1. Démarrer Strapi (backend)
```bash
cd backend
npm run develop
```
Attendre que Strapi affiche l'URL admin (http://localhost:1337/admin).

### 2. Lancer le seed script
```bash
# Depuis la racine du projet
node seed-powerwall3.mjs
```
Le script va :
- Attendre que Strapi soit prêt
- Créer la marque "Tesla" si elle n'existe pas
- Créer/mettre à jour la batterie "Tesla Powerwall 3" avec toutes les données de test

### 3. Publier l'entrée dans Strapi
> ⚠️ Important : Strapi v5 crée les entrées en mode "brouillon".
1. Aller sur http://localhost:1337/admin
2. Content Manager → Batteries → Tesla Powerwall 3
3. Cliquer **Publish**

### 4. Ajouter des images (optionnel)
Dans le Content Manager Strapi :
1. Ouvrir la fiche "Tesla Powerwall 3"
2. Champ **image** → Ajouter une photo principale du produit
3. Champ **gallery** → Ajouter des photos supplémentaires
4. Sauvegarder et publier

Sources d'images suggérées :
- tesla.com/powerwall (photo officielle du produit)
- Recherche Google Images "Tesla Powerwall 3" → filtrer par licence

### 5. Démarrer le frontend
```bash
cd frontend
npm run dev
```
Ouvrir http://localhost:3000/batteries/tesla-powerwall-3

### Données incluses dans le seed
- Specs complètes (13.5 kWh, 11500W, IP67, LFP, etc.)
- Scores (overall 8.7/10, design 8.5, app 9.0, etc.)
- Review complète en français (5 sections)
- 6 pros / 6 cons
- 6 FAQ
- 4 concurrents (Huawei, BYD, Enphase, Sigenergy)
- Verdict, idéal pour / pas pour, alternative recommandée
