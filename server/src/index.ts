import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Augmenter la limite pour les photos en Base64 (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Routes de Santé et Informations ---

// Route racine de l'API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API CacaoTrack - Système de Gestion de la Filière Cacao',
    version: '2.4.0',
    status: 'running',
    database: 'PostgreSQL + PostGIS',
    endpoints: {
      organisations: '/api/organisations',
      sections: '/api/sections',
      villages: '/api/villages',
      producteurs: '/api/producteurs',
      parcelles: '/api/parcelles',
      operations: '/api/operations',
      agents: '/api/agents',
      regions: '/api/regions',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Route de santé (health check)
app.get('/api/health', async (req, res) => {
  try {
    // Test de connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Route de vérification PostGIS
app.get('/api/postgis', async (req, res) => {
  try {
    const result: any = await prisma.$queryRaw`SELECT PostGIS_version() as version`;
    res.json({
      success: true,
      postgis: 'enabled',
      version: result[0]?.version || 'unknown',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      postgis: 'error',
      error: 'PostGIS check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// --- Routes ---

// Organisations
app.get('/api/organisations', async (req, res) => {
  const orgs = await prisma.organisation.findMany();
  res.json(orgs);
});
app.get('/api/organisations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const org = await prisma.organisation.findUnique({ where: { id } });

    if (!org) {
      return res.status(404).json({ error: "Organisation non trouvée" });
    }

    // Calcul des statistiques à la volée
    const nbSections = await prisma.section.count({ where: { id_organisation: id } });

    // Pour les villages et producteurs, on passe par les relations
    // Note: Si la relation directe n'existe pas dans le schéma pour Producteur->Organisation, on passe par Section->Village
    // Mais le schéma actuel semble lier Section->Organisation et Village->Section.

    const nbVillages = await prisma.village.count({
      where: { section: { id_organisation: id } }
    });

    const nbProducteurs = await prisma.producteur.count({
      where: { village: { section: { id_organisation: id } } }
    });

    const nbParcelles = await prisma.parcelle.count({
      where: { producteur: { village: { section: { id_organisation: id } } } }
    });

    res.json({ ...org, stats: { nbSections, nbVillages, nbProducteurs, nbParcelles } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.put('/api/organisations/:id', async (req, res) => {
  try {
    const updated = await prisma.organisation.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur mise à jour organisation" });
  }
});

app.delete('/api/organisations/:id', async (req, res) => {
  try {
    await prisma.organisation.delete({ where: { id: req.params.id } });
    res.json({ message: "Organisation supprimée" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur suppression organisation" });
  }
});

// Sections
app.get('/api/sections', async (req, res) => {
  const sections = await prisma.section.findMany();
  res.json(sections);
});
app.get('/api/sections/:id', async (req, res) => {
  const section = await prisma.section.findUnique({ where: { id: req.params.id } });
  res.json(section);
});

app.put('/api/sections/:id', async (req, res) => {
  try {
    const updated = await prisma.section.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur mise à jour section" });
  }
});

app.delete('/api/sections/:id', async (req, res) => {
  try {
    await prisma.section.delete({ where: { id: req.params.id } });
    res.json({ message: "Section supprimée" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur suppression section" });
  }
});

// Villages
app.get('/api/villages', async (req, res) => {
  const villages = await prisma.village.findMany();
  res.json(villages);
});
app.get('/api/villages/:id', async (req, res) => {
  const village = await prisma.village.findUnique({ where: { id: req.params.id } });
  res.json(village);
});

app.put('/api/villages/:id', async (req, res) => {
  try {
    const updated = await prisma.village.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur mise à jour village" });
  }
});

app.delete('/api/villages/:id', async (req, res) => {
  try {
    await prisma.village.delete({ where: { id: req.params.id } });
    res.json({ message: "Village supprimé" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur suppression village" });
  }
});

// Producteurs
app.get('/api/producteurs', async (req, res) => {
  const producteurs = await prisma.producteur.findMany();
  res.json(producteurs);
});
app.get('/api/producteurs/:id', async (req, res) => {
  const producteur = await prisma.producteur.findUnique({ where: { id: req.params.id } });
  res.json(producteur);
});

app.put('/api/producteurs/:id', async (req, res) => {
  try {
    const updated = await prisma.producteur.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur mise à jour producteur" });
  }
});

app.delete('/api/producteurs/:id', async (req, res) => {
  try {
    await prisma.producteur.delete({ where: { id: req.params.id } });
    res.json({ message: "Producteur supprimé" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur suppression producteur" });
  }
});

// Plantations (Parcelles)
app.get('/api/parcelles', async (req, res) => {
  const parcelles = await prisma.parcelle.findMany();
  res.json(parcelles);
});
app.get('/api/parcelles/:id', async (req, res) => {
  const parcelle = await prisma.parcelle.findUnique({ where: { id: req.params.id } });
  res.json(parcelle);
});

app.put('/api/parcelles/:id', async (req, res) => {
  try {
    const updated = await prisma.parcelle.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur mise à jour parcelle" });
  }
});

app.delete('/api/parcelles/:id', async (req, res) => {
  try {
    await prisma.parcelle.delete({ where: { id: req.params.id } });
    res.json({ message: "Parcelle supprimée" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur suppression parcelle" });
  }
});

// Operations
app.get('/api/operations', async (req, res) => {
  try {
    const operations = await prisma.operation.findMany({
      include: {
        producteur: {
          select: {
            id: true,
            nom_complet: true,
          }
        },
        agent: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            code: true,
          }
        },
        village: {
          select: {
            id: true,
            nom: true,
          }
        },
        parcelle: {
          select: {
            id: true,
            code: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(operations);
  } catch (error: any) {
    console.error('Erreur récupération opérations:', error);
    res.status(500).json({ error: error.message || "Erreur récupération opérations" });
  }
});
app.get('/api/operations/:id', async (req, res) => {
  try {
    const operation = await prisma.operation.findUnique({
      where: { id: req.params.id },
      include: {
        producteur: true,
        agent: true,
        village: true,
        parcelle: true
      }
    });

    if (!operation) {
      return res.status(404).json({ error: "Opération non trouvée" });
    }

    res.json(operation);
  } catch (error: any) {
    console.error('Erreur récupération opération:', error);
    res.status(500).json({ error: error.message || "Erreur récupération opération" });
  }
});

app.post('/api/operations', async (req, res) => {
  try {
    const data = req.body;
    console.log('📥 Données reçues:', JSON.stringify(data, null, 2));

    // Vérification de la structure des données
    if (!data.identification || !data.identification.idProducteur || !data.identification.idPlantation) {
      return res.status(400).json({
        error: "Données d'identification manquantes",
        received: Object.keys(data)
      });
    }

    const { identification, recolte, ecabossage, transport, fermentation, sechage, ensachage, manutention, paiement } = data;

    // 1. Récupérer le producteur pour avoir son ID Village
    const producteur = await prisma.producteur.findUnique({
      where: { id: identification.idProducteur }
    });

    if (!producteur) {
      console.error('❌ Producteur introuvable:', identification.idProducteur);
      return res.status(404).json({ error: "Producteur introuvable", id: identification.idProducteur });
    }

    console.log('✅ Producteur trouvé:', producteur.id, 'Village:', producteur.id_village);

    // Vérifier que la parcelle existe
    const parcelle = await prisma.parcelle.findUnique({
      where: { id: identification.idPlantation }
    });

    if (!parcelle) {
      console.error('❌ Parcelle introuvable:', identification.idPlantation);
      return res.status(404).json({ error: "Parcelle introuvable", id: identification.idPlantation });
    }

    // Fonction helper pour convertir une date string en Date valide
    const parseDate = (dateStr: string | undefined | null): Date | null => {
      if (!dateStr || dateStr.trim() === '') return null;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    };

    // Préparer les données avec gestion des valeurs nulles/undefined
    const operationData: any = {
      id_producteur: identification.idProducteur,
      id_parcelle: identification.idPlantation,
      id_village: producteur.id_village,
      id_agent: identification.idAgent || null,
      campagne: "2023-2024",
      statut: (paiement?.especes || paiement?.cheque) ? "Payé" : "Validé",

      // Récolte
      date_recolte_1: parseDate(recolte?.dateRecolte1),
      date_recolte_2: parseDate(recolte?.dateRecolte2),
      date_recolte_3: parseDate(recolte?.dateRecolte3),

      // Ecabossage
      date_ecabossage: parseDate(ecabossage?.dateEcabossage),
      ecabossage_duree: ecabossage?.dateEcabossage ? "1 jour" : null,
      cout_ecabossage: ecabossage?.cout ?? null,

      // Transport
      date_transport: parseDate(transport?.dateTransport),

      // Fermentation
      fermentation_debut: parseDate(fermentation?.dateDebut),
      fermentation_fin: parseDate(fermentation?.dateFin),
      materiel_feuilles: fermentation?.materiel_feuilles ?? false,
      materiel_caisses: fermentation?.materiel_caisses ?? false,

      // Séchage
      sechage_debut: parseDate(sechage?.dateDebut),
      sechage_fin: parseDate(sechage?.dateFin),
      aire_claie_bambou: sechage?.aire_claie_bambou ?? false,
      aire_bache_noire: sechage?.aire_plastique_sol ?? false,
      aire_ciment: sechage?.aire_cimentee ?? false,

      // Ensachage
      ensachage_debut: parseDate(ensachage?.dateDebut),
      nb_sacs_brousse: ensachage?.nbSacs ?? 0,
      poids_estimatif: ensachage?.poidsEstimatif ?? null,
      date_livraison: parseDate(ensachage?.dateLivraison),

      // Manutention
      manutention_pesee: manutention?.pesee ?? null,
      validation_statut: manutention?.validation || "En attente",

      // Paiement
      paiement_especes: paiement?.especes ?? false,
      montant_especes: paiement?.montantEspeces ?? 0,
      paiement_cheque: paiement?.cheque ?? false,
      montant_cheque: paiement?.montantCheque ?? 0,
      numero_cheque: paiement?.numeroCheque || null,
      banque: paiement?.banque || null,

      retenue_mec: paiement?.retenueMec ?? false,
      retenue_mec_taux: paiement?.tauxMec ?? 0,
      retenue_epargne: paiement?.retenueEpargne ?? false,
      retenue_epargne_taux: paiement?.tauxEpargne ?? 0,
    };

    console.log('💾 Création de l\'opération avec les données:', JSON.stringify(operationData, null, 2));

    const operation = await prisma.operation.create({
      data: operationData
    });

    console.log('✅ Opération créée avec succès:', operation.id);
    res.json(operation);
  } catch (e: any) {
    console.error('❌ Erreur lors de la création de l\'opération:', e);
    console.error('Stack:', e.stack);
    res.status(500).json({
      error: "Erreur lors de la création de l'opération",
      message: e.message,
      code: e.code
    });
  }
});

app.delete('/api/operations/:id', async (req, res) => {
  try {
    await prisma.operation.delete({ where: { id: req.params.id } });
    res.json({ message: "Opération supprimée" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur suppression opération" });
  }
});

// ==================== AGENTS ====================

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        regions: {
          include: { region: true }
        }
      }
    });
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get('/api/agents/:id', async (req, res) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: req.params.id },
      include: {
        regions: {
          include: { region: true }
        },
        operations: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!agent) return res.status(404).json({ error: "Agent non trouvé" });
    res.json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/api/agents', async (req, res) => {
  try {
    const { regions, ...agentData } = req.body;
    const agent = await prisma.agent.create({
      data: agentData
    });

    // Affecter les régions
    if (regions && Array.isArray(regions) && regions.length > 0) {
      await Promise.all(
        regions.map((regionId: string) =>
          prisma.agentRegion.create({
            data: {
              id_agent: agent.id,
              id_region: regionId,
              statut: 'actif'
            }
          })
        )
      );
    }

    const agentWithRegions = await prisma.agent.findUnique({
      where: { id: agent.id },
      include: {
        regions: {
          include: { region: true }
        }
      }
    });

    res.json(agentWithRegions);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur création agent" });
  }
});

app.put('/api/agents/:id', async (req, res) => {
  try {
    const { regions, ...agentData } = req.body;
    const agent = await prisma.agent.update({
      where: { id: req.params.id },
      data: agentData
    });

    // Mettre à jour les affectations régions
    if (regions && Array.isArray(regions)) {
      // Supprimer les anciennes affectations
      await prisma.agentRegion.deleteMany({
        where: { id_agent: req.params.id }
      });

      // Créer les nouvelles
      if (regions.length > 0) {
        await Promise.all(
          regions.map((regionId: string) =>
            prisma.agentRegion.create({
              data: {
                id_agent: req.params.id,
                id_region: regionId,
                statut: 'actif'
              }
            })
          )
        );
      }
    }

    const agentWithRegions = await prisma.agent.findUnique({
      where: { id: agent.id },
      include: {
        regions: {
          include: { region: true }
        }
      }
    });

    res.json(agentWithRegions);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur mise à jour agent" });
  }
});

app.delete('/api/agents/:id', async (req, res) => {
  try {
    await prisma.agent.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Agent supprimé" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur suppression agent" });
  }
});

app.get('/api/agents/:id/stats', async (req, res) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: req.params.id },
      include: {
        operations: true,
        regions: {
          include: { region: true }
        }
      }
    });

    if (!agent) {
      return res.status(404).json({ error: "Agent non trouvé" });
    }

    const maintenant = new Date();
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);

    const operationsMois = agent.operations.filter(
      op => new Date(op.createdAt) >= debutMois
    );

    const stats = {
      id_agent: agent.id,
      nom_complet: `${agent.nom} ${agent.prenom}`,
      nb_operations: agent.operations.length,
      nb_operations_mois: operationsMois.length,
      poids_total: agent.operations.reduce((sum, op) => sum + (op.manutention_pesee || 0), 0),
      poids_mois: operationsMois.reduce((sum, op) => sum + (op.manutention_pesee || 0), 0),
      regions: agent.regions.map(ar => ar.region.nom),
      dernier_operation: agent.operations.length > 0
        ? agent.operations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null
    };

    res.json(stats);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur calcul statistiques" });
  }
});

// ==================== RÉGIONS ====================

app.get('/api/regions', async (req, res) => {
  try {
    const regions = await prisma.region.findMany({
      include: {
        agents: {
          include: { agent: true }
        }
      }
    });
    res.json(regions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get('/api/regions/:id', async (req, res) => {
  try {
    const region = await prisma.region.findUnique({
      where: { id: req.params.id },
      include: {
        agents: {
          include: { agent: true }
        }
      }
    });
    if (!region) return res.status(404).json({ error: "Région non trouvée" });
    res.json(region);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/api/regions', async (req, res) => {
  try {
    const region = await prisma.region.create({
      data: req.body
    });
    res.json(region);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur création région" });
  }
});

app.get('/api/regions/:id/agents', async (req, res) => {
  try {
    const affectations = await prisma.agentRegion.findMany({
      where: {
        id_region: req.params.id,
        statut: 'actif'
      },
      include: {
        agent: {
          include: {
            regions: {
              include: { region: true }
            }
          }
        }
      }
    });
    const agents = affectations.map(aff => aff.agent);
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ==================== AFFECTATIONS ====================

app.post('/api/agents/:idAgent/regions', async (req, res) => {
  try {
    const { id_region } = req.body;
    const affectation = await prisma.agentRegion.create({
      data: {
        id_agent: req.params.idAgent,
        id_region: id_region,
        statut: 'actif'
      },
      include: {
        agent: true,
        region: true
      }
    });
    res.json(affectation);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur affectation" });
  }
});

app.delete('/api/agents/:idAgent/regions/:idRegion', async (req, res) => {
  try {
    await prisma.agentRegion.deleteMany({
      where: {
        id_agent: req.params.idAgent,
        id_region: req.params.idRegion
      }
    });
    res.json({ message: "Affectation retirée" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur retrait affectation" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Serveur ASCO Track démarré sur http://localhost:${PORT}`);
});
