# Module Organisation - Documentation

## Vue d'ensemble

Le module Organisation gère toutes les entités liées aux organisations (coopératives et regroupements) de producteurs de cacao, ainsi que leurs membres, sections, villages, et les activités de production.

## Structure de la Base de Données

### Tables Principales

#### 1. **organisations**
Stocke les informations des coopératives et regroupements de producteurs.

**Champs:**
- `id` (UUID) - Identifiant unique
- `code` (string) - Code unique (ex: ORG-001)
- `nom` (string) - Nom de l'organisation
- `type` (enum) - Type: 'Coopérative' | 'Regroupement'
- `region` (string) - Région géographique
- `departement` (string) - Département
- `sous_prefecture` (string) - Sous-préfecture
- `localite` (string) - Localité
- `siege_social` (string, optionnel) - Adresse du siège social
- `latitude` (number, optionnel) - Coordonnée GPS
- `longitude` (number, optionnel) - Coordonnée GPS
- `president_nom` (string) - Nom du président
- `president_contact` (string[]) - Numéros de téléphone du président
- `secretaire_nom` (string, optionnel) - Nom du secrétaire général
- `secretaire_contact` (string[], optionnel) - Contacts du secrétaire
- `photo` (string, optionnel) - Photo de l'organisation
- `potentiel_production` (number, optionnel) - Potentiel en tonnes
- `date_creation` (Date) - Date de création de l'enregistrement
- `date_modification` (Date) - Date de dernière modification
- `statut` (enum) - 'actif' | 'inactif' | 'suspendu'
- `sync_status` (enum, optionnel) - 'synced' | 'pending' | 'error'

#### 2. **membres_organisations**
Gère les membres des organisations avec leurs rôles.

**Champs:**
- `id` (UUID) - Identifiant unique
- `id_membre` (string) - Référence au producteur
- `id_organisation` (string) - Référence à l'organisation
- `role` (enum) - 'président' | 'secrétaire' | 'trésorier' | 'membre' | 'autre'
- `date_adhesion` (Date) - Date d'adhésion
- `date_fin` (Date, optionnel) - Date de fin d'adhésion
- `statut` (enum) - 'actif' | 'inactif' | 'suspendu'
- `notes` (string, optionnel) - Notes supplémentaires
- `date_creation` (Date) - Date de création
- `date_modification` (Date) - Date de modification

#### 3. **sections**
Sections d'une organisation (niveau intermédiaire de gestion).

**Champs:**
- `id` (UUID) - Identifiant unique
- `code` (string) - Code unique (ex: SEC-012)
- `nom` (string) - Nom de la section
- `id_organisation` (string) - Référence à l'organisation parente
- `localite` (string) - Localité de la section
- `latitude`, `longitude` (number, optionnel) - Coordonnées GPS
- `president_nom` (string) - Nom du président de section
- `president_contact` (string[]) - Contacts
- `tonnage_precedent` (number, optionnel) - Production année précédente
- `tonnage_en_cours` (number, optionnel) - Production en cours
- `photo` (string, optionnel) - Photo
- `date_creation`, `date_modification` (Date)
- `statut` (enum) - 'actif' | 'inactif'

#### 4. **villages**
Villages ou campements rattachés à une section.

**Champs:**
- `id` (UUID) - Identifiant unique
- `code` (string) - Code unique (ex: VIL-045)
- `nom` (string) - Nom du village/campement
- `type` (enum) - 'Village' | 'Campement'
- `id_organisation` (string) - Référence organisation
- `id_section` (string) - Référence section
- `localite` (string) - Localité
- `latitude`, `longitude` (number, optionnel) - GPS
- `chef_nom` (string) - Nom du chef
- `chef_contact` (string[]) - Contacts du chef
- `nombre_habitants` (number) - Nombre d'habitants
- `nombre_hommes`, `nombre_femmes` (number) - Répartition par sexe
- `enfants_scolarises` (number) - Nombre d'enfants scolarisés
- `has_ecole`, `has_dispensaire`, `has_eau`, `has_electricite` (boolean) - Infrastructures
- `photo` (string, optionnel)
- `date_creation`, `date_modification` (Date)
- `statut` (enum) - 'actif' | 'inactif'

#### 5. **parcelles**
Parcelles de cacao gérées par les producteurs.

