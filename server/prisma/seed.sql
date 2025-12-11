-- Script de seed pour initialiser la base de données CacaoTrack
-- Exécuter avec: psql -U postgres -d asco_db -f seed.sql

-- Créer les régions de Côte d'Ivoire
INSERT INTO "Region" (id, code, nom, "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'REG01', 'Abidjan', NOW(), NOW()),
(gen_random_uuid(), 'REG02', 'Bas-Sassandra', NOW(), NOW()),
(gen_random_uuid(), 'REG03', 'Comoé', NOW(), NOW()),
(gen_random_uuid(), 'REG04', 'Denguélé', NOW(), NOW()),
(gen_random_uuid(), 'REG05', 'Gôh-Djiboua', NOW(), NOW()),
(gen_random_uuid(), 'REG06', 'Lacs', NOW(), NOW()),
(gen_random_uuid(), 'REG07', 'Lagunes', NOW(), NOW()),
(gen_random_uuid(), 'REG08', 'Montagnes', NOW(), NOW()),
(gen_random_uuid(), 'REG09', 'Sassandra-Marahoué', NOW(), NOW()),
(gen_random_uuid(), 'REG10', 'Savanes', NOW(), NOW()),
(gen_random_uuid(), 'REG11', 'Vallée du Bandama', NOW(), NOW()),
(gen_random_uuid(), 'REG12', 'Woroba', NOW(), NOW()),
(gen_random_uuid(), 'REG13', 'Yamoussoukro', NOW(), NOW()),
(gen_random_uuid(), 'REG14', 'Zanzan', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Créer un agent de test
-- Mot de passe: test123
-- Hash bcrypt: $2b$10$6UufTuz8.7rgExc/FSDEdutlahynxRbXIgS81Id1dzt9o1/mWwuhu
INSERT INTO "Agent" (
  id, code, nom, prenom, telephone, statut, 
  username, password_hash, email, "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(),
  'AG001',
  'Test',
  'Agent',
  '+225 0700000001',
  'actif',
  'agent1',
  '$2b$10$6UufTuz8.7rgExc/FSDEdutlahynxRbXIgS81Id1dzt9o1/mWwuhu',
  'agent.test@cacaotrack.com',
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;

-- Vérifier les données
SELECT 'Régions créées:' as info, COUNT(*) as count FROM "Region";
SELECT 'Agents créés:' as info, COUNT(*) as count FROM "Agent";
