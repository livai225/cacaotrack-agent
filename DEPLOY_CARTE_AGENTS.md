# Déploiement - Page Carte Agents

## Modifications apportées

- Page `/carte` dédiée uniquement aux agents
- Boutons "Voir position sur la carte" dans les pages agents
- Centrage automatique sur l'agent sélectionné
- Actualisation automatique toutes les 30 secondes

## Commandes de déploiement sur le serveur

Connectez-vous au serveur et exécutez :

```bash
# Se connecter au serveur
ssh asco@82.208.22.230

# Aller dans le répertoire du projet
cd /var/www/cacaotrack-agent

# Récupérer les dernières modifications
git pull origin main

# Installer les dépendances (si nécessaire)
cd server
npm install

# Redémarrer l'application
pm2 restart cacaotrack-api

# Vérifier les logs
pm2 logs cacaotrack-api --lines 50
```

## Vérification

1. Accéder à `http://82.208.22.230/carte`
2. Vérifier que seuls les agents sont affichés
3. Tester le bouton "Voir position" depuis la page agents
4. Vérifier que la carte se centre automatiquement sur l'agent

## Notes

- Les modifications sont uniquement côté frontend (web)
- Aucune modification de la base de données nécessaire
- Le serveur API n'a pas besoin d'être modifié
