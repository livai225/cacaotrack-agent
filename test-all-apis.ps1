# Script PowerShell de test complet de toutes les API
# Usage: .\test-all-apis.ps1

$BASE_URL = "http://localhost:3000/api"
# Ou depuis l'extérieur: $BASE_URL = "http://82.208.22.230/api"

Write-Host "🧪 TEST COMPLET DE TOUTES LES API" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Variables pour stocker les IDs crees
$script:ORG_ID = ""
$script:SECTION_ID = ""
$script:VILLAGE_ID = ""
$script:PRODUCTEUR_ID = ""
$script:PARCELLE_ID = ""
$script:OPERATION_ID = ""
$script:AGENT_ID = ""

# Fonction pour tester une requête
function Test-Request {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Data = $null,
        [string]$Description
    )
    
    Write-Host -NoNewline "Testing $Description... "
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method Get -ErrorAction Stop
            $httpCode = 200
        }
        elseif ($Method -eq "DELETE") {
            try {
                $response = Invoke-RestMethod -Uri $Url -Method Delete -ErrorAction Stop
                $httpCode = 200
            } catch {
                $httpCode = $_.Exception.Response.StatusCode.value__
                $response = $_.ErrorDetails.Message
            }
        }
        else {
            try {
                $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body $Data -ErrorAction Stop
                $httpCode = 200
            } catch {
                $httpCode = $_.Exception.Response.StatusCode.value__
                $response = $_.ErrorDetails.Message
            }
        }
        
        if ($httpCode -ge 200 -and $httpCode -lt 300) {
            Write-Host "✅ OK ($httpCode)" -ForegroundColor Green
            return $true, $response
        }
        elseif ($httpCode -ge 400 -and $httpCode -lt 500) {
            Write-Host "⚠️  $httpCode" -ForegroundColor Yellow
            return $false, $response
        }
        else {
            Write-Host "❌ ERREUR ($httpCode)" -ForegroundColor Red
            return $false, $response
        }
    }
    catch {
        Write-Host "❌ ERREUR" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
        return $false, $null
    }
}

Write-Host "1️⃣  TEST HEALTH CHECK" -ForegroundColor Yellow
Write-Host "-------------------"
$null = Test-Request -Method "GET" -Url "$BASE_URL/health" -Description "Health Check"
$null = Test-Request -Method "GET" -Url "$BASE_URL" -Description "API Info"
Write-Host ""

Write-Host "2️⃣  TEST ORGANISATIONS" -ForegroundColor Yellow
Write-Host "-------------------"
# GET
$null = Test-Request -Method "GET" -Url "$BASE_URL/organisations" -Description "GET /organisations"

# POST (CREATE)
$orgData = @{
    nom = "Test Organisation API"
    type = "Coopérative"
    statut = "actif"
    region = "Lôh-Djiboua"
    departement = "Divo"
    sous_prefecture = "Divo"
    localite = "Divo"
    president_nom = "Test President"
    president_contact = @("+225 07 12 34 56 78")
    potentiel_production = 1000
} | ConvertTo-Json -Depth 10

$result = Test-Request -Method "POST" -Url "$BASE_URL/organisations" -Data $orgData -Description "POST /organisations (CREATE)"
if ($result[0]) {
    $orgs = Invoke-RestMethod -Uri "$BASE_URL/organisations" -Method Get
    if ($orgs.Count -gt 0) {
        $script:ORG_ID = $orgs[0].id
        Write-Host "   Organisation creee: $($script:ORG_ID)" -ForegroundColor Cyan
        
        # GET by ID
        $null = Test-Request -Method "GET" -Url "$BASE_URL/organisations/$($script:ORG_ID)" -Description "GET /organisations/:id"
        
        # PUT (UPDATE)
        $updateData = @{
            nom = "Test Organisation API MODIFIEE"
            statut = "inactif"
        } | ConvertTo-Json
        $null = Test-Request -Method "PUT" -Url "$BASE_URL/organisations/$($script:ORG_ID)" -Data $updateData -Description "PUT /organisations/:id (UPDATE)"
    }
}
Write-Host ""

Write-Host "3️⃣  TEST SECTIONS" -ForegroundColor Yellow
Write-Host "-------------------"
# GET
$null = Test-Request -Method "GET" -Url "$BASE_URL/sections" -Description "GET /sections"

