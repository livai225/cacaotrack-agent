# 🚀 Déploiement du Nouveau Build

## ✅ Build Réussi

Un nouveau build a été créé avec les corrections :

```
dist/assets/index-CBAVjyBy.js  (2.97 MB)
```

## 📋 Étapes de Déploiement

### 1. Tester Localement (Optionnel)

```powershell
# Démarrer un serveur local pour tester le build
cd C:\Users\Dell\Documents\GitHub\cacaotrack-agent
npx serve dist -p 8080
```

Puis ouvrir : `http://localhost:8080/organisations/nouveau`

### 2. Déployer sur le Serveur

#### Option A : Via SCP (Recommandé)

```powershell
# Depuis votre machine Windows
scp -r dist/* root@82.208.22.230:/var/www/cacaotrack-agent/dist/
```

#### Option B : Via Git (Alternative)

```bash
# Sur le serveur
cd /var/www/cacaotrack-agent

# Sauvegarder l'ancien build
mv dist dist.backup.$(date +%Y%m%d_%H%M%S)

# Récupérer le nouveau build depuis Git
git pull origin main

# Si le dossier dist n'est pas dans Git, utiliser SCP (Option A)
```

#### Option C : Manuellement via SFTP

1. Ouvrir WinSCP ou FileZilla
2. Se connecter à `82.208.22.230`
3. Naviguer vers `/var/www/cacaotrack-agent/`
4. Supprimer l'ancien dossier `dist/`
5. Uploader le nouveau dossier `dist/`

### 3. Vérifier sur le Serveur

```bash
# Se connecter au serveur
ssh root@82.208.22.230

# Vérifier les fichiers
cd /var/www/cacaotrack-agent
ls -lh dist/assets/

# Vérifier que le nouveau fichier est là
ls -lh dist/assets/index-CBAVjyBy.js

# Vérifier les permissions
chmod -R 755 dist/

# Redémarrer Nginx (si nécessaire)
systemctl reload nginx
```

### 4. Tester dans le Navigateur

1. **Vider le cache** : `Ctrl + Shift + R` (plusieurs fois)
   
   OU

2. **Navigation privée** : `Ctrl + Shift + N`

3. Aller sur : `http://82.208.22.230/organisations/nouveau`

4. Ouvrir la console : `F12` → Console

5. Vérifier les logs :
   ```
   🔍 OrganisationForm Debug: { pathname: "/organisations/nouveau", ... }
   🔍 isEdit déterminé: false | pathname: /organisations/nouveau | id: undefined
   ```

6. Si `isEdit` est `false`, remplir et soumettre le formulaire

### 5. Vérification Finale

```bash
# Sur le serveur, vérifier les logs Nginx
tail -f /var/log/nginx/access.log

# Vérifier que le bon fichier JS est servi
curl -I http://82.208.22.230/assets/index-CBAVjyBy.js
```

## 🔍 Diagnostic si ça ne Fonctionne Pas

### Vérifier que le fichier est bien sur le serveur

```bash
ssh root@82.208.22.230 'ls -lh /var/www/cacaotrack-agent/dist/assets/'
```

Vous devez voir : `index-CBAVjyBy.js` (environ 3 MB)

### Vérifier que Nginx sert le bon fichier

```bash
ssh root@82.208.22.230 'cat /var/www/cacaotrack-agent/dist/index.html | grep index-'
```

Doit contenir : `index-CBAVjyBy.js`

### Vérifier la configuration Nginx

```bash
ssh root@82.208.22.230 'cat /etc/nginx/sites-available/cacaotrack'
```

Doit pointer vers : `/var/www/cacaotrack-agent/dist`

## ⚡ Commande Rapide (Tout-en-Un)

```powershell
# Build + Deploy + Verify
npm run build; scp -r dist/* root@82.208.22.230:/var/www/cacaotrack-agent/dist/; ssh root@82.208.22.230 'ls -lh /var/www/cacaotrack-agent/dist/assets/ && systemctl reload nginx'
```

## 📝 Notes

- Le nouveau fichier JS s'appelle `index-CBAVjyBy.js` (hash généré par Vite)
- L'ancien fichier était `index-Dutgzqs_.js` (sur le serveur)
- Le fichier `index.html` référence automatiquement le bon fichier JS
- Après le déploiement, **TOUJOURS vider le cache du navigateur**

