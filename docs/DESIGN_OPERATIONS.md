# 🎨 Nouveau Design - Page des Opérations

## 🎯 Objectif

Améliorer la lisibilité de la page des opérations pour permettre de voir **d'un coup d'œil** :
1. L'agent qui a soumis la collecte
2. La progression dans les étapes du processus
3. Les informations clés de l'opération

## ✨ Nouveau Design

### Vue d'ensemble

```
┌────────────────────────────────────────────────────────────┐
│ #A3F2B8C1  [Payé] [2024-2025]                              │
│                                                             │
│ 👤 Kouassi Jean Michel                    Agent collecteur │
│ 📍 Village Centre                         👤 Bamba Fatou   │
│                                              AGT-001        │
│                                                             │
│ Progression : 7/7 étapes                            100%   │
│ ████████████████████████████████████████████████████       │
│                                                             │
│ ✅      ✅      ✅      ✅      ✅      ✅      ✅          │
│ Récolte Écabos. Fermen. Séchage Trans. Livr. Paiem.       │
│                                                             │
│ 1,250 Kg • 625,000 FCFA          Créé le 12/11/2024       │
└────────────────────────────────────────────────────────────┘
```

## 📋 Éléments de la Card

### 1. En-tête
- **Numéro d'opération** : 8 derniers caractères de l'ID en majuscules
- **Badge de statut** : Couleur selon le statut
  - 🟢 Vert : Payé
  - 🔵 Bleu : Validé
  - 🟠 Orange : Brouillon
  - 🔴 Rouge : Annulé
- **Badge campagne** : Année de la campagne (ex: 2024-2025)

### 2. Informations principales
- **Producteur** : Nom complet avec icône 👤
- **Village** : Nom du village avec icône 📍
- **Agent** : Encadré à droite avec :
  - Avatar circulaire
  - Nom et prénom
  - Code agent

### 3. Barre de progression
- **Texte** : "X/7 étapes" avec pourcentage
- **Barre visuelle** : Progress bar colorée
- **Indicateurs d'étapes** :
  - ✅ Vert : Étape complétée
  - ⭕ Bleu : Étape en cours
  - ⚪ Gris : Étape non commencée

### 4. Pied de card
- **Poids** : Manutention pesée en Kg
- **Montant** : Montant dû en FCFA
- **Date** : Date de création

## 🔄 Les 7 Étapes du Processus

### 1. Récolte
**Champs vérifiés :**
- `date_recolte_1`

**Critère de complétion :** Date de récolte renseignée

### 2. Écabossage
**Champs vérifiés :**
- `date_ecabossage`

**Critère de complétion :** Date d'écabossage renseignée

### 3. Fermentation
**Champs vérifiés :**
- `fermentation_debut`
- `fermentation_fin`

**Critère de complétion :** Dates de début ET fin renseignées

### 4. Séchage
**Champs vérifiés :**
- `sechage_debut`
- `sechage_fin`

**Critère de complétion :** Dates de début ET fin renseignées

### 5. Transport
**Champs vérifiés :**
- `date_transport`

**Critère de complétion :** Date de transport renseignée

### 6. Livraison
**Champs vérifiés :**
- `date_livraison`
- `manutention_pesee`

**Critère de complétion :** Date de livraison ET pesée renseignées

### 7. Paiement
**Champs vérifiés :**
- `date_paiement`
- `montant_du`

**Critère de complétion :** Date de paiement ET montant renseignés

## 🎨 Codes Couleur

### Statuts
```typescript
Payé      → bg-green-600   (Vert)
Validé    → bg-blue-600    (Bleu)
Brouillon → bg-orange-500  (Orange)
Annulé    → bg-red-600     (Rouge)
```

### Étapes
```typescript
Complétée → text-green-600  (Vert) + CheckCircle2
En cours  → text-primary    (Bleu) + Circle rempli
À venir   → text-gray-400   (Gris) + Circle vide
```

## 🔍 Fonctionnalités

### Recherche
- Par numéro d'opération
- Par nom de producteur
- Par nom d'agent
- Recherche insensible à la casse

### Filtres (à venir)
- Par statut
- Par agent
- Par période
- Par village

### Actions
- Clic sur une card → Détails de l'opération
- Bouton "Nouvelle Opération" → Formulaire

## 💻 Code

### Calcul de la progression

