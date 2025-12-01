# 🐛 Correction - Boucle infinie lors de la sélection des régions

## Problème identifié

Lors du clic sur une région, une **boucle infinie** se déclenchait avec l'erreur :
```
Uncaught Error: Maximum update depth exceeded. 
This can happen when a component repeatedly calls setState inside 
componentWillUpdate or componentDidUpdate. React limits the number 
of nested updates to prevent infinite loops.
```

## Cause du problème

Le code avait **deux gestionnaires d'événements** qui se déclenchaient simultanément :

```tsx
// ❌ MAUVAIS CODE
<div onClick={() => toggleRegion(region.id)}>  {/* 1er clic */}
  <Checkbox
    onCheckedChange={() => toggleRegion(region.id)}  {/* 2ème clic */}
  />
  <Label htmlFor={`region-${region.id}`}>  {/* 3ème clic via htmlFor */}
    {region.nom}
  </Label>
</div>
```

**Résultat :** Un seul clic déclenchait `toggleRegion()` **3 fois** :
1. Via le `onClick` du div parent
2. Via le `onCheckedChange` de la Checkbox
3. Via le `htmlFor` du Label qui active la Checkbox

Cela créait une boucle : cocher → décocher → cocher → décocher → ...

## Solution appliquée

Suppression des gestionnaires redondants et utilisation du comportement natif du Label :

```tsx
// ✅ BON CODE
<div className="flex items-center gap-2 hover:bg-muted/50 p-2 rounded transition-colors">
  <Checkbox
    id={`region-${region.id}`}
    checked={selectedRegions.includes(region.id)}
    onCheckedChange={() => toggleRegion(region.id)}
  />
  <Label 
    htmlFor={`region-${region.id}`} 
    className="cursor-pointer text-sm flex-1"
  >
    {region.nom}
  </Label>
</div>
```

**Fonctionnement :**
- Le `htmlFor` du Label crée automatiquement un lien avec la Checkbox
- Cliquer sur le Label active la Checkbox
- La Checkbox déclenche `onCheckedChange` une seule fois
- Pas de `onClick` sur le div parent = pas de conflit

## Modifications apportées

### Fichier : `src/pages/AgentForm.tsx`

#### 1. Suppression des logs de debug
```diff
- console.log("Régions chargées:", data.length, data);
- console.log("Toggle région:", regionId);
- console.log("Nouvelles régions sélectionnées:", newRegions);
```

#### 2. Suppression du onClick sur le div
```diff
  <div 
    key={region.id} 
-   className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
-   onClick={() => toggleRegion(region.id)}
+   className="flex items-center gap-2 hover:bg-muted/50 p-2 rounded transition-colors"
  >
```

#### 3. Suppression du onClick sur le Label
```diff
  <Label 
    htmlFor={`region-${region.id}`} 
    className="cursor-pointer text-sm flex-1"
-   onClick={() => toggleRegion(region.id)}
  >
    {region.nom}
  </Label>
```

## Résultat

✅ **La sélection fonctionne maintenant correctement :**
- Un clic sur la checkbox ou le label coche/décoche la région
- Le compteur se met à jour correctement
- Pas de boucle infinie
- Effet hover pour un meilleur feedback visuel

## Comment tester

1. Aller sur `http://localhost:8080/agents/nouveau`
2. Cliquer sur une région (checkbox ou label)
3. Vérifier que :
   - La checkbox se coche/décoche
   - Le compteur s'incrémente/décrémente
   - Pas d'erreur dans la console
   - L'effet hover fonctionne

## Leçon apprise

⚠️ **Attention aux gestionnaires d'événements multiples !**

Quand on utilise des composants avec `htmlFor` (Label + Input/Checkbox), il ne faut **pas** ajouter de `onClick` supplémentaire car :
- Le `htmlFor` crée déjà un lien automatique
- Ajouter un `onClick` crée un double déclenchement
- Cela peut causer des boucles infinies

**Règle :** Un seul gestionnaire d'événement par action !

---

**Date :** 24 Novembre 2024  
**Fichier modifié :** `src/pages/AgentForm.tsx`  
**Statut :** ✅ Corrigé et testé
