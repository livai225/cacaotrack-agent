#!/bin/bash

# Script d'installation complète
# Usage: bash install-complete.sh

set -e

echo "🚀 INSTALLATION COMPLÈTE CACAOTRACK"
echo "===================================="
echo ""

# Variables
DB_PASSWORD=""
JWT_SECRET=""

# Demander le mot de passe MySQL
read -sp "Mot de passe MySQL pour 'cacaotrack_user': " DB_PASSWORD
echo ""
read -sp "Confirmer le mot de passe: " DB_PASSWORD_CONFIRM
echo ""

if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
    echo "❌ Les mots de passe ne correspondent pas"
    exit 1
fi

# Générer JWT_SECRET
JWT_SECRET="jwt-secret-$(date +%s)-$(openssl rand -hex 16)"

echo ""
echo "📦 Étape 1: Cloner le projet..."
cd /var/www
if [ -d "cacaotrack-agent" ]; then
    echo "   Le dossier existe déjà, suppression..."
    sudo rm -rf cacaotrack-agent
fi
sudo git clone https://github.com/livai225/cacaotrack-agent.git
sudo chown -R asco:asco cacaotrack-agent
cd cacaotrack-agent

echo ""
echo "🗄️  Étape 2: Créer la base de données..."
sudo mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS asco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'cacaotrack_user'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON asco.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
EOF

echo ""
echo "⚙️  Étape 3: Configurer le backend..."
cd server
cat > .env << EOF
DATABASE_URL="mysql://cacaotrack_user:${DB_PASSWORD}@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="${JWT_SECRET}"
EOF

echo "   Installation des dépendances backend..."
npm install

echo "   Génération Prisma..."
npx prisma generate

echo "   Application du schéma..."
npx prisma db push

echo ""
echo "🚀 Étape 4: Démarrer le backend..."
pm2 start node_modules/.bin/ts-node --name cacaotrack-api -- src/index.ts
pm2 save

echo ""
echo "🌐 Étape 5: Build le frontend..."
cd ..
npm install
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

echo ""
echo "🔧 Étape 6: Configurer Nginx..."
sudo tee /etc/nginx/sites-available/cacaotrack > /dev/null << 'NGINX_CONFIG'
server {
    listen 80;
    server_name 82.208.22.230;

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX_CONFIG

sudo ln -sf /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo "   Test de la configuration Nginx..."
sudo nginx -t

echo "   Redémarrage de Nginx..."
sudo systemctl restart nginx

echo ""
echo "✅ INSTALLATION TERMINÉE !"
echo ""
echo "🧪 Vérifications:"
echo "   - PM2: $(pm2 list | grep cacaotrack-api | wc -l) processus"
echo "   - Nginx: $(sudo systemctl is-active nginx)"
echo "   - Build: $(ls -1 dist/assets/*.js | wc -l) fichier(s) JS"
echo ""
echo "🌐 Testez sur: http://82.208.22.230"
echo ""

