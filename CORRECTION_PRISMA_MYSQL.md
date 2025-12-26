# 🔧 Correction Prisma - MySQL vs PostgreSQL

## Problème Identifié

Le schéma Prisma est configuré pour **PostgreSQL** mais vous utilisez **MySQL**.

## Solution : Changer Prisma pour MySQL

### 1. Vérifier le Schéma Actuel

```bash
cd /var/www/cacaotrack-agent/server
cat prisma/schema.prisma | head -15
```

### 2. Modifier le Schéma pour MySQL

```bash
nano prisma/schema.prisma
```

**Changer la ligne :**
```prisma
provider = "postgresql"
```

**Par :**
```prisma
provider = "mysql"
```

### 3. Créer le Fichier .env

```bash
cd /var/www/cacaotrack-agent/server
nano .env
```

Contenu :
```env
DATABASE_URL="mysql://cacaotrack_user:VOTRE_MOT_DE_PASSE@localhost:3306/asco"
PORT=3000
NODE_ENV=production
JWT_SECRET="GENERER_UN_SECRET_ICI"
```

Générer le secret JWT :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Régénérer Prisma et Pousser le Schéma

```bash
# Régénérer le client Prisma
npx prisma generate

# Pousser le schéma vers MySQL
npx prisma db push

# Vérifier les tables
mysql -u cacaotrack_user -p asco -e "SHOW TABLES;"
```

## Commandes Complètes

```bash
cd /var/www/cacaotrack-agent/server

# 1. Modifier le schéma
nano prisma/schema.prisma
# Changer provider = "postgresql" en provider = "mysql"

# 2. Créer .env
nano .env
# DATABASE_URL="mysql://cacaotrack_user:VOTRE_MOT_DE_PASSE@localhost:3306/asco"
# PORT=3000
# NODE_ENV=production
# JWT_SECRET="..."

# 3. Générer le secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 4. Prisma
npx prisma generate
npx prisma db push

# 5. Vérifier
mysql -u cacaotrack_user -p asco -e "SHOW TABLES;"
```

