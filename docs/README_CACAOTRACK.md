# 🍫 CacaoTrack - Système de Gestion de la Filière Cacao

## 📋 Description

CacaoTrack est une application web complète pour la gestion de la filière cacao en Côte d'Ivoire. Elle permet de suivre l'ensemble de la chaîne de valeur, de la plantation à la commercialisation.

## ✨ Fonctionnalités principales

### 🏢 Gestion des Organisations
- Coopératives, GIE, Associations
- Sections et villages
- Membres et producteurs

### 👨‍🌾 Gestion des Producteurs
- Informations personnelles et familiales
- Parcelles et plantations
- Historique des opérations

### 🗺️ Gestion des Parcelles
- Géolocalisation GPS
- Superficie et âge des plantations
- Itinéraire technique
- Maladies et traitements

### 📦 Gestion des Opérations
- Récolte et écabossage
- Fermentation et séchage
- Livraison et pesée
- Paiement

### 👤 Module Agent (Nouveau ✨)
- **33 régions de Côte d'Ivoire**
- Affectation multi-régions
- Dashboard de suivi
- Statistiques en temps réel
- Graphiques d'évolution

### 📊 Tableaux de bord
- Statistiques globales
- Suivi par région
- Performance des agents
- Carte interactive

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm
- MySQL 8+
- Git

### Backend (Serveur)

```bash
# 1. Aller dans le dossier serveur
cd server

# 2. Installer les dépendances
npm install

# 3. Configurer la base de données
# Créer une base MySQL nommée "asco"
# Modifier le fichier .env si nécessaire

# 4. Générer le client Prisma
npm run db:generate

# 5. Créer les tables
npm run db:push

# 6. Charger les données initiales (33 régions, exemples)
npm run db:seed

# 7. Démarrer le serveur
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Frontend

```bash
# 1. À la racine du projet
npm install

# 2. Démarrer le serveur de développement
npm run dev
```

L'application démarre sur `http://localhost:5173`

## 📚 Documentation

### Module Agent
- [📖 Guide complet](./docs/MODULE_AGENT.md)
- [🗺️ Liste des 33 régions](./docs/REGIONS_COTE_IVOIRE.md)
- [👁️ Aperçu visuel](./docs/APERCU_MODULE_AGENT.md)
- [🔄 Avant/Après](./AVANT_APRES.md)
- [📋 Index documentation](./INDEX_DOCUMENTATION.md)

### Autres modules
- [📄 Composants de capture](./docs/COMPOSANTS_CAPTURE.md)
- [🗺️ Intégration Mapbox](./docs/INTEGRATION_MAPBOX.md)
- [📁 Organisation des modules](./docs/MODULE_ORGANISATION.md)

## 🧪 Tests

### Tester l'API
Ouvrir `test-api.html` dans un navigateur pour tester les endpoints de l'API.

### Tester l'interface
1. Créer un agent : `/agents/nouveau`
2. Voir les agents : `/agents`
3. Dashboard : `/agents/dashboard`

## 🛠️ Technologies

### Backend
- **Express.js** - Framework web
- **Prisma** - ORM
- **MySQL** - Base de données
- **TypeScript** - Langage

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Langage
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation
- **Recharts** - Graphiques
- **Mapbox GL** - Cartographie

## 📁 Structure du projet

```
cacaotrack-agent/
├── server/                    # Backend
│   ├── src/
│   │   ├── index.ts          # API REST
│   │   └── seed.ts           # Données initiales
│   └── prisma/
│       └── schema.prisma     # Modèles de données
│
├── src/                       # Frontend
│   ├── components/           # Composants React
│   ├── pages/                # Pages de l'application
│   ├── services/             # Services API
│   ├── types/                # Types TypeScript
│   └── utils/                # Utilitaires
│
├── docs/                      # Documentation
│   ├── MODULE_AGENT.md
│   ├── REGIONS_COTE_IVOIRE.md
│   └── ...
│
└── test-api.html             # Page de test
```

## 🗺️ Les 33 régions de Côte d'Ivoire

Le système couvre l'ensemble du territoire ivoirien :

**Districts Autonomes (2) :**
- Abidjan
- Yamoussoukro

**Régions (31) :**
Agnéby-Tiassa, Bafing, Bagoué, Béré, Bounkani, Cavally, Folon, Gbêkê, Gbôklé, Gôh, Gontougo, Grands-Ponts, Guémon, Hambol, Haut-Sassandra, Iffou, Indénié-Djuablin, Kabadougou, La Mé, Lôh-Djiboua, Marahoué, Moronou, Nawa, N'Zi, Poro, San-Pédro, Sud-Comoé, Tchologo, Tonkpi, Worodougou, Moyen-Cavally

## 🔐 API Endpoints

### Agents
```
GET    /api/agents              # Liste des agents
GET    /api/agents/:id          # Détails d'un agent
POST   /api/agents              # Créer un agent
PUT    /api/agents/:id          # Modifier un agent
DELETE /api/agents/:id          # Supprimer un agent
GET    /api/agents/:id/stats    # Statistiques d'un agent
```

### Régions
```
GET    /api/regions             # Liste des 33 régions
GET    /api/regions/:id         # Détails d'une région
GET    /api/regions/:id/agents  # Agents d'une région
```

### Organisations, Producteurs, Parcelles, Opérations...
Voir la documentation complète dans `server/src/index.ts`

## 🎯 Workflow typique

1. **Configuration initiale**
   - Créer les organisations et sections
   - Créer les villages
   - Créer les agents et les affecter aux régions

2. **Enregistrement des producteurs**
   - Créer un producteur dans un village
   - Enregistrer ses parcelles avec géolocalisation
   - Capturer les photos et documents

3. **Suivi des opérations**
   - Enregistrer les récoltes
   - Suivre la fermentation et le séchage
   - Enregistrer les livraisons et pesées
   - Gérer les paiements

4. **Analyse et reporting**
   - Consulter les dashboards
   - Voir les statistiques par agent/région
   - Exporter les données

## 🚧 Fonctionnalités à venir

- [ ] Export Excel/PDF
- [ ] Application mobile pour agents
- [ ] Notifications push
- [ ] Géolocalisation en temps réel
- [ ] Rapports automatiques
- [ ] Intégration paiement mobile money
- [ ] Mode hors ligne

## 📞 Support

Pour toute question ou problème :
1. Consulter la [documentation](./INDEX_DOCUMENTATION.md)
2. Vérifier les [changements récents](./CHANGELOG_REGIONS.md)
3. Tester avec `test-api.html`

## 📄 Licence

Propriétaire - Tous droits réservés

## 👥 Contributeurs

- Équipe de développement CacaoTrack
- Partenaires de la filière cacao

---

**Version :** 2.0.0  
**Dernière mise à jour :** 24 Novembre 2024  
**Statut :** ✅ Production Ready

---

## 🎉 Nouveautés v2.0.0

- ✅ **33 régions de Côte d'Ivoire** complètes
- ✅ **Module Agent** entièrement fonctionnel
- ✅ **Dashboard de suivi** avec graphiques
- ✅ **Interface améliorée** pour la sélection des régions
- ✅ **Documentation complète** (8 fichiers)
- ✅ **Page de test** interactive

Voir [AVANT_APRES.md](./AVANT_APRES.md) pour plus de détails.
