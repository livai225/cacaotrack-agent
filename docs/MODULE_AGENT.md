# Module Agent - Guide d'utilisation

## Vue d'ensemble

Le module Agent permet de gérer les agents de collecte et leurs affectations aux différentes régions de Côte d'Ivoire.

## Fonctionnalités

### 1. Gestion des Agents

#### Liste des agents (`/agents`)
- Affichage de tous les agents avec leurs informations principales
- Recherche par nom, code, téléphone ou email
- Filtrage par statut (actif, inactif, suspendu)
- Actions : Modifier, Supprimer

#### Création/Modification d'agent (`/agents/nouveau` ou `/agents/:id`)

**Informations de base :**
- Code agent (unique, ex: AGT-001)
- Nom et prénom
- Téléphone (obligatoire)
- Email (optionnel)
- Statut : Actif, Inactif, Suspendu
- Photo

**Identité :**
- Date et lieu de naissance
- Nationalité (par défaut : Ivoirienne)
- Type de pièce d'identité (CNI, Passeport)
- Numéro de pièce

**Affectation aux régions :**
- Sélection multiple parmi les 33 régions de Côte d'Ivoire
- Au moins une région obligatoire
- Affichage en grille avec scroll pour faciliter la sélection

### 2. Dashboard Agent (`/agents/dashboard`)

Le dashboard permet de suivre les performances d'un agent :

**KPIs :**
- Total des opérations (toutes périodes)
- Opérations du mois en cours
- Poids total collecté (en tonnes)
- Poids du mois
- Nombre de régions affectées
- Date de la dernière opération

**Graphiques :**
- Évolution du nombre d'opérations (par jour/semaine/mois)
- Évolution du poids collecté (par jour/semaine/mois)

**Liste des opérations récentes :**
- 10 dernières opérations de l'agent
- Détails : producteur, date, poids, statut

### 3. Régions de Côte d'Ivoire

L'application inclut les 33 régions administratives :

**Districts Autonomes :**
- Abidjan
- Yamoussoukro

**Régions :**
- Agnéby-Tiassa, Bafing, Bagoué, Béré, Bounkani, Cavally, Folon, Gbêkê, Gbôklé, Gôh, Gontougo, Grands-Ponts, Guémon, Hambol, Haut-Sassandra, Iffou, Indénié-Djuablin, Kabadougou, La Mé, Lôh-Djiboua, Marahoué, Moronou, Nawa, N'Zi, Poro, San-Pédro, Sud-Comoé, Tchologo, Tonkpi, Worodougou, Moyen-Cavally

Voir [REGIONS_COTE_IVOIRE.md](./REGIONS_COTE_IVOIRE.md) pour la liste complète.

## API Endpoints

### Agents
- `GET /api/agents` - Liste tous les agents
- `GET /api/agents/:id` - Détails d'un agent
- `POST /api/agents` - Créer un agent
- `PUT /api/agents/:id` - Modifier un agent
- `DELETE /api/agents/:id` - Supprimer un agent
- `GET /api/agents/:id/stats` - Statistiques d'un agent

### Régions
- `GET /api/regions` - Liste toutes les régions
- `GET /api/regions/:id` - Détails d'une région
- `GET /api/regions/:id/agents` - Agents affectés à une région

### Affectations
- `POST /api/agents/:idAgent/regions` - Affecter un agent à une région
- `DELETE /api/agents/:idAgent/regions/:idRegion` - Retirer une affectation

## Structure des données

### Agent
```typescript
{
  id: string;
  code: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  date_naissance?: Date;
  lieu_naissance?: string;
  nationalite?: string;
  type_piece?: string;
  numero_piece?: string;
  photo?: string;
  regions?: AgentRegion[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Region
```typescript
{
  id: string;
  code: string;
  nom: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AgentRegion (Affectation)
```typescript
{
  id: string;
  id_agent: string;
  id_region: string;
  date_affectation: Date;
  date_fin?: Date;
  statut: 'actif' | 'inactif';
  createdAt: Date;
  updatedAt: Date;
}
```

## Workflow typique

1. **Créer un agent**
   - Aller sur `/agents/nouveau`
   - Remplir les informations obligatoires
   - Sélectionner au moins une région
   - Enregistrer

2. **Affecter des opérations**
   - Lors de la création d'une opération, sélectionner l'agent
   - L'agent doit être affecté à la région de l'opération

3. **Suivre les performances**
   - Aller sur `/agents/dashboard`
   - Sélectionner l'agent
   - Consulter les KPIs et graphiques

## Notes importantes

- Un agent doit avoir au moins une région affectée
- Un agent peut être affecté à plusieurs régions
- Les régions sont pré-chargées et ne peuvent pas être modifiées via l'interface
- Le statut "suspendu" empêche l'agent d'être sélectionné pour de nouvelles opérations
- Les statistiques sont calculées en temps réel

## Développement

### Fichiers principaux
- `src/types/agent.ts` - Types TypeScript
- `src/services/agentService.ts` - Service API
- `src/pages/Agents.tsx` - Liste des agents
- `src/pages/AgentForm.tsx` - Formulaire agent
- `src/pages/AgentDashboard.tsx` - Dashboard
- `server/src/index.ts` - Routes API (lignes 226-510)
- `server/prisma/schema.prisma` - Modèles de données

### Seed des données
```bash
cd server
npm run db:seed
```

Cela créera :
- Les 33 régions de Côte d'Ivoire
- 2 agents exemples
- Leurs affectations
