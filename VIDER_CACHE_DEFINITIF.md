# 🗑️ Vider le Cache Définitivement

## ❌ Problème

Le navigateur charge encore l'ancienne version malgré le nouveau build.

## ✅ Solutions par Ordre d'Efficacité

### Solution 1 : Mode Navigation Privée (Le Plus Simple) ⭐

1. **Fermer TOUS les onglets** de `82.208.22.230`
2. **Ouvrir une fenêtre de navigation privée** :
   - Chrome/Edge : `Ctrl + Shift + N`
   - Firefox : `Ctrl + Shift + P`
3. **Aller directement sur** : `http://82.208.22.230/organisations/nouveau`
4. **Ouvrir la console** : `F12` → Console
5. **Vérifier les logs** - vous devez voir :
   ```
   🔍 OrganisationForm Debug: { pathname: "/organisations/nouveau", ... }
   🔍 isEdit déterminé: false
   ```

### Solution 2 : Vider le Cache Complètement

#### Chrome/Edge :

1. **Ouvrir les outils développeur** : `F12`
2. **Aller dans l'onglet "Network"**
3. **COCHER "Disable cache"** (en haut de l'onglet Network)
4. **GARDER les outils développeur ouverts** (important !)
5. **Clic droit sur l'icône d'actualisation** (à gauche de la barre d'adresse)
6. **Sélectionner "Vider le cache et actualiser de force"**
   - OU utiliser : `Ctrl + Shift + R` (plusieurs fois)
7. **Aller dans l'onglet "Console"**
8. **Vérifier les logs**

#### Firefox :

1. **Ouvrir les outils développeur** : `F12`
2. **Aller dans l'onglet "Network"**
3. **COCHER "Désactiver le cache"** (en haut)
4. **GARDER les outils développeur ouverts**
5. **Vider le cache** : `Ctrl + Shift + Delete`
   - Sélectionner "Tout" dans "Période"
   - Cocher "Cache"
   - Cliquer "Effacer maintenant"
6. **Actualiser** : `Ctrl + Shift + R`
7. **Vérifier dans la Console**

### Solution 3 : Ajouter un Paramètre à l'URL

Aller sur : `http://82.208.22.230/organisations/nouveau?v=123456789`

Le paramètre `?v=123456789` force le rechargement.

### Solution 4 : Vider le Cache via les Paramètres

#### Chrome/Edge :

1. `Ctrl + Shift + Delete`
2. Sélectionner "Tout le temps"
3. Cocher "Images et fichiers en cache"
4. Cliquer "Effacer les données"

#### Firefox :

1. `Ctrl + Shift + Delete`
2. Sélectionner "Tout"
3. Cocher "Cache"
4. Cliquer "Effacer maintenant"

## 🔍 Vérification que le Bon Fichier est Chargé

Dans l'onglet **Network** (F12) :

1. **Actualiser la page** : `F5`
2. **Chercher le fichier** : `index-Dutgzqs_.js`
3. **Vérifier** :
   - **Taille** : ~2.97 MB (2,967 KB)
   - **Statut** : `200` (pas `304 Not Modified`)
   - **Type** : `application/javascript`

Si vous voyez `304 Not Modified` → le cache n'est pas vidé.

## 🛠️ Vérification sur le Serveur

Si rien ne fonctionne, vérifiez que le serveur a bien le nouveau build :

```bash
# Sur le serveur
ssh root@82.208.22.230

# Vérifier la date du fichier
ls -lh /var/www/cacaotrack-agent/dist/assets/index-Dutgzqs_.js

# Vérifier que le fichier contient la correction (chercher dans le code minifié)
grep -o "includes.*nouveau" /var/www/cacaotrack-agent/dist/assets/index-Dutgzqs_.js | head -1
```

## ⚡ Solution Rapide (Recommandée)

1. **Fermer TOUS les onglets** du site
2. **Navigation privée** : `Ctrl + Shift + N`
3. **Aller sur** : `http://82.208.22.230/organisations/nouveau`
4. **Console** : `F12` → Vérifier les logs

Si ça ne fonctionne toujours pas, dites-moi ce que vous voyez dans la console.

