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
  const org = await prisma.organisation.findUnique({ where: { id: req.params.id } });
  res.json(org);
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

// Start server
app.listen(PORT, () => {
  console.log(`Serveur CacaoTrack démarré sur http://localhost:${PORT}`);
});
