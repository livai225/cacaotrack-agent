# 📱 Guide Rapide - Mode Hors Ligne

## 🎯 Pour qui ?

Ce guide est destiné aux **agents de collecte** travaillant en zone rurale avec une connexion internet limitée ou inexistante.

## ✨ Qu'est-ce que le mode hors ligne ?

Le mode hors ligne vous permet de :
- ✅ Travailler **sans connexion internet**
- ✅ Sauvegarder vos données **localement** sur votre appareil
- ✅ Synchroniser **plus tard** quand vous avez du réseau

## 🚀 Comment ça marche ?

### 1. Indicateur de connexion

En bas à droite de votre écran, vous verrez toujours un badge :

```
🟢 En ligne        → Vous avez internet
🔴 Hors ligne      → Pas d'internet
```

### 2. Travailler hors ligne

**Quand vous n'avez pas de réseau :**

1. Le badge passe en **🔴 Hors ligne**
2. Vous pouvez **continuer à travailler normalement**
3. Vos données sont **sauvegardées localement**
4. Un **compteur** indique le nombre d'opérations en attente

**Exemple :**
```
🔴 Hors ligne [5]
```
→ Vous avez 5 opérations en attente de synchronisation

### 3. Synchroniser vos données

**Quand vous retrouvez du réseau :**

1. Le badge passe en **🟢 En ligne**
2. Un message "Connexion rétablie !" apparaît
3. Cliquez sur le bouton **"Synchroniser"**
4. Vos données sont envoyées au serveur
5. Un message confirme le succès

## 📋 Étapes détaillées

### Scénario : Collecte dans un village sans réseau

#### Étape 1 : Arrivée au village
```
Vous voyez : 🟢 En ligne
↓
Vous entrez dans le village
↓
Le badge change : 🔴 Hors ligne
```

#### Étape 2 : Collecte des données
```
1. Créez une opération normalement
2. Remplissez tous les champs
3. Cliquez sur "Enregistrer"
4. Message : "Opération sauvegardée localement"
5. Le compteur s'incrémente : 🔴 Hors ligne [1]
```

#### Étape 3 : Continuer la collecte
```
Répétez pour chaque opération :
🔴 Hors ligne [1]
🔴 Hors ligne [2]
🔴 Hors ligne [3]
...
```

#### Étape 4 : Retour en zone couverte
```
Vous sortez du village
↓
Le badge change : 🟢 En ligne [5]
↓
Message : "Connexion rétablie !"
```

#### Étape 5 : Synchronisation
```
1. Cliquez sur "Synchroniser"
2. Attendez quelques secondes
3. Message : "5 opération(s) synchronisée(s)"
4. Le compteur revient à 0 : 🟢 En ligne
```

## 🎨 Interface

### Indicateur compact (toujours visible)

```
┌─────────────────────────────────┐
│ 🔴 Hors ligne [3] [Synchroniser]│
└─────────────────────────────────┘
```

### Panneau détaillé (clic sur le badge)

```
┌──────────────────────────────────┐
│ Synchronisation              ✕   │
├──────────────────────────────────┤
│ Statut : 🔴 Hors ligne           │
│ Dernière sync : Il y a 2h        │
│                                   │
│ [Synchroniser] [📥] [🗑️]         │
│                                   │
│ Opérations en attente (3)        │
│ ┌──────────────────────────────┐│
│ │ ⏰ Opération - Création       ││
│ │    12/11/2024 14:23    [🗑️] ││
│ ├──────────────────────────────┤│
│ │ ⏰ Producteur - Modification  ││
│ │    12/11/2024 13:45    [🗑️] ││
│ └──────────────────────────────┘│
└──────────────────────────────────┘
```

### Page de synchronisation (`/sync`)

Pour voir tous les détails :
1. Cliquez sur **"Synchronisation"** dans le menu
2. Vous verrez :
   - État de la connexion
   - Nombre d'opérations en attente
   - Liste complète des opérations
   - Boutons d'action

