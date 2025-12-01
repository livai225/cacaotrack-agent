# 🚀 Guide de Démarrage Rapide - CacaoTrack

## Sur votre VM distante

### 1. Installation des prérequis

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de PostgreSQL et PostGIS
sudo apt install -y postgresql postgresql-contrib postgis

# Installation de Git
sudo apt install -y git

# Vérification
node --version
npm --version
psql --version
```

### 2. Configuration de PostgreSQL

```bash
# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans psql, exécuter :
CREATE DATABASE asco_db;
CREATE USER asco_user WITH ENCRYPTED PASSWORD 'AscoSecure2024!';
GRANT ALL PRIVILEGES ON DATABASE asco_db TO asco_user;
\c asco_db
CREATE EXTENSION IF NOT EXISTS postgis;
SELECT PostGIS_version();
\q
```

### 3. Configuration du pare-feu

```bash
# Autoriser PostgreSQL
sudo ufw allow 5432/tcp

# Éditer pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Ajouter : host    asco_db    asco_user    0.0.0.0/0    md5

# Éditer postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf
# Modifier : listen_addresses = '*'

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### 4. Cloner et configurer le projet

```bash
# Cloner le projet
git clone https://github.com/livai225/cacaotrack-agent.git
cd cacaotrack-agent

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd server
npm install

# Créer le fichier .env
cp .env.example .env
nano .env
# Vérifier que DATABASE_URL est correct

# Configurer la base de données
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

### 5. Lancer l'application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd ..
npm run dev
```

---

## Sur votre machine locale (Windows)

### 1. Prérequis

- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL avec PostGIS](https://www.postgresql.org/download/windows/)
- [Git](https://git-scm.com/download/win)

### 2. Cloner le projet

```powershell
git clone https://github.com/livai225/cacaotrack-agent.git
cd cacaotrack-agent
```

### 3. Configuration

```powershell
# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd server
npm install

# Créer le fichier .env
copy .env.example .env
notepad .env
# Vérifier DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
```

### 4. Initialiser la base de données

```powershell
# Depuis le dossier server/
.\scripts\setup-db.ps1
```

### 5. Lancer l'application

```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend (depuis la racine)
cd ..
npm run dev
```

---

## 🧪 Vérification

### Test de connexion à la base de données

```bash
# Depuis n'importe où
psql "postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db"

# Dans psql
\dt  # Lister les tables
\q   # Quitter
```

### Ouvrir Prisma Studio

```bash
cd server
npx prisma studio
# Ouvre http://localhost:5555
```

### Accéder à l'application

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3000
- **Prisma Studio** : http://localhost:5555

---

## 🔧 Commandes utiles

```bash
# Régénérer le client Prisma après modification du schema
npm run db:generate

# Pousser les changements de schema vers la DB
npm run db:push

# Créer une migration
npx prisma migrate dev --name nom_migration

# Peupler avec des données de test
npm run db:seed

# Voir les logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## ❓ Problèmes courants

### Erreur de connexion à PostgreSQL

```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Vérifier le pare-feu
sudo ufw status

# Tester la connexion
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432
```

### Extension PostGIS non trouvée

```bash
sudo -u postgres psql asco_db
CREATE EXTENSION IF NOT EXISTS postgis;
SELECT PostGIS_version();
```

### Port déjà utilisé

```bash
# Trouver le processus utilisant le port 3000
lsof -i :3000
# ou sur Windows
netstat -ano | findstr :3000

# Tuer le processus
kill -9 <PID>
```

---

## 📚 Documentation complète

- [MIGRATION_POSTGRESQL.md](./MIGRATION_POSTGRESQL.md) - Guide de migration détaillé
- [README.md](./README.md) - Documentation principale
- [docs/](./docs/) - Documentation complète du projet

---

**Prêt à coder ! 🎉**
