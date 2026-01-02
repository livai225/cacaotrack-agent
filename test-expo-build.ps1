# Script de test et build Expo pour CacaoTrack Mobile

Write-Host "🧪 Test et Build Expo - CacaoTrack Mobile" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "CacaoTrackMobile\package.json")) {
    Write-Host "❌ Dossier CacaoTrackMobile non trouvé !" -ForegroundColor Red
    Write-Host "💡 Exécutez ce script depuis la racine du projet" -ForegroundColor Yellow
    exit 1
}

Set-Location CacaoTrackMobile

Write-Host "1️⃣  Vérification des fichiers..." -ForegroundColor Cyan
$filesToCheck = @(
    "src\components\StepIndicator.tsx",
    "src\navigation\BottomTabNavigator.tsx",
    "src\navigation\RootNavigator.tsx",
    "src\screens\HomeScreen.tsx",
    "src\screens\ProducteurScreen.tsx",
    "package.json"
)

$allFilesExist = $true
foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file manquant" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n❌ Certains fichiers sont manquants !" -ForegroundColor Red
    Write-Host "💡 Exécutez: .\sync-mobile-to-expo.ps1" -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

Write-Host "`n2️⃣  Installation des dépendances..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "  📦 Installation npm..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Erreur lors de l'installation" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "  ✅ node_modules existe" -ForegroundColor Green
}

Write-Host "`n3️⃣  Installation dépendances Expo..." -ForegroundColor Cyan
npx expo install react-native-vector-icons @react-navigation/bottom-tabs --yes
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠️  Certaines dépendances peuvent déjà être installées" -ForegroundColor Yellow
}

Write-Host "`n4️⃣  Vérification configuration Expo..." -ForegroundColor Cyan
npx expo-doctor
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠️  expo-doctor a signalé des avertissements" -ForegroundColor Yellow
}

Write-Host "`n5️⃣  Vérification TypeScript..." -ForegroundColor Cyan
if (Test-Path "tsconfig.json") {
    npx tsc --noEmit 2>&1 | Select-Object -First 10
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Aucune erreur TypeScript" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Erreurs TypeScript détectées (voir ci-dessus)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Vérifications terminées !" -ForegroundColor Green
Write-Host "`n🚀 Pour lancer l'application :" -ForegroundColor Cyan
Write-Host "   npx expo start" -ForegroundColor White
Write-Host "`n📱 Pour build avec EAS :" -ForegroundColor Cyan
Write-Host "   eas build --platform android --profile preview" -ForegroundColor White
Write-Host ""

# Demander si on veut lancer expo start
$response = Read-Host "Voulez-vous lancer Expo maintenant ? (O/N)"
if ($response -eq "O" -or $response -eq "o" -or $response -eq "y" -or $response -eq "Y") {
    Write-Host "`n🚀 Démarrage de Expo..." -ForegroundColor Green
    Write-Host "   Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow
    Write-Host ""
    npx expo start
} else {
    Write-Host "`n💡 Pour lancer plus tard : cd CacaoTrackMobile && npx expo start" -ForegroundColor Yellow
}

Set-Location ..

