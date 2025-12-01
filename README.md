# 🍫 CacaoTrack - Système de Gestion de la Filière Cacao

Application web complète pour la gestion de la filière cacao en Côte d'Ivoire, de la plantation à la commercialisation.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL 14+ avec PostGIS
- Git

### Configuration de la base de données

Le projet utilise **PostgreSQL + PostGIS**. Consultez [MIGRATION_POSTGRESQL.md](./MIGRATION_POSTGRESQL.md) pour les détails complets.

**Configuration rapide :**
```bash
# 1. Créer le fichier .env dans server/
cd server
cp .env.example .env

# 2. Éditer .env avec vos paramètres de connexion
# DATABASE_URL="postgresql://asco_user:AscoSecure2024!@82.208.22.230:5432/asco_db?schema=public"

# 3. Installer les dépendances
npm install

# 4. Configurer la base de données (Windows)
.\scripts\setup-db.ps1

# Ou (Linux/Mac)
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

### Backend
```bash
cd server
npm install
npm run db:generate  # Générer le client Prisma
npm run db:push      # Créer les tables
npm run db:seed      # (Optionnel) Données de test
npm run dev          # Lancer le serveur
```

### Frontend
```bash
npm install
npm run dev
```

## 📚 Documentation

Toute la documentation est disponible dans le dossier [`docs/`](./docs/) :

### 🎯 Guides principaux
- [📖 README CacaoTrack](./docs/README_CACAOTRACK.md) - Guide complet du projet
- [📑 Index Documentation](./docs/INDEX_DOCUMENTATION.md) - Navigation dans la documentation

### 🗺️ Module Agent
- [👤 Guide Module Agent](./docs/MODULE_AGENT.md) - Gestion des agents
- [🌍 Régions de Côte d'Ivoire](./docs/REGIONS_COTE_IVOIRE.md) - Liste des 33 régions
- [📊 Aperçu Module Agent](./docs/APERCU_MODULE_AGENT.md) - Interface visuelle

### 📡 Mode Hors Ligne
- [📱 Guide Mode Hors Ligne](./docs/GUIDE_MODE_HORS_LIGNE.md) - Guide utilisateur
- [🔧 Documentation Technique](./docs/MODE_HORS_LIGNE.md) - Guide développeur
- [📋 Résumé](./docs/RESUME_MODE_HORS_LIGNE.md) - Vue d'ensemble

### 🎨 Design
- [🎨 Design Opérations](./docs/DESIGN_OPERATIONS.md) - Page des opérations

### 🔧 Corrections & Améliorations
- [🐛 Fix Boucle Infinie](./docs/FIX_BOUCLE_INFINIE.md)
- [🐛 Fix Payload Too Large](./docs/FIX_PAYLOAD_TOO_LARGE.md)
- [🔍 Debug Régions](./docs/DEBUG_REGIONS.md)

### 📝 Historique
- [📋 Changelog Complet](./docs/CHANGELOG_COMPLET.md) - Toutes les versions
- [📋 Changelog Régions](./docs/CHANGELOG_REGIONS.md) - Module régions
- [✅ Travail Terminé](./docs/TRAVAIL_TERMINE.md) - Récapitulatif

## ✨ Fonctionnalités principales

### 🏢 Gestion des Organisations
- Coopératives, GIE, Associations
- Sections et villages
- Membres et producteurs

### 👨‍🌾 Gestion des Producteurs
- Informations personnelles
- Parcelles et plantations
- Historique des opérations

### 🗺️ Gestion des Parcelles
- Géolocalisation GPS
- Itinéraire technique
- Suivi des maladies

### 📦 Gestion des Opérations
- 7 étapes du processus
- Suivi de la progression
- Paiements

### 👤 Module Agent
- 33 régions de Côte d'Ivoire
- Affectation multi-régions
- Dashboard de suivi
- Recherche de régions

### 📡 Mode Hors Ligne
- Travail sans connexion
- Sauvegarde locale
- Synchronisation manuelle
- Gestion des erreurs

## 🛠️ Technologies

- **Backend:** Express.js + Prisma + PostgreSQL + PostGIS
- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui
- **Validation:** Zod + React Hook Form
- **Charts:** Recharts
- **Maps:** Mapbox GL
- **Géospatial:** PostGIS pour les données géographiques

## 📊 Versions

- **Version actuelle:** 2.4.0
- **Dernière mise à jour:** 1er Décembre 2025
- **Statut:** ✅ Production Ready
- **Base de données:** PostgreSQL + PostGIS

## 🎯 Modules disponibles

- ✅ Organisations
- ✅ Sections
- ✅ Villages
- ✅ Producteurs
- ✅ Parcelles
- ✅ Opérations
- ✅ Agents (33 régions)
- ✅ Mode Hors Ligne
- ✅ Synchronisation
- ✅ Cartographie

## 🌐 API Endpoints

### Routes de Santé
- `GET /api` - Informations sur l'API
- `GET /api/health` - Health check et statut de la DB
- `GET /api/postgis` - Vérification PostGIS

### Routes Métier
- `GET /api/organisations` - Liste des organisations
- `GET /api/sections` - Liste des sections
- `GET /api/villages` - Liste des villages
- `GET /api/producteurs` - Liste des producteurs
- `GET /api/parcelles` - Liste des parcelles
- `GET /api/operations` - Liste des opérations
- `GET /api/agents` - Liste des agents
- `GET /api/regions` - Liste des régions

Voir [DEPLOIEMENT_VM.md](./DEPLOIEMENT_VM.md) pour plus de détails.

## 📞 Support

Pour toute question, consulter la [documentation complète](./docs/INDEX_DOCUMENTATION.md).

## 📄 Licence

Propriétaire - Tous droits réservés

---

**🍫 CacaoTrack** - Gestion de la filière cacao en Côte d'Ivoire
