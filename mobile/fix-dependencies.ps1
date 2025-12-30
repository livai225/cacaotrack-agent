# Script pour corriger les dependances pour Expo SDK 51
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Correction des dependances pour Expo SDK 51" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Verifier Expo CLI
Write-Host "Verification Expo CLI..." -ForegroundColor Yellow
try {
    $expoVersion = npx expo --version 2>&1
    Write-Host "OK Expo CLI disponible" -ForegroundColor Green
} catch {
    Write-Host "ERREUR Expo CLI non disponible" -ForegroundColor Red
    Write-Host "   Installation: npm install -g @expo/cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Corriger les versions avec expo install
Write-Host "Correction automatique des versions..." -ForegroundColor Yellow
Write-Host "   Cela peut prendre quelques minutes..." -ForegroundColor Gray
Write-Host ""

npx expo install --fix

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "OK Versions corrigees" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ATTENTION Certaines versions n'ont pas pu etre corrigees automatiquement" -ForegroundColor Yellow
}

Write-Host ""

# Verifier les versions critiques
Write-Host "Verification des versions critiques..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

Write-Host "   React: $($packageJson.dependencies.react)" -ForegroundColor Gray
Write-Host "   React Native: $($packageJson.dependencies.'react-native')" -ForegroundColor Gray
Write-Host "   Expo: $($packageJson.dependencies.expo)" -ForegroundColor Gray

Write-Host ""

# Instructions pour relancer le build
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "   1. Verifier que les dependances sont installees localement:" -ForegroundColor White
Write-Host "      npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Relancer le build EAS:" -ForegroundColor White
Write-Host "      eas build --platform android --profile preview" -ForegroundColor Gray
Write-Host ""

