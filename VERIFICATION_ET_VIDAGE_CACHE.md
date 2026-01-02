# 🔍 Vérification et Vidage du Cache

## Étape 1 : Vérifier que le Code Source Contient les Modifications

Sur le serveur, exécutez :

```bash
cd /var/www/cacaotrack-agent

# Vérifier que le code source contient les corrections
grep -n "includes.*nouveau" src/pages/OrganisationForm.tsx
```

Vous devez voir les lignes avec `location.pathname.includes("/nouveau")`.

## Étape 2 : Vérifier que le Build est Récent

```bash
# Vérifier la date du fichier JS
ls -lh dist/assets/index-Dutgzqs_.js

# La date doit être récente (aujourd'hui)
```

## Étape 3 : VIDER LE CACHE DU NAVIGATEUR

### ⭐ Méthode 1 : Navigation Privée (Le Plus Simple)

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

### Méthode 2 : Vider le Cache Complètement

#### Chrome/Edge :

1. **Ouvrir les outils développeur** : `F12`
2. **Aller dans l'onglet "Network"**
3. **COCHER "Disable cache"** (en haut de l'onglet Network)
4. **GARDER les outils développeur ouverts** (très important !)
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

### Méthode 3 : Vider via les Paramètres

#### Chrome/Edge :

1. `Ctrl + Shift + Delete`
2. Sélectionner "Tout le temps"
3. Cocher "Images et fichiers en cache"
4. Cliquer "Effacer les données"
5. Fermer et rouvrir le navigateur

#### Firefox :

1. `Ctrl + Shift + Delete`
2. Sélectionner "Tout"
3. Cocher "Cache"
4. Cliquer "Effacer maintenant"
5. Fermer et rouvrir le navigateur

## Étape 4 : Vérifier dans l'Onglet Network

Dans l'onglet **Network** (F12) :

1. **Actualiser la page** : `F5`
2. **Chercher le fichier** : `index-Dutgzqs_.js`
3. **Vérifier** :
   - **Taille** : ~2.97 MB (2,967 KB)
   - **Statut** : `200` (pas `304 Not Modified`)
   - **Type** : `application/javascript`

Si vous voyez `304 Not Modified` → le cache n'est pas vidé.

## ⚠️ Si Rien ne Fonctionne

### Vérifier que le Serveur Sert le Bon Fichier

```bash
# Sur le serveur
curl -I http://82.208.22.230/assets/index-Dutgzqs_.js
```

Doit retourner `200 OK` et la taille doit être ~2.97 MB.

### Forcer le Rechargement avec un Paramètre

Aller sur : `http://82.208.22.230/organisations/nouveau?v=999999`

Le paramètre `?v=999999` force le rechargement.

## 🎯 Test Final

Si tout est OK, vous devriez :
1. ✅ Voir les logs dans la console
2. ✅ Voir `isEdit: false`
3. ✅ Voir les étapes du formulaire (multi-étapes)
4. ✅ Pouvoir créer une organisation avec `POST` (pas `PUT`)

