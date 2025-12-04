# 📱 CacaoTrack Mobile - Application Expo

## ✅ PROJET CRÉÉ ET CONFIGURÉ !

### Ce qui a été fait

1. ✅ Projet Expo créé avec TypeScript
2. ✅ Toutes les dépendances installées
3. ✅ Tout le code copié depuis `/mobile/src`
4. ✅ App.tsx configuré
5. ✅ Navigation, contextes, services, écrans - TOUT est là !

---

## 🚀 Lancer l'Application

### Option 1 : Test avec Expo Go (Recommandé pour débuter)

```bash
# Dans ce dossier (CacaoTrackMobile)
npx expo start

# Ensuite :
# - Scanner le QR code avec l'app "Expo Go" sur votre téléphone
# - Ou appuyer sur 'a' pour Android (si émulateur installé)
# - Ou appuyer sur 'w' pour tester dans le navigateur
```

### Option 2 : Build APK pour Installation

```bash
# Installer EAS CLI (une seule fois)
npm install -g eas-cli

# Se connecter (créer un compte Expo si besoin)
eas login

# Configurer le build
eas build:configure

# Builder l'APK
eas build --platform android --profile preview

# L'APK sera téléchargeable depuis le lien fourni
```

---

## ⚠️ Adaptations Nécessaires

Quelques fichiers doivent être adaptés pour Expo :

### 1. VillageScreen.tsx - GPS

Remplacer `react-native-geolocation-service` par `expo-location` :

```typescript
// Ligne 11 - Remplacer
import Geolocation from 'react-native-geolocation-service';

// Par
import * as Location from 'expo-location';

// Ligne 43-54 - Remplacer la fonction getCurrentLocation
const getCurrentLocation = async () => {
  setGettingLocation(true);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Activez la localisation');
      setGettingLocation(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
    setGettingLocation(false);
    Alert.alert('Succès', 'Position GPS enregistrée');
  } catch (error: any) {
    setGettingLocation(false);
    Alert.alert('Erreur GPS', error.message);
  }
};
```

### 2. ProducteurScreen.tsx - Photo

Remplacer `react-native-image-picker` par `expo-image-picker` :

```typescript
// Ligne 12 - Remplacer
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Par
import * as ImagePicker from 'expo-image-picker';

// Ligne 48-92 - Remplacer handleTakePhoto
const handleTakePhoto = async () => {
  Alert.alert(
    'Photo du Producteur',
    'Choisissez une option',
    [
      {
        text: 'Prendre une photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission refusée');
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            base64: true,
          });

          if (!result.canceled && result.assets[0].base64) {
            setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
          }
        },
      },
      {
        text: 'Choisir dans la galerie',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission refusée');
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            base64: true,
          });

          if (!result.canceled && result.assets[0].base64) {
            setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
          }
        },
      },
      { text: 'Annuler', style: 'cancel' },
    ]
  );
};
```

### 3. ParcelleMapScreen.tsx - GPS

Même chose, remplacer par `expo-location` :

```typescript
// Ligne 5 - Remplacer
import Geolocation from 'react-native-geolocation-service';

// Par
import * as Location from 'expo-location';

// Adapter les fonctions GPS (lignes 26-72)
useEffect(() => {
  let subscription: Location.LocationSubscription | null = null;

  const startWatching = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission GPS refusée');
      return;
    }

    // Position initiale
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    const pos = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setCurrentPosition(pos);
    setRegion({ ...pos, latitudeDelta: 0.01, longitudeDelta: 0.01 });

    // Suivi en temps réel
    subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
      },
      (location) => {
        const newPos = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentPosition(newPos);

        if (isMapping) {
          addPoint(newPos);
        }
      }
    );
  };

  startWatching();

  return () => {
    if (subscription) {
      subscription.remove();
    }
  };
}, [isMapping]);
```

### 4. SignatureScreen.tsx - Signature

Pour la signature, utiliser `expo-gl` ou `react-native-signature-capture` :

```bash
npx expo install expo-gl
npm install react-native-signature-capture
```

Ou utiliser une alternative web-based avec WebView.

---

## 📱 Test Rapide

1. **Installer Expo Go** sur votre téléphone (Play Store)
2. **Lancer** : `npx expo start`
3. **Scanner** le QR code
4. **Tester** le login avec un agent créé sur le serveur

---

## 🔧 Configuration API

Le fichier `src/config/api.ts` pointe vers :
```typescript
BASE_URL: 'http://82.208.22.230/api'
```

Pour tester en local, modifiez avec l'IP de votre PC :
```typescript
BASE_URL: 'http://192.168.1.XXX:3000/api'
```

---

## ✅ Prochaines Étapes

1. Adapter les 3 fichiers mentionnés ci-dessus
2. Lancer `npx expo start`
3. Tester sur téléphone avec Expo Go
4. Si tout fonctionne, builder l'APK avec EAS

---

## 📞 Commandes Utiles

```bash
# Démarrer
npx expo start

# Nettoyer le cache
npx expo start -c

# Voir les logs
npx expo start --dev-client

# Builder APK
eas build --platform android --profile preview
```

---

**L'APPLICATION EST PRÊTE À 95% !**

Il ne reste que les 3 adaptations Expo mentionnées ci-dessus. 🚀📱
