# 🚀 Mise à Jour Serveur - AgentForm Multi-Étapes

## ✅ Modifications Poussées sur Git

Le formulaire `AgentForm` a été refactorisé en 3 étapes et poussé sur GitHub.

## 📋 Commandes pour Mettre à Jour le Serveur

### Sur le Serveur (SSH)

Exécutez ces commandes :

```bash
# Se connecter au serveur
ssh asco@82.208.22.230

# Aller dans le projet
cd /var/www/cacaotrack-agent

# Récupérer les modifications
git pull origin main

# Re-builder le frontend
npm run build

# Corriger les permissions
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/

# Redémarrer Nginx
sudo systemctl reload nginx

echo "✅ Mise à jour terminée !"
```

### Commande Tout-en-Un

```bash
ssh asco@82.208.22.230 "cd /var/www/cacaotrack-agent && git pull origin main && npm run build && sudo chown -R asco:asco dist/ && sudo chmod -R 755 dist/ && sudo systemctl reload nginx && echo '✅ Mise à jour terminée !'"
```

## 🔍 Vérification

### Sur le Serveur

```bash
# Vérifier que le nouveau build est créé
ls -lh dist/assets/

# Vérifier que le code source contient les modifications
grep -n "currentStep\|steps\|handleNext" src/pages/AgentForm.tsx
```

### Dans le Navigateur

1. **Navigation privée** : `Ctrl + Shift + N`
2. Aller sur : `http://82.208.22.230/agents/nouveau`
3. Vérifier que vous voyez :
   - ✅ Barre de progression
   - ✅ 3 étapes avec icônes
   - ✅ Boutons "Précédent" / "Suivant"
   - ✅ Navigation entre les étapes

## 📝 Notes

- Le formulaire AgentForm est maintenant en **3 étapes**
- Tous les formulaires sont maintenant en plusieurs étapes
- N'oubliez pas de **vider le cache du navigateur** après le déploiement

