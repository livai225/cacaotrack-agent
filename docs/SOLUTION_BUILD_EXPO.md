# 🔧 Solution Build Expo - CacaoTrack

**Date** : 17 Décembre 2024  
**Problème** : Conflit entre projet Vite et Expo  
**Statut** : ✅ Solution Identifiée

---

## 🐛 Problème Principal

Le projet actuel est un **projet Vite/React** (dashboard web) et nous essayons de le convertir en **projet Expo** pour générer un APK. Cela crée des conflits de dépendances.

---

## ✅ Solutions Possibles

### Option 1 : Utiliser le Dossier Mobile Existant

Le projet a déjà un dossier `mobile/` avec une app React Native. Utilisons celui-ci :

```bash
# Aller dans le dossier mobile
cd mobile

# Vérifier la configuration
cat package.json

# Si c'est React Native CLI, utiliser :
npx react-native build-android --mode=release
```

### Option 2 : Créer un Projet Expo Séparé

```bash
# Créer un nouveau projet Expo
npx create-expo-app CacaoTrackMobile

# Copier les écrans depuis mobile/src/screens/
# Adapter la configuration
```

### Option 3 : Utiliser Expo Application Services (EAS)

Créer une configuration minimale pour EAS Build :

```json
// app.json minimal
{
  "expo": {
    "name": "CacaoTrack Agent",
    "slug": "cacaotrack-agent-simple",
    "version": "1.0.0",
    "platforms": ["android"],
    "android": {
      "package": "com.cacaotrack.agent"
    }
  }
}
```

---

## 🚀 Recommandation : Utiliser le Dossier Mobile

Le plus simple est d'utiliser le dossier `mobile/` existant qui contient déjà l'application React Native complète.

### Étapes :

1. **Aller dans mobile/**
   ```bash
   cd mobile
   ```

2. **Vérifier la configuration**
   ```bash
   cat package.json
   ls -la src/
   ```

3. **Build avec React Native CLI**
   ```bash
   # Installer les dépendances
   npm install
   
   # Build APK
   cd android
   ./gradlew assembleRelease
   ```

4. **Récupérer l'APK**
   ```bash
   # L'APK sera dans :
   # mobile/android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 📱 Alternative : Build Web vers Mobile

Si vous voulez vraiment utiliser le dashboard web sur mobile :

### Option A : PWA (Progressive Web App)
```bash
# Build du dashboard en PWA
npm run build

# Configurer comme PWA installable
# Ajouter manifest.json et service worker
```

### Option B : Capacitor
```bash
# Installer Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Initialiser
npx cap init

# Ajouter Android
npx cap add android

# Build
npm run build
npx cap sync
npx cap open android
```

---

## 🎯 Action Recommandée

**Utiliser le dossier mobile existant** car il contient déjà :
- ✅ 10 écrans fonctionnels
- ✅ Configuration React Native
- ✅ Services API
- ✅ Navigation
- ✅ Authentification

### Commandes à exécuter :

```bash
# 1. Aller dans mobile
cd mobile

# 2. Installer dépendances
npm install

# 3. Vérifier la configuration Android
cd android
cat local.properties

# 4. Build APK
./gradlew assembleRelease

# 5. Récupérer APK
ls -la app/build/outputs/apk/release/
```

---

## 📊 Comparaison des Options

| Option | Complexité | Temps | Résultat |
|--------|------------|-------|----------|
| **Mobile/ existant** | ⭐ Faible | 10 min | APK natif |
| Expo nouveau | ⭐⭐ Moyen | 30 min | APK Expo |
| PWA | ⭐⭐ Moyen | 20 min | Web app |
| Capacitor | ⭐⭐⭐ Élevé | 60 min | APK hybride |

---

## ✅ Prochaine Étape

**Essayer le build depuis le dossier mobile/** :

```bash
cd mobile
npm install
cd android
./gradlew assembleRelease
```

Si cela ne fonctionne pas, nous pourrons créer un projet Expo séparé avec les écrans existants.

---

**Recommandation : Commencer par le dossier mobile existant ! 🚀**