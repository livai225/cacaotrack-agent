# 🛠️ Commandes Utiles - CacaoTrack PostgreSQL

Guide de référence rapide pour les commandes courantes.

---

## 🚀 Démarrage Initial

### Configuration complète (première fois)

**Linux/Mac :**
```bash
cd server
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

**Windows :**
```powershell
cd server
.\scripts\setup-db.ps1
```

---

## 📦 NPM / Node.js

### Installation des dépendances

```bash
# Frontend (racine)
npm install

# Backend
cd server
npm install
```

### Lancement de l'application

```bash
# Backend (Terminal 1)
cd server
npm run dev

# Frontend (Terminal 2 - depuis la racine)
npm run dev
```

### Scripts disponibles

```bash
# Backend
npm run dev          # Lancer le serveur en mode dev
npm run start        # Lancer le serveur en mode production
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma vers la DB
npm run db:seed      # Peupler avec des données de test

# Frontend
npm run dev          # Lancer en mode développement
npm run build        # Build pour production
npm run preview      # Prévisualiser le build
```

---

## 🗄️ Prisma

### Génération et migrations

```bash
# Générer le client Prisma (après modification du schema)
npx prisma generate

# Pousser le schéma vers la DB (sans créer de migration)
npx prisma db push

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base de données (ATTENTION: supprime toutes les données)
npx prisma migrate reset

# Voir le statut des migrations
npx prisma migrate status
```

### Prisma Studio (Interface graphique)

```bash
# Ouvrir Prisma Studio
npx prisma studio

# Accessible sur http://localhost:5555
```

### Seed (données de test)

```bash
# Peupler la base avec des données de test
npm run db:seed
```

---

## 🐘 PostgreSQL

### Connexion

```bash
# Connexion locale
psql -U asco_user -d asco_db

# Connexion distante
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432

# Avec URL complète
psql "postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db"
```

### Commandes dans psql

```sql
-- Lister les bases de données
\l

-- Se connecter à une base
\c asco_db

-- Lister les tables
\dt

-- Voir la structure d'une table
\d "Organisation"

-- Lister les extensions
\dx

-- Voir la version de PostGIS
SELECT PostGIS_version();

-- Quitter
\q
```

### Gestion du service PostgreSQL

```bash
# Démarrer PostgreSQL
sudo systemctl start postgresql

# Arrêter PostgreSQL
sudo systemctl stop postgresql

# Redémarrer PostgreSQL
sudo systemctl restart postgresql

# Voir le statut
sudo systemctl status postgresql

# Activer au démarrage
sudo systemctl enable postgresql
```

### Backup et Restore

```bash
# Backup de la base complète
pg_dump -h 82.208.22.230 -U asco_user asco_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup avec compression
pg_dump -h 82.208.22.230 -U asco_user asco_db | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore depuis un backup
psql -h 82.208.22.230 -U asco_user asco_db < backup.sql

# Restore depuis un backup compressé
gunzip -c backup.sql.gz | psql -h 82.208.22.230 -U asco_user asco_db
```

---

## 🌍 PostGIS

### Vérification de PostGIS

```sql
-- Vérifier si PostGIS est installé
SELECT PostGIS_version();

