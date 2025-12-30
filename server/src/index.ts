import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient, Prisma } from '@prisma/client';
import { createRealtimeEmitter } from './realtime';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
const PORT = process.env.PORT || 3000;

app.use(cors());
// Augmenter la limite pour les photos en Base64 (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Socket.IO - Gestion des connexions temps réel
io.on('connection', (socket) => {
  console.log('✅ Client connecté:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client déconnecté:', socket.id);
  });
});

// Émetteur d'événements temps réel
const rt = createRealtimeEmitter(io);

// --- Routes de Santé et Informations ---

// Route racine de l'API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API CacaoTrack - Système de Gestion de la Filière Cacao',
    version: '2.4.0',
    status: 'running',
    database: 'MySQL',
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

// Route de vérification MySQL
app.get('/api/mysql', async (req, res) => {
  try {
    const result: any = await prisma.$queryRaw`SELECT VERSION() as version`;
    res.json({
      success: true,
      mysql: 'connected',
      version: result[0]?.version || 'unknown',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mysql: 'error',
      error: 'MySQL check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== AUTHENTIFICATION ====================

const JWT_SECRET = process.env.JWT_SECRET || 'cacaotrack-secret-key-change-in-production';

// Route de login pour les agents (app mobile)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' });
    }

    // Chercher l'agent par username
    const agent = await prisma.agent.findUnique({
      where: { username },
      select: {
        id: true,
        code: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        photo: true,
        password_hash: true,
        statut: true,
        username: true,
      }
    });

    if (!agent) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    if (agent.statut !== 'actif') {
      return res.status(403).json({ error: 'Compte inactif' });
    }

    if (!agent.password_hash) {
      return res.status(401).json({ error: 'Mot de passe non configuré' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, agent.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { agentId: agent.id, username: agent.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Retourner les infos de l'agent (sans le password_hash)
    const { password_hash, ...agentData } = agent;

    res.json({
      success: true,
      agent: agentData,
      token,
    });

  } catch (error: any) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer/mettre à jour le mot de passe d'un agent
app.post('/api/agents/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Mot de passe trop court (min 6 caractères)' });
    }

    // Hasher le mot de passe
    const password_hash = await bcrypt.hash(password, 10);

    // Mettre à jour l'agent
    const agent = await prisma.agent.update({
      where: { id },
      data: { password_hash },
      select: {
        id: true,
        code: true,
        nom: true,
        prenom: true,
        username: true,
      }
    });

    res.json({
      success: true,
      message: 'Mot de passe mis à jour',
      agent,
    });

  } catch (error: any) {
    console.error('Erreur mise à jour password:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- Routes ---

// Organisations
app.get('/api/organisations', async (req, res) => {
  try {
    const orgs = await prisma.organisation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // S'assurer que les champs JSON sont correctement sérialisés pour MySQL
    const serializedOrgs = orgs.map(org => ({
      ...org,
      president_contact: typeof org.president_contact === 'string' 
        ? JSON.parse(org.president_contact) 
        : org.president_contact,
      dg_contact: org.dg_contact && typeof org.dg_contact === 'string'
        ? JSON.parse(org.dg_contact)
        : org.dg_contact,
      secretaire_contact: org.secretaire_contact && typeof org.secretaire_contact === 'string'
        ? JSON.parse(org.secretaire_contact)
        : org.secretaire_contact,
      tresorier_contact: org.tresorier_contact && typeof org.tresorier_contact === 'string'
        ? JSON.parse(org.tresorier_contact)
        : org.tresorier_contact,
    }));
    res.json(serializedOrgs);
  } catch (error: any) {
    console.error('❌ Erreur récupération organisations:', error);
    console.error('Stack:', error.stack);
    console.error('Message:', error.message);
    res.status(500).json({ 
      error: error.message || "Erreur récupération organisations",
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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

app.post('/api/organisations', async (req, res) => {
  try {
    const data = req.body;
    console.log('📥 Données reçues pour organisation:', JSON.stringify(data, null, 2));
    
    // Validation des champs obligatoires
    if (!data.nom) {
      return res.status(400).json({ error: "Le champ 'nom' est obligatoire" });
    }
    
    // Génération du code si absent
    const code = data.code || `ORG-${Date.now()}`;
    
    // Gestion du champ president_contact (peut être string, array, ou déjà JSON)
    let president_contact: any[] = [];
    if (data.president_contact) {
      if (Array.isArray(data.president_contact)) {
        // Filtrer les valeurs vides
        president_contact = data.president_contact.filter((phone: any) => phone && phone.trim && phone.trim() !== "");
      } else if (typeof data.president_contact === 'string') {
        try {
          // Essayer de parser si c'est une string JSON
          const parsed = JSON.parse(data.president_contact);
          const arr = Array.isArray(parsed) ? parsed : [data.president_contact];
          president_contact = arr.filter((phone: any) => phone && phone.trim && phone.trim() !== "");
        } catch {
          // Sinon, traiter comme un string simple
          if (data.president_contact.trim() !== "") {
            president_contact = [data.president_contact];
          }
        }
      }
    }
    
    // Validation : au moins un contact est requis pour le président
    if (president_contact.length === 0) {
      return res.status(400).json({ error: "Au moins un numéro de téléphone du président est requis" });
    }
    
    // Gestion du champ secretaire_contact
    let secretaire_contact: any[] | null = null;
    if (data.secretaire_contact) {
      if (Array.isArray(data.secretaire_contact)) {
        secretaire_contact = data.secretaire_contact;
      } else if (typeof data.secretaire_contact === 'string') {
        try {
          const parsed = JSON.parse(data.secretaire_contact);
          secretaire_contact = Array.isArray(parsed) ? parsed : [data.secretaire_contact];
        } catch {
          secretaire_contact = [data.secretaire_contact];
        }
      }
    }
    
    // Gestion du champ dg_contact
    let dg_contact: any[] | null = null;
    if (data.dg_contact) {
      if (Array.isArray(data.dg_contact)) {
        dg_contact = data.dg_contact;
      } else if (typeof data.dg_contact === 'string') {
        try {
          const parsed = JSON.parse(data.dg_contact);
          dg_contact = Array.isArray(parsed) ? parsed : [data.dg_contact];
        } catch {
          dg_contact = [data.dg_contact];
        }
      }
    }
    
    // Gestion du champ tresorier_contact
    let tresorier_contact: any[] | null = null;
    if (data.tresorier_contact) {
      if (Array.isArray(data.tresorier_contact)) {
        tresorier_contact = data.tresorier_contact;
      } else if (typeof data.tresorier_contact === 'string') {
        try {
          const parsed = JSON.parse(data.tresorier_contact);
          tresorier_contact = Array.isArray(parsed) ? parsed : [data.tresorier_contact];
        } catch {
          tresorier_contact = [data.tresorier_contact];
        }
      }
    }
    
    // Préparation des données conformes au schéma
    const orgData: any = {
      code,
      nom: data.nom,
      type: data.type || 'Coopérative',
      statut: data.statut || 'actif',
      localite: data.localite || 'Indéfini',
      
      // Champs obligatoires avec valeurs par défaut
      region: data.region || 'Indéfini',
      departement: data.departement || 'Indéfini',
      sous_prefecture: data.sous_prefecture || 'Indéfini',
      
      // Contacts (Conversion string -> Json/Array)
      // Prisma attend un array pour les champs Json
      president_nom: data.president_nom || 'Non défini',
      president_contact: president_contact.length > 0 ? president_contact : [],
      secretaire_nom: data.secretaire_nom || null,
      secretaire_contact: secretaire_contact && secretaire_contact.length > 0 ? secretaire_contact : null,
      
      // Champs optionnels
      siege_social: data.siege_social || null,
      email: data.email || null,
      telephone: data.telephone || null,
      dg_nom: data.dg_nom || null,
      dg_contact: dg_contact && dg_contact.length > 0 ? dg_contact : null,
      tresorier_nom: data.tresorier_nom || null,
      tresorier_contact: tresorier_contact && tresorier_contact.length > 0 ? tresorier_contact : null,
      
      // Métriques (le champ photo n'existe pas dans le schéma Organisation, on l'ignore)
      potentiel_production: data.potentiel_production ? parseFloat(data.potentiel_production) : 0,
    };

    console.log('💾 Création organisation avec données:', JSON.stringify(orgData, null, 2));
    const org = await prisma.organisation.create({ data: orgData });
    console.log('✅ Organisation créée avec succès:', org.id);
    res.json(org);
  } catch (error: any) {
    console.error('❌ Erreur création organisation:', error);
    console.error('Stack:', error.stack);
    console.error('Code erreur:', error.code);
    
    // Gestion des erreurs spécifiques Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Une organisation avec ce code existe déjà",
        field: error.meta?.target 
      });
    }
    
    res.status(500).json({ 
      error: error.message || "Erreur création organisation",
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.put('/api/organisations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log('📥 PUT /api/organisations/:id - ID:', id);
    console.log('📥 Données reçues pour mise à jour organisation:', JSON.stringify(data, null, 2));
    
    // Vérifier que l'organisation existe avant de la mettre à jour
    const existingOrg = await prisma.organisation.findUnique({
      where: { id }
    });
    
    if (!existingOrg) {
      console.error('❌ Organisation introuvable pour mise à jour:', id);
      return res.status(404).json({ 
        error: "Organisation introuvable",
        id: id 
      });
    }
    
    console.log('✅ Organisation trouvée:', existingOrg.nom);
    
    // Gestion du champ president_contact (peut être string, array, ou déjà JSON)
    let president_contact: any[] | undefined = undefined;
    if (data.president_contact !== undefined) {
      if (Array.isArray(data.president_contact)) {
        president_contact = data.president_contact;
      } else if (typeof data.president_contact === 'string') {
        try {
          const parsed = JSON.parse(data.president_contact);
          president_contact = Array.isArray(parsed) ? parsed : [data.president_contact];
        } catch {
          president_contact = [data.president_contact];
        }
      } else if (data.president_contact === null) {
        president_contact = [];
      }
    }
    
    // Gestion du champ secretaire_contact
    let secretaire_contact: any[] | null | undefined = undefined;
    if (data.secretaire_contact !== undefined) {
      if (Array.isArray(data.secretaire_contact)) {
        secretaire_contact = data.secretaire_contact;
      } else if (typeof data.secretaire_contact === 'string') {
        try {
          const parsed = JSON.parse(data.secretaire_contact);
          secretaire_contact = Array.isArray(parsed) ? parsed : [data.secretaire_contact];
        } catch {
          secretaire_contact = [data.secretaire_contact];
        }
      } else if (data.secretaire_contact === null) {
        secretaire_contact = null;
      }
    }
    
    // Gestion du champ dg_contact
    let dg_contact: any[] | null | undefined = undefined;
    if (data.dg_contact !== undefined) {
      if (Array.isArray(data.dg_contact)) {
        dg_contact = data.dg_contact;
      } else if (typeof data.dg_contact === 'string') {
        try {
          const parsed = JSON.parse(data.dg_contact);
          dg_contact = Array.isArray(parsed) ? parsed : [data.dg_contact];
        } catch {
          dg_contact = [data.dg_contact];
        }
      } else if (data.dg_contact === null) {
        dg_contact = null;
      }
    }
    
    // Gestion du champ tresorier_contact
    let tresorier_contact: any[] | null | undefined = undefined;
    if (data.tresorier_contact !== undefined) {
      if (Array.isArray(data.tresorier_contact)) {
        tresorier_contact = data.tresorier_contact;
      } else if (typeof data.tresorier_contact === 'string') {
        try {
          const parsed = JSON.parse(data.tresorier_contact);
          tresorier_contact = Array.isArray(parsed) ? parsed : [data.tresorier_contact];
        } catch {
          tresorier_contact = [data.tresorier_contact];
        }
      } else if (data.tresorier_contact === null) {
        tresorier_contact = null;
      }
    }
    
    // Préparer les données avec gestion des champs JSON
    const updateData: any = { ...data };
    
    // Remplacer les champs JSON transformés
    if (president_contact !== undefined) {
      updateData.president_contact = president_contact;
    }
    if (secretaire_contact !== undefined) {
      updateData.secretaire_contact = secretaire_contact;
    }
    if (dg_contact !== undefined) {
      updateData.dg_contact = dg_contact;
    }
    if (tresorier_contact !== undefined) {
      updateData.tresorier_contact = tresorier_contact;
    }
    
    console.log('💾 Mise à jour organisation avec données:', JSON.stringify(updateData, null, 2));
    const updated = await prisma.organisation.update({
      where: { id },
      data: updateData
    });
    console.log('✅ Organisation mise à jour avec succès:', updated.id);
    res.json(updated);
  } catch (error: any) {
    console.error('❌ Erreur mise à jour organisation:', error);
    console.error('Stack:', error.stack);
    console.error('Code erreur:', error.code);
    
    // Gestion des erreurs spécifiques Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Une organisation avec ce code existe déjà",
        field: error.meta?.target 
      });
    }
    
    if (error.code === 'P2025') {
      console.error('❌ Erreur P2025 - Organisation introuvable:', req.params.id);
      return res.status(404).json({ 
        error: "Organisation introuvable",
        id: req.params.id 
      });
    }
    
    res.status(500).json({ 
      error: error.message || "Erreur mise à jour organisation",
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

app.post('/api/sections', async (req, res) => {
  try {
    const data = req.body;
    console.log('📥 Données reçues pour section:', JSON.stringify(data, null, 2));
    
    // Validation des champs obligatoires
    if (!data.nom) {
      return res.status(400).json({ error: "Le champ 'nom' est obligatoire" });
    }
    if (!data.id_organisation) {
      return res.status(400).json({ error: "Le champ 'id_organisation' est obligatoire" });
    }
    
    // Vérifier que l'organisation existe
    const organisation = await prisma.organisation.findUnique({
      where: { id: data.id_organisation }
    });
    
    if (!organisation) {
      return res.status(404).json({ 
        error: "Organisation introuvable",
        id_organisation: data.id_organisation 
      });
    }
    
    // Génération du code si absent
    const code = data.code || `SEC-${Date.now()}`;
    
    // Gestion du champ president_contact
    let president_contact: any[] = [];
    if (data.responsable_contact || data.president_contact) {
      const contact = data.responsable_contact || data.president_contact;
      if (Array.isArray(contact)) {
        president_contact = contact;
      } else if (typeof contact === 'string') {
        try {
          const parsed = JSON.parse(contact);
          president_contact = Array.isArray(parsed) ? parsed : [contact];
        } catch {
          president_contact = [contact];
        }
      }
    }
    
    // Mapping des données mobile vers schéma
    const sectionData = {
      code,
      nom: data.nom,
      id_organisation: data.id_organisation,
      statut: data.statut || 'actif',
      localite: data.localite || '',
      
      // Mapping responsable -> president
      president_nom: data.responsable_nom || data.president_nom || 'Non défini',
      president_contact: president_contact,
      
      // Champs optionnels
      point_geographique: data.point_geographique || null,
      secretaire_nom: data.secretaire_nom || null,
      secretaire_contact: data.secretaire_contact ? (Array.isArray(data.secretaire_contact) ? data.secretaire_contact : [data.secretaire_contact]) : null,
      magasinier_nom: data.magasinier_nom || null,
      magasinier_contact: data.magasinier_contact ? (Array.isArray(data.magasinier_contact) ? data.magasinier_contact : [data.magasinier_contact]) : null,
      peseur_nom: data.peseur_nom || null,
      peseur_contact: data.peseur_contact ? (Array.isArray(data.peseur_contact) ? data.peseur_contact : [data.peseur_contact]) : null,
    };

    console.log('💾 Création section avec données:', JSON.stringify(sectionData, null, 2));
    const section = await prisma.section.create({ data: sectionData });
    console.log('✅ Section créée avec succès:', section.id);
    res.json(section);
  } catch (error: any) {
    console.error('❌ Erreur création section:', error);
    console.error('Stack:', error.stack);
    console.error('Code erreur:', error.code);
    
    // Gestion des erreurs spécifiques Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Une section avec ce code existe déjà",
        field: error.meta?.target 
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(404).json({ 
        error: "Référence invalide (organisation introuvable)",
        field: error.meta?.field_name 
      });
    }
    
    res.status(500).json({ 
      error: error.message || "Erreur création section",
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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
  try {
    const villages = await prisma.village.findMany();
    res.json(villages);
  } catch (error: any) {
    console.error('❌ Erreur récupération villages:', error);
    res.status(500).json({ 
      error: error.message || "Erreur récupération villages",
      code: error.code
    });
  }
});
app.get('/api/villages/:id', async (req, res) => {
  try {
    const village = await prisma.village.findUnique({ where: { id: req.params.id } });
    if (!village) {
      return res.status(404).json({ error: "Village non trouvé" });
    }
    res.json(village);
  } catch (error: any) {
    console.error('❌ Erreur récupération village:', error);
    res.status(500).json({ 
      error: error.message || "Erreur récupération village",
      code: error.code
    });
  }
});

app.post('/api/villages', async (req, res) => {
  try {
    const data = req.body;
    console.log('📥 Données reçues pour village:', JSON.stringify(data, null, 2));
    
    // Validation des champs obligatoires
    if (!data.nom) {
      return res.status(400).json({ error: "Le champ 'nom' est obligatoire" });
    }
    if (!data.id_section) {
      return res.status(400).json({ error: "Le champ 'id_section' est obligatoire" });
    }
    
    // Vérifier que la section existe
    const section = await prisma.section.findUnique({
      where: { id: data.id_section }
    });
    
    if (!section) {
      return res.status(404).json({ 
        error: "Section introuvable",
        id_section: data.id_section 
      });
    }
    
    // Génération du code si absent
    const code = data.code || `VIL-${Date.now()}`;
    
    // Gestion du champ chef_contact
    let chef_contact: any[] | undefined = undefined;
    if (data.chef_contact) {
      if (Array.isArray(data.chef_contact)) {
        chef_contact = data.chef_contact;
      } else if (typeof data.chef_contact === 'string') {
        try {
          const parsed = JSON.parse(data.chef_contact);
          chef_contact = Array.isArray(parsed) ? parsed : [data.chef_contact];
        } catch {
          chef_contact = [data.chef_contact];
        }
      }
    }
    
    const villageData: Prisma.VillageUncheckedCreateInput = {
      code,
      nom: data.nom,
      id_section: data.id_section,
      type: data.type || 'Village',
      statut: data.statut || 'actif',
      localite: data.localite || data.nom, // Localité obligatoire
      
      // Démographie
      nombre_habitants: data.nombre_habitants ? parseInt(data.nombre_habitants) : 0,
      nombre_hommes: data.nombre_hommes ? parseInt(data.nombre_hommes) : 0,
      nombre_femmes: data.nombre_femmes ? parseInt(data.nombre_femmes) : 0,
      nombre_enfants: data.nombre_enfants ? parseInt(data.nombre_enfants) : 0,
      nombre_enfants_scolarises: data.nombre_enfants_scolarises ? parseInt(data.nombre_enfants_scolarises) : 0,
      
      // Autorité
      chef_nom: data.chef_nom || null,
      ...(chef_contact !== undefined && { chef_contact }),
      
      // Infrastructures (booléens avec valeurs par défaut)
      ecole_primaire: data.ecole_primaire || false,
      college_lycee: data.college_lycee || false,
      dispensaire: data.dispensaire || false,
      maternite: data.maternite || false,
      pharmacie: data.pharmacie || false,
      eau_courante: data.eau_courante || false,
      pompe_hydraulique: data.pompe_hydraulique || false,
      puits: data.puits || false,
      riviere_marigot: data.riviere_marigot || false,
      electricite_reseau: data.electricite_reseau || false,
      electricite_solaire: data.electricite_solaire || false,
      marche: data.marche || false,
      
      // Cultures (booléens avec valeurs par défaut)
      culture_cacao: data.culture_cacao !== undefined ? data.culture_cacao : true,
      culture_cafe: data.culture_cafe || false,
      culture_hevea: data.culture_hevea || false,
      culture_palmier: data.culture_palmier || false,
      culture_anacarde: data.culture_anacarde || false,
      culture_coton: data.culture_coton || false,
      culture_vivrier: data.culture_vivrier || false,
      culture_riz: data.culture_riz || false,
      culture_mais: data.culture_mais || false,
      culture_igname: data.culture_igname || false,
      culture_manioc: data.culture_manioc || false,
      
      // Finance (booléens avec valeurs par défaut)
      om_orange: data.om_orange || false,
      momo_mtn: data.momo_mtn || false,
      flooz_moov: data.flooz_moov || false,
      wave: data.wave || false,
      microfinance: data.microfinance || false,
    };

    console.log('💾 Création village avec données:', JSON.stringify(villageData, null, 2));
    const village = await prisma.village.create({ 
      data: villageData as Prisma.VillageUncheckedCreateInput 
    });
    console.log('✅ Village créé avec succès:', village.id);
    res.json(village);
  } catch (error: any) {
    console.error('❌ Erreur création village:', error);
    console.error('Stack:', error.stack);
    console.error('Code erreur:', error.code);
    
    // Gestion des erreurs spécifiques Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Un village avec ce code existe déjà",
        field: error.meta?.target 
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(404).json({ 
        error: "Référence invalide (section introuvable)",
        field: error.meta?.field_name 
      });
    }
    
    res.status(500).json({ 
      error: error.message || "Erreur création village",
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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

app.post('/api/producteurs', async (req, res) => {
  try {
    const data = req.body;
    console.log('📥 Données reçues pour producteur:', JSON.stringify(data, null, 2));
    
    // Validation des champs obligatoires
    if (!data.nom_complet) {
      return res.status(400).json({ error: "Le champ 'nom_complet' est obligatoire" });
    }
    if (!data.id_village) {
      return res.status(400).json({ error: "Le champ 'id_village' est obligatoire" });
    }
    
    // Vérifier que le village existe
    const village = await prisma.village.findUnique({
      where: { id: data.id_village }
    });
    
    if (!village) {
      return res.status(404).json({ 
        error: "Village introuvable",
        id_village: data.id_village 
      });
    }
    
    // Génération du code si absent
    const code = data.code || `PROD-${Date.now()}`;
    
    const producteurData = {
      code,
      nom_complet: data.nom_complet,
      id_village: data.id_village,
      statut: data.statut || 'actif',
      
      // Identité
      sexe: data.sexe || 'M',
      date_naissance: data.date_naissance ? new Date(data.date_naissance) : null,
      lieu_naissance: data.lieu_naissance || null,
      nationalite: data.nationalite || null,
      type_piece: data.type_piece || null,
      numero_piece: data.numero_piece || null,
      
      // Contact
      telephone_1: data.telephone || data.telephone_1 || null,
      telephone_2: data.telephone_2 || null,
      niveau_etude: data.niveau_etude || null,
      alphabete: data.alphabete || false,
      
      // Ménage
      statut_matrimonial: data.situation_matrimoniale || data.statut_matrimonial || null,
      nb_epouses: data.nb_epouses ? parseInt(data.nb_epouses) : 0,
      nb_enfants: data.nb_enfants ? parseInt(data.nb_enfants) : 0,
      nb_personnes_charge: data.nb_personnes_charge ? parseInt(data.nb_personnes_charge) : 0,
      
      // Photo
      photo_planteur: data.photo || data.photo_planteur || null,
    };

    console.log('💾 Création producteur avec données:', JSON.stringify(producteurData, null, 2));
    const producteur = await prisma.producteur.create({ data: producteurData });
    console.log('✅ Producteur créé avec succès:', producteur.id);
    res.json(producteur);
  } catch (error: any) {
    console.error('❌ Erreur création producteur:', error);
    console.error('Stack:', error.stack);
    console.error('Code erreur:', error.code);
    
    // Gestion des erreurs spécifiques Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Un producteur avec ce code existe déjà",
        field: error.meta?.target 
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(404).json({ 
        error: "Référence invalide (village introuvable)",
        field: error.meta?.field_name 
      });
    }
    
    res.status(500).json({ 
      error: error.message || "Erreur création producteur",
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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

app.post('/api/parcelles', async (req, res) => {
  try {
    const data = req.body;
    console.log('📥 Données reçues pour parcelle:', JSON.stringify(data, null, 2));
    
    // Validation des champs obligatoires
    if (!data.code) {
      return res.status(400).json({ error: "Le champ 'code' est obligatoire" });
    }
    if (!data.id_producteur) {
      return res.status(400).json({ error: "Le champ 'id_producteur' est obligatoire" });
    }
    
    // Vérifier que le producteur existe
    const producteur = await prisma.producteur.findUnique({
      where: { id: data.id_producteur }
    });
    
    if (!producteur) {
      return res.status(404).json({ 
        error: "Producteur introuvable",
        id_producteur: data.id_producteur 
      });
    }
    
    const parcelleData = {
      code: data.code,
      id_producteur: data.id_producteur,
      statut: data.statut || 'active',
      
      superficie_declaree: data.superficie_declaree ? parseFloat(data.superficie_declaree) : 0,
      superficie_reelle: data.superficie_reelle ? parseFloat(data.superficie_reelle) : null,
      age_plantation: data.age_plantation ? parseInt(data.age_plantation) : null,
      variete_cacao: data.variete_cacao || null,
      
      // GPS
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      polygone_gps: data.polygone_gps || null,
      superficie_gps: data.superficie_gps ? parseFloat(data.superficie_gps) : null,
      perimetre: data.perimetre ? parseFloat(data.perimetre) : null,
      
      // Autres champs optionnels
      annee_creation: data.annee_creation ? parseInt(data.annee_creation) : null,
      mode_acquisition: data.mode_acquisition || null,
      type_document: data.type_document || null,
      densite_pieds_hectare: data.densite_pieds_hectare ? parseInt(data.densite_pieds_hectare) : null,
      culture_intercalaire: data.culture_intercalaire || null,
    };

    console.log('💾 Création parcelle avec données:', JSON.stringify(parcelleData, null, 2));
    const parcelle = await prisma.parcelle.create({ data: parcelleData });
    console.log('✅ Parcelle créée avec succès:', parcelle.id);
    res.json(parcelle);
  } catch (error: any) {
    console.error('❌ Erreur création parcelle:', error);
    console.error('Stack:', error.stack);
    console.error('Code erreur:', error.code);
    
    // Gestion des erreurs spécifiques Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Une parcelle avec ce code existe déjà",
        field: error.meta?.target 
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(404).json({ 
        error: "Référence invalide (producteur introuvable)",
        field: error.meta?.field_name 
      });
    }
    
    res.status(500).json({ 
      error: error.message || "Erreur création parcelle",
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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

    // Support pour le format plat de l'application mobile
    if (!data.identification && data.id_producteur && data.id_parcelle) {
      console.log('📱 Détection format mobile');
      
      const flatData = {
        id_producteur: data.id_producteur,
        id_parcelle: data.id_parcelle,
        id_village: data.id_village,
        id_agent: data.id_agent || null,
        statut: data.statut || "Brouillon",
        campagne: data.campagne || "2023-2024",
        
        quantite_cabosses: data.quantite_cabosses,
        poids_estimatif: data.poids_estimatif,
        nb_sacs_brousse: data.nb_sacs_brousse || 0,
        
        signature_producteur: data.signature_producteur,
        date_signature: data.date_signature ? new Date(data.date_signature) : null,
      };

      const operation = await prisma.operation.create({
        data: flatData,
        include: {
          producteur: { select: { id: true, nom_complet: true } },
          agent: { select: { id: true, nom: true, prenom: true, code: true } },
          village: { select: { id: true, nom: true } },
          parcelle: { select: { id: true, code: true } }
        }
      });

      console.log('✅ Opération (Mobile) créée avec succès:', operation.id);
      rt.operationCreated(operation);
      return res.json(operation);
    }

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
      data: operationData,
      include: {
        producteur: { select: { id: true, nom_complet: true } },
        agent: { select: { id: true, nom: true, prenom: true, code: true } },
        village: { select: { id: true, nom: true } },
        parcelle: { select: { id: true, code: true } }
      }
    });

    console.log('✅ Opération créée avec succès:', operation.id);
    
    // Émettre l'événement temps réel
    rt.operationCreated(operation);
    
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

app.put('/api/operations/:id', async (req, res) => {
  try {
    const updated = await prisma.operation.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        producteur: { select: { id: true, nom_complet: true } },
        agent: { select: { id: true, nom: true, prenom: true, code: true } },
        village: { select: { id: true, nom: true } },
        parcelle: { select: { id: true, code: true } }
      }
    });
    
    // Émettre l'événement temps réel
    rt.operationUpdated(updated);
    
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Erreur mise à jour opération" });
  }
});

app.delete('/api/operations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.operation.delete({ where: { id } });
    
    // Émettre l'événement temps réel
    rt.operationDeleted(id);
    
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
    const { regions, password, ...agentData } = req.body;
    
    // Générer un username automatiquement si non fourni
    let username = agentData.username;
    if (!username || username.trim() === '') {
      // Générer un username basé sur le code de l'agent ou nom+prenom
      const baseUsername = agentData.code 
        ? agentData.code.toLowerCase().replace(/[^a-z0-9]/g, '')
        : `${agentData.nom?.toLowerCase() || ''}${agentData.prenom?.toLowerCase() || ''}`.replace(/[^a-z0-9]/g, '');
      
      // Vérifier l'unicité
      let counter = 1;
      username = baseUsername;
      while (await prisma.agent.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
    }

    // Générer un password par défaut si non fourni
    let password_hash = null;
    if (password && password.trim() !== '') {
      password_hash = await bcrypt.hash(password, 10);
    } else {
      // Mot de passe par défaut: "password123"
      password_hash = await bcrypt.hash('password123', 10);
    }

    const agent = await prisma.agent.create({
      data: {
        ...agentData,
        username,
        password_hash
      }
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
      },
      select: {
        id: true,
        code: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        statut: true,
        username: true,
        date_naissance: true,
        lieu_naissance: true,
        nationalite: true,
        type_piece: true,
        numero_piece: true,
        photo: true,
        createdAt: true,
        updatedAt: true,
        regions: {
          include: { region: true }
        }
      }
    });

    res.json(agentWithRegions);
  } catch (error: any) {
    console.error('❌ Erreur création agent:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Un agent avec ce username existe déjà",
        field: error.meta?.target 
      });
    }
    res.status(500).json({ error: error.message || "Erreur création agent" });
  }
});

app.put('/api/agents/:id', async (req, res) => {
  try {
    const { regions, password, username, ...agentData } = req.body;
    
    // Ne pas permettre la modification du username
    const updateData: any = { ...agentData };
    
    // Mettre à jour le password si fourni
    if (password && password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }
    
    const agent = await prisma.agent.update({
      where: { id: req.params.id },
      data: updateData
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
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur ASCO Track démarré sur http://localhost:${PORT}`);
  console.log(`⚡ WebSocket activé pour le temps réel`);
});
