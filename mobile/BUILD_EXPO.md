# 🚀 Guide de Build avec Expo

## ⚠️ Note Importante

Le projet mobile actuel utilise **React Native CLI**, pas Expo. Pour utiliser Expo, il faudrait migrer le projet.

## 📋 Options de Build

### Option 1: React Native CLI (Actuel)

```bash
cd mobile

# Installer les dépendances
npm install

# Démarrer Metro Bundler
npm start

# Dans un autre terminal - Build Android
npm run android

# Build iOS (sur Mac uniquement)
npm run ios
```

### Option 2: Migration vers Expo

Si vous voulez utiliser Expo, voici les étapes :

1. **Installer Expo CLI**
```bash
npm install -g expo-cli
```

2. **Créer un nouveau projet Expo** (recommandé)
```bash
npx create-expo-app CacaoTrackMobile --template
```

3. **Ou migrer le projet existant**
   - Copier les fichiers `src/` dans le nouveau projet
   - Adapter les imports
   - Configurer `app.json`

### Option 3: EAS Build (Expo Application Services)

Si vous avez déjà un projet Expo configuré :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Configurer
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

## ✅ Vérifications Effectuées

- ✅ Tous les fichiers sont présents
- ✅ Navigation configurée
- ✅ Formulaires multi-étapes fonctionnels
- ✅ Pas d'erreurs de lint
- ✅ Imports corrects

## 🧪 Tests Recommandés

1. **Test de navigation**
   - Login → MainTabs
   - Navigation entre onglets
   - Ouverture des formulaires

2. **Test des formulaires**
   - ProducteurScreen (4 étapes)
   - ParcelleScreen (3 étapes)
   - CollecteScreen (3 étapes)
   - OrganisationScreen (3 étapes)

3. **Test des fonctionnalités**
   - Prise de photo
   - Signature
   - Cartographie GPS
   - Appels API

## 📱 Commandes Rapides

```bash
# Vérifier la configuration
cd mobile
npm install

# Démarrer en mode développement
npm start

# Build Android (nécessite Android Studio)
npm run android

# Build iOS (nécessite Xcode sur Mac)
npm run ios
```

## 🔧 Configuration Requise

- Node.js >= 18
- npm ou yarn
- Android Studio (pour Android)
- Xcode (pour iOS, Mac uniquement)
- Java JDK (pour Android)

