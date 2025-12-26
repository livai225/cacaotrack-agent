# 📱 Guide Génération APK - CacaoTrack Mobile

**Date** : 17 Décembre 2024  
**Version App** : 1.0.0  
**Plateforme** : Android

---

## 🎯 Objectif

Générer l'APK de production de l'application mobile CacaoTrack pour installation sur les appareils Android des agents de terrain.

---

## 🔧 Prérequis

### 1. Environnement de Développement

**Obligatoire :**
- ✅ Node.js 18+ installé
- ✅ Java JDK 11 ou 17 installé
- ✅ Android Studio installé
- ✅ Android SDK configuré
- ✅ React Native CLI installé

**Vérifications :**
```bash
# Vérifier Node.js
node --version  # >= 18.0.0

# Vérifier Java
java -version   # JDK 11 ou 17

# Vérifier React Native
npx react-native --version

# Vérifier Android SDK
echo $ANDROID_HOME  # Doit pointer vers le SDK
```

### 2. Configuration Android

**Variables d'environnement :**
```bash
# Ajouter dans ~/.bashrc ou ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**SDK Components requis :**
- Android SDK Platform 34
- Android SDK Build-Tools 34.0.0
- Android SDK Platform-Tools
- Android SDK Tools

---

## 📦 Étape 1 : Préparation du Projet

### 1.1 Naviguer vers le projet mobile

```bash
cd cacaotrack-agent/mobile
```

### 1.2 Installer les dépendances

```bash
# Installer les dépendances npm
npm install

# Nettoyer le cache (optionnel)
npm start -- --reset-cache
```

### 1.3 Vérifier la configuration API

**Fichier** : `src/config/api.ts`

```typescript
export const API_CONFIG = {
  // IMPORTANT: En production, utiliser l'URL du serveur
  BASE_URL: 'http://82.208.22.230/api', // URL de production
  TIMEOUT: 30000,
};
```

**⚠️ Important** : Assurez-vous que `__DEV__` est `false` en production pour utiliser l'URL du serveur distant.

---

## 🔑 Étape 2 : Configuration de Signature

### 2.1 Générer une clé de signature

```bash
# Aller dans le dossier android/app
cd android/app

# Générer la clé (remplacer les valeurs)
keytool -genkeypair -v -storetype PKCS12 -keystore cacaotrack-release-key.keystore -alias cacaotrack-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Informations à fournir :
# - Mot de passe du keystore : [CHOISIR UN MOT DE PASSE FORT]
# - Nom et prénom : CacaoTrack
# - Unité organisationnelle : Mobile Team
# - Organisation : ASCO
# - Ville : Abidjan
# - État/Province : Abidjan
# - Code pays : CI
```

### 2.2 Configurer Gradle

**Fichier** : `android/gradle.properties`

Ajouter à la fin :
```properties
MYAPP_RELEASE_STORE_FILE=cacaotrack-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=cacaotrack-key-alias
MYAPP_RELEASE_STORE_PASSWORD=VOTRE_MOT_DE_PASSE_KEYSTORE
MYAPP_RELEASE_KEY_PASSWORD=VOTRE_MOT_DE_PASSE_KEYSTORE
```

**Fichier** : `android/app/build.gradle`

Ajouter dans la section `android` :
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 🏗️ Étape 3 : Génération de l'APK

### 3.1 Nettoyer le projet

```bash
# Depuis le dossier mobile/
cd android
./gradlew clean
cd ..
```

### 3.2 Générer l'APK de release

```bash
# Méthode 1 : Via React Native CLI
npx react-native build-android --mode=release

# Méthode 2 : Via Gradle directement
cd android
./gradlew assembleRelease
cd ..
```

### 3.3 Localiser l'APK généré

L'APK sera créé dans :
```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

---

## 📋 Étape 4 : Vérification et Test

### 4.1 Vérifier la taille de l'APK

```bash
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Taille attendue : ~25-30 MB
```

### 4.2 Installer l'APK sur un appareil de test

```bash
# Connecter un appareil Android via USB
# Activer le débogage USB sur l'appareil

# Installer l'APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

### 4.3 Tests de validation

**Tests obligatoires :**
- [ ] L'app se lance sans crash
- [ ] Écran de login s'affiche
- [ ] Connexion avec identifiants test fonctionne
- [ ] GPS fonctionne (demande permission)
- [ ] Caméra fonctionne (demande permission)
- [ ] Création d'une organisation
- [ ] Mapping GPS d'une parcelle
- [ ] Mode hors ligne (couper WiFi/données)
- [ ] Synchronisation (remettre connexion)

---

## 🚀 Étape 5 : Distribution

### 5.1 Renommer l'APK

```bash
# Renommer avec version et date
cp android/app/build/outputs/apk/release/app-release.apk ./CacaoTrack-Mobile-v1.0.0-$(date +%Y%m%d).apk
```

### 5.2 Créer un package de distribution

```bash
# Créer un dossier de distribution
mkdir -p dist/mobile

