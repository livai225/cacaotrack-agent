# ✅ Configuration CacaoTrack sur le Serveur

## Structure Vérifiée ✅

Le projet a bien :
- `server/` (backend avec Prisma)
- `src/` (frontend)
- `CacaoTrackMobile/` (app mobile)

## Commandes à Exécuter

### 1. Configurer le Backend

```bash
cd /var/www/cacaotrack-agent/server

# Installer les dépendances
npm install

# Vérifier si Prisma existe
ls -la prisma/

# Créer le fichier .env
nano .env
```

Contenu du `.env` (CacaoTrack utilise Prisma avec DATABASE_URL) :
```env
DATABASE_URL="mysql://cacaotrack_user:VOTRE_MOT_DE_PASSE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="GENERER_UN_SECRET_ICI"
```

Générer le secret JWT :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Initialiser Prisma

```bash
cd /var/www/cacaotrack-agent/server

# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma db push

# Vérifier les tables
mysql -u cacaotrack_user -p asco -e "SHOW TABLES;"
```

### 3. Démarrer le Backend

```bash
cd /var/www/cacaotrack-agent/server

# Démarrer avec PM2
pm2 start src/index.ts --name cacaotrack-api --interpreter ts-node
pm2 save
pm2 startup

# Vérifier
pm2 status
pm2 logs cacaotrack-api
```

### 4. Tester l'API

```bash
# Health check
curl http://localhost:3000/api/health

# API info
curl http://localhost:3000/api
```

### 5. Configurer le Frontend

```bash
cd /var/www/cacaotrack-agent

# Installer les dépendances
npm install

# Créer .env.production
nano .env.production
```

Contenu :
```env
VITE_API_URL="https://votre-domaine.com/api"
```

```bash
# Build
npm run build

# Vérifier que dist/ est créé
ls -la dist/
```

### 6. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/cacaotrack
```

Configuration :
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    root /var/www/cacaotrack-agent/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Activer
sudo ln -s /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