-- Activer PostGIS (si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Lister les fonctions PostGIS disponibles
\df+ ST_*
```

### Requêtes géospatiales courantes

```sql
-- Créer un point géographique
SELECT ST_MakePoint(-5.5471, 7.5392);

-- Calculer la distance entre deux points (en mètres)
SELECT ST_Distance(
  ST_MakePoint(-5.5471, 7.5392)::geography,
  ST_MakePoint(-5.5500, 7.5400)::geography
);

-- Trouver les parcelles dans un rayon de 5km
SELECT * FROM "Parcelle" 
WHERE ST_DWithin(
  ST_MakePoint(longitude, latitude)::geography,
  ST_MakePoint(-5.5471, 7.5392)::geography,
  5000
);

-- Calculer le centre géographique d'un ensemble de points
SELECT ST_Centroid(ST_Collect(ST_MakePoint(longitude, latitude)))
FROM "Parcelle"
WHERE id_producteur = 'xxx';
```

---

## 🔧 Git

### Commandes de base

```bash
# Voir le statut
git status

# Ajouter des fichiers
git add .

# Commiter
git commit -m "Migration vers PostgreSQL + PostGIS"

# Pousser vers GitHub
git push origin main

# Tirer les dernières modifications
git pull origin main

# Voir l'historique
git log --oneline

# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite
```

### Avant de commiter

```bash
# Vérifier que .env n'est pas tracké
git status | grep .env

# Si .env apparaît, l'ajouter à .gitignore
echo ".env" >> .gitignore
git add .gitignore
```

---

## 🔍 Debugging

### Logs PostgreSQL

```bash
# Voir les logs en temps réel (Linux)
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Voir les dernières lignes
sudo tail -n 100 /var/log/postgresql/postgresql-14-main.log
```

### Tester la connexion réseau

```bash
# Tester si le port PostgreSQL est ouvert
telnet 82.208.22.230 5432

# Ou avec nc (netcat)
nc -zv 82.208.22.230 5432

# Ping
ping 82.208.22.230
```

### Vérifier les processus

```bash
# Voir les processus Node.js
ps aux | grep node

# Voir les processus PostgreSQL
ps aux | grep postgres

# Voir les ports utilisés
netstat -tuln | grep 5432
netstat -tuln | grep 3000
```

### Tuer un processus

```bash
# Trouver le PID du processus sur le port 3000
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou en une commande
kill -9 $(lsof -t -i:3000)
```

---

## 🔒 Sécurité et Permissions

### Fichiers de configuration PostgreSQL

```bash
# Éditer pg_hba.conf (authentification)
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Éditer postgresql.conf (configuration)
sudo nano /etc/postgresql/14/main/postgresql.conf

# Après modification, redémarrer
sudo systemctl restart postgresql
```

### Pare-feu

```bash
# Voir le statut du pare-feu
sudo ufw status

# Autoriser PostgreSQL
sudo ufw allow 5432/tcp

# Autoriser une IP spécifique
sudo ufw allow from 192.168.1.100 to any port 5432

# Recharger le pare-feu
sudo ufw reload
```

---

## 📊 Monitoring et Performance

### Statistiques PostgreSQL

```sql
-- Voir les connexions actives
SELECT * FROM pg_stat_activity;

-- Voir la taille des bases de données
SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) 
FROM pg_database;

-- Voir la taille des tables
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Voir les requêtes lentes
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY duration DESC;
```

### Optimisation

```sql
-- Analyser une table
ANALYZE "Organisation";

-- Vacuum (nettoyage)
VACUUM ANALYZE "Organisation";

-- Créer un index
CREATE INDEX idx_producteur_code ON "Producteur"(code);

-- Créer un index spatial
CREATE INDEX idx_parcelle_location ON "Parcelle" 
USING GIST (ST_MakePoint(longitude, latitude));
```

---

## 🧪 Tests

### Test de connexion PostgreSQL

```bash
# Test simple
psql -h 82.208.22.230 -U asco_user -d asco_db -c "SELECT 1;"

# Test avec PostGIS
psql -h 82.208.22.230 -U asco_user -d asco_db -c "SELECT PostGIS_version();"
```

### Test de l'API

```bash
# Test avec curl
curl http://localhost:3000/api/organisations

# Test avec httpie (plus lisible)
http GET http://localhost:3000/api/organisations
```

---

## 🆘 Dépannage Rapide

### Problème : Cannot connect to PostgreSQL

```bash
# 1. Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# 2. Vérifier le pare-feu
sudo ufw status

# 3. Tester la connexion
psql -h 82.208.22.230 -U asco_user -d asco_db

# 4. Vérifier les logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Problème : Extension PostGIS not found

```bash
# Installer PostGIS
sudo apt install postgis

# Activer dans la base
sudo -u postgres psql asco_db
CREATE EXTENSION IF NOT EXISTS postgis;
\q
```

### Problème : Prisma client not generated

```bash
# Supprimer et régénérer
rm -rf node_modules/.prisma
npm run db:generate
```

### Problème : Port already in use

```bash
# Trouver et tuer le processus
kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:5432)
```

---

## 📱 Raccourcis Utiles

### Alias à ajouter dans ~/.bashrc ou ~/.zshrc

```bash
# Alias PostgreSQL
alias pgstart='sudo systemctl start postgresql'
alias pgstop='sudo systemctl stop postgresql'
alias pgrestart='sudo systemctl restart postgresql'
alias pgstatus='sudo systemctl status postgresql'
alias pglog='sudo tail -f /var/log/postgresql/postgresql-14-main.log'

# Alias Prisma
alias pgen='npx prisma generate'
alias ppush='npx prisma db push'
alias pstudio='npx prisma studio'
alias pmigrate='npx prisma migrate dev'

# Alias projet
alias backend='cd ~/cacaotrack-agent/server && npm run dev'
alias frontend='cd ~/cacaotrack-agent && npm run dev'
```

Après ajout, recharger :
```bash
source ~/.bashrc
# ou
source ~/.zshrc
```

---

## 📚 Ressources Rapides

- **Prisma Docs** : https://www.prisma.io/docs
- **PostgreSQL Docs** : https://www.postgresql.org/docs
- **PostGIS Docs** : https://postgis.net/documentation
- **Express Docs** : https://expressjs.com

---

**Astuce** : Gardez ce fichier ouvert dans un onglet pour référence rapide ! 📌
