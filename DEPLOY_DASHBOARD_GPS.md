# Déploiement - Corrections Dashboard Mobile et Suivi GPS

## Modifications apportées

### 1. Dashboard Mobile - Données Réelles
- ✅ Endpoint `/api/dashboard/stats` créé
- ✅ HomeScreen récupère les vraies données depuis l'API
- ✅ Affichage des statistiques réelles (producteurs, plantations, récoltes, etc.)
- ✅ Section "Éléments créés" avec compteurs pour tous les types

### 2. Nom Application Tronqué
- ✅ Correction du style du titre dans LoginScreen
- ✅ Taille de police réduite (36 → 28) avec textAlign center

### 3. Suivi GPS
- ✅ Logs détaillés ajoutés (mobile et backend)
- ✅ Correction conversion vitesse (m/s)
- ✅ Amélioration gestion erreurs

## Commandes de déploiement sur le serveur

### 1. Mettre à jour le backend

```bash
# Se connecter au serveur
ssh asco@82.208.22.230

# Aller dans le répertoire du projet
cd /var/www/cacaotrack-agent

# Récupérer les dernières modifications
git pull origin main

# Installer les dépendances (si nécessaire)
cd server
npm install

# Redémarrer l'API
pm2 restart cacaotrack-api

# Vérifier les logs
pm2 logs cacaotrack-api --lines 50
```

### 2. Mettre à jour le frontend web

```bash
# Toujours dans /var/www/cacaotrack-agent
cd ..

# Reconstruire le frontend
npm run build

# Vérifier que le build est OK
ls -lh dist/assets/

# Configurer les permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# Redémarrer Nginx
sudo systemctl reload nginx
```

### 3. Script de déploiement complet

```bash
cd /var/www/cacaotrack-agent && \
git pull origin main && \
cd server && \
npm install && \
pm2 restart cacaotrack-api && \
cd .. && \
npm run build && \
sudo chown -R asco:asco dist/ && \
sudo chmod -R 755 dist/ && \
sudo systemctl reload nginx && \
echo "✅ Déploiement terminé !"
```

## Vérification

### Backend - Endpoint Stats
```bash
# Tester l'endpoint de statistiques
curl http://localhost:3000/api/dashboard/stats
```

### Backend - Logs GPS
```bash
# Surveiller les logs pour voir les positions reçues
pm2 logs cacaotrack-api --lines 100 | grep "Position\|Location\|GPS"
```

### Frontend Web
1. Vider le cache du navigateur (`Ctrl + Shift + Delete`)
2. Accéder à `http://82.208.22.230/carte`
3. Ouvrir la console (F12) et vérifier les logs
4. Vérifier que les positions des agents s'affichent

### Application Mobile
1. Rebuilder l'APK avec les nouvelles modifications
2. Installer sur le téléphone
3. Se connecter avec un agent
4. Vérifier les logs dans la console React Native
5. Vérifier que la position est envoyée (logs serveur)

## Debug GPS

### Vérifier si les positions sont envoyées depuis le mobile

**Sur le téléphone (via adb logcat) :**
```bash
adb logcat | grep -i "location\|gps\|position"
```

**Sur le serveur :**
```bash
pm2 logs cacaotrack-api | grep -i "position\|location\|agent"
```

### Vérifier si les positions sont reçues par le backend

**Tester l'endpoint directement :**
```bash
curl -X POST http://localhost:3000/api/agents/location \
  -H "Content-Type: application/json" \
  -d '{
    "id_agent": "ID_D_UN_AGENT_EXISTANT",
    "latitude": 5.3599517,
    "longitude": -4.0082563,
    "accuracy": 10
  }'
```

### Vérifier si les positions sont récupérées par le frontend

**Dans la console du navigateur (F12) :**
- Vérifier les logs `📍 [Carte]`
- Vérifier les erreurs réseau dans l'onglet Network
- Vérifier la réponse de `/api/agents/locations`

## Notes importantes

- ⚠️ **Important** : Vider le cache du navigateur après le déploiement frontend
- ⚠️ **Important** : Rebuilder l'APK mobile pour tester les modifications
- 📍 Les positions sont envoyées toutes les 25 minutes depuis le mobile
- 📍 La carte web se rafraîchit toutes les 30 secondes
- 📍 Les logs détaillés permettent de tracer les problèmes GPS
