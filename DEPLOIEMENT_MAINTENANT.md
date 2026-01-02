# 🚀 Commandes à Exécuter MAINTENANT sur le Serveur

Copiez-collez ces commandes **une par une** dans votre terminal SSH :

## 1. Récupérer les modifications depuis GitHub
```bash
cd /var/www/cacaotrack-agent
git pull origin main
```

## 2. Construire le nouveau frontend
```bash
npm run build
```

## 3. Configurer les permissions
```bash
sudo chown -R asco:asco dist/
sudo chmod -R 755 dist/
```

## 4. Redémarrer Nginx
```bash
sudo systemctl reload nginx
```

## 5. Vérifier que tout fonctionne
```bash
curl http://localhost/api/health
pm2 status
```

---

## OU : Commande en Une Ligne (Plus Rapide)

```bash
cd /var/www/cacaotrack-agent && git pull origin main && npm run build && sudo chown -R asco:asco dist/ && sudo chmod -R 755 dist/ && sudo systemctl reload nginx && echo "✅ Déploiement terminé !"
```

