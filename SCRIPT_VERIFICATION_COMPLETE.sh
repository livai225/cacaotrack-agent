#!/bin/bash
# Script de vérification complète sur le serveur

set -e

echo "🔍 VÉRIFICATION COMPLÈTE DU SERVEUR"
echo "===================================="
echo ""

cd /var/www/cacaotrack-agent

echo "1️⃣  VÉRIFICATION GIT"
echo "-------------------"
echo "Dépôt distant:"
git remote -v
echo ""
echo "Branche actuelle:"
git branch
echo ""
echo "État Git:"
git status --short
echo ""
echo "Derniers commits locaux:"
git log --oneline -3
echo ""
echo "Derniers commits sur GitHub:"
git fetch origin -q
git log --oneline origin/main -3
echo ""
echo "Commits à récupérer:"
git log HEAD..origin/main --oneline || echo "Aucun commit à récupérer"
echo ""

echo "2️⃣  VÉRIFICATION CODE SOURCE"
echo "---------------------------"
echo "Code actuel dans OrganisationForm.tsx:"
grep -A 8 "const isEdit" src/pages/OrganisationForm.tsx | head -10
echo ""

echo "3️⃣  VÉRIFICATION BUILD"
echo "-------------------"
if [ -d "dist/assets" ] && [ -n "$(ls -A dist/assets/*.js 2>/dev/null)" ]; then
    echo "✅ Build existe"
    echo "Date du build:"
    ls -la dist/assets/*.js | head -1
    echo ""
    echo "Vérification si le build contient la correction:"
    if grep -q "location.pathname.includes.*nouveau" dist/assets/*.js 2>/dev/null; then
        echo "✅ Le build contient la correction"
    else
        echo "❌ Le build NE contient PAS la correction - REBUILD NÉCESSAIRE"
    fi
else
    echo "❌ Pas de build trouvé - REBUILD NÉCESSAIRE"
fi
echo ""

echo "4️⃣  RECOMMANDATIONS"
echo "------------------"
if [ -n "$(git log HEAD..origin/main --oneline)" ]; then
    echo "⚠️  Des commits sont à récupérer depuis GitHub"
    echo "   Exécutez: git pull origin main"
fi

if [ ! -d "dist/assets" ] || [ -z "$(ls -A dist/assets/*.js 2>/dev/null)" ] || ! grep -q "location.pathname.includes.*nouveau" dist/assets/*.js 2>/dev/null; then
    echo "⚠️  Le build doit être refait"
    echo "   Exécutez: sudo rm -rf dist/ node_modules/.vite && npm run build"
fi

echo ""
echo "✅ Vérification terminée"

