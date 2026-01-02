# 🔧 Commandes MySQL Finales

## ✅ L'Utilisateur Existe Déjà

Vous êtes connecté à MySQL. Exécutez ces commandes :

### 1. Vérifier/Créer la Base de Données

```sql
-- Vérifier si la base existe
SHOW DATABASES LIKE 'asco';

-- Si elle n'existe pas, la créer
CREATE DATABASE IF NOT EXISTS asco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Réinitialiser le Mot de Passe de l'Utilisateur

```sql
-- Changer le mot de passe (remplacez NOUVEAU_MOT_DE_PASSE par votre mot de passe)
ALTER USER 'cacaotrack_user'@'localhost' IDENTIFIED BY 'NOUVEAU_MOT_DE_PASSE';

-- Vérifier les permissions
GRANT ALL PRIVILEGES ON asco.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;

-- Quitter MySQL
EXIT;
```

### 3. Créer le Fichier .env

Après avoir quitté MySQL, exécutez :

```bash
cd /var/www/cacaotrack-agent/server

# Créer le .env avec le même mot de passe que vous avez mis dans MySQL
cat > .env << EOF
DATABASE_URL="mysql://cacaotrack_user:NOUVEAU_MOT_DE_PASSE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="jwt-secret-$(date +%s)-$(openssl rand -hex 16)"
EOF
```

### 4. Appliquer le Schéma Prisma

```bash
npx prisma db push
```

### 5. Redémarrer le Backend

```bash
pm2 restart cacaotrack-api
pm2 logs cacaotrack-api --lines 20
```

### 6. Tester

```bash
curl http://localhost:3000/api/health
```

