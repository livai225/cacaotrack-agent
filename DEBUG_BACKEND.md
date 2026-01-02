# 🔍 Debug du Backend

## ❌ Problème

Le processus PM2 est "online" mais l'API ne répond pas sur le port 3000.

## 🔍 Vérifications

### 1. Voir les Logs PM2

```bash
pm2 logs cacaotrack-api --lines 50
```

Cela va montrer les erreurs éventuelles.

### 2. Vérifier que le Port 3000 est Écouté

```bash
netstat -tlnp | grep 3000
# ou
ss -tlnp | grep 3000
```

### 3. Vérifier le Fichier .env

```bash
cd /var/www/cacaotrack-agent/server
cat .env
```

### 4. Vérifier que le Fichier index.ts Existe

```bash
ls -la /var/www/cacaotrack-agent/server/src/index.ts
```

### 5. Tester Manuellement

```bash
cd /var/www/cacaotrack-agent/server
node_modules/.bin/ts-node src/index.ts
```

Cela va afficher les erreurs directement.

## 🔧 Solutions Possibles

### Si Erreur de Connexion à la Base de Données

Vérifier que le mot de passe dans `.env` correspond à celui dans MySQL.

### Si Erreur de Port Déjà Utilisé

```bash
# Vérifier quel processus utilise le port 3000
sudo lsof -i :3000
# ou
sudo netstat -tlnp | grep 3000
```

### Si Erreur TypeScript

```bash
cd /var/www/cacaotrack-agent/server
npm install
npx prisma generate
```

### Si le Processus Crash

```bash
# Voir les logs détaillés
pm2 logs cacaotrack-api --err --lines 100

# Redémarrer avec plus de logs
pm2 delete cacaotrack-api
pm2 start node_modules/.bin/ts-node --name cacaotrack-api -- src/index.ts --log-date-format "YYYY-MM-DD HH:mm:ss Z"
pm2 logs cacaotrack-api
```

