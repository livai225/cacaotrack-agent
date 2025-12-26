# 🚀 Démarrage du Backend sur le Serveur

## Commandes à Exécuter

```bash
cd /var/www/cacaotrack-agent/server

# Démarrer le backend avec PM2
pm2 start src/index.ts --name cacaotrack-api --interpreter ts-node

# Sauvegarder la configuration PM2
pm2 save

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs cacaotrack-api

# Voir les logs en temps réel (Ctrl+C pour quitter)
pm2 logs cacaotrack-api --lines 50
```

## Tester l'API

```bash
# Test de santé
curl http://localhost:3000/api/health

# Test de l'API principale
curl http://localhost:3000/api

# Test avec plus de détails
curl -v http://localhost:3000/api/health
```

## Commandes PM2 Utiles

```bash
# Arrêter le serveur
pm2 stop cacaotrack-api

# Redémarrer le serveur
pm2 restart cacaotrack-api

# Supprimer le processus
pm2 delete cacaotrack-api

# Voir les métriques
pm2 monit

# Redémarrer automatiquement au démarrage du serveur
pm2 startup
pm2 save
```

## Configuration PM2 avec Fichier (Optionnel)

Si vous voulez utiliser un fichier de configuration :

```bash
cd /var/www/cacaotrack-agent/server

# Créer/modifier ecosystem.config.js
nano ecosystem.config.js
```

Contenu :
```javascript
module.exports = {
  apps: [{
    name: 'cacaotrack-api',
    script: 'src/index.ts',
    interpreter: 'node_modules/.bin/ts-node',
    cwd: '/var/www/cacaotrack-agent/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/home/asco/.pm2/logs/cacaotrack-api-error.log',
    out_file: '/home/asco/.pm2/logs/cacaotrack-api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

Puis démarrer avec :
```bash
pm2 start ecosystem.config.js
pm2 save
```

