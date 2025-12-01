# 🐛 Guide de débogage - Sélection des régions

## Problème
Les régions ne peuvent pas être sélectionnées sur la page `/agents/nouveau`

## ✅ Corrections apportées

### 1. Correction de la boucle infinie
**Problème identifié :** Le `onClick` sur le div parent ET le `onCheckedChange` sur la Checkbox se déclenchaient tous les deux, créant un double toggle et une boucle infinie.

**Solution :** 
- Suppression du `onClick` sur le div parent
- Conservation uniquement du `onCheckedChange` sur la Checkbox
- Le Label avec `htmlFor` déclenche automatiquement la checkbox au clic

### 2. Amélioration visuelle
- Ajout d'un effet hover (`hover:bg-muted/50`)
- Padding ajouté pour une meilleure zone de clic
- Label avec `flex-1` pour occuper tout l'espace
- Transition douce (`transition-colors`)

## 🧪 Comment tester

### 1. Ouvrir la console du navigateur
- Appuyer sur `F12` ou `Ctrl+Shift+I`
- Aller dans l'onglet "Console"

### 2. Aller sur la page
```
http://localhost:8080/agents/nouveau
```

### 3. Vérifier les logs
Vous devriez voir :
```
Régions chargées: 33 [Array(33)]
```

### 4. Cliquer sur une région
Vous devriez voir :
```
Toggle région: <id-de-la-région>
Nouvelles régions sélectionnées: ["<id-de-la-région>"]
```

### 5. Vérifier visuellement
- La checkbox devrait se cocher/décocher
- Le compteur devrait s'incrémenter/décrémenter
- Un effet hover devrait apparaître au survol

## 🔍 Diagnostics possibles

### Si aucune région n'apparaît
**Problème :** Les régions ne se chargent pas depuis l'API

**Solution :**
1. Vérifier que le serveur backend est démarré :
   ```bash
   cd server
   npm run dev
   ```

2. Tester l'API directement :
   ```bash
   curl http://localhost:3000/api/regions
   ```

3. Vérifier la console pour les erreurs :
   ```
   Erreur chargement régions: ...
   ```

### Si les régions apparaissent mais ne se sélectionnent pas
**Problème :** L'événement onClick ne fonctionne pas

**Solutions possibles :**

1. **Vérifier les logs dans la console**
   - Si "Toggle région" n'apparaît pas → Problème d'événement
   - Si "Toggle région" apparaît mais pas de changement visuel → Problème de state

2. **Vérifier le state React**
   - Installer React DevTools
   - Vérifier que `selectedRegions` se met à jour

3. **Tester avec un clic direct sur la checkbox**
   - Si ça fonctionne → Le problème vient du conteneur div
   - Si ça ne fonctionne pas → Le problème vient du composant Checkbox

### Si le compteur ne se met pas à jour
**Problème :** Le state `selectedRegions` ne se propage pas

**Solution :**
Vérifier que `setValue("regions", newRegions)` est bien appelé

## 🛠️ Solutions alternatives

### Solution 1 : Utiliser un input checkbox natif
```tsx
<input
  type="checkbox"
  checked={selectedRegions.includes(region.id)}
  onChange={() => toggleRegion(region.id)}
  className="h-4 w-4"
/>
```

### Solution 2 : Forcer le re-render
```tsx
const [, forceUpdate] = useReducer(x => x + 1, 0);

const toggleRegion = (regionId: string) => {
  // ... code existant
  forceUpdate();
};
```

### Solution 3 : Utiliser un state local
```tsx
const [localSelected, setLocalSelected] = useState<string[]>([]);

useEffect(() => {
  setValue("regions", localSelected);
}, [localSelected]);
```

## 📋 Checklist de vérification

- [ ] Le serveur backend est démarré (port 3000)
- [ ] Le frontend est démarré (port 8080)
- [ ] La console du navigateur est ouverte
- [ ] Les logs "Régions chargées" apparaissent
- [ ] 33 régions sont affichées
- [ ] Les logs "Toggle région" apparaissent au clic
- [ ] La checkbox change visuellement
- [ ] Le compteur se met à jour
- [ ] Le formulaire peut être soumis

## 🔧 Commandes utiles

### Redémarrer le backend
```bash
cd server
npm run dev
```

### Redémarrer le frontend
```bash
npm run dev
```

### Tester l'API
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/regions" | Measure-Object | Select-Object -ExpandProperty Count

# Bash/CMD
curl http://localhost:3000/api/regions
```

### Vérifier les processus Node
```bash
# PowerShell
Get-Process node

# Tuer tous les processus Node
Stop-Process -Name node -Force
```

## 📞 Si le problème persiste

1. **Vérifier les versions des dépendances**
   ```bash
   npm list @radix-ui/react-checkbox
   npm list react-hook-form
   ```

2. **Réinstaller les dépendances**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Vider le cache du navigateur**
   - `Ctrl+Shift+Delete`
   - Cocher "Cache" et "Cookies"
   - Cliquer sur "Effacer"

4. **Tester dans un autre navigateur**
   - Chrome
   - Firefox
   - Edge

## 📊 État actuel

### Modifications apportées
- ✅ Ajout de logs de débogage
- ✅ Amélioration de l'interaction (onClick sur le conteneur)
- ✅ Ajout d'effets visuels (hover)
- ✅ Meilleure zone de clic

### À tester
- [ ] Ouvrir la console et vérifier les logs
- [ ] Cliquer sur une région
- [ ] Vérifier que la checkbox se coche
- [ ] Vérifier que le compteur s'incrémente

---

**Date :** 24 Novembre 2024  
**Fichier modifié :** `src/pages/AgentForm.tsx`  
**Statut :** En test