**Champs:**
- `id` (UUID)
- `code` (string) - Code de la parcelle
- `id_producteur` (string) - Référence producteur
- `id_organisation` (string) - Référence organisation
- `nom` (string, optionnel) - Nom de la parcelle
- `superficie` (number) - Superficie en hectares
- `latitude`, `longitude` (number, optionnel) - GPS
- `annee_creation` (number, optionnel) - Année de création
- `type_cacao` (enum) - 'Tout-venant' | 'Hybride' | 'Mercedes'
- `nombre_plants` (number) - Nombre de plants
- `age_moyen_plants` (number, optionnel) - Âge moyen
- `certification` (string, optionnel) - Type de certification
- `photo` (string, optionnel)
- `date_creation`, `date_modification` (Date)
- `statut` (enum) - 'active' | 'inactive' | 'en_jachère'

#### 6. **activites**
Activités réalisées sur les parcelles.

**Champs:**
- `id` (UUID)
- `id_parcelle` (string)
- `id_producteur` (string)
- `type_activite` (enum) - 'récolte' | 'traitement' | 'entretien' | 'plantation' | 'autre'
- `description` (string)
- `date_activite` (Date)
- `cout` (number, optionnel)
- `notes` (string, optionnel)
- `photo` (string, optionnel)
- `date_creation`, `date_modification` (Date)

#### 7. **recoltes**
Enregistrement des récoltes de cacao.

**Champs:**
- `id` (UUID)
- `code` (string) - Code de récolte
- `id_parcelle` (string)
- `id_producteur` (string)
- `id_organisation` (string)
- `date_recolte` (Date)
- `quantite` (number) - En kilogrammes
- `qualite` (string, optionnel)
- `prix_unitaire`, `prix_total` (number, optionnel)
- `statut` (enum) - 'collectée' | 'en_stock' | 'vendue'
- `notes` (string, optionnel)
- `date_creation`, `date_modification` (Date)

#### 8. **evaluations_qualite**
Évaluations de la qualité du cacao récolté.

**Champs:**
- `id` (UUID)
- `id_recolte` (string)
- `id_organisation` (string)
- `date_evaluation` (Date)
- `taux_humidite` (number, optionnel) - %
- `taux_fermentation` (number, optionnel) - %
- `taux_moisissure` (number, optionnel) - %
- `taux_graines_plates` (number, optionnel) - %
- `note_globale` (number, optionnel) - Sur 100
- `classification` (enum) - 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Hors grade'
- `evaluateur` (string) - Nom de l'évaluateur
- `notes` (string, optionnel)
- `date_creation`, `date_modification` (Date)

#### 9. **stocks**
Gestion des stocks de cacao.

**Champs:**
- `id` (UUID)
- `id_organisation` (string)
- `code_lot` (string)
- `quantite` (number) - En kg
- `date_entree` (Date)
- `date_sortie` (Date, optionnel)
- `type_stockage` (enum) - 'magasin' | 'entrepôt' | 'autre'
- `localisation` (string)
- `statut` (enum) - 'disponible' | 'réservé' | 'vendu'
- `notes` (string, optionnel)
- `date_creation`, `date_modification` (Date)

#### 10. **ventes**
Enregistrement des ventes de cacao.

**Champs:**
- `id` (UUID)
- `code` (string) - Code de vente
- `id_organisation` (string)
- `id_acheteur` (string, optionnel)
- `nom_acheteur` (string)
- `date_vente` (Date)
- `quantite` (number) - En kg
- `prix_unitaire` (number)
- `prix_total` (number)
- `mode_paiement` (enum) - 'espèces' | 'virement' | 'mobile_money' | 'autre'
- `statut` (enum) - 'en_cours' | 'payée' | 'annulée'
- `notes` (string, optionnel)
- `date_creation`, `date_modification` (Date)

#### 11. **transactions**
Transactions financières de l'organisation.

**Champs:**
- `id` (UUID)
- `code` (string) - Code de transaction
- `id_organisation` (string)
- `id_membre` (string, optionnel)
- `type` (enum) - 'entrée' | 'sortie'
- `categorie` (enum) - 'vente' | 'achat' | 'salaire' | 'investissement' | 'autre'
- `montant` (number)
- `devise` (string) - Ex: 'XOF'
- `date_transaction` (Date)
- `mode_paiement` (string)
- `description` (string)
- `reference` (string, optionnel)
- `statut` (enum) - 'en_attente' | 'validée' | 'annulée'
- `date_creation`, `date_modification` (Date)

#### 12. **alertes**
Système d'alertes et notifications.

