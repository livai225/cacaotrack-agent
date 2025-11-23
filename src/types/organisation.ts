// Types pour le module Organisation basés sur la structure de la base de données

/**
 * Table: organisations
 * Gère les informations des organisations (coopératives et regroupements)
 */
export interface Organisation {
  id: string; // UUID
  code: string; // Code unique de l'organisation (ex: ORG-001)
  nom: string;
  type: 'Coopérative' | 'Regroupement';
  region: string;
  departement: string;
  sous_prefecture: string;
  localite: string;
  siege_social?: string;
  latitude?: number;
  longitude?: number;
  president_nom: string;
  president_contact: string[]; // Array de numéros de téléphone
  secretaire_nom?: string;
  secretaire_contact?: string[];
  photo?: string; // URL ou base64 de la photo
  potentiel_production?: number; // En tonnes
  date_creation: Date;
  date_modification: Date;
  statut: 'actif' | 'inactif' | 'suspendu';
  sync_status?: 'synced' | 'pending' | 'error';
}

/**
 * Table: membres_organisations
 * Gère les membres des organisations avec leurs rôles
 */
export interface MembreOrganisation {
  id: string; // UUID
  id_membre: string; // Référence à un producteur
  id_organisation: string; // Référence à une organisation
  role: 'président' | 'secrétaire' | 'trésorier' | 'membre' | 'autre';
  date_adhesion: Date;
  date_fin?: Date;
  statut: 'actif' | 'inactif' | 'suspendu';
  notes?: string;
  date_creation: Date;
  date_modification: Date;
}

/**
 * Table: sections
 * Sections d'une organisation (niveau intermédiaire)
 */
export interface Section {
  id: string; // UUID
  code: string; // Code unique (ex: SEC-012)
  id_organisation: string;
  
  // Informations Générales
  localite: string;
  latitude?: number;
  longitude?: number;
  photo_magasin?: string;
  surface_magasin?: number;
  photo_aire_sechage?: string;
  date_creation_section: Date;
  nom: string; // Nom de la section
  telephone: string;
  nb_producteurs: number;
  tonnage_c_precedente: number;
  tonnage_c_cours: number;
  tonnage_potentiel: number;

  // Dirigeants - Président/Délégué
  president_nom: string;
  president_date_naissance?: Date;
  president_photo?: string;
  president_contact: string[];

  // Dirigeants - Secrétaire
  secretaire_nom: string;
  secretaire_date_naissance?: Date;
  secretaire_photo?: string;
  secretaire_contact: string[];

  // Personnel - Magasinier
  magasinier_nom: string;
  magasinier_date_naissance?: Date;
  magasinier_photo?: string;
  magasinier_contact: string[];

  // Personnel - Peseur
  peseur_nom: string;
  peseur_date_naissance?: Date;
  peseur_photo?: string;
  peseur_contact: string[];

  // Personnel - Analyseur
  has_analyseur: boolean;
  analyseur_nom?: string;
  analyseur_date_naissance?: Date;
  analyseur_photo?: string;
  analyseur_contact?: string[];

  // Equipements - Véhicules
  // Camionnettes
  vehicule_camionnette_nombre: number;
  vehicule_camionnette_etat?: 'Bon' | 'Moyen' | 'Mauvais';
  vehicule_camionnette_statut?: 'En marche' | 'En panne';
  vehicule_camionnette_proprietaire: boolean; // Oui/Non

  // Véhicules de liaison
  vehicule_liaison_nombre: number;
  vehicule_liaison_etat?: 'Bon' | 'Moyen' | 'Mauvais';
  vehicule_liaison_statut?: 'En marche' | 'En panne';
  vehicule_liaison_proprietaire: boolean;

  // Tricycles
  vehicule_tricycle_nombre: number;
  vehicule_tricycle_etat?: 'Bon' | 'Moyen' | 'Mauvais';
  vehicule_tricycle_statut?: 'En marche' | 'En panne';
  vehicule_tricycle_proprietaire: boolean;

  // Motos
  vehicule_moto_nombre: number;
  vehicule_moto_etat?: 'Bon' | 'Moyen' | 'Mauvais';
  vehicule_moto_statut?: 'En marche' | 'En panne';
  vehicule_moto_proprietaire: boolean;

