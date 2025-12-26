# 🗄️ Installation MySQL et Configuration Base de Données

## 1. Installation de MySQL

```bash
# Mettre à jour les paquets
sudo apt update

# Installer MySQL Server
sudo apt install mysql-server -y

# Vérifier l'installation
mysql --version
```

## 2. Sécurisation de MySQL

```bash
# Lancer le script de sécurisation
sudo mysql_secure_installation
```

**Réponses recommandées :**
- **Valider le mot de passe ?** : `Y` (si demandé)
- **Niveau de validation du mot de passe** : `2` (fort)
- **Nouveau mot de passe root** : Entrez un mot de passe sécurisé
- **Supprimer les utilisateurs anonymes ?** : `Y`
- **Désactiver la connexion root à distance ?** : `Y`
- **Supprimer la base de test ?** : `Y`
- **Recharger les tables de privilèges ?** : `Y`

## 3. Démarrer et Activer MySQL

```bash
# Démarrer MySQL
sudo systemctl start mysql

# Activer MySQL au démarrage
sudo systemctl enable mysql

# Vérifier le statut
sudo systemctl status mysql
```

## 4. Se Connecter à MySQL

```bash
# Se connecter en tant que root
sudo mysql -u root -p
# Entrez le mot de passe que vous avez défini
```

## 5. Créer la Base de Données et l'Utilisateur

Une fois connecté à MySQL, exécutez ces commandes :

```sql
-- Créer la base de données
CREATE DATABASE asco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur dédié pour l'application
CREATE USER 'cacaotrack_user'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_SECURISE_ICI';

-- Donner tous les privilèges sur la base de données
GRANT ALL PRIVILEGES ON asco.* TO 'cacaotrack_user'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;

-- Vérifier que la base de données existe
SHOW DATABASES;

-- Vérifier les utilisateurs
SELECT user, host FROM mysql.user;

-- Quitter MySQL
EXIT;
```

## 6. Tester la Connexion avec le Nouvel Utilisateur

```bash
# Tester la connexion avec le nouvel utilisateur
mysql -u cacaotrack_user -p asco
# Entrez le mot de passe que vous avez défini

# Dans MySQL, tester
SHOW TABLES;
EXIT;
```

## 7. Configuration pour le Projet

### Créer le fichier .env du backend

```bash
cd /var/www/cacaotrack-agent/server
nano .env
```

Contenu du fichier `.env` :
```env
DATABASE_URL="mysql://cacaotrack_user:VOTRE_MOT_DE_PASSE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="GENERER_UN_SECRET_ICI"
```

**Générer un secret JWT sécurisé :**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiez le résultat et collez-le dans `JWT_SECRET` du fichier `.env`.

## 8. Initialiser la Base de Données avec Prisma

```bash
cd /var/www/cacaotrack-agent/server

# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base de données (créer les tables)
npx prisma db push

# Vérifier que les tables ont été créées
mysql -u cacaotrack_user -p asco -e "SHOW TABLES;"
```

## 9. Vérification Complète

```bash
# Se connecter à MySQL
mysql -u cacaotrack_user -p asco
```

Dans MySQL :
```sql
-- Voir toutes les tables
SHOW TABLES;

-- Voir la structure d'une table
DESCRIBE Organisation;

-- Compter les enregistrements (devrait être 0 pour une nouvelle base)
SELECT COUNT(*) FROM Organisation;

-- Quitter
EXIT;
```

## 10. Commandes Utiles MySQL

### Sauvegarder la base de données
```bash
mysqldump -u cacaotrack_user -p asco > backup_asco_$(date +%Y%m%d).sql
```

### Restaurer la base de données
```bash
mysql -u cacaotrack_user -p asco < backup_asco_20241226.sql
```

### Voir la taille de la base de données
```sql
SELECT 
    table_schema AS 'Base de données',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Taille (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'asco'
GROUP BY table_schema;
```

## ⚠️ Dépannage

### Problème : "Access denied for user"
```bash
# Vérifier que l'utilisateur existe
sudo mysql -u root -p
SELECT user, host FROM mysql.user WHERE user='cacaotrack_user';

# Si l'utilisateur n'existe pas, le recréer
CREATE USER 'cacaotrack_user'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE';
GRANT ALL PRIVILEGES ON asco.* TO 'cacaotrack_user'@'localhost';
FLUSH PRIVILEGES;
```

### Problème : MySQL ne démarre pas
```bash
# Vérifier les logs
sudo tail -f /var/log/mysql/error.log

# Redémarrer MySQL
sudo systemctl restart mysql

# Vérifier le statut
sudo systemctl status mysql
```

### Problème : Port 3306 déjà utilisé
```bash
# Vérifier quel processus utilise le port
sudo netstat -tlnp | grep 3306

# Ou
sudo lsof -i :3306
```

## 📋 Checklist

- [ ] MySQL installé
- [ ] MySQL sécurisé (mysql_secure_installation)
- [ ] MySQL démarré et activé
- [ ] Base de données `asco` créée
- [ ] Utilisateur `cacaotrack_user` créé
- [ ] Privilèges accordés
- [ ] Fichier `.env` créé avec DATABASE_URL
- [ ] Prisma client généré
- [ ] Schéma poussé vers la base de données
- [ ] Tables créées et vérifiées

## 🎯 Prochaines Étapes

Une fois MySQL installé et configuré :

1. Configurer le backend (voir COMMANDES_SERVEUR_DIRECT.md)
2. Démarrer le backend avec PM2
3. Build le frontend
4. Configurer Nginx

