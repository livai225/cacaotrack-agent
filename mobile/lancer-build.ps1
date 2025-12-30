# Script pour lancer le build APK avec EAS
Write-Host "🚀 Lancement Build APK - CacaoTrack Agent" -ForegroundColor Cyan
Write-Host ""

# Vérifier EAS CLI
Write-Host "🔍 Vérification EAS CLI..." -ForegroundColor Yellow
try {
    $easVersion = eas --version 2>&1
    Write-Host "✅ EAS CLI: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ EAS CLI non installé" -ForegroundColor Red
    Write-Host "   Installation: npm install -g eas-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Vérifier connexion
Write-Host "🔍 Vérification connexion..." -ForegroundColor Yellow
$whoami = eas whoami 2>&1
if ($whoami -match "Not logged in") {
    Write-Host "⚠️  Non connecté" -ForegroundColor Yellow
    Write-Host "   Connexion: eas login" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ Connecté: $whoami" -ForegroundColor Green
}

Write-Host ""

# Aller dans mobile/
Set-Location $PSScriptRoot

# Vérifier app.json
if (-not (Test-Path "app.json")) {
    Write-Host "❌ app.json non trouvé" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Configuration trouvée" -ForegroundColor Green
Write-Host ""

# Lancer le build
Write-Host "🔨 Lancement du build APK Preview..." -ForegroundColor Yellow
Write-Host "⏱️  Durée estimée: 10-15 minutes" -ForegroundColor Gray
Write-Host "📦 Le build se fera en ligne sur les serveurs Expo" -ForegroundColor Gray
Write-Host "🔗 Vous recevrez un lien de téléchargement à la fin" -ForegroundColor Gray
Write-Host ""

eas build --platform android --profile preview

Write-Host ""
Write-Host "✅ Build lancé!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Suivez le build sur: https://expo.dev" -ForegroundColor Cyan

