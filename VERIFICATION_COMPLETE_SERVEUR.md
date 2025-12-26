# 🔍 Vérification Complète du Serveur

## Commandes de Diagnostic

Exécutez ces commandes sur le serveur pour vérifier l'état :

```bash
cd /var/www/cacaotrack-agent

# 1. Vérifier l'état Git
echo "=== ÉTAT GIT ==="
git status
git log --oneline -5

# 2. Vérifier si le fichier contient les étapes
echo "=== VÉRIFICATION ORGANISATIONFORM ==="
grep -n "currentStep\|steps\|Progress\|handleNext" src/pages/OrganisationForm.tsx | head -20

# 3. Vérifier la date de modification du fichier
ls -la src/pages/OrganisationForm.tsx

# 4. Vérifier si le build contient les modifications
echo "=== VÉRIFICATION BUILD ==="
grep -o "currentStep" dist/assets/*.js 2>/dev/null | head -5 || echo "currentStep non trouvé dans le build"

# 5. Vérifier la date du build
ls -la dist/assets/*.js | head -1
```

## Si les modifications ne sont pas sur le serveur

```bash
cd /var/www/cacaotrack-agent

# Forcer la récupération
git fetch origin
git reset --hard origin/main

# Vérifier
grep -n "currentStep" src/pages/OrganisationForm.tsx | head -5
```

## Rebuild complet

```bash
cd /var/www/cacaotrack-agent

# Supprimer complètement
sudo rm -rf dist/ node_modules/.vite

# Rebuild
npm run build

# Vérifier le build
ls -lh dist/assets/*.js

# Permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# Redémarrer
sudo systemctl restart nginx
```

