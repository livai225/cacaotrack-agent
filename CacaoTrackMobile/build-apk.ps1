# Script PowerShell pour builder l'APK CacaoTrack Mobile

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CacaoTrack Mobile - Build APK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si le dossier android existe
if (-Not (Test-Path "android")) {
    Write-Host "[1/3] Génération des fichiers Android natifs..." -ForegroundColor Yellow
    npx expo prebuild --platform android
    Write-Host "✓ Fichiers Android générés" -ForegroundColor Green
} else {
    Write-Host "✓ Dossier Android déjà présent" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/3] Compilation de l'APK..." -ForegroundColor Yellow
Write-Host "Cela peut prendre 5-10 minutes..." -ForegroundColor Gray
Write-Host ""

# Aller dans le dossier android
Set-Location android

# Builder l'APK
try {
    .\gradlew assembleRelease --no-daemon
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ APK GÉNÉRÉ AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    
    if (Test-Path $apkPath) {
        $apkSize = (Get-Item $apkPath).Length / 1MB
        Write-Host "Localisation : $PWD\$apkPath" -ForegroundColor Cyan
        Write-Host "Taille       : $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Vous pouvez maintenant installer cet APK sur vos tablettes !" -ForegroundColor Green
        
        # Ouvrir le dossier contenant l'APK
        Write-Host ""
        $openFolder = Read-Host "Voulez-vous ouvrir le dossier contenant l'APK ? (O/N)"
        if ($openFolder -eq "O" -or $openFolder -eq "o") {
            explorer.exe (Split-Path $apkPath -Parent)
        }
    }
    
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ ERREUR LORS DU BUILD" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solution recommandée :" -ForegroundColor Yellow
    Write-Host "1. Ouvrir Android Studio" -ForegroundColor White
    Write-Host "2. File → Open → Sélectionner le dossier 'android'" -ForegroundColor White
    Write-Host "3. Attendre le Gradle sync" -ForegroundColor White
    Write-Host "4. Build → Build Bundle(s) / APK(s) → Build APK(s)" -ForegroundColor White
    Write-Host ""
    Write-Host "Erreur détaillée :" -ForegroundColor Gray
    Write-Host $_.Exception.Message -ForegroundColor Gray
}

# Retourner au dossier parent
Set-Location ..

Write-Host ""
Write-Host "Appuyez sur une touche pour quitter..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
