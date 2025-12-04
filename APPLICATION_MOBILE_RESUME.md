# 📱 Application Mobile CacaoTrack - Résumé Complet

## 🎯 Objectif

Créer une application mobile Android/iOS pour les agents de terrain permettant de :
1. Créer organisations, sections, villages, producteurs, parcelles
2. Effectuer des collectes complètes
3. **Cartographier les parcelles avec GPS** (calcul automatique superficie)
4. **Faire signer les producteurs** sur l'écran tactile
5. Travailler hors-ligne avec synchronisation automatique

---

## ✅ Ce qui a été Fait

### 1. **Base de Données** ✅
- [x] Ajout champs `username` et `password_hash` dans `Agent`
- [x] Ajout champs `polygone_gps`, `superficie_gps`, `perimetre` dans `Parcelle`
- [x] Ajout champs `signature_producteur`, `date_signature` dans `Operation`

### 2. **Backend API** ✅
- [x] Installation `bcrypt` et `jsonwebtoken`
- [x] Route `POST /api/auth/login` pour connexion agents
- [x] Route `POST /api/agents/:id/password` pour définir mot de passe
- [x] Hashage sécurisé des mots de passe
- [x] Génération tokens JWT (expiration 30 jours)

### 3. **Structure Mobile** ✅
- [x] Projet React Native créé dans `/mobile`
- [x] Configuration TypeScript
- [x] Package.json avec toutes les dépendances
- [x] Configuration API
- [x] Contexte d'authentification
- [x] Contexte de synchronisation (mode hors-ligne)
- [x] Service API complet
- [x] Navigation (Stack Navigator)
- [x] Écran de login

### 4. **Documentation** ✅
- [x] `mobile/README.md` - Guide de l'app mobile
- [x] `MOBILE_APP_GUIDE.md` - Guide complet avec exemples
- [x] `BACKEND_UPDATE.md` - Instructions mise à jour backend
- [x] `REALTIME_DEPLOY.md` - Déploiement temps réel

---

## ⏳ Ce qui Reste à Faire

### Écrans à Créer

1. **HomeScreen.tsx** ⏳
   - Menu principal
   - Statut synchronisation
   - Accès rapide aux fonctions

2. **OrganisationScreen.tsx** ⏳
   - Formulaire création organisation
   - Liste organisations existantes

3. **SectionScreen.tsx** ⏳
   - Formulaire création section
   - Sélection organisation parente

4. **VillageScreen.tsx** ⏳
   - Formulaire création village
   - Géolocalisation automatique
   - Sélection section parente

5. **ProducteurScreen.tsx** ⏳
   - Formulaire complet producteur
   - Prise de photo
   - Informations familiales

6. **ParcelleScreen.tsx** ⏳
   - Formulaire parcelle
   - Bouton "Cartographier"
   - Affichage superficie calculée

7. **ParcelleMapScreen.tsx** ⏳ (IMPORTANT)
   - Carte GPS interactive
   - Bouton "Démarrer mapping"
   - Enregistrement points GPS
   - Calcul automatique superficie
   - Affichage polygone

8. **CollecteScreen.tsx** ⏳
   - Workflow 7 étapes
   - Formulaires par étape
   - Bouton "Signature"

9. **SignatureScreen.tsx** ⏳ (IMPORTANT)
   - Zone de signature tactile
   - Capture signature Base64
   - Validation

---

## 🚀 Prochaines Actions

### 1. Mettre à Jour le Serveur

```bash
ssh asco@82.208.22.230
cd ~/apps/cacaotrack-agent
git pull origin main
cd server
npm install
npx prisma generate
npx prisma db push
pm2 restart asco-api
```

### 2. Créer un Agent de Test

Via l'API ou directement en base :
```bash
# Créer l'agent
curl -X POST http://82.208.22.230/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AG001",
    "nom": "Test",
    "prenom": "Agent",
    "telephone": "+225000000000",
    "statut": "actif",
    "username": "agent_test"
  }'

# Définir le mot de passe
curl -X POST http://82.208.22.230/api/agents/AGENT_ID/password \
  -H "Content-Type: application/json" \
  -d '{"password": "test123"}'
```

### 3. Développer les Écrans

Commencer par les plus simples :
1. HomeScreen (menu)
2. OrganisationScreen (formulaire simple)
3. SectionScreen
4. VillageScreen
5. ProducteurScreen
6. ParcelleScreen
7. **ParcelleMapScreen** (mapping GPS - complexe)
8. CollecteScreen
9. **SignatureScreen** (signature - complexe)

### 4. Installer React Native

```bash
cd mobile
npm install
npx react-native run-android  # Pour Android
```

---

## 📊 Architecture Complète

