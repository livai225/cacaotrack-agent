# Script pour changer de compte Expo et relancer le build
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Changement de compte Expo" -ForegroundColor Cyan
Write-Host ""

# Verifier EAS CLI
Write-Host "Verification EAS CLI..." -ForegroundColor Yellow
try {
    $easVersion = eas --version 2>&1
    Write-Host "OK EAS CLI: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR EAS CLI non installe" -ForegroundColor Red
    Write-Host "   Installation: npm install -g eas-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Afficher le compte actuel
Write-Host "Compte actuel:" -ForegroundColor Yellow
$currentUser = eas whoami 2>&1
if ($currentUser -match "Not logged in") {
    Write-Host "   Non connecte" -ForegroundColor Gray
} else {
    Write-Host "   $currentUser" -ForegroundColor Green
}

Write-Host ""

# Demander si on veut se deconnecter
Write-Host "Voulez-vous vous deconnecter et utiliser un autre compte?" -ForegroundColor Cyan
Write-Host "   1. Oui, me deconnecter et utiliser un autre compte" -ForegroundColor White
Write-Host "   2. Non, garder le compte actuel" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Votre choix (1 ou 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Deconnexion..." -ForegroundColor Yellow
    eas logout
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK Deconnecte" -ForegroundColor Green
        Write-Host ""
        Write-Host "Connexion avec un nouveau compte..." -ForegroundColor Yellow
        Write-Host "   Si vous n'avez pas de compte, creez-en un sur: https://expo.dev/signup" -ForegroundColor Gray
        Write-Host ""
        
        eas login
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            $newUser = eas whoami 2>&1
            Write-Host "OK Connecte en tant que: $newUser" -ForegroundColor Green
            Write-Host ""
            
            # Supprimer l'ancien projectId de app.json
            Write-Host "Suppression de l'ancienne configuration..." -ForegroundColor Yellow
            $appJson = Get-Content "app.json" -Raw | ConvertFrom-Json
            
            if ($appJson.expo.extra.eas.projectId) {
                $appJson.expo.extra = $null
                $appJson | ConvertTo-Json -Depth 10 | Set-Content "app.json"
                Write-Host "OK Ancienne configuration supprimee" -ForegroundColor Green
            }
            
            Write-Host ""
            Write-Host "Initialisation du nouveau projet EAS..." -ForegroundColor Yellow
            Write-Host "   Repondez 'y' ou 'yes' aux questions" -ForegroundColor Gray
            Write-Host ""
            
            eas init
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "OK Nouveau projet EAS initialise!" -ForegroundColor Green
                Write-Host ""
                Write-Host "Lancement du build APK..." -ForegroundColor Yellow
                Write-Host ""
                
                eas build --platform android --profile preview
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host ""
                    Write-Host "OK Build lance avec le nouveau compte!" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "Suivez le build sur: https://expo.dev" -ForegroundColor Cyan
                } else {
                    Write-Host ""
                    Write-Host "ERREUR lors du lancement du build" -ForegroundColor Red
                }
            } else {
                Write-Host ""
                Write-Host "ERREUR lors de l'initialisation" -ForegroundColor Red
            }
        } else {
            Write-Host ""
            Write-Host "ERREUR lors de la connexion" -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "ERREUR lors de la deconnexion" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "Operation annulee" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour lancer un build avec le compte actuel:" -ForegroundColor Cyan
    Write-Host "   eas build --platform android --profile preview" -ForegroundColor White
}

