#!/bin/bash

# Script simple de déploiement sur le serveur
# Usage: bash deploy-serveur.sh

set -e

echo "🚀 Déploiement CacaoTrack..."

# Aller dans le projet
cd /var/www/cacaotrack-agent

# 1. Récupérer les modifications
echo "📥 Récupération des modifications..."
git pull origin main

# 2. Re-builder le frontend
echo "🔨 Build du frontend..."
npm run build

# 3. Vérifier que le build est OK
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le dossier dist n'existe pas"
    exit 1
fi

echo "✅ Build réussi !"
ls -lh dist/assets/

# 4. Redémarrer Nginx
echo "🔄 Redémarrage de Nginx..."
systemctl reload nginx

echo "✅ Déploiement terminé !"
echo "🌐 Testez sur: http://82.208.22.230/organisations/nouveau"