  // Matériel de pesage et contrôle qualité
  materiel_dickey_john: boolean;
  materiel_dickey_john_photo?: string;

  materiel_kpm: boolean;
  materiel_kpm_photo?: string;

  materiel_couteaux: boolean;
  materiel_couteaux_photo?: string;

  materiel_tableau: boolean;
  materiel_tableau_photo?: string;

  materiel_sondes: boolean;
  materiel_sondes_photo?: string;

  materiel_bascule: boolean;
  materiel_bascule_photo?: string;
  materiel_bascule_capacite?: number;

  // Commercialisation production
  // Produits issus de la Coopérative
  comm_coop: boolean;
  comm_coop_pct?: number;
  comm_coop_lieu?: string;
  comm_coop_prix_campagne?: number;
  comm_coop_prix_intermediaire?: number;

  // Produits issus des Pisteurs
  comm_pisteur: boolean;
  comm_pisteur_noms?: string; // Liste noms
  comm_pisteur_pct?: number;
  comm_pisteur_lieu?: string;
  comm_pisteur_prix_campagne?: number;
  comm_pisteur_prix_intermediaire?: number;

  // Produits issus des autres coopératives
  comm_autre_coop: boolean;
  comm_autre_coop_noms?: string; // Liste noms
  comm_autre_coop_pct?: number;
  comm_autre_coop_lieu?: string;
  comm_autre_coop_prix_campagne?: number;
  comm_autre_coop_prix_intermediaire?: number;

  // Produits issus des autres acheteurs
  comm_autre_acheteur: boolean;
  comm_autre_acheteur_noms?: string; // Liste noms
  comm_autre_acheteur_pct?: number;
  comm_autre_acheteur_lieu?: string;
  comm_autre_acheteur_prix_campagne?: number;
  comm_autre_acheteur_prix_intermediaire?: number;

  date_creation: Date;
  date_modification: Date;
  statut: 'actif' | 'inactif';
}

/**
 * Table: villages
 * Villages ou campements rattachés à une section
 */
export interface Village {
  id: string; // UUID
  code: string; // Code unique (ex: VIL-045)
  
  // Informations Générales
  type: 'Village' | 'Campement';
  id_organisation: string;
  id_section: string;
  localite: string;
  nom: string; // Nom du campement
  latitude?: number;
  longitude?: number;
  photo?: string; // Photo Campement
  photo_aire_sechage?: string;

  // Chef de campement
  chef_nom: string;
  chef_contact: string[];
  chef_cni?: string; // Numéro CNI
  chef_photo_cni?: string; // Photo CNI
  chef_date_naissance?: Date;
  chef_photo_date_naissance?: string; // Photo document naissance

  // Données sociologiques
  nombre_habitants: number;
  nombre_hommes: number;
  nombre_femmes: number;
  nombre_enfants_scolarises: number;

  // Accès à l'eau
  eau_courante: boolean;
  eau_courante_pct?: number;
  pompe_hydraulique: boolean;
  pompe_hydraulique_pct?: number;
  puits: boolean;
  puits_pct?: number;
  riviere_marigot: boolean;
  riviere_marigot_pct?: number;

  // Accès à l'électricité
  electricite_reseau: boolean;
  electricite_reseau_niveau?: 'Peu' | 'Moyen' | 'Important';
  electricite_solaire: boolean;
  electricite_solaire_niveau?: 'Peu' | 'Moyen' | 'Important';
  electricite_lampes: boolean;
  electricite_lampes_niveau?: 'Peu' | 'Moyen' | 'Important';

  // Accès aux soins
  dispensaire: boolean;
  dispensaire_nombre?: number;
  dispensaire_photo?: string;
  dispensaire_materiaux?: 'Ciment' | 'Terre battue séchée' | 'Bois/Banco' | 'Autre';
  dispensaire_distance?: number; // km

  pharmacie: boolean;
  pharmacie_nombre?: number;
  pharmacie_photo?: string;
  pharmacie_materiaux?: 'Ciment' | 'Terre battue séchée' | 'Bois/Banco' | 'Autre';
  pharmacie_distance?: number; // km

