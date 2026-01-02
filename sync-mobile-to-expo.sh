#!/bin/bash

# Script pour synchroniser les fichiers de mobile/ vers CacaoTrackMobile/

echo "🔄 Synchronisation des fichiers mobile vers Expo..."

# Créer les dossiers si nécessaire
mkdir -p CacaoTrackMobile/src/components
mkdir -p CacaoTrackMobile/src/navigation
mkdir -p CacaoTrackMobile/src/screens

# Copier le composant StepIndicator
if [ -f "mobile/src/components/StepIndicator.tsx" ]; then
  cp mobile/src/components/StepIndicator.tsx CacaoTrackMobile/src/components/
  echo "✅ StepIndicator.tsx copié"
else
  echo "❌ StepIndicator.tsx non trouvé"
fi

# Copier BottomTabNavigator
if [ -f "mobile/src/navigation/BottomTabNavigator.tsx" ]; then
  cp mobile/src/navigation/BottomTabNavigator.tsx CacaoTrackMobile/src/navigation/
  echo "✅ BottomTabNavigator.tsx copié"
else
  echo "❌ BottomTabNavigator.tsx non trouvé"
fi

# Copier RootNavigator
if [ -f "mobile/src/navigation/RootNavigator.tsx" ]; then
  cp mobile/src/navigation/RootNavigator.tsx CacaoTrackMobile/src/navigation/
  echo "✅ RootNavigator.tsx copié"
else
  echo "❌ RootNavigator.tsx non trouvé"
fi

# Copier tous les écrans
echo "📱 Copie des écrans..."

screens=(
  "HomeScreen.tsx"
  "ProducteurScreen.tsx"
  "ParcelleScreen.tsx"
  "CollecteScreen.tsx"
  "OrganisationScreen.tsx"
  "ProducteursListScreen.tsx"
  "PlantationsListScreen.tsx"
  "RecoltesListScreen.tsx"
)

for screen in "${screens[@]}"; do
  if [ -f "mobile/src/screens/$screen" ]; then
    cp "mobile/src/screens/$screen" "CacaoTrackMobile/src/screens/"
    echo "✅ $screen copié"
  else
    echo "⚠️  $screen non trouvé (peut être normal)"
  fi
done

echo ""
echo "✅ Synchronisation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. cd CacaoTrackMobile"
echo "2. npm install"
echo "3. npx expo install react-native-vector-icons @react-navigation/bottom-tabs"
echo "4. npx expo start"

