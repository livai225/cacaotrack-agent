# 📱 Guide Complet - Application Mobile CacaoTrack

## 🎯 Vue d'Ensemble

L'application mobile CacaoTrack permet aux agents de terrain de :
1. Créer des organisations, sections, villages
2. Enregistrer des producteurs avec photos
3. Cartographier des parcelles avec GPS
4. Effectuer des collectes complètes
5. Faire signer les producteurs
6. Travailler hors-ligne et synchroniser

---

## 📦 Structure Créée

```
cacaotrack-agent/
├── server/                    # API Backend (modifié)
│   └── prisma/schema.prisma   # ✅ Ajout champs signature + GPS
│
├── src/                       # Dashboard Web (inchangé)
│   └── ...                    # Aucune modification
│
└── mobile/                    # ✨ Application Mobile (NOUVEAU)
    ├── src/
    │   ├── config/            # Configuration API
    │   ├── contexts/          # Auth + Sync
    │   ├── services/          # API Service
    │   ├── screens/           # Écrans (Login créé)
    │   └── navigation/        # Navigation
    ├── App.tsx                # Point d'entrée
    ├── package.json           # Dépendances
    └── README.md              # Documentation
```

---

## 🗄️ Modifications Base de Données

### Table `Parcelle`
```sql
-- Nouveaux champs pour le mapping GPS
polygone_gps      String?   -- JSON [{lat, lng}, ...]
superficie_gps    Float?    -- Calculée en hectares
perimetre         Float?    -- En mètres
```

### Table `Operation`
```sql
-- Nouveaux champs pour la signature
signature_producteur  String?   -- Image Base64
date_signature        DateTime?
```

### Table `Agent`
```sql
-- Nouveaux champs pour l'authentification mobile
username       String?  @unique  -- Login
password_hash  String?           -- Mot de passe hashé
```

---

## 🚀 Prochaines Étapes

### 1. **Mettre à Jour la Base de Données**

```bash
# Sur votre PC
cd server
npx prisma generate
npx prisma db push

# Sur le serveur
ssh asco@82.208.22.230
cd ~/apps/cacaotrack-agent/server
npx prisma generate
npx prisma db push
pm2 restart asco-api
```

### 2. **Ajouter l'Authentification Backend**

Créer la route `/api/auth/login` dans `server/src/index.ts` :

```typescript
import bcrypt from 'bcrypt';

// Route de login pour les agents
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const agent = await prisma.agent.findUnique({
      where: { username },
    });

    if (!agent || !agent.password_hash) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const isValid = await bcrypt.compare(password, agent.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Générer un token JWT (optionnel)
    const token = 'simple-token-' + agent.id; // À améliorer avec JWT

    res.json({
      agent: {
        id: agent.id,
        code: agent.code,
        nom: agent.nom,
        prenom: agent.prenom,
        email: agent.email,
        telephone: agent.telephone,
        photo: agent.photo,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. **Ajouter bcrypt au Backend**

```bash
cd server
npm install bcrypt
npm install --save-dev @types/bcrypt
```

### 4. **Modifier le Dashboard Web pour Créer des Agents avec Login**

Dans `src/pages/AgentForm.tsx`, ajouter les champs :
- Username
- Password (hashé avant envoi)

### 5. **Développer les Écrans Manquants**

Les écrans suivants doivent être créés dans `mobile/src/screens/` :

- ✅ `LoginScreen.tsx` (créé)
- ⏳ `HomeScreen.tsx`
- ⏳ `OrganisationScreen.tsx`
- ⏳ `SectionScreen.tsx`
- ⏳ `VillageScreen.tsx`
- ⏳ `ProducteurScreen.tsx`
- ⏳ `ParcelleScreen.tsx`
- ⏳ `ParcelleMapScreen.tsx` (mapping GPS)
- ⏳ `CollecteScreen.tsx`
- ⏳ `SignatureScreen.tsx` (signature tactile)

### 6. **Installer React Native**

```bash
# Sur votre PC
cd mobile
npm install

# Pour Android
npx react-native run-android

# Pour iOS (Mac uniquement)
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 🎨 Exemple d'Écran à Créer

