# Script d'installation pour Expo
Write-Host "🚀 Installation des dépendances avec support Expo" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Aller dans le dossier mobile
Set-Location $PSScriptRoot

# Installer les dépendances avec legacy-peer-deps pour éviter les conflits
Write-Host "📦 Installation des dépendances (cela peut prendre quelques minutes)..." -ForegroundColor Yellow
Write-Host ""

npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
    Write-Host "   Essayez manuellement: npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Dépendances installées avec succès!" -ForegroundColor Green
Write-Host ""

# Vérifier Expo
Write-Host "🔍 Vérification d'Expo..." -ForegroundColor Yellow
try {
    $expoVersion = npx expo --version 2>&1
    if ($expoVersion -match "^\d+\.\d+") {
        Write-Host "✅ Expo CLI disponible: $expoVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Expo CLI non détecté, mais le package expo est installé" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Expo CLI non disponible (normal si c'est la première installation)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Commandes disponibles:" -ForegroundColor Cyan
Write-Host "  npm start              - Démarrer Metro Bundler (React Native CLI)" -ForegroundColor White
Write-Host "  npm run expo:start     - Démarrer avec Expo" -ForegroundColor White
Write-Host "  npm run android        - Build Android (React Native CLI)" -ForegroundColor White
Write-Host "  npm run expo:android   - Build Android avec Expo" -ForegroundColor White
Write-Host ""
Write-Host "✅ Installation terminée!" -ForegroundColor Green

