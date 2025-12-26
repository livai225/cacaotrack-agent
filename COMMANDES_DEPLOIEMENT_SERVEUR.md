# 🚀 Commandes de Déploiement Serveur - CacaoTrack

## 📋 Prérequis Serveur

### 1. Connexion SSH au Serveur

```bash
ssh utilisateur@votre-serveur.com
# ou
ssh utilisateur@IP_DU_SERVEUR
```

## 🗑️ Supprimer l'Ancien Projet

### Option A : Suppression Complète (Recommandé)

```bash
# Se placer dans le répertoire parent
cd /var/www  # ou /home/username selon votre configuration

# Supprimer l'ancien projet
sudo rm -rf ancien-projet-cacaotrack
# ou
sudo rm -rf cacaotrack-agent

# Supprimer l'ancienne base de données MySQL
sudo mysql -u root -p
```

Dans MySQL :
```sql
DROP DATABASE IF EXISTS ancienne_base_cacaotrack;
DROP USER IF EXISTS 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Option B : Renommer l'Ancien (Sauvegarde)

```bash
cd /var/www
sudo mv ancien-projet-cacaotrack ancien-projet-cacaotrack.backup.$(date +%Y%m%d)
```

## 🛠️ Installation des Dépendances Système

### 1. Mettre à Jour le Système

```bash
# Ubuntu/Debian
sudo apt update
sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 2. Installer Node.js (Version 20.19.4 ou supérieure)

```bash
# Méthode 1 : Via NodeSource (Recommandé)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version  # Doit afficher v20.19.4 ou supérieur
npm --version
```

### 3. Installer MySQL

```bash
# Ubuntu/Debian
sudo apt install mysql-server -y

# Démarrer MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Sécuriser MySQL
sudo mysql_secure_installation
```

### 4. Installer Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx -y

# Démarrer Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérifier le statut
sudo systemctl status nginx
```

### 5. Installer Git

```bash
sudo apt install git -y
git --version
```

### 6. Installer PM2 (Gestionnaire de Processus Node.js)

```bash
sudo npm install -g pm2
pm2 --version
```

### 7. Installer Certbot (Pour HTTPS/SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## 📦 Installation du Projet

### 1. Cloner le Projet

```bash
# Se placer dans le répertoire web
cd /var/www

# Cloner le projet depuis GitHub
sudo git clone https://github.com/livai225/cacaotrack-agent.git cacaotrack-agent
sudo git clone https://github.com/livai225/cacaotrack-agent.git cacaotrack-agent

# Donner les permissions
sudo chown -R $USER:$USER /var/www/cacaotrack-agent
cd /var/www/cacaotrack-agent
```

### 2. Configurer la Base de Données MySQL

```bash
# Se connecter à MySQL
sudo mysql -u root -p
```

Dans MySQL :
```sql
-- Créer la base de données
CREATE DATABASE asco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur dédié
CREATE USER 'cacaotrack_user'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_SECURISE';

-- Donner les permissions
GRANT ALL PRIVILEGES ON asco.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;

-- Vérifier
SHOW DATABASES;
EXIT;
```

### 3. Configurer le Backend

```bash
# Aller dans le dossier server
cd /var/www/cacaotrack-agent/server

# Installer les dépendances
npm install

# Créer le fichier .env
nano .env
```

Contenu du fichier `.env` :
```env
DATABASE_URL="mysql://cacaotrack_user:VOTRE_MOT_DE_PASSE_SECURISE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="GENERER_UN_SECRET_TRES_LONG_ET_SECURISE_ICI_CHANGEZ_MOI"
```

Générer un secret JWT sécurisé :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base de données
npx prisma db push

# Vérifier la connexion
npx prisma studio  # Optionnel, pour vérifier la DB
```

### 4. Démarrer le Backend avec PM2

```bash
# Depuis le dossier server
pm2 start src/index.ts --name cacaotrack-api --interpreter ts-node

# Ou créer un fichier ecosystem.config.js
cd /var/www/cacaotrack-agent
nano ecosystem.config.js
```

Contenu de `ecosystem.config.js` :
```javascript
module.exports = {
  apps: [{
    name: 'cacaotrack-api',
    script: 'server/src/index.ts',
    interpreter: 'ts-node',
    cwd: '/var/www/cacaotrack-agent',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/cacaotrack-api-error.log',
    out_file: '/var/log/pm2/cacaotrack-api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

```bash
# Démarrer avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Suivre les instructions affichées

# Vérifier le statut
pm2 status
pm2 logs cacaotrack-api
```

### 5. Configurer le Frontend

```bash
# Retourner à la racine du projet
cd /var/www/cacaotrack-agent

