# 🔍 Debug - API ne répond pas

## Situation Actuelle

- ✅ Code mis à jour sur la VM
- ✅ Dépendances installées
- ✅ Fichier .env créé
- ✅ PM2 redémarré (status: online)
- ❌ Tests de validation vides (API ne répond pas)

---

## Commandes de Diagnostic

### 1. Vérifier les logs PM2

```bash
pm2 logs asco-api --lines 50
```

Cela va montrer les erreurs de l'API.

### 2. Vérifier le fichier .env

```bash
cat server/.env
```

Doit contenir :
```env
DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
PORT=3000
```

### 3. Tester la connexion PostgreSQL

```bash
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432 -c "SELECT 1;"
```

### 4. Vérifier que le port 3000 est écouté

```bash
netstat -tuln | grep 3000
```

### 5. Tester l'API en local

```bash
curl http://localhost:3000/api
```

---

## Problèmes Probables

### Problème 1 : Prisma Client non généré

**Symptôme** : Erreur dans les logs PM2 mentionnant `@prisma/client`

**Solution** :
```bash
cd ~/apps/cacaotrack-agent/server
npx prisma generate
pm2 restart asco-api
```

### Problème 2 : Tables non créées

**Symptôme** : Erreur "relation does not exist"

**Solution** :
```bash
cd ~/apps/cacaotrack-agent/server
npx prisma db push
pm2 restart asco-api
```

### Problème 3 : Extension PostGIS manquante

**Symptôme** : Erreur "extension postgis does not exist"

**Solution** :
```bash
psql -h 82.208.22.230 -U asco_user -d asco_db
CREATE EXTENSION IF NOT EXISTS postgis;
\q
pm2 restart asco-api
```

### Problème 4 : Mauvaise configuration PM2

**Symptôme** : PM2 online mais API ne répond pas

**Solution** :
```bash
# Arrêter l'ancien processus
pm2 delete asco-api

# Redémarrer avec la bonne commande
cd ~/apps/cacaotrack-agent/server
pm2 start src/index.ts --name asco-api --interpreter ts-node

# Sauvegarder
pm2 save
```

### Problème 5 : Variables d'environnement non chargées

**Symptôme** : Erreur "DATABASE_URL not found"

**Solution** :
```bash
# Vérifier que dotenv est installé
cd ~/apps/cacaotrack-agent/server
npm list dotenv

# Si absent, installer
npm install dotenv

# Redémarrer
pm2 restart asco-api
```

---

## Script de Diagnostic Complet

Exécutez ce script pour diagnostiquer :

```bash
#!/bin/bash

echo "=== DIAGNOSTIC API CACAOTRACK ==="
echo ""

echo "1. Statut PM2:"
pm2 status
echo ""

echo "2. Logs PM2 (20 dernières lignes):"
pm2 logs asco-api --lines 20 --nostream
echo ""

echo "3. Fichier .env:"
cat ~/apps/cacaotrack-agent/server/.env
echo ""

echo "4. Test connexion PostgreSQL:"
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432 -c "SELECT 1;" 2>&1
echo ""

echo "5. Port 3000 écouté:"
netstat -tuln | grep 3000
echo ""

echo "6. Test API local:"
curl -s http://localhost:3000/api | head -n 5
echo ""

echo "7. Test API public:"
curl -s http://82.208.22.230/api | head -n 5
echo ""

echo "=== FIN DIAGNOSTIC ==="
```

Sauvegardez dans `diagnostic.sh`, puis :
```bash
chmod +x diagnostic.sh
./diagnostic.sh
```

---

## Actions Recommandées

### Étape 1 : Voir les logs

```bash
pm2 logs asco-api
```

Appuyez sur `Ctrl+C` pour arrêter.

### Étape 2 : Générer Prisma Client

```bash
cd ~/apps/cacaotrack-agent/server
npx prisma generate
```

### Étape 3 : Créer les tables

```bash
npx prisma db push
```

### Étape 4 : Redémarrer PM2

```bash
pm2 restart asco-api
```

### Étape 5 : Tester à nouveau

```bash
curl http://localhost:3000/api
curl http://82.208.22.230/api
```

---

## Commandes Rapides

```bash
# Tout en une fois
cd ~/apps/cacaotrack-agent/server && \
npx prisma generate && \
npx prisma db push && \
pm2 restart asco-api && \
sleep 2 && \
curl http://localhost:3000/api
```

---

## Si Rien ne Fonctionne

### Redémarrage complet

```bash
# Arrêter PM2
pm2 delete asco-api

# Nettoyer
cd ~/apps/cacaotrack-agent/server
rm -rf node_modules/.prisma

# Réinstaller
npm install

# Générer Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# Redémarrer
pm2 start src/index.ts --name asco-api --interpreter ts-node

# Sauvegarder
pm2 save

# Tester
sleep 3
curl http://localhost:3000/api
```

---

## Vérification Finale

Une fois que `curl http://localhost:3000/api` fonctionne, testez :

```bash
# Test public
curl http://82.208.22.230/api

# Si ça ne fonctionne pas, vérifier Nginx
sudo nginx -t
sudo systemctl status nginx
```

---

**Exécutez d'abord `pm2 logs asco-api` et partagez les erreurs !**
