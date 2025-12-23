#!/bin/bash

# Script pour réinitialiser uniquement les tables (sans recréer la base de données)
# Plus simple et ne nécessite pas de permissions spéciales
# Usage: ./scripts/reset-tables.sh

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    print_error "Ce script doit être exécuté depuis le répertoire server/"
    exit 1
fi

# Confirmation
print_warning "ATTENTION: Cette opération va SUPPRIMER toutes les données des tables !"
read -p "Êtes-vous sûr de vouloir continuer ? (tapez 'OUI' pour confirmer): " confirmation

if [ "$confirmation" != "OUI" ]; then
    print_error "Opération annulée."
    exit 1
fi

# 1. Réinitialiser le schéma Prisma (supprime et recrée toutes les tables)
print_info "Réinitialisation du schéma Prisma..."
print_warning "Cette opération va supprimer toutes les tables et les recréer"

# Utiliser prisma db push avec --force-reset pour réinitialiser complètement
npx prisma db push --force-reset --accept-data-loss
if [ $? -eq 0 ]; then
    print_success "Schéma réinitialisé avec succès"
else
    print_error "Échec de la réinitialisation du schéma"
    exit 1
fi

# 2. Régénérer le client Prisma
print_info "Régénération du client Prisma..."
npm run db:generate
if [ $? -eq 0 ]; then
    print_success "Client Prisma régénéré"
else
    print_error "Échec de la régénération du client Prisma"
    exit 1
fi

# 3. Optionnel: Exécuter le seed
read -p "Voulez-vous exécuter le script de seed pour créer des données de test ? (o/N): " seed_confirm
if [ "$seed_confirm" = "o" ] || [ "$seed_confirm" = "O" ]; then
    print_info "Exécution du script de seed..."
    npm run db:seed
    if [ $? -eq 0 ]; then
        print_success "Données de test créées"
    else
        print_warning "Échec du seed (non bloquant)"
    fi
fi

# Résumé
echo ""
echo "============================================================"
print_success "Tables réinitialisées avec succès ! 🎉"
echo ""
echo "Prochaines étapes :"
echo "  1. Redémarrer le serveur : pm2 restart asco-api"
echo "  2. Tester l'API : curl http://localhost:3000/api/health"
echo "  3. Vérifier les données : curl http://localhost:3000/api/organisations"
echo "============================================================"

