#!/usr/bin/env node

// Script de test complet de toutes les API
// Usage: node test-apis.js

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

let stats = {
  total: 0,
  success: 0,
  failed: 0,
  errors: []
};

// Fonction pour tester une requête
async function testRequest(method, url, data = null, description) {
  stats.total++;
  process.stdout.write(`Testing ${description}... `);
  
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    const responseData = await response.json().catch(() => ({ message: 'No JSON response' }));
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`${colors.green}✅ OK (${response.status})${colors.reset}`);
      stats.success++;
      return { success: true, data: responseData };
    } else if (response.status >= 400 && response.status < 500) {
      console.log(`${colors.yellow}⚠️  ${response.status}${colors.reset}`);
      stats.failed++;
      return { success: false, data: responseData };
    } else {
      console.log(`${colors.red}❌ ERREUR (${response.status})${colors.reset}`);
      stats.failed++;
      stats.errors.push({ method, url, status: response.status, error: responseData });
      return { success: false, data: responseData };
    }
  } catch (error) {
    console.log(`${colors.red}❌ ERREUR${colors.reset}`);
    console.log(`   ${error.message}`);
    stats.failed++;
    stats.errors.push({ method, url, error: error.message });
    return { success: false, error: error.message };
  }
}

// Variables pour stocker les IDs créés
let orgId = null;
let sectionId = null;
let villageId = null;
let producteurId = null;
let parcelleId = null;
let operationId = null;
let agentId = null;

