# 🔨 Build APK Local - Instructions Complètes

## ✅ Avantages du Build Local

- ✅ **Gratuit** - Pas de quota EAS
- ✅ **Immédiat** - Pas d'attente
- ✅ **Contrôle total** - Vous gérez tout
- ✅ **Pas de limite** - Autant de builds que vous voulez

## 📋 Prérequis

### 1. Android Studio Installé

Téléchargez et installez Android Studio :
- **Lien** : https://developer.android.com/studio
- **Taille** : ~1 GB
- **Temps d'installation** : ~15-20 minutes

### 2. Variables d'Environnement Configurées

Après l'installation d'Android Studio, configurez :

**Windows** :
1. Ouvrez "Variables d'environnement"
2. Ajoutez `ANDROID_HOME` :
   ```
   C:\Users\VotreNom\AppData\Local\Android\Sdk
   ```
3. Ajoutez au `PATH` :
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

**Vérification** :
```powershell
echo $env:ANDROID_HOME
adb --version
```

### 3. Java JDK Installé

Android Studio inclut généralement JDK, mais vérifiez :
```powershell
java -version
```

## 🚀 Méthode 1 : Script Automatique (Recommandé)

```powershell
cd mobile
.\build-local.ps1
```

Le script va :
1. ✅ Vérifier la configuration
2. ✅ Préparer le projet Android (`expo prebuild`)
3. ✅ Builder l'APK avec Gradle
4. ✅ Vous donner l'emplacement de l'APK

## 🛠️ Méthode 2 : Commandes Manuelles

### Étape 1 : Préparer le Projet Android

```powershell
cd mobile

# Supprimer l'ancien dossier android si existe
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue

# Préparer le projet Android
npx expo prebuild --platform android --clean
```

**Durée** : ~2-3 minutes

### Étape 2 : Builder l'APK

```powershell
cd android

# Builder l'APK Release
.\gradlew.bat assembleRelease
```

**Durée** : ~5-10 minutes (première fois), ~2-3 minutes (suivantes)

### Étape 3 : Trouver l'APK

L'APK sera dans :
```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

## 📱 Installer l'APK

### Option A : Via USB (ADB)

```powershell
# Connecter votre appareil Android via USB
# Activer le débogage USB sur l'appareil

# Installer l'APK
adb install mobile\android\app\build\outputs\apk\release\app-release.apk
```

### Option B : Copie Manuelle

1. Copier l'APK sur votre appareil Android
2. Ouvrir le fichier sur l'appareil
3. Autoriser l'installation depuis "Sources inconnues"
4. Installer

### Option C : Partage

1. Envoyer l'APK par email/WhatsApp/Drive
2. Télécharger sur l'appareil
3. Installer

## 🔧 Résolution de Problèmes

### Erreur : "ANDROID_HOME not set"

**Solution** :
1. Trouvez l'emplacement du SDK Android (généralement dans `AppData\Local\Android\Sdk`)
2. Configurez la variable d'environnement `ANDROID_HOME`
3. Redémarrez PowerShell

### Erreur : "Gradle build failed"

**Solutions** :
```powershell
cd mobile/android

# Nettoyer le build
.\gradlew.bat clean

# Réessayer
.\gradlew.bat assembleRelease
```

### Erreur : "SDK not found"

**Solution** :
1. Ouvrez Android Studio
2. Allez dans **Tools → SDK Manager**
3. Installez les SDK requis (API 33 ou supérieur)
4. Vérifiez que `ANDROID_HOME` pointe vers le bon dossier

### Erreur : "Java not found"

**Solution** :
1. Installez Java JDK 17 ou supérieur
2. Configurez `JAVA_HOME` dans les variables d'environnement
3. Redémarrez PowerShell

## 📊 Comparaison : Build Local vs EAS Build

| Critère | Build Local | EAS Build |
|---------|------------|-----------|
| **Coût** | ✅ Gratuit | ⚠️ Quota limité (gratuit) |
| **Vitesse** | ⚠️ 5-10 min | ✅ 10-15 min (en ligne) |
| **Complexité** | ⚠️ Nécessite Android Studio | ✅ Simple |
| **Espace disque** | ⚠️ ~5-10 GB | ✅ Minimal |
| **Contrôle** | ✅ Total | ⚠️ Limité |
| **Limite** | ✅ Aucune | ⚠️ Quota mensuel |

## ✅ Checklist

- [ ] Android Studio installé
- [ ] `ANDROID_HOME` configuré
- [ ] Java JDK installé
- [ ] Variables d'environnement configurées
- [ ] Projet préparé (`expo prebuild`)
- [ ] APK généré (`gradlew assembleRelease`)
- [ ] APK installé sur appareil

## 🎯 Prochaines Étapes

1. **Installer Android Studio** si pas déjà fait
2. **Configurer les variables d'environnement**
3. **Lancer le script** `build-local.ps1`
4. **Installer l'APK** sur vos appareils

**Le build local est la meilleure solution si vous avez Android Studio installé ! 🚀**

