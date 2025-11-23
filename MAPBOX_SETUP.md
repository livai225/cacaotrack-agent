# 🗺️ Configuration Mapbox - Guide Rapide

## ✅ Ce qui a été fait

1. **Installation des dépendances** ✅
   - `react-map-gl` (wrapper React pour Mapbox)
   - `mapbox-gl` (bibliothèque Mapbox)
   - `@types/mapbox-gl` (types TypeScript)

2. **Composants créés** ✅
   - `MapPicker.tsx` - Sélection GPS sur carte
   - `MapView.tsx` - Visualisation de plusieurs points
   - `GPSCapture.tsx` - Amélioré avec onglets (GPS auto + Carte)

3. **Page créée** ✅
   - `CarteSuivi.tsx` - Visualisation complète avec filtres

4. **Route ajoutée** ✅
   - `/carte` - Accessible depuis le menu

## 🔧 Configuration requise

### Étape 1 : Obtenir un Token Mapbox (GRATUIT)

1. Créez un compte sur https://www.mapbox.com/ (gratuit)
2. Connectez-vous à https://account.mapbox.com/
3. Copiez votre **Default public token**

### Étape 2 : Configurer le Token

#### Option A : Variable d'environnement (RECOMMANDÉ)

Créez un fichier `.env` à la racine du projet :

```env
VITE_MAPBOX_TOKEN=votre_token_ici
```

Puis modifiez les fichiers suivants :

**`src/components/forms/MapPicker.tsx`** (ligne 19) :
```typescript
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94...';
```

**`src/components/maps/MapView.tsx`** (ligne 38) :
```typescript
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94...';
```

#### Option B : Remplacer directement (pour test rapide)

Dans les fichiers ci-dessus, remplacez simplement :
```typescript
const MAPBOX_TOKEN = 'votre_token_ici';
```

### Étape 3 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer :
npm run dev
```

## 🎯 Fonctionnalités disponibles

### 1. Formulaire Organisation
- Onglet **GPS Auto** : Géolocalisation automatique
- Onglet **Carte** : Sélection manuelle sur carte interactive

### 2. Page Carte de Suivi (`/carte`)
- Visualisation de toutes les organisations avec GPS
- Filtres par type (organisation, producteur, village, parcelle)
- Filtres par produit (cacao, tomate, hévéa, autre)
- Légende avec couleurs par type et produit
- Statistiques en temps réel

### 3. Couleurs par type
- 🔵 **Organisation** - Bleu
- 🟢 **Producteur** - Vert
- 🟠 **Parcelle** - Orange
- 🟣 **Village** - Violet

### 4. Couleurs par produit
- 🟤 **Cacao** - Marron
- 🔴 **Tomate** - Rouge
- 🌲 **Hévéa** - Vert foncé
- ⚙️ **Autre** - Gris

## 📍 Utilisation

### Dans le formulaire d'organisation

Le composant GPS a maintenant 2 onglets :
1. **GPS Auto** - Bouton pour géolocalisation automatique
2. **Carte** - Carte interactive pour sélectionner manuellement

### Sur la page `/carte`

1. Accédez à http://localhost:8080/carte
2. Utilisez les filtres pour affiner l'affichage
3. Cliquez sur un marqueur pour voir les détails
4. Naviguez avec les contrôles (zoom, rotation)

## 🚀 Test rapide

Pour tester immédiatement sans créer de compte Mapbox, un token de démo est déjà inclus dans les composants. Il permet de tester l'application mais a des limites d'utilisation.

## 📊 Quota Gratuit Mapbox

- ✅ 50,000 chargements de carte/mois
- ✅ Toutes les fonctionnalités
- ✅ Utilisateurs illimités
- ✅ Parfait pour cette application

## 🆘 Dépannage

### La carte ne s'affiche pas
1. Vérifiez que le serveur est redémarré
2. Vérifiez le token Mapbox dans la console
3. Vérifiez votre connexion internet

### Les marqueurs ne s'affichent pas
- Assurez-vous que les organisations ont des coordonnées GPS
- Créez une nouvelle organisation avec GPS pour tester

### Erreurs TypeScript
Si vous voyez des erreurs sur `react-map-gl`, redémarrez le serveur :
```bash
npm run dev
```

## 📚 Documentation complète

Consultez `docs/INTEGRATION_MAPBOX.md` pour :
- Fonctionnalités avancées (parcours, zones, heatmap)
- Personnalisation
- Exemples de code
- API complète

## ✨ Prochaines étapes

Une fois Mapbox configuré, vous pourrez :
- ✅ Sélectionner des coordonnées GPS sur carte
- ✅ Visualiser toutes vos organisations
- ✅ Filtrer par type et produit
- ✅ Tracer des parcours d'enquête
- ✅ Créer des cartes de chaleur (heatmap)
- ✅ Exporter des cartes en PDF
