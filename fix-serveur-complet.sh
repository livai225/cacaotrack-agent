#!/bin/bash

# Script de réparation complète du serveur
# Usage: bash fix-serveur-complet.sh

set -e

echo "🔍 DIAGNOSTIC COMPLET DU SERVEUR"
echo "=================================="
echo ""

cd /var/www/cacaotrack-agent

echo "1️⃣ Vérification du code source..."
if grep -q "currentStep\|steps\|handleNext" src/pages/AgentForm.tsx 2>/dev/null; then
    echo "   ✅ Code source contient les modifications"
    grep -c "currentStep\|steps\|handleNext" src/pages/AgentForm.tsx | xargs echo "   Nombre de lignes trouvées:"
else
    echo "   ❌ Code source N'A PAS les modifications"
    echo "   → Mise à jour depuis Git..."
    git fetch origin
    git reset --hard origin/main
    echo "   ✅ Code source mis à jour"
fi

echo ""
echo "2️⃣ Vérification du dernier commit..."
git log --oneline -1 -- src/pages/AgentForm.tsx

echo ""
echo "3️⃣ Vérification du build actuel..."
if [ -d "dist/assets" ]; then
    BUILD_FILE=$(ls -t dist/assets/*.js 2>/dev/null | head -1)
    if [ -n "$BUILD_FILE" ]; then
        echo "   Fichier: $(basename $BUILD_FILE)"
        echo "   Date: $(stat -c %y $BUILD_FILE 2>/dev/null || stat -f %Sm $BUILD_FILE 2>/dev/null)"
        if grep -q "currentStep" "$BUILD_FILE" 2>/dev/null; then
            echo "   ✅ Build contient 'currentStep'"
        else
            echo "   ❌ Build N'A PAS 'currentStep' → Rebuild nécessaire"
        fi
    fi
else
    echo "   ❌ Dossier dist/assets n'existe pas"
fi

echo ""
echo "4️⃣ Rebuild du frontend..."
sudo rm -rf dist/ node_modules/.vite 2>/dev/null || true
npm run build

echo ""
echo "5️⃣ Vérification du nouveau build..."
NEW_BUILD=$(ls -t dist/assets/*.js 2>/dev/null | head -1)
if [ -n "$NEW_BUILD" ]; then
    if grep -q "currentStep" "$NEW_BUILD" 2>/dev/null; then
        echo "   ✅ Nouveau build contient 'currentStep'"
        echo "   Fichier: $(basename $NEW_BUILD)"
    else
        echo "   ⚠️  Nouveau build ne contient toujours pas 'currentStep'"
    fi
fi

echo ""
echo "6️⃣ Correction des permissions..."
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

echo ""
echo "7️⃣ Redémarrage de Nginx..."
sudo systemctl reload nginx

echo ""
echo "8️⃣ Vérification de la configuration Nginx..."
NGINX_ROOT=$(sudo grep -oP 'root\s+\K[^;]+' /etc/nginx/sites-available/cacaotrack 2>/dev/null | head -1 || echo "non trouvé")
echo "   Root Nginx: $NGINX_ROOT"
if [[ "$NGINX_ROOT" == *"cacaotrack-agent/dist"* ]]; then
    echo "   ✅ Configuration correcte"
else
    echo "   ⚠️  Vérifiez la configuration Nginx"
fi

echo ""
echo "=================================="
echo "✅ DIAGNOSTIC TERMINÉ"
echo ""
echo "📋 RÉSUMÉ:"
echo "   - Code source: $(grep -c 'currentStep\|steps\|handleNext' src/pages/AgentForm.tsx 2>/dev/null || echo 0) lignes trouvées"
echo "   - Build: $(ls -1 dist/assets/*.js 2>/dev/null | wc -l) fichier(s) JS"
echo ""
echo "🧪 TESTEZ MAINTENANT:"
echo "   1. Navigation privée (Ctrl+Shift+N)"
echo "   2. Aller sur: http://82.208.22.230/agents/nouveau"
echo "   3. Vérifier la barre de progression et les étapes"
echo ""

