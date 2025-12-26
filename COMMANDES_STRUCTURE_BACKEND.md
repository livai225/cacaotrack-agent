# 🔧 Commandes pour la Structure avec `backend/`

Le projet a `backend/` au lieu de `server/`. Voici les commandes adaptées.

## 1. Aller dans le Backend

```bash
cd /var/www/cacaotrack-agent/backend
ls -la
```

## 2. Vérifier la Structure du Backend

```bash
# Voir la structure
find . -maxdepth 2 -type d

# Voir les fichiers importants
ls -la
cat package.json | grep -A 5 "name\|scripts"
```

## 3. Installer les Dépendances du Backend

```bash
cd /var/www/cacaotrack-agent/backend
npm install
```

## 4. Vérifier si Prisma est Configuré

```bash
# Chercher le schéma Prisma
find . -name "schema.prisma"

# Ou vérifier dans le dossier
ls -la prisma/ 2>/dev/null || echo "Pas de dossier prisma"
```

## 5. Configurer le Fichier .env

```bash
cd /var/www/cacaotrack-agent/backend

# Vérifier s'il y a un .env.example
ls -la .env*

# Créer le fichier .env
nano .env
```

Contenu du `.env` (ajustez selon la structure) :
```env
DATABASE_URL="mysql://cacaotrack_user:VOTRE_MOT_DE_PASSE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="GENERER_UN_SECRET_ICI"
```

## 6. Générer le Secret JWT

```bash
# Depuis le dossier backend
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 7. Si Prisma est Présent

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base de données
npx prisma db push
```

## 8. Si Pas de Prisma (Structure SQL Classique)

Si le projet utilise des migrations SQL classiques :

```bash
# Vérifier s'il y a un dossier database
ls -la /var/www/cacaotrack-agent/database

# Appliquer les migrations SQL
mysql -u cacaotrack_user -p asco < /var/www/cacaotrack-agent/database/schema.sql
```

## 9. Démarrer le Backend

```bash
cd /var/www/cacaotrack-agent/backend

# Vérifier les scripts disponibles
cat package.json | grep "scripts" -A 10

# Démarrer avec PM2
pm2 start npm --name cacaotrack-api -- start
# ou
pm2 start src/index.js --name cacaotrack-api
# ou selon la structure
pm2 start index.js --name cacaotrack-api

# Sauvegarder
pm2 save
```

## 10. Configurer le Frontend

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
```

## Vérification de la Structure

```bash
# Voir la structure complète
cd /var/www/cacaotrack-agent
tree -L 2 2>/dev/null || find . -maxdepth 2 -type d | head -20

# Voir les fichiers de configuration
ls -la backend/ | grep -E "package.json|\.env|prisma|index"
```