  // Accès à l'éducation
  ecole_primaire: boolean;
  ecole_primaire_nombre?: number;
  ecole_primaire_photo?: string;
  ecole_primaire_materiaux?: 'Ciment' | 'Terre battue séchée' | 'Bois/Banco' | 'Autre';
  ecole_primaire_distance?: number; // km

  college_lycee: boolean;
  college_lycee_nombre?: number;
  college_lycee_photo?: string;
  college_lycee_materiaux?: 'Ciment' | 'Terre battue séchée' | 'Bois/Banco' | 'Autre';
  college_lycee_distance?: number; // km

  // Activités professionnelles - Agricoles
  culture_cacao: boolean;
  culture_cafe: boolean;
  culture_riz: boolean;
  culture_mais: boolean;
  culture_hevea: boolean;
  culture_palmier: boolean;
  culture_maraicheres: boolean;
  elevage_ovin: boolean;
  elevage_bovin: boolean;
  elevage_porcin: boolean;
  elevage_autre: boolean;
  activite_autre?: string;

  // Activités professionnelles - Autres
  commerces: boolean;
  commerces_produits?: string[]; // Liste des produits
  artisanat: boolean;
  artisanat_produits?: string[]; // Liste des produits

  // Couverture GSM
  reseau_orange?: 'Très bon' | 'Bon' | 'Moyen' | 'Pas du tout';
  reseau_mtn?: 'Très bon' | 'Bon' | 'Moyen' | 'Pas du tout';
  reseau_moov?: 'Très bon' | 'Bon' | 'Moyen' | 'Pas du tout';

  // Services de paiement électronique
  om_orange: boolean;
  momo_mtn: boolean;
  flooz_moov: boolean;
  autres_paiement: boolean;

  date_creation: Date;
  date_modification: Date;
  statut: 'actif' | 'inactif';
}

/**
 * Table: producteurs
 * Gestion des producteurs
 */
export interface Producteur {
  id: string; // UUID
  code: string; // Code unique
  id_organisation: string;
  id_section: string;
  id_village: string;
  
  // Informations générales
  nom_complet: string;
  date_naissance: Date;
  lieu_naissance: string;
  photo_cni?: string;
  photo_planteur?: string;
  
  nb_femmes: number;
  nb_enfants: number;
  nb_filles: number;
  nb_garcons: number;
  nb_moins_5_ans: number;
  nb_enfants_scolarises: number;
  
  // Scolarisation détaillée
  scolarises_primaire_filles: number;
  scolarises_primaire_garcons: number;
  scolarises_secondaire_filles: number;
  scolarises_secondaire_garcons: number;
  scolarises_superieur_filles: number;
  scolarises_superieur_garcons: number;

  // Conditions de vie - Eau
  eau_courante: boolean;
  pompe_hydraulique: boolean;
  puits: boolean;
  riviere_marigot: boolean;

  // Conditions de vie - Electricité
  electricite_reseau: boolean;
  electricite_solaire: boolean;
  electricite_lampe: boolean;
  electricite_aucun: boolean;

  // Logement
  materiaux_mur: 'Terre battue séchée' | 'Briques/Ciment' | 'Bois' | 'Paille/pisé' | 'Matériaux modernes';
  toiture: 'Tôle' | 'Bambou-Plastique' | 'Paille-Plastique' | 'Bambou-Paille';

  // Accès aux soins
  soins_plantes_tradi: 'Toujours' | 'Souvent' | 'Jamais';
  soins_dispensaire: 'Toujours' | 'Souvent' | 'Jamais';

  // Crédit / Epargne (Intérêt)
  interet_compte_bancaire: boolean;
  montant_compte_bancaire?: number;
  interet_epargne: boolean;
  montant_epargne?: number;

  // Moyens
  usage_mobile_money: 'Peu' | 'Souvent' | 'Toujours' | 'Jamais';
  usage_virement: 'Peu' | 'Souvent' | 'Toujours' | 'Jamais';
  usage_especes: 'Peu' | 'Souvent' | 'Toujours' | 'Jamais';
  usage_tontine: 'Peu' | 'Souvent' | 'Toujours' | 'Jamais';

