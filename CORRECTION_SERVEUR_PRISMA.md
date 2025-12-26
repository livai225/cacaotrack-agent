# 🔧 Correction Prisma sur le Serveur

## Problème

Le fichier `schema.prisma` sur le serveur a `provider = "postgresql"` au lieu de `provider = "mysql"`.

## Solution

### Commande à exécuter sur le serveur

```bash
cd /var/www/cacaotrack-agent/server

# Vérifier le contenu actuel
cat prisma/schema.prisma | head -12

# Modifier le fichier
nano prisma/schema.prisma
```

**Dans nano, trouver la ligne 9 :**
```prisma
provider = "postgresql"
```

**Remplacer par :**
```prisma
provider = "mysql"
```

**Sauvegarder :** `Ctrl+O`, `Enter`, `Ctrl+X`

### Ensuite, pousser le schéma

```bash
# Régénérer le client Prisma
npx prisma generate

# Pousser le schéma vers MySQL
npx prisma db push

# Vérifier les tables
mysql -u cacaotrack_user -p asco -e "SHOW TABLES;"
```

## Commande Rapide (sed)

Si vous préférez utiliser sed pour modifier directement :

```bash
cd /var/www/cacaotrack-agent/server

# Remplacer postgresql par mysql dans le schéma
sed -i 's/provider = "postgresql"/provider = "mysql"/' prisma/schema.prisma

# Vérifier
cat prisma/schema.prisma | head -12

# Pousser le schéma
npx prisma generate
npx prisma db push

# Vérifier les tables
mysql -u cacaotrack_user -p asco -e "SHOW TABLES;"
```

