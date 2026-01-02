#!/bin/bash

echo "🔍 Vérification du projet mobile..."
echo ""

# Vérifier Node.js
echo "📦 Vérification Node.js..."
node --version || { echo "❌ Node.js n'est pas installé"; exit 1; }
npm --version || { echo "❌ npm n'est pas installé"; exit 1; }

# Vérifier les fichiers essentiels
echo ""
echo "📁 Vérification des fichiers..."
[ -f "App.tsx" ] && echo "✅ App.tsx" || echo "❌ App.tsx manquant"
[ -f "index.js" ] && echo "✅ index.js" || echo "❌ index.js manquant"
[ -f "app.json" ] && echo "✅ app.json" || echo "❌ app.json manquant"
[ -f "package.json" ] && echo "✅ package.json" || echo "❌ package.json manquant"
[ -d "src" ] && echo "✅ src/" || echo "❌ src/ manquant"

# Vérifier les dépendances
echo ""
echo "📦 Vérification des dépendances..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules existe"
else
    echo "⚠️  node_modules n'existe pas - Exécutez 'npm install'"
fi

# Vérifier TypeScript
echo ""
echo "🔧 Vérification TypeScript..."
if command -v tsc &> /dev/null; then
    echo "✅ TypeScript installé"
    tsc --noEmit --project tsconfig.json 2>&1 | head -20
else
    echo "⚠️  TypeScript non installé globalement"
fi

echo ""
echo "✅ Vérification terminée!"
echo ""
echo "Pour lancer l'application:"
echo "  npm start"
echo ""
echo "Pour build Android:"
echo "  npm run android"
echo ""
echo "Pour build iOS:"
echo "  npm run ios"

