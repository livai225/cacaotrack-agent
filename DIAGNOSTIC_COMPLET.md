# 🔍 Diagnostic Complet - Pourquoi les Modifications ne Fonctionnent Pas

## 🎯 Vérification Systématique

### Étape 1 : Vérifier le Code Source Local

```bash
# Sur votre machine Windows
cd C:\Users\Dell\Documents\GitHub\cacaotrack-agent

# Vérifier que AgentForm contient les modifications
grep -n "currentStep\|steps\|handleNext" src/pages/AgentForm.tsx
```

**Résultat attendu** : Vous devez voir plusieurs lignes avec `currentStep`, `steps`, `handleNext`

### Étape 2 : Vérifier que c'est dans Git

```bash
# Vérifier les commits récents
git log --oneline -5

# Vérifier le dernier commit pour AgentForm
git log --oneline -1 -- src/pages/AgentForm.tsx
```

**Résultat attendu** : Vous devez voir un commit récent avec "AgentForm" ou "étapes"

### Étape 3 : Vérifier sur le Serveur - Code Source

```bash
# Se connecter au serveur
ssh asco@82.208.22.230

# Aller dans le projet
cd /var/www/cacaotrack-agent

# Vérifier que le code source contient les modifications
grep -n "currentStep\|steps\|handleNext" src/pages/AgentForm.tsx
```

**Si vous ne voyez RIEN** → Le code source n'a pas été mis à jour
**Solution** : `git pull origin main`

### Étape 4 : Vérifier sur le Serveur - Build

```bash
# Vérifier la date du dernier build
ls -lh dist/assets/*.js

# Vérifier que le build contient les modifications (chercher dans le code minifié)
grep -o "currentStep\|handleNext" dist/assets/*.js | head -5
```

**Si vous ne voyez RIEN** → Le build n'a pas été refait
**Solution** : `npm run build`

### Étape 5 : Vérifier dans le Navigateur

1. **Ouvrir les outils développeur** : `F12`
2. **Aller dans l'onglet "Network"**
3. **COCHER "Disable cache"** (en haut)
4. **GARDER les outils développeur ouverts**
5. **Aller sur** : `http://82.208.22.230/agents/nouveau`
6. **Dans l'onglet "Console"**, chercher les erreurs

**Si vous voyez des erreurs** → Notez-les

## 🔧 Script de Diagnostic Complet

Exécutez ce script sur le serveur :

```bash
#!/bin/bash
echo "=== DIAGNOSTIC COMPLET ==="
echo ""
echo "1. Code source - AgentForm.tsx"
cd /var/www/cacaotrack-agent
echo "Lignes avec currentStep/steps/handleNext:"
grep -c "currentStep\|steps\|handleNext" src/pages/AgentForm.tsx || echo "❌ AUCUNE LIGNE TROUVÉE"
echo ""
echo "2. Dernier commit Git"
git log --oneline -1 -- src/pages/AgentForm.tsx
echo ""
echo "3. Date du build"
ls -lh dist/assets/*.js | head -1
echo ""
echo "4. Build contient currentStep?"
grep -o "currentStep" dist/assets/*.js | head -1 || echo "❌ NON TROUVÉ DANS LE BUILD"
echo ""
echo "5. Hash du fichier JS actuel"
cat dist/index.html | grep -o 'index-[^"]*\.js' | head -1
echo ""
echo "=== FIN DU DIAGNOSTIC ==="
```

## 🎯 Solutions selon le Problème

### Problème 1 : Code Source n'a pas les Modifications

```bash
cd /var/www/cacaotrack-agent
git fetch origin
git reset --hard origin/main
```

### Problème 2 : Build n'est pas à Jour

```bash
cd /var/www/cacaotrack-agent
sudo rm -rf dist/
npm run build
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
sudo systemctl reload nginx
```

### Problème 3 : Cache du Navigateur

1. **Fermer TOUS les onglets** du site
2. **Navigation privée** : `Ctrl + Shift + N`
3. **Aller sur** : `http://82.208.22.230/agents/nouveau`
4. **Console** : `F12` → Vérifier les erreurs

### Problème 4 : Nginx sert un Ancien Fichier

```bash
# Vérifier la configuration Nginx
sudo cat /etc/nginx/sites-available/cacaotrack | grep root

# Doit pointer vers : /var/www/cacaotrack-agent/dist

# Si différent, corriger et redémarrer
sudo systemctl restart nginx
```

## 📝 Commande de Réparation Complète

Si rien ne fonctionne, exécutez ceci sur le serveur :

```bash
cd /var/www/cacaotrack-agent && \
git fetch origin && \
git reset --hard origin/main && \
sudo rm -rf dist/ node_modules/.vite && \
npm run build && \
sudo chown -R asco:asco dist/ && \
sudo chmod -R 755 dist/ && \
sudo systemctl restart nginx && \
echo "✅ Réparation complète terminée !"
```

## 🔍 Vérification Finale

Après la réparation, testez :

1. **Navigation privée** : `Ctrl + Shift + N`
2. **Aller sur** : `http://82.208.22.230/agents/nouveau`
3. **Console** : `F12` → Vérifier
4. **Vous devez voir** :
   - Barre de progression
   - 3 étapes
   - Boutons Précédent/Suivant

Si ça ne fonctionne toujours pas, envoyez-moi le résultat du script de diagnostic.

