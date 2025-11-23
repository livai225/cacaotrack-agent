import { Organisation, Section, Village, Producteur, Parcelle, Operation } from "@/types/organisation";

const API_URL = "http://localhost:3000/api";

export const api = {
  // Organisations
  getOrganisations: async (): Promise<Organisation[]> => {
    const res = await fetch(`${API_URL}/organisations`);
    if (!res.ok) throw new Error("Erreur chargement organisations");
    return res.json();
  },
  getOrganisation: async (id: string): Promise<Organisation> => {
    const res = await fetch(`${API_URL}/organisations/${id}`);
    if (!res.ok) throw new Error("Erreur chargement organisation");
    return res.json();
  },

  // Sections
  getSections: async (): Promise<Section[]> => {
    const res = await fetch(`${API_URL}/sections`);
    if (!res.ok) throw new Error("Erreur chargement sections");
    return res.json();
  },
  getSection: async (id: string): Promise<Section> => {
    const res = await fetch(`${API_URL}/sections/${id}`);
    if (!res.ok) throw new Error("Erreur chargement section");
    return res.json();
  },

  // Villages
  getVillages: async (): Promise<Village[]> => {
    const res = await fetch(`${API_URL}/villages`);
    if (!res.ok) throw new Error("Erreur chargement villages");
    return res.json();
  },
  getVillage: async (id: string): Promise<Village> => {
    const res = await fetch(`${API_URL}/villages/${id}`);
    if (!res.ok) throw new Error("Erreur chargement village");
    return res.json();
  },

  // Producteurs
  getProducteurs: async (): Promise<Producteur[]> => {
    const res = await fetch(`${API_URL}/producteurs`);
    if (!res.ok) throw new Error("Erreur chargement producteurs");
    return res.json();
  },
  getProducteur: async (id: string): Promise<Producteur> => {
    const res = await fetch(`${API_URL}/producteurs/${id}`);
    if (!res.ok) throw new Error("Erreur chargement producteur");
    return res.json();
  },

  // Parcelles
  getParcelles: async (): Promise<Parcelle[]> => {
    const res = await fetch(`${API_URL}/parcelles`);
    if (!res.ok) throw new Error("Erreur chargement parcelles");
    return res.json();
  },
  getParcelle: async (id: string): Promise<Parcelle> => {
    const res = await fetch(`${API_URL}/parcelles/${id}`);
    if (!res.ok) throw new Error("Erreur chargement parcelle");
    return res.json();
  },

  // Operations
  getOperations: async (): Promise<Operation[]> => {
    const res = await fetch(`${API_URL}/operations`);
    if (!res.ok) throw new Error("Erreur chargement operations");
    return res.json();
  },
  getOperation: async (id: string): Promise<Operation> => {
    const res = await fetch(`${API_URL}/operations/${id}`);
    if (!res.ok) throw new Error("Erreur chargement operation");
    return res.json();
  },
};
