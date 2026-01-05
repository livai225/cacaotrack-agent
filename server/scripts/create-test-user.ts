import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔵 Création de l\'utilisateur de test...');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.agent.findUnique({
      where: { username: 'test' }
    });

    if (existingUser) {
      console.log('⚠️  L\'utilisateur "test" existe déjà. Mise à jour du mot de passe...');
      
      // Mettre à jour le mot de passe
      const password_hash = await bcrypt.hash('test123', 10);
      const updated = await prisma.agent.update({
        where: { username: 'test' },
        data: {
          password_hash,
          statut: 'actif'
        }
      });

      console.log('✅ Utilisateur mis à jour avec succès!');
      console.log('📋 Informations de connexion:');
      console.log('   Username: test');
      console.log('   Password: test123');
      console.log('   Code:', updated.code);
      console.log('   Nom:', updated.nom, updated.prenom);
      return;
    }

    // Créer un nouvel utilisateur de test
    const password_hash = await bcrypt.hash('test123', 10);

    // Récupérer une région pour l'associer (ou créer une région par défaut)
    let region = await prisma.region.findFirst();
    
    if (!region) {
      console.log('⚠️  Aucune région trouvée. Création d\'une région par défaut...');
      region = await prisma.region.create({
        data: {
          code: 'REG001',
          nom: 'Région Test',
          description: 'Région créée pour les tests'
        }
      });
    }

    const agent = await prisma.agent.create({
      data: {
        code: 'TEST001',
        nom: 'Test',
        prenom: 'Utilisateur',
        email: 'test@cacaotrack.com',
        telephone: '0123456789',
        username: 'test',
        password_hash,
        statut: 'actif',
        date_naissance: new Date('1990-01-01'),
        lieu_naissance: 'Abidjan',
        nationalite: 'Ivoirienne',
        type_piece: 'CNI',
        numero_piece: 'CI123456789',
        regions: {
          create: {
            id_region: region.id,
            statut: 'actif'
          }
        }
      },
      include: {
        regions: {
          include: {
            region: true
          }
        }
      }
    });

    console.log('✅ Utilisateur de test créé avec succès!');
    console.log('📋 Informations de connexion:');
    console.log('   Username: test');
    console.log('   Password: test123');
    console.log('   Code:', agent.code);
    console.log('   Nom:', agent.nom, agent.prenom);
    console.log('   Régions:', agent.regions.map(ar => ar.region.nom).join(', '));

  } catch (error: any) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createTestUser()
  .then(() => {
    console.log('✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
