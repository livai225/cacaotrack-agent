# 🏢 Commandes pour ARCH EXCELLENCE Backend

## Problème Identifié

Le schéma SQL utilise la base `arch_excellence` mais vous avez créé `asco`. Deux options :

## Option 1 : Créer la Base `arch_excellence` (Recommandé)

```bash
# Se connecter à MySQL
sudo mysql -u root -p
```

Dans MySQL :
```sql
-- Créer la base arch_excellence
CREATE DATABASE arch_excellence CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Donner les privilèges à l'utilisateur
GRANT ALL PRIVILEGES ON arch_excellence.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;

-- Vérifier
SHOW DATABASES;
EXIT;
```

Puis appliquer le schéma :
```bash
mysql -u cacaotrack_user -p arch_excellence < /var/www/cacaotrack-agent/database/schema.sql
```

## Option 2 : Modifier le Schéma pour Utiliser `asco`

```bash
# Voir le contenu du schéma
head -20 /var/www/cacaotrack-agent/database/schema.sql

# Créer une copie modifiée
sed 's/arch_excellence/asco/g' /var/www/cacaotrack-agent/database/schema.sql > /tmp/schema_asco.sql

# Appliquer
mysql -u cacaotrack_user -p asco < /tmp/schema_asco.sql
```

## Configuration du .env

Le fichier `.env` doit pointer vers la bonne base :

```bash
cd /var/www/cacaotrack-agent/backend
nano .env
```

Contenu (selon l'option choisie) :

**Option 1 (arch_excellence) :**
```env
DB_HOST=localhost
DB_USER=cacaotrack_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE
DB_NAME=arch_excellence
PORT=3000
NODE_ENV=production
JWT_SECRET="b82d0758d303b635fa62b7c4059172130ffe08e3418451e345b60527517d1820e65c85f35655666469cb96e8676bd2059c54ab759740796413be87f3762f3397"
```

**Option 2 (asco) :**
```env
DB_HOST=localhost
DB_USER=cacaotrack_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE
DB_NAME=asco
PORT=3000
NODE_ENV=production
JWT_SECRET="b82d0758d303b635fa62b7c4059172130ffe08e3418451e345b60527517d1820e65c85f35655666469cb96e8676bd2059c54ab759740796413be87f3762f3397"
```

## Vérifier la Configuration de la Base de Données

```bash
# Voir le fichier de configuration
cat /var/www/cacaotrack-agent/backend/src/config/database.js
# ou
cat /var/www/cacaotrack-agent/backend/src/config/db.js
```

## Appliquer le Schéma et les Seeds

```bash
# Appliquer le schéma
mysql -u cacaotrack_user -p arch_excellence < /var/www/cacaotrack-agent/database/schema.sql

# Appliquer les données de test (optionnel)
mysql -u cacaotrack_user -p arch_excellence < /var/www/cacaotrack-agent/database/seed.sql

# Vérifier les tables
mysql -u cacaotrack_user -p arch_excellence -e "SHOW TABLES;"
```

## Démarrer le Backend

```bash
cd /var/www/cacaotrack-agent/backend

# Tester d'abord
npm start

# Si ça fonctionne, démarrer avec PM2
pm2 start src/server.js --name arch-excellence-api
pm2 save
pm2 startup

# Vérifier
pm2 status
pm2 logs arch-excellence-api
```

## Tester l'API

```bash
# Health check
curl http://localhost:3000/api/health

# Ou selon les routes disponibles
curl http://localhost:3000/api
```

