# 🚀 Commandes de Build Mobile

## ✅ Vérification Rapide

```powershell
# Exécuter le script de vérification
.\test-mobile.ps1
```

## 📦 Installation des Dépendances

```bash
cd mobile
npm install
```

## 🧪 Tests Locaux

### 1. Démarrer Metro Bundler
```bash
npm start
```

### 2. Build Android (nécessite Android Studio)
```bash
npm run android
```

### 3. Build iOS (nécessite Xcode, Mac uniquement)
```bash
npm run ios
```

## 📱 Build avec Expo (Optionnel)

Si vous voulez utiliser Expo au lieu de React Native CLI :

### Installation Expo CLI
```bash
npm install -g expo-cli
# Ou
npm install -g @expo/cli
```

### Démarrer avec Expo
```bash
npx expo start
```

### Build avec EAS (Expo Application Services)
```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Configurer le projet
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build Android AAB (pour Play Store)
eas build --platform android --profile production

# Build iOS (nécessite compte développeur Apple)
eas build --platform ios --profile production
```

## 🔧 Configuration Requise

### Pour React Native CLI
- Node.js >= 18
- npm ou yarn
- Android Studio (pour Android)
- Xcode (pour iOS, Mac uniquement)
- Java JDK 17+ (pour Android)

### Pour Expo
- Node.js >= 18
- npm ou yarn
- Expo CLI ou EAS CLI
- Compte Expo (gratuit)

## 📝 Notes Importantes

1. **Le projet actuel utilise React Native CLI**, pas Expo directement
2. Pour utiliser Expo, il faudrait migrer le projet ou créer un nouveau projet Expo
3. Les fichiers `app-expo.json` et `package-expo.json` sont des exemples pour une migration future

## 🐛 Résolution de Problèmes

### Erreur "Unable to resolve module"
```bash
npm install
npx react-native start --reset-cache
```

### Erreur de build Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Erreur Metro Bundler
```bash
npm start --reset-cache
```

