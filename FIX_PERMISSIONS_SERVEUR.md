# 🔧 Correction des Permissions - Serveur

## ❌ Erreur

```
EACCES: permission denied, rmdir '/var/www/cacaotrack-agent/dist/assets'
```

## ✅ Solution

### Option 1 : Supprimer et Recréer (Recommandé)

```bash
# Sur le serveur
cd /var/www/cacaotrack-agent

# Supprimer l'ancien dist
sudo rm -rf dist

# Re-builder
npm run build

# Corriger les permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
```

### Option 2 : Corriger les Permissions du Dossier Existant

```bash
# Sur le serveur
cd /var/www/cacaotrack-agent

# Donner les permissions à l'utilisateur asco
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# Puis re-builder
npm run build
```

### Option 3 : Commande Tout-en-Un

```bash
cd /var/www/cacaotrack-agent && \
sudo rm -rf dist && \
npm run build && \
sudo chown -R asco:asco dist/ && \
sudo chmod -R 755 dist/ && \
echo "✅ Build réussi !"
```

## 🔍 Vérification

```bash
# Vérifier que le build est créé
ls -lh dist/assets/

# Vérifier les permissions
ls -la dist/
```

## ⚠️ Si ça ne Fonctionne Toujours Pas

Vérifier les permissions du dossier parent :

```bash
# Vérifier les permissions du projet
ls -la /var/www/cacaotrack-agent/

# Si nécessaire, corriger
sudo chown -R asco:asco /var/www/cacaotrack-agent/
```

