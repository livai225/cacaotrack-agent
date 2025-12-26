# 🖥️ Commandes à Exécuter Directement sur le Serveur

Vous êtes déjà connecté au serveur (`asco@vmi2940908`). Voici les commandes à exécuter directement.

## Option 1 : Créer les Scripts Directement sur le Serveur

### 1. Créer le Script de Nettoyage

```bash
nano /tmp/NETTOYAGE_ANCIEN_PROJET.sh
```

Copiez-collez le contenu du fichier `NETTOYAGE_ANCIEN_PROJET.sh` (depuis votre machine Windows), puis :
- Appuyez sur `Ctrl+X` pour quitter
- Appuyez sur `Y` pour sauvegarder
- Appuyez sur `Entrée` pour confirmer

### 2. Créer le Script d'Installation

```bash
nano /tmp/INSTALLATION_RAPIDE.sh
```

Copiez-collez le contenu du fichier `INSTALLATION_RAPIDE.sh`, puis sauvegarder.

### 3. Rendre les Scripts Exécutables

```bash
chmod +x /tmp/NETTOYAGE_ANCIEN_PROJET.sh
chmod +x /tmp/INSTALLATION_RAPIDE.sh
```

## Option 2 : Transférer depuis Votre Machine Windows

### Depuis votre machine Windows (PowerShell) :

```powershell
# Se placer dans le dossier du projet
cd C:\Users\Dell\Documents\GitHub\cacaotrack-agent

# Transférer les fichiers vers le serveur
scp NETTOYAGE_ANCIEN_PROJET.sh asco@vmi2940908.contaboserver.net:/tmp/
scp INSTALLATION_RAPIDE.sh asco@vmi2940908.contaboserver.net:/tmp/
```

Puis sur le serveur :
```bash
chmod +x /tmp/NETTOYAGE_ANCIEN_PROJET.sh
chmod +x /tmp/INSTALLATION_RAPIDE.sh
```

## Option 3 : Installation Manuelle (Recommandé)

Puisque vous êtes déjà sur le serveur, voici les commandes directes :

### 1. Supprimer l'Ancien Projet

```bash
# Arrêter PM2
pm2 stop all
pm2 delete all

# Supprimer l'ancien projet (ajustez le chemin si nécessaire)
sudo rm -rf /var/www/cacaotrack-agent
# ou
sudo rm -rf ~/cacaotrack-agent

# Supprimer la base de données
sudo mysql -u root -p
```

Dans MySQL :
```sql
DROP DATABASE IF EXISTS asco;
DROP USER IF EXISTS 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Installer les Dépendances

```bash
# Mise à jour
sudo apt update
sudo apt upgrade -y

# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier
node --version
npm --version

# MySQL (si pas déjà installé)
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# PM2
sudo npm install -g pm2

# Certbot (pour SSL)
sudo apt install certbot python3-certbot-nginx -y
```

### 3. Cloner le Projet

```bash
# Aller dans /var/www
cd /var/www

# Cloner depuis GitHub
sudo git clone https://github.com/livai225/cacaotrack-agent.git cacaotrack-agent

# Ou si vous avez déjà le projet ailleurs, copiez-le
# sudo cp -r ~/cacaotrack-agent /var/www/

# Permissions
sudo chown -R $USER:$USER /var/www/cacaotrack-agent
cd /var/www/cacaotrack-agent
```

### 4. Configurer la Base de Données

```bash
sudo mysql -u root -p
```

Dans MySQL :
```sql
CREATE DATABASE asco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cacaotrack_user'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_SECURISE';
GRANT ALL PRIVILEGES ON asco.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Configurer le Backend

```bash
cd /var/www/cacaotrack-agent/server

# Installer les dépendances
npm install

# Créer le fichier .env
nano .env
```

Contenu de `.env` :
```env
DATABASE_URL="mysql://cacaotrack_user:VOTRE_MOT_DE_PASSE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="GENERER_UN_SECRET_ICI"
```

Générer un secret JWT :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```bash
# Générer Prisma
npx prisma generate
npx prisma db push
```

### 6. Démarrer le Backend

```bash
# Démarrer avec PM2
pm2 start src/index.ts --name cacaotrack-api --interpreter ts-node
pm2 save
pm2 startup
# Suivre les instructions affichées

# Vérifier
pm2 status
pm2 logs cacaotrack-api
```

### 7. Configurer le Frontend

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

### 8. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/cacaotrack
```

Coller cette configuration :
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    root /var/www/cacaotrack-agent/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

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

    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Tester
sudo nginx -t

# Recharger
sudo systemctl reload nginx
```

### 9. Configurer SSL (Optionnel)

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

## Vérifications

```bash
# Backend
pm2 status
curl http://localhost:3000/api/health

# Frontend
curl http://localhost

# MySQL
sudo mysql -u root -p -e "SHOW DATABASES;"
```

