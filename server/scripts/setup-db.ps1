# Script de configuration de la base de données PostgreSQL + PostGIS
# Pour CacaoTrack Agent (Windows PowerShell)

Write-Host "🚀 Configuration de la base de données PostgreSQL + PostGIS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Variables
$DB_NAME = "asco_db"
$DB_USER = "asco_user"
$DB_PASSWORD = "AscoSecure2024!"
$DB_HOST = "82.208.22.230"
$DB_PORT = "5432"
$DATABASE_URL = "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Fonction pour afficher les messages
function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

# Vérifier si psql est disponible
Write-Host ""
Print-Info "Vérification de PostgreSQL..."
try {
    $psqlVersion = psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Print-Success "PostgreSQL trouvé : $psqlVersion"
    } else {
        throw
    }
} catch {
    Print-Error "PostgreSQL n'est pas installé ou pas dans le PATH"
    Write-Host "Téléchargez PostgreSQL depuis : https://www.postgresql.org/download/windows/"
    exit 1
}

# Test de connexion
Write-Host ""
Print-Info "Test de connexion à la base de données..."
$env:PGPASSWORD = $DB_PASSWORD

try {
    $testConnection = psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Print-Success "Connexion réussie à ${DB_HOST}:${DB_PORT}"
    } else {
        throw
    }
} catch {
    Print-Error "Impossible de se connecter à la base de données"
    Write-Host "Vérifiez les paramètres de connexion et le pare-feu"
    Remove-Item Env:\PGPASSWORD
    exit 1
}

# Vérifier l'extension PostGIS
Write-Host ""
Print-Info "Vérification de l'extension PostGIS..."
$postgisCheck = psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -t -c "SELECT COUNT(*) FROM pg_extension WHERE extname='postgis';" 2>&1

if ($postgisCheck -match "1") {
    Print-Success "Extension PostGIS activée"
    $postgisVersion = psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -t -c "SELECT PostGIS_version();" 2>&1
    Write-Host "   Version: $postgisVersion"
} else {
    Print-Info "Activation de l'extension PostGIS..."
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -c "CREATE EXTENSION IF NOT EXISTS postgis;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Print-Success "Extension PostGIS activée avec succès"
    } else {
        Print-Error "Échec de l'activation de PostGIS"
        Remove-Item Env:\PGPASSWORD
        exit 1
    }
}

Remove-Item Env:\PGPASSWORD

# Vérifier le fichier .env
Write-Host ""
Print-Info "Vérification du fichier .env..."
$envPath = Join-Path $PSScriptRoot ".." ".env"

if (Test-Path $envPath) {
    Print-Success "Fichier .env trouvé"
} else {
    Print-Info "Création du fichier .env..."
    $envContent = @"
# Configuration PostgreSQL + PostGIS
DATABASE_URL="$DATABASE_URL"
PORT=3000
"@
    Set-Content -Path $envPath -Value $envContent
    Print-Success "Fichier .env créé"
}

# Générer le client Prisma
Write-Host ""
Print-Info "Génération du client Prisma..."
Set-Location (Join-Path $PSScriptRoot "..")
npm run db:generate
if ($LASTEXITCODE -eq 0) {
    Print-Success "Client Prisma généré"
} else {
    Print-Error "Échec de la génération du client Prisma"
    exit 1
}

# Pousser le schéma vers la base de données
Write-Host ""
Print-Info "Application du schéma Prisma..."
npm run db:push
if ($LASTEXITCODE -eq 0) {
    Print-Success "Schéma appliqué avec succès"
} else {
    Print-Error "Échec de l'application du schéma"
    exit 1
}

# Résumé
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Print-Success "Configuration terminée avec succès ! 🎉"
Write-Host ""
Write-Host "Prochaines étapes :"
Write-Host "  1. Lancer le serveur : npm run dev"
Write-Host "  2. (Optionnel) Peupler la DB : npm run db:seed"
Write-Host "  3. (Optionnel) Ouvrir Prisma Studio : npx prisma studio"
Write-Host ""
Write-Host "URL de connexion :"
Write-Host "  postgresql://${DB_USER}:****@${DB_HOST}:${DB_PORT}/${DB_NAME}"
Write-Host "============================================================" -ForegroundColor Cyan
