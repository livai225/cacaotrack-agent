# 🚀 Déploiement de la Correction - Gestion des Membres

## ⚠️ IMPORTANT : Vider le Cache du Navigateur

Après le déploiement, **VOUS DEVEZ** vider le cache de votre navigateur pour voir les changements :

### Méthode 1 : Vider le Cache (Recommandé)
1. Appuyez sur **Ctrl + Shift + Delete** (Windows) ou **Cmd + Shift + Delete** (Mac)
2. Sélectionnez "Images et fichiers en cache"
3. Cliquez sur "Effacer les données"
4. Rechargez la page avec **Ctrl + F5** (ou **Cmd + Shift + R** sur Mac)

### Méthode 2 : Navigation Privée
1. Ouvrez une fenêtre de navigation privée (Ctrl + Shift + N)
2. Accédez à votre site
3. Testez la fonctionnalité

### Méthode 3 : Désactiver le Cache (Chrome DevTools)
1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Network"
3. Cochez "Disable cache"
4. Rechargez la page

## 📋 Commandes de Déploiement

Exécutez ces commandes sur le serveur :

```bash
cd /var/www/cacaotrack-agent
git pull origin main
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
sudo systemctl reload nginx
```

## ✅ Vérification

Après le déploiement et le vidage du cache :
1. Allez sur la page de gestion des membres d'une organisation
2. Cliquez sur "Ajouter un Membre"
3. Vous devriez voir un **sélecteur déroulant** avec la liste des producteurs
4. L'ID sera **automatiquement rempli** quand vous sélectionnez un producteur

## 🔍 Si le problème persiste

1. Vérifiez que le build s'est bien passé : `ls -la dist/assets/`
2. Vérifiez les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
3. Vérifiez la console du navigateur (F12) pour les erreurs JavaScript

