#!/bin/bash
# Script de mise à jour complète du serveur

set -e  # Arrêter en cas d'erreur

echo "🔄 Mise à jour complète du serveur CacaoTrack..."

cd /var/www/cacaotrack-agent

echo "📥 1. Récupération des modifications depuis GitHub..."
git restore package-lock.json server/prisma/schema.prisma 2>/dev/null || true
git pull origin main

echo "🔍 2. Vérification du code source..."
if grep -q "location.pathname.includes.*edit" src/pages/OrganisationForm.tsx; then
    echo "✅ Code source correct"
else
    echo "❌ Code source incorrect !"
    exit 1
fi

echo "🗑️  3. Suppression de l'ancien build..."
sudo rm -rf dist/ node_modules/.vite

echo "🔨 4. Build du frontend..."
npm run build

echo "🔍 5. Vérification du build..."
if [ -d "dist/assets" ] && [ -n "$(ls -A dist/assets/*.js 2>/dev/null)" ]; then
    echo "✅ Build réussi"
    ls -lh dist/assets/*.js | head -1
else
    echo "❌ Build échoué !"
    exit 1
fi

echo "🔐 6. Configuration des permissions..."
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

echo "🔄 7. Redémarrage de Nginx..."
sudo systemctl restart nginx

echo "✅ Mise à jour terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vider le cache du navigateur (Ctrl+Shift+Delete)"
echo "2. Ouvrir la console (F12) et aller sur /organisations/nouveau"
echo "3. Vérifier les logs dans la console pour voir les valeurs de isEdit"
echo "4. Tester la création d'une organisation"

