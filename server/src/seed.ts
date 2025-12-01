// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 1. Organisation
  const org1 = await prisma.organisation.upsert({
    where: { code: 'ORG-001' },
    update: {},
    create: {
      id: "org-1",
      code: "ORG-001",
      nom: "SCOOP-CA Divo",
      type: "Coopérative",
      statut: "actif",
      region: "Lôh-Djiboua",
      departement: "Divo",
      sous_prefecture: "Divo",
      localite: "Divo",
      president_nom: "Kouassi Michel",
      president_contact: ["0707070707"],
    },
  });
  console.log(`Created Organisation: ${org1.nom}`);

  // 2. Section
  const sec1 = await prisma.section.upsert({
    where: { code: 'SEC-001' },
    update: {},
    create: {
      id: "sec-1",
      id_organisation: org1.id,
      code: "SEC-001",
      localite: "Section Nord",
      nom: "Section Nord",
      statut: "actif",
      nb_producteurs: 150,
      tonnage_c_precedente: 1200,
      tonnage_c_cours: 800,
      tonnage_potentiel: 1500,
      president_nom: "Konan Yves",
      president_contact: ["0505050505"],
      secretaire_nom: "Kouame Anne",
      secretaire_contact: ["0606060606"],
      magasinier_nom: "Yao Paul",
      magasinier_contact: ["0404040404"],
      peseur_nom: "Brou Marc",
      peseur_contact: ["0303030303"],
      vehicule_camionnette_nombre: 2,
      vehicule_moto_nombre: 10,
      vehicule_tricycle_nombre: 3,
      materiel_bascule: true,
      materiel_dickey_john: true,
      materiel_sondes: true,
      materiel_couteaux: true,
      comm_coop: true,
    },
  });
  console.log(`Created Section: ${sec1.nom}`);

  // 3. Village
  const vil1 = await prisma.village.upsert({
    where: { code: 'VIL-001' },
    update: {},
    create: {
      id: "vil-1",
      id_section: sec1.id,
      code: "VIL-001",
      type: "Village",
      nom: "Village Centre",
      localite: "Divo",
      statut: "actif",
      chef_nom: "N'Guessan Pierre",
      chef_contact: ["0101010101"],
      nombre_habitants: 1200,
      nombre_hommes: 600,
      nombre_femmes: 600,
      nombre_enfants_scolarises: 300,
      eau_courante: true,
      pompe_hydraulique: true,
      electricite_reseau: true,
      dispensaire: true,
      pharmacie: true,
      ecole_primaire: true,
      college_lycee: true,
      culture_cacao: true,
      culture_cafe: true,
      culture_mais: true,
      om_orange: true,
      momo_mtn: true,
    },
  });
  console.log(`Created Village: ${vil1.nom}`);

  // 4. Producteurs
  const prod1 = await prisma.producteur.upsert({
    where: { code: 'ORG-001-SEC-001-VIL-001-001' },
    update: {},
    create: {
      id: "prod-1",
      id_village: vil1.id,
      code: "ORG-001-SEC-001-VIL-001-001",
      nom_complet: "KOUASSI JEAN",
      statut: "actif",
      sexe: "M", // Supposé
      date_naissance: new Date("1980-05-15"),
      lieu_naissance: "DIVO",
      nb_epouses: 1,
      nb_enfants: 4,
      nb_personnes_charge: 6,
      niveau_etude: "Primaire", // Supposé
      alphabete: true, // Supposé
      acces_eau_potable: true, // Mapping
      acces_electricite: true,
      proprietaire_maison: true, // Supposé
      type_habitat: "Briques/Ciment",
      cacao_nb_plantations: 2,
      cacao_superficie: 5.5,
      cacao_production_annuelle: 4.2,
    },
  });

  const prod2 = await prisma.producteur.upsert({
    where: { code: 'ORG-001-SEC-001-VIL-001-002' },
    update: {},
    create: {
      id: "prod-2",
      id_village: vil1.id,
      code: "ORG-001-SEC-001-VIL-001-002",
      nom_complet: "KONÉ MARIE",
      statut: "actif",
      sexe: "F",
      date_naissance: new Date("1985-08-22"),
      lieu_naissance: "LAKOTA",
      nb_epouses: 0,
      nb_enfants: 2,
      nb_personnes_charge: 3,
      cacao_nb_plantations: 1,
      cacao_superficie: 2.5,
      cacao_production_annuelle: 1.8,
      acces_electricite: true,
      type_habitat: "Terre battue séchée",
    },
  });
  console.log(`Created Producteurs: ${prod1.nom_complet}, ${prod2.nom_complet}`);

  // 5. Parcelles
  const parc1 = await prisma.parcelle.upsert({
    where: { code: 'P-089' },
    update: {},
    create: {
      id: "parc-1",
      id_producteur: prod1.id,
      code: "P-089",
      statut: "active",
      age_plantation: 12,
      superficie_declaree: 3.5,
      superficie_reelle: 3.42,
      latitude: 5.84,
      longitude: -5.36,
      maladie_pourriture_brune: "Peu",
      maladie_swollen_shoot: "Inexistant",
      maladie_parasites: "Peu",
      equipement_bottes: true,
      equipement_gants: true,
      equipement_combinaison: true,
    },
  });

  const parc2 = await prisma.parcelle.upsert({
    where: { code: 'P-090' },
    update: {},
    create: {
      id: "parc-2",
      id_producteur: prod1.id,
      code: "P-090",
      statut: "active",
      age_plantation: 5,
      superficie_declaree: 2.0,
      superficie_reelle: 2.08,
      latitude: 5.85,
      longitude: -5.35,
      maladie_pourriture_brune: "Inexistant",
      maladie_swollen_shoot: "Inexistant",
      maladie_parasites: "Peu",
      equipement_bottes: true,
      equipement_gants: true,
      equipement_masque: true,
      equipement_lunettes: true,
    },
  });
  console.log(`Created Parcelles: ${parc1.code}, ${parc2.code}`);

  // 6. Opérations
  // Note: Operation n'a pas de code unique dans le seed TS, on utilise un ID fictif ou on laisse l'auto-génération
  // Ici je vais créer sans upsert car pas de contrainte unique simple (sauf ID)

  const existingOp = await prisma.operation.findFirst({ where: { id: "op-1" } });
  if (!existingOp) {
    await prisma.operation.create({
      data: {
        id: "op-1",
        id_producteur: prod1.id,
        id_parcelle: parc1.id,
        id_village: vil1.id,
        statut: "Payé",
        campagne: "2024-2025",
        date_recolte_1: new Date("2024-10-01"),
        date_ecabossage: new Date("2024-10-05"),
        ecabossage_duree: "6h",
        cout_ecabossage: 5000,
        fermentation_debut: new Date("2024-10-06"),
        fermentation_fin: new Date("2024-10-12"),
        materiel_feuilles: true,
        sechage_debut: new Date("2024-10-13"),
        sechage_fin: new Date("2024-10-20"),
        aire_claie_bambou: true,
        ensachage_debut: new Date("2024-10-21"),
        nb_sacs_brousse: 15,
        poids_estimatif: 1200,
        date_livraison: new Date("2024-10-22"),
        manutention_pesee: 1180,
        validation_statut: "Accepté",
        paiement_cheque: true,
        montant_cheque: 1180000,
        numero_cheque: "CHQ-998877",
        banque: "NSIA",
        retenue_mec: true,
        retenue_mec_taux: 10000,
        retenue_epargne: true,
        retenue_epargne_taux: 5000,
      }
    });
    console.log(`Created Operation op-1`);
  }

  // 7. Régions de Côte d'Ivoire (31 régions + 2 districts autonomes)
  const regionsCIV = [
    // Districts Autonomes
    { code: "REG-001", nom: "Abidjan", description: "District Autonome d'Abidjan" },
    { code: "REG-002", nom: "Yamoussoukro", description: "District Autonome de Yamoussoukro" },

    // Régions administratives
    { code: "REG-003", nom: "Agnéby-Tiassa", description: "Région d'Agnéby-Tiassa" },
    { code: "REG-004", nom: "Bafing", description: "Région du Bafing" },
    { code: "REG-005", nom: "Bagoué", description: "Région du Bagoué" },
    { code: "REG-006", nom: "Béré", description: "Région du Béré" },
    { code: "REG-007", nom: "Bounkani", description: "Région du Bounkani" },
    { code: "REG-008", nom: "Cavally", description: "Région du Cavally" },
    { code: "REG-009", nom: "Folon", description: "Région du Folon" },
    { code: "REG-010", nom: "Gbêkê", description: "Région du Gbêkê" },
    { code: "REG-011", nom: "Gbôklé", description: "Région du Gbôklé" },
    { code: "REG-012", nom: "Gôh", description: "Région du Gôh" },
    { code: "REG-013", nom: "Gontougo", description: "Région du Gontougo" },
    { code: "REG-014", nom: "Grands-Ponts", description: "Région des Grands-Ponts" },
    { code: "REG-015", nom: "Guémon", description: "Région du Guémon" },
    { code: "REG-016", nom: "Hambol", description: "Région du Hambol" },
    { code: "REG-017", nom: "Haut-Sassandra", description: "Région du Haut-Sassandra" },
    { code: "REG-018", nom: "Iffou", description: "Région de l'Iffou" },
    { code: "REG-019", nom: "Indénié-Djuablin", description: "Région de l'Indénié-Djuablin" },
    { code: "REG-020", nom: "Kabadougou", description: "Région du Kabadougou" },
    { code: "REG-021", nom: "La Mé", description: "Région de La Mé" },
    { code: "REG-022", nom: "Lôh-Djiboua", description: "Région du Lôh-Djiboua" },
    { code: "REG-023", nom: "Marahoué", description: "Région de la Marahoué" },
    { code: "REG-024", nom: "Moronou", description: "Région du Moronou" },
    { code: "REG-025", nom: "Nawa", description: "Région du Nawa" },
    { code: "REG-026", nom: "N'Zi", description: "Région du N'Zi" },
    { code: "REG-027", nom: "Poro", description: "Région du Poro" },
    { code: "REG-028", nom: "San-Pédro", description: "Région de San-Pédro" },
    { code: "REG-029", nom: "Sud-Comoé", description: "Région du Sud-Comoé" },
    { code: "REG-030", nom: "Tchologo", description: "Région du Tchologo" },
    { code: "REG-031", nom: "Tonkpi", description: "Région du Tonkpi" },
    { code: "REG-032", nom: "Worodougou", description: "Région du Worodougou" },
    { code: "REG-033", nom: "Moyen-Cavally", description: "Région du Moyen-Cavally" },
  ];

  for (const regionData of regionsCIV) {
    await prisma.region.upsert({
      where: { code: regionData.code },
      update: {},
      create: regionData
    });
  }
  console.log(`Created ${regionsCIV.length} régions`);

  // 8. Agents de collecte (exemples)
  const agent1 = await prisma.agent.upsert({
    where: { code: 'AGT-001' },
    update: {},
    create: {
      code: 'AGT-001',
      nom: 'Kouassi',
      prenom: 'Jean',
      telephone: '0701010101',
      email: 'kouassi.jean@asco.ci',
      statut: 'actif',
      nationalite: 'Ivoirienne',
    }
  });

  const agent2 = await prisma.agent.upsert({
    where: { code: 'AGT-002' },
    update: {},
    create: {
      code: 'AGT-002',
      nom: 'Bamba',
      prenom: 'Fatou',
      telephone: '0702020202',
      email: 'bamba.fatou@asco.ci',
      statut: 'actif',
      nationalite: 'Ivoirienne',
    }
  });

  // Affecter les agents aux régions
  const regionLohDjiboua = await prisma.region.findUnique({ where: { code: 'REG-022' } });
  const regionNawa = await prisma.region.findUnique({ where: { code: 'REG-025' } });

  if (regionLohDjiboua && agent1) {
    await prisma.agentRegion.upsert({
      where: {
        id_agent_id_region: {
          id_agent: agent1.id,
          id_region: regionLohDjiboua.id
        }
      },
      update: {},
      create: {
        id_agent: agent1.id,
        id_region: regionLohDjiboua.id,
        statut: 'actif'
      }
    });
  }

  if (regionNawa && agent2) {
    await prisma.agentRegion.upsert({
      where: {
        id_agent_id_region: {
          id_agent: agent2.id,
          id_region: regionNawa.id
        }
      },
      update: {},
      create: {
        id_agent: agent2.id,
        id_region: regionNawa.id,
        statut: 'actif'
      }
    });
  }

  console.log('Created Agents and affectations');

  // 9. Créer des opérations de démonstration pour le dashboard agent
  console.log('Creating demo operations for agent dashboard...');

  // Opérations pour Agent 1 (Kouassi Jean) - Derniers 3 mois
  const operations = [
    // Novembre 2024
    {
      id: "op-demo-1",
      id_agent: agent1.id,
      id_producteur: prod1.id,
      id_parcelle: parc1.id,
      id_village: vil1.id,
      statut: "Payé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-11-05"),
      date_livraison: new Date("2024-11-15"),
      manutention_pesee: 850,
      montant_du: 850000,
      date_paiement: new Date("2024-11-20"),
      paiement_especes: true,
      montant_especes: 850000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-11-15"),
    },
    {
      id: "op-demo-2",
      id_agent: agent1.id,
      id_producteur: prod2.id,
      id_parcelle: parc2.id,
      id_village: vil1.id,
      statut: "Payé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-11-08"),
      date_livraison: new Date("2024-11-18"),
      manutention_pesee: 620,
      montant_du: 620000,
      date_paiement: new Date("2024-11-22"),
      paiement_cheque: true,
      montant_cheque: 620000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-11-18"),
    },
    {
      id: "op-demo-3",
      id_agent: agent1.id,
      id_producteur: prod1.id,
      id_parcelle: parc1.id,
      id_village: vil1.id,
      statut: "Validé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-11-20"),
      date_livraison: new Date("2024-11-25"),
      manutention_pesee: 1200,
      montant_du: 1200000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-11-25"),
    },
    // Octobre 2024
    {
      id: "op-demo-4",
      id_agent: agent1.id,
      id_producteur: prod1.id,
      id_parcelle: parc1.id,
      id_village: vil1.id,
      statut: "Payé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-10-05"),
      date_livraison: new Date("2024-10-10"),
      manutention_pesee: 950,
      montant_du: 950000,
      date_paiement: new Date("2024-10-15"),
      paiement_especes: true,
      montant_especes: 950000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-10-10"),
    },
    {
      id: "op-demo-5",
      id_agent: agent1.id,
      id_producteur: prod2.id,
      id_parcelle: parc2.id,
      id_village: vil1.id,
      statut: "Payé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-10-12"),
      date_livraison: new Date("2024-10-17"),
      manutention_pesee: 780,
      montant_du: 780000,
      date_paiement: new Date("2024-10-20"),
      paiement_cheque: true,
      montant_cheque: 780000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-10-17"),
    },
    {
      id: "op-demo-6",
      id_agent: agent1.id,
      id_producteur: prod1.id,
      id_parcelle: parc2.id,
      id_village: vil1.id,
      statut: "Payé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-10-22"),
      date_livraison: new Date("2024-10-27"),
      manutention_pesee: 1100,
      montant_du: 1100000,
      date_paiement: new Date("2024-10-30"),
      paiement_especes: true,
      montant_especes: 1100000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-10-27"),
    },
    // Septembre 2024
    {
      id: "op-demo-7",
      id_agent: agent1.id,
      id_producteur: prod1.id,
      id_parcelle: parc1.id,
      id_village: vil1.id,
      statut: "Payé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-09-10"),
      date_livraison: new Date("2024-09-15"),
      manutention_pesee: 720,
      montant_du: 720000,
      date_paiement: new Date("2024-09-18"),
      paiement_especes: true,
      montant_especes: 720000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-09-15"),
    },
    {
      id: "op-demo-8",
      id_agent: agent1.id,
      id_producteur: prod2.id,
      id_parcelle: parc2.id,
      id_village: vil1.id,
      statut: "Payé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-09-18"),
      date_livraison: new Date("2024-09-23"),
      manutention_pesee: 890,
      montant_du: 890000,
      date_paiement: new Date("2024-09-25"),
      paiement_cheque: true,
      montant_cheque: 890000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-09-23"),
    },
    // Opérations pour Agent 2 (Bamba Fatou)
    {
      id: "op-demo-9",
      id_agent: agent2.id,
      id_producteur: prod1.id,
      id_parcelle: parc1.id,
      id_village: vil1.id,
      statut: "Payé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-11-10"),
      date_livraison: new Date("2024-11-15"),
      manutention_pesee: 950,
      montant_du: 950000,
      date_paiement: new Date("2024-11-18"),
      paiement_especes: true,
      montant_especes: 950000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-11-15"),
    },
    {
      id: "op-demo-10",
      id_agent: agent2.id,
      id_producteur: prod2.id,
      id_parcelle: parc2.id,
      id_village: vil1.id,
      statut: "Validé",
      campagne: "2024-2025",
      date_recolte_1: new Date("2024-11-22"),
      date_livraison: new Date("2024-11-26"),
      manutention_pesee: 1050,
      montant_du: 1050000,
      validation_statut: "Conforme",
      createdAt: new Date("2024-11-26"),
    },
  ];

  // Créer les opérations
  for (const opData of operations) {
    const existing = await prisma.operation.findFirst({ where: { id: opData.id } });
    if (!existing) {
      await prisma.operation.create({ data: opData });
      console.log(`Created operation ${opData.id}`);
    }
  }

  console.log(`Created ${operations.length} demo operations for agent dashboard`);
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
