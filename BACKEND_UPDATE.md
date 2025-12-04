# 🔧 Mise à Jour Backend - Authentification Mobile

## 📋 Changements Effectués

### 1. **Schéma Prisma** (`server/prisma/schema.prisma`)

#### Table `Agent`
```prisma
// Nouveaux champs
username       String?  @unique  // Login pour l'app mobile
password_hash  String?           // Mot de passe hashé (bcrypt)
```

#### Table `Parcelle`
```prisma
// Nouveaux champs pour mapping GPS
polygone_gps      String?   // JSON [{lat, lng}, ...]
superficie_gps    Float?    // Calculée en hectares
perimetre         Float?    // En mètres
```

#### Table `Operation`
```prisma
// Nouveaux champs pour signature
signature_producteur  String?   // Image Base64
date_signature        DateTime?
```

### 2. **Dépendances** (`server/package.json`)
- ✅ `bcrypt` : Hashage des mots de passe
- ✅ `jsonwebtoken` : Génération de tokens JWT
- ✅ `@types/bcrypt` : Types TypeScript
- ✅ `@types/jsonwebtoken` : Types TypeScript

### 3. **Routes API** (`server/src/index.ts`)

#### POST `/api/auth/login`
Authentification des agents pour l'app mobile.

**Request:**
```json
{
  "username": "agent123",
  "password": "motdepasse"
}
```

**Response (Success):**
```json
{
  "success": true,
  "agent": {
    "id": "uuid",
    "code": "AG001",
    "nom": "Kouassi",
    "prenom": "Jean",
    "email": "jean@example.com",
    "telephone": "+225...",
    "photo": "url",
    "statut": "actif"
  },
  "token": "jwt-token"
}
```

**Response (Error):**
```json
{
  "error": "Identifiants incorrects"
}
```

#### POST `/api/agents/:id/password`
Créer ou mettre à jour le mot de passe d'un agent.

**Request:**
```json
{
  "password": "nouveaumotdepasse"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mot de passe mis à jour",
  "agent": {
    "id": "uuid",
    "code": "AG001",
    "nom": "Kouassi",
    "prenom": "Jean",
    "username": "agent123"
  }
}
```

---

## 🚀 Commandes de Déploiement

### Sur Votre PC (Développement)

```bash
# 1. Installer les nouvelles dépendances
cd server
npm install

# 2. Générer le client Prisma avec les nouveaux champs
npx prisma generate

# 3. Mettre à jour la base de données
npx prisma db push

# 4. Redémarrer le serveur
npm run dev
```

### Sur le Serveur (Production)

```bash
# Se connecter au serveur
ssh asco@82.208.22.230

# Aller dans le dossier
cd ~/apps/cacaotrack-agent

# Récupérer les modifications
git pull origin main

# Installer les dépendances backend
cd server
npm install

# Générer Prisma
npx prisma generate

# Mettre à jour la base de données
npx prisma db push

# Redémarrer l'API
pm2 restart asco-api

# Vérifier les logs
pm2 logs asco-api --lines 50
```

### Commande Tout-en-Un (Serveur)

```bash
cd ~/apps/cacaotrack-agent && \
git pull origin main && \
cd server && \
npm install && \
npx prisma generate && \
npx prisma db push && \
pm2 restart asco-api && \
pm2 logs asco-api --lines 20
```

---

## 🧪 Tests

### 1. Tester la Route de Login

```bash
# Créer un agent avec username et password d'abord
curl -X POST http://82.208.22.230/api/agents/AGENT_ID/password \
  -H "Content-Type: application/json" \
  -d '{"password": "test123"}'

# Tester le login
curl -X POST http://82.208.22.230/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "agent123", "password": "test123"}'
```

### 2. Vérifier les Nouveaux Champs

```bash
# Vérifier qu'un agent peut avoir username et password_hash
curl http://82.208.22.230/api/agents

# Vérifier qu'une parcelle peut avoir polygone_gps
curl http://82.208.22.230/api/parcelles

# Vérifier qu'une opération peut avoir signature_producteur
curl http://82.208.22.230/api/operations
```

---

## 📱 Utilisation depuis l'App Mobile

### Configuration
Dans `mobile/src/config/api.ts` :
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://82.208.22.230/api',
};
```

### Login
```typescript
import { apiService } from '@/services/api.service';

const login = async () => {
  try {
    const response = await apiService.login('agent123', 'motdepasse');
    console.log('Agent connecté:', response.agent);
    console.log('Token:', response.token);
  } catch (error) {
    console.error('Erreur login:', error);
  }
};
```

---

## 🔐 Sécurité

### Variables d'Environnement

Ajouter dans `server/.env` :
```env
JWT_SECRET=votre-secret-jwt-super-securise-a-changer
```

### Bonnes Pratiques
- ✅ Les mots de passe sont hashés avec bcrypt (10 rounds)
- ✅ Les tokens JWT expirent après 30 jours
- ✅ Le `password_hash` n'est jamais retourné dans les réponses
- ✅ Validation des champs (username, password minimum 6 caractères)
- ✅ Vérification du statut de l'agent (actif/inactif)

---

## 🗄️ Migration Base de Données

### Vérifier les Changements

```sql
-- Vérifier que les nouveaux champs existent
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Agent' 
  AND column_name IN ('username', 'password_hash');

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Parcelle' 
  AND column_name IN ('polygone_gps', 'superficie_gps', 'perimetre');

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Operation' 
  AND column_name IN ('signature_producteur', 'date_signature');
```

### Créer un Agent de Test

```sql
-- Créer un agent avec username (le password sera ajouté via l'API)
INSERT INTO "Agent" (id, code, nom, prenom, telephone, statut, username, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'AG001',
  'Test',
  'Agent',
  '+225000000000',
  'actif',
  'agent_test',
  NOW(),
  NOW()
);
```

Puis définir le mot de passe via l'API :
```bash
curl -X POST http://82.208.22.230/api/agents/AGENT_ID/password \
  -H "Content-Type: application/json" \
  -d '{"password": "test123"}'
```

---

## 🐛 Dépannage

### Erreur "Cannot find module 'bcrypt'"
```bash
cd server
npm install bcrypt @types/bcrypt
```

### Erreur "username does not exist"
```bash
# Régénérer Prisma
npx prisma generate

# Mettre à jour la base de données
npx prisma db push
```

### Erreur "Identifiants incorrects"
- Vérifier que l'agent a bien un `username` défini
- Vérifier que le mot de passe a été créé via `/api/agents/:id/password`
- Vérifier que le statut de l'agent est `actif`

### Token JWT invalide
- Vérifier que `JWT_SECRET` est défini dans `.env`
- Vérifier que le token n'a pas expiré (30 jours)

---

## ✅ Checklist

- [ ] Modifications Prisma commitées
- [ ] Dépendances installées (`bcrypt`, `jsonwebtoken`)
- [ ] Routes d'authentification ajoutées
- [ ] Code pushé sur GitHub
- [ ] Serveur mis à jour (`git pull`)
- [ ] `npm install` exécuté
- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma db push` exécuté
- [ ] PM2 redémarré
- [ ] Tests effectués (login, password)
- [ ] Agent de test créé
- [ ] App mobile testée

---

**Le backend est maintenant prêt pour l'application mobile !** 🚀
