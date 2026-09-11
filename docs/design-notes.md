# Notes de design — BatteryAdvisor.be

## Recherche concurrentielle

Sites analysés pour les patterns UX :

- **ThuisbatterijGids.net** — Référence directe marché belge/néerlandais. Bon : compteur de shops, prix comparés. À améliorer : design daté, pas de verdicts clairs.
- **EnergySage** — Excellent : phrases "Bottom line", méthodologie transparente, recommandations personnalisées.
- **RTINGS** — Score circles conic-gradient, sous-scores détaillés, comparaison standardisée.
- **Solar.com** — Cartes scénarios d'usage ("for grid independence", "for bill savings"), guidage par besoin.
- **Clean Energy Reviews** — Tests techniques approfondis, comparaisons côte-à-côte avec données.
- **Energienerds.nl** — Marché NL, design moderne, bonne intégration de contenu.

## Décisions de design

### Pourquoi Direction 3 "Warm Expert"

1. **Pour les débutants** : Les cartes scénarios ("Réduire ma facture", "Stocker mon solaire") permettent une entrée par le besoin, pas par le produit.
2. **Info rapide** : Les phrases-verdict donnent l'essentiel en une ligne, sans jargon technique.
3. **Info approfondie** : Les onglets de fiche produit (Scores/Specs/Avis/Acheter) offrent la profondeur sans surcharger.
4. **Confiance** : Palette chaude et bloc méthodologie renforcent la crédibilité d'un guide indépendant.
5. **Conversion** : Le compteur de shops et les CTAs "Lire le test" / "Voir les prix" guident vers l'action.

### Palette de tokens

```css
--ground: #faf9f6      /* Pierre chaude */
--card: #ffffff         /* Cartes */
--primary: #4d7c0f      /* Olive-vert */
--primary-hover: #3f6b0d
--accent-blue: #1e40af  /* Badges techniques */
--accent-amber: #b45309 /* Badges coup de cœur */
--score-excellent: #16a34a
--score-good: #65a30d
--score-avg: #ca8a04
```

### Typographie

- **Display** : Fraunces (variable, opsz 9-144, wght 500-800) — caractère éditorial, chaleureux
- **Body** : Plus Jakarta Sans (400-700) — lisible, moderne, neutre
- Échelle : 13px (small) → 15px (body) → 17px (card title) → 20px (section) → 28px (hero)