  // Intérêt Crédit Agricole
  credit_intrants: boolean; montant_credit_intrants?: number;
  credit_soudure: boolean; montant_credit_soudure?: number;
  pret_scolaire: boolean; montant_pret_scolaire?: number;
  credit_acces_intrants: boolean; montant_credit_acces_intrants?: number;
  credit_biens_conso: boolean; montant_credit_biens_conso?: number;
  credit_assurance_maladie: boolean; montant_credit_assurance_maladie?: number;
  credit_assurance_agricole: boolean; montant_credit_assurance_agricole?: number;
  credit_assurance_retraite: boolean; montant_credit_assurance_retraite?: number;
  credit_conseil_agricole: boolean; montant_credit_conseil_agricole?: number;
  credit_rehabilitation: boolean; montant_credit_rehabilitation?: number;

  // Production Agricole
  cacao_nb_plantations: number;
  cacao_superficie: number;
  cacao_production: number;

  hevea: boolean; hevea_nb_plantations?: number; hevea_superficie?: number; hevea_production?: number;
  palmier: boolean; palmier_nb_plantations?: number; palmier_superficie?: number; palmier_production?: number;
  cafe: boolean; cafe_nb_plantations?: number; cafe_superficie?: number; cafe_production?: number;
  mais: boolean; mais_nb_plantations?: number; mais_superficie?: number; mais_production?: number;
  riz: boolean; riz_nb_plantations?: number; riz_superficie?: number; riz_production?: number;
  maraichere: boolean; maraichere_nb_plantations?: number; maraichere_superficie?: number; maraichere_production?: number;

  date_creation: Date;
  date_modification: Date;
  statut: 'actif' | 'inactif' | 'suspendu';
}

/**
 * Table: parcelles
 * Parcelles de cacao (Plantations)
 */
export interface Parcelle {
  id: string; // UUID
  code: string; // Code Plantation
  id_producteur: string;
  id_organisation: string;
  
  // Informations générales
  age_plantation: number;
  superficie_declaree: number; // Ha
  superficie_reelle?: number; // GPS (Ha)
  distance_magasin?: number; // Km
  latitude?: number; // Centroïde
  longitude?: number;
  production_declaree: number; // Tonnes
  densite?: number;
  nb_arbres_ombrage?: number;
  photo?: string;

  // Principales maladies (Niveau: Inexistant, Très peu, Peu, Important)
  maladie_pourriture_brune: 'Inexistant' | 'Très peu' | 'Peu' | 'Important';
  maladie_swollen_shoot: 'Inexistant' | 'Très peu' | 'Peu' | 'Important';
  maladie_parasites: 'Inexistant' | 'Très peu' | 'Peu' | 'Important';
  maladie_autre: 'Inexistant' | 'Très peu' | 'Peu' | 'Important';

  // Utilisation intrants (Fréquence: Peu, Moyen, Dose recommandée, Jamais)
  engrais: 'Peu' | 'Moyen' | 'A dose recommandée' | 'Jamais';
  pesticides: 'Peu' | 'Moyen' | 'A dose recommandée' | 'Jamais';
  insecticides: 'Peu' | 'Moyen' | 'A dose recommandée' | 'Jamais';
  fongicides: 'Peu' | 'Moyen' | 'A dose recommandée' | 'Jamais';
  herbicides: 'Peu' | 'Moyen' | 'A dose recommandée' | 'Jamais';

  // Conseil agricole
  conseil_anader: boolean;
  conseil_partenaires: boolean;
  conseil_prives: boolean;
  conseil_frequence: 'Jamais' | '01 fois par an' | '01 fois par semestre' | '01 fois trimestre' | '01 par mois';
  conseil_interet: boolean;

  // Séchage produit
  sechage_claie_hauteur: boolean;
  sechage_claie_sol: boolean;
  sechage_plastique_sol: boolean;
  sechage_ciment: boolean;

  // Equipements planteurs
  equipement_machettes: boolean;
  equipement_gourdins: boolean;
  equipement_limes: boolean;
  equipement_houe: boolean;
  equipement_secateur: boolean;
  equipement_combinaison: boolean;
  equipement_gants: boolean;
  equipement_lunettes: boolean;
  equipement_masque: boolean;
  equipement_bottes: boolean;

