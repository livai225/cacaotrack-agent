import { Organisation, Section, Village, Producteur, Parcelle, Operation } from "@/types/organisation";

const API_URL = import.meta.env.VITE_API_URL || "/api";

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
  createOrganisation: async (data: any): Promise<Organisation> => {
    const res = await fetch(`${API_URL}/organisations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(errorData.error || errorData.message || "Erreur création organisation");
    }
    return res.json();
  },
  updateOrganisation: async (id: string, data: any): Promise<Organisation> => {
    const res = await fetch(`${API_URL}/organisations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur mise à jour organisation");
    return res.json();
  },
  deleteOrganisation: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/organisations/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression organisation");
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
  createSection: async (data: any): Promise<Section> => {
    const res = await fetch(`${API_URL}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(errorData.error || errorData.message || "Erreur création section");
    }
    return res.json();
  },
  updateSection: async (id: string, data: any): Promise<Section> => {
    const res = await fetch(`${API_URL}/sections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur mise à jour section");
    return res.json();
  },
  deleteSection: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/sections/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression section");
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
  createVillage: async (data: any): Promise<Village> => {
    const res = await fetch(`${API_URL}/villages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(errorData.error || errorData.message || "Erreur création village");
    }
    return res.json();
  },
  updateVillage: async (id: string, data: any): Promise<Village> => {
    const res = await fetch(`${API_URL}/villages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur mise à jour village");
    return res.json();
  },
  deleteVillage: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/villages/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression village");
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
  createProducteur: async (data: any): Promise<Producteur> => {
    const res = await fetch(`${API_URL}/producteurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(errorData.error || errorData.message || "Erreur création producteur");
    }
    return res.json();
  },
  updateProducteur: async (id: string, data: any): Promise<Producteur> => {
    const res = await fetch(`${API_URL}/producteurs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur mise à jour producteur");
    return res.json();
  },
  deleteProducteur: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/producteurs/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression producteur");
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
  createParcelle: async (data: any): Promise<Parcelle> => {
    const res = await fetch(`${API_URL}/parcelles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(errorData.error || errorData.message || "Erreur création parcelle");
    }
    return res.json();
  },
  updateParcelle: async (id: string, data: any): Promise<Parcelle> => {
    const res = await fetch(`${API_URL}/parcelles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur mise à jour parcelle");
    return res.json();
  },
  deleteParcelle: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/parcelles/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression parcelle");
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
  createOperation: async (data: any): Promise<Operation> => {
    try {
      console.log('📤 Envoi des données:', data);
      const res = await fetch(`${API_URL}/operations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Erreur inconnue" }));
        console.error('❌ Erreur API:', errorData);
        throw new Error(errorData.error || errorData.message || "Erreur création operation");
      }

      const result = await res.json();
      console.log('✅ Opération créée:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Erreur dans createOperation:', error);
      throw error;
    }
  },
  deleteOperation: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/operations/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression opération");
  },
  // Agents
  getAgents: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/agents`);
    if (!res.ok) throw new Error("Erreur chargement agents");
    return res.json();
  },
  deleteAgent: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/agents/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression agent");
  },
};
