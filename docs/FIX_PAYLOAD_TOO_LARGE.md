# 🐛 Correction - Erreur "Payload Too Large"

## Problème

Lors de la création d'un agent avec une photo, l'erreur suivante apparaît :

```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

Dans les logs du serveur :
```
PayloadTooLargeError: request entity too large
```

## Cause

Par défaut, Express limite la taille des requêtes JSON à **100KB**. Quand on envoie une photo en Base64, la taille peut facilement dépasser cette limite :

- Photo moyenne : ~500KB
- Photo en Base64 : ~700KB (augmentation de 33%)
- Limite par défaut : 100KB ❌

## Solution

Augmenter la limite de taille dans la configuration Express.

### Code modifié

**Fichier :** `server/src/index.ts`

**Avant :**
```typescript
app.use(cors());
app.use(express.json());
```

**Après :**
```typescript
app.use(cors());
// Augmenter la limite pour les photos en Base64 (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

## Explication

### `express.json({ limit: '50mb' })`
- Parse les requêtes JSON
- Limite augmentée à 50MB
- Permet d'envoyer des photos en Base64

### `express.urlencoded({ limit: '50mb', extended: true })`
- Parse les données de formulaire
- Limite augmentée à 50MB
- `extended: true` permet les objets imbriqués

## Tailles de référence

### Photos typiques
```
Photo smartphone (basse qualité):  ~200KB → Base64: ~270KB
Photo smartphone (moyenne qualité): ~500KB → Base64: ~670KB
Photo smartphone (haute qualité):  ~2MB   → Base64: ~2.7MB
```

### Limites recommandées
```
Développement:  50MB  (confortable pour tests)
Production:     10MB  (suffisant pour photos optimisées)
```

## Optimisation future

### Court terme
- [ ] Compresser les photos côté client avant envoi
- [ ] Limiter la résolution des photos (1920x1080 max)
- [ ] Afficher un indicateur de progression

### Moyen terme
- [ ] Utiliser un service de stockage externe (S3, Cloudinary)
- [ ] Upload direct sans passer par l'API
- [ ] Générer des thumbnails automatiquement

### Long terme
- [ ] CDN pour les images
- [ ] Compression automatique côté serveur
- [ ] Format WebP pour réduire la taille

## Prévention

### Côté client
```typescript
// Compresser l'image avant envoi
const compressImage = (base64: string, maxWidth: number = 1920) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = base64;
  });
};
```

### Côté serveur
```typescript
// Valider la taille avant traitement
app.use((req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({ 
      error: 'Fichier trop volumineux',
      maxSize: '10MB'
    });
  }
  
  next();
});
```

## Tests

### Test 1 : Photo petite (< 1MB)
```
✅ Devrait fonctionner
```

### Test 2 : Photo moyenne (1-5MB)
```
✅ Devrait fonctionner
```

### Test 3 : Photo grande (5-10MB)
```
✅ Devrait fonctionner (mais lent)
```

### Test 4 : Photo très grande (> 10MB)
```
⚠️ Devrait être compressée côté client
```

## Monitoring

### Logs à surveiller
```bash
# Erreurs de taille
grep "PayloadTooLargeError" logs/server.log

# Requêtes volumineuses
grep "Content-Length: [0-9]\{7,\}" logs/access.log
```

### Métriques
- Taille moyenne des requêtes
- Temps de traitement
- Taux d'erreur 413

## Documentation

### Pour les développeurs
- Toujours compresser les images avant envoi
- Utiliser des formats optimisés (JPEG, WebP)
- Limiter la résolution (1920x1080 max)

### Pour les utilisateurs
- Prendre des photos en qualité moyenne
- Éviter les photos en haute résolution
- Compresser les photos si nécessaire

## Ressources

### Compression d'images
- [TinyPNG](https://tinypng.com/) - Compression en ligne
- [ImageOptim](https://imageoptim.com/) - Application desktop
- [Sharp](https://sharp.pixelplumbing.com/) - Bibliothèque Node.js

### Stockage externe
- [AWS S3](https://aws.amazon.com/s3/)
- [Cloudinary](https://cloudinary.com/)
- [ImageKit](https://imagekit.io/)

---

**Date :** 24 Novembre 2024  
**Fichier modifié :** `server/src/index.ts`  
**Statut :** ✅ Corrigé
