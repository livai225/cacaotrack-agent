# 📱 CacaoTrack Mobile - Application Agent de Terrain

Application mobile React Native pour les agents de terrain CacaoTrack.

## 🎯 Fonctionnalités

### ✅ Gestion Complète Terrain
- **Organisations** : Création et gestion des coopératives
- **Sections** : Création des sections
- **Villages** : Enregistrement avec géolocalisation
- **Producteurs** : Fiche complète + photo
- **Parcelles** : Cartographie GPS avec calcul automatique de superficie
- **Collectes** : Workflow complet de la récolte au paiement

### ⚡ Fonctionnalités Avancées
- **Signature Tactile** : Le producteur signe directement sur l'écran
- **Mapping GPS** : Tracer le contour de la parcelle pour calculer la superficie
- **Mode Hors-Ligne** : Travail sans connexion internet
- **Synchronisation Automatique** : Dès que la connexion revient
- **Temps Réel** : Synchronisation instantanée avec le dashboard web

## 🚀 Installation

### Prérequis
- Node.js 18+
- React Native CLI
- Android Studio (pour Android)
- Xcode (pour iOS, Mac uniquement)

### Étapes

```bash
# 1. Aller dans le dossier mobile
cd mobile

# 2. Installer les dépendances
npm install

# 3. Pour Android
npx react-native run-android

# 4. Pour iOS (Mac uniquement)
cd ios && pod install && cd ..
npx react-native run-ios
```

## 📦 Build APK pour Production

```bash
# Android
cd android
./gradlew assembleRelease

# L'APK sera dans: android/app/build/outputs/apk/release/app-release.apk
```

## 🔧 Configuration

### API URL
Modifier dans `src/config/api.ts` :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://82.208.22.230/api', // URL de production
};
```

## 📱 Écrans

### 1. **Login**
- Connexion avec identifiants créés sur le dashboard web
- Validation des credentials

### 2. **Home**
- Menu principal
- Accès rapide aux fonctions
- Statut de synchronisation

### 3. **Organisation**
- Créer une nouvelle organisation
- Sélectionner une organisation existante

### 4. **Section**
- Créer une section
- Rattacher à une organisation

### 5. **Village**
- Créer un village
- Géolocalisation automatique
- Rattacher à une section

### 6. **Producteur**
- Formulaire complet
- Prise de photo
- Informations personnelles et familiales

### 7. **Parcelle**
- Informations de base
- **Cartographie GPS** :
  - Bouton "Démarrer le mapping"
  - Marcher autour de la parcelle
  - Bouton "Terminer le mapping"
  - Calcul automatique de la superficie

### 8. **Collecte**
- Workflow en étapes :
  1. Récolte
  2. Écabossage
  3. Fermentation
  4. Séchage
  5. Ensachage
  6. Manutention
  7. Paiement

### 9. **Signature**
- Zone de signature tactile
- Le producteur signe pour valider
- Capture et sauvegarde

## 🗺️ Mapping GPS - Fonctionnement

```typescript
// 1. Démarrer le mapping
startMapping() {
  // Active le GPS
  // Commence à enregistrer les points
}

// 2. Enregistrer les points
recordPoint() {
  points.push({
    latitude: currentLat,
    longitude: currentLng,
  });
}

// 3. Terminer et calculer
finishMapping() {
  // Calcule la superficie avec l'algorithme Shoelace
  const area = calculateArea(points);
  // Convertit en hectares
  const hectares = area / 10000;
}
```

## ✍️ Signature - Fonctionnement

```typescript
// Utilise react-native-signature-canvas
<SignatureCanvas
  onOK={(signature) => {
    // signature est en Base64
    saveSignature(signature);
  }}
/>
```

## 📡 Synchronisation

### Mode Hors-Ligne
```typescript
// Les données sont sauvegardées localement
await AsyncStorage.setItem('pending_sync', JSON.stringify(data));

// Quand la connexion revient
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    syncPendingData();
  }
});
```

### Temps Réel
```typescript
// Socket.IO pour les mises à jour instantanées
socket.on('operation:created', (data) => {
  // Mise à jour automatique
});
```

## 🔐 Authentification

Les agents sont créés sur le **dashboard web** avec :
- Username
- Password (hashé avec bcrypt)

L'agent se connecte avec ces identifiants sur l'app mobile.

## 📊 Structure du Projet

```
mobile/
├── src/
│   ├── config/           # Configuration (API URL)
│   ├── contexts/         # React Contexts (Auth, Sync)
│   ├── services/         # Services API
│   ├── screens/          # Écrans de l'app
│   ├── components/       # Composants réutilisables
│   ├── navigation/       # Navigation
│   └── utils/            # Utilitaires
├── android/              # Code Android natif
├── ios/                  # Code iOS natif
├── App.tsx               # Point d'entrée
└── package.json          # Dépendances
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests E2E
npm run test:e2e
```

## 📝 TODO

- [x] Initialiser tous les écrans de base (Login, Home, etc.)
- [ ] Implémenter le mapping GPS complet
- [ ] Implémenter la signature tactile
- [ ] Ajouter les tests
- [ ] Optimiser les performances
- [ ] Ajouter l'internationalisation (FR/EN)

## 🐛 Dépannage

### Erreur de connexion API
- Vérifier l'URL dans `src/config/api.ts`
- Vérifier que le serveur est accessible
- Pour l'émulateur Android, utiliser `10.0.2.2` au lieu de `localhost`

### GPS ne fonctionne pas
- Vérifier les permissions dans `AndroidManifest.xml`
- Activer la localisation sur l'appareil
- Pour l'émulateur, simuler la position GPS

### Synchronisation bloquée
- Vérifier la connexion internet
- Vider le cache : `AsyncStorage.clear()`
- Redémarrer l'application

## 📒 Journal des Modifications

### Correction Authentification (Juin 2024)

Suite à des erreurs d'authentification, les modifications suivantes ont été apportées :

- **Service API (`mobile/src/services/api.service.ts`)** :
  - Gestion des erreurs améliorée.
  - Normalisation de la réponse du backend (`{ success: true, agent, token }` → `{ agent, token }`).
  - Ajout de logs de débogage pour identifier les problèmes.

- **Contexte d'authentification (`mobile/src/contexts/AuthContext.tsx`)** :
  - Validation de la réponse avant de stocker les données.
  - Messages d'erreur plus clairs.

- **Écran de connexion (`mobile/src/screens/LoginScreen.tsx`)** :
  - Affichage des messages d'erreur amélioré.
  - Ajout de logs de débogage.

- **Configuration API (`mobile/src/config/api.ts`)** :
  - URL mise à jour pour utiliser le port `3000` directement : `http://82.208.22.230:3000/api`.
  - Si Nginx est utilisé comme proxy, l'URL peut être ramenée à `http://82.208.22.230/api`.

## 📞 Support

Pour toute question ou problème, contacter l'équipe de développement.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Juin 2024
