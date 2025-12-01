# 📋 Résumé des Changements - Migration PostgreSQL + PostGIS

**Date** : 1er décembre 2025  
**Type** : Migration de base de données  
**Statut** : ✅ Terminé

---

## 🎯 Objectif

Migrer le projet CacaoTrack de **MySQL** vers **PostgreSQL + PostGIS** pour bénéficier de fonctionnalités géospatiales avancées et d'une meilleure performance.

---

## 📝 Fichiers Modifiés

### 1. **server/prisma/schema.prisma**
- ✅ Provider changé : `mysql` → `postgresql`
- ✅ URL de connexion : utilise maintenant `env("DATABASE_URL")`
- ✅ Compatible avec PostGIS

### 2. **server/src/index.ts**
- ✅ Ajout de `import 'dotenv/config'` pour charger les variables d'environnement
- ✅ Le reste du code reste inchangé (compatible PostgreSQL)

### 3. **README.md**
- ✅ Section "Démarrage rapide" mise à jour
- ✅ Ajout des prérequis PostgreSQL + PostGIS
- ✅ Instructions de configuration de la base de données
- ✅ Technologies mises à jour

---

## 📄 Nouveaux Fichiers Créés

### Documentation

1. **MIGRATION_POSTGRESQL.md**
   - Guide complet de migration
   - Configuration de PostgreSQL
   - Instructions de déploiement sur VM
   - Commandes utiles
   - Troubleshooting

2. **QUICKSTART.md**
   - Guide de démarrage rapide
   - Instructions pour VM (Linux)
   - Instructions pour Windows
   - Vérifications et tests
   - Problèmes courants

3. **CHANGEMENTS_EFFECTUES.md** (ce fichier)
   - Résumé de tous les changements

### Configuration

4. **server/.env.example**
   ```env
   DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
   PORT=3000
   ```

5. **server/.gitignore**
   - Ignore les fichiers `.env`
   - Ignore `node_modules`
   - Ignore les migrations sauf `00_init_postgis`

### Scripts d'automatisation

6. **server/scripts/setup-db.sh** (Linux/Mac)
   - Script Bash pour configuration automatique
   - Vérifie PostgreSQL et PostGIS
   - Crée le fichier .env
   - Génère le client Prisma
   - Applique le schéma

7. **server/scripts/setup-db.ps1** (Windows)
   - Script PowerShell équivalent
   - Mêmes fonctionnalités que le script Bash

### Migration PostGIS

8. **server/prisma/migrations/00_init_postgis/migration.sql**
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

---

## 🔧 Configuration de la Base de Données

### Informations de connexion

| Paramètre | Valeur |
|-----------|--------|
| **Type** | PostgreSQL 14+ avec PostGIS |
| **Hôte** | 82.208.22.230 |
| **Port** | 5432 |
| **Base de données** | asco_db |
| **Utilisateur** | asco_user |
| **Mot de passe** | AscoSecure2024! |

### URL de connexion complète
```
postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public
```

---

## 🚀 Prochaines Étapes pour Déploiement

### Sur la VM distante

1. **Installer PostgreSQL + PostGIS**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib postgis
   ```

2. **Créer la base de données**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE asco_db;
   CREATE USER asco_user WITH ENCRYPTED PASSWORD 'AscoSecure2024!';
   GRANT ALL PRIVILEGES ON DATABASE asco_db TO asco_user;
   \c asco_db
   CREATE EXTENSION IF NOT EXISTS postgis;
   \q
   ```

3. **Configurer le pare-feu**
   ```bash
   sudo ufw allow 5432/tcp
   # Éditer pg_hba.conf et postgresql.conf
   sudo systemctl restart postgresql
   ```

4. **Cloner et configurer le projet**
   ```bash
   git clone https://github.com/livai225/cacaotrack-agent.git
   cd cacaotrack-agent
   npm install
   cd server
   npm install
   cp .env.example .env
   # Éditer .env si nécessaire
   chmod +x scripts/setup-db.sh
   ./scripts/setup-db.sh
   ```

5. **Lancer l'application**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd ..
   npm run dev
   ```

### Sur votre machine locale (Windows)

1. **Installer les prérequis**
   - Node.js 18+
   - PostgreSQL avec PostGIS
   - Git

2. **Cloner et configurer**
   ```powershell
   git clone https://github.com/livai225/cacaotrack-agent.git
   cd cacaotrack-agent
   npm install
   cd server
   npm install
   copy .env.example .env
   .\scripts\setup-db.ps1
   ```

3. **Lancer l'application**
   ```powershell
   # Terminal 1
   cd server
   npm run dev
   
   # Terminal 2
   cd ..
   npm run dev
   ```

---

## ✅ Avantages de PostgreSQL + PostGIS

### Par rapport à MySQL

| Fonctionnalité | MySQL | PostgreSQL + PostGIS |
|----------------|-------|----------------------|
| **Types géospatiaux** | Basique | Avancé (POINT, POLYGON, etc.) |
| **Requêtes spatiales** | Limitées | Très puissantes |
| **Index spatiaux** | R-Tree | GiST, SP-GiST |
| **Fonctions géo** | ~50 | 400+ |
| **Performance JSON** | JSON | JSONB (indexable) |
| **Conformité SQL** | Partielle | Complète |
| **Extensions** | Limitées | Nombreuses |
| **Transactions** | InnoDB | MVCC natif |

### Fonctionnalités PostGIS disponibles

- **Calcul de distances** : Entre parcelles, sections, etc.
- **Zones tampons** : Créer des zones autour des points
- **Intersections** : Trouver les parcelles dans une région
- **Agrégations spatiales** : Regrouper par proximité
- **Validation géométrique** : Vérifier la validité des coordonnées
- **Transformations** : Conversion entre systèmes de coordonnées

---

## 🔍 Champs Géographiques dans le Schéma

### Section
- `point_geographique` : String (format "lat,long")
  - **Optimisation future** : Convertir en `geometry(Point, 4326)`

### Parcelle
- `latitude` : Float
- `longitude` : Float
  - **Optimisation future** : Créer un champ `location geometry(Point, 4326)`

---

## 📊 Commandes Utiles

### Prisma

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la DB (sans migrations)
npm run db:push

# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Peupler avec des données de test
npm run db:seed

# Ouvrir Prisma Studio
npx prisma studio
```

