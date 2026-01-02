# 🔍 Diagnostic - Organisations Non Affichées

## Problème
Les organisations créées n'apparaissent pas dans la liste.

## Vérifications à Faire

### 1. Vérifier que les organisations sont bien sauvegardées dans la base de données

```bash
# Sur le serveur
mysql -u cacaotrack_user -p asco -e "SELECT id, nom, code, statut FROM organisations LIMIT 10;"
```

### 2. Vérifier que l'API retourne bien les organisations

```bash
# Sur le serveur
curl http://localhost:3000/api/organisations | jq .
```

### 3. Vérifier les logs du backend

```bash
pm2 logs cacaotrack-api --lines 50
```

### 4. Vérifier la console du navigateur

Ouvrez la console (F12) et regardez :
- Les requêtes réseau vers `/api/organisations`
- Les erreurs JavaScript
- Les logs de débogage

### 5. Vérifier le cache du navigateur

- Videz le cache (Ctrl+Shift+Delete)
- Ou utilisez la navigation privée

## Solutions Possibles

### Solution 1 : Les organisations ne sont pas sauvegardées
Si la requête POST réussit mais les données ne sont pas en base :
- Vérifier les logs du backend
- Vérifier que la transaction est bien commitée

### Solution 2 : Problème de cache
- Vider le cache du navigateur
- Recharger avec Ctrl+F5

### Solution 3 : Problème d'API
- Vérifier que le backend répond bien
- Vérifier les CORS si nécessaire

### Solution 4 : Problème de filtrage
- Vérifier que le statut des organisations est bien "actif"
- Vérifier la recherche/filtre

