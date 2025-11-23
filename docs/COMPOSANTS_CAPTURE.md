# Composants de Capture - Documentation

## Vue d'ensemble

Les composants de capture permettent d'enregistrer des photos et des coordonnées GPS dans l'application.

## PhotoCapture

### Fonctionnalités

✅ **Capture depuis la caméra** - Active la caméra de l'appareil (mobile/desktop)
✅ **Upload depuis la galerie** - Sélectionner une image existante
✅ **Compression automatique** - Réduit la taille des images (max 1200px, qualité 80%)
✅ **Prévisualisation** - Affiche l'image avant sauvegarde
✅ **Suppression** - Bouton pour retirer l'image
✅ **Format Base64** - Stockage dans localStorage compatible

### Utilisation

```tsx
import PhotoCapture from "@/components/forms/PhotoCapture";

<PhotoCapture
  label="Photo de l'organisation"
  value={watch("photo")}
  onChange={(photo) => setValue("photo", photo)}
  required={false}
/>
```

### Props

| Prop | Type | Description | Requis |
|------|------|-------------|--------|
| `label` | string | Libellé du champ | ✅ |
| `value` | string | URL ou base64 de l'image | ❌ |
| `onChange` | function | Callback avec la nouvelle valeur | ✅ |
| `required` | boolean | Champ obligatoire | ❌ |

### Compression d'images

Pour éviter de surcharger le localStorage, les images sont automatiquement :
- **Redimensionnées** à max 1200px de largeur
- **Compressées** à 80% de qualité JPEG
- **Converties** en base64 pour le stockage

### Exemple de valeur retournée

```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAg...
```

## GPSCapture

### Fonctionnalités

✅ **Géolocalisation automatique** - Utilise l'API Geolocation du navigateur
✅ **Haute précision** - Mode `enableHighAccuracy`
✅ **Feedback utilisateur** - Toast de succès/erreur
✅ **Affichage des coordonnées** - Latitude et longitude en lecture seule
✅ **État de chargement** - Animation pendant la capture

### Utilisation

```tsx
import GPSCapture from "@/components/forms/GPSCapture";

<GPSCapture
  onChange={(coords) => {
    setValue("latitude", coords.latitude);
    setValue("longitude", coords.longitude);
  }}
  latitude={watch("latitude")}
  longitude={watch("longitude")}
  required={false}
/>
```

### Props

| Prop | Type | Description | Requis |
|------|------|-------------|--------|
| `latitude` | number | Valeur actuelle de la latitude | ❌ |
| `longitude` | number | Valeur actuelle de la longitude | ❌ |
| `onChange` | function | Callback avec {latitude, longitude} | ✅ |
| `required` | boolean | Champ obligatoire | ❌ |

### Précision GPS

- **Timeout** : 10 secondes
- **Précision** : Mode haute précision activé
- **Format** : Décimal (WGS84)
- **Affichage** : 6 décimales

### Exemple de valeur retournée

```typescript
{
  latitude: 5.34622,
  longitude: -5.89751
}
```

## Compatibilité

### PhotoCapture

| Fonctionnalité | Desktop | Mobile | Notes |
|----------------|---------|--------|-------|
| Upload fichier | ✅ | ✅ | Tous navigateurs modernes |
| Capture caméra | ⚠️ | ✅ | Desktop: dépend du système |
| Compression | ✅ | ✅ | Canvas API |
| Base64 | ✅ | ✅ | FileReader API |

### GPSCapture

| Fonctionnalité | Desktop | Mobile | Notes |
|----------------|---------|--------|-------|
| Géolocalisation | ✅ | ✅ | Nécessite HTTPS en production |
| Haute précision | ⚠️ | ✅ | Meilleure sur mobile |

## Permissions requises

### Caméra (PhotoCapture)
L'utilisateur doit autoriser l'accès à la caméra lors de la première utilisation.

**Chrome/Edge** : Demande automatique
**Firefox** : Demande automatique
**Safari** : Demande automatique (iOS 11+)

### Géolocalisation (GPSCapture)
L'utilisateur doit autoriser l'accès à la position.

**HTTPS requis** en production (sauf localhost)

## Stockage

### Taille des images

Sans compression :
- Photo HD (1920x1080) : ~800 KB en base64

Avec compression :
- Photo compressée (1200x675) : ~150-250 KB en base64

### Limite localStorage

- **Quota standard** : 5-10 MB par origine
- **Recommandation** : Max 20-30 photos par organisation

## Bonnes pratiques

### PhotoCapture

1. **Toujours compresser** les images avant stockage
2. **Limiter le nombre** de photos par entité
3. **Nettoyer** les photos supprimées du localStorage
4. **Prévoir un fallback** si la compression échoue

### GPSCapture

1. **Informer l'utilisateur** que la géolocalisation est nécessaire
2. **Gérer les erreurs** de permission refusée
3. **Ajouter un timeout** raisonnable
4. **Permettre la saisie manuelle** en cas d'échec

## Exemples d'utilisation dans le projet

### Organisation (OrganisationForm.tsx)
```tsx
<Card>
  <CardHeader>
    <CardTitle>Photo de l'organisation</CardTitle>
  </CardHeader>
  <CardContent>
    <PhotoCapture
      label="Photo de l'organisation"
      value={watch("photo")}
      onChange={(photo) => setValue("photo", photo)}
    />
  </CardContent>
</Card>
```

### Producteur (ProducteurForm.tsx)
```tsx
<PhotoCapture
  label="Photo d'identité"
  value={watch("photoIdentite")}
  onChange={(photo) => setValue("photoIdentite", photo)}
/>

<PhotoCapture
  label="Photo en tant que planteur"
  value={watch("photoPlanteur")}
  onChange={(photo) => setValue("photoPlanteur", photo)}
/>
```

### GPS (OrganisationForm.tsx)
```tsx
<Card>
  <CardHeader>
    <CardTitle>Localisation GPS</CardTitle>
  </CardHeader>
  <CardContent>
    <GPSCapture
      onChange={(coords) => {
        setValue("latitude", coords.latitude);
        setValue("longitude", coords.longitude);
      }}
      latitude={watch("latitude")}
      longitude={watch("longitude")}
    />
  </CardContent>
</Card>
```

## Dépannage

### La caméra ne s'ouvre pas
- Vérifier les permissions du navigateur
- Tester sur un appareil différent
- Utiliser HTTPS en production

### Les images sont trop volumineuses
- Réduire `maxWidth` dans compressImage (par défaut 1200)
- Réduire `quality` (par défaut 0.8)

### La géolocalisation ne fonctionne pas
- Vérifier le protocole HTTPS
- Vérifier les permissions du navigateur
- Augmenter le timeout si nécessaire

### Erreur localStorage quota dépassé
- Nettoyer les anciennes données
- Réduire la taille des images
- Implémenter une stratégie de nettoyage

## Améliorations futures

- [ ] Support de plusieurs photos
- [ ] Édition/rotation d'images
- [ ] Carte interactive pour le GPS
- [ ] Upload vers un serveur
- [ ] Cache des images
- [ ] Progressive Web App pour offline
