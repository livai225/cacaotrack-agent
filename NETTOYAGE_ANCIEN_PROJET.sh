#!/bin/bash

# Script pour supprimer complètement l'ancien projet CacaoTrack
# ⚠️ ATTENTION : Ce script supprime définitivement les données !

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
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
warning "NETTOYAGE COMPLET DE L'ANCIEN PROJET"
echo "=========================================="
echo ""
warning "Ce script va supprimer :"
echo "  - L'ancien projet CacaoTrack"
echo "  - La base de données MySQL"
echo "  - La configuration Nginx"
echo "  - Les processus PM2"
echo ""

read -p "Êtes-vous sûr de vouloir continuer? (tapez 'OUI' pour confirmer): " CONFIRM

if [ "$CONFIRM" != "OUI" ]; then
    info "Opération annulée"
    exit 0
fi

# 1. Arrêter et supprimer PM2
info "Arrêt des processus PM2..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true
info "PM2 nettoyé"

# 2. Supprimer l'ancien projet
info "Suppression de l'ancien projet..."
read -p "Chemin de l'ancien projet [/var/www/cacaotrack-agent]: " OLD_PATH
OLD_PATH=${OLD_PATH:-/var/www/cacaotrack-agent}

if [ -d "$OLD_PATH" ]; then
    rm -rf "$OLD_PATH"
    info "Ancien projet supprimé : $OLD_PATH"
else
    warning "Le chemin $OLD_PATH n'existe pas"
fi

# 3. Supprimer la base de données MySQL
info "Suppression de la base de données MySQL..."
read -p "Nom de l'ancienne base de données [asco]: " OLD_DB
OLD_DB=${OLD_DB:-asco}

read -p "Nom d'utilisateur MySQL root [root]: " MYSQL_USER
MYSQL_USER=${MYSQL_USER:-root}

read -sp "Mot de passe MySQL root: " MYSQL_PASS
echo ""

mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" <<EOF
DROP DATABASE IF EXISTS ${OLD_DB};
DROP USER IF EXISTS 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
EOF

info "Base de données supprimée : $OLD_DB"

# 4. Supprimer la configuration Nginx
info "Suppression de la configuration Nginx..."
rm -f /etc/nginx/sites-enabled/cacaotrack
rm -f /etc/nginx/sites-available/cacaotrack

# Vérifier la configuration
if nginx -t 2>/dev/null; then
    systemctl reload nginx
    info "Configuration Nginx nettoyée"
else
    error "Erreur dans la configuration Nginx"
fi

# 5. Nettoyer les logs PM2
info "Nettoyage des logs PM2..."
rm -rf ~/.pm2/logs/*
info "Logs PM2 nettoyés"

# 6. Nettoyer les certificats SSL (optionnel)
read -p "Supprimer les certificats SSL Let's Encrypt? (o/n): " DELETE_SSL
if [[ $DELETE_SSL == "o" || $DELETE_SSL == "O" ]]; then
    read -p "Nom de domaine: " DOMAIN
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        certbot delete --cert-name "$DOMAIN" --non-interactive || true
        info "Certificats SSL supprimés pour $DOMAIN"
    fi
fi

echo ""
echo "=========================================="
info "NETTOYAGE TERMINÉ"
echo "=========================================="
echo ""
info "Vous pouvez maintenant installer le nouveau projet"
echo "Utilisez le script INSTALLATION_RAPIDE.sh"
echo ""

