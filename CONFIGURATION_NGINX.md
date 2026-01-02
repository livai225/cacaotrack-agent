# 🔧 Configuration Nginx pour CacaoTrack

## 📝 Contenu du Fichier

Quand vous ouvrez `sudo nano /etc/nginx/sites-available/cacaotrack`, copiez-collez exactement ceci :

```nginx
server {
    listen 80;
    server_name 82.208.22.230;

    root /var/www/cacaotrack-agent/dist;
    index index.html;

    # Frontend - Toutes les routes vont vers index.html (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend - Proxy vers le serveur Node.js sur le port 3000
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
    }

    # WebSocket pour Socket.IO (temps réel)
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

## 📋 Instructions

1. **Ouvrir le fichier** :
   ```bash
   sudo nano /etc/nginx/sites-available/cacaotrack
   ```

2. **Coller le contenu ci-dessus** (dans nano : clic droit ou `Shift + Insert`)

3. **Sauvegarder** :
   - `Ctrl + O` (O comme "Output")
   - `Entrée` pour confirmer
   - `Ctrl + X` pour quitter

4. **Activer le site** :
   ```bash
   sudo ln -s /etc/nginx/sites-available/cacaotrack /etc/nginx/sites-enabled/
   ```

5. **Supprimer la config par défaut** (optionnel) :
   ```bash
   sudo rm /etc/nginx/sites-enabled/default
   ```

6. **Tester la configuration** :
   ```bash
   sudo nginx -t
   ```
   
   Vous devez voir : `syntax is ok` et `test is successful`

7. **Redémarrer Nginx** :
   ```bash
   sudo systemctl restart nginx
   ```

## ✅ Vérification

```bash
# Vérifier que Nginx fonctionne
sudo systemctl status nginx

# Tester le frontend
curl http://localhost/

# Tester l'API
curl http://localhost/api/health
```

## 🔍 Explication

- **`root /var/www/cacaotrack-agent/dist`** : Dossier où se trouve le build du frontend
- **`location /`** : Toutes les routes web → vers `index.html` (pour React Router)
- **`location /api`** : Toutes les requêtes `/api/*` → vers le backend Node.js (port 3000)
- **`location /socket.io`** : WebSocket pour Socket.IO (temps réel)

