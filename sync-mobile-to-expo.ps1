# Script PowerShell pour synchroniser les fichiers de mobile/ vers CacaoTrackMobile/

Write-Host "🔄 Synchronisation des fichiers mobile vers Expo..." -ForegroundColor Cyan

# Créer les dossiers si nécessaire
$directories = @(
    "CacaoTrackMobile\src\components",
    "CacaoTrackMobile\src\navigation",
    "CacaoTrackMobile\src\screens"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Dossier créé: $dir" -ForegroundColor Green
    }
}

# Copier StepIndicator
if (Test-Path "mobile\src\components\StepIndicator.tsx") {
    Copy-Item "mobile\src\components\StepIndicator.tsx" "CacaoTrackMobile\src\components\" -Force
    Write-Host "✅ StepIndicator.tsx copié" -ForegroundColor Green
} else {
    Write-Host "❌ StepIndicator.tsx non trouvé" -ForegroundColor Red
}

# Copier BottomTabNavigator
if (Test-Path "mobile\src\navigation\BottomTabNavigator.tsx") {
    Copy-Item "mobile\src\navigation\BottomTabNavigator.tsx" "CacaoTrackMobile\src\navigation\" -Force
    Write-Host "✅ BottomTabNavigator.tsx copié" -ForegroundColor Green
} else {
    Write-Host "❌ BottomTabNavigator.tsx non trouvé" -ForegroundColor Red
}

# Copier RootNavigator
if (Test-Path "mobile\src\navigation\RootNavigator.tsx") {
    Copy-Item "mobile\src\navigation\RootNavigator.tsx" "CacaoTrackMobile\src\navigation\" -Force
    Write-Host "✅ RootNavigator.tsx copié" -ForegroundColor Green
} else {
    Write-Host "❌ RootNavigator.tsx non trouvé" -ForegroundColor Red
}

# Copier tous les écrans
Write-Host "`n📱 Copie des écrans..." -ForegroundColor Cyan

$screens = @(
    "HomeScreen.tsx",
    "ProducteurScreen.tsx",
    "ParcelleScreen.tsx",
    "CollecteScreen.tsx",
    "OrganisationScreen.tsx",
    "ProducteursListScreen.tsx",
    "PlantationsListScreen.tsx",
    "RecoltesListScreen.tsx"
)

foreach ($screen in $screens) {
    $source = "mobile\src\screens\$screen"
    $dest = "CacaoTrackMobile\src\screens\$screen"
    
    if (Test-Path $source) {
        Copy-Item $source $dest -Force
        Write-Host "✅ $screen copié" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $screen non trouvé (peut-etre normal)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Synchronisation terminée !" -ForegroundColor Green
Write-Host "`n📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. cd CacaoTrackMobile"
Write-Host "2. npm install"
Write-Host "3. npx expo install react-native-vector-icons @react-navigation/bottom-tabs"
Write-Host "4. npx expo start"

