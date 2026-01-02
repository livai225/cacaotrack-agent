# 🔧 Correction - Étapes Visuelles sur le Serveur

## ❌ Problème

- ✅ En local : Les 4 étapes avec icônes s'affichent
- ❌ En ligne : Le formulaire est toujours en une seule étape

Le build sur le serveur n'a pas les dernières modifications.

## ✅ Solution

### 1. Vérifier que le Code Source a les Modifications

```bash
cd /var/www/cacaotrack-agent

# Vérifier que le code contient les modifications
grep -n "steps.map\|isCompleted\|isCurrent" src/pages/OrganisationForm.tsx
```

**Résultat attendu** : Vous devez voir plusieurs lignes avec `steps.map`, `isCompleted`, `isCurrent`

### 2. Si le Code Source n'a PAS les Modifications

```bash
# Forcer la mise à jour depuis Git
git fetch origin
git reset --hard origin/main

# Vérifier à nouveau
grep -n "steps.map\|isCompleted\|isCurrent" src/pages/OrganisationForm.tsx
```

### 3. Rebuild le Frontend

```bash
cd /var/www/cacaotrack-agent

# Supprimer l'ancien build
sudo rm -rf dist/ node_modules/.vite

# Rebuild
npm run build

# Vérifier que le nouveau build contient les modifications
grep -o "steps.map\|isCompleted" dist/assets/*.js | head -5

# Permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# Redémarrer Nginx
sudo systemctl reload nginx
```

### 4. Vérification

```bash
# Vérifier la date du build
ls -lh dist/assets/*.js

# Vérifier que le build contient les modifications
grep -o "steps.map" dist/assets/*.js | head -1
```

## 🧪 Test dans le Navigateur

1. **Navigation privée** : `Ctrl + Shift + N`
2. Aller sur : `http://82.208.22.230/organisations/nouveau`
3. **Vérifier** :
   - ✅ 4 étapes avec icônes en haut
   - ✅ Barre de progression
   - ✅ Boutons "Précédent" / "Suivant"

## ⚠️ Si ça ne Fonctionne Toujours Pas

### Vérifier le Hash du Fichier JS

Le fichier JS doit être différent de l'ancien. Vérifiez :

```bash
# Voir le nom du fichier JS actuel
cat dist/index.html | grep -o 'index-[^"]*\.js'

# Comparer avec l'ancien (si vous l'avez noté)
```

### Forcer le Rechargement du Navigateur

1. **Vider complètement le cache** : `Ctrl + Shift + Delete`
2. **Navigation privée** : `Ctrl + Shift + N`
3. **Ouvrir les outils développeur** : `F12`
4. **Network** → Cocher "Disable cache"
5. **Actualiser** : `Ctrl + Shift + R`

