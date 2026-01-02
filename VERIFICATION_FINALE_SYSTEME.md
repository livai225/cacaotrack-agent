# ✅ Vérification Finale du Système

## ✅ Backend Fonctionne

Les logs montrent :
- ✅ Serveur démarré sur http://localhost:3000
- ✅ WebSocket activé
- ✅ Port 3000 en écoute

## 🧪 Tests à Faire

### 1. Tester l'API Localement

```bash
# Tester directement
curl http://localhost:3000/api/health

# Si ça ne fonctionne pas, attendre quelques secondes et réessayer
sleep 2
curl http://localhost:3000/api/health
```

### 2. Tester l'API via Nginx

```bash
# Tester via Nginx (depuis le serveur)
curl http://localhost/api/health

# Ou depuis l'extérieur
curl http://82.208.22.230/api/health
```

### 3. Vérifier le Frontend

```bash
# Vérifier que le build existe
ls -lh /var/www/cacaotrack-agent/dist/index.html

# Tester le frontend
curl http://localhost/
```

### 4. Vérifier les Permissions

```bash
# Vérifier les permissions du dist
ls -la /var/www/cacaotrack-agent/dist/

# Si nécessaire, corriger
sudo chown -R asco:asco /var/www/cacaotrack-agent/dist/
sudo chmod -R 755 /var/www/cacaotrack-agent/dist/
```

## 🌐 Test dans le Navigateur

1. **Aller sur** : `http://82.208.22.230`
2. **Vérifier** que l'application se charge
3. **Tester la création** : `http://82.208.22.230/organisations/nouveau`
4. **Vérifier** les 4 étapes avec icônes

## 📝 Résumé de l'Installation

- ✅ Projet cloné dans `/var/www/cacaotrack-agent`
- ✅ Base de données MySQL `asco` créée
- ✅ Utilisateur MySQL `cacaotrack_user` configuré
- ✅ Backend démarré avec PM2
- ✅ Frontend buildé dans `dist/`
- ✅ Nginx configuré et actif

## 🔧 Commandes Utiles

```bash
# Voir les logs PM2
pm2 logs cacaotrack-api

# Redémarrer le backend
pm2 restart cacaotrack-api

# Rebuild le frontend
cd /var/www/cacaotrack-agent
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
sudo systemctl reload nginx
```

