# 🎯 Commandes Finales pour le Serveur

## Script Automatique (Recommandé)

```bash
cd /var/www/cacaotrack-agent

# Télécharger et exécuter le script
curl -o /tmp/update.sh https://raw.githubusercontent.com/livai225/cacaotrack-agent/main/SCRIPT_MISE_A_JOUR_COMPLETE.sh 2>/dev/null || cat > /tmp/update.sh << 'EOF'
#!/bin/bash
set -e
cd /var/www/cacaotrack-agent
git restore package-lock.json server/prisma/schema.prisma 2>/dev/null || true
git pull origin main
sudo rm -rf dist/ node_modules/.vite
npm run build
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist
sudo systemctl restart nginx
echo "✅ Mise à jour terminée !"
EOF

chmod +x /tmp/update.sh
/tmp/update.sh
```

## Commandes Manuelles (Si le script ne fonctionne pas)

```bash
cd /var/www/cacaotrack-agent

# 1. Résoudre les conflits Git
git restore package-lock.json server/prisma/schema.prisma

# 2. Récupérer les modifications
git pull origin main

# 3. Vérifier que le code est correct
grep -A 2 "location.pathname.includes.*edit" src/pages/OrganisationForm.tsx

# 4. Supprimer l'ancien build
sudo rm -rf dist/ node_modules/.vite

# 5. Rebuild
npm run build

# 6. Vérifier le build
ls -lh dist/assets/*.js | head -1

# 7. Permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# 8. Redémarrer Nginx
sudo systemctl restart nginx
```

## Commande Complète (Copier-Coller)

```bash
cd /var/www/cacaotrack-agent && git restore package-lock.json server/prisma/schema.prisma 2>/dev/null || true && git pull origin main && grep -A 2 "location.pathname.includes.*edit" src/pages/OrganisationForm.tsx && sudo rm -rf dist/ node_modules/.vite && npm run build && sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist && sudo chmod -R 755 /var/www/cacaotrack-agent/dist && sudo systemctl restart nginx && echo "✅ Terminé !"
```

## Vérification après Mise à Jour

1. **Ouvrir la console du navigateur (F12)**
2. **Aller sur** `http://82.208.22.230/organisations/nouveau`
3. **Vérifier les logs dans la console** - vous devriez voir :
   ```
   🔍 OrganisationForm Debug: { pathname: "/organisations/nouveau", id: undefined, ... }
   🔍 isEdit déterminé: false
   ```
4. **Si isEdit est false**, la création devrait fonctionner
5. **Si isEdit est toujours true**, copiez les logs de la console et envoyez-les moi

## Si ça ne fonctionne toujours pas

Envoyez-moi :
1. Les logs de la console (F12 → Console)
2. La sortie de : `grep -A 5 "isEdit" src/pages/OrganisationForm.tsx` sur le serveur
3. La date du build : `ls -la dist/assets/*.js | head -1`

