#!/bin/bash
# Script de test simple des API - Version optimisée
BASE_URL="http://localhost:3000/api"

echo "=== TEST COMPLET DES API ==="
echo ""

# Fonction de test
test_api() {
    method=$1
    url=$2
    data=$3
    desc=$4
    
    printf "%-50s " "$desc"
    
    if [ "$method" = "GET" ]; then
        http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    elif [ "$method" = "DELETE" ]; then
        http_code=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$url")
    else
        http_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url")
    fi
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo "✅ OK ($http_code)"
        return 0
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
        echo "⚠️  $http_code"
        return 1
    else
        echo "❌ ERREUR ($http_code)"
        return 1
    fi
}

# Health Check
echo "1. HEALTH CHECK"
test_api "GET" "$BASE_URL/health" "" "Health Check"
test_api "GET" "$BASE_URL" "" "API Info"
echo ""

# Organisations
echo "2. ORGANISATIONS"
test_api "GET" "$BASE_URL/organisations" "" "GET /organisations"
ORG_DATA='{"nom":"Test Org API","type":"Coopérative","statut":"actif","region":"Lôh-Djiboua","departement":"Divo","sous_prefecture":"Divo","localite":"Divo","president_nom":"Test","president_contact":["+2250712345678"],"potentiel_production":1000}'
test_api "POST" "$BASE_URL/organisations" "$ORG_DATA" "POST /organisations (CREATE)"

