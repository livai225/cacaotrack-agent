# 🧪 Test Complet de Toutes les API

## 📋 Script de Test Automatique

Un script de test complet a été créé : `test-all-apis.sh`

### Utilisation

```bash
# Sur le serveur
cd /var/www/cacaotrack-agent
bash test-all-apis.sh
```

Le script teste automatiquement :
- ✅ GET (récupération)
- ✅ POST (création)
- ✅ PUT (mise à jour)
- ✅ DELETE (suppression - commenté pour garder les données)

## 📝 Tests Manuels avec curl

### 1. Health Check

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api
```

### 2. Organisations

```bash
# GET (Liste)
curl http://localhost:3000/api/organisations

# GET (Par ID)
curl http://localhost:3000/api/organisations/ID_ORGANISATION

# POST (CREATE)
curl -X POST http://localhost:3000/api/organisations \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test Organisation",
    "type": "Coopérative",
    "statut": "actif",
    "region": "Lôh-Djiboua",
    "departement": "Divo",
    "sous_prefecture": "Divo",
    "localite": "Divo",
    "president_nom": "Test President",
    "president_contact": ["+225 07 12 34 56 78"],
    "potentiel_production": 1000
  }'

# PUT (UPDATE)
curl -X PUT http://localhost:3000/api/organisations/ID_ORGANISATION \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Organisation Modifiée",
    "statut": "inactif"
  }'

# DELETE
curl -X DELETE http://localhost:3000/api/organisations/ID_ORGANISATION
```

### 3. Sections

```bash
# GET
curl http://localhost:3000/api/sections

# POST
curl -X POST http://localhost:3000/api/sections \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test Section",
    "id_organisation": "ID_ORG",
    "statut": "actif",
    "localite": "Divo",
    "president_nom": "Test Responsable",
    "president_contact": ["+225 07 12 34 56 78"]
  }'

# PUT
curl -X PUT http://localhost:3000/api/sections/ID_SECTION \
  -H "Content-Type: application/json" \
  -d '{"nom": "Section Modifiée"}'

# DELETE
curl -X DELETE http://localhost:3000/api/sections/ID_SECTION
```

### 4. Villages

```bash
# GET
curl http://localhost:3000/api/villages

# POST
curl -X POST http://localhost:3000/api/villages \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test Village",
    "id_section": "ID_SECTION",
    "type": "Village",
    "statut": "actif",
    "localite": "Divo",
    "chef_nom": "Test Chef",
    "chef_contact": ["+225 07 12 34 56 78"]
  }'

# PUT
curl -X PUT http://localhost:3000/api/villages/ID_VILLAGE \
  -H "Content-Type: application/json" \
  -d '{"nom": "Village Modifié"}'

# DELETE
curl -X DELETE http://localhost:3000/api/villages/ID_VILLAGE
```

### 5. Producteurs

```bash
# GET
curl http://localhost:3000/api/producteurs

# POST
curl -X POST http://localhost:3000/api/producteurs \
  -H "Content-Type: application/json" \
  -d '{
    "nom_complet": "Test Producteur",
    "id_village": "ID_VILLAGE",
    "statut": "actif",
    "sexe": "M"
  }'

# PUT
curl -X PUT http://localhost:3000/api/producteurs/ID_PRODUCTEUR \
  -H "Content-Type: application/json" \
  -d '{"nom_complet": "Producteur Modifié"}'

# DELETE
curl -X DELETE http://localhost:3000/api/producteurs/ID_PRODUCTEUR
```

### 6. Parcelles

```bash
# GET
curl http://localhost:3000/api/parcelles

# POST
curl -X POST http://localhost:3000/api/parcelles \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PARC-TEST-001",
    "id_producteur": "ID_PRODUCTEUR",
    "statut": "active",
    "superficie_declaree": 2.5
  }'

# PUT
curl -X PUT http://localhost:3000/api/parcelles/ID_PARCELLE \
  -H "Content-Type: application/json" \
  -d '{"superficie_declaree": 3.0}'

# DELETE
curl -X DELETE http://localhost:3000/api/parcelles/ID_PARCELLE
```

### 7. Operations

```bash
# GET
curl http://localhost:3000/api/operations

# POST (Format mobile simplifié)
curl -X POST http://localhost:3000/api/operations \
  -H "Content-Type: application/json" \
  -d '{
    "id_producteur": "ID_PRODUCTEUR",
    "id_parcelle": "ID_PARCELLE",
    "id_village": "ID_VILLAGE",
    "statut": "Brouillon",
    "campagne": "2023-2024",
    "quantite_cabosses": 100,
    "poids_estimatif": 50
  }'

# PUT
curl -X PUT http://localhost:3000/api/operations/ID_OPERATION \
  -H "Content-Type: application/json" \
  -d '{"statut": "Validé"}'

# DELETE
curl -X DELETE http://localhost:3000/api/operations/ID_OPERATION
```

### 8. Agents

```bash
# GET
curl http://localhost:3000/api/agents

# POST
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AGT-TEST",
    "nom": "Test",
    "prenom": "Agent",
    "telephone": "+225 07 12 34 56 78",
    "statut": "actif",
    "regions": []
  }'

# PUT
curl -X PUT http://localhost:3000/api/agents/ID_AGENT \
  -H "Content-Type: application/json" \
  -d '{"nom": "Agent Modifié"}'

# DELETE
curl -X DELETE http://localhost:3000/api/agents/ID_AGENT
```

### 9. Regions

```bash
# GET
curl http://localhost:3000/api/regions

# POST
curl -X POST http://localhost:3000/api/regions \
  -H "Content-Type: application/json" \
  -d '{
    "code": "REG-TEST",
    "nom": "Test Region"
  }'
```

## ✅ Résultats Attendus

- **GET** : Retourne 200 avec les données
- **POST** : Retourne 200/201 avec l'objet créé
- **PUT** : Retourne 200 avec l'objet modifié
- **DELETE** : Retourne 200 avec message de confirmation

## ⚠️ Codes d'Erreur Possibles

- **400** : Données invalides
- **404** : Ressource non trouvée
- **409** : Conflit (code déjà existant)
- **500** : Erreur serveur