### HomeScreen.tsx
```typescript
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';

export default function HomeScreen({ navigation }: any) {
  const { agent, logout } = useAuth();
  const { isOnline, pendingCount, syncData } = useSync();

  return (
    <ScrollView style={styles.container}>
      {/* En-tête Agent */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Bonjour, {agent?.prenom} {agent?.nom}</Title>
          <Text>Code: {agent?.code}</Text>
        </Card.Content>
      </Card>

      {/* Statut Sync */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Synchronisation</Title>
          <Text>Statut: {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</Text>
          <Text>En attente: {pendingCount}</Text>
          <Button onPress={syncData}>Synchroniser</Button>
        </Card.Content>
      </Card>

      {/* Menu Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Actions</Title>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Organisation')}
            style={styles.button}
          >
            Créer une Organisation
          </Button>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Producteur')}
            style={styles.button}
          >
            Enregistrer un Producteur
          </Button>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Collecte')}
            style={styles.button}
          >
            Nouvelle Collecte
          </Button>
        </Card.Content>
      </Card>

      {/* Déconnexion */}
      <Button onPress={logout} style={styles.logout}>
        Déconnexion
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  logout: {
    marginTop: 20,
    marginBottom: 40,
  },
});
```

---

## 🗺️ Exemple Mapping GPS

### ParcelleMapScreen.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { Button, Text } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';

export default function ParcelleMapScreen({ route, navigation }: any) {
  const [points, setPoints] = useState<any[]>([]);
  const [isMapping, setIsMapping] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    // Suivre la position en temps réel
    const watchId = Geolocation.watchPosition(
      (position) => {
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // Ajouter automatiquement des points pendant le mapping
        if (isMapping) {
          addPoint(position.coords.latitude, position.coords.longitude);
        }
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, distanceFilter: 5 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [isMapping]);

  const addPoint = (lat: number, lng: number) => {
    setPoints(prev => [...prev, { latitude: lat, longitude: lng }]);
  };

  const calculateArea = () => {
    // Algorithme Shoelace pour calculer la superficie
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    area = Math.abs(area) / 2;

    // Convertir en hectares (approximation)
    const hectares = area * 111320 * 111320 / 10000;
    return hectares.toFixed(2);
  };

  const finishMapping = () => {
    const superficie = calculateArea();
    navigation.navigate('Parcelle', {
      polygone_gps: JSON.stringify(points),
      superficie_gps: parseFloat(superficie),
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: currentPosition?.latitude || 0,
          longitude: currentPosition?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {currentPosition && (
          <Marker coordinate={currentPosition} title="Ma position" />
        )}

        {points.length > 2 && (
          <Polygon
            coordinates={points}
            strokeColor="#8B4513"
            fillColor="rgba(139, 69, 19, 0.3)"
            strokeWidth={2}
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <Text>Points enregistrés: {points.length}</Text>
        {points.length > 2 && (
          <Text>Superficie estimée: {calculateArea()} ha</Text>
        )}

        {!isMapping ? (
          <Button mode="contained" onPress={() => setIsMapping(true)}>
            Démarrer le Mapping
          </Button>
        ) : (
          <Button mode="contained" onPress={() => setIsMapping(false)}>
            Pause
          </Button>
        )}

        {points.length > 2 && (
          <Button mode="contained" onPress={finishMapping}>
            Terminer et Enregistrer
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    padding: 16,
    backgroundColor: 'white',
  },
});
```

---

## ✍️ Exemple Signature

### SignatureScreen.tsx
```typescript
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import SignatureCanvas from 'react-native-signature-canvas';

export default function SignatureScreen({ route, navigation }: any) {
  const signatureRef = useRef(null);

  const handleOK = (signature: string) => {
    // signature est en Base64
    navigation.navigate('Collecte', {
      signature_producteur: signature,
      date_signature: new Date().toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <SignatureCanvas
        ref={signatureRef}
        onOK={handleOK}
        descriptionText="Signez ici"
        clearText="Effacer"
        confirmText="Valider"
        webStyle={`.m-signature-pad {box-shadow: none; border: 1px solid #ccc;}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

---

## 📝 Checklist Complète

### Backend
- [x] Schéma Prisma mis à jour (signature + GPS)
- [ ] Route `/api/auth/login` créée
- [ ] bcrypt installé
- [ ] Migration base de données effectuée

### Dashboard Web
- [ ] Formulaire agent avec username/password
- [ ] Affichage signature dans détails opération (optionnel)
- [ ] Affichage carte GPS dans détails parcelle (optionnel)

### Application Mobile
- [x] Structure projet créée
- [x] Configuration API
- [x] Contextes Auth + Sync
- [x] Service API
- [x] Navigation
- [x] Écran Login
- [ ] Écran Home
- [ ] Écrans CRUD (Organisation, Section, Village, Producteur, Parcelle)
- [ ] Écran Mapping GPS
- [ ] Écran Signature
- [ ] Écran Collecte
- [ ] Tests
- [ ] Build APK

---

## 🚀 Pour Continuer

1. **Commiter les changements actuels**
2. **Mettre à jour la base de données**
3. **Ajouter l'authentification backend**
4. **Développer les écrans manquants**
5. **Tester sur émulateur**
6. **Build APK**
7. **Installer sur tablettes**

---

**Tout est prêt pour continuer le développement !** 🎉
