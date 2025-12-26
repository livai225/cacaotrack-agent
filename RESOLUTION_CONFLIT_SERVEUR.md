# 🔧 Résolution du Conflit Git sur le Serveur

## Problème

Des modifications locales empêchent le `git pull`. Il faut les gérer avant de pouvoir récupérer les modifications.

## Solution : Restaurer les fichiers modifiés

```bash
cd /var/www/cacaotrack-agent

# Voir les modifications
git status

# Restaurer les fichiers modifiés (ce sont des fichiers générés automatiquement)
git restore package-lock.json
git restore server/prisma/schema.prisma

# Maintenant faire le pull
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

## Commande Complète

```bash
cd /var/www/cacaotrack-agent && git restore package-lock.json server/prisma/schema.prisma && git pull origin main && sudo rm -rf dist/ node_modules/.vite && npm run build && sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist && sudo chmod -R 755 /var/www/cacaotrack-agent/dist && sudo systemctl restart nginx
```

## Alternative : Stash les modifications

Si vous voulez garder les modifications pour plus tard :

```bash
cd /var/www/cacaotrack-agent
git stash
git pull origin main
# ... rebuild ...
```

