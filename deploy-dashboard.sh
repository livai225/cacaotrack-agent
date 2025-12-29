#!/bin/bash
# Script de déploiement pour les modifications du Dashboard
# Usage: bash deploy-dashboard.sh

echo "🚀 Déploiement des modifications du Dashboard"
echo "=============================================="
echo ""

# Configuration
SERVER_USER="asco"
SERVER_HOST="82.208.22.230"
PROJECT_PATH="/var/www/cacaotrack-agent"

echo "📥 Récupération des dernières modifications depuis GitHub..."
ssh ${SERVER_USER}@${SERVER_HOST} "cd ${PROJECT_PATH} && git pull origin main"

echo ""
echo "🔨 Construction du frontend..."
ssh ${SERVER_USER}@${SERVER_HOST} "cd ${PROJECT_PATH} && npm run build"

echo ""
echo "🔧 Configuration des permissions..."
ssh ${SERVER_USER}@${SERVER_HOST} "cd ${PROJECT_PATH} && sudo chown -R asco:asco dist/ && sudo chmod -R 755 dist/"

echo ""
echo "🔄 Redémarrage de Nginx..."
ssh ${SERVER_USER}@${SERVER_HOST} "sudo systemctl reload nginx"

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "Vérification du statut :"
ssh ${SERVER_USER}@${SERVER_HOST} "pm2 status && curl -s http://localhost/api/health | head -c 100"

