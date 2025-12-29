# 🧪 Instructions pour Exécuter les Tests API

## 📋 Scripts Disponibles

1. **`test-apis-simple.sh`** - Script de test optimisé et rapide
2. **`test-all-apis.sh`** - Script de test complet avec plus de détails
3. **`executer-tests-serveur.sh`** - Script pour automatiser l'exécution sur le serveur

## 🚀 Exécution sur le Serveur

### Méthode 1 : Connexion SSH manuelle

```bash
# 1. Se connecter au serveur
ssh asco@82.208.22.230

# 2. Aller dans le dossier du projet
cd /var/www/cacaotrack-agent

# 3. Récupérer les dernières modifications
git pull origin main

# 4. Rendre le script exécutable
chmod +x test-apis-simple.sh

# 5. Exécuter les tests
bash test-apis-simple.sh
```

### Méthode 2 : Exécution en une seule commande

```bash
ssh asco@82.208.22.230 "cd /var/www/cacaotrack-agent && git pull origin main && chmod +x test-apis-simple.sh && bash test-apis-simple.sh"
```

## 📊 Ce qui est testé

Le script teste automatiquement :

- ✅ **GET** - Récupération de toutes les ressources
- ✅ **POST** - Création (CREATE)
- ✅ **PUT** - Mise à jour (UPDATE)
- ⚠️ **DELETE** - Suppression (non testé pour garder les données)

### Endpoints testés :

1. **Health Check** (`/api/health`, `/api`)
2. **Organisations** (GET, POST, PUT)
3. **Sections** (GET, POST, PUT)
4. **Villages** (GET, POST, PUT)
5. **Producteurs** (GET, POST, PUT)
6. **Parcelles** (GET, POST, PUT)
7. **Operations** (GET, POST, PUT)
8. **Agents** (GET, POST, PUT)
9. **Regions** (GET)

## 🔍 Interprétation des Résultats

- ✅ **OK (200-299)** - La requête a réussi
- ⚠️ **400-499** - Erreur client (données invalides, ressource non trouvée, etc.)
- ❌ **500+** - Erreur serveur

## 📝 Notes

- Les tests créent des données de test dans la base de données
- Les tests DELETE sont commentés pour ne pas supprimer les données
- Le script utilise `localhost:3000` - assurez-vous que le serveur backend est démarré

## 🛠️ Dépannage

Si les tests échouent :

1. Vérifier que le serveur backend est démarré :
   ```bash
   pm2 status
   curl http://localhost:3000/api/health
   ```

2. Vérifier les logs du serveur :
   ```bash
   pm2 logs cacaotrack
   ```

3. Vérifier la connexion à la base de données :
   ```bash
   cd /var/www/cacaotrack-agent/server
   cat .env
   ```