```
┌─────────────────────────────────────────────────────────┐
│                    DASHBOARD WEB                        │
│              (Administrateurs - Bureau)                 │
│  - Créer agents avec username/password                 │
│  - Voir toutes les données                              │
│  - Statistiques et rapports                             │
│  - Validation des collectes                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
┌────────────────────▼────────────────────────────────────┐
│                   API BACKEND                           │
│              (Express + Socket.IO)                      │
│  - Routes CRUD pour toutes les entités                  │
│  - Authentification JWT                                 │
│  - Temps réel (Socket.IO)                               │
│  - Validation et sécurité                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Prisma ORM
                     │
┌────────────────────▼────────────────────────────────────┐
│              BASE DE DONNÉES                            │
│           (PostgreSQL + PostGIS)                        │
│  - Organisations, Sections, Villages                    │
│  - Producteurs, Parcelles, Opérations                   │
│  - Agents (avec username/password_hash)                 │
│  - Données GPS et signatures                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
┌────────────────────▼────────────────────────────────────┐
│               APPLICATION MOBILE                        │
│           (React Native - Agents Terrain)               │
│  - Login avec username/password                         │
│  - Création organisations → collectes                   │
│  - Mapping GPS des parcelles                            │
│  - Signature tactile producteurs                        │
│  - Mode hors-ligne + synchronisation                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Exemples de Code

### HomeScreen (à créer)

```typescript
export default function HomeScreen({ navigation }: any) {
  const { agent, logout } = useAuth();
  const { isOnline, pendingCount, syncData } = useSync();

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Bonjour, {agent?.prenom}</Title>
          <Text>Code: {agent?.code}</Text>
          <Text>Statut: {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</Text>
          <Text>En attente: {pendingCount}</Text>
        </Card.Content>
      </Card>

      <Button onPress={() => navigation.navigate('Organisation')}>
        Créer une Organisation
      </Button>
      <Button onPress={() => navigation.navigate('Producteur')}>
        Enregistrer un Producteur
      </Button>
      <Button onPress={() => navigation.navigate('Collecte')}>
        Nouvelle Collecte
      </Button>
      <Button onPress={logout}>Déconnexion</Button>
    </ScrollView>
  );
}
```

### ParcelleMapScreen (à créer)

```typescript
export default function ParcelleMapScreen({ navigation }: any) {
  const [points, setPoints] = useState<any[]>([]);
  const [isMapping, setIsMapping] = useState(false);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        if (isMapping) {
          setPoints(prev => [...prev, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }]);
        }
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, distanceFilter: 5 }
    );
    return () => Geolocation.clearWatch(watchId);
  }, [isMapping]);

  const calculateArea = () => {
    // Algorithme Shoelace
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    return Math.abs(area) / 2 * 111320 * 111320 / 10000; // hectares
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {points.length > 2 && (
          <Polygon
            coordinates={points}
            strokeColor="#8B4513"
            fillColor="rgba(139, 69, 19, 0.3)"
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <Text>Points: {points.length}</Text>
        {points.length > 2 && (
          <Text>Superficie: {calculateArea().toFixed(2)} ha</Text>
        )}
        <Button onPress={() => setIsMapping(!isMapping)}>
          {isMapping ? 'Pause' : 'Démarrer'}
        </Button>
        <Button onPress={() => {
          navigation.navigate('Parcelle', {
            polygone_gps: JSON.stringify(points),
            superficie_gps: calculateArea(),
          });
        }}>
          Enregistrer
        </Button>
      </View>
    </View>
  );
}
```

### SignatureScreen (à créer)

```typescript
export default function SignatureScreen({ navigation }: any) {
  const handleOK = (signature: string) => {
    navigation.navigate('Collecte', {
      signature_producteur: signature,
      date_signature: new Date().toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <SignatureCanvas
        onOK={handleOK}
        descriptionText="Signez ici"
        clearText="Effacer"
        confirmText="Valider"
      />
    </View>
  );
}
```

---

## 📝 Checklist Finale

### Backend
- [x] Schéma Prisma mis à jour
- [x] Dépendances installées
- [x] Routes d'authentification créées
- [ ] Base de données migrée sur le serveur
- [ ] Agent de test créé

### Application Mobile
- [x] Structure projet
- [x] Configuration
- [x] Contextes (Auth, Sync)
- [x] Services API
- [x] Navigation
- [x] Écran Login
- [ ] Écran Home
- [ ] Écrans CRUD
- [ ] Écran Mapping GPS
- [ ] Écran Signature
- [ ] Tests
- [ ] Build APK

### Dashboard Web (Optionnel)
- [ ] Formulaire agent avec username/password
- [ ] Affichage signature dans opérations
- [ ] Affichage carte GPS dans parcelles

---

## 🎉 Résultat Final

Une fois terminé, vous aurez :

1. **Dashboard Web** : Gestion complète par les administrateurs
2. **Application Mobile** : Collecte terrain par les agents
3. **Synchronisation Temps Réel** : Données partagées instantanément
4. **Mode Hors-Ligne** : Travail sans connexion
5. **Mapping GPS** : Cartographie précise des parcelles
6. **Signature Électronique** : Validation par les producteurs

---

**Tout est prêt pour continuer le développement !** 🚀

**Prochaine étape** : Mettre à jour le serveur et créer les écrans manquants.
