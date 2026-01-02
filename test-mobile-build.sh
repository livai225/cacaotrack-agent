#!/bin/bash

# Script de test et build pour l'application mobile Expo

echo "🧪 Test et Build Application Mobile CacaoTrack"
echo "=============================================="
echo ""

cd CacaoTrackMobile || exit 1

echo "1️⃣  Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  npm install
else
  echo "✅ node_modules existe"
fi

echo ""
echo "2️⃣  Installation des dépendances Expo manquantes..."
npx expo install react-native-vector-icons @react-navigation/bottom-tabs || echo "⚠️  Certaines dépendances peuvent déjà être installées"

echo ""
echo "3️⃣  Vérification de la configuration Expo..."
npx expo-doctor || echo "⚠️  expo-doctor peut signaler des avertissements"

echo ""
echo "4️⃣  Vérification TypeScript..."
if [ -f "tsconfig.json" ]; then
  npx tsc --noEmit || echo "⚠️  Erreurs TypeScript détectées"
else
  echo "⚠️  tsconfig.json non trouvé"
fi

echo ""
echo "5️⃣  Test de démarrage Expo..."
echo "🚀 Pour lancer l'application :"
echo "   npx expo start"
echo ""
echo "📱 Pour build avec EAS :"
echo "   eas build --platform android --profile preview"
echo ""

# Optionnel : lancer expo start en arrière-plan pour test
# echo "6️⃣  Démarrage Expo (Ctrl+C pour arrêter)..."
# npx expo start

