# Script pour générer l'APK en ligne avec EAS Build
Write-Host "🚀 Génération APK avec EAS Build" -ForegroundColor Cyan
Write-Host ""

# Vérifier EAS CLI
Write-Host "🔍 Vérification EAS CLI..." -ForegroundColor Yellow
try {
    $easVersion = eas --version 2>&1
    if ($easVersion -match "^\d+\.\d+") {
        Write-Host "✅ EAS CLI installé: $easVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠️  EAS CLI non trouvé, installation..." -ForegroundColor Yellow
        npm install -g eas-cli
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur lors de l'installation d'EAS CLI" -ForegroundColor Red
            Write-Host "   Installez manuellement: npm install -g eas-cli" -ForegroundColor Yellow
            exit 1
        }
    }
} catch {
    Write-Host "⚠️  Installation d'EAS CLI..." -ForegroundColor Yellow
    npm install -g eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation d'EAS CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Aller dans le dossier mobile
Set-Location $PSScriptRoot

# Vérifier si on est connecté à Expo
Write-Host "🔍 Vérification de la connexion Expo..." -ForegroundColor Yellow
try {
    $whoami = eas whoami 2>&1
    if ($whoami -match "Not logged in") {
        Write-Host "⚠️  Vous n'êtes pas connecté à Expo" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📝 Connexion à Expo..." -ForegroundColor Cyan
        Write-Host "   Si vous n'avez pas de compte, créez-en un sur: https://expo.dev/signup" -ForegroundColor Gray
        Write-Host ""
        eas login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur lors de la connexion" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Connecté en tant que: $whoami" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Vérification de connexion échouée, tentative de connexion..." -ForegroundColor Yellow
    eas login
}

Write-Host ""

# Vérifier eas.json
if (Test-Path "../eas.json") {
    Write-Host "✅ eas.json trouvé à la racine" -ForegroundColor Green
} else {
    Write-Host "⚠️  eas.json non trouvé, création..." -ForegroundColor Yellow
    Copy-Item "../eas.json" -ErrorAction SilentlyContinue
    if (-not (Test-Path "../eas.json")) {
        Write-Host "❌ Impossible de créer eas.json" -ForegroundColor Red
        Write-Host "   Exécutez: eas build:configure" -ForegroundColor Yellow
    }
}

Write-Host ""

# Vérifier app.json
if (Test-Path "app.json") {
    Write-Host "✅ app.json trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ app.json manquant" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Options de build:" -ForegroundColor Cyan
Write-Host "  1. APK Preview (pour test) - Recommandé" -ForegroundColor White
Write-Host "  2. APK Production (signé)" -ForegroundColor White
Write-Host "  3. AAB Production (pour Play Store)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choisissez une option (1-3)"

# Aller à la racine du projet pour le build
Set-Location ..

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔨 Lancement du build APK Preview..." -ForegroundColor Green
        Write-Host "   ⏱️  Durée estimée: 10-15 minutes" -ForegroundColor Yellow
        Write-Host "   📦 Le build se fera en ligne sur les serveurs Expo" -ForegroundColor Yellow
        Write-Host "   🔗 Vous recevrez un lien de téléchargement à la fin" -ForegroundColor Yellow
        Write-Host ""
        eas build --platform android --profile preview
    }
    "2" {
        Write-Host ""
        Write-Host "🔨 Lancement du build APK Production..." -ForegroundColor Green
        Write-Host "   ⏱️  Durée estimée: 10-15 minutes" -ForegroundColor Yellow
        Write-Host "   📦 Le build se fera en ligne sur les serveurs Expo" -ForegroundColor Yellow
        Write-Host "   🔗 Vous recevrez un lien de téléchargement à la fin" -ForegroundColor Yellow
        Write-Host ""
        eas build --platform android --profile production
    }
    "3" {
        Write-Host ""
        Write-Host "🔨 Lancement du build AAB Production..." -ForegroundColor Green
        Write-Host "   ⏱️  Durée estimée: 10-15 minutes" -ForegroundColor Yellow
        Write-Host "   📦 Le build se fera en ligne sur les serveurs Expo" -ForegroundColor Yellow
        Write-Host "   🔗 Vous recevrez un lien de téléchargement à la fin" -ForegroundColor Yellow
        Write-Host ""
        # Modifier temporairement eas.json pour AAB
        $easContent = Get-Content "../eas.json" -Raw | ConvertFrom-Json
        $easContent.build.production.android.buildType = "app-bundle"
        $easContent | ConvertTo-Json -Depth 10 | Set-Content "../eas.json.tmp"
        eas build --platform android --profile production
        Remove-Item "../eas.json.tmp" -ErrorAction SilentlyContinue
    }
    default {
        Write-Host "❌ Option invalide" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Build lancé!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Suivez le build sur: https://expo.dev/accounts/[votre-compte]/projects/cacaotrack-agent/builds" -ForegroundColor White
Write-Host "   2. Attendez la fin du build (~10-15 minutes)" -ForegroundColor White
Write-Host "   3. Téléchargez l'APK depuis le lien fourni" -ForegroundColor White
Write-Host "   4. Installez l'APK sur votre appareil Android" -ForegroundColor White
Write-Host ""

