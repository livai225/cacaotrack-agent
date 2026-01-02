# 🔨 Commandes Finales - Build et Déploiement

## ✅ Git Pull Réussi

Les modifications ont été récupérées. Maintenant il faut :

1. **Rebuild le frontend**
2. **Corriger les permissions**
3. **Redémarrer Nginx**

## 📋 Commandes à Exécuter

```bash
# Vous êtes déjà dans /var/www/cacaotrack-agent

# 1. Rebuild
npm run build

# 2. Permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# 3. Redémarrer Nginx
sudo systemctl reload nginx

echo "✅ Terminé !"
```

## 🔍 Vérification

Après le build, vérifiez :

```bash
# Vérifier que le build est créé
ls -lh dist/assets/*.js

# Vérifier que le code source contient les modifications
grep -n "steps.map\|isCompleted" src/pages/OrganisationForm.tsx
```

## 🧪 Test dans le Navigateur

1. **Navigation privée** : `Ctrl + Shift + N`
2. Aller sur : `http://82.208.22.230/organisations/nouveau`
3. Vérifier les 4 étapes avec icônes

