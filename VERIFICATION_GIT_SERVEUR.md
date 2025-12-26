# 🔍 Vérification Git sur le Serveur

## Commandes à Exécuter sur le Serveur

```bash
cd /var/www/cacaotrack-agent

# 1. Vérifier le dépôt distant
echo "=== DÉPÔT DISTANT ==="
git remote -v

# 2. Vérifier la branche actuelle
echo "=== BRANCHE ACTUELLE ==="
git branch

# 3. Vérifier l'état
echo "=== ÉTAT GIT ==="
git status

# 4. Vérifier les derniers commits locaux
echo "=== COMMITS LOCAUX ==="
git log --oneline -5

# 5. Vérifier les commits sur GitHub
echo "=== COMMITS SUR GITHUB ==="
git fetch origin
git log --oneline origin/main -5

# 6. Vérifier si on est à jour
echo "=== COMPARAISON ==="
git log HEAD..origin/main --oneline

# 7. Vérifier le code source actuel
echo "=== CODE SOURCE ACTUEL ==="
grep -A 10 "const isEdit" src/pages/OrganisationForm.tsx | head -15

# 8. Vérifier la date du build
echo "=== DATE DU BUILD ==="
ls -la dist/assets/*.js 2>/dev/null | head -1 || echo "Pas de build trouvé"
```

## Si les commits ne sont pas sur le serveur

```bash
cd /var/www/cacaotrack-agent

# Résoudre les conflits
git restore package-lock.json server/prisma/schema.prisma 2>/dev/null || true

# Récupérer les modifications
git fetch origin
git pull origin main

# Vérifier que le code est correct
grep -A 5 "const isEdit" src/pages/OrganisationForm.tsx

# Rebuild
sudo rm -rf dist/ node_modules/.vite
npm run build

# Permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# Redémarrer
sudo systemctl restart nginx
```

