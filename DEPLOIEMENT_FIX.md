# 🔧 Fix Déploiement - Conflit Git et PM2

## Problème 1: Conflit Git avec package-lock.json

Le fichier `server/package-lock.json` a des modifications locales qui empêchent le pull.

### Solution 1: Stash les modifications locales (recommandé)

```bash
cd ~/apps/cacaotrack-agent
git stash
git pull origin main
cd server
npm install
git stash pop  # Optionnel: récupérer les modifications si nécessaire
```

### Solution 2: Forcer la mise à jour (si les modifications locales ne sont pas importantes)

```bash
cd ~/apps/cacaotrack-agent
git checkout server/package-lock.json
git pull origin main
cd server
npm install
```

### Solution 3: Commit les modifications locales (si elles sont importantes)

```bash
cd ~/apps/cacaotrack-agent
git add server/package-lock.json
git commit -m "Update package-lock.json"
git pull origin main
cd server
npm install
```

---

## Problème 2: Processus PM2 introuvable

Le processus `asco-api` n'existe pas dans PM2.

### Solution: Créer/Redémarrer le processus PM2

```bash
cd ~/apps/cacaotrack-agent/server

# Vérifier si un processus existe avec un autre nom
pm2 list

# Si aucun processus n'existe, créer le processus
pm2 start npm --name "asco-api" -- start

# OU si vous utilisez ts-node directement
pm2 start "npm run dev" --name "asco-api"

# OU avec ts-node
pm2 start ts-node --name "asco-api" -- src/index.ts

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
```

### Vérification

```bash
# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs asco-api

# Vérifier que l'API répond
curl http://localhost:3000/api/health
```

---

## Script Complet de Déploiement

```bash
#!/bin/bash

# 1. Aller dans le répertoire
cd ~/apps/cacaotrack-agent

# 2. Résoudre le conflit Git
git stash
git pull origin main

# 3. Installer les dépendances
cd server
npm install

# 4. Vérifier/créer le processus PM2
if pm2 list | grep -q "asco-api"; then
    echo "Redémarrage du processus existant..."
    pm2 restart asco-api
else
    echo "Création du nouveau processus..."
    pm2 start npm --name "asco-api" -- start
    pm2 save
fi

# 5. Vérifier le statut
pm2 status
pm2 logs asco-api --lines 20

# 6. Tester l'API
echo "Test de l'API..."
curl http://localhost:3000/api/health
```

---

## Commandes PM2 Utiles

```bash
# Lister tous les processus
pm2 list

# Démarrer un processus
pm2 start npm --name "asco-api" -- start

# Arrêter un processus
pm2 stop asco-api

# Redémarrer un processus
pm2 restart asco-api

# Supprimer un processus
pm2 delete asco-api

# Voir les logs
pm2 logs asco-api

# Voir les logs en temps réel
pm2 logs asco-api --lines 50

# Informations détaillées
pm2 info asco-api

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage au boot
pm2 startup
```

---

## Vérification Finale

```bash
# 1. Vérifier que PM2 tourne
pm2 status

# 2. Vérifier les logs
pm2 logs asco-api --lines 20

# 3. Tester l'API localement
curl http://localhost:3000/api

# 4. Tester l'API publiquement (si Nginx est configuré)
curl http://82.208.22.230/api/health

# 5. Vérifier que Nginx redirige correctement
curl http://82.208.22.230/api
```

