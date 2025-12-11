# 🎯 GUIDE : BUILD APK AVEC ANDROID STUDIO

## ✅ PRÉPARATION TERMINÉE

Le dossier `android/` a été généré avec succès !
- ✅ Configuration Gradle prête
- ✅ Fichier `local.properties` créé
- ✅ Toutes les dépendances React Native configurées

---

## 🚀 ÉTAPES POUR BUILDER L'APK

### Étape 1 : Ouvrir Android Studio

1. **Lancer Android Studio** sur votre ordinateur

2. **Cliquer sur "Open"** (ou File → Open)

3. **Naviguer vers le dossier Android** :
   ```
   C:\Users\Dell\Documents\GitHub\cacaotrack-agent\CacaoTrackMobile\android
   ```
   
   ⚠️ **IMPORTANT** : Sélectionnez le dossier `android` (pas `CacaoTrackMobile`)

4. **Cliquer sur "OK"**

---

### Étape 2 : Attendre le Gradle Sync (5-10 minutes)

Android Studio va automatiquement :
- ✅ Télécharger Gradle (~100 MB)
- ✅ Télécharger les dépendances (~500 MB)
- ✅ Indexer le projet
- ✅ Configurer le build

**Indicateurs de progression** :
- En bas de l'écran : Barre de progression "Gradle Sync"
- En bas à droite : "Indexing..." puis "Ready"

⏱️ **Durée** : 5-10 minutes (première fois)

**Si des erreurs apparaissent** :
- Cliquer sur "Try Again" ou "Sync Now"
- Ou : File → Invalidate Caches → Invalidate and Restart

---

### Étape 3 : Builder l'APK

Une fois le Gradle Sync terminé :

#### Option A : Via le Menu (RECOMMANDÉ)

1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**

2. **Attendre la compilation** (5-10 minutes)
   - Progression visible en bas : "Building..."
   - Messages dans l'onglet "Build"

3. **Message de succès** :
   ```
   BUILD SUCCESSFUL in 8m 32s
   APK(s) generated successfully
   ```

4. **Cliquer sur "locate"** dans la notification pour ouvrir le dossier

#### Option B : Via le Terminal Android Studio

1. **View → Tool Windows → Terminal**

2. **Taper** :
   ```bash
   .\gradlew assembleRelease
   ```

3. **Attendre** la compilation

---

### Étape 4 : Localiser l'APK

L'APK sera généré ici :
```
C:\Users\Dell\Documents\GitHub\cacaotrack-agent\CacaoTrackMobile\android\app\build\outputs\apk\release\app-release.apk
```

**Taille attendue** : ~30-50 MB

---

## 📱 INSTALLATION SUR TABLETTES

### Via USB (ADB)

1. **Connecter la tablette** au PC via USB

2. **Activer le débogage USB** sur la tablette :
   - Paramètres → À propos → Appuyer 7 fois sur "Numéro de build"
   - Paramètres → Options de développement → Débogage USB (ON)

3. **Vérifier la connexion** :
   ```bash
   adb devices
   ```

4. **Installer l'APK** :
   ```bash
   adb install app-release.apk
   ```

### Via Fichier (Sans USB)

1. **Copier l'APK** sur une clé USB ou via email/Drive

2. **Sur la tablette** :
   - Ouvrir le fichier APK
   - Autoriser l'installation depuis sources inconnues
   - Installer

---

## ⚠️ PROBLÈMES COURANTS ET SOLUTIONS

### Problème 1 : "Gradle Sync Failed"

**Solution** :
```
File → Invalidate Caches → Invalidate and Restart
```

### Problème 2 : "SDK Not Found"

**Solution** :
```
File → Project Structure → SDK Location
Vérifier que le chemin est : C:\Users\Dell\AppData\Local\Android\Sdk
```

### Problème 3 : "Build Failed - Out of Memory"

**Solution** :
Ouvrir `android/gradle.properties` et ajouter :
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
```

### Problème 4 : "Execution failed for task"

**Solution** :
```bash
# Dans le terminal Android Studio
.\gradlew clean
.\gradlew assembleRelease
```

---

## 🎯 CHECKLIST COMPLÈTE

### Avant le Build
- [x] Dossier `android/` généré
- [x] Fichier `local.properties` créé
- [ ] Android Studio ouvert
- [ ] Projet `android/` ouvert dans Android Studio
- [ ] Gradle Sync terminé avec succès

### Pendant le Build
- [ ] Build Variant = "release" (en bas à gauche)
- [ ] Pas d'erreurs dans les logs
- [ ] Compilation en cours (5-10 minutes)

### Après le Build
- [ ] APK généré dans `android/app/build/outputs/apk/release/`
- [ ] Taille de l'APK vérifiée (~30-50 MB)
- [ ] APK copié pour installation
- [ ] APK installé sur tablette
- [ ] App testée et fonctionnelle

---

## 📊 TEMPS ESTIMÉ

| Étape | Durée |
|-------|-------|
| Ouvrir Android Studio | 1 min |
| Gradle Sync | 5-10 min |
| Build APK | 5-10 min |
| Installation tablette | 2 min |
| **TOTAL** | **15-25 min** |

---

## 🎉 APRÈS LE BUILD RÉUSSI

1. **Créer un agent** sur le dashboard web :
   - http://82.208.22.230:3000
   - Aller dans Agents → Créer un agent
   - Noter le username et password

2. **Tester l'app mobile** :
   - Ouvrir l'app sur la tablette
   - Se connecter avec les identifiants
   - Tester la création d'organisation
   - Tester la création de producteur (avec photo)
   - Tester la création de parcelle (avec GPS)

3. **Distribuer aux autres agents** :
   - Copier l'APK sur toutes les tablettes
   - Installer sur chaque tablette
   - Créer un compte pour chaque agent

---

## 💡 ASTUCES

### Build Plus Rapide (Debug)
Pour tester rapidement sans optimisations :
```bash
.\gradlew assembleDebug
```
APK dans : `android/app/build/outputs/apk/debug/app-debug.apk`

### Nettoyer Complètement
Si problèmes persistants :
```bash
.\gradlew clean
Remove-Item -Recurse -Force .gradle
Remove-Item -Recurse -Force build
```

### Logs Détaillés
Pour voir plus d'informations :
```bash
.\gradlew assembleRelease --info
```

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :
1. Vérifier les logs dans l'onglet "Build" d'Android Studio
2. Chercher l'erreur spécifique
3. Essayer les solutions ci-dessus

---

**VOUS ÊTES PRÊT ! OUVREZ ANDROID STUDIO ET SUIVEZ LES ÉTAPES.** 🚀

Le dossier à ouvrir : `C:\Users\Dell\Documents\GitHub\cacaotrack-agent\CacaoTrackMobile\android`
