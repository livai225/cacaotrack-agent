#!/bin/bash
# Script pour exécuter les tests sur le serveur
# Usage: Copiez ce script sur le serveur et exécutez-le

echo "=== EXECUTION DES TESTS API SUR LE SERVEUR ==="
echo ""

# Vérifier que curl est installé
if ! command -v curl &> /dev/null; then
    echo "❌ curl n'est pas installé. Installation..."
    sudo apt-get update && sudo apt-get install -y curl
fi

# Aller dans le dossier du projet
cd /var/www/cacaotrack-agent || exit 1

# Récupérer les dernières modifications
echo "📥 Récupération des dernières modifications..."
git pull origin main

# Rendre le script exécutable
chmod +x test-apis-simple.sh

# Exécuter les tests
echo ""
echo "🧪 Exécution des tests..."
echo ""
bash test-apis-simple.sh

echo ""
echo "=== FIN DES TESTS ==="


