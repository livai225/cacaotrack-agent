import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

// Sections
app.get('/api/sections', async (req, res) => {
  const sections = await prisma.section.findMany();
  res.json(sections);
});
app.get('/api/sections/:id', async (req, res) => {
  const section = await prisma.section.findUnique({ where: { id: req.params.id } });
  res.json(section);
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

// Producteurs
app.get('/api/producteurs', async (req, res) => {
  const producteurs = await prisma.producteur.findMany();
  res.json(producteurs);
});
app.get('/api/producteurs/:id', async (req, res) => {
  const producteur = await prisma.producteur.findUnique({ where: { id: req.params.id } });
  res.json(producteur);
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

// Operations
app.get('/api/operations', async (req, res) => {
  const operations = await prisma.operation.findMany();
  res.json(operations);
});
app.get('/api/operations/:id', async (req, res) => {
  const operation = await prisma.operation.findUnique({ where: { id: req.params.id } });
  res.json(operation);
});

app.post('/api/operations', async (req, res) => {
  try {
    const data = req.body;
    // Conversion des dates strings en objets Date si nécessaire (Prisma gère souvent les ISO strings, mais pour être sûr)
    // Cependant, req.body contient des champs imbriqués (identification, recolte...) venant du form.
    // Il faut les aplatir pour Prisma ou mapper correctement.
    
    // Pour simplifier, on suppose que le client envoie un objet plat ou on le mappe ici.
    // Le Frontend envoie { identification: {...}, recolte: {...} }
    // On doit mapper ça vers le schéma Operation de Prisma.

    // Mapping simplifié (à adapter selon structure exacte du Frontend)
    // Le Frontend envoie un objet structuré par étapes. On va le déstructurer.
    const { identification, recolte, ecabossage, transport, fermentation, sechage, ensachage, manutention, paiement } = data;

    // 1. Récupérer le producteur pour avoir son ID Village
    const producteur = await prisma.producteur.findUnique({
        where: { id: identification.idProducteur }
    });

    if (!producteur) {
        return res.status(404).json({ error: "Producteur introuvable" });
    }

    const operation = await prisma.operation.create({
        data: {
            id_producteur: identification.idProducteur,
            id_parcelle: identification.idPlantation,
            id_village: producteur.id_village, // ID du village récupéré du producteur
            campagne: "2023-2024", // Par défaut
            statut: paiement.especes || paiement.cheque ? "Payé" : "Validé",
            
            // Récolte
            date_recolte_1: new Date(recolte.dateRecolte1),
            date_recolte_2: recolte.dateRecolte2 ? new Date(recolte.dateRecolte2) : null,
            date_recolte_3: recolte.dateRecolte3 ? new Date(recolte.dateRecolte3) : null,
            
            // Ecabossage
            date_ecabossage: new Date(ecabossage.dateEcabossage),
            ecabossage_duree: "1 jour", // Calculé ou par défaut
            cout_ecabossage: ecabossage.cout,
            
            // Transport
            date_transport: new Date(transport.dateTransport),
            
            // Fermentation
            fermentation_debut: new Date(fermentation.dateDebut),
            fermentation_fin: new Date(fermentation.dateFin),
            materiel_feuilles: fermentation.materiel_feuilles,
            materiel_caisses: fermentation.materiel_caisses,
            
            // Séchage
            sechage_debut: new Date(sechage.dateDebut),
            sechage_fin: new Date(sechage.dateFin),
            aire_claie_bambou: sechage.aire_claie_bambou,
            aire_bache_noire: sechage.aire_plastique_sol, // Mapping
            aire_ciment: sechage.aire_cimentee, // Mapping
            
            // Ensachage
            ensachage_debut: new Date(ensachage.dateDebut),
            // ensachage_fin non existant dans DB
            nb_sacs_brousse: ensachage.nbSacs,
            poids_estimatif: ensachage.poidsEstimatif,
            date_livraison: new Date(ensachage.dateLivraison),
            
            // Manutention
            // dechargement, sonde, analyse non existants dans DB pour l'instant
            manutention_pesee: manutention.pesee,
            validation_statut: manutention.validation,
            
            // Paiement
            paiement_especes: paiement.especes,
            montant_especes: paiement.montantEspeces || 0,
            paiement_cheque: paiement.cheque,
            montant_cheque: paiement.montantCheque || 0,
            numero_cheque: paiement.numeroCheque,
            banque: paiement.banque,
            
            retenue_mec: paiement.retenueMec,
            retenue_mec_taux: paiement.tauxMec || 0,
            retenue_epargne: paiement.retenueEpargne,
            retenue_epargne_taux: paiement.tauxEpargne || 0,
        }
    });
    res.json(operation);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur lors de la création de l'opération" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Serveur CacaoTrack démarré sur http://localhost:${PORT}`);
});
