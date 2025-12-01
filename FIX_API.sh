#!/bin/bash

# ========================================
# Script de Correction - API CacaoTrack
# ========================================

echo "🔧 Correction de l'API CacaoTrack"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Aller dans le dossier server
cd ~/apps/cacaotrack-agent/server || {
    echo -e "${RED}❌ Erreur: Impossible d'accéder au dossier server${NC}"
    exit 1
}

echo -e "${YELLOW}📂 Dans le dossier: $(pwd)${NC}"
echo ""

# 1. Vérifier le fichier .env
echo -e "${YELLOW}🔍 Vérification du fichier .env...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ Fichier .env trouvé${NC}"
    echo "Contenu:"
    cat .env
else
    echo -e "${RED}❌ Fichier .env manquant${NC}"
    echo -e "${YELLOW}Création depuis .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Fichier .env créé${NC}"
fi
echo ""

# 2. Générer le client Prisma
echo -e "${YELLOW}⚙️  Génération du client Prisma...${NC}"
npx prisma generate || {
    echo -e "${RED}❌ Erreur lors de la génération Prisma${NC}"
    exit 1
}
echo -e "${GREEN}✓ Client Prisma généré${NC}"
echo ""

# 3. Créer les tables dans la base de données
echo -e "${YELLOW}🗄️  Création des tables PostgreSQL...${NC}"
npx prisma db push || {
    echo -e "${RED}❌ Erreur lors de la création des tables${NC}"
    echo -e "${YELLOW}Vérifiez la connexion PostgreSQL${NC}"
    exit 1
}
echo -e "${GREEN}✓ Tables créées${NC}"
echo ""

# 4. Redémarrer PM2
echo -e "${YELLOW}🔄 Redémarrage de PM2...${NC}"
pm2 restart asco-api || {
    echo -e "${YELLOW}⚠ Processus asco-api non trouvé, création...${NC}"
    pm2 start src/index.ts --name asco-api --interpreter ts-node
    pm2 save
}
echo -e "${GREEN}✓ PM2 redémarré${NC}"
echo ""

# 5. Attendre que l'API démarre
echo -e "${YELLOW}⏳ Attente du démarrage de l'API (3 secondes)...${NC}"
sleep 3
echo ""

# 6. Tests de validation
echo -e "${YELLOW}🧪 Tests de validation...${NC}"
echo ""

echo -e "${YELLOW}Test 1: API Locale (localhost:3000)${NC}"
RESPONSE_LOCAL=$(curl -s http://localhost:3000/api)
if [ -n "$RESPONSE_LOCAL" ]; then
    echo -e "${GREEN}✓ API locale répond${NC}"
    echo "$RESPONSE_LOCAL" | head -n 5
else
    echo -e "${RED}❌ API locale ne répond pas${NC}"
    echo "Vérifiez les logs: pm2 logs asco-api"
fi
echo ""

echo -e "${YELLOW}Test 2: Health Check${NC}"
RESPONSE_HEALTH=$(curl -s http://localhost:3000/api/health)
if [ -n "$RESPONSE_HEALTH" ]; then
    echo -e "${GREEN}✓ Health check répond${NC}"
    echo "$RESPONSE_HEALTH" | head -n 5
else
    echo -e "${RED}❌ Health check ne répond pas${NC}"
fi
echo ""

echo -e "${YELLOW}Test 3: API Publique (82.208.22.230)${NC}"
RESPONSE_PUBLIC=$(curl -s http://82.208.22.230/api)
if [ -n "$RESPONSE_PUBLIC" ]; then
    echo -e "${GREEN}✓ API publique répond${NC}"
    echo "$RESPONSE_PUBLIC" | head -n 5
else
    echo -e "${RED}❌ API publique ne répond pas${NC}"
    echo "Vérifiez Nginx: sudo nginx -t"
fi
echo ""

# 7. Résumé
echo "=================================="
if [ -n "$RESPONSE_LOCAL" ] && [ -n "$RESPONSE_HEALTH" ] && [ -n "$RESPONSE_PUBLIC" ]; then
    echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
    echo ""
    echo "URLs fonctionnelles:"
    echo "  - http://82.208.22.230/api"
    echo "  - http://82.208.22.230/api/health"
    echo "  - http://82.208.22.230/api/postgis"
else
    echo -e "${YELLOW}⚠ Certains tests ont échoué${NC}"
    echo ""
    echo "Commandes de diagnostic:"
    echo "  - Logs PM2:        pm2 logs asco-api"
    echo "  - Statut PM2:      pm2 status"
    echo "  - Test PostgreSQL: psql -h 82.208.22.230 -U asco_user -d asco_db -c 'SELECT 1;'"
    echo "  - Test Nginx:      sudo nginx -t"
fi
echo "=================================="
