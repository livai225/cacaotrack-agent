#!/bin/bash

echo "🚀 Installation et Test Mobile CacaoTrack"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"
echo ""

# Aller dans le dossier mobile
cd "$(dirname "$0")"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation"
    exit 1
fi

echo ""
echo "✅ Dépendances installées"
echo ""

# Vérifier les fichiers essentiels
echo "🔍 Vérification des fichiers..."
files=("App.tsx" "index.js" "app.json" "src")
for file in "${files[@]}"; do
    if [ -e "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
    fi
done

echo ""
echo "🎯 Pour démarrer l'application:"
echo "  npm start"
echo ""
echo "🎯 Pour build Android:"
echo "  npm run android"
echo ""

