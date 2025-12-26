# 🔄 Synchronisation des Modifications vers le Serveur

## Problème

Les modifications locales (formulaires multi-étapes) ne sont pas sur le serveur distant.

## Solution : Synchroniser via Git

### Option 1 : Pousser les modifications vers GitHub (Recommandé)

#### Sur votre machine locale

```bash
# Vérifier l'état
git status

# Ajouter tous les fichiers modifiés
git add .

# Commit les modifications
git commit -m "Ajout des formulaires multi-étapes pour tous les formulaires"

# Pousser vers GitHub
git push origin main
```

#### Sur le serveur

```bash
cd /var/www/cacaotrack-agent

# Récupérer les dernières modifications
git pull origin main

# Rebuilder le frontend
sudo rm -rf dist/
npm run build

# Configurer les permissions
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Option 2 : Copier les fichiers directement (Si Git n'est pas configuré)

#### Fichiers à copier (formulaires multi-étapes)

```bash
# Sur votre machine locale, créer une archive
cd C:\Users\Dell\Documents\GitHub\cacaotrack-agent

# Copier les fichiers modifiés vers le serveur via SCP
scp src/pages/VillageForm.tsx asco@82.208.22.230:/tmp/
scp src/pages/SectionForm.tsx asco@82.208.22.230:/tmp/
scp src/pages/ProducteurForm.tsx asco@82.208.22.230:/tmp/
scp src/pages/PlantationForm.tsx asco@82.208.22.230:/tmp/
scp src/pages/OrganisationForm.tsx asco@82.208.22.230:/tmp/
scp src/pages/OperationForm.tsx asco@82.208.22.230:/tmp/

# Sur le serveur, déplacer les fichiers
ssh asco@82.208.22.230
cd /var/www/cacaotrack-agent
sudo cp /tmp/*Form.tsx src/pages/
sudo chown -R asco:asco src/pages/

# Rebuilder
sudo rm -rf dist/
npm run build
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist
sudo systemctl restart nginx
```

## Fichiers Modifiés (Formulaires Multi-Étapes)

1. ✅ `src/pages/VillageForm.tsx` - 6 étapes
2. ✅ `src/pages/SectionForm.tsx` - 5 étapes
3. ✅ `src/pages/ProducteurForm.tsx` - 4 étapes
4. ✅ `src/pages/PlantationForm.tsx` - 5 étapes
5. ✅ `src/pages/OrganisationForm.tsx` - 4 étapes
6. ✅ `src/pages/OperationForm.tsx` - 9 étapes

## Autres Fichiers Potentiellement Modifiés

- `src/components/forms/GeographicSelect.tsx` - Combobox pour localité
- `src/components/ui/combobox.tsx` - Composant Combobox
- `src/data/geographieCI.ts` - Données géographiques

## Vérification après Synchronisation

1. Vider le cache du navigateur (Ctrl+Shift+Delete)
2. Tester la création d'une organisation (doit être en 4 étapes)
3. Tester la création d'un village (doit être en 6 étapes)
4. Tester la création d'une section (doit être en 5 étapes)
5. Tester la création d'un producteur (doit être en 4 étapes)
6. Tester la création d'une plantation (doit être en 5 étapes)

