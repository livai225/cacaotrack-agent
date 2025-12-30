# 🔄 Utiliser un Autre Compte Expo

## ✅ Solution Simple et Gratuite

Utiliser un autre compte Expo est **la solution la plus rapide** pour contourner le quota épuisé !

## 🚀 Méthode Rapide : Script Automatique

```powershell
cd mobile
.\changer-compte-expo.ps1
```

Le script va :
1. ✅ Vous déconnecter du compte actuel
2. ✅ Vous connecter avec un nouveau compte
3. ✅ Initialiser un nouveau projet EAS
4. ✅ Lancer le build automatiquement

## 📝 Méthode Manuelle

### Étape 1 : Se Déconnecter

```powershell
cd mobile
eas logout
```

### Étape 2 : Créer un Nouveau Compte Expo (si nécessaire)

Si vous n'avez pas encore de compte :
1. Allez sur : https://expo.dev/signup
2. Créez un compte avec un **nouvel email**
3. C'est **gratuit** et **sans carte bancaire**

### Étape 3 : Se Connecter avec le Nouveau Compte

```powershell
eas login
```

Entrez les identifiants du nouveau compte.

### Étape 4 : Supprimer l'Ancienne Configuration

```powershell
# Éditer app.json et supprimer la section extra.eas.projectId
# Ou laisser le script le faire automatiquement
```

### Étape 5 : Initialiser le Nouveau Projet EAS

```powershell
eas init
```

Quand on vous demande :
- "Would you like to create a project for @nouveau-compte/cacaotrack-agent?" → Répondez `y` ou `yes`
- Acceptez les autres options par défaut

### Étape 6 : Lancer le Build

```powershell
eas build --platform android --profile preview
```

## 📊 Avantages

- ✅ **Gratuit** - Nouveau quota de builds gratuits
- ✅ **Rapide** - ~5 minutes pour tout configurer
- ✅ **Immédiat** - Build disponible tout de suite
- ✅ **Simple** - Pas besoin d'Android Studio

## ⚠️ Points Importants

### 1. Nouvel Email Requis

Vous devez utiliser un **email différent** pour créer le nouveau compte Expo.

**Options** :
- Utiliser un email secondaire
- Créer un email temporaire (Gmail, Outlook, etc.)
- Utiliser un service d'email temporaire

### 2. Nouveau Projet EAS

Chaque compte Expo a son propre projet. Le nouveau compte créera un nouveau projet EAS avec :
- Un nouveau `projectId` UUID
- Un nouveau keystore Android
- Un nouveau quota de builds

### 3. Conservation des Fichiers

Vos fichiers locaux (`app.json`, code source, etc.) restent intacts. Seul le `projectId` dans `app.json` changera.

## 🔄 Retourner au Compte Original

Si vous voulez revenir au compte original plus tard :

```powershell
eas logout
eas login
# Entrez les identifiants du compte original
eas init
```

## 📋 Checklist

- [ ] Nouveau compte Expo créé (ou existant)
- [ ] Déconnexion du compte actuel (`eas logout`)
- [ ] Connexion avec le nouveau compte (`eas login`)
- [ ] Ancienne configuration supprimée (automatique avec le script)
- [ ] Nouveau projet EAS initialisé (`eas init`)
- [ ] Build lancé (`eas build --platform android --profile preview`)

## 🎯 Comparaison des Solutions

| Solution | Temps | Coût | Complexité |
|----------|-------|------|------------|
| **Nouveau compte Expo** | ⚡ 5 min | ✅ Gratuit | ⭐ Simple |
| Attendre le quota | ⏳ 1 jour | ✅ Gratuit | ⭐⭐ Moyen |
| Build local | ⏱️ 10-15 min | ✅ Gratuit | ⭐⭐⭐ Complexe |
| Upgrade plan | ⚡ Immédiat | 💰 Payant | ⭐ Simple |

## ✅ Recommandation

**Utiliser un nouveau compte Expo** est la meilleure solution si vous voulez :
- ✅ Générer l'APK **maintenant**
- ✅ Sans installer Android Studio
- ✅ Sans payer
- ✅ En 5 minutes

**Le script `changer-compte-expo.ps1` fait tout automatiquement ! 🚀**

