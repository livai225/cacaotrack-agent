#!/bin/bash

# Script pour réinitialiser complètement la base de données
# Usage: ./scripts/reset-db.sh

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

# Lire les variables d'environnement depuis .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    print_error "Fichier .env non trouvé !"
    exit 1
fi

# Extraire les informations de connexion depuis DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_URL=${DATABASE_URL}
DB_USER=$(echo $DB_URL | sed -n 's|postgresql://\([^:]*\):.*|\1|p')
DB_PASSWORD=$(echo $DB_URL | sed -n 's|postgresql://[^:]*:\([^@]*\)@.*|\1|p')
DB_HOST=$(echo $DB_URL | sed -n 's|postgresql://[^@]*@\([^:]*\):.*|\1|p')
DB_PORT=$(echo $DB_URL | sed -n 's|postgresql://[^@]*@[^:]*:\([^/]*\)/.*|\1|p')
DB_NAME=$(echo $DB_URL | sed -n 's|postgresql://[^/]*/\([^?]*\).*|\1|p')

# Si localhost, utiliser 127.0.0.1 pour psql
if [ "$DB_HOST" = "localhost" ]; then
    DB_HOST="127.0.0.1"
fi

print_info "Configuration détectée:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Confirmation
print_warning "ATTENTION: Cette opération va SUPPRIMER toutes les données de la base de données '$DB_NAME' !"
read -p "Êtes-vous sûr de vouloir continuer ? (tapez 'OUI' pour confirmer): " confirmation

if [ "$confirmation" != "OUI" ]; then
    print_error "Opération annulée."
    exit 1
fi

# Exporter le mot de passe pour psql
export PGPASSWORD=$DB_PASSWORD

# 1. Supprimer la base de données existante (si elle existe)
print_info "Suppression de l'ancienne base de données..."
psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";" 2>&1 || true
print_success "Ancienne base de données supprimée"

# 2. Créer une nouvelle base de données
print_info "Création de la nouvelle base de données..."
psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d postgres -c "CREATE DATABASE \"$DB_NAME\";" 2>&1
print_success "Nouvelle base de données créée"

# 3. Activer l'extension PostGIS
print_info "Activation de l'extension PostGIS..."
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -c "CREATE EXTENSION IF NOT EXISTS postgis;" 2>&1
print_success "Extension PostGIS activée"

# 4. Générer le client Prisma
print_info "Génération du client Prisma..."
npm run db:generate
if [ $? -eq 0 ]; then
    print_success "Client Prisma généré"
else
    print_error "Échec de la génération du client Prisma"
    unset PGPASSWORD
    exit 1
fi

# 5. Appliquer le schéma Prisma
print_info "Application du schéma Prisma..."
npm run db:push
if [ $? -eq 0 ]; then
    print_success "Schéma appliqué avec succès"
else
    print_error "Échec de l'application du schéma"
    unset PGPASSWORD
    exit 1
fi

# 6. Optionnel: Exécuter le seed
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

# Nettoyer
unset PGPASSWORD

# Résumé
echo ""
echo "============================================================"
print_success "Base de données réinitialisée avec succès ! 🎉"
echo ""
echo "Prochaines étapes :"
echo "  1. Redémarrer le serveur : pm2 restart asco-api"
echo "  2. Tester l'API : curl http://localhost:3000/api/health"
echo "  3. (Optionnel) Ouvrir Prisma Studio : npx prisma studio"
echo ""
echo "URL de connexion :"
echo "  postgresql://$DB_USER:****@$DB_HOST:$DB_PORT/$DB_NAME"
echo "============================================================"

