# 🚀 Déploiement Final - Instructions

## ✅ Build Local Créé

Un nouveau build a été créé avec les corrections :
- **Fichier** : `dist/assets/index-CBAVjyBy.js` (2.97 MB)
- **Date** : Aujourd'hui
- **Contient** : Les corrections pour `OrganisationForm.tsx`

## 📋 Déploiement sur le Serveur

### Option 1 : Via Script Automatique (Recommandé)

1. **Transférer le script sur le serveur** :

```powershell
# Depuis votre machine Windows
scp deploy-to-server.sh asco@82.208.22.230:/tmp/
```

2. **Exécuter sur le serveur** :

```bash
# Se connecter au serveur
ssh asco@82.208.22.230

# Rendre le script exécutable
chmod +x /tmp/deploy-to-server.sh

# Exécuter le script
bash /tmp/deploy-to-server.sh
```

### Option 2 : Commandes Manuelles

Exécutez ces commandes directement sur le serveur :

```bash
# Se connecter au serveur
ssh asco@82.208.22.230

# Aller dans le projet
cd /var/www/cacaotrack-agent

# Sauvegarder l'ancien build
sudo rm -rf dist.backup.* 2>/dev/null || true
if [ -d "dist" ]; then
    sudo mv dist dist.backup.$(date +%Y%m%d_%H%M%S)
fi

# Récupérer les modifications
git pull origin main

# Re-builder
npm run build

# Corriger les permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# Redémarrer Nginx
sudo systemctl reload nginx

echo "✅ Déploiement terminé !"
```

### Option 3 : Via SCP (Si Git ne fonctionne pas)

```powershell
# Depuis votre machine Windows
# Transférer le nouveau build
scp -r dist/* asco@82.208.22.230:/var/www/cacaotrack-agent/dist/

# Se connecter au serveur pour corriger les permissions
ssh asco@82.208.22.230 "sudo chown -R asco:asco /var/www/cacaotrack-agent/dist/ && sudo chmod -R 755 /var/www/cacaotrack-agent/dist/ && sudo systemctl reload nginx"
```

## 🔍 Vérification

### Sur le Serveur

```bash
# Vérifier que le nouveau build est là
ls -lh /var/www/cacaotrack-agent/dist/assets/

# Vous devez voir : index-CBAVjyBy.js (2.97 MB)
```

### Dans le Navigateur

1. **Navigation privée** : `Ctrl + Shift + N`
2. Aller sur : `http://82.208.22.230/organisations/nouveau`
3. **Console** : `F12` → Console
4. Vérifier les logs :
   ```
   🔍 OrganisationForm Debug: { pathname: "/organisations/nouveau", ... }
   🔍 isEdit déterminé: false
   ```

## ⚠️ Si le Build Échoue sur le Serveur

```bash
# Vérifier les permissions
ls -la /var/www/cacaotrack-agent/

# Si nécessaire, corriger
sudo chown -R asco:asco /var/www/cacaotrack-agent/
```

## 📝 Notes

- Le nouveau fichier JS s'appelle `index-CBAVjyBy.js` (hash généré par Vite)
- L'ancien fichier était `index-Dutgzqs_.js`
- Le fichier `index.html` référence automatiquement le bon fichier JS
- **TOUJOURS vider le cache du navigateur après le déploiement**

