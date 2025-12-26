# 🚀 Guide de Déploiement Rapide - CacaoTrack

## 📁 Fichiers Disponibles

1. **COMMANDES_DEPLOIEMENT_SERVEUR.md** - Guide complet avec toutes les commandes détaillées
2. **INSTALLATION_RAPIDE.sh** - Script d'installation automatique
3. **NETTOYAGE_ANCIEN_PROJET.sh** - Script pour supprimer l'ancien projet

## ⚡ Démarrage Rapide

### Sur le Serveur Linux (Ubuntu/Debian)

#### Étape 1 : Supprimer l'Ancien Projet

```bash
# Transférer le script sur le serveur
scp NETTOYAGE_ANCIEN_PROJET.sh utilisateur@serveur:/tmp/

# Se connecter au serveur
ssh utilisateur@serveur

# Exécuter le script de nettoyage
sudo bash /tmp/NETTOYAGE_ANCIEN_PROJET.sh
```

#### Étape 2 : Installer le Nouveau Projet

```bash
# Transférer le script d'installation
scp INSTALLATION_RAPIDE.sh utilisateur@serveur:/tmp/

# Exécuter le script d'installation
sudo bash /tmp/INSTALLATION_RAPIDE.sh
```

Le script va :
- ✅ Installer toutes les dépendances (Node.js, MySQL, Nginx, PM2)
- ✅ Cloner le projet
- ✅ Configurer la base de données
- ✅ Configurer le backend
- ✅ Build le frontend
- ✅ Configurer Nginx
- ✅ Optionnellement configurer SSL

## 📋 Commandes Manuelles (Alternative)

Si vous préférez installer manuellement, suivez le guide complet :

```bash
# Voir toutes les commandes détaillées
cat COMMANDES_DEPLOIEMENT_SERVEUR.md
```

## 🔧 Commandes Essentielles

### Installation des Dépendances

```bash
# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL
sudo apt install mysql-server -y

# Nginx
sudo apt install nginx -y

# PM2
sudo npm install -g pm2

# Certbot (SSL)
sudo apt install certbot python3-certbot-nginx -y
```

### Suppression de l'Ancien Projet

```bash
# Arrêter PM2
pm2 stop all
pm2 delete all

# Supprimer le projet
sudo rm -rf /var/www/cacaotrack-agent

# Supprimer la base de données
sudo mysql -u root -p
# Dans MySQL :
# DROP DATABASE IF EXISTS asco;
# DROP USER IF EXISTS 'cacaotrack_user'@'localhost';
# FLUSH PRIVILEGES;
# EXIT;

# Supprimer Nginx config
sudo rm /etc/nginx/sites-enabled/cacaotrack
sudo rm /etc/nginx/sites-available/cacaotrack
sudo nginx -t
sudo systemctl reload nginx
```

### Installation du Nouveau Projet

```bash
# Cloner le projet
cd /var/www
sudo git clone https://github.com/livai225/cacaotrack-agent.git cacaotrack-agent
sudo chown -R $USER:$USER cacaotrack-agent
cd cacaotrack-agent

# Backend
cd server
npm install
# Créer .env avec DATABASE_URL, PORT, JWT_SECRET
npx prisma generate
npx prisma db push
pm2 start src/index.ts --name cacaotrack-api --interpreter ts-node
pm2 save

# Frontend
cd ..
npm install
# Créer .env.production avec VITE_API_URL
npm run build

# Nginx (voir COMMANDES_DEPLOIEMENT_SERVEUR.md pour la config complète)
sudo nano /etc/nginx/sites-available/cacaotrack
sudo ln -s /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## ✅ Vérifications Post-Installation

```bash
# Backend
pm2 status
curl http://localhost:3000/api/health

# Frontend
curl http://localhost

# MySQL
sudo mysql -u root -p -e "SHOW DATABASES;"
```

## 📞 Support

En cas de problème, consultez :
- `COMMANDES_DEPLOIEMENT_SERVEUR.md` pour les détails
- Les logs : `pm2 logs cacaotrack-api`
- Les logs Nginx : `sudo tail -f /var/log/nginx/error.log`

