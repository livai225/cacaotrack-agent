# 🚀 Installation Complète - Serveur Propre

## ✅ État Actuel

Le serveur a été nettoyé :
- ✅ User `asco` existe
- ✅ Nginx installé (configuration par défaut)
- ✅ PostgreSQL installé (vide)
- ✅ Node.js, PM2, Git installés
- ❌ Aucun projet
- ❌ Aucune base de données
- ❌ Aucun site web configuré

## 📋 Installation Complète

### Étape 1 : Cloner le Projet

```bash
cd /var/www
sudo git clone https://github.com/livai225/cacaotrack-agent.git
sudo chown -R asco:asco cacaotrack-agent
cd cacaotrack-agent
```

### Étape 2 : Créer la Base de Données MySQL

```bash
# Se connecter à MySQL
sudo mysql -u root -p

# Dans MySQL, exécuter :
CREATE DATABASE asco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cacaotrack_user'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_SECURISE';
GRANT ALL PRIVILEGES ON asco.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Étape 3 : Configurer le Backend

```bash
cd /var/www/cacaotrack-agent/server

# Créer le fichier .env
cat > .env << EOF
DATABASE_URL="mysql://cacaotrack_user:VOTRE_MOT_DE_PASSE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="votre-secret-jwt-tres-securise-changez-moi-$(date +%s)"
EOF

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Appliquer le schéma à la base de données
npx prisma db push
```

### Étape 4 : Démarrer le Backend avec PM2

```bash
cd /var/www/cacaotrack-agent/server

# Démarrer avec PM2
pm2 start node_modules/.bin/ts-node --name cacaotrack-api -- src/index.ts

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# (Exécuter la commande affichée)
```

### Étape 5 : Build le Frontend

```bash
cd /var/www/cacaotrack-agent

# Installer les dépendances
npm install

# Build le frontend
npm run build

# Permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
```

### Étape 6 : Configurer Nginx

```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/cacaotrack
```

Contenu du fichier :

```nginx
server {
    listen 80;
    server_name 82.208.22.230;

    root /var/www/cacaotrack-agent/dist;
    index index.html;

    # Frontend
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
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/

# Supprimer la config par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Étape 7 : Vérification

```bash
# Vérifier PM2
pm2 status

# Vérifier Nginx
sudo systemctl status nginx

# Vérifier MySQL
sudo systemctl status mysql

# Tester l'API
curl http://localhost:3000/api/health

# Tester le frontend
curl http://localhost/
```

## 🧪 Test dans le Navigateur

1. Aller sur : `http://82.208.22.230`
2. Vérifier que l'application se charge
3. Tester la création d'une organisation : `http://82.208.22.230/organisations/nouveau`
4. Vérifier les 4 étapes avec icônes

## 📝 Notes Importantes

- Remplacez `VOTRE_MOT_DE_PASSE_SECURISE` par un mot de passe fort
- Remplacez `VOTRE_MOT_DE_PASSE` dans le `.env` par le même mot de passe
- Le `JWT_SECRET` doit être unique et sécurisé
- Vérifiez que le port 3000 est accessible (firewall)

## 🔧 Commandes Utiles

```bash
# Voir les logs PM2
pm2 logs cacaotrack-api

# Redémarrer le backend
pm2 restart cacaotrack-api

# Voir les logs Nginx
sudo tail -f /var/log/nginx/error.log

# Rebuild le frontend après modification
cd /var/www/cacaotrack-agent
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
sudo systemctl reload nginx
```

