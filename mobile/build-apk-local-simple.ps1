# Script simplifie pour generer l'APK localement
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Build APK Local - CacaoTrack Agent" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Verifier app.json
if (-not (Test-Path "app.json")) {
    Write-Host "ERREUR app.json non trouve" -ForegroundColor Red
    exit 1
}

Write-Host "OK Configuration trouvee" -ForegroundColor Green
Write-Host ""

# Verifier si le dossier android/ existe
if (-not (Test-Path "android")) {
    Write-Host "Preparation du projet Android..." -ForegroundColor Yellow
    Write-Host "   Cela peut prendre 2-3 minutes..." -ForegroundColor Gray
    Write-Host ""
    
    npx expo prebuild --platform android --clean
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR lors de la preparation" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "OK Projet Android prepare" -ForegroundColor Green
} else {
    Write-Host "OK Dossier android/ existe deja" -ForegroundColor Green
}

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

# Builder l'APK Release (pas besoin d'appareil)
.\gradlew.bat assembleRelease

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
        Write-Host "   3. Ou utiliser ADB: adb install $fullPath" -ForegroundColor White
        Write-Host ""
        
        # Ouvrir l'explorateur Windows a l'emplacement de l'APK
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
}

Set-Location ..

