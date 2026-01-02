# 🔍 Commandes de Vérification Finale

## Sur le Serveur

Exécutez ces commandes pour vérifier que tout est correct :

```bash
# 1. Vérifier que le code source contient les corrections
cd /var/www/cacaotrack-agent
grep -A 2 -B 2 "location.pathname.includes.*nouveau" src/pages/OrganisationForm.tsx

# 2. Vérifier la date du dernier commit
git log --oneline -5

# 3. Vérifier que le build est récent
ls -lh dist/assets/

# 4. Vérifier la configuration Nginx
sudo cat /etc/nginx/sites-available/cacaotrack | grep -A 5 "root"
```

## Test dans le Navigateur

1. **Navigation privée** : `Ctrl + Shift + N`
2. Aller sur : `http://82.208.22.230/organisations/nouveau`
3. **Console** : `F12` → Console
4. Chercher les logs : `🔍 OrganisationForm Debug`

Si vous voyez `isEdit: false`, c'est bon ! ✅

