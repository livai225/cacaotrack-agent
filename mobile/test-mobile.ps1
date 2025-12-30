# Script de test pour l'application mobile
Write-Host "🔍 Vérification du projet mobile CacaoTrack" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "📦 Vérification Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Vérifier les fichiers essentiels
Write-Host "📁 Vérification des fichiers..." -ForegroundColor Yellow
$files = @("App.tsx", "index.js", "app.json", "package.json", "src")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

Write-Host ""

# Vérifier les dépendances
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules n'existe pas - Exécutez 'npm install'" -ForegroundColor Yellow
}

Write-Host ""

# Vérifier les composants essentiels
Write-Host "🔧 Vérification des composants..." -ForegroundColor Yellow
$components = @(
    "src/components/StepIndicator.tsx",
    "src/navigation/BottomTabNavigator.tsx",
    "src/navigation/RootNavigator.tsx",
    "src/screens/HomeScreen.tsx",
    "src/screens/ProducteurScreen.tsx",
    "src/screens/ParcelleScreen.tsx",
    "src/screens/CollecteScreen.tsx"
)

foreach ($component in $components) {
    if (Test-Path $component) {
        Write-Host "✅ $component" -ForegroundColor Green
    } else {
        Write-Host "❌ $component manquant" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Vérification terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Commandes disponibles:" -ForegroundColor Cyan
Write-Host "  npm start          - Démarrer Metro Bundler"
Write-Host "  npm run android    - Build Android"
Write-Host "  npm run ios         - Build iOS (Mac uniquement)"
Write-Host ""

