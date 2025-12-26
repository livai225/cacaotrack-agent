# 🔍 Vérification et Mise à Jour du Serveur

## Problème

Le formulaire d'organisation s'affiche en une seule page au lieu de plusieurs étapes.

## Solution : Vérifier et Mettre à Jour

### Commandes à Exécuter sur le Serveur

```bash
# 1. Aller dans le répertoire du projet
cd /var/www/cacaotrack-agent

# 2. Vérifier l'état Git
git status

# 3. Vérifier la dernière version du fichier OrganisationForm.tsx
head -50 src/pages/OrganisationForm.tsx | grep -i "currentStep\|steps"

# 4. Récupérer les modifications depuis GitHub
git pull origin main

# 5. Vérifier que les modifications sont bien là
head -50 src/pages/OrganisationForm.tsx | grep -i "currentStep\|steps"

# 6. Rebuilder le frontend
sudo rm -rf dist/
npm run build

# 7. Configurer les permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# 8. Redémarrer Nginx
sudo systemctl restart nginx
```

## Commande Complète (Copier-Coller)

```bash
cd /var/www/cacaotrack-agent && git status && git pull origin main && sudo rm -rf dist/ && npm run build && sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist && sudo chmod -R 755 /var/www/cacaotrack-agent/dist && sudo systemctl restart nginx
```

## Après la Mise à Jour

1. **Vider complètement le cache du navigateur** :
   - Chrome/Edge : `Ctrl + Shift + Delete`
   - Sélectionner "Tout le temps" dans la période
   - Cocher "Images et fichiers en cache"
   - Cliquer sur "Effacer les données"

2. **Ou utiliser la navigation privée** :
   - Chrome/Edge : `Ctrl + Shift + N`
   - Firefox : `Ctrl + Shift + P`

3. **Tester à nouveau** :
   - Aller sur `http://82.208.22.230/organisations/nouveau`
   - Vous devriez voir :
     - Une barre de progression en haut
     - Un bouton "Précédent" et "Suivant"
     - Les étapes : "Informations Générales" → "Localisation GPS" → "Responsables" → "Photo"

## Vérification

Le formulaire devrait avoir :
- ✅ Barre de progression en haut
- ✅ Navigation "Précédent" / "Suivant"
- ✅ 4 étapes distinctes
- ✅ Indicateur d'étape actuelle