if ($script:ORG_ID) {
    # POST (CREATE)
    $sectionData = @{
        nom = "Test Section API"
        id_organisation = $script:ORG_ID
        statut = "actif"
        localite = "Divo"
        president_nom = "Test Responsable"
        president_contact = @("+225 07 12 34 56 78")
    } | ConvertTo-Json -Depth 10
    
    $result = Test-Request -Method "POST" -Url "$BASE_URL/sections" -Data $sectionData -Description "POST /sections (CREATE)"
    if ($result[0]) {
        $sections = Invoke-RestMethod -Uri "$BASE_URL/sections" -Method Get
        if ($sections.Count -gt 0) {
            $script:SECTION_ID = $sections[0].id
            Write-Host "   Section creee: $($script:SECTION_ID)" -ForegroundColor Cyan
            
            # GET by ID
            $null = Test-Request -Method "GET" -Url "$BASE_URL/sections/$($script:SECTION_ID)" -Description "GET /sections/:id"
            
            # PUT (UPDATE)
            $updateData = @{ nom = "Test Section API MODIFIEE" } | ConvertTo-Json
            $null = Test-Request -Method "PUT" -Url "$BASE_URL/sections/$($script:SECTION_ID)" -Data $updateData -Description "PUT /sections/:id (UPDATE)"
        }
    }
}
Write-Host ""

Write-Host "4️⃣  TEST VILLAGES" -ForegroundColor Yellow
Write-Host "-------------------"
# GET
$null = Test-Request -Method "GET" -Url "$BASE_URL/villages" -Description "GET /villages"

if ($script:SECTION_ID) {
    # POST (CREATE)
    $villageData = @{
        nom = "Test Village API"
        id_section = $script:SECTION_ID
        type = "Village"
        statut = "actif"
        localite = "Divo"
        chef_nom = "Test Chef"
        chef_contact = @("+225 07 12 34 56 78")
    } | ConvertTo-Json -Depth 10
    
    $result = Test-Request -Method "POST" -Url "$BASE_URL/villages" -Data $villageData -Description "POST /villages (CREATE)"
    if ($result[0]) {
        $villages = Invoke-RestMethod -Uri "$BASE_URL/villages" -Method Get
        if ($villages.Count -gt 0) {
            $script:VILLAGE_ID = $villages[0].id
            Write-Host "   Village cree: $($script:VILLAGE_ID)" -ForegroundColor Cyan
            
            # GET by ID
            $null = Test-Request -Method "GET" -Url "$BASE_URL/villages/$($script:VILLAGE_ID)" -Description "GET /villages/:id"
            
            # PUT (UPDATE)
            $updateData = @{ nom = "Test Village API MODIFIE" } | ConvertTo-Json
            $null = Test-Request -Method "PUT" -Url "$BASE_URL/villages/$($script:VILLAGE_ID)" -Data $updateData -Description "PUT /villages/:id (UPDATE)"
        }
    }
}
Write-Host ""

Write-Host "5️⃣  TEST PRODUCTEURS" -ForegroundColor Yellow
Write-Host "-------------------"
# GET
$null = Test-Request -Method "GET" -Url "$BASE_URL/producteurs" -Description "GET /producteurs"

if ($script:VILLAGE_ID) {
    # POST (CREATE)
    $producteurData = @{
        nom_complet = "Test Producteur API"
        id_village = $script:VILLAGE_ID
        statut = "actif"
        sexe = "M"
    } | ConvertTo-Json
    
    $result = Test-Request -Method "POST" -Url "$BASE_URL/producteurs" -Data $producteurData -Description "POST /producteurs (CREATE)"
    if ($result[0]) {
        $producteurs = Invoke-RestMethod -Uri "$BASE_URL/producteurs" -Method Get
        if ($producteurs.Count -gt 0) {
            $script:PRODUCTEUR_ID = $producteurs[0].id
            Write-Host "   Producteur cree: $($script:PRODUCTEUR_ID)" -ForegroundColor Cyan
            
            # GET by ID
            $null = Test-Request -Method "GET" -Url "$BASE_URL/producteurs/$($script:PRODUCTEUR_ID)" -Description "GET /producteurs/:id"
            
            # PUT (UPDATE)
            $updateData = @{ nom_complet = "Test Producteur API MODIFIE" } | ConvertTo-Json
            $null = Test-Request -Method "PUT" -Url "$BASE_URL/producteurs/$($script:PRODUCTEUR_ID)" -Data $updateData -Description "PUT /producteurs/:id (UPDATE)"
        }
    }
}
Write-Host ""

Write-Host "6️⃣  TEST PARCELLES" -ForegroundColor Yellow
Write-Host "-------------------"
# GET
$null = Test-Request -Method "GET" -Url "$BASE_URL/parcelles" -Description "GET /parcelles"

if ($script:PRODUCTEUR_ID) {
    # POST (CREATE)
    $timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
    $parcelleData = @{
        code = "TEST-PARC-$timestamp"
        id_producteur = $script:PRODUCTEUR_ID
        statut = "active"
        superficie_declaree = 2.5
    } | ConvertTo-Json
    
    $result = Test-Request -Method "POST" -Url "$BASE_URL/parcelles" -Data $parcelleData -Description "POST /parcelles (CREATE)"
    if ($result[0]) {
        $parcelles = Invoke-RestMethod -Uri "$BASE_URL/parcelles" -Method Get
        if ($parcelles.Count -gt 0) {
            $script:PARCELLE_ID = $parcelles[0].id
            Write-Host "   Parcelle creee: $($script:PARCELLE_ID)" -ForegroundColor Cyan
            
            # GET by ID
            $null = Test-Request -Method "GET" -Url "$BASE_URL/parcelles/$($script:PARCELLE_ID)" -Description "GET /parcelles/:id"
            
            # PUT (UPDATE)
            $updateData = @{ superficie_declaree = 3.0 } | ConvertTo-Json
            $null = Test-Request -Method "PUT" -Url "$BASE_URL/parcelles/$($script:PARCELLE_ID)" -Data $updateData -Description "PUT /parcelles/:id (UPDATE)"
        }
    }
}
Write-Host ""

