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
