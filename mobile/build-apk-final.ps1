# Script final pour generer l'APK localement
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Build APK Local - Solution Finale" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Verifier app.json
if (-not (Test-Path "app.json")) {
    Write-Host "ERREUR app.json non trouve" -ForegroundColor Red
    exit 1
}

Write-Host "OK Configuration trouvee" -ForegroundColor Green
Write-Host ""

# Essayer de supprimer android/ si verrouille
if (Test-Path "android") {
    Write-Host "Suppression du dossier android/ (peut etre verrouille)..." -ForegroundColor Yellow
    
    # Tuer les processus Gradle qui pourraient verrouiller
    Get-Process | Where-Object { $_.ProcessName -like "*java*" -or $_.ProcessName -like "*gradle*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Start-Sleep -Seconds 2
    
    # Essayer de supprimer
    try {
        Remove-Item -Recurse -Force android -ErrorAction Stop
        Write-Host "OK Dossier android/ supprime" -ForegroundColor Green
    } catch {
        Write-Host "ATTENTION Impossible de supprimer android/ (verrouille)" -ForegroundColor Yellow
        Write-Host "   Fermez Android Studio, Gradle, ou redemarrez PowerShell" -ForegroundColor Gray
        Write-Host "   Puis relancez ce script" -ForegroundColor Gray
        exit 1
    }
}

Write-Host ""

# Preparer le projet Android
Write-Host "Preparation du projet Android..." -ForegroundColor Yellow
Write-Host "   Cela peut prendre 2-3 minutes..." -ForegroundColor Gray
Write-Host ""

npx expo prebuild --platform android --clean

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors de la preparation" -ForegroundColor Red
    Write-Host "   Verifiez les logs ci-dessus" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "OK Projet Android prepare" -ForegroundColor Green
Write-Host ""

# Verifier Gradle
if (-not (Test-Path "android\gradlew.bat")) {
    Write-Host "ERREUR Gradle wrapper non trouve" -ForegroundColor Red
    exit 1
}

Write-Host "Build de l'APK Release..." -ForegroundColor Yellow
Write-Host "   Cela peut prendre 5-10 minutes..." -ForegroundColor Gray
Write-Host "   (Pas besoin d'appareil connecte)" -ForegroundColor Gray
Write-Host ""

Set-Location android

# Builder avec options pour eviter les problemes de cache
.\gradlew.bat clean assembleRelease --no-daemon --no-build-cache

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "OK Build reussi!" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $apkInfo = Get-Item $apkPath
        $fullPath = $apkInfo.FullName
        
        Write-Host "APK genere avec succes!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Emplacement: $fullPath" -ForegroundColor Cyan
        Write-Host "Taille: $([math]::Round($apkInfo.Length / 1MB, 2)) MB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Vous pouvez maintenant:" -ForegroundColor Yellow
        Write-Host "   1. Copier cet APK sur votre appareil Android" -ForegroundColor White
        Write-Host "   2. Installer l'APK sur l'appareil" -ForegroundColor White
        Write-Host "   3. Ou utiliser ADB: adb install `"$fullPath`"" -ForegroundColor White
        Write-Host ""
        
        # Ouvrir l'explorateur Windows
        $apkDir = Split-Path $fullPath
        Write-Host "Ouverture de l'explorateur Windows..." -ForegroundColor Gray
        Start-Process explorer.exe -ArgumentList $apkDir
    } else {
        Write-Host "ATTENTION APK non trouve" -ForegroundColor Yellow
        Write-Host "   Cherchez dans: android\app\build\outputs\apk\release\" -ForegroundColor Gray
    }
} else {
    Write-Host ""
    Write-Host "ERREUR lors du build" -ForegroundColor Red
    Write-Host "   Verifiez les logs ci-dessus" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Solutions possibles:" -ForegroundColor Cyan
    Write-Host "   1. Fermer Android Studio si ouvert" -ForegroundColor White
    Write-Host "   2. Redemarrer PowerShell" -ForegroundColor White
    Write-Host "   3. Verifier que Java JDK est installe" -ForegroundColor White
    Write-Host "   4. Verifier ANDROID_HOME est configure" -ForegroundColor White
}

Set-Location ..

