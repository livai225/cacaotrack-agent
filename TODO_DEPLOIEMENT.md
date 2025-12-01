# ✅ TODO - Déploiement sur VM

Liste de vérification pour le déploiement de CacaoTrack sur la VM distante.

---

## 📋 Checklist Complète

### 🖥️ Étape 1 : Préparation de la VM

- [ ] **1.1** Connexion SSH à la VM
  ```bash
  ssh user@82.208.22.230
  ```

- [ ] **1.2** Mise à jour du système
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

- [ ] **1.3** Installation de Node.js 18+
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
  node --version  # Vérifier >= 18
  ```

- [ ] **1.4** Installation de PostgreSQL
  ```bash
  sudo apt install -y postgresql postgresql-contrib
  psql --version  # Vérifier l'installation
  ```

- [ ] **1.5** Installation de PostGIS
  ```bash
  sudo apt install -y postgis
  ```

- [ ] **1.6** Installation de Git
  ```bash
  sudo apt install -y git
  git --version
  ```

---

### 🗄️ Étape 2 : Configuration PostgreSQL

- [ ] **2.1** Démarrer PostgreSQL
  ```bash
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  sudo systemctl status postgresql  # Vérifier qu'il tourne
  ```

- [ ] **2.2** Créer la base de données
  ```bash
  sudo -u postgres psql
  ```
  
  Dans psql :
  ```sql
  CREATE DATABASE asco_db;
  CREATE USER asco_user WITH ENCRYPTED PASSWORD 'AscoSecure2024!';
  GRANT ALL PRIVILEGES ON DATABASE asco_db TO asco_user;
  \c asco_db
  CREATE EXTENSION IF NOT EXISTS postgis;
  SELECT PostGIS_version();  -- Vérifier PostGIS
  \q
  ```

- [ ] **2.3** Configurer l'accès distant
  
  Éditer `pg_hba.conf` :
  ```bash
  sudo nano /etc/postgresql/14/main/pg_hba.conf
  ```
  
  Ajouter à la fin :
  ```
  host    asco_db    asco_user    0.0.0.0/0    md5
  ```
  
  Éditer `postgresql.conf` :
  ```bash
  sudo nano /etc/postgresql/14/main/postgresql.conf
  ```
  
  Modifier :
  ```
  listen_addresses = '*'
  ```

- [ ] **2.4** Redémarrer PostgreSQL
  ```bash
  sudo systemctl restart postgresql
  ```

- [ ] **2.5** Configurer le pare-feu
  ```bash
  sudo ufw allow 5432/tcp
  sudo ufw reload
  sudo ufw status  # Vérifier
  ```

- [ ] **2.6** Tester la connexion
  ```bash
  psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432
  # Entrer le mot de passe : AscoSecure2024!
  \q
  ```

---

### 📦 Étape 3 : Installation du Projet

- [ ] **3.1** Cloner le projet
  ```bash
  cd ~
  git clone https://github.com/livai225/cacaotrack-agent.git
  cd cacaotrack-agent
  ```

- [ ] **3.2** Installer les dépendances frontend
  ```bash
  npm install
  ```

- [ ] **3.3** Installer les dépendances backend
  ```bash
  cd server
  npm install
  ```

- [ ] **3.4** Créer le fichier .env
  ```bash
  cp .env.example .env
  nano .env
  ```
  
  Vérifier le contenu :
  ```env
  DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
  PORT=3000
  ```

---

### 🔧 Étape 4 : Configuration de la Base de Données

- [ ] **4.1** Rendre le script exécutable
  ```bash
  chmod +x scripts/setup-db.sh
  ```

- [ ] **4.2** Exécuter le script de configuration
  ```bash
  ./scripts/setup-db.sh
  ```
  
  Le script va :
  - ✓ Vérifier PostgreSQL et PostGIS
  - ✓ Tester la connexion
  - ✓ Activer PostGIS
  - ✓ Générer le client Prisma
  - ✓ Créer les tables

- [ ] **4.3** Vérifier que les tables sont créées
  ```bash
  psql -h 82.208.22.230 -U asco_user -d asco_db
  \dt  # Lister les tables
  \q
  ```

- [ ] **4.4** (Optionnel) Peupler avec des données de test
  ```bash
  npm run db:seed
  ```

---

### 🚀 Étape 5 : Lancement de l'Application

- [ ] **5.1** Tester le backend
  ```bash
  cd ~/cacaotrack-agent/server
  npm run dev
  ```
  
  Vérifier dans les logs :
  ```
  Serveur ASCO Track démarré sur http://localhost:3000
  ```
  
  Arrêter avec `Ctrl+C`

- [ ] **5.2** Tester le frontend
  ```bash
  cd ~/cacaotrack-agent
  npm run dev
  ```
  
  Vérifier que Vite démarre
  
  Arrêter avec `Ctrl+C`

---

### 🔄 Étape 6 : Configuration pour Production (Optionnel)

- [ ] **6.1** Installer PM2 (gestionnaire de processus)
  ```bash
  sudo npm install -g pm2
  ```

- [ ] **6.2** Créer un fichier ecosystem.config.js
  ```bash
  cd ~/cacaotrack-agent
  nano ecosystem.config.js
  ```
  
  Contenu :
  ```javascript
  module.exports = {
    apps: [
      {
        name: 'cacaotrack-backend',
        cwd: './server',
        script: 'npm',
        args: 'run dev',
        env: {
          NODE_ENV: 'production',
        }
      }
    ]
  };
  ```

- [ ] **6.3** Démarrer avec PM2
  ```bash
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup
  ```

- [ ] **6.4** Vérifier le statut
  ```bash
  pm2 status
  pm2 logs cacaotrack-backend
  ```

---

### 🌐 Étape 7 : Configuration Nginx (Optionnel)

- [ ] **7.1** Installer Nginx
  ```bash
  sudo apt install -y nginx
  ```

- [ ] **7.2** Créer la configuration
  ```bash
  sudo nano /etc/nginx/sites-available/cacaotrack
  ```
  
  Contenu :
  ```nginx
  server {
      listen 80;
      server_name 82.208.22.230;

      location /api {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }

      location / {
          proxy_pass http://localhost:5173;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }
  ```

- [ ] **7.3** Activer la configuration
  ```bash
  sudo ln -s /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/
  sudo nginx -t  # Tester la config
  sudo systemctl restart nginx
  ```

- [ ] **7.4** Configurer le pare-feu
  ```bash
  sudo ufw allow 'Nginx Full'
  sudo ufw reload
  ```

---

### ✅ Étape 8 : Tests Finaux

- [ ] **8.1** Test de connexion PostgreSQL
  ```bash
  psql "postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db" -c "SELECT 1;"
  ```

- [ ] **8.2** Test PostGIS
  ```bash
  psql "postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db" -c "SELECT PostGIS_version();"
  ```

- [ ] **8.3** Test API Backend
  ```bash
  curl http://localhost:3000/api/organisations
  # ou depuis votre machine locale
  curl http://82.208.22.230:3000/api/organisations
  ```

- [ ] **8.4** Test Frontend
  Ouvrir dans le navigateur :
  - Local : http://localhost:5173
  - Distant : http://82.208.22.230 (si Nginx configuré)

- [ ] **8.5** Test Prisma Studio
  ```bash
  cd ~/cacaotrack-agent/server
  npx prisma studio
  ```
  Ouvrir : http://82.208.22.230:5555

---

### 📊 Étape 9 : Monitoring et Logs

- [ ] **9.1** Configurer les logs PostgreSQL
  ```bash
  sudo tail -f /var/log/postgresql/postgresql-14-main.log
  ```

- [ ] **9.2** Logs de l'application (si PM2)
  ```bash
  pm2 logs cacaotrack-backend
  ```

- [ ] **9.3** Logs Nginx (si configuré)
  ```bash
  sudo tail -f /var/log/nginx/access.log
  sudo tail -f /var/log/nginx/error.log
  ```

---

### 🔒 Étape 10 : Sécurité

- [ ] **10.1** Configurer un backup automatique
  ```bash
  # Créer un script de backup
  nano ~/backup-db.sh
  ```
  
  Contenu :
  ```bash
  #!/bin/bash
  BACKUP_DIR=~/backups
  mkdir -p $BACKUP_DIR
  pg_dump -h 82.208.22.230 -U asco_user asco_db > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql
  # Garder seulement les 7 derniers backups
  ls -t $BACKUP_DIR/backup_*.sql | tail -n +8 | xargs rm -f
  ```
  
  ```bash
  chmod +x ~/backup-db.sh
  ```

- [ ] **10.2** Ajouter au crontab (backup quotidien à 2h du matin)
  ```bash
  crontab -e
  ```
  
  Ajouter :
  ```
  0 2 * * * /home/user/backup-db.sh
  ```

- [ ] **10.3** Configurer SSL (recommandé pour production)
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d votre-domaine.com
  ```

---

## 🎉 Résumé Final

### ✅ Ce qui doit être fait

1. ✓ VM préparée avec Node.js, PostgreSQL, PostGIS
2. ✓ Base de données créée et configurée
3. ✓ Projet cloné et dépendances installées
4. ✓ Tables créées via Prisma
5. ✓ Application testée et fonctionnelle

### 📱 Accès à l'application

- **Backend API** : http://82.208.22.230:3000/api
- **Frontend** : http://82.208.22.230:5173 (dev) ou :80 (prod avec Nginx)
- **Prisma Studio** : http://82.208.22.230:5555
- **PostgreSQL** : 82.208.22.230:5432

### 🔑 Identifiants

- **DB User** : asco_user
- **DB Password** : AscoSecure2024!
- **DB Name** : asco_db

### 📚 Documentation

- Guide complet : [MIGRATION_POSTGRESQL.md](./MIGRATION_POSTGRESQL.md)
- Guide rapide : [QUICKSTART.md](./QUICKSTART.md)
- Commandes : [COMMANDES_UTILES.md](./COMMANDES_UTILES.md)

---

## 🆘 En cas de problème

1. Consulter [COMMANDES_UTILES.md](./COMMANDES_UTILES.md) section Dépannage
2. Vérifier les logs PostgreSQL
3. Vérifier les logs de l'application
4. Tester la connexion réseau

---

**Bon déploiement ! 🚀**
