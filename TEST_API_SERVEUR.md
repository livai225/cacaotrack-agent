# 🧪 Test de l'API sur le Serveur

## Tester si le serveur fonctionne

```bash
# Test de santé
curl http://localhost:3000/api/health

# Test de l'API principale
curl http://localhost:3000/api

# Test avec plus de détails
curl -v http://localhost:3000/api/health

# Vérifier les logs en temps réel
pm2 logs cacaotrack-api --lines 50
```

## Si le serveur fonctionne

Si les tests curl fonctionnent, le serveur est opérationnel malgré les erreurs dans les logs. Les erreurs peuvent être des tentatives précédentes qui ont échoué.

## Si le serveur ne fonctionne pas

Si les tests curl échouent, il faut améliorer la configuration PM2. Vérifiez d'abord si ts-node est bien installé :

```bash
cd /var/www/cacaotrack-agent/server

# Vérifier ts-node
ls -la node_modules/.bin/ts-node
which ts-node

# Tester ts-node directement
node_modules/.bin/ts-node src/index.ts
```

Si cela fonctionne directement, utilisez un fichier ecosystem.config.js pour PM2.

