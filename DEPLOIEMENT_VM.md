# 🚀 Instructions de Déploiement sur VM

**Date** : 1er décembre 2025  
**VM** : 82.208.22.230  
**Statut** : Prêt pour déploiement final

---

## ✅ État Actuel

- ✅ Infrastructure VM configurée
- ✅ PostgreSQL + PostGIS installé et fonctionnel
- ✅ Connexion DB validée (82.208.22.230:5432)
- ✅ PM2 configuré pour l'API
- ✅ Nginx configuré pour redirection `/api`
- ✅ Code corrigé avec routes de santé

---

## 🔧 Configuration de la Base de Données

### Paramètres PostgreSQL

```env
Type de Base : PostgreSQL (avec PostGIS)
Hôte DB      : 82.208.22.230
Port DB      : 5432
Nom de la BD : asco_db
Utilisateur  : asco_user
Mot de passe : AscoSecure2024!
```

### Fichier .env (sur la VM)

Créer/vérifier le fichier `~/apps/cacaotrack-agent/server/.env` :

```env
DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"
PORT=3000
NODE_ENV=production
```

---

## 🚀 Commandes de Déploiement

### 1. Mise à Jour du Code

```bash
# Se rendre à la racine du projet
cd ~/apps/cacaotrack-agent

# Mettre à jour le code depuis GitHub
git pull origin main

# Installer les dépendances du backend
cd server
npm install
cd ..
```

### 2. Vérification de la Configuration

```bash
# Vérifier que le fichier .env existe
cat server/.env

# Si le fichier n'existe pas, le créer
cd server
cp .env.example .env
nano .env
# Vérifier DATABASE_URL et PORT
```

### 3. Redémarrage de l'API

```bash
# Redémarrer l'API gérée par PM2
pm2 restart asco-api

# Vérifier le statut
pm2 status

# Voir les logs en temps réel
pm2 logs asco-api
```

---

## 🧪 Validation Finale

### Tests à Effectuer

#### 1. Route Racine de l'API
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
    "villages": "/api/villages",
    "producteurs": "/api/producteurs",
    "parcelles": "/api/parcelles",
    "operations": "/api/operations",
    "agents": "/api/agents",
    "regions": "/api/regions",
    "health": "/api/health"
  },
  "timestamp": "2025-12-01T21:00:00.000Z"
}
```

#### 2. Health Check
```bash
curl http://82.208.22.230/api/health
```

**Réponse attendue :**
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-01T21:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

#### 3. Vérification PostGIS
```bash
curl http://82.208.22.230/api/postgis
```

**Réponse attendue :**
```json
{
  "success": true,
  "postgis": "enabled",
  "version": "3.x.x",
  "timestamp": "2025-12-01T21:00:00.000Z"
}
```

#### 4. Test d'une Route Métier
```bash
curl http://82.208.22.230/api/organisations
```

**Réponse attendue :**
```json
[]
# ou une liste d'organisations si la DB est peuplée
```

---

## 🔍 Dépannage

### Problème : Cannot GET /api

**Cause** : Le code n'est pas à jour sur la VM

**Solution** :
```bash
cd ~/apps/cacaotrack-agent
git pull origin main
cd server
npm install
pm2 restart asco-api
```

### Problème : Database connection failed

**Cause** : Fichier .env mal configuré ou DB inaccessible

**Solution** :
```bash
# Vérifier le fichier .env
cat server/.env

# Tester la connexion PostgreSQL
psql -h 82.208.22.230 -U asco_user -d asco_db -p 5432

# Vérifier les logs PM2
pm2 logs asco-api
```

### Problème : 502 Bad Gateway (Nginx)

**Cause** : L'API n'est pas démarrée

**Solution** :
```bash
# Vérifier le statut PM2
pm2 status

# Redémarrer si nécessaire
pm2 restart asco-api

# Vérifier que l'API écoute sur le port 3000
netstat -tuln | grep 3000
```

### Problème : PostGIS non disponible

**Cause** : Extension PostGIS non activée

**Solution** :
```bash
# Se connecter à PostgreSQL
psql -h 82.208.22.230 -U asco_user -d asco_db

# Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

# Vérifier
SELECT PostGIS_version();
\q
```

---

## 📊 Commandes de Monitoring

### PM2

```bash
# Statut de tous les processus
pm2 status

# Logs en temps réel
pm2 logs asco-api

# Logs des 100 dernières lignes
pm2 logs asco-api --lines 100

# Redémarrer
pm2 restart asco-api

# Arrêter
pm2 stop asco-api

# Démarrer
pm2 start asco-api

# Informations détaillées
pm2 info asco-api
```

### Nginx

```bash
# Statut Nginx
sudo systemctl status nginx

# Redémarrer Nginx
sudo systemctl restart nginx

# Tester la configuration
sudo nginx -t

# Logs d'accès
sudo tail -f /var/log/nginx/access.log

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL

```bash
# Statut PostgreSQL
sudo systemctl status postgresql

# Connexion à la base
psql -h 82.208.22.230 -U asco_user -d asco_db

# Logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 🎯 Checklist de Validation

- [ ] Code mis à jour depuis GitHub (`git pull`)
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` configuré correctement
- [ ] PM2 redémarré (`pm2 restart asco-api`)
- [ ] Route `/api` répond avec succès
- [ ] Route `/api/health` indique `healthy`
- [ ] Route `/api/postgis` confirme PostGIS actif
- [ ] Routes métier fonctionnelles (`/api/organisations`, etc.)
- [ ] Logs PM2 sans erreur
- [ ] Nginx redirige correctement

---

## 📱 URLs de Test

### API Publique
- **Racine** : http://82.208.22.230/api
- **Health** : http://82.208.22.230/api/health
- **PostGIS** : http://82.208.22.230/api/postgis
- **Organisations** : http://82.208.22.230/api/organisations
- **Sections** : http://82.208.22.230/api/sections
- **Villages** : http://82.208.22.230/api/villages
- **Producteurs** : http://82.208.22.230/api/producteurs
- **Parcelles** : http://82.208.22.230/api/parcelles
- **Opérations** : http://82.208.22.230/api/operations
- **Agents** : http://82.208.22.230/api/agents
- **Régions** : http://82.208.22.230/api/regions

### API Interne (sur la VM)
- **Racine** : http://localhost:3000/api
- **Health** : http://localhost:3000/api/health

---

## 🔐 Sécurité

### Fichiers Sensibles

⚠️ **Ne jamais commiter** :
- `server/.env` (contient les mots de passe)
- Fichiers de backup de la DB

✅ **Déjà protégé** :
- `.gitignore` configuré pour ignorer `.env`

### Backup de la Base de Données

```bash
# Créer un backup
pg_dump -h 82.208.22.230 -U asco_user asco_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurer depuis un backup
psql -h 82.208.22.230 -U asco_user asco_db < backup.sql
```

---

## 📞 Support

En cas de problème persistant :

1. Vérifier les logs PM2 : `pm2 logs asco-api`
2. Vérifier les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
3. Vérifier les logs PostgreSQL : `sudo tail -f /var/log/postgresql/postgresql-14-main.log`
4. Tester la connexion DB : `psql -h 82.208.22.230 -U asco_user -d asco_db`

---

## ✅ Validation Finale

Une fois toutes les étapes complétées, l'URL suivante doit renvoyer une réponse JSON valide :

**URL à tester** : http://82.208.22.230/api

**Commande de test** :
```bash
curl http://82.208.22.230/api | jq
```

Si la réponse contient `"success": true` et `"status": "running"`, le déploiement est **réussi** ! 🎉

---

**Bon déploiement ! 🚀**
