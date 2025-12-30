# Script de build avec Expo
Write-Host "🚀 Build Mobile avec Expo" -ForegroundColor Cyan
Write-Host ""

# Vérifier Expo CLI
Write-Host "🔍 Vérification Expo CLI..." -ForegroundColor Yellow
try {
    $expoVersion = npx expo --version 2>&1
    if ($expoVersion -match "^\d+\.\d+") {
        Write-Host "✅ Expo CLI disponible" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Installation d'Expo CLI..." -ForegroundColor Yellow
        npm install -g @expo/cli
    }
} catch {
    Write-Host "⚠️  Installation d'Expo CLI..." -ForegroundColor Yellow
    npm install -g @expo/cli
}

Write-Host ""

# Aller à la racine du projet (où se trouve app.json)
Set-Location ..

# Vérifier app.json
if (Test-Path "app.json") {
    Write-Host "✅ app.json trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ app.json manquant à la racine" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📱 Options de build:" -ForegroundColor Cyan
Write-Host "  1. Démarrer Expo (npx expo start)" -ForegroundColor White
Write-Host "  2. Build Android APK (eas build --platform android --profile preview)" -ForegroundColor White
Write-Host "  3. Build Android AAB (eas build --platform android --profile production)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choisissez une option (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Démarrage d'Expo..." -ForegroundColor Green
        npx expo start
    }
    "2" {
        Write-Host "🔨 Build Android APK..." -ForegroundColor Green
        Write-Host "⚠️  Assurez-vous d'être connecté avec 'eas login'" -ForegroundColor Yellow
        eas build --platform android --profile preview
    }
    "3" {
        Write-Host "🔨 Build Android AAB..." -ForegroundColor Green
        Write-Host "⚠️  Assurez-vous d'être connecté avec 'eas login'" -ForegroundColor Yellow
        eas build --platform android --profile production
    }
    default {
        Write-Host "❌ Option invalide" -ForegroundColor Red
    }
}

