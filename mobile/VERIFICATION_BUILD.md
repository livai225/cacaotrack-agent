# 🔍 Vérification et Build Mobile

## ✅ Vérifications Effectuées

### 1. Structure du Projet
- ✅ `App.tsx` existe et est correctement configuré
- ✅ `index.js` créé pour l'enregistrement de l'app
- ✅ `app.json` créé avec le nom de l'application
- ✅ Navigation configurée avec BottomTabNavigator
- ✅ Tous les écrans sont présents

### 2. Composants
- ✅ StepIndicator créé et fonctionnel
- ✅ Tous les formulaires refactorisés en plusieurs étapes
- ✅ Imports corrects

### 3. Navigation
- ✅ RootNavigator avec MainTabs
- ✅ BottomTabNavigator avec 4 onglets
- ✅ Stack Navigator pour les écrans modaux

## 🚀 Commandes de Build

### Pour React Native (CLI)
```bash
cd mobile
npm install
npm start
# Dans un autre terminal
npm run android  # Pour Android
npm run ios      # Pour iOS
```

### Pour Expo (si configuré)
```bash
# À la racine du projet
npx expo start
# Ou pour un build
npx expo build:android
npx expo build:ios
```

### Pour EAS Build (Expo Application Services)
```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Configurer le projet
eas build:configure

# Lancer un build
eas build --platform android
eas build --platform ios
```

## 📱 Tests à Effectuer

1. **Navigation**
   - [ ] Login fonctionne
   - [ ] Navigation vers MainTabs après login
   - [ ] Onglets en bas fonctionnent
   - [ ] Navigation vers les formulaires depuis les onglets

2. **Formulaires Multi-étapes**
   - [ ] ProducteurScreen : 4 étapes
   - [ ] ParcelleScreen : 3 étapes
   - [ ] CollecteScreen : 3 étapes
   - [ ] OrganisationScreen : 3 étapes
   - [ ] Validation par étape
   - [ ] Navigation Précédent/Suivant

3. **Fonctionnalités**
   - [ ] Chargement des données depuis l'API
   - [ ] Filtrage en cascade (org → section → village)
   - [ ] Prise de photo
   - [ ] Signature
   - [ ] Cartographie GPS

## ⚠️ Points d'Attention

1. **API Configuration**
   - Vérifier `mobile/src/config/api.ts`
   - URL de production : `http://82.208.22.230/api`
   - URL de développement : `http://10.0.2.2:3000/api` (émulateur Android)

2. **Permissions Android**
   - CAMERA
   - ACCESS_FINE_LOCATION
   - READ_EXTERNAL_STORAGE
   - WRITE_EXTERNAL_STORAGE

3. **Dépendances**
   - `react-native-vector-icons` nécessite une configuration native
   - `react-native-image-picker` nécessite des permissions
   - `react-native-maps` nécessite une clé API

## 🐛 Résolution de Problèmes

### Erreur "Unable to resolve module"
```bash
cd mobile
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

### Erreur Expo
```bash
npx expo install --fix
```

