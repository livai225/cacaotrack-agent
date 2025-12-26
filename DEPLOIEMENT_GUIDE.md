# 🚀 Guide de Déploiement - CacaoTrack

## ✅ État du Projet

### Tests Effectués
- ✅ **Schéma Prisma** : Valide
- ✅ **Client Prisma** : Généré avec succès
- ✅ **Build Frontend** : Réussi (2.96 MB)
- ✅ **Backend** : Configuré et prêt
- ✅ **Mobile** : Expo configuré

## 📦 Structure du Projet

```
cacaotrack-agent/
├── server/              # Backend Express + Prisma + MySQL
│   ├── src/
│   │   └── index.ts     # Serveur API (port 3000)
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env            # Configuration DB
│
├── src/                 # Frontend React + Vite
│   ├── pages/          # Formulaires multi-étapes
│   ├── components/     # Composants UI
│   └── services/       # API client
│
├── CacaoTrackMobile/   # App mobile Expo
│   ├── src/
│   │   ├── screens/    # 10 écrans
│   │   ├── contexts/   # Auth + Sync
│   │   └── config/     # API config
│   └── app.json
│
└── dist/               # Build frontend (après npm run build)
```

## 🔧 Configuration Requise

### 1. Serveur Backend

**Ports nécessaires :**
- `3000` : API Backend
- `8080` : Frontend Web (dev)
- `8081` : Frontend Web (alternatif)

**Variables d'environnement (`server/.env`) :**
```env
DATABASE_URL="mysql://user:password@host:port/database"
PORT=3000
NODE_ENV=production
JWT_SECRET="votre-secret-jwt-tres-securise-changez-moi"
```

**Dépendances :**
```bash
cd server
npm install
npx prisma generate
npx prisma db push
```

**Démarrer :**
```bash
npm start
# ou
ts-node src/index.ts
```

### 2. Frontend Web

**Build pour production :**
```bash
npm install
npm run build
# Le dossier dist/ contient les fichiers à déployer
```

**Configuration :**
- Le proxy API pointe vers `http://localhost:3000` en dev
- En production, configurer `VITE_API_URL` dans `.env.production`

**Déploiement :**
- Déployer le contenu de `dist/` sur votre serveur web (Nginx, Apache, etc.)
- Configurer le reverse proxy pour `/api` vers `http://localhost:3000`

### 3. Application Mobile

**Configuration API (`CacaoTrackMobile/src/config/api.ts`) :**
```typescript
BASE_URL: 'https://votre-domaine.com:3000/api'
```

**Build APK :**
```bash
cd CacaoTrackMobile
npm install
eas build --platform android --profile production
```

## 🌐 Déploiement en Ligne

### Option 1 : Serveur Dédié (VPS)

#### Backend
1. Installer Node.js (>= 20.19.4)
2. Installer MySQL
3. Cloner le projet
4. Configurer `.env`
5. Installer dépendances
6. Générer Prisma client
7. Pousser le schéma DB
8. Démarrer avec PM2 : `pm2 start server/src/index.ts --name cacaotrack-api`

#### Frontend
1. Build : `npm run build`
2. Déployer `dist/` sur Nginx/Apache
3. Configurer reverse proxy

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend
    location / {
        root /var/www/cacaotrack/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2 : Plateforme Cloud

#### Backend (Railway, Render, Heroku)
1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Définir la commande de démarrage : `cd server && npm start`
4. Configurer la base de données MySQL

#### Frontend (Vercel, Netlify)
1. Connecter le repo GitHub
2. Build command : `npm run build`
3. Output directory : `dist`
4. Variables d'environnement : `VITE_API_URL=https://votre-api.com/api`

## 🔒 Sécurité

### À Configurer en Production

1. **JWT_SECRET** : Utiliser un secret fort et unique
2. **HTTPS** : Activer SSL/TLS
3. **CORS** : Limiter les origines autorisées
4. **Rate Limiting** : Implémenter sur l'API
5. **Variables d'environnement** : Ne jamais commiter les `.env`
6. **Base de données** : Utiliser des credentials sécurisés

## 📊 Monitoring

### Health Check
- Endpoint : `GET /api/health`
- Vérifie la connexion à la base de données
- Retourne le statut du serveur

### Logs
- Backend : Logs dans la console
- Recommandation : Utiliser un service de logging (Winston, Pino)

## 🧪 Tests Post-Déploiement

1. **API Health** : `curl https://votre-domaine.com/api/health`
2. **Frontend** : Accéder à `https://votre-domaine.com`
3. **Mobile** : Tester avec l'URL de production
4. **CRUD** : Tester création/modification/suppression

## ⚠️ Problèmes Courants

### Base de données
- Vérifier que MySQL est accessible
- Vérifier les credentials dans `.env`
- Vérifier que le schéma est poussé : `npx prisma db push`

### CORS
- Vérifier les origines autorisées
- En production, limiter aux domaines autorisés

### Ports
- Vérifier que les ports sont ouverts (firewall)
- Vérifier qu'aucun autre service n'utilise les ports

## 📝 Checklist de Déploiement

- [ ] Base de données MySQL créée et accessible
- [ ] Variables d'environnement configurées
- [ ] Prisma client généré
- [ ] Schéma DB poussé
- [ ] Backend démarré et accessible
- [ ] Frontend buildé
- [ ] Frontend déployé
- [ ] Reverse proxy configuré
- [ ] HTTPS activé
- [ ] Mobile configuré avec URL de production
- [ ] Tests fonctionnels effectués

## 🎯 Prochaines Étapes

1. Configurer le serveur de production
2. Déployer la base de données MySQL
3. Déployer le backend
4. Déployer le frontend
5. Configurer le reverse proxy
6. Tester l'ensemble
7. Configurer le monitoring
8. Mettre en place les backups

