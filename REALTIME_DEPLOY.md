# 🔄 Déploiement du Système Temps Réel

## 📋 Résumé des Changements

Le système temps réel a été implémenté sur **toutes les tables** :
- ✅ Organisations
- ✅ Sections  
- ✅ Villages
- ✅ Producteurs
- ✅ Parcelles
- ✅ Opérations
- ✅ Agents
- ✅ Régions

## 🚀 Commandes de Déploiement

### Sur le Serveur (SSH)

```bash
ssh asco@82.208.22.230
```

Puis exécutez :

```bash
cd ~/apps/cacaotrack-agent

# 1. Récupérer les dernières modifications
git pull origin main

# 2. Backend - Installer les dépendances
cd server
npm install
npx prisma generate

# 3. Redémarrer l'API avec PM2
pm2 restart asco-api
pm2 logs asco-api --lines 20

# 4. Frontend - Installer et builder
cd ..
npm install
npm run build

# 5. Déployer le frontend
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# 6. Redémarrer Nginx
sudo systemctl restart nginx

echo "✅ Temps réel déployé sur toutes les tables !"
```

### Commande Tout-en-Un

```bash
cd ~/apps/cacaotrack-agent && \
git pull origin main && \
cd server && npm install && npx prisma generate && pm2 restart asco-api && \
cd .. && npm install && npm run build && \
sudo cp -r dist/* /var/www/html/ && \
sudo chown -R www-data:www-data /var/www/html/ && \
sudo chmod -R 755 /var/www/html/ && \
sudo systemctl restart nginx && \
echo "✅ Déploiement terminé !"
```

## 🧪 Tests

### Vérifier l'API
```bash
curl http://82.208.22.230/api/health
curl http://82.208.22.230/api/operations
```

### Vérifier PM2
```bash
pm2 status
pm2 logs asco-api --lines 50
```

### Vérifier les Logs Socket.IO
Dans les logs PM2, vous devriez voir :
- `✅ Client connecté: [socket-id]`
- `📡 Événement émis: operation:created`
- etc.

## 📱 Test dans le Navigateur

1. Ouvrez **deux onglets** :
   - Onglet 1 : http://82.208.22.230/operations
   - Onglet 2 : http://82.208.22.230/operations/dashboard

2. Dans l'onglet 1, créez une nouvelle collecte

3. **Résultat attendu** :
   - ✅ Notification toast dans l'onglet 1
   - ✅ La liste se met à jour automatiquement
   - ✅ Le dashboard (onglet 2) se recharge automatiquement
   - ✅ Les statistiques sont mises à jour en temps réel

## 🔧 Dépannage

### Si Socket.IO ne se connecte pas

```bash
# Vérifier que le serveur écoute bien
pm2 logs asco-api | grep "WebSocket"

# Redémarrer l'API
pm2 restart asco-api

# Vérifier les ports
sudo netstat -tlnp | grep 3000
```

### Si le frontend ne se met pas à jour

```bash
# Vider le cache du navigateur
# Ctrl + Shift + R (Windows/Linux)
# Cmd + Shift + R (Mac)

# Ou ouvrir en navigation privée
```

### Vérifier les événements Socket.IO

Ouvrez la console du navigateur (F12) et regardez les logs :
```
✅ Connecté au serveur WebSocket
📡 Nouvelle opération reçue: {...}
```

## 📊 Événements Disponibles

### Organisations
- `organisation:created`
- `organisation:updated`
- `organisation:deleted`

### Sections
- `section:created`
- `section:updated`
- `section:deleted`

### Villages
- `village:created`
- `village:updated`
- `village:deleted`

### Producteurs
- `producteur:created`
- `producteur:updated`
- `producteur:deleted`

### Parcelles
- `parcelle:created`
- `parcelle:updated`
- `parcelle:deleted`

### Opérations
- `operation:created`
- `operation:updated`
- `operation:deleted`

### Agents
- `agent:created`
- `agent:updated`
- `agent:deleted`

### Régions
- `region:created`
- `region:updated`
- `region:deleted`

## 🎯 Prochaines Étapes

Pour utiliser le temps réel dans une nouvelle page :

```typescript
import { useRealtime } from '@/hooks/useRealtime';
import { api } from '@/services/api';

function MaPage() {
  const { data, isLoading } = useRealtime({
    resource: 'organisation', // ou 'village', 'producteur', etc.
    fetchData: api.getOrganisations,
    showToasts: true
  });

  // data se met à jour automatiquement en temps réel !
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.nom}</div>
      ))}
    </div>
  );
}
```

## ✅ Checklist de Déploiement

- [ ] Code pushé sur GitHub
- [ ] SSH sur le serveur
- [ ] `git pull` effectué
- [ ] Dépendances backend installées (`npm install` dans `server/`)
- [ ] Prisma généré (`npx prisma generate`)
- [ ] PM2 redémarré (`pm2 restart asco-api`)
- [ ] Dépendances frontend installées (`npm install`)
- [ ] Frontend buildé (`npm run build`)
- [ ] Fichiers copiés vers `/var/www/html/`
- [ ] Permissions corrigées
- [ ] Nginx redémarré
- [ ] Tests effectués dans le navigateur
- [ ] Socket.IO connecté (vérifier console F12)
- [ ] Événements temps réel fonctionnels

---

**Le système temps réel est maintenant actif sur toutes les tables !** ⚡🎉