# Copier l'APK
cp CacaoTrack-Mobile-v1.0.0-*.apk dist/mobile/

# Créer un fichier d'informations
cat > dist/mobile/README.txt << EOF
CacaoTrack Mobile - Application Agent de Terrain
Version: 1.0.0
Date: $(date +%d/%m/%Y)
Plateforme: Android
Taille: $(ls -lh CacaoTrack-Mobile-v1.0.0-*.apk | awk '{print $5}')

Installation:
1. Activer "Sources inconnues" dans les paramètres Android
2. Transférer l'APK sur l'appareil
3. Ouvrir l'APK et installer
4. Lancer l'application CacaoTrack

Identifiants de test:
- Voir avec l'administrateur système

Support:
- Documentation: docs/APPLICATION_MOBILE_ETAT.md
- API: http://82.208.22.230/api
EOF
```

---

## 🔍 Dépannage

### Erreur : "SDK location not found"

**Solution :**
```bash
# Créer le fichier local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### Erreur : "Could not find tools.jar"

**Solution :**
```bash
# Vérifier la version Java
java -version

# Utiliser JDK 11 ou 17, pas JRE
export JAVA_HOME=/path/to/jdk-11
```

### Erreur : "Execution failed for task ':app:packageRelease'"

**Solution :**
```bash
# Nettoyer complètement
cd android
./gradlew clean
rm -rf build/
rm -rf app/build/
cd ..

# Régénérer
npx react-native build-android --mode=release
```

### APK trop volumineux (>50MB)

**Solutions :**
```bash
# 1. Activer ProGuard (dans android/app/build.gradle)
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}

# 2. Activer l'optimisation des ressources
android {
    buildTypes {
        release {
            shrinkResources true
            minifyEnabled true
        }
    }
}

# 3. Exclure les architectures non nécessaires
android {
    splits {
        abi {
            enable true
            reset()
            include "arm64-v8a", "armeabi-v7a"
        }
    }
}
```

---

## 📊 Informations Techniques

### Configuration APK

**Nom du package :** `com.cacaotrack.mobile`  
**Version Code :** 1  
**Version Name :** 1.0.0  
**Min SDK :** 21 (Android 5.0)  
**Target SDK :** 34 (Android 14)  

### Permissions incluses

```xml
<!-- GPS -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Internet -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Caméra -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Stockage -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Fonctionnalités incluses

- ✅ Authentification JWT
- ✅ 10 écrans fonctionnels
- ✅ Cartographie GPS avec calcul superficie
- ✅ Signature tactile
- ✅ Mode hors ligne avec synchronisation
- ✅ Prise de photos
- ✅ Géolocalisation
- ✅ Connexion API production

---

## 📱 Installation sur Appareils

### Pour les Agents de Terrain

**Étapes d'installation :**

1. **Préparer l'appareil**
   - Aller dans Paramètres → Sécurité
   - Activer "Sources inconnues" ou "Installer des apps inconnues"

2. **Transférer l'APK**
   - Via USB, Bluetooth, ou téléchargement
   - Placer dans le dossier Téléchargements

3. **Installer**
   - Ouvrir le gestionnaire de fichiers
   - Naviguer vers l'APK
   - Appuyer sur l'APK et suivre les instructions

4. **Premier lancement**
   - Accepter les permissions (GPS, Caméra, Stockage)
   - Se connecter avec les identifiants fournis
   - Tester les fonctionnalités de base

### Identifiants de Test

Les identifiants sont créés sur le dashboard web :
- URL : http://82.208.22.230
- Section : Agents → Nouveau Agent
- Définir username et mot de passe

---

## ✅ Checklist Finale

### Avant génération
- [ ] Configuration API pointant vers production
- [ ] Dépendances installées
- [ ] Clé de signature créée
- [ ] Gradle configuré

### Génération
- [ ] Projet nettoyé
- [ ] APK généré sans erreur
- [ ] Taille APK acceptable (<50MB)
- [ ] APK signé correctement

### Tests
- [ ] Installation sur appareil test
- [ ] Lancement sans crash
- [ ] Login fonctionnel
- [ ] GPS fonctionnel
- [ ] Caméra fonctionnelle
- [ ] Mode hors ligne testé
- [ ] Synchronisation testée

### Distribution
- [ ] APK renommé avec version
- [ ] Documentation créée
- [ ] Package de distribution prêt

---

## 📞 Support

En cas de problème :

1. **Vérifier les logs :**
   ```bash
   npx react-native log-android
   ```

2. **Nettoyer complètement :**
   ```bash
   cd android && ./gradlew clean && cd ..
   rm -rf node_modules
   npm install
   ```

3. **Consulter la documentation :**
   - `docs/APPLICATION_MOBILE_ETAT.md`
   - `mobile/README.md`

---

**Bon build ! 🚀**

**Version** : 1.0.0  
**Date** : 17 Décembre 2024  
**Statut** : Prêt pour génération