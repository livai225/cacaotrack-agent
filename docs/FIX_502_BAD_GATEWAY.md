# 🔧 Fix Erreur 502 Bad Gateway

**Problème:** L'API ne répond pas, Nginx retourne une erreur 502.

---

## 🔍 Diagnostic

### 1. Vérifier les logs PM2

```bash
# Voir les erreurs
pm2 logs asco-api --err --lines 50

# Voir tous les logs
pm2 logs asco-api --lines 50

# Voir le statut
pm2 status
```

### 2. Vérifier si l'API écoute sur le port 3000

```bash
# Vérifier les ports ouverts
netstat -tuln | grep 3000
# ou
ss -tuln | grep 3000

# Vérifier les processus Node
ps aux | grep node
```

### 3. Tester l'API localement

```bash
# Tester directement sur le port 3000
curl http://localhost:3000/api/health

# Si ça ne fonctionne pas, l'API ne démarre pas
```

---

## 🛠️ Solutions

### Solution 1: Vérifier les erreurs de compilation TypeScript

Si les logs montrent des erreurs TypeScript :

```bash
cd ~/apps/cacaotrack-agent/server

# Générer le client Prisma
npm run db:generate

# Tester la compilation
npx tsc --noEmit

# Si erreur, corriger puis redémarrer
pm2 restart asco-api
```

### Solution 2: Redémarrer complètement l'API

```bash
# Arrêter et supprimer le processus
pm2 delete asco-api

# Aller dans le répertoire
cd ~/apps/cacaotrack-agent/server

# Générer Prisma Client
npm run db:generate

# Redémarrer
pm2 start npm --name "asco-api" -- start
pm2 save

# Vérifier les logs
pm2 logs asco-api --lines 30
```

### Solution 3: Tester manuellement pour voir l'erreur

```bash
cd ~/apps/cacaotrack-agent/server

# Démarrer manuellement (ça affichera l'erreur exacte)
npm run dev
```

Appuyez sur `Ctrl+C` pour arrêter, puis corrigez l'erreur.

### Solution 4: Vérifier la configuration Nginx

```bash
# Vérifier la configuration Nginx
sudo nginx -t

# Voir la configuration pour /api
sudo cat /etc/nginx/sites-available/default | grep -A 10 "location /api"

# Redémarrer Nginx si nécessaire
sudo systemctl restart nginx
```

La configuration devrait ressembler à :

```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### Solution 5: Vérifier le fichier .env

```bash
cd ~/apps/cacaotrack-agent/server

# Vérifier que le fichier .env existe
cat .env

# Vérifier la DATABASE_URL
grep DATABASE_URL .env
```

Le fichier `.env` doit contenir :
```
DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
PORT=3000
NODE_ENV=production
```

---

## 🎯 Checklist de Diagnostic

- [ ] PM2 montre-t-il le processus comme "online" ?
- [ ] Les logs PM2 montrent-ils des erreurs ?
- [ ] Le port 3000 est-il ouvert et écouté ?
- [ ] `curl http://localhost:3000/api/health` fonctionne-t-il ?
- [ ] Nginx est-il configuré correctement ?
- [ ] Le fichier `.env` existe-t-il et est-il correct ?
- [ ] Prisma Client est-il généré (`npm run db:generate`) ?

---

## 📝 Commandes Rapides

```bash
# Diagnostic complet
cd ~/apps/cacaotrack-agent/server
pm2 logs asco-api --err --lines 50
pm2 status
curl http://localhost:3000/api/health
netstat -tuln | grep 3000

# Redémarrage complet
pm2 delete asco-api
npm run db:generate
pm2 start npm --name "asco-api" -- start
pm2 save
pm2 logs asco-api --lines 20
```

---

## 🔍 Erreurs Communes

### Erreur TypeScript
**Symptôme:** Logs montrent `TSError: ⨯ Unable to compile TypeScript`
**Solution:** Vérifier le code TypeScript, corriger les erreurs, redémarrer

### Erreur Prisma
**Symptôme:** `PrismaClient is not generated`
**Solution:** `npm run db:generate`

### Erreur de connexion DB
**Symptôme:** `Can't reach database server`
**Solution:** Vérifier DATABASE_URL dans `.env`

### Port déjà utilisé
**Symptôme:** `EADDRINUSE: address already in use :::3000`
**Solution:** `lsof -ti:3000 | xargs kill -9` puis redémarrer

---

**Document créé:** Décembre 2024

