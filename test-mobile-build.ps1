# Script PowerShell de test et build pour l'application mobile Expo

Write-Host "🧪 Test et Build Application Mobile CacaoTrack" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "CacaoTrackMobile")) {
    Write-Host "❌ Dossier CacaoTrackMobile non trouvé !" -ForegroundColor Red
    Write-Host "💡 Exécutez d'abord: .\sync-mobile-to-expo.ps1" -ForegroundColor Yellow
    exit 1
}

Set-Location CacaoTrackMobile

Write-Host "1️⃣  Vérification des dépendances..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ node_modules existe" -ForegroundColor Green
}

Write-Host "`n2️⃣  Installation des dépendances Expo manquantes..." -ForegroundColor Cyan
npx expo install react-native-vector-icons @react-navigation/bottom-tabs
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Certaines dépendances peuvent déjà être installées" -ForegroundColor Yellow
}

Write-Host "`n3️⃣  Vérification de la configuration Expo..." -ForegroundColor Cyan
npx expo-doctor
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  expo-doctor peut signaler des avertissements" -ForegroundColor Yellow
}

Write-Host "`n4️⃣  Vérification TypeScript..." -ForegroundColor Cyan
if (Test-Path "tsconfig.json") {
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Erreurs TypeScript détectées" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Aucune erreur TypeScript" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  tsconfig.json non trouvé" -ForegroundColor Yellow
}

Write-Host "`n5️⃣  Test de démarrage Expo..." -ForegroundColor Cyan
Write-Host "🚀 Pour lancer l'application :" -ForegroundColor Green
Write-Host "   npx expo start" -ForegroundColor White
Write-Host "`n📱 Pour build avec EAS :" -ForegroundColor Green
Write-Host "   eas build --platform android --profile preview" -ForegroundColor White
Write-Host ""

# Demander si on veut lancer expo start
$response = Read-Host "Voulez-vous lancer Expo maintenant ? (O/N)"
if ($response -eq "O" -or $response -eq "o") {
    Write-Host "🚀 Démarrage de Expo..." -ForegroundColor Green
    npx expo start
}

Set-Location ..

