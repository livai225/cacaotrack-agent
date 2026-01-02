# ✅ SOLUTION SIMPLE - Déploiement en 3 Étapes

## 🎯 Le Problème

- Le dossier `dist/` est dans `.gitignore` → **pas dans Git**
- Les modifications sont dans `src/` → **dans Git**
- Le serveur a besoin du nouveau `dist/` → **à générer sur le serveur**

## 🚀 Solution en 3 Commandes

### Sur le Serveur (via SSH)

```bash
# 1. Se connecter au serveur
ssh root@82.208.22.230

# 2. Aller dans le projet et récupérer le code
cd /var/www/cacaotrack-agent
git pull origin main

# 3. Re-builder le frontend avec les nouvelles modifications
npm run build

# 4. Redémarrer Nginx (pour être sûr)
systemctl reload nginx
```

## ⚡ Commande Tout-en-Un

```bash
ssh root@82.208.22.230 "cd /var/www/cacaotrack-agent && git pull origin main && npm run build && systemctl reload nginx && echo '✅ Déploiement terminé !'"
```

## 🔍 Vérification

### 1. Vérifier que le nouveau build est créé

```bash
ssh root@82.208.22.230 "ls -lh /var/www/cacaotrack-agent/dist/assets/"
```

Vous devez voir un fichier `index-XXXXX.js` récent (environ 3 MB)

### 2. Vérifier dans le navigateur

1. **Navigation privée** : `Ctrl + Shift + N`
2. Aller sur : `http://82.208.22.230/organisations/nouveau`
3. Ouvrir la console : `F12` → Console
4. Vérifier les logs :
   ```
   🔍 OrganisationForm Debug: { pathname: "/organisations/nouveau", ... }
   🔍 isEdit déterminé: false
   ```

## 📝 Pourquoi ça Marche

1. ✅ `git pull` → récupère les modifications de `src/pages/OrganisationForm.tsx`
2. ✅ `npm run build` → compile `src/` → génère `dist/` avec les corrections
3. ✅ Nginx sert automatiquement le nouveau `dist/`

## ⚠️ Si ça ne Fonctionne Pas

### Vérifier que Git est à jour

```bash
ssh root@82.208.22.230 "cd /var/www/cacaotrack-agent && git status && git log --oneline -5"
```

### Vérifier que npm run build fonctionne

```bash
ssh root@82.208.22.230 "cd /var/www/cacaotrack-agent && npm run build 2>&1"
```

### Vérifier les permissions

```bash
ssh root@82.208.22.230 "cd /var/www/cacaotrack-agent && ls -la dist/ && chmod -R 755 dist/"
```

