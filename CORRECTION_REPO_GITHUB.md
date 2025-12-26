# 🔧 Correction - Cloner le BON Projet

## ❌ Erreur Identifiée

Le projet cloné est **mock-data-creator** (ARCH EXCELLENCE), mais vous voulez **cacaotrack-agent** (CacaoTrack).

## ✅ Solution : Cloner le Bon Projet

### 1. Supprimer le Mauvais Projet

```bash
# Arrêter PM2 si le backend tourne
pm2 stop arch-excellence-api
pm2 delete arch-excellence-api

# Supprimer le mauvais projet
sudo rm -rf /var/www/cacaotrack-agent
```

### 2. Cloner le BON Projet

```bash
cd /var/www

# Cloner le BON repository
sudo git clone https://github.com/livai225/cacaotrack-agent.git cacaotrack-agent

# Donner les permissions
sudo chown -R $USER:$USER cacaotrack-agent
cd cacaotrack-agent

# Vérifier la structure
ls -la
```

### 3. Vérifier la Structure

Le projet CacaoTrack devrait avoir :
```
cacaotrack-agent/
├── server/          # Backend avec Prisma
│   ├── src/
│   ├── prisma/
│   └── .env
├── src/             # Frontend React
├── CacaoTrackMobile/ # App mobile
└── ...
```

### 4. Configurer le Backend (CacaoTrack)

```bash
cd /var/www/cacaotrack-agent/server

# Installer les dépendances
npm install

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

### 5. Initialiser Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma db push

# Vérifier
mysql -u cacaotrack_user -p asco -e "SHOW TABLES;"
```

### 6. Démarrer le Backend

```bash
# Démarrer avec PM2
pm2 start src/index.ts --name cacaotrack-api --interpreter ts-node
pm2 save
pm2 startup

# Vérifier
pm2 status
pm2 logs cacaotrack-api
```

## Commandes Complètes (Copier-Coller)

```bash
# 1. Supprimer le mauvais projet
pm2 stop arch-excellence-api 2>/dev/null
pm2 delete arch-excellence-api 2>/dev/null
sudo rm -rf /var/www/cacaotrack-agent

# 2. Cloner le BON projet
cd /var/www
sudo git clone https://github.com/livai225/cacaotrack-agent.git cacaotrack-agent
sudo chown -R $USER:$USER cacaotrack-agent
cd cacaotrack-agent

# 3. Vérifier la structure
ls -la
ls -la server/

# 4. Configurer le backend
cd server
npm install
nano .env  # Créer avec DATABASE_URL pour Prisma

# 5. Prisma
npx prisma generate
npx prisma db push

# 6. Démarrer
pm2 start src/index.ts --name cacaotrack-api --interpreter ts-node
pm2 save
```

