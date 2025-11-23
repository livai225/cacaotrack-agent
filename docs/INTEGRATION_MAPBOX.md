# Intégration Mapbox - Documentation Complète

## Vue d'ensemble

L'application utilise **Mapbox GL JS** via **react-map-gl** pour afficher des cartes interactives permettant :
- 📍 Sélectionner des coordonnées GPS en cliquant sur une carte
- 🗺️ Visualiser plusieurs points (organisations, producteurs, parcelles)
- 🎨 Différencier les entités par couleur selon le type ou le produit
- 📊 Tracer le parcours des enquêtes
- 🌍 Afficher une carte avec les différents produits (cacao, tomate, hévéa, etc.)

## Dépendances installées

```bash
npm install react-map-gl mapbox-gl @types/mapbox-gl
```

### Packages

- **react-map-gl** : Wrapper React pour Mapbox GL JS
- **mapbox-gl** : Bibliothèque Mapbox GL JS
- **@types/mapbox-gl** : Types TypeScript pour Mapbox

## Configuration du Token Mapbox

### 1. Créer un compte Mapbox (GRATUIT)

1. Visitez https://www.mapbox.com/
2. Cliquez sur "Sign up" (Inscription gratuite)
3. Créez votre compte

### 2. Obtenir votre Token d'accès

1. Connectez-vous à https://account.mapbox.com/
2. Allez dans **Access tokens**
3. Copiez votre **Default public token**

Le token ressemble à : `pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVy...`

### 3. Configurer le Token dans l'application

#### Option 1 : Variable d'environnement (RECOMMANDÉ)

Créez un fichier `.env` à la racine du projet :

```env
VITE_MAPBOX_TOKEN=votre_token_ici
```

Puis dans les composants :

```typescript
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
```

#### Option 2 : Constante (pour développement)

Dans `MapPicker.tsx` et `MapView.tsx`, remplacez le token :

```typescript
const MAPBOX_TOKEN = 'votre_token_ici';
```

⚠️ **IMPORTANT** : Ne commitez JAMAIS votre token dans Git en production !

### 4. Ajouter .env au .gitignore

```
# .gitignore
.env
.env.local
```

## Composants disponibles

### 1. MapPicker

Permet à l'utilisateur de sélectionner des coordonnées GPS en cliquant sur une carte.

**Emplacement** : `src/components/forms/MapPicker.tsx`

**Utilisation** :

```tsx
import MapPicker from '@/components/forms/MapPicker';

<MapPicker
  latitude={latitude}
  longitude={longitude}
  onChange={(coords) => {
    setValue('latitude', coords.latitude);
    setValue('longitude', coords.longitude);
  }}
  required={false}
/>
```

**Fonctionnalités** :
- ✅ Clic sur la carte pour placer un marqueur
- ✅ Bouton de géolocalisation automatique
- ✅ Contrôles de navigation (zoom, rotation)
- ✅ Affichage des coordonnées en temps réel
- ✅ Marqueur visuel avec icône MapPin

### 2. GPSCapture (Amélioré)

Composant amélioré avec deux onglets : GPS automatique et sélection sur carte.

**Emplacement** : `src/components/forms/GPSCapture.tsx`

**Utilisation** :

```tsx
import GPSCapture from '@/components/forms/GPSCapture';

<GPSCapture
  onChange={(coords) => {
    setValue('latitude', coords.latitude);
    setValue('longitude', coords.longitude);
  }}
  latitude={watch('latitude')}
  longitude={watch('longitude')}
  required={false}
/>
```

**Onglets** :
1. **GPS Auto** : Géolocalisation automatique du navigateur
2. **Carte** : Sélection manuelle sur carte interactive

### 3. MapView

Affiche plusieurs points sur une carte avec légende et filtres.

**Emplacement** : `src/components/maps/MapView.tsx`

**Utilisation** :

```tsx
import MapView from '@/components/maps/MapView';

const points = [
  {
    id: '1',
    latitude: 5.3600,
    longitude: -4.0083,
    type: 'organisation',
    nom: 'SCOOP-CA Divo',
    details: 'Coopérative - Divo',
    produit: 'cacao',
  },
  // ... autres points
];

<MapView 
  points={points} 
  height="600px" 
  showLegend={true} 
/>
```

**Types de points supportés** :
- `organisation` 🏢 (Bleu)
- `producteur` 👤 (Vert)
- `parcelle` 🌿 (Orange)
- `village` 🏘️ (Violet)

**Types de produits** :
- `cacao` 🍫 (Marron)
- `tomate` 🍅 (Rouge)
- `hevea` 🌳 (Vert foncé)
- `autre` ⚙️ (Gris)

## Page de Visualisation

### CarteSuivi

Page complète de visualisation des données géographiques.

**Route** : `/carte`

**Fonctionnalités** :
- 📍 Affichage de toutes les organisations avec GPS
- 🔍 Filtres par type d'entité
- 🎨 Filtres par produit
- 📊 Statistiques en temps réel
- 🗺️ Carte interactive avec légende

## Architecture des données

### Interface MapPoint

```typescript
interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  type: 'organisation' | 'producteur' | 'parcelle' | 'village';
  nom: string;
  details?: string;
  produit?: 'cacao' | 'tomate' | 'hevea' | 'autre';
}
```

## Styles de carte disponibles

Mapbox propose plusieurs styles de carte :

