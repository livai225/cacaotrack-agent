#!/bin/bash

# Script complet d'installation MySQL et configuration base de données
# À exécuter sur le serveur Ubuntu/Debian

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que le script est exécuté avec sudo
if [ "$EUID" -ne 0 ]; then 
    error "Veuillez exécuter ce script avec sudo"
    exit 1
fi

echo "=========================================="
info "INSTALLATION MYSQL ET CONFIGURATION DB"
echo "=========================================="
echo ""

# 1. Installation de MySQL
info "Installation de MySQL..."
apt update
apt install mysql-server -y

# Vérifier l'installation
if mysql --version > /dev/null 2>&1; then
    info "MySQL installé : $(mysql --version)"
else
    error "Échec de l'installation de MySQL"
    exit 1
fi

# 2. Démarrer et activer MySQL
info "Démarrage de MySQL..."
systemctl start mysql
systemctl enable mysql

if systemctl is-active --quiet mysql; then
    info "MySQL est démarré"
else
    error "MySQL n'a pas démarré"
    exit 1
fi

# 3. Sécurisation MySQL
warn "Sécurisation de MySQL..."
warn "Vous allez devoir répondre aux questions interactives"
read -p "Appuyez sur Entrée pour continuer..."

mysql_secure_installation

# 4. Création de la base de données et de l'utilisateur
info "Configuration de la base de données..."

read -p "Nom de la base de données [asco]: " DB_NAME
DB_NAME=${DB_NAME:-asco}

read -p "Nom d'utilisateur MySQL [cacaotrack_user]: " DB_USER
DB_USER=${DB_USER:-cacaotrack_user}

read -sp "Mot de passe pour $DB_USER: " DB_PASS
echo ""

read -sp "Mot de passe MySQL root: " ROOT_PASS
echo ""

# Créer la base de données et l'utilisateur
mysql -u root -p"$ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
EOF

if [ $? -eq 0 ]; then
    info "Base de données ${DB_NAME} créée"
    info "Utilisateur ${DB_USER} créé"
else
    error "Échec de la création de la base de données"
    exit 1
fi

# 5. Tester la connexion
info "Test de la connexion..."
if mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT 1;" > /dev/null 2>&1; then
    info "Connexion réussie !"
else
    error "Échec de la connexion"
    exit 1
fi

# 6. Afficher les informations de connexion
echo ""
echo "=========================================="
info "CONFIGURATION TERMINÉE"
echo "=========================================="
echo ""
echo "Base de données : ${DB_NAME}"
echo "Utilisateur : ${DB_USER}"
echo "Mot de passe : ${DB_PASS}"
echo ""
echo "URL de connexion pour .env :"
echo "DATABASE_URL=\"mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}\""
echo ""
warn "⚠️  Notez ces informations dans un endroit sûr !"
echo ""
info "Prochaines étapes :"
echo "1. Configurer le fichier .env du backend"
echo "2. Exécuter : npx prisma generate"
echo "3. Exécuter : npx prisma db push"
echo ""

