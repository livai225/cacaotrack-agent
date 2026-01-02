# ⚠️ Build Manquant !

## ❌ Problème

Vous avez fait `git pull` mais **pas `npm run build`** !

Le serveur a toujours l'ancien build.

## ✅ Solution

Exécutez cette commande sur le serveur :

```bash
cd /var/www/cacaotrack-agent
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
sudo systemctl reload nginx
```

## 🔍 Vérification

Après le build, vérifiez :

```bash
# Vérifier que le nouveau build est créé
ls -lh dist/assets/

# Vous devez voir : index-CBAVjyBy.js (2.97 MB)
```

