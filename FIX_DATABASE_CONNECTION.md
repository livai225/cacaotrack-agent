# 🔧 Correction de la Connexion à la Base de Données

## ❌ Problème

```
Error: P1000: Authentication failed against database server
```

Le fichier `.env` a été créé avec "PASSWORD" au lieu du vrai mot de passe MySQL.

## ✅ Solution

### Option 1 : Si vous Connaissez le Mot de Passe MySQL

```bash
cd /var/www/cacaotrack-agent/server

# Créer le fichier .env avec le VRAI mot de passe
nano .env
```

Dans nano, mettez ceci (remplacez `VOTRE_VRAI_MOT_DE_PASSE` par le mot de passe que vous avez utilisé lors de la création de l'utilisateur MySQL) :

```env
DATABASE_URL="mysql://cacaotrack_user:VOTRE_VRAI_MOT_DE_PASSE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="jwt-secret-$(date +%s)"
```

Sauvegarder : `Ctrl + O`, `Entrée`, `Ctrl + X`

### Option 2 : Si vous ne Connaissez pas le Mot de Passe

#### Étape 1 : Vérifier/Créer l'Utilisateur MySQL

```bash
# Se connecter à MySQL en tant que root
sudo mysql -u root -p

# Dans MySQL, vérifier si l'utilisateur existe
SELECT User, Host FROM mysql.user WHERE User = 'cacaotrack_user';

# Si l'utilisateur n'existe pas, le créer avec un nouveau mot de passe
CREATE USER 'cacaotrack_user'@'localhost' IDENTIFIED BY 'NOUVEAU_MOT_DE_PASSE_SECURISE';

# Donner les permissions
GRANT ALL PRIVILEGES ON asco.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Étape 2 : Créer le Fichier .env

```bash
cd /var/www/cacaotrack-agent/server

# Créer le .env avec le nouveau mot de passe
cat > .env << EOF
DATABASE_URL="mysql://cacaotrack_user:NOUVEAU_MOT_DE_PASSE_SECURISE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="jwt-secret-$(date +%s)-$(openssl rand -hex 16)"
EOF
```

### Option 3 : Réinitialiser le Mot de Passe de l'Utilisateur Existant

```bash
# Se connecter à MySQL
sudo mysql -u root -p

# Dans MySQL, changer le mot de passe
ALTER USER 'cacaotrack_user'@'localhost' IDENTIFIED BY 'NOUVEAU_MOT_DE_PASSE_SECURISE';
FLUSH PRIVILEGES;
EXIT;
```

Puis mettre à jour le `.env` avec le nouveau mot de passe.

## 🔍 Vérifier que la Base de Données Existe

```bash
sudo mysql -u root -p

# Dans MySQL
SHOW DATABASES;
# Vous devez voir "asco" dans la liste

USE asco;
SHOW TABLES;
# Si vide, il faut appliquer le schéma Prisma

EXIT;
```

## 🚀 Après Avoir Corrigé le .env

```bash
cd /var/www/cacaotrack-agent/server

# Appliquer le schéma Prisma
npx prisma db push

# Redémarrer PM2
pm2 restart cacaotrack-api

# Vérifier les logs
pm2 logs cacaotrack-api --lines 20

# Tester l'API
curl http://localhost:3000/api/health
```

## ✅ Résultat Attendu

```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
```

