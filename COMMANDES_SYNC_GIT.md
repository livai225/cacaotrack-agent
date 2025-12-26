# 🔄 Commandes de Synchronisation Git

## Sur votre machine locale (Windows)

### 1. Ajouter et commiter les modifications

```bash
# Ajouter les formulaires multi-étapes
git add src/pages/VillageForm.tsx
git add src/pages/SectionForm.tsx
git add src/pages/ProducteurForm.tsx
git add src/pages/PlantationForm.tsx
git add src/pages/OrganisationForm.tsx
git add src/pages/OperationForm.tsx

# Ajouter les composants et données
git add src/components/forms/GeographicSelect.tsx
git add src/components/ui/combobox.tsx
git add src/data/geographieCI.ts

# Commit
git commit -m "Ajout des formulaires multi-étapes avec navigation et barre de progression"

# Pousser vers GitHub
git push origin main
```

### 2. Commande complète (copier-coller)

```bash
git add src/pages/*Form.tsx src/components/forms/GeographicSelect.tsx src/components/ui/combobox.tsx src/data/geographieCI.ts && git commit -m "Ajout des formulaires multi-étapes" && git push origin main
```

## Sur le serveur (après le push)

```bash
cd /var/www/cacaotrack-agent

# Récupérer les modifications
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

## Commande complète serveur (copier-coller)

```bash
cd /var/www/cacaotrack-agent && git pull origin main && sudo rm -rf dist/ && npm run build && sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist && sudo chmod -R 755 /var/www/cacaotrack-agent/dist && sudo systemctl restart nginx
```

