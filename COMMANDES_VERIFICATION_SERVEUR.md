# ✅ Vérification Complète sur le Serveur

## Script de Vérification

Exécutez ce script sur le serveur pour voir exactement ce qui ne va pas :

```bash
cd /var/www/cacaotrack-agent

# Créer le script de vérification
cat > /tmp/verif.sh << 'EOF'
#!/bin/bash
cd /var/www/cacaotrack-agent
echo "=== GIT ==="
git remote -v
git branch
git fetch origin -q
echo "Commits locaux:"
git log --oneline -3
echo "Commits sur GitHub:"
git log --oneline origin/main -3
echo "À récupérer:"
git log HEAD..origin/main --oneline || echo "Aucun"
echo ""
echo "=== CODE SOURCE ==="
grep -A 8 "const isEdit" src/pages/OrganisationForm.tsx | head -10
echo ""
echo "=== BUILD ==="
if [ -f dist/assets/*.js ]; then
    ls -la dist/assets/*.js | head -1
    if grep -q "location.pathname.includes.*nouveau" dist/assets/*.js 2>/dev/null; then
        echo "✅ Build contient la correction"
    else
        echo "❌ Build NE contient PAS la correction"
    fi
else
    echo "❌ Pas de build"
fi
EOF

chmod +x /tmp/verif.sh
/tmp/verif.sh
```

## Si des Commits sont à Récupérer

```bash
cd /var/www/cacaotrack-agent

# Résoudre les conflits
git restore package-lock.json server/prisma/schema.prisma 2>/dev/null || true

# Récupérer
git pull origin main

# Vérifier
grep -A 5 "const isEdit" src/pages/OrganisationForm.tsx
```

## Si le Build est Ancien

```bash
cd /var/www/cacaotrack-agent

# Rebuild complet
sudo rm -rf dist/ node_modules/.vite
npm run build

# Vérifier
ls -la dist/assets/*.js | head -1
grep -o "location.pathname.includes.*nouveau" dist/assets/*.js | head -1

# Permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# Redémarrer
sudo systemctl restart nginx
```

## Commande Complète (Tout Faire)

```bash
cd /var/www/cacaotrack-agent && git restore package-lock.json server/prisma/schema.prisma 2>/dev/null || true && git fetch origin && git pull origin main && grep -A 5 "const isEdit" src/pages/OrganisationForm.tsx && sudo rm -rf dist/ node_modules/.vite && npm run build && grep -o "location.pathname.includes.*nouveau" dist/assets/*.js | head -1 && sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist && sudo chmod -R 755 /var/www/cacaotrack-agent/dist && sudo systemctl restart nginx && echo "✅ TERMINÉ - Videz le cache du navigateur maintenant"
```

