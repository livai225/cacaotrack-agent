# Script pour builder l'APK localement avec Android Studio
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Build APK Local - CacaoTrack Agent" -ForegroundColor Cyan
Write-Host ""

# Verifier si on est dans mobile/
Set-Location $PSScriptRoot

# Verifier app.json
if (-not (Test-Path "app.json")) {
    Write-Host "ERREUR app.json non trouve" -ForegroundColor Red
    exit 1
}

Write-Host "OK Configuration trouvee" -ForegroundColor Green
Write-Host ""

# Verifier si Android Studio est installe
Write-Host "Verification Android Studio..." -ForegroundColor Yellow
$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    Write-Host "ATTENTION ANDROID_HOME non configure" -ForegroundColor Yellow
    Write-Host "   Android Studio doit etre installe" -ForegroundColor Gray
    Write-Host "   Configurez ANDROID_HOME dans les variables d'environnement" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Exemple:" -ForegroundColor Gray
    Write-Host "   ANDROID_HOME=C:\Users\VotreNom\AppData\Local\Android\Sdk" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "OK ANDROID_HOME: $androidHome" -ForegroundColor Green
}

Write-Host ""

# Verifier si le dossier android/ existe
if (Test-Path "android") {
    Write-Host "ATTENTION Dossier android/ existe deja" -ForegroundColor Yellow
    Write-Host "   Suppression de l'ancien dossier..." -ForegroundColor Gray
    Remove-Item -Recurse -Force android
    Write-Host "OK Dossier supprime" -ForegroundColor Green
}

Write-Host ""

# Preparer le projet Android avec Expo
Write-Host "Preparation du projet Android..." -ForegroundColor Yellow
Write-Host "   Cela peut prendre quelques minutes..." -ForegroundColor Gray
Write-Host ""

npx expo prebuild --platform android --clean

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors de la preparation du projet" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "OK Projet Android prepare" -ForegroundColor Green
Write-Host ""

# Verifier si Gradle est disponible
Write-Host "Verification Gradle..." -ForegroundColor Yellow
if (Test-Path "android\gradlew.bat") {
    Write-Host "OK Gradle wrapper trouve" -ForegroundColor Green
} else {
    Write-Host "ERREUR Gradle wrapper non trouve" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Builder l'APK
Write-Host "Build de l'APK Release..." -ForegroundColor Yellow
Write-Host "   Cela peut prendre 5-10 minutes..." -ForegroundColor Gray
Write-Host ""

Set-Location android
.\gradlew.bat assembleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "OK Build reussi!" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $apkInfo = Get-Item $apkPath
        Write-Host "APK genere avec succes!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Emplacement: $($apkInfo.FullName)" -ForegroundColor Cyan
        Write-Host "Taille: $([math]::Round($apkInfo.Length / 1MB, 2)) MB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Vous pouvez maintenant installer cet APK sur vos appareils Android" -ForegroundColor Yellow
    } else {
        Write-Host "ATTENTION APK non trouve a l'emplacement attendu" -ForegroundColor Yellow
        Write-Host "   Cherchez dans: android\app\build\outputs\apk\release\" -ForegroundColor Gray
    }
} else {
    Write-Host ""
    Write-Host "ERREUR lors du build" -ForegroundColor Red
    Write-Host "   Verifiez les logs ci-dessus" -ForegroundColor Yellow
}

Set-Location ..