### PostgreSQL

```bash
# Se connecter à la base
psql "postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db"

# Lister les tables
\dt

# Voir la structure d'une table
\d "Organisation"

# Vérifier PostGIS
SELECT PostGIS_version();

# Backup
pg_dump -h 82.208.22.230 -U asco_user asco_db > backup.sql

# Restore
psql -h 82.208.22.230 -U asco_user asco_db < backup.sql
```

---

## 🔐 Sécurité

### Fichiers sensibles (déjà dans .gitignore)

- ✅ `.env` - Variables d'environnement
- ✅ `.env.local` - Configuration locale
- ✅ `.env.production` - Configuration production

### Bonnes pratiques

1. **Ne jamais commiter** les fichiers `.env`
2. **Utiliser des mots de passe forts** pour PostgreSQL
3. **Limiter les accès** via `pg_hba.conf`
4. **Activer SSL** pour les connexions distantes (recommandé)
5. **Sauvegardes régulières** de la base de données

---

## 🐛 Problèmes Potentiels et Solutions

### 1. Erreur de connexion PostgreSQL

**Symptôme** : `ECONNREFUSED` ou timeout

**Solutions** :
- Vérifier que PostgreSQL est démarré : `sudo systemctl status postgresql`
- Vérifier le pare-feu : `sudo ufw status`
- Vérifier `pg_hba.conf` et `postgresql.conf`
- Tester la connexion : `psql -h 82.208.22.230 -U asco_user -d asco_db`

### 2. Extension PostGIS non trouvée

**Symptôme** : `ERROR: extension "postgis" does not exist`

**Solution** :
```bash
sudo apt install postgis
sudo -u postgres psql asco_db
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 3. Prisma ne trouve pas DATABASE_URL

**Symptôme** : `Environment variable not found: DATABASE_URL`

**Solution** :
- Vérifier que le fichier `.env` existe dans `server/`
- Vérifier que `dotenv` est importé dans `index.ts`
- Relancer le serveur

### 4. Erreur de migration

**Symptôme** : Erreur lors de `npm run db:push`

**Solution** :
```bash
# Réinitialiser Prisma
rm -rf node_modules/.prisma
npm run db:generate
npm run db:push
```

---

## 📈 Optimisations Futures Possibles

### 1. Utiliser les types géométriques PostGIS

Actuellement, les coordonnées sont stockées en Float. On pourrait optimiser avec :

```prisma
model Parcelle {
  // Au lieu de latitude/longitude séparés
  location Unsupported("geometry(Point, 4326)")?
}
```

### 2. Créer des index spatiaux

```sql
CREATE INDEX idx_parcelle_location ON "Parcelle" USING GIST (location);
```

### 3. Requêtes spatiales avancées

```sql
-- Trouver les parcelles dans un rayon de 5km
SELECT * FROM "Parcelle" 
WHERE ST_DWithin(
  location, 
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
  5000
);
```

### 4. Agrégations géographiques

```sql
-- Calculer le centre géographique d'une section
SELECT ST_Centroid(ST_Collect(location)) 
FROM "Parcelle" 
WHERE id_section = 'xxx';
```

---

## 📚 Ressources

### Documentation officielle

- [Prisma PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Tutoriels

- [PostGIS Tutorial](https://postgis.net/workshops/postgis-intro/)
- [Prisma with PostGIS](https://github.com/prisma/prisma/discussions/8807)

---

## ✨ Conclusion

La migration vers PostgreSQL + PostGIS est **terminée et prête pour le déploiement**.

### Fichiers à créer manuellement sur la VM

1. **server/.env** (copier depuis .env.example et adapter si nécessaire)

### Commandes pour démarrer

```bash
# Sur la VM
cd cacaotrack-agent/server
./scripts/setup-db.sh
npm run dev
```

### Vérification finale

- ✅ Schema Prisma modifié
- ✅ Variables d'environnement configurées
- ✅ Scripts d'automatisation créés
- ✅ Documentation complète
- ✅ README mis à jour
- ✅ Import dotenv ajouté

**Le projet est prêt ! 🎉**

---

**Questions ou problèmes ?** Consultez [MIGRATION_POSTGRESQL.md](./MIGRATION_POSTGRESQL.md) ou [QUICKSTART.md](./QUICKSTART.md)
