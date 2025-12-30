# 🚀 Lancer un Build avec Expo

## ⚡ Commandes Rapides

### 1. Vérifier que tout est prêt
```bash
cd mobile
.\test-mobile.ps1  # Windows PowerShell
# ou
bash test-build.sh  # Linux/Mac
```

### 2. Installer les dépendances
```bash
cd mobile
npm install
```

### 3. Lancer avec React Native CLI
```bash
# Démarrer Metro Bundler
npm start

# Dans un autre terminal - Build Android
npm run android

# Build iOS (Mac uniquement)
npm run ios
```

### 4. Lancer avec Expo (si configuré)
```bash
# À la racine du projet
npx expo start

# Pour un build
npx expo build:android
npx expo build:ios
```

### 5. Build avec EAS (Expo Application Services)
```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter (créer un compte sur expo.dev si nécessaire)
eas login

# Configurer le projet
eas build:configure

# Build Android APK (pour test)
eas build --platform android --profile preview

# Build Android AAB (pour Play Store)
eas build --platform android --profile production

# Build iOS (nécessite compte développeur Apple)
eas build --platform ios --profile production
```

## 📋 Checklist Avant Build

- [ ] Node.js >= 18 installé
- [ ] Dépendances installées (`npm install`)
- [ ] Configuration API vérifiée (`src/config/api.ts`)
- [ ] Permissions Android configurées (`app.json`)
- [ ] Tous les fichiers présents (vérifier avec `test-mobile.ps1`)

## 🎯 Build Recommandé

Pour un build rapide de test, utilisez **React Native CLI** :

```bash
cd mobile
npm install
npm start
# Dans un autre terminal
npm run android
```

Pour un build de production avec Expo, utilisez **EAS Build** :

```bash
eas build --platform android --profile production
```

