# 🔍 Versions Multiples dans le Projet

## ⚠️ PROBLÈME IDENTIFIÉ

Ce projet contient **PLUSIEURS versions** de l'application, ce qui cause la confusion !

## 📦 Les Différentes Versions

### 1. 🌐 **Frontend Web Principal** (PRODUCTION)
- **Dossier** : `src/` (racine du projet)
- **Technologie** : React 18 + Vite + TypeScript
- **Build** : `npm run build` → génère `dist/`
- **Statut** : ✅ **Version principale déployée sur le serveur**
- **URL** : http://82.208.22.230
- **Package** : `package.json` (racine)

### 2. 📱 **CacaoTrackMobile** (Expo)
- **Dossier** : `CacaoTrackMobile/`
- **Technologie** : React Native + Expo
- **Statut** : ✅ Version mobile active
- **Package** : `CacaoTrackMobile/package.json`
- **Commande** : `cd CacaoTrackMobile; expo start`

### 3. 📱 **Mobile** (React Native)
- **Dossier** : `mobile/`
- **Technologie** : React Native (sans Expo)
- **Statut** : ⚠️ **Ancienne version ou alternative ?**
- **Package** : `mobile/package.json`
- **Screens** : 10 écrans complets

### 4. 🦋 **Mobile Flutter** (ANCIEN)
- **Dossier** : `mobile_flutter/`
- **Technologie** : Flutter/Dart
- **Statut** : ❌ **Abandonné / Non utilisé**

### 5. 🔧 **Backend API**
- **Dossier** : `server/`
- **Technologie** : Express + Prisma + MySQL
- **Port** : 3000
- **Statut** : ✅ Active

## 🎯 Le Problème Actuel

### Ce qui est DÉPLOYÉ sur le serveur
Le serveur (82.208.22.230) sert le contenu du dossier **`dist/`** qui est généré par :

```bash
# À la racine du projet
npm run build
```

Ce build compile le code dans **`src/`** (frontend web principal).

### Pourquoi les modifications ne se voient pas

Il y a **2 possibilités** :

#### Possibilité 1 : Cache Navigateur
- Le build est correct sur le serveur
- Mais le navigateur utilise l'ancienne version en cache
- **Solution** : Vider le cache (voir FORCE_RELOAD_NAVIGATEUR.md)

#### Possibilité 2 : Mauvais Build
- Les modifications sont dans `src/`
- Mais le serveur sert un ancien `dist/`
- **Solution** : Re-build et re-déployer

## 🔍 Vérification

### Vérifier quel fichier est servi

```powershell
# Télécharger le fichier JS du serveur
Invoke-WebRequest -Uri "http://82.208.22.230/assets/index-Dutgzqs_.js" -OutFile "$env:TEMP\server-index.js"

# Vérifier la taille
(Get-Item "$env:TEMP\server-index.js").Length / 1MB

# Rechercher la correction
Select-String -Path "$env:TEMP\server-index.js" -Pattern "location.pathname.includes.*nouveau"
```

### Vérifier le fichier local

```powershell
# Dans le dossier local
Get-ChildItem dist/assets/*.js | Select-Object Name, @{N='Size(MB)';E={[math]::Round($_.Length/1MB,2)}}

# Rechercher la correction localement
Get-Content dist/assets/*.js -Raw | Select-String "location.pathname.includes.*nouveau"
```

## ✅ Solution

### Si les fichiers sont différents (serveur ≠ local)

```bash
# Re-build localement
npm run build

# Vérifier que le nouveau build contient la correction
grep -o "location.pathname.includes.*nouveau" dist/assets/*.js

# Re-déployer sur le serveur
scp -r dist/* root@82.208.22.230:/var/www/cacaotrack-agent/dist/
```

### Si les fichiers sont identiques (serveur = local)

C'est le **cache du navigateur** :

1. **Mode navigation privée** (le plus simple)
2. **Vider le cache** : `Ctrl + Shift + R` plusieurs fois
3. **Désactiver le cache** : F12 → Network → Cocher "Disable cache"

## 📊 Comparaison des Versions

| Version | Technologie | Dossier | Statut | Déployé |
|---------|-------------|---------|--------|---------|
| **Web Dashboard** | React + Vite | `src/` | ✅ Actif | ✅ Oui |
| **Mobile Expo** | Expo | `CacaoTrackMobile/` | ✅ Actif | ❌ Non |
| **Mobile RN** | React Native | `mobile/` | ⚠️ ? | ❌ Non |
| **Mobile Flutter** | Flutter | `mobile_flutter/` | ❌ Ancien | ❌ Non |
| **Backend** | Express | `server/` | ✅ Actif | ✅ Oui |

## 🎯 Recommandation

### Pour le Web (problème actuel)
1. Vérifier que `dist/` contient le dernier build
2. Vérifier que le serveur a bien reçu les nouveaux fichiers
3. Vider le cache du navigateur

### Pour clarifier le projet
Choisir **UNE** version mobile et supprimer les autres :
- Garder `CacaoTrackMobile/` (Expo - plus moderne)
- Supprimer `mobile/` (si non utilisé)
- Supprimer `mobile_flutter/` (ancien)

## 🔧 Commandes de Diagnostic

```powershell
# Vérifier la date du dernier build
Get-Item dist/assets/*.js | Select-Object Name, LastWriteTime

# Comparer avec le serveur
ssh root@82.208.22.230 'ls -lh /var/www/cacaotrack-agent/dist/assets/*.js'
```

