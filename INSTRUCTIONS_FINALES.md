# 🎯 Instructions Finales - Déploiement VM

**Date** : 1er décembre 2025  
**Statut** : ✅ Code corrigé et poussé sur GitHub  
**Commit** : 8e3fa6b

---

## ✅ Ce Qui a Été Fait

### 1. Corrections du Code
- ✅ Ajout de la route `GET /api` (informations API)
- ✅ Ajout de la route `GET /api/health` (health check + DB)
- ✅ Ajout de la route `GET /api/postgis` (vérification PostGIS)
- ✅ Correction du problème "Cannot GET /api"
- ✅ Version mise à jour : 2.4.0

### 2. Documentation
- ✅ Guide de déploiement VM créé (`DEPLOIEMENT_VM.md`)
- ✅ Script de déploiement automatisé (`COMMANDES_VM.sh`)
- ✅ README mis à jour avec les endpoints API

### 3. GitHub
- ✅ Code poussé sur `origin/main`
- ✅ Prêt pour `git pull` sur la VM

---

## 🚀 Commandes à Exécuter sur la VM

### Option 1 : Script Automatisé (Recommandé)

```bash
# Se connecter à la VM
ssh user@82.208.22.230

# Aller dans le projet
cd ~/apps/cacaotrack-agent

# Récupérer le script
git pull origin main

# Rendre le script exécutable
chmod +x COMMANDES_VM.sh

# Exécuter le script
./COMMANDES_VM.sh
```

Le script va automatiquement :
1. ✅ Mettre à jour le code (`git pull`)
2. ✅ Installer les dépendances (`npm install`)
3. ✅ Vérifier le fichier `.env`
4. ✅ Redémarrer l'API (`pm2 restart`)
5. ✅ Effectuer les tests de validation

### Option 2 : Commandes Manuelles

```bash
# Se connecter à la VM
ssh user@82.208.22.230

# 1. Aller dans le projet
cd ~/apps/cacaotrack-agent

# 2. Mettre à jour le code
git pull origin main

# 3. Installer les dépendances
cd server
npm install
cd ..

# 4. Vérifier/créer le fichier .env
cat server/.env
# Si le fichier n'existe pas:
cp server/.env.example server/.env
nano server/.env
# Vérifier DATABASE_URL et PORT

# 5. Redémarrer l'API
pm2 restart asco-api

# 6. Vérifier le statut
pm2 status

# 7. Voir les logs
pm2 logs asco-api
```

---

## 🧪 Tests de Validation

### Test 1 : Route Racine

```bash
curl http://82.208.22.230/api
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "API CacaoTrack - Système de Gestion de la Filière Cacao",
  "version": "2.4.0",
  "status": "running",
  "database": "PostgreSQL + PostGIS",
  "endpoints": {
    "organisations": "/api/organisations",
    "sections": "/api/sections",
    ...
  }
}
```

### Test 2 : Health Check

```bash
curl http://82.208.22.230/api/health
```

**Réponse attendue :**
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-01T...",
  "uptime": 123.456,
  "environment": "production"
}
```

### Test 3 : PostGIS

```bash
curl http://82.208.22.230/api/postgis
```

**Réponse attendue :**
```json
{
  "success": true,
  "postgis": "enabled",
  "version": "3.x.x",
  "timestamp": "2025-12-01T..."
}
```

### Test 4 : Route Métier

```bash
curl http://82.208.22.230/api/organisations
```

**Réponse attendue :**
```json
[]
```
(ou une liste d'organisations si la DB est peuplée)

---

## 📋 Checklist de Validation

Cochez au fur et à mesure :

- [ ] Connexion SSH à la VM réussie
- [ ] Navigation vers `~/apps/cacaotrack-agent`
- [ ] `git pull origin main` exécuté avec succès
- [ ] `npm install` dans `server/` terminé
- [ ] Fichier `server/.env` vérifié/créé
- [ ] `pm2 restart asco-api` exécuté
- [ ] `pm2 status` montre `asco-api` en `online`
- [ ] `curl http://82.208.22.230/api` retourne JSON valide
- [ ] `curl http://82.208.22.230/api/health` retourne `"status": "healthy"`
- [ ] `curl http://82.208.22.230/api/postgis` retourne `"postgis": "enabled"`
- [ ] Logs PM2 sans erreur (`pm2 logs asco-api`)

---

## 🔍 Dépannage Rapide

### Problème : git pull échoue

```bash
# Vérifier l'état Git
git status

# Si des modifications locales existent
git stash
git pull origin main
git stash pop
```

### Problème : npm install échoue

```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème : PM2 ne trouve pas asco-api

```bash
# Lister tous les processus PM2
pm2 list

# Si asco-api n'existe pas, le créer
cd ~/apps/cacaotrack-agent/server
pm2 start src/index.ts --name asco-api --interpreter ts-node

# Sauvegarder la configuration PM2
pm2 save
```

### Problème : Database connection failed

```bash
# Vérifier le fichier .env
cat server/.env

# Tester la connexion PostgreSQL
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432

# Si la connexion échoue, vérifier PostgreSQL
sudo systemctl status postgresql
```

### Problème : 502 Bad Gateway

```bash
# Vérifier que l'API tourne
pm2 status

# Vérifier que le port 3000 est écouté
netstat -tuln | grep 3000

# Redémarrer Nginx
sudo systemctl restart nginx

# Vérifier la config Nginx
sudo nginx -t
```

---

## 📊 Commandes de Monitoring

```bash
# Statut PM2
pm2 status

# Logs en temps réel
pm2 logs asco-api

# Logs des 100 dernières lignes
pm2 logs asco-api --lines 100

# Informations détaillées
pm2 info asco-api

# Redémarrer
pm2 restart asco-api

# Arrêter
pm2 stop asco-api

# Démarrer
pm2 start asco-api
```

---

## 🎯 Validation Finale

**URL à tester** : http://82.208.22.230/api

**Commande de test** :
```bash
curl http://82.208.22.230/api | jq
```

**Si vous voyez** :
```json
{
  "success": true,
  "message": "API CacaoTrack - Système de Gestion de la Filière Cacao",
  "version": "2.4.0",
  "status": "running",
  ...
}
```

**Alors le déploiement est RÉUSSI ! 🎉**

---

## 📞 Prochaines Étapes

Une fois la validation réussie :

1. ✅ Confirmer que toutes les routes API fonctionnent
2. ✅ Tester l'accès depuis le frontend
3. ✅ Configurer les backups automatiques de la DB
4. ✅ Mettre en place le monitoring (optionnel)

---

## 📚 Documentation Complète

- **DEPLOIEMENT_VM.md** - Guide détaillé de déploiement
- **MIGRATION_POSTGRESQL.md** - Guide de migration DB
- **COMMANDES_UTILES.md** - Référence des commandes
- **README.md** - Documentation principale

---

## ✅ Résumé

| Élément | Statut |
|---------|--------|
| Code corrigé | ✅ Fait |
| Routes ajoutées | ✅ Fait |
| GitHub mis à jour | ✅ Fait |
| Documentation | ✅ Fait |
| Script de déploiement | ✅ Fait |
| **Prêt pour déploiement** | ✅ **OUI** |

---

**Faites-moi savoir une fois que les tests de validation sont réussis ! 🚀**