# Récupérer ID
ORG_ID=$(curl -s "$BASE_URL/organisations" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$ORG_ID" ]; then
    test_api "GET" "$BASE_URL/organisations/$ORG_ID" "" "GET /organisations/:id"
    UPDATE_DATA='{"nom":"Test Org MODIFIEE"}'
    test_api "PUT" "$BASE_URL/organisations/$ORG_ID" "$UPDATE_DATA" "PUT /organisations/:id (UPDATE)"
fi
echo ""

# Sections
echo "3. SECTIONS"
test_api "GET" "$BASE_URL/sections" "" "GET /sections"
if [ -n "$ORG_ID" ]; then
    SECTION_DATA="{\"nom\":\"Test Section API\",\"id_organisation\":\"$ORG_ID\",\"statut\":\"actif\",\"localite\":\"Divo\",\"president_nom\":\"Test\",\"president_contact\":[\"+2250712345678\"]}"
    test_api "POST" "$BASE_URL/sections" "$SECTION_DATA" "POST /sections (CREATE)"
    SECTION_ID=$(curl -s "$BASE_URL/sections" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$SECTION_ID" ]; then
        test_api "GET" "$BASE_URL/sections/$SECTION_ID" "" "GET /sections/:id"
        UPDATE_DATA='{"nom":"Test Section MODIFIEE"}'
        test_api "PUT" "$BASE_URL/sections/$SECTION_ID" "$UPDATE_DATA" "PUT /sections/:id (UPDATE)"
    fi
fi
echo ""

# Villages
echo "4. VILLAGES"
test_api "GET" "$BASE_URL/villages" "" "GET /villages"
if [ -n "$SECTION_ID" ]; then
    VILLAGE_DATA="{\"nom\":\"Test Village API\",\"id_section\":\"$SECTION_ID\",\"type\":\"Village\",\"statut\":\"actif\",\"localite\":\"Divo\",\"chef_nom\":\"Test\",\"chef_contact\":[\"+2250712345678\"]}"
    test_api "POST" "$BASE_URL/villages" "$VILLAGE_DATA" "POST /villages (CREATE)"
    VILLAGE_ID=$(curl -s "$BASE_URL/villages" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$VILLAGE_ID" ]; then
        test_api "GET" "$BASE_URL/villages/$VILLAGE_ID" "" "GET /villages/:id"
        UPDATE_DATA='{"nom":"Test Village MODIFIE"}'
        test_api "PUT" "$BASE_URL/villages/$VILLAGE_ID" "$UPDATE_DATA" "PUT /villages/:id (UPDATE)"
    fi
fi
echo ""

# Producteurs
echo "5. PRODUCTEURS"
test_api "GET" "$BASE_URL/producteurs" "" "GET /producteurs"
if [ -n "$VILLAGE_ID" ]; then
    PRODUCTEUR_DATA="{\"nom_complet\":\"Test Producteur API\",\"id_village\":\"$VILLAGE_ID\",\"statut\":\"actif\",\"sexe\":\"M\"}"
    test_api "POST" "$BASE_URL/producteurs" "$PRODUCTEUR_DATA" "POST /producteurs (CREATE)"
    PRODUCTEUR_ID=$(curl -s "$BASE_URL/producteurs" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$PRODUCTEUR_ID" ]; then
        test_api "GET" "$BASE_URL/producteurs/$PRODUCTEUR_ID" "" "GET /producteurs/:id"
        UPDATE_DATA='{"nom_complet":"Test Producteur MODIFIE"}'
        test_api "PUT" "$BASE_URL/producteurs/$PRODUCTEUR_ID" "$UPDATE_DATA" "PUT /producteurs/:id (UPDATE)"
    fi
fi
echo ""

# Parcelles
echo "6. PARCELLES"
test_api "GET" "$BASE_URL/parcelles" "" "GET /parcelles"
if [ -n "$PRODUCTEUR_ID" ]; then
    TIMESTAMP=$(date +%s)
    PARCELLE_DATA="{\"code\":\"TEST-PARC-$TIMESTAMP\",\"id_producteur\":\"$PRODUCTEUR_ID\",\"statut\":\"active\",\"superficie_declaree\":2.5}"
    test_api "POST" "$BASE_URL/parcelles" "$PARCELLE_DATA" "POST /parcelles (CREATE)"
    PARCELLE_ID=$(curl -s "$BASE_URL/parcelles" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$PARCELLE_ID" ]; then
        test_api "GET" "$BASE_URL/parcelles/$PARCELLE_ID" "" "GET /parcelles/:id"
        UPDATE_DATA='{"superficie_declaree":3.0}'
        test_api "PUT" "$BASE_URL/parcelles/$PARCELLE_ID" "$UPDATE_DATA" "PUT /parcelles/:id (UPDATE)"
    fi
fi
echo ""

# Operations
echo "7. OPERATIONS"
test_api "GET" "$BASE_URL/operations" "" "GET /operations"
if [ -n "$PRODUCTEUR_ID" ] && [ -n "$PARCELLE_ID" ] && [ -n "$VILLAGE_ID" ]; then
    OPERATION_DATA="{\"id_producteur\":\"$PRODUCTEUR_ID\",\"id_parcelle\":\"$PARCELLE_ID\",\"id_village\":\"$VILLAGE_ID\",\"statut\":\"Brouillon\",\"campagne\":\"2023-2024\",\"quantite_cabosses\":100,\"poids_estimatif\":50}"
    test_api "POST" "$BASE_URL/operations" "$OPERATION_DATA" "POST /operations (CREATE)"
    OPERATION_ID=$(curl -s "$BASE_URL/operations" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$OPERATION_ID" ]; then
        test_api "GET" "$BASE_URL/operations/$OPERATION_ID" "" "GET /operations/:id"
        UPDATE_DATA='{"statut":"Valide"}'
        test_api "PUT" "$BASE_URL/operations/$OPERATION_ID" "$UPDATE_DATA" "PUT /operations/:id (UPDATE)"
    fi
fi
echo ""

# Agents
echo "8. AGENTS"
test_api "GET" "$BASE_URL/agents" "" "GET /agents"
AGENT_DATA='{"code":"AGT-TEST-API","nom":"Test","prenom":"Agent API","telephone":"+2250712345678","statut":"actif","regions":[]}'
test_api "POST" "$BASE_URL/agents" "$AGENT_DATA" "POST /agents (CREATE)"
AGENT_ID=$(curl -s "$BASE_URL/agents" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$AGENT_ID" ]; then
    test_api "GET" "$BASE_URL/agents/$AGENT_ID" "" "GET /agents/:id"
    UPDATE_DATA='{"nom":"Test MODIFIE"}'
    test_api "PUT" "$BASE_URL/agents/$AGENT_ID" "$UPDATE_DATA" "PUT /agents/:id (UPDATE)"
fi
echo ""

# Regions
echo "9. REGIONS"
test_api "GET" "$BASE_URL/regions" "" "GET /regions"
echo ""

echo "=== TESTS TERMINES ==="
echo "Resume: GET, POST, PUT testes pour toutes les ressources principales"