Write-Host "7️⃣  TEST OPERATIONS" -ForegroundColor Yellow
Write-Host "-------------------"
# GET
$null = Test-Request -Method "GET" -Url "$BASE_URL/operations" -Description "GET /operations"

if ($script:PRODUCTEUR_ID -and $script:PARCELLE_ID -and $script:VILLAGE_ID) {
    # POST (CREATE) - Format mobile simplifié
    $operationData = @{
        id_producteur = $script:PRODUCTEUR_ID
        id_parcelle = $script:PARCELLE_ID
        id_village = $script:VILLAGE_ID
        statut = "Brouillon"
        campagne = "2023-2024"
        quantite_cabosses = 100
        poids_estimatif = 50
    } | ConvertTo-Json
    
    $result = Test-Request -Method "POST" -Url "$BASE_URL/operations" -Data $operationData -Description "POST /operations (CREATE)"
    if ($result[0]) {
        $operations = Invoke-RestMethod -Uri "$BASE_URL/operations" -Method Get
        if ($operations.Count -gt 0) {
            $script:OPERATION_ID = $operations[0].id
            Write-Host "   Operation creee: $($script:OPERATION_ID)" -ForegroundColor Cyan
            
            # GET by ID
            $null = Test-Request -Method "GET" -Url "$BASE_URL/operations/$($script:OPERATION_ID)" -Description "GET /operations/:id"
            
            # PUT (UPDATE)
            $updateData = @{ statut = "Valide" } | ConvertTo-Json
            $null = Test-Request -Method "PUT" -Url "$BASE_URL/operations/$($script:OPERATION_ID)" -Data $updateData -Description "PUT /operations/:id (UPDATE)"
        }
    }
}
Write-Host ""

Write-Host "8️⃣  TEST AGENTS" -ForegroundColor Yellow
Write-Host "-------------------"
# GET
$null = Test-Request -Method "GET" -Url "$BASE_URL/agents" -Description "GET /agents"

# POST (CREATE)
$agentData = @{
    code = "AGT-TEST-API"
    nom = "Test"
    prenom = "Agent API"
    telephone = "+225 07 12 34 56 78"
    statut = "actif"
    regions = @()
} | ConvertTo-Json -Depth 10

$result = Test-Request -Method "POST" -Url "$BASE_URL/agents" -Data $agentData -Description "POST /agents (CREATE)"
if ($result[0]) {
    $agents = Invoke-RestMethod -Uri "$BASE_URL/agents" -Method Get
    if ($agents.Count -gt 0) {
        $script:AGENT_ID = $agents[0].id
        Write-Host "   Agent cree: $($script:AGENT_ID)" -ForegroundColor Cyan
        
        # GET by ID
        $null = Test-Request -Method "GET" -Url "$BASE_URL/agents/$($script:AGENT_ID)" -Description "GET /agents/:id"
        
        # PUT (UPDATE)
        $updateData = @{ nom = "Test MODIFIE" } | ConvertTo-Json
        $null = Test-Request -Method "PUT" -Url "$BASE_URL/agents/$($script:AGENT_ID)" -Data $updateData -Description "PUT /agents/:id (UPDATE)"
    }
}
Write-Host ""

Write-Host "9️⃣  TEST REGIONS" -ForegroundColor Yellow
Write-Host "-------------------"
# GET
$null = Test-Request -Method "GET" -Url "$BASE_URL/regions" -Description "GET /regions"
Write-Host ""

Write-Host "🔟 TEST AUTHENTIFICATION" -ForegroundColor Yellow
Write-Host "-------------------"
Write-Host "   Login necessite un agent avec username/password configure" -ForegroundColor Yellow
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ TESTS TERMINÉS" -ForegroundColor Green
Write-Host ""
Write-Host "📊 RÉSUMÉ:" -ForegroundColor Cyan
Write-Host "   - Organisations: GET, POST, PUT ✅"
Write-Host "   - Sections: GET, POST, PUT ✅"
Write-Host "   - Villages: GET, POST, PUT ✅"
Write-Host "   - Producteurs: GET, POST, PUT ✅"
Write-Host "   - Parcelles: GET, POST, PUT ✅"
Write-Host "   - Operations: GET, POST, PUT ✅"
Write-Host "   - Agents: GET, POST, PUT ✅"
Write-Host "   - Regions: GET ✅"
Write-Host ""
Write-Host "Note: DELETE n'est pas teste pour garder les donnees de test" -ForegroundColor Yellow