# Installer les dépendances
npm install

# Créer le fichier .env.production
nano .env.production
```

Contenu de `.env.production` :
```env
VITE_API_URL="https://votre-domaine.com/api"
```

```bash
# Build le frontend
npm run build

# Vérifier que le dossier dist/ a été créé
ls -la dist/
```

### 6. Configurer Nginx

```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/cacaotrack
```

Contenu de la configuration :
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection vers HTTPS (après configuration SSL)
    # return 301 https://$server_name$request_uri;

    # Frontend
    root /var/www/cacaotrack-agent/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket pour Socket.IO
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Fichiers statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/

# Vérifier la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### 7. Configurer HTTPS (SSL) avec Let's Encrypt

```bash
# Obtenir un certificat SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Suivre les instructions
# Certbot va automatiquement modifier la configuration Nginx

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

## 🔍 Vérifications Post-Installation

### 1. Vérifier le Backend

```bash
# Vérifier que PM2 tourne
pm2 status

# Vérifier les logs
pm2 logs cacaotrack-api --lines 50

# Tester l'API
curl http://localhost:3000/api/health
curl http://localhost:3000/api
```

### 2. Vérifier le Frontend

```bash
# Vérifier que les fichiers sont présents
ls -la /var/www/cacaotrack-agent/dist/

# Tester depuis le navigateur
# http://votre-domaine.com
```

### 3. Vérifier Nginx

```bash
# Vérifier le statut
sudo systemctl status nginx

# Vérifier les logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 4. Vérifier MySQL

```bash
# Se connecter
sudo mysql -u cacaotrack_user -p asco

# Vérifier les tables
SHOW TABLES;

# Vérifier une table
SELECT COUNT(*) FROM Organisation;
EXIT;
```

## 🔄 Commandes de Maintenance

### Redémarrer le Backend

```bash
pm2 restart cacaotrack-api
# ou
pm2 restart all
```

### Redémarrer Nginx

```bash
sudo systemctl restart nginx
```

### Voir les Logs

```bash
# Logs PM2
pm2 logs cacaotrack-api

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Logs MySQL
sudo tail -f /var/log/mysql/error.log
```

### Mettre à Jour le Projet

```bash
cd /var/www/cacaotrack-agent

# Récupérer les dernières modifications
git pull origin main

# Mettre à jour le backend
cd server
npm install
npx prisma generate
npx prisma db push
pm2 restart cacaotrack-api

# Mettre à jour le frontend
cd ..
npm install
npm run build

# Redémarrer Nginx
sudo systemctl reload nginx
```

## 🗑️ Script de Nettoyage Complet (Si Besoin de Recommencer)

```bash
#!/bin/bash
# Script pour supprimer complètement et recommencer

# Arrêter PM2
pm2 stop cacaotrack-api
pm2 delete cacaotrack-api

# Supprimer le projet
sudo rm -rf /var/www/cacaotrack-agent

# Supprimer la base de données
sudo mysql -u root -p <<EOF
DROP DATABASE IF EXISTS asco;
DROP USER IF EXISTS 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Supprimer la configuration Nginx
sudo rm /etc/nginx/sites-enabled/cacaotrack
sudo rm /etc/nginx/sites-available/cacaotrack
sudo nginx -t
sudo systemctl reload nginx

echo "Nettoyage terminé. Vous pouvez maintenant recommencer l'installation."
```

Sauvegarder dans `cleanup.sh` et exécuter :
```bash
chmod +x cleanup.sh
./cleanup.sh
```

## 📝 Checklist Complète

- [ ] Serveur mis à jour
- [ ] Node.js installé (>= 20.19.4)
- [ ] MySQL installé et configuré
- [ ] Nginx installé
- [ ] Git installé
- [ ] PM2 installé
- [ ] Certbot installé
- [ ] Ancien projet supprimé
- [ ] Base de données créée
- [ ] Projet cloné
- [ ] Backend configuré (.env)
- [ ] Prisma généré et poussé
- [ ] Backend démarré avec PM2
- [ ] Frontend buildé
- [ ] Nginx configuré
- [ ] SSL configuré
- [ ] Tests effectués

## 🆘 En Cas de Problème

### Backend ne démarre pas
```bash
pm2 logs cacaotrack-api
# Vérifier les erreurs dans les logs
```

### Base de données inaccessible
```bash
sudo mysql -u root -p
# Vérifier que l'utilisateur existe et a les permissions
```

### Nginx erreur 502
```bash
# Vérifier que le backend tourne
pm2 status
curl http://localhost:3000/api/health
```

### Frontend ne charge pas
```bash
# Vérifier les permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist
```

