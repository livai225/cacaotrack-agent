# ✅ Vérification du Déploiement

## État Actuel

- ✅ Backend fonctionne sur `http://localhost:3000`
- ✅ Frontend buildé dans `/var/www/cacaotrack-agent/dist`
- ✅ Nginx configuré et redémarré
- ✅ API accessible via Nginx (`/api/health` répond)

## Tests à Effectuer

### 1. Trouver l'IP du Serveur

```bash
hostname -I
# ou
ip addr show | grep "inet " | grep -v 127.0.0.1
```

### 2. Tester le Frontend

```bash
# Tester que le frontend est servi
curl http://localhost/ | head -20

# Tester l'API via Nginx
curl http://localhost/api/health

# Tester l'API directement
curl http://localhost:3000/api/health
```

### 3. Vérifier les Logs

```bash
# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs PM2
pm2 logs cacaotrack-api --lines 20
```

### 4. Accéder à l'Application

Ouvrez votre navigateur et allez à :
- `http://VOTRE_IP_SERVEUR` (remplacez par l'IP trouvée)

## Commandes de Vérification Complètes

```bash
# 1. Trouver l'IP
hostname -I

# 2. Tester le frontend
curl http://localhost/ | head -20

# 3. Tester l'API
curl http://localhost/api/health

# 4. Vérifier les processus
pm2 status
sudo systemctl status nginx

# 5. Vérifier les fichiers
ls -la /var/www/cacaotrack-agent/dist/
```

## Prochaines Étapes

1. ✅ Backend déployé et fonctionnel
2. ✅ Frontend buildé et servi par Nginx
3. ✅ API accessible via proxy Nginx
4. 🌐 Accéder à l'application via navigateur
5. 🔒 (Optionnel) Configurer HTTPS avec Let's Encrypt
6. 📱 (Optionnel) Configurer l'application mobile pour pointer vers le serveur