  // Commercialisation
  // Livré à la Coopérative
  comm_coop: boolean;
  comm_coop_pct?: number;
  comm_coop_loyaute?: number; // Calculé ?
  comm_coop_lieu?: string;
  comm_coop_prix_campagne?: number;
  comm_coop_prix_intermediaire?: number;

  // Livré aux Pisteurs
  comm_pisteur: boolean;
  comm_pisteur_noms?: string;
  comm_pisteur_pct?: number;
  comm_pisteur_loyaute?: number;
  comm_pisteur_lieu?: string;
  comm_pisteur_prix_campagne?: number;
  comm_pisteur_prix_intermediaire?: number;

  // Livré aux autres coopératives
  comm_autre_coop: boolean;
  comm_autre_coop_noms?: string;
  comm_autre_coop_pct?: number;
  comm_autre_coop_loyaute?: number;
  comm_autre_coop_lieu?: string;
  comm_autre_coop_prix_campagne?: number;
  comm_autre_coop_prix_intermediaire?: number;

  // Livré aux autres acheteurs
  comm_autre_acheteur: boolean;
  comm_autre_acheteur_noms?: string;
  comm_autre_acheteur_pct?: number;
  comm_autre_acheteur_loyaute?: number;
  comm_autre_acheteur_lieu?: string;
  comm_autre_acheteur_prix_campagne?: number;
  comm_autre_acheteur_prix_intermediaire?: number;

  date_creation: Date;
  date_modification: Date;
  statut: 'active' | 'inactive' | 'en_jachère';
}

/**
 * Table: activites
 * Activités réalisées sur les parcelles
 */
export interface Activite {
  id: string; // UUID
  id_parcelle: string;
  id_producteur: string;
  type_activite: 'récolte' | 'traitement' | 'entretien' | 'plantation' | 'autre';
  description: string;
  date_activite: Date;
  cout?: number;
  notes?: string;
  photo?: string;
  date_creation: Date;
  date_modification: Date;
}

export interface Operation {
  id: string;
  // Localité & Identification
  id_village: string;
  id_producteur: string;
  axe_collecte: string;
  id_parcelle: string; // Code plantation

  // Récolte
  date_recolte_1: Date; photo_recolte_1?: string;
  date_recolte_2?: Date; photo_recolte_2?: string;
  date_recolte_3?: Date; photo_recolte_3?: string;

  // Ecabossage
  date_ecabossage: Date;
  ecabossage_debut: string; // Format HH:mm
  ecabossage_fin: string; // Format HH:mm
  ecabossage_duree: string;
  cout_ecabossage: number;
  outils_machette: boolean;
  outils_gourdin: boolean;
  outils_couteau: boolean;
  outils_autres?: string;

  // Transport
  date_transport: Date;

  // Fermentation
  fermentation_debut: Date;
  fermentation_fin: Date;
  fermentation_duree?: number;
  materiel_feuilles: boolean;
  materiel_caisses: boolean;
  materiel_autres?: string;

  // Séchage
  sechage_debut: Date;
  sechage_fin: Date;
  sechage_duree?: number;
  aire_claie_bambou: boolean;
  aire_plastique_sol: boolean;
  aire_plastique_ciment: boolean;
  aire_cimentee: boolean;

  // Ensachage
  ensachage_debut: Date;
  ensachage_fin: Date;
  ensachage_duree?: string;
  nb_sacs_brousse: number;
  poids_estimatif: number;
  lieu_stockage_etat: 'Bon' | 'Acceptable' | 'Mauvais';
  date_livraison: Date;

  // Manutention
  manutention_dechargement: boolean;
  manutention_sonde: boolean;
  manutention_pesee: number;
  manutention_analyse: boolean;
  validation_statut: 'Accepté' | 'Refoulé' | 'A reconditionner';

  // Paiement
  paiement_especes: boolean;
  montant_especes?: number;
  paiement_cheque: boolean;
  montant_cheque?: number;
  numero_cheque?: string;
  banque?: string;

  // Retenues
  retenue_mec: boolean;
  retenue_mec_taux?: number;
  retenue_epargne: boolean;
  retenue_epargne_taux?: number;

  date_creation: Date;
  statut: 'En cours' | 'Validé' | 'Payé';
}

/**
 * Table: evaluations_qualite
 * Évaluation de la qualité du cacao
 */
