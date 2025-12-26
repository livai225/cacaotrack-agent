# 🔄 Commandes Git pour le Serveur

## Cloner le Projet sur le Serveur

```bash
# Se placer dans /var/www
cd /var/www

# Cloner le projet
sudo git clone https://github.com/livai225/mock-data-creator.git cacaotrack-agent

# Donner les permissions
sudo chown -R $USER:$USER cacaotrack-agent
cd cacaotrack-agent
```

## Mettre à Jour le Projet

```bash
cd /var/www/cacaotrack-agent

# Récupérer les dernières modifications
git pull origin main

# Mettre à jour le backend
cd server
npm install
npx prisma generate
npx prisma db push
pm2 restart cacaotrack-api

# Mettre à jour le frontend
cd ..
npm install
npm run build

# Redémarrer Nginx
sudo systemctl reload nginx
```

## Vérifier l'État du Repository

```bash
cd /var/www/cacaotrack-agent
git status
git log --oneline -10
```

## En Cas de Conflit

```bash
# Sauvegarder les modifications locales
git stash

# Récupérer les modifications
git pull origin main

# Réappliquer les modifications locales
git stash pop
```