**Champs:**
- `id` (UUID)
- `id_organisation` (string)
- `id_destinataire` (string, optionnel)
- `type` (enum) - 'info' | 'warning' | 'error' | 'success'
- `titre` (string)
- `message` (string)
- `priorite` (enum) - 'basse' | 'moyenne' | 'haute' | 'critique'
- `date_creation` (Date)
- `date_lecture` (Date, optionnel)
- `statut` (enum) - 'non_lue' | 'lue' | 'archivée'

#### 13. **rapports**
Rapports générés par le système.

**Champs:**
- `id` (UUID)
- `id_organisation` (string)
- `type` (enum) - 'production' | 'ventes' | 'financier' | 'qualité' | 'autre'
- `titre` (string)
- `periode_debut`, `periode_fin` (Date)
- `contenu` (string, optionnel) - JSON ou texte
- `fichier_url` (string, optionnel) - URL du PDF
- `genere_par` (string) - ID utilisateur
- `date_generation` (Date)
- `statut` (enum) - 'en_cours' | 'terminé' | 'erreur'

## Architecture du Code

### Structure des Fichiers

```
src/
├── types/
│   └── organisation.ts          # Définitions TypeScript
├── services/
│   └── organisationService.ts   # Services CRUD et logique métier
├── pages/
│   ├── Organisations.tsx        # Liste des organisations
│   ├── OrganisationForm.tsx     # Formulaire création/modification
│   └── OrganisationMembres.tsx  # Gestion des membres
└── components/
    └── forms/                   # Composants de formulaire réutilisables
```

### Services Disponibles

Tous les services sont disponibles dans `src/services/organisationService.ts`:

- `organisationService` - CRUD organisations
- `membreOrganisationService` - Gestion des membres
- `sectionService` - Gestion des sections
- `villageService` - Gestion des villages
- `parcelleService` - Gestion des parcelles
- `recolteService` - Gestion des récoltes
- `venteService` - Gestion des ventes

Chaque service expose les méthodes:
- `getAll()` - Récupérer tous les enregistrements
- `getById(id)` - Récupérer par ID
- `create(data)` - Créer un enregistrement
- `update(id, data)` - Mettre à jour
- `delete(id)` - Supprimer

### Stockage Local

Les données sont stockées dans le localStorage avec les clés:
- `cacaotrack_organisations`
- `cacaotrack_membres_organisations`
- `cacaotrack_sections`
- `cacaotrack_villages`
- `cacaotrack_parcelles`
- `cacaotrack_recoltes`
- `cacaotrack_ventes`
- etc.

## Utilisation

### Créer une Organisation

```typescript
import { organisationService } from '@/services/organisationService';

const newOrg = organisationService.create({
  code: 'ORG-001',
  nom: 'SCOOP-CA Divo',
  type: 'Coopérative',
  region: 'Lôh-Djiboua',
  // ... autres champs
  statut: 'actif',
});
```

### Ajouter un Membre

```typescript
import { membreOrganisationService } from '@/services/organisationService';

const membre = membreOrganisationService.create({
  id_membre: 'PROD-0001',
  id_organisation: 'org-uuid',
  role: 'membre',
  date_adhesion: new Date(),
  statut: 'actif',
});
```

### Rechercher des Organisations

```typescript
const results = organisationService.search('Divo');
```

## Routes

- `/organisations` - Liste des organisations
- `/organisations/nouveau` - Créer une organisation
- `/organisations/:orgId/membres` - Gérer les membres d'une organisation

## Synchronisation

Le champ `sync_status` permet de suivre l'état de synchronisation avec le serveur:
- `synced` - Synchronisé
- `pending` - En attente de sync
- `error` - Erreur de synchronisation

## Prochaines Étapes

1. ✅ Créer les types TypeScript
2. ✅ Implémenter les services CRUD
3. ✅ Créer les composants de formulaire
4. ✅ Ajouter la gestion des membres
5. ⏳ Implémenter la synchronisation avec le backend
6. ⏳ Ajouter les validations avancées
7. ⏳ Créer les tableaux de bord et statistiques
8. ⏳ Implémenter l'export de rapports

## Notes Techniques

- Les dates sont stockées comme objets Date en mémoire
- Les UUID sont générés côté client
- Le localStorage est utilisé pour le mode hors ligne
- Les codes sont générés automatiquement (ORG-XXX, SEC-XXX, etc.)