## ⚠️ Points importants

### ✅ À FAIRE

1. **Synchroniser régulièrement**
   - Dès que vous avez du réseau
   - Avant de commencer une nouvelle journée
   - Après chaque session de collecte

2. **Vérifier le compteur**
   - Regardez combien d'opérations sont en attente
   - Ne laissez pas s'accumuler trop d'opérations

3. **Exporter vos données**
   - Si vous avez plus de 50 opérations en attente
   - Avant une longue mission sans réseau
   - Pour garder une copie de sécurité

### ❌ À NE PAS FAIRE

1. **Ne pas vider le cache du navigateur**
   - Vous perdriez toutes vos données non synchronisées

2. **Ne pas fermer l'application brutalement**
   - Attendez que les données soient sauvegardées

3. **Ne pas ignorer les messages d'erreur**
   - Lisez-les et corrigez si nécessaire

## 🆘 Que faire si...

### Le compteur ne diminue pas après synchronisation
```
1. Vérifiez votre connexion internet
2. Allez sur la page /sync
3. Regardez s'il y a des erreurs
4. Réessayez la synchronisation
```

### Un message d'erreur apparaît
```
1. Lisez le message attentivement
2. Notez l'erreur
3. Essayez de corriger les données
4. Contactez votre superviseur si besoin
```

### Vous avez beaucoup d'opérations en attente
```
1. Trouvez un endroit avec du réseau
2. Allez sur la page /sync
3. Cliquez sur "Synchroniser"
4. Attendez que tout soit envoyé
5. Vérifiez qu'il n'y a plus d'erreurs
```

## 📊 Exemples concrets

### Exemple 1 : Journée type

```
08:00 - Départ du bureau
        🟢 En ligne

09:00 - Arrivée au village A (pas de réseau)
        🔴 Hors ligne

09:30 - Opération 1 créée
        🔴 Hors ligne [1]

10:00 - Opération 2 créée
        🔴 Hors ligne [2]

11:00 - Départ vers village B

11:30 - Passage en zone couverte
        🟢 En ligne [2]
        → Synchronisation
        ✅ 2 opérations synchronisées

12:00 - Arrivée au village B (pas de réseau)
        🔴 Hors ligne

...et ainsi de suite
```

### Exemple 2 : Mission de plusieurs jours

```
Jour 1 : 10 opérations
         🔴 Hors ligne [10]

Jour 2 : 8 opérations
         🔴 Hors ligne [18]

Jour 3 : Retour en ville
         🟢 En ligne [18]
         → Synchronisation
         ✅ 18 opérations synchronisées
```

## 💡 Astuces

### Astuce 1 : Planifier les synchronisations
```
- Matin : Synchroniser avant de partir
- Midi : Synchroniser pendant la pause
- Soir : Synchroniser en rentrant
```

### Astuce 2 : Utiliser les points de passage
```
- Stations-service
- Centres de santé
- Écoles
- Marchés
→ Souvent avec du réseau !
```

### Astuce 3 : Exporter régulièrement
```
1. Aller sur /sync
2. Cliquer sur "Exporter"
3. Sauvegarder le fichier
4. Garder une copie sur un autre appareil
```

## 📞 Besoin d'aide ?

### En cas de problème
1. Consultez ce guide
2. Allez sur la page `/sync`
3. Notez les messages d'erreur
4. Contactez votre superviseur

### Informations à fournir
- Nombre d'opérations en attente
- Messages d'erreur (si présents)
- Date de dernière synchronisation
- Capture d'écran si possible

---

## 🎉 Résumé en 3 points

1. **🔴 Hors ligne** → Travaillez normalement, les données sont sauvegardées
2. **🟢 En ligne** → Synchronisez dès que possible
3. **📊 Vérifiez** → Regardez régulièrement le compteur

**C'est aussi simple que ça !** 🚀

---

**Version :** 2.2.0  
**Date :** 24 Novembre 2024  
**Pour :** Agents de collecte
