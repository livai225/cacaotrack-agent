#!/bin/bash

# Script de déploiement sur le serveur
# Usage: bash deploy-to-server.sh

set -e

echo "🚀 Déploiement CacaoTrack sur le serveur..."

# Aller dans le projet
cd /var/www/cacaotrack-agent

# 1. Sauvegarder l'ancien build
echo "💾 Sauvegarde de l'ancien build..."
if [ -d "dist" ]; then
    sudo rm -rf dist.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    sudo mv dist dist.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
fi

# 2. Récupérer les dernières modifications
echo "📥 Récupération des modifications..."
git pull origin main

# 3. Re-builder le frontend
echo "🔨 Build du frontend..."
npm run build

# 4. Vérifier que le build est OK
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le dossier dist n'existe pas"
    exit 1
fi

echo "✅ Build réussi !"
ls -lh dist/assets/

# 5. Corriger les permissions
echo "🔧 Correction des permissions..."
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# 6. Redémarrer Nginx
echo "🔄 Redémarrage de Nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Déploiement terminé !"
echo "🌐 Testez sur: http://82.208.22.230/organisations/nouveau"
echo "💡 N'oubliez pas de vider le cache du navigateur (Ctrl+Shift+N)"

