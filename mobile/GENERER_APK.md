# 📦 Générer l'APK en Ligne avec EAS Build

## 🚀 Méthode Rapide (Recommandée)

### Option 1: Script PowerShell (Le Plus Simple)
```powershell
cd mobile
.\build-apk-eas.ps1
```

Le script va :
- ✅ Vérifier/installer EAS CLI
- ✅ Vérifier votre connexion Expo
- ✅ Lancer le build automatiquement
- ✅ Vous donner le lien de téléchargement

### Option 2: Commandes Manuelles

#### Étape 1: Installer EAS CLI
```bash
npm install -g eas-cli
```

#### Étape 2: Se Connecter à Expo
```bash
eas login
```

**Si vous n'avez pas de compte Expo :**
- Créez-en un gratuitement sur : https://expo.dev/signup
- C'est gratuit et sans carte bancaire

#### Étape 3: Configurer le Projet (Première fois seulement)
```bash
cd mobile
# Ou à la racine du projet
eas build:configure
```

#### Étape 4: Lancer le Build APK
```bash
# À la racine du projet (où se trouve eas.json)
eas build --platform android --profile preview
```

**Ce qui va se passer :**
1. ✅ Votre code sera uploadé sur les serveurs Expo
2. ✅ Le build se fera en ligne (gratuit)
3. ✅ Durée : ~10-15 minutes
4. ✅ Vous recevrez un lien pour télécharger l'APK
5. ✅ Le lien est valide 30 jours

## 📱 Télécharger et Installer l'APK

### Après le Build

Une fois le build terminé, vous verrez quelque chose comme :
```
✅ Build finished!

📦 https://expo.dev/artifacts/eas/xxxxx.apk

Download and install this APK on your Android device.
```

### Installer sur Votre Appareil

#### Option A: Téléchargement Direct
1. Ouvrez le lien sur votre téléphone/tablette Android
2. Téléchargez l'APK
3. Autorisez l'installation depuis "Sources inconnues" si demandé
4. Installez l'APK

#### Option B: Via USB (ADB)
```bash
# Télécharger l'APK sur votre PC
# Puis installer via ADB
adb install chemin/vers/app.apk
```

#### Option C: Partage
1. Envoyer l'APK par email/WhatsApp/Drive
2. Télécharger sur l'appareil
3. Installer

## 🎯 Profils de Build Disponibles

### 1. Preview (Recommandé pour Test)
```bash
eas build --platform android --profile preview
```
- ✅ APK non signé
- ✅ Pour test interne
- ✅ Installation facile
- ✅ Valide 30 jours

### 2. Production (APK Signé)
```bash
eas build --platform android --profile production
```
- ✅ APK signé
- ✅ Pour distribution
- ✅ Plus sécurisé
- ✅ Valide 30 jours

### 3. Production (AAB pour Play Store)
```bash
# Modifier eas.json temporairement pour buildType: "app-bundle"
eas build --platform android --profile production
```
- ✅ Format AAB (Android App Bundle)
- ✅ Pour Google Play Store
- ✅ Optimisé par Google

## 📊 Suivre le Build

Pendant le build, vous pouvez :
1. **Voir le statut en temps réel** dans le terminal
2. **Aller sur** https://expo.dev/accounts/[votre-compte]/projects/cacaotrack-agent/builds
3. **Recevoir un email** quand le build est terminé

## ⚠️ Notes Importantes

1. **Gratuit** : EAS Build offre des builds gratuits pour les projets open-source
2. **Limite** : ~30 builds/mois gratuits (suffisant pour tester)
3. **Durée** : Le build prend généralement 10-15 minutes
4. **Taille APK** : Environ 30-50 MB
5. **Validité** : Le lien de téléchargement est valide 30 jours

## 🔧 Résolution de Problèmes

### Erreur "Not logged in"
```bash
eas login
```

### Erreur "Project not configured"
```bash
eas build:configure
```

### Erreur "eas.json not found"
Le fichier `eas.json` doit être à la racine du projet, pas dans `mobile/`.

### Build échoue
1. Vérifiez les logs sur https://expo.dev
2. Vérifiez que `app.json` est correctement configuré
3. Vérifiez que toutes les dépendances sont installées

## ✅ Checklist Avant le Build

- [ ] EAS CLI installé (`npm install -g eas-cli`)
- [ ] Connecté à Expo (`eas login`)
- [ ] `eas.json` présent à la racine
- [ ] `app.json` configuré dans `mobile/`
- [ ] Dépendances installées (`npm install --legacy-peer-deps` dans `mobile/`)

## 🎉 Une Fois le Build Terminé

1. ✅ Téléchargez l'APK depuis le lien fourni
2. ✅ Installez sur votre appareil Android
3. ✅ Testez l'application
4. ✅ Partagez l'APK avec votre équipe si nécessaire

**Le build est maintenant en cours ! 🚀**

