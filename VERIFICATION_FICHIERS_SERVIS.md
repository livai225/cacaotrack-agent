# 🔍 Vérifier les Fichiers Servis

## Vérifier que le Serveur Sert le Bon Fichier

### Sur le Serveur

```bash
cd /var/www/cacaotrack-agent

# Vérifier les fichiers dans dist/assets
ls -lh dist/assets/

# Vérifier la date et le nom du fichier JS
ls -lah dist/assets/*.js

# Vérifier que le fichier contient la correction
grep -o "location.pathname.includes.*nouveau" dist/assets/*.js | head -1
```

### Depuis Votre Machine (PowerShell)

```powershell
# Télécharger le fichier JS du serveur
Invoke-WebRequest -Uri "http://82.208.22.230/assets/index-Dutgzqs_.js" -OutFile "$env:TEMP\index.js"

# Vérifier la taille
(Get-Item "$env:TEMP\index.js").Length / 1MB

# Rechercher la correction
Select-String -Path "$env:TEMP\index.js" -Pattern "location.pathname.includes.*nouveau"
```

### Tester l'API Directement

```powershell
# Créer une organisation via l'API (pour confirmer que l'API fonctionne)
$body = @{
    nom = "Test via PowerShell"
    type = "Coopérative"
    statut = "actif"
    region = "Lôh-Djiboua"
    departement = "Divo"
    sous_prefecture = "Divo"
    localite = "Divo"
    president_nom = "Test User"
    president_contact = @("+225 01 23 45 67 89")
    potentiel_production = 500
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://82.208.22.230/api/organisations" -Method POST -Body $body -ContentType "application/json"
```

Si l'API fonctionne (création réussie), le problème est bien le cache du navigateur.

