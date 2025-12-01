# 📡 Mode Hors Ligne - Guide Complet

## 🎯 Objectif

Permettre aux agents de collecte de travailler en zone rurale sans connexion internet, avec sauvegarde locale et synchronisation ultérieure.

## ✨ Fonctionnalités

### 1. Détection automatique de la connexion
- ✅ Détection en temps réel (en ligne/hors ligne)
- ✅ Notifications automatiques lors des changements
- ✅ Indicateur visuel permanent

### 2. Sauvegarde locale
- ✅ Stockage dans LocalStorage du navigateur
- ✅ Sauvegarde automatique de toutes les opérations
- ✅ Pas de limite de taille (jusqu'à 10MB)
- ✅ Données persistantes même après fermeture du navigateur

### 3. Synchronisation
- ✅ Synchronisation manuelle quand la connexion revient
- ✅ Synchronisation par lot (toutes les opérations)
- ✅ Gestion des erreurs et retry
- ✅ Historique des synchronisations

### 4. Gestion des données
- ✅ Liste des opérations en attente
- ✅ Statut de chaque opération (en attente/synchronisée/erreur)
- ✅ Suppression individuelle ou en masse
- ✅ Export/Import pour backup

## 🚀 Comment utiliser

### Scénario 1 : Collecte en zone sans réseau

```
1. L'agent arrive dans un village sans réseau
2. L'indicateur passe en "Hors ligne" (badge rouge)
3. L'agent crée une opération normalement
4. Les données sont sauvegardées localement
5. Un compteur indique le nombre d'opérations en attente
6. L'agent continue sa collecte
```

### Scénario 2 : Retour en zone avec réseau

```
1. L'agent revient en zone couverte
2. L'indicateur passe en "En ligne" (badge vert)
3. Une notification "Connexion rétablie !" apparaît
4. L'agent clique sur "Synchroniser"
5. Toutes les opérations sont envoyées au serveur
6. Un message confirme le succès
7. Les données locales sont nettoyées
```

### Scénario 3 : Synchronisation partielle

```
1. L'agent synchronise 10 opérations
2. 8 réussissent, 2 échouent
3. Message : "8 opération(s) synchronisée(s), 2 échouée(s)"
4. Les opérations échouées restent en attente
5. L'agent peut les resynchroniser plus tard
6. Ou les supprimer manuellement
```

## 📱 Interface

### Indicateur hors ligne (coin bas-droit)

```
┌─────────────────────────────────────┐
│ [🔴 Hors ligne] [3]  [Synchroniser] │
└─────────────────────────────────────┘
```

**Clic sur le badge** → Ouvre le panneau détaillé

### Panneau détaillé

```
┌──────────────────────────────────────┐
│ Synchronisation                   ✕  │
├──────────────────────────────────────┤
│ Statut : [🔴 Hors ligne]             │
│ Dernière sync : 12/11/2024 14:30     │
│                                       │
│ [Synchroniser] [📥] [🗑️]             │
│                                       │
│ Opérations en attente (3)            │
│ ┌────────────────────────────────┐  │
│ │ ⏰ Opération - Création         │  │
│ │    12/11/2024 14:23            │  │
│ │                          [🗑️]  │  │
│ ├────────────────────────────────┤  │
│ │ ⏰ Producteur - Modification    │  │
│ │    12/11/2024 13:45            │  │
│ │                          [🗑️]  │  │
│ └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Page de synchronisation (`/sync`)

```
┌──────────────────────────────────────────────────┐
│ Synchronisation                                   │
│ Gestion des données hors ligne                   │
│                                                   │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │ 🟢   │ │ ⏰   │ │ ✅   │ │ ❌   │            │
│ │En    │ │En    │ │Sync  │ │Err   │            │
│ │ligne │ │attente│ │      │ │      │            │
│ │      │ │  3   │ │  12  │ │  1   │            │
│ └──────┘ └──────┘ └──────┘ └──────┘            │
│                                                   │
│ ┌────────────────────────────────────────────┐  │
│ │ Dernière synchronisation                   │  │
│ │ 12/11/2024 14:30                           │  │
│ │                      [Synchroniser]        │  │
│ └────────────────────────────────────────────┘  │
│                                                   │
│ ┌────────────────────────────────────────────┐  │
│ │ Opérations en attente (3)                  │  │
│ │                                             │  │
│ │ ⏰ Opération - Création                     │  │
│ │    12/11/2024 14:23                  [🗑️] │  │
│ │                                             │  │
│ │ ✅ Producteur - Modification                │  │
│ │    12/11/2024 13:45                  [🗑️] │  │
│ │                                             │  │
│ │ ❌ Parcelle - Création                      │  │
│ │    Erreur: Données invalides         [🗑️] │  │
│ └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## 🔧 Architecture technique

### Services

#### `offlineService.ts`
```typescript
// Sauvegarde locale
savePendingOperation(type, action, data)

// Récupération
getPendingOperations()
getUnsyncedOperations()
getPendingCount()

// Synchronisation
syncAll(apiService)
syncOperation(operation, apiService)

// Gestion
markAsSynced(id)
markAsError(id, error)
deleteOperation(id)
cleanSyncedOperations()

// Backup
exportPendingData()
importPendingData(jsonData)
```

### Composants

#### `OfflineIndicator.tsx`
- Indicateur permanent en bas à droite
- Badge avec statut (en ligne/hors ligne)
- Compteur d'opérations en attente
- Bouton de synchronisation rapide
- Panneau détaillé au clic

#### `Sync.tsx` (page)
- Vue complète des opérations
- KPIs (en attente, synchronisées, erreurs)
- Liste détaillée avec actions
- Export/Import de données

### Stockage

#### LocalStorage
```javascript
// Clés utilisées
cacaotrack_pending_operations  // Liste des opérations
cacaotrack_last_sync          // Date dernière sync

// Structure d'une opération
{
  id: "operation_create_1732467890_abc123",
  type: "operation",
  action: "create",
  data: { /* données de l'opération */ },
  timestamp: 1732467890000,
  synced: false,
  error: null
}
```

## 📊 Types d'opérations supportées

### 1. Opérations de collecte
- ✅ Création
- ✅ Modification
- ✅ Suppression

### 2. Producteurs
- ✅ Création
- ✅ Modification
- ✅ Suppression

### 3. Parcelles
- ✅ Création
- ✅ Modification
- ✅ Suppression

### 4. Agents
- ✅ Création
- ✅ Modification
- ✅ Suppression

## ⚠️ Limitations

### Stockage
- **Limite** : ~10 MB par domaine (LocalStorage)
- **Estimation** : ~1000 opérations moyennes
- **Solution** : Export régulier des données

### Synchronisation
- **Ordre** : Les opérations sont synchronisées dans l'ordre chronologique
- **Dépendances** : Pas de gestion automatique des dépendances
- **Conflits** : Pas de résolution automatique des conflits

### Données
- **Photos** : Stockées en Base64 (augmente la taille)
- **Géolocalisation** : Nécessite le GPS actif
- **Validation** : Validation côté client uniquement

## 🛠️ Bonnes pratiques

### Pour les agents

1. **Synchroniser régulièrement**
   - Dès que la connexion est disponible
   - Avant de commencer une nouvelle journée
   - Après chaque session de collecte

2. **Vérifier le statut**
   - Regarder l'indicateur avant de commencer
   - Vérifier le compteur d'opérations en attente
   - Consulter la page de synchronisation

3. **Exporter les données**
   - Faire un backup avant une longue mission
   - Exporter si plus de 50 opérations en attente
   - Garder une copie sur un autre appareil

4. **Gérer les erreurs**
   - Lire les messages d'erreur
   - Corriger les données si nécessaire
   - Supprimer les opérations invalides

### Pour les administrateurs

1. **Surveiller**
   - Vérifier régulièrement les synchronisations
   - Identifier les agents avec beaucoup d'opérations en attente
   - Analyser les erreurs fréquentes

2. **Former**
   - Expliquer le fonctionnement du mode hors ligne
   - Montrer comment synchroniser
   - Enseigner les bonnes pratiques

3. **Optimiser**
   - Améliorer la couverture réseau si possible
   - Prévoir des points de synchronisation
   - Organiser des sessions de synchronisation collective

## 🔒 Sécurité

### Données locales
- ✅ Stockées dans le navigateur de l'appareil
- ✅ Accessibles uniquement par l'application
- ✅ Effacées lors de la déconnexion (optionnel)
- ⚠️ Pas de chiffrement (LocalStorage)

### Recommandations
- 🔐 Utiliser un appareil sécurisé
- 🔐 Ne pas partager l'appareil
- 🔐 Synchroniser et nettoyer régulièrement
- 🔐 Exporter les données sensibles

## 📈 Statistiques

### Performance
```
Sauvegarde locale:     < 10ms
Chargement:            < 50ms
Synchronisation:       ~500ms par opération
Export:                < 100ms
```

### Capacité
```
Opérations moyennes:   ~1000
Opérations avec photos: ~100
Taille moyenne:        ~10 KB par opération
```

## 🐛 Dépannage

### Problème : Les données ne se sauvegardent pas
**Solution :**
1. Vérifier que LocalStorage est activé
2. Vérifier l'espace disponible
3. Vider le cache du navigateur
4. Réessayer

### Problème : La synchronisation échoue
**Solution :**
1. Vérifier la connexion internet
2. Vérifier que le serveur est accessible
3. Consulter les messages d'erreur
4. Réessayer plus tard

### Problème : Données perdues
**Solution :**
1. Vérifier si un export existe
2. Ne pas vider le cache du navigateur
3. Contacter le support
4. Prévention : Exporter régulièrement

## 📞 Support

### En cas de problème
1. Consulter cette documentation
2. Vérifier la page `/sync`
3. Exporter les données
4. Contacter l'administrateur

### Informations à fournir
- Nombre d'opérations en attente
- Messages d'erreur
- Date de dernière synchronisation
- Export des données (si possible)

---

**Version :** 2.2.0  
**Date :** 24 Novembre 2024  
**Statut :** ✅ Opérationnel
