#!/bin/bash

# Script d'installation rapide pour CacaoTrack
# À exécuter sur le serveur Ubuntu/Debian

set -e  # Arrêter en cas d'erreur

echo "🚀 Installation de CacaoTrack..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que le script est exécuté en root ou avec sudo
if [ "$EUID" -ne 0 ]; then 
    error "Veuillez exécuter ce script avec sudo"
    exit 1
fi

# 1. Mise à jour du système
info "Mise à jour du système..."
apt update
apt upgrade -y

# 2. Installation de Node.js
info "Installation de Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Vérifier la version
NODE_VERSION=$(node --version)
info "Node.js installé : $NODE_VERSION"

# 3. Installation de MySQL
info "Installation de MySQL..."
apt install mysql-server -y
systemctl start mysql
systemctl enable mysql

# 4. Installation de Nginx
info "Installation de Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# 5. Installation de Git
info "Installation de Git..."
apt install git -y

# 6. Installation de PM2
info "Installation de PM2..."
npm install -g pm2

# 7. Installation de Certbot
info "Installation de Certbot..."
apt install certbot python3-certbot-nginx -y

# 8. Création du répertoire web
info "Création du répertoire web..."
mkdir -p /var/www
cd /var/www

# 9. Cloner le projet depuis GitHub
info "Clonage du projet depuis GitHub..."
GIT_URL="https://github.com/livai225/cacaotrack-agent.git"
git clone $GIT_URL cacaotrack-agent || error "Échec du clonage"

# 10. Configuration de la base de données
info "Configuration de la base de données MySQL..."
read -p "Nom de la base de données [asco]: " DB_NAME
DB_NAME=${DB_NAME:-asco}

read -p "Nom d'utilisateur MySQL [cacaotrack_user]: " DB_USER
DB_USER=${DB_USER:-cacaotrack_user}

read -sp "Mot de passe MySQL: " DB_PASS
echo ""

# Créer la base de données et l'utilisateur
mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

info "Base de données créée : $DB_NAME"

# 11. Configuration du backend
info "Configuration du backend..."
cd /var/www/cacaotrack-agent/server

# Installer les dépendances
npm install

# Générer un secret JWT
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Créer le fichier .env
cat > .env <<EOF
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}"
PORT=3000
NODE_ENV=production
JWT_SECRET="${JWT_SECRET}"
EOF

info "Fichier .env créé"

# Générer Prisma
npx prisma generate
npx prisma db push

info "Prisma configuré"

# 12. Démarrer le backend avec PM2
info "Démarrage du backend avec PM2..."
cd /var/www/cacaotrack-agent
pm2 start server/src/index.ts --name cacaotrack-api --interpreter ts-node
pm2 save
pm2 startup

info "Backend démarré"

# 13. Configuration du frontend
info "Configuration du frontend..."
cd /var/www/cacaotrack-agent
npm install

read -p "URL de l'API en production [https://votre-domaine.com/api]: " API_URL
API_URL=${API_URL:-https://votre-domaine.com/api}

# Créer .env.production
cat > .env.production <<EOF
VITE_API_URL="${API_URL}"
EOF

# Build
npm run build

info "Frontend buildé"

# 14. Configuration Nginx
info "Configuration de Nginx..."
read -p "Nom de domaine [votre-domaine.com]: " DOMAIN
DOMAIN=${DOMAIN:-votre-domaine.com}

cat > /etc/nginx/sites-available/cacaotrack <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    root /var/www/cacaotrack-agent/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t

# Recharger Nginx
systemctl reload nginx

info "Nginx configuré"

# 15. Configuration SSL (optionnel)
read -p "Voulez-vous configurer SSL avec Let's Encrypt? (o/n): " SETUP_SSL
if [[ $SETUP_SSL == "o" || $SETUP_SSL == "O" ]]; then
    info "Configuration SSL..."
    certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}
    info "SSL configuré"
fi

# 16. Permissions
info "Configuration des permissions..."
chown -R www-data:www-data /var/www/cacaotrack-agent/dist
chmod -R 755 /var/www/cacaotrack-agent/dist

# Résumé
echo ""
echo "=========================================="
echo "✅ Installation terminée !"
echo "=========================================="
echo ""
echo "Backend: http://localhost:3000"
echo "Frontend: http://${DOMAIN}"
echo "Base de données: ${DB_NAME}"
echo ""
echo "Commandes utiles:"
echo "  - Voir les logs: pm2 logs cacaotrack-api"
echo "  - Redémarrer: pm2 restart cacaotrack-api"
echo "  - Statut: pm2 status"
echo ""
echo "N'oubliez pas de:"
echo "  1. Configurer le DNS pour pointer vers ce serveur"
echo "  2. Configurer le firewall (ports 80, 443)"
echo "  3. Tester l'application"
echo ""

