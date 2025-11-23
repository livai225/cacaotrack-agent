/**
 * Service de gestion des organisations
 * Gère le CRUD et la synchronisation des organisations
 */

import type { 
  Organisation, 
  MembreOrganisation,
  Section,
  Village,
  Parcelle,
  Activite,
  Recolte,
  EvaluationQualite,
  Stock,
  Vente,
  Transaction,
  Alerte,
  Rapport,
  OrganisationStats
} from '@/types/organisation';

// Clés pour le localStorage
const STORAGE_KEYS = {
  ORGANISATIONS: 'cacaotrack_organisations',
  MEMBRES: 'cacaotrack_membres_organisations',
  SECTIONS: 'cacaotrack_sections',
  VILLAGES: 'cacaotrack_villages',
  PARCELLES: 'cacaotrack_parcelles',
  ACTIVITES: 'cacaotrack_activites',
  RECOLTES: 'cacaotrack_recoltes',
  EVALUATIONS: 'cacaotrack_evaluations_qualite',
  STOCKS: 'cacaotrack_stocks',
  VENTES: 'cacaotrack_ventes',
  TRANSACTIONS: 'cacaotrack_transactions',
  ALERTES: 'cacaotrack_alertes',
  RAPPORTS: 'cacaotrack_rapports',
};

// Utilitaire pour générer un UUID simple
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ==================== ORGANISATIONS ====================

export const organisationService = {
  /**
   * Récupérer toutes les organisations
   */
  getAll(): Organisation[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORGANISATIONS);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Récupérer une organisation par son ID
   */
  getById(id: string): Organisation | undefined {
    const organisations = this.getAll();
    return organisations.find(org => org.id === id);
  },

  /**
   * Récupérer une organisation par son code
   */
  getByCode(code: string): Organisation | undefined {
    const organisations = this.getAll();
    return organisations.find(org => org.code === code);
  },

  /**
   * Créer une nouvelle organisation
   */
  create(data: Omit<Organisation, 'id' | 'date_creation' | 'date_modification'>): Organisation {
    const now = new Date();
    const organisation: Organisation = {
      ...data,
      id: generateUUID(),
      date_creation: now,
      date_modification: now,
    };

    const organisations = this.getAll();
    organisations.push(organisation);
    localStorage.setItem(STORAGE_KEYS.ORGANISATIONS, JSON.stringify(organisations));

    return organisation;
  },

  /**
   * Mettre à jour une organisation
   */
  update(id: string, data: Partial<Organisation>): Organisation | undefined {
    const organisations = this.getAll();
    const index = organisations.findIndex(org => org.id === id);
    
    if (index === -1) return undefined;

    organisations[index] = {
      ...organisations[index],
      ...data,
      date_modification: new Date(),
    };

    localStorage.setItem(STORAGE_KEYS.ORGANISATIONS, JSON.stringify(organisations));
    return organisations[index];
  },

  /**
   * Supprimer une organisation
   */
  delete(id: string): boolean {
    const organisations = this.getAll();
    const filtered = organisations.filter(org => org.id !== id);
    
    if (filtered.length === organisations.length) return false;

    localStorage.setItem(STORAGE_KEYS.ORGANISATIONS, JSON.stringify(filtered));
    return true;
  },

  /**
   * Rechercher des organisations
   */
  search(query: string): Organisation[] {
    const organisations = this.getAll();
    const lowerQuery = query.toLowerCase();

    return organisations.filter(org =>
      org.nom.toLowerCase().includes(lowerQuery) ||
      org.code.toLowerCase().includes(lowerQuery) ||
      org.region.toLowerCase().includes(lowerQuery) ||
      org.departement.toLowerCase().includes(lowerQuery) ||
      org.localite.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Obtenir les statistiques d'une organisation
   */
  getStats(id: string): OrganisationStats | undefined {
    const organisation = this.getById(id);
    if (!organisation) return undefined;

    const sections = sectionService.getByOrganisation(id);
    const villages = villageService.getByOrganisation(id);
    const parcelles = parcelleService.getByOrganisation(id);

    const superficie_totale = parcelles.reduce((sum, p) => sum + p.superficie, 0);
    const recoltes = recolteService.getByOrganisation(id);
    const production_totale = recoltes.reduce((sum, r) => sum + r.quantite, 0);
    const ventes = venteService.getByOrganisation(id);
    const chiffre_affaires = ventes.reduce((sum, v) => sum + v.prix_total, 0);

    return {
      id_organisation: id,
      nombre_sections: sections.length,
      nombre_villages: villages.length,
      nombre_producteurs: 0, // À calculer depuis les membres
      nombre_parcelles: parcelles.length,
      superficie_totale,
      production_totale,
      chiffre_affaires,
    };
  },
};

// ==================== MEMBRES ORGANISATIONS ====================

export const membreOrganisationService = {
  getAll(): MembreOrganisation[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEMBRES);
    return data ? JSON.parse(data) : [];
  },

  getByOrganisation(orgId: string): MembreOrganisation[] {
    return this.getAll().filter(m => m.id_organisation === orgId);
  },

  create(data: Omit<MembreOrganisation, 'id' | 'date_creation' | 'date_modification'>): MembreOrganisation {
    const now = new Date();
    const membre: MembreOrganisation = {
      ...data,
      id: generateUUID(),
      date_creation: now,
      date_modification: now,
    };

    const membres = this.getAll();
    membres.push(membre);
    localStorage.setItem(STORAGE_KEYS.MEMBRES, JSON.stringify(membres));

    return membre;
  },

  update(id: string, data: Partial<MembreOrganisation>): MembreOrganisation | undefined {
    const membres = this.getAll();
    const index = membres.findIndex(m => m.id === id);
    
    if (index === -1) return undefined;

    membres[index] = {
      ...membres[index],
      ...data,
      date_modification: new Date(),
    };

    localStorage.setItem(STORAGE_KEYS.MEMBRES, JSON.stringify(membres));
    return membres[index];
  },

  delete(id: string): boolean {
    const membres = this.getAll();
    const filtered = membres.filter(m => m.id !== id);
    
    if (filtered.length === membres.length) return false;

    localStorage.setItem(STORAGE_KEYS.MEMBRES, JSON.stringify(filtered));
    return true;
  },
};

// ==================== SECTIONS ====================

export const sectionService = {
  getAll(): Section[] {
    const data = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    return data ? JSON.parse(data) : [];
  },

  getByOrganisation(orgId: string): Section[] {
    return this.getAll().filter(s => s.id_organisation === orgId);
  },

  create(data: Omit<Section, 'id' | 'date_creation' | 'date_modification'>): Section {
    const now = new Date();
    const section: Section = {
      ...data,
      id: generateUUID(),
      date_creation: now,
      date_modification: now,
    };

    const sections = this.getAll();
    sections.push(section);
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));

    return section;
  },

  update(id: string, data: Partial<Section>): Section | undefined {
    const sections = this.getAll();
    const index = sections.findIndex(s => s.id === id);
    
    if (index === -1) return undefined;

    sections[index] = {
      ...sections[index],
      ...data,
      date_modification: new Date(),
    };

    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    return sections[index];
  },

  delete(id: string): boolean {
    const sections = this.getAll();
    const filtered = sections.filter(s => s.id !== id);
    
    if (filtered.length === sections.length) return false;

    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    return true;
  },
};

