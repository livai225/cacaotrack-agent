# Script d'installation et test pour mobile
Write-Host "🚀 Installation et Test Mobile CacaoTrack" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Aller dans le dossier mobile
Set-Location $PSScriptRoot

# Vérifier si node_modules existe
if (Test-Path "node_modules") {
    Write-Host "📦 node_modules existe déjà" -ForegroundColor Yellow
    Write-Host "   Pour réinstaller: npm install" -ForegroundColor Gray
} else {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
}

Write-Host ""

# Vérifier les fichiers essentiels
Write-Host "🔍 Vérification des fichiers..." -ForegroundColor Yellow
$files = @("App.tsx", "index.js", "app.json", "src")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Commandes disponibles:" -ForegroundColor Cyan
Write-Host "  npm start          - Démarrer Metro Bundler" -ForegroundColor White
Write-Host "  npm run android    - Build Android" -ForegroundColor White
Write-Host "  npm run ios         - Build iOS (sur Mac)" -ForegroundColor White
Write-Host ""

# Vérifier Expo
Write-Host "🔍 Vérification Expo..." -ForegroundColor Yellow
try {
    $expoVersion = npx expo --version 2>&1
    if ($expoVersion -match "^\d+\.\d+") {
        Write-Host "✅ Expo CLI disponible: $expoVersion" -ForegroundColor Green
        Write-Host "   Pour utiliser Expo: npx expo start" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  Expo CLI non disponible (optionnel)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Vérification terminée!" -ForegroundColor Green

