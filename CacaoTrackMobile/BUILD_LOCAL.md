# 🔨 Build Local APK avec Android Studio

## ✅ Dossier Android Créé !

Le dossier `android/` a été généré avec succès avec `npx expo prebuild`.

---

## 🚀 Méthode 1 : Avec Android Studio (RECOMMANDÉ)

### Étape 1 : Ouvrir le Projet

1. **Ouvrir Android Studio**
2. **File → Open**
3. **Naviguer vers** : `C:\Users\Dell\Documents\GitHub\cacaotrack-agent\CacaoTrackMobile\android`
4. **Cliquer sur OK**

### Étape 2 : Attendre le Sync

Android Studio va automatiquement :
- Télécharger Gradle
- Télécharger les dépendances
- Synchroniser le projet

**Durée : 5-10 minutes la première fois**

### Étape 3 : Générer l'APK

Une fois le sync terminé :

1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Attendre la compilation (~5-10 minutes)
3. Un message apparaîtra : "APK(s) generated successfully"
4. Cliquer sur **locate** pour ouvrir le dossier

**L'APK sera dans :**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔧 Méthode 2 : En Ligne de Commande

Si Gradle timeout, téléchargez-le manuellement :

### Option A : Télécharger Gradle Manuellement

1. **Télécharger** : https://services.gradle.org/distributions/gradle-8.14.3-bin.zip
2. **Extraire** dans : `C:\Users\Dell\.gradle\wrapper\dists\gradle-8.14.3-bin\`
3. **Relancer** :
```bash
cd android
.\gradlew assembleRelease
```

### Option B : Utiliser Gradle depuis Android Studio

Android Studio inclut déjà Gradle. Une fois le projet ouvert dans Android Studio :

1. **View → Tool Windows → Terminal**
2. Dans le terminal Android Studio :
```bash
.\gradlew assembleRelease
```

---

## 📱 Localisation de l'APK

Une fois le build terminé, l'APK sera ici :

```
C:\Users\Dell\Documents\GitHub\cacaotrack-agent\CacaoTrackMobile\android\app\build\outputs\apk\release\app-release.apk
```

**Taille attendue : ~30-50 MB**

---

## 🎯 Étapes Rapides

1. ✅ **Ouvrir Android Studio**
2. ✅ **File → Open → Sélectionner le dossier `android/`**
3. ✅ **Attendre le Gradle sync** (5-10 min)
4. ✅ **Build → Build Bundle(s) / APK(s) → Build APK(s)**
5. ✅ **Attendre la compilation** (5-10 min)
6. ✅ **Récupérer l'APK** dans `android/app/build/outputs/apk/release/`

---

## 🔍 Vérifier l'APK

```bash
# Aller dans le dossier
cd android\app\build\outputs\apk\release

# Vérifier la taille
dir app-release.apk
```

---

## 📦 Installer l'APK

### Sur Émulateur Android Studio

1. Lancer l'émulateur depuis Android Studio
2. Glisser-déposer l'APK sur l'émulateur

### Sur Tablette Physique

**Option 1 : Via USB**
```bash
adb install app-release.apk
```

**Option 2 : Copie Manuelle**
1. Copier l'APK sur la tablette (USB/Email/Drive)
2. Ouvrir le fichier depuis la tablette
3. Autoriser l'installation depuis sources inconnues
4. Installer

---

## ⚠️ Problèmes Courants

### Gradle Timeout
**Solution** : Ouvrir le projet dans Android Studio, il téléchargera Gradle automatiquement

### Erreur de Signature
**Solution** : Pour un APK de test, pas besoin de signature. Pour production, utilisez :
```bash
Build → Generate Signed Bundle / APK
```

### Manque de Mémoire
**Solution** : Dans `android/gradle.properties`, ajouter :
```
org.gradle.jvmargs=-Xmx4096m
```

---

## ✅ Checklist

- [ ] Android Studio ouvert
- [ ] Projet `android/` ouvert
- [ ] Gradle sync terminé
- [ ] Build APK lancé
- [ ] APK généré avec succès
- [ ] APK testé sur émulateur/tablette

---

**OUVREZ ANDROID STUDIO ET SUIVEZ LES ÉTAPES CI-DESSUS !** 🚀

Le build avec Android Studio est plus fiable que la ligne de commande pour la première fois.
