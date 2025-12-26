# 🔧 Correction - Création Base de Données

## Problème

Vous étiez dans MySQL et avez essayé d'exécuter des commandes bash. Il faut d'abord créer la base depuis MySQL.

## Solution : Commandes dans le Bon Ordre

### 1. Créer la Base de Données (depuis MySQL)

```bash
# Se connecter à MySQL
sudo mysql -u root -p
```

**Dans MySQL, exécutez ces commandes SQL :**
```sql
CREATE DATABASE arch_excellence CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON arch_excellence.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
EXIT;
```

### 2. Appliquer le Schéma SQL (depuis Bash)

```bash
# Maintenant que vous êtes sorti de MySQL, appliquer le schéma
mysql -u cacaotrack_user -p arch_excellence < /var/www/cacaotrack-agent/database/schema.sql
```

### 3. Vérifier les Tables

```bash
mysql -u cacaotrack_user -p arch_excellence -e "SHOW TABLES;"
```

### 4. Vérifier le Fichier .env

```bash
cd /var/www/cacaotrack-agent/backend
cat .env
```

Le `.env` doit contenir :
```env
DB_HOST=localhost
DB_USER=cacaotrack_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE
DB_NAME=arch_excellence
PORT=3000
NODE_ENV=production
JWT_SECRET="b82d0758d303b635fa62b7c4059172130ffe08e3418451e345b60527517d1820e65c85f35655666469cb96e8676bd2059c54ab759740796413be87f3762f3397"
```

### 5. Redémarrer le Backend

```bash
# Le backend tourne déjà, mais il faut le redémarrer pour prendre en compte les changements
pm2 restart arch-excellence-api

# Vérifier les logs
pm2 logs arch-excellence-api --lines 50
```

### 6. Tester l'API

```bash
# Tester si l'API répond
curl http://localhost:3000/api/health
curl http://localhost:3000/api
```

## Commandes Complètes (Copier-Coller)

```bash
# 1. Créer la base (dans MySQL)
sudo mysql -u root -p
# Puis dans MySQL :
# CREATE DATABASE arch_excellence CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# GRANT ALL PRIVILEGES ON arch_excellence.* TO 'cacaotrack_user'@'localhost';
# FLUSH PRIVILEGES;
# EXIT;

# 2. Appliquer le schéma (depuis bash, après avoir quitté MySQL)
mysql -u cacaotrack_user -p arch_excellence < /var/www/cacaotrack-agent/database/schema.sql

# 3. Vérifier
mysql -u cacaotrack_user -p arch_excellence -e "SHOW TABLES;"

# 4. Vérifier .env
cd /var/www/cacaotrack-agent/backend
cat .env

# 5. Redémarrer le backend
pm2 restart arch-excellence-api
pm2 logs arch-excellence-api
```

