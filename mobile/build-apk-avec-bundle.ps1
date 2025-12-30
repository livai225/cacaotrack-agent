# Script pour générer le bundle JavaScript et construire l'APK
# Ce script résout l'erreur "Unable to load script"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build APK avec Bundle JavaScript" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Aller dans le dossier mobile
Set-Location $PSScriptRoot

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR: package.json introuvable. Assurez-vous d'être dans le dossier mobile." -ForegroundColor Red
    exit 1
}

Write-Host "Étape 1: Nettoyage des anciens builds..." -ForegroundColor Yellow
if (Test-Path "android\app\build") {
    Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue
}
if (Test-Path "android\build") {
    Remove-Item -Recurse -Force "android\build" -ErrorAction SilentlyContinue
}
if (Test-Path ".expo") {
    Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Étape 2: Génération du bundle JavaScript..." -ForegroundColor Yellow
Write-Host ""

# S'assurer que le dossier assets existe
$assetsDir = "android\app\src\main\assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
    Write-Host "Dossier assets créé: $assetsDir" -ForegroundColor Green
}

# Méthode 1: Générer le bundle avec react-native bundle (plus fiable pour release)
Write-Host "Génération du bundle avec react-native bundle..." -ForegroundColor Cyan
$metroBundle = & npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output "$assetsDir\index.android.bundle" --assets-dest android/app/src/main/res --reset-cache 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Bundle généré avec succès!" -ForegroundColor Green
    
    # Vérifier que le bundle existe
    $bundlePath = "$assetsDir\index.android.bundle"
    if (Test-Path $bundlePath) {
        $bundleSize = (Get-Item $bundlePath).Length / 1KB
        Write-Host "Bundle créé: $bundlePath ($([math]::Round($bundleSize, 2)) KB)" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "ERREUR lors de la génération du bundle:" -ForegroundColor Red
    Write-Host $metroBundle -ForegroundColor Red
    Write-Host ""
    Write-Host "Tentative alternative avec Expo..." -ForegroundColor Yellow
    
    # Méthode alternative: Expo export
    $expoBundle = & npx expo export --platform android --output-dir android/app/src/main/assets 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERREUR lors de la génération du bundle Expo:" -ForegroundColor Red
        Write-Host $expoBundle -ForegroundColor Red
        Write-Host ""
        Write-Host "ATTENTION: Le bundle pourrait ne pas être inclus dans l'APK!" -ForegroundColor Yellow
        Write-Host "Le build continuera, mais l'application pourrait ne pas fonctionner." -ForegroundColor Yellow
    } else {
        Write-Host "Bundle Expo généré avec succès!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Étape 3: Vérification que le dossier assets existe..." -ForegroundColor Yellow
$assetsDir = "android\app\src\main\assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
    Write-Host "Dossier assets créé: $assetsDir" -ForegroundColor Green
}

Write-Host ""
Write-Host "Étape 4: Build de l'APK avec Gradle..." -ForegroundColor Yellow
Write-Host ""

Set-Location android

# Nettoyer le build précédent
Write-Host "Nettoyage du build Gradle..." -ForegroundColor Cyan
& .\gradlew.bat clean --no-daemon 2>&1 | Out-Null

# Construire l'APK release
Write-Host ""
Write-Host "Construction de l'APK Release..." -ForegroundColor Cyan
Write-Host ""

$buildOutput = & .\gradlew.bat assembleRelease --no-daemon 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  BUILD RÉUSSI!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $apkFullPath = (Resolve-Path $apkPath).Path
        Write-Host "APK généré: $apkFullPath" -ForegroundColor Green
        Write-Host ""
        Write-Host "Taille du fichier: $((Get-Item $apkFullPath).Length / 1MB) MB" -ForegroundColor Cyan
        Write-Host ""
        
        # Ouvrir le dossier
        Start-Process explorer.exe -ArgumentList "/select,`"$apkFullPath`""
    } else {
        Write-Host "APK introuvable à: $apkPath" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ERREUR LORS DU BUILD" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host $buildOutput -ForegroundColor Red
}

Set-Location ..

Write-Host ""
Write-Host "Terminé!" -ForegroundColor Cyan
Write-Host ""