```typescript
// Rue (défaut)
mapStyle="mapbox://styles/mapbox/streets-v12"

// Satellite
mapStyle="mapbox://styles/mapbox/satellite-v9"

// Satellite avec rues
mapStyle="mapbox://styles/mapbox/satellite-streets-v12"

// Sombre
mapStyle="mapbox://styles/mapbox/dark-v11"

// Clair
mapStyle="mapbox://styles/mapbox/light-v11"

// Extérieur
mapStyle="mapbox://styles/mapbox/outdoors-v12"
```

## Personnalisation

### Changer le centre par défaut

Dans `MapPicker.tsx` et `MapView.tsx` :

```typescript
const DEFAULT_CENTER = {
  latitude: 5.3600, // Votre latitude
  longitude: -4.0083, // Votre longitude
  zoom: 6
};
```

### Ajouter des couleurs personnalisées

Dans `MapView.tsx` :

```typescript
const PRODUCT_COLORS = {
  cacao: '#7c2d12',
  tomate: '#dc2626',
  hevea: '#15803d',
  ananas: '#f59e0b', // Nouvelle couleur
  autre: '#6b7280',
};
```

## Fonctionnalités avancées

### 1. Tracer un parcours

```tsx
import { Source, Layer } from 'react-map-gl';

const parcours = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [-4.0083, 5.3600],
      [-4.1083, 5.4600],
      // ... autres points
    ]
  }
};

<Source type="geojson" data={parcours}>
  <Layer
    type="line"
    paint={{
      'line-color': '#3b82f6',
      'line-width': 3
    }}
  />
</Source>
```

### 2. Zones (Polygones)

```tsx
const zone = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [-4.0083, 5.3600],
      [-4.1083, 5.3600],
      [-4.1083, 5.4600],
      [-4.0083, 5.4600],
      [-4.0083, 5.3600]
    ]]
  }
};

<Source type="geojson" data={zone}>
  <Layer
    type="fill"
    paint={{
      'fill-color': '#3b82f6',
      'fill-opacity': 0.2
    }}
  />
</Source>
```

### 3. Clustering de points

```tsx
<Source
  type="geojson"
  data={geojsonData}
  cluster={true}
  clusterMaxZoom={14}
  clusterRadius={50}
>
  <Layer
    type="circle"
    paint={{
      'circle-color': '#3b82f6',
      'circle-radius': 20
    }}
  />
</Source>
```

## Limites et Quotas

### Plan Gratuit Mapbox

- ✅ 50,000 chargements de carte par mois
- ✅ Toutes les fonctionnalités de base
- ✅ Support illimité des utilisateurs

### Dépassement

Au-delà de 50,000 chargements : ~$5 pour 1,000 chargements supplémentaires.

## Performance

### Optimisation

1. **Limiter les points** : Afficher max 1000 points à la fois
2. **Clustering** : Regrouper les points proches
3. **Lazy loading** : Charger la carte uniquement quand nécessaire
4. **Cache des tuiles** : Mapbox met en cache automatiquement

### Bundle Size

- `mapbox-gl` : ~500 KB (gzipped)
- `react-map-gl` : ~50 KB (gzipped)

## Compatibilité

| Navigateur | Version | Support |
|-----------|---------|---------|
| Chrome | 65+ | ✅ Full |
| Firefox | 60+ | ✅ Full |
| Safari | 12+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Mobile | iOS 12+, Android 6+ | ✅ Full |

## Dépannage

### La carte ne s'affiche pas

1. ✅ Vérifier le token Mapbox
2. ✅ Vérifier la console pour les erreurs
3. ✅ Vérifier que les dépendances sont installées
4. ✅ Vérifier la connexion internet

### Marqueurs ne s'affichent pas

```tsx
// Vérifier que latitude et longitude sont définis
{latitude && longitude && (
  <Marker latitude={latitude} longitude={longitude}>
    ...
  </Marker>
)}
```

### Erreur de Token

```
Error: A valid Mapbox access token is required
```

→ Configurez correctement votre token Mapbox

## Alternative : Radar.com

Si vous préférez utiliser Radar.com :

```bash
npm install radar-sdk-js
```

**Avantages Radar** :
- API plus simple
- Meilleure géolocalisation
- Suivi en temps réel

**Inconvénient** :
- Moins de personnalisation visuelle que Mapbox

## Exemples de cas d'usage

### 1. Tracer un parcours d'enquête

```typescript
const enquetes = [
  { latitude: 5.36, longitude: -4.00, date: '2024-01-15' },
  { latitude: 5.40, longitude: -4.10, date: '2024-01-16' },
  // ...
];

// Créer une ligne entre les points
const lineString = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: enquetes.map(e => [e.longitude, e.latitude])
  }
};
```

### 2. Carte par produit

```typescript
const pointsCacao = points.filter(p => p.produit === 'cacao');
const pointsTomate = points.filter(p => p.produit === 'tomate');

// Afficher avec des couleurs différentes
```

### 3. Carte de chaleur (Heatmap)

```tsx
<Source type="geojson" data={points}>
  <Layer
    type="heatmap"
    paint={{
      'heatmap-weight': 1,
      'heatmap-intensity': 1,
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0, 0, 255, 0)',
        0.5, 'rgb(255, 255, 0)',
        1, 'rgb(255, 0, 0)'
      ]
    }}
  />
</Source>
```

## Ressources

- 📚 [Documentation Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- 📚 [Documentation react-map-gl](https://visgl.github.io/react-map-gl/)
- 🎨 [Style Mapbox Studio](https://studio.mapbox.com/)
- 💡 [Exemples react-map-gl](https://visgl.github.io/react-map-gl/examples)

## Support

Pour toute question sur l'intégration Mapbox :
1. Vérifier la documentation officielle
2. Consulter les exemples fournis
3. Tester avec le token de démo fourni
4. Contacter le support Mapbox si nécessaire
