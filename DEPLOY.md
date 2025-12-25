# 🚀 Guide de Déploiement Frontend

## Problème Actuel

Le frontend sur le serveur utilise encore l'ancien code compilé qui essaie d'utiliser `PUT /api/organisations/new` au lieu de `POST /api/organisations`.

## Solution : Redéployer le Frontend

### Option 1 : Utiliser le Script de Déploiement (Recommandé)

```bash
# Sur le serveur distant
ssh votre_utilisateur@82.208.22.230
cd /home/asco/apps/cacaotrack-agent
chmod +x scripts/deploy-frontend.sh
./scripts/deploy-frontend.sh
```

### Option 2 : Déploiement Manuel

```bash
# 1. Se connecter au serveur
ssh votre_utilisateur@82.208.22.230

# 2. Aller dans le répertoire du projet
cd /home/asco/apps/cacaotrack-agent

# 3. Récupérer les dernières modifications
git pull origin main

# 4. Installer les dépendances (si nécessaire)
npm install

# 5. Reconstruire le frontend
npm run build

# 6. Vérifier que le dossier dist existe
ls -la dist/

# 7. Déployer le nouveau frontend
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# 8. Redémarrer Nginx
sudo systemctl restart nginx

# 9. Vérifier le statut
sudo systemctl status nginx
```

## Après le Déploiement

### 1. Vider le Cache du Navigateur

**Chrome/Edge :**
- Appuyez sur `Ctrl + Shift + Delete`
- Cochez "Images et fichiers en cache"
- Cliquez sur "Effacer les données"

**Firefox :**
- Appuyez sur `Ctrl + Shift + Delete`
- Sélectionnez "Cache"
- Cliquez sur "Effacer maintenant"

### 2. Ou Tester en Navigation Privée

- Chrome/Edge : `Ctrl + Shift + N`
- Firefox : `Ctrl + Shift + P`

### 3. Vérifier que le Déploiement a Réussi

Ouvrez la console du navigateur (F12) et vérifiez :
- Les fichiers JavaScript chargés doivent avoir une date récente
- Plus d'erreur `PUT /api/organisations/new 404`
- Les requêtes doivent utiliser `POST /api/organisations`

## Vérification

Après le déploiement, testez la création d'une organisation :
1. Allez sur `/organisations/nouveau`
2. Remplissez le formulaire
3. Cliquez sur "Enregistrer"
4. Vérifiez la console (F12) - plus d'erreur 404
5. L'organisation doit être créée avec succès

## Dépannage

### Si le déploiement échoue

```bash
# Vérifier les permissions
ls -la /var/www/html/

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log

# Vérifier que Nginx fonctionne
sudo systemctl status nginx
```

### Si les erreurs persistent

1. Vérifiez que le build a réussi : `ls -la dist/`
2. Videz complètement le cache du navigateur
3. Testez en navigation privée
4. Vérifiez les logs du serveur backend : `pm2 logs asco-api`

