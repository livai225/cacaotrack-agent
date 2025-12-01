import { Agent, Region, AgentRegion, AgentStats } from "@/types/agent";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const agentService = {
  // ==================== AGENTS ====================

  getAgents: async (): Promise<Agent[]> => {
    const res = await fetch(`${API_URL}/agents`);
    if (!res.ok) throw new Error("Erreur chargement agents");
    return res.json();
  },

  getAgent: async (id: string): Promise<Agent> => {
    const res = await fetch(`${API_URL}/agents/${id}`);
    if (!res.ok) throw new Error("Erreur chargement agent");
    return res.json();
  },

  createAgent: async (data: any): Promise<Agent> => {
    const res = await fetch(`${API_URL}/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erreur création agent");
    }
    return res.json();
  },

  updateAgent: async (id: string, data: any): Promise<Agent> => {
    const res = await fetch(`${API_URL}/agents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur mise à jour agent");
    return res.json();
  },

  deleteAgent: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/agents/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Erreur suppression agent");
  },

  getAgentStats: async (id: string): Promise<AgentStats> => {
    const res = await fetch(`${API_URL}/agents/${id}/stats`);
    if (!res.ok) throw new Error("Erreur chargement statistiques");
    return res.json();
  },

  // ==================== RÉGIONS ====================

  getRegions: async (): Promise<Region[]> => {
    const res = await fetch(`${API_URL}/regions`);
    if (!res.ok) throw new Error("Erreur chargement régions");
    return res.json();
  },

  getRegion: async (id: string): Promise<Region> => {
    const res = await fetch(`${API_URL}/regions/${id}`);
    if (!res.ok) throw new Error("Erreur chargement région");
    return res.json();
  },

  createRegion: async (data: any): Promise<Region> => {
    const res = await fetch(`${API_URL}/regions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur création région");
    return res.json();
  },

  // ==================== AFFECTATIONS ====================

  affecterAgentRegion: async (idAgent: string, idRegion: string): Promise<AgentRegion> => {
    const res = await fetch(`${API_URL}/agents/${idAgent}/regions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_region: idRegion })
    });
    if (!res.ok) throw new Error("Erreur affectation");
    return res.json();
  },

  retirerAgentRegion: async (idAgent: string, idRegion: string): Promise<void> => {
    const res = await fetch(`${API_URL}/agents/${idAgent}/regions/${idRegion}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Erreur retrait affectation");
  },

  getAgentsByRegion: async (idRegion: string): Promise<Agent[]> => {
    const res = await fetch(`${API_URL}/regions/${idRegion}/agents`);
    if (!res.ok) throw new Error("Erreur chargement agents région");
    return res.json();
  },
};

