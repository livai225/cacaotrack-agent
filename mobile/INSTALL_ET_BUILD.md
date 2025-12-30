# 📱 Installation et Build Mobile

## ✅ Vérification Effectuée

- ✅ Node.js v20.10.0 installé
- ✅ npm 10.5.2 installé
- ✅ Expo CLI disponible (version 6.3.10)
- ✅ Tous les fichiers présents
- ✅ Navigation configurée correctement

## 🚀 Installation des Dépendances

### Option 1: Installation Standard
```bash
cd mobile
npm install
```

### Option 2: Si conflit de dépendances
```bash
cd mobile
npm install --legacy-peer-deps
```

## 🧪 Test Local

### Démarrer Metro Bundler
```bash
cd mobile
npm start
```

### Build Android (nécessite Android Studio)
```bash
npm run android
```

## 📱 Build avec Expo

### 1. Démarrer Expo
```bash
# À la racine du projet (où se trouve app.json)
npx expo start
```

### 2. Build avec EAS (Expo Application Services)

#### Installation EAS CLI
```bash
npm install -g eas-cli
```

#### Se connecter
```bash
eas login
# Créer un compte sur expo.dev si nécessaire
```

#### Configurer le projet
```bash
eas build:configure
```

#### Build Android APK (pour test)
```bash
eas build --platform android --profile preview
```

#### Build Android AAB (pour Play Store)
```bash
eas build --platform android --profile production
```

## ⚠️ Notes Importantes

1. **Le projet utilise React Native CLI** par défaut
2. Pour utiliser Expo, il faut être à la **racine du projet** (où se trouve `app.json`)
3. Les dépendances peuvent nécessiter `--legacy-peer-deps` à cause de conflits de versions

## 🔧 Résolution de Problèmes

### Erreur de dépendances
```bash
npm install --legacy-peer-deps
```

### Erreur Metro Bundler
```bash
npm start --reset-cache
```

### Erreur build Android
```bash
cd android
./gradlew clean
cd ..
npm run android
```

## ✅ État Actuel

- ✅ Navigation : Fonctionnelle avec MainTabs
- ✅ Formulaires : Tous en plusieurs étapes
- ✅ Composants : StepIndicator créé
- ✅ Configuration : app.json et index.js présents

**Le projet est prêt pour le build !**

