# 🔧 Correction du Support Expo

## ✅ Modifications Effectuées

1. **Ajout du package `expo`** dans `package.json`
   - Version: `~51.0.0`
   - Ajout de `expo-status-bar` pour la barre de statut

2. **Mise à jour de `app.json`**
   - Configuration Expo complète avec:
     - Nom et slug de l'application
     - Configuration iOS et Android
     - Splash screen
     - Plugins (location, image-picker)

3. **Mise à jour de `package.json`**
   - `main` changé vers `node_modules/expo/AppEntry.js`
   - Ajout de scripts Expo:
     - `expo:start` - Démarrer Expo
     - `expo:android` - Build Android avec Expo
     - `expo:ios` - Build iOS avec Expo
     - `expo:web` - Build Web avec Expo

4. **Création de `install-expo.ps1`**
   - Script PowerShell pour installer les dépendances avec support Expo

## 🚀 Installation

### Option 1: Script PowerShell (Recommandé)
```powershell
cd mobile
.\install-expo.ps1
```

### Option 2: Installation Manuelle
```bash
cd mobile
npm install --legacy-peer-deps
```

## 📱 Utilisation

### Démarrer avec Expo
```bash
cd mobile
npm run expo:start
# Ou
npx expo start
```

### Build Android avec Expo
```bash
npm run expo:android
# Ou
npx expo start --android
```

### Build iOS avec Expo
```bash
npm run expo:ios
# Ou
npx expo start --ios
```

## ⚠️ Notes Importantes

1. **Le projet supporte maintenant les deux modes:**
   - React Native CLI (scripts `start`, `android`, `ios`)
   - Expo (scripts `expo:start`, `expo:android`, `expo:ios`)

2. **Pour utiliser Expo, vous devez:**
   - Installer les dépendances avec `npm install --legacy-peer-deps`
   - Utiliser les scripts `expo:*` ou `npx expo start`

3. **Si vous voyez l'erreur "Unable to find expo":**
   - Exécutez `npm install --legacy-peer-deps` dans le dossier `mobile`
   - Vérifiez que `node_modules/expo` existe

## 🔍 Vérification

Après installation, vérifiez:
```bash
cd mobile
ls node_modules/expo  # Doit exister
npx expo --version    # Doit afficher la version
```

## ✅ État Actuel

- ✅ Package `expo` ajouté
- ✅ `app.json` configuré pour Expo
- ✅ Scripts Expo ajoutés
- ✅ Script d'installation créé
- ✅ Documentation mise à jour

**Le projet est maintenant prêt pour Expo ! 🎉**

