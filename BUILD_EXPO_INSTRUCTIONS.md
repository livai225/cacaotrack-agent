# 🚀 Instructions pour Build Expo - CacaoTrack Mobile

## ✅ Vérifications Effectuées

### Fichiers Synchronisés
- ✅ StepIndicator.tsx copié
- ✅ BottomTabNavigator.tsx copié  
- ✅ RootNavigator.tsx mis à jour
- ✅ Tous les écrans copiés
- ✅ package.json mis à jour avec dépendances

### Dépendances Ajoutées
- ✅ @react-navigation/bottom-tabs
- ✅ react-native-vector-icons

## 📋 Étapes pour Build

### 1. Installer les Dépendances

```powershell
cd CacaoTrackMobile
npm install
npx expo install react-native-vector-icons @react-navigation/bottom-tabs
```

### 2. Vérifier la Configuration

```powershell
npx expo-doctor
```

### 3. Tester en Mode Développement

```powershell
# Démarrer Expo
npx expo start

# Options :
# - Appuyer sur 'a' pour Android
# - Appuyer sur 'i' pour iOS
# - Scanner le QR code avec Expo Go sur votre téléphone
```

### 4. Build avec EAS (Recommandé)

#### Prérequis
```powershell
# Installer EAS CLI globalement
npm install -g eas-cli

# Se connecter à Expo
eas login
```

#### Build Android APK (Preview)
```powershell
eas build --platform android --profile preview
```

#### Build Android AAB (Production - Play Store)
```powershell
eas build --platform android --profile production
```

#### Build iOS (Preview)
```powershell
eas build --platform ios --profile preview
```

### 5. Build Local (Alternative)

```powershell
# Android
npx expo run:android

# iOS (sur Mac uniquement)
npx expo run:ios
```

## 🔍 Vérifications Avant Build

### Checklist
- [ ] Tous les fichiers copiés dans CacaoTrackMobile
- [ ] `npm install` exécuté sans erreur
- [ ] `npx expo-doctor` passe sans erreur critique
- [ ] `npx expo start` fonctionne
- [ ] Les écrans s'affichent correctement
- [ ] La navigation par onglets fonctionne
- [ ] Les formulaires multi-étapes fonctionnent

## 🐛 Problèmes Courants

### Erreur : react-native-vector-icons
```powershell
# Solution
npx expo install react-native-vector-icons
# Puis pour iOS, ajouter dans app.json :
# "ios": { "infoPlist": { "UIAppFonts": ["MaterialCommunityIcons.ttf"] } }
```

### Erreur : @react-navigation/bottom-tabs
```powershell
# Solution
npm install @react-navigation/bottom-tabs
```

### Erreur : Module not found
```powershell
# Nettoyer et réinstaller
rm -rf node_modules
npm install
npx expo start --clear
```

## 📱 Test sur Appareil

### Avec Expo Go
1. Installer Expo Go sur votre téléphone
2. Lancer `npx expo start`
3. Scanner le QR code
4. L'application se charge automatiquement

### Avec Build EAS
1. Exécuter `eas build --platform android --profile preview`
2. Télécharger l'APK depuis le dashboard Expo
3. Installer sur votre appareil Android

## ✅ Résultat Attendu

Après le build, vous devriez avoir :
- ✅ Application avec navigation par onglets en bas
- ✅ Tableau de bord avec statistiques
- ✅ Formulaires en plusieurs étapes
- ✅ Design moderne avec couleurs marron/orange

