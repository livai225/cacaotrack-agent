#!/bin/bash

# Script de déploiement du frontend
# Usage: ./scripts/deploy-frontend.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement du frontend CacaoTrack..."

# Aller à la racine du projet
cd "$(dirname "$0")/.."

# 1. Récupérer les dernières modifications
echo "📥 Récupération des dernières modifications..."
git pull origin main

# 2. Installer les dépendances frontend
echo "📦 Installation des dépendances frontend..."
npm install

# 3. Reconstruire le frontend
echo "🔨 Construction du frontend..."
npm run build

# 4. Vérifier que le dossier dist existe
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le dossier dist n'existe pas après le build"
    exit 1
fi

# 5. Sauvegarder l'ancien frontend (optionnel)
echo "💾 Sauvegarde de l'ancien frontend..."
if [ -d "/var/www/html" ]; then
    sudo cp -r /var/www/html /var/www/html.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
fi

# 6. Déployer le nouveau frontend
echo "📤 Déploiement du nouveau frontend..."
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# 7. Redémarrer Nginx
echo "🔄 Redémarrage de Nginx..."
sudo systemctl restart nginx

echo "✅ Frontend déployé avec succès !"
echo "🌐 Application disponible sur: http://82.208.22.230"