// ==================== VILLAGES ====================

export const villageService = {
  getAll(): Village[] {
    const data = localStorage.getItem(STORAGE_KEYS.VILLAGES);
    return data ? JSON.parse(data) : [];
  },

  getByOrganisation(orgId: string): Village[] {
    return this.getAll().filter(v => v.id_organisation === orgId);
  },

  getBySection(sectionId: string): Village[] {
    return this.getAll().filter(v => v.id_section === sectionId);
  },

  create(data: Omit<Village, 'id' | 'date_creation' | 'date_modification'>): Village {
    const now = new Date();
    const village: Village = {
      ...data,
      id: generateUUID(),
      date_creation: now,
      date_modification: now,
    };

    const villages = this.getAll();
    villages.push(village);
    localStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(villages));

    return village;
  },

  update(id: string, data: Partial<Village>): Village | undefined {
    const villages = this.getAll();
    const index = villages.findIndex(v => v.id === id);
    
    if (index === -1) return undefined;

    villages[index] = {
      ...villages[index],
      ...data,
      date_modification: new Date(),
    };

    localStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(villages));
    return villages[index];
  },

  delete(id: string): boolean {
    const villages = this.getAll();
    const filtered = villages.filter(v => v.id !== id);
    
    if (filtered.length === villages.length) return false;

    localStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(filtered));
    return true;
  },
};

// ==================== PARCELLES ====================

