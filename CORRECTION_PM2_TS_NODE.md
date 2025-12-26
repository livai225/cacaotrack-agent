# 🔧 Correction PM2 avec ts-node

## Problème

PM2 ne trouve pas `ts-node` correctement. Il faut utiliser le chemin complet.

## Solution 1 : Utiliser le chemin complet vers ts-node

```bash
cd /var/www/cacaotrack-agent/server

# Arrêter l'ancien processus
pm2 delete cacaotrack-api

# Démarrer avec le chemin complet
pm2 start node_modules/.bin/ts-node --name cacaotrack-api -- src/index.ts

# Sauvegarder
pm2 save

# Vérifier
pm2 status
pm2 logs cacaotrack-api
```

## Solution 2 : Utiliser npm start

```bash
cd /var/www/cacaotrack-agent/server

# Arrêter l'ancien processus
pm2 delete cacaotrack-api

# Démarrer avec npm start
pm2 start npm --name cacaotrack-api -- start

# Sauvegarder
pm2 save

# Vérifier
pm2 status
pm2 logs cacaotrack-api
```

## Solution 3 : Utiliser ecosystem.config.js (Recommandé)

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
    script: 'node_modules/.bin/ts-node',
    args: 'src/index.ts',
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

Puis :
```bash
# Arrêter l'ancien processus
pm2 delete cacaotrack-api

# Démarrer avec ecosystem.config.js
pm2 start ecosystem.config.js

# Sauvegarder
pm2 save

# Vérifier
pm2 status
pm2 logs cacaotrack-api
```

