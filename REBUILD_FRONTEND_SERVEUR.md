# 🔄 Rebuilder le Frontend sur le Serveur

## Problème

Le frontend buildé utilise encore l'ancien code qui essaie d'accéder à `/api/organisations/new` qui n'existe pas.

## Solution : Rebuilder le Frontend

```bash
# Aller à la racine du projet
cd /var/www/cacaotrack-agent

# Vérifier que vous avez les dernières modifications
git status
git pull origin main  # Si vous avez fait des modifications sur le repo

# Supprimer l'ancien build
rm -rf dist/

# Rebuilder le frontend
npm run build

# Vérifier que le nouveau build existe
ls -la dist/

# Configurer les permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# Redémarrer Nginx
sudo systemctl restart nginx

# Vider le cache du navigateur (Ctrl+Shift+Delete) et tester
```

## Commandes Complètes

```bash
cd /var/www/cacaotrack-agent && rm -rf dist/ && npm run build && sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist && sudo chmod -R 755 /var/www/cacaotrack-agent/dist && sudo systemctl restart nginx
```

## Après le Rebuild

1. Vider le cache du navigateur (Ctrl+Shift+Delete)
2. Ou tester en navigation privée (Ctrl+Shift+N)
3. Tester la création d'une organisation

