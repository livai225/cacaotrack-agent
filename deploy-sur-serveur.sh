#!/bin/bash
# Script à exécuter DIRECTEMENT sur le serveur
# Copiez ce fichier sur le serveur et exécutez-le : bash deploy-sur-serveur.sh

echo "🚀 Déploiement des modifications du Dashboard"
echo "=============================================="
echo ""

cd /var/www/cacaotrack-agent

echo "📥 1. Récupération des dernières modifications depuis GitHub..."
git pull origin main

echo ""
echo "🔨 2. Construction du frontend..."
npm run build

echo ""
echo "🔧 3. Configuration des permissions..."
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

echo ""
echo "🔄 4. Redémarrage de Nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "Vérification :"
pm2 status
curl -s http://localhost/api/health | head -c 200
echo ""

