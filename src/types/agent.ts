// Types pour le module Agent/User

/**
 * Région de Côte d'Ivoire
 */
export interface Region {
  id: string;
  code: string;
  nom: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Agent de collecte
 */
export interface Agent {
  id: string;
  code: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  
  // Identité
  date_naissance?: Date;
  lieu_naissance?: string;
  nationalite?: string;
  type_piece?: string;
  numero_piece?: string;
  photo?: string;
  
  // Relations
  regions?: AgentRegion[];
  operations?: any[];
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Affectation Agent-Région
 */
export interface AgentRegion {
  id: string;
  id_agent: string;
  id_region: string;
  agent?: Agent;
  region?: Region;
  date_affectation: Date;
  date_fin?: Date;
  statut: 'actif' | 'inactif';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Statistiques d'un agent
 */
export interface AgentStats {
  id_agent: string;
  nom_complet: string;
  nb_operations: number;
  nb_operations_mois: number;
  poids_total: number;
  poids_mois: number;
  regions: string[];
  dernier_operation?: Date;
}

/**
 * Données de formulaire
 */
export type AgentFormData = Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'regions' | 'operations'> & {
  regions: string[]; // IDs des régions
};

export type RegionFormData = Omit<Region, 'id' | 'createdAt' | 'updatedAt'>;

