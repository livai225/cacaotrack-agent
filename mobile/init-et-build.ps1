# Script pour initialiser EAS et lancer le build
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Initialisation EAS et Build APK" -ForegroundColor Cyan
Write-Host ""

# Verifier EAS CLI
Write-Host "Verification EAS CLI..." -ForegroundColor Yellow
try {
    $easVersion = eas --version 2>&1
    Write-Host "OK EAS CLI: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR EAS CLI non installe" -ForegroundColor Red
    Write-Host "   Installation: npm install -g eas-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Verifier connexion
Write-Host "Verification connexion..." -ForegroundColor Yellow
$whoami = eas whoami 2>&1
if ($whoami -match "Not logged in") {
    Write-Host "ATTENTION Non connecte" -ForegroundColor Yellow
    Write-Host "   Connexion: eas login" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "OK Connecte: $whoami" -ForegroundColor Green
}

Write-Host ""

# Aller dans mobile/
Set-Location $PSScriptRoot

# Verifier app.json
if (-not (Test-Path "app.json")) {
    Write-Host "ERREUR app.json non trouve" -ForegroundColor Red
    exit 1
}

Write-Host "OK Configuration trouvee" -ForegroundColor Green
Write-Host ""

# Verifier si le projet EAS est configure
Write-Host "Verification configuration EAS..." -ForegroundColor Yellow
$appJson = Get-Content "app.json" -Raw | ConvertFrom-Json
$hasProjectId = $appJson.expo.extra.eas.projectId -ne $null

if (-not $hasProjectId) {
    Write-Host "ATTENTION Projet EAS non configure" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Initialisation du projet EAS..." -ForegroundColor Cyan
    Write-Host "   Repondez 'y' ou 'yes' aux questions" -ForegroundColor Gray
    Write-Host ""
    
    # Initialiser le projet
    eas init
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR lors de l'initialisation" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "OK Projet EAS initialise" -ForegroundColor Green
} else {
    Write-Host "OK Projet EAS deja configure" -ForegroundColor Green
}

Write-Host ""

# Lancer le build
Write-Host "Lancement du build APK Preview..." -ForegroundColor Yellow
Write-Host "Duree estimee: 10-15 minutes" -ForegroundColor Gray
Write-Host "Le build se fera en ligne sur les serveurs Expo" -ForegroundColor Gray
Write-Host "Vous recevrez un lien de telechargement a la fin" -ForegroundColor Gray
Write-Host ""

eas build --platform android --profile preview

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "OK Build lance!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Suivez le build sur: https://expo.dev" -ForegroundColor Cyan
    Write-Host "Ou: https://expo.dev/accounts/livai/projects/cacaotrack-agent/builds" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ERREUR lors du lancement du build" -ForegroundColor Red
    Write-Host "Verifiez les messages ci-dessus" -ForegroundColor Yellow
}

