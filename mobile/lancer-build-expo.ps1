# Script pour lancer le build Expo en suivant les traces du projet
Write-Host "🚀 Lancement Build Expo - CacaoTrack Agent" -ForegroundColor Cyan
Write-Host ""

# Vérifier EAS CLI
Write-Host "🔍 Vérification EAS CLI..." -ForegroundColor Yellow
try {
    $easVersion = eas --version 2>&1
    if ($easVersion -match "^\d+\.\d+") {
        Write-Host "✅ EAS CLI installé: $easVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ EAS CLI non installé" -ForegroundColor Red
        Write-Host "📦 Installation d'EAS CLI..." -ForegroundColor Yellow
        npm install -g eas-cli
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "📦 Installation d'EAS CLI..." -ForegroundColor Yellow
    npm install -g eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Vérifier connexion Expo
Write-Host "🔍 Vérification connexion Expo..." -ForegroundColor Yellow
try {
    $whoami = eas whoami 2>&1
    if ($whoami -match "Not logged in" -or $whoami -match "error") {
        Write-Host "⚠️  Non connecté à Expo" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📝 Connexion à Expo..." -ForegroundColor Cyan
        Write-Host "   Créez un compte gratuit sur: https://expo.dev/signup" -ForegroundColor Gray
        Write-Host ""
        eas login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur lors de la connexion" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Connecté: $whoami" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Vérification échouée, tentative de connexion..." -ForegroundColor Yellow
    eas login
}

Write-Host ""

# Aller à la racine du projet (où se trouve eas.json)
Set-Location ..

# Vérifier eas.json
if (Test-Path "eas.json") {
    Write-Host "✅ eas.json trouvé" -ForegroundColor Green
    Write-Host "   Configuration:" -ForegroundColor Gray
    Get-Content "eas.json" | Select-Object -First 10 | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  eas.json non trouvé, configuration..." -ForegroundColor Yellow
    eas build:configure
}

Write-Host ""

# Vérifier app.json dans mobile/
if (Test-Path "mobile/app.json") {
    Write-Host "✅ mobile/app.json trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ mobile/app.json manquant" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Profils de build disponibles (selon eas.json):" -ForegroundColor Cyan
Write-Host "  1. Preview (APK pour test) - Recommandé" -ForegroundColor White
Write-Host "  2. Production (APK signé)" -ForegroundColor White
Write-Host "  3. Development (APK avec dev client)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choisissez un profil (1-3, défaut: 1)"

switch ($choice) {
    "1" {
        $profile = "preview"
        Write-Host ""
        Write-Host "🔨 Lancement build Preview (APK pour test)..." -ForegroundColor Green
    }
    "2" {
        $profile = "production"
        Write-Host ""
        Write-Host "🔨 Lancement build Production (APK signé)..." -ForegroundColor Green
    }
    "3" {
        $profile = "development"
        Write-Host ""
        Write-Host "🔨 Lancement build Development..." -ForegroundColor Green
    }
    default {
        $profile = "preview"
        Write-Host ""
        Write-Host "🔨 Lancement build Preview (par défaut)..." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "⏱️  Durée estimée: 10-15 minutes" -ForegroundColor Yellow
Write-Host "📦 Le build se fera en ligne sur les serveurs Expo" -ForegroundColor Yellow
Write-Host "🔗 Vous recevrez un lien de téléchargement à la fin" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Lancement du build..." -ForegroundColor Cyan
Write-Host ""

# Lancer le build selon les traces trouvées dans le projet
eas build --platform android --profile $profile

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build lancé avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "   1. Suivez le build sur: https://expo.dev" -ForegroundColor White
    Write-Host "   2. Attendez la fin du build (~10-15 minutes)" -ForegroundColor White
    Write-Host "   3. Téléchargez l'APK depuis le lien fourni" -ForegroundColor White
    Write-Host "   4. Installez l'APK sur votre appareil Android" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Pour voir la liste des builds:" -ForegroundColor Yellow
    Write-Host "   eas build:list" -ForegroundColor Gray
} else {
    Write-Host "❌ Erreur lors du lancement du build" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Vérifiez les logs ci-dessus pour plus de détails" -ForegroundColor Yellow
}

