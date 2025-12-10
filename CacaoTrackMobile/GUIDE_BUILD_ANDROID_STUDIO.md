# 🔨 Guide Complet : Build APK avec Android Studio

## ✅ Dossier Android Généré

Le dossier `android/` a été créé avec succès avec `npx expo prebuild`.

---

## 📋 Prérequis

- ✅ Android Studio installé
- ✅ Dossier `android/` généré
- ✅ Dépendance incompatible supprimée (`react-native-signature-capture`)

---

## 🚀 ÉTAPES DÉTAILLÉES

### Étape 1 : Ouvrir le Projet dans Android Studio

1. **Lancer Android Studio**

2. **File → Open**

3. **Naviguer vers** :
   ```
   C:\Users\Dell\Documents\GitHub\cacaotrack-agent\CacaoTrackMobile\android
   ```

4. **Sélectionner le dossier `android`** et cliquer sur **OK**

5. **Attendre le Gradle Sync** (5-10 minutes la première fois)
   - Android Studio va télécharger Gradle
   - Télécharger toutes les dépendances
   - Indexer le projet

### Étape 2 : Vérifier la Configuration

Une fois le sync terminé, vérifiez :

1. **Build Variants** (en bas à gauche) : Sélectionner **release**

2. **SDK Manager** (Tools → SDK Manager) :
   - Android SDK Platform 34 (ou supérieur)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools

### Étape 3 : Générer l'APK

#### Option A : Via le Menu

1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**

2. Attendre la compilation (~5-10 minutes)

3. Un message apparaîtra : **"APK(s) generated successfully"**

4. Cliquer sur **locate** pour ouvrir le dossier

#### Option B : Via le Terminal Android Studio

1. **View → Tool Windows → Terminal**

2. Dans le terminal :
   ```bash
   .\gradlew assembleRelease
   ```

3. Attendre la compilation

### Étape 4 : Localiser l'APK

L'APK sera généré ici :
```
C:\Users\Dell\Documents\GitHub\cacaotrack-agent\CacaoTrackMobile\android\app\build\outputs\apk\release\app-release.apk
```

**Taille attendue** : ~30-50 MB

---

## 🔍 Vérifier l'APK

Dans PowerShell :

```powershell
cd C:\Users\Dell\Documents\GitHub\cacaotrack-agent\CacaoTrackMobile\android\app\build\outputs\apk\release

# Vérifier la taille
dir app-release.apk

# Informations détaillées (si aapt est installé)
aapt dump badging app-release.apk
```

---

## 📱 Installer l'APK

### Sur Émulateur Android Studio

1. **Lancer l'émulateur** : Tools → Device Manager → Play
2. **Glisser-déposer** l'APK sur l'émulateur
3. L'app s'installe automatiquement

### Sur Tablette Physique (Via USB)

1. **Activer le mode développeur** sur la tablette :
   - Paramètres → À propos → Appuyer 7 fois sur "Numéro de build"

2. **Activer le débogage USB** :
   - Paramètres → Options de développement → Débogage USB

3. **Connecter la tablette** au PC via USB

4. **Installer via ADB** :
   ```bash
   adb devices  # Vérifier que la tablette est détectée
   adb install app-release.apk
   ```

### Sur Tablette (Sans USB)

1. **Copier l'APK** sur la tablette (email, Drive, USB)
2. **Ouvrir le fichier** depuis la tablette
3. **Autoriser** l'installation depuis sources inconnues
4. **Installer**

---

## ⚠️ Problèmes Courants et Solutions

### Problème 1 : Gradle Sync Failed

**Symptômes** : Erreur lors du sync initial

**Solutions** :
1. Vérifier la connexion internet
2. File → Invalidate Caches → Invalidate and Restart
3. Supprimer `.gradle` dans le dossier utilisateur et réessayer

### Problème 2 : SDK Not Found

**Symptômes** : "Android SDK not found"

**Solution** :
1. Tools → SDK Manager
2. Installer Android SDK Platform 34
3. Redémarrer Android Studio

### Problème 3 : Build Failed - Out of Memory

**Symptômes** : "Out of memory" pendant le build

**Solution** :
1. Ouvrir `android/gradle.properties`
2. Ajouter ou modifier :
   ```properties
   org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
   ```
3. Relancer le build

### Problème 4 : Dépendances Non Résolues

**Symptômes** : Erreurs de dépendances manquantes

**Solution** :
```bash
cd android
.\gradlew clean
.\gradlew assembleRelease
```

### Problème 5 : APK Non Signé

**Symptômes** : APK généré mais non signé

**Solution** :
1. Build → Generate Signed Bundle / APK
2. Créer un keystore si nécessaire
3. Suivre l'assistant de signature

---

## 🎯 Commandes Utiles

### Dans le Terminal Android Studio

```bash
# Nettoyer le projet
.\gradlew clean

# Builder l'APK release
.\gradlew assembleRelease

# Builder l'APK debug (plus rapide)
.\gradlew assembleDebug

# Voir toutes les tâches disponibles
.\gradlew tasks

# Installer directement sur un appareil connecté
.\gradlew installRelease
```

---

## 📊 Checklist Complète

### Avant le Build
- [ ] Android Studio installé et configuré
- [ ] Dossier `android/` généré avec `npx expo prebuild`
- [ ] Projet ouvert dans Android Studio
- [ ] Gradle sync terminé avec succès

### Pendant le Build
- [ ] Build Variant = **release**
- [ ] Pas d'erreurs dans les logs
- [ ] Compilation en cours (5-10 minutes)

### Après le Build
- [ ] APK généré dans `android/app/build/outputs/apk/release/`
- [ ] Taille de l'APK vérifiée (~30-50 MB)
- [ ] APK testé sur émulateur ou tablette
- [ ] App se lance sans erreur
- [ ] Connexion au backend testée

---

## 🎉 Prochaines Étapes

Une fois l'APK généré et testé :

1. **Créer un agent** sur le dashboard web
2. **Se connecter** sur l'app mobile avec les identifiants
3. **Tester le workflow complet** :
   - Création d'organisation
   - Création de section
   - Création de village (avec GPS)
   - Création de producteur (avec photo)
   - Création de parcelle (avec mapping GPS)
   - Création d'opération (avec signature)
4. **Vérifier la synchronisation** avec le backend
5. **Distribuer l'APK** aux autres agents

---

## 💡 Astuces

### Build Plus Rapide
- Utiliser `assembleDebug` au lieu de `assembleRelease` pour les tests
- Activer le "Offline Mode" dans Gradle (si dépendances déjà téléchargées)

### Logs Détaillés
```bash
.\gradlew assembleRelease --info
```

### Nettoyer Complètement
```bash
.\gradlew clean
Remove-Item -Recurse -Force .gradle
Remove-Item -Recurse -Force build
```

---

**OUVREZ ANDROID STUDIO ET SUIVEZ LES ÉTAPES !** 🚀

Le dossier `android/` est prêt, vous pouvez commencer immédiatement.
