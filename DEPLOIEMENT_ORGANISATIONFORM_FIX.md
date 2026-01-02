# 🚀 Déploiement - Correction OrganisationForm

## ✅ Modifications Poussées sur Git

Le formulaire OrganisationForm avec l'affichage visuel des étapes a été poussé sur GitHub.

## 📋 Commandes pour Mettre à Jour le Serveur

### Sur le Serveur (SSH)

Exécutez ces commandes :

```bash
# Se connecter au serveur
ssh asco@82.208.22.230

# Aller dans le projet
cd /var/www/cacaotrack-agent

# Récupérer les modifications
git pull origin main

# Re-builder le frontend
npm run build

# Corriger les permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# Redémarrer Nginx
sudo systemctl reload nginx

echo "✅ Mise à jour terminée !"
```

### Commande Tout-en-Un

```bash
ssh asco@82.208.22.230 "cd /var/www/cacaotrack-agent && git pull origin main && npm run build && sudo chown -R asco:asco dist/ && sudo chmod -R 755 dist/ && sudo systemctl reload nginx && echo '✅ Terminé !'"
```

## 🔍 Vérification

### Sur le Serveur

```bash
# Vérifier que le code source contient les modifications
grep -n "steps.map\|isCompleted\|isCurrent" src/pages/OrganisationForm.tsx

# Vérifier que le build est récent
ls -lh dist/assets/*.js
```

### Dans le Navigateur

1. **Navigation privée** : `Ctrl + Shift + N`
2. Aller sur : `http://82.208.22.230/organisations/nouveau`
3. Vérifier que vous voyez :
   - ✅ 4 étapes avec icônes en haut
   - ✅ Barre de progression
   - ✅ Boutons "Précédent" / "Suivant"
   - ✅ Navigation entre les étapes

## ⚠️ Si ça ne Fonctionne Pas

### Vérifier que le Code Source est à Jour

```bash
cd /var/www/cacaotrack-agent
git fetch origin
git reset --hard origin/main
```

### Forcer le Rebuild

```bash
sudo rm -rf dist/ node_modules/.vite
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
sudo systemctl reload nginx
```

## 📝 Notes

- Le formulaire OrganisationForm affiche maintenant **4 étapes visuelles**
- Tous les formulaires sont maintenant en plusieurs étapes avec navigation
- **N'oubliez pas de vider le cache du navigateur** après le déploiement

