# ✅ Vérification du Build sur le Serveur

## ✅ Build Réussi !

Le build a été créé avec succès :
```
dist/assets/index-Dutgzqs_.js  (2.97 MB)
```

## 🔍 Vérifications à Faire

### 1. Vérifier que le Code Source Contient les Corrections

```bash
# Sur le serveur
cd /var/www/cacaotrack-agent

# Vérifier que le code source contient la correction
grep -n "location.pathname.includes.*nouveau" src/pages/OrganisationForm.tsx
```

Vous devez voir les lignes avec la correction.

### 2. Vérifier que le Build Contient les Corrections

```bash
# Chercher dans le build (le code est minifié, donc chercher des patterns)
grep -o "includes.*nouveau" dist/assets/index-Dutgzqs_.js | head -1
```

### 3. Vérifier que Nginx Sert le Bon Fichier

```bash
# Vérifier le fichier index.html
cat dist/index.html | grep index-Dutgzqs_

# Vérifier que Nginx pointe vers le bon dossier
cat /etc/nginx/sites-available/cacaotrack | grep root
```

Doit pointer vers : `/var/www/cacaotrack-agent/dist`

### 4. Tester dans le Navigateur

1. **Ouvrir une navigation privée** : `Ctrl + Shift + N` (Chrome/Edge) ou `Ctrl + Shift + P` (Firefox)

2. **Aller sur** : `http://82.208.22.230/organisations/nouveau`

3. **Ouvrir la console** : `F12` → Onglet "Console"

4. **Vérifier les logs** :
   ```
   🔍 OrganisationForm Debug: { 
     pathname: "/organisations/nouveau",
     id: undefined,
     hasId: false,
     includesNouveau: true,
     includesEdit: false
   }
   🔍 isEdit déterminé: false | pathname: /organisations/nouveau | id: undefined
   ```

5. **Si vous voyez `isEdit: false`** → ✅ C'est bon !

6. **Remplir le formulaire et créer une organisation**

## ⚠️ Si les Logs n'Apparaissent Pas

### Vérifier le Cache du Navigateur

1. Dans la console (F12), aller dans l'onglet **Network**
2. **COCHER "Disable cache"** (en haut)
3. **GARDER les outils développeur ouverts**
4. Faire `Ctrl + Shift + R` plusieurs fois

### Vérifier que le Bon Fichier est Chargé

Dans l'onglet Network, chercher le fichier `index-Dutgzqs_.js` :
- Taille : ~2.97 MB
- Statut : `200` (pas `304 Not Modified`)

## 🎯 Test Final

Si tout est OK, vous devriez pouvoir :
1. ✅ Voir les logs dans la console
2. ✅ Voir `isEdit: false`
3. ✅ Remplir le formulaire
4. ✅ Créer une organisation avec `POST /api/organisations` (pas PUT)

