# 🌐 Configuration Frontend et Nginx

## ✅ État Actuel

- ✅ Backend fonctionne sur `http://localhost:3000`
- ✅ API répond correctement
- ✅ Base de données connectée

## 📦 Étape 1 : Installer et Builder le Frontend

```bash
# Aller à la racine du projet
cd /var/www/cacaotrack-agent

# Installer les dépendances
npm install

# Créer le fichier .env pour la production (optionnel)
nano .env.production
```

Contenu du `.env.production` (si vous voulez spécifier l'URL de l'API) :
```env
VITE_API_URL=http://votre-ip-serveur:3000/api
```

**Note :** Si vous laissez `VITE_API_URL` vide, le frontend utilisera `/api` par défaut et Nginx proxyfera vers le backend.

```bash
# Builder le frontend
npm run build

# Vérifier que le dossier dist existe
ls -la dist/
```

## 🔧 Étape 2 : Configurer Nginx

### Vérifier si Nginx est installé

```bash
# Vérifier si Nginx est installé
nginx -v

# Si non installé
sudo apt update
sudo apt install nginx -y

# Démarrer Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Créer la Configuration Nginx

```bash
# Créer le fichier de configuration
sudo nano /etc/nginx/sites-available/cacaotrack
```

Contenu de la configuration :
```nginx
server {
    listen 80;
    server_name _;  # Remplacez par votre domaine si vous en avez un

    # Frontend - Servir les fichiers statiques
    location / {
        root /var/www/cacaotrack-agent/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # API Backend - Proxy vers le serveur Node.js
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Augmenter la taille max pour les photos Base64
        client_max_body_size 50M;
    }

    # WebSocket pour Socket.IO
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Activer la Configuration

```bash
# Créer un lien symbolique
sudo ln -s /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/

# Supprimer la configuration par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration Nginx
sudo nginx -t

# Si la configuration est valide, redémarrer Nginx
sudo systemctl restart nginx

# Vérifier le statut
sudo systemctl status nginx
```

## 🔐 Étape 3 : Configurer les Permissions

```bash
# Donner les permissions au dossier dist
sudo chown -R www-data:www-data /var/www/cacaotrack-agent/dist
sudo chmod -R 755 /var/www/cacaotrack-agent/dist

# Si vous déployez dans /var/www/html
sudo mkdir -p /var/www/html
sudo cp -r /var/www/cacaotrack-agent/dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

## 🧪 Étape 4 : Tester

```bash
# Tester l'API directement
curl http://localhost:3000/api/health

# Tester via Nginx
curl http://localhost/api/health

# Tester le frontend
curl http://localhost/
```

## 🌐 Accéder à l'Application

Ouvrez votre navigateur et allez à :
- `http://VOTRE_IP_SERVEUR` (remplacez par l'IP de votre serveur)

Pour trouver l'IP de votre serveur :
```bash
hostname -I
# ou
ip addr show
```

## 🔄 Commandes Utiles

```bash
# Redémarrer Nginx
sudo systemctl restart nginx

# Voir les logs Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Rebuilder le frontend après modifications
cd /var/www/cacaotrack-agent
npm run build
sudo systemctl restart nginx

# Vérifier les processus PM2
pm2 status
pm2 logs cacaotrack-api
```

## 🐛 Dépannage

### Si Nginx ne démarre pas
```bash
sudo nginx -t  # Vérifier la configuration
sudo systemctl status nginx  # Voir les erreurs
```

### Si le frontend ne charge pas
```bash
# Vérifier que les fichiers existent
ls -la /var/www/cacaotrack-agent/dist/

# Vérifier les permissions
ls -la /var/www/cacaotrack-agent/dist/ | head -5
```

### Si l'API ne répond pas via Nginx
```bash
# Vérifier que le backend fonctionne
curl http://localhost:3000/api/health

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log
```

