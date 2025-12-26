# ✅ Commande Corrigée

## Commande Complète (avec le bon nom de fichier)

```bash
cd /var/www/cacaotrack-agent && git restore package-lock.json server/prisma/schema.prisma && git pull origin main && sudo rm -rf dist/ node_modules/.vite && npm run build && sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist && sudo chmod -R 755 /var/www/cacaotrack-agent/dist && sudo systemctl restart nginx
```

## Ou étape par étape

```bash
cd /var/www/cacaotrack-agent

# Restaurer les fichiers (notez le nom complet : schema.prisma)
git restore package-lock.json server/prisma/schema.prisma

# Pull
git pull origin main

# Rebuild
sudo rm -rf dist/ node_modules/.vite
npm run build

# Permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# Redémarrer Nginx
sudo systemctl restart nginx
```