export const parcelleService = {
  getAll(): Parcelle[] {
    const data = localStorage.getItem(STORAGE_KEYS.PARCELLES);
    return data ? JSON.parse(data) : [];
  },

  getByOrganisation(orgId: string): Parcelle[] {
    return this.getAll().filter(p => p.id_organisation === orgId);
  },

  getByProducteur(producteurId: string): Parcelle[] {
    return this.getAll().filter(p => p.id_producteur === producteurId);
  },

  create(data: Omit<Parcelle, 'id' | 'date_creation' | 'date_modification'>): Parcelle {
    const now = new Date();
    const parcelle: Parcelle = {
      ...data,
      id: generateUUID(),
      date_creation: now,
      date_modification: now,
    };

    const parcelles = this.getAll();
    parcelles.push(parcelle);
    localStorage.setItem(STORAGE_KEYS.PARCELLES, JSON.stringify(parcelles));

    return parcelle;
  },

  update(id: string, data: Partial<Parcelle>): Parcelle | undefined {
    const parcelles = this.getAll();
    const index = parcelles.findIndex(p => p.id === id);
    
    if (index === -1) return undefined;

    parcelles[index] = {
      ...parcelles[index],
      ...data,
      date_modification: new Date(),
    };

    localStorage.setItem(STORAGE_KEYS.PARCELLES, JSON.stringify(parcelles));
    return parcelles[index];
  },

  delete(id: string): boolean {
    const parcelles = this.getAll();
    const filtered = parcelles.filter(p => p.id !== id);
    
    if (filtered.length === parcelles.length) return false;

    localStorage.setItem(STORAGE_KEYS.PARCELLES, JSON.stringify(filtered));
    return true;
  },
};

// ==================== RÉCOLTES ====================

export const recolteService = {
  getAll(): Recolte[] {
    const data = localStorage.getItem(STORAGE_KEYS.RECOLTES);
    return data ? JSON.parse(data) : [];
  },

  getByOrganisation(orgId: string): Recolte[] {
    return this.getAll().filter(r => r.id_organisation === orgId);
  },

  create(data: Omit<Recolte, 'id' | 'date_creation' | 'date_modification'>): Recolte {
    const now = new Date();
    const recolte: Recolte = {
      ...data,
      id: generateUUID(),
      date_creation: now,
      date_modification: now,
    };

    const recoltes = this.getAll();
    recoltes.push(recolte);
    localStorage.setItem(STORAGE_KEYS.RECOLTES, JSON.stringify(recoltes));

    return recolte;
  },

  update(id: string, data: Partial<Recolte>): Recolte | undefined {
    const recoltes = this.getAll();
    const index = recoltes.findIndex(r => r.id === id);
    
    if (index === -1) return undefined;

    recoltes[index] = {
      ...recoltes[index],
      ...data,
      date_modification: new Date(),
    };

    localStorage.setItem(STORAGE_KEYS.RECOLTES, JSON.stringify(recoltes));
    return recoltes[index];
  },

  delete(id: string): boolean {
    const recoltes = this.getAll();
    const filtered = recoltes.filter(r => r.id !== id);
    
    if (filtered.length === recoltes.length) return false;

    localStorage.setItem(STORAGE_KEYS.RECOLTES, JSON.stringify(filtered));
    return true;
  },
};

// ==================== VENTES ====================

export const venteService = {
  getAll(): Vente[] {
    const data = localStorage.getItem(STORAGE_KEYS.VENTES);
    return data ? JSON.parse(data) : [];
  },

  getByOrganisation(orgId: string): Vente[] {
    return this.getAll().filter(v => v.id_organisation === orgId);
  },

  create(data: Omit<Vente, 'id' | 'date_creation' | 'date_modification'>): Vente {
    const now = new Date();
    const vente: Vente = {
      ...data,
      id: generateUUID(),
      date_creation: now,
      date_modification: now,
    };

    const ventes = this.getAll();
    ventes.push(vente);
    localStorage.setItem(STORAGE_KEYS.VENTES, JSON.stringify(ventes));

    return vente;
  },

  update(id: string, data: Partial<Vente>): Vente | undefined {
    const ventes = this.getAll();
    const index = ventes.findIndex(v => v.id === id);
    
    if (index === -1) return undefined;

    ventes[index] = {
      ...ventes[index],
      ...data,
      date_modification: new Date(),
    };

    localStorage.setItem(STORAGE_KEYS.VENTES, JSON.stringify(ventes));
    return ventes[index];
  },

  delete(id: string): boolean {
    const ventes = this.getAll();
    const filtered = ventes.filter(v => v.id !== id);
    
    if (filtered.length === ventes.length) return false;

    localStorage.setItem(STORAGE_KEYS.VENTES, JSON.stringify(filtered));
    return true;
  },
};

// Exporter tous les services
export default {
  organisationService,
  membreOrganisationService,
  sectionService,
  villageService,
  parcelleService,
  recolteService,
  venteService,
};
