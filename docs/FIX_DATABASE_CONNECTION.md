# 🔧 Fix : Connexion à la Base de Données

## Problème
Le serveur démarre mais ne peut pas se connecter à PostgreSQL. L'erreur `"database": "disconnected"` apparaît dans `/api/health`.

## Solution

### 1. Vérifier que PostgreSQL est en cours d'exécution

```bash
# Vérifier le statut de PostgreSQL
sudo systemctl status postgresql

# Si PostgreSQL n'est pas démarré, le démarrer
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Pour démarrer au boot
```

### 2. Vérifier/Créer le fichier `.env`

```bash
# Aller dans le répertoire server
cd ~/apps/cacaotrack-agent/server

# Vérifier si le fichier .env existe
ls -la .env

# Si le fichier n'existe pas, le créer
cat > .env << 'EOF'
DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
PORT=3000
NODE_ENV=production
JWT_SECRET=change-this-secret-key-in-production
EOF

# Vérifier le contenu
cat .env
```

### 3. Tester la connexion à PostgreSQL

```bash
# Tester la connexion directement
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432

# Si la connexion fonctionne, vous devriez voir :
# psql (version)
# Type "help" for help.
# asco_db=>

# Pour quitter : \q
```

### 4. Vérifier que la base de données existe

```bash
# Se connecter en tant que postgres
sudo -u postgres psql

# Dans psql, vérifier les bases de données
\l

# Vérifier que asco_db existe. Si elle n'existe pas :
CREATE DATABASE asco_db;
CREATE USER asco_user WITH ENCRYPTED PASSWORD 'AscoSecure2024!';
GRANT ALL PRIVILEGES ON DATABASE asco_db TO asco_user;

# Se connecter à asco_db
\c asco_db

# Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

# Vérifier PostGIS
SELECT PostGIS_version();

# Quitter
\q
```

### 5. Vérifier la configuration PostgreSQL pour les connexions distantes

```bash
# Vérifier que PostgreSQL écoute sur toutes les interfaces
sudo grep "listen_addresses" /etc/postgresql/*/main/postgresql.conf

# Si nécessaire, modifier pour écouter sur toutes les interfaces
sudo nano /etc/postgresql/*/main/postgresql.conf
# Chercher : listen_addresses = 'localhost'
# Remplacer par : listen_addresses = '*'

# Vérifier pg_hba.conf pour autoriser les connexions
sudo grep -E "^(host|local)" /etc/postgresql/*/main/pg_hba.conf

# Si nécessaire, ajouter une ligne pour autoriser les connexions
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Ajouter : host    asco_db    asco_user    0.0.0.0/0    md5

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### 6. Vérifier le pare-feu

```bash
# Vérifier que le port 5432 est ouvert
sudo ufw status

# Si nécessaire, ouvrir le port
sudo ufw allow 5432/tcp
sudo ufw reload
```

### 7. Redémarrer l'API PM2

```bash
# Redémarrer PM2 pour charger les nouvelles variables d'environnement
cd ~/apps/cacaotrack-agent/server
pm2 restart asco-api

# Vérifier les logs
pm2 logs asco-api --lines 50

# Tester l'endpoint de santé
curl http://localhost:3000/api/health
```

### 8. Vérification finale

La réponse de `/api/health` devrait être :

```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-23T...",
  "uptime": ...,
  "environment": "production"
}
```

## Commandes rapides (copier-coller)

```bash
# 1. Créer le fichier .env
cd ~/apps/cacaotrack-agent/server
cat > .env << 'EOF'
DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
PORT=3000
NODE_ENV=production
JWT_SECRET=change-this-secret-key-in-production
EOF

# 2. Tester la connexion PostgreSQL
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432 -c "SELECT 1;"

# 3. Redémarrer PM2
pm2 restart asco-api

# 4. Vérifier les logs
sleep 3
pm2 logs asco-api --lines 30

# 5. Tester l'API
curl http://localhost:3000/api/health
```

## Dépannage

### Erreur : "password authentication failed"
- Vérifier que le mot de passe dans `.env` correspond au mot de passe PostgreSQL
- Réinitialiser le mot de passe : `sudo -u postgres psql -c "ALTER USER asco_user WITH PASSWORD 'AscoSecure2024!';"`

### Erreur : "could not connect to server"
- Vérifier que PostgreSQL est démarré : `sudo systemctl status postgresql`
- Vérifier que le port 5432 est ouvert : `sudo netstat -tuln | grep 5432`
- Vérifier `listen_addresses` dans `postgresql.conf`

### Erreur : "database does not exist"
- Créer la base de données (voir étape 4)

### Erreur : "permission denied"
- Vérifier les permissions dans `pg_hba.conf`
- Vérifier que l'utilisateur `asco_user` a les droits sur `asco_db`