```typescript
const calculerProgression = (operation: any) => {
  let etapesCompletes = 0;
  
  ETAPES.forEach(etape => {
    const estComplete = etape.champs.every(champ => {
      const valeur = operation[champ];
      return valeur !== null && valeur !== undefined && valeur !== "";
    });
    if (estComplete) etapesCompletes++;
  });

  return {
    etapesCompletes,
    totalEtapes: ETAPES.length,
    pourcentage: Math.round((etapesCompletes / ETAPES.length) * 100),
    etapeActuelle: etapesCompletes < ETAPES.length 
      ? ETAPES[etapesCompletes].nom 
      : "Terminé"
  };
};
```

### Définition des étapes

```typescript
const ETAPES = [
  { id: 1, nom: "Récolte", champs: ["date_recolte_1"] },
  { id: 2, nom: "Écabossage", champs: ["date_ecabossage"] },
  { id: 3, nom: "Fermentation", champs: ["fermentation_debut", "fermentation_fin"] },
  { id: 4, nom: "Séchage", champs: ["sechage_debut", "sechage_fin"] },
  { id: 5, nom: "Transport", champs: ["date_transport"] },
  { id: 6, nom: "Livraison", champs: ["date_livraison", "manutention_pesee"] },
  { id: 7, nom: "Paiement", champs: ["date_paiement", "montant_du"] },
];
```

## 📊 Exemples

### Opération en cours (3/7 étapes)

```
┌────────────────────────────────────────────────────────────┐
│ #B4C3D2E1  [Validé] [2024-2025]                            │
│                                                             │
│ 👤 Koné Marie                         Agent collecteur     │
│ 📍 Village Nord                       👤 Kouassi Jean      │
│                                          AGT-002            │
│                                                             │
│ Progression : 3/7 étapes                             43%   │
│ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
│                                                             │
│ ✅      ✅      ✅      ⭕      ⚪      ⚪      ⚪          │
│ Récolte Écabos. Fermen. Séchage Trans. Livr. Paiem.       │
│                                                             │
│ -                                    Créé le 15/11/2024    │
└────────────────────────────────────────────────────────────┘
```

### Opération complète (7/7 étapes)

```
┌────────────────────────────────────────────────────────────┐
│ #A1B2C3D4  [Payé] [2024-2025]                              │
│                                                             │
│ 👤 Bamba Fatou                        Agent collecteur     │
│ 📍 Village Sud                        👤 Bamba Fatou       │
│                                          AGT-001            │
│                                                             │
│ Progression : 7/7 étapes                            100%   │
│ ████████████████████████████████████████████████████       │
│                                                             │
│ ✅      ✅      ✅      ✅      ✅      ✅      ✅          │
│ Récolte Écabos. Fermen. Séchage Trans. Livr. Paiem.       │
│                                                             │
│ 850 Kg • 425,000 FCFA                Créé le 10/11/2024   │
└────────────────────────────────────────────────────────────┘
```

### Opération sans agent

```
┌────────────────────────────────────────────────────────────┐
│ #E5F6G7H8  [Brouillon] [2024-2025]                         │
│                                                             │
│ 👤 N'Guessan Pierre                   Agent collecteur     │
│ 📍 Village Est                        Non assigné          │
│                                                             │
│ Progression : 1/7 étapes                             14%   │
│ ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
│                                                             │
│ ✅      ⚪      ⚪      ⚪      ⚪      ⚪      ⚪          │
│ Récolte Écabos. Fermen. Séchage Trans. Livr. Paiem.       │
│                                                             │
│ -                                    Créé le 20/11/2024    │
└────────────────────────────────────────────────────────────┘
```

## 🎯 Avantages

### Pour les utilisateurs
- ✅ **Visibilité immédiate** de l'agent responsable
- ✅ **Progression claire** avec barre visuelle
- ✅ **Statut évident** avec codes couleur
- ✅ **Informations essentielles** en un coup d'œil

### Pour la gestion
- ✅ **Suivi facile** des opérations en cours
- ✅ **Identification rapide** des blocages
- ✅ **Traçabilité** de l'agent collecteur
- ✅ **Vue d'ensemble** de l'avancement

## 🔄 Améliorations futures

### Court terme
- [ ] Filtres avancés (statut, agent, période)
- [ ] Tri par colonne
- [ ] Export Excel/PDF

### Moyen terme
- [ ] Vue en tableau (alternative)
- [ ] Graphiques de progression
- [ ] Notifications d'étapes bloquées

### Long terme
- [ ] Timeline détaillée par opération
- [ ] Comparaison entre opérations
- [ ] Prédiction de durée

---

**Version :** 2.3.0  
**Date :** 24 Novembre 2024  
**Statut :** ✅ Implémenté