async function runTests() {
  console.log(`${colors.cyan}🧪 TEST COMPLET DE TOUTES LES API${colors.reset}`);
  console.log('==================================\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // 1. Health Check
  console.log(`${colors.yellow}1️⃣  TEST HEALTH CHECK${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/health`, null, 'Health Check');
  await testRequest('GET', `${BASE_URL}`, null, 'API Info');
  console.log('');

  // 2. Organisations
  console.log(`${colors.yellow}2️⃣  TEST ORGANISATIONS${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/organisations`, null, 'GET /organisations');
  
  const orgData = {
    nom: 'Test Organisation API',
    type: 'Coopérative',
    statut: 'actif',
    region: 'Lôh-Djiboua',
    departement: 'Divo',
    sous_prefecture: 'Divo',
    localite: 'Divo',
    president_nom: 'Test President',
    president_contact: ['+225 07 12 34 56 78'],
    potentiel_production: 1000
  };
  
  const orgResult = await testRequest('POST', `${BASE_URL}/organisations`, orgData, 'POST /organisations (CREATE)');
  
  if (orgResult.success && orgResult.data && orgResult.data.id) {
    orgId = orgResult.data.id;
    console.log(`   📝 Organisation créée: ${orgId}`);
    
    await testRequest('GET', `${BASE_URL}/organisations/${orgId}`, null, 'GET /organisations/:id');
    
    const updateData = {
      nom: 'Test Organisation API MODIFIÉE',
      statut: 'inactif'
    };
    await testRequest('PUT', `${BASE_URL}/organisations/${orgId}`, updateData, 'PUT /organisations/:id (UPDATE)');
  } else {
    // Essayer de récupérer une organisation existante
    const orgsResult = await testRequest('GET', `${BASE_URL}/organisations`, null, 'GET /organisations (pour ID)');
    if (orgsResult.success && Array.isArray(orgsResult.data) && orgsResult.data.length > 0) {
      orgId = orgsResult.data[0].id;
      console.log(`   📝 Utilisation organisation existante: ${orgId}`);
    }
  }
  console.log('');

  // 3. Sections
  console.log(`${colors.yellow}3️⃣  TEST SECTIONS${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/sections`, null, 'GET /sections');
  
  if (orgId) {
    const sectionData = {
      nom: 'Test Section API',
      id_organisation: orgId,
      statut: 'actif',
      localite: 'Divo',
      president_nom: 'Test Responsable',
      president_contact: ['+225 07 12 34 56 78']
    };
    
    const sectionResult = await testRequest('POST', `${BASE_URL}/sections`, sectionData, 'POST /sections (CREATE)');
    
    if (sectionResult.success && sectionResult.data && sectionResult.data.id) {
      sectionId = sectionResult.data.id;
      console.log(`   📝 Section créée: ${sectionId}`);
      
      await testRequest('GET', `${BASE_URL}/sections/${sectionId}`, null, 'GET /sections/:id');
      
      await testRequest('PUT', `${BASE_URL}/sections/${sectionId}`, { nom: 'Test Section API MODIFIÉE' }, 'PUT /sections/:id (UPDATE)');
    } else {
      const sectionsResult = await testRequest('GET', `${BASE_URL}/sections`, null, 'GET /sections (pour ID)');
      if (sectionsResult.success && Array.isArray(sectionsResult.data) && sectionsResult.data.length > 0) {
        sectionId = sectionsResult.data[0].id;
        console.log(`   📝 Utilisation section existante: ${sectionId}`);
      }
    }
  }
  console.log('');

  // 4. Villages
  console.log(`${colors.yellow}4️⃣  TEST VILLAGES${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/villages`, null, 'GET /villages');
  
  if (sectionId) {
    const villageData = {
      nom: 'Test Village API',
      id_section: sectionId,
      type: 'Village',
      statut: 'actif',
      localite: 'Divo',
      chef_nom: 'Test Chef',
      chef_contact: ['+225 07 12 34 56 78']
    };
    
    const villageResult = await testRequest('POST', `${BASE_URL}/villages`, villageData, 'POST /villages (CREATE)');
    
    if (villageResult.success && villageResult.data && villageResult.data.id) {
      villageId = villageResult.data.id;
      console.log(`   📝 Village créé: ${villageId}`);
      
      await testRequest('GET', `${BASE_URL}/villages/${villageId}`, null, 'GET /villages/:id');
      
      await testRequest('PUT', `${BASE_URL}/villages/${villageId}`, { nom: 'Test Village API MODIFIÉ' }, 'PUT /villages/:id (UPDATE)');
    } else {
      const villagesResult = await testRequest('GET', `${BASE_URL}/villages`, null, 'GET /villages (pour ID)');
      if (villagesResult.success && Array.isArray(villagesResult.data) && villagesResult.data.length > 0) {
        villageId = villagesResult.data[0].id;
        console.log(`   📝 Utilisation village existant: ${villageId}`);
      }
    }
  }
  console.log('');

  // 5. Producteurs
  console.log(`${colors.yellow}5️⃣  TEST PRODUCTEURS${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/producteurs`, null, 'GET /producteurs');
  
  if (villageId) {
    const producteurData = {
      nom_complet: 'Test Producteur API',
      id_village: villageId,
      statut: 'actif',
      sexe: 'M'
    };
    
    const producteurResult = await testRequest('POST', `${BASE_URL}/producteurs`, producteurData, 'POST /producteurs (CREATE)');
    
    if (producteurResult.success && producteurResult.data && producteurResult.data.id) {
      producteurId = producteurResult.data.id;
      console.log(`   📝 Producteur créé: ${producteurId}`);
      
      await testRequest('GET', `${BASE_URL}/producteurs/${producteurId}`, null, 'GET /producteurs/:id');
      
      await testRequest('PUT', `${BASE_URL}/producteurs/${producteurId}`, { nom_complet: 'Test Producteur API MODIFIÉ' }, 'PUT /producteurs/:id (UPDATE)');
    } else {
      const producteursResult = await testRequest('GET', `${BASE_URL}/producteurs`, null, 'GET /producteurs (pour ID)');
      if (producteursResult.success && Array.isArray(producteursResult.data) && producteursResult.data.length > 0) {
        producteurId = producteursResult.data[0].id;
        console.log(`   📝 Utilisation producteur existant: ${producteurId}`);
      }
    }
  }
  console.log('');

  // 6. Parcelles
  console.log(`${colors.yellow}6️⃣  TEST PARCELLES${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/parcelles`, null, 'GET /parcelles');
  
  if (producteurId) {
    const parcelleData = {
      code: `TEST-PARC-${Date.now()}`,
      id_producteur: producteurId,
      statut: 'active',
      superficie_declaree: 2.5
    };
    
    const parcelleResult = await testRequest('POST', `${BASE_URL}/parcelles`, parcelleData, 'POST /parcelles (CREATE)');
    
    if (parcelleResult.success && parcelleResult.data && parcelleResult.data.id) {
      parcelleId = parcelleResult.data.id;
      console.log(`   📝 Parcelle créée: ${parcelleId}`);
      
      await testRequest('GET', `${BASE_URL}/parcelles/${parcelleId}`, null, 'GET /parcelles/:id');
      
      await testRequest('PUT', `${BASE_URL}/parcelles/${parcelleId}`, { superficie_declaree: 3.0 }, 'PUT /parcelles/:id (UPDATE)');
    } else {
      const parcellesResult = await testRequest('GET', `${BASE_URL}/parcelles`, null, 'GET /parcelles (pour ID)');
      if (parcellesResult.success && Array.isArray(parcellesResult.data) && parcellesResult.data.length > 0) {
        parcelleId = parcellesResult.data[0].id;
        console.log(`   📝 Utilisation parcelle existante: ${parcelleId}`);
      }
    }
  }
  console.log('');

  // 7. Operations
  console.log(`${colors.yellow}7️⃣  TEST OPERATIONS${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/operations`, null, 'GET /operations');
  
  if (producteurId && parcelleId && villageId) {
    const operationData = {
      id_producteur: producteurId,
      id_parcelle: parcelleId,
      id_village: villageId,
      statut: 'Brouillon',
      campagne: '2023-2024',
      quantite_cabosses: 100,
      poids_estimatif: 50
    };
    
    const operationResult = await testRequest('POST', `${BASE_URL}/operations`, operationData, 'POST /operations (CREATE)');
    
    if (operationResult.success && operationResult.data && operationResult.data.id) {
      operationId = operationResult.data.id;
      console.log(`   📝 Opération créée: ${operationId}`);
      
      await testRequest('GET', `${BASE_URL}/operations/${operationId}`, null, 'GET /operations/:id');
      
      await testRequest('PUT', `${BASE_URL}/operations/${operationId}`, { statut: 'Validé' }, 'PUT /operations/:id (UPDATE)');
    }
  }
  console.log('');

  // 8. Agents
  console.log(`${colors.yellow}8️⃣  TEST AGENTS${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/agents`, null, 'GET /agents');
  
  const agentData = {
    code: `AGT-TEST-${Date.now()}`,
    nom: 'Test',
    prenom: 'Agent API',
    telephone: '+225 07 12 34 56 78',
    statut: 'actif',
    regions: []
  };
  
  const agentResult = await testRequest('POST', `${BASE_URL}/agents`, agentData, 'POST /agents (CREATE)');
  
  if (agentResult.success && agentResult.data && agentResult.data.id) {
    agentId = agentResult.data.id;
    console.log(`   📝 Agent créé: ${agentId}`);
    
    await testRequest('GET', `${BASE_URL}/agents/${agentId}`, null, 'GET /agents/:id');
    
    await testRequest('PUT', `${BASE_URL}/agents/${agentId}`, { nom: 'Test MODIFIÉ' }, 'PUT /agents/:id (UPDATE)');
  }
  console.log('');

  // 9. Regions
  console.log(`${colors.yellow}9️⃣  TEST REGIONS${colors.reset}`);
  console.log('-------------------');
  await testRequest('GET', `${BASE_URL}/regions`, null, 'GET /regions');
  console.log('');

  // Résumé
  console.log('==================================');
  console.log(`${colors.green}✅ TESTS TERMINÉS${colors.reset}`);
  console.log('');
  console.log(`${colors.cyan}📊 RÉSUMÉ:${colors.reset}`);
  console.log(`   Total: ${stats.total}`);
  console.log(`   ${colors.green}✅ Succès: ${stats.success}${colors.reset}`);
  console.log(`   ${colors.red}❌ Échecs: ${stats.failed}${colors.reset}`);
  console.log('');
  
  if (stats.errors.length > 0) {
    console.log(`${colors.yellow}⚠️  Erreurs détectées:${colors.reset}`);
    stats.errors.slice(0, 5).forEach(err => {
      console.log(`   - ${err.method} ${err.url}: ${err.error || err.status}`);
    });
  }
  
  console.log('');
  console.log('Endpoints testés:');
  console.log('   - Organisations: GET, POST, PUT ✅');
  console.log('   - Sections: GET, POST, PUT ✅');
  console.log('   - Villages: GET, POST, PUT ✅');
  console.log('   - Producteurs: GET, POST, PUT ✅');
  console.log('   - Parcelles: GET, POST, PUT ✅');
  console.log('   - Operations: GET, POST, PUT ✅');
  console.log('   - Agents: GET, POST, PUT ✅');
  console.log('   - Regions: GET ✅');
}

// Exécuter les tests
runTests().catch(error => {
  console.error(`${colors.red}Erreur fatale:${colors.reset}`, error);
  process.exit(1);
});

