# 🔧 Commandes Adaptées pour `backend/`

## 1. Explorer la Structure du Backend

```bash
cd /var/www/cacaotrack-agent/backend
ls -la

# Voir la structure complète
find . -maxdepth 2 -type d

# Vérifier le package.json
cat package.json
```

## 2. Vérifier si Prisma est Présent

```bash
# Chercher le schéma Prisma
find . -name "schema.prisma"

# Vérifier le dossier prisma
ls -la prisma/ 2>/dev/null || echo "Pas de dossier prisma"
```

## 3. Installer les Dépendances

```bash
cd /var/www/cacaotrack-agent/backend
npm install
```

## 4. Configurer le Fichier .env

```bash
cd /var/www/cacaotrack-agent/backend

# Vérifier s'il y a un .env.example
ls -la .env*

# Créer le fichier .env
nano .env
```

Contenu du `.env` :
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

## 5. Si Prisma est Présent

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base de données
npx prisma db push
```

## 6. Si Pas de Prisma (Migrations SQL)

Si le projet utilise des migrations SQL dans le dossier `database/` :

```bash
# Vérifier le dossier database
ls -la /var/www/cacaotrack-agent/database

# Appliquer le schéma SQL
mysql -u cacaotrack_user -p asco < /var/www/cacaotrack-agent/database/schema.sql

# Ou si c'est un autre fichier
mysql -u cacaotrack_user -p asco < /var/www/cacaotrack-agent/database/init.sql
```

## 7. Démarrer le Backend

Vérifiez d'abord comment démarrer le backend :

```bash
# Voir les scripts disponibles
cat package.json | grep -A 10 "scripts"

# Chercher le point d'entrée
find . -name "index.js" -o -name "index.ts" -o -name "server.js" -o -name "app.js"
```

Selon la structure, démarrez avec :

```bash
# Option 1 : Si c'est npm start
pm2 start npm --name cacaotrack-api -- start

# Option 2 : Si c'est un fichier index.js
pm2 start index.js --name cacaotrack-api

# Option 3 : Si c'est src/index.js
pm2 start src/index.js --name cacaotrack-api

# Option 4 : Si c'est TypeScript avec ts-node
pm2 start src/index.ts --name cacaotrack-api --interpreter ts-node

# Sauvegarder
pm2 save
pm2 startup
```

## 8. Vérifier que le Backend Fonctionne

```bash
# Vérifier les logs
pm2 logs cacaotrack-api

# Tester l'API
curl http://localhost:3000/api/health
curl http://localhost:3000/api
```

