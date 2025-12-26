# 🎨 Système de Design - CacaoTrack Mobile

## Vue d'ensemble

Un système de design moderne et cohérent a été créé pour l'application mobile CacaoTrack, offrant une expérience utilisateur améliorée avec des composants réutilisables et une identité visuelle cohérente.

## 📁 Structure

```
src/
├── theme/
│   ├── colors.ts          # Palette de couleurs
│   └── spacing.ts         # Espacements, bordures, ombres
└── components/
    ├── Card.tsx           # Composant carte réutilisable
    └── Button.tsx         # Composant bouton réutilisable
```

## 🎨 Palette de Couleurs

### Couleurs Principales
- **Primary**: `#8B4513` (Marron cacao)
- **Primary Dark**: `#654321`
- **Primary Light**: `#A0522D`

### Couleurs Secondaires
- **Secondary**: `#D2691E` (Chocolat)
- **Secondary Dark**: `#CD853F`
- **Secondary Light**: `#DEB887`

### Couleurs de Statut
- **Success**: `#4CAF50` (Vert)
- **Error**: `#F44336` (Rouge)
- **Warning**: `#FF9800` (Orange)
- **Info**: `#2196F3` (Bleu)

## 📐 Système d'Espacement

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## 🎯 Composants Créés

### Card
Composant de carte réutilisable avec variantes :
- `default`: Carte standard
- `elevated`: Carte avec ombre
- `outlined`: Carte avec bordure

### Button
Composant bouton avec variantes :
- `primary`: Bouton principal (marron)
- `secondary`: Bouton secondaire (chocolat)
- `outline`: Bouton avec bordure
- `text`: Bouton texte

Tailles disponibles : `sm`, `md`, `lg`

## ✨ Écrans Améliorés

### 1. LoginScreen ✅
- Design moderne avec logo circulaire
- Champs de saisie améliorés avec labels
- Bouton de connexion avec état de chargement
- Interface épurée et professionnelle

### 2. HomeScreen ✅
- Header avec avatar et informations agent
- Carte de synchronisation avec badge de statut
- Grille d'actions rapides avec icônes
- Design responsive et moderne

## 🚀 Prochaines Étapes

Les écrans suivants peuvent être améliorés en utilisant le même système de design :
- OrganisationScreen
- SectionScreen
- VillageScreen
- ProducteurScreen
- ParcelleScreen
- ParcelleMapScreen
- CollecteScreen
- SignatureScreen

## 📝 Utilisation

### Importer les couleurs
```typescript
import { colors } from '../theme/colors';
```

### Importer l'espacement
```typescript
import { spacing, borderRadius, shadows } from '../theme/spacing';
```

### Utiliser les composants
```typescript
import Card from '../components/Card';
import Button from '../components/Button';
```

## 🎯 Principes de Design

1. **Cohérence**: Utilisation systématique du système de design
2. **Accessibilité**: Contraste suffisant et tailles de texte lisibles
3. **Performance**: Composants légers et optimisés
4. **Maintenabilité**: Code modulaire et réutilisable

