# Migration vers PostgreSQL + PostGIS

## 📋 Résumé des changements

Le projet CacaoTrack a été migré de **MySQL** vers **PostgreSQL + PostGIS** pour bénéficier des fonctionnalités géospatiales avancées.

## 🔧 Configuration de la base de données

### Informations de connexion

- **Type** : PostgreSQL avec extension PostGIS
- **Hôte** : 82.208.22.230
- **Port** : 5432
- **Base de données** : asco_db
- **Utilisateur** : asco_user
- **Mot de passe** : AscoSecure2024!

### URL de connexion complète
```
postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public
```

## 🚀 Instructions de déploiement sur VM

### 1. Prérequis sur la VM

Assurez-vous que PostgreSQL et PostGIS sont installés :

```bash
# Sur Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib postgis

# Vérifier l'installation
psql --version
```

### 2. Configuration de la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données et l'utilisateur
CREATE DATABASE asco_db;
CREATE USER asco_user WITH ENCRYPTED PASSWORD 'AscoSecure2024!';
GRANT ALL PRIVILEGES ON DATABASE asco_db TO asco_user;

# Se connecter à la base asco_db
\c asco_db

# Activer l'extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

# Vérifier l'installation de PostGIS
SELECT PostGIS_version();

# Quitter
\q
```

### 3. Configuration du projet sur la VM

```bash
# Cloner le projet (si pas déjà fait)
git clone https://github.com/livai225/cacaotrack-agent.git
cd cacaotrack-agent

# Installer les dépendances du frontend
npm install

# Installer les dépendances du backend
cd server
npm install
```

### 4. Configuration des variables d'environnement

Créer le fichier `.env` dans le dossier `server/` :

```bash
# Dans server/
cp .env.example .env
```

Contenu du fichier `.env` :
```env
DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
PORT=3000
```

### 5. Initialisation de la base de données

```bash
# Dans le dossier server/
cd server

# Générer le client Prisma
npm run db:generate

# Créer les tables (push schema vers la DB)
npm run db:push

# (Optionnel) Peupler avec des données de test
npm run db:seed
```

### 6. Lancement de l'application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend (depuis la racine)
cd ..
npm run dev
```

## 📊 Modifications du schéma

### Changements principaux

1. **Provider** : `mysql` → `postgresql`
2. **URL de connexion** : Utilisation de variable d'environnement
3. **Extension PostGIS** : Activée pour les fonctionnalités géospatiales

### Champs géographiques

Le projet contient des données géographiques dans :

- **Section.point_geographique** : String (format "lat,long")
- **Parcelle.latitude** : Float
- **Parcelle.longitude** : Float

> **Note** : Ces champs restent en Float pour le moment. Une optimisation future pourrait utiliser le type `geometry(Point, 4326)` de PostGIS pour des requêtes spatiales avancées.

## 🔒 Sécurité

### Configuration du pare-feu PostgreSQL

Pour autoriser les connexions depuis votre machine locale :

```bash
# Éditer pg_hba.conf
sudo nano /etc/postgresql/[version]/main/pg_hba.conf

# Ajouter cette ligne (adapter l'IP selon votre besoin)
host    asco_db    asco_user    0.0.0.0/0    md5

# Éditer postgresql.conf
sudo nano /etc/postgresql/[version]/main/postgresql.conf

# Modifier listen_addresses
listen_addresses = '*'

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### Pare-feu système

```bash
# Autoriser le port 5432
sudo ufw allow 5432/tcp
sudo ufw reload
```

## 🧪 Tests de connexion

### Depuis la VM

```bash
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432
```

### Depuis votre machine locale

```bash
psql "postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db"
```

## 📝 Scripts disponibles

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la DB (sans migrations)
npm run db:push

# Créer une migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Peupler la base avec des données de test
npm run db:seed

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

## 🔄 Différences MySQL vs PostgreSQL

| Aspect | MySQL | PostgreSQL |
|--------|-------|------------|
| Type de données JSON | `JSON` | `JSONB` (plus performant) |
| UUID | Nécessite extension | Natif |
| Géospatial | Limité | PostGIS (très puissant) |
| Transactions | InnoDB | MVCC natif |
| Extensions | Limitées | Nombreuses (PostGIS, pg_trgm, etc.) |

## 🚨 Points d'attention

1. **Sauvegarde régulière** : Configurez des backups automatiques
   ```bash
   pg_dump -h 82.208.22.230 -U asco_user asco_db > backup_$(date +%Y%m%d).sql
   ```

2. **Performance** : Créez des index sur les champs fréquemment recherchés
   ```sql
   CREATE INDEX idx_producteur_code ON "Producteur"(code);
   CREATE INDEX idx_parcelle_location ON "Parcelle" USING GIST (ST_MakePoint(longitude, latitude));
   ```

3. **Monitoring** : Surveillez les performances avec `pg_stat_statements`

## 📚 Ressources

- [Documentation Prisma PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Documentation PostGIS](https://postgis.net/documentation/)
- [Guide PostgreSQL](https://www.postgresql.org/docs/)

## ✅ Checklist de déploiement

- [ ] PostgreSQL installé sur la VM
- [ ] PostGIS activé
- [ ] Base de données `asco_db` créée
- [ ] Utilisateur `asco_user` créé avec les bons droits
- [ ] Pare-feu configuré (port 5432)
- [ ] Fichier `.env` créé dans `server/`
- [ ] Dépendances installées (`npm install`)
- [ ] Client Prisma généré (`npm run db:generate`)
- [ ] Schéma poussé vers la DB (`npm run db:push`)
- [ ] Tests de connexion réussis
- [ ] Application lancée et fonctionnelle

---

**Date de migration** : 1er décembre 2025  
**Version** : 1.0.0
