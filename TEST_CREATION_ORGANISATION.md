# 🧪 Test de Création d'Organisation via API

## Test avec curl

```bash
# Test de création d'organisation
curl -X POST http://localhost:3000/api/organisations \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test Organisation 1",
    "type": "Coopérative",
    "statut": "actif",
    "region": "Lôh-Djiboua",
    "departement": "Divo",
    "sous_prefecture": "Divo",
    "localite": "Divo",
    "president_nom": "Jean Kouassi",
    "president_contact": ["+225 07 12 34 56 78"],
    "potentiel_production": 1000
  }'
```

## Test avec plus de détails

```bash
curl -X POST http://localhost:3000/api/organisations \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "SCOOP-CA Test",
    "type": "Coopérative",
    "statut": "actif",
    "region": "Lôh-Djiboua",
    "departement": "Divo",
    "sous_prefecture": "Divo",
    "localite": "Divo",
    "siege_social": "Divo, Côte d'\''Ivoire",
    "president_nom": "Pierre Kouassi",
    "president_contact": ["+225 07 12 34 56 78", "+225 05 12 34 56 78"],
    "secretaire_nom": "Marie Kouassi",
    "secretaire_contact": ["+225 07 98 76 54 32"],
    "potentiel_production": 1500
  }' | jq .
```

## Vérifier les organisations créées

```bash
# Lister toutes les organisations
curl http://localhost:3000/api/organisations | jq .

# Ou avec moins de détails
curl http://localhost:3000/api/organisations | jq '.[] | {id, code, nom, type}'
```

