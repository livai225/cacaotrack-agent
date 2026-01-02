# ✅ Vérification Finale - Installation

## ✅ Configuration Nginx OK

Le message "File exists" est normal - le lien symbolique existe déjà, c'est bon.

## 🔍 Vérifications à Faire

### 1. Vérifier que le Backend Fonctionne

```bash
# Vérifier PM2
pm2 status

# Vérifier les logs
pm2 logs cacaotrack-api --lines 20

# Tester l'API
curl http://localhost:3000/api/health
```

### 2. Vérifier que le Frontend est Buildé

```bash
# Vérifier que le dossier dist existe
ls -lh /var/www/cacaotrack-agent/dist/

# Vérifier les fichiers JS
ls -lh /var/www/cacaotrack-agent/dist/assets/
```

### 3. Vérifier Nginx

```bash
# Statut
sudo systemctl status nginx

# Tester le frontend
curl http://localhost/

# Tester l'API via Nginx
curl http://localhost/api/health
```

### 4. Vérifier les Permissions

```bash
# Vérifier les permissions du dossier dist
ls -la /var/www/cacaotrack-agent/dist/

# Si nécessaire, corriger
sudo chown -R asco:asco /var/www/cacaotrack-agent/dist/
sudo chmod -R 755 /var/www/cacaotrack-agent/dist/
```

## 🧪 Test dans le Navigateur

1. **Aller sur** : `http://82.208.22.230`
2. **Vérifier** que l'application se charge
3. **Tester la création d'organisation** : `http://82.208.22.230/organisations/nouveau`
4. **Vérifier** les 4 étapes avec icônes

## ⚠️ Si ça ne Fonctionne Pas

### Problème : Backend ne démarre pas

```bash
# Vérifier les logs
pm2 logs cacaotrack-api

# Redémarrer
pm2 restart cacaotrack-api

# Vérifier le fichier .env
cat /var/www/cacaotrack-agent/server/.env
```

### Problème : Frontend ne se charge pas

```bash
# Vérifier que le build existe
ls -la /var/www/cacaotrack-agent/dist/index.html

# Si absent, rebuild
cd /var/www/cacaotrack-agent
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
```

### Problème : Erreur 502 Bad Gateway

```bash
# Vérifier que le backend écoute sur le port 3000
netstat -tlnp | grep 3000

# Vérifier PM2
pm2 status
```

## 📝 Commandes Utiles

```bash
# Voir tous les processus PM2
pm2 list

# Redémarrer le backend
pm2 restart cacaotrack-api

# Voir les logs en temps réel
pm2 logs cacaotrack-api

# Rebuild le frontend
cd /var/www/cacaotrack-agent
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
sudo systemctl reload nginx
```

