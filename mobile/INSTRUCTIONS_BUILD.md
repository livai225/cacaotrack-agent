# 🚀 Instructions pour Lancer le Build APK

## ✅ État Actuel

- ✅ EAS CLI installé (version 16.28.0)
- ✅ Connecté à Expo en tant que **livai**
- ✅ Configuration `eas.json` présente
- ✅ Configuration `app.json` présente dans `mobile/`

## 🚀 Lancer le Build

### Option 1: Script PowerShell (Recommandé)

```powershell
cd mobile
.\lancer-build.ps1
```

### Option 2: Commande Directe

```powershell
cd mobile
eas build --platform android --profile preview
```

## ⚠️ Note Importante

Si vous voyez l'erreur **"Invalid UUID appId"** :

1. **Supprimez** la section `extra.eas.projectId` de `app.json` si elle existe
2. **Lancez** `eas init` pour créer un nouveau projet EAS
3. **Relancez** le build

## 📋 Ce qui va se passer

1. ✅ Votre code sera uploadé sur les serveurs Expo
2. ✅ Le build se fera en ligne (gratuit)
3. ✅ Durée : ~10-15 minutes
4. ✅ Vous recevrez un lien pour télécharger l'APK
5. ✅ Le lien est valide 30 jours

## 🔗 Suivre le Build

Une fois lancé, vous pouvez suivre le build sur :
- **Terminal** : Les logs s'affichent en temps réel
- **Web** : https://expo.dev/accounts/livai/projects/cacaotrack-agent/builds
- **Email** : Vous recevrez un email quand le build est terminé

## 📱 Après le Build

1. **Téléchargez** l'APK depuis le lien fourni
2. **Installez** sur votre appareil Android
3. **Testez** l'application

## 🎯 Commandes Utiles

```bash
# Voir tous les builds
eas build:list

# Voir le dernier build
eas build:view

# Annuler un build en cours
eas build:cancel
```

**Le build est prêt à être lancé ! 🚀**

