# 🔧 Fix : DATABASE_URL - Utiliser localhost

## Problème
Le DATABASE_URL utilise l'IP externe `82.208.22.230` alors que PostgreSQL et Node.js sont sur la même machine. PostgreSQL n'accepte pas les connexions TCP/IP depuis cette IP.

## Solution

### Sur le serveur, exécutez ces commandes :

```bash
cd ~/apps/cacaotrack-agent/server

# Modifier le fichier .env pour utiliser localhost
cat > .env << 'EOF'
DATABASE_URL="postgresql://asco_user:AscoSecure2024!@localhost:5432/asco_db?schema=public"
PORT=3000
NODE_ENV=production
JWT_SECRET=change-this-secret-key-in-production
EOF

# Vérifier le contenu
cat .env

# Tester la connexion avec localhost
psql -h localhost -U asco_user -d asco_db -p 5432 -c "SELECT 1;"

# Si ça fonctionne, redémarrer PM2 avec --update-env pour charger les nouvelles variables
pm2 restart asco-api --update-env

# Attendre quelques secondes
sleep 3

# Vérifier les logs
pm2 logs asco-api --lines 30

# Tester l'API
curl http://localhost:3000/api/health
```

## Explication

- **Avant** : `postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db`
- **Après** : `postgresql://asco_user:AscoSecure2024!@localhost:5432/asco_db`

PostgreSQL n'accepte pas les connexions TCP/IP depuis l'IP externe par défaut. Comme Node.js et PostgreSQL sont sur la même machine, utiliser `localhost` est la solution la plus simple et la plus sécurisée.

## Vérification

La réponse de `/api/health` devrait être :

```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-23T...",
  "uptime": ...,
  "environment": "production"
}
```

