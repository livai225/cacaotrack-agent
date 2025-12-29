# 🚀 Commandes de Déploiement du Dashboard

## Méthode 1 : Exécution Directe sur le Serveur

Connectez-vous au serveur et exécutez ces commandes **une par une** :

```bash
# 1. Se connecter au serveur
ssh asco@82.208.22.230

# 2. Aller dans le dossier du projet
cd /var/www/cacaotrack-agent

# 3. Récupérer les dernières modifications
git pull origin main

# 4. Construire le frontend
npm run build

# 5. Configurer les permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# 6. Redémarrer Nginx
sudo systemctl reload nginx

# 7. Vérifier que tout fonctionne
pm2 status
curl http://localhost/api/health
```

## Méthode 2 : Utiliser le Script

1. **Copiez le fichier `deploy-sur-serveur.sh` sur le serveur** :

```bash
# Depuis votre PC Windows (PowerShell)
scp deploy-sur-serveur.sh asco@82.208.22.230:/tmp/
```

2. **Connectez-vous au serveur et exécutez le script** :

```bash
ssh asco@82.208.22.230
chmod +x /tmp/deploy-sur-serveur.sh
bash /tmp/deploy-sur-serveur.sh
```

## Méthode 3 : Commandes en Une Ligne

Copiez-collez cette commande complète dans votre terminal SSH :

```bash
cd /var/www/cacaotrack-agent && git pull origin main && npm run build && sudo chown -R asco:asco dist/ && sudo chmod -R 755 dist/ && sudo systemctl reload nginx && echo "✅ Déploiement terminé"
```

## Vérification

Après le déploiement, vérifiez que tout fonctionne :

1. **Vérifier le backend** :
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Vérifier le frontend** :
   ```bash
   curl http://localhost/ | head -20
   ```

3. **Vérifier PM2** :
   ```bash
   pm2 status
   pm2 logs cacaotrack-api --lines 10
   ```

4. **Accéder au site** :
   Ouvrez votre navigateur et allez sur : `http://82.208.22.230`

## En Cas de Problème

Si le build échoue :

```bash
# Nettoyer et reconstruire
cd /var/www/cacaotrack-agent
rm -rf dist/ node_modules/.vite
npm run build
```

Si Nginx ne fonctionne pas :

```bash
# Vérifier la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx

# Vérifier les logs
sudo tail -f /var/log/nginx/error.log
```

