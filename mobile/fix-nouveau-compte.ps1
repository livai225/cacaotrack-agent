# Script pour corriger la configuration avec le nouveau compte
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Configuration avec le nouveau compte Expo" -ForegroundColor Cyan
Write-Host ""

# Verifier le compte actuel
Write-Host "Compte actuel:" -ForegroundColor Yellow
$currentUser = eas whoami 2>&1
Write-Host "   $currentUser" -ForegroundColor Green
Write-Host ""

# Verifier app.json
Set-Location $PSScriptRoot
$appJson = Get-Content "app.json" -Raw | ConvertFrom-Json

if ($appJson.expo.extra.eas.projectId) {
    Write-Host "ATTENTION Ancien projectId trouve: $($appJson.expo.extra.eas.projectId)" -ForegroundColor Yellow
    Write-Host "   Suppression..." -ForegroundColor Gray
    
    # Supprimer l'ancien projectId
    $appJson.expo.PSObject.Properties.Remove('extra')
    if ($appJson.expo.PSObject.Properties.Name -contains 'owner') {
        $appJson.expo.PSObject.Properties.Remove('owner')
    }
    
    $appJson | ConvertTo-Json -Depth 10 | Set-Content "app.json"
    Write-Host "OK Ancien projectId supprime" -ForegroundColor Green
} else {
    Write-Host "OK Pas d'ancien projectId trouve" -ForegroundColor Green
}

Write-Host ""

# Instructions pour l'utilisateur
Write-Host "Instructions:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Initialiser le nouveau projet EAS:" -ForegroundColor Yellow
Write-Host "   eas init" -ForegroundColor White
Write-Host "   (Repondez 'y' ou 'yes' a la question)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Lancer le build:" -ForegroundColor Yellow
Write-Host "   eas build --platform android --profile preview" -ForegroundColor White
Write-Host ""

Write-Host "OU utilisez les commandes ci-dessous:" -ForegroundColor Cyan
Write-Host ""

