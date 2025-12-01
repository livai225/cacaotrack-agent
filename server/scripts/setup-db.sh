#!/bin/bash

# Script de configuration de la base de données PostgreSQL + PostGIS
# Pour CacaoTrack Agent

echo "🚀 Configuration de la base de données PostgreSQL + PostGIS"
echo "============================================================"

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
DB_NAME="asco_db"
DB_USER="asco_user"
DB_PASSWORD="AscoSecure2024!"
DB_HOST="82.208.22.230"
DB_PORT="5432"

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Vérifier si PostgreSQL est installé
echo ""
print_info "Vérification de PostgreSQL..."
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    print_success "PostgreSQL trouvé : $PSQL_VERSION"
else
    print_error "PostgreSQL n'est pas installé"
    echo "Installation recommandée : sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Vérifier si PostGIS est disponible
echo ""
print_info "Vérification de PostGIS..."
if dpkg -l | grep -q postgis; then
    print_success "PostGIS est installé"
else
    print_error "PostGIS n'est pas installé"
    echo "Installation recommandée : sudo apt install postgis"
    exit 1
fi

# Test de connexion
echo ""
print_info "Test de connexion à la base de données..."
export PGPASSWORD=$DB_PASSWORD

if psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -c "SELECT 1;" &> /dev/null; then
    print_success "Connexion réussie à $DB_HOST:$DB_PORT"
else
    print_error "Impossible de se connecter à la base de données"
    echo "Vérifiez les paramètres de connexion et le pare-feu"
    exit 1
fi

# Vérifier l'extension PostGIS
echo ""
print_info "Vérification de l'extension PostGIS..."
POSTGIS_CHECK=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -t -c "SELECT COUNT(*) FROM pg_extension WHERE extname='postgis';")

if [ "$POSTGIS_CHECK" -eq "1" ]; then
    print_success "Extension PostGIS activée"
    POSTGIS_VERSION=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -t -c "SELECT PostGIS_version();")
    echo "   Version: $POSTGIS_VERSION"
else
    print_info "Activation de l'extension PostGIS..."
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -c "CREATE EXTENSION IF NOT EXISTS postgis;"
    if [ $? -eq 0 ]; then
        print_success "Extension PostGIS activée avec succès"
    else
        print_error "Échec de l'activation de PostGIS"
        exit 1
    fi
fi

# Vérifier le fichier .env
echo ""
print_info "Vérification du fichier .env..."
if [ -f "../.env" ]; then
    print_success "Fichier .env trouvé"
else
    print_info "Création du fichier .env..."
    cat > ../.env << EOF
# Configuration PostgreSQL + PostGIS
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"
PORT=3000
EOF
    print_success "Fichier .env créé"
fi

# Générer le client Prisma
echo ""
print_info "Génération du client Prisma..."
cd ..
npm run db:generate
if [ $? -eq 0 ]; then
    print_success "Client Prisma généré"
else
    print_error "Échec de la génération du client Prisma"
    exit 1
fi

# Pousser le schéma vers la base de données
echo ""
print_info "Application du schéma Prisma..."
npm run db:push
if [ $? -eq 0 ]; then
    print_success "Schéma appliqué avec succès"
else
    print_error "Échec de l'application du schéma"
    exit 1
fi

# Résumé
echo ""
echo "============================================================"
print_success "Configuration terminée avec succès ! 🎉"
echo ""
echo "Prochaines étapes :"
echo "  1. Lancer le serveur : npm run dev"
echo "  2. (Optionnel) Peupler la DB : npm run db:seed"
echo "  3. (Optionnel) Ouvrir Prisma Studio : npx prisma studio"
echo ""
echo "URL de connexion :"
echo "  postgresql://$DB_USER:****@$DB_HOST:$DB_PORT/$DB_NAME"
echo "============================================================"

unset PGPASSWORD
