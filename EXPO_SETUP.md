# 📱 Configuration Expo - CacaoTrack Mobile

## 🎯 Étapes en Cours

### 1. Création du Projet Expo ⏳
```bash
npx create-expo-app@latest CacaoTrackMobile --template blank-typescript
```

### 2. Installation des Dépendances (À faire après)

Une fois le projet créé, nous devons installer :

```bash
cd CacaoTrackMobile

# Dépendances principales
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
npm install axios socket.io-client
npm install react-native-paper
npm install date-fns

# Dépendances Expo spécifiques
npx expo install expo-location
npx expo install expo-image-picker
npx expo install expo-camera
npx expo install react-native-maps
```

### 3. Copier Notre Code

Copier les fichiers de `/mobile/src` vers `/CacaoTrackMobile/src` :
- `src/config/`
- `src/contexts/`
- `src/services/`
- `src/navigation/`
- `src/screens/`

### 4. Adapter pour Expo

Quelques modifications nécessaires :
- Remplacer `react-native-geolocation-service` par `expo-location`
- Remplacer `react-native-image-picker` par `expo-image-picker`
- Remplacer `react-native-signature-canvas` par une alternative Expo

### 5. Lancer l'Application

```bash
npx expo start

# Scanner le QR code avec Expo Go sur votre téléphone
# Ou appuyer sur 'a' pour Android
```

---

## 📝 Fichiers à Adapter

### App.tsx
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { SyncProvider } from './src/contexts/SyncContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <SyncProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SyncProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

### VillageScreen.tsx (Adapter GPS)
```typescript
// Remplacer
import Geolocation from 'react-native-geolocation-service';

// Par
import * as Location from 'expo-location';

// Adapter la fonction
const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission refusée');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  setLatitude(location.coords.latitude.toString());
  setLongitude(location.coords.longitude.toString());
};
```

### ProducteurScreen.tsx (Adapter Photo)
```typescript
// Remplacer
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Par
import * as ImagePicker from 'expo-image-picker';

// Adapter la fonction
const handleTakePhoto = async () => {
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
};
```

---

## 🚀 Avantages d'Expo

- ✅ Pas besoin d'Android Studio
- ✅ Pas besoin de configurer Gradle
- ✅ Test rapide avec Expo Go
- ✅ Build APK en ligne avec EAS Build
- ✅ Plus simple à maintenir

---

## 📱 Test sur Téléphone

1. Installer **Expo Go** depuis Play Store
2. Lancer `npx expo start`
3. Scanner le QR code avec Expo Go
4. L'app se charge automatiquement

---

## 🔨 Build APK Production

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer le build
eas build:configure

# Builder l'APK
eas build --platform android --profile preview
```

---

**En attente de la fin de création du projet...** ⏳
