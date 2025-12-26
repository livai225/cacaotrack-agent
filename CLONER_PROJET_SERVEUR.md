# 📥 Cloner le Projet sur le Serveur

## Commandes à Exécuter

### 1. Vérifier que Git est Installé

```bash
git --version
```

Si Git n'est pas installé :
```bash
sudo apt update
sudo apt install git -y
```

### 2. Cloner le Projet

```bash
# Aller dans /var/www
cd /var/www

# Cloner le projet depuis GitHub
sudo git clone https://github.com/livai225/mock-data-creator.git cacaotrack-agent

# Donner les permissions
sudo chown -R $USER:$USER cacaotrack-agent

# Aller dans le projet
cd cacaotrack-agent

# Vérifier la structure
ls -la
```

### 3. Vérifier la Structure du Projet

Le projet devrait avoir cette structure :
```
cacaotrack-agent/
├── server/          # Backend
├── src/             # Frontend
├── CacaoTrackMobile/ # App mobile
└── ...
```

### 4. Si le Projet a une Structure Différente

Si le projet cloné a une structure différente (par exemple `backend/` au lieu de `server/`), ajustez les commandes :

```bash
# Voir la structure
ls -la

# Si c'est "backend" au lieu de "server"
cd backend  # au lieu de server
```

## Vérification

```bash
# Vérifier que le projet est cloné
cd /var/www/cacaotrack-agent
pwd

# Voir les fichiers
ls -la

# Voir la structure
tree -L 2  # ou find . -maxdepth 2 -type d
```