export interface EvaluationQualite {
  id: string; // UUID
  id_recolte: string;
  id_organisation: string;
  date_evaluation: Date;
  taux_humidite?: number;
  taux_fermentation?: number;
  taux_moisissure?: number;
  taux_graines_plates?: number;
  note_globale?: number; // Sur 100
  classification?: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Hors grade';
  evaluateur: string;
  notes?: string;
  date_creation: Date;
  date_modification: Date;
}

/**
 * Table: stocks
 * Gestion des stocks de cacao
 */
export interface Stock {
  id: string; // UUID
  id_organisation: string;
  code_lot: string;
  quantite: number; // En kg
  date_entree: Date;
  date_sortie?: Date;
  type_stockage: 'magasin' | 'entrepôt' | 'autre';
  localisation: string;
  statut: 'disponible' | 'réservé' | 'vendu';
  notes?: string;
  date_creation: Date;
  date_modification: Date;
}

/**
 * Table: ventes
 * Enregistrement des ventes
 */
export interface Vente {
  id: string; // UUID
  code: string; // Code de la vente
  id_organisation: string;
  id_acheteur?: string;
  nom_acheteur: string;
  date_vente: Date;
  quantite: number; // En kg
  prix_unitaire: number;
  prix_total: number;
  mode_paiement: 'espèces' | 'virement' | 'mobile_money' | 'autre';
  statut: 'en_cours' | 'payée' | 'annulée';
  notes?: string;
  date_creation: Date;
  date_modification: Date;
}

/**
 * Table: transactions
 * Transactions financières
 */
export interface Transaction {
  id: string; // UUID
  code: string; // Code de la transaction
  id_organisation: string;
  id_membre?: string;
  type: 'entrée' | 'sortie';
  categorie: 'vente' | 'achat' | 'salaire' | 'investissement' | 'autre';
  montant: number;
  devise: string; // Ex: XOF
  date_transaction: Date;
  mode_paiement: string;
  description: string;
  reference?: string;
  statut: 'en_attente' | 'validée' | 'annulée';
  date_creation: Date;
  date_modification: Date;
}

/**
 * Table: alertes
 * Système d'alertes et notifications
 */
export interface Alerte {
  id: string; // UUID
  id_organisation: string;
  id_destinataire?: string; // ID du destinataire (producteur, membre, etc.)
  type: 'info' | 'warning' | 'error' | 'success';
  titre: string;
  message: string;
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  date_creation: Date;
  date_lecture?: Date;
  statut: 'non_lue' | 'lue' | 'archivée';
}

/**
 * Table: rapports
 * Gestion des rapports générés
 */
export interface Rapport {
  id: string; // UUID
  id_organisation: string;
  type: 'production' | 'ventes' | 'financier' | 'qualité' | 'autre';
  titre: string;
  periode_debut: Date;
  periode_fin: Date;
  contenu?: string; // JSON ou texte
  fichier_url?: string; // URL du fichier PDF généré
  genere_par: string; // ID de l'utilisateur
  date_generation: Date;
  statut: 'en_cours' | 'terminé' | 'erreur';
}

// Types de formulaire pour la création/modification
export type OrganisationFormData = Omit<Organisation, 'id' | 'date_creation' | 'date_modification' | 'sync_status'>;
export type MembreOrganisationFormData = Omit<MembreOrganisation, 'id' | 'date_creation' | 'date_modification'>;
export type SectionFormData = Omit<Section, 'id' | 'date_creation' | 'date_modification'>;
export type VillageFormData = Omit<Village, 'id' | 'date_creation' | 'date_modification'>;
export type ParcelleFormData = Omit<Parcelle, 'id' | 'date_creation' | 'date_modification'>;

// Types pour les vues et statistiques
export interface OrganisationStats {
  id_organisation: string;
  nombre_sections: number;
  nombre_villages: number;
  nombre_producteurs: number;
  nombre_parcelles: number;
  superficie_totale: number;
  production_totale: number;
  chiffre_affaires: number;
}

export interface StatutProduction {
  periode: string;
  quantite_recoltee: number;
  quantite_vendue: number;
  quantite_en_stock: number;
  valeur_totale: number;
}
