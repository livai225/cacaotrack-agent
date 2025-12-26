# 🔄 Rebuild Forcé du Frontend

## Vérification et Rebuild Complet

```bash
cd /var/www/cacaotrack-agent

# 1. Vérifier la date du build actuel
ls -la dist/assets/*.js | head -1

# 2. Supprimer complètement le build et le cache Vite
sudo rm -rf dist/ node_modules/.vite

# 3. Rebuild complet
npm run build

# 4. Vérifier que le nouveau build contient currentStep
grep -o "currentStep" dist/assets/*.js | head -1

# 5. Vérifier la date du nouveau build
ls -la dist/assets/*.js | head -1

# 6. Permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# 7. Redémarrer Nginx
sudo systemctl restart nginx
```

## Commande Complète

```bash
cd /var/www/cacaotrack-agent && ls -la dist/assets/*.js | head -1 && sudo rm -rf dist/ node_modules/.vite && npm run build && ls -la dist/assets/*.js | head -1 && grep -o "currentStep" dist/assets/*.js | head -1 && sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist && sudo chmod -R 755 /var/www/cacaotrack-agent/dist && sudo systemctl restart nginx
```

