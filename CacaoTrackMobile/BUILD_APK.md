# 📦 Générer l'APK CacaoTrack Mobile

## ✅ Prérequis Installés

- [x] Android Studio
- [x] EAS CLI
- [x] Configuration app.json
- [x] Configuration eas.json

---

## 🚀 Méthode 1 : EAS Build (Recommandé - Plus Simple)

### Étape 1 : Se Connecter à Expo

```bash
eas login
```

Créez un compte Expo gratuit si vous n'en avez pas : https://expo.dev/signup

### Étape 2 : Configurer le Projet

```bash
eas build:configure
```

### Étape 3 : Builder l'APK

```bash
eas build --platform android --profile preview
```

**Ce qui va se passer :**
1. Votre code sera uploadé sur les serveurs Expo
2. Le build se fera en ligne (gratuit)
3. Vous recevrez un lien pour télécharger l'APK (valide 30 jours)
4. Durée : ~10-15 minutes

### Étape 4 : Télécharger l'APK

Une fois le build terminé, vous recevrez un lien comme :
```
https://expo.dev/artifacts/eas/xxxxx.apk
```

Téléchargez l'APK et installez-le sur vos tablettes !

---

## 🔧 Méthode 2 : Build Local avec Android Studio

Si vous préférez builder localement :

### Étape 1 : Prébuild Expo

```bash
npx expo prebuild --platform android
```

Cela va créer le dossier `android/` avec tous les fichiers natifs.

### Étape 2 : Ouvrir dans Android Studio

1. Ouvrir Android Studio
2. File → Open → Sélectionner le dossier `android/`
3. Attendre que Gradle sync se termine

### Étape 3 : Générer l'APK

Dans Android Studio :
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Attendre la compilation (~5-10 minutes)
3. L'APK sera dans : `android/app/build/outputs/apk/release/app-release.apk`

### Ou en ligne de commande :

```bash
cd android
./gradlew assembleRelease
```

**L'APK sera dans :**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 📱 Installer l'APK sur les Tablettes

### Option A : Via USB

1. Activer le mode développeur sur la tablette
2. Activer le débogage USB
3. Connecter la tablette au PC
4. Copier l'APK sur la tablette
5. Installer depuis le gestionnaire de fichiers

### Option B : Via ADB

```bash
adb install app-release.apk
```

### Option C : Via Partage

1. Envoyer l'APK par email/WhatsApp/Drive
2. Télécharger sur la tablette
3. Installer

---

## ⚠️ Important : Signature de l'APK

Pour une version production (Play Store), vous devez signer l'APK.

### Avec EAS (Automatique)

```bash
eas build --platform android --profile production
```

EAS gère automatiquement la signature.

### Avec Android Studio (Manuel)

1. Build → Generate Signed Bundle / APK
2. Créer un keystore si nécessaire
3. Suivre l'assistant

---

## 🎯 Commandes Rapides

### Build APK avec EAS (Recommandé)
```bash
# Se connecter
eas login

# Builder
eas build --platform android --profile preview

# Suivre le build
# Télécharger l'APK depuis le lien fourni
```

### Build Local
```bash
# Prébuild
npx expo prebuild --platform android

# Build
cd android
./gradlew assembleRelease

# APK dans : android/app/build/outputs/apk/release/app-release.apk
```

---

## 📊 Comparaison des Méthodes

| Critère | EAS Build | Build Local |
|---------|-----------|-------------|
| Simplicité | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Vitesse | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Gratuit | ✅ Oui | ✅ Oui |
| Internet requis | ✅ Oui | ❌ Non |
| Espace disque | Minimal | ~5-10 GB |
| Configuration | Automatique | Manuelle |

---

## 🔍 Vérifier l'APK

Après génération, vérifiez :

```bash
# Taille (devrait être ~30-50 MB)
ls -lh app-release.apk

# Informations
aapt dump badging app-release.apk
```

---

## ✅ Checklist Finale

- [ ] EAS CLI installé
- [ ] Compte Expo créé
- [ ] `eas login` effectué
- [ ] `eas build --platform android --profile preview` lancé
- [ ] APK téléchargé
- [ ] APK testé sur une tablette
- [ ] APK distribué aux agents

---

## 🎉 Prochaines Étapes

1. **Tester l'APK** sur une tablette
2. **Créer un agent** sur le dashboard web
3. **Se connecter** sur l'app mobile
4. **Tester le workflow complet**
5. **Distribuer** aux autres agents

---

**COMMENCEZ PAR : `eas login` puis `eas build --platform android --profile preview`** 🚀
