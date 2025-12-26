# 🔄 Gestion du Dossier Existant

## Option 1 : Vérifier le Contenu (Recommandé)

```bash
# Voir ce qu'il y a dans le dossier
ls -la /var/www/cacaotrack-agent

# Voir la structure
cd /var/www/cacaotrack-agent
ls -la
find . -maxdepth 2 -type d
```

Si le projet est déjà là et à jour, vous pouvez continuer avec la configuration.

## Option 2 : Supprimer et Recloner (Si Ancien Projet)

```bash
# Supprimer l'ancien dossier
sudo rm -rf /var/www/cacaotrack-agent

# Cloner à nouveau
cd /var/www
sudo git clone https://github.com/livai225/mock-data-creator.git cacaotrack-agent

# Donner les permissions
sudo chown -R $USER:$USER cacaotrack-agent
cd cacaotrack-agent
```

## Option 3 : Mettre à Jour le Projet Existant

```bash
# Aller dans le projet
cd /var/www/cacaotrack-agent

# Vérifier si c'est un repo Git
git status

# Si c'est un repo Git, mettre à jour
git pull origin main

# Si ce n'est pas un repo Git, le supprimer et recloner
cd /var/www
sudo rm -rf cacaotrack-agent
sudo git clone https://github.com/livai225/mock-data-creator.git cacaotrack-agent
sudo chown -R $USER:$USER cacaotrack-agent
```

## Option 4 : Renommer l'Ancien et Cloner le Nouveau

```bash
# Renommer l'ancien (sauvegarde)
sudo mv /var/www/cacaotrack-agent /var/www/cacaotrack-agent.backup.$(date +%Y%m%d)

# Cloner le nouveau
cd /var/www
sudo git clone https://github.com/livai225/mock-data-creator.git cacaotrack-agent
sudo chown -R $USER:$USER cacaotrack-agent
```

