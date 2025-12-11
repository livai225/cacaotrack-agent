# mobile_flutter

A new Flutter project.

## Getting Started

# CacaoTrack Mobile - Application Flutter

Application mobile pour agents de terrain - Gestion des producteurs de cacao.

## 🚀 Fonctionnalités

- ✅ **Authentification** : Login sécurisé avec JWT
- ✅ **Gestion Organisation** : Création et gestion des organisations
- ✅ **Gestion Producteur** : Enregistrement avec photo
- ✅ **Mapping GPS** : Cartographie des parcelles avec GPS en temps réel
- ✅ **Mode Offline** : Synchronisation automatique
- ✅ **Interface moderne** : Material Design 3

## 📋 Prérequis

- Flutter SDK (3.5.3+)
- Android Studio ou VS Code
- Android SDK (API 21+)

## 🔧 Installation

```bash
# Cloner le projet
cd mobile_flutter

# Installer les dépendances
flutter pub get

# Vérifier la configuration
flutter doctor
```

## 🏗️ Build APK

### Build Release (Production)

```bash
flutter build apk --release
```

L'APK sera généré dans : `build/app/outputs/flutter-apk/app-release.apk`

### Build Debug (Test)

```bash
flutter build apk --debug
```

### Build avec Split par ABI (APK plus petits)

```bash
flutter build apk --split-per-abi
```

Génère 3 APK optimisés :
- `app-armeabi-v7a-release.apk` (~15 MB)
- `app-arm64-v8a-release.apk` (~18 MB)
- `app-x86_64-release.apk` (~20 MB)

## 📱 Installation sur Tablette

### Via USB (ADB)

```bash
# Vérifier la connexion
adb devices

# Installer l'APK
adb install build/app/outputs/flutter-apk/app-release.apk
```

### Via Fichier

1. Copier l'APK sur la tablette
2. Ouvrir le fichier depuis la tablette
3. Autoriser l'installation depuis sources inconnues
4. Installer

## 🧪 Tests

### Lancer l'app en mode développement

```bash
flutter run
```

### Tests unitaires

```bash
flutter test
```

## 📂 Structure du Projet

```
lib/
├── main.dart                 # Point d'entrée
├── config/
│   └── api_config.dart       # Configuration API
├── models/
│   ├── agent.dart
│   ├── organisation.dart
│   ├── producteur.dart
│   └── parcelle.dart
├── services/
│   ├── api_service.dart      # HTTP requests
│   └── auth_service.dart     # Authentification
└── screens/
    ├── login_screen.dart
    ├── home_screen.dart
    ├── organisation_screen.dart
    ├── producteur_screen.dart
    └── parcelle_screen.dart
```

## 🔌 Configuration Backend

L'app se connecte au backend à l'adresse : `http://82.208.22.230:3000`

Pour changer l'URL, modifier `lib/config/api_config.dart`

## 📦 Dépendances Principales

- `http` : Requêtes HTTP
- `geolocator` : GPS et localisation
- `image_picker` : Caméra et photos
- `shared_preferences` : Stockage local
- `connectivity_plus` : Détection réseau

## 🎨 Thème

Couleur principale : `#8B4513` (Marron cacao)

## 📝 Notes

- **Taille APK** : ~20-25 MB (release)
- **Version Android minimale** : API 21 (Android 5.0)
- **Permissions** : GPS, Caméra, Stockage, Internet

## 🐛 Dépannage

### Erreur Gradle

```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

### Erreur Permissions

Vérifier que toutes les permissions sont dans `AndroidManifest.xml`

### Erreur GPS

Activer le GPS sur l'appareil et autoriser les permissions de localisation

## 📞 Support

Pour toute question, contacter l'équipe de développement.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024
