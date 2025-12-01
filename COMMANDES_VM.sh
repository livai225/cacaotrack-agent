#!/bin/bash

# ========================================
# Script de Déploiement - CacaoTrack VM
# ========================================
# 
# Ce script met à jour et redémarre l'API sur la VM
# VM: 82.208.22.230
# Date: 1er décembre 2025
#

echo "🚀 Déploiement CacaoTrack sur VM"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Se rendre à la racine du projet
echo -e "${YELLOW}📂 Navigation vers le projet...${NC}"
cd ~/apps/cacaotrack-agent || {
    echo -e "${RED}❌ Erreur: Dossier ~/apps/cacaotrack-agent introuvable${NC}"
    exit 1
}
echo -e "${GREEN}✓ Dans le dossier: $(pwd)${NC}"
echo ""

# 2. Mettre à jour le code depuis GitHub
echo -e "${YELLOW}📥 Mise à jour du code depuis GitHub...${NC}"
git pull origin main || {
    echo -e "${RED}❌ Erreur lors du git pull${NC}"
    exit 1
}
echo -e "${GREEN}✓ Code mis à jour${NC}"
echo ""

# 3. Installer les dépendances du backend
echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
cd server
npm install || {
    echo -e "${RED}❌ Erreur lors de npm install${NC}"
    exit 1
}
echo -e "${GREEN}✓ Dépendances installées${NC}"
cd ..
echo ""

# 4. Vérifier le fichier .env
echo -e "${YELLOW}🔍 Vérification du fichier .env...${NC}"
if [ -f "server/.env" ]; then
    echo -e "${GREEN}✓ Fichier .env trouvé${NC}"
else
    echo -e "${YELLOW}⚠ Fichier .env non trouvé, création depuis .env.example...${NC}"
    cp server/.env.example server/.env
    echo -e "${YELLOW}⚠ ATTENTION: Vérifiez et modifiez server/.env si nécessaire${NC}"
fi
echo ""

# 5. Redémarrer l'API avec PM2
echo -e "${YELLOW}🔄 Redémarrage de l'API...${NC}"
pm2 restart asco-api || {
    echo -e "${RED}❌ Erreur lors du redémarrage PM2${NC}"
    echo -e "${YELLOW}Tentative de démarrage...${NC}"
    pm2 start server/src/index.ts --name asco-api --interpreter ts-node
}
echo -e "${GREEN}✓ API redémarrée${NC}"
echo ""

# 6. Afficher le statut PM2
echo -e "${YELLOW}📊 Statut PM2:${NC}"
pm2 status
echo ""

# 7. Tests de validation
echo -e "${YELLOW}🧪 Tests de validation...${NC}"
echo ""

echo -e "${YELLOW}Test 1: Route racine /api${NC}"
curl -s http://localhost:3000/api | head -n 5
echo ""
echo ""

echo -e "${YELLOW}Test 2: Health check${NC}"
curl -s http://localhost:3000/api/health | head -n 5
echo ""
echo ""

echo -e "${YELLOW}Test 3: PostGIS${NC}"
curl -s http://localhost:3000/api/postgis | head -n 5
echo ""
echo ""

# 8. Résumé
echo "=================================="
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""
echo "URLs de test:"
echo "  - API Publique: http://82.208.22.230/api"
echo "  - Health Check: http://82.208.22.230/api/health"
echo "  - PostGIS:      http://82.208.22.230/api/postgis"
echo ""
echo "Commandes utiles:"
echo "  - Logs PM2:     pm2 logs asco-api"
echo "  - Statut PM2:   pm2 status"
echo "  - Redémarrer:   pm2 restart asco-api"
echo ""
echo -e "${YELLOW}📝 Consultez DEPLOIEMENT_VM.md pour plus d'informations${NC}"
echo "=================================="
